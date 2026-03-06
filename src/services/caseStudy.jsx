import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { Form } from "react-bootstrap";
import { Editor } from "primereact/editor";
import {
  addCaseStudy,
  addCategory,
  deleteCaseStudy,
  getCaseStudies,
  getCategories,
  updateCaseStudy,
  updateCaseStudyStatus,
} from "../adminApi";
import Loader from "../app/common/loader";
import { X } from "lucide-react";
import "./serviceStyle/casestudy.css"

const CaseStudy = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",
    authName: "",
    additional_details: "",
    status: "active",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 50];
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [newImagePreview, setNewImagePreview] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  // console.log(formData.image,"image data")

  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  // 🔥 FILTER STATES
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
 const filteredCategories = category.filter((cat) =>
  cat?.name?.toLowerCase().includes(categorySearch.toLowerCase() || "")
);


const validateForm = () => {
  let newErrors = {};
  const plainAdditionalDetails = String(formData.additional_details || "")
    .replace(/<(.|\n)*?>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();

  if (!formData.categoryId) {
    newErrors.categoryId = "Please select a Category.";
  }
  if (!formData.title || formData.title.trim() === "") {
    newErrors.title = " title is required.";
  }
  if (images.length === 0 && imagePreview.length === 0) {
    newErrors.images = "At least one image is required";
  }
  if (!plainAdditionalDetails) {
    newErrors.additional_details = "Additional details is required.";
  }
 
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // Returns true if valid
};

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Single image mode.
    setImages([file]);
    
   setImagePreview((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [URL.createObjectURL(file)];
    });

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }

    // Allow selecting same file again if needed.
    e.target.value = "";
  };

  const removeNewImage = (indexToRemove) => {
    setImages([]);
    setImagePreview((prev) => {
      const next = [...prev];
      const removedUrl = next[indexToRemove];
      if (removedUrl) URL.revokeObjectURL(removedUrl);
      return [];
    });
  };
  const fetchcasestudy = async () => {
    try {
      setLoading(true);
      const data = await getCaseStudies();
      setBlogs(data?.caseStudies || []);
    } catch (err) {
console.log("fetch casestudy error",err)
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategory(data?.category || []);
    } catch (err) {
     console.log("fetch category error",err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchcasestudy();
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      newImagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreview]);

  // ---------- INPUT ----------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================= Create category ==========
  const handleCreateCategory = async () => {
    if (!newCategoryName?.trim()) {
      return alert("Enter category name");
    }

    try {
      setLoading(true);

      const res = await addCategory({
        name: newCategoryName,
        status: "active",
      });

      await fetchCategories(); // refresh list

      // auto select new category
      setFormData({
        ...formData,
        categoryId: res?.category?._id,
      });

      setCategorySearch(res?.category?.name);

      setNewCategoryName("");
      setShowCreateCategory(false);
    } catch (error) {
      alert("Category create failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- CREATE ----------

  const handleCreate = async () => {
      if (!validateForm()) return;

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("slug", formData.slug || "");
      fd.append("authName", formData.authName || "");
      fd.append("additional_details", formData.additional_details);
      fd.append("status", formData.status);
      fd.append("categoryId", formData.categoryId);

      // ✅ append multiple images
      if (images[0]) {
        fd.append("images", images[0]);
      }

      console.log(images, "multiple images");

      await addCaseStudy(fd);
      await fetchcasestudy();
      setModalShow(false);
      setImages([]);
      setNewImagePreview([]);
    } catch (err) {
      console.error(err);
     console.log("fetch create casestudy error",err)
    } finally {
      setLoading(false);
    }
  };

  // ---------- UPDATE ----------

  const handleUpdate = async () => {


    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("slug", formData.slug || "");
      fd.append("authName", formData.authName || "");
      fd.append("additional_details", formData.additional_details);
      fd.append("status", formData.status);
      fd.append("categoryId", formData.categoryId);

      // 🗑 removed images
      if (removedImages.length > 0) {
        fd.append("removeImages", JSON.stringify(removedImages));
      }

      // ➕ new images
      if (images[0]) {
        fd.append("imageIndex", "0");
        fd.append("images", images[0]);
      }

      const res = await updateCaseStudy(editId, fd);
      console.log(res, "casestudy updated");
      await fetchcasestudy();
      setModalShow(false);
      setImages([]);
      setNewImagePreview([]);
    } catch (err) {
      console.error(err);
      console.log("fetch updatecase error",err)
    } finally {
      setLoading(false);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this casestudy?")) return;

    try {
      await deleteCaseStudy(id);
      fetchcasestudy();
    } catch (err) {
     console.log("fetch delete casestudy error",err)
    }
  };

  // ---------- OPEN CREATE ----------
  

  const openCreateModal = () => {
    setFormData({
      categoryId: "",
      title: "",
      slug: "",
      authName: "",
      additional_details: "",
      status: "active",
    });

    setImages([]);
    setImagePreview([]);
    setNewImagePreview([]);
    setRemovedImages([]);
    setCategorySearch("");
    setErrors({})
    setIsEdit(false);
    setModalShow(true);
  };

  // ---------- OPEN EDIT ----------
  
  const openEditModal = (casestudy) => {
    setFormData({
      title: casestudy?.title || "",
      slug: casestudy?.slug || "",
      authName: casestudy?.authName || "",
      additional_details: casestudy?.additional_details || "",
      categoryId:
        casestudy?.categoryId?._id || casestudy?.categoryId?.[0]?._id || "",
      status: casestudy?.status || "active",
    });

    setImages([]); // new uploads
    setNewImagePreview([]);
    setRemovedImages([]); // reset removed
    setImagePreview(casestudy?.images?.[0] ? [casestudy.images[0]] : []);

    setCategorySearch(
      casestudy.categoryId?.name || casestudy.categoryId?.[0]?.name || "",
    );

    setEditId(casestudy._id);
    setIsEdit(true);
    setModalShow(true);
  };





useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      setShowCategoryDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);


  // close filter dropdown
    useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    // ================= FILTER LOGIC =================
  const toggleSelection = (id, setter) => {
    setter(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

 
const search = searchText.trim().toLowerCase();

const filteredBlogs = blogs.filter(blog => {
  const searchMatch =
    !search ||
    blog?.title?.toLowerCase().includes(search.toLowerCase()) ||
    blog?.authName?.toLowerCase().includes(search.toLowerCase());

  const categoryMatch =
    selectedCategoryIds.length === 0 ||
    selectedCategoryIds.includes(
      blog?.categoryId?._id || blog?.categoryId?.[0]?._id
    );

  const statusMatch =
    selectedStatuses.length === 0 ||
    selectedStatuses.includes(blog?.status);

  return searchMatch && categoryMatch && statusMatch;
});

const totalPages = Math.max(1, Math.ceil(
  filteredBlogs.length / itemsPerPage
));

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

const paginatedSubCategories =
  filteredBlogs.slice(startIndex, endIndex);

const showingStart = filteredBlogs.length === 0 ? 0 : startIndex + 1;
const showingEnd = Math.min(endIndex, filteredBlogs.length);
  
useEffect(() => {
  setCurrentPage(1);
}, [searchText, selectedCategoryIds, selectedStatuses, itemsPerPage]);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

  const handleToggleStatus = async (id) => {
    const currentCaseStudy = blogs.find((item) => item._id === id);
    if (!currentCaseStudy) return;

    const newStatus =
      currentCaseStudy.status === "active" ? "inactive" : "active";

    // Optimistic UI
    setBlogs((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item,
      ),
    );

    try {
      const res = await updateCaseStudyStatus(id, newStatus);
      console.log(res, "casestudy res");
    } catch (error) {
      console.error(error);
      fetchcasestudy(); // rollback
    }
  };

const handleSubmit = (e) => {
  e.preventDefault(); // 🔥 prevents page reload

  if (isEdit) {
    handleUpdate();
  } else {
    handleCreate();
  }
};

  useEffect(() => {
    if (modalShow) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [modalShow]); 

  return (
    <div className="category-container casestudy-page">
      <div className="casestudy-shell">
        <h3 className="heading_category casestudy-heading">CaseStudy Management</h3>

        {/* Search */}
        <div className="custom_headings casestudy-toolbar">
<input
  type="text"
  className="form-control casestudy-search"
  style={{ height: "44px" }}
  placeholder="Search case study..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>

 {/* 🔥 FILTER UI */}
      <div className="filter-wrapper" ref={dropdownRef}>
        <div className="filter-input" onClick={() => setIsOpen(!isOpen)}>
          {(selectedCategoryIds.length === 0 &&
            selectedStatuses.length === 0) && (
            <span >Filter by category or status</span>
          )}

          {selectedCategoryIds.map(id => {
            const cat = category.find(c => c._id === id);
            return (
              <span key={id} className="chip chip-cat">
                {cat?.name}
                <X size={14} onClick={() => toggleSelection(id, setSelectedCategoryIds)} />
              </span>
            );
          })}

          {selectedStatuses.map(st => (
            <span key={st} className="chip chip-status">
              {st}
              <X size={14} onClick={() => toggleSelection(st, setSelectedStatuses)} />
            </span>
          ))}
        </div>

        {isOpen && (
          <div className="filter-dropdown">
            <div>
              <h6>Categories</h6>
              {category.map(cat => (
                <label key={cat._id}>
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat._id)}
                    onChange={() =>
                      toggleSelection(cat._id, setSelectedCategoryIds)
                    }
                  />
                  {cat.name}
                </label>
              ))}
            </div>

            <div>
              <h6>Status</h6>
              {["active", "inactive"].map(st => (
                <label key={st}>
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(st)}
                    onChange={() =>
                      toggleSelection(st, setSelectedStatuses)
                    }
                  />
                  {st}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
          <button type="button" className="mb-3 create_buttons casestudy-add-btn" onClick={openCreateModal}>
          Add
          </button>
        </div>
        <div className="casestudy-meta">
          <span>Total: {filteredBlogs.length}</span>
          <span>Page: {currentPage} / {totalPages}</span>
        </div>
        {/* Table */}
        <div className="casestudy-table-wrap">
        <table className="table table-bordered table-striped custom-table mt-4 casestudy-table">
          <thead className="table-primary">
            <tr>
              <th className="col-id">ID</th>
              <th className="col-title">Title</th>
              {/* <th className="col-slug">Slug</th> */}
              <th className="col-author">Author Name</th>
              <th className="col-details">Additional Details</th>
              <th className="col-category">Category</th>
              <th className="col-image">Image</th>
              <th className="col-status">Status</th>
              <th className="col-actions" width="120">Actions</th>
            </tr>
          </thead>

        <tbody>
  {loading ? (
    <tr>
      <td colSpan="9" className="text-center">
        <Loader />
      </td>
    </tr>
  ) : paginatedSubCategories .length > 0 ? (
    paginatedSubCategories.map((casestudy, index) => {
      const categoryName =
        casestudy?.categoryId?.name ||
        casestudy?.categoryId?.[0]?.name ||
        "-";

      return (
        <tr key={casestudy._id}>
          <td data-label="ID">{index + 1}</td>

          <td data-label="Title">{casestudy.title?.slice(0, 32) || "-"}</td>
          {/* <td data-label="Slug">{casestudy.slug?.slice(0, 24) || "-"}</td> */}
          <td data-label="Author">{casestudy.authName?.slice(0, 20) || "-"}</td>
          <td data-label="Details"> {casestudy?.additional_details ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: casestudy.additional_details,
                                            }}
                                        />
                                    ) : (
                                        <p>No description available.</p>
                                    )}</td>

          <td data-label="Category">{categoryName}</td>

          <td data-label="Image">
            {casestudy.images?.length > 0 ? (
              <div className="casestudy-thumb-list">
                {casestudy.images.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img}
                    alt={`CaseStudy ${imgIndex + 1}`}
                    className="casestudy-thumb"
                  />
                ))}
              </div>
            ) : (
              <span>No Image</span>
            )}
          </td>

          <td data-label="Status">
            <label className="switchs">
              <input
                type="checkbox"
                checked={casestudy.status === "active"}
                onChange={() => handleToggleStatus(casestudy._id)}
              />
              <span className="sliders"></span>
            </label>
          </td>

          <td data-label="Actions" className="action_button casestudy-actions">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() =>
                navigate(`/admin/add-casestudy-details/${casestudy._id}`, {
                  state: {
                    id: casestudy?._id,
                    title: casestudy?.title || "",
                    categoryId:
                      casestudy?.categoryId?._id ||
                      casestudy?.categoryId?.[0]?._id ||
                      "",
                  },
                })
              }
            >
              +
            </Button>
            <div className="edits" onClick={() => openEditModal(casestudy)}>
              <FaRegEdit size={18} />
            </div>

            <div
              className="deletes"
              onClick={() => handleDelete(casestudy._id)}
            >
              <MdDeleteOutline size={18} />
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="9" className="text-center">
        No CaseStudy found.
      </td>
    </tr>
  )}
</tbody>

        </table>
        </div>

        {/* Modal */}
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          ref={inputRef}
          centered
          dialogClassName="modal-custom"
          fullscreen="md-down"
        >
          <Form onSubmit={handleSubmit} onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSubmit(e);
  }
}}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEdit ? "Edit Casestudy" : "Create Casestudy"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Category Dropdown */}

            <div
              className="position-relative"
              style={{ marginTop: "1rem", marginBottom: "2rem" }}
            >
                 <label>Select Category</label>
              <div className="d-flex gap-2">
                {/* ➕ Icon (always show) */}
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setShowCreateCategory(!showCreateCategory)}
                >
                  +
                </button>

                {/* Search Input */}
                <input
                  ref={inputRef}
                  type="text"
 className={`form-control ${errors.categoryId ? "is-invalid" : ""}`}style={{height:"50px"}}                  placeholder="Search or select category"
                  value={categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setShowCategoryDropdown(true);
                         if (errors.categoryId) setErrors({ ...errors, categoryId: "" })
                  }}
                  onFocus={() => setShowCategoryDropdown(true)}
                />
                 {errors.categoryId && <div className="invalid-feedback d-block">{errors.categoryId}</div>}
              </div>

              {/* Dropdown List */}
              {showCategoryDropdown && (
                <ul
                  className="list-group position-absolute w-100 mt-1"
                  style={{ zIndex: 1000 }}
                  ref={dropdownRef}
                >
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <li
                        key={cat._id}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setFormData({ ...formData, categoryId: cat._id });
                          setCategorySearch(cat.name);
                          setShowCategoryDropdown(false);
                           if (errors.categoryId) {
      setErrors((prev) => ({ ...prev, categoryId: "" }));
    }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {cat.name}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item text-muted">
                      No categories found
                    </li>
                  )}
                </ul>
              )}
            </div>
            {showCreateCategory && (
              <div className="border p-2 mb-3 rounded">
                <input
                  className="form-control mb-2"
                  placeholder="New Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <Button
                  size="sm"
                  disabled={loading}
                  onClick={handleCreateCategory}
                >
                  {loading ? "Saving..." : "Save Category"}
                </Button>
              </div>
            )}
            <div className="casestudy-form-grid">
            <div className="casestudy-field"> 
                 <label>CaseStudy Title</label>
              <input
               className={`form-control ${errors.title ? "is-invalid" : ""}`}style={{height:"50px"}}
              name="title"
              placeholder="CaseStudy Title"
              value={formData.title}
              onChange={(e)=>{handleChange(e);     if (errors.title) setErrors({ ...errors, title: "" })}}
            />
             {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
            </div>
           
<div className="casestudy-field">
              <label>Author Name</label>
              <input
                className="form-control"
                style={{ height: "50px" }}
                name="authName"
                placeholder="Author Name"
                value={formData.authName}
                onChange={handleChange}
              />
            </div>
          </div>  

            

            {/* IMAGE SECTION */}
            <div className="mb-2">
              <label className="form-label">Case Study Images</label>

              {/* EXISTING IMAGES */}
              {imagePreview.length > 0 && (
                <div className="d-flex gap-2 flex-wrap mb-2">
                  {imagePreview.map((img, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={img}
                        alt="Case Study"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />

                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                        }}
                        onClick={() => {
                          setRemovedImages((prev) => [...prev, img]);
                          setImagePreview((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* NEW SELECTED IMAGES PREVIEW */}
              {newImagePreview.length > 0 && (
                <div className="d-flex gap-2 flex-wrap mb-2">
                  {newImagePreview.map((img, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={img}
                        alt={`New upload ${index + 1}`}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />

                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                        }}
                        onClick={() => removeNewImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* NEW IMAGES */}
              <input
                type="file"
                className={`form-control ${errors.images ? "is-invalid" : ""}`}style={{height:"50px"}}
                accept="image/*"
                onChange={handleImageChange}
              />
               {errors.images && <div className="invalid-feedback d-block">{errors.images}</div>}
            </div>

           

            <div className="mt-2"
            > 
               <label>Additional Details</label>
              <Editor
                value={formData.additional_details}
                onTextChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    additional_details: e.htmlValue || "",
                  }));
                  if (errors.additional_details) {
                    setErrors((prev) => ({ ...prev, additional_details: "" }));
                  }
                }}
                style={{ height: "160px" }}
                className={`mt-1 casestudy-rich-editor ${errors.additional_details ? "is-invalid" : ""}`}
              />
               {errors.additional_details && <div className="invalid-feedback d-block">{errors.additional_details}</div>}
              </div>
              
            <div>
               <label>Status</label>
               <select
              className="form-select"
              style={{ marginBottom: "2rem",height:"50px" }}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select></div>
            {/* Status */}
           
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow(false)}>
              Close
            </Button>

            {isEdit ? (
              <Button className="casestudy-submit-btn casestudy-update-btn" type="submit">
                Update CaseStudy
              </Button>
            ) : (
              <Button className="casestudy-submit-btn" type="submit">
                Add CaseStudy
              </Button>
            )}
          </Modal.Footer>
          </Form>
        </Modal>

        <div className="casestudy-pagination-footer mt-4">
          <div className="casestudy-pagination-info">
            <span>
              Showing {showingStart}-{showingEnd} of {filteredBlogs.length}
            </span>
            <span>Current Page: {currentPage}/{totalPages}</span>
          </div>
          <div className="casestudy-page-size">
            <label htmlFor="case-study-page-size">Rows per page</label>
            <select
              id="case-study-page-size"
              className="form-select form-select-sm"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

  <nav className="d-flex justify-content-center mt-3">
    <ul className="pagination">

      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
      </li>

      {[...Array(totalPages)].map((_, i) => (
        <li
          key={i}
          className={`page-item ${
            currentPage === i + 1 ? "active" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        </li>
      ))}

      <li
        className={`page-item ${
          currentPage === totalPages ? "disabled" : ""
        }`}
      >
        <button
          className="page-link"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </li>

    </ul>
  </nav>
      </div>
    </div>
  );
};

export default CaseStudy;



// import React, { useState, useEffect, useRef } from "react";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDeleteOutline } from "react-icons/md";
// import { X } from "lucide-react";
// import { Form } from "react-bootstrap";

// import {
//   addCaseStudy,
//   addCategory,
//   deleteCaseStudy,
//   getCaseStudies,
//   getCategories,
//   updateCaseStudy,
//   updateCaseStudyStatus,
// } from "../adminApi";

// import "./serviceStyle/casestudy.css";

// const CaseStudy = () => {
//   const dropdownRef = useRef(null);

//   const [blogs, setBlogs] = useState([]);
//   const [category, setCategory] = useState([]);

//   const [searchText, setSearchText] = useState("");

//   // 🔥 FILTER STATES
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
//   const [selectedStatuses, setSelectedStatuses] = useState([]);

//   // MODAL STATES (unchanged)
//   const [modalShow, setModalShow] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     client_name: "",
//     Description: "",
//     Additional_Details: "",
//     categoryId: "",
//     status: "active",
//   });

//   // ================= FETCH =================
//   const fetchCaseStudy = async () => {
//     const res = await getCaseStudies();
//     setBlogs(res.caseStudies || []);
//   };

//   const fetchCategories = async () => {
//     const res = await getCategories();
//     setCategory(res.category || []);
//   };

//   useEffect(() => {
//     fetchCaseStudy();
//     fetchCategories();
//   }, []);

//   // ================= FILTER LOGIC =================
//   const toggleSelection = (id, setter) => {
//     setter(prev =>
//       prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
//     );
//   };

//   const filteredBlogs = blogs.filter(blog => {
//     const searchMatch =
//       blog.title?.toLowerCase().includes(searchText.toLowerCase()) ||
//       blog.client_name?.toLowerCase().includes(searchText.toLowerCase());

//     const categoryMatch =
//       selectedCategoryIds.length === 0 ||
//       selectedCategoryIds.includes(
//         blog.categoryId?._id || blog.categoryId?.[0]?._id
//       );

//     const statusMatch =
//       selectedStatuses.length === 0 ||
//       selectedStatuses.includes(blog.status);

//     return searchMatch && categoryMatch && statusMatch;
//   });

//   // close dropdown
//   useEffect(() => {
//     const handleClickOutside = e => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ================= STATUS TOGGLE =================
//   const handleToggleStatus = async id => {
//     setBlogs(prev =>
//       prev.map(cs =>
//         cs._id === id
//           ? { ...cs, status: cs.status === "active" ? "inactive" : "active" }
//           : cs
//       )
//     );

//     const cs = blogs.find(b => b._id === id);
//     await updateCaseStudyStatus(id, cs.status === "active" ? "inactive" : "active");
//   };

//   return (
//     <div className="category-container">
//       <h3 className="heading_category">CaseStudy Management</h3>

//       {/* 🔍 SEARCH */}
//       <div className="top-controls">
//         <input
//           type="text"
//           className="form-control w-25"
//           placeholder="Search case study..."
//           value={searchText}
//           onChange={e => setSearchText(e.target.value)}
//         />

//         <Button onClick={() => setModalShow(true)}>Add</Button>
//       </div>

//       {/* 🔥 FILTER UI */}
//       <div className="filter-wrapper" ref={dropdownRef}>
//         <div className="filter-input" onClick={() => setIsOpen(!isOpen)}>
//           {(selectedCategoryIds.length === 0 &&
//             selectedStatuses.length === 0) && (
//             <span className="placeholder">Filter by category or status</span>
//           )}

//           {selectedCategoryIds.map(id => {
//             const cat = category.find(c => c._id === id);
//             return (
//               <span key={id} className="chip chip-cat">
//                 {cat?.name}
//                 <X size={14} onClick={() => toggleSelection(id, setSelectedCategoryIds)} />
//               </span>
//             );
//           })}

//           {selectedStatuses.map(st => (
//             <span key={st} className="chip chip-status">
//               {st}
//               <X size={14} onClick={() => toggleSelection(st, setSelectedStatuses)} />
//             </span>
//           ))}
//         </div>

//         {isOpen && (
//           <div className="filter-dropdown">
//             <div>
//               <h6>Categories</h6>
//               {category.map(cat => (
//                 <label key={cat._id}>
//                   <input
//                     type="checkbox"
//                     checked={selectedCategoryIds.includes(cat._id)}
//                     onChange={() =>
//                       toggleSelection(cat._id, setSelectedCategoryIds)
//                     }
//                   />
//                   {cat.name}
//                 </label>
//               ))}
//             </div>

//             <div>
//               <h6>Status</h6>
//               {["active", "inactive"].map(st => (
//                 <label key={st}>
//                   <input
//                     type="checkbox"
//                     checked={selectedStatuses.includes(st)}
//                     onChange={() =>
//                       toggleSelection(st, setSelectedStatuses)
//                     }
//                   />
//                   {st}
//                 </label>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* 📊 TABLE */}
//       <table className="table table-bordered mt-4">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Title</th>
//             <th>Client</th>
//             <th>Category</th>
//             <th>Status</th>
//             <th width="100">Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredBlogs.map((cs, i) => (
//             <tr key={cs._id}>
//               <td>{i + 1}</td>
//               <td>{cs.title}</td>
//               <td>{cs.client_name}</td>
//               <td>{cs.categoryId?.name || "-"}</td>
//               <td>
//                 <label className="switch">
//                   <input
//                     type="checkbox"
//                     checked={cs.status === "active"}
//                     onChange={() => handleToggleStatus(cs._id)}
//                   />
//                   <span className="slider"></span>
//                 </label>
//               </td>
//               <td>
//                 <FaRegEdit />
//                 <MdDeleteOutline />
//               </td>
//             </tr>
//           ))}

//           {filteredBlogs.length === 0 && (
//             <tr>
//               <td colSpan="6" className="text-center">
//                 No data found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* MODAL (your existing modal stays same) */}
//       <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Create CaseStudy</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Form here...</Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default CaseStudy;
