import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { publicUser } from "../globals/route-names";
// import Home2Page from "../app/pannels/public-user/components/home/index2";
// import Home3Page from "../app/pannels/public-user/components/home/index3";
// import Home4Page from "../app/pannels/public-user/components/home/index4";
// import Home5Page from "../app/pannels/public-user/components/home/index5";
// import Home6Page from "../app/pannels/public-user/components/home/index6";
// import Home7Page from "../app/pannels/public-user/components/home/index7";
// import Home8Page from "../app/pannels/public-user/components/home/index8";
// import Home9Page from "../app/pannels/public-user/components/home/index9";
// import Home10Page from "../app/pannels/public-user/components/home/index10";
// import Home11Page from "../app/pannels/public-user/components/home/index11";
// import Home12Page from "../app/pannels/public-user/components/home/index12";
// import Home13Page from "../app/pannels/public-user/components/home/index13";
// import Home14Page from "../app/pannels/public-user/components/home/index14";
// import Home15Page from "../app/pannels/public-user/components/home/index15";
// import Home16Page from "../app/pannels/public-user/components/home/index16";
// import Home17Page from "../app/pannels/public-user/components/home/index17";
// import Home18Page from "../app/pannels/public-user/components/home/index18";

import JobsGridPage from "../app/pannels/public-user/components/jobs/jobs-grid";
import JobsGridMapPage from "../app/pannels/public-user/components/jobs/jobs-grid-map";
import JobsListPage from "../app/pannels/public-user/components/jobs/jobs-list";
import JobDetail1Page from "../app/pannels/public-user/components/jobs/job-detail1";
import JobDetail2Page from "../app/pannels/public-user/components/jobs/job-detail2";
import ApplyJobPage from "../app/pannels/public-user/components/jobs/apply-job";

import EmployersGridPage from "../app/pannels/public-user/components/employers/emp-grid";
import EmployersListPage from "../app/pannels/public-user/components/employers/emp-list";
import EmployersDetail1Page from "../app/pannels/public-user/components/employers/emp-detail1";
import EmployersDetail2Page from "../app/pannels/public-user/components/employers/emp-detail2";

import AboutUsPage from "../app/pannels/public-user/components/pages/about-us";
import PricingPage from "../app/pannels/public-user/components/pages/pricing";
import Error404Page from "../app/pannels/public-user/components/pages/error404";
import FaqPage from "../app/pannels/public-user/components/pages/faq";
import ContactUsPage from "../app/pannels/public-user/components/pages/contact-us";
import UnderMaintenancePage from "../app/pannels/public-user/components/pages/under-maintenance";
import ComingSoonPage from "../app/pannels/public-user/components/pages/coming-soon";
import LoginPage from "../app/pannels/public-user/components/pages/login";
import AfterLoginPage from "../app/pannels/public-user/components/pages/after-login";
import IconsPage from "../app/pannels/public-user/components/pages/icons";
import TestPage1 from "../app/pannels/public-user/components/pages/LLPRegistrationPage";
import TestPage3 from "../app/pannels/public-user/components/pages/LLPRegistrationPage3";
import TestPage4 from "../app/pannels/public-user/components/pages/LLPRegistrationPage4";
import TestPage5 from "../app/pannels/public-user/components/pages/LLPRegistrationPage5";
import AllCalculator from "../app/pannels/public-user/components/calculatorPage/AllCalculator";
import GSTCalculator from "../app/pannels/public-user/components/calculatorPage/GSTCalculator";
import ITRCalculator from "../app/pannels/public-user/components/calculatorPage/ITRCalculator";
import EPFCalculator from "../app/pannels/public-user/components/calculatorPage/EPFCalculator";
import NPSCalculator from "../app/pannels/public-user/components/calculatorPage/NPSCalculator";
import HRACalculator from "../app/pannels/public-user/components/calculatorPage/HRACalculator";
import SIPCalculator from "../app/pannels/public-user/components/calculatorPage/SIPCalculator";
import GratuityCalculator from "../app/pannels/public-user/components/calculatorPage/GratuityCalculator";
import RetirementCalculator from "../app/pannels/public-user/components/calculatorPage/RetirementCalculator";
import RDCalculator from "../app/pannels/public-user/components/calculatorPage/RDCalculator";
import SimpleInterestCalculator from "../app/pannels/public-user/components/calculatorPage/SimpleInterestCalculator";
import TDSCalculator from "../app/pannels/public-user/components/calculatorPage/TDSCalculator";
import PPFCalculator from "../app/pannels/public-user/components/calculatorPage/PPFCalculator";
import MutualFundCalculator from "../app/pannels/public-user/components/calculatorPage/MutualFundCalculator";
import EMICalculator from "../app/pannels/public-user/components/calculatorPage/EMICalculator";
import FDCalculator from "../app/pannels/public-user/components/calculatorPage/FDCalculator";
import HomeEMICalculator from "../app/pannels/public-user/components/calculatorPage/HomeEMICalculator";
import LumpsumCalculator from "../app/pannels/public-user/components/calculatorPage/LumpsumCalculator";
import BusinessCalculator from "../app/pannels/public-user/components/calculatorPage/BusinessCalculator";
import AllTradmarkClasses from "../app/pannels/public-user/components/trademarkClasses/tdClassesPages/AllTradmarkClasses";
import TdClass01 from "../app/pannels/public-user/components/trademarkClasses/tdClassesPages/tdClass01";


