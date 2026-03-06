import React, { useState, useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  ShieldCheck,
  Banknote,
  ListChecks,
  ScrollText,
  CheckCircle,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import Header from "../component/Header";
import ppflogo from "../assets/images/calculators_img/BG IMAGES/ppf1.png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how1.png";
import benifite from "../assets/images/calculators_img/BG IMAGES/1 png.png";
import "../calculatorCss/PPFCalculator.css";

function PPFCalculator() {
  const [perPeriodDeposit, setPerPeriodDeposit] = useState("10000");
  const [tenure, setTenure] = useState("15");
  const [interestRate, setInterestRate] = useState("7.1");
  const [investmentFrequency, setInvestmentFrequency] = useState("annual");
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [errors, setErrors] = useState({});

  // --- Validation Logic ---
  const validateInputs = () => {
    let newErrors = {};
    let isValid = true;

    const P = parseFloat(perPeriodDeposit);
    const T = parseFloat(tenure);
    const R = parseFloat(interestRate);

    // Validate Per Period Deposit
    if (isNaN(P) || P < 100 || P > 1000000000) {
      newErrors.perPeriodDeposit =
        "Deposit amount must be between ?100 and ?10,00,00,000.";
      isValid = false;
    }

    // Validate Tenure
    if (isNaN(T) || T <= 0 || T > 40) {
      // Changed max to 40 years as per your handleYearChange max
      newErrors.tenure = "Tenure must be between 1 and 40 years.";
      isValid = false;
    }

    // Validate Interest Rate
    if (isNaN(R) || R < 0.1 || R > 50) {
      // Changed min to 0.1% and max to 50%
      newErrors.interestRate = "Interest Rate must be between 0.1% and 50%.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatNumber = (num) => {
    if (num === null || isNaN(num)) return "0.00";
    return parseFloat(num).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const calculatePPF = () => {
    // Only calculate if inputs are valid
    if (!validateInputs()) {
      setMaturityAmount(0);
      setTotalInvestment(0);
      setTotalInterest(0);
      return;
    }

    const P = parseFloat(perPeriodDeposit);
    const T = parseFloat(tenure);
    const R = parseFloat(interestRate);

    const rate = R / 100;

    let effectiveAnnualInvestment = 0;
    switch (investmentFrequency) {
      case "monthly":
        effectiveAnnualInvestment = P * 12;
        break;
      case "quarterly":
        effectiveAnnualInvestment = P * 4;
        break;
      case "half-yearly":
        effectiveAnnualInvestment = P * 2;
        break;
      case "annual":
      default:
        effectiveAnnualInvestment = P;
        break;
    }

    const annuityFactor = (Math.pow(1 + rate, T) - 1) / rate;
    const calculatedMaturity =
      effectiveAnnualInvestment * annuityFactor * (1 + rate);

    const calculatedTotalInvestment = effectiveAnnualInvestment * T;
    const calculatedTotalInterest =
      calculatedMaturity - calculatedTotalInvestment;

    setMaturityAmount(parseFloat(calculatedMaturity.toFixed(2)));
    setTotalInvestment(parseFloat(calculatedTotalInvestment.toFixed(2)));
    setTotalInterest(parseFloat(calculatedTotalInterest.toFixed(2)));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      calculatePPF();
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [perPeriodDeposit, tenure, interestRate, investmentFrequency]);

  const handleAmountChange = (e) => {
    const value = e.target.value;

    if (value === "" || /^\d+$/.test(value)) {
      if (value <= 1000000000) {
        setPerPeriodDeposit(value);
        setErrors((prev) => ({ ...prev, perPeriodDeposit: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          perPeriodDeposit:
            "Deposit amount must be between ?100 and ?10,00,00,000.",
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        perPeriodDeposit:
          "Deposit amount must be between ?100 and ?10,00,00,000.",
      }));
    }
  };

  const handleRateChange = (e) => {
    const value = e.target.value;

    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === "" || (numValue >= 0.1 && numValue <= 50)) {
        setInterestRate(value);
        setErrors((prev) => ({ ...prev, interestRate: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          interestRate: "Interest Rate must be between 0.1% and 50%.",
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        interestRate: "Invalid input. Please enter a number.",
      }));
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;

    if (value === "" || /^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      if (value === "" || (numValue >= 1 && numValue <= 40)) {
        setTenure(value);
        setErrors((prev) => ({ ...prev, tenure: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          tenure: "Tenure must be between 1 and 40 years.",
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        tenure: "Invalid input. Please enter a number.",
      }));
    }
  };

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const ppfFaqs = [
    {
      q: "Q1: Is PPF truly risk-free?",
      a: "A1: Yes, PPF is considered one of the safest investment options in India as it is a government-backed scheme. The principal invested and the interest earned are guaranteed by the Government of India.",
    },
    {
      q: "Q2: Can I open multiple PPF accounts?",
      a: "A2: No, an individual can only open one PPF account in their own name. However, you can open a separate PPF account on behalf of a minor child as a guardian.",
    },
    {
      q: "Q3: What happens if I miss a payment in PPF?",
      a: "A3: If you fail to deposit the minimum annual contribution of ?500 in a financial year, your PPF account becomes inactive or 'discontinued'. To revive it, you need to pay a penalty of ?50 for each inactive year, plus the minimum contribution of ?500 for each such year in arrears.",
    },
    {
      q: "Q4: How is PPF interest calculated?",
      a: "A4: PPF interest is calculated monthly on the lowest balance in your account between the 5th day and the last day of the month. This monthly interest is then compounded annually at the end of the financial year (March 31st). To maximize your interest, it's advisable to deposit funds on or before the 5th of every month.",
    },
    {
      q: "Q5: Can I withdraw my PPF amount before 15 years?",
      a: "A5: Partial withdrawals are allowed after the completion of 7 financial years from the year of account opening. Full premature closure before 15 years is allowed only under very specific, strict conditions like life-threatening illness or higher education, and it comes with a 1% interest penalty.",
    },
    {
      q: "Q6: Is PPF better than a Fixed Deposit (FD)?",
      a: "A6: PPF offers the unique EEE (Exempt-Exempt-Exempt) tax benefit, making contributions, interest, and maturity tax-free, which FDs typically do not. While FD rates might sometimes be higher, their interest is taxable. PPF generally offers comparable or better post-tax returns, along with government backing and a long-term savings discipline. The choice depends on your tax bracket, liquidity needs, and investment horizon.",
    },
    {
      q: "Q7: What is the last date to deposit money in PPF to maximize interest for the month?",
      a: "A7: To earn interest for a particular month, the deposit must be made on or before the 5th day of that month. For example, to earn interest for July, you must deposit by July 5th. If you deposit after the 5th, that month's interest will be calculated on your previous month's balance.",
    },
    {
      q: "Q8: How do I extend my PPF account after 15 years?",
      a: "A8: At the end of the 15-year tenure, you can extend your PPF account in blocks of 5 years. You need to submit Form H (for extension with contributions) or simply do nothing (for extension without contributions) to your bank or post office within one year from the date of maturity.",
    },
  ];

  return (
    <><Header/>
    <section className="ppf-section">
      <div className="ppf-container">
       
        <div className="ppf-header">
          <h1 className="heading-title">PPF Calculator</h1>
         
        </div>
        <div className="ppf-grid">
          <div className=" ">
            <div className="">
              {/* Deposit Amount Input (per period) */}
              <div className="ppf-field">
                <label
                  htmlFor="perPeriodDeposit"
                  className="ppf-label"
                >
                  Deposit Amount (?)
                </label>
                <div
                  className={`ppf-input-group
                                            ${
                                              errors.perPeriodDeposit
                                                ? "ppf-input-error"
                                                : "ppf-input-focus"
                                            }`}
                >
                  <FaRupeeSign className="ppf-icons" />
                  <input
                    type="number"
                    id="perPeriodDeposit"
                    name="perPeriodDeposit"
                    value={perPeriodDeposit}
                    onChange={handleAmountChange}
                    min="0"
                    className="ppf-input"
                    placeholder="e.g., 10000 (for monthly)"
                    aria-label="Deposit Amount per period"
                  />
                </div>
                {/* <p className="text-xs text-gray-500 mt-1">
                      Total annual investment must be between ?500 and
                      ?1,50,000.
                    </p> */}
                {errors.perPeriodDeposit && (
                  <p className="error-text">{errors.perPeriodDeposit}</p>
                )}
              </div>

              {/* Tenure Input */}
              <div className="ppf-field">
                <label
                  htmlFor="tenure"
                  className="ppf-label"
                >
                  Investment Tenure (Years)
                </label>
                <div
                  className={`ppf-input-group
                                            ${
                                              errors.tenure
                                                ? "ppf-input-error"
                                                : "ppf-input-focus"
                                            }`}
                >
                  <input
                    type="number"
                    id="tenure"
                    name="tenure"
                    value={tenure}
                    onChange={handleYearChange}
                    min="15"
                    className="ppf-input"
                    placeholder="e.g., 15"
                    aria-label="Investment Tenure in years"
                  />
                  <label className="ppf-label-years">
                    years
                  </label>
                </div>
                {/* <p className="text-xs text-gray-500 mt-1">
                      Minimum 15 years (extendable in 5-year blocks)
                    </p> */}
                {errors.tenure && <p className="error-text">{errors.tenure}</p>}
              </div>

              {/* Interest Rate Input */}
              <div className="ppf-field">
                <label
                  htmlFor="interestRate"
                  className="ppf-label"
                >
                  Current Interest Rate (%)
                </label>
                <div
                  className={`ppf-input-group
                                            ppf-input-focus
                                        }`}
                >
                  <input
                    type="number"
                    id="interestRate"
                    name="interestRate"
                    value={7.1}
                    readOnly
                    onChange={(e) => setInterestRate(e.target.value)}
                    step="0.1"
                    min="0"
                    className="ppf-input"
                    placeholder="e.g., 7.1"
                    aria-label="Current Interest Rate"
                  />
                  <label className="size-5 text-md font-normal text-gray-500">
                    %
                  </label>
                </div>
                <p className="ppf-label-years">
                  Rates are revised quarterly by the government.
                </p>
                {/* {errors.tenure && (
                      <p className="text-red-500 text-sm mt-1">{errors.tenure}</p>
                    )} */}
              </div>

                            <div className="ppf-field-group">
                <label
                  htmlFor="investmentFrequency"
                  className="ppf-label"
                >
                  Investment Frequency
                </label>
                <div className="">
                  <select
                    id="investmentFrequency"
                    name="investmentFrequency"
                    value={investmentFrequency}
                    onChange={(e) => setInvestmentFrequency(e.target.value)}
                    className="ppf-select"
                    aria-label="Investment Frequency"
                  >
                    <option value="annual">Annual</option>
                    <option value="half-yearly">Half-Yearly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <p className="ppf-field-note">
                  Select how often you make your deposits.
                </p>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="ppf-results">
            <div className="mt-5">
              <div className="ppf-results-inner">
                <div className="ppf-result-row">
                  <span className="ppf-result-field">Total Investment:</span>
                  <span className="ppf-result-row-span">
                    ₹{formatNumber(totalInvestment)}
                  </span>
                </div>
                <div className="ppf-result-row">
                  <span className=" ppf-result-field">Total Interest Earned:</span>
                  <span className="ppf-result-row-span">
                    ₹{formatNumber(totalInterest)}
                  </span>
                </div>
              </div>
              <div className="ppf-total-row ">
                <span className=" ">PPF Maturity Amount:</span>
                <span className="">₹{formatNumber(maturityAmount)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-8 text-center">
                * This calculator provides an estimate. Actual returns may vary
                based on government policy changes, rounding rules, and specific
                bank calculations.
              </p>
            </div>
          </div>
        </div>
                <section className="ppf-info-section" style={{ marginBottom: "20px" }}>
          <div className="ppf-info-content">
            {/* What is Public Provident Fund (PPF)? */}
            <section className="">
              <h2 className="header-main">
                What is Public Provident Fund (PPF)?
              </h2>
              <div className="ppf-section-grid">
                <div>
                  <p className="p-content ">
                    The Public Provident Fund (PPF) is a highly favored,
                    government-backed, long-term savings and tax-saving scheme in
                    India. Introduced to encourage small savings and promote
                    disciplined financial planning, PPF stands out for its
                    exceptional safety, guaranteed returns, attractive interest
                    rates, and significant tax benefits.
                  </p>
                  <ul className="ppf-section-ul">
                    <li className="list-content">
                      <strong className="bold-content">Key Features:</strong> PPF is a beacon of security for
                      Indian investors. It offers complete capital protection, with
                      returns that are assured by the government. Its long-term
                      nature makes it an ideal instrument for achieving major life
                      goals like retirement planning, children's education, or
                      marriage expenses.
                    </li>
                    <li className="list-content">
                      <strong className="bold-content">Purpose:</strong> By enabling individuals to build a
                      substantial corpus over many years, PPF not only fosters a
                      habit of regular saving but also acts as a powerful tool for
                      tax planning, making it a cornerstone of many personal finance
                      portfolios.
                    </li>
                  </ul>
                  <p className="list-content ">
                    The <strong className="bold-content">UniCX PPF Calculator</strong> is your essential tool
                    to navigate this powerful investment avenue. It simplifies the
                    complexities of PPF growth, helping you visualize the potential
                    of your investments and plan your financial future with
                    confidence.
                  </p>
                </div>
                <div className="ppf-img-box ppf-img-hover">
                  <img
                    src={ppflogo}
                    alt="PPF - Retirement Savings and Security"
                    className="ppf-img"
                  />
                </div>
              </div>
            </section>
        
            {/* Why Use the UniCX PPF Calculator? */}
            <section className="">
              <h2 className="header-main">
                Why Use the UniCX PPF Calculator?
              </h2>
              <p className="p-content ">
                Understanding the future value of your PPF investments can
                be challenging given its long tenure and compounding
                interest. Our calculator streamlines this process, offering
                clear insights and powerful planning capabilities:
              </p>
              <ul className="ppf-icon-list">
                <li className="list-content">
                  <strong className="ppf-icon-title">
                    <TrendingUp size={18} className="ppf-icon" />
                    Future Value Projections:
                  </strong>
                  <span className="ppf-icon-desc">
                    Instantly see how your regular contributions can grow
                    into a significant tax-free corpus over time.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="ppf-icon-title">
                    <Banknote size={18} className="ppf-icon" />
                    Visualize Returns:
                  </strong>
                  <span className="ppf-icon-desc">
                    Get a clear picture of the total interest you can earn
                    and the final maturity amount.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="ppf-icon-title">
                    <ListChecks size={18} className="ppf-icon" />
                    Informed Financial Planning:
                  </strong>
                  <span className="ppf-icon-desc">
                    Experiment with different annual investment amounts and
                    tenures to set realistic and achievable financial goals.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="ppf-icon-title">
                    <ShieldCheck size={18} className="ppf-icon" />
                    Clarity and Confidence:
                  </strong>
                  <span className="ppf-icon-desc">
                    Gain a precise understanding of your PPF account's
                    potential, empowering you to make smarter saving
                    decisions.
                  </span>
                </li>
              </ul>
            </section>
        
            {/* How to Use the UniCX PPF Calculator */}
            <section className="">
              <h2 className="header-main">
                How to Use the UniCX PPF Calculator
              </h2>
              <div className="ppf-section-grid">
                <div>
                  <p className="p-content ">
                    Our PPF calculator is designed for simplicity and
                    efficiency, allowing you to quickly project your PPF growth:
                  </p>
                  <ol className="ppf-howto-ol">
                    <li className="list-content">
                      <strong>Enter Annual Investment:</strong> Input the amount
                      you plan to invest in your PPF account each financial year
                      (e.g., ?50,000, ?1.5 lakh). Remember the minimum is ?500
                      and the maximum is ?1.5 lakh.
                    </li>
                    <li className="list-content">
                      <strong>Select Investment Frequency:</strong> Choose
                      whether you plan to invest monthly (recommended for
                      maximizing interest) or annually (lump sum).
                    </li>
                    <li className="list-content">
                      <strong>Specify Tenure:</strong> The default tenure for a
                      PPF account is 15 years. You can also specify extended
                      periods in blocks of 5 years to see long-term growth.
                    </li>
                    <li className="list-content">
                      <strong>Calculate:</strong> Click the "Calculate PPF"
                      button to instantly view your projected results.
                    </li>
                  </ol>
                  <h3 className="ppf-section-subheading">The calculator will then provide you with:</h3>
                  <ul className="ppf-section-ul">
                    <li className="list-content">
                      <strong>Total Amount Invested:</strong> The cumulative sum
                      of all your contributions over the selected tenure.
                    </li>
                    <li className="list-content">
                      <strong>Total Interest Earned:</strong> The total tax-free
                      interest your investment is projected to accrue.
                    </li>
                    <li className="list-content">
                      <strong>Maturity Amount:</strong> The final, tax-free
                      corpus you can expect to receive at the end of the chosen
                      tenure.
                    </li>
                    <li className="list-content">
                      <strong>Year-wise Growth Table:</strong> A detailed
                      breakdown of your yearly contributions, earned interest,
                      and closing balance, providing a clear trajectory of your
                      investment growth.
                    </li>
                  </ul>
                </div>
                <div className="ppf-img-box ppf-img-hover">
                  <img
                    src={howuse}
                    alt="How to use UniCX PPF Calculator - Step by step guide"
                    className="ppf-img ppf-img-lg"
                  />
                </div>
              </div>
            </section>
        
            {/* Understanding Public Provident Fund (PPF): Key Aspects of the Scheme */}
            <section className="">
              <h2 className="header-main">
                Understanding Public Provident Fund (PPF): Key Aspects of the
                Scheme
              </h2>
              <p className="p-content ">
                To make the most of your PPF investment, it's essential to grasp
                its core features and rules:
              </p>
              <ul className="ppf-section-ul">
                <li className="list-content">
                  <strong>Eligibility:</strong> Any resident Indian individual
                  can open a PPF account. Parents or legal guardians can also
                  open a PPF account on behalf of a minor child. Notably,
                  Non-Resident Indians (NRIs) are not permitted to open new PPF
                  accounts, though existing accounts opened while they were
                  residents can continue until maturity.
                </li>
                <li className="list-content">
                  <strong>Tenure:</strong> The standard tenure for a PPF account
                  is <strong>15 years</strong>, calculated from the end of the
                  financial year in which the account was opened. After this
                  initial period, the account can be extended indefinitely in
                  blocks of 5 years.
                </li>
                <li className="list-content">
                  <strong>Investment Limits:</strong>
                  <ul className="ppf-section-ul ml-6 mt-1">
                    <li className="list-content">
                      <strong>Minimum:</strong> A mandatory minimum deposit of{" "}
                      <strong>?500</strong> per financial year is required to
                      keep the account active.
                    </li>
                    <li className="list-content">
                      <strong>Maximum:</strong> The maximum deposit allowed in a
                      financial year is <strong>?1.5 lakh</strong>. This limit
                      applies across all PPF accounts held by an individual,
                      including those opened on behalf of a minor.
                    </li>
                  </ul>
                </li>
                <li className="list-content">
                  <strong>Deposit Frequency:</strong> You have the flexibility
                  to make deposits either as a lump sum amount (single deposit)
                  or in multiple installments throughout the financial year, up
                  to a maximum of 12 installments.
                </li>
                <li className="list-content">
                  <strong>Interest Rate:</strong> The interest rate for PPF is
                  not fixed for the entire tenure; it is reviewed and{" "}
                  <strong>
                    declared quarterly by the Ministry of Finance, Government of
                    India.
                  </strong>{" "}
                  The interest is <strong>compounded annually</strong> and
                  calculated on the lowest balance between the 5th day and the
                  last day of each month. *(As of Q1 2024-25, the interest rate
                  is 7.1% p.a. – Please note this rate is subject to quarterly
                  revisions by the government.)*
                </li>
                <li className="list-content">
                  <strong>Tax Benefits (EEE Status):</strong> One of the most
                  significant advantages of PPF is its 'Exempt-Exempt-Exempt'
                  (EEE) tax status:
                  <ul className="ppf-section-ul ml-6 mt-1">
                    <li className="list-content">
                      <strong>Exempted Contribution:</strong> Your contributions
                      to PPF (up to ?1.5 lakh per financial year) are eligible
                      for deduction under <strong>Section 80C</strong> of the
                      Income Tax Act.
                    </li>
                    <li className="list-content">
                      <strong>Exempted Interest:</strong> The interest earned on
                      your PPF account is completely <strong>tax-free</strong>.
                    </li>
                    <li className="list-content">
                      <strong>Exempted Maturity Amount:</strong> The entire
                      corpus received upon maturity or premature closure is also
                      completely <strong>tax-free</strong>.
                    </li>
                  </ul>
                </li>
                <li className="list-content">
                  <strong>Withdrawal Rules:</strong> Partial withdrawals from
                  your PPF account are permitted only after the completion of{" "}
                  <strong>7 financial years</strong> from the year the account
                  was opened. The maximum withdrawal amount is limited to 50% of
                  the balance at the end of the 4th year preceding the year of
                  withdrawal, or the balance at the end of the preceding year,
                  whichever is lower.
                </li>
                <li className="list-content">
                  <strong>Loan Facility:</strong> A loan facility against your
                  PPF balance is available from the{" "}
                  <strong>3rd financial year</strong> up to the{" "}
                  <strong>6th financial year</strong> from the account opening.
                  The loan amount is limited to 25% of the balance at the end of
                  the second year preceding the year in which the loan is
                  applied for.
                </li>
              </ul>
            </section>
        
            {/* Who Can Benefit from the UniCX PPF Calculator? */}
            <section className="">
              <h2 className="header-main">
                Who Can Benefit from the UniCX PPF Calculator?
              </h2>
              <div className="ppf-section-grid">
                <div>
                  <p className="p-content ">
                    The UniCX PPF Calculator is a valuable asset for a diverse
                    range of individuals aiming for financial security and
                    growth:
                  </p>
                  <ul className="ppf-section-ul">
                    <li className="list-content">
                      <strong>Long-Term Savers:</strong> If you prioritize
                      disciplined, consistent savings over many years to build
                      substantial wealth.
                    </li>
                    <li className="list-content">
                      <strong>Tax Planners:</strong> Individuals actively
                      looking to maximize their tax deductions under Section 80C
                      while securing their future.
                    </li>
                    <li className="list-content">
                      <strong>Risk-Averse Investors:</strong> Those who prefer
                      investments with absolute capital safety and
                      government-backed guaranteed returns, avoiding market
                      volatility.
                    </li>
                    <li className="list-content">
                      <strong>Parents:</strong> Planning for significant future
                      expenses for their children, such as higher education or
                      marriage.
                    </li>
                    <li className="list-content">
                      <strong>Retirement Planners:</strong> Individuals building
                      a robust, tax-free corpus that can serve as a strong
                      financial cushion during their retirement years.
                    </li>
                    <li className="list-content">
                      <strong>
                        Anyone seeking a secure, highly liquid, and
                        tax-efficient savings instrument backed by the
                        Government of India.
                      </strong>
                    </li>
                  </ul>
                </div>
                <div className="ppf-img-box ppf-img-hover">
                  <img
                    src={benifite}
                    alt="Who can use UniCX PPF Calculator - Diverse users"
                    className="ppf-img ppf-img-lg"
                  />
                </div>
              </div>
            </section>
        
            {/* Key Considerations & Important Notes Regarding PPF */}
            <section className="">
              <div className="ppf-considerations-box">
                <h2 className="ppf-considerations-heading">
                  <ScrollText size={20} className="ppf-considerations-icon" />
                  Key Considerations & Important Notes Regarding PPF
                </h2>
                <p className="ppf-considerations-desc">
                  While PPF offers attractive benefits, it's crucial to be aware
                  of certain rules and conditions:
                </p>
                <ul className="ppf-considerations-list">
                  <li>
                    <strong className="ppf-icon-title">
                      <CheckCircle size={18} className="ppf-icon" />
                      Strict Lock-in Period:
                    </strong>
                    <span className="ppf-icon-desc">
                      The 15-year lock-in period is a significant commitment.
                      While partial withdrawals are allowed, the primary goal of
                      PPF is long-term wealth creation, so be prepared for this
                      tenure.
                    </span>
                  </li>
                  <li>
                    <strong className="ppf-icon-title">
                      <CheckCircle size={18} className="ppf-icon" />
                      Premature Closure Conditions:
                    </strong>
                    <span className="ppf-icon-desc">
                      PPF accounts can only be prematurely closed after 5
                      financial years from the end of the year of account
                      opening, and only under very specific and strict
                      conditions (e.g., life-threatening illness of account
                      holder/dependents, higher education of account
                      holder/minor, change in residency status of the account
                      holder). A penalty of 1% reduction in interest applies.
                    </span>
                  </li>
                  <li>
                    <strong className="ppf-icon-title">
                      <CheckCircle size={18} className="ppf-icon" />
                      Extension of Account at Maturity:
                    </strong>
                    <span className="ppf-icon-desc">
                      At the end of 15 years, you have important choices:
                      withdraw the entire corpus, extend with contributions
                      (active), or extend without contributions (silent).
                    </span>
                  </li>
                  <li>
                    <strong className="ppf-icon-title">
                      <CheckCircle size={18} className="ppf-icon" />
                      Impact of Missing Contributions:
                    </strong>
                    <span className="ppf-icon-desc">
                      If you fail to deposit the minimum ?500 in a financial
                      year, your account will become inactive. A penalty and
                      arrears are required to reactivate.
                    </span>
                  </li>
                  <li>
                    <strong className="ppf-icon-title">
                      <CheckCircle size={18} className="ppf-icon" />
                      Nomination Facility:
                    </strong>
                    <span className="ppf-icon-desc">
                      It is highly recommended to nominate a beneficiary (or
                      multiple beneficiaries) for your PPF account for smooth
                      transfer of funds.
                    </span>
                  </li>
                  <li>
                    <strong className="ppf-icon-title">
                      <CheckCircle size={18} className="ppf-icon" />
                      Non-Resident Indian (NRI) Status:
                    </strong>
                    <span className="ppf-icon-desc">
                      NRIs cannot open new PPF accounts. Existing resident
                      accounts can continue till original maturity on a
                      non-repatriation basis if the holder becomes an NRI. No
                      further extensions are permitted for such accounts.
                    </span>
                  </li>
                </ul>
              </div>
            </section>
        
            {/* FAQs Section */}
            <section className="">
              <h2 className="header-main">
                Frequently Asked Questions (FAQs) about PPF
              </h2>
              <div className="ppf-faq-list">
                {ppfFaqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`ppf-faq-item${openFAQ === i ? " active" : ""}`}
                    onClick={() => toggleFAQ(i)}
                  >
                    <div className={`ppf-faq-question${openFAQ !== i ? " ppf-faq-question-inactive" : ""}`}>
                      <p className="">{faq.q}</p>
                      <ChevronDown size={18} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
                    </div>
                    <p className={`ppf-faq-answer${openFAQ === i ? "" : " inactive"}`}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
        
            {/* Conclusion */}
            <section className="ppf-footer-note-box">
              <p className="ppf-footer-note">
                The UniCX PPF Calculator is an indispensable tool for anyone
                looking to leverage the power of Public Provident Fund for
                long-term financial security. Begin planning your investments
                today to build a substantial, tax-free corpus for your most
                important life goals.
                <br />
                <br />
                This PPF Calculator and the information provided are developed
                and maintained by
                <strong className="bold-content">
                  UniCX (UniconsultX Solutions Private Limited)
                </strong>
                to help users understand PPF calculations. While we strive for
                accuracy, the information is for illustrative purposes only and
                should not be considered financial advice. For personalized tax
                advice or specific product details, always consult with a
                qualified tax professional.
              </p>
            </section>
          </div>
        </section>
      </div>
     
    </section>
    </>
  );
}

export default PPFCalculator;



