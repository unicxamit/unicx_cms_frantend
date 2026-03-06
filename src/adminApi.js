// api.js
import axios from "axios";
import {
  safeGetItem,
  safeKeysWithPrefix,
  safeRemoveItem,
  safeSetItem,
  storageAvailable,
} from "./utils/safeStorage";

const normalizeSpecialSpaces = (value) => value.replace(/[\u00A0\u2007\u202F]/g, " ");

const looksLikeHtml = (value) => /<\/?[a-z][^>]*>/i.test(value);
const looksLikeUrl = (value) =>
  /^(https?:\/\/|ftp:\/\/|blob:|data:|\/\/)/i.test(String(value || "").trim());

const normalizePlainText = (value) =>
  value
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,.;:!?])([^\s\d])/g, "$1 $2")
    .replace(/(\d)\s+(px|em|rem|%|vh|vw|pt|cm|mm|in|kg|g|mg|km|m|ms|s)\b/gi, "$1$2")
    .replace(/([A-Za-z0-9._%+-])\s*@\s*([A-Za-z0-9.-]+)\s*\.\s*([A-Za-z]{2,})/g, "$1@$2.$3")
    .trim();

const normalizeBackendString = (value) => {
  const normalized = normalizeSpecialSpaces(value);
  if (looksLikeUrl(normalized)) {
    return normalized.trim();
  }
  if (looksLikeHtml(normalized)) {
    return normalized.trim();
  }
  return normalizePlainText(normalized);
};

const sanitizeBackendPayload = (value) => {
  if (typeof value === "string") {
    return normalizeBackendString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeBackendPayload);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, sanitizeBackendPayload(nestedValue)])
    );
  }

  return value;
};

const DEFAULT_DEPLOYED_API_BASE_URL =
  "https://webcmsbackend-production.up.railway.app/api/v1";
// "http://localhost:6001/api/v1";

const resolveApiBaseUrl = () => {
  return DEFAULT_DEPLOYED_API_BASE_URL;
};

const api = axios.create({
  // Change this baseURL to your backend server URL.
  baseURL: resolveApiBaseUrl(),
});

const BLOG_DETAILS_FALLBACK_BASES = [DEFAULT_DEPLOYED_API_BASE_URL];

const isCannotPostRouteError = (error) => {
  const status = error?.response?.status;
  const body = String(error?.response?.data || "");
  return status === 404 && /Cannot POST\s+\/api\/v1\/blog\/create-blogs-details/i.test(body);
};

const API_GET_CACHE_PREFIX = "api_get_cache_v1:";
const API_GET_CACHE_TTL_MS = 60 * 1000;
const API_PUBLIC_GET_CACHE_TTL_MS = 0;
const apiGetMemoryCache = new Map();
const apiGetInFlightCache = new Map();

const canUseStorage = () => storageAvailable();

const isPublicApiPath = (url) => typeof url === "string" && url.startsWith("/public/");
const shouldUsePersistentCache = (url) => !isPublicApiPath(url);

const getGetCacheTtlMs = (url) =>
  isPublicApiPath(url) ? API_PUBLIC_GET_CACHE_TTL_MS : API_GET_CACHE_TTL_MS;

const buildGetCacheKey = (url, config) => {
  const params = config?.params || null;
  const tokenFragment = canUseStorage()
    ? (safeGetItem("adminToken") || "").slice(0, 16)
    : "";
  return `${API_GET_CACHE_PREFIX}${JSON.stringify({
    baseURL: api.defaults.baseURL || "",
    url,
    params,
    tokenFragment,
  })}`;
};

