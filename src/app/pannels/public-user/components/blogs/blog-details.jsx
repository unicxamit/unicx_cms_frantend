import { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom"; // Import useParams
import { loadScript } from "../../../../../globals/constants";
import { publicUser } from "../../../../../globals/route-names";
import JobZImage from "../../../../common/jobz-img";
import SectionBlogsSidebar2 from "../../sections/blogs/sidebar/section-blogs-sidebar2";
import { getBlogs } from "../../../../../adminApi";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";
import SectionContact from "../../sections/common/section-contact";
import Skeleton from "../../../../common/skeleton/Skeleton";


function BlogDetailsPage() {
    

const [blogs, setBlogs] = useState([]);      // ✅ all blogs
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ✅ current blog (NO reassignment)
  const currentBlog = blogs[currentIndex];

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < blogs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === blogs.length - 1;

  // ================= UI STATES =================

  if (loading) {
    return (
      <div className="section-full p-t120 p-b90 site-bg-white">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-8 col-md-12">
              <div className="blog-post-single-outer">
                <div className="blog-post-single bg-white">
                  <div className="wt-post-info">
                    <div className="wt-post-media m-b30">
                      <Skeleton width="100%" height="320px" />
                    </div>
                    <div className="wt-post-meta-list m-b20">
                      <Skeleton width="140px" height="14px" />
                      <Skeleton width="120px" height="14px" />
                    </div>
                    <div className="wt-post-title m-b20">
                      <Skeleton width="90%" height="28px" />
                    </div>
                    <div className="wt-post-text">
                      <Skeleton width="100%" height="14px" />
                      <Skeleton width="100%" height="14px" className="m-t10" />
                      <Skeleton width="82%" height="14px" className="m-t10" />
                    </div>
                  </div>
                </div>
                <div className="post-navigation m-t30">
                  <Skeleton width="100%" height="56px" />
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 rightSidebar">
              <Skeleton width="100%" height="240px" />
              <Skeleton width="100%" height="280px" className="m-t20" />
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

  if (!currentBlog) {
    return (
      <div className="section-full p-t120 p-b90 bg-white text-center">
        <div className="container">Blog not found.</div>
      </div>
    );
  }
    return (
        <>
            <div className="section-full p-t120 p-b90 bg-white">
                <div className="container">
                    {/* BLOG SECTION START */}
                    <div className="section-content">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8 col-md-12">
                                {/* BLOG START */}
                                <div className="blog-post-single-outer">
                                    <div className="blog-post-single bg-white">
                                        <div className="wt-post-info">
                                            <div className="wt-post-media m-b30">
                                                <img
                                                    src={
                                                        currentBlog.images
                                                            // ? blogDetail.images // Use BASE_URL for image
                                                            // : `${BASE_URL}/images/blog/blog-single/1.jpg` // Placeholder if no image
                                                    }
                                                    alt={currentBlog.title}
                                                />
                                            </div>
                                            <div className="wt-post-title ">
                                                <div className="wt-post-meta-list">
                                                    <div className="wt-list-content post-date">
                                                        {new Date(currentBlog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                    <div className="wt-list-content post-author">
                                                        By {currentBlog.author || "Unicx Team"} {/* Assuming blogDetail might have an author, otherwise default */}
                                                    </div>
                                                </div>
                                                <h3 className="post-title">{currentBlog.title}</h3>
                                            </div>
                                           
                                            {/* Display full content */}
                                           

                                            <div className="twm-posts-author">
                                                
                                                <div className="twm-post-author-content">
                                                    
                                                    <p
                                                        dangerouslySetInnerHTML={{
                                                            __html: sanitizeHtml(
                                                                currentBlog.short_description ||
                                                                currentBlog.content ||
                                                                "No description available."
                                                            ),
                                                        }}
                                                    />
                                                    <strong>
                                                        <NavLink to={`${publicUser.blog.DETAIL}/${currentBlog?._id}`}>
                                                            Read More
                                                        </NavLink>
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    
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
                </div>
            </div>
        </>
    );
}

export default BlogDetailsPage;
