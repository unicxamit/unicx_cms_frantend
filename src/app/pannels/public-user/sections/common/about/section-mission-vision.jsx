import React from "react";
import JobZImage from "../../../../common/jobz-img";
import CountUp from "react-countup";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
const MissionVision = () => {
    return (
        <div className="section-full site-bg-white h-page6-getjobs-wrap">
            <div className="h-page6-client-slider-outer">
                <div className="container">
                    <div className="h-page6-client-slider">
                        <div className="row">
                            <div className="col-xl-4 col-lg-12">
                                <div className="h-page-6-client-slide-title">
                                    Trusted by more than <span className="site-text-primary">+100 companies</span>
                                </div>
                            </div>
                            <div className="col-xl-8 col-lg-12">
                                <div className="owl-carousel home-client-carousel6 owl-btn-vertical-center">
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w1.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w2.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w3.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w4.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w5.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w6.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w1.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w2.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w3.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="ow-client-logo">
                                            <div className="client-logo client-logo-media">
                                                <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w5.png" alt="" /></NavLink></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="h-page-6-getjobs-wrap">
                    <div className="row">
                        <div className="col-lg-7 col-md-12">
                            <div className="h-page-6-getjobs-left">
                                <div className="twm-media">
                                    <JobZImage src="images/about/vision/Vission_Mission.webp" alt="#" />
                                    <div className="twm-media-bg-circle" />
                                    <div className="twm-media-bg-circle2" />
                                    <div className="twm-media-bg-circle3">
                                        <div className="rotate-center">
                                            <span className="ring1" />
                                            <span className="ring2" />
                                            <span className="ring3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-12">
                            <div className="h-page-6-getjobs-right">
                                {/* title="" START*/}

                                <div className="section-head left wt-small-separator-outer vision">
                                    <div className="wt-small-separator site-text-primary">
                                        <div>Our Vision</div>
                                    </div>
                                    <h2 className="wt-title">Our vision is to be  for dynamic<span className="site-text-primary">India's most reliable and comprehensive one-stop partner </span>
                                        businesses across the nation.
                                        <br /> <br />
                                        We aim to empower enterprises to <span className="site-text-primary"> start strong, </span>ensuring a
                                        solid corporate legal and foundation setup, grow smart through strategic finance and innovative
                                        digital solutions, and stay secure against all modern challenges—be they intricate licences and
                                        certifications, financial vulnerabilities, or complex legal threats.
                                        <br /> <br />
                                        We aspire to be the go-to
                                        resource that businesses trust implicitly for their sustained success and resilience in an ever-evolving market.
                                    </h2>
                                </div>

                                <div className="section-head left wt-small-separator-outer mission" style={{ marginTop: '80px' }}>
                                    <div className="wt-small-separator site-text-primary">
                                        <div>Our Mission</div>
                                    </div>
                                    <h2 className="wt-title">Our mission is fundamentally to <span className="site-text-primary">simplify the intricate journey of entrepreneurship</span>
                                        for all.
                                        <br /> <br />
                                        We achieve this by consistently offering <span className="site-text-primary"> trusted, highly professional, and prompt services </span> that meticulously cover every essential aspect of a modern business's operational needs.
                                        <br /> <br />
                                        This includes comprehensive corporate legal guidance, efficient licences and certifications acquisition, robust finance management, cutting-edge digital strategies, and seamless foundation setup, all conveniently accessible under one transparent and accountable roof, thereby eliminating unnecessary complexities and fostering growth.
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MissionVision
