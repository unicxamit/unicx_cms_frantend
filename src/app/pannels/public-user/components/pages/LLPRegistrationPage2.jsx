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
import Skeleton from "../../../../common/skeleton/Skeleton";
import { NavLink, useParams } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
// import { getServicesById } from "../../../../../api";
import Footer1 from "../../../../common/footer/footer1";
import SectionBlogsSidebar from "../../sections/blogs/sidebar/section-blogs-sidebar";
import { getServiceDetailsByserviceId, getServicesById } from "../../../../../adminApi";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";

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
        bannerImage: "",
        sections: [],
        faqsections: [],
        images: [],
        current_service_id: "",
        jobs: [],
        socialLinks: {
            facebook: "",
            twitter: "",
            google: "",
            linkedin: "",
            skype: "",
        },
    });
// console.log(employerData.subcategory_name,"subcategoryid")
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const { id } = useParams();

    const type = 2;

    const parseArrayField = (value) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        }
        return [];
    };

    const parseImageField = (value) => {
        if (Array.isArray(value)) return value.filter(Boolean);
        if (typeof value === "string") {
            const trimmed = value.trim();
            if (!trimmed) return [];
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed.filter(Boolean);
                if (typeof parsed === "string" && parsed.trim()) return [parsed.trim()];
                return [];
            } catch (error) {
                return [trimmed];
            }
        }
        return [];
    };

    const parseDocumentField = (value) => {
        if (Array.isArray(value)) return value.filter(Boolean);
        if (typeof value === "string") {
            const trimmed = value.trim();
            if (!trimmed) return [];
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed.filter(Boolean);
                if (typeof parsed === "string" && parsed.trim()) return [parsed.trim()];
                return [];
            } catch (error) {
                return [trimmed];
            }
        }
        return [];
    };

    const FullPageSkeleton = () => (
        <div className="llp-fullpage-skeleton">
            <div className="container-fluid py-2" style={{ margin: '0 50px', padding: '0' }}>
                <Skeleton height="16px" width="360px" />
            </div>

            <div className="container mt-3">
                <Skeleton height="280px" width="100%" className="mb-4" />

                <div className="row d-flex justify-content-center">
                    <div className="col-lg-8 col-md-12">
                        <Skeleton height="30px" width="180px" className="mb-3" />
                        <Skeleton height="220px" width="100%" className="mb-3" />
                        <Skeleton height="14px" width="100%" className="mb-2" />
                        <Skeleton height="14px" width="96%" className="mb-2" />
                        <Skeleton height="14px" width="88%" className="mb-4" />
                        <Skeleton height="130px" width="100%" className="mb-3" />
                        <Skeleton height="130px" width="100%" className="mb-3" />
                    </div>

                    <div className="col-lg-4 col-md-12 rightSidebar">
                        <Skeleton height="210px" width="100%" className="mb-3" />
                        <Skeleton height="260px" width="100%" />
                    </div>
                </div>
            </div>
        </div>
    );

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

   

    const fetchEmployerDetails = async () => {
        try {
            setLoading(true);

            const res = await getServiceDetailsByserviceId(id);
            // console.log(res);

            // API returns service as array
            const serviceData = res?.service?.[0];

            if (!serviceData) {
                setMessage("Service not found");
                return;
            }

            const sectionsData = parseArrayField(serviceData.sections);
            const faqData = parseArrayField(serviceData.faq_sections || serviceData.faqsections);
            const currentServiceId =
                (Array.isArray(serviceData.service) && serviceData.service[0] && (
                    typeof serviceData.service[0] === "object"
                        ? serviceData.service[0]._id
                        : serviceData.service[0]
                )) || id;

            let resolvedSubcategoryId =
                (serviceData.subcategory && typeof serviceData.subcategory === "object"
                    ? serviceData.subcategory._id || ""
                    : "");

            if (!resolvedSubcategoryId && currentServiceId) {
                try {
                    const serviceRes = await getServicesById(currentServiceId);
                    const serviceSubcategory = serviceRes?.data?.subcategory;
                    resolvedSubcategoryId =
                        (serviceSubcategory && typeof serviceSubcategory === "object"
                            ? serviceSubcategory._id || ""
                            : serviceSubcategory || "");
                } catch (subErr) {
                    console.error("Error resolving subcategory ID:", subErr);
                }
            }

            setEmployerData({
                id: serviceData._id || "",
                name: serviceData.name || "",
                title: serviceData.title || "",
                description: serviceData.description || "No description available",

                meta_description: serviceData.metaDescription || "",
                meta_keywords: serviceData.metaKeyword || "",

                created_at: serviceData.createdAt || "",
                bannerImage: serviceData.bannerImage || "",

                sections: sectionsData,
                faqsections: faqData,
                images: parseArrayField(serviceData.images),
                current_service_id: currentServiceId,

                // related services (you named it `service` in API)
                relatedServices: serviceData.service || [],

                // category & subcategory (if API sends later)
                category_id: serviceData.category?._id || "",
                category_name: serviceData.category || "",

                subcategory_id: resolvedSubcategoryId,
                subcategory_name:
                    (serviceData.subcategory && typeof serviceData.subcategory === "object"
                        ? serviceData.subcategory.name || ""
                        : serviceData.subcategory || ""),
            });
            // console.log(resolvedSubcategoryId,"subcategorydi")
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch service details.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (id) fetchEmployerDetails();
    }, [id]);

    useEffect(() => {
        loadScript("js/custom.js");
    }, []);

    return (
        <div>
            <div className="section-full p-t0 p-b90 bg-white">
                {loading ? (
                    <FullPageSkeleton />
                ) : (
                <>
                <div className="container-fluid py-2" style={{ margin: '0 50px', padding: '0' }}>
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
                            <span>{employerData.name}</span>
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
                                        <h1 className="twm-job-title">{employerData.name }</h1>
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
                                    <a href="#contact-section" onClick={handleScrollToContact} className="site-button secondry">
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
                                        <div className="service-details-flow">
                                            {employerData.bannerImage && (
                                                <div className="service-banner-block">
                                                    <JobZImage
                                                        src={employerData.bannerImage}
                                                        alt={`${employerData.name || "Service"} banner`}
                                                        className="img-fluid service-banner-img"
                                                    />
                                                </div>
                                            )}

                                            <div
                                                className="service-main-description"
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeHtml(employerData.description || "No description available."),
                                                }}
                                            />

                                            {employerData.sections.length > 0 && (
                                                <div className="service-sections-list">
                                                    {employerData.sections.map((section, index) => {
                                                        const sectionImages = [
                                                            ...parseImageField(section?.sectionImages),
                                                            ...parseImageField(section?.sectionImage),
                                                        ].filter(Boolean);
                                                        const sectionDocuments = [
                                                            ...parseDocumentField(section?.sectionDocuments),
                                                            ...parseDocumentField(section?.sectionDocument),
                                                            ...parseDocumentField(section?.documents),
                                                            ...parseDocumentField(section?.document),
                                                        ].filter(Boolean);

                                                        const hasSectionImages = sectionImages.length > 0;
                                                        const hasSectionDocuments = sectionDocuments.length > 0;
                                                        const hasSectionDescription = Boolean(
                                                            section?.sectionDescription &&
                                                            String(section.sectionDescription).trim() &&
                                                            String(section.sectionDescription).trim() !== "<p><br></p>"
                                                        );

                                                        return (
                                                            <div key={section._id || index} className="service-section-card">
                                                                <h5 className="service-section-title">
                                                                    {section.sectionTitle || `Section ${index + 1}`}
                                                                </h5>

                                                                {hasSectionDescription && (
                                                                    <div
                                                                        className="service-section-description"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: sanitizeHtml(section.sectionDescription || "No section description available."),
                                                                        }}
                                                                    />
                                                                )}

                                                                {hasSectionDocuments && (
                                                                    <div className="service-section-documents">
                                                                        {sectionDocuments.map((doc, docIndex) => (
                                                                            <a
                                                                                key={`${section._id || index}-doc-${docIndex}`}
                                                                                href={doc}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="service-section-document-link"
                                                                            >
                                                                                Section Document {docIndex + 1}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {hasSectionImages && (
                                                                    <div className="service-section-images">
                                                                        {sectionImages.map((img, imgIndex) => (
                                                                            <JobZImage
                                                                                key={`${section._id || index}-img-${imgIndex}`}
                                                                                src={img}
                                                                                alt={`${section.sectionTitle || "Section"} image ${imgIndex + 1}`}
                                                                                className="img-fluid service-section-image"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {employerData.faqsections.length > 0 && (
                                                <div className="service-faq-wrap">
                                                    <h4 className="twm-s-title m-t30">FAQ</h4>
                                                    <div className="tw-faq-section service-faq-home-style">
                                                        <div className="accordion tw-faq" id={`service-faq-accordion-${employerData.id || "default"}`}>
                                                            {employerData.faqsections.map((faq, faqIndex) => {
                                                                const faqId = faq?._id || `${employerData.id || "service"}-${faqIndex}`;
                                                                const collapseId = `collapse-${faqId}`;
                                                                const isFirst = faqIndex === 0;

                                                                return (
                                                                    <div key={faqId} className="accordion-item">
                                                                        <button
                                                                            className={`accordion-button ${!isFirst ? "collapsed" : ""}`}
                                                                            type="button"
                                                                            data-bs-toggle="collapse"
                                                                            data-bs-target={`#${collapseId}`}
                                                                            aria-expanded={isFirst ? "true" : "false"}
                                                                            aria-controls={collapseId}
                                                                        >
                                                                            {faq.faq_question || faq.question || `Question ${faqIndex + 1}`}
                                                                        </button>

                                                                        <div
                                                                            id={collapseId}
                                                                            className={`accordion-collapse collapse ${isFirst ? "show" : ""}`}
                                                                            data-bs-parent={`#service-faq-accordion-${employerData.id || "default"}`}
                                                                        >
                                                                            <div
                                                                                className="accordion-body"
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: sanitizeHtml(faq.faq_answer || faq.answer || "No answer available."),
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                   
                                </div>
                            </div>

                            <div className="col-lg-4 col-md-12 rightSidebar">
                                <div className="side-bar-2">
                                    <SectionBlogsSidebar
                                        subcategoryName={employerData?.subcategory_name}
                                        // currentServiceId={employerData?.current_service_id}
                                    />
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
                </>
                )}
            </div >

            {/* 🔽 CSS for highlight effect */}
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
            <Footer1 />
        </div>
    );
}

export default EmployersDetail2Page;
