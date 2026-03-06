import React from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import JobZImage from "../../../../common/jobz-img";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import CountUp from 'react-countup';
import { publicUrlFor } from '../../../../../globals/constants';
import { FaBusinessTime } from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import { TbAlignBoxRightStretch } from "react-icons/tb";
import { TbReceiptTax } from "react-icons/tb";
import { TbBrandDolbyDigital } from "react-icons/tb";
import { TbLicense } from "react-icons/tb";

const SectionService = () => {
    // Define animation variants for the blocks
    const blockVariants = {
        hidden: { opacity: 0, y: 50 }, // Initial state: invisible and slightly below
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }, // Animate to visible and original position
    };

    return (
        <div>
            {/* Main section for general content and images */}
            <div className="section-full p-t90 p-b0 site-bg-white twm-millions-1-area pos-relative">
                <div className="container">
                    <div className="twm-millions-section-wrap">
                        <div className="row">
                            <div className="col-lg-7 col-md-12">
                                <div className="twm-millions-1-section">
                                    <div className="twm-media">
                                        <JobZImage src="images/about/service.webp" alt="" />
                                        <div className="twm-circle-jobs-wrap">
                                            {/* Animated circle job boxes */}
                                            <div className="twm-circle-jobs-box one bounce2">
                                                <div className="twm-circle-job-pics">
                                                    <JobZImage src="images/about/service/icon/11.png" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-circle-jobs-box two bounce">
                                                <div className="twm-circle-job-pics">
                                                    <JobZImage src="images/about/service/icon/22.png" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-circle-jobs-box three bounce2">
                                                <div className="twm-circle-job-pics">
                                                    <JobZImage src="images/about/service/icon/33.png" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-circle-jobs-box four bounce">
                                                <div className="twm-circle-job-pics">
                                                    <JobZImage src="images/about/service/icon/44.png" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-circle-jobs-box five bounce2">
                                                <div className="twm-circle-job-pics">
                                                    <JobZImage src="images/about/service/icon/77.png" alt="#" />
                                                </div>
                                            </div>
                                            <div className="twm-circle-jobs-box six bounce">
                                                <div className="twm-circle-job-pics">
                                                    <JobZImage src="images/about/service/icon/99.png" alt="#" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="twm-bg-circle-pic">
                                        <JobZImage src="images/about/purpose/our_services.png" alt="#" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-12">
                                <div className="twm-millions-1-section-right">
                                    {/* Section title */}
                                    <div className="section-head left wt-small-separator-outer">
                                        <div className="wt-small-separator site-text-primary">
                                            <div>Our Services</div>
                                        </div>
                                        <h2 className="wt-title">Everything You Need. Right Here.</h2>
                                    </div>
                                    {/* Service text boxes */}
                                    <div className='service-text-box'>
                                        {/* Added anchor tag with href linking to the ID */}
                                        <a href="#business-naming-brand-identity" className='service-text-heading'><i className="feather-check"></i>Business Naming & Brand Identity</a>
                                    </div>
                                    <div className='service-text-box'>
                                        <a href="#corporate-legal-services" className='service-text-heading'><i className="feather-check"></i>Corporate Legal Services</a>
                                    </div>
                                    <div className='service-text-box'>
                                        <a href="#intellectual-property-rights" className='service-text-heading'><i className="feather-check"></i>Intellectual Property Rights (IPR)</a>
                                    </div>
                                    <div className='service-text-box'>
                                        <a href="#corporate-financial-tax-session" className='service-text-heading'><i className="feather-check"></i>Corporate Financial & Tax Session</a>
                                    </div>
                                    <div className='service-text-box'>
                                        <a href="#digital-presence-brand-development" className='service-text-heading'> <i className="feather-check"></i><span>Digital Presence & Brand Development</span></a>
                                    </div>
                                    <div className='service-text-box'>
                                        <a href="#licensing-certifications" className='service-text-heading'> <i className="feather-check"></i> <span>Licensing & Certifications</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="twm-bg-shape5" />
            </div>
            {/* ABOUT SECTION END */}

            {/* Section with animated service blocks */}
            <div className="section-full p-t0 p-b0 site-bg-white twm-counter-page-5-wrap">
                <div className="container">
                    <div className="twm-company-approch5-outer">
                        <div className="twm-company-approch5" style={{ backgroundImage: `url(/assets/images/about/service/Our_Services_bg.webp)`, backgroundSize: '100% 100%', objectFit: 'cover' }}>
                            <div className="row">
                                {/* block 1 - Business Naming & Brand Identity */}
                                <motion.div
                                    className="col-lg-6 col-md-6 col-sm-6"
                                    variants={blockVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ amount: 0.3 }} // Animation will trigger every time it comes into view
                                >
                                    <div className="counter-outer-two">
                                        {/* Added ID to this div for the anchor */}
                                        <div className="icon-content" id="business-naming-brand-identity">
                                            <div className="tw-service-head site-text-white">
                                                <span className='service-head-icon'><FaBusinessTime /></span>
                                                <span>Business Naming & Brand Identity</span>
                                            </div>
                                            <div className="icon-content-info">
                                                <ul>
                                                    <li>Brand name selection based on trademark, ROC, and domain availability</li>
                                                    <li>Naming strategy for market appeal and legal security</li>
                                                    <li>Brand registration guidance</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* block 2 - Corporate Legal Services */}
                                <motion.div
                                    className="col-lg-6 col-md-6 col-sm-6"
                                    variants={blockVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ amount: 0.3 }} // Animation will trigger every time it comes into view
                                >
                                    <div className="counter-outer-two">
                                        {/* Added ID to this div for the anchor */}
                                        <div className="icon-content" id="corporate-legal-services">
                                            <div className="tw-service-head site-text-white">
                                                <span className='service-head-icon'><MdDesignServices /></span>
                                                <span>Corporate Legal Services</span>
                                            </div>
                                            <p className="icon-content-info">
                                                <ul>
                                                    <li>Company incorporation (Private Ltd., LLP, OPC, etc.)</li>
                                                    <li>Annual compliance, ROC filings, board resolutions</li>
                                                    <li>Legal documentation: Founders’ Agreements, NDAs, MoUs</li>
                                                </ul>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* block 3 - Intellectual Property Rights */}
                                <motion.div
                                    className="col-lg-6 col-md-6 col-sm-6"
                                    variants={blockVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ amount: 0.3 }} // Animation will trigger every time it comes into view
                                >
                                    <div className="counter-outer-two">
                                        {/* Added ID to this div for the anchor */}
                                        <div className="icon-content" id="intellectual-property-rights">
                                            <div className="tw-service-head site-text-white">
                                                <span className='service-head-icon'><TbAlignBoxRightStretch /></span>
                                                <span>Intellectual Property Rights</span>
                                            </div>
                                            <p className="icon-content-info">
                                                <ul>
                                                    <li>Trademark search, registration & protection</li>
                                                    <li>Copyright & design registrations</li>
                                                    <li>IPR advisory and enforcement against infringement</li>
                                                </ul>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* block 4 - Corporate Financial & Tax Session */}
                                <motion.div
                                    className="col-lg-6 col-md-6 col-sm-6"
                                    variants={blockVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ amount: 0.3 }} // Animation will trigger every time it comes into view
                                >
                                    <div className="counter-outer-two">
                                        {/* Added ID to this div for the anchor */}
                                        <div className="icon-content" id="corporate-financial-tax-session">
                                            <div className="tw-service-head site-text-white">
                                                <span className='service-head-icon'><TbReceiptTax /> </span>
                                                <span>Corporate Financial & Tax Session</span>
                                            </div>
                                            <p className="icon-content-info">
                                                <ul>
                                                    <li>GST registration, return filing, and advisory</li>
                                                    <li>TDS, income tax, and other statutory filings</li>
                                                    <li>Bookkeeping, payroll, and accounting systems</li>
                                                    <li>Business financial planning and compliance audits</li>
                                                </ul>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* block 5 - Digital Presence & Brand Development */}
                                <motion.div
                                    className="col-lg-6 col-md-6 col-sm-6"
                                    variants={blockVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ amount: 0.3 }} // Animation will trigger every time it comes into view
                                >
                                    <div className="counter-outer-two">
                                        {/* Added ID to this div for the anchor */}
                                        <div className="icon-content" id="digital-presence-brand-development">
                                            <div className="tw-service-head site-text-white">
                                                <span className='service-head-icon'><TbBrandDolbyDigital /></span>
                                                <span>Digital Presence & Brand Development</span>
                                            </div>
                                            <p className="icon-content-info">
                                                <ul>
                                                    <li>Website design & development (static, dynamic, e-commerce)</li>
                                                    <li>UI/UX design for modern customer journeys</li>
                                                    <li>Graphic design for brochures, logos, ads, etc.</li>
                                                    <li>Social media setup & marketing strategy.</li>
                                                </ul>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* block 6 - Licensing & Certifications */}
                                <motion.div
                                    className="col-lg-6 col-md-6 col-sm-6"
                                    variants={blockVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ amount: 0.3 }} // Animation will trigger every time it comes into view
                                >
                                    <div className="counter-outer-two">
                                        {/* Added ID to this div for the anchor */}
                                        <div className="icon-content" id="licensing-certifications">
                                            <div className="tw-service-head site-text-white">
                                                <span className='service-head-icon'> <TbLicense /></span>
                                                <span>Licensing & Certifications</span>
                                            </div>
                                            <p className="icon-content-info">
                                                <ul>
                                                    <li>ISO Certification (ISO 9001, ISO 27001, etc.)</li>
                                                    <li>FSSAI, MSME, Import Export Code (IEC), Shop Act</li>
                                                    <li>Business licenses based on industry & location</li>
                                                    <li>Compliance readiness for funded/startup ecosystems</li>
                                                </ul>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SectionService;