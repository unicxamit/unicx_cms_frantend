import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { loadScript } from "../../../../../globals/constants";
import { publicUser } from "../../../../../globals/route-names";
import JobZImage from "../../../../common/jobz-img";
import SectionPagination from "../../sections/common/section-pagination";
// import { getBlogs } from "../../../../../api";
import SectionBlogsSidebar from "../../sections/blogs/sidebar/section-blogs-sidebar";
import { getBlogs } from "../../../../../adminApi";
import Skeleton from "../../../../common/skeleton/Skeleton";
import SectionContact from "../../sections/common/section-contact";

function BlogListPage() {
    const [allBlogs, setAllBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    // ✅ Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const blogsPerPage = 6;
   const contactRef = useRef(null);

    // Highlight state
    const [highlight, setHighlight] = useState(false);

    // Scroll to Contact handler
    const handleScrollToContact = (e) => {
        e.preventDefault();
        if (contactRef.current) {
            contactRef.current.scrollIntoView({ behavior: "smooth" });
            // Apply highlight
            setHighlight(true);
            // Remove after 2 sec
            setTimeout(() => setHighlight(false), 2000);
        }
    };
    // ✅ Fetch blogs
    useEffect(() => {

        const fetchAllBlogs = async () => {
            try {
                const data = await getBlogs();
                setAllBlogs(data.blogs);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError("Failed to load blogs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllBlogs();
    }, []);

    // ✅ Apply filters
    useEffect(() => {
        const filterBlogs = () => {
            const params = new URLSearchParams(location.search);
            const categoryFilter = params.get("category");
            const tagFilter = params.get("tag");
            const searchFilter = (params.get("search") || "").trim().toLowerCase();

            let currentBlogs = [...allBlogs];

            if (categoryFilter) {
                // currentBlogs = currentBlogs.filter(
                //     (blog) =>
                //         blog.category_name &&
                //         blog.category_name.toLowerCase() === categoryFilter.toLowerCase()
                // );
                currentBlogs = currentBlogs.filter(
          (blog) =>
            Array.isArray(blog.categoryId) &&
            blog.categoryId.some(
              (cat) => cat.name?.toLowerCase() === categoryFilter.toLowerCase()
            )
        );
            }

            if (tagFilter) {
                currentBlogs = currentBlogs.filter(
                    (blog) =>
                        blog.tage &&
                        blog.tage
                            .split(",")
                            .some(
                                (tag) => tag.trim().toLowerCase() === tagFilter.toLowerCase()
                            )
                );
            }

            if (searchFilter) {
                currentBlogs = currentBlogs.filter((blog) => {
                    const title = (blog?.title || "").toLowerCase();
                    const shortDescription = (blog?.short_description || "").toLowerCase();
                    const content = (blog?.content || "").toLowerCase();
                    return (
                        title.includes(searchFilter) ||
                        shortDescription.includes(searchFilter) ||
                        content.includes(searchFilter)
                    );
                });
            }

            setFilteredBlogs(currentBlogs);

            // ✅ Reset pagination on filter change
            setCurrentPage(1);
            setTotalPages(Math.ceil(currentBlogs.length / blogsPerPage));
        };

        filterBlogs();
    }, [allBlogs, location.search]);

    // ✅ Slice blogs for current page
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="section-full p-t120 p-b90 site-bg-white">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12 item-container-masonry">
                            <div className="masonry-wrap row d-flex">
                                {[...Array(4)].map((_, index) => (
                                    <div className="masonry-item col-lg-6 col-md-12" key={`blog-skeleton-${index}`}>
                                        <div className="blog-post twm-blog-post-1-outer">
                                            <div className="wt-post-media">
                                                <Skeleton width="100%" height="220px" />
                                            </div>
                                            <div className="wt-post-info">
                                                <div className="wt-post-meta">
                                                    <Skeleton width="130px" height="14px" />
                                                </div>
                                                <div className="wt-post-title m-t10">
                                                    <Skeleton width="90%" height="20px" />
                                                </div>
                                                <div className="wt-post-text m-t10">
                                                    <Skeleton width="100%" height="14px" />
                                                    <Skeleton width="85%" height="14px" className="m-t5" />
                                                </div>
                                                <div className="wt-post-readmore m-t10">
                                                    <Skeleton width="90px" height="14px" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 rightSidebar">
                            <Skeleton width="100%" height="340px" />
                        </div>
                    </div>
                </div>
            </div>
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
        <div className="section-full p-t120 p-b90 site-bg-white">
            <h1>Blog List</h1>
            <div className="container">
                <div className="row">
                    {/* ✅ Blog Grid */}
                    <div className="col-lg-8 col-md-12 item-container-masonry">
                        <div className="masonry-wrap row d-flex">
                            {currentBlogs.length > 0 ? (
                                currentBlogs.map((blog) => (
                                    <div
                                        className="masonry-item col-lg-6 col-md-12"
                                        key={blog._id}
                                    >
                                        <div className="blog-post twm-blog-post-1-outer">
                                            <div className="wt-post-media">
                                                <NavLink
                                                    to={`${publicUser.blog.DETAIL}/${blog._id}`}
                                                >
                                                    {/* <JobZImage
                                                        src={blog.image_url}
                                                        alt={blog.title}
                                                    /> */}
                                                     {blog.images.map((img, index) => (
                                                                           
                                                    
                                                                  <JobZImage
                                                      key={index}
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
                                                            {new Date(
                                                                blog.createdAt
                                                            ).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </li>
                                                        <li className="post-author">
                                                            By{" "}
                                                            <NavLink
                                                                to={publicUser.candidate.DETAIL1}
                                                            >
                                                                {blog.author || "Unicx Team"}
                                                            </NavLink>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="wt-post-title">
                                                    <h4 className="post-title">
                                                        <NavLink
                                                            to={`${publicUser.blog.DETAIL}/${blog._id}`}
                                                        >
                                                            {blog.title}
                                                        </NavLink>
                                                    </h4>
                                                </div>
                                                <div className="wt-post-text">
                                                    <p>
                                                        {blog.short_description ||
                                                            (blog.content
                                                                ? blog.content.substring(
                                                                    0,
                                                                    150
                                                                ) + "..."
                                                                : "No description available.")}
                                                    </p>
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
                                <div className="col-12 text-center">
                                    <p>No blogs found matching your criteria.</p>
                                </div>
                            )}
                        </div>

                        {/* ✅ Show pagination only if multiple pages */}
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
                        <SectionBlogsSidebar />
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
        
    );
}

export default BlogListPage;
