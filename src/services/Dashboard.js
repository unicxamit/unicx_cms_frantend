import React, { useState, useEffect } from 'react';
import Sidebar from '../layouts/sidebar';
// import { getCategories, getSubCategories, getSubSubCategories } from '../api';
// import { getUsers } from '../api'; // adjust the path if needed
import { getCategories, getSubCategories, getSubSubCategories, getUsers } from '../adminApi';


function AdminDashboardList() {
  const [categoryCount, setCategoryCount] = useState(0);
  const [subcategoryCount, setSubcategoryCount] = useState(0);
  const [ServicesCount, setServicesCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true); // or false as default

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [user, setUser] = useState(null);

  // Fetch counts of categories, subcategories, and Services
  // useEffect(() => {
  //   fetchCategoryCount();
  //   fetchSubcategoryCount();
  //   fetchServicesCount();
  // }, []);


  useEffect(() => {
    fetchCategoryCount();
    fetchSubcategoryCount();
    fetchServicesCount();
    fetchUser(); // Call fetchUser here
  }, []);

  const fetchUser = async () => {
    try {
      const users = await getUsers();
      setUser(users.users[0]); // assuming API returns an array of users
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };


  const fetchCategoryCount = async () => {
    try {
      const data = await getCategories();
      // console.log(data.category,"category data")
      setCategoryCount(data.category.length);  // assuming 'data' is an array of categories
    } catch (error) {
      console.error('Error fetching categories count', error);
    }
  };

  const fetchSubcategoryCount = async () => {
    try {
      const data = await getSubCategories();
      // console.log(data.subcategories,"subcategory data")
      setSubcategoryCount(data.subCategories.length);  // assuming 'data' is an array of subcategories
    } catch (error) {
      console.error('Error fetching subcategories count', error);
    }
  };

  const fetchServicesCount = async () => {
    try {
      const data = await getSubSubCategories();
      // console.log(data.services,"services data")
      setServicesCount(data.services.length);  // assuming 'data' is an array of Services
    } catch (error) {
      console.error('Error fetching Services count', error);
    }
  };

  return (
    <div className="container-fluid py-4 px-4 mt-3">
      <nav
        className="navbar navbar-expand-lg navbar-light px-5"
        style={{
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? '250px' : '80px',
          width: sidebarOpen ? 'calc(100% - 240px)' : 'calc(100% - 80px)',
          zIndex: 1030,
          transition: 'left 0.3s ease, width 0.3s ease',
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-semibold fs-5">Admin Dashboard</h4>

          <div className="d-flex align-items-center gap-3">

            <i className="fas fa-bell fs-5" style={{ cursor: 'pointer' }}></i>

            <i className="fas fa-user-circle fs-5" style={{ cursor: 'pointer' }}></i>
          </div>
        </div>
      </nav>


      <div className="row">
        <div className="container col-md-9 col-lg-10 mt-4">
          <h2 className="mb-4 fw-bold">Hey {user ? user.name : 'User'}</h2>
          <div className="row g-3 align-items-center">
            {/* Category Card */}
            <div className="col-md-4">
              <div
                className="card text-white h-100 shadow rounded-4"
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  minHeight: '140px',
                }}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="text-uppercase fw-semibold mb-2">Categories</h6>
                    <h3 className="fw-bold">{categoryCount}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Subcategory Card */}
            <div className="col-md-4">
              <div
                className="card text-white h-100 shadow rounded-4"
                style={{
                  background: 'linear-gradient(135deg, #43cea2, #185a9d)',
                  minHeight: '140px',
                }}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="text-uppercase fw-semibold mb-2">Subcategories</h6>
                    <h3 className="fw-bold">{subcategoryCount}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Subcategory Card */}
            <div className="col-md-4">
              <div
                className="card text-white h-100 shadow rounded-4"
                style={{
                  background: 'linear-gradient(135deg, #ff758c, #b6ccfe)',
                  minHeight: '140px',
                }}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="text-uppercase fw-semibold mb-2">Services</h6>
                    <h3 className="fw-bold">{ServicesCount}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardList;
