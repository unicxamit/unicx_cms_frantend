import React, { useState, useEffect } from "react";
// import { FaRupeeSign } from "react-icons/fa";
import {
  BarChart,
  DollarSign,
  Clock,
  HelpCircle,
  CheckCircle,
  ChevronDown,
  Target,
  Percent,
  CalendarDays,
} from "lucide-react";
import Header from "../component/Header";
import simplelogo from "../assets/images/calculators_img/BG IMAGES/sim1.png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how4.png"
import benifite from "../assets/images/calculators_img/BG IMAGES/5 png .png"
import "../calculatorCss/SimpleInterestCalculator.css";
import { FaRupeeSign } from "react-icons/fa";


function SimpleInterestCalculator() {
  const [activeTab, setActiveTab] = useState("simple");
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("4");
  const [time, setTime] = useState("2");

  const [compoundings, setCompoundings] = useState("1");

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  // Refined validateInputs to set specific error messages for each field
  const validateInputs = () => {
    let newErrors = {};
    let isValid = true;
    const P = parseFloat(principal);
    const r = parseFloat(rate);
    const T = parseFloat(time);

    if (isNaN(P) || P < 100 || P > 1000000000) {
      newErrors.principal = "Amount must be between ?100 and ?1,00,00,000.";
      isValid = false;
    }
    if (isNaN(r) || r <= 0.0 || r > 100) {
      // Changed 0 to 0.0 for clarity, assuming rate can be very small but not zero or negative
      newErrors.rate = "Annual Return must be between 0.1% and 100%.";
      isValid = false;
    }
    if (isNaN(T) || T <= 0 || T > 100) {
      newErrors.time = "Duration must be between 1 and 100 years.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const formatNumber = (num) => {
    if (num === null || isNaN(num) || num === "") return "0.00";
    return parseFloat(num).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const calculateInterest = () => {
    if (!validateInputs()) {
      setResult(null); // Clear previous results if inputs are invalid
      return;
    }

    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const T = parseFloat(time);

    if (activeTab === "simple") {
      const SI = (P * R * T) / 100;
      const total = P + SI;

      setResult({
        type: "simple",
        principal: P.toFixed(2),
        interest: SI.toFixed(2),
        total: total.toFixed(2),
      });
    } else {
      // activeTab === 'compound'
      const n = parseInt(compoundings);
      const r = R / 100;
      const A = P * Math.pow(1 + r / n, n * T);
      const CI = A - P;

      setResult({
        type: "compound",
        principal: P.toFixed(2),
        interest: CI.toFixed(2),
        total: A.toFixed(2),
      });
    }
  };

  useEffect(() => {
    calculateInterest();
  }, [principal, rate, time, compoundings, activeTab]);

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (value <= 100) {
      setTime(value);
      setErrors((prev) => ({ ...prev, time: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        time: "Duration must be between 1 and 100 years.",
      }));
    }
  };

  // Rate input handler
  const handleRateChange = (e) => {
    const value = e.target.value;
    if (Number(value) <= 100) {
      setRate(value);
      setErrors((prev) => ({ ...prev, rate: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        rate: "Annual Return must be between 0.1% and 100%.",
      }));
    }
  };

  // Amount input handler
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value <= 1000000000) {
      setPrincipal(value);
      setErrors((prev) => ({ ...prev, principal: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        principal: '"Amount must be between ?100 and ?1,00,00,000."',
      }));
    }
  };
  const [openFAQ, setOpenFAQ] = React.useState(null);
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // FAQs data
  const interestFaqs = [
    {
      q: "Q1: Is interest always compounded?",
      a: "A1: No, it depends on the financial product. Savings accounts often use simple interest (or compound daily/monthly but paid quarterly/annually). Fixed Deposits and most loans use compound interest. Always check the terms and conditions.",
    },
    {
      q: "Q2: Which is better: Simple Interest or Compound Interest?",
      a: "A2: For investments, compound interest is always better as it allows your money to grow exponentially. For loans, simple interest is better as it means you pay less overall.",
    },
    {
      q: "Q3: How does compounding frequency affect returns?",
      a: "A3: The more frequently interest is compounded (e.g., monthly vs. annually), the higher the effective annual return will be. This is because interest is added to the principal more often, allowing it to start earning interest sooner.",
    },
    {
      q: 'Q4: What is the "Rule of 72" and how is it used?',
      a: "A4: The Rule of 72 is a quick mental math shortcut to estimate the number of years it takes for an investment to double in value. You simply divide 72 by the annual interest rate. For example, if you earn 6% interest, your money will roughly double in 12 years (72 / 6 = 12).",
    },
    {
      q: "Q5: Do all loans use compound interest?",
      a: "A5: Most significant loans (like home loans, personal loans, car loans, and especially credit card debt) use compound interest, which means interest accrues on the outstanding principal balance. However, some very short-term or specific types of loans might use simple interest. Always read your loan agreement carefully.",
    },
  ];
  return (
    <>
      <Header />
      <div className="simpleinterest-section">
        <div className="simpleinterest-container">
          {/* Left Section: Introduction and Description */}
<div className="">
          <div className="simpleinterest-header">
            <h1 className="heading-title">
              Simple & Compound Interest Calculator
            </h1>
           
          </div>

          {/* Right Section: Calculator Inputs and Results */}
          <div className="simpleinterest-grid">
            {/* Input Fields Section */}

            <div className="">
              <div className="simpleinterest-type-group">
                <button
                  onClick={() => {
                    setActiveTab("simple");
                    setResult(null);
                    // setErrors({});
                  }}
                  className={`simpleinterest-type-btn  
                                ${
                                  activeTab === "simple"
                                    ? "simpleinterest-type-active"
                                    : "simpleinterest-type-inactive"
                                }
                            `}
                >
                  Simple Interest
                </button>
                <button
                  onClick={() => {
                    setActiveTab("compound");
                    setResult(null);
                    // setErrors({});
                  }}
                  className={`simpleinterest-type-btn 
                                ${
                                  activeTab === "compound"
                                    ? "simpleinterest-type-active"
                                    : "simpleinterest-type-inactive"
                                }
                            `}
                >
                  Compound Interest
                </button>
              </div>
              <div className="simpleinterest-field" style={{ marginTop: "1rem" }}>
                {/* Input: Principal Amount */}
                <div className="simpleinterest-field">
                  <label
                    htmlFor="principal"
                    className="simpleinterest-label"
                  >
                    Principal Amount (?):
                  </label>
                  <div
                    className={`simpleinterest-input-group
                                             ${
                                               errors.principal
                                                 ? "simpleinterest-input-error"
                                                 : "simpleinterest-input-focus"
                                             }`}
                  >
                     <FaRupeeSign className="simple-icons" />
                    <input
                      type="number"
                      id="principal"
                      value={principal}
                      onChange={(e) => handleAmountChange(e)}
                      className="simpleinterest-input "
                      min="0"
                      placeholder="e.g., 50000"
                      aria-label="Principal Amount"
                    />
                  </div>
                  {errors.principal && (
                    <p className="error-text">{errors.principal}</p>
                  )}
                </div>

                {/* Input: Annual Interest Rate */}
                <div className="simpleinterest-field">
                  <label
                    htmlFor="rate"
                    className="simpleinterest-label"
                  >
                    Annual Interest Rate (%):
                  </label>
                  <div
                    className={`simpleinterest-input-group
                                             ${
                                               errors.rate
                                                 ? "simpleinterest-input-error"
                                                 : "simpleinterest-input-focus"
                                             }`}
                  >
                    <input
                      type="number"
                      id="rate"
                      value={rate}
                      onChange={(e) => handleRateChange(e)}
                      className="simpleinterest-input"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 7.5"
                      aria-label="Annual Interest Rate"
                    />
                                        <label className="simpleinterest-label-years">
                     %
                    </label>
                  </div>
                  {errors.rate && <p className="error-text">{errors.rate}</p>}
                </div>

                {/* Input: Time (Years) */}
                <div className="simpleinterest-field">
                  <label
                    htmlFor="time"
                    className="simpleinterest-label"
                  >
                    Time Period (in Years):
                  </label>
                  <div
                    className={` simpleinterest-input-group
                                             ${
                                               errors.time
                                                 ? "simpleinterest-input-error"
                                                 : "simpleinterest-input-focus"
                                             }`}
                  >
                    <input
                      type="number"
                      id="time"
                      value={time}
                      onChange={(e) => handleAgeChange(e)}
                      className="simpleinterest-input"
                      min="0"
                      placeholder="e.g., 10"
                      aria-label="Time Period in Years"
                    />
                                      <label className="simpleinterest-label-years">
                    %
                    </label>
                  </div>
                  {errors.time && <p className="error-text">{errors.time}</p>}
                </div>

                {/* Compound-Specific Input */}
                {activeTab === "compound" && (
                  <div className="simpleinterest-field">
                    <label
                      htmlFor="compoundings"
                      className="simpleinterest-label"
                    >
                      Compoundings per Year:
                    </label>
                    <div className="simpleinterest-select-group">
                      <select
                        id="compoundings"
                        value={compoundings}
                        onChange={(e) => setCompoundings(e.target.value)}
                        className="simpleinterest-select"
                        aria-label="Compoundings per Year"
                      >
                        <option value="1">Yearly</option>
                        <option value="2">Half-Yearly</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Result Section */}
            <div className="simpleinterest-results">
              {result && (
                <div className="simpleinterest-results-inner">
                  <div className="space-y-6">
                    <div className="simpleinterest-result-row">
                      <span className=" simpleinterest-result-field">Principal Amount:</span>
                      <span className="simpleinterest-result-row-span">
                        ₹ {formatNumber(result.principal)}
                      </span>
                    </div>
                    <div className="simpleinterest-result-row">
                      <span className="simpleinterest-result-field">
                        Total Interest Earned:
                      </span>
                      <span className="simpleinterest-result-row-span">
                        ₹ {formatNumber(result.interest)}
                      </span>
                    </div>
                  </div>
                  <div className="simpleinterest-total-row ">
                    <span className=" ">Total Value:</span>
                    <span className="">₹ {formatNumber(result.total)}</span>
                  </div>
                </div>
              )}

              <p className="simpleinterest-estimate-note">
                * This calculator provides an estimate. Actual returns may vary
                based on specific terms, taxation, and financial institution
                policies.
              </p>
            </div>
          </div>

         <section className="si-info-section">
  <div className="si-info-content">
    {/* What are Simple & Compound Interest? Section */}
    <section className="si-section">
      <h2 className="header-main">
        What are Simple Interest & Compound Interest?
      </h2>
      <div className="si-section-grid">
        <div>
          <p className="p-content ">
            Understanding how interest works is fundamental to effective
            financial planning, whether you're saving, investing, or
            taking a loan. The
            <strong className="bold-content">
              UniCX Simple & Compound Interest Calculator
            </strong>
            helps you differentiate and calculate the impact of these two
            core concepts:
          </p>
          <ul className="si-section-ul">
            <li className="list-content">
              <strong className="bold-content">
                Simple Interest (SI):
              </strong>
              This is the most straightforward form of interest. It is
              calculated
              <strong className="bold-content">
                only on the principal amount
              </strong>
              you initially invest or borrow. The interest earned or paid
              remains constant throughout the tenure, as it does not
              factor in previously earned interest.
            </li>
            <li className="list-content">
              <strong className="bold-content">
                Compound Interest (CI):
              </strong>
              Often called the "eighth wonder of the world," compound
              interest is calculated on the
              <strong className="bold-content">
                initial principal amount AND on the accumulated interest
              </strong>
              from previous periods. This means your interest begins to
              earn its own interest, leading to exponential growth over
              time. The more frequently interest is compounded (e.g.,
              monthly vs. annually), the faster your money grows.
            </li>
          </ul>
        </div>
        <div className="si-img-box si-img-hover">
          <img
            src={simplelogo}
            alt="Simple & Compound Interest Illustration"
            className="si-img"
          />
        </div>
      </div>
    </section>

    {/* Key Benefits of Using the UniCX Simple & Compound Interest Calculator */}
    <section className="si-section">
      <div>
        <h2 className="header-main">
          Key Benefits of Using the UniCX Simple & Compound Interest Calculator
        </h2>
        <p className="p-content ">
          Our calculator is an indispensable tool for anyone looking
          to understand the mechanics of interest and make informed
          financial decisions:
        </p>
        <ul className="si-icon-list">
          <li className="list-content">
            <strong className="si-icon-title">
              <BarChart size={18} className="si-icon" />
              Visualize Growth:
            </strong>
            <span className="si-icon-desc">
              Clearly see how your money grows under both simple and
              compound interest scenarios, especially over
              <strong className="bold-content"> longer periods</strong>.
            </span>
          </li>
          <li className="list-content">
            <strong className="si-icon-title">
              <Target size={18} className="si-icon" />
              Compare Investment Options:
            </strong>
            <span className="si-icon-desc">
              Evaluate potential returns from various investment
              avenues that offer
              <strong className="bold-content"> different interest calculation methods</strong>.
            </span>
          </li>
          <li className="list-content">
            <strong className="si-icon-title">
              <DollarSign size={18} className="si-icon" />
              Plan for Loans & Debts:
            </strong>
            <span className="si-icon-desc">
              Understand the
              <strong className="bold-content"> true cost of borrowing money</strong>
              where interest is often compounded.
            </span>
          </li>
          <li className="list-content">
            <strong className="si-icon-title">
              <CheckCircle size={18} className="si-icon" />
              Empower Financial Decisions:
            </strong>
            <span className="si-icon-desc">
              Gain clarity on how interest rates, principal amounts,
              time, and compounding frequency
              <strong className="bold-content"> impact your financial outcomes</strong>.
            </span>
          </li>
          <li className="list-content">
            <strong className="si-icon-title">
              <HelpCircle size={18} className="si-icon" />
              Educational Tool:
            </strong>
            <span className="si-icon-desc">
              An excellent resource for students, financial novices,
              or anyone wanting to grasp the
              <strong className="bold-content"> basics of financial mathematics</strong>.
            </span>
          </li>
        </ul>
      </div>
    </section>

    {/* How to Use the UniCX Simple & Compound Interest Calculator Section */}
    <section className="">
      <h2 className="header-main">
        How to Use the UniCX Simple & Compound Interest Calculator
      </h2>
      <div className="si-section-grid">
        <div>
          <p className="p-content">
            Our calculator is designed to be user-friendly, allowing
            you to quickly determine interest earned or paid under
            different conditions.
          </p>
          <h3 className="si-section-subheading">
            Inputs Common to Both:
          </h3>
          <ol className="si-howto-ol">
            <li className="list-content">
              <strong>Principal Amount (?):</strong> The initial
              amount of money you are investing or borrowing.
            </li>
            <li className="list-content">
              <strong>Annual Interest Rate (%):</strong> The annual
              rate at which interest is applied.
            </li>
            <li className="list-content">
              <strong>Time Period (Years):</strong> The duration for
              which the money is invested or borrowed.
            </li>
          </ol>
          <h3 className="si-section-subheading">
            Additional Input for Compound Interest:
          </h3>
          <ul className="si-section-ul-indent">
            <li className="list-content">
              <strong>Compounding Frequency:</strong> Select how often
              the interest is compounded (Annually, Semi-annually,
              Quarterly, Monthly, or Daily).
            </li>
          </ul>
          <h3 className="si-section-subheading">
            Outputs:
          </h3>
          <p className="list-content">
            The calculator will instantly provide you with the
            <strong className="bold-content">
              Total Interest Earned
            </strong>
            (or paid) and the
            <strong className="bold-content">Total Amount</strong> at
            the end of the period.
          </p>
        </div>
        <div className="si-img-box si-img-hover">
          <img
            src={howuse}
            alt="How to use UniCX Simple & Compound Interest Calculator - Step by step guide"
            className="si-img si-img-lg"
          />
        </div>
      </div>
    </section>

    {/* Key Factors Influencing Interest */}
    <section className="si-section">
      <h2 className="header-main">
        Key Factors Influencing Interest
      </h2>
      <p className="p-content ">
        The amount of interest earned or paid is determined by several
        crucial factors:
      </p>
      <ul className="si-icon-list">
        <li className="list-content">
          <strong className="si-icon-title">
            <DollarSign size={18} className="si-icon" />
            Principal Amount:
          </strong>
          <span className="si-icon-desc">
            The
            <strong className="bold-content">
              initial sum of money
            </strong>
            . A larger principal will generate more interest, assuming
            other factors remain constant.
          </span>
        </li>
        <li className="list-content">
          <strong className="si-icon-title">
            <Percent size={18} className="si-icon" />
            Interest Rate:
          </strong>
          <span className="si-icon-desc">
            The
            <strong className="bold-content">
              percentage charged or earned
            </strong>
            on the principal per year. A higher interest rate leads to
            more interest over the same period.
          </span>
        </li>
        <li className="list-content">
          <strong className="si-icon-title">
            <CalendarDays size={18} className="si-icon" />
            Time Period:
          </strong>
          <span className="si-icon-desc">
            The <strong className="bold-content">duration</strong>
            for which the money is invested or borrowed. The longer
            the period, the more interest accrues, especially with
            compounding.
          </span>
        </li>
        <li className="list-content">
          <strong className="si-icon-title">
            <Clock size={18} className="si-icon" />
            Compounding Frequency (for CI only):
          </strong>
          <span className="si-icon-desc">
            How often the interest is added to the principal. The
            <strong className="bold-content">
              more frequently interest is compounded
            </strong>
            , the greater the total interest earned will be.
          </span>
        </li>
      </ul>
    </section>

    {/* Important Considerations for Interest Calculations */}
    <section className="">
      <div className="si-considerations-box">
        <h2 className="si-considerations-heading">
          <Target size={20} className="si-considerations-icon" />
          Important Considerations for Interest Calculations
        </h2>
        <p className="si-considerations-desc">
          When dealing with interest, especially for long-term
          investments or loans, consider these critical points:
        </p>
        <ul className="si-considerations-list">
          <li>
            <strong className="si-icon-title">
              <CheckCircle size={18} className="si-icon" />
              Inflation's Impact:
            </strong>
            <span className="si-icon-desc">
              The "real" return on your investment is often less than
              the nominal interest rate due to
              <strong className="bold-content">inflation</strong>.
            </span>
          </li>
          <li>
            <strong className="si-icon-title">
              <CheckCircle size={18} className="si-icon" />
              Taxation on Interest:
            </strong>
            <span className="si-icon-desc">
              Interest income from investments is typically
              <strong className="bold-content">taxable</strong> as
              "Income from Other Sources" as per your applicable
              income tax slab.
            </span>
          </li>
          <li>
            <strong className="si-icon-title">
              <CheckCircle size={18} className="si-icon" />
              Real vs. Nominal Interest Rates:
            </strong>
            <span className="si-icon-desc">
              <strong className="bold-content">Nominal rates</strong>
              are advertised, while
              <strong className="bold-content">real rates</strong>
              account for inflation, giving a truer picture.
            </span>
          </li>
          <li>
            <strong className="si-icon-title">
              <CheckCircle size={18} className="si-icon" />
              The Power of Early Investment:
            </strong>
            <span className="si-icon-desc">
              Due to
              <strong className="bold-content">compounding</strong>,
              starting investments early, even with small amounts,
              leads to significantly larger wealth.
            </span>
          </li>
          <li>
            <strong className="si-icon-title">
              <CheckCircle size={18} className="si-icon" />
              Compound Interest in Debt:
            </strong>
            <span className="si-icon-desc">
              While beneficial for investments, compound interest can
              also
              <strong className="bold-content">
                work against you in loans
              </strong>
              if not managed properly.
            </span>
          </li>
          <li>
            <strong className="si-icon-title">
              <CheckCircle size={18} className="si-icon" />
              Rule of 72:
            </strong>
            <span className="si-icon-desc">
              A quick way to estimate how long it takes for an
              investment to
              <strong className="bold-content">
                double in value
              </strong>
              (72 divided by the annual interest rate).
            </span>
          </li>
        </ul>
      </div>
    </section>

    {/* Who Can Benefit from the UniCX Simple & Compound Interest Calculator? */}
    <section className="">
      <h2 className="header-main">
        Who Can Benefit from the UniCX Simple & Compound Interest Calculator?
      </h2>
      <div className="si-section-grid">
        <div>
          <p className="p-content ">
            This versatile calculator is beneficial for a wide array
            of users:
          </p>
          <ul className="si-section-ul">
            <li className="list-content">
              <strong>Investors:</strong> To
              estimate returns on various investment products like
              FDs, RDs, bonds, or equity growth assumptions.
            </li>
            <li className="list-content">
              <strong>Borrowers:</strong> To
              understand the actual cost of personal loans, car loans,
              or home loans.
            </li>
            <li className="list-content">
              <strong>Financial Planners & Advisors:</strong>
              As a quick estimation tool during client consultations.
            </li>
            <li className="list-content">
              <strong>Students & Educators:</strong>
              To learn and teach fundamental financial concepts in a
              practical way.
            </li>
            <li className="list-content">
              <strong>Anyone Planning Savings:</strong>
              To set realistic savings goals and see the impact of
              consistent contributions and interest.
            </li>
            <li className="list-content">
              <strong>Small Business Owners:</strong>
              For calculating interest on business loans or potential
              returns on short-term investments.
            </li>
          </ul>
        </div>
        <div className="si-img-box si-img-hover">
          <img
            src={benifite}
            alt="Who can use UniCX Simple & Compound Interest Calculator - Diverse users"
            className="si-img si-img-lg"
          />
        </div>
      </div>
    </section>

    {/* Why Choose UniCX for Your Interest Calculations? */}
    <section className="">
      <h2 className="header-main">
        Why Choose UniCX for Your Interest Calculations?
      </h2>
      <ul className="si-section-ul">
        <li className="list-content">
          <strong>Dual Functionality:</strong>
          Calculate both
          <strong className="bold-content">
            Simple and Compound Interest
          </strong>
          in one convenient tool.
        </li>
        <li className="list-content">
          <strong>Accuracy & Precision:</strong>
          Our calculator uses standard financial formulas to ensure
          <strong className="bold-content">
            reliable and precise results
          </strong>
          .
        </li>
        <li className="list-content">
          <strong>User-Friendly Design:</strong>
          An
          <strong className="bold-content">
            intuitive interface
          </strong>
          makes it easy for anyone to input data and understand the
          output.
        </li>
        <li className="list-content">
          <strong>Instant Insights:</strong>
          Get
          <strong className="bold-content">
            immediate calculations
          </strong>
          , allowing for quick comparisons and informed
          decision-making.
        </li>
        <li className="list-content">
          <strong>Completely Free:</strong>
          Access this powerful financial tool at
          <strong className="bold-content">no cost</strong>, whenever
          you need it.
        </li>
        <li className="list-content">
          <strong>Educational Value:</strong>
          Helps in demystifying interest calculations and
          <strong className="bold-content">
            empowering users with financial knowledge
          </strong>
          .
        </li>
      </ul>
    </section>

    {/* Understanding the Formulas & Example Scenarios */}
    <section className="">
      <h2 className="header-main">
        Understanding the Formulas & Example Scenarios
      </h2>
      <h3 className="si-section-subheading">
        Simple Interest Formula:
      </h3>
      <p className="si-formula-desc">
        Simple Interest is calculated using the formula:
      </p>
      <div className="si-formula-box">
        <code className="si-formula">
          SI = (P × R × T) / 100
        </code>
      </div>
      <p className="si-formula-desc">
        Where: <br />
        <code className="si-formula-var">P</code> = Principal Amount <br />
        <code className="si-formula-var">R</code> = Annual Interest Rate <br />
        <code className="si-formula-var">T</code> = Time Period in Years
      </p>
     <div className="table-container">
  <div className="table-wrapper">
    <table className="pricing-table ">
      <thead className="table-head">
        <tr>
          <th className="table-heading">Example Scenario</th>
          <th className="table-heading">Details</th>
        </tr>
      </thead>
      <tbody className="table-body">
        <tr className="row-alt">
          <td className="table-cell">Principal (P)</td>
          <td className="table-cell">?10,000</td>
        </tr>
        <tr className="">
          <td className="table-cell">Annual Interest Rate (R)</td>
          <td className="table-cell">5%</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Time Period (T)</td>
          <td className="table-cell">3 Years</td>
        </tr>
        <tr className="">
          <td className="table-cell">Compounding Frequency (n)</td>
          <td className="table-cell">Annually (n = 1)</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Total Interest Earned</td>
          <td className="table-cell">?1,576.25</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


      <h3 className="si-section-subheading ">
        Compound Interest Formula:
      </h3>
      <p className="si-formula-desc">
        The formula for the total amount ($A$) after compounding is:
      </p>
      <div className="si-formula-box">
        <code className="si-formula si-formula-green">
          A = P (1 + R/n)<sup>nt</sup>
        </code>
      </div>
      <p className="si-formula-desc">
        And the Compound Interest ($CI$) is:
      </p>
      <div className="si-formula-box">
        <code className="si-formula si-formula-green">
          CI = A - P
        </code>
      </div>
      <p className="si-formula-desc">
        Where: <br />
        <code className="si-formula-var">P</code> = Principal Amount <br />
        <code className="si-formula-var">R</code> = Annual Interest Rate (as a decimal, e.g., 5% = 0.05) <br />
        <code className="si-formula-var">n</code> = Number of times interest is compounded per year <br />
        <code className="si-formula-var">t</code> = Time Period in Years <br />
        <code className="si-formula-var">A</code> = Amount after time t <br />
        <code className="si-formula-var">CI</code> = Compound Interest
      </p>
      <div className="table-container">
  <div className="table-wrapper">
    <table className="pricing-table ">
      <thead className="table-head">
        <tr>
          <th className="table-heading">Example Scenario</th>
          <th className="table-heading">Details</th>
        </tr>
      </thead>
      <tbody className="table-body">
        <tr className="row-alt">
          <td className="table-cell">Principal (P)</td>
          <td className="table-cell">?10,000</td>
        </tr>
        <tr className="">
          <td className="table-cell">Annual Interest Rate (R)</td>
          <td className="table-cell">5%</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Time Period (T)</td>
          <td className="table-cell">3 Years</td>
        </tr>
        <tr className="">
          <td className="table-cell">Compounding Frequency (n)</td>
          <td className="table-cell">Annually (n = 1)</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Total Interest Earned</td>
          <td className="table-cell">?1,576.25</td>
        </tr>
         <tr className="">
          <td className="table-cell ">Total Amount after 3 Years</td>
          <td className="table-cell">?11,576.25</td>
        </tr>
         <tr className="row-alts">
          <td className="table-cell">Compared to Simple Interest (for reference)</td>
          <td className="table-cell">?1,500</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    </section>

    {/* FAQs Section */}
    <section className="">
      <h2 className="header-main">
        Frequently Asked Questions (FAQs) about Simple & Compound Interest
      </h2>
      <div className="si-faq-list">
        {interestFaqs.map((faq, i) => (
          <div
            key={i}
            className={`si-faq-item${openFAQ === i ? " active" : ""}`}
            onClick={() => toggleFAQ(i)}
          >
            <div className={`si-faq-question${openFAQ !== i ? " si-faq-question-inactive" : ""}`}>
              <p className="">{faq.q}</p>
              <ChevronDown size={18} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
            </div>
            <p className={`si-faq-answer${openFAQ === i ? "" : " inactive"}`}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* Footer note */}
    <section className="si-footer-note-box">
      <p className="si-footer-note">
        This Simple & Compound Interest Calculator and the information
        provided are developed and maintained by
        <strong className="bold-content">
          UniCX (UniconsultX Solutions Private Limited)
        </strong>
        to help users understand interest calculations. While we
        strive for accuracy, the information is for illustrative
        purposes only and should not be considered financial advice.
        For personalized financial guidance or specific product
        details, always consult with a qualified financial
        professional or your financial institution.
      </p>
    </section>
  </div>
</section>
        </div>
      </div>
      </div>
    </>
  );
}

export default SimpleInterestCalculator;




