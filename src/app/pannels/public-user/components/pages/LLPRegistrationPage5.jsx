import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { loadScript } from "../../../../../globals/constants";
import { publicUser } from "../../../../../globals/route-names";
import JobZImage from "../../../../common/jobz-img";
import SectionPagination from "../../sections/common/section-pagination";
// import { getBlogs } from "../../../../../api";
import InnerPageBanner from "../../../../common/inner-page-banner";
import SectionBlogsSidebar from "../../sections/blogs/sidebar/section-blogs-sidebar";
import { getBlogs } from "../../../../../adminApi";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";
import SectionContact from "../../sections/common/section-contact";
import SectionBlogsSidebar2 from "../../sections/blogs/sidebar/section-blogs-sidebar2";
function BlogGrid2Page() {
    const [allBlogs, setAllBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const blogsPerPage = 6;
   const contactRef = useRef(null);
    const location = useLocation();

    // Highlight state
    const [highlight, setHighlight] = useState(false);

    // Scroll to Contact handler
    
        const resolveShortDescriptionHtml = (blog = {}) =>
  sanitizeHtml(
    blog?.short_description ||
    blog?.shortDescription ||
    blog?.description ||
    ""
  );

const toPlainText = (html = "") =>
  String(html || "")
    .replace(/<(.|\n)*?>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
    useEffect(() => {

        const fetchBlogs = async () => {
            try {
                const data = await getBlogs();

                // Handle API response flexibility
                const blogsData = Array.isArray(data) ? data : data.blogs || [];
                const activeBlogs = blogsData.filter((b) => b.status === "active");
                setAllBlogs(activeBlogs);
                console.log("Blogs fetched:", activeBlogs.length);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setAllBlogs([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryFilter = (params.get("category") || "").trim().toLowerCase();
        const tagFilter = (params.get("tag") || "").trim().toLowerCase();
        const searchFilter = (params.get("search") || "").trim().toLowerCase();

        let currentBlogs = [...allBlogs];

        if (categoryFilter) {
            currentBlogs = currentBlogs.filter(
                (blog) =>
                    Array.isArray(blog.categoryId) &&
                    blog.categoryId.some(
                        (cat) => (cat.name || "").toLowerCase() === categoryFilter
                    )
            );
        }

        if (tagFilter) {
            currentBlogs = currentBlogs.filter(
                (blog) =>
                    blog.tage &&
                    blog.tage
                        .split(",")
                        .some((tag) => tag.trim().toLowerCase() === tagFilter)
            );
        }

        if (searchFilter) {
            currentBlogs = currentBlogs.filter((blog) => {
                const title = (blog?.title || "").toLowerCase();
                const shortDescription = toPlainText(resolveShortDescriptionHtml(blog)).toLowerCase();
                const content = (blog?.content || "").toLowerCase();
                return (
                    title.includes(searchFilter) ||
                    shortDescription.includes(searchFilter) ||
                    content.includes(searchFilter)
                );
            });
        }

        setFilteredBlogs(currentBlogs);
        setCurrentPage(1);
        setTotalPages(Math.ceil(currentBlogs.length / blogsPerPage) || 1);
    }, [allBlogs, location.search]);

    // Slice blogs for current page
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const currentBlogs = filteredBlogs.slice(startIndex, endIndex);
if (loading) {
        return (
            <>
                <style>{`
                    .blogs-skeleton-grid {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        gap: 24px;
                    }

                    @media (max-width: 991px) {
                        .blogs-skeleton-grid {
                            grid-template-columns: 1fr;
                        }
                    }

                    .blogs-skeleton-card {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .blogs-skeleton {
                        position: relative;
                        overflow: hidden;
                        border-radius: 12px;
                        border: 1px solid #e3eaf5;
                        background: linear-gradient(180deg, #f3f6fa 0%, #eaf2ff 100%);
                    }

                    .blogs-skeleton::after {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: -120%;
                        width: 90%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
                        animation: blogsShimmer 1.4s infinite;
                    }

                    .blogs-skeleton-image { height: 180px; width: 100%; }
                    .blogs-skeleton-meta { height: 14px; width: 65%; }
                    .blogs-skeleton-title { height: 22px; width: 90%; }
                    .blogs-skeleton-text { height: 12px; width: 100%; }
                    .blogs-skeleton-text.short { width: 80%; }
                    .blogs-skeleton-link { height: 14px; width: 35%; }
                    .blogs-skeleton-sidebar { height: 180px; width: 100%; }

                    @keyframes blogsShimmer {
                        100% { left: 130%; }
                    }
                `}</style>
                <InnerPageBanner
                    _data={{ title: "Blogs", crumb: "Blogs" }}
                    bgImagePath="images/contact-us/Header.webp"
                />
                <div className="section-full p-t120 p-b90 site-bg-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-md-12">
                                <div className="blogs-skeleton-grid">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <div className="blogs-skeleton-card" key={index}>
                                            <div className="blogs-skeleton blogs-skeleton-image" />
                                            <div className="blogs-skeleton blogs-skeleton-meta" />
                                            <div className="blogs-skeleton blogs-skeleton-title" />
                                            <div className="blogs-skeleton blogs-skeleton-text" />
                                            <div className="blogs-skeleton blogs-skeleton-text short" />
                                            <div className="blogs-skeleton blogs-skeleton-link" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12 rightSidebar">
                                <div className="blogs-skeleton-card">
                                    <div className="blogs-skeleton blogs-skeleton-sidebar" />
                                    <div className="blogs-skeleton blogs-skeleton-sidebar" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {
                <InnerPageBanner
                    _data={{ title: "Blogs", crumb: "Blogs" }}
                    bgImagePath="images/contact-us/Header.webp"
                />
            }
            <div className="section-full p-t120 p-b90 site-bg-white">
                <div className="container">
                    <div className="row">
                        {/* ✅ Blog list */}
                        <div className="col-lg-8 col-md-12 item-container-masonry">
                            <div className="masonry-wrap row d-flex">
                                {currentBlogs && currentBlogs.length > 0 ? (
                                    currentBlogs.map((blog) => (
                                        <div className="masonry-item col-lg-6 col-md-12" key={blog._id}>
                                            <div className="blog-post twm-blog-post-1-outer">
                                                <div className="wt-post-media">
                                                    <NavLink to={`${publicUser.blog.DETAIL}/${blog._id}`}>
                                                        {/* <JobZImage
                                                            src={blog.image_url}
                                                            alt={blog.title}
                                                        /> */}
                                                         {blog.images.map((img, index) => (
                                                                           
                                                    
                                                                  <JobZImage
                                                    //   key={index}
                                                      src={img}
                                                      alt={`Blog Image ${index + 1}`}
                                                      className="img-fluid"
                                                      loading="lazy"
                                                    />
                                                    
                                                                            ))}
                                                    </NavLink>
                                                </div>
                                                <div className="wt-post-info">
                                                    <div className="wt-post-meta">
                                                        <ul>
                                                            <li className="post-date">
                                                                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                })}
                                                            </li>
                                                            <li className="post-author">
                                                                By{" "}
                                                                <NavLink to={publicUser.blog.DETAIL}>
                                                                    {blog.author || "Unicx Team"}
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="wt-post-title">
                                                        <h4 className="post-title">
                                                            <NavLink to={`${publicUser.blog.DETAIL}/${blog._id}`}>
                                                                {blog.title}
                                                            </NavLink>
                                                        </h4>
                                                    </div>
                                                    <div className="wt-post-text">
                                                        <p>                 {toPlainText(resolveShortDescriptionHtml(blog))
                      ? `${toPlainText(resolveShortDescriptionHtml(blog)).slice(0, 150)}...`
                      : "-"}</p>
                                                    </div>
                                                    <div className="wt-post-readmore">
                                                        <NavLink
                                                            to={`${publicUser.blog.DETAIL}/${blog._id}`}
                                                            className="site-button-link site-text-primary"
                                                        >
                                                            Read More
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No blogs found.</p>
                                )}
                            </div>

                            {/* ✅ Pagination inside page */}
                            {totalPages > 1 && (
                                <SectionPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </div>

                        {/* ✅ Sidebar */}
                        <div className="col-lg-4 col-md-12 rightSidebar">
                            <SectionBlogsSidebar2 />
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

export default BlogGrid2Page;


