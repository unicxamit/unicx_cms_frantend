import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../unicx_cms_dashboard/AdminDashboard";
import Category from "../services/category";
import Sub_category from "../services/sub_category";
import Services from "../services/sub_sub_category";
import ServicesDetailsPage from "../services/servicesDetailsPage";
import Blogs from "../services/blogs";
import BlogDetails from "../services/blogDetails";
import CaseStudy from "../services/caseStudy";
import CaseStudyDetailsPage from "../services/caseStudyDetails";
import Faq from "../services/faq";
import OrderService from "../services/serviceorder";
import AdminDashboardList from "../services/Dashboard";
import SearchTage from "../services/searchTage";
import Topcompanys from "../services/topcompanys";
import Testimonial from "../services/testimonial";
import FooterContent from "../services/footerContent";
import SocialMediaLink from "../services/socialMediaLink";
import ContactUsList from "../services/contactUsList";
import IndemandService from "../services/indemandService";

function AdminLayout() {
  return (
    <Routes>
      <Route element={<AdminDashboard />}>
        <Route index element={<AdminDashboardList />} />
        <Route path="add-category" element={<Category />} />
        <Route path="add-Subcategory" element={<Sub_category />} />
        <Route path="add-Services" element={<Services />} />
        <Route path="Services-details/:id" element={<ServicesDetailsPage />} />
        <Route path="add-caseStudy" element={<CaseStudy />} />
        <Route path="add-casestudy-details/:id" element={<CaseStudyDetailsPage />} />
        <Route path="add-blogs" element={<Blogs />} />
        <Route path="add-blogs-details/:id" element={<BlogDetails />} />
        <Route path="add-faqs" element={<Faq />} />
        <Route path="service-order" element={<OrderService />} />
        <Route path="service-searchTage" element={<SearchTage />} />
        <Route path="top-companys" element={<Topcompanys />} />
        <Route path="testimonial" element={<Testimonial />} />
        <Route path="footer-details" element={<FooterContent />} />
        <Route path="social-media-link" element={<SocialMediaLink />} />
        <Route path="ContactUs" element={<ContactUsList />} />
        <Route path="indemand-service" element={<IndemandService />} />
      </Route>
    </Routes>
  );
}

export default AdminLayout;
