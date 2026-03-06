import React, { useEffect, useState } from "react";
// import { FaRupeeSign } from "react-icons/fa";
import {
  ChevronDown,
  TrendingUp,
  HandCoins,
  DollarSign,
  Target,
  Clock,
  ShieldCheck,
  HelpCircle,
} from "lucide-react"; 
import Header from "../component/Header";
import siplogo from "../assets/images/calculators_img/BG IMAGES/sip1.png";
import howuse from "../assets/images/calculators_img/BG IMAGES/how4.png";

import "../calculatorCss/SIPCalculator.css";
import { FaRupeeSign } from "react-icons/fa";

function SIPCalculator() {
  const [tab, setTab] = useState("sip");
  const [sipAmount, setSipAmount] = useState("5000");
  const [sipYears, setSipYears] = useState("26");
  const [sipReturn, setSipReturn] = useState("12");
  const [sipResult, setSipResult] = useState(null);

  const [lumpAmount, setLumpAmount] = useState("5000");
  const [lumpYears, setLumpYears] = useState("26");
  const [lumpReturn, setLumpReturn] = useState("12");
  const [lumpResult, setLumpResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    if (tab === "sip") {
      const handler = setTimeout(() => {
        calculateSIP();
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [sipAmount, sipYears, sipReturn, tab]);

  useEffect(() => {
    if (tab === "lumpsum") {
      const handler = setTimeout(() => {
        calculateLumpsum();
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [lumpAmount, lumpYears, lumpReturn, tab]);

  const validateInputs = (type) => {
    let isValid = true;
    let currentErrors = {};
    if (type === "sip") {
      const P = parseFloat(sipAmount);
      const n = parseFloat(sipYears);
      const r = parseFloat(sipReturn);

      if (isNaN(P) || P < 100 || P > 10000000) {
        currentErrors.sipAmount =
          " SIP Amount must be between ?100 and ?10,00,000.";
        isValid = false;
      }
      if (isNaN(n) || n <= 0 || n > 50) {
        currentErrors.sipYears =
          "Investment Duration must be between 1 and 50 years.";
        isValid = false;
      }
      if (isNaN(r) || r <= 0 || r > 30) {
        currentErrors.sipReturn =
          "Expected Annual Return must be between 0.1% and 30%.";
        isValid = false;
      }
      if (!isValid) setSipResult(null);
    } else if (type === "lumpsum") {
      const P = parseFloat(lumpAmount);
      const n = parseFloat(lumpYears);
      const r = parseFloat(lumpReturn);

      if (isNaN(P) || P < 1000 || P > 1000000000) {
        currentErrors.lumpAmount =
          "Lumpsum Amount must be between ?1,000 and ?1,00,00,000.";
        isValid = false;
      }
      if (isNaN(n) || n <= 0 || n > 50) {
        currentErrors.lumpYears =
          "Investment Duration must be between 1 and 50 years.";
        isValid = false;
      }
      if (isNaN(r) || r <= 0 || r > 30) {
        currentErrors.lumpReturn =
          "Expected Annual Return must be between 0.1% and 30%.";
        isValid = false;
      }
      if (!isValid) setLumpResult(null);
    }
    setErrorMessage(currentErrors);
    return isValid;
  };

  const calculateSIP = () => {
    if (!validateInputs("sip")) return;
    const P = parseFloat(sipAmount);
    const n = parseFloat(sipYears) * 12;
    const r = parseFloat(sipReturn) / 12 / 100;
    const futureValue = P * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r);
    setSipResult(futureValue.toFixed(2));
  };

  const calculateLumpsum = () => {
    if (!validateInputs("lumpsum")) return;
    const P = parseFloat(lumpAmount);
    const r = parseFloat(lumpReturn) / 100;
    const n = parseFloat(lumpYears);
    const futureValue = P * Math.pow(1 + r, n);
    setLumpResult(futureValue.toFixed(2));
  };

  const formatNumber = (num) => {
    if (num === null || isNaN(num) || num < 0) return "0";
    return parseFloat(num).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  const handleSipAmountChange = (e) => {
    const value = e.target.value;
    if (value <= 1000000000 ) {
      setSipAmount(value);
      setErrorMessage((prev) => ({ ...prev, sipAmount: "" }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        sipAmount: "Sip Amount must be between ?1,000 and ?1,00,00,000.",
      }));
    }
  };

  const handleInvestmentDurationChange = (e) => {
    const value = e.target.value;
    if (value <= 50) {
      setSipYears(value);
      setErrorMessage((prev) => ({ ...prev, sipYears: "" }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        sipYears: "Investment Duration must be between 1 and 50 years.",
      }));
    }
  };

  const handleAnnualReturnChange = (e) => {
    const value = e.target.value;
    if (value <= 30) {
      setSipReturn(value);
      setErrorMessage((prev) => ({ ...prev, sipReturn: "" }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        sipReturn: "Expected Annual Return must be between 0.1% and 30%.",
      }));
    }
  };

  // for lumpsum calculator

  const handleLumpsumAmountChange = (e) => {
    const value = e.target.value;
    if (value <= 1000000000) {
      setLumpAmount(value);
      setErrorMessage((prev) => ({ ...prev, lumpAmount: "" }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        lumpAmount: "Lumpsum Amount must be between ?1,000 and ?1,00,00,000.",
      }));
    }
  };

  const handleLumpsumInvestmentDurationChange = (e) => {
    const value = e.target.value;
    if (value <= 50) {
      setLumpYears(value);
      setErrorMessage((prev) => ({ ...prev, lumpYears: "" }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        lumpYears: "Investment Duration must be between 1 and 50 years.",
      }));
    }
  };

  const handleLumpsumAnnualReturnChange = (e) => {
    const value = e.target.value;
    if (value <= 30) {
      setLumpReturn(value);
      setErrorMessage((prev) => ({ ...prev, lumpReturn: "" }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        lumpReturn: "Expected Annual Return must be between 0.1% and 30%.",
      }));
    }
  };

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      q: "What is the minimum amount I can invest in a SIP?",
      a: "Most mutual funds allow you to start a SIP with as little as ?500 per month. Some funds may have slightly higher minimums.",
    },
    {
      q: "Is SIP a guaranteed return investment?",
      a: "No, SIPs are not guaranteed returns. They are market-linked investments, and returns depend on the performance of the underlying mutual fund scheme. However, rupee cost averaging helps mitigate volatility over the long term.",
    },
    {
      q: "Can I stop or pause my SIP anytime?",
      a: "Yes, most mutual funds allow you to stop or pause your SIP at any time without penalty, though you may need to submit a request with a few days' notice.",
    },
    {
      q: "What is Rupee Cost Averaging?",
      a: "Rupee cost averaging is a strategy where you invest a fixed amount regularly, regardless of market fluctuations. This means you buy more units when prices are low and fewer when prices are high, averaging out your purchase cost over time.",
    },
    {
      q: "How is SIP different from a lump sum investment?",
      a: "A lump sum is a one-time, large investment, while a SIP involves regular, smaller investments over time. SIPs are ideal for managing market volatility, while lump sums may perform better in a consistently rising market if timed correctly.",
    },
  ];
  return (
    <><Header/>
    <section className="sip-section">
      <div className="sip-container ">
       
        <section className="sip-header">
          <h1 className="sip-title">
            SIP Calculator
          </h1>
         
        </section>

        <div className="sip-grid">
          {/* Tab Buttons */}
          <div className=" ">
            <div className="sip-type-group ">
              <button
                className={`sip-type-btn ${
                  tab === "sip"
                    ? "sip-type-active"
                    : "sip-type-inactive"
                }`}
                // Clear error object when switching tabs
                onClick={() => {
                  setTab("sip");
                  setErrorMessage({});
                  setLumpResult(null);
                }}
              >
                SIP
              </button>
              <button
                className={`sip-type-btn ${
                  tab === "lumpsum"
                    ? "sip-type-active"
                    : "sip-type-inactive"
                }`}
                // Clear error object when switching tabs
                onClick={() => {
                  setTab("lumpsum");
                  setErrorMessage({});
                  setSipResult(null);
                }}
              >
                Lumpsum
              </button>
            </div>

            {tab === "sip" && (
              <div className=""style={{ marginTop: "1rem" }}>
               
                  <div className="sip-field">
                  <label
                    htmlFor="lumpAmount"
                    className="sip-label"
                  >
                     Monthly SIP Amount (?)
                  </label>
                  <div
                    className={`sip-input-group ${
                      errorMessage.sipAmount // Check if there's an error for lumpAmount
                        ? "sip-input-error"
                        : "sip-input-focus"
                    }`}
                  >
                    <FaRupeeSign className="sip-icon" />
                    <input
                      type="number"
                      id="lumpAmount"
                     value={sipAmount}
                      onChange={handleSipAmountChange}
                      className="sip-input"
                      min="1000"
                      max="10000000"
                      placeholder="e.g., 100000"
                      aria-label="Lumpsum Amount"
                    />
                  </div>
                  {/* Display error message specific to lumpAmount */}
                  {errorMessage.sipAmount && (
                    <p className="error-text">
                      {errorMessage.sipAmount}
                    </p>
                  )}
                </div>
                {/* Input: SIP Investment Duration */}
                <div className="sip-field">
                  <label
                    htmlFor="sipYears"
                    className="sip-label"
                  >
                    Investment Duration (Years)
                  </label>
                  <div
                    className={`sip-input-group ${
                      errorMessage.sipYears // Check if there's an error for sipYears
                        ? "sip-input-error"
                        : "sip-input-focus"
                    }`}
                  >
                    <input
                      type="number"
                      id="sipYears"
                      value={sipYears}
                      onChange={handleInvestmentDurationChange}
                      className="sip-input"
                      min="1"
                      max="50"
                      placeholder="e.g., 10"
                      aria-label="SIP Investment Duration"
                    />
                  </div>
                  {/* Display error message specific to sipYears */}
                  {errorMessage.sipYears && (
                    <p className="error-text">
                      {errorMessage.sipYears}
                    </p>
                  )}
                </div>
                {/* Input: SIP Expected Annual Return */}
                <div className="sip-field">
                  <label
                    htmlFor="sipReturn"
                    className="sip-label"
                  >
                    Expected Annual Return (%)
                  </label>
                  <div
                    className={`sip-input-group ${
                      errorMessage.sipReturn // Check if there's an error for sipReturn
                        ? "sip-input-error"
                        : "sip-input-focus"
                    }`}
                  >
                    <input
                      type="number"
                      id="sipReturn"
                      value={sipReturn}
                      onChange={(e) => handleAnnualReturnChange(e)}
                      className="sip-input"
                      step="0.1"
                      min="0.1"
                      max="30"
                      placeholder="e.g., 12"
                      aria-label="SIP Expected Annual Return"
                    />
                  </div>
                  {/* Display error message specific to sipReturn */}
                  {errorMessage.sipReturn && (
                    <p className="error-text">
                      {errorMessage.sipReturn}
                    </p>
                  )}
                </div>
              </div>
            )}

            {tab === "lumpsum" && (
              <div className=""style={{ marginTop: "1rem" }}>
                {/* Input: Lumpsum Amount */}
                <div className="sip-field">
                  <label
                    htmlFor="lumpAmount"
                    className="sip-label"
                  >
                    Lumpsum Amount (?)
                  </label>
                  <div
                    className={`sip-input-group  ${
                      errorMessage.lumpAmount // Check if there's an error for lumpAmount
                        ? "sip-input-error"
                        : "sip-input-focus"
                    }`}
                  >
                    <FaRupeeSign className="sip-icon" />
                    <input
                      type="number"
                      id="lumpAmount"
                      value={lumpAmount}
                      onChange={handleLumpsumAmountChange}
                      className="sip-input"
                      min="1000"
                      max="10000000"
                      placeholder="e.g., 100000"
                      aria-label="Lumpsum Amount"
                    />
                  </div>
                  {/* Display error message specific to lumpAmount */}
                  {errorMessage.lumpAmount && (
                    <p className="error-text">
                      {errorMessage.lumpAmount}
                    </p>
                  )}
                </div>
                {/* Input: Lumpsum Investment Duration */}
                <div className="sip-field">
                  <label
                    htmlFor="lumpYears"
                    className="sip-label"
                  >
                    Investment Duration (Years)
                  </label>
                  <div
                    className={`sip-input-group ${
                      errorMessage.lumpYears // Check if there's an error for lumpYears
                        ? "sip-input-error"
                        : "sip-input-focus"
                    }`}
                  >
                    <input
                      type="number"
                      id="lumpYears"
                      value={lumpYears}
                      onChange={(e) => handleLumpsumInvestmentDurationChange(e)}
                      className="sip-input"
                      min="1"
                      max="50"
                      placeholder="e.g., 5"
                      aria-label="Lumpsum Investment Duration"
                    />
                  </div>
                
                  {errorMessage.lumpYears && (
                    <p className="error-text">
                      {errorMessage.lumpYears}
                    </p>
                  )}
                </div>
              
                <div className="sip-field">
                  <label
                    htmlFor="lumpReturn"
                    className="sip-label"
                  >
                    Expected Annual Return (%)
                  </label>
                  <div
                    className={`sip-input-group ${
                      errorMessage.lumpReturn // Check if there's an error for lumpReturn
                        ? "sip-input-error"
                        : "sip-input-focus"
                    }`}
                  >
                    <input
                      type="number"
                      id="lumpReturn"
                      value={lumpReturn}
                      onChange={(e) => handleLumpsumAnnualReturnChange(e)}
                      className="sip-input"
                      step="0.1"
                      min="0.1"
                      max="30"
                      placeholder="e.g., 15"
                      aria-label="Lumpsum Expected Annual Return"
                    />
                  </div>
                  {/* Display error message specific to lumpReturn */}
                  {errorMessage.lumpReturn && (
                    <p className="error-text">
                      {errorMessage.lumpReturn}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

        
          <div className="sip-results">
           
             
                  {tab === "sip" && (
                    <>
                     <div className="sip-results-inner">
                {/* <div className=" space-y-6"> */}
                     
                         <div className="sip-result-row">
        <span className="sip-result-field">Total Investment</span>
        <span className="sip-result-row-span">  ₹{formatNumber(
                            parseFloat(sipAmount) * parseFloat(sipYears) * 12
                          )}</span>
      </div>
                    
                         <div className="sip-result-row">
        <span className="sip-result-field"> Interest Earned</span>
        <span className="sip-result-row-span"> ₹
                          {formatNumber(
                            Math.max(
                              0,
                              sipResult -
                                parseFloat(sipAmount) *
                                  parseFloat(sipYears) *
                                  12
                            )
                          )}</span>
      </div>
                       </div>
                        <div className="sip-total-row">
                        <span className="">
                          Total Value:
                        </span>
                        <span className="">
                          ₹ {formatNumber(sipResult)}
                        </span>
                      </div>
      {/* </div> */}
                    </>
                  )}
     
      
                  {tab === "lumpsum" && (
                    <>
                    <div className="sip-results-inner">
        {/* <div className="space-y-6"> */}
                      <div className="sip-result-row">
                        <span className="sip-result-field">
                          Total Investment:
                        </span>
                        <span className="sip-result-row-span">
                          ₹ {formatNumber(parseFloat(lumpAmount))}
                        </span>
                      </div>
                      <div className="sip-result-row">
                        <span className="sip-result-field">
                          Interest Earned:
                        </span>
                        <span className="sip-result-row-span">
                          ₹
                          {formatNumber(
                            Math.max(0, lumpResult - parseFloat(lumpAmount))
                          )}
                        </span>
                      </div>
                     
                      </div> 
                      <div className="sip-total-row">
                        <span className="">
                          Total Value:
                        </span>
                        <span className="">
                          ₹ {formatNumber(lumpResult)}
                        </span>
                      </div>
          {/* </div> */}
                    </>
                  )}
                </div>
                
              
            
        </div>
<div className="sip-info-section ">
  <div className="sip-info-content">
    {/* What is a Systematic Investment Plan (SIP)? */}
    <section className="">
      <h2 className="header-main ">
        What is a Systematic Investment Plan (SIP)?
      </h2>
      <div className="sip-section-grid">
        <div>
          <p className="p-content ">
            A <strong className="bold-content">Systematic Investment Plan (SIP)</strong> is an
            investment method offered by mutual funds, allowing investors to
            make regular, fixed payments (e.g., monthly, quarterly) into a
            chosen mutual fund scheme. It's akin to a recurring deposit, but
            for mutual funds, and it enables investors to participate in the
            stock market without requiring a large lump sum.
          </p>
          <p className="p-content">
            SIPs are designed to instill financial discipline and mitigate
            market volatility through a strategy called{" "}
            <strong className="bold-content">Rupee Cost Averaging</strong>. They have become immensely
            popular as they make investing in dynamic markets accessible to
            everyone, irrespective of their income level, by allowing them to
            start with small, manageable amounts.
          </p>
          <p className="p-content">
            This method fosters a habit of regular saving and investing,
            proving to be a powerful tool for long-term wealth creation,
            especially when leveraging the benefit of compounding.
          </p>
        </div>
        <div className="sip-img-box sip-img-hover">
          <img
            src={siplogo}
            alt="SIP - Systematic Investment Plan"
            className="sip-img"
          />
        </div>
      </div>
    </section>

    {/* How Does a SIP Work? */}
    <section className="">
      <h2 className="header-main ">
        How Does a SIP Work? (The Power of Rupee Cost Averaging)
      </h2>
      <p className="p-content ">
        Instead of investing a large sum at once (lump sum), a SIP allows
        you to invest smaller, regular amounts. Here’s how it typically
        works and why it's effective:
      </p>
      <ol className="sip-howto-ol">
        <li className="list-content">
          <strong>Fixed Investment:</strong> You decide on a fixed amount
          (e.g., ?1,000, ?5,000, ?10,000) you want to invest at a regular
          interval (e.g., monthly, quarterly).
        </li>
        <li className="list-content">
          <strong>Regular Purchases:</strong> On a pre-determined date,
          your chosen amount is automatically debited from your bank
          account and invested into your selected mutual fund scheme.
        </li>
        <li className="list-content">
          <strong>Varying Units:</strong> Because market prices (Net Asset
          Value - NAV) fluctuate, your fixed investment buys a different
          number of units each time:
          <ul className="sip-howto-ul">
            <li>When NAV is high, you buy fewer units.</li>
            <li>When NAV is low, you buy more units.</li>
          </ul>
        </li>
        <li className="list-content">
          <strong>Rupee Cost Averaging:</strong> Over time, this averages
          out your purchase cost per unit. You end up buying more units
          when prices are low and fewer when prices are high, which can
          result in a lower average cost per unit compared to a lump sum
          investment, especially in volatile markets.
        </li>
      </ol>
    </section>

    {/* Key Benefits of Investing through SIP */}
    <section className="">
      <h2 className="header-main ">
        Key Benefits of Investing through SIP
      </h2>
      <p className="p-content ">
        SIPs offer several compelling advantages, making them a robust
        choice for your wealth creation journey:
      </p>
      <div className="sip-benefit-list">
        <div className="sip-benefit-card">
          <h3 className="sip-benefit-title">
            <HandCoins size={20} className="sip-benefit-icon" /> Financial Discipline:
          </h3>
          <p className="list-content">
            Instills a habit of regular saving and investing.
          </p>
        </div>
        <div className="sip-benefit-card">
          <h3 className="sip-benefit-title">
            <DollarSign size={20} className="sip-benefit-icon" /> Rupee Cost Averaging:
          </h3>
          <p className="list-content">
            Reduces the risk of market timing by averaging out the
            purchase cost of units over time.
          </p>
        </div>
        <div className="sip-benefit-card">
          <h3 className="sip-benefit-title">
            <TrendingUp size={20} className="sip-benefit-icon" /> Power of Compounding:
          </h3>
          <p className="list-content">
            Allows your returns to generate further returns, leading to
            significant wealth creation over the long term. Even small,
            regular investments can grow into substantial sums.
          </p>
        </div>
        <div className="sip-benefit-card">
          <h3 className="sip-benefit-title">
            <Clock size={20} className="sip-benefit-icon" /> Flexibility:
          </h3>
          <p className="list-content">
            You can choose your investment amount, frequency, and stop or
            pause your SIPs as needed (subject to scheme rules).
          </p>
        </div>
        <div className="sip-benefit-card">
          <h3 className="sip-benefit-title">
            <HandCoins size={20} className="sip-benefit-icon" /> Affordability:
          </h3>
          <p className="list-content">
            Start investing with amounts as low as ?500 per month, making
            it accessible to a wider range of investors.
          </p>
        </div>
        <div className="sip-benefit-card">
          <h3 className="sip-benefit-title">
            <Target size={20} className="sip-benefit-icon" /> Goal-Oriented Investing:
          </h3>
          <p className="list-content">
            Easily link your SIPs to specific financial goals like buying
            a house, children's education, or retirement planning.
          </p>
        </div>
      </div>
    </section>

    {/* How to Use the UniCX Free Online SIP Calculator */}
    <section className="">
      <h2 className="header-main ">
        How to Use the UniCX Free Online SIP Calculator
      </h2>
      <div className="sip-section-grid">
        <div>
          <p className="p-content ">
            Our UniCX SIP Calculator makes estimating your potential returns
            simple and quick. Follow these steps to see your wealth growth
            potential:
          </p>
          <ol className="sip-howto-ol">
            <li className="list-content">
              <strong>Monthly Investment (?):</strong> Enter the fixed amount
              you plan to invest regularly (e.g., monthly).
            </li>
            <li className="list-content">
              <strong>Investment Period (Years):</strong> Specify the total
              number of years you intend to continue your SIP.
            </li>
            <li className="list-content">
              <strong>Expected Annual Return (%):</strong> Input your assumed
              annual rate of return from your mutual fund investments. This is
              an assumed figure, as actual returns depend on market
              performance.
            </li>
            <li className="list-content">
              <strong>Click "Calculate":</strong> The calculator will
              instantly display your "Invested Amount" and "Estimated
              Returns."
            </li>
          </ol>
        </div>
        <div className="sip-img-box sip-img-hover">
          <img
            src={howuse}
            alt="How to use SIP Calculator"
            className="sip-img sip-img-lg"
          />
        </div>
      </div>
    </section>

    {/* Understanding Your SIP Calculator Results */}
    <section className="">
      <h2 className="header-main ">
        Understanding Your SIP Calculator Results
      </h2>
      <p className="p-content ">
        Once you input your details, our calculator provides a clear
        breakdown of your potential SIP growth:
      </p>
      <ul className="sip-section-ul ">
        <li className="list-content">
          <strong>Total Invested Amount:</strong> This is the cumulative
          sum of all your monthly investments over the specified
          investment period.
        </li>
        <li className="list-content">
          <strong>Estimated Returns:</strong> This is the projected profit
          you might earn on your total invested amount, based on the
          expected annual return you entered.
        </li>
        <li className="list-content">
          <strong>Total Value (Corpus):</strong> This is the sum of your
          "Total Invested Amount" and "Estimated Returns," representing
          the estimated total value of your investment at the end of the
          period.
        </li>
      </ul>
     <div className="container">
  <div className="table-wrapper">
    <table className="pricing-table">
      <thead className="table-head">
        <tr>
          <th className="table-heading">Example Calculation</th>
          <th className="table-heading">Details</th>
        </tr>
      </thead>
      <tbody className="table-body">
        <tr className="row-alt">
          <td className="table-cell ">Monthly Investment</td>
          <td className="table-cell ">?5,000</td>
        </tr>
        <tr className="">
          <td className="table-cell">Investment Period</td>
          <td className="table-cell value">10 Years</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Expected Annual Return</td>
          <td className="table-cell ">12%</td>
        </tr>
        <tr className="">
          <td className="table-cell">Estimated Invested Amount</td>
          <td className="table-cell ">?6,00,000</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Estimated Returns</td>
          <td className="table-cell ">?5,62,491</td>
        </tr>
        <tr className="">
          <td className="table-cell ">Estimated Total Value (Corpus)</td>
          <td className="table-cell  ">?11,62,491</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


    </section>

    {/* Important SIP Considerations & Tips */}
    <section className="">
      <h2 className="header-main ">
        Important SIP Considerations & Tips
      </h2>
      <p className="p-content ">
        While SIPs are an excellent investment tool, keep these points in
        mind for optimal results:
      </p>
      <ul className="sip-section-ul">
        <li className="list-content">
          <strong>Realistic Expectations:</strong>
          Expected returns are assumptions. Actual returns are subject to
          market risks and fund performance.
        </li>
        <li className="list-content">
          <strong>Long-Term Horizon:</strong> SIPs
          deliver the best results when allowed to compound over a long
          period (5+ years).
        </li>
        <li className="list-content">
          <strong>Fund Selection:</strong> Choose
          mutual funds carefully based on your financial goals, risk
          appetite, and past performance (though past performance is not
          indicative of future results).
        </li>
        <li className="list-content">
          <strong>Regular Review:</strong>
          Periodically review your SIPs and portfolio to ensure they align
          with your goals and make adjustments if necessary.
        </li>
        <li className="list-content">
          <strong>Inflation:</strong> Factor in
          inflation when setting financial goals, as it erodes the
          purchasing power of money over time.
        </li>
        <li className="list-content">
          <strong>Taxation:</strong> Returns from
          mutual funds are subject to taxation (Capital Gains Tax).
          Consult a tax advisor for specific guidance.
        </li>
        <li className="list-content">
          <strong>Emergency Fund:</strong> Ensure you
          have an adequate emergency fund before starting SIPs.
        </li>
      </ul>
    </section>

    {/* Advantages of Using the UniCX SIP Calculator */}
    <section className="">
      <h2 className="header-main ">
        Advantages of Using the UniCX SIP Calculator
      </h2>
      <p className="p-content ">
        Leveraging our <strong className="bold-content">free online SIP calculator</strong> offers
        significant benefits for accurate investment planning:
      </p>
      <div className="sip-advantage-list">
        <div className="sip-advantage-card">
          <h3 className="sip-advantage-title">
            <Clock size={20} className="sip-advantage-icon" /> Quick Estimates:
          </h3>
          <p className="list-content">
            Instantly see potential returns for various investment
            scenarios.
          </p>
        </div>
        <div className="sip-advantage-card">
          <h3 className="sip-advantage-title">
            <Target size={20} className="sip-advantage-icon" /> Simplify Complex Calculations:
          </h3>
          <p className="list-content">
            Our tool handles the compounding effect, making projections
            easy to understand.
          </p>
        </div>
        <div className="sip-advantage-card">
          <h3 className="sip-advantage-title">
            <HandCoins size={20} className="sip-advantage-icon" /> Goal-Based Planning:
          </h3>
          <p className="list-content">
            Helps you set realistic SIP amounts and durations to achieve
            your financial goals.
          </p>
        </div>
        <div className="sip-advantage-card">
          <h3 className="sip-advantage-title">
            <HelpCircle size={20} className="sip-advantage-icon" /> User-Friendly Interface:
          </h3>
          <p className="list-content">
            Designed for ease of use, even for individuals new to
            investing.
          </p>
        </div>
        <div className="sip-advantage-card">
          <h3 className="sip-advantage-title">
            <ShieldCheck size={20} className="sip-advantage-icon" /> Empowerment:
          </h3>
          <p className="list-content">
            Provides clear data to make informed investment decisions.
          </p>
        </div>
      </div>
    </section>

    {/* FAQs */}
    <section className="">
      <h2 className="header-main ">
        Frequently Asked Questions (FAQs) about SIP
      </h2>
      <div className="sip-faq-list">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`sip-faq-item${openFAQ === i ? " active" : ""}`}
            onClick={() => toggleFAQ(i)}
          >
            <div className={`sip-faq-question${openFAQ !== i ? " sip-faq-question-inactive" : ""}`}>
              <p className="">{faq.q}</p>
              <ChevronDown size={18} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
            </div>
            <p className={`sip-faq-answer${openFAQ === i ? "" : " inactive"}`}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* UniCX Expert Support & Resources */}
    <section id="contact" className="">
      <h2 className="header-main ">
        Beyond Calculations: UniCX - Your Partner in Financial Growth
      </h2>
      <p className="p-content ">
        At <strong className="bold-content">UniconsultX Solutions Private Limited (UniCX)</strong>,
        our commitment extends beyond providing a powerful SIP calculator.
        We understand that effective wealth creation requires
        comprehensive support and strategic planning. That's why we offer{" "}
        <strong>expert financial services</strong> to help you achieve
        your investment goals.
      </p>
      <h3 className="sip-support-title">
        Our Expert Financial Services Include:
      </h3>
      <ul className="sip-section-ul">
        <li className="list-content">
          <strong>Investment Advisory:</strong> Personalized guidance on
          mutual funds, stocks, and other investment avenues.
        </li>
        <li className="list-content">
          <strong>Financial Planning:</strong> Holistic plans to manage
          your income, expenses, savings, and investments for long-term
          goals.
        </li>
        <li className="list-content">
          <strong>Retirement Planning:</strong> Strategies to build a
          robust corpus for a secure post-retirement life.
        </li>
        <li className="list-content">
          <strong>Tax Planning & Optimization:</strong> Advice on
          minimizing tax liabilities through smart investments.
        </li>
        <li className="list-content">
          <strong>Portfolio Management:</strong> Regular review and
          rebalancing of your investments.
        </li>
      </ul>
      <p className="sip-support-note">
        <strong>Start Your Investment Journey with UniCX:</strong> We are
        dedicated to being your reliable source for all things financial
        planning and investment. Explore our website for more in-depth
        articles, common FAQs, and the latest market updates. Partner with
        UniCX for peace of mind in your wealth creation journey.
      </p>
      <div className="sip-support-btn-box">
        <button className="sip-support-btn">
          Get Expert Investment Consultation
        </button>
      </div>
    </section>

    {/* Footer note */}
    <footer className="sip-footer-note-box">
      <p className="sip-footer-note">
        This SIP calculator and information is developed and maintained by{" "}
        <strong>UniCX (UniconsultX Solutions Private Limited)</strong> to
        help users estimate potential returns from Systematic Investment
        Plans as per general market principles. For personalized
        investment advice, specific fund recommendations, or complex
        financial planning, always consult with a qualified financial
        advisor or{" "}
        <a href="#contact" className="bold-content sip-footer-link">
          contact UniCX directly
        </a>
        . Investment in mutual funds is subject to market risks. Please
        read the offer document carefully before investing.
      </p>
    </footer>
  </div>
</div>
      </div>
    </section>
    </>
    
  );
}

export default SIPCalculator;




