import React from 'react'
import JobZImage from "../../../../common/jobz-img";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import CountUp from 'react-countup';
import { publicUrlFor } from '../../../../../globals/constants';
const WhereOperate = () => {
    return (
        <div className='twm-home7-banner-section '>
            <div className="twm-bg-candi-pattern" />
            <div className="container">
                <div className="twm-j-ofr-wrap">
                    <div className="twm-j-ofr-content" style={{ backgroundImage: `url(${publicUrlFor("images/about/ofr-bg.jpg")})` }}>
                        <div className="row">
                            <div className="col-lg-7 col-md-12">
                                <div className="twm-j-ofr-map-content">
                                    {/* title="" START*/}
                                    <div className="section-head left wt-small-separator-outer">
                                        <h2 className="wt-title">Where We <span className="site-text-primary">Operate</span></h2>
                                        <p style={{ fontWeight: 'bold' }}>Our roots starts from <span className="site-text-primary">Indore</span>, but our services empower brands and businesses across the <span className="site-text-primary"> Globe</span></p>
                                    </div>
                                    {/* title="" END*/}
                                    <div className="twm-j-ofr-map-list">
                                        <ul>
                                            <li>
                                                <div className="flag-list">
                                                    <span><JobZImage style={{padding:'40px 0'}} src="images/about/operate/india-flag.webp" alt="#" /></span>
                                                    <h4 className="flat-name">India</h4>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="twm-read-more">
                                        <NavLink to={publicUser.pages.CONTACT} className="site-button liquid-glass-btn">Contact-Us</NavLink>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-12">
                                <div className="twm-j-ofr-map">
                                    <div className="twm-media">
                                        <JobZImage src="images/about/Map.webp" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhereOperate
