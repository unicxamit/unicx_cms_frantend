import React, { useState,useEffect,useRef } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { addCategory, addSubCategory, deleteSubCategory, getCategories, getSubCategories, updateSubCategory, updateSubCategorystatus } from "../adminApi";
import Loader from "../app/common/loader";
import { X } from "lucide-react";
import "./serviceStyle/casestudy.css"
import { Form } from "react-bootstrap";
const Sub_category = () => {
  const [subCategories, setSubCategories] = useState([]);
const [errors, setErrors] = useState({});
  const [category,setCategory]=useState([])
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    status: "active",
  });
  const dropdownRef = useRef(null);
const categoryDropdownRef = useRef(null);
const inputRef = useRef(null);
const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
const [showCreateCategory, setShowCreateCategory] = useState(false);
const [searchText, setSearchText] = useState("");
 const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
 
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const pageSizeOptions = [10, 20, 30, 50];
const [newCategoryName, setNewCategoryName] = useState("");
const [categorySearch, setCategorySearch] = useState("");
const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);


const validateForm = () => {
  let newErrors = {};

  // Validate SubCategory Name
  if (!formData.name || formData.name.trim() === "") {
    newErrors.name = "SubCategory name is required.";
  } 

  // Validate Parent Category (Must have an ID selected)
  if (!formData.category || formData.category.trim() === "") {
    newErrors.category = "Please select a parent category.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  // ---------- INPUT ----------
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: name === "order_index" ? Number(value) : value
  }));
};


