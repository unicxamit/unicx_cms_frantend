import React, { useEffect, useRef, useState } from "react";
import { publicUrlFor } from "../../../../../globals/constants";
import { NavLink } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { getSubSubCategories } from "../../../../../adminApi";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";


// const services = [
//     { title: "Trademark <br /> Registration", icon: "1.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Copyright <br /> Registration", icon: "2.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Company <br /> Registration", icon: "3.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Trust/NGO <br /> Registration", icon: "4.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "GST <br />Registration", icon: "6.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "BIS <br /> Registration", icon: "11.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Cosmetics <br /> License", icon: "13.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Organic <br />License", icon: "15.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Drug <br /> License", icon: "17.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Website <br /> Design", icon: "19.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Logo <br /> Design", icon: "21.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Graphics <br /> Design", icon: "22.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "MSME <br /> Registration", icon: "7.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Start-up <br /> India Registration", icon: "8.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Import/Export <br /> Registration", icon: "9.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "FSSAI <br /> Registration", icon: "10.gif", link: '/some-valid-path' },
//     { title: "GST <br /> Filing", icon: "5.gif", link: '/some-valid-path' },
//     { title: "Annual <br /> Compliances", icon: "12.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "ISO <br /> Registration", icon: "14.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Trademark <br /> Objection", icon: "16.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Trademark <br /> Opposition", icon: "18.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Trademark  Infringement", icon: "20.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Sope  Act <br /> Registration", icon: "23.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Gem  <br /> Registration", icon: "24.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Franchise <br /> Registration", icon: "25.gif", link: publicUser.jobs.DETAIL1 },
//     { title: "Design  <br /> Registration", icon: "26.gif", link: publicUser.jobs.DETAIL1 },
// ];