import CandidateGridPage from "../app/pannels/public-user/components/candidates/can-grid";
import CandidateListPage from "../app/pannels/public-user/components/candidates/can-list";
import CandidateDetail1Page from "../app/pannels/public-user/components/candidates/can-detail1";
import CandidateDetail2Page from "../app/pannels/public-user/components/candidates/can-detail2";

import BlogGrid1Page from "../app/pannels/public-user/components/blogs/blogs-grid1";
import BlogGrid2Page from "../app/pannels/public-user/components/blogs/blogs-grid2";
import BlogGrid3Page from "../app/pannels/public-user/components/blogs/blogs-grid3";
import BlogListPage from "../app/pannels/public-user/components/blogs/blogs-list";
import BlogDetailPage from "../app/pannels/public-user/components/blogs/blog-detail";
import BlogDetailsPage from '../app/pannels/public-user/components/blogs/blog-details';
import CaseStudyListPage from "../app/pannels/public-user/components/blogs/case-list";
import CaseStudyDetails from "../app/pannels/public-user/components/blogs/case-study-details";

const Home1Page = lazy(() => import("../app/pannels/public-user/components/home/index"));
const TestPage2 = lazy(() => import("../app/pannels/public-user/components/pages/LLPRegistrationPage2"));

function RouteFallbackSkeleton() {
    return (
        <div
            aria-busy="true"
            aria-live="polite"
            style={{
                minHeight: "900px",
                width: "100%",
                background: "linear-gradient(120deg, #f4f6f8 0%, #edf1f4 50%, #f4f6f8 100%)",
            }}
        />
    );
}

function LazyHomeRoute() {
    return (
        <Suspense fallback={<RouteFallbackSkeleton />}>
            <Home1Page />
        </Suspense>
    );
}

function LazyTestPage2Route() {
    return (
        <Suspense fallback={<RouteFallbackSkeleton />}>
            <TestPage2 />
        </Suspense>
    );
}

