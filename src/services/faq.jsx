



import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { X } from "lucide-react";
import { Editor } from "primereact/editor";
import Loader from "../app/common/loader";
import sanitizeHtml from "../utils/sanitizeHtml";
import { 
  addCategory, addFAQ, deleteFAQ, getCategories, 
  getFAQs, updateFAQ, updateFAQStatus 
} from "../adminApi";
import "./serviceStyle/casestudy.css";

const Faq = () => {
  const dropdownRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const inputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 50];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    question: "",
    answer: "",
    status: "active",
  });

  // ================= FILTER LOGIC =================

  const filteredCategories = category.filter((cat) =>
    cat?.name?.toLowerCase().includes(categorySearch.toLowerCase() || "")
  );

  const filteredFaqs = blogs?.filter(blog => {
    const search = searchText.trim().toLowerCase();
    const searchMatch = !search || 
      blog?.question?.toLowerCase().includes(search) ||
      blog?.answer?.toLowerCase().includes(search) ||
      (blog?.category?.[0]?.name || blog?.category?.name)?.toLowerCase().includes(search);

    const categoryMatch = selectedCategoryIds.length === 0 ||
      selectedCategoryIds.includes(blog?.category?._id || blog?.category?.[0]?._id);

    const statusMatch = selectedStatuses.length === 0 ||
      selectedStatuses.includes(blog?.status);

    return searchMatch && categoryMatch && statusMatch;
  });

  const resolveEditorHtml = (value) => sanitizeHtml(String(value || ""));
  const toPlainText = (html = "") =>
    String(html || "")
      .replace(/<(.|\n)*?>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

  const totalPages = Math.max(1, Math.ceil((filteredFaqs?.length || 0) / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFaqs = (filteredFaqs || []).slice(startIndex, endIndex);
  const showingStart = (filteredFaqs?.length || 0) === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(endIndex, filteredFaqs?.length || 0);

  const validateForm = () => {
    let newErrors = {};
    const plainQuestion = String(formData.question || "")
      .replace(/<(.|\n)*?>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .trim();
    const plainAnswer = String(formData.answer || "")
      .replace(/<(.|\n)*?>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .trim();

    if (!plainQuestion) newErrors.question = "Question is required.";
    if (!plainAnswer) newErrors.answer = "Answer is required.";
    if (!formData.category) newErrors.category = "Please select a category.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= API CALLS =================

  const fetchFaq = async () => {
    try {
      setLoading(true);
      const data = await getFAQs();
      setBlogs(data?.faqs || []);
    } catch (err) { console.error("Faq fetch error", err); } 
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategory(data?.category || []);
    } catch (err) { console.error("Category fetch error", err); }
  };

  useEffect(() => {
    fetchFaq();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategoryIds, selectedStatuses, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ================= HANDLERS =================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return alert("Enter category name");
    try {
      setLoading(true);
      const res = await addCategory({ name: newCategoryName, status: "active" });
      await fetchCategories();
      setFormData(prev => ({ ...prev, category: res?.category?._id }));
      setCategorySearch(res?.category?.name);
      setNewCategoryName("");
      setShowCreateCategory(false);
      setErrors(prev => ({ ...prev, category: "" }));
    } catch (error) { alert("Category create failed"); } 
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      if (isEdit) {
        await updateFAQ(editId, formData);
      } else {
        await addFAQ(formData);
      }
      await fetchFaq();
      setModalShow(false);
    } catch (err) { console.error("Submit error", err); } 
    finally { setLoading(false); }
  };

  const handleToggleStatus = async (id) => {
    const faq = blogs.find(f => f._id === id);
    const newStatus = faq.status === "active" ? "inactive" : "active";
    setBlogs(prev => prev.map(f => f._id === id ? { ...f, status: newStatus } : f));
    try {
      await updateFAQStatus(id, newStatus);
    } catch { fetchFaq(); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this FAQ?")) {
      try {
        await deleteFAQ(id);
        fetchFaq();
      } catch (err) { console.error(err); }
    }
  };

  const openCreateModal = () => {
    setFormData({ category: "", question: "", answer: "", status: "active" });
    setCategorySearch("");
    setIsEdit(false);
    setErrors({});
    setModalShow(true);
  };

  const openEditModal = (faq) => {
    const catId = faq?.category?._id || faq?.category?.[0]?._id;
    const catName = faq.category?.name || faq.category?.[0]?.name || "";
    setFormData({ question: faq.question, answer: faq.answer, category: catId, status: faq.status });
    setCategorySearch(catName);
    setErrors({});
    setEditId(faq._id);
    setIsEdit(true);
    setModalShow(true);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowCategoryDropdown(false);
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="category-container casestudy-page">
      <div className="casestudy-shell">
        <h3 className="heading_category casestudy-heading">Faq Management</h3>

        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{ height: "44px" }}
            placeholder="Search faq..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="filter-wrapper" ref={filterDropdownRef}>
            <div className="filter-input" onClick={() => setIsOpen(!isOpen)}>
              {selectedCategoryIds.length === 0 && selectedStatuses.length === 0 && (
                <span>Filter by category or status</span>
              )}
              {selectedCategoryIds.map(id => (
                <span key={id} className="chip chip-cat">
                  {category.find(c => c._id === id)?.name}
                  <X size={14} onClick={(e) => { e.stopPropagation(); setSelectedCategoryIds(prev => prev.filter(i => i !== id)); }} />
                </span>
              ))}
              {selectedStatuses.map(st => (
                <span key={st} className="chip chip-status">
                  {st}
                  <X size={14} onClick={(e) => { e.stopPropagation(); setSelectedStatuses(prev => prev.filter(i => i !== st)); }} />
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
                        onChange={() => setSelectedCategoryIds(prev => prev.includes(cat._id) ? prev.filter(i => i !== cat._id) : [...prev, cat._id])}
                      /> {cat.name}
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
                        onChange={() => setSelectedStatuses(prev => prev.includes(st) ? prev.filter(i => i !== st) : [...prev, st])}
                      /> {st}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mb-3 create_buttons casestudy-add-btn" onClick={openCreateModal}>Add</div>
        </div>
        <div className="casestudy-meta">
          <span>Total: {filteredFaqs?.length || 0}</span>
          <span>Page: {currentPage} / {totalPages}</span>
        </div>

        <div className="casestudy-table-wrap">
        <table className="table table-bordered table-striped custom-table mt-4 casestudy-table">
          <thead className="table-primary">
            <tr>
              <th>id</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Category</th>
              <th>Status</th>
              <th width="100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center"><Loader /></td></tr>
            ) : paginatedFaqs.length > 0 ? (
              paginatedFaqs.map((faq, index) => (
                <tr key={faq._id}>
                  <td>{startIndex + index + 1}</td>
                  <td>
                    {toPlainText(resolveEditorHtml(faq?.question)).slice(0, 20) || "-"}
                  </td>
                  <td>
                    {toPlainText(resolveEditorHtml(faq?.answer)).slice(0, 20) || "-"}
                  </td>
                  <td>{faq?.category?.[0]?.name || faq?.category?.name || "-"}</td>
                  <td>
                    <label className="switchs">
                      <input type="checkbox" checked={faq.status === "active"} onChange={() => handleToggleStatus(faq._id)} />
                      <span className="sliders"></span>
                    </label>
                  </td>
                  <td className="action_button" style={{ display: "flex", columnGap: "1rem" }}>
                    <div className="edits" onClick={() => openEditModal(faq)}><FaRegEdit size={18} /></div>
                    <div className="deletes" onClick={() => handleDelete(faq._id)}><MdDeleteOutline size={18} /></div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center">No Faq found.</td></tr>
            )}
          </tbody>
        </table>
        </div>

        <div className="casestudy-pagination-footer mt-4">
          <div className="casestudy-pagination-info">
            <span>
              Showing {showingStart}-{showingEnd} of {filteredFaqs?.length || 0}
            </span>
            <span>Current Page: {currentPage}/{totalPages}</span>
          </div>
          <div className="casestudy-page-size">
            <label htmlFor="faq-page-size">Rows per page</label>
            <select
              id="faq-page-size"
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
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
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

        <Modal show={modalShow} onHide={() => setModalShow(false)} centered dialogClassName="modal-custom">
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{isEdit ? "Edit FAQ" : "Create FAQ"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="position-relative mb-4" ref={dropdownRef}>
                <label>Select Category</label>
                <div className="d-flex gap-2 mt-1">
                  <button type="button" className="btn btn-outline-primary" onClick={() => setShowCreateCategory(!showCreateCategory)}>+</button>
                  <input
                    ref={inputRef}
                    type="text"
                    className={`form-control ${errors.category ? "is-invalid" : ""}`}
                    placeholder="Search or select category"
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setShowCategoryDropdown(true);
                    }}
                    onFocus={() => setShowCategoryDropdown(true)}
                  />
                  {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
                </div>

                {showCategoryDropdown && (
                  <ul className="list-group position-absolute w-100 mt-1" style={{ zIndex: 1000 }}>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <li
                          key={cat._id}
                          className="list-group-item list-group-item-action"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFormData({ ...formData, category: cat._id });
                            setCategorySearch(cat.name);
                            setShowCategoryDropdown(false);
                            setErrors(prev => ({ ...prev, category: "" }));
                          }}
                        >
                          {cat.name}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-muted">No results found</li>
                    )}
                  </ul>
                )}
              </div>

              {showCreateCategory && (
                <div className="border p-2 mb-3 rounded bg-light">
                  <input
                    className="form-control mb-2"
                    placeholder="New Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <Button size="sm" onClick={handleCreateCategory}>Save Category</Button>
                </div>
              )}

              <Form.Group className="mb-3">
                <label>FAQ Question</label>
                <Editor
                  value={formData.question}
                  onTextChange={(e) => {
                    setFormData((prev) => ({ ...prev, question: e.htmlValue || "" }));
                    if (errors.question) setErrors((prev) => ({ ...prev, question: "" }));
                  }}
                  style={{ height: "120px" }}
                  className={`mt-1 ${errors.question ? "is-invalid" : ""} casestudy-rich-editor`}
                />
                {errors.question ? <div className="invalid-feedback d-block">{errors.question}</div> : null}
              </Form.Group>

              <Form.Group className="mb-3">
                <label>FAQ Answer</label>
                <Editor
                  value={formData.answer}
                  onTextChange={(e) => {
                    setFormData((prev) => ({ ...prev, answer: e.htmlValue || "" }));
                    if (errors.answer) setErrors((prev) => ({ ...prev, answer: "" }));
                  }}
                  style={{ height: "120px" }}
                  className={`mt-1 ${errors.answer ? "is-invalid" : ""} casestudy-rich-editor`}
                />
                {errors.answer ? <div className="invalid-feedback d-block">{errors.answer}</div> : null}
              </Form.Group>

              <Form.Group className="mb-3">
                <label>Status</label>
                <Form.Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
              <Button variant="primary" type="submit" className={isEdit ? "edit_modal" : ""}>
                {isEdit ? "Update" : "Create"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Faq;