const readPersistentGetCache = (cacheKey) => {
  if (!canUseStorage()) return null;
  try {
    const raw = safeGetItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.expiresAt || Date.now() > parsed.expiresAt) {
      safeRemoveItem(cacheKey);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const writePersistentGetCache = (cacheKey, responseData, ttlMs) => {
  if (!canUseStorage()) return;
  try {
    safeSetItem(
      cacheKey,
      JSON.stringify({
        expiresAt: Date.now() + ttlMs,
        data: responseData,
      }),
    );
  } catch {
    // Ignore storage errors silently.
  }
};

const clearAllGetCaches = () => {
  apiGetMemoryCache.clear();
  apiGetInFlightCache.clear();
  if (!canUseStorage()) return;
  try {
    safeKeysWithPrefix(API_GET_CACHE_PREFIX).forEach((key) => safeRemoveItem(key));
  } catch {
    // Ignore storage cleanup errors.
  }
};

api.interceptors.request.use(
  (config) => {
    const token = safeGetItem("adminToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response?.data !== undefined) {
      response.data = sanitizeBackendPayload(response.data);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const method = response?.config?.method?.toLowerCase();
    if (method && ["post", "put", "patch", "delete"].includes(method)) {
      clearAllGetCaches();
    }
    return response;
  },
  (error) => Promise.reject(error)
);

const originalApiGet = api.get.bind(api);
api.get = async (url, config = {}) => {
  const method = config?.method?.toLowerCase();
  const skipCache =
    config?.cache === false ||
    method === "head" ||
    isPublicApiPath(url);
  const persistentCacheEnabled = shouldUsePersistentCache(url);
  const noCacheConfig = {
    ...(config || {}),
    params: {
      ...(config?.params || {}),
      _ts: Date.now(),
    },
    headers: {
      ...(config?.headers || {}),
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  };

  if (skipCache) {
    return originalApiGet(url, noCacheConfig);
  }

  const cacheKey = buildGetCacheKey(url, config);
  const ttlMs = getGetCacheTtlMs(url);
  const now = Date.now();

  const memoryHit = apiGetMemoryCache.get(cacheKey);
  if (memoryHit && now < memoryHit.expiresAt) {
    return memoryHit.response;
  }

  if (persistentCacheEnabled) {
    const persistentHit = readPersistentGetCache(cacheKey);
    if (persistentHit) {
      const cachedResponse = {
        data: persistentHit.data,
        status: 200,
        statusText: "OK",
        headers: {},
        config: { ...(config || {}), url, method: "get" },
        request: null,
      };
      apiGetMemoryCache.set(cacheKey, {
        expiresAt: persistentHit.expiresAt,
        response: cachedResponse,
      });
      return cachedResponse;
    }
  }

  const inFlight = apiGetInFlightCache.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const requestPromise = originalApiGet(url, noCacheConfig)
    .then((response) => {
      const expiresAt = Date.now() + ttlMs;
      apiGetMemoryCache.set(cacheKey, { expiresAt, response });
      if (persistentCacheEnabled) {
        writePersistentGetCache(cacheKey, response.data, ttlMs);
      }
      return response;
    })
    .finally(() => {
      apiGetInFlightCache.delete(cacheKey);
    });

  apiGetInFlightCache.set(cacheKey, requestPromise);
  return requestPromise;
};
// contact-us form API Call

export const addContactForm = async (data) => {
  try {
    const response = await api.post("/category/add-contactus", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response, "contactuscreate response");
    return response.data;
  } catch (error) {
    console.error("API Error adding category:", error.response || error);
    throw error;
  }
};

// udateIndemand status
// footerdetailstatus change
export const updateIndemandStatus = async (id, Insrstatus) => {
  try {
    const response = await api.patch(`/service/update/indemand/status/${id}`, {
      Insrstatus,
    });

    console.log(response, "update-indemand-status")
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};

// updateSearch Tage

export const updateSearchTageStatus = async (id, stagestatus) => {
  try {
    const response = await api.patch(`/service/update/searchtage/status/${id}`, {
      stagestatus,
    });

    // console.log(response,"update-searchtage-status")
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};
// getformdata
export const getContactForm = async () => {
  try {
    const response = await api.get("/category/get-formdata");
    // console.log(response, "response categorydata");
    return response.data; // 👈 returns backend JSON
  } catch (error) {
    console.error("API Error fetching categories:", error);
    throw error;
  }
};
// deleteformdata
export const deleteFormData = async (id) => {
  try {
    const response = await api.delete(`/category/delete-formdata/${id}`);
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};
// add socialLinks
export const addSocialLink = async (data) => {
  try {
    const response = await api.post("/category/add-socialLinks", data);
    console.log(response, "socialLiksscreate response");
    return response.data;
  } catch (error) {
    console.error("API Error adding category:", error.response || error);
    throw error;
  }
};
// add footerdetails
export const addFooterDetail = async (data) => {
  try {
    const response = await api.post("/category/add-footerdetails", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response, "footerderail response");
    return response.data;
  } catch (error) {
    console.error("API Error adding category:", error.response || error);
    throw error;
  }
};

// footerdetailstatus change
export const updateFooterDetailStatus = async (id, status) => {
  try {
    const response = await api.patch(`/category/update/footerdetails/status/${id}`, {
      status,
    });

    // console.log(response,"update-status")
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};

// footerdetailstatus change
export const updateSocialLinkStatus = async (id, socialLinkstatus) => {
  try {
    const response = await api.patch(`/category/update/sociallink/status/${id}`, {
      socialLinkstatus,
    });
    console.log(response, "update-status")
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};

// getFooterDetails
export const getFooterDetails = async () => {
  try {
    const response = await api.get("/category/get-footerdetails");
    // console.log(response, "response categorydata");
    return response.data; // 👈 returns backend JSON
  } catch (error) {
    console.error("API Error fetching categories:", error);
    throw error;
  }
};

// getSocialLInks
export const getSocialLinks = async () => {
  try {
    const response = await api.get("/category/get-socialLinks");
    // console.log(response, "response categorydata");
    return response.data; // 👈 returns backend JSON
  } catch (error) {
    console.error("API Error fetching categories:", error);
    throw error;
  }
};

// updateFooterdetails
export const updateFooterDetail = async (id, data) => {
  try {

    const response = await api.put(
      `/category/update-footerdetails/${id}`,
      data, {
      headers: {
        "Content-Type": "application/json",
      },
    }

    );
    console.log(response, "update topcompany")
    return response.data;
  } catch (err) {
    console.error("Update Error:", err.response?.data || err);
    throw err;
  }
};

// updateSocialLink
export const updateSocialLink = async (id, data) => {
  try {

    const response = await api.put(
      `/category/update-socialLinks/${id}`,
      data
    );
    console.log(response, "update topcompany")
    return response.data;
  } catch (err) {
    console.error("Update Error:", err.response?.data || err);
    throw err;
  }
};

// deleteFooterdetails
export const deleteFooterDetail = async (id) => {
  try {
    const response = await api.delete(`/category/delete-footerdetails/${id}`);
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};

// deleteSocialLink
export const deleteSocialLink = async (id) => {
  try {
    const response = await api.delete(`/category/delete-socialLinks/${id}`);
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};
// addTestimonial
export const addTestimonial = async (data) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.post(
      "/faq/add-testimonial",
      data,
      isFormData
        ? {}
        : {
          headers: {
            "Content-Type": "application/json",
          },
        }
    );
    console.log(response, "contactuscreate response");
    return response.data;
  } catch (error) {
    console.error("API Error adding category:", error.response || error);
    throw error;
  }
};
// getTestimonial
export const getTestimonial = async () => {
  try {
    const response = await api.get("/faq/get-testimonial");
    console.log(response, "response testimonial data");
    return response.data; // 👈 returns backend JSON
  } catch (error) {
    console.error("API Error fetching categories:", error);
    throw error;
  }
};

// updateTestimonialstatus
export const updateTestimonialStatus = async (id, status) => {
  try {
    const response = await api.patch(`/faq/testimonial/status/${id}`, {
      status,
    });
    // console.log(response,"update-status")
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};
// updateTestimonial
export const updateTestimonial = async (id, data) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.put(
      `/faq/update-testimonial/${id}`,
      data,
      isFormData
        ? {}
        : {
          headers: {
            "Content-Type": "application/json",
          },
        }
    );
    console.log(response, "update topcompany")
    return response.data;
  } catch (err) {
    console.error("Update Error:", err.response?.data || err);
    throw err;
  }
};

// deleteTestimonial
export const deleteTestimonial = async (id) => {
  try {
    const response = await api.delete(`/faq/delete-testimonial/${id}`);
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};
// expertcontact-us form API Call

export const addExpertContactForm = async (data) => {
  try {
    const response = await api.post("/category/add-expert-contactus", data);

    return response.data;
  } catch (error) {
    console.error("API Error adding category:", error.response || error);
    throw error;
  }
};

// sendsubscription email form API Call

export const addSubscriptionForm = async (data) => {
  try {
    const rawEmail =
      typeof data === "string"
        ? data
        : (data?.subsEmail);
    const subsEmail = String(rawEmail).trim().toLowerCase();

    if (!subsEmail) {
      throw new Error("Email is required");
    }

    const response = await api.post(
      "/category/send-subscriptionemail",
      { subsEmail },
      {
        headers: {
          "Content-Type": "application/json",
        },
        // Backend sends 2 emails in same request, so keep higher timeout.
        timeout: 90000,
      }
    );
    console.log(response, "subscription email")
    return response.data;
  } catch (error) {
    if (error?.code === "ECONNABORTED") {
      const timeoutError = new Error("Request timed out while sending email confirmation.");
      timeoutError.code = "ECONNABORTED";
      timeoutError.original = error;
      throw timeoutError;
    }
    console.error("API Error adding category:", error.response || error);
    throw error;
  }
};



// Categories API
export const getCategories = async () => {
  try {
    const response = await api.get("/category/getAllcategory", { cache: false });
    // console.log(response, "response categorydata");
    return response.data; // 👈 returns backend JSON
  } catch (error) {
    console.error("API Error fetching categories:", error);
    throw error;
  }
};

// topCompanys API
export const addTopCompanys = async (data) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.post("/category/add-TopCompanies", data,
      isFormData
        ? {}
        : {
          headers: {
            "Content-Type": "application/json",
          },
        }
    );
    // console.log(response, "subscriptioncreate response");
    return response.data;
  } catch (error) {
    console.error("API Error adding category:", error.response || error);
    throw error;
  }
};
// updatestatus topcompanys
export const updateTopCompanyStatus = async (id, status) => {
  try {
    const response = await api.patch(`/category/update-topcompanystatus/${id}`, {
      status,
    },

    );
    // console.log(response,"update-status")
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};
// updatetopcompany
export const updateTopCompany = async (id, data) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/category/update-TopCompany/${id}`, data, isFormData
      ? {}
      : {
        headers: {
          "Content-Type": "application/json",
        },
      });
    console.log(response, "update topcompany")
    return response.data;
  } catch (err) {
    console.error("Update Error:", err.response?.data || err);
    throw err;
  }
};
// topcompanys  API
export const getTopCompanys = async () => {
  try {
    const response = await api.get("/category/get-topcompnays");
    console.log(response, "response topcompany data");
    return response.data; // 👈 returns backend JSON
  } catch (error) {
    console.error("API Error fetching categories:", error);
    throw error;
  }
};

// delete topcompany
export const deleteTopCompany = async (id) => {
  try {
    const response = await api.delete(`/category/delete-topcompany/${id}`);
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};

export const addCategory = async (data) => {
  try {
    const response = await api.post("/category/create-category", data);
    // console.log(response, "categorycreate response");
    return response.data;
  } catch (error) {
    console.error("API Error adding category:", error.response || error);
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`/category/update-category/${id}`, data);

    return response.data;
  } catch (err) {
    console.error("Update Error:", err.response?.data || err);
    throw err;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/category/delete-category/${id}`);
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};

// update status
export const updateCategoryStatus = async (id, status) => {
  try {
    const response = await api.patch(`/category/update-status/${id}`, {
      status,
    });
    return response.data;
  } catch (err) {
    console.error("Delete Error:", err.response?.data || err);
    throw err;
  }
};

// Subcategories API
export const addSubCategory = async (data) => {
  try {
    const response = await api.post("/subcategory/create-subCategory", data);
    // console.log(response, "create subcategory");
    return response.data;
  } catch (error) {
    console.error("API Error adding subcategory:", error.response || error);
    throw error;
  }
};

// serviceDetails
export const addServiceDetails = async (data) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.post(
      "/servicedetails/create-service-details",
      data,
      isFormData
        ? {}
        : {
          headers: {
            "Content-Type": "application/json",
          },
        }
    );
    console.log(response, "create servicedetails");
    return response.data;
  } catch (error) {
    console.error("API Error adding subcategory:", error.response || error);
    throw error;
  }
};
// get serviceDetailsByserviceId
export const getServiceDetailsByserviceId = async (serviceId) => {
  try {
    const response = await api.get(`/servicedetails/by-service/${serviceId}`);
    // console.log(response, "get servicedetailshjlopj");
    return response.data;
  } catch (error) {
    console.error("API Error adding subcategory:", error.response || error);
    throw error;
  }
};
// updateservicedetailsById
export const updateServiceDetails = async (serviceId, data) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await api.put(
      `/servicedetails/updateService_detailsById/${serviceId}`,
      data,
      isFormData
        ? {}
        : {
          headers: {
            "Content-Type": "application/json",
          },
        }
    );
    console.log(response, "update service details ");
    return response.data;
  } catch (error) {
    console.error("API Error adding subcategory:", error.response || error);
    throw error;
  }
};
export const updateSubCategorystatus = async (id, status) => {
  try {
    const response = await api.patch(`/subcategory/subcategory/status/${id}`, {
      status,
    });
    // console.log(response,"status updated")
    return response.data;
  } catch (error) {
    console.error("API Error adding subcategory:", error.response || error);
    throw error;
  }
};
export const getSubCategories = async () => {
  try {
    const response = await api.get("/subcategory/getAllSubcategory", { cache: false });
    // console.log(response, "getsubcategory");
    return response.data;
  } catch (error) {
    console.error("API Error fetching subcategories:", error);
    throw error;
  }
};
export const getSubCategoriesByCategoryId = async (catgoryId) => {

  try {
    const response = await api.get(`/subcategory/getSubCategory/category/${catgoryId}`);
    // console.log(response, "getsubcategory By category Id");
    return response.data;
  } catch (error) {
    console.error("API Error fetching subcategories:", error);
    throw error;
  }
};
export const getserviceBysubCategoryId = async (subcategoryId) => {

  try {
    const response = await api.get(`/service/getservice/${subcategoryId}`);
    console.log(response, "getserviceBy subcategory by");
    return response.data;
  } catch (error) {
    console.error("API Error fetching subcategories:", error);
    throw error;
  }
};
// updatecategory order_index 
export const updateCategoryOrder_index = async (payload) => {
  try {
    console.log("Sending payload 👉", payload);

    const response = await api.put(
      "/category/reorder/category",     // ✅ URL
      {
        categories: payload,       // ✅ BODY
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("update order response", response.data);
    return response.data;
  } catch (err) {
    console.error(
      "Update Error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// subCategory orderIndex
export const updateSubCategoryOrder_index = async (payload) => {
  try {
    console.log("Sending payload 👉", payload);

    const response = await api.put(
      "/subcategory/reorder/subcategory",
      {
        items: payload,       // ✅ BODY
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("update order response", response.data);
    return response.data;
  } catch (err) {
    console.error(
      "Update Error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// service order index
export const updateserviceOrder_index = async (payload) => {
  try {
    console.log("Sending payload 👉", payload);

    const response = await api.put(
      "/service/reorder/service",     // ✅ URL
      {
        items: payload,       // ✅ BODY
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("update order response", response.data);
    return response.data;
  } catch (err) {
    console.error(
      "Update Error:",
      err.response?.data || err.message
    );
    throw err;
  }
};
export const updateSubCategory = async (id, data) => {
  try {
    const response = await api.put(
      `/subcategory/update-subcategory/${id}`,
      data
    );
    console.log(response, "update subcategory");
    return response.data;
  } catch (error) {
    console.error("API Error updating subcategory:", error.response || error);
    throw error;
  }
};

export const deleteSubCategory = async (id) => {
  try {
    const response = await api.delete(`/subcategory/delete-subcategory/${id}`);
    // console.log(response,"responsde daa elel")
    return response.data;
  } catch (error) {
    console.error("API Error deleting subcategory:", error.response || error);
    throw error;
  }
};

// Users API
export const getUsers = async () => {
  try {
    const response = await api.get("/auth/find-all");

    return response.data;
  } catch (error) {
    console.error("API Error fetching users:", error);
    throw error;
  }
};

// Sub-Sub-Categories API
export const getSubSubCategories = async () => {
  try {
    const response = await api.get("/service/getAllServices", { cache: false });
    // console.log(response, "category servuce response data");
    return response.data;
  } catch (error) {
    console.error("API Error fetching sub-sub-categories:", error);
    throw error;
  }
};

export const addServices = async (data) => {
  try {
    const response = await api.post("/service/add-service", data,
      {
        headers: {
          // "Content-Type": "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response, "addServices  data")
    return response.data;
  } catch (error) {
    console.error(
      "API Error adding sub-sub-category:",
      error.response || error
    );
    throw error;
  }
};

export const updateServices = async (id, data) => {
  try {
    const response = await api.put(`/service/update-service/${id}`, data, {
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
      },
    }); console.log(response, "update respose data")
    return response.data;
  } catch (error) {
    console.error(
      "API Error updating sub-sub-category:",
      error.response || error
    );
    throw error;
  }
};

export const updateServicesStatus = async (id, status) => {
  try {
    const response = await api.patch(`/service/update-status/${id}`, {
      status,
    });
    console.log(response, "respoknse data");
    return response.data;
  } catch (error) {
    console.error(
      "API Error updating sub-sub-category:",
      error.response || error
    );
    throw error;
  }
};
export const deleteServices = async (id) => {
  try {
    const response = await api.delete(`/service/delete-service/${id}`);
    console.log(response, "response data");
    return response.data;
  } catch (error) {
    console.error(
      "API Error deleting sub-sub-category:",
      error.response || error
    );
    throw error;
  }
};

// api.js
export const getServicesById = async (id) => {
  try {
    const response = await api.get(`/service/getserviceById/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error fetching sub-sub-category by ID:", error);
    throw error;
  }
};

// adminApi.js
export const searchItems = async (query) => {
  try {
    const response = await api.get("/service/search", {
      params: {
        query
      },
    });
    console.log(response, "Services earch api")
    return response.data;
  } catch (error) {
    console.error("API Error searching items:", error);
    throw error;
  }
};

export const incrementServiceSearchCount = async (id) => {
  try {
    const response = await api.patch(`/service/increment-search-count/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error incrementing search count:", error);
    throw error;
  }
};



export const getServices = async (id) => {
  try {
    const endpoint = id ? `/service/getAllServices/${id}` : "/service/getAllServices";
    const response = await api.get(endpoint);
    console.log(response, "get subsubcaate");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("API Error logging in:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.get("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("API Error logging out:", error);
    throw error;
  }
};

// Case Study API
export const addCaseStudy = async (data) => {
  try {
    const response = await api.post("/casestudy/create-casestudy", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response, "create case study");
    return response.data;
  } catch (error) {
    console.error("API Error adding case study:", error.response || error);
    throw error;
  }
};

export const getCaseStudies = async () => {
  try {
    const response = await api.get("/casestudy/getAllcasestudy");
    console.log(response, "casestudy studydata");
    return response.data;
  } catch (error) {
    console.error("API Error fetching case studies:", error);
    throw error;
  }
};

export const getCaseStudyById = async (id) => {
  try {
    const response = await api.get(`/casestudy/getcasestudyById/${id}`);
    console.log(response, "single casestudy")
    return response.data;
  } catch (error) {
    console.error("API Error fetching case study by ID:", error);
    throw error;
  }
};

export const updateCaseStudy = async (id, data) => {
  try {
    // For file uploads, change Content-Type to multipart/form-data
    const response = await api.put(`/casestudy/update-casestudy/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response, "update respons data");
    return response.data;
  } catch (error) {
    console.error("API Error updating case study:", error.response || error);
    throw error;
  }
};

// export const updateCaseStudyStatus = async (id, status) => {
//   try {
//     // For file uploads, change Content-Type to multipart/form-data
//     const response = await api.patch(
//       `/casestudy/update-status/${id}`,
//       { status },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     console.log(response, "response data");
//     return response.data;
//   } catch (error) {
//     console.error("API Error updating case study:", error.response || error);
//     throw error;
//   }
// };
export const updateCaseStudyStatus = async (id, status) => {
  try {
    const response = await api.patch(
      `/casestudy/update-status/${id}`,
      { status } // ✅ JSON body
    );

    console.log(response, "response data");
    return response.data;
  } catch (error) {
    console.error("API Error updating case study:", error.response || error);
    throw error;
  }
};

export const deleteCaseStudy = async (id) => {
  try {
    const response = await api.delete(`/casestudy/delete-casestudy/${id}`);
    console.log(response, "deletecase study");
    return response.data;
  } catch (error) {
    console.error("API Error deleting case study:", error.response || error);
    throw error;
  }
};

export const uploadSectionImage = async (imageData) => {
  try {
    const response = await api.post("/upload-section-image", imageData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading section image:", error);
    throw error;
  }
};

const toAbsoluteAssetUrl = (value) => {
  const raw = String(value || "").trim().replace(/\\/g, "/");
  if (!raw) return "";
  if (/^(https?:\/\/|data:|blob:|\/\/)/i.test(raw)) return raw;
  try {
    const origin = new URL(String(api.defaults.baseURL || "")).origin;
    if (!origin) return raw;
    return raw.startsWith("/") ? `${origin}${raw}` : `${origin}/${raw}`;
  } catch {
    return raw;
  }
};

const extractUploadedFilePath = (responseData) => {
  const pickValue = (value) => String(value || "").trim();
  const hasUsableUrl = (value) =>
    /^(https?:\/\/|\/\/|\/)/i.test(value) ||
    /cloudinary/i.test(value) ||
    /\.(jpg|jpeg|png|webp|gif|mp4|webm|mov|mkv)(\?|$)/i.test(value);

  const candidates = [
    responseData?.path,
    responseData?.url,
    responseData?.fileUrl,
    responseData?.location,
    responseData?.image,
    responseData?.video,
    responseData?.secure_url,
    responseData?.imageUrl,
    responseData?.videoUrl,
    responseData?.filePath,
    responseData?.file_path,
    responseData?.data?.path,
    responseData?.data?.url,
    responseData?.data?.fileUrl,
    responseData?.data?.location,
    responseData?.data?.secure_url,
    responseData?.data?.imageUrl,
    responseData?.data?.videoUrl,
    responseData?.data?.filePath,
    responseData?.data?.file_path,
  ];
  const directMatch = candidates
    .map((item) => pickValue(item))
    .find((item) => item && hasUsableUrl(item));
  if (directMatch) return directMatch;

  const queue = [responseData];
  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== "object") continue;
    Object.values(current).forEach((value) => {
      if (value && typeof value === "object") queue.push(value);
      const normalized = pickValue(value);
      if (normalized && hasUsableUrl(normalized)) {
        queue.length = 0;
        candidates.push(normalized);
      }
    });
  }

  return candidates.map((item) => pickValue(item)).find(Boolean) || "";
};

export const uploadEditorMedia = async (file, mediaType = "image", options = {}) => {
  if (!(file instanceof File)) {
    throw new Error("Invalid media file");
  }

  const normalizedType = String(mediaType || "image").toLowerCase() === "video" ? "video" : "image";
  const safeBlogId = String(options?.blogId || "").trim();
  const safeSectionIndex =
    Number.isInteger(options?.sectionIndex) && options.sectionIndex >= 0
      ? String(options.sectionIndex)
      : "";
  const safeFieldKey = String(options?.fieldKey || "").trim();
  const endpoints =
    normalizedType === "video"
      ? ["/blog/upload-editor-video", "/upload-section-video", "/upload-video", "/upload-section-image"]
      : ["/blog/upload-editor-image", "/upload-section-image", "/upload-image"];
  const fieldNames = normalizedType === "video" ? ["video", "file", "image"] : ["image", "file"];

  let lastError = null;
  for (const endpoint of endpoints) {
    for (const fieldName of fieldNames) {
      try {
        const formData = new FormData();
        formData.append(fieldName, file);
        formData.append("mediaType", normalizedType);
        formData.append("source", "blog-editor");
        formData.append("persistInDb", "true");
        if (safeBlogId) formData.append("blogId", safeBlogId);
        if (safeSectionIndex) formData.append("sectionIndex", safeSectionIndex);
        if (safeFieldKey) formData.append("fieldKey", safeFieldKey);
        const response = await api.post(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const uploadedPath = extractUploadedFilePath(response?.data);
        if (!uploadedPath) {
          throw new Error("Upload response missing media path");
        }
        return toAbsoluteAssetUrl(uploadedPath);
      } catch (error) {
        lastError = error;
      }
    }
  }

  throw lastError || new Error("Media upload failed");
};

// NEW FAQ API FUNCTIONS
export const addFAQ = async (data) => {
  try {
    const response = await api.post("/faq/create-faq", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error adding FAQ:", error.response?.data || error);
    throw error;
  }
};

export const getFAQs = async () => {
  try {
    const response = await api.get("/faq/getAllFaq");
    console.log(response, "faq response data");
    return response.data;
  } catch (error) {
    console.error("API Error fetching FAQs:", error);
    throw error;
  }
};

export const getFAQById = async (id) => {
  try {
    const response = await api.get(`/faq/getFaq/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error fetching FAQ by ID:", error);
    throw error;
  }
};

export const updateFAQ = async (id, data) => {
  try {
    const response = await api.put(`/faq/update-faq/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error updating FAQ:", error.response?.data || error);
    throw error;
  }
};

export const updateFAQStatus = async (id, status) => {
  try {
    const response = await api.patch(
      `/faq/update-status/${id}`,
      { status } // ✅ send object
    );
    console.log(response, "updatestatus data");
    return response.data;
  } catch (error) {
    console.error("API Error updating FAQ:", error.response?.data || error);
    throw error;
  }
};

export const deleteFAQ = async (id) => {
  try {
    const response = await api.delete(`/faq/delete-Faq/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error deleting FAQ:", error.response?.data || error);
    throw error;
  }
};

// NEW BLOG API FUNCTIONS
export const addBlog = async (data) => {
  try {
    const response = await api.post("/blog/create-blogs", data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // console.log(response, "create blogs");
    return response.data;
  } catch (error) {
    console.error("API Error adding blog:", error.response?.data || error);
    throw error;
  }
};

export const getBlogs = async () => {
  try {
    const response = await api.get("/blog/getAllBlog");
    // console.log(response, "response blogsdata");/
    return response.data;
  } catch (error) {
    console.error("API Error fetching blogs:", error);
    throw error;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await api.get(`/blog/getBlogById/${id}`);
    // console.log(response,"response single blog  data");
    return response.data;
  } catch (error) {
    console.error("API Error fetching blog by ID:", error);
    throw error;
  }
};

export const addBlogDetails = async (data) => {
  try {
    const response = await api.post("/blog/create-blogs-details", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response, "createblogsdetails");
    return response.data;
  } catch (error) {
    if (isCannotPostRouteError(error)) {
      for (const base of BLOG_DETAILS_FALLBACK_BASES) {
        try {
          const retryResponse = await axios.post(
            `${base}/blog/create-blogs-details`,
            data,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: safeGetItem("adminToken")
                  ? `Bearer ${safeGetItem("adminToken")}`
                  : undefined,
              },
            }
          );
          return retryResponse.data;
        } catch (retryError) {
          // Try next fallback base URL.
        }
      }
    }
    console.error("API Error adding blog details:", error.response?.data || error);
    throw error;
  }
}

export const createCaseStudyDetails = async (data) => {
  try {
    const response = await api.post("/casestudy/create-casestudy-details", data);

    return response.data;
  } catch (error) {
    console.error("API Error creating case study details:", error.response || error);
    throw error;
  }
};

export const getCaseStudyDetails = async (casestudyId) => {
  try {
    const response = await api.get(`/casestudy/get-casestudy-details/${casestudyId}`, {
      cache: false,
    });
    return response.data;
  } catch (error) {
    console.error("API Error fetching case study details:", error.response || error);
    throw error;
  }
};

export const updateCasestudyDetails = async (casestudyId, data) => {
  try {
    const response = await api.put(
      `/casestudy/update-casestudy-details/${casestudyId}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response, "casestudydata");
    return response.data;
  } catch (error) {
    console.error("API Error updating case study details:", error.response || error);
    throw error;
  }
};
export const getBlogDetails = async (blog) => {
  try {
    const response = await api.get(`/blog/get-blog-details/${blog}`, { cache: false });
    // console.log(response,"blogdetails data");
    return response.data;
  } catch (error) {
    console.error("API Error fetching blog details:", error.response?.data || error);
    throw error;
  }
};

export const updateBlogDetails = async (id, data) => {
  try {
    const response = await api.put(`/blog/update-blog-details/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log(response,"blogd")
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const body = String(error?.response?.data || "");
    if (
      status === 404 &&
      new RegExp(`Cannot\\s+(PUT|POST|PATCH)\\s+/api/v1/blog/update-blog-details/${id}`, "i").test(body)
    ) {
      for (const base of BLOG_DETAILS_FALLBACK_BASES) {
        try {
          const retryResponse = await axios.put(
            `${base}/blog/update-blog-details/${id}`,
            data,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: safeGetItem("adminToken")
                  ? `Bearer ${safeGetItem("adminToken")}`
                  : undefined,
              },
            }
          );
          return retryResponse.data;
        } catch (retryError) {
          // Try next fallback base URL.
        }
      }
    }
    console.error("API Error updating blog details:", error.response?.data || error);
    throw error;
  }
};

export const updateBlog = async (id, data) => {
  try {
    const response = await api.put(`/blog/update-blog/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    console.log(response, "update blogs ");
    return response.data;
  } catch (error) {
    console.error("API Error updating blog:", error.response?.data || error);
    throw error;
  }
};

export const updateBlogStatus = async (id, status) => {
  try {
    const response = await api.patch(
      `/blog/update-status/${id}`,
      { status }
      //   {
      //   headers: {
      //     'Content-Type': 'multipart/form-data', // Important for file uploads
      //   },
      // }
    );
    console.log(response, "updatestatusBlogs blogs");
    return response.data;
  } catch (error) {
    console.error("API Error updating blog:", error.response?.data || error);
    throw error;
  }
};
export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/blog/delete-blog/${id}`);
    console.log(response, "delete blogs");
    return response.data;
  } catch (error) {
    console.error("API Error deleting blog:", error.response?.data || error);
    throw error;
  }
};

// Public bootstrap APIs with fallback to existing endpoints
const unwrapBootstrapData = (responseData) => {
  if (!responseData || typeof responseData !== "object") return {};
  return responseData.data && typeof responseData.data === "object"
    ? responseData.data
    : responseData;
};

let headerBootstrapInFlight = null;
let headerCategoriesFastInFlight = null;

export const getHeaderCategoriesFast = async () => {
  if (headerCategoriesFastInFlight) {
    return headerCategoriesFastInFlight;
  }

  headerCategoriesFastInFlight = (async () => {
    try {
      const categories = await Promise.any([
        api.get("/public/header/categories-fast", { cache: false }).then((res) => {
          const payload = unwrapBootstrapData(res.data);
          return payload.categories || payload.category || [];
        }),
        getHeaderBootstrap().then((res) => res?.categories || []),
      ]);

      const normalizedCategories = Array.isArray(categories) ? categories : [];
      return normalizedCategories;
    } catch (error) {
      console.warn("Fast categories fetch failed, returning empty list.");
      return [];
    }
  })();

  try {
    return await headerCategoriesFastInFlight;
  } finally {
    headerCategoriesFastInFlight = null;
  }
};

export const prefetchHeaderCategoriesFast = () => {
  getHeaderCategoriesFast().catch(() => {
    // Prefetch should never block UI flows.
  });
};

export const getHeaderBootstrap = async () => {
  if (headerBootstrapInFlight) {
    return headerBootstrapInFlight;
  }

  headerBootstrapInFlight = (async () => {
    try {
      const response = await api.get("/public/bootstrap/header", { cache: false });
      const payload = unwrapBootstrapData(response.data);

      const result = {
        categories: payload.categories || payload.category || [],
        subCategories: payload.subCategories || payload.subcategories || [],
        services: payload.services || payload.searchTags || [],
        socialLinks:
          payload.socialLinks ||
          payload.sociallinks ||
          payload.social_links ||
          [],
        footerDetails:
          payload.footerDetails ||
          payload.footerdetails ||
          payload.footer_details ||
          [],
        source: "bootstrap",
      };
      return result;
    } catch (error) {
      console.warn("Header bootstrap endpoint unavailable, using fallback calls.");
      const [cats, subs, subsubs, social, footer] = await Promise.all([
        getCategories(),
        getSubCategories(),
        getSubSubCategories(),
        getSocialLinks(),
        getFooterDetails(),
      ]);

      const result = {
        categories: cats?.category || [],
        subCategories: subs?.subCategories || [],
        services: subsubs?.services || [],
        socialLinks: social?.data || [],
        footerDetails: footer?.data || [],
        source: "fallback",
      };
      return result;
    }
  })();

  try {
    return await headerBootstrapInFlight;
  } finally {
    headerBootstrapInFlight = null;
  }
};

export const getHomeBootstrap = async () => {
  try {
    const response = await api.get("/public/bootstrap/home");
    const payload = unwrapBootstrapData(response.data);

    return {
      caseStudies: payload.caseStudies || payload.casestudies || [],
      blogs: payload.blogs || [],
      testimonials: payload.testimonials || [],
      services: payload.services || payload.searchTags || [],
      topCompanies: payload.topCompanies || payload.topcompanies || [],
      source: "bootstrap",
    };
  } catch (error) {
    console.warn("Home bootstrap endpoint unavailable, using fallback calls.");
    const [caseStudiesData, blogsData, testimonialData, serviceData, topCompanys] =
      await Promise.all([
        getCaseStudies(),
        getBlogs(),
        getTestimonial(),
        getSubSubCategories(),
        getTopCompanys(),
      ]);

    return {
      caseStudies: caseStudiesData?.caseStudies || [],
      blogs: blogsData?.blogs || [],
      testimonials: testimonialData?.testimonials || [],
      services: serviceData?.services || [],
      topCompanies: topCompanys?.data || [],
      source: "fallback",
    };
  }
};

export const getFaqBootstrap = async () => {
  try {
    const response = await api.get("/public/bootstrap/faq");
    const payload = unwrapBootstrapData(response.data);

    return {
      categories: payload.categories || payload.category || [],
      faqs: payload.faqs || payload.faq || [],
      source: "bootstrap",
    };
  } catch (error) {
    console.warn("FAQ bootstrap endpoint unavailable, using fallback calls.");
    const [categoriesData, faqsData] = await Promise.all([
      getCategories(),
      getFAQs(),
    ]);

    return {
      categories: categoriesData?.category || [],
      faqs: faqsData?.faqs || [],
      source: "fallback",
    };
  }
};

export default api;






// // api.js
// import axios from "axios";
// import {
//   safeGetItem,
//   safeKeysWithPrefix,
//   safeRemoveItem,
//   safeSetItem,
//   storageAvailable,
// } from "./utils/safeStorage";

// const normalizeSpecialSpaces = (value) => value.replace(/[\u00A0\u2007\u202F]/g, " ");

// const looksLikeHtml = (value) => /<\/?[a-z][^>]*>/i.test(value);
// const looksLikeUrlOrAssetPath = (value) => {
//   const trimmed = value.trim();
//   return (
//     /^(https?:\/\/|blob:|data:|\/)/i.test(trimmed) ||
//     /^[A-Za-z0-9._-]+\/[A-Za-z0-9._/-]+\.(png|jpe?g|gif|svg|webp|avif|bmp)$/i.test(trimmed)
//   );
// };

// const normalizePlainText = (value) =>
//   value
//     .replace(/\s+/g, " ")
//     .replace(/\s+([,.;:!?])/g, "$1")
//     .replace(/([,.;:!?])([^\s\d])/g, "$1 $2")
//     .replace(/(\d)\s+(px|em|rem|%|vh|vw|pt|cm|mm|in|kg|g|mg|km|m|ms|s)\b/gi, "$1$2")
//     .replace(/([A-Za-z0-9._%+-])\s*@\s*([A-Za-z0-9.-]+)\s*\.\s*([A-Za-z]{2,})/g, "$1@$2.$3")
//     .trim();

// const normalizeBackendString = (value) => {
//   const normalized = normalizeSpecialSpaces(value);
//   if (looksLikeUrlOrAssetPath(normalized)) {
//     return normalized.trim();
//   }
//   if (looksLikeHtml(normalized)) {
//     return normalized.trim();
//   }
//   return normalizePlainText(normalized);
// };

// const sanitizeBackendPayload = (value) => {
//   if (typeof value === "string") {
//     return normalizeBackendString(value);
//   }

//   if (Array.isArray(value)) {
//     return value.map(sanitizeBackendPayload);
//   }

//   if (value && typeof value === "object") {
//     return Object.fromEntries(
//       Object.entries(value).map(([key, nestedValue]) => [key, sanitizeBackendPayload(nestedValue)])
//     );
//   }

//   return value;
// };

// const api = axios.create({
//   // Change this baseURL to your local backend server URL
//   // When deploying, you'll change this to your deployed backend URL (e.g., 'https://api.unicx.in')
//   baseURL: "https://webcmsbackend-production.up.railway.app/api/v1",
//   // baseURL:"https://behind-basketball-shaw-collectibles.trycloudflare.com/api/v1"  ,
//   // headers: { 'Content-Type': 'application/json' }
// });

// const API_GET_CACHE_PREFIX = "api_get_cache_v1:";
// const API_GET_CACHE_TTL_MS = 60 * 1000;
// const API_PUBLIC_GET_CACHE_TTL_MS = 0;
// const apiGetMemoryCache = new Map();
// const apiGetInFlightCache = new Map();

// const canUseStorage = () => storageAvailable();

// const isPublicApiPath = (url) => typeof url === "string" && url.startsWith("/public/");
// const shouldUsePersistentCache = (url) => !isPublicApiPath(url);

// const getGetCacheTtlMs = (url) =>
//   isPublicApiPath(url) ? API_PUBLIC_GET_CACHE_TTL_MS : API_GET_CACHE_TTL_MS;

// const buildGetCacheKey = (url, config) => {
//   const params = config?.params || null;
//   const tokenFragment = canUseStorage()
//     ? (safeGetItem("adminToken") || "").slice(0, 16)
//     : "";
//   return `${API_GET_CACHE_PREFIX}${JSON.stringify({
//     baseURL: api.defaults.baseURL || "",
//     url,
//     params,
//     tokenFragment,
//   })}`;
// };

// const readPersistentGetCache = (cacheKey) => {
//   if (!canUseStorage()) return null;
//   try {
//     const raw = safeGetItem(cacheKey);
//     if (!raw) return null;
//     const parsed = JSON.parse(raw);
//     if (!parsed || typeof parsed !== "object") return null;
//     if (!parsed.expiresAt || Date.now() > parsed.expiresAt) {
//       safeRemoveItem(cacheKey);
//       return null;
//     }
//     return parsed;
//   } catch {
//     return null;
//   }
// };

// const writePersistentGetCache = (cacheKey, responseData, ttlMs) => {
//   if (!canUseStorage()) return;
//   try {
//     safeSetItem(
//       cacheKey,
//       JSON.stringify({
//         expiresAt: Date.now() + ttlMs,
//         data: responseData,
//       }),
//     );
//   } catch {
//     // Ignore storage errors silently.
//   }
// };

// const clearAllGetCaches = () => {
//   apiGetMemoryCache.clear();
//   apiGetInFlightCache.clear();
//   if (!canUseStorage()) return;
//   try {
//     safeKeysWithPrefix(API_GET_CACHE_PREFIX).forEach((key) => safeRemoveItem(key));
//   } catch {
//     // Ignore storage cleanup errors.
//   }
// };

// api.interceptors.request.use(
//   (config) => {
//     const token = safeGetItem("adminToken");
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => {
//     if (response?.data !== undefined) {
//       response.data = sanitizeBackendPayload(response.data);
//     }
//     return response;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => {
//     const method = response?.config?.method?.toLowerCase();
//     if (method && ["post", "put", "patch", "delete"].includes(method)) {
//       clearAllGetCaches();
//     }
//     return response;
//   },
//   (error) => Promise.reject(error)
// );

// const originalApiGet = api.get.bind(api);
// api.get = async (url, config = {}) => {
//   const method = config?.method?.toLowerCase();
//   const skipCache =
//     config?.cache === false ||
//     method === "head" ||
//     isPublicApiPath(url);
//   const persistentCacheEnabled = shouldUsePersistentCache(url);
//   const noCacheConfig = {
//     ...(config || {}),
//     params: {
//       ...(config?.params || {}),
//       _ts: Date.now(),
//     },
//     headers: {
//       ...(config?.headers || {}),
//       "Cache-Control": "no-cache, no-store, must-revalidate",
//       Pragma: "no-cache",
//       Expires: "0",
//     },
//   };

//   if (skipCache) {
//     return originalApiGet(url, noCacheConfig);
//   }

//   const cacheKey = buildGetCacheKey(url, config);
//   const ttlMs = getGetCacheTtlMs(url);
//   const now = Date.now();

//   const memoryHit = apiGetMemoryCache.get(cacheKey);
//   if (memoryHit && now < memoryHit.expiresAt) {
//     return memoryHit.response;
//   }

//   if (persistentCacheEnabled) {
//     const persistentHit = readPersistentGetCache(cacheKey);
//     if (persistentHit) {
//       const cachedResponse = {
//         data: persistentHit.data,
//         status: 200,
//         statusText: "OK",
//         headers: {},
//         config: { ...(config || {}), url, method: "get" },
//         request: null,
//       };
//       apiGetMemoryCache.set(cacheKey, {
//         expiresAt: persistentHit.expiresAt,
//         response: cachedResponse,
//       });
//       return cachedResponse;
//     }
//   }

//   const inFlight = apiGetInFlightCache.get(cacheKey);
//   if (inFlight) {
//     return inFlight;
//   }

//   const requestPromise = originalApiGet(url, noCacheConfig)
//     .then((response) => {
//       const expiresAt = Date.now() + ttlMs;
//       apiGetMemoryCache.set(cacheKey, { expiresAt, response });
//       if (persistentCacheEnabled) {
//         writePersistentGetCache(cacheKey, response.data, ttlMs);
//       }
//       return response;
//     })
//     .finally(() => {
//       apiGetInFlightCache.delete(cacheKey);
//     });

//   apiGetInFlightCache.set(cacheKey, requestPromise);
//   return requestPromise;
// };
// // contact-us form API Call

// export const addContactForm = async (data) => {
//   try {
//     const response = await api.post("/category/add-contactus", data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     console.log(response, "contactuscreate response");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding category:", error.response || error);
//     throw error;
//   }
// };

// // udateIndemand status
// // footerdetailstatus change
// export const updateIndemandStatus = async (id, Insrstatus) => {
//   try {
//     const response = await api.patch(`/service/update/indemand/status/${id}`, {
//       Insrstatus,
//     });

//     console.log(response, "update-indemand-status")
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };

// // updateSearch Tage

// export const updateSearchTageStatus = async (id, stagestatus) => {
//   try {
//     const response = await api.patch(`/service/update/searchtage/status/${id}`, {
//       stagestatus,
//     });

//     // console.log(response,"update-searchtage-status")
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };
// // getformdata
// export const getContactForm = async () => {
//   try {
//     const response = await api.get("/category/get-formdata");
//     // console.log(response, "response categorydata");
//     return response.data; // 👈 returns backend JSON
//   } catch (error) {
//     console.error("API Error fetching categories:", error);
//     throw error;
//   }
// };
// // deleteformdata
// export const deleteFormData = async (id) => {
//   try {
//     const response = await api.delete(`/category/delete-formdata/${id}`);
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };
// // add socialLinks
// export const addSocialLink = async (data) => {
//   try {
//     const response = await api.post("/category/add-socialLinks", data);
//     console.log(response, "socialLiksscreate response");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding category:", error.response || error);
//     throw error;
//   }
// };
// // add footerdetails
// export const addFooterDetail = async (data) => {
//   try {
//     const response = await api.post("/category/add-footerdetails", data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     console.log(response, "footerderail response");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding category:", error.response || error);
//     throw error;
//   }
// };

// // footerdetailstatus change
// export const updateFooterDetailStatus = async (id, status) => {
//   try {
//     const response = await api.patch(`/category/update/footerdetails/status/${id}`, {
//       status,
//     });

//     // console.log(response,"update-status")
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };

// // footerdetailstatus change
// export const updateSocialLinkStatus = async (id, socialLinkstatus) => {
//   try {
//     const response = await api.patch(`/category/update/sociallink/status/${id}`, {
//       socialLinkstatus,
//     });
//     console.log(response, "update-status")
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };

// // getFooterDetails
// export const getFooterDetails = async () => {
//   try {
//     const response = await api.get("/category/get-footerdetails");
//     // console.log(response, "response categorydata");
//     return response.data; // 👈 returns backend JSON
//   } catch (error) {
//     console.error("API Error fetching categories:", error);
//     throw error;
//   }
// };

// // getSocialLInks
// export const getSocialLinks = async () => {
//   try {
//     const response = await api.get("/category/get-socialLinks");
//     // console.log(response, "response categorydata");
//     return response.data; // 👈 returns backend JSON
//   } catch (error) {
//     console.error("API Error fetching categories:", error);
//     throw error;
//   }
// };

// // updateFooterdetails
// export const updateFooterDetail = async (id, data) => {
//   try {

//     const response = await api.put(
//       `/category/update-footerdetails/${id}`,
//       data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }

//     );
//     console.log(response, "update topcompany")
//     return response.data;
//   } catch (err) {
//     console.error("Update Error:", err.response?.data || err);
//     throw err;
//   }
// };

// // updateSocialLink
// export const updateSocialLink = async (id, data) => {
//   try {

//     const response = await api.put(
//       `/category/update-socialLinks/${id}`,
//       data
//     );
//     console.log(response, "update topcompany")
//     return response.data;
//   } catch (err) {
//     console.error("Update Error:", err.response?.data || err);
//     throw err;
//   }
// };

// // deleteFooterdetails
// export const deleteFooterDetail = async (id) => {
//   try {
//     const response = await api.delete(`/category/delete-footerdetails/${id}`);
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };

// // deleteSocialLink
// export const deleteSocialLink = async (id) => {
//   try {
//     const response = await api.delete(`/category/delete-socialLinks/${id}`);
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };
// // addTestimonial
// export const addTestimonial = async (data) => {
//   try {
//     const isFormData = data instanceof FormData;
//     const response = await api.post(
//       "/faq/add-testimonial",
//       data,
//       isFormData
//         ? {}
//         : {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//     );
//     console.log(response, "contactuscreate response");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding category:", error.response || error);
//     throw error;
//   }
// };
// // getTestimonial
// export const getTestimonial = async () => {
//   try {
//     const response = await api.get("/faq/get-testimonial");
//     console.log(response, "response testimonial data");
//     return response.data; // 👈 returns backend JSON
//   } catch (error) {
//     console.error("API Error fetching categories:", error);
//     throw error;
//   }
// };

// // updateTestimonialstatus
// export const updateTestimonialStatus = async (id, status) => {
//   try {
//     const response = await api.patch(`/faq/testimonial/status/${id}`, {
//       status,
//     });
//     // console.log(response,"update-status")
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };
// // updateTestimonial
// export const updateTestimonial = async (id, data) => {
//   try {
//     const isFormData = data instanceof FormData;
//     const response = await api.put(
//       `/faq/update-testimonial/${id}`,
//       data,
//       isFormData
//         ? {}
//         : {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//     );
//     console.log(response, "update topcompany")
//     return response.data;
//   } catch (err) {
//     console.error("Update Error:", err.response?.data || err);
//     throw err;
//   }
// };

// // deleteTestimonial
// export const deleteTestimonial = async (id) => {
//   try {
//     const response = await api.delete(`/faq/delete-testimonial/${id}`);
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };
// // expertcontact-us form API Call

// export const addExpertContactForm = async (data) => {
//   try {
//     const response = await api.post("/category/add-expert-contactus", data);

//     return response.data;
//   } catch (error) {
//     console.error("API Error adding category:", error.response || error);
//     throw error;
//   }
// };

// // sendsubscription email form API Call

// export const addSubscriptionForm = async (data) => {
//   try {
//     const response = await api.post("/category/send-subscriptionemail", data);
//     // console.log(response, "subscriptioncreate response");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding category:", error.response || error);
//     throw error;
//   }
// };



// // Categories API
// export const getCategories = async () => {
//   try {
//     const response = await api.get("/category/getAllcategory", { cache: false });
//     // console.log(response, "response categorydata");
//     return response.data; // 👈 returns backend JSON
//   } catch (error) {
//     console.error("API Error fetching categories:", error);
//     throw error;
//   }
// };

// // topCompanys API
// export const addTopCompanys = async (data) => {
//   try {
//     const isFormData = data instanceof FormData;
//     const response = await api.post("/category/add-TopCompanies", data,
//       isFormData
//         ? {}
//         : {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//     );
//     // console.log(response, "subscriptioncreate response");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding category:", error.response || error);
//     throw error;
//   }
// };
// // updatestatus topcompanys
// export const updateTopCompanyStatus = async (id, status) => {
//   try {
//     const response = await api.patch(`/category/update-topcompanystatus/${id}`, {
//       status,
//     },

//     );
//     // console.log(response,"update-status")
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };
// // updatetopcompany
// export const updateTopCompany = async (id, data) => {
//   try {
//     const isFormData = data instanceof FormData;
//     const response = await api.put(`/category/update-TopCompany/${id}`, data, isFormData
//       ? {}
//       : {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     console.log(response, "update topcompany")
//     return response.data;
//   } catch (err) {
//     console.error("Update Error:", err.response?.data || err);
//     throw err;
//   }
// };
// // topcompanys  API
// export const getTopCompanys = async () => {
//   try {
//     const response = await api.get("/category/get-topcompnays");
//     console.log(response, "response topcompany data");
//     return response.data; // 👈 returns backend JSON
//   } catch (error) {
//     console.error("API Error fetching categories:", error);
//     throw error;
//   }
// };

// // delete topcompany
// export const deleteTopCompany = async (id) => {
//   try {
//     const response = await api.delete(`/category/delete-topcompany/${id}`);
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };

// export const addCategory = async (data) => {
//   try {
//     const response = await api.post("/category/create-category", data);
//     // console.log(response, "categorycreate response");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding category:", error.response || error);
//     throw error;
//   }
// };

// export const updateCategory = async (id, data) => {
//   try {
//     const response = await api.put(`/category/update-category/${id}`, data);

//     return response.data;
//   } catch (err) {
//     console.error("Update Error:", err.response?.data || err);
//     throw err;
//   }
// };

// export const deleteCategory = async (id) => {
//   try {
//     const response = await api.delete(`/category/delete-category/${id}`);
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };

// // update status
// export const updateCategoryStatus = async (id, status) => {
//   try {
//     const response = await api.patch(`/category/update-status/${id}`, {
//       status,
//     });
//     return response.data;
//   } catch (err) {
//     console.error("Delete Error:", err.response?.data || err);
//     throw err;
//   }
// };

// // Subcategories API
// export const addSubCategory = async (data) => {
//   try {
//     const response = await api.post("/subcategory/create-subCategory", data);
//     // console.log(response, "create subcategory");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding subcategory:", error.response || error);
//     throw error;
//   }
// };

// // serviceDetails
// export const addServiceDetails = async (data) => {
//   try {
//     const response = await api.post(
//       "/servicedetails/create-service-details",
//       data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//     );
//     console.log(response, "create servicedetails");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding subcategory:", error.response || error);
//     throw error;
//   }
// };
// // get serviceDetailsByserviceId
// export const getServiceDetailsByserviceId = async (serviceId) => {
//   try {
//     const response = await api.get(`/servicedetails/by-service/${serviceId}`);
//     console.log(response, "get servicedetailshjlopj");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding subcategory:", error.response || error);
//     throw error;
//   }
// };
// // updateservicedetailsById
// export const updateServiceDetails = async (serviceId, data) => {
//   try {
//     const response = await api.put(
//       `/servicedetails/updateService_detailsById/${serviceId}`,
//       data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//     );
//     console.log(response, "update service details ");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding subcategory:", error.response || error);
//     throw error;
//   }
// };
// export const updateSubCategorystatus = async (id, status) => {
//   try {
//     const response = await api.patch(`/subcategory/subcategory/status/${id}`, {
//       status,
//     });
//     // console.log(response,"status updated")
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding subcategory:", error.response || error);
//     throw error;
//   }
// };
// export const getSubCategories = async () => {
//   try {
//     const response = await api.get("/subcategory/getAllSubcategory", { cache: false });
//     // console.log(response, "getsubcategory");
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching subcategories:", error);
//     throw error;
//   }
// };
// export const getSubCategoriesByCategoryId = async (catgoryId) => {

//   try {
//     const response = await api.get(`/subcategory/getSubCategory/category/${catgoryId}`);
//     // console.log(response, "getsubcategory By category Id");
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching subcategories:", error);
//     throw error;
//   }
// };
// export const getserviceBysubCategoryId = async (subcategoryId) => {

//   try {
//     const response = await api.get(`/service/getservice/${subcategoryId}`);
//     // console.log(response, "getserviceBy subcategory by");
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching subcategories:", error);
//     throw error;
//   }
// };
// // updatecategory order_index 
// export const updateCategoryOrder_index = async (payload) => {
//   try {
//     console.log("Sending payload 👉", payload);

//     const response = await api.put(
//       "/category/reorder/category",     // ✅ URL
//       {
//         categories: payload,       // ✅ BODY
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("update order response", response.data);
//     return response.data;
//   } catch (err) {
//     console.error(
//       "Update Error:",
//       err.response?.data || err.message
//     );
//     throw err;
//   }
// };

// // subCategory orderIndex
// export const updateSubCategoryOrder_index = async (payload) => {
//   try {
//     console.log("Sending payload 👉", payload);

//     const response = await api.put(
//       "/subcategory/reorder/subcategory",
//       {
//         items: payload,       // ✅ BODY
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("update order response", response.data);
//     return response.data;
//   } catch (err) {
//     console.error(
//       "Update Error:",
//       err.response?.data || err.message
//     );
//     throw err;
//   }
// };

// // service order index
// export const updateserviceOrder_index = async (payload) => {
//   try {
//     console.log("Sending payload 👉", payload);

//     const response = await api.put(
//       "/service/reorder/service",     // ✅ URL
//       {
//         items: payload,       // ✅ BODY
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("update order response", response.data);
//     return response.data;
//   } catch (err) {
//     console.error(
//       "Update Error:",
//       err.response?.data || err.message
//     );
//     throw err;
//   }
// };
// export const updateSubCategory = async (id, data) => {
//   try {
//     const response = await api.put(
//       `/subcategory/update-subcategory/${id}`,
//       data
//     );
//     console.log(response, "update subcategory");
//     return response.data;
//   } catch (error) {
//     console.error("API Error updating subcategory:", error.response || error);
//     throw error;
//   }
// };

// export const deleteSubCategory = async (id) => {
//   try {
//     const response = await api.delete(`/subcategory/delete-subcategory/${id}`);
//     // console.log(response,"responsde daa elel")
//     return response.data;
//   } catch (error) {
//     console.error("API Error deleting subcategory:", error.response || error);
//     throw error;
//   }
// };

// // Users API
// export const getUsers = async () => {
//   try {
//     const response = await api.get("/auth/find-all");

//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching users:", error);
//     throw error;
//   }
// };

// // Sub-Sub-Categories API
// export const getSubSubCategories = async () => {
//   try {
//     const response = await api.get("/service/getAllServices", { cache: false });
//     // console.log(response, "category servuce response data");
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching sub-sub-categories:", error);
//     throw error;
//   }
// };

// export const addServices  = async (data) => {
//   try {
//     const response = await api.post("/service/add-service", data,
//       {
//         headers: {
//           // "Content-Type": "application/json",
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     console.log(response, "addServices  data")
//     return response.data;
//   } catch (error) {
//     console.error(
//       "API Error adding sub-sub-category:",
//       error.response || error
//     );
//     throw error;
//   }
// };

// export const updateServices  = async (id, data) => {
//   try {
//     const response = await api.put(`/service/update-service/${id}`, data, {
//       headers: {
//         // "Content-Type": "application/json",
//         "Content-Type": "multipart/form-data",
//       },
//     }); console.log(response, "update respose data")
//     return response.data;
//   } catch (error) {
//     console.error(
//       "API Error updating sub-sub-category:",
//       error.response || error
//     );
//     throw error;
//   }
// };

// export const updateServicesStatus = async (id, status) => {
//   try {
//     const response = await api.patch(`/service/update-status/${id}`, {
//       status,
//     });
//     console.log(response, "respoknse data");
//     return response.data;
//   } catch (error) {
//     console.error(
//       "API Error updating sub-sub-category:",
//       error.response || error
//     );
//     throw error;
//   }
// };
// export const deleteServices  = async (id) => {
//   try {
//     const response = await api.delete(`/service/delete-service/${id}`);
//     console.log(response, "response data");
//     return response.data;
//   } catch (error) {
//     console.error(
//       "API Error deleting sub-sub-category:",
//       error.response || error
//     );
//     throw error;
//   }
// };

// // api.js
// export const getServicesById = async (id) => {
//   try {
//     const response = await api.get(`/service/getserviceById/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching sub-sub-category by ID:", error);
//     throw error;
//   }
// };

// // adminApi.js
// export const searchItems = async (query) => {
//   try {
//     const response = await api.get("/service/search", {
//       params: {
//         query
//       },
//     });
//     console.log(response, "Services earch api")
//     return response.data;
//   } catch (error) {
//     console.error("API Error searching items:", error);
//     throw error;
//   }
// };

// export const incrementServiceSearchCount = async (id) => {
//   try {
//     const response = await api.patch(`/service/increment-search-count/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("API Error incrementing search count:", error);
//     throw error;
//   }
// };



// export const getServices  = async (id) => {
//   try {
//     const endpoint = id ? `/service/getAllServices/${id}` : "/service/getAllServices";
//     const response = await api.get(endpoint);
//     console.log(response, "get subsubcaate");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const loginUser = async (email, password) => {
//   try {
//     const response = await api.post("/auth/login", { email, password });
//     return response.data;
//   } catch (error) {
//     console.error("API Error logging in:", error);
//     throw error;
//   }
// };

// export const logoutUser = async () => {
//   try {
//     const response = await api.get("/auth/logout");
//     return response.data;
//   } catch (error) {
//     console.error("API Error logging out:", error);
//     throw error;
//   }
// };

// // Case Study API
// export const addCaseStudy = async (data) => {
//   try {
//     const response = await api.post("/casestudy/create-casestudy", data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log(response, "create case study");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding case study:", error.response || error);
//     throw error;
//   }
// };

// export const getCaseStudies = async () => {
//   try {
//     const response = await api.get("/casestudy/getAllcasestudy");
//     console.log(response, "casestudy studydata");
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching case studies:", error);
//     throw error;
//   }
// };

// export const getCaseStudyById = async (id) => {
//   try {
//     const response = await api.get(`/casestudy/getcasestudyById/${id}`);
//     console.log(response, "single casestudy")
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching case study by ID:", error);
//     throw error;
//   }
// };

// export const updateCaseStudy = async (id, data) => {
//   try {
//     // For file uploads, change Content-Type to multipart/form-data
//     const response = await api.put(`/casestudy/update-casestudy/${id}`, data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log(response, "update respons data");
//     return response.data;
//   } catch (error) {
//     console.error("API Error updating case study:", error.response || error);
//     throw error;
//   }
// };

// // export const updateCaseStudyStatus = async (id, status) => {
// //   try {
// //     // For file uploads, change Content-Type to multipart/form-data
// //     const response = await api.patch(
// //       `/casestudy/update-status/${id}`,
// //       { status },
// //       {
// //         headers: {
// //           "Content-Type": "multipart/form-data",
// //         },
// //       }
// //     );
// //     console.log(response, "response data");
// //     return response.data;
// //   } catch (error) {
// //     console.error("API Error updating case study:", error.response || error);
// //     throw error;
// //   }
// // };
// export const updateCaseStudyStatus = async (id, status) => {
//   try {
//     const response = await api.patch(
//       `/casestudy/update-status/${id}`,
//       { status } // ✅ JSON body
//     );

//     console.log(response, "response data");
//     return response.data;
//   } catch (error) {
//     console.error("API Error updating case study:", error.response || error);
//     throw error;
//   }
// };

// export const deleteCaseStudy = async (id) => {
//   try {
//     const response = await api.delete(`/casestudy/delete-casestudy/${id}`);
//     console.log(response, "deletecase study");
//     return response.data;
//   } catch (error) {
//     console.error("API Error deleting case study:", error.response || error);
//     throw error;
//   }
// };

// export const uploadSectionImage = async (imageData) => {
//   try {
//     const response = await api.post("/upload-section-image", imageData, {
//       headers: {
//         "Content-Type": "multipart/form-data", // Important for file uploads
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error uploading section image:", error);
//     throw error;
//   }
// };

// // NEW FAQ API FUNCTIONS
// export const addFAQ = async (data) => {
//   try {
//     const response = await api.post("/faq/create-faq", data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding FAQ:", error.response?.data || error);
//     throw error;
//   }
// };

// export const getFAQs = async () => {
//   try {
//     const response = await api.get("/faq/getAllFaq");
//     console.log(response, "faq response data");
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching FAQs:", error);
//     throw error;
//   }
// };

// export const getFAQById = async (id) => {
//   try {
//     const response = await api.get(`/faq/getFaq/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching FAQ by ID:", error);
//     throw error;
//   }
// };

// export const updateFAQ = async (id, data) => {
//   try {
//     const response = await api.put(`/faq/update-faq/${id}`, data, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error("API Error updating FAQ:", error.response?.data || error);
//     throw error;
//   }
// };

// export const updateFAQStatus = async (id, status) => {
//   try {
//     const response = await api.patch(
//       `/faq/update-status/${id}`,
//       { status } // ✅ send object
//     );
//     console.log(response, "updatestatus data");
//     return response.data;
//   } catch (error) {
//     console.error("API Error updating FAQ:", error.response?.data || error);
//     throw error;
//   }
// };

// export const deleteFAQ = async (id) => {
//   try {
//     const response = await api.delete(`/faq/delete-Faq/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("API Error deleting FAQ:", error.response?.data || error);
//     throw error;
//   }
// };

// // NEW BLOG API FUNCTIONS
// export const addBlog = async (data) => {
//   try {
//     const response = await api.post("/blog/create-blogs", data,
//       //   {
//       //   headers: {
//       //     "Content-Type": "multipart/form-data",
//       //   },
//       // }
//     );

//     // console.log(response, "create blogs");
//     return response.data;
//   } catch (error) {
//     console.error("API Error adding blog:", error.response?.data || error);
//     throw error;
//   }
// };

// export const getBlogs = async () => {
//   try {
//     const response = await api.get("/blog/getAllBlog");
//     // console.log(response, "response blogsdata");/
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching blogs:", error);
//     throw error;
//   }
// };

// export const getBlogById = async (id) => {
//   try {
//     const response = await api.get(`/blog/getBlogById/${id}`);
//     // console.log(response,"response single blog  data");
//     return response.data;
//   } catch (error) {
//     console.error("API Error fetching blog by ID:", error);
//     throw error;
//   }
// };

// export const updateBlog = async (id, data) => {
//   try {
//     const response = await api.put(`/blog/update-blog/${id}`, data, {
//       headers: {
//         "Content-Type": "multipart/form-data", // Important for file uploads
//       },
//     });
//     console.log(response, "update blogs ");
//     return response.data;
//   } catch (error) {
//     console.error("API Error updating blog:", error.response?.data || error);
//     throw error;
//   }
// };

// export const updateBlogStatus = async (id, status) => {
//   try {
//     const response = await api.patch(
//       `/blog/update-status/${id}`,
//       { status }
//       //   {
//       //   headers: {
//       //     'Content-Type': 'multipart/form-data', // Important for file uploads
//       //   },
//       // }
//     );
//     console.log(response, "updatestatusBlogs blogs");
//     return response.data;
//   } catch (error) {
//     console.error("API Error updating blog:", error.response?.data || error);
//     throw error;
//   }
// };
// export const deleteBlog = async (id) => {
//   try {
//     const response = await api.delete(`/blog/delete-blog/${id}`);
//     console.log(response, "delete blogs");
//     return response.data;
//   } catch (error) {
//     console.error("API Error deleting blog:", error.response?.data || error);
//     throw error;
//   }
// };

// // Public bootstrap APIs with fallback to existing endpoints
// const unwrapBootstrapData = (responseData) => {
//   if (!responseData || typeof responseData !== "object") return {};
//   return responseData.data && typeof responseData.data === "object"
//     ? responseData.data
//     : responseData;
// };

// let headerBootstrapInFlight = null;
// let headerCategoriesFastInFlight = null;

// export const getHeaderCategoriesFast = async () => {
//   if (headerCategoriesFastInFlight) {
//     return headerCategoriesFastInFlight;
//   }

//   headerCategoriesFastInFlight = (async () => {
//     try {
//       const categories = await Promise.any([
//         api.get("/public/header/categories-fast", { cache: false }).then((res) => {
//           const payload = unwrapBootstrapData(res.data);
//           return payload.categories || payload.category || [];
//         }),
//         getHeaderBootstrap().then((res) => res?.categories || []),
//       ]);

//       const normalizedCategories = Array.isArray(categories) ? categories : [];
//       return normalizedCategories;
//     } catch (error) {
//       console.warn("Fast categories fetch failed, returning empty list.");
//       return [];
//     }
//   })();

//   try {
//     return await headerCategoriesFastInFlight;
//   } finally {
//     headerCategoriesFastInFlight = null;
//   }
// };

// export const prefetchHeaderCategoriesFast = () => {
//   getHeaderCategoriesFast().catch(() => {
//     // Prefetch should never block UI flows.
//   });
// };

// export const getHeaderBootstrap = async () => {
//   if (headerBootstrapInFlight) {
//     return headerBootstrapInFlight;
//   }

//   headerBootstrapInFlight = (async () => {
//   try {
//     const response = await api.get("/public/bootstrap/header", { cache: false });
//     const payload = unwrapBootstrapData(response.data);

//     const result = {
//       categories: payload.categories || payload.category || [],
//       subCategories: payload.subCategories || payload.subcategories || [],
//       services: payload.services || payload.searchTags || [],
//       socialLinks:
//         payload.socialLinks ||
//         payload.sociallinks ||
//         payload.social_links ||
//         [],
//       footerDetails:
//         payload.footerDetails ||
//         payload.footerdetails ||
//         payload.footer_details ||
//         [],
//       source: "bootstrap",
//     };
//     return result;
//   } catch (error) {
//     console.warn("Header bootstrap endpoint unavailable, using fallback calls.");
//     const [cats, subs, subsubs, social, footer] = await Promise.all([
//       getCategories(),
//       getSubCategories(),
//       getSubSubCategories(),
//       getSocialLinks(),
//       getFooterDetails(),
//     ]);

//     const result = {
//       categories: cats?.category || [],
//       subCategories: subs?.subCategories || [],
//       services: subsubs?.services || [],
//       socialLinks: social?.data || [],
//       footerDetails: footer?.data || [],
//       source: "fallback",
//     };
//     return result;
//   }
//   })();

//   try {
//     return await headerBootstrapInFlight;
//   } finally {
//     headerBootstrapInFlight = null;
//   }
// };

// export const getHomeBootstrap = async () => {
//   try {
//     const response = await api.get("/public/bootstrap/home");
//     const payload = unwrapBootstrapData(response.data);

//     return {
//       caseStudies: payload.caseStudies || payload.casestudies || [],
//       blogs: payload.blogs || [],
//       testimonials: payload.testimonials || [],
//       services: payload.services || payload.searchTags || [],
//       topCompanies: payload.topCompanies || payload.topcompanies || [],
//       source: "bootstrap",
//     };
//   } catch (error) {
//     console.warn("Home bootstrap endpoint unavailable, using fallback calls.");
//     const [caseStudiesData, blogsData, testimonialData, serviceData, topCompanys] =
//       await Promise.all([
//         getCaseStudies(),
//         getBlogs(),
//         getTestimonial(),
//         getSubSubCategories(),
//         getTopCompanys(),
//       ]);

//     return {
//       caseStudies: caseStudiesData?.caseStudies || [],
//       blogs: blogsData?.blogs || [],
//       testimonials: testimonialData?.testimonials || [],
//       services: serviceData?.services || [],
//       topCompanies: topCompanys?.data || [],
//       source: "fallback",
//     };
//   }
// };

// export const getFaqBootstrap = async () => {
//   try {
//     const response = await api.get("/public/bootstrap/faq");
//     const payload = unwrapBootstrapData(response.data);

//     return {
//       categories: payload.categories || payload.category || [],
//       faqs: payload.faqs || payload.faq || [],
//       source: "bootstrap",
//     };
//   } catch (error) {
//     console.warn("FAQ bootstrap endpoint unavailable, using fallback calls.");
//     const [categoriesData, faqsData] = await Promise.all([
//       getCategories(),
//       getFAQs(),
//     ]);

//     return {
//       categories: categoriesData?.category || [],
//       faqs: faqsData?.faqs || [],
//       source: "fallback",
//     };
//   }
// };

// export default api;
