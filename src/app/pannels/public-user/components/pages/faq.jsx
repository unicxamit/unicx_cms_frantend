import InnerPageBanner from "../../../../common/inner-page-banner";
import DynamicFaqTabs from "./dynamicFAQ";

function FaqPage() {
    return (
        <>
            <InnerPageBanner
                _data={{ title: "FAQ", crumb: "FAQ" }}
                bgImagePath="images/contact-us/Header.webp"
            />

            <DynamicFaqTabs />
        </>
    );
}

export default FaqPage;
