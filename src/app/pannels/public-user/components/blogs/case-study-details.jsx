import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { loadScript } from "../../../../../globals/constants";
import JobZImage from "../../../../common/jobz-img";
import ApplyJobPopup from "../../../../common/popups/popup-apply-job";
import SectionJobLocation from "../../sections/jobs/detail/section-job-location";
import SectionOfficePhotos1 from "../../sections/common/section-office-photos1";
import SectionOfficeVideo1 from "../../sections/common/section-office-video1";
import SectionShareProfile from "../../sections/common/section-share-profile";
import SectionJobsSidebar2 from "../../sections/jobs/sidebar/section-jobs-sidebar2";
// import { getCaseStudies } from "../../../../../api";
import InnerPageBanner from "../../../../common/inner-page-banner";
import { getCaseStudyById, getCaseStudyDetails } from "../../../../../adminApi";
import SidebarCaseStudy from "../../sections/blogs/sidebar/section-case-study";
import SectionContact from "../../sections/common/section-contact";

function CaseStudyDetails() {
  const { id } = useParams(); // ✅ Get the case study id
  const [caseStudy, setCaseStudy] = useState(null);
  const [caseStudyDetails, setCaseStudyDetails] = useState({
    client_name: "",
    projecturl: "",
    projectduration: "",
    sections: [],
  });
  const contactRef = useRef(null);
  const [highlight, setHighlight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sidebarConfig = {
    showJobInfo: true,
  };

  const parseJsonSafe = (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  };

  const normalizeSectionImages = (section) => {
    const rawImages =
      section?.image ?? section?.images ?? section?.gallery ?? [];
    if (Array.isArray(rawImages)) return rawImages.filter(Boolean);
    if (typeof rawImages === "string") {
      const parsed = parseJsonSafe(rawImages, null);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      return rawImages ? [rawImages] : [];
    }
    return rawImages ? [rawImages] : [];
  };

  const normalizeSections = (sectionsValue) => {
    let sectionsData = sectionsValue;

    if (typeof sectionsData === "string") {
      sectionsData = parseJsonSafe(sectionsData, sectionsData);
    }

    if (!Array.isArray(sectionsData)) {
      sectionsData =
        sectionsData && typeof sectionsData === "object" ? [sectionsData] : [];
    }

    return sectionsData.map((item, index) => {
      const sectionItem =
        typeof item === "string"
          ? parseJsonSafe(item, { description: item })
          : item;

      return {
        title:
          sectionItem?.title ||
          sectionItem?.ttile ||
          sectionItem?.name ||
          `Section ${index + 1}`,
        description:
          sectionItem?.description ||
          sectionItem?.content ||
          sectionItem?.body ||
          "",
        image: normalizeSectionImages(sectionItem),
      };
    });
  };

  useEffect(() => {
    loadScript("js/custom.js");

    const fetchCaseStudy = async () => {
      try {
        const data = await getCaseStudyById(id);
        const caseStudyData = data?.caseStudy || {};
        // console.log(caseStudyData, "casestudydetails gffffffff");
        setCaseStudy({
          title: caseStudyData?.title || "",
          description: caseStudyData?.additional_details || "",
          additional_details: caseStudyData?.additional_details || "",
          createdAt: caseStudyData?.createdAt || null,
          company_logo: caseStudyData?.company_logo || "",
          images: Array.isArray(caseStudyData?.images)
            ? caseStudyData.images
            : [],
        });

        const res = await getCaseStudyDetails(id);
        const details = Array.isArray(res?.caseStudyDetails)
          ? res.caseStudyDetails[0]
          : null;
        setCaseStudyDetails({
          client_name: details?.client_name || "",
          projecturl: details?.project_url || "",
          projectduration: details?.project_duration || "",
          sections: details?.content ?? [],
        });
      } catch (err) {
        console.error("Error fetching case study:", err);
        setError("Failed to load case study.");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [id]);

  useEffect(() => {
    const rawSections = caseStudyDetails?.sections;
  }, [caseStudyDetails?.sections]);

  const sectionsDataType = Array.isArray(caseStudyDetails?.sections)
    ? "array"
    : typeof caseStudyDetails?.sections;
  const normalizedSections = normalizeSections(caseStudyDetails?.sections);

  if (loading) {
    return (
      <>
        <style>{`
          .service-skeleton-wrap {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .service-skeleton {
            position: relative;
            overflow: hidden;
            background: linear-gradient(180deg, #f3f6fa 0%, #eaf2ff 100%);
            border: 1px solid #e3eaf5;
            border-radius: 12px;
          }

          .service-skeleton::after {
            content: "";
            position: absolute;
            top: 0;
            left: -120%;
            width: 90%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
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
        `}</style>
        <InnerPageBanner
          _data={{ title: "Loading Case Study...", crumb: "Case study" }}
          bgImagePath="images/contact-us/Header.webp"
        />
        <div className="section-full p-t120 p-b90 bg-white">
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-8 col-md-12">
                <div className="service-skeleton-wrap">
                  <div className="service-skeleton service-skeleton-title" />
                  <div className="service-skeleton service-skeleton-banner" />
                  <div className="service-skeleton service-skeleton-text" />
                  <div className="service-skeleton service-skeleton-text short" />
                  <div className="service-skeleton service-skeleton-card" />
                  <div className="service-skeleton service-skeleton-card" />
                </div>
              </div>
              <div className="col-lg-4 col-md-12 rightSidebar">
                <div className="service-skeleton-wrap">
                  <div className="service-skeleton service-skeleton-card" />
                  <div className="service-skeleton service-skeleton-card" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="section-full p-t120 p-b90 bg-white text-center">
        {error}
      </div>
    );
  }

  return (
    <>
      {
        <InnerPageBanner
          _data={{ title: caseStudy.title, crumb: "Case study" }}
          bgImagePath="images/contact-us/Header.webp"
        />
      }
      <div className="section-full  p-t120 p-b90 bg-white">
        <div className="container">
          <div className="section-content">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-8 col-md-12">
                <div className="cabdidate-de-info">
                  <div className="twm-job-self-wrap">
                    <div className="twm-job-self-info">
                      <div className="twm-job-self-top">
                        <div className="twm-media-bg">
                          <JobZImage
                            src={caseStudy?.images?.[0]}
                            alt={caseStudy?.title}
                          />
                          <div className="twm-jobs-category green">
                            <span className="twm-bg-green">New</span>
                          </div>
                        </div>
                        <div className="twm-mid-content">
                          <div className="twm-media">
                            <JobZImage
                              src={
                                caseStudy?.company_logo ||
                                "images/jobs-company/pic1.jpg"
                              }
                              alt={caseStudy?.title}
                            />
                          </div>
                          <h4 className="twm-job-title">
                            {caseStudy?.title}{" "}
                            <span className="twm-job-post-duration">
                              /{" "}
                              {caseStudy?.createdAt
                                ? new Date(
                                    caseStudy.createdAt,
                                  ).toLocaleDateString()
                                : "-"}
                            </span>
                          </h4>
                          <p className="twm-job-address">
                            <i className="feather-user" />
                            {caseStudyDetails?.client_name ||
                              "Client not provided"}
                          </p>
                          <div className="twm-job-self-mid">
                            <div className="twm-job-self-mid-left">
                              <a
                                href={caseStudyDetails?.projecturl || "#"}
                                className="twm-job-websites site-text-primary"
                              >
                                {caseStudyDetails?.projecturl || "Project URL"}
                              </a>
                              <div className="twm-jobs-amount">
                                {caseStudyDetails?.projectduration ||
                                  "Duration not provided"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="twm-s-title">Description:</h4>
                  {caseStudy?.additional_details ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: caseStudy.additional_details,
                      }}
                    />
                  ) : (
                    <p>No description available.</p>
                  )}

                  <div>
                    {normalizedSections.length ? (
                      normalizedSections.map((section, i) => {
                        const sectionImages = section?.image || [];

                        return (
                          <div
                            key={i}
                            className="m-b30 p-b20"
                            style={{ borderBottom: "1px solid #eee" }}
                          >
                            <h5 className="m-b10">Section {i + 1}</h5>

                            <p className="m-b5">
                              <strong>Title:</strong>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: section?.title || "-",
                                }}
                              />
                            </p>

                            <div className="m-b10">
                              <strong>Description:</strong>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: section?.description || "-",
                                }}
                              />
                            </div>

                            <div>
                              {/* <strong>Image:</strong> */}
                              {sectionImages.length > 0 ? (
                                <div className="row m-t10">
                                  {sectionImages.map((img, imgIndex) => (
                                    <div
                                      key={`${img}-${imgIndex}`}
                                      className="col-md-4 col-sm-6 m-b15"
                                    >
                                      <JobZImage
                                        src={img}
                                        alt={`${section?.title || `Section ${i + 1}`} ${imgIndex + 1}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                // <p className="m-t10">No image available.</p>
                                <></>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No sections available.</p>
                    )}
                  </div>

                  <SectionShareProfile />
                  {/* <SectionJobLocation /> */}
                </div>
              </div>
              <div className="col-lg-4 col-md-12 rightSidebar">
                <SidebarCaseStudy />

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
                    background: linear-gradient(180deg, #f3f6fa 0%, #eaf2ff 100%);
                    border: 1px solid #e3eaf5;
                    border-radius: 12px;
                }

                .service-skeleton::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 90%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
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

export default CaseStudyDetails;
