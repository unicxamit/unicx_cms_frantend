import SectionJobCategories from "../../sections/about/section-job-categories";
import SectionHowItWorks from "../../sections/about/section-how-it-works";
import SectionUploadCV from "../../sections/about/section-upload-cv";
import SectionTopCompanies from "../../sections/about/section-top-companies";
import { useEffect } from "react";
import { loadScript } from "../../../../../globals/constants";
import SectionOurPurpose from "../../sections/about/section-our-purpose";
import AboutUs from "../../sections/about/section-main-about";
import SectionService from "../../sections/about/section-our-service";
import WhyChoose from "../../sections/about/section-why-choose";
import WhereOperate from "../../sections/about/section-where-operate";
import MissionVision from "../../sections/about/section-mission-vision";
import BuildBussiness from "../../sections/about/section-build-bussiness";

function AboutUsPage() {

    useEffect(() => {
    })

    return (
        <>
            <AboutUs />
            <SectionOurPurpose />
            <SectionService />
            <WhyChoose/>
            <MissionVision/>
            <WhereOperate/>
            <BuildBussiness/>


            {/* <SectionJobCategories />
            <SectionHowItWorks />
            <SectionUploadCV />
            <SectionTopCompanies /> */}
        </>
    )
}

export default AboutUsPage;

