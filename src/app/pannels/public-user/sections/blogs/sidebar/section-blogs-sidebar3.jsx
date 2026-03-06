import { publicUser } from "../../../../../../globals/route-names";
import JobZImage from "../../../../../common/jobz-img";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react"; // Import useState and useEffect
import { getCategories, getCaseStudies } from "../../../../../../api"; // Import API functions

function SectionBlogsSidebar3() {
    const [categories, setCategories] = useState([]);
    const [recentArticles, setRecentArticles] = useState([]);

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
                console.log("Fetched Categories for Sidebar:", data);
            } catch (error) {
                console.error("Error fetching categories for sidebar:", error);
            }
        };

        // Fetch recent articles (case studies in this context)
        const fetchRecentArticles = async () => {
            try {
                const data = await getCaseStudies();
                // Take up to the first 5 recent articles
                setRecentArticles(data.slice(0, 5));
                console.log("Fetched Recent Articles for Sidebar:", data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching recent articles for sidebar:", error);
            }
        };

        fetchCategories();
        fetchRecentArticles();
    }, []);

    return (
        <>
            <div className="side-bar">
                <div className="widget search-bx">
                    <form role="search" method="post">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Search" />
                            <button className="btn" type="button" id="button-addon2"><i className="feather-search" /></button>
                        </div>
                    </form>
                </div>
                <div className="widget all_services_list">
                    <h4 className="section-head-small mb-4">Categories</h4>
                    <div className="all_services m-b30">
                        <ul>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <li key={category.id}>
                                        <NavLink to={`${publicUser.blog.LIST}?category=${category.name}`}>{category.name}</NavLink>
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
                    <h4 className="section-head-small mb-4">Recent Case-Studies</h4>
                    <div className="section-content">
                        <div className="widget-post-bx">
                            {recentArticles.length > 0 ? (
                                recentArticles.map((article) => (
                                    <div className="widget-post clearfix" key={article.id}>
                                        <div className="wt-post-media">
                                            <img src={article.image_url || "images/blog/recent-blog/pic1.jpg"} alt={article.title} />
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-header">
                                                <span className="post-date">{new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                <span className="post-title">
                                                    <NavLink to={`${publicUser.blog.DETAIL}/${article.id}`}>{article.title}</NavLink>
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
                        <NavLink to={publicUser.jobs.LIST}>General</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Jobs </NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Payment</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Application </NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Work</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Recruiting</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Employer</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Income</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Tips</NavLink>
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default SectionBlogsSidebar3;
