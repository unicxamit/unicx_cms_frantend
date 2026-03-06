import React, { useEffect, useRef, useState } from "react";

import { X } from "lucide-react";
import { getSubSubCategories, updateSearchTageStatus } from "../adminApi";
import Loader from "../app/common/loader";
import "./serviceStyle/casestudy.css";

const SearchTage = () => {
  const dropdownRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizeOptions = [10, 20, 30, 50];
  const [searchText, setSearchText] = useState("");

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const data = await getSubSubCategories();
      setCategories(data?.services || []);
    } catch (err) {
      console.log("fetch search tag error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const search = searchText.trim().toLowerCase();
  const serviceOptions = Array.from(
    new Set(
      categories
        .map((item) => String(item?.name || "").trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const filteredBlogs = categories.filter((blog) => {
    const searchMatch =
      !search ||
      blog?.search_tag?.toLowerCase().includes(search) ||
      blog?.name?.toLowerCase().includes(search);
    const statusMatch =
      selectedStatuses.length === 0 || selectedStatuses.includes(blog?.stagestatus);
    const serviceMatch =
      selectedServices.length === 0 || selectedServices.includes(String(blog?.name || "").trim());

    return searchMatch && statusMatch && serviceMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubCategories = filteredBlogs.slice(startIndex, endIndex);
  const showingStart = filteredBlogs.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(endIndex, filteredBlogs.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedStatuses, selectedServices, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleSelection = (id, setter) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleToggleStatus = async (id) => {
    setCategories((prev) =>
      prev.map((faq) =>
        faq?._id === id
          ? {
              ...faq,
              stagestatus: faq?.stagestatus === "active" ? "inactive" : "active",
            }
          : faq,
      ),
    );

    try {
      const faq = categories.find((f) => f?._id === id);
      const newStatus = faq?.stagestatus === "active" ? "inactive" : "active";
      await updateSearchTageStatus(id, newStatus);
    } catch {
      fetchCategories();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="category-container casestudy-page">
      <div className="casestudy-shell">
        <h3 className="heading_category casestudy-heading">Search Tage</h3>

        <div className="custom_headings casestudy-toolbar">
          <input
            type="text"
            className="form-control casestudy-search"
            style={{ height: "44px" }}
            placeholder="Search tag..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <div className="filter-wrapper" ref={dropdownRef}>
            <div className="filter-input" onClick={() => setIsOpen(!isOpen)}>
              {selectedStatuses.length === 0 && selectedServices.length === 0 && (
                <span>Filter by service or status</span>
              )}

              {selectedServices.map((service) => (
                <span key={service} className="chip chip-cat">
                  {service}
                  <X
                    size={14}
                    onClick={() => toggleSelection(service, setSelectedServices)}
                  />
                </span>
              ))}

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
                  <h6>Service</h6>
                  {serviceOptions.map((service) => (
                    <label key={service}>
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleSelection(service, setSelectedServices)}
                      />
                      {service}
                    </label>
                  ))}
                </div>
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
        </div>

        <div className="casestudy-meta">
          <span>Total: {filteredBlogs.length}</span>
          <span>Page: {currentPage} / {totalPages}</span>
        </div>

        <div className="casestudy-table-wrap">
          <table className="table table-bordered table-striped custom-table mt-4 casestudy-table searchtag-table">
            <thead className="table-primary">
              <tr>
                <th className="col-id">ID</th>
                <th>Search Tag</th>
                <th className="col-status">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    <Loader />
                  </td>
                </tr>
              ) : paginatedSubCategories.length > 0 ? (
                paginatedSubCategories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td data-label="ID">{startIndex + index + 1}</td>
                    <td data-label="Search Tag">{cat?.search_tag || "-"}</td>

                    <td data-label="Status">
                      <label className="switchs">
                        <input
                          type="checkbox"
                          checked={cat?.stagestatus === "active"}
                          onChange={() => handleToggleStatus(cat._id)}
                        />
                        <span className="sliders"></span>
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No category found
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
            <span>
              Current Page: {currentPage}/{totalPages}
            </span>
          </div>
          <div className="casestudy-page-size">
            <label htmlFor="searchtag-page-size">Rows per page</label>
            <select
              id="searchtag-page-size"
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

export default SearchTage;
