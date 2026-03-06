import JobZImage from "../jobz-img";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { publicUser } from "../../../globals/route-names";
import { useState, useEffect, useRef } from "react";

import {
  getHeaderCategoriesFast,
  getHeaderBootstrap,
} from "../../../adminApi";
import TrademarkSearch from "../../pannels/public-user/components/pages/TrademarkSearch";
import { FcCallback } from "react-icons/fc";
import {
  RiArrowDownSLine,
} from "react-icons/ri";
import "./header1.css";
import NavHeader from "./navHeader";
import Skeleton from "../skeleton/Skeleton";
import ActionButton from "../ui/action-button";

const HEADER_NAV_CACHE_KEY = "header_nav_cache_v1";

const RESOURCE_CATEGORY_ID = "static-resources-category";
const RESOURCE_SUBCAT_COMPANY_ID = "static-resources-company";
const RESOURCE_SUBCAT_CALCULATORS_ID = "static-resources-calculators";
const RESOURCE_SUBCAT_TM_CLASSES_ID = "static-resources-tm-classes";
const RESOURCE_SUBCAT_GUIDES_ID = "static-resources-guides";

const STATIC_RESOURCE_CATEGORY = {
  _id: RESOURCE_CATEGORY_ID,
  name: "Resources",
  status: "active",
};

const STATIC_RESOURCE_SUB_CATEGORIES = [
  {
    _id: RESOURCE_SUBCAT_COMPANY_ID,
    name: "Company",
    status: "active",
    category: [{ _id: RESOURCE_CATEGORY_ID }],
  },
  {
    _id: RESOURCE_SUBCAT_CALCULATORS_ID,
    name: "Calculators",
    status: "active",
    category: [{ _id: RESOURCE_CATEGORY_ID }],
  },
  {
    _id: RESOURCE_SUBCAT_TM_CLASSES_ID,
    name: "TM Classes",
    status: "active",
    category: [{ _id: RESOURCE_CATEGORY_ID }],
  },
  {
    _id: RESOURCE_SUBCAT_GUIDES_ID,
    name: "Guides",
    status: "active",
    category: [{ _id: RESOURCE_CATEGORY_ID }],
  },
];

const STATIC_RESOURCE_SERVICES = [
  {
    _id: "static-resource-about",
    name: "About",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_COMPANY_ID }],
    to: publicUser.pages.ABOUT,
  },
  {
    _id: "static-resource-contact",
    name: "Contact Us",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_COMPANY_ID }],
    to: publicUser.pages.CONTACT,
  },
  {
    _id: "static-resource-all-calculators",
    name: "All Calculators",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.CALCULATOR_ALL,
  },
  {
    _id: "static-resource-gst-calculator",
    name: "GST Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.GSTCalculator,
  },
  {
    _id: "static-resource-income-tax-calculator",
    name: "Income Tax Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.ITRCalculator,
  },
  {
    _id: "static-resource-epf-calculator",
    name: "EPF Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.EPFCalculator,
  },
  {
    _id: "static-resource-nps-calculator",
    name: "NPS Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.NPSCalculator,
  },
  {
    _id: "static-resource-hra-calculator",
    name: "HRA Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.HRACalculator,
  },
  {
    _id: "static-resource-sip-calculator",
    name: "SIP Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.SIPCalculator,
  },
  {
    _id: "static-resource-gratuity-calculator",
    name: "Gratuity Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.GratuityCalculator,
  },
  {
    _id: "static-resource-retirement-calculator",
    name: "Retirement Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.RetirementCalculator,
  },
  {
    _id: "static-resource-rd-calculator",
    name: "RD Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.RDCalculator,
  },
  {
    _id: "static-resource-simple-interest-calculator",
    name: "Simple Interest Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.SimpleInterestCalculator,
  },
  {
    _id: "static-resource-tds-calculator",
    name: "TDS Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.TDSCalculator,
  },
  {
    _id: "static-resource-ppf-calculator",
    name: "PPF Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.PPFCalculator,
  },
  {
    _id: "static-resource-mutual-fund-calculator",
    name: "Mutual Fund Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.MutualFundCalculator,
  },
  {
    _id: "static-resource-emi-calculator",
    name: "EMI Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.EMICalculator,
  },
  {
    _id: "static-resource-fd-calculator",
    name: "Fixed Deposit Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.FDCalculator,
  },
  {
    _id: "static-resource-home-loan-emi-calculator",
    name: "Home Loan EMI Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.HomeEMICalculator,
  },
  {
    _id: "static-resource-lumpsum-calculator",
    name: "Lumpsum Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.LumpsumCalculator,
  },
  {
    _id: "static-resource-business-tax-calculator",
    name: "Business Tax Calculator",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_CALCULATORS_ID }],
    to: publicUser.calculator.BusinessCalculator,
  },
  {
    _id: "static-resource-all-tm-classes",
    name: "All TM Classes",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_TM_CLASSES_ID }],
    to: publicUser.tdclasses.ALL,
  },
  ...Array.from({ length: 45 }, (_, idx) => ({
    _id: `static-resource-tm-class-${idx + 1}`,
    name: `TM Class ${idx + 1}`,
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_TM_CLASSES_ID }],
    to: `${publicUser.tdclasses.TdClass01}/${idx + 1}`,
  })),
  {
    _id: "static-resource-faq",
    name: "FAQ",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_GUIDES_ID }],
    to: publicUser.pages.FAQ,
  },
  {
    _id: "static-resource-blogs",
    name: "Blogs",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_GUIDES_ID }],
    to: publicUser.pages.TestPage5,
  },
  {
    _id: "static-resource-case-study",
    name: "Case Study",
    status: "active",
    subcategory: [{ _id: RESOURCE_SUBCAT_GUIDES_ID }],
    to: publicUser.pages.TestPage3,
  },
];

