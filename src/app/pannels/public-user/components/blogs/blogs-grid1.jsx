import { NavLink, useLocation } from "react-router-dom";
import JobZImgae from "../../../../common/jobz-img";
import { publicUser } from "../../../../../globals/route-names";
import SectionPagination from "../../sections/common/section-pagination";
import { getBlogs } from "../../../../../adminApi";
import { useEffect, useState } from "react";
import { loadScript } from "../../../../../globals/constants";
import JobZImage from "../../../../common/jobz-img";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";
function BlogGrid1Page() {
        const [allBlogs, setAllBlogs] = useState([]);
        const [filteredBlogs, setFilteredBlogs] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const location = useLocation();
    
        // ✅ Pagination state
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const blogsPerPage = 6;
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
        // ✅ Fetch blogs
        useEffect(() => {
    
            const fetchAllBlogs = async () => {
                try {
                    const data = await getBlogs();
                    const activeBlogs=(data.blogs || []).filter((b)=>b.status==="active");
                    setAllBlogs(activeBlogs);
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
                <>
                    <style>{`
                        .blogs1-skeleton-grid {
                            display: grid;
                            grid-template-columns: repeat(3, minmax(0, 1fr));
                            gap: 24px;
                        }

                        @media (max-width: 991px) {
                            .blogs1-skeleton-grid {
                                grid-template-columns: 1fr;
                            }
                        }

                        .blogs1-skeleton-card {
                            display: flex;
                            flex-direction: column;
                            gap: 12px;
                        }

                        .blogs1-skeleton {
                            position: relative;
                            overflow: hidden;
                            border-radius: 12px;
                            border: 1px solid #e3eaf5;
                            background: linear-gradient(180deg, #f3f6fa 0%, #eaf2ff 100%);
                        }

                        .blogs1-skeleton::after {
                            content: "";
                            position: absolute;
                            top: 0;
                            left: -120%;
                            width: 90%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
                            animation: blogs1Shimmer 1.4s infinite;
                        }

                        .blogs1-skeleton-image { height: 180px; width: 100%; }
                        .blogs1-skeleton-meta { height: 14px; width: 70%; }
                        .blogs1-skeleton-title { height: 22px; width: 90%; }
                        .blogs1-skeleton-text { height: 12px; width: 100%; }
                        .blogs1-skeleton-text.short { width: 78%; }
                        .blogs1-skeleton-link { height: 14px; width: 35%; }

                        @keyframes blogs1Shimmer {
                            100% { left: 130%; }
                        }
                    `}</style>
                    <div className="section-full p-t120 p-b90 bg-white">
                        <div className="container">
                            <div className="blogs1-skeleton-grid">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div className="blogs1-skeleton-card" key={index}>
                                        <div className="blogs1-skeleton blogs1-skeleton-image" />
                                        <div className="blogs1-skeleton blogs1-skeleton-meta" />
                                        <div className="blogs1-skeleton blogs1-skeleton-title" />
                                        <div className="blogs1-skeleton blogs1-skeleton-text" />
                                        <div className="blogs1-skeleton blogs1-skeleton-text short" />
                                        <div className="blogs1-skeleton blogs1-skeleton-link" />
                                    </div>
                                ))}
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
            <div className="section-full p-t120  p-b90 site-bg-white">
                <div className="container">
                    <div className="masonry-wrap row d-flex">
                        {/*Block one*/}
                         {currentBlogs.length > 0 ? (
                                currentBlogs.map((blog) => (
                        <div className="masonry-item col-lg-4 col-md-12">
 
                            <div className="blog-post twm-blog-post-1-outer">
                                
                                <div className="wt-post-media">
                                    <NavLink to={`${publicUser.blog.DETAIL}/${blog._id}`}>   
                                    {blog.images.map((img, index) => (
                                                                           
                                                    
                                                                  <JobZImage
                                                      key={index}
                                                      src={img}
                                                      alt={`Blog Image ${index + 1}`}
                                                    //   className="img-fluid"
                                                      loading="lazy"
                                                    />
                                                    
                                                                            ))}</NavLink>
                                </div>
                                <div className="wt-post-info">
                                    <div className="wt-post-meta ">
                                        <ul>
                                            <li className="post-date"> {new Date(
                                                                blog.createdAt
                                                            ).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}</li>
                                            <li className="post-author">By <NavLink to={`${publicUser.blog.DETAIL}/${blog._id}`}> {blog.author || "Unicx Team"}</NavLink></li>
                                        </ul>
                                    </div>
                                    <div className="wt-post-title ">
                                        <h4 className="post-title">
                                            <NavLink to={`${publicUser.blog.DETAIL}/${blog._id}`}>{blog.title}</NavLink>
                                        </h4>
                                    </div>
                                    <div className="wt-post-text ">
                                        <p>
                                                            {toPlainText(resolveShortDescriptionHtml(blog))
                      ? `${toPlainText(resolveShortDescriptionHtml(blog)).slice(0, 150)}...`
                      : "-"}
                                        </p>
                                    </div>
                                    <div className="wt-post-readmore ">
                                        <NavLink to={`${publicUser.blog.DETAIL}/${blog._id}`} className="site-button-link site-text-primary">Read More</NavLink>
                                    </div>
                                </div>
                                </div> </div>
                                  ))
                            ) : (
                                <div className="col-12 text-center">
                                    <p>No blogs found matching your criteria.</p>
                                </div>
                            )}
                    </div>
                   {totalPages > 1 && (
                            <SectionPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                </div>
            </div>

        </>
    )
}

export default BlogGrid1Page;
