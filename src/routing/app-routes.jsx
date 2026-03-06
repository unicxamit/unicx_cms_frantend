import { lazy, Suspense } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "../auth/Auth";
import PublicUserLayout from "../layouts/public-user-layout";
import { base } from "../globals/route-names";
import ProtectedRoute from "../auth/protectedRoute";
import LoginPage from "../services/login";

import ServicesDetails from "../app/pannels/public-user/components/pages/SubSubCategoryDetails";
import GlobalSearchBar from "../app/pannels/public-user/components/pages/GlobalSearchBar";
import TrademarkSearchPage from "../app/pannels/public-user/components/pages/TrademarkSearch";

const AdminLayout = lazy(() => import("../layouts/admin-layout"));

function ServicesPageWithKey() {
  const { id } = useParams();
  return <ServicesDetails key={id} />;
}

function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* PUBLIC */}
        <Route path={base.PUBLIC_PRE + "/*"} element={<PublicUserLayout />} />

        {/* ADMIN (LAZY LAYOUT ROUTE) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* PUBLIC ROUTES */}
        <Route path="/subsubcategory/:id" element={<ServicesPageWithKey />} />
        <Route path="/Services/:id" element={<ServicesPageWithKey />} />
        <Route path="/trademark-search" element={<TrademarkSearchPage />} />
        <Route path="/search" element={<GlobalSearchBar />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppRoutes;