function Header1({ _config }) {
  const [menuActive, setMenuActive] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navHeaderOpen, setNavHeaderOpen] = useState(false);
  const [navHeaderCategoryId, setNavHeaderCategoryId] = useState(null);
  const [navHeaderTop, setNavHeaderTop] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const stickyWrapRef = useRef(null);
  const mainBarRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let latestCategories = [];

    try {
      const cachedRaw = localStorage.getItem(HEADER_NAV_CACHE_KEY);
      const cached = JSON.parse(cachedRaw || "{}");
      const cachedCategories = Array.isArray(cached.categories)
        ? cached.categories
        : [];
      if (cachedCategories.length > 0) {
        latestCategories = cachedCategories;
        setCategories(cachedCategories);
        setSubCategories(Array.isArray(cached.subCategories) ? cached.subCategories : []);
        setSubSubCategories(Array.isArray(cached.services) ? cached.services : []);
        setLoading(false);
      }
    } catch (error) {
      console.error("Unable to hydrate header cache:", error);
    }

    async function fetchPrimaryCategories() {
      try {
        const nextCategories = await getHeaderCategoriesFast();
        if (!isMounted) return;
        const resolvedCategories =
          Array.isArray(nextCategories) && nextCategories.length > 0
            ? nextCategories
            : (await getHeaderBootstrap())?.categories || [];
        latestCategories = resolvedCategories;
        setCategories(resolvedCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching primary categories:", error);
        try {
          const fallbackData = await getHeaderBootstrap();
          if (!isMounted) return;
          latestCategories = fallbackData.categories || [];
          setCategories(latestCategories);
          setSubCategories(fallbackData.subCategories || []);
          setSubSubCategories(fallbackData.services || []);
          setLoading(false);
        } catch (fallbackError) {
          console.error("Error fetching fallback header data:", fallbackError);
          if (isMounted) setLoading(false);
        }
      }
    }

    async function fetchSecondaryData() {
      try {
        const headerData = await getHeaderBootstrap();
        if (!isMounted) return;
        const nextSubCategories = headerData?.subCategories || [];
        const nextServices = headerData?.services || [];
        setSubCategories(nextSubCategories);
        setSubSubCategories(nextServices);

        try {
          localStorage.setItem(
            HEADER_NAV_CACHE_KEY,
            JSON.stringify({
              categories: latestCategories,
              subCategories: nextSubCategories,
              services: nextServices,
            }),
          );
        } catch (cacheError) {
          console.error("Unable to cache header navigation:", cacheError);
        }
      } catch (error) {
        console.error("Error fetching secondary header data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPrimaryCategories().then(() => {
      fetchSecondaryData();
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", menuActive);
    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [menuActive]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setMenuActive(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isHomePage =
      location.pathname === publicUser.INITIAL ||
      location.pathname === publicUser.HOME1;

    const updateScrollGlass = () => {
      const mainBarEl = mainBarRef.current;
      if (!mainBarEl) return;

      const hasScrolled = window.scrollY > 0;
      const showHomeTopNormal = isHomePage && !hasScrolled;
      const showHomeScrolledGlass = isHomePage && hasScrolled;

      mainBarEl.classList.toggle("home-top-normal", showHomeTopNormal);
      mainBarEl.classList.toggle("home-scrolled-glass", showHomeScrolledGlass);
      mainBarEl.classList.toggle("scroll-glass-active", showHomeScrolledGlass);

      const premiumGlassEl =
        mainBarEl.classList.contains("ui-glass-surface--premium")
          ? mainBarEl
          : mainBarEl.querySelector(".ui-glass-surface--premium");

      if (premiumGlassEl) {
        premiumGlassEl.classList.toggle("is-scrolled", hasScrolled);
      }
    };

    updateScrollGlass();
    window.addEventListener("scroll", updateScrollGlass, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollGlass);
  }, [location.pathname]);

  useEffect(() => {
    const stickyEl = stickyWrapRef.current;
    if (!stickyEl) return;

    const updateSticky = () => {
      const shouldFix = window.scrollY > 0;
      stickyEl.classList.toggle("is-fixed", shouldFix);
      stickyEl.classList.toggle("sticky-no", !shouldFix);
    };

    updateSticky();
    window.addEventListener("scroll", updateSticky, { passive: true });
    return () => window.removeEventListener("scroll", updateSticky);
  }, [location.pathname]);

  const handleNavigationClick = () => {
    setMenuActive(!menuActive);
  };

  const handleDropdownClick = () => {
    setMenuActive(false);
  };

  const getHeaderBaseTop = () => {
    const headerRect = headerRef.current?.getBoundingClientRect();
    const mainBarRect = mainBarRef.current?.getBoundingClientRect();
    return mainBarRect?.bottom || headerRect?.bottom || 0;
  };

  const openNavHeaderForCategory = (categoryId) => {
    setNavHeaderTop(getHeaderBaseTop());
    setNavHeaderCategoryId(categoryId);
    setNavHeaderOpen(true);
  };

  const closeNavHeader = () => {
    setNavHeaderOpen(false);
    setNavHeaderCategoryId(null);
  };

  const navCategories = [
    ...categories.filter((cat) => cat.status === "active"),
    STATIC_RESOURCE_CATEGORY,
  ];
  const navSubCategories = [...subCategories, ...STATIC_RESOURCE_SUB_CATEGORIES];
  const navServices = [...subSubCategories, ...STATIC_RESOURCE_SERVICES];
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (navHeaderOpen) {
      html.classList.add("navheader-modal-open");
      body.classList.add("navheader-modal-open");
    } else {
      html.classList.remove("navheader-modal-open");
      body.classList.remove("navheader-modal-open");
    }

    return () => {
      html.classList.remove("navheader-modal-open");
      body.classList.remove("navheader-modal-open");
    };
  }, [navHeaderOpen]);

  useEffect(() => {
    if (!navHeaderOpen) return;

    const updateNavHeaderTop = () => {
      setNavHeaderTop(getHeaderBaseTop());
    };

    updateNavHeaderTop();

    const handleOutsideClick = (e) => {
      const target = e.target;
      const panel = document.querySelector(".navheader-panel-root");
      if (panel && panel.contains(target)) return;
      closeNavHeader();
    };

    window.addEventListener("resize", updateNavHeaderTop);
    window.addEventListener("scroll", updateNavHeaderTop, true);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("resize", updateNavHeaderTop);
      window.removeEventListener("scroll", updateNavHeaderTop, true);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [navHeaderOpen]);

  const getSubsForCategory = (categoryId) => {
    const filtered = navSubCategories.filter((sub) => {
      return (
        sub.status === "active" &&
        Array.isArray(sub.category) &&
        sub.category.length > 0 &&
        sub.category[0]?._id === categoryId
      );
    });
    // console.log(filtered,"filed")
    return filtered;
  };

  useEffect(() => {
    if (loading) return;

    const handleSubmenuToggle = (e) => {
      if (window.innerWidth <= 991) {
        const li = e.target.closest("li");
        if (!li) return;

        if (
          li.classList.contains("has-child") ||
          li.classList.contains("dropdown")
        ) {
          e.preventDefault();
          li.classList.toggle("nav-active");
        }
      }
    };

    const menuLinks = document.querySelectorAll(
      ".header-nav .nav li.has-child > a, " +
        ".header-nav .nav li.has-child > .nav-link, " +
        ".header-nav .nav li.dropdown > a",
    );

    menuLinks.forEach((link) =>
      link.addEventListener("click", handleSubmenuToggle),
    );

    return () => {
      menuLinks.forEach((link) =>
        link.removeEventListener("click", handleSubmenuToggle),
      );
    };
  }, [loading]);

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header ${_config.style} mobile-sider-drawer-menu ${menuActive ? "active" : ""}`}
      >
          <div ref={stickyWrapRef} className="sticky-header main-bar-wraper navbar-expand-lg">
          <div ref={mainBarRef} className="main-bar ui-glass-surface" style={{ maxWidth: "100%" }}>
            <div className="container-fluid clearfix">
              <div className="logo-header">
                <div className="logo-header-inner logo-header-one">
                  <NavLink to={publicUser.HOME1}>
                    <JobZImage src="images/UniCX-logo.gif" alt="" />
                  </NavLink>
                </div>
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                id="mobile-side-drawer"
                data-target=".header-nav"
                data-toggle="collapse"
                type="button"
                className="navbar-toggler collapsed"
                onClick={handleNavigationClick}
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar icon-bar-first" />
                <span className="icon-bar icon-bar-two" />
                <span className="icon-bar icon-bar-three" />
              </button>

              <div className="nav-animation header-nav navbar-collapse collapse d-flex justify-content-center">
                  <button
                    type="button"
                    className="close-menu-btn"
                    onClick={handleNavigationClick}
                  >
                    &times;
                  </button>

                  <div
                    className="nav-header-wrap"
                  >
                    <ul className="nav navbar-nav">
                      {loading
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <li
                              key={`cat-skeleton-${index}`}
                              className="header-cat-skeleton-item"
                              aria-hidden="true"
                            >
                              <div className="header-cat-skeleton-link">
                                <Skeleton
                                  width={`${96 + (index % 3) * 24}px`}
                                  height="18px"
                                  className="header-cat-skeleton-text"
                                />
                                <Skeleton
                                  width="24px"
                                  height="24px"
                                  circle
                                  className="header-cat-skeleton-icon"
                                />
                              </div>
                            </li>
                          ))
                        : navCategories.map((category) => {
                          const categorySubs = getSubsForCategory(category._id);
                          return (
                            <li
                              key={`cat-${category._id}`}
                              className={`${categorySubs.length > 0 ? "has-child" : ""}`}
                              onMouseEnter={() => {
                                if (window.innerWidth > 991) {
                                  openNavHeaderForCategory(category._id);
                                }
                              }}
                            >
                              <NavLink
                                className={`header-cat-link ${
                                  navHeaderOpen && navHeaderCategoryId === category._id
                                    ? "is-open"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (window.innerWidth <= 991) {
                                    setMenuActive(false);
                                  }
                                  openNavHeaderForCategory(category._id);
                                }}
                              >
                                <span
                                  className={`header-cat-link-text ${
                                    navHeaderOpen &&
                                    navHeaderCategoryId === category._id
                                      ? "is-open"
                                      : ""
                                  }`}
                                >
                                  {category.name}
                                </span>
                                <span
                                  className={`header-cat-link-icon ${
                                    navHeaderOpen &&
                                    navHeaderCategoryId === category._id
                                      ? "is-open"
                                      : ""
                                  }`}
                                >
                                  <RiArrowDownSLine className="icon-toggle" />
                                </span>
                              </NavLink>
                            </li>
                          );
                        })}
                    </ul>
                   
                  </div>
                    
                </div>

              {/* Right Nav */}
              <div className="extra-nav header-2-nav">
                <div className="extra-cell">
                  <div className="header-search">
                    <a
                      href="#"
                      className="header-search-icon"
                      role="button"
                      tabIndex="0"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/trademark-search");
                        setMenuActive(false);
                      }}
                    >
                      <div className="twm-header-search-loader" aria-hidden="true">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                          <defs>
                            <mask id="twm-header-search-clipping">
                              <polygon points="0,0 100,0 100,100 0,100" fill="black" />
                              <polygon points="25,25 75,25 50,75" fill="white" />
                              <polygon points="50,25 75,75 25,75" fill="white" />
                              <polygon points="35,35 65,35 50,65" fill="white" />
                              <polygon points="35,35 65,35 50,65" fill="white" />
                              <polygon points="35,35 65,35 50,65" fill="white" />
                              <polygon points="35,35 65,35 50,65" fill="white" />
                            </mask>
                          </defs>
                        </svg>
                        <div className="twm-header-search-loader-box" />
                      </div>
                    </a>
                  </div>
                </div>
                <div className="extra-cell">
                  <div className="header-nav-btn-section">
                    <div className="twm-nav-btn-left">
                      <ActionButton
                        as={NavLink}
                        className="header-glass-cta"
                        to={publicUser.pages.CONTACT}
                        onClick={handleDropdownClick}
                      >
                        <FcCallback className="font-icon-contact" />
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
                        <span className="twm-nav-action-label">Sign In</span>
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Site Search */}
          <div id="search">
            <span className="close" />
            <TrademarkSearch />
          </div>
        </div>
      </header>
      {navHeaderOpen && (
        <button
          type="button"
          className="navheader-overlay"
          onClick={closeNavHeader}
          aria-label="Close menu"
        />
      )}
       <NavHeader
                      isVisible={navHeaderOpen}
                      activeCategoryId={navHeaderCategoryId}
                      panelTop={navHeaderTop}
                      categories={navCategories}
                      subCategories={navSubCategories}
                      services={navServices}
                      onRequestClose={closeNavHeader}
                    />
    </>
  );
}
export default Header1;
