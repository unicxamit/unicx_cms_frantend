import React, { useEffect, useState, useRef } from "react";
import { publicUrlFor } from "../../../../../globals/constants";
import CountUp from "react-countup";
import { publicUser } from "../../../../../globals/route-names";
import { NavLink } from "react-router-dom";
import GlobalSearchBar from "../pages/GlobalSearchBar";
// import SectionFaqGeneral from "../../sections/faq/section-faq-general";

import JobZImage from "../../../../common/jobz-img";
import ActionButton from "../../../../common/ui/action-button";
import CompanyCards from "./CompanyCards";
import Indemand from "./indemand";
import ExpertSection from "./ExpertSecion";
import UniCxStandardSection from "./UniCxStandardSection";
import "./custom.css";
import { FiPhoneCall } from "react-icons/fi";
// import { RiArrowDropDownLine } from "react-icons/ri";
import DynamicFaqTabs from "../pages/dynamicFAQ";
import { getHomeBootstrap, getSubSubCategories } from "../../../../../adminApi";
import Skeleton from "../../../../common/skeleton/Skeleton";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";
const SEARCH_TAG_CACHE_KEY = "home_search_tags_cache_v1";

const getSortedActiveSearchTags = (rawServices = []) => {
  const activeSearchTags = rawServices.filter(
    (s) => s.stagestatus === "active" && s.status === "active" && s.search_tag,
  );
  return [...activeSearchTags].sort((a, b) => {
    const aCount = Number(a?.search_count) || 0;
    const bCount = Number(b?.search_count) || 0;
    if (bCount !== aCount) return bCount - aCount;
    return (a?.search_tag || "").localeCompare(b?.search_tag || "");
  });
};

