import React from "react";
import { useNavigate } from "react-router-dom";
import "../calculatorCss/AllCalculator.css"; // External CSS file

import gst from "../calculatorImage/images/All-Calculators-image/gst 1.png";
import incomeTax from "../calculatorImage/images/All-Calculators-image/itr 2.png";
import epfcalc from "../calculatorImage/epf2.png";
import nps from "../calculatorImage/images/All-Calculators-image/nps 1.png";
import hra from "../calculatorImage/images/All-Calculators-image/hra 1.png";
import sip from "../calculatorImage/images/All-Calculators-image/sip 1.png";
import gratuity from "../calculatorImage/images/All-Calculators-image/gratuti 1 .png";
import retirement from "../calculatorImage/images/All-Calculators-image/retir 1.png";
import rd from "../calculatorImage/images/All-Calculators-image/rd 1.png";
import simple from "../calculatorImage/images/All-Calculators-image/sim 1.png";
import tds from "../calculatorImage/images/All-Calculators-image/tds 1.png";
import ppf from "../calculatorImage/images/All-Calculators-image/ppf 1.png";
import mutual from "../calculatorImage/images/All-Calculators-image/mf 1.png";
import emi from "../calculatorImage/images/All-Calculators-image/emi 2.png";
import fd from "../calculatorImage/images/All-Calculators-image/fd 1.png";
import lump from "../calculatorImage/images/All-Calculators-image/lum 1.png";
import business from "../calculatorImage/images/All-Calculators-image/bui 1.png";
import home from "../calculatorImage/images/All-Calculators-image/emi 1.png";
const AllCalculator = () => {
  const navigate = useNavigate();
  const calculators = [
    {
      title: "GST Calculator",
      img: gst,
      link: "/gst-calc",
      desc: "GST (Goods and Services Tax) Calculator helps you calculate the amount of tax to be added or removed from a base price, based on applicable GST rates. Useful for businesses and consumers alike."
    },
    {
      title: "Income Tax Calculator",
      img: incomeTax,
      link: "/itr-calc",
      desc: "The Income Tax Calculator lets you estimate your tax liability based on your income, deductions, and applicable slabs. Designed for individuals to plan taxes effectively."
    },
    {
      title: "EPF Calculator",
      img: epfcalc,
      link: "/epf-calc",
      desc: "The EPF Calculator helps estimate the Employee Provident Fund corpus at retirement based on your monthly contribution, employer contribution, interest rate, and tenure."
    },
    {
      title: "NPS Calculator",
      img: nps,
      link: "/nps-calc",
      desc: "The NPS Calculator estimates your retirement savings and pension amount under the National Pension Scheme based on your monthly contribution and investment duration."
    },
    {
      title: "HRA Calculator",
      img: hra,
      link: "/hra-calc",
      desc: "The HRA (House Rent Allowance) Calculator helps you determine the amount of HRA exemption you can claim under Section 10(13A) based on your salary, rent paid, and city of residence."
    },
    {
      title: "SIP Calculator",
      img: sip,
      link: "/sip-calc",
      desc: "SIP (Systematic Investment Plan) Calculator helps you estimate the future value of your mutual fund investments by entering monthly investment amount, duration, and expected return rate."
    },
    {
      title: "Gratuity Calculator",
      img: gratuity,
      link: "/gratuity-calc",
      desc: "The Gratuity Calculator estimates the lump sum amount payable to employees at the time of retirement or resignation as per the Payment of Gratuity Act."
    },
    {
      title: "Retirement Calculator",
      img: retirement,
      link: "/retirement-calc",
      desc: "The Retirement Calculator helps you plan your retirement by estimating the amount of money you need to accumulate to maintain your desired lifestyle after retirement."
    },
    {
      title: "RD Calculator",
      img: rd,
      link: "/rd-calc",
      desc: "The RD Calculator helps you calculate the maturity amount and interest earned on recurring deposit investments over a fixed period and monthly contribution."
    },
    {
      title: "Simple Interest Calculator",
      img: simple,
      link: "/simple-interest-calc",
      desc: "This Simple Interest Calculator helps you calculate interest earned or payable on a principal amount for a specific period at a fixed interest rate."
    },
    {
      title: "TDS Calculator",
      img: tds,
      link: "/tds-calc",
      desc: "TDS (Tax Deducted at Source) Calculator helps you compute the amount of tax that should be deducted on various income sources like salary, rent, interest, etc."
    },
    {
      title: "PPF Calculator",
      img: ppf,
      link: "/ppf-calc",
      desc: "The PPF Calculator estimates the maturity amount of your Public Provident Fund investment based on annual contributions and the applicable interest rate."
    },
    {
      title: "Mutual Fund Calculator",
      img: mutual,
      link: "/mutual-fund-calc",
      desc: "The Mutual Fund Calculator helps you calculate the expected returns from mutual fund investments based on amount, duration, and estimated annual return."
    },
    {
      title: "EMI Calculator",
      img: emi,
      link: "/emi-calc",
      desc: "This EMI (Equated Monthly Installment) Calculator helps you determine your monthly loan repayments based on loan amount, interest rate, and loan tenure."
    },
    {
      title: "Fixed Deposit Calculator",
      img: fd,
      link: "/fd-calc",
      desc: "The FD Calculator helps you calculate the maturity amount and interest earned on your fixed deposit investment over a fixed tenure and interest rate."
    },
    {
      title: "Home Loan EMI Calculator",
      img: home,
      link: "/home-loan-calc",
      desc: "The Home Loan EMI Calculator helps you estimate your monthly home loan EMIs and total repayment based on loan amount, interest rate, and tenure."
    },
    {
      title: "Lumpsum Calculator",
      img: lump,
      link: "/lumpsum-calc",
      desc: "The Lumpsum Calculator estimates the future value of your one-time investment in mutual funds or any other investment avenue based on the expected return rate."
    },
    {
      title: "Business Tax Calculator",
      img: business,
      link: "/business-calc",
      desc: "The Business Tax Calculator helps small businesses and startups estimate their income tax liability based on annual income, expenses, and applicable tax rates."
    }
  ];


  return (
    <section className="all-calc-container">
      <div className="all-calc-wrapper">
        <h1 className="page-title ">Calculators</h1>
        <div className="calc-grid ">
          {calculators.map((item, index) => (
            <div key={index} className="calc-card" onClick={() => navigate(item.link)}>
              <p className="calc-title">{item.title}</p>
              <span className="calc-description">{item.desc}</span>
              <img src={item.img} alt={item.title} className="calc-image" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllCalculator;