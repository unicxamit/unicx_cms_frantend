import React, { useState, useEffect, useRef } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import {
  addFooterDetail,
  deleteFooterDetail,
  getFooterDetails,
  updateFooterDetail,
  updateFooterDetailStatus,
} from "../adminApi";
import { X } from "lucide-react";
import Loader from "../app/common/loader";

import "./serviceStyle/casestudy.css";
import { Form } from "react-bootstrap";

const FooterContent = () => {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    email: "",
    companyName: "",
    copyrightText: "",
    status: "active",
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

    if (!formData.address) {
      newErrors.address = "address is required.";
    }
    if (!formData.phone) {
      newErrors.phone = "phone is required.";
    }
    if (!formData.email) {
      newErrors.email = "email is required.";
    }
    if (!formData.companyName) {
      newErrors.companyName = "companyName is required.";
    }
    if (!formData.copyrightText) {
      newErrors.copyrightText = "copyrightText is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getFooterDetails();
      setBlogs(data?.data || []);
    } catch (err) {
      console.log("fetch footer details error", err);
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
      fd.append("address", formData.address);
      fd.append("phone", formData.phone);
      fd.append("email", formData.email);
      fd.append("companyName", formData.companyName);
      fd.append("copyrightText", formData.copyrightText);
      fd.append("status", formData.status);

      await addFooterDetail(fd);
      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error("Create footer details failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("address", formData.address);
      fd.append("phone", formData.phone);
      fd.append("email", formData.email);
      fd.append("companyName", formData.companyName);
      fd.append("copyrightText", formData.copyrightText);
      fd.append("status", formData.status);

      await updateFooterDetail(editId, fd);
      await fetchBlogs();
      setModalShow(false);
    } catch (err) {
      console.error("Update footer details failed:", err);
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
    if (!window.confirm("Delete this Footer Details?")) return;

    try {
      await deleteFooterDetail(id);
      fetchBlogs();
    } catch (err) {
      console.log("Delete failed", err.message);
    }
  };

  const openCreateModal = () => {
    setFormData({
      address: "",
      phone: "",
      email: "",
      companyName: "",
      copyrightText: "",
      status: "active",
    });

    setErrors({});
    setIsEdit(false);
    setModalShow(true);
  };

  const openEditModal = (blog) => {
    setFormData({
      address: blog?.address || "",
      phone: blog?.phone || "",
      email: blog?.email || "",
      companyName: blog?.companyName || "",
      copyrightText: blog?.copyrightText || "",
      status: blog?.status || "active",
    });

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
      blog?.address?.toLowerCase().includes(search) ||
      blog?.phone?.toLowerCase().includes(search) ||
      blog?.companyName?.toLowerCase().includes(search) ||
      blog?.email?.toLowerCase().includes(search) ||
      blog?.copyrightText?.toLowerCase().includes(search);

    const statusMatch =
      selectedStatuses.length === 0 || selectedStatuses.includes(blog?.status);

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
              status: blog?.status === "active" ? "inactive" : "active",
            }
          : blog,
      ),
    );

    try {
      const blog = blogs.find((f) => f?._id === id);
      const newStatus = blog?.status === "active" ? "inactive" : "active";
      await updateFooterDetailStatus(id, newStatus);
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
        <h3 className="heading_category casestudy-heading">
          Footer Detail Management
        </h3>

        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{ height: "44px" }}
            placeholder="Search footer content..."
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
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Company Name</th>
                <th>Copyright Text</th>
                <th className="col-status">Status</th>
                <th className="col-actions" width="120">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <Loader />
                  </td>
                </tr>
              ) : paginatedBlogs.length > 0 ? (
                paginatedBlogs.map((blog, index) => (
                  <tr key={blog._id}>
                    <td data-label="ID">{startIndex + index + 1}</td>
                    <td data-label="Address">{blog.address || "-"}</td>
                    <td data-label="Phone">{blog.phone || "-"}</td>
                    <td data-label="Email">{blog.email || "-"}</td>
                    <td data-label="Company Name">{blog.companyName || "-"}</td>
                    <td data-label="Copyright Text">{blog.copyrightText || "-"}</td>

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
                  <td colSpan="8" className="text-center">
                    No FooterDetails found.
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
                {isEdit ? "Edit FooterDetails" : "Create FooterDetails"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="casestudy-form-grid">
                <div className="casestudy-field">
                  <label>Email</label>
                  <input
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    ref={inputRef}
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>

                <div className="casestudy-field">
                  <label>Phone</label>
                  <input
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback d-block">{errors.phone}</div>
                  )}
                </div>

                <div className="casestudy-field">
                  <label>Company Name</label>
                  <input
                    className={`form-control ${errors.companyName ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.companyName) {
                        setErrors({ ...errors, companyName: "" });
                      }
                    }}
                  />
                  {errors.companyName && (
                    <div className="invalid-feedback d-block">
                      {errors.companyName}
                    </div>
                  )}
                </div>

                <div className="casestudy-field">
                  <label>Copyright Text</label>
                  <input
                    className={`form-control ${errors.copyrightText ? "is-invalid" : ""}`}
                    style={{ height: "50px" }}
                    name="copyrightText"
                    placeholder="Copyright Text"
                    value={formData.copyrightText}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.copyrightText) {
                        setErrors({ ...errors, copyrightText: "" });
                      }
                    }}
                  />
                  {errors.copyrightText && (
                    <div className="invalid-feedback d-block">
                      {errors.copyrightText}
                    </div>
                  )}
                </div>
              </div>

              <div className="casestudy-field mt-3">
                <label>Address</label>
                <textarea
                  className={`form-control ${errors.address ? "is-invalid" : ""}`}
                  style={{ minHeight: "80px" }}
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.address) setErrors({ ...errors, address: "" });
                  }}
                />
                {errors.address && (
                  <div className="invalid-feedback d-block">{errors.address}</div>
                )}
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
            <label htmlFor="footer-page-size">Rows per page</label>
            <select
              id="footer-page-size"
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

export default FooterContent;
