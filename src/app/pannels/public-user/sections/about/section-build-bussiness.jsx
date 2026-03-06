import React, { useState } from "react";
// import JobZImage from "../../../../common/jobz-img";
// import CountUp from "react-countup";
// import { NavLink } from "react-router-dom";
// import { publicUrlFor } from "../../../../../globals/constants";
import { addSubscriptionForm } from "../../../../../adminApi";
import { toast } from "react-toastify";
const BuildBussiness = () => {
      const [subsEmail,setSubsEmail]=useState("");
   
       
     
    
        const handleSubmit = async (e) => {
      e.preventDefault();
        // if (emailError) return;
      try {
   
    
        const res = await addSubscriptionForm({ subsEmail });
        toast.success(res.message||"🎉 Message sent successfully!"); 
    
        
        setSubsEmail("");  
    
      } catch (err) {
        const errorMsg = err?.response?.data?.message || "Something went wrong";
           toast.error(errorMsg);
        
    
      } finally {
      console.log("email send ")
      }
    };
    
    return (
        <div className="bussiness-container">
            {/* SUBSCRIBE SECTION START */}
            {/* <div className="section-full twm-hpage-6-subs-wrap bg-cover " style={{ backgroundImage: `url(${publicUrlFor("images/home-6/subscribe-bg.jpg")})` }}> */}
            <div className="section-full twm-hpage-6-subs-wrap bg-cover " style={{ background:'#eaf1fb' }}>
                <div className="container">
                    <div className="section-content">
                        <div className="row">
                            <div className="col-lg-7 col-md-12">
                                <div className="twm-hpage-6-getintouch">
                                    <div className="callus-bg-box">
                                        <div className="callus-bg-box-shadow" />
                                    </div>
                                    <div className="twm-hpage-6-getintouch-title">
                                        <div className="wt-title-small">Contact Us to get started today.</div>
                                        <h2 className="wt-title">
                                            Let’s Build Your <span>Business </span>
                                            the Right Way
                                        </h2>
                                    </div>
                                    <div className="twm-hpage-6-callus">
                                        <a style={{textDecoration:'none'}} href="tel:+91 9009980049">
                                            <div style={{ cursor: 'pointer' }} className="callus-icon">
                                                <i className="flaticon-phone" />
                                            </div>
                                        </a>
                                        <div className="callus-content">
                                            <div className="callus-number"><a style={{ textDecoration: 'none' , color:'white'}} href="tel:+91 9009980049">90099 80049</a></div>
                                            <div className="callus-email"><a style={{textDecoration:'none'}} href="mailto:hello@unicx.in">hello@unicx.in</a></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-12">
                                <div className="twm-hpage-6-subscribe-wrap">
                                    <div className="hpage-6-nw-form-corner-wrap">
                                        <div className="twm-hpage-6-subscribe">
                                            <h3 className="twm-sub-title">One Team. One Window. One Goal: Your Success.</h3>
                                            <div className="twm-sub-discription">
                                                From naming to licensing, from digital design to legal filings—we’re with you at every step.
                                            </div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="hpage-6-nw-form">
                                                    <input name="news-letter" className="form-control" placeholder="Enter Your Email" type="text" value={subsEmail} onChange={(e) => setSubsEmail(e.target.value)}/>
                                                    <button className="hpage-6-nw-form-btn"><i className="fa fa-paper-plane" /></button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="hpage-6-nw-form-corner" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* SUBSCRIBE SECTION END */}
        </div>
    )
}

export default BuildBussiness
