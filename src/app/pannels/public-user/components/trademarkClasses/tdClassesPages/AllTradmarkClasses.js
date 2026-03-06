import React, { useState } from "react";
import { publicUser } from "../../../../../../globals/route-names";
// import { Link } from "lucide-react";
import classesData from "./tradmarkClassesDynamicDataList";

import { Link } from "react-router-dom";
import "../tdClassCss/classList.css";



const  AllTradmarkClasses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = classesData.filter((cls) =>
    cls.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goodsClasses = filteredClasses.filter((cls) => cls.category === "Goods");
  const servicesClasses = filteredClasses.filter((cls) => cls.category === "Services");

  const renderCards = (dataList) => {
    return dataList.map((cls, index) => {
      const colorClasses = ["city"];
      const colorClass = colorClasses[index % colorClasses.length];

      return (
        <div className="card-shell" key={cls.id}>
          <div className="card">
          <div className="flip-card">
            <div className="flip-card__container">
              <div className={`card-front card-front--${colorClass}`}>
                <div className={`card-front__tp card-front__tp--${colorClass}`}>
                  <div className="TradmarkClassIcons">
                    <img src={cls.icon1} alt={cls.title} className="tdIcons" />
                  </div>
                  <h2 className="card-front__heading">{cls.title}</h2>
                  <p className="card-front__category">{cls.category}</p>
                </div>
                <div className="card-front__bt">
                  <p className={`card-front__text-view card-front__text-view--${colorClass}`}>
                    View me
                  </p>
                </div>
              </div>
              <div className={`card-back card-back--${colorClass}`} />
            </div>
          </div>

          <div className={`inside-page inside-page--${colorClass}`}>
            <div className="inside-page__container">
              <h6 className={`inside-page__heading inside-page__heading--${colorClass}`}>
                Explore {cls.title}
              </h6>
              <p className="inside-page__text">Learn more about {cls.title}.</p>
              <Link to={`${publicUser?.tdclasses?.TdClass01}/${cls.id}`} className={`inside-page__btn inside-page__btn--${colorClass}`}>
                View deals
              </Link>
            </div>
          </div>
          </div>
        </div>
      );
    });
  };

  return (
    <section className="tm-classes-container">
      <div className="tm-classes-wrapper">
        <h1 className="tm-page-title">TM Classes</h1>

        <div className="main">
          <div className="tm-card-group">
            <h2 className="section-title">Goods Classes</h2>
            <div className="card-area">{renderCards(goodsClasses)}</div>
          </div>

          <div className="tm-card-group" style={{ marginTop: "12rem" }}>
            <h2 className="section-title">Services Classes</h2>
            <div className="card-area">{renderCards(servicesClasses)}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AllTradmarkClasses;






