import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { loadScript } from "../../../../../globals/constants";
import { publicUser } from "../../../../../globals/route-names";
import JobZImage from "../../../../common/jobz-img";
import SectionBlogsSidebar from "../../sections/blogs/sidebar/section-blogs-sidebar";
// import { getBlogById } from "../../../../../api"; // Blog API
import InnerPageBanner from "../../../../common/inner-page-banner";
import { getBlogById, getBlogDetails, getBlogs } from "../../../../../adminApi";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";
import SectionContact from "../../sections/common/section-contact";

const API_BASE_URL = "https://api.unicx.in";

const parseMaybeJsonArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
};

const parseMaybeJsonObject = (value) => {
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
        } catch {
            return {};
        }
    }
    return {};
};

const normalizeImageList = (value) => {
    const raw = parseMaybeJsonArray(value);
    return raw.filter((item) => typeof item === "string" && item.trim());
};

const normalizeVideoList = (value) => {
    const raw = parseMaybeJsonArray(value);
    if (raw.length > 0) {
        return raw.filter((item) => typeof item === "string" && item.trim());
    }
    if (typeof value === "string" && value.trim()) {
        return [value.trim()];
    }
    return [];
};

const pickVideoList = (...values) => {
    for (const value of values) {
        const videos = normalizeVideoList(value);
        if (videos.length > 0) return videos;
    }
    return [];
};

const getMediaUrl = (path) => {
    if (!path || typeof path !== "string") return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return `${API_BASE_URL}${path}`;
};

const BlogDetailStyles = () => (
    <style>{`
        .skeleton-box {
            background: linear-gradient(90deg, #edf2f7 25%, #f7fafc 50%, #edf2f7 75%);
            background-size: 200% 100%;
            animation: blogShimmer 1.5s infinite linear;
            border-radius: 12px;
        }
        @keyframes blogShimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .blog-skeleton-banner { height: 320px; }
        .blog-skeleton-chip { height: 22px; width: 180px; border-radius: 999px; }
        .blog-skeleton-title { height: 34px; width: 88%; }
        .blog-skeleton-line { height: 18px; width: 100%; }
        .blog-skeleton-line-short { width: 70%; }
        .blog-skeleton-section-img { height: 180px; }
        .blog-skeleton-sidebar { height: 84px; }

        .blog-meta-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 16px;
        }
        .blog-meta-chip {
            display: inline-flex;
            align-items: center;
            background: #f6f8fc;
            border: 1px solid #e8edf5;
            border-radius: 999px;
            padding: 7px 14px;
            font-size: 13px;
            line-height: 1.2;
            color: #425466;
        }
        .blog-main-image-card,
        .blog-section-image-card {
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #edf1f7;
            background: #fff;
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
        }
        .blog-main-image-card img,
        .blog-section-image-card img,
        .blog-main-image-card video,
        .blog-section-image-card video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .blog-main-image-card img,
        .blog-section-image-card img {
            transition: transform 0.35s ease;
        }
        .blog-main-image-card:hover img,
        .blog-section-image-card:hover img {
            transform: scale(1.04);
        }
        .blog-main-image-frame {
            height: 380px;
        }
        .blog-section-card {
            border: 1px solid #e8edf5;
            border-radius: 14px;
            background: #fff;
            padding: 18px;
            box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
        }
        .blog-section-title {
            margin-bottom: 12px;
            color: #0f172a;
        }
        .blog-section-image-frame-lg {
            height: 260px;
        }
        .blog-section-image-frame-sm {
            height: 200px;
        }
        @media (max-width: 991px) {
            .blog-skeleton-banner { height: 240px; }
            .blog-main-image-frame { height: 260px; }
            .blog-section-image-frame-lg,
            .blog-section-image-frame-sm {
                height: 220px;
            }
        }
    `}</style>
);

