import React from "react";
import JobZImage from "../../../../common/jobz-img";
import CountUp from "react-countup";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import { TbIconsFilled } from "react-icons/tb";
import { FcCallback } from "react-icons/fc";
import ActionButton from "../../../../../common/ui/action-button";
const SectionOurPurpose = () => {
    return (
        <div className="section-full p-t120 p-b90 site-bg-light twm-how-t-get-wrap7">
            <div className="container">
                <div className="twm-how-t-get-section">
                    <div className="row">
                        <div className="col-xl-5 col-lg-5 col-md-12">
                            <div className="twm-how-t-get-section-left">
                                <div className="section-head left wt-small-separator-outer">
                                    <div className="wt-small-separator site-text-primary">
                                        <div>Our Purpose</div>
                                    </div>
                                    <h2 className="wt-title">Simplicity the path to Business Excellence</h2>
                                    <p>Starting or scaling a business in India shouldn’t be confusing or fragmented.</p>
                                    <p>At UniCX, we make it seamless, secure, and sustainable.</p>
                                    <p>We believe in clarity, compliance, and creativity. That’s why our services are designed to build your brand legally, financially, and digitally—end-to-end.</p>
                                </div>
                                <div className="twm-how-t-get-bottom">
                                    <ActionButton
                                        as={NavLink}
                                        variant="liquid-glass"
                                        className="twm-nav-action-btn"
                                        to={publicUser.pages.CONTACT}
                                    >
                                        <FcCallback className="font-icon-contact" />
                                        <span className="twm-nav-action-label">Contact-Us</span>
                                    </ActionButton>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-7 col-lg-7 col-md-12">
                            <div className="twm-how-t-get-section-right">
                                <div className="twm-media">
                                    <JobZImage src="images/about/purpose1.webp" alt="#" />
                                </div>

                                {/* Responsive Cards */}
                                <div className="twm-left-img-bx twm-left-img-bx-first bounce">
                                    <div className="twm-left-img-media">
                                        <JobZImage src="images/about/purpose/hand.png" alt="#" />
                                    </div>
                                    <div className="twm-left-img-content">
                                        <h4 className="icon-title">Hand Holding Support</h4>
                                    </div>
                                </div>

                                <div className="twm-left-img-bx twm-left-img-bx-second bounce">
                                    <div className="twm-left-img-media">
                                        <JobZImage src="images/about/purpose/sustainability.png" alt="#" />
                                    </div>
                                    <div className="twm-left-img-content">
                                        <h4 className="icon-title">Sustainable</h4>
                                    </div>
                                </div>

                                <div className="twm-left-img-bx twm-left-img-bx-third bounce">
                                    <div className="twm-left-img-media">
                                        <JobZImage src="images/about/purpose/growth.png" alt="#" />
                                    </div>
                                    <div className="twm-left-img-content">
                                        <h4 className="icon-title">Growth Centric</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionOurPurpose;