function PublicUserRoutes() {

    return (

        <Routes>
            <Route path={publicUser.INITIAL} element={<LazyHomeRoute />} />
            <Route path={publicUser.HOME1} element={<LazyHomeRoute />} />
            {/* <Route path={publicUser.HOME2} element={<Home2Page />} />
            <Route path={publicUser.HOME3} element={<Home3Page />} />
            <Route path={publicUser.HOME4} element={<Home4Page />} />
            <Route path={publicUser.HOME5} element={<Home5Page />} />
            <Route path={publicUser.HOME6} element={<Home6Page />} />
            <Route path={publicUser.HOME7} element={<Home7Page />} />
            <Route path={publicUser.HOME8} element={<Home8Page />} />
            <Route path={publicUser.HOME9} element={<Home9Page />} />
            <Route path={publicUser.HOME10} element={<Home10Page />} />
            <Route path={publicUser.HOME11} element={<Home11Page />} />
            <Route path={publicUser.HOME12} element={<Home12Page />} />
            <Route path={publicUser.HOME13} element={<Home13Page />} />
            <Route path={publicUser.HOME14} element={<Home14Page />} />
            <Route path={publicUser.HOME15} element={<Home15Page />} />
            <Route path={publicUser.HOME16} element={<Home16Page />} />
            <Route path={publicUser.HOME17} element={<Home17Page />} />
            <Route path={publicUser.HOME18} element={<Home18Page />} /> */}
            <Route path={publicUser.jobs.GRID} element={<JobsGridPage />} />
            <Route path={publicUser.jobs.GRID_MAP} element={<JobsGridMapPage />} />
            <Route path={publicUser.jobs.LIST} element={<JobsListPage />} />
            <Route path={publicUser.jobs.DETAIL1} element={<JobDetail1Page />} />
            <Route path={publicUser.jobs.DETAIL2} element={<JobDetail2Page />} />
            <Route path={publicUser.jobs.APPLY} element={<ApplyJobPage />} />
            <Route path={publicUser.employer.GRID} element={<EmployersGridPage />} />
            <Route path={publicUser.employer.LIST} element={<EmployersListPage />} />
            <Route path={publicUser.employer.DETAIL1} element={<EmployersDetail1Page />} />
            <Route path={publicUser.employer.DETAIL2} element={<EmployersDetail2Page />} />
            <Route path={publicUser.pages.ABOUT} element={<AboutUsPage />} />
            <Route path={publicUser.pages.PRICING} element={<PricingPage />} />
            <Route path={publicUser.pages.ERROR404} element={<Error404Page />} />
            <Route path={publicUser.pages.FAQ} element={<FaqPage />} />
            <Route path={publicUser.pages.CONTACT} element={<ContactUsPage />} />
            <Route path={publicUser.pages.MAINTENANCE} element={<UnderMaintenancePage />} />
            <Route path={publicUser.pages.COMING} element={<ComingSoonPage />} />
            <Route path={publicUser.pages.LOGIN} element={<LoginPage />} />
            <Route path={publicUser.pages.AFTER_LOGIN} element={<AfterLoginPage />} />
            <Route path={publicUser.pages.ICONS} element={<IconsPage />} />
            <Route path={publicUser.pages.TestPage1} element={< TestPage1 />} />
            <Route path={publicUser.pages.TestPage2} element={<LazyTestPage2Route />} />
            <Route path={publicUser.pages.TestPage3} element={< TestPage3 />} />
            <Route path={publicUser.pages.TestPage4} element={< TestPage4 />} />
            <Route path={publicUser.pages.TestPage5} element={< TestPage5 />} />


            <Route path={publicUser.calculator.CALCULATOR_ALL} element={< AllCalculator />} />
            <Route path={publicUser.calculator.GSTCalculator} element={< GSTCalculator />} />
            <Route path={publicUser.calculator.ITRCalculator} element={< ITRCalculator />} />
            <Route path={publicUser.calculator.EPFCalculator} element={< EPFCalculator />} />
            <Route path={publicUser.calculator.NPSCalculator} element={< NPSCalculator />} />
            <Route path={publicUser.calculator.HRACalculator} element={< HRACalculator />} />
            <Route path={publicUser.calculator.SIPCalculator} element={< SIPCalculator />} />
            <Route path={publicUser.calculator.GratuityCalculator} element={< GratuityCalculator />} />
            <Route path={publicUser.calculator.RetirementCalculator} element={< RetirementCalculator />} />
            <Route path={publicUser.calculator.RDCalculator} element={< RDCalculator />} />
            <Route path={publicUser.calculator.SimpleInterestCalculator} element={< SimpleInterestCalculator />} />
            <Route path={publicUser.calculator.TDSCalculator} element={< TDSCalculator />} />
            <Route path={publicUser.calculator.PPFCalculator} element={< PPFCalculator />} />
            <Route path={publicUser.calculator.MutualFundCalculator} element={< MutualFundCalculator />} />
            <Route path={publicUser.calculator.EMICalculator} element={< EMICalculator />} />
            <Route path={publicUser.calculator.FDCalculator} element={< FDCalculator />} />
            <Route path={publicUser.calculator.HomeEMICalculator} element={< HomeEMICalculator />} />
            <Route path={publicUser.calculator.LumpsumCalculator} element={< LumpsumCalculator />} />
            <Route path={publicUser.calculator.BusinessCalculator} element={< BusinessCalculator />} />
            <Route path={publicUser.tdclasses.ALL} element={<AllTradmarkClasses />} />
            <Route path={publicUser.tdclasses.TdClass01 + "/:id"} element={<TdClass01 />} />



            <Route path={publicUser.candidate.GRID} element={<CandidateGridPage />} />
            <Route path={publicUser.candidate.LIST} element={<CandidateListPage />} />
            <Route path={publicUser.candidate.DETAIL1} element={<CandidateDetail1Page />} />
            <Route path={publicUser.candidate.DETAIL2} element={<CandidateDetail2Page />} />
            <Route path={publicUser.blog.GRID1} element={<BlogGrid1Page />} />
            {/* <Route path={publicUser.blog.GRID2} element={<BlogGrid2Page />} /> */}
            {/* <Route path={publicUser.blog.GRID3} element={<BlogGrid3Page />} /> */}
            <Route path={publicUser.blog.LIST} element={<BlogListPage />} />
            <Route path={publicUser.blog.DETAILs} element={<BlogDetailsPage />} />
            <Route path={publicUser.blog.DETAIL + "/:id"} element={<BlogDetailPage />} />

            <Route path={publicUser.caseStudy.LIST} element={<CaseStudyListPage />} />
            <Route path={publicUser.caseStudy.DETAIL} element={<CaseStudyDetails />} />
            <Route path={publicUser.caseStudy.DETAIL + "/:id"} element={<CaseStudyDetails />} />
            {/* <Route path={publicUser.blog.DETAILS} element={<BlogDetailsPage />} />
            <Route path={publicUser.blog.DETAILS + "/:id"} element={<BlogDetailsPage />} /> */}



            <Route path="*" element={<Error404Page />} />
        </Routes>
    )
}
export default PublicUserRoutes;
