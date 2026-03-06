import React, { useState, useEffect, useRef } from "react";

import { MdDeleteOutline } from "react-icons/md";
import { deleteFormData, getContactForm } from "../adminApi";
import Loader from "../app/common/loader";
import "./serviceStyle/casestudy.css";

const ContactUsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 50];
  // existing images

  // Apply filters
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getContactForm();
      //  console.log(data.data,"response footerdetails data")
      setBlogs(data?.data);
    } catch (err) {
      console.log("fetch topcompany error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ---------- DELETE ----------
  const handleDelete = async (id) => {
    // if (!window.confirm("Delete this TopCompany?")) return;

    try {
      await deleteFormData(id);
      fetchBlogs();
    } catch (err) {
      console.log("Delete failed", err.message);
    }
  };

  // ---------- SEARCH ----------

  const search = searchText.trim().toLowerCase();

  const filteredBlogs = blogs.filter((blog) => {
    const searchMatch =
      !search ||
      blog?.phone?.toLowerCase().includes(search.toLowerCase()) ||
      blog?.email?.toLowerCase().includes(search.toLowerCase()) ||
      blog?.subject?.toLowerCase().includes(search.toLowerCase()) ||
      blog?.expertName?.toLowerCase().includes(search.toLowerCase()) ||
      blog?.subsEmail?.toLowerCase().includes(search.toLowerCase());
    return searchMatch;
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
}, [searchText, itemsPerPage]);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);
  return (
    <div className="category-container casestudy-page">
      <div className="casestudy-shell">
        <h3 className="heading_category casestudy-heading">
          ContactUsList
        </h3>

        {/* Search */}
        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{ height: "44px" }}
            placeholder="Search contacts..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
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
              <th>Contact Name</th>
              <th>Expert Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Subscribe Email</th>
              <th className="col-actions" width="100">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
              <Loader />
                </td>
              </tr>
            ) : paginatedSubCategories.length > 0 ? (
              paginatedSubCategories.map((blog, index) => {
                return (
                  <tr key={blog._id}>
                    <td data-label="ID">{startIndex + index + 1}</td>
                    <td data-label="Contact Name">{blog.contact_name || "-"}</td>
                    <td data-label="Expert Name">{blog.expertName || "-"}</td>
                    <td data-label="Email">{blog.email || "-"}</td>
                    <td data-label="Phone">{blog.phone || "-"}</td>
                    <td data-label="Subject">{blog.subject || "-"}</td>
                    <td data-label="Message">{blog.message || "-"}</td>
                    <td data-label="Subscribe Email">{blog.subsEmail || "-"}</td>

                    {/* <td>
                             {" "}
                             <label className="switchs">
                               <input
                                 type="checkbox"
                                 checked={blog.status === "active"}
                                 onChange={() => handleToggleStatus(blog._id)}
                               />
                               <span className="sliders"></span>
                             </label>
                           </td> */}

                    <td
                      className="action_button casestudy-actions"
                    >
                     

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
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No ContactUsDetails found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        <div className="casestudy-pagination-footer mt-4">
          <div className="casestudy-pagination-info">
            <span>
              Showing {showingStart}-{showingEnd} of {filteredBlogs.length}
            </span>
            <span>Current Page: {currentPage}/{totalPages}</span>
          </div>
          <div className="casestudy-page-size">
            <label htmlFor="contact-page-size">Rows per page</label>
            <select
              id="contact-page-size"
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

export default ContactUsList;
