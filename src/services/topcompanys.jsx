import React, { useState, useEffect, useRef } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import {
  addTopCompanys,
  deleteTopCompany,
  getTopCompanys,
  updateTopCompany,
  updateTopCompanyStatus,
} from "../adminApi";
import Loader from "../app/common/loader";
import { X } from "lucide-react";
import "./serviceStyle/casestudy.css";
import { Form } from "react-bootstrap";

const Topcompanys = () => {
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
    description: "",
    status: "active",
  });

  const [images, setImages] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [imagePreview, setImagePreview] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description) {
      newErrors.description = "description is required.";
    }

    if (images.length === 0 && imagePreview.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getTopCompanys();
      setBlogs(data?.topCompanies || []);
    } catch (err) {
      console.log("fetch topcompany error", err);
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
      fd.append("description", formData.description);
      fd.append("status", formData.status);

      images.forEach((img) => {
        fd.append("images", img);
      });

      await addTopCompanys(fd);
      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error("create top company failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("description", formData.description);
      fd.append("status", formData.status);

      if (removedImages.length > 0) {
        fd.append("removeImages", JSON.stringify(removedImages));
      }

      images.forEach((img) => {
        fd.append("images", img);
      });

      await updateTopCompany(editId, fd);

      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error("update top company failed", err);
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
    if (!window.confirm("Delete this TopCompany?")) return;

    try {
      await deleteTopCompany(id);
      fetchBlogs();
    } catch (err) {
      console.log("Delete failed", err.message);
    }
  };

  const openCreateModal = () => {
    setFormData({
      description: "",
      status: "active",
    });

    setImages([]);
    setImagePreview([]);
    setRemovedImages([]);
    setErrors({});
    setIsEdit(false);
    setModalShow(true);
  };

  const openEditModal = (blog) => {
    setFormData({
      description: blog?.description || "",
      status: blog?.status || "active",
    });

    setImages([]);
    setRemovedImages([]);
    setImagePreview(blog?.images || []);

    setEditId(blog?._id);
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
    const searchMatch = !search || blog?.description?.toLowerCase().includes(search);

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
      await updateTopCompanyStatus(id, newStatus);
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
        <h3 className="heading_category casestudy-heading">Top Company</h3>

        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{ height: "44px" }}
            placeholder="Search top company..."
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
                <th>Description</th>
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
                  <td colSpan="5" className="text-center">
                    <Loader />
                  </td>
                </tr>
              ) : paginatedSubCategories.length > 0 ? (
                paginatedSubCategories.map((blog, index) => (
                  <tr key={blog._id}>
                    <td data-label="ID">{startIndex + index + 1}</td>

                    <td data-label="Description">
                      {blog?.description ? `${blog.description.slice(0, 20)}...` : "-"}
                    </td>

                    <td data-label="Image">
                      {blog?.images?.length > 0 ? (
                        <div className="casestudy-thumb-list">
                          {blog.images.map((img, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={img}
                              alt={`Top company ${imgIndex + 1}`}
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
                  <td colSpan="5" className="text-center">
                    No TopCompanys found.
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
              <Modal.Title>{isEdit ? "Edit Top Company" : "Create Top Company"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="casestudy-field">
                <label>Description</label>
                <textarea
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  style={{ minHeight: "90px" }}
                  ref={inputRef}
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.description) {
                      setErrors({ ...errors, description: "" });
                    }
                  }}
                />
                {errors.description && (
                  <div className="invalid-feedback d-block">{errors.description}</div>
                )}
              </div>

              <div className="mb-3 mt-3">
                <label className="form-label">Images</label>

                {imagePreview.length > 0 && (
                  <div className="d-flex gap-2 flex-wrap mb-2">
                    {imagePreview.map((img, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        <img
                          src={img}
                          alt="TopCompany"
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
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                          }}
                          onClick={() => {
                            setRemovedImages((prev) => [...prev, img]);
                            setImagePreview((prev) => prev.filter((_, i) => i !== index));
                          }}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  className={`form-control ${errors.images ? "is-invalid" : ""}`}
                  style={{ height: "50px" }}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImages((prev) => [...prev, ...files]);
                    if (errors.images) setErrors({ ...errors, images: "" });
                  }}
                />

                {errors.images && <div className="invalid-feedback d-block">{errors.images}</div>}
              </div>

              <div className="casestudy-field mt-3">
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
            <label htmlFor="topcompany-page-size">Rows per page</label>
            <select
              id="topcompany-page-size"
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

export default Topcompanys;
