// import React, { useState } from "react";
// import {
//   ChevronRight,
//   ChevronDown,
//   LayoutGrid,
//   Layers,
//   Trash2,
//   Edit3,
//   X,
//   GripVertical,
//   Plus,
// } from "lucide-react";

// import "../../assets/style/orderservice.css";
// import {
//   category as categoryList,
//   sub_category as subCategoryList,
//   sub_sub_category as serviceList
// } from "../../DynamicJsonList/Users.js";

// const buildHierarchy = () => ({
//   categories: categoryList.map((cat, cIndex) => ({
//     category_id: cat.category_id,
//     category_name: cat.category_name,
//     order_index: cat.order_index ?? cIndex,

//     subcategories: subCategoryList
//       .filter(sub => sub.category_id === cat.category_id)
//       .map((sub, sIndex) => ({
//         sub_category_id: sub.sub_category_id,
//         sub_category_name: sub.sub_category_name,
//         status: sub.status || "active",
//         order_index: sub.order_index ?? sIndex,

//         services: serviceList
//           .filter(srv => srv.sub_category_id === sub.sub_category_id)
//           .map((srv, iIndex) => ({
//             id: srv.service_id,
//             title: srv.service_name,
//             price: srv.price || "",
//             status: srv.status || "active",
//             order_index: srv.order_index ?? iIndex
//           }))
//       }))
//   }))
// });

// const OrderService = () => {

// const [data, sedivata] = useState(buildHierarchy());
// const [edidivata, setEdidivata] = useState(null);
// const [showEditModal, setShowEditModal] = useState(false);

// //   const [openIds, setOpenIds] = useState(["1", "2"]);
// const [openIds, setOpenIds] = useState(
//   categoryList.map(c => c.category_id)
// );

//   const [draggedItem, sedivraggedItem] = useState(null);

//   const toggleOpen = (id) => {
//     setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const handleToggleStatus = (catId, subId, serviceId) => {
//     const newData = JSON.parse(JSON.stringify(data));
//     const category = newData.categories.find(c => c.category_id === catId);
//     const sub = category.subcategories.find(s => s.sub_category_id === subId);
//     //  const sub = category.subcategories.find(s => s.sub_category_id === subId);
//     if (serviceId) {
//       const service = sub.services.find(s => s.id === serviceId);
//       service.status = service.status === "active" ? "inactive" : "active";
//     } else {
//       sub.status = sub.status === "active" ? "inactive" : "active";
//     }
//     sedivata(newData);
//   };

//   const onDragStart = (e, item) => {
//     sedivraggedItem(item);
//   };

//   const onDragOver = (e) => e.prevendivefault();

//   const onDrop = (e, type, targetIdx, parents = {}) => {
//     e.prevendivefault();
//     if (!draggedItem || draggedItem.type !== type) return;

//     const newData = JSON.parse(JSON.stringify(data));

//     if (type === "category") {
//       const list = newData.categories;
//       const [m] = list.splice(draggedItem.index, 1);
//       list.splice(targetIdx, 0, m);
//       list.forEach((x, i) => x.order_index = i);
//     }

//     if (type === "subcategory") {
//       const cat = newData.categories.find(c => c.category_id === parents.catId);
//       const [m] = cat.subcategories.splice(draggedItem.index, 1);
//       cat.subcategories.splice(targetIdx, 0, m);
//       cat.subcategories.forEach((x, i) => x.order_index = i);
//     }

//     if (type === "service") {
//       const cat = newData.categories.find(c => c.category_id === parents.catId);
//       const sub = cat.subcategories.find(s => s.sub_category_id === parents.subId);
//       const [m] = sub.services.splice(draggedItem.index, 1);
//       sub.services.splice(targetIdx, 0, m);
//       sub.services.forEach((x, i) => x.order_index = i);
//     }

//     sedivata(newData);
//     sedivraggedItem(null);
//   };
// const deleteCategory = (catId) => {
//   if (!window.confirm("Delete this category?")) return;

//   sedivata(prev => ({
//     ...prev,
//     categories: prev.categories.filter(
//       c => c.category_id !== catId
//     )
//   }));
// };

// const deleteSubCategory = (catId, subId) => {
//   if (!window.confirm("Delete this sub category?")) return;

//   sedivata(prev => ({
//     ...prev,
//     categories: prev.categories.map(c =>
//       c.category_id === catId
//         ? {
//             ...c,
//             subcategories: c.subcategories.filter(
//               s => s.sub_category_id !== subId
//             )
//           }
//         : c
//     )
//   }));
// };

// const deleteService = (catId, subId, serviceId) => {
//   if (!window.confirm("Delete this service?")) return;

//   sedivata(prev => ({
//     ...prev,
//     categories: prev.categories.map(c =>
//       c.category_id === catId
//         ? {
//             ...c,
//             subcategories: c.subcategories.map(s =>
//               s.sub_category_id === subId
//                 ? {
//                     ...s,
//                     services: s.services.filter(
//                       ser => ser.id !== serviceId
//                     )
//                   }
//                 : s
//             )
//           }
//         : c
//     )
//   }));
// };

// const handleSaveEdit = () => {
//   const { type, catId, subId, serviceId, value } = edidivata;

//   sedivata(prev => ({
//     ...prev,
//     categories: prev.categories.map(cat => {
//       if (cat.category_id !== catId) return cat;

//       if (type === "category") {
//         return { ...cat, category_name: value };
//       }

//       if (type === "sub_category") {
//         return {
//           ...cat,
//           subcategories: cat.subcategories.map(sub =>
//             sub.sub_category_id === subId
//               ? { ...sub, sub_category_name: value }
//               : sub
//           )
//         };
//       }

//       if (type === "service") {
//         return {
//           ...cat,
//           subcategories: cat.subcategories.map(sub =>
//             sub.sub_category_id === subId
//               ? {
//                   ...sub,
//                   services: sub.services.map(s =>
//                     s.id === serviceId ? { ...s, title: value } : s
//                   )
//                 }
//               : sub
//           )
//         };
//       }

