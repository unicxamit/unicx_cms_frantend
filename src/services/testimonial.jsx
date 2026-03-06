import React, { useState, useEffect, useRef } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import {
  addTestimonial,
  deleteTestimonial,
  getTestimonial,
  updateTestimonial,
  updateTestimonialStatus,
} from "../adminApi";
import Loader from "../app/common/loader";
import { X } from "lucide-react";
import "./serviceStyle/casestudy.css";
import { Form } from "react-bootstrap";

const Testimonial = () => {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 50];

  const [formData, setFormData] = useState({
    message: "",
    first_name: "",
    last_name: "",
    role: "",
    companyname: "",
    rating: 0,
    status: "active",
  });

  const [avatar, setAvatar] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.message) newErrors.message = "message is required.";
    if (!formData.first_name) newErrors.first_name = "first_name is required.";
    if (!formData.last_name) newErrors.last_name = "last_name is required.";
    if (!formData.role) newErrors.role = "role is required.";
    if (!formData.companyname) newErrors.companyname = "companyname is required.";
    if (!formData.rating) newErrors.rating = "rating is required.";
    if (!avatar && !imagePreview) newErrors.avatar = "Avatar image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getTestimonial();
      setBlogs(data?.testimonials || []);
    } catch (err) {
      console.log("fetch testimonial error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("message", formData.message);
      fd.append("first_name", formData.first_name);
      fd.append("last_name", formData.last_name);
      fd.append("role", formData.role);
      fd.append("companyname", formData.companyname);
      fd.append("rating", String(formData.rating));
      fd.append("status", formData.status);

      if (avatar instanceof File) {
        fd.append("avatar", avatar);
      }

      await addTestimonial(fd);
      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error("Create testimonial failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("message", formData.message);
      fd.append("first_name", formData.first_name);
      fd.append("last_name", formData.last_name);
      fd.append("role", formData.role);
      fd.append("companyname", formData.companyname);
      fd.append("rating", String(formData.rating));
      fd.append("status", formData.status);

      if (removedImages.length > 0) {
        fd.append("removeImages", JSON.stringify(removedImages));
      }

      if (avatar instanceof File) {
        fd.append("avatar", avatar);
      }

      await updateTestimonial(editId, fd);

      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error("Update testimonial failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    try {
      await deleteTestimonial(id);
      fetchBlogs();
    } catch (err) {
      console.log("Delete failed", err.message);
    }
  };

  const openCreateModal = () => {
    setFormData({
      message: "",
      first_name: "",
      last_name: "",
      role: "",
      companyname: "",
      rating: 0,
      status: "active",
    });

    setAvatar(null);
    setImagePreview(null);
    setRemovedImages([]);
    setErrors({});
    setIsEdit(false);
    setModalShow(true);
  };

  const openEditModal = (blog) => {
    setFormData({
      message: blog?.message || "",
      first_name: blog?.first_name || "",
      last_name: blog?.last_name || "",
      role: blog?.role || "",
      companyname: blog?.companyname || "",
      rating: blog?.rating || "",
      status: blog?.status || "active",
    });

    setAvatar(null);
    setImagePreview(blog?.avatar || null);
    setRemovedImages([]);
    setEditId(blog._id);
    setIsEdit(true);
    setModalShow(true);
  };

  const toggleSelection = (id, setter) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const search = searchText.trim().toLowerCase();

  const filteredBlogs = blogs.filter((blog) => {
    const searchMatch =
      !search ||
      blog?.first_name?.toLowerCase().includes(search) ||
      blog?.last_name?.toLowerCase().includes(search) ||
      blog?.role?.toLowerCase().includes(search) ||
      blog?.companyname?.toLowerCase().includes(search) ||
      blog?.message?.toLowerCase().includes(search);

    const statusMatch =
      selectedStatuses.length === 0 || selectedStatuses.includes(blog?.status);

    return searchMatch && statusMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubCategories = filteredBlogs.slice(startIndex, endIndex);
  const showingStart = filteredBlogs.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(endIndex, filteredBlogs.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedStatuses, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
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
          : blog,
      ),
    );

    try {
      const blog = blogs.find((f) => f?._id === id);
      const newStatus = blog?.status === "active" ? "inactive" : "active";
      await updateTestimonialStatus(id, newStatus);
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

  return (
    <div className="category-container casestudy-page">
      <div className="casestudy-shell">
        <h3 className="heading_category casestudy-heading">Testimonial Management</h3>

        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{ height: "44px" }}
            placeholder="Search testimonial..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="filter-wrapper" ref={dropdownRef}>
            <div className="filter-input" onClick={() => setIsOpen(!isOpen)}>
              {selectedStatuses.length === 0 && <span>Filter by status</span>}

              {selectedStatuses.map((st) => (
                <span key={st} className="chip chip-status">
                  {st}
                  <X size={14} onClick={() => toggleSelection(st, setSelectedStatuses)} />
                </span>
              ))}
            </div>

            {isOpen && (
              <div className="filter-dropdown">
                <div>
                  <h6>Status</h6>
                  {["active", "inactive"].map((st) => (
                    <label key={st}>
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(st)}
                        onChange={() => toggleSelection(st, setSelectedStatuses)}
                      />
                      {st}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="mb-3 create_buttons casestudy-add-btn"
            onClick={openCreateModal}
          >
            Add
          </button>
        </div>

        <div className="casestudy-meta">
          <span>Total: {filteredBlogs.length}</span>
          <span>Page: {currentPage} / {totalPages}</span>
        </div>

        <div className="casestudy-table-wrap">
          <table className="table table-bordered table-striped custom-table mt-4 casestudy-table">
            <thead className="table-primary">
              <tr>
                <th className="col-id">ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
                <th>Company Name</th>
                <th>Message</th>
                <th>Rating</th>
                <th>Image</th>
                <th className="col-status">Status</th>
                <th className="col-actions" width="120">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center">
                    <Loader />
                  </td>
                </tr>
              ) : paginatedSubCategories.length > 0 ? (
                paginatedSubCategories.map((blog, index) => (
                  <tr key={blog._id}>
                    <td data-label="ID">{startIndex + index + 1}</td>
                    <td data-label="First Name">{blog?.first_name || "-"}</td>
                    <td data-label="Last Name">{blog?.last_name || "-"}</td>
                    <td data-label="Role">{blog?.role || "-"}</td>
                    <td data-label="Company Name">{blog?.companyname || "-"}</td>
                    <td data-label="Message">{blog?.message || "-"}</td>
                    <td data-label="Rating">{blog?.rating || "-"}</td>

                    <td data-label="Image">
                      {blog?.avatar ? (
                        <img
                          src={blog.avatar}
                          alt={`testimonial ${index + 1}`}
                          className="casestudy-thumb"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>

                    <td data-label="Status">
                      <label className="switchs">
                        <input
                          type="checkbox"
                          checked={blog?.status === "active"}
                          onChange={() => handleToggleStatus(blog._id)}
                        />
                        <span className="sliders"></span>
                      </label>
                    </td>

                    <td data-label="Actions" className="action_button casestudy-actions">
                      <div className="edits" onClick={() => openEditModal(blog)}>
                        <FaRegEdit size={18} />
                      </div>

                      <div className="deletes" onClick={() => handleDelete(blog._id)}>
                        <MdDeleteOutline size={18} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No testimonials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          centered
          dialogClassName="modal-custom"
          fullscreen="md-down"
        >
          <Form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>{isEdit ? "Edit Testimonial" : "Create Testimonial"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="casestudy-form-grid">
                <div className="casestudy-field">
                  <label>First Name</label>
                  <input
                    className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    ref={inputRef}
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.first_name) setErrors({ ...errors, first_name: "" });
                    }}
                  />
                  {errors.first_name && (
                    <div className="invalid-feedback d-block">{errors.first_name}</div>
                  )}
                </div>

                <div className="casestudy-field">
                  <label>Last Name</label>
                  <input
                    className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.last_name) setErrors({ ...errors, last_name: "" });
                    }}
                  />
                  {errors.last_name && (
                    <div className="invalid-feedback d-block">{errors.last_name}</div>
                  )}
                </div>

                <div className="casestudy-field">
                  <label>Role</label>
                  <input
                    className={`form-control ${errors.role ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    name="role"
                    placeholder="Role"
                    value={formData.role}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.role) setErrors({ ...errors, role: "" });
                    }}
                  />
                  {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
                </div>

                <div className="casestudy-field">
                  <label>Company Name</label>
                  <input
                    className={`form-control ${errors.companyname ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    name="companyname"
                    placeholder="Company Name"
                    value={formData.companyname}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.companyname) setErrors({ ...errors, companyname: "" });
                    }}
                  />
                  {errors.companyname && (
                    <div className="invalid-feedback d-block">{errors.companyname}</div>
                  )}
                </div>
              </div>

              <div className="casestudy-field mt-3">
                <label>Message</label>
                <textarea
                  className={`form-control ${errors.message ? "is-invalid" : ""}`}
                  style={{ minHeight: "90px" }}
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.message) setErrors({ ...errors, message: "" });
                  }}
                />
                {errors.message && <div className="invalid-feedback d-block">{errors.message}</div>}
              </div>

              <div className="mb-3 mt-3">
                <label className="form-label">Image</label>

                {imagePreview && (
                  <div style={{ position: "relative", width: "120px", marginBottom: "10px" }}>
                    <img
                      src={imagePreview}
                      alt="Avatar"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{ position: "absolute", top: "5px", right: "5px" }}
                      onClick={() => {
                        setRemovedImages((prev) => [...prev, imagePreview]);
                        setImagePreview(null);
                      }}
                    >
                      x
                    </button>
                  </div>
                )}

                <input
                  className={`form-control ${errors.avatar ? "is-invalid" : ""}`}
                  style={{ height: "50px" }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setAvatar(e.target.files?.[0] || null);
                    if (errors.avatar) setErrors({ ...errors, avatar: "" });
                  }}
                />

                {errors.avatar && <div className="invalid-feedback d-block">{errors.avatar}</div>}
              </div>

              <div className="casestudy-form-grid">
                <div className="casestudy-field">
                  <label>Rating</label>
                  <input
                    className={`form-control ${errors.rating ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    type="number"
                    name="rating"
                    placeholder="Rating"
                    value={formData.rating}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.rating) setErrors({ ...errors, rating: "" });
                    }}
                  />
                  {errors.rating && <div className="invalid-feedback d-block">{errors.rating}</div>}
                </div>

                <div className="casestudy-field">
                  <label>Status</label>
                  <select
                    className="form-select"
                    style={{ height: "50px" }}
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalShow(false)}>
                Close
              </Button>

              {isEdit ? (
                <Button className="casestudy-submit-btn casestudy-update-btn" type="submit">
                  Update
                </Button>
              ) : (
                <Button className="casestudy-submit-btn" type="submit">
                  Add
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
            <span>
              Current Page: {currentPage}/{totalPages}
            </span>
          </div>
          <div className="casestudy-page-size">
            <label htmlFor="testimonial-page-size">Rows per page</label>
            <select
              id="testimonial-page-size"
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
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
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

export default Testimonial;
