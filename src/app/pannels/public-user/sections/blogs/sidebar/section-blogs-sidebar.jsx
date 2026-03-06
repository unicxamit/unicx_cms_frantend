import { publicUser } from "../../../../../../globals/route-names";
import JobZImage from "../../../../../common/jobz-img";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // Import useState and useEffect
import { getBlogs, getCategories } from "../../../../../../adminApi";
// import { getCategories, getCaseStudies } from "../../../../../../api"; // Import API functions

function SectionBlogsSidebar() {
    const [categories, setCategories] = useState([]);
    const [recentArticles, setRecentArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchTerm(params.get("search") || "");
    }, [location.search]);

    const activeCategory = new URLSearchParams(location.search).get("category") || "";

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
const filterActiveCategory=data.category.filter((c)=>c.status==="active");
                setCategories(filterActiveCategory);
                // console.log("Fetched Categories for Sidebar:", data);
            } catch (error) {
                console.error("Error fetching categories for sidebar:", error);
            }
        };

        // Fetch recent blogs
        const fetchRecentArticles = async () => {
            try {
                const data = await getBlogs();
                const filterActiveBlogs = (data?.blogs || []).filter((b) => b.status === "active");
                // Take up to the first 5 recent blogs
                setRecentArticles(filterActiveBlogs.slice(0, 5));
                // console.log("Fetched Recent Articles for Sidebar:", data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching recent articles for sidebar:", error);
            }
        };

        fetchCategories();
        fetchRecentArticles();
    }, []);

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
        params.delete("categoryId");
        if (categoryName) {
            params.set("category", categoryName);
        } else {
            params.delete("category");
        }
        const query = params.toString();
        return `${publicUser.blog.LIST}${query ? `?${query}` : ""}`;
    };

    return (
        <>
            <div className="side-bar">
                {/* <div className="widget search-bx">
                    <form role="search" onSubmit={handleSearchSubmit}>
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
                    </form>
                </div> */}
                <div className="widget all_services_list">
                    <h4 className="section-head-small mb-4">Categories</h4>
                    <div className="all_services m-b30">
                        <ul>
                            {categories.length > 0 ? (
                                <>
                                    <li className={!activeCategory ? "active" : ""}>
                                        <NavLink to={getCategoryLink("")}>All Categories</NavLink>
                                    </li>
                                    {categories.map((category) => (
                                    <li key={category._id} className={activeCategory?.toLowerCase() === category.name?.toLowerCase() ? "active" : ""}>
                                        <NavLink to={getCategoryLink(category.name)}>{category.name}</NavLink>
                                    </li>
                                ))}
                                </>
                            ) : (
                                <li>No categories found.</li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="widget recent-posts-entry">
                    <h4 className="section-head-small mb-4">Recent Blogs</h4>
                    <div className="section-content">
                        <div className="widget-post-bx">
                            {recentArticles.length > 0 ? (
                                recentArticles.map((article) => (
                                    <div className="widget-post clearfix" key={article._id}>
                                        <div className="wt-post-media">
                                            <img src={article?.images?.[0] || "images/blog/recent-blog/pic1.jpg"} alt={article.title} />
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-header">
                                                <span className="post-date">{new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                <span className="post-title">
                                                    <NavLink to={`${publicUser.blog.DETAIL}/${article._id}`}>{article.title}</NavLink>
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
            </div>
        </>
    );
}

export default SectionBlogsSidebar;
