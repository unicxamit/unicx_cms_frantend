import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { X } from "lucide-react";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  updateCategoryStatus,
} from "../adminApi";
import Loader from "../app/common/loader";
import "./serviceStyle/casestudy.css";

function Category() {
  const filterRef = useRef(null);
  const inputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 50];

  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data?.category || []);
    } catch (err) {
      console.log("fetch category error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const onOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    if (modalShow) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [modalShow]);

  const validateForm = () => {
    const next = {};
    if (!formData.name?.trim()) next.name = "Category name is required.";
    if (!formData.status) next.status = "Please select a status.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setFormData({ name: "", status: "active" });
    setErrors({});
    setEditId(null);
    setIsEdit(false);
    setModalShow(true);
  };

  const openEditModal = (cat) => {
    setFormData({
      name: cat?.name || "",
      status: cat?.status || "active",
    });
    setErrors({});
    setEditId(cat?._id);
    setIsEdit(true);
    setModalShow(true);
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      await addCategory(formData);
      await fetchCategories();
      setModalShow(false);
    } catch (err) {
      console.log("create category error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      await updateCategory(editId, formData);
      await fetchCategories();
      setModalShow(false);
    } catch (err) {
      console.log("update category error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) handleUpdate();
    else handleCreate();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      setLoading(true);
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.log("delete category error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const current = categories.find((c) => c?._id === id);
    if (!current) return;
    const newStatus = current.status === "active" ? "inactive" : "active";

    setCategories((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)),
    );

    try {
      await updateCategoryStatus(id, newStatus);
    } catch {
      await fetchCategories();
    }
  };

  const toggleSelection = (id, setter) => {
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const search = searchText.trim().toLowerCase();
  const filteredCategories = categories.filter((cat) => {
    const searchMatch = !search || cat?.name?.toLowerCase().includes(search);
    const statusMatch =
      selectedStatuses.length === 0 || selectedStatuses.includes(cat?.status);
    return searchMatch && statusMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
  const showingStart = filteredCategories.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(endIndex, filteredCategories.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedStatuses, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="category-container casestudy-page">
      <div className="casestudy-shell">
        <h3 className="heading_category casestudy-heading">Category Management</h3>

        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{ height: "44px" }}
            placeholder="Search category..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="filter-wrapper" ref={filterRef}>
            <div className="filter-input" onClick={() => setIsOpen((prev) => !prev)}>
              {selectedStatuses.length === 0 ? <span>Filter by status</span> : null}
              {selectedStatuses.map((st) => (
                <span key={st} className="chip chip-status">
                  {st}
                  <X size={14} onClick={() => toggleSelection(st, setSelectedStatuses)} />
                </span>
              ))}
            </div>

            {isOpen ? (
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
            ) : null}
          </div>

          <button type="button" className="mb-3 create_buttons casestudy-add-btn" onClick={openCreateModal}>
            Add
          </button>
        </div>

        <div className="casestudy-meta">
          <span>Total: {filteredCategories.length}</span>
          <span>Page: {currentPage} / {totalPages}</span>
        </div>

        <div className="casestudy-table-wrap">
          <table className="table table-bordered table-striped custom-table mt-4 casestudy-table category-table">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    <Loader />
                  </td>
                </tr>
              ) : paginatedCategories.length > 0 ? (
                paginatedCategories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td data-label="ID">{startIndex + index + 1}</td>
                    <td data-label="Category">{cat?.name || "-"}</td>
                    <td data-label="Status">
                      <label className="switchs">
                        <input
                          type="checkbox"
                          checked={cat?.status === "active"}
                          onChange={() => handleToggleStatus(cat._id)}
                        />
                        <span className="sliders"></span>
                      </label>
                    </td>
                    <td data-label="Actions" className="action_button casestudy-actions">
                      <div className="edits" onClick={() => openEditModal(cat)}>
                        <FaRegEdit size={18} />
                      </div>
                      <div className="deletes" onClick={() => handleDelete(cat._id)}>
                        <MdDeleteOutline size={18} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No category found.
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
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{isEdit ? "Edit Category" : "Create Category"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="casestudy-modal-body">
              <div className="casestudy-field">
                <label>Category Name</label>
                <input
                  ref={inputRef}
                  className={`form-control mt-1 casestudy-input-height ${errors.name ? "is-invalid" : ""}`}
                  name="name"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                />
                {errors.name ? <div className="invalid-feedback d-block">{errors.name}</div> : null}
              </div>

              <div className="casestudy-field">
                <label>Status</label>
                <select
                  className="form-select mt-1 casestudy-input-height"
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
                  Create
                </Button>
              )}
            </Modal.Footer>
          </Form>
        </Modal>

        <div className="casestudy-pagination-footer mt-4">
          <div className="casestudy-pagination-info">
            <span>
              Showing {showingStart}-{showingEnd} of {filteredCategories.length}
            </span>
            <span>Current Page: {currentPage}/{totalPages}</span>
          </div>
          <div className="casestudy-page-size">
            <label htmlFor="category-page-size">Rows per page</label>
            <select
              id="category-page-size"
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
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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
}

export default Category;
