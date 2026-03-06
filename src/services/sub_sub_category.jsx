 import React, { useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { addCategory, addSubCategory, addServices, deleteServices, getCategories, getSubCategories, getSubSubCategories, updateServices, updateServicesStatus } from "../adminApi";
import Loader from "../app/common/loader";
import { X } from "lucide-react";
import "./serviceStyle/casestudy.css"
import { Form } from "react-bootstrap";
const Services = () => {
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    name: "",
    indeman_service_name: "",
    search_tag: "",
    status: "active",
    indeman_sericons: null
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRefsub = useRef(null);
  const inputRefsub = useRef(null);
  const [editId, setEditId] = useState(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateSubCategory, setShowCreateSubCategory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 50];
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);

  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add a state for image preview
  const [iconPreview, setIconPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, indeman_sericons: file }));
      setIconPreview(URL.createObjectURL(file)); // Create local preview URL
      if (errors.indeman_sericons) setErrors({ ...errors, indeman_sericons: "" });
    }
  };

  // ---------- INPUT ----------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === "order_index" ? Number(value) : value
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.category) {
      newErrors.category = "Please select a Category.";
    }

    if (!formData.subcategory) {
      newErrors.subcategory = "Please select a SubCategory.";
    }

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Service name is required.";
    }
    if (!formData.indeman_service_name || formData.indeman_service_name.trim() === "") {
      newErrors.indeman_service_name = "indeman_service_name is required.";
    }
    if (!formData.indeman_sericons) {
      newErrors.indeman_sericons = "indeman_sericons is required.";
    }
    if (!formData.search_tag || formData.search_tag.trim() === "") {
      newErrors.search_tag = "search_tag is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if valid
  };

  const fetchServices = async () => {
    setLoading(true);

    try {
      const data = await getSubSubCategories();
      setSubSubCategories(data?.services); // ✅ CORRECT
    } catch (err) {
      console.log("Failed to fetch subsubcategories");
    } finally {
      setLoading(false);
    }
  };

  const fetchsubCategories = async () => {
    setLoading(true);

    try {
      const data = await getSubCategories();
      setSubCategory(data?.subCategories); // ✅ CORRECT
    } catch (err) {
      console.log("Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const data = await getCategories();

      setCategory(data?.category);   // 👈 correct
    } catch (err) {
      console.log('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServices();
    fetchsubCategories()
    fetchCategories()
  }, [])

  const handleCreateCategory = async () => {


    try {
      setLoading(true);

      const res = await addCategory({
        name: newCategoryName,
        status: "active",
      });

      await fetchCategories();  // refresh list

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

  const handleCreateSubCategory = async () => {

    try {
      setLoading(true);

      const payload = {
        name: newSubCategoryName,
        category: formData?.category, // 👈 PASS CATEGORY ID
        status: "active",
      };

      const res = await addSubCategory(payload);

      await fetchsubCategories();

      // auto select created subcategory
      setFormData(prev => ({
        ...prev,
        subcategory: res?.subCategory?._id,
      }));

      setSubCategorySearch(res?.subCategory?.name);
      setNewSubCategoryName("");
      setShowCreateSubCategory(false);

    } catch (err) {
      console.error(err);
      alert("Failed to create subcategory");
    } finally {
      setLoading(false);
    }
  };

  // ---------- CREATE ----------
  const handleCreate = async () => {

    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = new FormData();
      // Append all text fields
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      const res = await addServices(data);

      console.log("Create Response:", res);



      await fetchServices();

      setModalShow(false);

    } catch (err) {

      console.error("Create Error:", err);


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
  // ---------- UPDATE ----------
  const handleUpdate = async () => {


    try {
      setLoading(true);
      const data = new FormData();
      // Append all text fields
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      await updateServices(editId, data);

      await fetchServices();
      setModalShow(false);
    } catch (err) {
      console.log("Error updating FAQ", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await deleteServices(id);


      fetchServices();
    } catch (err) {
      console.log("Delete failed", err);
    }
  };

  // ---------- OPEN CREATE ----------

  const openCreateModal = () => {
    setFormData({
      category: "",
      subcategory: "",
      order_index: 0,
      indeman_service_name: "",
      search_tag: "",
      name: "",
      status: "active",

    });
    setIconPreview(null); // Clear preview

    setCategorySearch("");
    setSubCategorySearch("");
    setErrors({}); // ✨ Reset errors
    setIsEdit(false);
    setModalShow(true);
  };
  // ---------- OPEN EDIT ----------
  const openEditModal = (item) => {
    setFormData({
      name: item.name,
      subcategory: item.subcategory?._id || item.subcategory?.[0]?._id,
      category: item.category?._id || item.category?.[0]?._id,
      search_tag: item?.search_tag,
      indeman_service_name: item?.indeman_service_name,
      status: item.status,
      order_index: item.order_index,
      indeman_sericons: item?.indeman_sericons
    });
    setIconPreview(item.indeman_sericons);
    setCategorySearch(item.category?.name || item.category?.[0]?.name || "");
    setSubCategorySearch(item.subcategory?.name || item.subcategory?.[0]?.name || "")
    setEditId(item._id);
    setIsEdit(true);
    setModalShow(true);
  };


  React.useEffect(() => {
    if (formData?.category) setShowCreateCategory(false);
  }, [formData?.category]);

  React.useEffect(() => {
    if (formData.subcategory) setShowCreateSubCategory(false);
  }, [formData?.subcategory]);
  React.useEffect(() => {
    if (formData.category) {
      const cat = category?.find(
        (c) => c?._id === formData?.category
      );
      if (cat) setCategorySearch(cat?.name);
    }
  }, [formData?.category]);




  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      subcategory: "",
    }));
    setSubCategorySearch("");
  }, [formData?.category]);
  React.useEffect(() => {
    if (formData?.subcategory) {
      const subCat = subCategory?.find(
        (sc) => sc?._id === formData?.subcategory
      );
      if (subCat) setSubCategorySearch(subCat?.name);
    }
  }, [formData?.subcategory, subCategory]);


  useEffect(() => {
    if (formData?.category) {
      const cat = category?.find(
        (c) => c?._id === formData?.category
      );
      if (cat) setCategorySearch(cat?.name);

      setFormData((prev) => ({ ...prev, subcategory: "" }));
      setSubCategorySearch("");
    }
  }, [formData?.category]);



  // ---------------- MASTER FILTERED LIST ----------------
  const safeCategory = Array.isArray(category) ? category : [];
  const safeSubCategory = Array.isArray(subCategory) ? subCategory : [];
  // const safeServices = Array.isArray(subSubCategories) ? subSubCategories : [];

  const filteredCategories = safeCategory?.filter(cat =>
    cat?.name?.toLowerCase()?.includes(categorySearch?.toLowerCase())
  );

  const filteredSubCategories = safeSubCategory?.filter(sc =>
    sc.category[0]?._id === formData?.category || sc?.category === formData?.category
  );


  const filteredSubCategoriesSearch = filteredSubCategories?.filter(sc =>
    sc?.name?.toLowerCase()?.includes(subCategorySearch?.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        inputRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRefsub.current &&
        inputRefsub.current &&
        !dropdownRefsub.current.contains(e.target) &&
        !inputRefsub.current.contains(e.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const toggleSelection = (id, setter) => {
    setter(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const search = searchText.trim().toLowerCase();

  const filteredBlogs = subSubCategories?.filter(blog => {
    const searchMatch =
      !search ||
      blog?.name?.toLowerCase()?.includes(search);
    // blog.?.toLowerCase().includes(search);

    const categoryMatch =
      selectedCategoryIds.length === 0 ||
      selectedCategoryIds?.includes(
        blog?.category?._id || blog?.category?.[0]?._id
      );

    const categorySubMatch =
      selectedSubCategoryIds?.length === 0 ||
      selectedSubCategoryIds.includes(
        blog?.subcategory?._id || blog?.subcategory?.[0]?._id
      );

    const statusMatch =
      selectedStatuses?.length === 0 ||
      selectedStatuses?.includes(blog?.status);

    return searchMatch && categoryMatch && categorySubMatch && statusMatch;
  });


  // pagination filter
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
  }, [searchText, selectedCategoryIds, selectedSubCategoryIds, selectedStatuses, itemsPerPage]);
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

  const handleToggleStatus = async (id) => {
    setSubSubCategories((prev) =>
      prev.map((faq) =>
        faq?._id === id
          ? { ...faq, status: faq?.status === "active" ? "inactive" : "active" }
          : faq
      )
    );

    try {
      const faq = subSubCategories.find((f) => f?._id === id);
      const newStatus = faq?.status === "active" ? "inactive" : "active";
      await updateServicesStatus(id, newStatus);
    } catch {
      fetchServices(); // rollback
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
        <h3 className="heading_category casestudy-heading">Service Management</h3>
        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{ height: "44px" }}
            placeholder="Search category / service..."
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
              {selectedSubCategoryIds.map(id => {
                const cat = subCategory.find(c => c._id === id);
                return (
                  <span key={id} className="chip chip-cat">
                    {cat?.name}
                    <X size={14} onClick={() => toggleSelection(id, setSelectedSubCategoryIds)} />
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
                <div style={{ display: "flex", columnGap: "1rem" }}>
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
                    <h6>SubCategories</h6>
                    {subCategory.map(cat => (
                      <label key={cat._id}>
                        <input
                          type="checkbox"
                          checked={selectedSubCategoryIds.includes(cat._id)}
                          onChange={() =>
                            toggleSelection(cat._id, setSelectedSubCategoryIds)
                          }
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
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
        <table className="table table-bordered table-striped custom-table mt-4 casestudy-table service-table">
          <thead className="table-primary">
            <tr>
              <th><input className="form-check-input" type="checkbox" value="" /></th>
              <th>id</th>
              <th>Servies</th>
              <th>SubCategory</th>
              <th>Category</th>
              <th>Status</th>
              <th>Icon</th>
              <th width="180">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">
                <Loader />
                </td>
              </tr>)

              :
              paginatedSubCategories.length > 0 ? (
                paginatedSubCategories.map((item, index) => {
                  const categoryName = item?.category?.[0]?.name || "-";
                  const subcategoryName = item?.subcategory?.[0]?.name || "-";


                  return (
                    <tr key={item._id}>
                      <td data-label="Select"><input className="form-check-input" type="checkbox" value="" /></td>
                      <td data-label="ID">{startIndex + index + 1}</td>
                      <td data-label="Service">{item.name}</td>
                      <td data-label="SubCategory">{subcategoryName}</td>
                      <td data-label="Category">{categoryName}</td>
                      <td data-label="Status">
                        <label className="switchs">
                          <input
                            type="checkbox"
                            checked={item.status === "active"}
                            onChange={() => handleToggleStatus(item._id)}
                          />
                          <span className="sliders"></span>
                        </label>
                      </td>
                      <td data-label="Icon">
                        {item?.indeman_sericons ? (
                          <img
                            src={item.indeman_sericons}
                            alt={item?.name || "Service icon"}
                            className="casestudy-thumb"
                          />
                        ) : (
                          <span>No Icon</span>
                        )}
                      </td>
                      <td data-label="Actions" className="action_button casestudy-actions" style={{ display: "flex", columnGap: "1rem" }}>
                        <div className="edits" onClick={() => openEditModal(item)}>
                          <FaRegEdit size={18} />
                        </div>
                        <div
                          className="deletes"
                          onClick={() => handleDelete(item._id)}
                        >
                          <MdDeleteOutline size={18} />
                        </div>

                        <div
                          className="edits"

                          onClick={() => {
                            navigate(
                              `/admin/Services-details/${item._id}`,
                              {
                                state: {
                                  serviceName: item.name,
                                  categoryName: categoryName,
                                  subcategoryName: subcategoryName
                                },
                              }
                            );
                          }}
                        >
                          <IoIosAdd size={18} />
                        </div>

                      </td>
                    </tr>
                  );
                })) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No services found.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
        </div>
        {/* Modal */}
        <Modal
          show={modalShow}
          //  ref={inputRef}
          onHide={() => setModalShow(false)}
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
              <Modal.Title>{isEdit ? "Edit Services" : "Create Services"}</Modal.Title>
            </Modal.Header>

            <Modal.Body>

              {/* Category Select */}
              <div className="position-relative " style={{ marginBottom: "2rem" }}
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
                    className={`form-control ${errors.category ? "is-invalid" : ""}`} style={{ height: "50px" }}
                    placeholder="Search or select category"
                    value={categorySearch}
                    onChange={(e) => {
                      setCategorySearch(e.target.value);
                      setShowCategoryDropdown(true);
                      if (errors.category) setErrors({ ...errors, category: "" });
                    }}
                    onFocus={() => setShowCategoryDropdown(true)}
                  />
                  {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
                </div>

                {/* Dropdown List */}
                {showCategoryDropdown && (
                  <ul className="list-group position-absolute w-100 mt-1" style={{ zIndex: 1000 }} ref={dropdownRef}>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat) => (
                        <li
                          key={cat._id}
                          className="list-group-item list-group-item-action"
                          onClick={() => {
                            setFormData({ ...formData, category: cat._id });
                            setCategorySearch(cat.name);
                            setShowCategoryDropdown(false);
                            if (errors.category) {
                              setErrors((prev) => ({ ...prev, category: "" }));
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {cat.name}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-muted">No services found</li>
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
                  <Button size="sm" disabled={loading} onClick={handleCreateCategory}>
                    {loading ? "Saving..." : "Save Category"}
                  </Button>
                </div>
              )}
              <div className="position-relative " style={{ marginBottom: "2rem" }}
              >
                <lebal> Select SubCategory</lebal>
                <div className="d-flex gap-2 mt-1">
                  {/* ➕ Icon (always visible) */}
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    disabled={!formData.category}
                    title={!formData.category ? "Select category first" : ""}
                    onClick={() => setShowCreateSubCategory(!showCreateSubCategory)}
                  >
                    +
                  </button>

                  {/* Search Input */}
                  <input
                    ref={inputRefsub}
                    type="text"
                    className={`form-control ${errors.subcategory ? "is-invalid" : ""}`} style={{ height: "50px" }}
                    placeholder="Search or select subcategory"
                    value={subCategorySearch}
                    disabled={!formData.category}
                    onChange={(e) => {
                      setSubCategorySearch(e.target.value);
                      setShowSubCategoryDropdown(true);
                      if (errors.subcategory) setErrors({ ...errors, subcategory: "" });
                    }}
                    onFocus={() => setShowSubCategoryDropdown(true)}
                  />
                  {errors.subcategory && <div className="invalid-feedback d-block">{errors.subcategory}</div>}
                </div>

                {/* Dropdown List */}
                {showSubCategoryDropdown && formData.category && (
                  <ul
                    className="list-group position-absolute w-100 mt-1"
                    style={{ zIndex: 1000 }}
                  >
                    {filteredSubCategoriesSearch.length > 0 ? (
                      filteredSubCategoriesSearch.map(sc => (
                        <li
                          key={sc._id}
                          className="list-group-item list-group-item-action"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              subcategory: sc._id,
                            }));
                            setSubCategorySearch(sc.name);
                            setShowSubCategoryDropdown(false);
                            if (errors.subcategory) {
                              setErrors((prev) => ({ ...prev, subcategory: "" }));
                            }
                          }}
                        >
                          {sc.name}
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-muted">
                        No subcategories found
                      </li>
                    )}
                  </ul>
                )}

              </div>

              {showCreateSubCategory && (
                <div className="border p-2 mb-3 rounded">
                  <input
                    className="form-control mb-2"
                    placeholder="New SubCategory Name"
                    value={newSubCategoryName}
                    onChange={(e) => setNewSubCategoryName(e.target.value)}
                  />
                  <Button size="sm" disabled={loading} onClick={handleCreateSubCategory}>
                    {loading ? "Saving..." : "Save subCategory"}
                  </Button>
                </div>
              )}
              <div style={{ display: "flex", columnGap: "1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Service Name</label>
                  <input
                    className={`form-control mt-1 ${errors.name ? "is-invalid" : ""}`} style={{ height: "50px" }}// 🔴 Error class
                    name="name"
                    placeholder="Service Name"
                    value={formData.name}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label>Indemand Service Name</label>
                  <input
                    className={`form-control mt-1 ${errors.indeman_service_name ? "is-invalid" : ""}`} style={{ height: "50px" }} // 🔴 Error class
                    name="indeman_service_name"
                    placeholder=" Indemand Service Name"
                    value={formData.indeman_service_name}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.indeman_service_name) setErrors({ ...errors, indeman_service_name: "" });
                    }}
                  />
                  {errors.indeman_service_name && <div className="invalid-feedback">{errors.indeman_service_name}</div>}
                </div>
              </div>
              <div style={{ display: "flex", columnGap: "1rem", marginTop: "0.3rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Search Tage</label>
                  <input
                    className={`form-control mt-1 ${errors.search_tag ? "is-invalid" : ""}`} style={{ height: "50px" }} // 🔴 Error class
                    name="search_tag"
                    placeholder="Search Tage"
                    value={formData.search_tag}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.search_tag) setErrors({ ...errors, search_tag: "" });
                    }}
                  />
                  {errors.search_tag && <div className="invalid-feedback">{errors.search_tag}</div>}
                </div>
                {/* Status */}
                <div style={{ marginBottom: "1rem" }}>
                  <lebal>Status </lebal>
                  <select
                    className="form-select mt-1" style={{ width: "220px" }}
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select></div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Service Icon</label>

                {/* Show Preview if it exists */}
                {iconPreview && (
                  <div className="mb-2">
                    <img
                      src={iconPreview}
                      alt="Preview"
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className={`form-control ${errors.indeman_sericons ? "is-invalid" : ""}`}
                  name="indeman_sericons"
                  onChange={handleFileChange}
                />
                {errors.indeman_sericons && <div className="invalid-feedback">{errors.indeman_sericons}</div>}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalShow(false)}>
                Close
              </Button>
              {/* {isEdit ? (
            <Button className="edit_modal"
             onClick={handleUpdate}>
              Update
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
          )} */}
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
            <label htmlFor="services-page-size">Rows per page</label>
            <select
              id="services-page-size"
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
      </div>
    </div>
  );
};

export default Services;









