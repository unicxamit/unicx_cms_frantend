import React, { useState, useEffect, useRef } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { Editor } from "primereact/editor";
import {
  addBlog,
  addCategory,
  deleteBlog,
  getBlogs,
  getCategories,
  updateBlog,
  updateBlogStatus,
} from "../adminApi";
import Loader from "../app/common/loader";
import { X } from "lucide-react";
import "./serviceStyle/casestudy.css"
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import sanitizeHtml from "../utils/sanitizeHtml";

const Blogs = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const pageSizeOptions = [10, 20, 30, 50];
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    short_description: "",
    
    status: "active",
  });
  const [images, setImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [replaceImageFilesByIndex, setReplaceImageFilesByIndex] = useState({});
  const [replaceImagePreviewsByIndex, setReplaceImagePreviewsByIndex] = useState(
    {}
  );
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [searchText, setSearchText] = useState("");
 const [errors, setErrors] = useState({});
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [imagePreview, setImagePreview] = useState([]); // existing images
  const [removedImages, setRemovedImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const filteredCategories = category.filter((cat) =>
  cat?.name?.toLowerCase().includes(categorySearch.toLowerCase() || "")
);



const validateForm = () => {
  let newErrors = {};
  const plainShortDescription = String(formData.short_description || "")
    .replace(/<(.|\n)*?>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();

  if (!formData.categoryId) {
    newErrors.categoryId = "Please select a Category.";
  }

  // if (!formData.subcategory) {
  //   newErrors.subcategory = "Please select a SubCategory.";
  // }

  if (!formData.title || formData.title.trim() === "") {
    newErrors.title = "Blog title is required.";
  }

  if (images.length === 0 && imagePreview.length === 0) {
    newErrors.images = "At least one image is required";
  }

  if (!plainShortDescription) {
    newErrors.short_description = "short_description is required.";
  }
 
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // Returns true if valid
};
  // Apply filters
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
// console.log(data.blogs,"bogsdk")
      setBlogs(data?.blogs);
    } catch (err) {
    console.log("fetch blogs error",err)
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
  const handleCreateCategory = async () => {
  

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
        category: res?.category?._id,
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
  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!images.length) {
      setNewImagePreviews([]);
      return;
    }

    const previewUrls = images.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  useEffect(() => {
    return () => {
      Object.values(replaceImagePreviewsByIndex).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [replaceImagePreviewsByIndex]);
  // ---------- INPUT ----------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------- CREATE ----------
  
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("title", formData.title);
    
      fd.append("short_description", formData.short_description);
      fd.append("status", formData.status);
    
      fd.append("categoryId", formData.categoryId);

      // ✅ append multiple images
      images.forEach((img) => {
        fd.append("images", img);
      });

      console.log(images, "multiple images");

      await addBlog(fd);
      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error(err);
     console.log("fetch createblogs error",err)
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
      
      fd.append("short_description", formData.short_description);
      fd.append("status", formData.status);

      fd.append("categoryId", formData.categoryId);

      // 🗑 send removed images
      if (removedImages.length > 0) {
        fd.append("removeImages", JSON.stringify(removedImages));
      }

      const replaceIndexes = Object.keys(replaceImageFilesByIndex).map((idx) =>
        Number(idx)
      );

      if (replaceIndexes.length > 0) {
        fd.append("replaceIndexes", JSON.stringify(replaceIndexes));
        replaceIndexes.forEach((idx) => {
          const file = replaceImageFilesByIndex[idx];
          if (file) fd.append("images", file);
        });
      } else {
        // fallback: existing behavior (replace all if files selected from main input)
        images.forEach((img) => {
          fd.append("images", img);
        });
      }

      console.log("Updating blog with images:", images);

      // ✅ SEND FORMDATA (NOT formData)
      await updateBlog(editId, fd);

      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error(err);
console.log("fetch update blogs error",err)
    } finally {
      setLoading(false);
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
  // ---------- DELETE ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Blog?")) return;

    try {
      await deleteBlog(id);
      fetchBlogs();
    } catch (err) {
      console.log("Delete failed", err.message);
    }
  };

  // ---------- OPEN CREATE ----------
  
  const openCreateModal = () => {
    // reset all text fields
    setFormData({
      tage: "",
      categoryId: "",
      title: "",
      short_description: "",
      
      status: "active",
    });

    // reset images
    setImages([]); // new images
    setImagePreview([]); // existing images preview (none in create)
    setRemovedImages([]); // removed images (not used in create)
    setReplaceImageFilesByIndex({});
    setReplaceImagePreviewsByIndex({});
      setErrors({});
    setIsEdit(false); // create mode
    setModalShow(true); // open modal
  };

  // ---------- OPEN EDIT ----------
  
  const openEditModal = (blog) => {
    setFormData({
      title: blog?.title || "",
      
       short_description: blog?.short_description || "",
      categoryId: blog?.categoryId?._id || blog?.categoryId?.[0]?._id || "",
      status: blog?.status || "",
    });

    // 🔥 reset states
    setImages([]); // new images empty
    setRemovedImages([]); // reset removed list
    setReplaceImageFilesByIndex({});
    setReplaceImagePreviewsByIndex({});

    // ✅ existing images array
    setImagePreview(blog.images || []);

    setCategorySearch(
      blog?.categoryId?.name || blog?.categoryId?.[0]?.name || ""
    );

    setEditId(blog?._id);
    setIsEdit(true);
    setModalShow(true);
  };

  // ---------- SEARCH ----------
  
  const toggleSelection = (id, setter) => {
    setter(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const search = searchText.trim().toLowerCase();

const filteredBlogs = blogs.filter(blog => {
 const searchMatch =
  !search ||
  blog.title?.toLowerCase().includes(search.toLowerCase()) ||
  blog.short_description?.toLowerCase().includes(search.toLowerCase());

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

const resolveShortDescriptionHtml = (blog = {}) =>
  sanitizeHtml(
    blog?.short_description ||
    blog?.shortDescription ||
    blog?.description ||
    ""
  );

const toPlainText = (html = "") =>
  String(html || "")
    .replace(/<(.|\n)*?>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
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

  const handleToggleStatus = async (id) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog?._id === id
          ? {
              ...blog,
              status: blog?.status === "active" ? "inactive" : "active",
            }
          : blog
      )
    );
    try {
      const blog = blogs.find((f) => f?._id === id);
      const newStatus = blog?.status === "active" ? "inactive" : "active";
      await updateBlogStatus(id, newStatus);
    } catch {
      fetchBlogs();
    }
  };

  useEffect(() => {
    if (modalShow) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [modalShow]); 

  const handleReplaceImageByIndex = (index, file) => {
    if (!file) return;

    setReplaceImageFilesByIndex((prev) => ({ ...prev, [index]: file }));

    setReplaceImagePreviewsByIndex((prev) => {
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }
      return { ...prev, [index]: URL.createObjectURL(file) };
    });

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };
  return (
    <div className="category-container casestudy-page">
      <div className="casestudy-shell">
        <h3 className="heading_category casestudy-heading">Blog Management</h3>

        {/* Search */}
        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{height:"44px"}}
            placeholder="Search blog..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
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
          <div className="mb-3 create_buttons casestudy-add-btn" onClick={openCreateModal}>
           Add
          </div>
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
              <th>id</th>
              <th>Blog Title</th>
              <th>Description</th>
              
              <th>Category</th>
              <th>Image</th>
              <th>Status</th>
              <th width="100">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  <Loader/>
                </td>
              </tr>
            ):paginatedSubCategories.length > 0 ? (
            paginatedSubCategories.map((blog, index) => {
              const categoryName = blog?.categoryId?.[0]?.name || "-";

              return (
                <tr key={blog.blog_id}>
                  <td>{index + 1}</td>
                  <td>{blog.title ? blog.title.slice(0, 10) + "..." : ""}</td>
                  <td>
                    {toPlainText(resolveShortDescriptionHtml(blog))
                      ? `${toPlainText(resolveShortDescriptionHtml(blog)).slice(0, 10)}...`
                      : "-"}
                  </td>
                  
                  <td>{categoryName}</td>
                  <td>
                    {blog.images && blog.images.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          flexWrap: "wrap",
                        }}
                      >
                        {blog.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Blog Image ${index + 1}`}
                            style={{
                              width: "60px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>

                  <td>
                    {" "}
                    <label className="switchs">
                      <input
                        type="checkbox"
                        checked={blog.status === "active"}
                        onChange={() => handleToggleStatus(blog._id)}
                      />
                      <span className="sliders"></span>
                    </label>
                  </td>

                  <td className="action_button"style={{display:"flex", columnGap:"1rem"}}>
                    <div
                      className="edits"
                      onClick={() =>
                        navigate(`/admin/add-blogs-details/${blog?._id || ""}`, {
                          state: {
                            blogId: blog?._id,
                            title: blog?.title || "",
                            category: blog?.categoryId?.name || blog?.categoryId?.[0]?.name || "",
                            categoryId:
                              blog?.categoryId?._id ||
                              blog?.categoryId?.[0]?._id ||
                              "",
                            // short_description: blog?.short_description || "",
                          },
                        })
                      }
                    >
                      <FaPlusCircle size={18} />
                    </div>
                    <div className="edits" onClick={() => openEditModal(blog)}>
                      <FaRegEdit size={18} />
                    </div>

                    <div
                      className="deletes"
                      onClick={() => handleDelete(blog._id)}
                    >
                      <MdDeleteOutline size={18} />
                    </div>
                  </td>
                </tr>
              );
            })
 ):(
    <tr>
      <td colSpan="9" className="text-center">
        No Blog found.
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
        >
          <Form onSubmit={handleSubmit} onKeyDown={(e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSubmit(e);
  }
}}>
          <Modal.Header closeButton>
            <Modal.Title>{isEdit ? "Edit Blog" : "Create Blog"}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Category Dropdown */}

            <div
              className="position-relative"
              style={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
                 <lebal> Select Category</lebal>
              <div className="d-flex gap-2 mt-1">
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
                   className={`form-control ${errors.categoryId ? "is-invalid" : ""}`}style={{height:"50px"}}
                  placeholder="Search or select category"
                  value={categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setShowCategoryDropdown(true);
                     if (errors.categoryId) setErrors({ ...errors, categoryId: "" });
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
                      No services found
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

            {/* Blog Title */}
            <div   style={{ marginBottom: "1rem" }}>
              <div>
              <lebal>Blog Title</lebal>
              <input
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                name="title"
                placeholder="Blog Title"
                value={formData.title}
                onChange={(e)=>{handleChange(e); if (errors.title) setErrors({ ...errors, title: "" });}}
              />
                  {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
              </div>
              <div className="mb-3 mt-2">
                <label className="form-label">Blog Images</label>

                {/* EXISTING IMAGES */}
                {imagePreview.length > 0 && (
                  <div className="d-flex gap-2 flex-wrap mb-2">
                    {imagePreview.map((img, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        <img
                          src={replaceImagePreviewsByIndex[index] || img}
                          alt="Blog"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />

                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          style={{
                            position: "absolute",
                            bottom: "5px",
                            left: "5px",
                          }}
                          onClick={() => {
                            const el = document.getElementById(
                              `replace-blog-image-${index}`
                            );
                            if (el) el.click();
                          }}
                        >
                          Change
                        </button>

                        <input
                          id={`replace-blog-image-${index}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            handleReplaceImageByIndex(index, file);
                            e.target.value = "";
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
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* NEW IMAGE UPLOAD */}
                {/* <lebal>Blog Title</lebal> */}
                <input
className={`form-control ${errors.images ? "is-invalid" : ""}`}                  type="file"
                  multiple
                  accept="image/*"
                onChange={(e) => {
  const files = Array.from(e.target.files || []);
  setImages((prev) => [...prev, ...files]);
  e.target.value = "";

  if (errors.images) {
    setErrors((prev) => ({ ...prev, images: "" }));
  }
}}
 
                   
                />
                {errors.images && <div className="invalid-feedback d-block">{errors.images}</div>}

                {/* NEW SELECTED IMAGES PREVIEW */}
                {newImagePreviews.length > 0 && (
                  <div className="d-flex gap-2 flex-wrap mt-2">
                    {newImagePreviews.map((previewSrc, index) => (
                      <div key={`${previewSrc}-${index}`} style={{ position: "relative" }}>
                        <img
                          src={previewSrc}
                          alt={`Selected ${index + 1}`}
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
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
                            setImages((prev) => prev.filter((_, i) => i !== index));
                          }}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div   style={{ marginBottom: "1rem" }}>
            {/* Short Description */}
            <lebal>Blog Short_Description</lebal>
            <Editor
              value={formData.short_description}
              onTextChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  short_description: e.htmlValue || "",
                }));
                if (errors.short_description) {
                  setErrors((prev) => ({ ...prev, short_description: "" }));
                }
              }}
              style={{ height: "120px" }}
              className={`mt-1 ${errors.short_description ? "is-invalid" : ""}`}
            />
                {errors.short_description && <div className="invalid-feedback d-block">{errors.short_description}</div>}
            </div>

              
<div  style={{ marginBottom: "2rem"
 }}>
  <lebal>Status</lebal>
              {/* Status */}
              <select
                className="form-select mt-1"
               
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              </div>
           
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow(false)}>
              Close
            </Button>

              {isEdit ? (
  <Button className="edit_modal" type="submit">
    Update
  </Button>
) : (
  <Button variant="primary" type="submit">
    Create
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
            <label htmlFor="blog-page-size">Rows per page</label>
            <select
              id="blog-page-size"
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

export default Blogs;
