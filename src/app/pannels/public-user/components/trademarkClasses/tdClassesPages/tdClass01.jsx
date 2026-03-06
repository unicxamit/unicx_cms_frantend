import React, { useState, useEffect, useRef } from "react";
// 8931955546
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Tag } from "lucide-react";
import {
  FaCheckCircle,
  FaCubes,
  FaFlask,
  FaIndustry,
  FaMicroscope,
  FaSeedling,
  FaTimesCircle,
  FaTools,
} from "react-icons/fa";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";

import { BiSolidMessageRounded } from "react-icons/bi";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { BiArrowToBottom, BiArrowToTop } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";
import { PlayCircle, X } from "lucide-react";
import contact from "../tdClassImages/contact us.png";
import { PiArrowElbowRightUpThin } from "react-icons/pi";
import {
  Globe2,
  AlertTriangle,
  Layers,
  Landmark,
  ShieldCheck,
  FileText,
  DollarSign,
  Gavel,
  UserCheck,
  Activity,
  Gift,
  Store,
} from "lucide-react";
import {
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaUserCircle,
} from "react-icons/fa";
import { LuMessageSquareShare } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
// import whoshould from "../tdClassImages/whoshouldregister.jpg";
import whoshould from "../tdClassImages/whoshouldregister.jpg";
import whoshould02 from "../tdClassImages/whoshouldregister02.png";
import whoshould03 from "../tdClassImages/whoshouldregister03.png";
import whoshould04 from "../tdClassImages/whoshouldregister04.jpg";

import whychooseus02 from "../tdClassImages/whychooseus.png";

import benifite from "../tdClassImages/benifite02.png";

import "../tdClassCss/tdClasscss.css";
import experties from "../tdClassImages/ourExpertiese04.png";

import JobZImage from "../../../../../common/jobz-img";
import whychoosus from "../tdClassImages/Quality.jpg";
import process01 from "../tdClassImages/2.png";
import process02 from "../tdClassImages/3.png";
import process03 from "../tdClassImages/4.png";
import process04 from "../tdClassImages/5.png";
import process05 from "../tdClassImages/1.png";
import classesData from "./tradmarkClassesDynamicDataList";
import { publicUser } from "../../../../../../globals/route-names";
import Loader from "../../../../../common/loader";

