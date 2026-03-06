import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { addBlogDetails,  getBlogDetails, updateBlogDetails } from "../adminApi";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Editor } from "primereact/editor";
import Quill from "quill";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import "./serviceStyle/blogDetails.css";

const BlockEmbed = Quill.import("blots/block/embed");

class Html5VideoBlot extends BlockEmbed {
  static blotName = "video";
  static tagName = "video";
  static className = "ql-video";

  static create(value) {
    const node = super.create();
    node.setAttribute("src", String(value || ""));
    node.setAttribute("controls", "controls");
    node.setAttribute("playsinline", "true");
    node.setAttribute("preload", "metadata");
    node.setAttribute("style", "max-width: 100%; height: auto;");
    return node;
  }

  static value(node) {
    return node.getAttribute("src") || "";
  }
}

if (typeof window !== "undefined" && !window.__blogHtml5VideoBlotRegistered) {
  Quill.register(Html5VideoBlot, true);
  window.__blogHtml5VideoBlotRegistered = true;
}

const createContentItem = () => ({
  localId: `content_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  contentTitle: "",
  description: "",
  video: null,
  existingVideoUrl: "",
  videoPreviewUrl: "",
  gallaryImages: [],
});

const createImageAsset = (file) => ({
  id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  file,
  previewUrl: URL.createObjectURL(file),
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedAreaPixels: null,
  resizeWidth: "",
  resizeHeight: "",
});

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };
    image.src = objectUrl;
  });

const processImageFile = async (file, editState) => {
  const image = await loadImage(file);
  const naturalWidth = image.naturalWidth || image.width;
  const naturalHeight = image.naturalHeight || image.height;

  const cropped = editState?.croppedAreaPixels;
  const sx = Math.max(0, Math.round(cropped?.x ?? 0));
  const sy = Math.max(0, Math.round(cropped?.y ?? 0));
  const sw = Math.max(1, Math.min(Math.round(cropped?.width ?? naturalWidth), naturalWidth - sx));
  const sh = Math.max(1, Math.min(Math.round(cropped?.height ?? naturalHeight), naturalHeight - sy));

  const resizeWidth = Number(editState.resizeWidth);
  const resizeHeight = Number(editState.resizeHeight);
  const targetWidth = Number.isFinite(resizeWidth) && resizeWidth > 0 ? resizeWidth : sw;
  const targetHeight = Number.isFinite(resizeHeight) && resizeHeight > 0 ? resizeHeight : sh;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(targetWidth);
  canvas.height = Math.round(targetHeight);
  const context = canvas.getContext("2d");
  if (!context) return file;

  context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, file.type || "image/jpeg", 0.92));
  if (!blob) return file;
  return new File([blob], file.name, { type: blob.type, lastModified: Date.now() });
};

const BlogDetails = () => {
   const { id } = useParams();
// console.log(id,'dlkfskdlk')
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const contentRef = useRef([createContentItem()]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    blogId: id,
    title: "",
    category: "",
    tage: "",
    readingTime: "",
    // authorName: "Unicx Team",
    seo_meta_title: "",
    seo_meta_description: "",
    seo_meta_keywords: "",
  });
  const [content, setContent] = useState([createContentItem()]);
  const [imageStudio, setImageStudio] = useState({
    open: false,
    contentIndex: null,
    selectedAssetId: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [detailsId, setDetailsId] = useState("");
  const [hasExistingDetails, setHasExistingDetails] = useState(false);

  const attachEditorVideoUploadHandler = (quillInstance) => {
    if (!quillInstance) return;
    const toolbar = quillInstance.getModule("toolbar");
    if (!toolbar) return;

    toolbar.addHandler("video", () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*");
      input.style.display = "none";
      document.body.appendChild(input);

      input.onchange = () => {
        const file = input.files?.[0];
        document.body.removeChild(input);
        if (!file) return;

        try {
          const videoUrl = URL.createObjectURL(file);
          const range = quillInstance.getSelection(true) || {
            index: quillInstance.getLength(),
            length: 0,
          };
          quillInstance.insertEmbed(range.index, "video", videoUrl, "user");
          quillInstance.setSelection(range.index + 1, 0);
        } catch (uploadErr) {
          setError("Video upload failed. Please try again.");
        }
      };

      input.click();
    });
  };
  const descriptionEditorHeader = (
    <>
      <span className="ql-formats">
        <select className="ql-header" defaultValue="">
          <option value="1">Heading</option>
          <option value="2">Subheading</option>
          <option value="">Normal</option>
        </select>
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-bold" />
        <button type="button" className="ql-italic" />
        <button type="button" className="ql-underline" />
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-list" value="ordered" />
        <button type="button" className="ql-list" value="bullet" />
        <button type="button" className="ql-blockquote" />
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-link" />
        <button type="button" className="ql-image" />
        <button type="button" className="ql-video" />
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-clean" />
      </span>
    </>
  );

  const isEdit = Boolean(hasExistingDetails && detailsId);

  const studioAssets = useMemo(() => {
    if (!imageStudio.open || imageStudio.contentIndex === null) return [];
    return content[imageStudio.contentIndex]?.gallaryImages || [];
  }, [content, imageStudio]);
  const selectedStudioAsset = useMemo(
    () => studioAssets.find((asset) => asset.id === imageStudio.selectedAssetId) || null,
    [studioAssets, imageStudio.selectedAssetId]
  );
  const totalImages = useMemo(
    () =>
      content.reduce(
        (sum, item) => sum + (Array.isArray(item.gallaryImages) ? item.gallaryImages.length : 0),
        0
      ),
    [content]
  );
  const totalVideos = useMemo(
    () => content.reduce((sum, item) => sum + ((item.video || item.existingVideoUrl) ? 1 : 0), 0),
    [content]
  );
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    return () => {
      contentRef.current.forEach((item) => {
        if (item.videoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(item.videoPreviewUrl);
        item.gallaryImages.forEach((asset) => {
          if (asset?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(asset.previewUrl);
        });
      });
    };
  }, []);

  useEffect(() => {
    const state = location?.state || {};
    // console.log(state,"location value")
    const stateTitle = String(state?.title || "").trim();
    const stateBlogId = String(state?.blogId || "").trim();
    const queryBlogId = String(searchParams.get("blogId") || "").trim();
    const stateCategory = String(state?.category || "").trim();
    const blogId = stateBlogId || queryBlogId || String(id || "").trim();
// console.log(state.categoryId,"categorydid")
    setHasExistingDetails(false);
    setDetailsId("");
    setFormData((prev) => ({
      ...prev,
      blogId: blogId || prev.blogId,
      title: stateTitle || prev.title,
      category: state.categoryId,
    }));


    if (!blogId) {
      setContent([createContentItem()]);
      return;
    }

    const fetchBlogMeta = async () => {
      try {
        const res = await getBlogDetails(blogId);
        const fetchedTitle = String(res?.blogdetails?.title || "").trim();
        const fetchedCategory = String(
          res?.blogdetails?.category ||
          res?.blogdetails?.blogId?.categoryId?.name ||
          res?.blogdetails?.blogId?.categoryId?.[0]?.name ||
          ""
        ).trim();

        setHasExistingDetails(true);
        setDetailsId(String(res?.blogdetails?._id || ""));
        setFormData((prev) => ({
          ...prev,
          blogId,
          title: String(stateTitle || fetchedTitle || prev.title || "").trim(),
          category: state.categoryId,
          tage: Array.isArray(res?.blogdetails?.tage)
            ? res?.blogdetails?.tage.join(", ")
            : String(res?.blogdetails?.tage || ""),
          readingTime: res?.blogdetails?.readingTime ?? "",
          seo_meta_title: String(res?.blogdetails?.seo_meta_title || ""),
          seo_meta_description: String(res?.blogdetails?.seo_meta_description || ""),
          seo_meta_keywords: Array.isArray(res?.blogdetails?.seo_meta_keywords)
            ? res?.blogdetails?.seo_meta_keywords.join(", ")
            : String(res?.blogdetails?.seo_meta_keywords || ""),
        }));

          const loadedContent = Array.isArray(res?.blogdetails?.content) && res?.blogdetails?.content.length > 0
            ? res?.blogdetails?.content.map((item, index) => ({
                localId: `content_existing_${index}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                contentTitle: String(item?.contentTitle || ""),
                description: String(item?.description || ""),
                video: null,
                existingVideoUrl: String(item?.video || ""),
                videoPreviewUrl: String(item?.video || ""),
                gallaryImages: (Array.isArray(item?.gallary_image) ? item.gallary_image : [])
                  .filter(Boolean)
                  .map((url, imgIndex) => ({
                    id: `existing_${index}_${imgIndex}_${Math.random().toString(36).slice(2, 7)}`,
                    file: null,
                    existingIndex: imgIndex,
                    existingUrl: String(url),
                    previewUrl: String(url),
                    crop: { x: 0, y: 0 },
                    zoom: 1,
                    croppedAreaPixels: null,
                    resizeWidth: "",
                    resizeHeight: "",
                  })),
              }))
            : [createContentItem()];
          setContent(loadedContent);
      } catch (detailsErr) {
        setHasExistingDetails(false);
        setDetailsId("");
        setContent([createContentItem()]);
        console.log("blog meta fetch error", detailsErr);
      }
    
    };

    fetchBlogMeta();
  }, [location?.state, searchParams, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateContentItem = (index, key, value) => {
    setContent((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const clearVideo = (contentIndex) => {
    setContent((prev) => {
      const next = [...prev];
      const previousPreview = next[contentIndex]?.videoPreviewUrl;
      if (previousPreview?.startsWith("blob:")) URL.revokeObjectURL(previousPreview);
      next[contentIndex] = {
        ...next[contentIndex],
        video: null,
        existingVideoUrl: "",
        videoPreviewUrl: "",
      };
      return next;
    });
  };

  const handleVideoChange = (contentIndex, file) => {
    setContent((prev) => {
      const next = [...prev];
      const previousPreview = next[contentIndex]?.videoPreviewUrl;
      if (previousPreview?.startsWith("blob:")) URL.revokeObjectURL(previousPreview);
      next[contentIndex] = {
        ...next[contentIndex],
        video: file || null,
        existingVideoUrl: "",
        videoPreviewUrl: file ? URL.createObjectURL(file) : "",
      };
      return next;
    });
  };

  const addContentBlock = () => {
    setContent((prev) => [...prev, createContentItem()]);
  };

  const removeContentBlock = (index) => {
    setContent((prev) => {
      if (prev.length === 1) return prev;
      prev[index]?.gallaryImages?.forEach((asset) => {
        if (asset?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(asset.previewUrl);
      });
      if (prev[index]?.videoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(prev[index].videoPreviewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const addGalleryImages = (contentIndex, files = [], options = {}) => {
    if (!Array.isArray(files) || files.length === 0) return;
    const assets = files.map((file) => createImageAsset(file));
    const firstAddedId = assets[0]?.id || null;
    setContent((prev) => {
      const next = [...prev];
      const current = Array.isArray(next[contentIndex].gallaryImages)
        ? next[contentIndex].gallaryImages
        : [];
      next[contentIndex] = {
        ...next[contentIndex],
        gallaryImages: [...current, ...assets],
      };
      return next;
    });
    if (options.selectFirstAdded && firstAddedId) {
      setImageStudio((prev) => {
        if (prev.contentIndex !== contentIndex) return prev;
        return {
          ...prev,
          selectedAssetId: firstAddedId,
        };
      });
    }
    if (options.openStudio && firstAddedId) {
      setImageStudio({
        open: true,
        contentIndex,
        selectedAssetId: firstAddedId,
      });
    }
  };

  const removeGalleryImage = (contentIndex, assetId) => {
    setContent((prev) => {
      const next = [...prev];
      const assets = Array.isArray(next[contentIndex].gallaryImages)
        ? next[contentIndex].gallaryImages
        : [];
      const target = assets.find((item) => item.id === assetId);
      if (target?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(target.previewUrl);
      next[contentIndex] = {
        ...next[contentIndex],
        gallaryImages: assets.filter((item) => item.id !== assetId),
      };
      return next;
    });
    setImageStudio((prev) => {
      if (!prev.open || prev.contentIndex !== contentIndex || prev.selectedAssetId !== assetId) {
        return prev;
      }
      const remaining = (content[contentIndex]?.gallaryImages || []).filter((item) => item.id !== assetId);
      return { ...prev, selectedAssetId: remaining[0]?.id || null };
    });
  };

  const handleReplaceExistingGalleryImage = (contentIndex, assetId, file) => {
    if (!file) return;
    setContent((prev) => {
      const next = [...prev];
      const assets = [...(next[contentIndex].gallaryImages || [])];
      const assetIndex = assets.findIndex((item) => item.id === assetId);
      if (assetIndex === -1) return prev;

      const currentAsset = assets[assetIndex];
      if (currentAsset?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentAsset.previewUrl);
      }

      assets[assetIndex] = {
        ...currentAsset,
        file,
        previewUrl: URL.createObjectURL(file),
      };
      next[contentIndex] = { ...next[contentIndex], gallaryImages: assets };
      return next;
    });
  };

  const updateImageEditField = (contentIndex, assetId, key, value) => {
    setContent((prev) => {
      const next = [...prev];
      const assets = [...(next[contentIndex].gallaryImages || [])];
      const assetIndex = assets.findIndex((item) => item.id === assetId);
      if (assetIndex === -1) return prev;
      assets[assetIndex] = { ...assets[assetIndex], [key]: value };
      next[contentIndex] = { ...next[contentIndex], gallaryImages: assets };
      return next;
    });
  };

  const updateAssetCrop = (contentIndex, assetId, crop) => {
    setContent((prev) => {
      const next = [...prev];
      const assets = [...(next[contentIndex].gallaryImages || [])];
      const assetIndex = assets.findIndex((item) => item.id === assetId);
      if (assetIndex === -1) return prev;
      assets[assetIndex] = { ...assets[assetIndex], crop };
      next[contentIndex] = { ...next[contentIndex], gallaryImages: assets };
      return next;
    });
  };

  const updateAssetZoom = (contentIndex, assetId, zoom) => {
    setContent((prev) => {
      const next = [...prev];
      const assets = [...(next[contentIndex].gallaryImages || [])];
      const assetIndex = assets.findIndex((item) => item.id === assetId);
      if (assetIndex === -1) return prev;
      assets[assetIndex] = { ...assets[assetIndex], zoom };
      next[contentIndex] = { ...next[contentIndex], gallaryImages: assets };
      return next;
    });
  };

  const updateAssetCroppedArea = (contentIndex, assetId, croppedAreaPixels) => {
    setContent((prev) => {
      const next = [...prev];
      const assets = [...(next[contentIndex].gallaryImages || [])];
      const assetIndex = assets.findIndex((item) => item.id === assetId);
      if (assetIndex === -1) return prev;
      assets[assetIndex] = { ...assets[assetIndex], croppedAreaPixels };
      next[contentIndex] = { ...next[contentIndex], gallaryImages: assets };
      return next;
    });
  };

  const applyImageEdit = async (contentIndex, assetId) => {
    const currentContent = contentRef.current;
    const assets = currentContent[contentIndex]?.gallaryImages || [];
    const asset = assets.find((item) => item.id === assetId);
    if (!asset?.file) return;

    try {
      const nextFile = await processImageFile(asset.file, asset);
      const nextPreview = URL.createObjectURL(nextFile);
      setContent((prev) => {
        const next = [...prev];
        const clonedAssets = [...(next[contentIndex].gallaryImages || [])];
        const idx = clonedAssets.findIndex((item) => item.id === assetId);
        if (idx === -1) return prev;
        const currentAsset = clonedAssets[idx];
        if (currentAsset?.previewUrl) URL.revokeObjectURL(currentAsset.previewUrl);
        clonedAssets[idx] = {
          ...currentAsset,
          file: nextFile,
          previewUrl: nextPreview,
        };
        next[contentIndex] = { ...next[contentIndex], gallaryImages: clonedAssets };
        return next;
      });
    } catch (e) {
      setError("Image editing failed for one of the files");
    }
  };

  const openImageStudio = (contentIndex) => {
    const firstAssetId = content[contentIndex]?.gallaryImages?.[0]?.id || null;
    setImageStudio({
      open: true,
      contentIndex,
      selectedAssetId: firstAssetId,
    });
  };

  const closeImageStudio = () => {
    setImageStudio({
      open: false,
      contentIndex: null,
      selectedAssetId: null,
    });
  };

  const onStudioDragEnd = (result) => {
    if (!result.destination || imageStudio.contentIndex === null) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    setContent((prev) => {
      const next = [...prev];
      const assets = [...(next[imageStudio.contentIndex].gallaryImages || [])];
      const [moved] = assets.splice(source.index, 1);
      assets.splice(destination.index, 0, moved);
      next[imageStudio.contentIndex] = {
        ...next[imageStudio.contentIndex],
        gallaryImages: assets,
      };
      return next;
    });
  };

  const buildPayload = () => {
    const safeTitle = String(formData?.title || "").trim();
    const safeBlogId = String(formData?.blogId || "").trim();
    const safeCategory = String(formData?.category || "").trim();
    const safeTags = String(formData?.tage || "");
    const safeSeoTitle = String(formData?.seo_meta_title || "").trim();
    const safeSeoDescription = String(formData?.seo_meta_description || "").trim();
    const safeSeoKeywords = String(formData?.seo_meta_keywords || "");

    if (!safeTitle) {
      throw new Error("Blog title missing. Open Blog Details from Blog List using the + icon.");
    }
    if (!safeBlogId) {
      throw new Error("Blog ID missing. Open Blog Details from Blog List using the + icon.");
    }

    const payload = new FormData();
    const normalizedTags = safeTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const normalizedSeoKeywords = safeSeoKeywords
      .split(",")
      .map((keyword) => keyword?.trim())
      .filter(Boolean);

    payload.append("blogId", safeBlogId);
    payload.append("title", safeTitle);
    payload.append("category", safeCategory);
    payload.append("tage", JSON.stringify(normalizedTags));
    payload.append("readingTime", formData?.readingTime ?? "");
    // payload.append("authorName", formData?.authorName ?? "");
    payload.append("seo_meta_title", safeSeoTitle);
    payload.append("seo_meta_description", safeSeoDescription);
    payload.append("seo_meta_keywords", JSON.stringify(normalizedSeoKeywords));

    content.forEach((item, index) => {
      payload.append(`content[${index}][contentTitle]`, item.contentTitle || "");
      payload.append(`content[${index}][description]`, item.description || "");
      if (item.video instanceof File) {
        payload.append(`content[${index}][video]`, item.video);
        payload.append(`content[${index}][video_url]`, item.video);
        payload.append(`content[${index}][videoUrl]`, item.video);
      } else if (item.existingVideoUrl) {
        payload.append(`content[${index}][video]`, item.existingVideoUrl);
      }
      const existingGalleryAssets = item.gallaryImages.filter((asset) => asset.existingUrl);
      const existingGalleryUrls = existingGalleryAssets
        .filter((asset) => !asset.file)
        .map((asset) => asset.existingUrl);
      if (existingGalleryUrls.length > 0) {
        payload.append(`content[${index}][gallary_image]`, JSON.stringify(existingGalleryUrls));
      }

      const replacementAssets = existingGalleryAssets.filter(
        (asset) => asset.file && Number.isInteger(asset.existingIndex)
      );
      if (replacementAssets.length > 0) {
        payload.append(
          `content[${index}][replaceIndexes]`,
          JSON.stringify(replacementAssets.map((asset) => asset.existingIndex))
        );
        replacementAssets.forEach((asset) => {
          payload.append(`content[${index}][replace_gallary_image]`, asset.file);
        });
      }

      item.gallaryImages
        .filter((asset) => asset.file && !asset.existingUrl)
        .forEach((asset) => {
          payload.append(`content[${index}][gallary_image]`, asset.file);
        });
    });

    return payload;
  };

  const revokeBlobPreviews = () => {
    content.forEach((item) => {
      if (item.videoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(item.videoPreviewUrl);
      item.gallaryImages.forEach((asset) => {
        if (asset?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(asset.previewUrl);
      });
    });
  };

  const handleCreate = async () => {
    setMessage("");
    setError("");
    try {
      setSaving(true);
      const payload = buildPayload();
      const response = await addBlogDetails(payload);
      setMessage(response?.message || "Blog details created successfully");
      if (response?.blog?._id) {
        setHasExistingDetails(true);
        setDetailsId(String(response.blog._id));
      }
      revokeBlobPreviews();
      navigate("/admin/add-blogs");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to create blog details");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setMessage("");
    setError("");
    if (!detailsId) {
      setError("Blog details ID missing for update.");
      return;
    }
    try {
      setSaving(true);
      const payload = buildPayload();
      const response = await updateBlogDetails(detailsId, payload);
      setMessage(response?.message || "Blog details updated successfully");
      revokeBlobPreviews();
      navigate("/admin/add-blogs");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update blog details");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  return (
    <div className="blogdetails-page">
      <div className="blogdetails-shell">
        <div className="blogdetails-topbar">
          <div>
            <h2 className="blogdetails-title">{isEdit ? "Update Blog Details" : "Create Blog Details"}</h2>
            <p className="blogdetails-subtitle">Fill required details and publish quickly.</p>
          </div>
          <div className="blogdetails-stats">
            <span className="blogdetails-stat-chip">{content.length} Sections</span>
            <span className="blogdetails-stat-chip">{totalImages} Images</span>
            <span className="blogdetails-stat-chip">{totalVideos} Videos</span>
          </div>
        </div>

        {message ? <p className="blogdetails-alert success">{message}</p> : null}
        {error ? <p className="blogdetails-alert error">{error}</p> : null}

        <Form onSubmit={handleSubmit} className="blogdetails-form">
          <section className="blogdetails-panel">
            <h5 className="blogdetails-panel-title">Blog Basics</h5>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              disabled
              required
            />
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Blog category"
              disabled
            />
          </Form.Group> */}

          <div className="d-flex gap-3 mb-3">
            <Form.Group style={{ flex: 1 }}>
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                name="tage"
                value={formData.tage}
                placeholder="startup, tax, compliance"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group style={{ flex: 1 }}>
              <Form.Label>Reading Time (minutes)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="readingTime"
                value={formData.readingTime}
                placeholder="5"
                onChange={handleChange}
              />
            </Form.Group>
          </div>

          {/* <Form.Group className="mb-3">
            <Form.Label>Author Name</Form.Label>
            <Form.Control
              name="authorName"
              value={formData.authorName}
              placeholder="Author name"
              onChange={handleChange}
            />
          </Form.Group> */}
          </section>

          <section className="blogdetails-panel">
          <h5 className="blogdetails-panel-title">SEO Fields</h5>
          <Form.Group className="mb-3">
            <Form.Label>SEO Meta Title</Form.Label>
            <Form.Control
              name="seo_meta_title"
              value={formData.seo_meta_title}
              placeholder="Meta title for search engines"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>SEO Meta Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="seo_meta_description"
              value={formData.seo_meta_description}
              placeholder="Meta description under 160 characters"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>SEO Meta Keywords (comma-separated)</Form.Label>
            <Form.Control
              name="seo_meta_keywords"
              value={formData.seo_meta_keywords}
              placeholder="keyword1, keyword2, keyword3"
              onChange={handleChange}
            />
          </Form.Group>
          </section>

          <section className="blogdetails-panel">
          <h5 className="blogdetails-panel-title">Content Blocks</h5>
          {content.map((item, index) => (
            <div key={item.localId || `section_${index}`} className="blogdetails-section-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <strong className="blogdetails-section-title">Section {index + 1}</strong>
                  <p className="blogdetails-section-meta">
                    Images: {item.gallaryImages.length} | Video: {(item.video || item.existingVideoUrl) ? "Yes" : "No"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeContentBlock(index)}
                >
                  Remove
                </Button>
              </div>

              <Form.Group className="mb-2">
                <Form.Label>Content Title</Form.Label>
                <div className="blogdetails-editor-wrapper">
                  <Editor
                    value={String(item.contentTitle || "")}
                    onTextChange={(e) =>
                      updateContentItem(index, "contentTitle", String(e.htmlValue || ""))
                    }
                    onLoad={attachEditorVideoUploadHandler}
                    headerTemplate={descriptionEditorHeader}
                    style={{ height: "120px" }}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <div className="blogdetails-editor-wrapper">
                  <Editor
                    value={String(item.description || "")}
                    onTextChange={(e) =>
                      updateContentItem(index, "description", String(e.htmlValue || ""))
                    }
                    onLoad={attachEditorVideoUploadHandler}
                    headerTemplate={descriptionEditorHeader}
                    style={{ height: "220px" }}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Gallery Images</Form.Label>
                <label className="blogdetails-upload-box">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="blogdetails-hidden-input"
                    onChange={(e) => {
                      addGalleryImages(index, Array.from(e.target.files || []), {
                        openStudio: true,
                        selectFirstAdded: true,
                      });
                      e.target.value = "";
                    }}
                  />
                  <span className="blogdetails-upload-title">Drop images here or click to upload</span>
                  <span className="blogdetails-upload-subtitle">
                    Supports multiple files. Open studio to arrange and edit.
                  </span>
                </label>

                {item.gallaryImages?.length > 0 && (
                  <>
                    {isEdit && item.gallaryImages.some((asset) => asset.existingUrl) && (
                      <div className="mb-2">
                        <div className="small fw-semibold mb-2">Replace Existing Images By Index</div>
                        <div className="blogdetails-inline-preview-list">
                          {item.gallaryImages
                            .filter((asset) => asset.existingUrl)
                            .map((asset, existingDisplayIndex) => (
                              <div key={`replace_${asset.id}`} className="blogdetails-inline-preview-card">
                                <img
                                  src={asset.previewUrl}
                                  alt={`existing-${existingDisplayIndex + 1}`}
                                  className="blogdetails-inline-preview-image"
                                />
                                <span className="blogdetails-inline-preview-index">
                                  Index {asset.existingIndex}
                                </span>
                                <label className="btn btn-sm btn-outline-primary mt-1">
                                  Change
                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      handleReplaceExistingGalleryImage(index, asset.id, file);
                                      e.target.value = "";
                                    }}
                                  />
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="blogdetails-gallery-summary">
                      <span>{item.gallaryImages.length} images selected</span>
                      <Button
                        type="button"
                        variant="dark"
                        size="sm"
                        onClick={() => openImageStudio(index)}
                      >
                        Open Image Studio
                      </Button>
                    </div>

                    <div className="blogdetails-inline-preview-list">
                      {item.gallaryImages.map((asset, imageIndex) => (
                        <div key={asset.id} className="blogdetails-inline-preview-card">
                          <img
                            src={asset.previewUrl}
                            alt={`uploaded-${imageIndex + 1}`}
                            className="blogdetails-inline-preview-image"
                          />
                          <span className="blogdetails-inline-preview-index">
                            {imageIndex + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Video File</Form.Label>
                <label className="blogdetails-video-upload-box">
                  <input
                    type="file"
                    accept="video/*"
                    className="blogdetails-hidden-input"
                    onChange={(e) =>
                      handleVideoChange(index, e.target.files?.[0] || null)
                    }
                  />
                  <span className="blogdetails-video-title">
                    {(item.video || item.existingVideoUrl) ? "Replace Video" : "Upload Video"}
                  </span>
                  <span className="blogdetails-video-subtitle">
                    MP4, WebM, MOV supported
                  </span>
                </label>

                {(item.video || item.existingVideoUrl) ? (
                  <div className="blogdetails-video-preview-card">
                    <video
                      controls
                      className="blogdetails-video-preview"
                      src={item.videoPreviewUrl}
                    />
                    <div className="blogdetails-video-meta">
                      <div className="blogdetails-video-name">{item.video?.name || item.existingVideoUrl?.split("/").pop() || "video"}</div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => clearVideo(index)}
                      >
                        Remove Video
                      </button>
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </div>
          ))}
          </section>

          <div className="blogdetails-actionbar">
            <Button type="button" variant="outline-primary" onClick={addContentBlock}>
              + Add Content Block
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update Blog Details" : "Create Blog Details"}
            </Button>
          </div>
        </Form>
      </div>

      {imageStudio.open && imageStudio.contentIndex !== null && (
        <div className="blogdetails-studio-overlay" onClick={closeImageStudio}>
          <div className="blogdetails-studio-shell" onClick={(e) => e.stopPropagation()}>
            <div className="blogdetails-studio-header">
              <h5>Image Studio - Section {imageStudio.contentIndex + 1}</h5>
              <button type="button" className="btn btn-sm btn-outline-dark" onClick={closeImageStudio}>
                Close
              </button>
            </div>

            <div className="blogdetails-studio-body">
              <div className="blogdetails-studio-left">
                <label className="blogdetails-upload-box">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="blogdetails-hidden-input"
                    onChange={(e) => {
                      addGalleryImages(
                        imageStudio.contentIndex,
                        Array.from(e.target.files || []),
                        { selectFirstAdded: true }
                      );
                      e.target.value = "";
                    }}
                  />
                  <span className="blogdetails-upload-title">Add More Images</span>
                  <span className="blogdetails-upload-subtitle">Drag to arrange order</span>
                </label>

                <DragDropContext onDragEnd={onStudioDragEnd}>
                  <Droppable droppableId="studio-image-list">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="blogdetails-studio-list">
                        {studioAssets.map((asset, idx) => (
                          <Draggable key={asset.id} draggableId={asset.id} index={idx}>
                            {(dragProvided) => (
                              <button
                                type="button"
                                className={`blogdetails-studio-thumb ${imageStudio.selectedAssetId === asset.id ? "active" : ""}`}
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                onClick={() =>
                                  setImageStudio((prev) => ({ ...prev, selectedAssetId: asset.id }))
                                }
                              >
                                <span className="blogdetails-studio-order">{idx + 1}</span>
                                <img src={asset.previewUrl} alt={`thumb-${idx + 1}`} />
                              </button>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              <div className="blogdetails-studio-right">
                {selectedStudioAsset ? (
                  <>
                    <div className="blogdetails-cropper-wrap">
                      <img
                        src={selectedStudioAsset.previewUrl}
                        alt="Selected for editing"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                    <div className="blogdetails-image-editor">
                      <h6>Edit Selected Image</h6>
                      <div className="blogdetails-zoom-row">
                        <label>Zoom</label>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.01"
                          value={selectedStudioAsset.zoom || 1}
                          onChange={(e) =>
                            updateAssetZoom(
                              imageStudio.contentIndex,
                              selectedStudioAsset.id,
                              Number(e.target.value)
                            )
                          }
                        />
                        <span>{(selectedStudioAsset.zoom || 1).toFixed(2)}x</span>
                      </div>
                      <div className="blogdetails-editor-row">
                        <label>W</label>
                        <input
                          type="number"
                          min="1"
                          value={selectedStudioAsset.resizeWidth}
                          onChange={(e) =>
                            updateImageEditField(
                              imageStudio.contentIndex,
                              selectedStudioAsset.id,
                              "resizeWidth",
                              e.target.value
                            )
                          }
                        />
                        <label>H</label>
                        <input
                          type="number"
                          min="1"
                          value={selectedStudioAsset.resizeHeight}
                          onChange={(e) =>
                            updateImageEditField(
                              imageStudio.contentIndex,
                              selectedStudioAsset.id,
                              "resizeHeight",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            applyImageEdit(imageStudio.contentIndex, selectedStudioAsset.id)
                          }
                        >
                          Apply Crop/Resize
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            removeGalleryImage(imageStudio.contentIndex, selectedStudioAsset.id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="blogdetails-empty-studio">
                    Upload images to start arranging.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