function BlogDetailPage() {
    const { id } = useParams(); // Blog ID
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [blogDetails, setBlogDetails] = useState(null);
    const [loadingBlog, setLoadingBlog] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [error, setError] = useState(null);
    const contactRef = useRef(null);
    const [highlight, setHighlight] = useState(false);

const [blogs, setBlogs] = useState([]);      // ✅ all blogs
  const [currentIndex, setCurrentIndex] = useState(0);
 



  

  useEffect(() => {

    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();

        // latest first
        const sortedBlogs = [...data.blogs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const activeBlogs=sortedBlogs.filter((b)=>b.status==="active");
        setBlogs(activeBlogs);
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs.");
      } 
    };

    fetchBlogs();
  }, []);

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < blogs.length - 1 && blogs[currentIndex + 1]?._id) {
      navigate(`${publicUser.blog.DETAIL}/${blogs[currentIndex + 1]._id}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && blogs[currentIndex - 1]?._id) {
      navigate(`${publicUser.blog.DETAIL}/${blogs[currentIndex - 1]._id}`);
    }
  };

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === blogs.length - 1;

  useEffect(() => {
    if (!id || blogs.length === 0) return;
    const selectedIndex = blogs.findIndex((item) => item?._id === id);
    if (selectedIndex >= 0) {
      setCurrentIndex(selectedIndex);
    }
  }, [id, blogs]);


    useEffect(() => {
        loadScript("js/custom.js");

        const fetchBlogCore = async () => {
            try {
                const data = await getBlogById(id);
                setBlog(data.blog);
            } catch (err) {
                console.error("Error fetching blog:", err);
                setError("Failed to load blog. Please try again later.");
            } finally {
                setLoadingBlog(false);
            }
        };

        const fetchBlogSections = async () => {
            try {
                const response = await getBlogDetails(id);
                setBlogDetails(response?.blogdetails || null);
            } catch (err) {
                console.error("Error fetching blog details:", err);
                setBlogDetails(null);
            } finally {
                setLoadingDetails(false);
            }
        };

        if (id) {
            fetchBlogCore();
            fetchBlogSections();
        } else {
            setLoadingBlog(false);
            setLoadingDetails(false);
            setError("No blog ID provided in the URL.");
        }
    }, [id]);

    if (loadingBlog) {
        return (
            <div className="section-full p-t120 p-b90 bg-white">
                <BlogDetailStyles />
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-8 col-md-12">
                            <div className="blog-post-single-outer">
                                <div className="blog-post-single bg-white p-4 p-md-5 rounded">
                                    <div className="skeleton-box blog-skeleton-banner m-b30" />
                                    <div className="d-flex flex-wrap gap-3 m-b20">
                                        <div className="skeleton-box blog-skeleton-chip" />
                                        <div className="skeleton-box blog-skeleton-chip" />
                                    </div>
                                    <div className="skeleton-box blog-skeleton-title m-b20" />
                                    <div className="skeleton-box blog-skeleton-line m-b10" />
                                    <div className="skeleton-box blog-skeleton-line m-b10" />
                                    <div className="skeleton-box blog-skeleton-line blog-skeleton-line-short m-b30" />
                                    <div className="skeleton-box blog-skeleton-title m-b20" />
                                    <div className="skeleton-box blog-skeleton-line m-b10" />
                                    <div className="skeleton-box blog-skeleton-line blog-skeleton-line-short m-b20" />
                                    <div className="row">
                                        <div className="col-md-6 m-b20">
                                            <div className="skeleton-box blog-skeleton-section-img" />
                                        </div>
                                        <div className="col-md-6 m-b20">
                                            <div className="skeleton-box blog-skeleton-section-img" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 rightSidebar">
                            <div className="bg-white p-4 rounded">
                                <div className="skeleton-box blog-skeleton-sidebar m-b20" />
                                <div className="skeleton-box blog-skeleton-sidebar m-b20" />
                                <div className="skeleton-box blog-skeleton-sidebar" />
                            </div>
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

    if (!blog) {
        return (
            <div className="section-full p-t120 p-b90 bg-white text-center">
                <div className="container">Blog not found.</div>
            </div>
        );
    }

  
    const blogImages = normalizeImageList(blog.images);
    const blogVideos = pickVideoList(
        blog?.video,
        blog?.videoUrl,
        blog?.video_url,
        blogDetails?.video,
        blogDetails?.videoUrl,
        blogDetails?.video_url
    );
    const createdAtLabel = blog?.createdAt
        ? new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Date not available";
    const blogDescription = blog?.description || blog?.short_description || "";
    const rawSections = parseMaybeJsonArray(blogDetails?.content);

    const sections = rawSections.map((section) => {
        const current = parseMaybeJsonObject(section);
        return {
            title: current.contentTitle || current.title || current.sectionTitle || "",
            description:
                current.description || current.sectiondescription || current.sectionDescription || "",
            images: normalizeImageList(
                current.gallary_image ||
                current.sectionimages ||
                current.sectionImages ||
                current.images ||
                current.sectionImage
            ),
            videos: pickVideoList(
                current.video,
                current.videoUrl,
                current.video_url,
                current.sectionVideo,
                current.sectionvideo
            ),
        };
    });

    return (
        <>
            <BlogDetailStyles />
            <InnerPageBanner
                _data={{ title: blog.title, crumb: "Blog Details" }}
                bgImagePath="images/contact-us/Header.webp"
            />

            <div className="section-full p-t120 p-b90 bg-white">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-8 col-md-12">
                            <div className="blog-post-single-outer">
                                <div className="blog-post-single bg-white">
                                    <div className="wt-post-info">
                                        {/* Blog Image */}
                                        <div className="wt-post-media m-b30">
                                            {blogImages.length > 0 ? (
                                                <div className="row">
                                                    {blogImages.map((img, index) => (
                                                        <div
                                                            key={index}
                                                            className={`m-b20 ${index === 0 ? "col-12" : "col-md-6"}`}
                                                        >
                                                            <div className="blog-main-image-card blog-main-image-frame">
                                                                <JobZImage
                                                                    src={getMediaUrl(img)}
                                                                    alt={`Blog Image ${index + 1}`}
                                                                    className="img-fluid"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : blogVideos.length === 0 ? (
                                                <JobZImage
                                                    src="images/blog/blog-single/1.jpg"
                                                    alt={blog.title}
                                                    className="img-fluid"
                                                />
                                            ) : null}

                                            {blogVideos.length > 0 && (
                                                <div className="row">
                                                    {blogVideos.map((video, index) => (
                                                        <div
                                                            key={`blog-video-${index}`}
                                                            className={`m-b20 ${index === 0 ? "col-12" : "col-md-6"}`}
                                                        >
                                                            <div className="blog-main-image-card blog-main-image-frame">
                                                                <video
                                                                    controls
                                                                    playsInline
                                                                    preload="metadata"
                                                                    src={getMediaUrl(video)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Blog Title & Meta */}
                                        <div className="wt-post-title">
                                            <div className="blog-meta-row">
                                                <div className="blog-meta-chip">
                                                    {createdAtLabel}
                                                </div>
                                                <div className="blog-meta-chip">
                                                    By {blog.authorName || blog.author || blogDetails?.authorName || "Admin"}
                                                </div>
                                            </div>
                                            <h3 className="post-title">{blog.title}</h3>
                                            {blogDescription && (
                                                <div
                                                    className="wt-post-discription m-t15"
                                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(blogDescription) }}
                                                />
                                            )}
                                        </div>

                                        <div className="wt-post-discription m-t40">
                                            {/* <h4 className="twm-blog-s-title">Sections</h4> */}

                                            {loadingDetails && (
                                                <div className="m-t20">
                                                    {[1, 2].map((item) => (
                                                        <div key={item} className="m-b30">
                                                            <div className="skeleton-box blog-skeleton-title m-b20" />
                                                            <div className="skeleton-box blog-skeleton-line m-b10" />
                                                            <div className="skeleton-box blog-skeleton-line blog-skeleton-line-short m-b20" />
                                                            <div className="row">
                                                                <div className="col-md-8 m-b20">
                                                                    <div className="skeleton-box blog-skeleton-section-img" />
                                                                </div>
                                                                <div className="col-md-4 m-b20">
                                                                    <div className="skeleton-box blog-skeleton-section-img" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {!loadingDetails && sections.length === 0 && (
                                                <p className="m-b20">No sections available.</p>
                                            )}

                                            {!loadingDetails &&
                                                sections.map((section, sectionIndex) => (
                                                    <div key={sectionIndex} className="blog-section-card m-b30">
                                                        <h5
                                                            className="blog-section-title"
                                                            dangerouslySetInnerHTML={{
                                                                __html: sanitizeHtml(
                                                                    section.title || `Section ${sectionIndex + 1}`
                                                                ),
                                                            }}
                                                        />

                                                        {section.description && (
                                                            <div
                                                                className="m-b20"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: sanitizeHtml(section.description),
                                                                }}
                                                            />
                                                        )}

                                                        {section.images.length > 0 && (
                                                            <div className="row">
                                                                {section.images.map((image, imageIndex) => (
                                                                    <div
                                                                        className={`m-b20 ${imageIndex === 0 ? "col-12" : "col-md-6"}`}
                                                                        key={`${sectionIndex}-${imageIndex}`}
                                                                    >
                                                                        <div
                                                                            className={`blog-section-image-card ${imageIndex === 0
                                                                                ? "blog-section-image-frame-lg"
                                                                                : "blog-section-image-frame-sm"
                                                                                }`}
                                                                        >
                                                                            <JobZImage
                                                                                src={getMediaUrl(image)}
                                                                                alt={`${section.title || "Section"} image ${imageIndex + 1}`}
                                                                                className="img-fluid"
                                                                                loading="lazy"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {section.videos.length > 0 && (
                                                            <div className="row">
                                                                {section.videos.map((video, videoIndex) => (
                                                                    <div
                                                                        className={`m-b20 ${videoIndex === 0 ? "col-12" : "col-md-6"}`}
                                                                        key={`section-video-${sectionIndex}-${videoIndex}`}
                                                                    >
                                                                        <div
                                                                            className={`blog-section-image-card ${videoIndex === 0
                                                                                ? "blog-section-image-frame-lg"
                                                                                : "blog-section-image-frame-sm"
                                                                                }`}
                                                                        >
                                                                            <video
                                                                                controls
                                                                                playsInline
                                                                                preload="metadata"
                                                                                src={getMediaUrl(video)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>

                                        
                                    </div>
                                </div>

                                {/* Share Section */}
                                <div className="post-area-tags-wrap">
                                    <div className="post-social-icons-wrap">
                                        <h4 className="mb-4">Share</h4>
                                        <ul className="post-social-icons">
                                            <li><a href="https://www.facebook.com/" className="fab fa-facebook-f" /></li>
                                            <li><a href="https://www.twitter.com/" className="fab fa-twitter" /></li>
                                            <li><a href="https://in.linkedin.com/" className="fab fa-linkedin-in" /></li>
                                            <li><a href="https://www.google.com/" className="fab fa-google" /></li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Navigation back to Blog List */}
                                {/* <div className="post-navigation m-t30">
                                    <div className="post-nav-links">
                                        <div className="post-nav-item nav-post-prev">
                                            <div className="nav-post-arrow">
                                                <NavLink to={publicUser.blog.LIST}>
                                                    <i className="fa fa-angle-left" />
                                                </NavLink>
                                            </div>
                                            <div className="nav-post-meta">
                                                <NavLink to={publicUser.blog.LIST}>Back to Blog List</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                               
                                                   
                                    <div className="post-navigation m-t30">
  <div className="post-nav-links">

    {/* PREVIOUS */}
    <div className={`post-nav-item nav-post-prev ${isPrevDisabled ? "disabled" : ""}`}>
      <div className="nav-post-arrow">
        <button
          onClick={handlePrevious}
          disabled={isPrevDisabled}
          className="btn btn-link"
        >
          <i className="fa fa-angle-left" />
        </button>
      </div>

      {!isPrevDisabled && (
        <div className="nav-post-meta">
          <span>{blogs[currentIndex - 1]?.title}</span>
        </div>
      )}
    </div>

    {/* NEXT */}
    <div className={`post-nav-item nav-post-next ${isNextDisabled ? "disabled" : ""}`}>
      <div className="nav-post-arrow">
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className="btn btn-link"
        >
          <i className="fa fa-angle-right" />
        </button>
      </div>

      {!isNextDisabled && (
        <div className="nav-post-meta">
          <span>{blogs[currentIndex + 1]?.title}</span>
        </div>
      )}
    </div>

  </div>
</div>
                            </div>
                        </div>

                        {/* Sidebar */}
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

                .service-skeleton-wrap {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .service-skeleton {
                    position: relative;
                    overflow: hidden;
                    background: #eef3fb;
                    border-radius: 12px;
                }

                .service-skeleton::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 90%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent);
                    animation: serviceShimmer 1.4s infinite;
                }

                .service-skeleton-title { height: 24px; width: 45%; }
                .service-skeleton-banner { height: 220px; width: 100%; }
                .service-skeleton-text { height: 14px; width: 100%; }
                .service-skeleton-text.short { width: 70%; }
                .service-skeleton-card { height: 120px; width: 100%; }

                @keyframes serviceShimmer {
                    100% { left: 130%; }
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
        </>
    );
}

export default BlogDetailPage;
