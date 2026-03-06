import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { loadScript } from "../../../../../globals/constants";
import { publicUser } from "../../../../../globals/route-names";
import JobZImage from "../../../../common/jobz-img";
import SectionPagination from "../../sections/common/section-pagination";
// import { getCaseStudies } from "../../../../../api";
import InnerPageBanner from "../../../../common/inner-page-banner";
import SidebarCaseStudy from "../../sections/blogs/sidebar/section-case-study";
import { getCaseStudies } from "../../../../../adminApi";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";
import SectionContact from "../../sections/common/section-contact";
function CaseStudyPage() {
    const [allCaseStudies, setAllCaseStudies] = useState([]);
    const [filteredCaseStudies, setFilteredCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const location = useLocation();
    const itemsPerPage = 6;
   const contactRef = useRef(null);

    // Highlight state
    const [highlight, setHighlight] = useState(false);
      const resolveShortDescriptionHtml = (blog = {}) =>
  sanitizeHtml(
    blog?.additional_details ||
    blog?.additional_details ||
    blog?.description ||
    ""
  );

const toPlainText = (html = "") =>
  String(html || "")
    .replace(/<(.|\n)*?>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
// console.log(allCaseStudies,"all casestudy")
 const fallbackImage = "/images/default-case-study.jpg"; // fallback if image missing

    const stripHtml = (value = "") =>
        String(value || "")
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    useEffect(() => {
        loadScript("js/custom.js");

        const fetchCaseStudies = async () => {
            try {
                const data = await getCaseStudies();
 // ✅ Filter only ACTIVE case studies
    const activeCaseStudies = (data?.caseStudies || []).filter(
      (cs) => cs.status === "active"
    );
     setAllCaseStudies(activeCaseStudies);
                // setAllCaseStudies(data.caseStudies || []);
                setTotalPages(Math.ceil((data?.length || 0) / itemsPerPage));
            } catch (err) {
                console.error("Error fetching case studies:", err);
                setError("Failed to load case studies. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCaseStudies();
    }, []);

    // Filter case studies based on URL query
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryFilter = params.get("category");
        const searchFilter = (params.get("search") || "").trim().toLowerCase();

        let current = [...allCaseStudies];
        if (categoryFilter) {
            current = current.filter((cs) => {
                const matchesCategoryArray =
                    Array.isArray(cs?.categoryId) &&
                    cs.categoryId.some(
                        (cat) => cat?.name?.toLowerCase() === categoryFilter.toLowerCase()
                    );

                const matchesLegacyCategoryName =
                    typeof cs?.category_name === "string" &&
                    cs.category_name.toLowerCase() === categoryFilter.toLowerCase();

                return matchesCategoryArray || matchesLegacyCategoryName;
            });
        }

        if (searchFilter) {
            current = current.filter((cs) => {
                const title = (cs?.title || "").toLowerCase();
                const description = stripHtml(resolveShortDescriptionHtml(cs)).toLowerCase();
                return title.includes(searchFilter) || description.includes(searchFilter);
            });
        }

        setFilteredCaseStudies(current);
        setCurrentPage(1); // reset page when filter changes
        setTotalPages(Math.ceil(current.length / itemsPerPage));
    }, [allCaseStudies, location.search]);

    // Slice items for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredCaseStudies.slice(startIndex, endIndex);

    if (loading) {
        return (
            <>
                <style>{`
                    .cs-skeleton-wrap {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }

                    .cs-skeleton {
                        position: relative;
                        overflow: hidden;
                        border-radius: 12px;
                        border: 1px solid #e3eaf5;
                        background: linear-gradient(180deg, #f3f6fa 0%, #eaf2ff 100%);
                    }

                    .cs-skeleton::after {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: -120%;
                        width: 90%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
                        animation: csShimmer 1.4s infinite;
                    }

                    .cs-skeleton-card { height: 260px; width: 100%; }
                    .cs-skeleton-sidebar { height: 180px; width: 100%; }

                    @keyframes csShimmer {
                        100% { left: 130%; }
                    }
                `}</style>
                <InnerPageBanner
                    _data={{ title: "Case Study", crumb: "Case Study" }}
                    bgImagePath="images/contact-us/case.png"
                />
                <div className="section-full p-t120 p-b90 site-bg-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-12">
                                <div className="cs-skeleton-wrap">
                                    <div className="cs-skeleton cs-skeleton-card" />
                                    <div className="cs-skeleton cs-skeleton-card" />
                                    <div className="cs-skeleton cs-skeleton-card" />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12 rightSidebar">
                                <div className="cs-skeleton-wrap">
                                    <div className="cs-skeleton cs-skeleton-sidebar" />
                                    <div className="cs-skeleton cs-skeleton-sidebar" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <div className="section-full p-t120 p-b90 bg-white text-center">
                <div className="container">{error}</div>
            </div>
        );
    }

    return (
        <>
            <InnerPageBanner
                _data={{ title: "Case Study", crumb: "Case Study" }}
                bgImagePath="images/contact-us/case.png"
            />

            <div className="section-full p-t120 p-b90 site-bg-white">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12 item-container-masonry">
                            {currentItems.length > 0 ? (
                                currentItems.map((cs) => {
                                 
 
                                    return (
                                        <div
                                            className="blog-post twm-blog-post-1-outer twm-blog-list-style"
                                            key={cs.id}
                                        >
                                            <div className="wt-post-media">
                                                <NavLink to={`${publicUser.caseStudy.DETAIL}/${cs._id}`}>
                                                   
{Array.isArray(cs?.images) &&
  cs.images
    .filter(img => typeof img === "string")
    .map((img, index) => (
      <JobZImage
        key={index}
        src={img}
        alt={`${cs.title} image ${index + 1}`}
      />
    ))}



                                                </NavLink>
                                            </div>
                                            <div className="wt-post-info">
                                                <div className="wt-post-meta">
                                                    <ul>
                                                        <li className="post-date">
                                                            {new Date(cs.createdAt).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                }
                                                            )}
                                                        </li>
                                                        <li className="post-author">
                                                            By{" "}
                                                            <NavLink to={publicUser.caseStudy.LIST}>
                                                                {cs.author || "Admin"}
                                                            </NavLink>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="wt-post-title">
                                                    <h4 className="post-title">
                                                        <NavLink to={`${publicUser.caseStudy.DETAIL}/${cs._id}`}>
                                                            {cs.title}
                                                        </NavLink>
                                                    </h4>
                                                </div>
                                                <div className="wt-post-text">
                                                                     {toPlainText(resolveShortDescriptionHtml(cs))
                      ? `${toPlainText(resolveShortDescriptionHtml(cs)).slice(0, 150)}...`
                      : "-"}
                                                </div>
                                                <div className="wt-post-readmore">
                                                    <NavLink
                                                        to={`${publicUser.caseStudy.DETAIL}/${cs._id}`}
                                                        className="site-button-link site-text-primary"
                                                    >
                                                        Read More
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-12 text-center">
                                    <p>No case studies found.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <SectionPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </div>

                        <div className="col-lg-4 col-md-12 rightSidebar">
                            <SidebarCaseStudy />
                            <div
                                        ref={contactRef}
                                        id="contact-section"
                                        className={`twm-s-contact-wrap mb-5 ${highlight ? "contact-highlight" : ""}`}
                                    >
                                        <SectionContact />
                                    </div>
                        </div>
                    </div>
                </div>
                 <style>{`
                .service-details-flow {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .service-banner-img {
                    width: 100%;
                    border-radius: 14px;
                    object-fit: cover;
                    max-height: 340px;
                    box-shadow: 0 10px 24px rgba(10, 30, 80, 0.08);
                }

                .service-main-description {
                    padding: 18px;
                    border-radius: 14px;
                    background: linear-gradient(180deg, #ffffff, #f8fbff);
                    border: 1px solid #e8eef8;
                    line-height: 1.8;
                }

                .service-sections-list {
                    display: grid;
                    gap: 16px;
                }

                .service-section-card {
                    padding: 18px;
                    border-radius: 14px;
                    border: 1px solid #ebeff6;
                    background: #fff;
                    box-shadow: 0 8px 20px rgba(10, 30, 80, 0.06);
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }

                .service-section-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 26px rgba(10, 30, 80, 0.1);
                }

                .service-section-title {
                    margin-bottom: 10px;
                    color: #183b6b;
                }

                .service-section-images {
                    margin-top: 14px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 12px;
                }

                .service-section-documents {
                    margin-top: 12px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .service-section-document-link {
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 12px;
                    border-radius: 999px;
                    border: 1px solid #d5e4ff;
                    background: #f4f8ff;
                    color: #17406f;
                    font-size: 13px;
                    text-decoration: none;
                }

                .service-section-image {
                    width: 100%;
                    border-radius: 10px;
                    object-fit: cover;
                    min-height: 120px;
                    background: #f6f8fc;
                }

                .service-faq-list {
                    display: grid;
                    gap: 12px;
                }

                .service-faq-item {
                    padding: 14px 16px;
                    border-radius: 12px;
                    background: #f9fbff;
                    border: 1px solid #e7edf8;
                }

                .service-faq-question {
                    margin-bottom: 8px;
                    color: #0c2c56;
                }

                .llp-fullpage-skeleton {
                    padding-top: 8px;
                }

                .contact-highlight {
                    padding: 5px;
                    animation: smoothBlink 2s ease-in-out;
                }

                @keyframes smoothBlink {
                    0%, 100% {
                    background-color: transparent;
                    }
                    50% {
                    background-color: #fff; /* light red */
                    }
                }
                `}</style>
            </div>
        </>
    );
}

export default CaseStudyPage;
