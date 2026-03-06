import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaTh, FaThList, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../auth/Auth';

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="bg-dark text-white d-flex flex-column justify-content-between p-3"
      style={{ width: '250px', height: '100vh', position: 'fixed', top: '0', left: '0' }}

    >
      {/* Top Menu */}
      <div style={{ paddingTop: '20px' }}>
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'custom-active' : 'text-white'}`}
            >
              <FaTachometerAlt className="me-2" /> Dashboard
            </NavLink>


          </li>
          <li className="nav-item">
            <NavLink to="/admin/add-category" className="nav-link text-white" activeclassname="active">
              <FaTh className="me-2" /> Add Category
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/add-Subcategory" className="nav-link text-white" activeclassname="active">
              <FaThList className="me-2" /> Add Subcategory
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/add-Services" className="nav-link text-white" activeclassname="active">
              <FaThList className="me-2" /> Add Sub-Subcategory
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/add-caseStudy" className="nav-link text-white" activeclassname="active">
              <FaThList className="me-2" /> Add Case-Study
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/add-blogs" className="nav-link text-white" activeclassname="active">
              <FaThList className="me-2" /> Add Blogs
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/add-faqs" className="nav-link text-white" activeclassname="active">
              <FaThList className="me-2" /> Add Faq's
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/users" className="nav-link text-white" activeclassname="active">
              <FaUsers className="me-2" /> Users
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Bottom Logout */}
      <div>
        <button className="btn btn-outline-light w-100" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
