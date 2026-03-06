import { publicUser } from "../../../../../../globals/route-names";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogs, getCategories } from "../../../../../../adminApi";
// import { getCategories } from "../../../../../../api"; // Case study categories
// import { getBlogs } from "../../../../../../api"; // Recent blogs

function SidebarCaseStudy() {
    const [categories, setCategories] = useState([]);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchTerm(params.get("search") || "");
    }, [location.search]);

    useEffect(() => {
        // Fetch categories from case studies
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                const filterActiveCategory=data?.category?.filter((c)=>c.status==="active")
                setCategories(filterActiveCategory);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        // Fetch recent blogs
        const fetchRecentBlogs = async () => {
            try {
                const data = await getBlogs();
                const filterActiveBlogs=data.blogs.filter((b)=>b.status==="active")
                setRecentBlogs(filterActiveBlogs?.slice(0, 5)); 
            } catch (error) {
                console.error("Error fetching recent blogs:", error);
            }
        };

        fetchCategories();
        fetchRecentBlogs();
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
        navigate(`${publicUser.caseStudy.LIST}${query ? `?${query}` : ""}`);
    };

    const activeCategory = new URLSearchParams(location.search).get("category") || "";

    const getCategoryLink = (categoryName = "") => {
        const params = new URLSearchParams(location.search);
        if (categoryName) {
            params.set("category", categoryName);
        } else {
            params.delete("category");
        }
        const query = params.toString();
        return `${publicUser.caseStudy.LIST}${query ? `?${query}` : ""}`;
    };

    return (
        <div className="side-bar">
            {/* Search Box */}
            {/* <div className="widget search-bx">
                <form role="search" onSubmit={handleSearchSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search case studies"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn" type="submit" id="button-addon2">
                            <i className="feather-search" />
                        </button>
                    </div>
                </form>
            </div> */}

            {/* Case Study Categories */}
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
                                <li
                                    key={category._id}
                                    className={activeCategory?.toLowerCase() === category.name?.toLowerCase() ? "active" : ""}
                                >
                                    <NavLink
                                        to={getCategoryLink(category.name)}
                                    >
                                        {category.name}
                                    </NavLink>
                                </li>
                            ))}
                            </>
                        ) : (
                            <li>No categories found.</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Recent Blogs */}
            <div className="widget recent-posts-entry">
                <h4 className="section-head-small mb-4">Recent Blogs</h4>
                <div className="section-content">
                    <div className="widget-post-bx">
                        {recentBlogs.length > 0 ? (
                            recentBlogs.map((blog) => (
                                <div className="widget-post clearfix" key={blog._id}>
                                    <div className="wt-post-media">
                                        <img src={blog.images || "images/blog/recent-blog/pic1.jpg"} alt={blog.title} />
                                    </div>
                                    <div className="wt-post-info">
                                        <div className="wt-post-header">
                                            <span className="post-date">
                                                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            <span className="post-title">
                                                <NavLink to={`${publicUser.blog.DETAIL}/${blog._id}`}>
                                                    {blog.title}
                                                </NavLink>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No recent blogs found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidebarCaseStudy;
