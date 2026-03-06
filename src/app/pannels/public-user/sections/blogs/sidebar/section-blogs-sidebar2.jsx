import { publicUser } from "../../../../../../globals/route-names";
import JobZImage from "../../../../../common/jobz-img";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // Import useState and useEffect
import { getBlogs, getCaseStudies, getCategories } from "../../../../../../adminApi";
// import { getCategories, getBlogs } from "../../../../../../api"; // Import getBlogs instead of getCaseStudies
// import api from "../../../../../../api"; // Import the default api instance for baseURL

function SectionBlogsSidebar2() {
    const [categories, setCategories] = useState([]);
    const [recentArticles, setRecentArticles] = useState([]);
    const [allBlogTags, setAllBlogTags] = useState([]); // New state for all unique tags
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    
    const BASE_URL = 'https://unicx.in'; // Define BASE_URL for image paths

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                const filterActiveCategory=data.category.filter((c)=>c.status==="active");
                setCategories(filterActiveCategory);
                console.log("Fetched Categories for Sidebar:", data);
            } catch (error) {
                console.error("Error fetching categories for sidebar:", error);
            }
        };
const fetchCaseStudies = async () => {
            try {
                   const data = await getCaseStudies();
 // ✅ Filter only ACTIVE case studies
    const activeCaseStudies = (data?.caseStudies || []).filter(
      (cs) => cs.status === "active"
    );
                setRecentArticles(activeCaseStudies);
                console.log("Fetched Categories for Sidebar:", data);
            } catch (error) {
                console.error("Error fetching categories for sidebar:", error);
            }
        };
        // Fetch recent blogs and extract tags
        // const fetchRecentBlogsAndTags = async () => {
        //     try {
        //         const data = await getBlogs(); // Fetch blogs
        //         // Take up to the first 5 recent blogs
        //         setRecentArticles(data.blogs.slice(0, 5));
        //         console.log("Fetched Recent Blogs for Sidebar:", data.blogs.slice(0, 5));

        //         // Extract and process all unique tags from all blogs
        //         const tage = new Set();
        //         data.blogs.forEach(blog => {
        //             if (blog.tage) {
        //                 blog.tage.split(',').forEach(tag => {
        //                     const trimmedTag = tag.trim();
        //                     if (trimmedTag) {
        //                         tage.add(trimmedTag);
        //                     }
        //                 });
        //             }
        //         });
        //         setAllBlogTags(Array.from(tage)); // Convert Set to Array
        //         console.log("Extracted All Blog Tags:", Array.from(tage));

        //     } catch (error) {
        //         console.error("Error fetching recent blogs or extracting tags for sidebar:", error);
        //     }
        // };

        fetchCategories();
        fetchCaseStudies()
        // fetchRecentBlogsAndTags();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchTerm(params.get("search") || "");
    }, [location.search]);

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const params = new URLSearchParams(location.search);
        const trimmedSearch = searchTerm.trim();

        if (trimmedSearch) {
            params.set("search", trimmedSearch);
        } else {
            params.delete("search");
        }

        const query = params.toString();
        navigate(`${publicUser.blog.LIST}${query ? `?${query}` : ""}`);
    };

    const getCategoryLink = (categoryName = "") => {
        const params = new URLSearchParams(location.search);
        params.set("category", categoryName);
        const query = params.toString();
        return `${publicUser.blog.LIST}${query ? `?${query}` : ""}`;
    };

    return (
        <>
            <div className="side-bar">
                <div className="widget search-bx">
                    {/* <form role="search" onSubmit={handleSearchSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search blogs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn" type="submit" id="button-addon2"><i className="feather-search" /></button>
                        </div>
                    </form> */}
                </div>
                <div className="widget all_services_list">
                    <h4 className="section-head-small mb-4">Categories</h4>
                    <div className="all_services m-b30">
                        <ul>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <li key={category._id}>
                                        {/* Link to blog list filtered by category */}
                                        <NavLink to={getCategoryLink(category.name)}>{category.name}</NavLink>
                                        {/* <span className="badge">{category.count || 0}</span> */}
                                    </li>
                                ))
                            ) : (
                                <li>No categories found.</li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="widget recent-posts-entry">
                    <h4 className="section-head-small mb-4">Recent Articles</h4>
                    <div className="section-content">
                        <div className="widget-post-bx">
                            {recentArticles.length > 0 ? (
                                recentArticles.map((article) => (
                                    <div className="widget-post clearfix" key={article._id}>
                                        <div className="wt-post-media">
                                            
                                            {article.images.map((img, index) => (
                                                                           
                                                                  <JobZImage
                                                      key={index}
                                                      src={img}
                                                      alt={`Blog Image ${index + 1}`}
                                                      className="img-fluid"
                                                      loading="lazy"
                                                    />
                                                    
                                                                            ))}
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-header">
                                                <span className="post-date">{new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                <span className="post-title">
                                                    {/* Link to individual blog detail page */}
                                                    <NavLink to={`${publicUser.caseStudy.DETAIL}/${article._id}`}>{article.title}</NavLink>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No recent articles found.</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* <div className="widget tw-sidebar-tags-wrap">
                    <h4 className="section-head-small mb-4">Tags</h4>
                    <div className="tagcloud">
                        {allBlogTags.length > 0 ? (
                            allBlogTags.map((tag, index) => (
                                <NavLink key={index} to={`${publicUser.blog.LIST}?tag=${tag}`}>{tag}</NavLink>
                            ))
                        ) : (
                            <p>No tags found.</p>
                        )}
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default SectionBlogsSidebar2;
