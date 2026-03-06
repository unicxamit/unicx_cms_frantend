import React from "react";
import JobZImage from "../../../../common/jobz-img";
import CountUp from "react-countup";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { MdAccountCircle } from "react-icons/md";
import { TbDiscountFilled } from "react-icons/tb";
const AboutUs = () => {
    return (
        <div className="twm-home1-banner-section twm-bnr-hpage-15 site-bg-white">
            <div className="row about-row">
                {/*Left Section*/}
                <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="twm-bnr-15-carousal">
                        <div className="owl-carousel h-page-15-bnr-carousal  owl-btn-left-bottom">
                            <div className="item">
                                <div className="twm-bnr-15-carousal-section">
                                    <JobZImage src="images/about/1.webp" alt="Banner image 1" />
                                </div>
                            </div>
                            <div className="item">
                                <div className="twm-bnr-15-carousal-section">
                                    <JobZImage src="images/about/2.webp" alt="Banner image 2" />
                                </div>
                            </div>
                            <div className="item">
                                <div className="twm-bnr-15-carousal-section" >
                                    <JobZImage src="images/about/3.webp" alt="Banner image 3" />
                                </div>
                            </div>
                        </div>
                        <div className="bnr-15-left-pic1 bounce2"><JobZImage src="images/home-15/block-left.png" alt="#" /></div>
                        <div className="bnr-15-left-pic2 bounce"><JobZImage src="images/home-15/block-right.png" alt="#" /></div>
                        <div className="bnr-15-left-pic3 scale-up-center" />
                    </div>
                </div>
                {/*right Section*/}
                <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="twm-bnr-left-section">
                        <div className="twm-bnr-title-large">About-UNICX </div>
                        <div className="text-about">
                            <p>
                                <div className="head-p-text">Aiming your good <b>Start</b> </div>
                                <div className="head-p-text">Supporting for better <b>Growth</b></div>
                                <div className="head-p-text">Focused to <b>scale</b></div>
                            </p>
                            <p>
                                At <b>UniConsultX</b>, we don’t just offer services — we become your business partner
                                from day one. We guide entrepreneurs, startups, and growing companies through every stage of their journey —
                                <b>from brand naming and legal setup to financial compliance, digital identity, and licensing.</b>
                            </p>
                        </div>

                        <div className=" twm-bnr-hpage-15-counter">
                            <div className="row d-flex justify-content-center">
                                {/*block 1*/}
                                <div className="col-lg-4 col-md-6">
                                    <div className="counter-outer-two">
                                        <div className="twm-media cat-bg-clr-1">
                                            <JobZImage src="images/about/carts/conversation2.png" alt="Banner image 2" />
                                        </div>
                                        <div className="icon-content">
                                            <div className="tw-count-number">
                                                <span className="counter">
                                                    <CountUp end={350} duration={3} />
                                                </span>+</div>
                                            <p className="icon-content-info">Consultants</p>
                                        </div>
                                    </div>
                                </div>
                                {/*block 2*/}
                                <div className="col-lg-4 col-md-6">
                                    <div className="counter-outer-two">
                                        <div className="twm-media cat-bg-clr-2">

                                            <JobZImage src="images/about/carts/professionalism2.png" alt="Banner image 2" />
                                        </div>
                                        <div className="icon-content">
                                            <div className="tw-count-number">
                                                <span className="counter">
                                                    <CountUp end={250} duration={3} />
                                                </span>+</div>
                                            <p className="icon-content-info">Professionals</p>
                                        </div>
                                    </div>
                                </div>
                                {/*block 3*/}
                                <div className="col-lg-4 col-md-6">
                                    <div className="counter-outer-two">
                                        <div className="twm-media cat-bg-clr-3">
                                            {/* <div className="flaticon-job" /> */}
                                            <JobZImage src="images/about/carts/user.png" alt="Banner image 2" />
                                        </div>
                                        <div className="icon-content">
                                            <div className="tw-count-number">
                                                <span className="counter">
                                                    <CountUp end={1000} duration={3} />
                                                </span>+</div>
                                            <p className="icon-content-info">Active Users</p>
                                        </div>
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

export default AboutUs;