//       return cat;
//     })
//   }));

//   setShowEditModal(false);
// };

//   return (
//     <div className="app">
//       <div className="layout">

//         <header className="header">
//           <div>
//             <h1 >Service Architecture</h1>
//             <p>Hierarchical reordering with auto-indexed values.</p>
//           </div>
//           <div className="status-badge">Auto Sync Active</div>
//         </header>

//         {data.categories.map((cat, cIdx) => (
//           <div
//             key={cat.category_id}
//             className="category-card"
//             onDragOver={onDragOver}
//             onDrop={(e) => onDrop(e, "category", cIdx)}
//           >
//             <div
//               draggable
//               onDragStart={(e) => onDragStart(e, { type: "category", index: cIdx })}
//               className="category-row"
//             >
//               <div className="left">
//                 <GripVertical className="grip" />
//                 <button className="toggle" onClick={() => toggleOpen(cat.category_id)}>
//                   {openIds.includes(cat.category_id) ? <ChevronDown /> : <ChevronRight />}
//                 </button>
//                 <div>
//                   <h2>{cat.category_name}</h2>
//                   <span className="small">Order Index: {cat.order_index}</span>
//                 </div>
//               </div>

//               <div className="right">
//                <button
//   onClick={() =>
//     setEdidivata({
//       type: "category",
//       catId: cat.category_id,
//       value: cat.category_name
//     }) || setShowEditModal(true)
//   }
// >
//   <Edit3 />
// </button>

//                 <button className="danger"
//      onClick={() => deleteCategory(cat.category_id)}><Trash2 /></button>
//               </div>
//             </div>

//             {openIds.includes(cat.category_id) && (
//               <div className="subcategory-wrap">

//                 {cat.subcategories.map((sub, sIdx) => (
//                   <div
//                     key={sub.sub_category_id}
//                     className="subcategory-container"
//                     onDragOver={onDragOver}
//                     onDrop={(e) => onDrop(e, "subcategory", sIdx, { catId: cat.category_id })}
//                   >
//                     <div
//                       draggable
//                       onDragStart={(e) => onDragStart(e, { type: "subcategory", index: sIdx, catId: cat.category_id })}
//                       className={`subcategory-row ${sub.status !== "active" ? "inactive" : ""}`}
//                     >
//                       <div className="left">
//                         <GripVertical className="grip" />
//                         <button className="toggle" onClick={() => toggleOpen(sub.sub_category_id)}>
//                           {openIds.includes(sub.sub_category_id) ? <ChevronDown /> : <ChevronRight />}
//                         </button>
//                         <Layers />
//                         <div>
//                           <strong>{sub.sub_category_name}</strong>
//                           <div className="small">Order: {sub.order_index}</div>
//                         </div>
//                       </div>

//                       <label className="switch">
//                         <input
//                           type="checkbox"
//                           checked={sub.status === "active"}
//                           onChange={() => handleToggleStatus(cat.category_id, sub.sub_category_id)}
//                         />
//                         <span></span>
//                       </label>
//                        <div className="right">
//                 <button
//   onClick={() =>
//     setEdidivata({
//       type: "sub_category",
//       catId: cat.category_id,
//       subId: sub.sub_category_id,
//       value: sub.sub_category_name
//     }) || setShowEditModal(true)
//   }
// >
//   <Edit3 />
// </button>

//                 <button className="danger"
//       onClick={() =>
//     deleteSubCategory(cat.category_id, sub.sub_category_id)
//   }><Trash2 /></button>
//               </div>
//                     </div>

//                     {openIds.includes(sub.sub_category_id) && (
//                       <div className="services">
//                         {sub.services.map((ser, i) => (
//                           <div
//                             key={ser.id}
//                             draggable
//                             onDragStart={(e) => onDragStart(e, { type: "service", index: i, catId: cat.category_id, subId: sub.sub_category_id })}
//                             onDrop={(e) => onDrop(e, "service", i, { catId: cat.category_id, subId: sub.sub_category_id })}
//                             className={`service ${ser.status !== "active" ? "inactive" : ""}`}
//                           >
//                             <div className="left">
//                               <GripVertical className="grip" />
//                               <span>{ser.title}</span>
//                               <div className="small">Order: {ser.order_index}</div>
//                             </div>

//                             <div className="right">
//                               <span>{ser.price}</span>
//                              <label className="switch">
//   <input
//     type="checkbox"
//     checked={ser.status === "active"}
//     onChange={() =>
//       handleToggleStatus(
//         cat.category_id,
//         sub.sub_category_id,
//         ser.id
//       )
//     }
//   />
//   <span></span>
// </label>

//                             </div>
//                             <div>
//                             <button
//   onClick={() =>
//     setEdidivata({
//       type: "service",
//       catId: cat.category_id,
//       subId: sub.sub_category_id,
//       serviceId: ser.id,
//       value: ser.title
//     }) || setShowEditModal(true)
//   }
// >
//   <Edit3 />
// </button>

//                 <button className="danger"
//        onClick={() =>
//     deleteService(cat.category_id, sub.sub_category_id, ser.id)
//   }><Trash2 /></button>
//               </div>
//                           </div>
//                         ))}
//                         <button className="add-link"><Plus /> Add Service</button>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 <button className="add-link green"><Plus /> New Subcategory</button>
//               </div>
//             )}
//           </div>
//         ))}

//         <button className="create-root">
//           <LayoutGrid /> Create New Root Category
//         </button>
// {showEditModal && (
//   <div className="modal-overlay">
//     <div className="modal-box">
//       <h4>Edit</h4>

//       <input
//         className="form-control"
//         value={edidivata.value}
//         onChange={(e) =>
//           setEdidivata({ ...edidivata, value: e.target.value })
//         }
//       />

//       <div className="mt-3 text-end">
//         <button
//           className="btn btn-secondary me-2"
//           onClick={() => setShowEditModal(false)}
//         >
//           Cancel
//         </button>