const classes = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  label: `C-${i + 1}`,
}));
const TdClass01 = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cls, setCls] = useState(null);
  const navigate = useNavigate();
  // fetch data
  const { id } = useParams();
  // tabbar section
  const sections = [
    { id: "class1", label: `Class ${cls?.class}` },
    { id: "included", label: "Goods/Guide" },
    { id: "expertise", label: "Expertise" },
    { id: "eligibility", label: "Who Should Register" },
    { id: "benefits", label: "Benefits" },
    { id: "process", label: "Process" },
    { id: "whyus", label: "Why Choose Us" },
    { id: "faq", label: "FAQ" },
  ];

  // Refs
  const heroRef = useRef(null);
  const sectionRefs = useRef({});
  const tabBarRef = useRef(null);

  

  const [activeTab, setActiveTab] = useState(sections[0].id);
  const [showTabBar, setShowTabBar] = useState(false);

  const getTabBarHeight = () => {
    return tabBarRef.current ? tabBarRef.current.offsetHeight : 0;
  };

  const handleScroll = () => {
    if (heroRef.current) {
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setShowTabBar(heroBottom <= 100);
    }

    const activationOffset = 200;

    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionEl = sectionRefs.current[sections[i].id];
      if (sectionEl) {
        const secTop = sectionEl.getBoundingClientRect().top;

        if (secTop <= activationOffset) {
          setActiveTab(sections[i].id);
          break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const ref = sectionRefs.current[id];
    if (ref) {
      const tabBarHeight = tabBarRef.current
        ? tabBarRef.current.offsetHeight
        : 0;

      const safetyMargin = 180;

      const top = ref.offsetTop + tabBarHeight - safetyMargin;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
      setActiveTab(id);
    }
  };

  /* ... (rest of the component) ... */

  // ḍynamic image change for who should register section
  const images = [whoshould, whoshould03, whoshould04, whoshould02];
  const [currentImage, setCurrentImage] = useState("");
  // console.log(currentImage, "current image");
  useEffect(() => {
    // 🔹 When class changes or page reloads, pick random image
    if (cls) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentImage(images[randomIndex]);
    }
   
  }, [cls]);

  // search filter product
  const filteredProductList = cls?.productList?.map((category) => {
    const filteredSubcategories = category.subcategories?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      ...category,
      subcategories: filteredSubcategories,
    };
  });
  useEffect(() => {
    if (!id) return;

    const selectedClassData = classesData.find(
      (c) => String(c.id) === String(id)
    );
    // console.log(selectedClassData, "selected class data from id");
    setCls(selectedClassData);
  }, [id]);

  // fetch data


  const handleClassClick = (cls) => {
    navigate(`${publicUser?.tdclasses?.TdClass01}/${cls.id}`);

    const selectedClassData = classesData.find(
      (c) => String(c.id) === String(cls.id)
    );

    setCls(selectedClassData);
  };

  const handleClassClickExcludeGoods = (classNumber) => {
    // Step 1: Find class data by matching class number
    const selectedClassData = classesData.find(
      (c) => String(c.title) === String(classNumber)
    );
    console.log(selectedClassData, "selecteddata");
    if (!selectedClassData) {
      console.warn("No class found for class number:", classNumber);
      return;
    }

    // Step 2: Navigate using the ID from the selected class
    navigate(`${publicUser?.tdclasses?.TdClass01}/${selectedClassData.id}`);

    // Step 3: Update current class state
    setCls(selectedClassData);

    // Step 4: Smooth scroll to #excluded section
    setTimeout(() => {
      const section = sectionRefs.current["excluded"];
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 300); // delay ensures DOM is ready
  };

  // goods product

  const gridRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Configuration Constants
  
  const COLUMNS = 2;
  // Scroll by 1.5 rows worth of items (1.5 * 4 = 6 items)
  const ITEMS_PER_CLICK = 10;

  // Calculates the height of a single product row (item height + row gap)
  const getRowHeight = () => {
    const grid = gridRef.current;
    if (!grid) return 0;

    // Find the first product item to measure its height
    const firstItem = grid.querySelector(".product-item");
    if (!firstItem) return 0;

    const itemHeight = firstItem.getBoundingClientRect().height;
    const styles = window.getComputedStyle(grid);
    // Get the grid gap value
    const rowGap = parseFloat(styles.gap || "0");

    const totalHeight = itemHeight + (Number.isNaN(rowGap) ? 0 : rowGap);
    // Use Math.ceil for accurate scrolling past boundaries
    return Math.ceil(totalHeight);
  };

  // Scrolls the grid up or down by a set number of items/rows
  const scrollByItems = (direction) => {
    const grid = gridRef.current;
    if (!grid) return;

    // Calculate how many rows to scroll
    const rowsToScroll = Math.ceil(ITEMS_PER_CLICK / COLUMNS);
    const delta = Math.round(rowsToScroll * getRowHeight() * direction);

    const maxTop = grid.scrollHeight - grid.clientHeight;
    const nextTop = Math.min(Math.max(0, grid.scrollTop + delta), maxTop);

    grid.scrollTo({ top: nextTop, behavior: "smooth" });

    // Update button states after scroll finishes (needed for smooth behavior)
    setTimeout(updateButtons, 300);
  };

  // Checks and updates the scroll state (isAtTop, isAtBottom)
  const updateButtons = () => {
    const grid = gridRef.current;
    if (!grid) return;

    const { scrollTop, scrollHeight, clientHeight } = grid;

    // Using a small tolerance for better cross-browser compatibility
    setIsAtTop(scrollTop <= 1);
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 2);
  };

  const scrollUp = () => {
    if (!isAtTop) scrollByItems(-1);
  };

  const scrollDown = () => {
    if (!isAtBottom) scrollByItems(1);
  };

  // Attach scroll event listener for manual scroll detection
  useEffect(() => {
    updateButtons();

    const grid = gridRef.current;
    if (!grid) return;

    // Attach scroll event listener for manual scrolling (mouse wheel, etc.)
    grid.addEventListener("scroll", updateButtons);

    // Cleanup: Remove the listener on unmount
    return () => {
      grid.removeEventListener("scroll", updateButtons);
    };
    // Re-run the effect if content changes
  }, [filteredProductList]);
  // goods products

  // tab bar section
  const slides = [
    {
      img: process01,
    },
    {
      img: process02,
    },
    {
      img: process03,
    },
    {
      img: process04,
    },
    {
      img: process05,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleBulletClick = (index) => {
    setCurrentIndex(index);
  };
  const testimonials = [
    {
      company: "ZEDMAX TECHNO Pvt. Ltd.",
      rating: 5,
      text: "We got our company registered within just a few days! The process was smooth, transparent, and the team guided us through every step. Highly professional service.",
      name: "Arjun",
      role: "Founder, ZEDMAX TECHNO Pvt. Ltd.",
    },
    {
      company: "MAK Technologies",
      rating: 4.5,
      text: "We availed their trademark filing service, and it was a seamless experience. They explained everything clearly and handled all the paperwork efficiently. Highly recommended!",
      name: "A. Murali Krishna Reddy",
      role: "Managing Director,MAK Technologies",
    },
    {
      company: "Zee Doors",
      rating: 4.5,
      text: "Their team helped us with both company incorporation and trademark registration. They are knowledgeable and always available to answer queries. Excellent support!",
      name: "Ratanlal Chowdary",
      role: "CEO, Zee Doors",
    },
    {
      company: "RHAZEN IT Solutions Pvt Ltd",
      rating: 4,
      text: "We used their copyright registration service for our digital designs. The process was easy, and they handled all legal formalities quickly and professionally.",
      name: "Mohammed Abdul Haseeb",
      role: "Creative Head, RHAZEN IT Solutions Pvt Ltd",
    },
    {
      company: "Star Fox",
      rating: 4.5,
      text: "From trademark search to final registration, their legal team took care of everything. We didn’t have to worry about any documentation. Truly hassle-free experience!",
      name: "Katsuya Eguchi",
      role: "Co-founder, Star Fox",
    },
    {
      company: "Flavour Bucket Pvt. Ltd.",
      rating: 3.5,
      text: "Their company registration service is excellent. The team guided us through every compliance requirement and made the entire process effortless.",
      name: "Farhan Khan",
      role: "COO, Flavour Bucket Pvt. Ltd.",
    },
    {
      company: "Anison Biotech Privated Limited",
      rating: 5,
      text: "Our trademark registration was approved in one go! Their legal experts made sure our brand was fully protected. Reliable and trustworthy service.",
      name: "Andy Anison",
      role: "Founder, Anison Biotech Privated Limited",
    },
    {
      company: "Burhani Wood Works",
      rating: 4,
      text: "We approached them for copyright registration for our training material. The process was quick and affordable. Great experience overall!",
      name: "Hakimuddin Akberali Khokawala",
      role: "Director, Burhani Wood Works",
    },
  ];

  const [currentIndex2, setCurrentIndex2] = useState(0);

  const nextSlide = () => {
    setCurrentIndex2((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex2(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // faq section

  const [openIndex, setOpenIndex] = useState(null);
  const faqRefs = useRef([]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  useEffect(() => {
    faqRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.maxHeight =
          openIndex === index ? ref.scrollHeight + "px" : "0px";
      }
    });
  }, [openIndex]);

  
  const [isOpen, setIsOpen] = useState(false);

  const styles = {
    card: {
      // maxWidth: "400px",
      padding: "1rem 0 0 0",
      marginLeft: "0",
      // border: "1px solid red",
    },
    heading: {
      textAlign: "left",
      fontSize: "2rem",
      fontWeight: 600,
      // color: "#1976d2",/
      marginBottom: "1rem",
    },
    list: {
      listStyle: "none",
      padding: "0 0 0 0.5rem",
    },
    listItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      padding: "0.5rem 0",
      cursor: "pointer",
    },
    text: {
      fontSize: "1rem",
      color: "#333",
    },
    icon: {
      fontSize: "1.3rem",
    },
  };
  if (!cls) {
    return <Loader/>;
  }

  return (
    <main>
      <div
        className="nav-section"
        style={{
          transform: showTabBar ? "translateY(80px)" : "translateY(-100%)",
          opacity: showTabBar ? 1 : 0,
        }}
      >
        <aside className="nav-bar hero-container-wrapper ">
          <div className="nav-container">
            <ul className="nav-list">
              {sections.map((tab) => (
                <li
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? "nav-active" : ""
                    }`}
                  onClick={() => scrollToSection(tab.id)}
                >
                  <span className="nav-label">{tab.label}</span>
                  <span
                    className={`nav-underline ${activeTab === tab.id ? "active" : ""
                      }`}
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div
        ref={heroRef}
        className="hero-section"
        id="hero-section"
        // style={{ borderBottom: "1px solid #e0e0e0" }}
      >
        <div className="hero-container-wrapper">
          <div className="hero-container">
            {/* Left Content */}
            <div>
              <nav class="breadcrumb">
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/trademark-classes">Trademark</a>
                  </li>
                  <li className="active">Class {cls?.class}</li>
                </ul>
              </nav>
              <div className="hero-lefts">
                <h1 className="class-heading">
                  {cls?.heroTitle} <br />
                  <span className="highlight">
                    Trademark <span>Class {cls?.class}</span>
                  </span>
                </h1>

                <p className="hero-descs">
                  UniCX provides trusted guidance and a clear process to help
                  fashion brands protect their trademarks.
                </p>

                <div className="btn-group">
                  <button className="btn-primarys">
                    Get Started
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 m-1 "
                    >
                      <path
                        d="M9.5 1.5L1.5 9.5"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M9.5 8.83571V1.5H2.16429"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="btn-outlines"
                  >
                    <PlayCircle className="icon" /> Watch Demo
                  </button>
                </div>


                {/* Search Bar */}
                <div
                  style={{
                    position: "relative",
                    // height: "500px",
                    margin: "2rem auto",
                  }}
                >
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Find another class (e.g., 'Class 9')"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 200)
                      }
                      className="search-input"
                    />
                    <button className="search-btn">
                      <span className="icon">
                        <IoSearch size={18} />
                      </span>{" "}
                      Search
                    </button>
                  </div>

                  {showDropdown && (
                    <div className="hero-search-dropdown">
                      {classes?.map((cls, index) => (
                        <div
                          key={index}
                          className="hero-search-dropdown-item"
                          onMouseDown={() => handleClassClick(cls)}
                        >
                          {cls?.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="contact-form-card">
              <h3 style={{ color: "black" }}>Get in Touch</h3>
              <form>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your Name" required />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  required
                />
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="How can we help?"
                  required
                  defaultValue={""}
                />
                <button type="submit">
                  <LuMessageSquareShare
                    size={28}
                    style={{ padding: "0 0.2rem 0 0" }}
                  />{" "}
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div className="text-divider">
            <span>
              Trusted by Businesses and Recognized by Leading Industry Bodies
            </span>
          </div>
          <div className="footer-images">
            <JobZImage src="images/footer1/1.png" alt="image" />
            <JobZImage src="images/footer1/2.png" alt="image" />
            <JobZImage src="images/footer1/3.png" alt="image" />
            <JobZImage src="images/footer1/Customer4.2.png" alt="image" />
            <JobZImage src="images/footer1/4.3.png" alt="image" />
            <JobZImage src="images/footer1/6.2.png" alt="image" />
          </div>
          {/* Modal */}
          {isOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button
                  onClick={() => setIsOpen(false)}
                  className="modal-close"
                >
                  <X className="icon" />
                </button>
                <div className="video-wrapper">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Demo Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <section style={{ marginTop: "5rem" }}>
        <div
          className="understad-section"
          // style={{ border: "1px solid red" }}
          id="class1"
          ref={(el) => (sectionRefs.current["class1"] = el)}
        >
          <div className="hero-container-wrapper">
            <h2 class="understand-heading ">
              Understanding-Trademark <span>Class {cls?.class}</span>
            </h2>
            <div className="understading-grid ">
              {/* <div> */}
              <p
                className="understading-text"
                style={{ color: "#333333", textAlign: "justify" }}
              >
                <p>
                  {cls?.understanding
                    .split(" ")
                    .slice(
                      0,
                      Math.floor(cls?.understanding.split(" ").length / 2)
                    )
                    .join(" ")}
                </p>
                <p style={{ display: "block", marginTop: "5px" }}>
                  {cls?.understanding
                    .split(" ")
                    .slice(Math.floor(cls?.understanding.split(" ").length / 2))
                    .join(" ")}
                </p>
              </p>
              {/* </div> */}
              <div className="understading-image">
                <img src={cls?.img1} alt="" className="image-styles" />
              </div>
            </div>
          </div>
        </div>

        {/* <section className="include-section"> */}
        <div
          id="included"
          ref={(el) => (sectionRefs.current["included"] = el)}
          className="main-section"
        // style={{ border: "1px solid red" }}
        >
          <div class="inner-section hero-container-wrapper">
            <h2 class="heading">
              <span className="heading-span">Tradmark Class {cls?.class}</span>
              Goods Guide
            </h2>
            <p className="sub-heading">
              Everything you need to know about Class {cls?.class} goods.
            </p>
            <div class="grid-layout">
              <div className="left-contents">
                <p
                  className="include-goods-list-heading"
                  style={{
                    marginBottom: "1rem",
                    // border: "1px solid red",
                    textAlign: "left",
                  }}
                >
                  This <span style={{ color: "#1967D2" }}>Class</span> includes,
                  in particular:
                </p>
                <ul className="custom-list">
                  {cls?.includeGoods?.map((item, index) => (
                    <li key={item.id}>
                      <FaCheckCircle
                        color="#4ade80"
                        size={20}
                        className="check-icon"
                      />
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div class="right-content">
                <span class="subheadingss">
                  Class {cls?.class} Goods: List and Guide
                </span>
                <div className="search-bars">
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search for products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-btn">
                      <span className="icon">
                        <IoSearch size={18} />
                      </span>{" "}
                      Search
                    </button>
                  </div>
                </div>
                <div className="right-container">
                  <div className="grid-items-scrollable" ref={gridRef}>
                    {filteredProductList?.length > 0 ? (
                      filteredProductList?.map((category) => (
                        <React.Fragment key={category.id}>
                          <div className="category-title-container">
                            <h2 className="category-title">{category?.name}</h2>
                          </div>
                          {category.subcategories?.length > 0 ? (
                            category.subcategories.map((item) => (
                              <div key={item.id} className="product-item">
                                <h3 className="product-name">{item?.name}</h3>
                              </div>
                            ))
                          ) : (
                            <div
                              style={{
                                textAlign: "center",
                                padding: "20px",
                                color: "red",
                              }}
                            >
                              No products found
                            </div>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          color: "red",
                        }}
                      >
                        No products found.
                      </div>
                    )}
                  </div>

                  <div
                    className="scroll-buttons"
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className={`scroll-btn ${isAtTop ? "disabled" : "active"
                        }`}
                      onClick={scrollUp}
                      style={{
                        color: "#fff",
                        background: isAtTop ? "" : "",
                        color: isAtTop ? "#666" : "#1967D2",
                        // border: "1px solid #ccc",
                        cursor: isAtTop ? "not-allowed" : "pointer",
                      }}
                    >
                      <IoChevronUpOutline size={18} />
                    </div>
                    <div
                      className={`scroll-btn ${isAtBottom ? "disabled" : "active"
                        }`}
                      onClick={scrollDown}
                      style={{
                        background: isAtBottom ? "" : "",
                        color: isAtBottom ? "#666" : "#1967D2",
                        // border: "1px solid #ccc",
                        cursor: isAtBottom ? "not-allowed" : "pointer",
                      }}
                    >
                      <IoChevronDownOutline size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* exclude class and its goods  */}
        <div className="exclude-section">
          <div className="hero-container-wrapper">
            <div className="exclude-goods">
              <div>
                <p
                  className="include-goods-list-heading"
                  style={{
                    marginBottom: "1.3rem",

                    textAlign: "left",
                  }}
                >
                  Items Not Included in This{" "}
                  <span style={{ color: "#1967D2" }}>Class</span>
                </p>
                <ul style={styles.list}>
                  {cls?.excludeGoods?.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      <span style={styles.icon}>
                        {item.included ? (
                          <FaCheckCircle color="#28a745" />
                        ) : (
                          <FaTimesCircle color="#f44336" />
                        )}
                      </span>
                      <div>
                        <span style={styles.text}>{item?.name}</span>
                        <span
                          style={{
                            color: "#1967D2",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleClassClickExcludeGoods(item?.coveredUnder)
                          }
                        >
                          -{item?.coveredUnder}.
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* experties */}
        <div
          class="expertise-section"
          id="expertise"
          ref={(el) => (sectionRefs.current["expertise"] = el)}
        >
          <div class=" hero-container-wrapper">
            <div className="hero">
              <div class="benifite-img-container">
                <img
                  src={experties}
                  alt="benifite"
                  className="benifite-image"
                />
              </div>

              {/* Right Side - Content */}
              <div className="hero-content">
                <h2 className="overlines">Our Expertise</h2>
                <p className="headings">A Foundation in Fashion Law </p>
                <p className=" expertise-description">
                  Our legal team is dedicated to the unique challenges and
                  opportunities within the apparel industry. We don't just file
                  paperwork; we provide strategic legal guidance that ensures
                  your brand is protected today and prepared for tomorrow.
                </p>

                {/* Features */}
                <div className="features features-benifite">
                  <div className="">
                    <div className="expertise-feature">
                      <div className="expertise-features-text">
                        <ShieldCheck className="feature-icons" />
                        <h4 className="feature-titles">
                          Trademark Nuances
                        </h4>{" "}
                      </div>

                      <p className="expertise-feature-text">
                        In-depth knowledge of Class 25 goods & services to
                        safeguard your apparel brand.
                      </p>
                    </div>
                    <div className="expertise-feature">
                      <div className="expertise-features-text">
                        <Landmark className="feature-icons" />
                        <h4 className="feature-titles">
                          Complete Legal Landscape
                        </h4>
                      </div>
                      <p className="expertise-feature-text">
                        Comprehensive navigation of the fashion law ecosystem to
                        secure long-term protection.
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <div className="expertise-feature">
                      <div className="expertise-features-text">
                        <AlertTriangle className="feature-icons" />
                        <h4 className="feature-titles">
                          Conflict Anticipation
                        </h4>
                      </div>
                      <p className="expertise-feature-text">
                        Strategies to foresee and mitigate potential brand
                        conflicts.
                      </p>
                    </div>
                    <div className="expertise-feature">
                      <div className="expertise-features-text">
                        <Layers className="feature-icons" />
                        <h4 className="feature-titles">Brand Identity</h4>
                      </div>
                      <p className="expertise-feature-text">
                        Building a strong, defensible brand identity in a
                        competitive market.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* benefits section */}

        <div
          class="features-section-whychoose"
          id="eligibility"
          ref={(el) => (sectionRefs.current["eligibility"] = el)}
        >
          <div className="hero-container-wrapper">
            <div className="features-header-whychoose">
              <h1 className="main-title-whychoose">
                Who Should Register Under Trademark
                <span style={{ color: "#1967D2", padding: "0 0.2rem 0 .2rem" }}>
                  Class {cls?.class}
                </span>
              </h1>
              <p className="subtitle-whychoose">
                {cls?.whoShouldRegisterDescription}
              </p>
            </div>
            <div className="features-container-whychoose">
              {/* Left Features */}
              <div className="features-list-whychoose">
                {cls?.whoShouldRegister?.map((items, index) => (
                  <div key={items.id} className="feature-item-whychoose">
                    {items.icon}
                    <div>
                      <h3 className="feature-title-whychoose">
                        {items?.heading}
                      </h3>
                      <p className="feature-text-whychoose">
                        {items?.subheading}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Right Image */}
              <div className="features-image-whychoose">
                <div className="placeholder-whychoose">
                  <img
                    src={currentImage}
                    alt="why choose"
                    className="placeholder-icon-whychoose"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* contactUs */}
        <div className="cta-hero">
          <div className="cnt hero-container-wrapper">
            <div className="lefts">
              <p className="overline">
                Trademark law is complex. Let's get you the answers you need.
              </p>
              <h1 id="cta-title" className="main-headings">
                Schedule a<br />
                Free Consultation
              </h1>
            </div>

            <img src={contact} alt="contactUs" className="contact-us-img" />
            <div className="rights" aria-label="Call to action">
              <p className="subheading">Still have questions?</p>
              <div
                className="cta-actions"
                role="group"
                aria-label="Call to action buttons"
              >
                <button
                  className=" btn   contactUs-btn-primary"
                  onClick={() => (window.location = "#book")}
                >
                  Book Free Consult
                </button>
                <button
                  className="btn btn-secondarys"
                  onClick={() => (window.location = "#learn")}
                >
                  Learn More
                </button>
              </div>
              <div className="footnote">
                <div>
                  “After your consultation, we’ll provide a tailored
                  action plan.”
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* benifite section */}

        <div
          class="benefits-section"
          id="benefits"
          ref={(el) => (sectionRefs.current["benefits"] = el)}
        >
          <div className="hero-container-wrapper">
            <div className="benefits-second-div">
              <div class="benefits-header">
                <h3 class="benefits-titles">
                  Benefits of Trademarking Your Brand
                </h3>
                <p class="benefits-subtitle">
                  A trademark isn’t just a legal step-it’s a strategic
                  investment that protects, strengthens, and grows your brand.
                </p>
              </div>

              <div class="benefits-main-content">
                <div class="features-grid">
                  <div class="feature-item-left">
                    <div class="feature-inner">
                      <UserCheck className="feature-icon" />
                      <h3 class="feature-title">Gain Exclusive Ownership</h3>
                      <p class="feature-description">
                        Secure the exclusive right to your brand name and logo,
                        keeping competitors at bay.
                      </p>
                    </div>

                    <div class="feature-inner">
                      <ShieldCheck className="feature-icon" />
                      <h3 class="feature-title">Protect Your Reputation</h3>
                      <p class="feature-description">
                        Ensure your brand identity stays unique, trustworthy,
                        and credible in the marketplace.
                      </p>
                    </div>
                  </div>

                  <div class="feature-item-bottom">
                    <Tag className="feature-icon" />
                    <h3 class="feature-title">Identifies Source</h3>
                    <p class="feature-description">
                      Shows who makes or provides the product/service so
                      customers know the origin.
                    </p>
                  </div>

                  <div class="feature-item-right">
                    <div class="feature-inner">
                      <ShieldCheck className="feature-icon" />
                      <h3 class="feature-title">Legal Protection</h3>
                      <p class="feature-description">
                        Gives the owner the right to stop others from using
                        similar marks.
                      </p>
                    </div>

                    <div class="feature-inner">
                      <Gavel className="feature-icon" />
                      <h3 class="feature-title">Power of Legal Action</h3>
                      <p class="feature-description">
                        Enforce your rights against unauthorized use and defend
                        your brand effectively.
                      </p>
                    </div>
                  </div>

                  <div class="center-image-container">
                    <div class="image-wrapper">
                      <img
                        src={benifite}
                        alt="SHIFT Hat"
                        class="center-image"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="twm-read-more" style={{ marginTop: "1rem" }}>
                <div class="site-button">Book Call</div>
              </div>
            </div>
          </div>
        </div>

        {/* Process of Registration */}

        <div
          class="registration-process-main"
          id="process"
          ref={(el) => (sectionRefs.current["process"] = el)}
        >
          <h2 class="process-title">Process Of Registration</h2>
          <div className="registration-process">
            <div class="process-image-container">
              <img
                src={slides[currentIndex].img}
                alt={`Slide ${currentIndex + 1}`}
                class="process-image"
              />
            </div>

            <div class="process-content">
              <div class="bullets-and-text">
                <div class="bullet-container">
                  {slides.map((_, index) => (
                    <span
                      key={index}
                      onClick={() => handleBulletClick(index)}
                      class={`bullet ${currentIndex === index
                          ? "bullet-active"
                          : "bullet-inactive"
                        }`}
                    ></span>
                  ))}
                </div>
                <div class="process-steps-list">
                  <div>
                    <span className="process-number">01</span>
                    <p class="process-step">Trademark Search</p>
                  </div>
                  <div>
                    <span className="process-number">02</span>
                    <p class="process-step">Filling The Application</p>
                  </div>

                  <div>
                    <span className="process-number">03</span>
                    <p class="process-step">Examination</p>
                  </div>

                  <div>
                    <span className="process-number">04</span>
                    <p class="process-step">Public Review</p>
                  </div>

                  <div>
                    <span className="process-number">05</span>
                    <p class="process-step">Final Registration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial  */}
        <div className="testimonial-main-container-wrapper">
          <div className="hero-container-wrapper">
            <div className="testimonials-container">
              <div>
                <div className="testimonials-header">
                  <h2 className="testimonial-title">Customer testimonials</h2>
                  <p className="subtitle">
                    Real experiences from clients who built their brands with us
                  </p>
                </div>
              </div>

              <div>
                <div className="testimonials-sliders-wrapper">
                  <div
                    className="testimonials-sliders"
                    style={{
                      transform: `translateX(-${currentIndex2 * 91}%)`,
                    }}
                  >
                    {testimonials.map((t, index) => (
                      <div key={index} className="testimonial-cards">
                        <h3 className="company">{t.company}</h3>
                        <div className="stars">
                          {Array.from({ length: t.rating }, (_, i) => (
                            <FaStar key={i} color="#facc15" />
                          ))}
                        </div>
                        <p className="testimonial-text">“{t.text}”</p>
                        <div className="testimonial-user">
                          <FaUserCircle size={40} />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span className="user-name">{t.name}</span>
                            <span className="user-role">{t.role}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="testimonial-bdt">
                  <div className="dots">
                    {testimonials.map((_, i) => (
                      <span
                        key={i}
                        className={`dot ${i === currentIndex2 ? "active" : ""}`}
                      ></span>
                    ))}
                  </div>
                  <div className="testimonial-controls">
                    <button onClick={prevSlide} className="nav-btn">
                      <VscChevronLeft size={24} />
                    </button>
                    <button onClick={nextSlide} className="nav-btn">
                      <VscChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* whay choose us */}

        <div
          className="how-it-works-section"
          // style={{ border: "1px solid red" }}
          id="whyus"
          ref={(el) => (sectionRefs.current["whyus"] = el)}
        >
          <div className="hero-container-wrapper">
            {/* Section Header */}
            <div className="how-it-works-header">
              <h1 className="how-it-works-title">Why Choose Us?</h1>
              <p className="how-it-works-subtitle">
                We go beyond paperwork—we become your partner in protecting and
                growing your fashion brand. With clarity, transparency, and
                forward-thinking strategies, we bring both legal expertise and a
                modern approach to your journey.
              </p>
            </div>

            {/* Content Grid */}
            <div className="how-it-works-content">
              {/* Left Image */}
              <div className="how-it-works-image">
                <img src={whychoosus} alt="Placeholder" />
              </div>

              {/* Right Steps */}
              <div className="how-it-works-steps">
                <div className="how-it-works-card">
                  <div className="how-it-works-number">1</div>
                  <div>
                    <h3 className="how-it-works-card-title">
                      Tailored Strategies That Fit You
                    </h3>
                    <p className="how-it-works-card-text">
                      Whether launching a single product or scaling a full line,
                      we craft legal solutions aligned with your vision.
                    </p>
                  </div>
                </div>

                <div className="how-it-works-grid">
                  <div className="how-it-works-card">
                    <div className="how-it-works-number">2</div>
                    <div>
                      <h3 className="how-it-works-card-title">
                        Transparent, Predictable Cost
                      </h3>
                      <p className="how-it-works-card-text">
                        Fixed-fee services mean no surprises—just clarity,
                        value, and peace of min
                      </p>
                    </div>
                  </div>

                  <div className="how-it-works-card">
                    <div className="how-it-works-number">3</div>
                    <div>
                      <h3 className="how-it-works-card-title">
                        Expert Legal Guidance
                      </h3>
                      <p className="how-it-works-card-text">
                        Professional support for company, trademark, and
                        copyright services.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="how-it-works-card">
                  <div className="how-it-works-number">4</div>
                  <div>
                    <h3 className="how-it-works-card-title">
                      {" "}
                      End-to-End Guidance
                    </h3>
                    <p className="how-it-works-card-text">
                      From research and filings to USPTO communication, we
                      handle it all so you can stay focused on growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="faq-main-sections"
          // style={{ border: "1px solid red" }}
          id="faq"
          ref={(el) => (sectionRefs.current["faq"] = el)}
        >
          <div className="faqs-containers hero-container-wrapper">
            {/* Left Side */}
            <div className="faqs-lefts">
              <p className="faq-labels">FAQS</p>
              <h2 className="faq-titles">Questions? We're glad you asked</h2>
              <p className="faq-subtitles">{cls?.faqsTitle}</p>
            </div>

            {/* Right Side */}
            <div className="faqs-rights">
              {cls?.faqs?.map((faq, index) => (
                <div
                  key={index}
                  className={`faq-items ${openIndex === index ? "active" : ""}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="faq-questions">
                    <span>
                      {index + 1}. {faq.question}
                    </span>
                    <span className="faq-icons">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </div>
                  <div
                    className="faq-answers-wrapper"
                    ref={(el) => (faqRefs.current[index] = el)}
                  >
                    <div className="faq-answers">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TdClass01;
