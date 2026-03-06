export const base = {
    PUBLIC_PRE: "",
    CANDIDATE_PRE: "/candidate",
    EMPLOYER_PRE: "/employer"
}

export const publicUser = {
    INITIAL: "/",
    HOME1: "/index",
    HOME2: "/index2",
    HOME3: "/index3",
    HOME4: "/index4",
    HOME5: "/index5",
    HOME6: "/index6",
    HOME7: "/index7",
    HOME8: "/index8",
    HOME9: "/index9",
    HOME10: "/index10",
    HOME11: "/index11",
    HOME12: "/index12",
    HOME13: "/index13",
    HOME14: "/index14",
    HOME15: "/index15",
    HOME16: "/index16",
    HOME17: "/index17",
    HOME18: "/index18",
    jobs: {
        GRID: "/job-grid",
        GRID_MAP: "/job-grid-with-map",
        LIST: "/casestudy-grid",
        DETAIL1: "/job-detail/1",
        DETAIL2: "/job-detail/2",
        APPLY: "/apply-job"
    },
    employer: {
        GRID: "/emp-grid",
        LIST: "/emp-list",
        DETAIL1: "/emp-detail/1",
        DETAIL2: "/emp-detail/2"
    },
    pages: {
        ABOUT: "/about-us",
        PRICING: "/pricing",
        ERROR404: "/error404",
        FAQ: "/faq",
        CONTACT: "/contact-us",
        MAINTENANCE: "/under-maintenance",
        COMING: "/coming-soon",
        LOGIN: "/login",
        AFTER_LOGIN: "/after-login",
        ICONS: "/icons",
        TestPage1: "/LLPRegistrationPage",
        TestPage2: "/LLPRegistrationPage2",
        TestPage3: "/casestudy-list",
        TestPage4: "/LLPRegistrationPage4",
        TestPage5: "/blog-list",
    },
    calculator: {
        CALCULATOR_ALL: '/all-calculators',
        GSTCalculator: "/gst-calc",
        ITRCalculator: "/itr-calc",
        EPFCalculator: "/epf-calc",
        NPSCalculator: "/nps-calc",
        HRACalculator: "/hra-calc",
        SIPCalculator: "/sip-calc",
        GratuityCalculator: "/gratuity-calc",
        RetirementCalculator: "/retirement-calc",
        RDCalculator: "/rd-calc",
        SimpleInterestCalculator: "/simple-interest-calc",
        TDSCalculator: "/tds-calc",
        PPFCalculator: "/ppf-calc",
        MutualFundCalculator: "/mutual-fund-calc",
        EMICalculator: "/emi-calc",
        FDCalculator: "/fd-calc",
        HomeEMICalculator: "/home-loan-calc",
        LumpsumCalculator: "/lumpsum-calc",
        BusinessCalculator: "/business-calc",
    },
    tdclasses: {
        ALL: "/trademark-classes",
        TdClass01: "/trademark-class",
    },

    candidate: {
        GRID: "/can-grid",
        LIST: "/can-list",
        DETAIL1: "/can-detail/1",
        DETAIL2: "/can-detail/2"
    },
    blog: {
        GRID1: "/blog-grid/1",
        GRID2: "/blog-grid/2",
        GRID3: "/blog-grid/3",
        LIST: "/blog-list",
        DETAIL: "/blog-detail",
        DETAILs: "/blog-details"
    },
    caseStudy: {
        LIST: '/case-list',
        DETAIL: "/case-study-details"
    }
}

export const candidate = {
    INITIAL: "/",
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    APPLIED_JOBS: "/applied-jobs",
    RESUME: "/my-resume",
    SAVED_JOBS: "/saved-jobs",
    CV_MANAGER: "/cv-manager",
    ALERTS: "/job-alerts",
    CHANGE_PASSWORD: "/change-password",
    CHAT: "/chat"
}

export const employer = {
    INITIAL: "/",
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    POST_A_JOB: "/post-a-job",
    MANAGE_JOBS: "/manage-jobs",
    CANDIDATES: "/candidates-list",
    BOOKMARKS: "/bookmarked-resumes",
    PACKAGES: "/packages",
    MESSAGES1: "/messages-style-1",
    MESSAGES2: "/messages-style-2",
    RESUME_ALERTS: "/resume-alerts"
}

export function pubRoute(_route) {
    return base.PUBLIC_PRE + _route;
}

export function empRoute(_route) {
    return base.EMPLOYER_PRE + _route;
}

export function canRoute(_route) {
    return base.CANDIDATE_PRE + _route;
}

