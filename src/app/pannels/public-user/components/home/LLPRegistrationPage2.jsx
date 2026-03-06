import SectionEmployerInfo from "../../sections/employers/detail/section-emp-info";
import SectionEmployersCandidateSidebar from "../../sections/common/section-emp-can-sidebar";
import SectionOfficeVideo1 from "../../sections/common/section-office-video1";
import SectionOfficePhotos3 from "../../sections/common/section-office-photos3";
import SectionAvailableJobsGrid from "../../sections/employers/detail/section-available-jobs-grid";
import { useEffect, useRef, useState } from "react";
import { loadScript, publicUrlFor } from "../../../../../globals/constants";
import SectionLocation from "../../sections/common/section-location";
import SectionProfile from "../../sections/common/section-profile";
import SectionContact from "../../sections/common/section-contact";
import JobZImage from "../../../../common/jobz-img";
import { NavLink, useParams } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import { getServicesById } from "../../../../../api";
import Footer1 from "../../../../common/footer/footer1";
import SectionBlogsSidebar from "../../sections/blogs/sidebar/section-blogs-sidebar";

function EmployersDetail2Page() {
    const licence = 'images/sub-sub-category/licence.png';
    const foundationSetup = 'images/sub-sub-category/foundation-setup.png';
    const finances = 'images/sub-sub-category/finances.png';
    const corporateLegal = 'images/sub-sub-category/corporate-legal.png';
    const certificate = 'images/sub-sub-category/certificate.png';
    const business = 'images/sub-sub-category/business.png';

    const [employerData, setEmployerData] = useState({
        id: "",
        name: "",
        description: "",
        category_id: "",
        category_name: "",
        subcategory_id: "",
        subcategory_name: "",
        created_at: "",
        meta_description: "",
        meta_keywords: "",
        templateKey: "",
        title: "",
        sections: [],
        jobs: [],
        socialLinks: {
            facebook: "",
            twitter: "",
            google: "",
            linkedin: "",
            skype: "",
        },
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { id } = useParams();

    const type = 2;

    // 🔽 Reference for the contact section
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

    // Fetch employer details
    const fetchEmployerDetails = async () => {
        try {
            setLoading(true);
            const data = await getServicesById(id);
            console.log(data);

            let jobsData = [];
            if (data.jobs) {
                if (typeof data.jobs === "string") {
                    try {
                        jobsData = JSON.parse(data.jobs);
                    } catch (e) {
                        console.error("Error parsing jobs:", e);
                        jobsData = [];
                    }
                } else if (Array.isArray(data.jobs)) {
                    jobsData = data.jobs;
                }
            }

            setEmployerData({
                id: data.id || "",
                name: data.name || "",
                description: data.description || "No description available",
                category_id: data.category_id || "",
                category_name: data.category_name || "",
                subcategory_id: data.subcategory_id || "",
                subcategory_name: data.subcategory_name || "",
                created_at: data.created_at || "",
                meta_description: data.meta_description || "",
                meta_keywords: data.meta_keywords || "",
                templateKey: data.templateKey || "",
                title: data.title || "",
                sections: data.sections || [],
                jobs: jobsData,
                socialLinks: {
                    facebook: data.socialLinks?.facebook || "",
                    twitter: data.socialLinks?.twitter || "",
                    google: data.socialLinks?.google || "",
                    linkedin: data.socialLinks?.linkedin || "",
                    skype: data.socialLinks?.skype || "",
                },
            });
        } catch (error) {
            setMessage("Failed to fetch employer details.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchEmployerDetails();
    }, [id]);

    useEffect(() => {
    }, []);

    return (
        <div>
            <div className="section-full p-t0 p-b90 bg-white">
                <div className="responsive-breadcrumb container-fluid py-2">
                    <div className="d-flex flex-wrap align-items-center gap-1">
                        <h6 className="d-flex flex-wrap align-items-center gap-1 mb-0">
                            <NavLink style={{ textDecoration: 'none' }} to="/index">
                                Home
                            </NavLink> &gt;{' '}
                            <NavLink style={{ textDecoration: 'none' }} to="#">
                                {employerData?.category_name || "N/A"}
                            </NavLink> &gt;{' '}
                            <NavLink style={{ textDecoration: 'none' }} to="#">
                                {employerData?.subcategory_name || "N/A"}
                            </NavLink> &gt;{' '}
                            <span>{employerData.name || "Loading..."}</span>
                        </h6>
                    </div>
                </div>

                <div className="twm-top-wide-banner overlay-wraper">
                    <div className="overlay-main opacity-09" />
                    <div className="twm-top-wide-banner-content container">
                        <div className="twm-mid-content">
                            <div className="twm-employer-self-top">
                                <div className="twm-employer-detail">
                                    <div className="twm-media">
                                        <JobZImage
                                            src={
                                                employerData?.category_name === "Corporate Legal"
                                                    ? corporateLegal
                                                    : employerData?.category_name === "Buisness Digital"
                                                        ? business
                                                        : employerData?.category_name === "Licences"
                                                            ? licence
                                                            : employerData?.category_name === "Certifications"
                                                                ? certificate
                                                                : employerData?.category_name === "Finance"
                                                                    ? finances
                                                                    : employerData?.category_name === "Foundation Setup"
                                                                        ? foundationSetup
                                                                        : foundationSetup
                                            }
                                            alt={employerData?.category_name || "Category Image"}
                                        />
                                    </div>

                                    <div>
                                        <h1 className="twm-job-title">{employerData.name || "Loading..."}</h1>
                                        <p className="twm-employer-address">
                                            {employerData.title || "No title available"}
                                        </p>
                                    </div>
                                </div>


                                <div className="twm-social-btns" style={{ marginTop: "60px" }}>
                                    <a className="btn instagram" target="_blank" href="https://www.instagram.com/unicx.in/">
                                        <i className="fab fa-instagram" style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", WebkitBackgroundClip: "text" }} />
                                    </a>
                                    <a className="btn twitter" target="_blank" href="https://x.com/UniConsultX">
                                        <i className="fab fa-twitter" style={{ background: "linear-gradient(45deg, #1da1f2 0%, #1da1f2 100%)", WebkitBackgroundClip: "text" }} />
                                    </a>
                                    <a className="btn google" target="_blank" href="https://g.page/r/CQ9HZC1YG1jaEAE/review">
                                        <i className="fab fa-google" style={{ background: "linear-gradient(45deg, #4285f4 0%, #4285f4 100%)", WebkitBackgroundClip: "text" }} />
                                    </a>
                                    <a className="btn linkedin" target="_blank" href="https://in.linkedin.com/company/uniconsultx">
                                        <i className="fab fa-linkedin-in" style={{ background: "linear-gradient(45deg, #0077b5 0%, #0077b5 100%)", WebkitBackgroundClip: "text" }} />
                                    </a>
                                    <a className="btn whatsapp" href="https://web.whatsapp.com/send?phone=919009980049&text=Hi%20UniCX%2C%0A%0AI%20visited%20your%20website%20and%20would%20like%20to%20consult%20with%20you.%20Please%20let%20me%20know%20a%20suitable%20time%20for%20a%20detailed%20discussion.%0A%0AThank%20you.&app_absent=1"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <i className="fab fa-whatsapp" style={{ fontWeight: "bold" }} />
                                    </a>
                                    <a className="btn youtube" target="_blank" href="http://www.youtube.com/@uniconsultx">
                                        <i className="fab fa-youtube" style={{ fontWeight: "bold" }} />
                                    </a>
                                </div>
                                <div className="twm-employer-btn-controls">
                                    <a href="#" className="site-button secondry">Follow Us</a>
                                </div>


                            </div>

                            <div className="twm-employer-self-bottom">


                                <div className="container-fluid-new">
                                    <div className="d-flex align-items-center gap-3 bg-white p-3 rounded shadow-sm" style={{ minWidth: "320px", width: "320px" }}>
                                        <JobZImage src='images/sub-sub-category/google-icon.svg' alt="Google Logo" style={{ width: "40px", height: "40px" }} />
                                        <div>
                                            <div style={{ fontWeight: "bold" }}>Google Reviews</div>
                                            <div style={{ color: "#B38F00" }}>⭐ ⭐ ⭐ ⭐ ⭐ 5/5</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="twm-employer-btn-controls " style={{ marginTop: "40px", display: "flex", alignItems: "center", gap: "10px", minWidth: '400px' }}>
                                    <a target="_blank" href="https://g.page/r/CQ9HZC1YG1jaEAE/review" className="site-button outline-whiten">Add Review</a>
                                    {/* 🔽 Updated Contact Us button */}
                                    <a href="#contact-section" onClick={handleScrollToContact} className="site-button secondry liquid-glass-btn">
                                        Contact Us
                                    </a>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div className="ani-circle-1 rotate-center" />
                    <div className="ani-circle-2 rotate-center" />
                </div>

                <div className="container">
                    <div className="section-content">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8 col-md-12">
                                <div className="cabdidate-de-info">
                                    <h4 className="twm-s-title m-t0">About Services</h4>
                                    {loading ? <p>Loading...</p> : <p>{employerData.description}</p>}

                                    <h4 className="twm-s-title m-t30">Additional Info</h4>
                                    <ul className="description-list-2">
                                        <li><i className="feather-check" /> Category: {employerData.category_name || "N/A"}</li>
                                        <li><i className="feather-check" /> Subcategory: {employerData.subcategory_name || "N/A"}</li>
                                        <li><i className="feather-check" /> Created At: {employerData.created_at || "N/A"}</li>
                                        <li><i className="feather-check" /> Meta Description: {employerData.meta_description || "N/A"}</li>
                                        <li><i className="feather-check" /> Meta Keywords: {employerData.meta_keywords || "N/A"}</li>
                                        <li><i className="feather-check" /> Template Key: {employerData.templateKey || "N/A"}</li>
                                        <li><i className="feather-check" /> Title: {employerData.title || "N/A"}</li>
                                        <li><i className="feather-check" /> Sections: {employerData.sections.length > 0 ? employerData.sections.join(", ") : "No sections"}</li>
                                    </ul>

                                    {/* <h4 className="twm-s-title">Responsibilities</h4>
                                    <ul className="description-list-2">
                                        <li><i className="feather-check" /> Establish and promote design guidelines, best practices, and standards.</li>
                                        <li><i className="feather-check" /> Accurately estimate design tickets during planning sessions.</li>
                                        <li><i className="feather-check" /> Partnering with product and engineering to translate business and user goals.</li>
                                    </ul>

                                    <div className="twm-two-part-section">
                                        <div className="row">
                                            <div className="col-lg-12 col-md-12 m-b30">
                                                <SectionOfficeVideo1 />
                                            </div>
                                            <div className="col-lg-12 col-md-12">
                                                <SectionOfficePhotos3 />
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="twm-s-title">Available Jobs</h4>
                                    <div className="twm-jobs-list-wrap">
                                        <div className="row">
                                            {loading ? (
                                                <p>Loading jobs...</p>
                                            ) : employerData.jobs.length > 0 ? (
                                                employerData.jobs.map((job, index) => (
                                                    <div className="col-lg-6 col-md-12 m-b30" key={index}>
                                                        <div className="twm-jobs-grid-style1">
                                                            <div className="twm-media">
                                                                <JobZImage src={job.image || "images/jobs-company/pic1.jpg"} alt="#" />
                                                            </div>
                                                            <span className="twm-job-post-duration">{job.postedDate || "N/A"}</span>
                                                            <div className="twm-jobs-category green">
                                                                <span className={`twm-bg-${job.categoryColor || "green"}`}>{job.category || "N/A"}</span>
                                                            </div>
                                                            <div className="twm-mid-content">
                                                                <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
                                                                    <h4>{job.title || "Untitled Job"}</h4>
                                                                </NavLink>
                                                                <p className="twm-job-address">{job.address || "No address available"}</p>
                                                                <a href={job.website || "#"} className="twm-job-websites site-text-primary">{job.website || "No website available"}</a>
                                                            </div>
                                                            <div className="twm-right-content">
                                                                <div className="twm-jobs-amount">{job.salary || "N/A"} <span>/ {job.salaryType || "Month"}</span></div>
                                                                <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No jobs available.</p>
                                            )}
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-12 rightSidebar">
                                <div className="side-bar-2">
                                    <SectionBlogsSidebar />
                                    {/* 🔽 Add ref here and highlight class */}
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
            </div >

            {/* 🔽 CSS for highlight effect */}
            < style > {`
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
                `}</style >
            <Footer1 />
        </div>
    );
}

export default EmployersDetail2Page;
