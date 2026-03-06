import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  ListChecks,
  CheckCircle,
  ChevronDown,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart2,
  Lightbulb,
  UserCheck,
  Scale,
} from "lucide-react";
import Header from "../component/Header";
import mutuallogo from "../assets/images/calculators_img/BG IMAGES/mf1.png";
import howuse from "../assets/images/calculators_img/BG IMAGES/how2.png";
import benifite from "../assets/images/calculators_img/BG IMAGES/2 png .png";
import "../calculatorCss/MutualFundCalculator.css";


function MutualFundCalculator() {
  const [tab, setTab] = useState("sip"); // 'sip' or 'lumpsum'

  // SIP State
  const [sipAmount, setSipAmount] = useState("1000"); // Changed default to 1000 for realistic SIP
  const [sipYears, setSipYears] = useState("10"); // Changed default years
  const [sipReturn, setSipReturn] = useState("12"); // Changed default return
  const [sipResult, setSipResult] = useState(null); // Stores object { investedAmount, estimatedReturn, totalValue }

  // Lumpsum State
  const [lumpAmount, setLumpAmount] = useState("50000"); // Changed default to 50000 for realistic Lumpsum
  const [lumpYears, setLumpYears] = useState("10"); // Changed default years
  const [lumpReturn, setLumpReturn] = useState("12"); // Changed default return
  const [lumpResult, setLumpResult] = useState(null); // Stores object { investedAmount, estimatedReturn, totalValue }

  const [errors, setErrors] = useState({});

  // --- Validation Logic ---
  const validateInputs = (type) => {
    let isValid = true;
    let currentErrors = {};

    if (type === "sip") {
      const P = parseFloat(sipAmount);
      const n = parseFloat(sipYears);
      const r = parseFloat(sipReturn);

      if (isNaN(P) || P < 100 || P > 1000000000) {
        currentErrors.sipAmount =
          "Monthly SIP Amount must be between ?100 and ?1,00,00,000.";
        isValid = false;
      }
      if (isNaN(n) || n <= 0 || n > 50) {
        currentErrors.sipYears =
          "Investment Duration must be between 1 and 50 years.";
        isValid = false;
      }
      if (isNaN(r) || r < 0.1 || r > 30) {
        // Changed min to 0.1% for consistency, max 30%
        currentErrors.sipReturn =
          "Expected Annual Return must be between 0.1% and 30%.";
        isValid = false;
      }
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
      if (isNaN(r) || r < 0.1 || r > 30) {
        // Changed min to 0.1% for consistency, max 30%
        currentErrors.lumpReturn =
          "Expected Annual Return must be between 0.1% and 30%.";
        isValid = false;
      }
    }
    setErrors(currentErrors); // Update the errors state
    return isValid;
  };

  // --- SIP Calculation & Effect ---
  const calculateSIP = () => {
    if (!validateInputs("sip")) {
      setSipResult(null); // Clear result if inputs are invalid
      return;
    }

    const P = parseFloat(sipAmount); // Monthly investment
    const years = parseFloat(sipYears);
    const annualRate = parseFloat(sipReturn);

    // Convert annual rate to monthly decimal
    const r = annualRate / 12 / 100;
    // Convert years to total months
    const n = years * 12;

    // Total invested amount
    const investedAmount = P * n;

    // Future Value of an Annuity Due (payments at the beginning of the period)
    let futureValue;
    if (r === 0) {
      // Handle 0% interest rate separately
      futureValue = investedAmount;
    } else {
      futureValue = P * (((Math.pow(1 + r, n) - 1) * (1 + r)) / r);
    }

    const estimatedReturn = futureValue - investedAmount;

    setSipResult({
      investedAmount: Math.round(investedAmount),
      estimatedReturn: Math.round(estimatedReturn),
      totalValue: Math.round(futureValue),
    });
  };

  useEffect(() => {
    // Debounce the calculation
    const handler = setTimeout(() => {
      if (tab === "sip") {
        calculateSIP();
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [sipAmount, sipYears, sipReturn, tab]);

  // --- Lumpsum Calculation & Effect ---
  const calculateLumpsum = () => {
    if (!validateInputs("lumpsum")) {
      setLumpResult(null); // Clear result if inputs are invalid
      return;
    }

    const P = parseFloat(lumpAmount);
    const r = parseFloat(lumpReturn) / 100;
    const n = parseFloat(lumpYears);

    // Compound interest formula: A = P(1 + r)^n
    let futureValue = P * Math.pow(1 + r, n);
    const estimatedReturn = futureValue - P;

    setLumpResult({
      investedAmount: Math.round(P),
      estimatedReturn: Math.round(estimatedReturn),
      totalValue: Math.round(futureValue),
    });
  };

  useEffect(() => {
    // Debounce the calculation
    const handler = setTimeout(() => {
      if (tab === "lumpsum") {
        calculateLumpsum();
      }
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [lumpAmount, lumpYears, lumpReturn, tab]);

  // --- Formatting Helper ---
  const formatNumber = (num) => {
    if (num === null || isNaN(num)) return "0";
    return parseFloat(num).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty string to clear input, but keep within bounds for actual numbers
    if (value === "" || (/^\d+$/.test(value) && value <= 1000000000)) {
      setSipAmount(value);
      setErrors((prev) => ({ ...prev, sipAmount: "" }));
    } else if (value.length > 15) {
      setErrors((prev) => ({
        ...prev,
        sipAmount: "Monthly SIP Amount must be between ?100 and ?1,00,00,000.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        sipAmount: "Monthly SIP Amount must be between ?100 and ?1,00,00,000.",
      }));
    }
  };

  const handleRateChange = (e) => {
    const value = e.target.value;
    // Allow empty string, and numbers between 0 and 30 (inclusive of 0.1 for min validation)
    if (value === "" || (Number(value) <= 30 && Number(value) >= 0)) {
      setSipReturn(value);
      setErrors((prev) => ({ ...prev, sipReturn: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        sipReturn: "Expected Annual Return must be between 0.1% and 30%.",
      }));
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    // Allow empty string, and numbers between 0 and 50 (inclusive of 1 for min validation)
    if (value === "" || (Number(value) <= 50 && Number(value) >= 0)) {
      setSipYears(value);
      setErrors((prev) => ({ ...prev, sipYears: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        sipYears: "Investment Duration must be between 1 and 50 years.",
      }));
    }
  };

  // lumpsum handlers
  const handleLumpsumAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && value <= 1000000000)) {
      setLumpAmount(value);
      setErrors((prev) => ({ ...prev, lumpAmount: "" }));
    } else if (value.length > 15) {
      setErrors((prev) => ({
        ...prev,
        lumpAmount: "Lumpsum Amount must be between ?1,000 and ?1,00,00,000.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        lumpAmount: "Lumpsum Amount must be between ?1,000 and ?1,00,00,000.",
      }));
    }
  };

  const handleLumpsumRateChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) <= 30 && Number(value) >= 0)) {
      setLumpReturn(value);
      setErrors((prev) => ({ ...prev, lumpReturn: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        lumpReturn: "Expected Annual Return must be between 0.1% and 30%.",
      }));
    }
  };

  const handleLumpsumYearChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) <= 50 && Number(value) >= 0)) {
      setLumpYears(value);
      setErrors((prev) => ({ ...prev, lumpYears: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        lumpYears: "Investment Duration must be between 1 and 50 years.",
      }));
    }
  };
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const mfFaqs = [
    {
      q: "Q1: What is NAV (Net Asset Value) and how does it work?",
      a: "A1: NAV, or Net Asset Value, is the per-unit market value of a mutual fund scheme. It's calculated by dividing the total value of the fund's assets (minus liabilities) by the total number of outstanding units. NAV changes daily based on the market performance of the underlying securities in the fund's portfolio. When you invest, you buy units at the prevailing NAV; when you redeem, you sell units at the prevailing NAV.",
    },
    {
      q: "Q2: Is SIP better than Lumpsum investment in mutual funds?",
      a: "A2: Both SIP and Lumpsum have their advantages. SIP is generally recommended for most investors, especially those new to the market, as it promotes disciplined investing and benefits from Rupee Cost Averaging, reducing the impact of market volatility. Lumpsum can yield higher returns if invested during market dips or corrections, but carries higher risk if timed incorrectly. For consistent income earners, SIP is often preferred.",
    },
    {
      q: "Q3: What is an expense ratio in mutual funds?",
      a: "A3: The expense ratio is the annual fee charged by the Asset Management Company (AMC) for managing a mutual fund. It covers various operational expenses like fund management fees, administrative costs, marketing, etc. It's expressed as a percentage of the fund's average net assets. A lower expense ratio means a smaller portion of your returns is consumed by fees, potentially leading to higher net returns over time.",
    },
    {
      q: "Q4: Are mutual fund gains taxable in India?",
      a: "A4: Yes, gains from mutual funds are taxable in India. The taxation depends on the type of fund (equity or debt) and the duration of your investment (short-term or long-term). Equity fund gains held for less than 1 year (STCG) are taxed at 15%, while those held for more than 1 year (LTCG) are taxed at 10% on gains exceeding ?1 lakh per financial year. Debt fund gains held for less than 3 years (STCG) are added to your income and taxed as per your slab rate, while those held for more than 3 years (LTCG) are taxed at 20% with indexation benefit.",
    },
    {
      q: "Q5: Can I lose money in mutual funds?",
      a: "A5: Yes, mutual funds are market-linked investments, and there is a possibility of losing money, especially if the underlying markets perform poorly. The value of your investment can go down as well as up. It's crucial to understand the risks associated with the fund type you choose and align it with your risk appetite.",
    },
    {
      q: "Q6: What is diversification and why is it important in mutual funds?",
      a: "A6: Diversification is the strategy of spreading your investments across various asset classes, sectors, and securities to reduce risk. Mutual funds inherently offer diversification by investing in a basket of securities. This is important because it minimizes the impact of poor performance by a single security or sector on your overall portfolio, thus safeguarding your investment against concentrated risks.",
    },
    {
      q: "Q7: How do I choose the right mutual fund for my goals?",
      a: "A7: Choosing the right mutual fund involves several steps: 1) Define your financial goals and investment horizon. 2) Assess your risk appetite. 3) Research fund categories (equity, debt, hybrid) that match your risk-return profile. 4) Look at factors like expense ratio, exit load, fund manager's experience, and consistent performance (not just past returns). 5) Consider consulting a financial advisor.",
    },
    {
      q: "Q8: What is 'Rupee Cost Averaging'?",
      a: "A8: Rupee Cost Averaging (RCA) is a strategy, primarily associated with SIPs, where an investor invests a fixed amount regularly regardless of the market price. When prices are high, fewer units are bought; when prices are low, more units are bought. Over time, this averages out the cost of acquisition, potentially reducing the overall risk of investing a lump sum at a market peak and optimizing returns.",
    },
    {
      q: "Q9: What is the difference between an actively managed fund and an index fund?",
      a: "A9: An actively managed fund aims to outperform the market index by using a fund manager's expertise to select stocks. It involves higher research costs and thus has a higher expense ratio. An index fund is a passively managed fund that aims to replicate the performance of a specific market index (e.g., Nifty 50) by investing in the same stocks in the same proportion. It generally has a lower expense ratio as it requires less active management.",
    },
  ];
  return (
    <>
      <Header />
      <section className="mutual-section">
        <div className="mutual-container">
          {/* <div className="border-2"> */}
          <section className="mutual-header">
            <h1 className="heading-title">
              Mutual Fund Calculator
            </h1>
           
          </section>

          {/* Right Section: Calculator Inputs and Results */}
          <div className="mutual-grid ">
            <div className=" ">
              {/* Tab Buttons */}

              <div className="mutual-type-group">
                <button
                  className={`mutual-type-btn ${
                    tab === "sip"
                      ? "mutual-type-active"
                      : "mutual-type-inactive"
                  }`}
                  onClick={() => {
                    setTab("sip");
                    setErrors({});
                  }} // Clear errors on tab change
                >
                  SIP
                </button>
                <button
                  className={`mutual-type-btn ${
                    tab === "lumpsum"
                      ? "mutual-type-active"
                      : "mutual-type-inactive"
                  }`}
                  onClick={() => {
                    setTab("lumpsum");
                    setErrors({});
                  }} // Clear errors on tab change
                >
                  Lumpsum
                </button>
              </div>

              {tab === "sip" && (
                <div className="" style={{ marginTop: "2rem" }}>
                  <div className="mutual-field">
                    <label
                      htmlFor="sipAmount"
                      className="mutual-label"
                    >
                      Monthly SIP Amount (?)
                    </label>
                    <div
                      className={`mutual-input-group  ${
                        errors.sipAmount
                          ? "mutual-input-error"
                          : "mutual-input-focus"
                      }`}
                    >
                     <FaRupeeSign className="mutual-icons" />
                      <input
                        type="number"
                        id="sipAmount"
                        value={sipAmount}
                        onChange={handleAmountChange}
                        className="mutual-input "
                        min="100" // Set min attribute
                        max="10000000" // Set max attribute
                        placeholder="e.g., 5000"
                        aria-label="Monthly SIP Amount"
                      />
                    </div>
                    {errors.sipAmount && (
                      <p className="error-text">{errors.sipAmount}</p>
                    )}
                  </div>

                  <div className="mutual-field">
                    <label
                      htmlFor="sipYears"
                      className="mutual-label"
                    >
                      Investment Duration (Years)
                    </label>
                    <div
                      className={`mutual-input-group ${
                        errors.sipYears
                          ? "mutual-input-error"
                          : "mutual-input-focus"
                      }`}
                    >
                      <input
                        type="number"
                        id="sipYears"
                        value={sipYears}
                        onChange={handleYearChange}
                        className="mutual-input"
                        min="1"
                        max="50" // Corrected max to 50
                        placeholder="e.g., 10"
                        aria-label="SIP Investment Duration"
                      />
                    </div>
                    {errors.sipYears && (
                      <p className="error-text">{errors.sipYears}</p>
                    )}
                  </div>
                  {/* Input: SIP Expected Annual Return */}
                  <div className="mutual-field">
                    <label
                      htmlFor="sipReturn"
                      className="mutual-label"
                    >
                      Expected Annual Return (%)
                    </label>
                    <div
                      className={`mutual-input-group  ${
                        errors.sipReturn
                          ? "mutual-input-error" // Corrected border color for error
                          : "mutual-input-focus"
                      }`}
                    >
                      <input
                        type="number"
                        id="sipReturn"
                        value={sipReturn}
                        onChange={handleRateChange}
                        className="mutual-input"
                        step="0.1"
                        min="0.1"
                        max="30" // Corrected max to 30
                        placeholder="e.g., 12"
                        aria-label="SIP Expected Annual Return"
                      />
                    </div>
                    {errors.sipReturn && (
                      <p className="error-text">{errors.sipReturn}</p>
                    )}
                  </div>
                </div>
              )}

              {tab === "lumpsum" && (
                <div className=""style={{ marginTop: "2rem" }}>
                  <div className="mutual-field">
                    <label
                      htmlFor="lumpAmount"
                      className="mutual-label"
                    >
                      Lumpsum Amount (?)
                    </label>
                    <div
                      className={`mutual-input-group ${
                        errors.lumpAmount
                          ? "mutual-input-error" // Corrected border color for error
                          : "mutual-input-focus"
                      }`}
                    >
                      <label className="mutual-icon">
                        ?
                      </label>
                      <input
                        type="number"
                        id="lumpAmount"
                        value={lumpAmount}
                        onChange={handleLumpsumAmountChange}
                        className="mutual-input"
                        min="1000" // Set min attribute
                        max="10000000" // Set max attribute
                        placeholder="e.g., 100000"
                        aria-label="Lumpsum Amount"
                      />
                    </div>
                    {errors.lumpAmount && (
                      <p className="error-text">{errors.lumpAmount}</p>
                    )}
                  </div>
                  {/* Input: Lumpsum Investment Duration */}
                  <div className="mutual-field">
                    <label
                      htmlFor="lumpYears"
                      className="mutual-label"
                    >
                      Investment Duration (Years)
                    </label>
                    <div
                      className={`mutual-input-group ${
                        errors.lumpYears
                          ? "mutual-input-error" // Corrected border color for error
                          : "mutual-input-focus"
                      }`}
                    >
                      <input
                        type="number"
                        id="lumpYears"
                        value={lumpYears}
                        onChange={handleLumpsumYearChange}
                        className="mutual-input"
                        min="1"
                        max="50" // Corrected max to 50
                        placeholder="e.g., 5"
                        aria-label="Lumpsum Investment Duration"
                      />
                    </div>
                    {errors.lumpYears && (
                      <p className="error-text">{errors.lumpYears}</p>
                    )}
                  </div>
                  {/* Input: Lumpsum Expected Annual Return */}
                  <div className="mutual-field">
                    <label
                      htmlFor="lumpReturn"
                      className="mutual-label"
                    >
                      Expected Annual Return (%)
                    </label>
                    <div
                      className={`mutual-input-error  ${
                        errors.lumpReturn
                          ? "mutual-input-error" // Corrected border color for error
                          : "mutual-input-focus"
                      }`}
                    >
                      <input
                        type="number"
                        id="lumpReturn"
                        value={lumpReturn}
                        onChange={handleLumpsumRateChange}
                        className="mutual-input"
                        step="0.1"
                        min="0.1"
                        max="30" // Corrected max to 30
                        placeholder="e.g., 15"
                        aria-label="Lumpsum Expected Annual Return"
                      />
                    </div>
                    {errors.lumpReturn && (
                      <p className="error-text">{errors.lumpReturn}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="mutual-results">
              {tab === "sip" && sipResult && (
                <div className="">
                  <div className="mutual-results-inner">
                    <>
                      <div className="mutual-result-row">
                        <span className=" mutual-result-field">Invested Amount:</span>
                        <span className="mutual-result-row-span">
                          ₹ {formatNumber(sipResult.investedAmount)}
                        </span>
                      </div>
                      <div className="mutual-result-row">
                        <span className=" mutual-result-field">
                          Estimated Returns:
                        </span>
                        <span className="mutual-result-row-span">
                          ₹ {formatNumber(sipResult.estimatedReturn)}
                        </span>
                      </div>
                    </>
                  </div>
                  <div className="mutual-total-row ">
                    <span className="">Total Value:</span>
                    <span className="">
                      ₹ {formatNumber(sipResult.totalValue)}
                    </span>
                  </div>
                </div>
              )}

              {tab === "lumpsum" && lumpResult && (
                <div className="">
                  <div className="mutual-results-inner">
                    <div className="mutual-result-row">
                      <span className=" text-gray-900">Invested Amount:</span>
                      <span className="mutual-result-row-span">
                        ₹ {formatNumber(lumpResult.investedAmount)}
                      </span>
                    </div>
                    <div className="mutual-result-row">
                      <span className=" mutual-result-field">Estimated Returns:</span>
                      <span className="mutual-result-row-span">
                        ₹ {formatNumber(lumpResult.estimatedReturn)}
                      </span>
                    </div>
                  </div>

                  <div className="mutual-total-row ">
                    <span className="">Total Value:</span>
                    <span className="">
                      ₹ {formatNumber(lumpResult.totalValue)}
                    </span>
                  </div>
                </div>
              )}

              <p className="mutual-estimate-note">
                * These are estimated values based on your inputs and assumed
                rates. Actual returns may vary.
              </p>
            </div>
          </div>

                   <section className="mf-info-section">
            <div className="mf-info-content">
              {/* What are Mutual Funds? */}
              <section className="mf-section">
                <h2 className="header-main ">What are Mutual Funds?</h2>
                <div className="mf-section-grid">
                  <div>
                    <p className="p-content ">
                      Mutual Funds are sophisticated yet accessible investment
                      vehicles that play a crucial role in modern financial
                      planning. At their core, a mutual fund pools money from
                      multiple investors with a common investment objective.
                      This collective corpus is then invested by professional
                      fund managers in a diversified portfolio of various
                      securities such as stocks, bonds, money market
                      instruments, or other assets.
                    </p>
                    <ul className="mf-section-ul">
                      <li className="list-content">
                        <strong className="bold-content">Professional Management:</strong> When you
                        invest in a mutual fund, you're essentially entrusting
                        your money to experienced financial professionals who
                        continuously research, select, and monitor investments
                        on your behalf.
                      </li>
                      <li className="list-content">
                        <strong className="bold-content">Inherent Diversification:</strong> Even with a
                        small investment, mutual funds offer immediate
                        diversification across numerous assets. This helps in
                        spreading risk, as the performance of one asset might be
                        offset by another, rather than putting all your eggs in
                        one basket.
                      </li>
                    </ul>
                    <p className="list-content ">
                      The <strong className="bold-content">UniCX Mutual Fund Calculator</strong> is your
                      strategic partner in this investment journey. It's
                      designed to demystify the potential growth of your
                      investments, helping you project returns and plan
                      effectively for your financial future, whether through
                      Systematic Investment Plans (SIPs) or Lumpsum investments.
                    </p>
                  </div>
                  <div className="mf-img-box mf-img-hover">
                    <img
                      src={mutuallogo}
                      alt="Mutual Funds - Diversified Investment"
                      className="mf-img"
                    />
                  </div>
                </div>
              </section>
          
              {/* Why Invest in Mutual Funds? */}
              <section className="mf-section">
                <h2 className="header-main ">
                  Why Invest in Mutual Funds?
                </h2>
                <ul className="mf-icon-list">
                  <li className="list-content">
                    <strong className="mf-icon-title">
                      <TrendingUp size={18} className="mf-icon" />
                      Accessibility:
                    </strong>
                    <span className="mf-icon-desc">
                      Easy way to invest in diversified portfolios.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="mf-icon-title">
                      <UserCheck size={18} className="mf-icon" />
                      Professional Expertise:
                    </strong>
                    <span className="mf-icon-desc">
                      Benefit from seasoned fund managers.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="mf-icon-title">
                      <PieChart size={18} className="mf-icon" />
                      Diversification:
                    </strong>
                    <span className="mf-icon-desc">
                      Reduce risk through a spread of investments.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="mf-icon-title">
                      <ListChecks size={18} className="mf-icon" />
                      Variety & Transparency:
                    </strong>
                    <span className="mf-icon-desc">
                      Cater to different risk appetites and financial goals,
                      regulated by SEBI.
                    </span>
                  </li>
                </ul>
              </section>
          
              {/* How to Use the UniCX Mutual Fund Calculator */}
              <section className="mf-section">
                <h2 className="header-main ">
                  How to Use the UniCX Mutual Fund Calculator
                </h2>
                <div className="mf-section-grid">
                  <div>
                    <p className="p-content ">
                      Our calculator is intuitive and user-friendly, allowing
                      you to quickly estimate the potential returns on your
                      mutual fund investments:
                    </p>
                    <ol className="mf-howto-ol">
                      <li className="list-content">
                        <strong className="bold-content">Select Investment Type:</strong> Choose between
                        "Systematic Investment Plan (SIP)" for regular, periodic
                        investments or "Lumpsum Investment" for a one-time
                        investment.
                      </li>
                      <li className="list-content">
                        <strong>Enter Investment Amount:</strong>
                        <ul className="mf-section-ul ml-6 mt-1">
                          <li className="list-content">
                            For <strong>SIP</strong>: Input the fixed amount you
                            plan to invest regularly (e.g., monthly).
                          </li>
                          <li className="list-content">
                            For <strong>Lumpsum</strong>: Enter the single,
                            one-time amount you wish to invest.
                          </li>
                        </ul>
                      </li>
                      <li className="list-content">
                        <strong>Enter Expected Annual Return (%):</strong>
                        Provide the anticipated average annual return you expect
                        from your chosen mutual fund scheme.
                        <em>
                          It's crucial to remember that this is an estimate;
                          past performance does not guarantee future results,
                          and actual returns can vary based on market
                          conditions.
                        </em>
                      </li>
                      <li className="list-content">
                        <strong>Specify Investment Tenure (Years):</strong>
                        Indicate the duration, in years, for which you plan to
                        stay invested.
                      </li>
                      <li className="list-content">
                        <strong>Calculate:</strong> Click the "Calculate Mutual
                        Fund" button to instantly view your projected investment
                        growth.
                      </li>
                    </ol>
                    <h3 className="mf-section-subheading">The calculator will then provide you with:</h3>
                    <ul className="mf-section-ul">
                      <li className="list-content">
                        <strong>Total Amount Invested:</strong> The cumulative
                        sum of all your contributions (for SIP) or your initial
                        one-time investment (for Lumpsum).
                      </li>
                      <li className="list-content">
                        <strong>Total Value of Investment:</strong> The
                        projected total worth of your investment at the end of
                        the specified tenure.
                      </li>
                      <li className="list-content">
                        <strong>Estimated Capital Gains:</strong> The projected
                        profit earned from your investment (Total Value of
                        Investment minus Total Amount Invested).
                      </li>
                    </ul>
                  </div>
                  <div className="mf-img-box mf-img-hover">
                    <img
                      src={howuse}
                      alt="How to use UniCX Mutual Fund Calculator - Step by step guide"
                      className="mf-img mf-img-lg"
                    />
                  </div>
                </div>
              </section>
          
              {/* Understanding Mutual Funds: Key Aspects */}
              <section className="mf-section">
                <h2 className="header-main ">
                  Understanding Mutual Funds: Key Aspects
                </h2>
                <p className="p-content">
                  To make informed investment decisions, familiarize yourself
                  with the fundamental components of mutual funds:
                </p>
                <h3 className="mf-section-subheading flex items-center">
                  <DollarSign size={18} className="mf-icon" /> Investment Methods
                </h3>
                <ul className="mf-section-ul">
                  <li className="list-content">
                    <strong>Systematic Investment Plan (SIP):</strong> Investing
                    a fixed amount at regular intervals. Benefits from{" "}
                    <strong>Rupee Cost Averaging</strong> and helps in
                    navigating market volatility. Ideal for long-term,
                    disciplined investing.
                  </li>
                  <li className="list-content">
                    <strong>Lumpsum Investment:</strong> A single, one-time
                    large investment. Can yield higher returns if invested when
                    market conditions are favorable (e.g., during a market
                    correction).
                  </li>
                </ul>
                <h3 className="mf-section-subheading flex items-center">
                  <PieChart size={18} className="mf-icon" /> Types of Mutual Funds (Based on Asset Class)
                </h3>
                <p className="p-content mb-3">
                  Mutual funds categorize themselves based on where they
                  primarily invest, catering to different risk-return profiles:
                </p>
                <ul className="mf-section-ul">
                  <li className="list-content">
                    <strong>Equity Funds:</strong> Invest predominantly in
                    company stocks. Higher risk, higher potential returns.
                    Suitable for aggressive investors.
                  </li>
                  <li className="list-content">
                    <strong>Debt Funds:</strong> Invest in fixed-income
                    securities. Lower risk than equity, stable returns. Suitable
                    for conservative investors.
                  </li>
                  <li className="list-content">
                    <strong>Hybrid Funds:</strong> Invest in a mix of both
                    equity and debt instruments. They aim to provide a balance
                    between growth and stability.
                  </li>
                  <li className="list-content">
                    <strong>Solution-Oriented Funds:</strong> Designed for
                    specific financial goals (e.g., Retirement Funds, Children's
                    Funds).
                  </li>
                  <li className="list-content">
                    <strong>Index Funds & ETFs:</strong> Passive funds that
                    track a specific market index.
                  </li>
                  <li className="list-content">
                    <strong>Fund of Funds (FoF):</strong> These schemes invest
                    in other mutual fund schemes instead of directly in stocks
                    or bonds.
                  </li>
                </ul>
                <h3 className="mf-section-subheading flex items-center">
                  <BarChart2 size={18} className="mf-icon" /> Key Charges & Metrics
                </h3>
                <ul className="mf-section-ul">
                  <li className="list-content">
                    <strong>Expense Ratio:</strong> The annual fee charged by
                    the fund house for managing the fund. A lower expense ratio
                    generally means more of your returns stay with you.
                  </li>
                  <li className="list-content">
                    <strong>Entry Load:</strong> (Mostly abolished in India) A
                    fee charged at the time of investment.
                  </li>
                  <li className="list-content">
                    <strong>Exit Load:</strong> A fee charged if you redeem
                    units before a specified period.
                  </li>
                  <li className="list-content">
                    <strong>Net Asset Value (NAV):</strong> The per-unit market
                    value of a mutual fund scheme. It fluctuates daily.
                  </li>
                </ul>
                <h3 className="mf-section-subheading flex items-center">
                  <Scale size={18} className="mf-icon" /> Taxation of Mutual Funds in India
                </h3>
                <p className="p-content mb-3">
                  Understanding the tax implications is vital for calculating
                  your effective returns:
                </p>
                <ul className="mf-section-ul">
                  <li className="list-content">
                    <strong>
                      Equity-Oriented Mutual Funds (where equity exposure is
                      &ge; 65%):
                    </strong>
                    <ul className="mf-section-ul ml-6 mt-1">
                      <li className="list-content">
                        <strong>Short-Term Capital Gains (STCG):</strong> If
                        units are redeemed within 1 year, gains are taxed at a
                        flat rate of <strong>15%</strong>.
                      </li>
                      <li className="list-content">
                        <strong>Long-Term Capital Gains (LTCG):</strong> If
                        units are redeemed after 1 year, gains exceeding{" "}
                        <strong>?1 lakh</strong> in a financial year are taxed
                        at <strong>10%</strong> without indexation benefit.
                        Gains up to ?1 lakh are exempt.
                      </li>
                    </ul>
                  </li>
                  <li className="list-content">
                    <strong>
                      Debt-Oriented Mutual Funds (and other non-equity funds):
                    </strong>
                    <ul className="mf-section-ul ml-6 mt-1">
                      <li className="list-content">
                        <strong>Short-Term Capital Gains (STCG):</strong> If
                        units are redeemed within 3 years, gains are added to
                        your total income and taxed as per your applicable{" "}
                        <strong>income tax slab rate</strong>.
                      </li>
                      <li className="list-content">
                        <strong>Long-Term Capital Gains (LTCG):</strong> If
                        units are redeemed after 3 years, gains are taxed at{" "}
                        <strong>20%</strong> with the benefit of{" "}
                        <strong>indexation</strong>.
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
          
              {/* Who Can Benefit from the UniCX Mutual Fund Calculator? */}
              <section className="mf-section">
                <h2 className="header-main ">
                  Who Can Benefit from the UniCX Mutual Fund Calculator?
                </h2>
                <div className="mf-section-grid">
                  <div>
                    <p className="p-content ">
                      The UniCX Mutual Fund Calculator is an invaluable tool for
                      a wide spectrum of investors:
                    </p>
                    <ul className="mf-section-ul">
                      <li className="list-content">
                        <strong>First-Time Investors:</strong> To understand how
                        mutual funds can grow their money.
                      </li>
                      <li className="list-content">
                        <strong>Seasoned Investors:</strong> To model various
                        scenarios and refine their investment strategy.
                      </li>
                      <li className="list-content">
                        <strong>Financial Planners:</strong> As a quick tool for
                        client discussions and projections.
                      </li>
                      <li className="list-content">
                        <strong>Goal-Oriented Savers:</strong> Planning for
                        retirement, children's education, down payment for a
                        house, or other significant financial milestones.
                      </li>
                      <li className="list-content">
                        <strong>
                          Anyone seeking to understand the potential returns of
                          their mutual fund investments over different periods.
                        </strong>
                      </li>
                    </ul>
                  </div>
                  <div className="mf-img-box mf-img-hover">
                    <img
                      src={benifite}
                      alt="Who can use UniCX Mutual Fund Calculator - Diverse investors"
                      className="mf-img mf-img-lg"
                    />
                  </div>
                </div>
              </section>
          
              {/* Key Considerations & Important Notes Regarding Mutual Funds */}
              <section className="mf-section">
                <div className="mf-considerations-box">
                  <h2 className="mf-considerations-heading">
                    <Lightbulb size={20} className="mf-considerations-icon" />
                    Key Considerations & Important Notes Regarding Mutual Funds
                  </h2>
                  <p className="mf-considerations-desc">
                    <strong>
                      <em>
                        RISK WARNING: MUTUAL FUND INVESTMENTS ARE SUBJECT TO
                        MARKET RISKS, READ ALL SCHEME RELATED DOCUMENTS
                        CAREFULLY.
                      </em>
                    </strong>
                  </p>
                  <ul className="mf-considerations-list">
                    <li>
                      <strong className="mf-icon-title">
                        <CheckCircle size={18} className="mf-icon" />
                        Market Risks:
                      </strong>
                      <span className="mf-icon-desc">
                        Returns from mutual funds are not guaranteed and are
                        directly linked to market performance. There is always a
                        possibility of losing capital.
                      </span>
                    </li>
                    <li>
                      <strong className="mf-icon-title">
                        <CheckCircle size={18} className="mf-icon" />
                        Past Performance is Not Future Guarantee:
                      </strong>
                      <span className="mf-icon-desc">
                        Always remember that a fund's historical performance is
                        not an indicator or guarantee of its future results.
                      </span>
                    </li>
                    <li>
                      <strong className="mf-icon-title">
                        <CheckCircle size={18} className="mf-icon" />
                        Investment Horizon & Risk Appetite:
                      </strong>
                      <span className="mf-icon-desc">
                        Align your investment with your financial goals
                        (long-term for equity) and understand your personal risk
                        tolerance before choosing a fund type.
                      </span>
                    </li>
                    <li>
                      <strong className="mf-icon-title">
                        <CheckCircle size={18} className="mf-icon" />
                        Due Diligence:
                      </strong>
                      <span className="mf-icon-desc">
                        Thoroughly research the fund's objectives, fund
                        manager's experience, expense ratio, exit load, and read
                        the Scheme Information Document (SID) carefully before
                        investing.
                      </span>
                    </li>
                    <li>
                      <strong className="mf-icon-title">
                        <CheckCircle size={18} className="mf-icon" />
                        Regular Review:
                      </strong>
                      <span className="mf-icon-desc">
                        Periodically review your portfolio to ensure it aligns
                        with your goals and rebalance if necessary.
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
          
              {/* FAQs Section */}
              <section className="mf-section">
                <h2 className="header-main ">
                  Frequently Asked Questions (FAQs) about Mutual Funds
                </h2>
                <div className="mf-faq-list gst-faq-list">
                  {mfFaqs.map((faq, i) => (
                    <div
                      key={i}
                      className={`mf-faq-item gst-faq-item${openFAQ === i ? " active" : ""}`}
                    >
                      <button
                        className={`mf-faq-question gst-faq-question${openFAQ !== i ? " mf-faq-question-inactive gst-faq-question-inactive" : ""}`}
                        onClick={() => toggleFAQ(i)}
                        aria-expanded={openFAQ === i ? "true" : "false"}
                        aria-controls={`faq-answer-${i}`}
                      >
                        <p className="mf-faq-q gst-faq-q">{faq.q}</p>
                        <ChevronDown size={18} className={`mf-faq-chevron gst-faq-chevron calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
                      </button>
                      <p
                        id={`faq-answer-${i}`}
                        className={`mf-faq-answer gst-faq-answer${openFAQ === i ? "" : " inactive"}`}
                      >
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
          
              {/* Conclusion */}
              <section className="mf-footer-note-box">
                <p className="mf-footer-note">
                  The UniCX Mutual Fund Calculator is an invaluable tool for
                  anyone looking to understand, plan, and grow their wealth
                  through mutual fund investments. It empowers you to visualize
                  the potential returns of your SIPs and lumpsum investments,
                  making your financial planning more precise and effective.
                  <br />
                  <br />
                  This Mutual Fund Calculator and the information provided are
                  developed and maintained by
                  <strong className="bold-content">
                    UniCX (UniconsultX Solutions Private Limited)
                  </strong>
                  to help users understand Mutual Fund calculations. While we
                  strive for accuracy, the information is for illustrative
                  purposes only and should not be considered financial advice.
                  For personalized financial advice or specific product details,
                  always consult with a qualified financial advisor.
                </p>
              </section>
            </div>
          </section>
        </div>
       
      </section>
    </>
  );
}

export default MutualFundCalculator;


