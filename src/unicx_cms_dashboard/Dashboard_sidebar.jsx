import React, { useState } from "react";
import {
  MdChevronRight,
  MdMiscellaneousServices,
  MdOutlineDashboard,
  MdContactSupport,
} from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import { FaQ } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { SiMicrodotblog } from "react-icons/si";
import "../services/serviceStyle/sidebar.css";

const Dashboard_sidebar = ({ onRouteChangeStart }) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  const navigate = useNavigate();

  const startRouteChange = (path) => {
    if (onRouteChangeStart) {
      onRouteChangeStart(path);
    }
  };

  const handleOpenMenu = () => {
    const nextIsOpen = !isServicesOpen;
    setIsServicesOpen(nextIsOpen);

    if (nextIsOpen) {
      startRouteChange("/admin/service-order");
      navigate("/admin/service-order");
    }
  };

  const handleOpenFooterMenu = () => {
    setIsFooterOpen(!isFooterOpen);
  };

  const navClass = ({ isActive }) =>
    `menu_items ${isActive ? "active" : ""}`.trim();

  const dropdownClass = ({ isActive }) =>
    `dropdown_items ${isActive ? "active" : ""}`.trim();

  return (
    <aside className="sidebar_lefts">
      <h1 className="sidebar_header">Unicx Dashboard</h1>
      <div className="sidebar_logos">
        <div className="user_logo">
          U
        </div>
        <div className="brand_meta">
          <span className="brand_name">UNICX CMS</span>
          <small className="brand_subtitle">Admin Console</small>
        </div>
      </div>

      <div className="sidebar_menu_lists">
        <p className="sidebar_section_title">Main</p>
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `sidebar_titles ${isActive ? "active" : ""}`.trim()
          }
          onClick={() => startRouteChange("/admin")}
          end
        >
          <MdOutlineDashboard size={18} style={{ marginTop: "0.3rem" }} />
          Dashboard
        </NavLink>

        <div className="menu_items menu_toggle" onClick={handleOpenMenu}>
          <MdMiscellaneousServices size={18} />
          <span>Services</span>
          <MdChevronRight
            size={22}
            className={`arrows ${isServicesOpen ? "rotate" : ""}`}
          />
        </div>

        <div className={`dropdowns ${isServicesOpen ? "open" : ""}`}>
          <NavLink
            to="/admin/add-category"
            className={dropdownClass}
            onClick={() => startRouteChange("/admin/add-category")}
          >
            Category
          </NavLink>
          <NavLink
            to="/admin/add-Subcategory"
            className={dropdownClass}
            onClick={() => startRouteChange("/admin/add-Subcategory")}
          >
            SubCategory
          </NavLink>
          <NavLink
            to="/admin/add-Services"
            className={dropdownClass}
            onClick={() => startRouteChange("/admin/add-Services")}
          >
            Services
          </NavLink>
          <NavLink
            to="/admin/service-searchTage"
            className={dropdownClass}
            onClick={() => startRouteChange("/admin/service-searchTage")}
          >
            Search Tage
          </NavLink>
          <NavLink
            to="/admin/indemand-service"
            className={dropdownClass}
            onClick={() => startRouteChange("/admin/indemand-service")}
          >
            InDemand Service
          </NavLink>
        </div>

        <p className="sidebar_section_title">Content</p>
        <NavLink
          to="/admin/top-companys"
          className={navClass}
          onClick={() => startRouteChange("/admin/top-companys")}
        >
          <RiAccountCircleLine size={22} /> <span>Top Companys</span>
        </NavLink>
        <NavLink
          to="/admin/add-caseStudy"
          className={navClass}
          onClick={() => startRouteChange("/admin/add-caseStudy")}
        >
          <RiAccountCircleLine size={22} /> <span>Case_study</span>
        </NavLink>
        <NavLink
          to="/admin/testimonial"
          className={navClass}
          onClick={() => startRouteChange("/admin/testimonial")}
        >
          <RiAccountCircleLine size={22} /> <span>Testimonial</span>
        </NavLink>

        <p className="sidebar_section_title">Settings</p>
        <div className="menu_items menu_toggle" onClick={handleOpenFooterMenu}>
          <RiAccountCircleLine size={18} />
          <span>FooterDetails</span>
          <MdChevronRight
            size={22}
            className={`arrows ${isFooterOpen ? "rotate" : ""}`}
          />
        </div>
        <div className={`dropdowns ${isFooterOpen ? "open" : ""}`}>
          <NavLink
            to="/admin/footer-details"
            className={dropdownClass}
            onClick={() => startRouteChange("/admin/footer-details")}
          >
            Address
          </NavLink>

          <NavLink
            to="/admin/social-media-link"
            className={dropdownClass}
            onClick={() => startRouteChange("/admin/social-media-link")}
          >
            SocialMediaLink
          </NavLink>
        </div>
        <NavLink
          to="/admin/ContactUs"
          className={navClass}
          onClick={() => startRouteChange("/admin/ContactUs")}
        >
          <MdContactSupport size={22} /> <span>ContactUs</span>
        </NavLink>

        <NavLink
          to="/admin/add-blogs"
          className={navClass}
          onClick={() => startRouteChange("/admin/add-blogs")}
        >
          <SiMicrodotblog size={22} /> <span>Blog</span>
        </NavLink>

        <NavLink
          to="/admin/add-faqs"
          className={navClass}
          onClick={() => startRouteChange("/admin/add-faqs")}
        >
          <FaQ size={22} /> <span>Faq</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Dashboard_sidebar;
