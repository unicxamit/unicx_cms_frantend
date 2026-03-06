import React, { useState, useEffect, useRef } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import {
  addSocialLink,
  deleteSocialLink,
  getSocialLinks,
  updateSocialLink,
  updateSocialLinkStatus,
} from "../adminApi";
import Loader from "../app/common/loader";
import { X } from "lucide-react";
import "./serviceStyle/casestudy.css";
import "./serviceStyle/socialMediaLink.css";
import { Form } from "react-bootstrap";

const SocialMediaLink = () => {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [icon, setIcon] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);

  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    socialLinkstatus: "active",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 50];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.platform) {
      newErrors.platform = "platform is required.";
    }
    if (!formData.url) {
      newErrors.url = "url is required.";
    }
    if (!icon && !imagePreview) {
      newErrors.icon = "icon is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getSocialLinks();
      setBlogs(data?.data || []);
    } catch (err) {
      console.log("fetch social media links error", err);
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
      fd.append("platform", formData.platform);
      fd.append("url", formData.url);
      fd.append("socialLinkstatus", formData.socialLinkstatus);

      if (icon instanceof File) {
        fd.append("icon", icon);
      }

      await addSocialLink(fd);
      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error("Create SocialMediaLinks failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("platform", formData.platform);
      fd.append("url", formData.url);
      fd.append("socialLinkstatus", formData.socialLinkstatus);

      if (icon instanceof File) {
        fd.append("icon", icon);
      }

      if (removedImages.length > 0) {
        fd.append("removeImages", JSON.stringify(removedImages));
      }

      await updateSocialLink(editId, fd);
      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error("Update SocialMediaLinks failed:", err);
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
    if (!window.confirm("Delete this SocialMediaLink?")) return;

    try {
      await deleteSocialLink(id);
      fetchBlogs();
    } catch (err) {
      console.log("Delete failed", err.message);
    }
  };

  const openCreateModal = () => {
    setFormData({
      platform: "",
      url: "",
      socialLinkstatus: "active",
    });

    setIcon(null);
    setImagePreview(null);
    setRemovedImages([]);
    setErrors({});
    setIsEdit(false);
    setModalShow(true);
  };

  const openEditModal = (blog) => {
    setFormData({
      platform: blog?.platform || "",
      url: blog?.url || "",
      socialLinkstatus: blog?.socialLinkstatus || "active",
    });

    setIcon(null);
    setImagePreview(blog?.icon || null);
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
      blog?.platform?.toLowerCase().includes(search) ||
      blog?.url?.toLowerCase().includes(search);

    const statusMatch =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(blog?.socialLinkstatus);

    return searchMatch && statusMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);
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
              socialLinkstatus:
                blog?.socialLinkstatus === "active" ? "inactive" : "active",
            }
          : blog,
      ),
    );

    try {
      const blog = blogs.find((f) => f?._id === id);
      const newStatus = blog?.socialLinkstatus === "active" ? "inactive" : "active";
      await updateSocialLinkStatus(id, newStatus);
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
    <div className="category-container casestudy-page social-links-page">
      <div className="casestudy-shell">
        <h3 className="heading_category casestudy-heading">
          SocialMediaLinks Management
        </h3>

        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{ height: "44px" }}
            placeholder="Search social media link..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="filter-wrapper" ref={dropdownRef}>
            <div className="filter-input" onClick={() => setIsOpen(!isOpen)}>
              {selectedStatuses.length === 0 && <span>Filter by status</span>}

              {selectedStatuses.map((st) => (
                <span key={st} className="chip chip-status">
                  {st}
                  <X
                    size={14}
                    onClick={() => toggleSelection(st, setSelectedStatuses)}
                  />
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
            className="create_buttons casestudy-add-btn social-link-add-btn"
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
                <th>Platform</th>
                <th>URL</th>
                <th>Icon</th>
                <th className="col-status">Status</th>
                <th className="col-actions" width="120">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <Loader />
                  </td>
                </tr>
              ) : paginatedBlogs.length > 0 ? (
                paginatedBlogs.map((blog, index) => (
                  <tr key={blog._id}>
                    <td data-label="ID">{startIndex + index + 1}</td>
                    <td data-label="Platform">{blog?.platform || "-"}</td>
                    <td data-label="URL" className="social-link-url-cell">
                      {blog?.url ? (
                        <a
                          href={blog.url}
                          target="_blank"
                          rel="noreferrer"
                          className="social-link-url-anchor"
                        >
                          {blog.url}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td data-label="Icon">
                      {blog?.icon ? (
                        <img
                          src={blog.icon}
                          alt={`socialMediaLink ${index + 1}`}
                          className="casestudy-thumb social-link-icon"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>

                    <td data-label="Status">
                      <label className="switchs">
                        <input
                          type="checkbox"
                          checked={blog?.socialLinkstatus === "active"}
                          onChange={() => handleToggleStatus(blog._id)}
                        />
                        <span className="sliders"></span>
                      </label>
                    </td>

                    <td data-label="Actions" className="action_button casestudy-actions">
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No SocialMediaLinks found.
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
              <Modal.Title>
                {isEdit ? "Edit SocialMediaLink" : "Create SocialMediaLink"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="casestudy-form-grid">
                <div className="casestudy-field">
                  <label>Platform</label>
                  <input
                    className={`form-control ${errors.platform ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    ref={inputRef}
                    name="platform"
                    placeholder="Platform"
                    value={formData.platform}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.platform) setErrors({ ...errors, platform: "" });
                    }}
                  />
                  {errors.platform && (
                    <div className="invalid-feedback d-block">{errors.platform}</div>
                  )}
                </div>

                <div className="casestudy-field">
                  <label>URL</label>
                  <input
                    className={`form-control ${errors.url ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    name="url"
                    placeholder="URL"
                    value={formData.url}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.url) setErrors({ ...errors, url: "" });
                    }}
                  />
                  {errors.url && (
                    <div className="invalid-feedback d-block">{errors.url}</div>
                  )}
                </div>
              </div>

              <div className="mb-3 mt-3">
                <label className="form-label">Icon</label>

                {imagePreview && (
                  <div className="social-link-preview-card">
                    <img
                      src={imagePreview}
                      alt="Icon"
                      className="social-link-preview-image"
                    />

                    <button
                      type="button"
                      className="btn btn-sm btn-danger social-link-preview-remove"
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
                  className={`form-control ${errors.icon ? "is-invalid" : ""}`}
                  style={{ height: "50px" }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setIcon(e.target.files?.[0] || null);
                    if (errors.icon) setErrors({ ...errors, icon: "" });
                  }}
                />

                {errors.icon && <div className="invalid-feedback d-block">{errors.icon}</div>}
              </div>

              <div className="casestudy-field mt-3">
                <label>Status</label>
                <select
                  className="form-select"
                  style={{ height: "50px" }}
                  name="socialLinkstatus"
                  value={formData.socialLinkstatus}
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
            <label htmlFor="social-page-size">Rows per page</label>
            <select
              id="social-page-size"
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

export default SocialMediaLink;