const Indemand = () => {
  const swiperRef = useRef(null);
  const nextRef = useRef(null);
  const prevRef = useRef(null);
  const swiperInstanceRef = useRef(null);

  const [services, setServices] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const toActiveStatus = (value) => {
    if (typeof value !== "string") return "active";
    return value.trim().toLowerCase();
  };

  const normalizeImageSrc = (value) => {
    if (typeof value !== "string") return "";
    return value.trim().replace(/\\/g, "/");
  };

  useEffect(() => {
    // fetchIndemanServices
    const fetchInDemandServices = async () => {
      try {
        const data = await getSubSubCategories();
        const rawServices = Array.isArray(data?.services)
          ? data.services
          : Array.isArray(data?.data?.services)
            ? data.data.services
            : [];

        const activeInDemandServices = rawServices
          .filter((service) => {
            const inDemandState = toActiveStatus(service?.Insrstatus);
            const serviceState = toActiveStatus(service?.status);
            return inDemandState === "active" && serviceState === "active";
          })
          .map((service) => ({
            ...service,
            indeman_service_name:
              service?.indeman_service_name || service?.name || service?.search_tag || "",
            indeman_sericons: normalizeImageSrc(service?.indeman_sericons),
          }));

        setServices(activeInDemandServices);
        setFetchError("");
        console.log("Fetched In-Demand Services:", activeInDemandServices);
      } catch (error) {
        setServices([]);
        setFetchError("Unable to load in-demand services.");
        console.error("Error fetching in-demand services:", error);
      }
    };
    fetchInDemandServices();
  }, [])
  // 2. Group services into pairs to create the two-row effect.
  // const groupedServices = [];
  // for (let i = 0; i < services.length; i += 2) {
  //     groupedServices.push(services.slice(i, i + 2));
  // }
  const groupedServices = [];
  for (let i = 0; i < services.length; i += 2) {
    groupedServices.push(services.slice(i, i + 2));
  }

  // useEffect(() => {
  //     if (swiperRef.current && window.Swiper) {
  //         const swiper = new window.Swiper(swiperRef.current, {
  //             init: true,
  //             slidesPerView: 6,
  //             spaceBetween: 30,
  //             slidesPerGroup: 1,
  //             loop: true, // Enables infinite looping
  //             observer: true,
  //             observeParents: true,

  //             // 3. Autoplay configuration for auto-scrolling
  //             autoplay: {
  //                 delay: 3000,                   // Time in ms between slides
  //                 disableOnInteraction: false,   // Autoplay will resume after user interaction
  //                 pauseOnMouseEnter: true,       // Pause autoplay on mouse hover
  //             },
  //             navigation: {
  //                 nextEl: ".swiper-button-next",
  //                 prevEl: ".swiper-button-prev",
  //             },
  //             breakpoints: {
  //                 0: { slidesPerView: 1 },
  //                 640: { slidesPerView: 2 },
  //                 991: { slidesPerView: 3 },
  //                 1366: { slidesPerView: 4 },
  //                 1440: { slidesPerView: 5 },
  //                 1721: { slidesPerView: 6 },
  //             },
  //         });

  //         return () => {
  //             if (swiper && swiper.destroy) {
  //                 swiper.destroy();
  //             }
  //         };
  //     }
  // }, []);
  useEffect(() => {
    if (!swiperRef.current || !window.Swiper || groupedServices.length === 0) return;

    if (swiperInstanceRef.current?.destroy) {
      swiperInstanceRef.current.destroy(true, true);
      swiperInstanceRef.current = null;
    }

    const canSlide = groupedServices.length > 1;
    const canLoop = groupedServices.length > 6;

    swiperInstanceRef.current = new window.Swiper(swiperRef.current, {
      slidesPerView: 6,
      spaceBetween: 30,
      loop: canLoop,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      allowTouchMove: canSlide,
      autoplay: canSlide
        ? {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }
        : false,
      navigation: canSlide
        ? {
          nextEl: nextRef.current,
          prevEl: prevRef.current,
        }
        : false,
      breakpoints: {
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        991: { slidesPerView: 3 },
        1366: { slidesPerView: 4 },
        1440: { slidesPerView: 5 },
        1721: { slidesPerView: 6 },
      },
    });

    return () => {
      if (swiperInstanceRef.current?.destroy) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    };
  }, [groupedServices.length]);


  // Helper function to render a single service item
  // const renderService = (service, index) => (
  //     <div className="job-categories-home-5" key={index}>
  //         <div className={`twm-media cat-bg-clr-${(index % 4) + 1}`}>
  //             <JobZImage src={`images/demand_services_icons/new_service/${service.indeman_sericons}`} alt="" />
  //         </div>
  //         <div className="twm-content">
  //             <NavLink to={service.link} dangerouslySetInnerHTML={{ __html: service.indeman_service_name }} />
  //         </div>
  //     </div>
  // );
  const renderService = (service, index) => {
    if (!service) return null;

    return (
      <div className="job-categories-home-5" key={index}>
        <div className={`twm-media cat-bg-clr-${(index % 4) + 1}`}>
          <JobZImage
            src={service?.indeman_sericons}
            alt={service?.indeman_service_name}
          />
        </div>
        <div className="twm-content">
          <NavLink
            to={`/subsubcategory/${service?._id}`}
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(service?.indeman_service_name),
            }}
          />
        </div>
      </div>
    );
  };


  return (
    <div>
      <style>{`
        .liquid-demand .job-categories-home-5{
          padding:25px;
          background:linear-gradient(155deg,rgba(255,255,255,0.65),rgba(255,255,255,0.28));
          box-shadow:0 14px 30px rgba(7,34,79,0.18),inset 0 1px 0 rgba(255,255,255,0.7);
          border-radius:10px;
          position:relative;
          z-index:1;
          overflow:hidden;
          text-align:center;
          transition:0.5s all ease;
          height:220px;
          margin:20px 0;
          border:1px solid rgba(255,255,255,0.55);
          backdrop-filter:blur(12px) saturate(155%);
          -webkit-backdrop-filter:blur(12px) saturate(155%);
        }
        .liquid-demand .job-categories-home-5:after{
          width:200px;
          height:200px;
          position:absolute;
          right:-90px;
          top:-100px;
          content:"";
          background:radial-gradient(circle at center,rgba(74,144,255,0.55),rgba(74,144,255,0.08));
          border-radius:50%;
          opacity:0.2;
          z-index:-1;
          transition:0.5s all ease;
        }
        .liquid-demand .job-categories-home-5:before{
          width:20px;
          height:70px;
          position:absolute;
          left:-12px;
          bottom:-8px;
          content:"";
          background:linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,255,255,0.25));
          border-radius:12px;
          opacity:0.35;
          z-index:-1;
          transition:0.5s all ease;
        }
        .liquid-demand .job-categories-home-5 .twm-media{
          width:80px;
          height:80px;
          line-height:0;
          display:flex;
          position:relative;
          z-index:1;
          align-items:center;
          justify-content:center;
          margin:0px auto 30px;
          border-radius:50%;
          overflow:hidden;
          transition:0.5s all ease;
          border:1px solid rgba(255,255,255,0.6);
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.75),0 8px 20px rgba(0,0,0,0.12);
        }
        .liquid-demand .job-categories-home-5 .twm-media:after{
          content:"";
          position:absolute;
          inset:0;
          border-radius:50%;
          background:linear-gradient(155deg,rgba(255,255,255,0.45),rgba(255,255,255,0.12));
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.65);
          pointer-events:none;
          z-index:2;
        }
        .liquid-demand .job-categories-home-5 .twm-media img{
          width:100%;
          height:100%;
          object-fit:cover;
          position:absolute;
          inset:0;
          z-index:1;
          transition:0.5s all ease;
        }
        .liquid-demand .job-categories-home-5 .twm-media [class*=flaticon-]{
          color:#fff;
          font-size:50px;
          line-height:0px;
          transition:0.5s all ease;
        }
        .liquid-demand .job-categories-home-5 .twm-media [class*=flaticon-]:before{
          transform:translateX(-50%);
          left:50%;
          position:inherit;
        }
        .liquid-demand .job-categories-home-5 .twm-content .twm-jobs-available{
          font-size:14px;
          display:block;
          margin-bottom:0px;
          transition:0.5s all ease;
          color:#475569;
        }
        .liquid-demand .job-categories-home-5 .twm-content a{
          margin-bottom:0px;
          display:block;
          transition:0.5s all ease;
          font-size:16px;
          font-weight:500;
          text-decoration:none;
          color:#0f172a;
          text-shadow:0 1px 0 rgba(255,255,255,0.35);
        }
        .liquid-demand .job-categories-home-5:hover{
          background:linear-gradient(155deg,rgba(14,21,32,0.72),rgba(27,53,94,0.52));
          border-color:rgba(255,255,255,0.6);
          box-shadow:0 20px 35px rgba(3,12,34,0.32),inset 0 1px 0 rgba(255,255,255,0.35);
        }
        .liquid-demand .job-categories-home-5:hover:after{opacity:0.6;}
        .liquid-demand .job-categories-home-5:hover:before{opacity:0.95;}
        .liquid-demand .job-categories-home-5:hover .twm-jobs-available{color:#cbd5e1;}
        .liquid-demand .job-categories-home-5:hover .twm-content a{
          color:#fff;
          text-shadow:0 1px 4px rgba(0,0,0,0.35);
        }
        .liquid-demand .job-categories-home-5:hover .twm-media{
          border-radius:20px;
          transform:rotate(45deg);
        }
        .liquid-demand .job-categories-home-5:hover .twm-media img{
          transform:scale(0.8) rotate(-45deg);
          z-index:9;
        }
        .liquid-demand .job-categories-home-5:hover .twm-media [class*=flaticon-]{
          transform:scale(0.8) rotate(-45deg);
          z-index:9;
        }
        .liquid-demand .cat-bg-clr-1{
          background:linear-gradient(145deg,rgba(255,255,255,0.9),rgba(238,246,255,0.58));
        }
        .liquid-demand .cat-bg-clr-2{
          background:linear-gradient(145deg,rgba(255,255,255,0.9),rgba(235,255,250,0.58));
        }
        .liquid-demand .cat-bg-clr-3{
          background:linear-gradient(145deg,rgba(255,255,255,0.9),rgba(244,243,255,0.58));
        }
        .liquid-demand .cat-bg-clr-4{
          background:linear-gradient(145deg,rgba(255,255,255,0.9),rgba(255,243,246,0.58));
        }
        .liquid-demand .twm-jobs-grid-h5-section{
          background-color:rgba(255,255,255,0.22);
          border:1px solid rgba(255,255,255,0.55);
          border-radius:28px;
          box-shadow:0 24px 55px rgba(6,20,48,0.22),inset 0 1px 0 rgba(255,255,255,0.65);
          backdrop-filter:blur(14px) saturate(150%);
          -webkit-backdrop-filter:blur(14px) saturate(150%);
          overflow:visible;
        }
        .liquid-demand .twm-jobs-grid-h5-section-outer .overlay-main{
          border-radius:28px;
        }
        .liquid-demand .twm-jobs-grid-h5-section .overlay-main.liquid-overlay{
          background:
            linear-gradient(145deg,rgba(255,255,255,0.34),rgba(255,255,255,0.09)),
            linear-gradient(160deg,rgba(28,98,222,0.26),rgba(19,93,224,0.08));
          opacity:1;
          backdrop-filter:blur(6px);
          -webkit-backdrop-filter:blur(6px);
        }
        @media (max-width:480px){
          .liquid-demand .twm-jobs-grid-h5-section{
            border-radius:16px;
          }
          .liquid-demand .twm-jobs-grid-h5-section-outer .overlay-main{
            border-radius:16px;
          }
        }
        .liquid-demand .category-5-slider .swiper-button-next,
        .liquid-demand .category-5-slider .swiper-button-prev{
          width:50px;
          height:50px;
          border-radius:50%;
          background:linear-gradient(155deg,rgba(255,255,255,0.52),rgba(255,255,255,0.22));
          border:1px solid rgba(255,255,255,0.65);
          box-shadow:0 10px 24px rgba(5,16,40,0.28),inset 0 1px 0 rgba(255,255,255,0.8);
          backdrop-filter:blur(10px) saturate(160%);
          -webkit-backdrop-filter:blur(10px) saturate(160%);
          transition:0.35s all ease;
        }
        .liquid-demand .category-5-slider .swiper-button-next::after,
        .liquid-demand .category-5-slider .swiper-button-prev::after{
          width:50px;
          height:50px;
          border-radius:50%;
          border:1px solid rgba(255,255,255,0.45);
          color:#ffffff;
          font-size:18px;
          line-height:48px;
          text-shadow:0 1px 4px rgba(0,0,0,0.35);
          background:transparent;
        }
        .liquid-demand .category-5-slider .swiper-button-next:hover,
        .liquid-demand .category-5-slider .swiper-button-prev:hover{
          transform:translateY(-2px) scale(1.04);
          background:linear-gradient(155deg,rgba(255,255,255,0.68),rgba(255,255,255,0.3));
          border-color:rgba(255,255,255,0.85);
          box-shadow:0 14px 28px rgba(5,16,40,0.34),inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .liquid-demand .category-5-slider .swiper-button-disabled{
          opacity:0.35;
          pointer-events:none;
        }
        .liquid-demand .category-5-slider .swiper-button-lock{
          display:none;
        }
        @media (max-width:1600px) and (min-width:1200px){
          .liquid-demand.section-full{
            padding-top:40px !important;
            margin-top:0 !important;
          }
          .liquid-demand .section-head{
            margin-bottom:22px !important;
          }
        }
      `}</style>
      <div className="section-full p-t120 p-b90 site-bg-white job-categories-home-5-wrap twm-bdr-bottom-1 liquid-demand">
        <div className="container">
          <div className="section-head center wt-small-separator-outer">
            <div className="wt-small-separator site-text-primary">
              <div>In-Demand Services</div>
            </div>
            <h2 className="wt-title">Valuable services delivered with dedication-at a price you can afford! </h2>
          </div>
        </div>
        <div className="section-content twm-jobs-grid-h5-section-outer">
          <div className="twm-jobs-grid-h5-section overlay-wraper" style={{
            backgroundImage: `url(${publicUrlFor("images/home-5/Services_BG.svg")})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll',
            backgroundColor: '#ffffff'
          }}>
            <div className="overlay-main liquid-overlay" />
            <div className="swiper-container category-5-slider" ref={swiperRef}>
              <div className="swiper-wrapper">
                {/* 4. Map over the grouped pairs to render slides with two items each */}
                {groupedServices.map((group, index) => (
                  <div className="swiper-slide" key={index}>
                    {group[0] && renderService(group[0], index * 2)}
                    {group[1] && renderService(group[1], index * 2 + 1)}
                  </div>
                ))}
              </div>
              {services.length === 0 && fetchError && (
                <div
                  style={{
                    color: "#0f172a",
                    textAlign: "center",
                    padding: "28px 16px",
                    fontWeight: 500,
                  }}
                >
                  {fetchError}
                </div>
              )}
              <div className="swiper-button-prev" ref={prevRef} />
              <div className="swiper-button-next" ref={nextRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Indemand;