//         <button className="btn btn-primary" onClick={handleSaveEdit}>
//           Save
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//       </div>
//     </div>
//   );
// };

// export default OrderService;

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { IoChevronDown, IoAddOutline } from "react-icons/io5";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import "./serviceStyle/serviceorder.css";

import {
  getCategories,
  getSubCategoriesByCategoryId,
  deleteCategory,
  getserviceBysubCategoryId,
  updateCategoryStatus,
  updateServicesStatus,
  updateSubCategorystatus,
  updateCategoryOrder_index,
  updateserviceOrder_index,
  updateSubCategoryOrder_index,
  deleteServices,
  deleteSubCategory,
  updateServices,
  updateSubCategory,
  addCategory,
  updateCategory,
  addServices,
  addSubCategory,

} from "../adminApi.js";
import Loader from "../app/common/loader.jsx";
import { useNavigate } from "react-router-dom";

// Build hierarchical data structure

const buildHierarchyFromApi = (categories, subCategories, services) => {
  return {
    categories: categories.map((cat, cIndex) => ({
      category_id: cat._id,
      category_name: cat.name,
      order_index: cat.order_index ?? cIndex + 1,
      status: cat.status || "active",
      subcategories: subCategories
        .filter((sub) =>
          Array.isArray(sub.category)
            ? sub.category[0]?._id === cat._id
            : sub.category === cat._id,
        )
        .map((sub, sIndex) => ({
          sub_category_id: sub._id,
          sub_category_name: sub.name,
          status: sub.status || "active",
          order_index: sub.order_index ?? sIndex + 1,
          services: services
            .filter((srv) => srv.subcategory?.[0]?._id === sub._id)
            .map((srv, iIndex) => ({
              id: srv._id,
              title: srv.name,
              indeman_service_name: srv.indeman_service_name,
              search_tag: srv.search_tag,
              indeman_sericons: srv.indeman_sericons,
              price: srv.price || "",
              status: srv.status || "active",
              order_index: srv.order_index ?? iIndex + 1,
            })),
        })),
    })),
  };
};

const OrderService = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [modalData, setModalData] = useState({
    type: "", // category | sub_category | service
    catId: null,
    subId: null,
    serviceId: null,
    name: "",
    indeman_service_name: "",
    search_tag: "",
    indeman_sericons: null,
    status: "active",
  });
  const navigate = useNavigate();
  const [data, sedivata] = useState({ categories: [] });
  // const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openIds, setOpenIds] = useState([]);
  const [openIdssubcategory, setOpenIdsSubCategory] = useState([]);

  const inputRef = useRef(null);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [showModal]);

  // ---------- FETCH ----------

  useEffect(() => {
    let isMounted = true; // ✅ prevent state update after unmount

    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch Categories
        const catRes = await getCategories();
        const categories = catRes?.category ?? [];

        if (!categories.length) {
          sedivata({ categories: [] });
          return;
        }

        // 2️⃣ Fetch Subcategories in PARALLEL
        const subCategoryPromises = categories.map((cat) =>
          getSubCategoriesByCategoryId(cat._id),
        );

        const subCategoryResponses = await Promise.all(subCategoryPromises);

        const allSubCategories = subCategoryResponses.flatMap(
          (res) => res?.subCategories ?? [],
        );

        // 3️⃣ Fetch Services in PARALLEL
        const servicePromises = allSubCategories.map((sub) =>
          getserviceBysubCategoryId(sub._id),
        );

        const serviceResponses = await Promise.all(servicePromises);

        const allServices = serviceResponses.flatMap(
          (res) => res?.services ?? [],
        );

        // 4️⃣ Build hierarchy
        const hierarchy = buildHierarchyFromApi(
          categories,
          allSubCategories,
          allServices,
        );

        if (isMounted) {
          sedivata(hierarchy);
          setOpenIds(categories.map((c) => c._id));
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          console.log("Failed to fetch data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAll();

    return () => {
      isMounted = false; // ✅ cleanup
    };
  }, []);

  const toggleOpen = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleOpenSubcategory = (id) => {
    setOpenIdsSubCategory((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleToggleStatus = async (catId, subId, serviceId) => {
    let apiCall;
    let apiArgs;
    let newStatus;

    // 🔥 Decide API & status FIRST
    const category = data.categories.find((c) => c.category_id === catId);
    if (!category) return;

    // 🔹 CATEGORY
    if (!subId && !serviceId) {
      newStatus = category.status === "active" ? "inactive" : "active";
      apiCall = updateCategoryStatus;
      apiArgs = [catId, newStatus];
    }

    // 🔹 SUBCATEGORY
    if (subId && !serviceId) {
      const sub = category.subcategories.find(
        (s) => s.sub_category_id === subId,
      );
      if (!sub) return;

      newStatus = sub.status === "active" ? "inactive" : "active";
      apiCall = updateSubCategorystatus;
      apiArgs = [subId, newStatus];
    }

    // 🔹 SERVICE
    if (serviceId) {
      const sub = category.subcategories.find(
        (s) => s.sub_category_id === subId,
      );
      const srv = sub?.services.find((s) => s.id === serviceId);
      if (!srv) return;

      newStatus = srv.status === "active" ? "inactive" : "active";
      apiCall = updateServicesStatus;
      apiArgs = [serviceId, newStatus];
    }

    // 🔥 UI UPDATE (Optimistic)
    sedivata((prev) => {
      const updated = structuredClone(prev);

      updated.categories.forEach((cat) => {
        if (cat.category_id !== catId) return;

        if (!subId && !serviceId) {
          cat.status = newStatus;
          cat.subcategories.forEach((sub) => {
            sub.status = newStatus;
            sub.services.forEach((srv) => (srv.status = newStatus));
          });
        }

        cat.subcategories.forEach((sub) => {
          if (sub.sub_category_id !== subId) return;

          if (subId && !serviceId) {
            sub.status = newStatus;
            sub.services.forEach((srv) => (srv.status = newStatus));
          }

          sub.services.forEach((srv) => {
            if (srv.id === serviceId) {
              srv.status = newStatus;
            }
          });
        });
      });

      return updated;
    });

    // 🔥 BACKEND UPDATE
    try {
      const res = await apiCall(...apiArgs);
      console.log(res, "status udat");
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  // Drag & Drop Handler
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // 🔹 BACKUP FOR ROLLBACK
    const prevData = JSON.parse(JSON.stringify(data));

    try {
      /* ===================== CATEGORY ===================== */
      if (type === "CATEGORY") {
        const updatedCategories = [...data.categories];
        const [moved] = updatedCategories.splice(source.index, 1);
        updatedCategories.splice(destination.index, 0, moved);

        const reordered = updatedCategories.map((cat, index) => ({
          ...cat,
          order_index: index + 1,
        }));

        sedivata((prev) => ({ ...prev, categories: reordered }));

        await updateCategoryOrder_index(
          reordered.map((cat) => ({
            _id: cat.category_id,
            order_index: cat.order_index,
          })),
        );
      }

      /* ===================== SUBCATEGORY ===================== */
      if (type === "SUBCATEGORY") {
        const categoryId = source.droppableId.replace("sub-", "");

        const categoriesCopy = [...data.categories];
        const category = categoriesCopy.find(
          (c) => c.category_id === categoryId,
        );

        if (!category) return;

        const updatedSub = [...category.subcategories];
        const [moved] = updatedSub.splice(source.index, 1);
        updatedSub.splice(destination.index, 0, moved);

        const reorderedSub = updatedSub.map((sub, index) => ({
          ...sub,
          order_index: index + 1,
        }));

        category.subcategories = reorderedSub;

        sedivata((prev) => ({ ...prev, categories: categoriesCopy }));

        await updateSubCategoryOrder_index(
          reorderedSub.map((sub) => ({
            _id: sub.sub_category_id,
            order_index: sub.order_index,
          })),
        );
      }

      /* ===================== SERVICE ===================== */
      if (type === "SERVICE") {
        const subCategoryId = source.droppableId.replace("srv-", "");

        const categoriesCopy = [...data.categories];
        const subCategory = categoriesCopy
          .flatMap((c) => c.subcategories)
          .find((s) => s.sub_category_id === subCategoryId);

        if (!subCategory) return;

        const updatedServices = [...subCategory.services];
        const [moved] = updatedServices.splice(source.index, 1);
        updatedServices.splice(destination.index, 0, moved);

        const reorderedServices = updatedServices.map((srv, index) => ({
          ...srv,
          order_index: index + 1,
        }));

        subCategory.services = reorderedServices;

        sedivata((prev) => ({ ...prev, categories: categoriesCopy }));

        await updateserviceOrder_index(
          reorderedServices.map((srv) => ({
            _id: srv.id,
            order_index: srv.order_index,
          })),
        );
      }
    } catch (error) {
      console.error("Order update failed, reverting UI", error);
      sedivata(prevData); // 🔁 rollback UI
    }
  };

  const handledeleteCategory = async (catId) => {
    if (!window.confirm("Delete this category?")) return;

    // 🔥 Optimistic UI update
    sedivata((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.category_id !== catId),
    }));

    try {
      await deleteCategory(catId);
    } catch (err) {
      console.error("Delete category failed", err);
      getCategories(); // rollback
    }
  };

  const handledeleteSubCategory = async (catId, subId) => {
    if (!window.confirm("Delete this sub category?")) return;

    // 🔥 Optimistic UI update
    sedivata((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.category_id === catId
          ? {
            ...c,
            subcategories: c.subcategories.filter(
              (s) => s.sub_category_id !== subId,
            ),
          }
          : c,
      ),
    }));

    try {
      await deleteSubCategory(subId);
    } catch (err) {
      console.error("Delete subcategory failed", err);
      getserviceBysubCategoryId(); // rollback
    }
  };

  const deleteService = async (catId, subId, serviceId) => {
    if (!window.confirm("Delete this service?")) return;

    // 🔥 Optimistic UI update
    sedivata((prev) => ({
      ...prev,
      categories: prev.categories.map((c) =>
        c.category_id === catId
          ? {
            ...c,
            subcategories: c.subcategories.map((s) =>
              s.sub_category_id === subId
                ? {
                  ...s,
                  services: s.services.filter(
                    (ser) => ser.id !== serviceId,
                  ),
                }
                : s,
            ),
          }
          : c,
      ),
    }));

    try {
      await deleteServices(serviceId);
    } catch (err) {
      console.error("Delete service failed", err);
      getserviceBysubCategoryId(); // rollback
    }
  };

  // CREATE
  const openCreateModal = (
    type,
    catId = null,
    subId = null,
    serviceId = null,
  ) => {
    setModalData({
      type,
      catId,
      subId,
      serviceId,
      indeman_service_name: "",
      search_tag: "",
      name: "",
      status: "active",
    });
    setEditId(false);
    setShowModal(true);
  };

  // Edid
  const openEditModal = ({
    type,
    catId = null,
    subId = null,
    serviceId = null,
    name = "",
    indeman_service_name = "",
    search_tag = "",
    status = "active",
  }) => {
    setModalData({
      type,
      catId,
      subId,
      serviceId,
      name,
      indeman_service_name,
      search_tag,
      status,
    });
    setEditId(true);
    setShowModal(true);
  };

  //   const handleSaveModal = async (e) => {
  //     e.preventDefault();
  //     const { type, catId, subId, serviceId, name, status,indeman_service_name,indeman_sericons,
  //     search_tag } = modalData;

  //     if (!name.trim()) {
  //       alert("Name is required");
  //       return;
  //     }

  //     try {
  //       /* ========== CATEGORY ========== */
  //       if (type === "category") {
  //         if (catId) {
  //           await updateCategory(catId, { name, status });

  //           sedivata((prev) => ({
  //             ...prev,
  //             categories: prev.categories.map((cat) =>
  //               cat.category_id === catId
  //                 ? { ...cat, category_name: name, status }
  //                 : cat,
  //             ),
  //           }));
  //         } else {
  //           const res = await addCategory({ name, status });
  //           const newCat = res.data?.category || res.category;

  //           sedivata((prev) => ({
  //             ...prev,
  //             categories: [
  //               ...prev.categories,
  //               {
  //                 category_id: newCat._id,
  //                 category_name: newCat.name,
  //                 status: newCat.status,
  //                 subcategories: [],
  //               },
  //             ],
  //           }));
  //         }
  //       }

  //       /* ========== SUBCATEGORY ========== */
  //       if (type === "sub_category") {
  //         if (subId) {
  //           // ===== UPDATE =====
  //           await updateSubCategory(subId, { name, status });

  //           sedivata((prev) => ({
  //             ...prev,
  //             categories: prev.categories.map((cat) =>
  //               cat.category_id === catId
  //                 ? {
  //                     ...cat,
  //                     subcategories: cat.subcategories.map((sub) =>
  //                       sub.sub_category_id === subId
  //                         ? {
  //                             ...sub,
  //                             sub_category_name: name,
  //                             status,
  //                           }
  //                         : sub,
  //                     ),
  //                   }
  //                 : cat,
  //             ),
  //           }));

  //           // setShowModal(false);
  //         } else {
  //           // ===== CREATE =====
  //           const res = await addSubCategory({
  //             category: catId,
  //             name,
  //             status,
  //           });

  //           // 🔥 SAFE EXTRACTION (MOST IMPORTANT LINE)
  //           const newSub = res?.data?.subCategory || res?.subCategory;
  //           console.log(newSub, "sunicdkk");
  //           if (!newSub || !newSub._id) {
  //             console.error("Invalid subcategory response", res);
  //             return;
  //           }

  //           // ✅ STATE UPDATE (INSTANT UI)
  //           sedivata((prev) => ({
  //             ...prev,
  //             categories: prev.categories.map((cat) =>
  //               cat.category_id === catId
  //                 ? {
  //                     ...cat,
  //                     subcategories: [
  //                       ...cat.subcategories,
  //                       {
  //                         sub_category_id: newSub._id,
  //                         sub_category_name: newSub.name,
  //                         status: newSub.status,
  //                         services: [],
  //                       },
  //                     ],
  //                   }
  //                 : cat,
  //             ),
  //           }));
  //         }
  //       }

  //       /* ========== SERVICE ========== */
  //       if (type === "service") {
  //         if (serviceId) {
  //          await updateServices(serviceId, {
  //   name,
  //   indeman_service_name,
  //   search_tag,
  //   indeman_sericons,
  //   status,
  // });


  //           sedivata((prev) => ({
  //             ...prev,
  //             categories: prev.categories.map((cat) =>
  //               cat.category_id === catId
  //                 ? {
  //                     ...cat,
  //                     subcategories: cat.subcategories.map((sub) =>
  //                       sub.sub_category_id === subId
  //                         ? {
  //                             ...sub,
  //                             services: sub.services.map((s) =>
  //                               s.id === serviceId
  //                                 ? { ...s, title: name,indeman_service_name,indeman_sericons,
  //     search_tag, status }
  //                                 : s,
  //                             ),
  //                           }
  //                         : sub,
  //                     ),
  //                   }
  //                 : cat,
  //             ),
  //           }));

  //           setShowModal(false); // ✅ close modal
  //         } else {

  //           const res = await addServices({
  //   category: catId,
  //   subcategory: subId,
  //   name,
  //   indeman_service_name,
  //   search_tag,
  //   indeman_sericons,
  //   status,
  // });


  //           const newSrv = res?.data || res;
  //           console.log(newSrv, "service data");
  //           if (!newSrv || !newSrv._id) {
  //             console.error("Invalid service response", res);
  //             return;
  //           }

  //           sedivata((prev) => ({
  //             ...prev,
  //             categories: prev.categories.map((cat) =>
  //               cat.category_id === catId
  //                 ? {
  //                     ...cat,
  //                     subcategories: cat.subcategories.map((sub) =>
  //                       sub.sub_category_id === subId
  //                         ? {
  //                             ...sub,
  //                             services: [
  //                               ...sub.services,
  //                               {
  //                                 id: newSrv._id,
  //                                 title: newSrv.name,
  //                                 status: newSrv.status,
  //                                 price: newSrv.price || "",
  //                                 indeman_service_name:newSrv.indeman_service_name,
  //     search_tag:newSrv.search_tag,
  //     indeman_sericons:newSrv.indeman_sericons,
  //                                 order_index: sub.services.length + 1,
  //                               },
  //                             ],
  //                           }
  //                         : sub,
  //                     ),
  //                   }
  //                 : cat,
  //             ),
  //           }));

  //           setShowModal(false); // ✅ close modal
  //         }
  //       }

  //       setShowModal(false);
  //     } catch (err) {
  //       setShowModal(false);
  //       console.error(err);
  //       alert("Operation failed");
  //     }
  //   };

  const handleSaveModal = async (e) => {
    e.preventDefault();

    const {
      type,
      catId,
      subId,
      serviceId,
      name,
      status,
      indeman_service_name,
      search_tag,
      indeman_sericons, // ✅ VERY IMPORTANT
    } = modalData;

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      /* ================= CATEGORY ================= */
      if (type === "category") {
        if (catId) {
          await updateCategory(catId, { name, status });

          sedivata((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
              cat.category_id === catId
                ? { ...cat, category_name: name, status }
                : cat
            ),
          }));
        } else {
          const res = await addCategory({ name, status });
          const newCat = res?.data?.category || res?.category;

          sedivata((prev) => ({
            ...prev,
            categories: [
              ...prev.categories,
              {
                category_id: newCat._id,
                category_name: newCat.name,
                status: newCat.status,
                subcategories: [],
              },
            ],
          }));
        }
      }

      /* ================= SUBCATEGORY ================= */
      if (type === "sub_category") {
        if (subId) {
          await updateSubCategory(subId, { name, status });

          sedivata((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
              cat.category_id === catId
                ? {
                  ...cat,
                  subcategories: cat.subcategories.map((sub) =>
                    sub.sub_category_id === subId
                      ? { ...sub, sub_category_name: name, status }
                      : sub
                  ),
                }
                : cat
            ),
          }));
        } else {
          const res = await addSubCategory({
            category: catId,
            name,
            status,
          });

          const newSub = res?.data?.subCategory || res?.subCategory;

          sedivata((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
              cat.category_id === catId
                ? {
                  ...cat,
                  subcategories: [
                    ...cat.subcategories,
                    {
                      sub_category_id: newSub._id,
                      sub_category_name: newSub.name,
                      status: newSub.status,
                      services: [],
                    },
                  ],
                }
                : cat
            ),
          }));
        }
      }

      /* ================= SERVICE ================= */
      if (type === "service") {
        //       if (serviceId) {
        //         const formData = new FormData();

        // formData.append("name", name);
        // formData.append("indeman_service_name", indeman_service_name);
        // formData.append("search_tag", search_tag);
        // formData.append("status", status);

        // if (indeman_sericons) {
        //   formData.append("indeman_sericons", indeman_sericons);
        // }

        //  await updateServices(serviceId, formData);

        //         // await updateServices(serviceId, {
        //         //   name,
        //         //   indeman_service_name,
        //         //   search_tag,
        //         //   indeman_sericons,
        //         //   status,
        //         // });

        //         sedivata((prev) => ({
        //           ...prev,
        //           categories: prev.categories.map((cat) =>
        //             cat.category_id === catId
        //               ? {
        //                   ...cat,
        //                   subcategories: cat.subcategories.map((sub) =>
        //                     sub.sub_category_id === subId
        //                       ? {
        //                           ...sub,
        //                           services: sub.services.map((srv) =>
        //                             srv.id === serviceId
        //                               ? {
        //                                   ...srv,
        //                                   title: name,
        //                                   indeman_service_name,
        //                                   search_tag,
        //                                   indeman_sericons,
        //                                   status,
        //                                 }
        //                               : srv
        //                           ),
        //                         }
        //                       : sub
        //                   ),
        //                 }
        //               : cat
        //           ),
        //         }));
        //       } 
        if (serviceId) {
          const formData = new FormData();

          formData.append("name", name);
          formData.append("indeman_service_name", indeman_service_name);
          formData.append("search_tag", search_tag);
          formData.append("status", status);

          // ✅ Only append file if user selected a NEW one
          if (indeman_sericons instanceof File) {
            formData.append("indeman_sericons", indeman_sericons);
          }

          await updateServices(serviceId, formData);

          // ✅ Update UI
          sedivata((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
              cat.category_id === catId
                ? {
                  ...cat,
                  subcategories: cat.subcategories.map((sub) =>
                    sub.sub_category_id === subId
                      ? {
                        ...sub,
                        services: sub.services.map((srv) =>
                          srv.id === serviceId
                            ? {
                              ...srv,
                              title: name,
                              indeman_service_name,
                              search_tag,
                              indeman_sericons:
                                indeman_sericons instanceof File
                                  ? URL.createObjectURL(indeman_sericons)
                                  : srv.indeman_sericons,
                              status,
                            }
                            : srv
                        ),
                      }
                      : sub
                  ),
                }
                : cat
            ),
          }));
        }

        else {
          const formData = new FormData();

          formData.append("category", catId);
          formData.append("subcategory", subId);
          formData.append("name", name);
          formData.append("indeman_service_name", indeman_service_name);
          formData.append("search_tag", search_tag);
          formData.append("status", status);

          // ✅ FILE
          if (indeman_sericons) {
            formData.append("indeman_sericons", indeman_sericons);
          }

          const res = await addServices(formData);

          // const res = await addServices({
          //   category: catId,
          //   subcategory: subId,
          //   name,
          //   indeman_service_name,
          //   search_tag,
          //   indeman_sericons,
          //   status,
          // });

          const newSrv = res?.data || res;

          sedivata((prev) => ({
            ...prev,
            categories: prev.categories.map((cat) =>
              cat.category_id === catId
                ? {
                  ...cat,
                  subcategories: cat.subcategories.map((sub) =>
                    sub.sub_category_id === subId
                      ? {
                        ...sub,
                        services: [
                          ...sub.services,
                          {
                            id: newSrv._id,
                            title: newSrv.name,
                            indeman_service_name: newSrv.indeman_service_name,
                            search_tag: newSrv.search_tag,
                            indeman_sericons: newSrv.indeman_sericons,
                            status: newSrv.status,
                            order_index: sub.services.length + 1,
                          },
                        ],
                      }
                      : sub
                  ),
                }
                : cat
            ),
          }));
        }
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Operation failed");
      setShowModal(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };

    if (showModal) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  return (
    <div className="apps">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="layouts">
          <header className="headers">
            <h1>Service Architecture</h1>

            <button
              className="btn btn-primary"
              onClick={() => openCreateModal("category")}
            >
              Create Category
            </button>
          </header>

          {/* CATEGORY DROPPABLE */}
          <Droppable droppableId="categoriess" type="CATEGORY">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {/* add new code here  */}
                {loading ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    {/* <div className="loaders">Loading...</div> */}
                    <Loader />
                  </div>
                ) : data.categories.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    NO Category found...
                  </div>
                ) : (
                  data.categories.map((cat, cIdx) => (
                    <Draggable
                      draggableId={`cat-${cat.category_id}`}
                      index={cIdx}
                      key={cat.category_id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="category-cards"
                        >
                          {/* CATEGORY ROW */}
                          <div
                            className="category-rows"
                            onClick={() => toggleOpen(cat.category_id)}
                          >
                            <div className="lefts">
                              <div>
                                {openIds.includes(cat.category_id) ? (
                                  <IoChevronDown size={18} />
                                ) : (
                                  <ChevronRight size={18} />
                                )}
                              </div>
                              <div className="category_headings">
                                <h2 className="category_names">
                                  <span>Category</span>
                                  {cat.category_name}
                                </h2>
                              </div>
                            </div>

                            <div
                              className="rights d-flex"
                              style={{ columnGap: "1rem" }}
                            >
                              <label className="switchs">
                                <input
                                  type="checkbox"
                                  checked={cat.status === "active"}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={() =>
                                    handleToggleStatus(cat.category_id)
                                  }
                                />
                                <span></span>
                              </label>

                              <div
                                className="edits"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal({
                                    type: "category",
                                    catId: cat.category_id,
                                    name: cat.category_name,
                                    status: cat.status,
                                  });
                                }}
                              >
                                <FaRegEdit size={15} />
                              </div>

                              <div
                                className="deletes"
                                onClick={() =>
                                  handledeleteCategory(cat.category_id)
                                }
                              >
                                <MdDeleteOutline size={15} />
                              </div>
                            </div>
                          </div>

                          {/* SUBCATEGORY */}
                          {openIds.includes(cat.category_id) && (
                            <Droppable
                              droppableId={`sub-${cat.category_id}`}
                              type="SUBCATEGORY"
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="subcategory-wraps"
                                >
                                  <div className="my-divs">
                                    <>
                                      {cat.subcategories.map((sub, sIdx) => (
                                        <Draggable
                                          draggableId={`sub-${sub.sub_category_id}`}
                                          index={sIdx}
                                          key={sub.sub_category_id}
                                        >
                                          {(provided) => (
                                            <div className="subcategory_data_table">
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={"subcategory-table"}
                                                onClick={() =>
                                                  toggleOpenSubcategory(
                                                    sub.sub_category_id,
                                                  )
                                                }
                                              >
                                                <div className="lefts">
                                                  <div
                                                    style={{
                                                      marginLeft: "0.8rem",
                                                    }}
                                                  >
                                                    {openIdssubcategory.includes(
                                                      sub.sub_category_id,
                                                    ) ? (
                                                      <IoChevronDown
                                                        size={18}
                                                      />
                                                    ) : (
                                                      <ChevronRight size={18} />
                                                    )}
                                                  </div>
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      columnGap: "1rem",
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        fontSize: "16px",
                                                        fontWeight: "400",
                                                        color: "#265083",
                                                      }}
                                                    >
                                                      SubCategory
                                                    </span>
                                                    {sub.sub_category_name}
                                                  </div>
                                                </div>

                                                <div>
                                                  <label
                                                    className="switchs"
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      checked={
                                                        sub.status === "active"
                                                      }
                                                      onClick={(e) =>
                                                        e.stopPropagation()
                                                      }
                                                      onChange={() =>
                                                        handleToggleStatus(
                                                          cat.category_id,
                                                          sub.sub_category_id,
                                                        )
                                                      }
                                                    />
                                                    <span></span>
                                                  </label>
                                                </div>

                                                <div
                                                  style={{
                                                    textAlign: "center",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    gap: "1rem",
                                                  }}
                                                >
                                                  <span
                                                    className="edits"
                                                    onClick={() =>
                                                      openEditModal({
                                                        type: "sub_category",
                                                        catId: cat.category_id,
                                                        subId:
                                                          sub.sub_category_id,
                                                        name: sub.sub_category_name,
                                                        status: sub.status,
                                                      }) ||
                                                      setShowEditModal(true)
                                                    }
                                                  >
                                                    <FaRegEdit size={15} />
                                                  </span>

                                                  <span
                                                    className="deletes"
                                                    onClick={() =>
                                                      handledeleteSubCategory(
                                                        cat.category_id,
                                                        sub.sub_category_id,
                                                      )
                                                    }
                                                  >
                                                    <MdDeleteOutline
                                                      size={15}
                                                    />
                                                  </span>
                                                </div>
                                              </div>

                                              {/* SERVICES */}
                                              {openIdssubcategory.includes(
                                                sub.sub_category_id,
                                              ) && (
                                                  <Droppable
                                                    droppableId={`srv-${sub.sub_category_id}`}
                                                    type="SERVICE"
                                                  >
                                                    {(provided) => (
                                                      <div>
                                                        <div colSpan="3">
                                                          <div
                                                            ref={
                                                              provided.innerRef
                                                            }
                                                            {...provided.droppableProps}
                                                            className="services-blocks"
                                                          >
                                                            {sub.services.map(
                                                              (ser, i) => (
                                                                <Draggable
                                                                  draggableId={`srv-${ser.id}`}
                                                                  index={i}
                                                                  key={ser.id}
                                                                >
                                                                  {(provided) => (
                                                                    <div
                                                                      ref={
                                                                        provided.innerRef
                                                                      }
                                                                      {...provided.draggableProps}
                                                                      {...provided.dragHandleProps}
                                                                      className="service-items"
                                                                    >
                                                                      {/* <div className="dots"></div> */}

                                                                      <div
                                                                        style={{
                                                                          flex: 1,
                                                                          gap: "1rem",
                                                                          fontSize:
                                                                            "16px",
                                                                          fontWeight:
                                                                            "400",
                                                                        }}
                                                                      >
                                                                        <span
                                                                          style={{
                                                                            color:
                                                                              "#145aaf",
                                                                            paddingRight:
                                                                              "1rem",
                                                                          }}
                                                                        >
                                                                          Service
                                                                        </span>
                                                                        {
                                                                          ser.title
                                                                        }
                                                                      </div>
                                                                      <div className="action_div">
                                                                        <label
                                                                          className="switchs"
                                                                          style={{
                                                                            cursor:
                                                                              "pointer",
                                                                          }}
                                                                        >
                                                                          <input
                                                                            type="checkbox"
                                                                            checked={
                                                                              ser.status ===
                                                                              "active"
                                                                            }
                                                                            onChange={() =>
                                                                              handleToggleStatus(
                                                                                cat.category_id,
                                                                                sub.sub_category_id,
                                                                                ser.id,
                                                                              )
                                                                            }
                                                                          />
                                                                          <span></span>
                                                                        </label>
                                                                        <div
                                                                          style={{
                                                                            textAlign:
                                                                              "center",
                                                                            display:
                                                                              "flex",
                                                                            justifyContent:
                                                                              "center",
                                                                            gap: "1rem",
                                                                          }}
                                                                        >
                                                                          <span
                                                                            className="edits"
                                                                            onClick={() =>
                                                                              openEditModal(
                                                                                {
                                                                                  type: "service",
                                                                                  catId: cat.category_id,
                                                                                  subId: sub.sub_category_id,
                                                                                  serviceId: ser.id,
                                                                                  name: ser.title,
                                                                                  indeman_service_name: ser.indeman_service_name || "",
                                                                                  search_tag: ser.search_tag || "",
                                                                                  indeman_sericons: ser.indeman_sericons || null, // URL
                                                                                  status: ser.status,
                                                                                },
                                                                              ) ||
                                                                              setShowEditModal(
                                                                                true,
                                                                              )
                                                                            }
                                                                          >
                                                                            <FaRegEdit
                                                                              size={
                                                                                15
                                                                              }
                                                                            />
                                                                          </span>

                                                                          <span
                                                                            className="deletes"
                                                                            onClick={() =>
                                                                              deleteService(
                                                                                cat.category_id,
                                                                                sub.sub_category_id,
                                                                                ser.id,
                                                                              )
                                                                            }
                                                                          >
                                                                            <MdDeleteOutline
                                                                              size={
                                                                                15
                                                                              }
                                                                            />
                                                                          </span>
                                                                          <span
                                                                            className="edits"
                                                                            onClick={() =>
                                                                              navigate(
                                                                                `/admin/Services-details/${ser.id}`,
                                                                                {
                                                                                  state:
                                                                                  {
                                                                                    serviceName:
                                                                                      ser.title,
                                                                                    categoryName:
                                                                                      cat.category_name,
                                                                                    subcategoryName:
                                                                                      sub.sub_category_name,
                                                                                  },
                                                                                },
                                                                              )
                                                                            }
                                                                          >
                                                                            <IoAddOutline
                                                                              size={
                                                                                15
                                                                              }
                                                                            />
                                                                          </span>
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  )}
                                                                </Draggable>
                                                              ),
                                                            )}
                                                            <button
                                                              className="btn btn-primary mt-2"
                                                              style={{
                                                                marginLeft:
                                                                  "1.9rem",
                                                              }}
                                                              onClick={() =>
                                                                openCreateModal(
                                                                  "service",
                                                                  cat.category_id,
                                                                  sub.sub_category_id,
                                                                )
                                                              }
                                                            >
                                                              add services
                                                            </button>
                                                            {provided.placeholder}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </Droppable>
                                                )}
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                      <div
                                        className="btn btn-primary"
                                        onClick={() =>
                                          openCreateModal(
                                            "sub_category",
                                            cat.category_id,
                                          )
                                        }
                                        style={{ margin: "0.5rem" }}
                                      >
                                        Add subcategory
                                      </div>
                                      {provided.placeholder}
                                    </>
                                  </div>
                                </div>
                              )}
                            </Droppable>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))
                )}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <button
            className="create-roots"
            onClick={() => openCreateModal("category")}
          >
            <LayoutGrid /> Create New Root Category
          </button>

          {/* EDIT MODAL */}

          {showModal && (

            <div className="modal-overlays" onClick={() => setShowModal(false)}>
              <div
                className="modal-boxs"
                onClick={(e) => e.stopPropagation()} // prevent close on inside click
              >
                <h4>
                  {editId ? "Edit" : "Create"}{" "}
                  {modalData.type.replace("_", " ")}
                </h4>
                <form>
                  <div className="mb-2">
                    <lebal>Name </lebal>
                    <input
                      ref={inputRef}
                      className="form-control mt-1"
                      placeholder="Enter name"
                      value={modalData.name}
                      onChange={(e) =>
                        setModalData({ ...modalData, name: e.target.value })
                      }
                    />
                  </div>
                  {/* EXTRA FIELDS – ONLY FOR SERVICE */}
                  {modalData.type === "service" && (
                    <>
                      <div className="mb-2">
                        <label>Indeman Service Name</label>
                        <input
                          className="form-control mt-1"
                          placeholder="Enter indeman service name"
                          value={modalData.indeman_service_name}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              indeman_service_name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="mb-2">
                        <label>Search Tag</label>
                        <input
                          className="form-control mt-1"
                          placeholder="Enter search tags (comma separated)"
                          value={modalData.search_tag}
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              search_tag: e.target.value,
                            })
                          }
                        />
                      </div>
                      {modalData.type === "service" && modalData.indeman_sericons && (
                        <div className="mb-2">
                          <label>Current Icon</label>
                          <br />
                          <img
                            src={
                              modalData.indeman_sericons instanceof File
                                ? URL.createObjectURL(modalData.indeman_sericons)
                                : modalData.indeman_sericons
                            }
                            alt="Service Icon"
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: "6px",
                              border: "1px solid #ddd",
                            }}
                          />
                        </div>
                      )}


                      <div className="mb-3">
                        <label>IndemandService Icon</label>
                        <input
                          type="file"
                          className="form-control mt-1"
                          onChange={(e) =>
                            setModalData({
                              ...modalData,
                              indeman_sericons: e.target.files[0],
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <lebal>Status </lebal>
                    <select
                      className="form-select mt-1 "
                      value={modalData.status}
                      onChange={(e) =>
                        setModalData({ ...modalData, status: e.target.value })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btns btn-secondarys me-2" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btns btn-primarys"
                      onClick={handleSaveModal}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default OrderService;
