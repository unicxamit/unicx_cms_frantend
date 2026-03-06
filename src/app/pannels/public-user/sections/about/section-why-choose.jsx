import React from "react";
import JobZImage from "../../../../common/jobz-img";
import CountUp from "react-countup";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import { publicUrlFor } from "../../../../../globals/constants";
import { color } from "framer-motion";
const WhyChoose = () => {
    return (
        <div className="section-full p-t120 p-b90 twm-how-it-work-area" style={{ backgroundImage: `url(${publicUrlFor("images/about/why-choose/bg_why_choose.jpg")})` }}>
            <div className="container">
                {/* title="" START*/}
                <div className="section-head center wt-small-separator-outer  content-white">
                    <div className="wt-small-separator">
                        <div>Why Choose UniCX?</div>
                    </div>
                   
                </div>
                {/* title="" END*/}
                <div className="twm-how-it-work-section3">
                    <div className="row">
                        <div className="col-xl-4 col-lg-6 col-md-6">
                            <div className="twm-w-process-steps-h-page-7">
                                <div className="twm-w-pro-top">
                                    <div className="twm-media">
                                        <span><JobZImage src="images/about/why-choose/11.png" alt="icon1" /></span>
                                    </div>
                                    <span className="twm-large-number  text-clr-sky">01</span>
                                </div>
                                <h4 className="twm-title">Direct, In-House Expertise</h4>
                                <p>No middlemen. No delays. Just transparent execution.</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6">
                            <div className="twm-w-process-steps-h-page-7">
                                <div className="twm-w-pro-top">
                                    <div className="twm-media">
                                        <span><JobZImage src="images/about/why-choose/software.png" alt="icon1" /></span>
                                    </div>
                                    <span className="twm-large-number  text-clr-sky">02</span>
                                </div>
                                <h4 className="twm-title">All-in-One Platform</h4>
                                <p>Legal, financial, digital, certifications, and licensing—handled seamlessly.</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6">
                            <div className="twm-w-process-steps-h-page-7">
                                <div className="twm-w-pro-top">
                                    <div className="twm-media">
                                        <span><JobZImage src="images/about/why-choose/text.png" alt="icon1" /></span>
                                    </div>
                                    <span className="twm-large-number  text-clr-sky">03</span>
                                </div>
                                <h4 className="twm-title">Prompt & Personalised Support</h4>
                                <p>We work closely with every client, offering clear communication at every step.</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6">
                            <div className="twm-w-process-steps-h-page-7">
                                <div className="twm-w-pro-top">
                                    <div className="twm-media">
                                        <span><JobZImage src="images/about/why-choose/execution.png" alt="icon1" /></span>
                                    </div>
                                    <span className="twm-large-number text-clr-pink">04</span>
                                </div>
                                <h4 className="twm-title">Strategic Insight with Practical Execution</h4>
                                <p>We don’t just file documents—we align them with your business goals.</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6">
                            <div className="twm-w-process-steps-h-page-7">
                                <div className="twm-w-pro-top">
                                    <div className="twm-media">
                                        <span><JobZImage src="images/about/why-choose/professionalism.png" alt="icon1" /></span>
                                    </div>
                                    <span className="twm-large-number  text-clr-green">05</span>
                                </div>
                                <h4 className="twm-title">Professional Team</h4>
                                <p>CAs, CS, Lawyers, Designers, and Consultants—all under one roof.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default WhyChoose;
