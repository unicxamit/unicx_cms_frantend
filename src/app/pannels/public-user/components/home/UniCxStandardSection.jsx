import React from "react";
import CountUp from "react-countup";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import JobZImage from "../../../../common/jobz-img";
import "./unicx-standard-section.css";

const valueCards = [
  {
    id: "01",
    title: "Personalized Attention",
    description:
      "One-on-one expert support tailored specifically to the DNA of your unique business needs.",
  },
  {
    id: "02",
    title: "Strategic Guidance",
    description:
      "Beyond the how, we focus on the why with tailored advice and smart solutions for your milestones.",
  },
  {
    id: "03",
    title: "Hands-On Support",
    description:
      "We walk the path with you, ensuring every step is executed with precision and confidence.",
  },
  {
    id: "04",
    title: "Goal-Focused",
    description:
      "We architect measurable outcomes that move your business forward, not vanity metrics.",
  },
  {
    id: "05",
    title: "Accelerated Results",
    description:
      "Save time with expert-led workflows designed to remove guesswork and ship faster.",
  },
  {
    id: "06",
    title: "Direct Expert Access",
    description:
      "No gatekeepers. Direct access to lead strategists keeps communication clear and fast.",
  },
];

function UniCxStandardSection() {
  return (
    <section className="section-full p-t120 p-b90 site-bg-white unicx-standard-wrap liquid-explore-bg">
      <div className="container">
        <div className="unicx-standard-head">
          <div className="unicx-standard-head-left">
            <span className="unicx-standard-kicker">Why UniCX</span>
            <h2 className="unicx-standard-title">
              The UniCX <br />
              <span>Standard</span>
            </h2>
          </div>
          <p className="unicx-standard-subtitle">
            We bridge the gap between complex engineering and human-centric design.
            At UniCX, we do not just provide services; we craft digital legacies
            through a strategic, hands-on approach.
          </p>
        </div>

        <div className="unicx-standard-layout">
          <div className="unicx-standard-side unicx-standard-side-left">
            {valueCards.slice(0, 3).map((card, index) => (
              <article
                className={`unicx-standard-card unicx-left-card-${index + 1}`}
                key={card.id}
              >
                <span className="unicx-standard-number">{card.id}.</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>

          <div className="unicx-standard-center">
            <div className="unicx-standard-circle-bg" aria-hidden="true">
              <JobZImage src="images/home-4/bg-circle.png" alt="" />
            </div>
            <div
              className="unicx-shot-pic1 anm"
              data-speed-x={-4}
              data-speed-scale={-25}
              aria-hidden="true"
            >
              <JobZImage src="images/home-4/sq-1.png" alt="" />
            </div>
            <div
              className="unicx-shot-pic2 anm"
              data-speed-x={2}
              data-speed-y={2}
              aria-hidden="true"
            >
              <JobZImage src="images/home-4/triangle.png" alt="" />
            </div>
            <div
              className="unicx-shot-pic3 anm"
              data-speed-x={-4}
              data-speed-scale={-25}
              aria-hidden="true"
            >
              <JobZImage src="images/home-4/circle.png" alt="" />
            </div>
            <article className="unicx-standard-hero">
              <JobZImage
                src="images/Why_Choose_UniCX/whyChoose.webp"
                alt="UniCX Team Collaboration"
                className="unicx-standard-hero-image"
              />
            </article>
            <div
              className="counter-outer-two one anm"
              data-speed-y={-2}
              data-speed-scale={15}
              data-speed-opacity={1}
            >
              <div className="icon-content">
                <div className="tw-count-number text-clr-yellow-2">
                  <span className="counter">
                    <CountUp end={25} duration={10} />
                  </span>
                  K+
                </div>
                <p
                  className="icon-content-info-1"
                  style={{ fontSize: "14px", marginBottom: "0" }}
                >
                  Daily Productive Engagements
                </p>
              </div>
            </div>
            <div
              className="counter-outer-two two anm"
              data-speed-y={2}
              data-speed-scale={15}
              data-speed-opacity={5}
            >
              <div className="icon-content">
                <div className="tw-count-number text-clr-green">
                  <span className="counter">
                    <CountUp end={100} duration={10} />
                  </span>
                  %
                </div>
                <p
                  className="icon-content-info-1"
                  style={{ fontSize: "14px", marginBottom: "0" }}
                >
                  On Page Dedicated Consulting
                </p>
              </div>
            </div>
            <div
              className="counter-outer-two three anm"
              data-speed-x={-4}
              data-speed-scale={-25}
            >
              <div className="icon-content">
                <div className="tw-count-number text-clr-pink">
                  <span className="counter">
                    <CountUp end={95} duration={10} />
                  </span>
                  %
                </div>
                <p
                  className="icon-content-info-1"
                  style={{ fontSize: "14px", marginBottom: "0" }}
                >
                  Repeat Customers
                </p>
              </div>
            </div>
          </div>

          <div className="unicx-standard-side unicx-standard-side-right">
            {valueCards.slice(3).map((card, index) => (
              <article
                className={`unicx-standard-card unicx-right-card-${index + 1}`}
                key={card.id}
              >
                <span className="unicx-standard-number">{card.id}.</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="unicx-standard-footer">
          <div className="unicx-standard-avatars">
            <JobZImage src="images/main-slider/slider1/user/2.svg" alt="Expert 1" />
            <JobZImage src="images/main-slider/slider1/user/3.svg" alt="Expert 2" />
            <JobZImage src="images/main-slider/slider1/user/4.svg" alt="Expert 3" />
            <p>Join 500+ global brands scaling with UniCX</p>
          </div>
          <NavLink to={publicUser.pages.CONTACT} className="unicx-standard-cta">
            Start your journey
            <span aria-hidden="true">-&gt;</span>
          </NavLink>
        </div>
      </div>
    </section>
  );
}

export default UniCxStandardSection;
