import JobZImage from "../../../../common/jobz-img";
import Footer1 from "../../../../common/footer/footer1";
import { loadScript, publicUrlFor } from "../../../../../globals/constants";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import DropzoneComponent from "react-dropzone-component";
import React, { useEffect, useState } from "react";
import { getServicesById } from "../../../../../api";
import { useParams } from "react-router-dom";
import SectionDisplay from "./SectionDisplay";

function TestPage1() {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        category_id: "",
        subcategory_id: "",
        meta_description: "",
        meta_keywords: "",
        description: "",
        sections: [],
    });
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [message, setMessage] = useState("");
    const { id } = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const componentConfig = {
        iconFiletypes: [".jpg", ".png", ".pdf", ".webp"],
        showFiletypeIcon: true,
        postUrl: "/uploadHandler", // or dummy URL for now
    };

    const sidebarConfig = {
        showJobInfo: false,
    };

    // Fetch data for formData
    const fetchServicesDetails = async () => {
        try {
            setLoading(true);
            const data = await getServicesById(id);

            // Process sections data
            let sectionsData = [];
            if (data.sections) {
                if (typeof data.sections === "string") {
                    try {
                        sectionsData = JSON.parse(data.sections);
                    } catch (e) {
                        console.error("Error parsing sections:", e);
                        sectionsData = [];
                    }
                } else if (Array.isArray(data.sections)) {
                    sectionsData = data.sections;
                }
            }

            // Update formData with fetched data
            setFormData({
                name: data.name || "",
                title: data.title || "",
                category_id: data.category_id || "",
                subcategory_id: data.subcategory_id || "",
                meta_description: data.meta_description || "",
                meta_keywords: data.meta_keywords || "",
                description: data.description || "",
                sections: sectionsData,
            });

            setDataLoaded(true);
        } catch (error) {
            setMessage("Failed to fetch sub-sub-category details.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchServicesDetails();
        }
    }, [id]);

    useEffect(() => {
    }, []); // Empty dependency array to run once on mount

    return (
        <>
            {/* Job Detail V.2 START */}
            <div className="section-full p-b90 bg-white">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <h1 className="heading-name-box">{formData.name || "Job Details"}</h1>
                )}

                <div className="container">
                    {/* BLOG SECTION START */}
                    <p>page 1 </p>
                    <div className="section-content">
                        <div className="twm-job-self-wrap twm-job-detail-v2">
                            <div className="twm-job-self-info">
                                <div className="twm-job-self-top">
                                    <div className="twm-media-bg">
                                        <JobZImage src="images/about/1.webp" alt="#" />
                                        <div className="twm-jobs-category green">
                                            <span className="twm-bg-green">New</span>
                                        </div>
                                        <div className="twm-job-self-bottom">
                                            <a
                                                className="site-button"
                                                data-bs-toggle="modal"
                                                href="#apply_job_popup"
                                                role="button"
                                            >
                                                Apply Now
                                            </a>
                                        </div>
                                    </div>
                                    <div className="twm-mid-content">
                                        <div className="twm-media">
                                            <JobZImage src="images/about/service.webp" alt="#" />
                                        </div>
                                        <h4 className="twm-job-title">
                                            Senior Web Designer, Developer{" "}
                                            <span className="twm-job-post-duration">/ 1 days ago</span>
                                        </h4>
                                        <p className="twm-job-address">
                                            <i className="feather-map-pin" />
                                            1363-1385 Sunset Blvd Los Angeles, CA 90026, USA
                                        </p>
                                        <div className="twm-job-self-mid">
                                            <div className="twm-job-self-mid-left">
                                                <a
                                                    href="https://themeforest.net/user/thewebmax/portfolio"
                                                    className="twm-job-websites site-text-primary"
                                                >
                                                    https://thewebmax.com
                                                </a>
                                                <div className="twm-jobs-amount">
                                                    $2000 - $2500 <span>/ Month</span>
                                                </div>
                                            </div>
                                            <div className="twm-job-apllication-area">
                                                Application ends:
                                                <span className="twm-job-apllication-date">October 1, 2025</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="twm-job-detail-2-wrap">
                            <div className="row d-flex justify-content-center">
                                <div className="col-lg-4 col-md-12 rightSidebar">
                                    <div className="side-bar mb-4">
                                        <div className="twm-s-info2-wrap mb-5">
                                            <div className="twm-s-info2">
                                                <h4 className="section-head-small mb-4">Job Information</h4>
                                                <ul className="twm-job-hilites">
                                                    <li>
                                                        <i className="fas fa-calendar-alt" />
                                                        <span className="twm-title">Date Posted</span>
                                                    </li>
                                                    <li>
                                                        <i className="fas fa-eye" />
                                                        <span className="twm-title">8160 Views</span>
                                                    </li>
                                                    <li>
                                                        <i className="fas fa-file-signature" />
                                                        <span className="twm-title">6 Applicants</span>
                                                    </li>
                                                </ul>
                                                <ul className="twm-job-hilites2">
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-calendar-alt" />
                                                            <span className="twm-title">Date Posted</span>
                                                            <div className="twm-s-info-discription">April 22, 2023</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-map-marker-alt" />
                                                            <span className="twm-title">Location</span>
                                                            <div className="twm-s-info-discription">Munchen, Germany</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-user-tie" />
                                                            <span className="twm-title">Job Title</span>
                                                            <div className="twm-s-info-discription">Web Developer</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-clock" />
                                                            <span className="twm-title">Experience</span>
                                                            <div className="twm-s-info-discription">3 Year</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-suitcase" />
                                                            <span className="twm-title">Qualification</span>
                                                            <div className="twm-s-info-discription">Bachelor Degree</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-venus-mars" />
                                                            <span className="twm-title">Gender</span>
                                                            <div className="twm-s-info-discription">Both</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-money-bill-wave" />
                                                            <span className="twm-title">Offered Salary</span>
                                                            <div className="twm-s-info-discription">$2000-$2500 / Month</div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="widget tw-sidebar-tags-wrap">
                                            <h4 className="section-head-small mb-4">Job Skills</h4>
                                            <div className="tagcloud">
                                                <a href="#">Html</a>
                                                <a href="#">Python</a>
                                                <a href="#">WordPress</a>
                                                <a href="#">JavaScript</a>
                                                <a href="#">Figma</a>
                                                <a href="#">Angular</a>
                                                <a href="#">Reactjs</a>
                                                <a href="#">Drupal</a>
                                                <a href="#">Joomla</a>
                                            </div>
                                        </div>
                                    </div>

                                    {sidebarConfig.showJobInfo && (
                                        <div className="twm-s-info3-wrap mb-5">
                                            <div className="twm-s-info3">
                                                <div className="twm-s-info-logo-section">
                                                    <div className="twm-media">
                                                        <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                                    </div>
                                                    <h4 className="twm-title">Senior Web Designer, Developer</h4>
                                                </div>
                                                <ul>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-building" />
                                                            <span className="twm-title">Company</span>
                                                            <div className="twm-s-info-discription">Software Development</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-mobile-alt" />
                                                            <span className="twm-title">Phone</span>
                                                            <div className="twm-s-info-discription">+291 560 56456</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-at" />
                                                            <span className="twm-title">Email</span>
                                                            <div className="twm-s-info-discription">thewebmaxdemo@gmail.com</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-desktop" />
                                                            <span className="twm-title">Website</span>
                                                            <div className="twm-s-info-discription">https://themeforest.net</div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="twm-s-info-inner">
                                                            <i className="fas fa-map-marker-alt" />
                                                            <span className="twm-title">Address</span>
                                                            <div className="twm-s-info-discription">
                                                                1363-1385 Sunset Blvd Angeles, CA 90026, USA
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <NavLink to={publicUser.pages.ABOUT} className="site-button">
                                                    View Profile
                                                </NavLink>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className="twm-advertisment"
                                        style={{ backgroundImage: `url(${publicUrlFor("images/add-bg.jpg")})` }}
                                    >
                                        <div className="overlay" />
                                        <h4 className="twm-title">Recruiting?</h4>
                                        <p>
                                            Get Best Matched Jobs On your <br />
                                            Email. Add Resume NOW!
                                        </p>
                                        <NavLink to={publicUser.pages.ABOUT} className="site-button white">
                                            Read More
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="col-lg-8 col-md-12">
                                    {/* Candidate detail START */}
                                    <div className="cabdidate-de-info">


                                        <h4 className="twm-s-title m-t0">Company Description:</h4>
                                        <p>{formData.description || "No description available."}</p>


                                        <h4>Job Overview</h4>
                                        <p>{formData.meta_description || "No description available."}</p>



                                        <h4 className="twm-s-title">Requirements:</h4>
                                        <p>{formData.meta_keywords || "No description available."}</p>



                                        <h4 className="twm-s-title">Responsibilities:</h4>
                                        <ul className="description-list-2">
                                            <li>
                                                <i className="feather-check" />
                                                Establish and promote design guidelines, best practices and
                                                standards.
                                            </li>
                                            <li>
                                                <i className="feather-check" />
                                                Accurately estimate design tickets during planning sessions.
                                            </li>
                                            <li>
                                                <i className="feather-check" />
                                                Partnering with product and engineering to translate business and
                                                user goals into elegant and practical designs that can deliver on key
                                                business and user metrics.
                                            </li>
                                            <li>
                                                <i className="feather-check" />
                                                Create wireframes, storyboards, user flows, process flows and site
                                                maps to communicate interaction and design.
                                            </li>
                                            <li>
                                                <i className="feather-check" />
                                                Present and defend designs and key deliverables to peers and
                                                executive level stakeholders.
                                            </li>
                                            <li>
                                                <i className="feather-check" />
                                                Execute all visual design stages from concept to final hand-off to
                                                engineering.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Job Detail V.2 END */}

            {/* Modal for Apply Job */}
            <div className="modal fade" id="apply_job_popup" aria-hidden="true" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="sign_up_popupLabel">
                                Apply For This Job
                            </h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <div className="apl-job-inpopup">
                                <div className="panel panel-default">
                                    <div className="panel-body wt-panel-body p-a20">
                                        <div className="twm-tabs-style-1">
                                            <div className="row">
                                                <div className="col-xl-12 col-lg-12 col-md-12">
                                                    <div className="form-group">
                                                        <label>Your Name</label>
                                                        <div className="ls-inputicon-box">
                                                            <input
                                                                className="form-control"
                                                                name="company_name"
                                                                type="text"
                                                                placeholder="Devid Smith"
                                                            />
                                                            <i className="fs-input-icon fa fa-user" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-12 col-lg-12 col-md-12">
                                                    <div className="form-group">
                                                        <label>Email Address</label>
                                                        <div className="ls-inputicon-box">
                                                            <input
                                                                className="form-control"
                                                                name="company_Email"
                                                                type="email"
                                                                placeholder="Devid@example.com"
                                                            />
                                                            <i className="fs-input-icon fas fa-at" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label>Message</label>
                                                        <textarea
                                                            className="form-control"
                                                            rows={3}
                                                            placeholder="Message sent to the employer"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12">
                                                    <div className="form-group">
                                                        <label>Upload Resume</label>
                                                        <DropzoneComponent config={componentConfig} />
                                                        <small>
                                                            If you do not have a resume document, you may write your brief
                                                            professional profile
                                                            <NavLink
                                                                to={publicUser.pages.CONTACT}
                                                                className="site-text-primary"
                                                            >
                                                                here
                                                            </NavLink>
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="col-xl-12 col-lg-12 col-md-12">
                                                    <div className="text-left">
                                                        <button type="submit" className="site-button">
                                                            Send Application
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SectionDisplay sections={formData.sections} />

            <Footer1 />
        </>
    );
}

export default TestPage1;