const fetchsubCategories = async () => {
  setLoading(true);

  try {
    const data = await getSubCategories();
    setSubCategories(data?.subCategories); // ✅ CORRECT
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
useEffect(()=>{
fetchsubCategories()
fetchCategories()
},[])

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

  // ---------- CREATE ----------
const handleCreate = async () => {

  
if (!validateForm()) return;
  try {
    setLoading(true);

    const res = await addSubCategory(formData);

    console.log("Create Response:", res);

    // setMessage(res?.message || "Category created successfully");

    await fetchsubCategories();

    setModalShow(false);

  } catch (err) {

    console.error("Create Error:", err);
    // setMessage(err?.response?.data?.message || "Error occurred while saving.");

  } finally {
    setLoading(false);
  }
};

  // ---------- UPDATE ----------
   const handleUpdate = async () => {
  if (!validateForm()) return;  
     try {
       setLoading(true);
       await updateSubCategory(editId, formData);
      
       await fetchsubCategories();
       setModalShow(false);
     } catch(err) {
       console.log("Error updating FAQ",err);
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
     if (!window.confirm("Delete this SubCategory?")) return;
 
     try {
       await deleteSubCategory(id);
       fetchsubCategories();
     } catch(err) {
       console.log("Delete failed",err.message);
     }
   };




const openCreateModal = () => {
  setFormData({ category: "", name: "", status: "active" });
  setCategorySearch("");
  setErrors({}); // Clear errors
  setIsEdit(false);
  setModalShow(true);
};

const openEditModal = (subCat) => {
  setFormData({
    name: subCat?.name,
    category: subCat?.category?._id || subCat?.category?.[0]?._id,
    status: subCat?.status,
  });
  setCategorySearch(subCat?.category?.name || subCat?.category?.[0]?.name || "");
  setErrors({}); // Clear errors
  setEditId(subCat?._id);
  setIsEdit(true);
  setModalShow(true);
};

const filteredCategories = category.filter((cat) =>
  cat?.name?.toLowerCase().includes(categorySearch.toLowerCase() || "")
);



 const toggleSelection = (id, setter) => {
    setter(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const search = searchText?.trim()?.toLowerCase();


 const filteredSubCategories = subCategories.filter((subCat) => {
  const searchMatch =
    !search || subCat?.name?.toLowerCase().includes(search);

  const categoryMatch =
    selectedCategoryIds.length === 0 ||
    selectedCategoryIds.includes(
      subCat?.category?._id || subCat?.category?.[0]?._id
    );

  const statusMatch =
    selectedStatuses.length === 0 ||
    selectedStatuses.includes(subCat?.status);

  return searchMatch && categoryMatch && statusMatch;
});


useEffect(() => {
  const handleClickOutside = (e) => {
    const clickedInsideDropdown =
      categoryDropdownRef.current &&
      categoryDropdownRef.current.contains(e.target);
    const clickedInsideInput =
      inputRef.current &&
      inputRef.current.contains(e.target);

    if (!clickedInsideDropdown && !clickedInsideInput) {
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
 setSubCategories((prev) =>
    prev.map((faq) =>
      faq?._id === id
        ? { ...faq, status: faq?.status === "active" ? "inactive" : "active" }
        : faq
    )
  );

  try {
    const faq = subCategories.find((f) => f?._id === id);
    const newStatus = faq?.status === "active" ? "inactive" : "active";
    await updateSubCategorystatus(id, newStatus);
  } catch {
 fetchsubCategories(); // rollback
  }
};

const totalPages = Math.max(1, Math.ceil(
  filteredSubCategories.length / itemsPerPage
));

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

const paginatedSubCategories =
  filteredSubCategories.slice(startIndex, endIndex);
const showingStart = filteredSubCategories.length === 0 ? 0 : startIndex + 1;
const showingEnd = Math.min(endIndex, filteredSubCategories.length);
  
useEffect(() => {
  setCurrentPage(1);
}, [searchText, selectedCategoryIds, selectedStatuses, itemsPerPage]);


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
        <h3 className="heading_category casestudy-heading">SubCategory Management</h3>

<div className="custom_headings casestudy-toolbar">
  {/* <div className="col-md-3"> */}
    <input
      type="text"
      className="form-control casestudy-search"style={{height:"44px"}}
      placeholder="Search subcategory..."
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
        

    <div  className="mb-3 create_buttons casestudy-add-btn"onClick={openCreateModal}>
            Add
          </div>
</div>
      <div className="casestudy-meta">
        <span>Total: {filteredSubCategories.length}</span>
        <span>Page: {currentPage} / {totalPages}</span>
      </div>
     

  
      {/* Table */}
      <div className="casestudy-table-wrap">
      <table className="table table-bordered table-striped custom-table mt-4 casestudy-table ">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>SubCategory</th>
            <th>Category</th>
            <th>Status</th>
            <th width="">Actions</th>
          </tr>
        </thead>
       <tbody>
  {loading  ? (
    <tr>
      <td colSpan="5" className="text-center">
        <Loader/>
      </td>
    </tr>
  ) 
 :
paginatedSubCategories.length > 0 ? (
            paginatedSubCategories.map((subCat, index) => {
      const categoryName = subCat?.category?.[0]?.name || "-";

      return (
        <tr key={subCat._id}>
          <td data-label="ID">{startIndex + index + 1}</td>
          <td data-label="SubCategory">{subCat.name}</td>
          <td data-label="Category">{categoryName}</td>

          <td data-label="Status">
            <label className="switchs">
              <input
                type="checkbox"
                checked={subCat.status === "active"}
                onChange={() => handleToggleStatus(subCat._id)}
              />
              <span className="sliders"></span>
            </label>
          </td>

          <td data-label="Actions" className="action_button casestudy-actions">
            <div
              className="edits"
              onClick={() => openEditModal(subCat)}
            >
              <FaRegEdit size={18} />
            </div>

            <div
              className="deletes"
              onClick={() => handleDelete(subCat._id)}
            >
              <MdDeleteOutline size={18} />
            </div>
          </td>
        </tr>
      );
    })
  ): (
    <tr>
      <td colSpan="5" className="text-center">
        No SubCategory found.
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
        <Modal.Header closeButton >
          <Modal.Title>
            {isEdit ? "Edit SubCategory" : "Create SubCategory"}
          </Modal.Title>
        </Modal.Header>

      <Modal.Body className="casestudy-modal-body">
  {/* Category Selection Field */}
  <div className="position-relative casestudy-category-wrap">
    <label className="fw-bold">Select Category</label>
    <div className="d-flex gap-2 mt-1">
      <div
        type="button"
        className="btn btn-outline-primary"
        onClick={() => setShowCreateCategory(!showCreateCategory)}
      >
        <FiPlus />
      </div>
      <div className="w-100">
      <input
        ref={inputRef}
        type="text"
        className={`form-control casestudy-input-height ${errors.category ? "is-invalid" : ""}`}
        placeholder="Search or select category name"
        value={categorySearch}
        onChange={(e) => {
          setCategorySearch(e.target.value);
          setShowCategoryDropdown(true);
          // Clear error when user interacts
          if (errors.category) setErrors({ ...errors, category: "" });
        }}
        onFocus={() => setShowCategoryDropdown(true)}
      />
      {/* Show Error Message for Category */}
      {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}</div>
    </div>

    {/* DROPDOWN LIST */}
    {/* {showCategoryDropdown && (
      <ul
        ref={dropdownRef}
        className="list-group position-absolute w-100 mt-1"
        style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
      >
        {filteredCategories.map((cat) => (
          <li
            key={cat._id}
            className="list-group-item list-group-item-action"
            onClick={() => {
              setFormData({ ...formData, category: cat._id });
              setCategorySearch(cat.name);
              setShowCategoryDropdown(false);
              setErrors({ ...errors, category: "" }); // Clear error on select
            }}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    )} */}
      {showCategoryDropdown && (
                  <ul
                    className="list-group position-absolute w-100 mt-1"
                    style={{ zIndex: 1000 }}
                     ref={categoryDropdownRef}
                  >
                    {filteredCategories.length > 0 ? (
                      filteredCategories?.map((cat) => (
                        <li
                          key={cat._id}
                          className="list-group-item list-group-item-action"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              category: cat._id,
                            });
                            setCategorySearch(cat.name);
                            setShowCategoryDropdown(false);
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
                 <Button size="sm" disabled={loading} onClick={handleCreateCategory}>
      {loading ? "Saving..." : "Save Category"}
    </Button>
    
                </div>
              )}
  

  {/* Subcategory Name Field */}
  <div className="casestudy-field">
    <label className="fw-bold">SubCategory Name</label>
    <input
      className={`form-control mt-1 casestudy-input-height ${errors.name ? "is-invalid" : ""}`}
      name="name"
      placeholder="e.g. Mobile Apps"
      value={formData.name}
      onChange={(e) => {
        handleChange(e);
        if (errors.name) setErrors({ ...errors, name: "" }); // Clear error on type
      }}
    />
    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
  </div>

  {/* Status Field */}
  <div className="casestudy-field">
    <label className="fw-bold">Status</label>
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
          {/* {isEdit ? (
            <Button className="edit_modal" onClick={handleUpdate}>
              Update
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
          )} */}
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
            Showing {showingStart}-{showingEnd} of {filteredSubCategories.length}
          </span>
          <span>Current Page: {currentPage}/{totalPages}</span>
        </div>
        <div className="casestudy-page-size">
          <label htmlFor="subcategory-page-size">Rows per page</label>
          <select
            id="subcategory-page-size"
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

export default Sub_category;
