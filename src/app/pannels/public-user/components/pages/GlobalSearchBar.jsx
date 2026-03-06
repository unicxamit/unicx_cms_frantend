import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { searchItems } from '../../../../../api';
import './GlobalSearchBar.css';
import { incrementServiceSearchCount, searchItems } from '../../../../../adminApi';

const GlobalSearchBar = ({ onResultSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ categories: [], subcategories: [], subsubcategories: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const searchTimeout = useRef(null);
    const speechRecognitionRef = useRef(null);
    const suggestionsRef = useRef(null);
    const searchRootRef = useRef(null);
    const latestSearchRequestRef = useRef(0);
    const navigate = useNavigate();
    const location = useLocation();

    const [dynamicPlaceholder, setDynamicPlaceholder] = useState('');
    const [showTypeCursor, setShowTypeCursor] = useState(true);
    const placeholderIndex = useRef(0);
    const charIndex = useRef(0);
    const typingTimeout = useRef(null);
    const [isAutoTyping, setIsAutoTyping] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.get('q');

        if (searchQuery) {
            setQuery(searchQuery);
            setShowSuggestions(true);
            performSearch(searchQuery);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            if (speechRecognitionRef.current) {
                speechRecognitionRef.current.onstart = null;
                speechRecognitionRef.current.onresult = null;
                speechRecognitionRef.current.onerror = null;
                speechRecognitionRef.current.onend = null;
                speechRecognitionRef.current.stop();
            }
        };
    }, [location.search]);

    const handleClickOutside = (event) => {
        if (searchRootRef.current && !searchRootRef.current.contains(event.target)) {
            setShowSuggestions(false);
        }
    };

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults({ categories: [], subcategories: [], subsubcategories: [] });
            setIsLoading(false);
            return;
        }

        const requestId = ++latestSearchRequestRef.current;
        try {
            setIsLoading(true);

            const response = await searchItems(searchQuery);
            if (requestId !== latestSearchRequestRef.current) return;
            const services = response.services || [];

            setResults({
                categories: [],
                subcategories: services.map(service => ({
                    id: service._id,
                    name: service.name,
                    category: service.category?.name,
                    subcategory: service.subcategory?.name,
                })),
                subsubcategories: [],
            });

        } catch (error) {
            if (requestId !== latestSearchRequestRef.current) return;
            console.error('Error during search:', error);
        } finally {
            if (requestId !== latestSearchRequestRef.current) return;
            setIsLoading(false);
        }
    };


    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setShowSuggestions(Boolean(newQuery.trim()));

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            performSearch(newQuery);
        }, 300);
    };

    const handleInputFocus = () => {
        if (query.trim()) {
            setShowSuggestions(true);
        }
    };

    const handleMicClick = () => {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error("Speech recognition is not supported in this browser.");
            return;
        }

        if (!speechRecognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0]?.transcript || "")
                    .join("")
                    .trim();

                setQuery(transcript);
                setShowSuggestions(Boolean(transcript));

                if (searchTimeout.current) clearTimeout(searchTimeout.current);
                searchTimeout.current = setTimeout(() => {
                    performSearch(transcript);
                }, 200);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            speechRecognitionRef.current = recognition;
        }

        if (isListening) {
            speechRecognitionRef.current.stop();
            return;
        }

        try {
            speechRecognitionRef.current.start();
        } catch (error) {
            console.error("Unable to start speech recognition:", error);
            setIsListening(false);
        }
    };

    // const handleResultClick = (result) => {
    //     setIsAutoTyping(false);
    //     let path;
    //     switch (result.type) {
    //         case 'category':
    //             path = `/categories/${result.id}`;
    //             break;
    //         case 'subcategory':
    //             path = `/subcategories/${result.id}`;
    //             break;
    //         case 'Services':
    //             path = `/Services/${result.id}`;
    //             break;
    //         default:
    //             path = '/';
    //     }

    //     setShowSuggestions(false);
    //     if (onResultSelect) onResultSelect(result);
    //     navigate(path);
    // };

    const handleResultClick = async (result) => {
        setShowSuggestions(false);

        try {
            if (result?.id) {
                await incrementServiceSearchCount(result.id);
            }
        } catch (error) {
            console.error("Failed to increment service search count:", error);
        }

        navigate(`/subsubcategory/${result.id}`);
    };

    const showSuggestionDropdown = () => {
        setShowSuggestions(true);
        if (query.trim()) {
            performSearch(query);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        showSuggestionDropdown();
    };

    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

    const autoTexts = [
        "Search anything...",
        "Type 'Company Registration'",
        "Type 'GST filling'",
        "Type 'Trademark'",
        "type 'ISO Certificate'",
        "Search Through All our service",
        "Type 'FSSAI registration'",
        "Type 'Copyright registration'"
    ];

    useEffect(() => {
        const shouldAutoType = query.trim().length === 0;
        setIsAutoTyping(shouldAutoType);
    }, [query]);

    useEffect(() => {
        if (!isAutoTyping) {
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
            return;
        }

        let cancelled = false;

        const tick = () => {
            if (cancelled) return;

            const currentText = autoTexts[placeholderIndex.current];
            if (charIndex.current < currentText.length) {
                setDynamicPlaceholder(currentText.slice(0, charIndex.current + 1));
                charIndex.current += 1;
                typingTimeout.current = setTimeout(tick, 90);
                return;
            }

            typingTimeout.current = setTimeout(() => {
                if (cancelled) return;
                charIndex.current = 0;
                placeholderIndex.current = (placeholderIndex.current + 1) % autoTexts.length;
                setDynamicPlaceholder('');
                tick();
            }, 1400);
        };

        tick();

        return () => {
            cancelled = true;
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, [isAutoTyping]);

    useEffect(() => {
        if (!isAutoTyping) {
            setShowTypeCursor(false);
            return;
        }

        setShowTypeCursor(true);
        const cursorInterval = setInterval(() => {
            setShowTypeCursor((prev) => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
    }, [isAutoTyping]);

    return (
        <div className="global-search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="hero-search-shell" ref={searchRootRef}>
                    <div className="hero-search-input-wrap">
                        <span className="hero-search-icon" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder={isAutoTyping ? `${dynamicPlaceholder}${showTypeCursor ? "|" : ""}` : "Search anything..."}
                            value={query}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    setShowSuggestions(false);
                                }
                            }}
                            className="search-input no-border-input hero-search-input"
                        />
                        <button
                            type="button"
                            className={`hero-search-mic ${isListening ? "is-listening" : ""}`}
                            aria-label={isListening ? "Stop voice search" : "Voice search"}
                            onClick={handleMicClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                                <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="hero-search-submit"
                            aria-label="Show suggestions"
                            onClick={showSuggestionDropdown}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M3.75 12a.75.75 0 0 1 .75-.75h13.19l-5.47-5.47a.75.75 0 0 1 1.06-1.06l6.75 6.75a.75.75 0 0 1 0 1.06l-6.75 6.75a.75.75 0 1 1-1.06-1.06l5.47-5.47H4.5a.75.75 0 0 1-.75-.75Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {showSuggestions && (
                        <div className="search-suggestions" ref={suggestionsRef}>
                            <div className="search-suggestions-scroll">
                                {isLoading ? (
                                    <div className="suggestions-loading">
                                        <i className="fa fa-spinner fa-spin"></i> Searching...
                                    </div>
                                ) : (
                                    <>
                                        {totalResults > 0 ? (
                                            <div className="suggestions-content">
                                                {results.categories.length > 0 && (
                                                    <div className="suggestion-category">
                                                        <ul>
                                                            {results.categories.map(item => (
                                                                <li key={`cat-${item.id}`} onClick={() => handleResultClick({ ...item, type: 'category' })}>{item.name}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {results.subcategories.length > 0 && (
                                                    <div className="suggestion-category">
                                                        <ul>
                                                            {results.subcategories.map(item => (
                                                                <li key={`subcat-${item.id}`} onClick={() => handleResultClick({ ...item, type: 'subcategory' })}>{item.name}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {/* {results.subcategories.length > 0 && (
  <div className="suggestion-category">
    <ul>
      {results.subcategories.map(item => (
        <li
          key={item.id}
          onClick={() =>
            handleResultClick({
              id: item.id,
              type: 'subcategory',
            })
          }
        >
          <strong>{item.name}</strong>
          <div className="suggestion-meta">
            {item.category} → {item.subcategory}
          </div>
        </li>
      ))}
    </ul>
  </div>
)} */}

                                                {results.subsubcategories.length > 0 && (
                                                    <div className="suggestion-category">
                                                        <ul>
                                                            {results.subsubcategories.map(item => (
                                                                <li key={`subsubcat-${item.id}`} onClick={() => handleResultClick({ ...item, type: 'Services' })}>{item.name}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            query.trim() && <div className="no-suggestions">No results found for "{query}"</div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </form>

        </div>
    );
};

export default GlobalSearchBar;


// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./GlobalSearchBar.css";
// import { searchItems } from "../../../../../adminApi";

// const GlobalSearchBar = ({ onResultSelect }) => {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const searchTimeout = useRef(null);
//   const suggestionsRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleClickOutside = (e) => {
//     if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
//       setShowSuggestions(false);
//     }
//   };

//   const performSearch = async (searchQuery) => {
//     if (!searchQuery.trim()) {
//       setResults([]);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const data = await searchItems(searchQuery);
//       setResults(data.services);
//     } catch (err) {
//       console.error("Search error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setQuery(value);
//     setShowSuggestions(true);

//     if (searchTimeout.current) clearTimeout(searchTimeout.current);
//     searchTimeout.current = setTimeout(() => {
//       performSearch(value);
//     }, 300);
//   };

//   const handleResultClick = (service) => {
//     setShowSuggestions(false);
//     if (onResultSelect) onResultSelect(service);

//     navigate(`/services/${service._id}`);
//   };

//   return (
//     <div className="global-search-container">
//       <div className="twm-inputicon-box">
//         <input
//           type="text"
//           value={query}
//           onChange={handleInputChange}
//           onFocus={() => setShowSuggestions(true)}
//           placeholder="Search services..."
//           className="search-input no-border-input"
//         />
//         <i style={{ color: "#0d6efd" }} className="feather-search" />
//       </div>

//       {showSuggestions && (
//         <div className="search-suggestions" ref={suggestionsRef}>
//           {isLoading ? (
//             <div className="suggestions-loading">Searching...</div>
//           ) : results.length > 0 ? (
//             <ul className="suggestion-category">
//               {results.map((service) => (
//                 <li
//                   key={service._id}
//                   onClick={() => handleResultClick(service)}
//                 >
//                   <strong>{service.name}</strong>
//                   <div className="suggestion-meta">
//                     {service.category?.name} → {service.subcategory?.name}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             query && <div className="no-suggestions">No services found</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GlobalSearchBar;
