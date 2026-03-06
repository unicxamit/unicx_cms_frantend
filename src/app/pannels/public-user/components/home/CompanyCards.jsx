import React, { useEffect, useState } from 'react';
import './CompanyCards.css'; // We'll create this CSS file
import JobZImage from '../../../../common/jobz-img';
import { NavLink } from 'react-router-dom';
import { publicUser } from '../../../../../globals/route-names';
import { getTopCompanys } from '../../../../../adminApi';
import Skeleton from '../../../../common/skeleton/Skeleton';

const CompanyCards = () => {
   const [companys,setCompanys]=useState([])
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleFetchCompanies = async () => {
      try {
        const res = await getTopCompanys();
        const activeTopCompanys=(res.topCompanies || []).filter((cs)=> cs.status === "active")
        setCompanys(activeTopCompanys);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleFetchCompanies();
  }, []);
   

    const companyLogos = [
        'images/company-final/1.webp',
        'images/company-final/2.webp',
        'images/company-final/3.webp',
        'images/company-final/4.webp',
        'images/company-final/5.webp',
        'images/company-final/6.webp',
        'images/company-final/7.webp',
        'images/company-final/8.webp',
        'images/company-final/9.webp',
        'images/company-final/10.webp',
        'images/company-final/11.webp',
        'images/company-final/12.webp',
        'images/company-final/13.webp',
        'images/company-final/14.webp',
        'images/company-final/15.webp',
        'images/company-final/16.webp',
        'images/company-final/17.webp',
        'images/company-final/18.webp',
        'images/company-final/19.webp',
        'images/company-final/20.webp',
        'images/company-final/21.webp',
        'images/company-final/22.webp',
        'images/company-final/23.webp',
        'images/company-final/24.webp',
        'images/company-final/25.webp',
        'images/company-final/26.webp',
        'images/company-final/27.webp',
        'images/company-final/28.webp',
        'images/company-final/29.webp',
        'images/company-final/30.webp',
        'images/company-final/31.webp',
        'images/company-final/32.webp',
        'images/company-final/33.webp',
        'images/company-final/34.webp',
        'images/company-final/35.webp',
        'images/company-final/36.webp',
        'images/company-final/37.webp',
        'images/company-final/38.webp',
        'images/company-final/39.webp',
        'images/company-final/40.webp',
        'images/company-final/41.webp',
        'images/company-final/42.webp',
        'images/company-final/43.webp',
        'images/company-final/44.webp',
        'images/company-final/45.webp',
        'images/company-final/46.webp',
        'images/company-final/47.webp',
        'images/company-final/48.webp',
        'images/company-final/49.webp',
        'images/company-final/50.webp',
        'images/company-final/51.webp',
    ];


    return (
        <div className="section-full p-t120 p-b90 site-bg-white twm-companies-wrap liquid-companies-bg">
            <div className="section-head center wt-small-separator-outer"style={{display:"flex",flexDirection:"column"}}>
          
                <div className="wt-small-separator site-text-primary">
                    <div>Top Companies</div>
                </div>
                <h2 className="wt-title">Our Valued customers</h2>
              
            </div>
            <div className="container">
                <div className="section-content">
                    <div className="scrolling-logos-container">
                        <div className="scrolling-logos">
                            {loading &&
                                [...Array(14)].map((_, index) => (
                                    <div className="logo-item" key={`skeleton-${index}`}>
                                        <div className="client-logo client-logo-media">
                                            <Skeleton width="110px" height="64px" />
                                        </div>
                                    </div>
                                ))
                            }

                            {/* First set of logos */}
                            {!loading && companys?.map((logo, index) => (
                                <div className="logo-item" key={`first-${index}`}>
                                    <div className="client-logo client-logo-media ui-glass-surface">
                                        {/* <NavLink>
                                            <JobZImage src={logo} alt={`Company ${index + 1}`} />
                                        </NavLink> */}
                                        {logo.images && logo.images.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            flexWrap: "wrap",
                          }}
                        >
                          {logo.images.map((img, index) => (
                            // <img
                            //   key={index}
                            //   src={img}
                            //   alt={`Blog Image ${index + 1}`}
                            //   style={{
                            //     width: "60px",
                            //     height: "40px",
                            //     objectFit: "cover",
                            //     borderRadius: "4px",
                            //   }}
                            // />
                          <NavLink>
                                            <JobZImage src={img} alt={`Company ${index + 1}`} />
                                        </NavLink> 
                          ))}
                        </div>
                      ) : (
                        <span>No Image</span>
                      )}
                                    </div>
                                </div>
                            ))}
                            {/* Duplicate set for continuous scrolling */}
                            {/* {companyLogos.map((logo, index) => (
                                <div className="logo-item" key={`second-${index}`}>
                                    <div className="client-logo client-logo-media ui-glass-surface">
                                        <NavLink>
                                            <JobZImage src={logo} alt={`Company ${index + 1}`} />
                                        </NavLink>
                                    </div>
                                </div>
                            ))} */}
                            {!loading && companys?.map((logo, index) => (
                                <div className="logo-item" key={`first-${index}`}>
                                    <div className="client-logo client-logo-media ui-glass-surface">
                                        {/* <NavLink>
                                            <JobZImage src={logo} alt={`Company ${index + 1}`} />
                                        </NavLink> */}
                                        {logo.images && logo.images.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            flexWrap: "wrap",
                          }}
                        >
                          {logo.images.map((img, index) => (
                           
                          <NavLink>
                                            <JobZImage src={img} alt={`Company ${index + 1}`} />
                                         </NavLink> 
                          ))}
                        </div>
                      ) : (
                        <span>No Image</span>
                      )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCards;


// import React, { useEffect, useState } from "react";
// import "./CompanyCards.css";
// import JobZImage from "../../../../common/jobz-img";
// import { NavLink } from "react-router-dom";
// import { getTopCompanys } from "../../../../../adminApi";

// const CompanyCards = () => {
//   const [companies, setCompanies] = useState([]);

//   useEffect(() => {
//     const handleFetchCompanies = async () => {
//       try {
//         const res = await getTopCompanys();
//         setCompanies(res?.topCompanies || []);
//       } catch (error) {
//         console.error(error.message);
//       }
//     };

//     handleFetchCompanies();
//   }, []);

//   const companyLogos = [
//     "images/company-final/1.webp",
//     "images/company-final/2.webp",
//     "images/company-final/3.webp",
//     "images/company-final/4.webp",
//     "images/company-final/5.webp",
//     // ...rest logos
//   ];

//   return (
//     <div className="section-full p-t120 p-b90 site-bg-white twm-companies-wrap liquid-companies-bg">
//       <div className="section-head center wt-small-separator-outer">
//         <div className="wt-small-separator site-text-primary">
//           <div>Top Companies</div>
//         </div>
//         <h2 className="wt-title">Our Valued Customers</h2>
//       </div>

//       <div className="container">
//         <div className="section-content">
//           <div className="scrolling-logos-container">
//             <div className="scrolling-logos">

//               {/* Dynamic companies from API */}
//               {companies?.map((company, companyIndex) => (
//                 <div className="logo-item" key={`company-${companyIndex}`}>
//                   <div className="client-logo client-logo-media">
//                     {company?.images && company?.images?.length > 0 ? (
//                       company?.images?.map((img, imgIndex) => (
//                         <NavLink key={`img-${imgIndex}`} to="#">
//                           <JobZImage
//                             src={img}
//                             alt={`Company ${companyIndex + 1}`}
//                           />
//                         </NavLink>
//                       ))
//                     ) : (
//                       <span>No Image</span>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Static logos for smooth scrolling */}
//               {/* {companyLogos.map((logo, index) => (
//                 <div className="logo-item" key={`static-${index}`}>
//                   <div className="client-logo client-logo-media">
//                     <NavLink to="#">
//                       <JobZImage src={logo} alt={`Company ${index + 1}`} />
//                     </NavLink>
//                   </div>
//                 </div>
//               ))} */}

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyCards;
