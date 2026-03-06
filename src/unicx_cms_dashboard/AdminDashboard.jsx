import React, { useEffect, useState } from "react";
import DashboardSidebar from "./Dashboard_sidebar";
import { Outlet, useLocation } from "react-router-dom";
import "../services/serviceStyle/admin_dashboard.css";

const AdminDashboard = () => {
  const location = useLocation();
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [targetPath, setTargetPath] = useState("");

  const handleRouteChangeStart = (path) => {
    if (!path || path === location.pathname) {
      return;
    }
    setTargetPath(path);
    setIsContentLoading(true);
  };

  useEffect(() => {
    if (!isContentLoading) {
      return;
    }

    if (targetPath && location.pathname !== targetPath) {
      return;
    }

    const timer = setTimeout(() => {
      setIsContentLoading(false);
      setTargetPath("");
    }, 300);

    return () => clearTimeout(timer);
  }, [isContentLoading, location.pathname, targetPath]);

  return (
    <div className="dashboard_layouts">
      <div className="sidebar_wrappers">
        <DashboardSidebar onRouteChangeStart={handleRouteChangeStart} />
      </div>

      <div className={`content_wrappers ${isContentLoading ? "is-loading" : ""}`}>
        {/* {isContentLoading && (
          <div className="content_loading_overlay" aria-live="polite">
            <div className="content_loading_spinner" />
          </div>
        )} */}
        <div className="content_body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
