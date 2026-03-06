// TrademarkSearch.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './TrademarkSearch.css'; // Import external CSS

const TrademarkSearch = () => {
  const trademarkProxyUrl = '/api/trademarks';
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [classDetailInput, setClassDetailInput] = useState('');
  const [selectedClassNumber, setSelectedClassNumber] = useState('');
  const [trademarks, setTrademarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [relevantClasses, setRelevantClasses] = useState([]);
  const [classDetailSearchTerm, setClassDetailSearchTerm] = useState('');
  const [classDetailResults, setClassDetailResults] = useState([]);
  const [showClassDetailSearch, setShowClassDetailSearch] = useState(false);
  const [brandSearchCurrentPage, setBrandSearchCurrentPage] = useState(1);
  const [totalBrandResults, setTotalBrandResults] = useState(0);
  const brandSearchLimit = 10; // Results per page for brand search

  // Refs for input fields to manage focus
  const brandSearchInputRef = useRef(null);
  const classDetailSearchInputRef = useRef(null);

  // Track the active input to restore focus
  const activeInputRef = useRef(null);

  // Debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 2000);
  const debouncedClassDetailSearchTerm = useDebounce(classDetailSearchTerm, 2000);

  // Clean class detail text
  const cleanDetailText = (text) => {
    if (!text) return '';
    return text.replace(/^\[CLASS\s*:\s*\d+\]\s*/i, '').trim();
  };

  // Function to escape special characters for regex
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Restore focus to the active input with a slight delay to ensure DOM updates are complete
  const restoreFocus = useCallback(() => {
    setTimeout(() => {
      if (activeInputRef.current === 'brand' && brandSearchInputRef.current) {
        brandSearchInputRef.current.focus();
      } else if (activeInputRef.current === 'classDetail' && classDetailSearchInputRef.current) {
        classDetailSearchInputRef.current.focus();
      }
    }, 0); // Zero delay ensures it runs after current render cycle
  }, []);

  // Fetch trademarks (Brand Search)
  const fetchTrademarks = useCallback(async () => {
    if (!showClassDetailSearch) {
      const hasSearchTerm = debouncedSearchTerm.trim() !== '';
      const hasClassSelected = selectedClassNumber !== '';

      if (!hasSearchTerm && !hasClassSelected) {
        setTrademarks([]);
        setMessage('');
        setRelevantClasses([]);
        setClassDetailInput('');
        setTotalBrandResults(0);
        return;
      }

      setLoading(true);
      setError(null);
      setMessage('');

      try {
        const params = new URLSearchParams({
          status: 'Registered',
          limit: brandSearchLimit,
          offset: (brandSearchCurrentPage - 1) * brandSearchLimit,
        });

        if (hasSearchTerm) {
          params.append('word_mark', debouncedSearchTerm);
        }

        if (hasClassSelected) {
          params.append('class_number', selectedClassNumber);
        }

        const response = await fetch(`${trademarkProxyUrl}?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API error: ${response.status} - ${errorData.detail || errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const results = Array.isArray(data.results) ? data.results : [];
        setTrademarks(results);
        setTotalBrandResults(data.count || 0);

        if (results.length > 0) {
          if (hasSearchTerm && !hasClassSelected) {
            const classesFound = results.reduce((acc, item) => {
              if (item.class_number) {
                const detail = cleanDetailText(item.class_detail);
                if (!acc[item.class_number]) {
                  acc[item.class_number] = {
                    number: item.class_number,
                    details: new Set(),
                  };
                }
                if (detail) {
                  acc[item.class_number].details.add(detail);
                }
              }
              return acc;
            }, {});

            const sortedClasses = Object.values(classesFound).sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
            setRelevantClasses(sortedClasses);

            if (sortedClasses.length > 0) {
              const classNumbersList = sortedClasses.map(c => c.number).join(', ');
              setMessage(`Found results for "${debouncedSearchTerm}" in Class(es): ${classNumbersList}. Select a class from the dropdown to filter.`);
              const allDetails = sortedClasses.flatMap(c => Array.from(c.details));
              const detailSummary = allDetails.slice(0, 3).join('; ') + (allDetails.length > 3 ? '...' : '');
              setClassDetailInput(detailSummary);
            } else {
              setRelevantClasses([]);
              setClassDetailInput('');
              setMessage(`Found results for "${debouncedSearchTerm}" but no specific class details available.`);
            }
          } else if (hasSearchTerm && hasClassSelected) {
            setMessage(`Showing results for "${debouncedSearchTerm}" in Class ${selectedClassNumber}.`);
          } else if (!hasSearchTerm && hasClassSelected) {
            setMessage(`Showing results in Class ${selectedClassNumber}.`);
            setRelevantClasses([]);
            setClassDetailInput('');
          }
        } else {
          setMessage('No trademarks found matching your criteria.');
          setRelevantClasses([]);
          setClassDetailInput('');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message || 'Failed to fetch trademark data');
        setTrademarks([]);
        setTotalBrandResults(0);
        setMessage('');
        setRelevantClasses([]);
        setClassDetailInput('');
      } finally {
        setLoading(false);
        restoreFocus(); // Restore focus after search completes
      }
    }
  }, [debouncedSearchTerm, selectedClassNumber, showClassDetailSearch, brandSearchCurrentPage, brandSearchLimit, restoreFocus, trademarkProxyUrl]);

  // Fetch Class Details (Class Detail Search)
  const fetchClassDetails = useCallback(async () => {
    if (showClassDetailSearch && debouncedClassDetailSearchTerm.trim() !== '') {
      setLoading(true);
      setError(null);
      setMessage('');

      try {
        const params = new URLSearchParams({
          status: 'Registered',
          limit: 100,
          offset: 0,
          word_mark: '*',
          class_detail: debouncedClassDetailSearchTerm,
        });

        const response = await fetch(`${trademarkProxyUrl}?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API error: ${response.status} - ${errorData.detail || errorData.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const results = Array.isArray(data.results) ? data.results : [];

        const classDetailsMap = results.reduce((acc, item) => {
          if (item.class_number && item.class_detail) {
            const cleanedDetail = cleanDetailText(item.class_detail);
            const matchingLines = cleanedDetail
              .split(';')
              .map(line => line.trim())
              .filter(line => line.toLowerCase().includes(debouncedClassDetailSearchTerm.toLowerCase()));

            if (matchingLines.length > 0) {
              if (!acc[item.class_number]) {
                acc[item.class_number] = new Set();
              }
              matchingLines.forEach(line => acc[item.class_number].add(line));
            }
          }
          return acc;
        }, {});

        const classDetailsResultsArray = Object.entries(classDetailsMap)
          .map(([number, details]) => ({
            number,
            details: Array.from(details),
          }))
          .sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));

        setClassDetailResults(classDetailsResultsArray);
        if (classDetailsResultsArray.length > 0) {
          setMessage(`Found ${classDetailsResultsArray.length} class(es) containing "${debouncedClassDetailSearchTerm}"`);
        } else {
          setMessage(`No class details found containing "${debouncedClassDetailSearchTerm}".`);
        }
      } catch (err) {
        console.error('Class detail search error:', err);
        setError(err.message || 'Failed to fetch class details');
        setClassDetailResults([]);
        setMessage('');
      } finally {
        setLoading(false);
        restoreFocus(); // Restore focus after search completes
      }
    } else if (showClassDetailSearch) {
      setClassDetailResults([]);
      setMessage('');
      if (debouncedClassDetailSearchTerm.trim() === '') {
        setMessage('Enter class details to search.');
      }
      restoreFocus(); // Restore focus even if no search is performed
    }
  }, [debouncedClassDetailSearchTerm, showClassDetailSearch, restoreFocus, trademarkProxyUrl]);

  // Run fetch effects
  useEffect(() => {
    fetchTrademarks();
  }, [fetchTrademarks]);

  useEffect(() => {
    fetchClassDetails();
  }, [fetchClassDetails]);

  // Handlers
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setClassDetailInput('');
    setRelevantClasses([]);
    setShowClassDetailSearch(false);
    setBrandSearchCurrentPage(1);
    setTotalBrandResults(0);
    activeInputRef.current = 'brand'; // Track brand input as active
    restoreFocus(); // Ensure focus stays on input
  };

  const handleClassDetailInputChange = (e) => {
    setClassDetailInput(e.target.value);
  };

  const handleClassNumberChange = (e) => {
    setSelectedClassNumber(e.target.value);
    setClassDetailInput('');
    setRelevantClasses([]);
    setShowClassDetailSearch(false);
    setBrandSearchCurrentPage(1);
    setTotalBrandResults(0);
    activeInputRef.current = 'brand'; // Focus on brand input after class selection
    restoreFocus();
  };

  const handleClassDetailSearchChange = (e) => {
    setClassDetailSearchTerm(e.target.value);
    activeInputRef.current = 'classDetail'; // Track class detail input as active
    restoreFocus(); // Ensure focus stays on input
  };

  const toggleSearchMode = (mode) => {
    setShowClassDetailSearch(mode);
    setSearchTerm('');
    setSelectedClassNumber('');
    setTrademarks([]);
    setRelevantClasses([]);
    setClassDetailInput('');
    setClassDetailSearchTerm('');
    setClassDetailResults([]);
    setMessage('');
    setError(null);
    setBrandSearchCurrentPage(1);
    setTotalBrandResults(0);
    activeInputRef.current = mode ? 'classDetail' : 'brand'; // Set active input based on mode
    restoreFocus(); // Focus the appropriate input after mode switch
  };

  const handleClassDetailResultClick = (classNumber) => {
    setShowClassDetailSearch(false);
    setSelectedClassNumber(classNumber);
    setSearchTerm('');
    setClassDetailSearchTerm('');
    setClassDetailResults([]);
    setTrademarks([]);
    setRelevantClasses([]);
    setClassDetailInput('');
    setBrandSearchCurrentPage(1);
    setMessage('');
    setError(null);
    activeInputRef.current = 'brand'; // Focus on brand input after clicking class
    restoreFocus();
  };

  const handleBrandPageChange = (newPage) => {
    setBrandSearchCurrentPage(newPage);
    activeInputRef.current = 'brand'; // Keep focus on brand input after pagination
    restoreFocus();
  };

  // Class number options
  const classNumberOptions = [{ label: 'All Classes', value: '' }];
  for (let i = 1; i <= 45; i++) {
    classNumberOptions.push({ label: `Class ${i}`, value: String(i) });
  }

  const totalBrandPages = Math.ceil(totalBrandResults / brandSearchLimit);

  return (
    <div className="trademark-search-container">
      {/* Left sidebar */}
      <div className="sidebar">
        <div className="section">
          <h2 className="section-heading">Check Brand Availability</h2>

          {/* Toggle between search modes */}
          <div className="search-mode-toggle">
            <button
              className={`mode-button ${!showClassDetailSearch ? 'active' : ''}`}
              onClick={() => toggleSearchMode(false)}
            >
              Search by Brand
            </button>
            <button
              className={`mode-button ${showClassDetailSearch ? 'active' : ''}`}
              onClick={() => toggleSearchMode(true)}
            >
              Search by Class Details
            </button>
          </div>

          {!showClassDetailSearch ? (
            <>
              {/* Search by Brand Name */}
              <div className="form-group">
                <div className="label">Trademark Search By Brand Name</div>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search Brand Name"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="search-input"
                    disabled={loading}
                    ref={brandSearchInputRef} // Attach ref
                  />
                  <button className="search-button" disabled={loading}>
                    <span>🔍</span>
                  </button>
                </div>
              </div>

              {/* Filter by Class Detail & Class Number */}
              <div className="form-group">
                <div className="label">Filter by Class Detail & Number</div>
                <div className="class-filter-container">
                  <input
                    type="text"
                    placeholder="Relevant details appear here after Brand Search"
                    value={classDetailInput}
                    onChange={handleClassDetailInputChange}
                    className="class-detail-input"
                    disabled={loading || relevantClasses.length === 0}
                    readOnly={relevantClasses.length > 0}
                  />
                  <select
                    value={selectedClassNumber}
                    onChange={handleClassNumberChange}
                    className="class-number-select"
                    disabled={loading}
                  >
                    {classNumberOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="helper-text">
                  Search by Brand Name above to see relevant classes and details here.
                  Select a class from the dropdown to filter results.
                </div>
              </div>

              {/* Display Relevant Classes Found */}
              {relevantClasses.length > 0 && (
                <div className="relevant-classes-info">
                  <div className="label">Relevant Classes Found:</div>
                  <ul>
                    {relevantClasses.map(cls => (
                      <li key={cls.number}>
                        <strong>Class {cls.number}:</strong> {Array.from(cls.details).join('; ') || 'No details available'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Search by Class Details */}
              <div className="form-group">
                <div className="label">Search by Class Details</div>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search class details (e.g., 'clothing', 'software')"
                    value={classDetailSearchTerm}
                    onChange={handleClassDetailSearchChange}
                    className="search-input"
                    disabled={loading}
                    ref={classDetailSearchInputRef} // Attach ref
                  />
                  <button className="search-button" disabled={loading}>
                    <span>🔍</span>
                  </button>
                </div>
                <div className="helper-text">
                  Enter keywords to find which trademark classes include those goods/services.
                </div>
              </div>

              {/* Class Detail Results (Sidebar) */}
              {!loading && !error && classDetailResults.length > 0 && debouncedClassDetailSearchTerm.trim() !== '' && (
                <div className="class-detail-results">
                  <div className="label">Matching Classes (Summary):</div>
                  <ul>
                    {classDetailResults.map((cls, index) => (
                      <li key={index}>
                        <strong>Class {cls.number}:</strong> {cls.details.slice(0, 2).join('; ')}{cls.details.length > 2 ? '...' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!loading && !error && classDetailResults.length === 0 && debouncedClassDetailSearchTerm.trim() !== '' && (
                <div className="info-message">No matching classes found in sidebar for "{debouncedClassDetailSearchTerm}".</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="main-content">
        {showClassDetailSearch ? (
          <>
            {/* Class Detail Search Results Header */}
            {(debouncedClassDetailSearchTerm || loading) && (
              <div className="search-header">
                <h2 className="search-title">
                  {loading ? 'Searching Class Details...' : 'Class Detail Results'}
                  {debouncedClassDetailSearchTerm && !loading ? ` for "${debouncedClassDetailSearchTerm}"` : ''}
                  {!loading && ` (${classDetailResults.length} classes)`}
                </h2>
              </div>
            )}

            {loading && (
              <div className="loading-container">
                <p className="loading-text">Loading...</p>
              </div>
            )}
            {error && (
              <div className="error-message">
                <p>Error: {error}</p>
              </div>
            )}
            {message && !loading && !error && (
              <div className="info-message">
                <p>{message}</p>
              </div>
            )}

            {!loading && !error && classDetailResults.length > 0 && debouncedClassDetailSearchTerm.trim() !== '' && (
              <div className="class-detail-results">
                <ul className="class-detail-list">
                  {classDetailResults.map((cls, index) => (
                    <li key={index} className="class-detail-item">
                      <div
                        className="class-number clickable-class-number"
                        onClick={() => handleClassDetailResultClick(cls.number)}
                        title={`Search for brands in Class ${cls.number}`}
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                      >
                        Class {cls.number}
                      </div>
                      <ul className="matching-details">
                        {cls.details.map((detail, i) => (
                          <li key={i} className="matching-detail">
                            {debouncedClassDetailSearchTerm.trim() ? (
                              detail.split(new RegExp(`(${escapeRegExp(debouncedClassDetailSearchTerm)})`, 'gi')).map((part, j) => (
                                part.toLowerCase() === debouncedClassDetailSearchTerm.toLowerCase() ? (
                                  <mark key={j}>{part}</mark>
                                ) : (
                                  <span key={j}>{part}</span>
                                )
                              ))
                            ) : (
                              <span>{detail}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!loading && !error && classDetailResults.length === 0 && debouncedClassDetailSearchTerm.trim() === '' && !message && (
              <div className="initial-message">
                <p>Enter class details (e.g., "software", "clothing") to find relevant trademark classes.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Brand Search Results Header */}
            {(debouncedSearchTerm || selectedClassNumber || loading) && (
              <div className="search-header">
                <h2 className="search-title">
                  {loading ? 'Searching Trademarks...' : 'Trademark Search Results'}
                  {(debouncedSearchTerm || selectedClassNumber) && !loading ? ':' : ''}
                  {debouncedSearchTerm && !loading ? ` "${debouncedSearchTerm}"` : ''}
                  {debouncedSearchTerm && selectedClassNumber && !loading ? ' in ' : ''}
                  {selectedClassNumber && !loading ? `Class ${selectedClassNumber}` : ''}
                  {!loading && totalBrandResults > 0 && ` (${totalBrandResults} trademarks found)`}
                  {!loading && totalBrandResults === 0 && (debouncedSearchTerm || selectedClassNumber) && ` (0 trademarks found)`}
                </h2>
              </div>
            )}

            {loading && (
              <div className="loading-container">
                <p className="loading-text">Loading...</p>
              </div>
            )}
            {error && (
              <div className="error-message">
                <p>Error: {error}</p>
              </div>
            )}
            {message && !loading && !error && (
              <div className="info-message">
                <p>{message}</p>
              </div>
            )}

            {/* Trademark Results List */}
            {!loading && !error && trademarks.length > 0 && (
              <>
                <div className="trademark-list">
                  {trademarks.map((trademark, index) => (
                    <div key={index} className="trademark-item">
                      <div className="trademark-header">
                        Class {trademark.class_number}
                      </div>
                      <div className="trademark-content">
                        <div className="trademark-details">
                          <h3 className="trademark-name">{trademark.word_mark}</h3>
                          <div className="trademark-grid">
                            <div><span className="label-text">Class:</span> {trademark.class_number}</div>
                            <div><span className="label-text">Status:</span> {trademark.status}</div>
                            <div><span className="label-text">Application Number:</span> {trademark.application_number}</div>
                            <div><span className="label-text">Application Date:</span> {trademark.application_date}</div>
                            <div><span className="label-text">Country:</span> {trademark.country}</div>
                            {trademark.proprietor_name && (
                              <div className="full-width"><span className="label-text">Proprietor Name:</span> {trademark.proprietor_name}</div>
                            )}
                            {trademark.state && (
                              <div><span className="label-text">State:</span> {trademark.state}</div>
                            )}
                            {trademark.class_detail && (
                              <div className="full-width"><span className="label-text">Class Detail:</span> {cleanDetailText(trademark.class_detail)}</div>
                            )}
                          </div>
                        </div>
                        <div className="trademark-logo">
                          {trademark.image ? (
                            <img src={trademark.image} alt={`${trademark.word_mark} logo`} />
                          ) : (
                            <div className="no-logo">{trademark.word_mark}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls for Brand Search */}
                {totalBrandResults > brandSearchLimit && (
                  <div className="pagination-controls">
                    <button
                      onClick={() => handleBrandPageChange(brandSearchCurrentPage - 1)}
                      disabled={brandSearchCurrentPage === 1 || loading}
                    >
                      Previous
                    </button>
                    <span>
                      Page {brandSearchCurrentPage} of {totalBrandPages} (Results {(brandSearchCurrentPage - 1) * brandSearchLimit + 1} - {Math.min(brandSearchCurrentPage * brandSearchLimit, totalBrandResults)})
                    </span>
                    <button
                      onClick={() => handleBrandPageChange(brandSearchCurrentPage + 1)}
                      disabled={brandSearchCurrentPage === totalBrandPages || loading}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

            {!loading && !error && trademarks.length === 0 && !message && (debouncedSearchTerm || selectedClassNumber) && (
              <div className="no-results">
                <p>No trademarks found matching your criteria.</p>
              </div>
            )}

            {!loading && !error && trademarks.length === 0 && !debouncedSearchTerm && !selectedClassNumber && !message && (
              <div className="initial-message">
                <p>Enter a brand name or select a class to search for trademarks.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrademarkSearch;