function Home1Page() {
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceTagsLoading, setServiceTagsLoading] = useState(true);
  const [serviceTagHints, setServiceTagHints] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  // console.log(caseStudies,"casestudyes")
  const [blogs, setBlogs] = useState([]); // New state to store fetched Blogs
  const [showSecondarySections, setShowSecondarySections] = useState(false);
  const words = [
    "Brand",
    "Company Name",
    "Website",
    "Certification",
    "Licence",
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const carouselRef = useRef(null);
  const testimonialSwiperRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const activeTestimonials =
    testimonials?.filter((test) => test.status === "active") || [];

  useEffect(() => {
    const currentCarousel = carouselRef.current;

    try {
      const cachedTagsRaw = localStorage.getItem(SEARCH_TAG_CACHE_KEY);
      const cachedTags = JSON.parse(cachedTagsRaw || "[]");
      if (Array.isArray(cachedTags) && cachedTags.length > 0) {
        setServiceTagHints(cachedTags.filter(Boolean).slice(0, 5));
      }
    } catch (error) {
      console.error("Unable to read cached search tags:", error);
    }

    // 1. Fetch first-viewport tags with high priority
    const fetchPrimarySearchTags = async () => {
      try {
        const tagResponse = await getSubSubCategories();
        const sortedBySearchCount = getSortedActiveSearchTags(
          tagResponse?.services || [],
        );
        setServices(sortedBySearchCount);
        const latestTagHints = sortedBySearchCount
          .slice(0, 5)
          .map((item) => item?.search_tag)
          .filter(Boolean);
        setServiceTagHints(latestTagHints);
        setServiceTagsLoading(false);
        try {
          localStorage.setItem(
            SEARCH_TAG_CACHE_KEY,
            JSON.stringify(latestTagHints),
          );
        } catch (cacheError) {
          console.error("Unable to cache search tags:", cacheError);
        }
      } catch (error) {
        console.error("Error fetching primary search tags:", error);
        setServiceTagsLoading(false);
      }
    };

    // 2. Fetch secondary content after first viewport data path starts
    const fetchSecondaryHomeData = async () => {
      try {
        const data = await getHomeBootstrap();
        const activeCaseStudies = (data?.caseStudies || []).filter(
          (cs) => cs.status === "active",
        );
        const activeBlogs = (data?.blogs || []).filter(
          (b) => b.status === "active",
        );
        const activeTestimonials = (data?.testimonials || []).filter(
          (t) => t.status === "active",
        );

        setCaseStudies(activeCaseStudies);
        setBlogs(activeBlogs);
        setTestimonials(activeTestimonials);

        const sortedBySearchCount = getSortedActiveSearchTags(
          data?.services || [],
        );
        if (sortedBySearchCount.length > 0) {
          setServices(sortedBySearchCount);
        }
      } catch (error) {
        console.error("Error fetching secondary home data:", error);
      } finally {
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => setShowSecondarySections(true), {
            timeout: 800,
          });
        } else {
          setTimeout(() => setShowSecondarySections(true), 120);
        }
      }
    };

    fetchPrimarySearchTags();
    fetchSecondaryHomeData();

    // Start word animation
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
   
    // 3. Mousemove animation
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      document.querySelectorAll(".anm").forEach((el) => {
        const speedX = parseFloat(el.dataset.speedX) || 0;
        const speedY = parseFloat(el.dataset.speedY) || 0;
        const speedScale = parseFloat(el.dataset.speedScale) || 0;

        const offsetX = ((clientX - centerX) / centerX) * speedX * 10;
        const offsetY = ((clientY - centerY) / centerY) * speedY * 10;
        const scale = 1 + speedScale / 1000;

        el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initialize Owl Carousel
    if (currentCarousel && window.jQuery) {
      window.jQuery(currentCarousel).owlCarousel({
        animateIn: "fadeIn",
        animateOut: "fadeOut",
        items: 1,
        loop: true,
        autoplay: true, // Enable autoplay
        autoplayTimeout: 3000, // Change image every 3 seconds
        dots: false, // Disable dots (pagination)
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(wordInterval); // Cleanup interval

      if (
        currentCarousel &&
        window.jQuery &&
        window.jQuery(currentCarousel).data("owl.carousel")
      ) {
        window.jQuery(currentCarousel).owlCarousel("destroy");
      }
    };
  }, [carouselRef, words.length, testimonialSwiperRef]);

  useEffect(() => {
    if (!showSecondarySections) return;
    const currentTestimonialSwiper = testimonialSwiperRef.current;
    if (!currentTestimonialSwiper || !window.Swiper) return;

    const swiperTestimonial = new window.Swiper(currentTestimonialSwiper, {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      watchOverflow: false,
      observer: true,
      observeParents: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      direction: "vertical",
      pagination: {
        el: ".testimonial-swiper-pagination",
        clickable: true,
        type: "bullets",
        dynamicBullets: true,
      },
      breakpoints: {
        0: {
          direction: "horizontal",
          slidesPerView: 1,
          pagination: {
            el: ".testimonial-swiper-pagination",
            clickable: true,
            type: "bullets",
            dynamicBullets: true,
            renderBullet: function (index, className) {
              return (
                '<span class="' +
                className +
                ' swiper-pagination-bullet-custom"></span>'
              );
            },
          },
        },
        767: {
          direction: "vertical",
        },
      },
    });

    return () => {
      if (swiperTestimonial && swiperTestimonial.destroy) {
        swiperTestimonial.destroy(true, true);
      }
    };
  }, [showSecondarySections, testimonials.length, screenWidth]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!Array.isArray(serviceTagHints) || serviceTagHints.length === 0) return;

    try {
      localStorage.setItem(
        SEARCH_TAG_CACHE_KEY,
        JSON.stringify(serviceTagHints.slice(0, 5)),
      );
    } catch (error) {
      console.error("Unable to cache search tags:", error);
    }
  }, [serviceTagHints]);
 const resolveShortDescriptionHtml = (caseStudy = {}) =>
      sanitizeHtml(
        caseStudy?.additional_details ||
          caseStudy?.additional_details ||
          caseStudy?.additional_details ||
          caseStudy?.short_description ||
        
          "",
      );

    const toPlainText = (html = "") =>
      String(html || "")
        .replace(/<(.|\n)*?>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

    const getCaseStudyExcerpt = (caseStudy = {}, limit = 150) => {
      const plain = toPlainText(resolveShortDescriptionHtml(caseStudy));
      if (!plain) return "";
      return plain.length > limit ? `${plain.slice(0, limit)}...` : plain;
    };
  return (
    <>
      {/*Banner Start*/}
      <div
        className="twm-home1-banner-section site-bg-gray"
        style={{
          backgroundColor: "#141414",
          backgroundImage:
            "radial-gradient(640px 260px at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 72%), radial-gradient(980px 520px at 95% 100%, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0) 74%), linear-gradient(180deg, #0c0d10 0%, #16181c 44%, #1f2f45 100%)",
        }}
      >
        <div className="row">
          {/*Left Section*/}
          <div className="col-xl-6 col-lg-6 col-md-12">
            <div className="twm-bnr-left-section">
              {/* <div className="twm-bnr-title-small">We Have <span className="site-text-primary">208,000+</span> Live Jobs</div> */}
              <div className="twm-bnr-title-sml">
                Unicx is having <span className="site-text-primary">1200+</span>{" "}
                services for you...
              </div>
              <div className="twm-bnr-title-large">
                It’s Easy to Choose & get <br /> a perfect{" "}
                <span
                  className="site-text-primary slide-up"
                  key={currentWordIndex}
                >
                  {words[currentWordIndex]}
                </span>{" "}
                <br /> for Your buisness
              </div>
              <div className="twm-bnr-discription">
                All-in-one Solution for every Business professional needs - From
                Start to success.
              </div>
              <div className="twm-bnr-search-bar">
                <GlobalSearchBar />
                {/* <button type="button" className="site-button">Search</button> */}
              </div>
              <div className="twm-bnr-category">
                <ul>
                  {serviceTagsLoading
                    ? (serviceTagHints.length > 0
                        ? serviceTagHints
                        : Array.from({ length: 5 }, () => "Loading")
                      ).map((label, index) => (
                        <li
                          key={`search-tag-skeleton-${index}`}
                          aria-hidden="true"
                        >
                          <span className="twm-bnr-category-item twm-bnr-category-item-skeleton">
                            <Skeleton
                              width={`${Math.max(7, Math.min(20, label.length))}ch`}
                              height="16px"
                            />
                          </span>
                        </li>
                      ))
                    : services.length > 0 &&
                      services.slice(0, 5).map((item, index) => (
                        <li key={item._id || index}>
                          <NavLink
                            to={`/subsubcategory/${item?._id}`}
                            className="twm-bnr-category-item"
                          >
                            {item?.search_tag}
                          </NavLink>
                        </li>
                      ))}
                  {/* <li>
                                        <NavLink to={publicUser.pages.TestPage2} className="twm-bnr-category-item">Trademark</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={publicUser.pages.TestPage2} className="twm-bnr-category-item">GST Registration</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={publicUser.pages.TestPage2} className="twm-bnr-category-item">ROC</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={publicUser.pages.TestPage2} className="twm-bnr-category-item">ISO Certificate</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to={publicUser.pages.TestPage2} className="twm-bnr-category-item">FSSAI</NavLink>
                                    </li> */}
                </ul>
              </div>
            </div>
          </div>

          {/*right Section*/}
          <div className="col-xl-6 col-lg-6 col-md-12 twm-bnr-right-section">
            <div className="twm-bnr-right-content">
              <div className="twm-img-bg-circle-area">
                <div className="twm-img-bg-circle1 rotate-center">
                  <span />
                </div>
                <div className="twm-img-bg-circle2 rotate-center-reverse">
                  <span />
                </div>
                <div className="twm-img-bg-circle3">
                  <span />
                </div>
              </div>

              <div className="twm-bnr-right-carousel">
                <div
                  className="owl-carousel twm-h1-bnr-carousal"
                  ref={carouselRef}
                >
                  <div className="item">
                    <div className="slide-img">
                      <JobZImage
                        src="images/homeImage/main1.webp"
                        alt="home-image"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <div className="slide-img">
                      <JobZImage
                        src="images/homeImage/main2.webp"
                        alt="home-image"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <div className="slide-img">
                      <JobZImage
                        src="images/homeImage/main3.webp"
                        alt="home-image"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <div className="slide-img">
                      <JobZImage
                        src="images/homeImage/main4.webp"
                        alt="home-image"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <div className="slide-img">
                      <JobZImage
                        src="images/homeImage/main5.webp"
                        alt="home-image"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <div className="slide-img">
                      <JobZImage
                        src="images/homeImage/main6.webp"
                        alt="home-image"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <div className="slide-img">
                      <JobZImage
                        src="images/homeImage/main7.webp"
                        alt="home-image"
                      />
                    </div>
                  </div>
                  <div className="item">
                    <div className="slide-img">
                      <JobZImage
                        src="images/homeImage/main8.webp"
                        alt="home-image"
                      />
                    </div>
                  </div>
                </div>
                <div className="twm-bnr-blocks-position-wrap">
                  {/* icon-block-1 */}
                  <div
                    className="twm-bnr-blocks twm-bnr-blocks-position-1 anm"
                    data-speed-x="1"
                    data-speed-y="1"
                    data-speed-scale="5"
                  >
                    <div className="twm-icon">
                      <i
                        className="fas fa-handshake twm-hero-stat-fa-icon"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="twm-content">
                      <div className="tw-count-number text-clr-sky">
                        <span className="counter">
                          <CountUp end={4} duration={10} />
                        </span>
                        K+
                      </div>
                      <p className="icon-content-info">Companies Faith</p>
                    </div>
                  </div>

                  {/* icon-block-2 */}
                  <div
                    className="twm-bnr-blocks twm-bnr-blocks-position-2 anm"
                    data-speed-x="-1.5"
                    data-speed-y="1.2"
                    data-speed-scale="-4"
                  >
                    <div className="twm-icon twm-icon-new">
                      <i
                        className="fas fa-user-friends twm-hero-stat-fa-icon"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="twm-content">
                      <div className="tw-count-number text-clr-pink">
                        <span className="counter">
                          <CountUp end={250} duration={10} />
                        </span>
                        <span className="counter-plus">+</span>
                      </div>
                      <p className="icon-content-info">Professionals</p>
                    </div>
                  </div>

                  {/* icon-block-3 */}
                  <div
                    className="twm-bnr-blocks-3 twm-bnr-blocks-position-3 anm"
                    data-speed-x="2"
                    data-speed-y="-1.5"
                    data-speed-scale="3"
                  >
                    <div className="twm-pics">
                      <span>
                        <i
                          className="fas fa-medal twm-hero-stat-fa-icon"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="twm-content">
                      <div className="tw-count-number text-clr-green">
                        <span className="counter">
                          <CountUp end={7} duration={10} />
                        </span>
                        K+
                      </div>
                      <p className="icon-content-info">Brands Served</p>
                    </div>
                  </div>
                </div>
              </div>

              {/*Samll Ring Left*/}
              <div className="twm-small-ring-l slide-top-animation" />
              <div className="twm-small-ring-2 slide-top-animation" />
            </div>
          </div>
        </div>
        <div className="twm-gradient-text">UNICX</div>
      </div>
      {/*Banner End*/}

      <div className="main-content-wrapper">
        {showSecondarySections ? <Indemand /> : null}

        {/* How It Work START */}
        <style>{`
                    .liquid-howit-bg{
                        background: #1967D2;
                        border: 1px solid rgba(255, 255, 255, 0.55);
                        border-radius: 28px;
                        box-shadow:
                            0 14px 28px rgba(25, 103, 210, 0.2),
                            inset 0 1px 0 rgba(255, 255, 255, 0.65);
                        backdrop-filter: blur(14px) saturate(140%);
                        -webkit-backdrop-filter: blur(14px) saturate(140%);
                        overflow: visible;
                        padding-top: 72px;
                        padding-bottom: 56px;
                    }
                    @media (max-width: 991px){
                        .liquid-howit-bg{
                            padding-top: 56px;
                            padding-bottom: 44px;
                        }
                    }
                    .liquid-howit-bg .section-head .wt-small-separator,
                    .liquid-howit-bg .section-head .wt-small-separator div{
                        color: #ffffff;
                    }
                    .liquid-howit-bg .section-head h2,
                    .liquid-howit-bg .section-head h2.wt-text-1{
                        color: #ffffff;
                        text-shadow: none;
                    }
                    .liquid-howit-bg .section-head h6,
                    .liquid-howit-bg .section-head h6.wt-text{
                        color: rgba(255,255,255,0.9);
                    }
                    .liquid-howit-bg .twm-step-section-4 ul li .twm-step-content .twm-title{
                        color: #ffffff;
                    }
                    .liquid-howit-bg .twm-step-section-4 ul li .twm-step-content p{
                        color: rgba(255,255,255,0.9);
                    }
                    .liquid-howit-bg .twm-step-section-4 ul li:before{
                        background-color: rgba(148, 163, 184, 0.65);
                    }
                    .liquid-howit-bg .header-glass-cta{
                        position: relative;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        min-height: 40px;
                        padding: 8px 16px;
                        border-radius: 10px;
                        font-size: 14px;
                        font-weight: 500;
                        text-decoration: none;
                        line-height: 1.2;
                        border: 1px solid rgba(255, 255, 255, 0.5);
                        background: rgba(255, 255, 255, 0.025);
                        color: #ffffff !important;
                        box-shadow:
                            inset 0 1px 0 rgba(255, 255, 255, 0.75),
                            0 0 9px rgba(0, 0, 0, 0.2),
                            0 3px 8px rgba(0, 0, 0, 0.15);
                        -webkit-backdrop-filter: blur(10px) saturate(115%);
                        backdrop-filter: blur(10px) saturate(115%);
                        transition: all 0.3s ease;
                    }
                    .liquid-howit-bg .header-glass-cta:hover,
                    .liquid-howit-bg .header-glass-cta:focus-visible{
                        background: rgba(255, 255, 255, 0.3);
                        color: #ffffff !important;
                    }
                    .liquid-howit-bg .header-glass-cta .font-icon-contact,
                    .liquid-howit-bg .header-glass-cta .feather-log-in{
                        color: #ffffff !important;
                    }
                `}</style>
        <div className="section-full twm-how-it-work-1-area liquid-howit-bg">
          <div className="container">
            <div className="section-content">
              <div className="twm-how-it-work-1-content">
                <div className="row">
                  <div className="col-xl-5 col-lg-12 col-md-12">
                    <div className="twm-how-it-work-1-left">
                      <div className="twm-how-it-work-1-section">
                        {/* title="" START*/}
                        <div className="section-head left wt-small-separator-outer">
                          <div className="wt-small-separator">
                            <div>How it Works</div>
                          </div>
                          <h2
                            className="wt-text-1"
                            style={{ color: "#0b1220" }}
                          >
                            Simple Steps, Complete Support
                          </h2>
                          <h6 className="wt-text">
                            Just Follow our Steps - We'll handle the rest
                          </h6>
                        </div>
                        {/* title="" END*/}
                        <div className="twm-step-section-4">
                          <ul>
                            <li>
                              <div className="twm-step-count bg-clr-sky-light">
                                01
                              </div>
                              <div className="twm-step-content">
                                <h4 className="twm-title">Get in Touch</h4>
                                <p>
                                  Sign up or contact us directly for a free
                                  expert consultation.
                                </p>
                              </div>
                            </li>
                            <li>
                              <div className="twm-step-count bg-clr-yellow-light">
                                02
                              </div>
                              <div className="twm-step-content">
                                <h4 className="twm-title">Talk to Experts</h4>
                                <p>
                                  Our specialists will call you to understand
                                  your business goals.
                                </p>
                              </div>
                            </li>
                            <li>
                              <div className="twm-step-count bg-clr-pink-light">
                                03
                              </div>
                              <div className="twm-step-content">
                                <h4 className="twm-title">
                                  Make Smart Investments
                                </h4>
                                <p>
                                  Get clear guidance on where to invest for
                                  maximum impact.
                                </p>
                              </div>
                            </li>
                            <li>
                              <div className="twm-step-count bg-clr-green-light">
                                04
                              </div>
                              <div className="twm-step-content">
                                <h4 className="twm-title">Grow Effortlessly</h4>
                                <p>
                                  Sit back and watch your business thrive with
                                  our expert support.
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="d-flex flex-wrap gap-3 header-nav-btn-section">
                          <div className="twm-nav-btn-left">
                            <ActionButton
                              as={NavLink}
                              className="header-glass-cta"
                              to={publicUser.pages.CONTACT}
                            >
                              <FiPhoneCall className="font-icon-contact" />
                              <span className="twm-nav-action-label">
                                Contact-Us
                              </span>
                            </ActionButton>
                          </div>
                          <div className="twm-nav-btn-right">
                            <ActionButton
                              as="a"
                              className="header-glass-cta"
                              data-bs-toggle="modal"
                              href="#sign_up_popup2"
                              role="button"
                            >
                              <i className="feather-log-in" />
                              <span className="twm-nav-action-label">
                                Sign In
                              </span>
                            </ActionButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-12 col-md-12">
                    <div className="twm-how-it-right-section">
                      <div className="twm-media">
                        <div className="twm-bg-circle">
                          <JobZImage
                            src="images/home-4/how-it-work/bg-circle-large.png"
                            alt=""
                          />
                        </div>
                        <div
                          className="twm-block-left anm"
                          data-speed-x={-4}
                          data-speed-scale={-25}
                        >
                          <JobZImage
                            src="images/home-4/how-it-work/block-left.png"
                            alt=""
                          />
                        </div>
                        <div
                          className="twm-block-right anm"
                          data-speed-x={-4}
                          data-speed-scale={-25}
                        >
                          <JobZImage
                            src="images/home-4/how-it-work/block-right.png"
                            alt=""
                          />
                        </div>
                        <div
                          className="twm-main-bg anm"
                          data-wow-delay="1000ms"
                          data-speed-x={2}
                          data-speed-y={2}
                        >
                          <JobZImage
                            src="images/home-4/how-it-work/main-bg.png"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* How It Work END */}
        {/* ABOUT SECTION START */}

        {/* <div className="section-full p-t120 p-b90 site-bg-gray twm-about-1-area">
                <div className="container">
                    <div className="twm-about-1-section-wrap">
                        <div className="row">
                            <div className="col-lg-6 col-md-12">
                                <div className="twm-about-1-section">
                                    <div className="twm-media">
                                        <JobZImage src="images/home-4/about/about-img.png" alt="" />
                                    </div>
                                </div>
                            </div>


                            <div className="col-lg-6 col-md-12">
                                <div className="twm-about-1-section-right">
                                    <div className="section-head left wt-small-separator-outer">
                                        <div className="wt-small-separator site-text-primary">
                                            <div>Choose Your Expert </div>
                                        </div>
                                        <h2 className="wt-title">Get a dedicated business expert aligned with your vision—offering tailored strategies, proactive support, and end-to-end guidance to help you grow with confidence.</h2>
                                    </div>
                                    <ul className="description-list">
                                        <li>
                                            <i className="feather-check" />
                                            Tradmark & Copyright Expert - IPR
                                        </li>
                                        <li>
                                            <i className="feather-check" />
                                            Company Registration & Compliances Expert - ROC
                                        </li>
                                        <li>
                                            <i className="feather-check" />
                                            Certification & Licenses Expert
                                        </li>
                                        <li>
                                            <i className="feather-check" />
                                            Finance & Accounts Expert
                                        </li>
                                        <li>
                                            <i className="feather-check" />
                                            Web & Graphics Expert - Digital
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="twm-about-1-bottom-wrap">
                        <div className="row">
                            <div className="col-lg-3 col-md-6">
                                <div className="twm-card-blocks">
                                    <div className="twm-icon pink">
                                        <JobZImage src="images/main-slider/slider2/20+new.png" alt="" />
                                    </div>
                                    <div className="twm-content">
                                        <div className="tw-count-number text-clr-pink">
                                            <span className="counter">
                                                <CountUp end={20} duration={8} />
                                            </span> +
                                        </div>
                                        <p className="icon-content-info">Years Experienced Experts </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="twm-card-blocks-2">
                                    <div className="twm-pics">
                                        <span><JobZImage src="images/main-slider/slider1/user/2.svg" alt="" /></span>
                                        <span><JobZImage src="images/main-slider/slider1/user/3.svg" alt="" /></span>
                                        <span><JobZImage src="images/main-slider/slider1/user/4.svg" alt="" /></span>
                                        <span><JobZImage src="images/main-slider/slider1/user/5.svg" alt="" /></span>
                                        <span><JobZImage src="images/main-slider/slider1/user/6.svg" alt="" /></span>
                                        <span><JobZImage src="images/main-slider/slider1/user/1.svg" alt="" /></span>
                                    </div>
                                    <div className="twm-content">
                                        <div className="tw-count-number text-clr-green">
                                            <span className="counter">
                                                <CountUp end={4} duration={10} />
                                            </span>K+
                                        </div>
                                        <p className="icon-content-info">Happy Clients</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="twm-card-blocks">
                                    <div className="twm-icon twm-icon-top">
                                        <JobZImage className='twm-icon-image' src="images/main-slider/slider2/top-icon.png" alt="" />
                                    </div>
                                    <div className="twm-content">
                                        <div className="tw-count-number text-clr-sky">
                                            <span className="counter">
                                                <CountUp end={100} duration={10} />
                                            </span>+
                                        </div>
                                        <p className="icon-content-info">Top Brands Trusting Unicx</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="twm-card-blocks">
                                    <div className="twm-icon">
                                        <JobZImage src="images/main-slider/slider2/success1.png" alt="" />
                                    </div>
                                    <div className="twm-content">
                                        <div className="tw-count-number text-clr-sky">
                                            <span className="counter">
                                                <CountUp end={99} duration={10} />
                                            </span>%
                                        </div>
                                        <p className="icon-content-info">Positive Success Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

        {showSecondarySections ? (
          <ExpertSection />
        ) : (
          <div style={{ minHeight: "260px" }} aria-hidden="true" />
        )}

        {/* ABOUT SECTION END */}

        <UniCxStandardSection />

        {/* TOP COMPANIES START */}
        {/* <div className="section-full p-t120 p-b90 site-bg-white twm-companies-wrap">
                <div className="section-head center wt-small-separator-outer">
                    <div className="wt-small-separator site-text-primary">
                        <div>Top Companies</div>
                    </div>
                    <h2 className="wt-title">Our Valued customers</h2>
                </div>
                <div className="container">
                    <div className="section-content">
                        <div className="owl-carousel home-client-carousel3 owl-btn-vertical-center">
                            {Array.from({ length: 50 }, (_, i) => (
                                <div className="item" key={i}>
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}>
                                                <JobZImage src={`images/company-final/${i + 1}.webp`} alt="" />
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div> */}
        {showSecondarySections ? (
          <CompanyCards />
        ) : (
          <div style={{ minHeight: "240px" }} aria-hidden="true" />
        )}
        {/* TOP COMPANIES END */}
      </div>

      {showSecondarySections ? (
        <>
          <style>{`
                .liquid-case-right .twm-blog-post-1-outer{
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    background: rgba(0, 0, 0, 0.2);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.75),
                        0 0 9px rgba(0, 0, 0, 0.2),
                        0 3px 8px rgba(0, 0, 0, 0.15);
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
                }
                .liquid-case-right .twm-blog-post-1-outer:hover{
                    transform: translateY(-3px);
                    border-color: rgba(255,255,255,0.72);
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.86),
                        0 18px 34px rgba(7,34,79,0.22);
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-info{
                    background: transparent;
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-title .post-title a{
                    color: #ffffff;
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-text p{
                    color: rgba(255,255,255,0.82);
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-meta ul li{
                    color: rgba(255,255,255,0.88);
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-info .wt-post-meta ul li.post-date{
                    background-color: rgba(59, 130, 246, 0.92);
                    color: #ffffff;
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-info .wt-post-meta ul li.post-date:after{
                    background-color: rgba(59, 130, 246, 0.92);
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-info .wt-post-meta ul li.post-date:before{
                    border-top-color: rgba(37, 99, 235, 0.95);
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-info .wt-post-meta ul li.post-author{
                    color: rgba(255,255,255,0.9);
                    font-weight: 600;
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-info .wt-post-meta ul li.post-author a{
                    color: #93c5fd;
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-readmore .site-button-link{
                    color: #93c5fd;
                    font-weight: 600;
                    text-decoration: none;
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-readmore .site-button-link:hover{
                    color: #bfdbfe;
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-title .post-title{
                    margin-bottom: 12px;
                    line-height: 1.35;
                }
                .liquid-case-right .twm-blog-post-1-outer .wt-post-text p{
                    line-height: 1.6;
                }
                .liquid-case-left.twm-blog-post-2-outer{
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    background: rgba(0, 0, 0, 0.2);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.75),
                        0 0 9px rgba(0, 0, 0, 0.2),
                        0 3px 8px rgba(0, 0, 0, 0.15);
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    overflow: hidden;
                    transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
                }
                .liquid-case-left.twm-blog-post-2-outer:hover{
                    transform: translateY(-3px);
                    border-color: rgba(255,255,255,0.72);
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.86),
                        0 18px 34px rgba(7,34,79,0.22);
                }
                .liquid-case-left.twm-blog-post-2-outer .wt-post-media{
                    border-radius: 14px;
                    overflow: hidden;
                    box-shadow: 0 10px 24px rgba(7,34,79,0.14);
                }
                .liquid-case-left.twm-blog-post-2-outer .wt-post-info{
                    background: transparent;
                }
                .liquid-case-left.twm-blog-post-2-outer .wt-post-info .wt-post-meta ul li.post-date{
                    color: rgba(255,255,255,0.88);
                }
                .liquid-case-left.twm-blog-post-2-outer .wt-post-title .post-title a{
                    color: #ffffff;
                }
                .liquid-case-left.twm-blog-post-2-outer .wt-post-readmore .site-button-link{
                    color: #93c5fd;
                    font-weight: 600;
                    text-decoration: none;
                }
                .liquid-case-left.twm-blog-post-2-outer .wt-post-readmore .site-button-link:hover{
                    color: #bfdbfe;
                }
            `}</style>
          {/* OUR case studies START */}
          <div
            className="section-full p-t120 p-b90 site-bg-gray bg-cover overlay-wraper"
            style={{
              backgroundImage: `url(${publicUrlFor?.("images/blog/blog-single/case.svg")})`,
            }}
          >
            <div className="overlay-main site-bg-primary opacity-01" />
            <div className="container">
              {/* title="" START*/}
              <div className="section-head center wt-small-separator-outer">
                <div className="wt-small-separator site-text-primary">
                  <div>Our Case Studies</div>
                </div>
                <h2 className="wt-title site-text-white">
                  CASE STUDIES & ACHIEVEMENTS
                </h2>
              </div>
              {/* title="" END*/}
              <div className="section-content">
                <div className="row d-flex justify-content-center">
                  {caseStudies?.length > 0 ? (
                    <>
                      {/* Block one (Left Column - with image) */}
                      <div className="col-lg-5 col-md-12 m-b30">
                        <div className="blog-post twm-blog-post-2-outer liquid-case-left">
                          <div className="wt-post-media">
                            <NavLink
                              to={`${publicUser?.caseStudy?.DETAIL}/${caseStudies[0]?._id}`}
                            >
                              <img
                                src={
                                  caseStudies[0]?.images?.length > 0
                                    ? caseStudies[0].images[0]
                                    : "https://unicx.in/images/main-slider/slider1/user/top10.jpg"
                                }
                                alt={caseStudies[0]?.title || "Case Study"}
                                className="img-fluid"
                              />
                            </NavLink>
                          </div>
                          <div className="wt-post-info">
                            <div className="wt-post-meta">
                              <ul>
                                <li className="post-date">
                                  {caseStudies[0]?.createdAt
                                    ? new Date(
                                        caseStudies[0].createdAt,
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : "Date not available"}
                                </li>
                              </ul>
                            </div>
                            <div className="wt-post-title">
                              <h4 className="post-title">
                                <NavLink
                                  to={`${publicUser?.caseStudy?.DETAIL}/${caseStudies[0]?._id}`}
                                >
                                  {caseStudies[0]?.title ||
                                    "Title not available"}
                                </NavLink>
                              </h4>
                            </div>
                            <div className="wt-post-text">
                              <p style={{color:"white"}}>
                                {getCaseStudyExcerpt(caseStudies[0]) || "-"}
                              </p>
                            </div>
                            <div className="wt-post-readmore">
                              <NavLink
                                to={`${publicUser?.caseStudy?.DETAIL}/${caseStudies[0]?._id}`}
                                className="site-button-link site-text-secondry"
                              >
                                Read More
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Contains multiple blocks without images */}
                      <div className="col-lg-7 col-md-12">
                        <div className="twm-blog-post-wrap-right liquid-case-right">
                          {caseStudies.slice(1, 4)?.map((caseStudy) => (
                            <div
                              className="blog-post twm-blog-post-1-outer shadow-none m-b30"
                              key={caseStudy?._id || Math.random()}
                            >
                              <div className="wt-post-info">
                                <div className="wt-post-meta">
                                  <ul>
                                    <li className="post-date">
                                      {caseStudy?.createdAt
                                        ? new Date(
                                            caseStudy.createdAt,
                                          ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })
                                        : "Date not available"}
                                    </li>
                                    <li className="post-author">
                                      By{" "}
                                      <NavLink>
                                        {caseStudy?.author || "Unicx Team"}
                                      </NavLink>
                                    </li>
                                  </ul>
                                </div>
                                <div className="wt-post-title">
                                  <h4 className="post-title">
                                    <NavLink
                                      to={`${publicUser?.caseStudy?.DETAIL}/${caseStudy?._id}`}
                                    >
                                      {caseStudy?.title ||
                                        "Title not available"}
                                    </NavLink>
                                  </h4>
                                </div>
                                <div className="wt-post-text">
                                  <p>
                                    {getCaseStudyExcerpt(caseStudy) || "-"}
                                  </p>
                                </div>
                                <div className="wt-post-readmore">
                                  <NavLink
                                    to={`${publicUser?.caseStudy?.DETAIL}/${caseStudy?._id}`}
                                    className="site-button-link site-text-primary"
                                  >
                                    Read More
                                  </NavLink>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="col-12 text-center">
                      <p>No case studies found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* OUR case END */}

          {/* TESTIMONIAL SECTION START */}
          <style>{`
                .liquid-testimonials .testimonials-v{
                    background:
                        linear-gradient(155deg, rgba(255,255,255,0.62), rgba(255,255,255,0.24));
                    border: 1px solid rgba(255,255,255,0.55);
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.82),
                        0 14px 30px rgba(7,34,79,0.18);
                    backdrop-filter: blur(10px) saturate(135%);
                    -webkit-backdrop-filter: blur(10px) saturate(135%);
                    border-radius: 16px;
                    transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
                }
                .liquid-testimonials .testimonials-v:hover{
                    transform: translateY(-3px);
                    border-color: rgba(255,255,255,0.72);
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.86),
                        0 18px 34px rgba(7,34,79,0.22);
                }
                .liquid-testimonials .testimonials-v .twm-testi-media{
                    border: 1px solid rgba(255,255,255,0.62);
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 18px rgba(0,0,0,0.12);
                }
                .liquid-testimonials .testimonials-v .testimonial-v-content{
                    background: transparent;
                }
                .liquid-testimonials .testimonials-v .t-discription{
                    color: #334155;
                    line-height: 1.65;
                }
                .liquid-testimonials .testimonials-v .twm-testi-name{
                    color: #0f172a;
                }
                .liquid-testimonials .testimonials-v .twm-testi-position{
                    color: #475569;
                }
                .liquid-testimonials .testimonials-v .t-rating i{
                    color: #f59e0b;
                }
                .liquid-testimonials .testimonial-swiper-pagination{
                    position: relative !important;
                    display: flex !important;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 8px;
                    width: auto !important;
                    margin-top: 18px;
                    left: 0 !important;
                    right: auto !important;
                    bottom: auto !important;
                    top: auto !important;
                    transform: none !important;
                    z-index: 5;
                }
                .liquid-testimonials .testimonial-swiper-pagination .swiper-pagination-bullet{
                    width: 10px;
                    height: 10px;
                    border-radius: 999px;
                    background: #64748b;
                    opacity: 0.55;
                    transition: all 0.25s ease;
                }
                .liquid-testimonials .testimonial-swiper-pagination .swiper-pagination-bullet:hover{
                    opacity: 0.9;
                }
                .liquid-testimonials .testimonial-swiper-pagination .swiper-pagination-bullet-active{
                    width: 24px;
                    border-radius: 999px;
                    background: #1967d2;
                    opacity: 1;
                    box-shadow: 0 6px 14px rgba(25, 103, 210, 0.35);
                }
                .liquid-testimonials .testimonial-swiper-pagination .swiper-pagination-bullet-active-main,
                .liquid-testimonials .testimonial-swiper-pagination .swiper-pagination-bullet-active-prev,
                .liquid-testimonials .testimonial-swiper-pagination .swiper-pagination-bullet-active-next{
                    opacity: 1;
                }
                .liquid-testimonials .testimonial-swiper-pagination-static{
                    pointer-events: none;
                    margin-top: 10px;
                }
            `}</style>
          <div className="section-full p-t120 p-b90 site-bg-white twm-testimonial-v-area liquid-testimonials">
            <div className="container">
              <div className="section-content">
                <div className="twm-testimonial-v-section">
                  <div className="row">
                    <div className="col-xl-5 col-lg-12 col-md-12">
                      <div className="twm-explore-content-outer2">
                        <div className="twm-explore-top-section">
                          {/* title="" START*/}
                          <div className="section-head left wt-small-separator-outer">
                            <div className="wt-small-separator site-text-primary">
                              <div>Testimonials </div>
                            </div>
                            <h2>Quotes from our customer about us</h2>
                            <p>
                              Hear directly from the businesses and innovators
                              we've helped protect their intellectual property
                              and navigate the complexities of patents and
                              trademarks. Their success stories speak volumes
                              about our dedication.
                            </p>
                          </div>
                          {/* title="" END*/}
                          <div className="twm-read-more">
                            <NavLink
                              to={publicUser.pages.ABOUT}
                              className="site-button"
                            >
                              Show All Quotes
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-7 col-lg-12 col-md-12">
                      <div className="v-testimonial-wrap">
                        <div className="v-testi-dotted-pic">
                          <JobZImage
                            src="images/testimonials/dotted-block.png"
                            alt="#"
                          />
                        </div>
                        {/* Swiper */}
                        {/* <div className="swiper-container v-testimonial-slider" ref={testimonialSwiperRef}>
                                            <div className="swiper-wrapper">
                                              
                                                <div className="swiper-slide">
                                                    <div className="testimonials-v">
                                                        <div className="twm-testi-media">
                                                            <JobZImage src="images/main-slider/slider1/user/1.svg" alt="#" />
                                                        </div>
                                                        <div className="testimonial-v-content">
                                                            <div className="t-testimonial-top">
                                                                <div className="t-quote"><i className="fa fa-quote-left" /></div>
                                                                <div className="t-rating">
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                </div>
                                                            </div>
                                                            <div className="t-discription">UniConsultX transformed my startup journey. From selecting a legally sound brand name to
                                                                handling all compliance and digital needs, their team provided seamless support.
                                                                Their integrated approach saved me time and ensured my business was built on a solid foundation.
                                                            </div>
                                                            <div className="twm-testi-detail">
                                                                <div className="twm-testi-name">Anjali Mehta</div>
                                                                <div className="twm-testi-position">Founder - GreenLeaf Organics</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
    


                                              
                                                // {/* <div className="swiper-slide">
                                                //     <div className="testimonials-v">
                                                //         <div className="twm-testi-media">
                                                //             <JobZImage src="images/main-slider/slider1/user/5.svg" alt="#" />
                                                //         </div>
                                                //         <div className="testimonial-v-content">
                                                //             <div className="t-testimonial-top">
                                                //                 <div className="t-quote"><i className="fa fa-quote-left" /></div>
                                                //                 <div className="t-rating">
                                                //                     <span><i className="fa fa-star" /></span>
                                                //                     <span><i className="fa fa-star" /></span>
                                                //                     <span><i className="fa fa-star" /></span>
                                                //                     <span><i className="fa fa-star" /></span>
                                                //                     <span><i className="fa fa-star" /></span>
                                                //                 </div>
                                                //             </div>
                                                //             <div className="t-discription">Navigating the complexities of business compliance was daunting
                                                //                 until I partnered with UniCX. Their in-house experts managed everything from GST registration to
                                                //                 trademark filing with utmost professionalism. Their prompt responses and clear guidance were invaluable.
                                                //             </div>
                                                //             <div className="twm-testi-detail">
                                                //                 <div className="twm-testi-name">Rahul Sharma</div>
                                                //                 <div className="twm-testi-position">Director - TechNova Solutions</div>
                                                //             </div>
                                                //         </div>
                                                //     </div>
                                                // </div> 
                                                
                                                 <div className="swiper-slide">
                                                    <div className="testimonials-v">
                                                        <div className="twm-testi-media">
                                                            <JobZImage src="images/main-slider/slider1/user/6.svg" alt="#" />
                                                        </div>
                                                        <div className="testimonial-v-content">
                                                            <div className="t-testimonial-top">
                                                                <div className="t-quote"><i className="fa fa-quote-left" /></div>
                                                                <div className="t-rating">
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                </div>
                                                            </div>
                                                            <div className="t-discription">UniConsultX's digital team revamped our online presence with a
                                                                stunning website and cohesive branding. Their attention to detail and understanding
                                                                of our vision resulted in a significant boost in our online engagement. Truly a game-changer for our business.
                                                            </div>
                                                            <div className="twm-testi-detail">
                                                                <div className="twm-testi-name">Priya Desai</div>
                                                                <div className="twm-testi-position">Marketing Head - Urban Threads</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                               
                                                 <div className="swiper-slide">
                                                    <div className="testimonials-v">
                                                        <div className="twm-testi-media">
                                                            <JobZImage src="images/main-slider/slider1/user/4.svg" alt="#" />
                                                        </div>
                                                        <div className="testimonial-v-content">
                                                            <div className="t-testimonial-top">
                                                                <div className="t-quote"><i className="fa fa-quote-left" /></div>
                                                                <div className="t-rating">
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                </div>
                                                            </div>
                                                            <div className="t-discription">Obtaining necessary certifications
                                                                seemed overwhelming, but UniCX made it straightforward. They handled our ISO certification process
                                                                efficiently, ensuring compliance without any hassle. Their expertise is unmatched.
                                                            </div>
                                                            <div className="twm-testi-detail">
                                                                <div className="twm-testi-name">Vikram Patel</div>
                                                                <div className="twm-testi-position">CEO - SafeBuild Constructions</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                             
                                                <div className="swiper-slide">
                                                    <div className="testimonials-v">
                                                        <div className="twm-testi-media">
                                                            <JobZImage src="images/main-slider/slider1/user/2.svg" alt="#" />
                                                        </div>
                                                        <div className="testimonial-v-content">
                                                            <div className="t-testimonial-top">
                                                                <div className="t-quote"><i className="fa fa-quote-left" /></div>
                                                                <div className="t-rating">
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                    <span><i className="fa fa-star" /></span>
                                                                </div>
                                                            </div>
                                                            <div className="t-discription">What sets UniConsultX apart is their personalized approach.
                                                                They assigned a dedicated expert who understood our unique needs and provided tailored solutions.
                                                                Their proactive communication kept us informed at every step.
                                                            </div>
                                                            <div className="twm-testi-detail">
                                                                <div className="twm-testi-name">Sneha Kapoor</div>
                                                                <div className="twm-testi-position">Co-founder - EduBridge Learning</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                           
                                            {screenWidth > 767 && <div className="swiper-pagination" style={{ display: 'block !important' }} />}
                                        </div> */}

                        <div
                          className="swiper-container v-testimonial-slider"
                          ref={testimonialSwiperRef}
                        >
                          <div className="swiper-wrapper">
                            {activeTestimonials.map((test, index) => {
                              const rating = Math.min(
                                Math.max(
                                  Math.round(Number(test.rating) || 5),
                                  1,
                                ),
                                5,
                              );

                              return (
                                <div
                                  className="swiper-slide"
                                  key={test._id || index}
                                >
                                  <div className="testimonials-v">
                                    <div className="twm-testi-media">
                                      <JobZImage
                                        src={
                                          test.avatar ||
                                          "images/main-slider/slider1/user/1.svg"
                                        }
                                        alt={test.first_name}
                                      />
                                    </div>

                                    <div className="testimonial-v-content">
                                      <div className="t-testimonial-top">
                                        <div className="t-quote">
                                          <i className="fa fa-quote-left" />
                                        </div>

                                        <div className="t-rating">
                                          {[...Array(rating)].map((_, i) => (
                                            <span key={i}>
                                              <i className="fa fa-star" />
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="t-discription">
                                        {test.message}
                                      </div>

                                      <div className="twm-testi-detail">
                                        <div className="twm-testi-name">
                                          {test.first_name} {test.last_name}
                                        </div>
                                        <div className="twm-testi-position">
                                          {test.role}
                                          {test.companyname &&
                                            ` - ${test.companyname}`}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="swiper-pagination testimonial-swiper-pagination" />
                          {activeTestimonials.length <= 1 && (
                            <div className="swiper-pagination testimonial-swiper-pagination testimonial-swiper-pagination-static">
                              <span className="swiper-pagination-bullet swiper-pagination-bullet-active" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* TESTIMONIAL SECTION END */}

          {/* OUR BLOG START */}
          <style>{`
                .liquid-blogs .twm-blog-post-2-outer{
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    background: rgba(0, 0, 0, 0.2);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.75),
                        0 0 9px rgba(0, 0, 0, 0.2),
                        0 3px 8px rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-radius: 16px;
                    overflow: hidden;
                    transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
                }
                .liquid-blogs .twm-blog-post-2-outer:hover{
                    transform: translateY(-3px);
                    border-color: rgba(255,255,255,0.72);
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.86),
                        0 18px 34px rgba(7,34,79,0.22);
                }
                .liquid-blogs .twm-blog-post-2-outer .wt-post-media{
                    border-radius: 14px;
                    overflow: hidden;
                    box-shadow: 0 10px 24px rgba(7,34,79,0.14);
                }
                .liquid-blogs .twm-blog-post-2-outer .wt-post-info{
                    background: transparent;
                }
                .liquid-blogs .twm-blog-post-2-outer .wt-post-meta ul li.post-date{
                    color: rgba(255,255,255,0.88);
                }
                .liquid-blogs .twm-blog-post-2-outer .wt-post-title .post-title a{
                    color: #ffffff;
                }
                .liquid-blogs .twm-blog-post-2-outer .wt-post-readmore .site-button-link{
                    color: #93c5fd;
                    font-weight: 600;
                    text-decoration: none;
                }
                .liquid-blogs .twm-blog-post-2-outer .wt-post-readmore .site-button-link:hover{
                    color: #bfdbfe;
                }
            `}</style>
          <div
            className="section-full p-t120 p-b90 site-bg-gray bg-cover overlay-wraper liquid-blogs"
            style={{
              backgroundImage: `url(${publicUrlFor("images/background/bg-4.svg")})`,
            }}
          >
            <div className="overlay-main site-bg-primary opacity-01" />
            <div className="container">
              {/* title="" START*/}
              <div className="section-head center wt-small-separator-outer" style={{display:"flex",flexDirection:"column"}}>
                <div className="wt-small-separator site-text-primary">
                  <div>Our Blogs</div>
                </div>
                <h2 className="wt-title site-text-white">Latest Article</h2>
              </div>
              {/* title="" END*/}
              <div className="section-content">
                <div className="row d-flex justify-content-center">
                  {blogs.length > 0 ? (
                    // Render up to 3 latest blogs
                    blogs.slice(0, 3).map((blog, blogIndex) => {
                      const blogImages = Array.isArray(blog?.images)
                        ? blog.images.filter(Boolean)
                        : [];
                      const blogDate = blog?.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Date not available";

                      return (
                        <div
                          className="col-lg-4 col-md-6 m-b30"
                          key={blog?._id || `blog-${blogIndex}`}
                        >
                          <div className="blog-post twm-blog-post-2-outer">
                            <div className="wt-post-media">
                              <NavLink
                                to={`${publicUser?.blog?.DETAIL}/${blog?._id}`}
                              >
                                {/* <JobZImage
                                                        src={blog?.image_url ? `${BASE_URL}${blog.image_url}` : `${BASE_URL}/images/main-slider/slider1/user/top10.jpg`}
                                                        alt={blog?.title || "Blog Image"}
                                                        className="img-fluid"
                                                    /> */}
                                {blogImages.length > 0 ? (
                                  blogImages.map((img, index) => (
                                    <JobZImage
                                      key={`${blog?._id || blogIndex}-img-${index}`}
                                      src={img}
                                      alt={`Blog Image ${index + 1}`}
                                      className="img-fluid"
                                      loading="lazy"
                                    />
                                  ))
                                ) : (
                                  <JobZImage
                                    src="images/main-slider/slider1/user/top10.jpg"
                                    alt={blog?.title || "Blog Image"}
                                    className="img-fluid"
                                    loading="lazy"
                                  />
                                )}
                              </NavLink>
                            </div>
                            <div className="wt-post-info">
                              <div className="wt-post-meta ">
                                <ul>
                                  <li className="post-date">{blogDate}</li>
                                </ul>
                              </div>
                              <div className="wt-post-title ">
                                <h4 className="post-title">
                                  <NavLink
                                    to={`${publicUser.blog.DETAIL}/${blog._id}`}
                                  >
                                    {blog.title}
                                  </NavLink>
                                </h4>
                              </div>
                              <div className="wt-post-readmore ">
                                <NavLink
                                  to={`${publicUser.blog.DETAIL}/${blog._id}`}
                                  className="site-button-link site-text-secondry"
                                >
                                  Read More
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12 text-center">
                      <p className="site-text-white">No blogs found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* OUR BLOG END */}

          {/* FAQ SECTION START */}
          <DynamicFaqTabs />
          {/* FAQ SECTION END */}
        </>
      ) : (
        <>
          <div style={{ minHeight: "420px" }} aria-hidden="true" />
          <div style={{ minHeight: "320px" }} aria-hidden="true" />
        </>
      )}
    </>
  );
}

export default Home1Page;

