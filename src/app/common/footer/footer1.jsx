import { publicUrlFor } from "../../../globals/constants";
import JobZImage from "../jobz-img";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../globals/route-names";
import { useEffect, useState } from "react";
import { addSubscriptionForm, getHeaderBootstrap } from "../../../adminApi";
import { toast } from "react-toastify";

function Footer1() {
    const [subsEmail,setSubsEmail]=useState("");
    const [loading,setLoading]=useState(false);
   const [socialLinks,setSocialLinks]=useState([]);
   const [footerdetails,setFooterDetails]=useState([]);
// subscrib email
    const handleSubmit = async (e) => {
  e.preventDefault();

  const normalizedEmail = String(subsEmail || "").trim().toLowerCase();
  const isValidEmail = /^\S+@\S+\.\S+$/.test(normalizedEmail);
  if (!isValidEmail) {
    toast.error("Please enter a valid email address.");
    return;
  }

  try {
    setLoading(true);

    const res = await addSubscriptionForm({
      subsEmail: normalizedEmail,
    //   email: normalizedEmail,
    });
    if (res?.alreadySubscribed) {
      toast.info(res.message || "Email already subscribed.");
    } else if (res?.emailSent === false) {
      toast.warning(
        res.message || "Subscribed, but confirmation email could not be delivered."
      );
    } else {
      toast.success(res.message || "Subscription received successfully!");
    }
    setSubsEmail("");   
  } catch (err) {
    if (err?.code === "ECONNABORTED") {
      toast.warning("Request timed out. Your data may be saved; confirmation email can arrive shortly.");
    } else {
    const errorMsg = err?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg || "Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};
// footer bootstrap data
useEffect(() => {
    const fetchFooterBootstrap = async () => {
      try {
        const res = await getHeaderBootstrap();
        const activeSocialLinks = (res?.socialLinks || []).filter(
          (f) => f.socialLinkstatus === "active"
        );
        const activeFooterDetails = (res?.footerDetails || []).filter(
          (f) => f.status === "active"
        );
        setSocialLinks(activeSocialLinks);
        setFooterDetails(activeFooterDetails);
      } catch (error) {
        console.log("footer bootstrap fetch error", error.message);
      }
    };
    fetchFooterBootstrap();
}, []);
    return (
        <>
            <footer className="footer-dark" style={{ backgroundImage: `url(${publicUrlFor("images/footer1.png")})` }}>
                <div className="container">
                    {/* NEWS LETTER SECTION START */}
                    <div className="ftr-nw-content">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="ftr-nw-title">
                                    Get the latest business updates and crucial insights delivered to your inbox. Subscribe and stay informed.
                                </div>
                            </div>
                            <div className="col-md-7">
                                <form onSubmit={handleSubmit}> 
                                    <div className="ftr-nw-form">
                                        <input type="email" name="news-letter" value={subsEmail} className="form-control" placeholder="Enter Your Email"  onChange={(e) => setSubsEmail(e.target.value)}  />
                                        
                                        <button type="submit" className="ftr-nw-subcribe-btn"  disabled={loading}>{loading ? "Subscrib....":"Subscribe Now"}</button>
                                    </div>
                                    {/* <p style={{color:"red"}}>{message}</p> */}
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* NEWS LETTER SECTION END */}
                    {/* FOOTER BLOCKES START */}
                    <div className="footer-top">
                        <div className="row">
                            <div className="col-lg-3 col-md-12">
                                <div className="widget widget_about">
                                    <div className="logo-footer clearfix">
                                        <NavLink to={publicUser.HOME1}><JobZImage id="skin_footer_dark_logo" src="/assets/images/skins-logo/logo-skin-6-ftr.png" alt="" /></NavLink>
                                        <div className="image-text">Start . Grow . Scale</div>
                                    </div>

                                    {/* <ul className="social-icons">
                                         <li><a target="_blank" href="https://www.facebook.com/" className="fab fa-facebook-f" /></li> 
                                        <li><a target="_blank" href="https://g.page/r/CQ9HZC1YG1jaEAE/review" className="fab fa-google" /></li>
                                        <li><a target="_blank" href="https://x.com/UniConsultX" className="fab fa-twitter" /></li>
                                        <li><a target="_blank" href="https://www.instagram.com/unicx.in/" className="fab fa-instagram" /></li>
                                        <li><a target="_blank" href="https://in.linkedin.com/company/uniconsultx" className="fab fa-linkedin" /></li>
                                        <li><a target="_blank" href="http://www.youtube.com/@uniconsultx" className="fab fa-youtube" /></li>
                                        <li>
                                            <a
                                                href="https://web.whatsapp.com/send?phone=919009980049&text=Hi%20UniCX%2C%0A%0AI%20visited%20your%20website%20and%20would%20like%20to%20consult%20with%20you.%20Please%20let%20me%20know%20a%20suitable%20time%20for%20a%20detailed%20discussion.%0A%0AThank%20you.&app_absent=1"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="fab fa-whatsapp"
                                            ></a>
                                        </li>


                                    </ul> */}
<ul className="social-icons" style={{columnGap:"0.5rem"}}>
  {socialLinks.length > 0 &&
    socialLinks.map((item,index) => (
      <li key={item._id}>
        <NavLink
          to={item.url}
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   className={`fab ${item.icon}`}  
        //   title={item.platform}
        >
            <img src={item.icon} alt={item.platform} style={{width:"30px",height:"28px",borderRadius:"0.3rem"}}/>
        </NavLink>
      </li>
    ))}
</ul>

                                    {/* // Hii UniCX, <br/> I Visited your website, Want to cunsult with you, Please let me know when we can have deteiled discussion? <br/> Thanks. */}


                                    <ul className="ftr-list">
                                         {footerdetails.length > 0 &&
    footerdetails.map((item,index) => (
        <>
                                        <li><p><span>Address :</span> {item.address}</p></li>
                                        <li><p><span>Email :</span>{item.email}</p></li>
                                        <li><p><span>Call :</span>{item.phone}</p></li>
                                        </>
    ))}
                                    </ul>
                                </div>
                            </div>


                            <div className="col-lg-9 col-md-12">
                                <div className="row">
                                    <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="widget widget_services ftr-list-center">
                                            <h3 className="widget-title">For User</h3>
                                            <ul>
                                                <li><NavLink to={publicUser.pages.LOGIN}>User Dashboard</NavLink></li>
                                                {/* <li><NavLink to={publicUser.candidate.GRID}>Candidates</NavLink></li> */}
                                                {/* <li><NavLink to={publicUser.blog.LIST}>Blog List</NavLink></li> */}
                                                <li><NavLink to={publicUser.pages.TestPage5}>Blog List</NavLink></li>
                                                <li><NavLink to={publicUser.blog.DETAILs}>Blog single</NavLink></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="widget widget_services ftr-list-center">
                                            <h3 className="widget-title">For Employers</h3>
                                            <ul>
                                                <li><NavLink to={publicUser.blog.GRID1}>Blog Grid</NavLink></li>
                                                <li><NavLink to={publicUser.pages.CONTACT}>Contact</NavLink></li>
                                                <li><NavLink to={publicUser.jobs.LIST}>CaseStudy Grid</NavLink></li>
                                                {/* <li><NavLink to={publicUser.jobs.DETAIL1}>details</NavLink></li> */}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="widget widget_services ftr-list-center">
                                            <h3 className="widget-title">Helpful Resources</h3>
                                            <ul>
                                                <li><NavLink to={publicUser.pages.FAQ}>FAQs</NavLink></li>
                                                <li><NavLink to={publicUser.pages.LOGIN}>Profile</NavLink></li>
                                                <li><NavLink to={publicUser.pages.ERROR404}>404 Page</NavLink></li>
                                                {/* <li><NavLink to={publicUser.pages.PRICING}>Pricing</NavLink></li> */}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="widget widget_services ftr-list-center">
                                            <h3 className="widget-title">Quick Links</h3>
                                            <ul>
                                                <li><NavLink to={publicUser.HOME1}>Home</NavLink></li>
                                                <li><NavLink to={publicUser.pages.ABOUT}>About us</NavLink></li>
                                                {/* <li><NavLink to={publicUser.jobs.GRID}>Jobs</NavLink></li> */}
                                                {/* <li><NavLink to={publicUser.employer.LIST}>Employer</NavLink></li>
                                                <li><NavLink to={publicUser.pages.CHARTS1}>second</NavLink></li> */}
                                            </ul>
                                        </div>
                                    </div>
                                </div>



                                <div className="row">
                                    <h3 className="widget-title footer-tool-heading">Tools</h3>
                                    <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="widget widget_services ftr-list-center  tools-item-text">
                                            <ul>
                                                <li><NavLink to={publicUser.calculator.GSTCalculator}>GST Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.ITRCalculator}>Income Tax Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.EPFCalculator}>EPF Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.NPSCalculator}>NPS Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.HRACalculator}>HRA Calculator</NavLink></li>

                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="widget widget_services ftr-list-center ">
                                            <ul>
                                                <li><NavLink to={publicUser.calculator.SIPCalculator}>SIP Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.GratuityCalculator}>Gratuity Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.RetirementCalculator}>Retirement Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.FDCalculator}>Fixed Deposit Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.EMICalculator}>EMI Calculator</NavLink></li>

                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="widget widget_services ftr-list-center ">
                                            <ul>
                                                <li><NavLink to={publicUser.calculator.MutualFundCalculator}>Mutual Fund Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.PPFCalculator}>PPF Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.TDSCalculator}>TDS Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.SimpleInterestCalculator}>Simple Interest Calculator</NavLink></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="widget widget_services ftr-list-center ">
                                            <ul>
                                                <li><NavLink to={publicUser.calculator.RDCalculator}>RD Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.BusinessCalculator}>Business Tax Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.LumpsumCalculator}>Lumpsum Calculator</NavLink></li>
                                                <li><NavLink to={publicUser.calculator.HomeEMICalculator}>Home Loan EMI Calculator</NavLink></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>


                            </div>


                        </div>
                    </div>


                    {/* FOOTER COPYRIGHT */}


                    <div className="footer-bottom">
                        <div className="footer-bottom-info">

                            <div className="footer-copy-right">
                                 {footerdetails.length > 0 &&
    footerdetails.map((item,index) => (
        <>
                                <p className="company-title-footer">{item.companyName}</p>
                                <span className="copyrights-text">{item.copyrightText}</span>
                                </>
                                ))}
                            </div>
                            <div className="footer-image">
                                <JobZImage src="images/footer1/1.png" alt="image" />
                                <JobZImage src="images/footer1/2.png" alt="image" />
                                <JobZImage src="images/footer1/3.png" alt="image" />
                            </div>
                        </div>
                    </div>


                </div>
            </footer>
        </>
    )
}

export default Footer1;
