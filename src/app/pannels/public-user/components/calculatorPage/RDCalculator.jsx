import React, { useState, useEffect } from "react";
// Assuming you're using Lucide icons, adjust imports as needed
import {
  BarChart2,
  DollarSign,
  Clock,
  TrendingUp,
  
  CheckCircle,
  ChevronDown,
  Calculator,
  PiggyBank,
  Target,
} from "lucide-react";
import Header from "../component/Header";
import rdlogo from "../assets/images/calculators_img/BG IMAGES/rd1.png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how3.png";
import benifite from "../assets/images/calculators_img/BG IMAGES/4 png.png"
import "../calculatorCss/RDCalculator.css"; // Assuming you have a CSS file for styles
import { FaRupeeSign } from "react-icons/fa";

function RDCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState("5000");
  const [tenureMonths, setTenureMonths] = useState("70");
  const [interestRate, setInterestRate] = useState("10.6");
  const [result, setResult] = useState({
    maturity: "0.00",
    interest: "0.00",
    principal: "0.00",
  });
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let newErrors = {};
    let isValid = true;
    const P = parseFloat(monthlyAmount);
    const r = parseFloat(interestRate);
    const T = parseFloat(tenureMonths);

    if (isNaN(P) || P < 100 || P > 1000000000) {
      newErrors.monthlyAmount = "Amount must be between ?100 and ?1,00,00,000.";
      isValid = false;
    }
    if (isNaN(r) || r <= 0.0 || r > 100) {
      newErrors.interestRate = "Annual Return must be between 0.1% and 100%.";
      isValid = false;
    }
    if (isNaN(T) || T <= 0 || T > 120) {
      newErrors.tenureMonths = "Duration must be between 1 and 120 months.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateRD = () => {
    const P = parseFloat(monthlyAmount);
    const annualRate = parseFloat(interestRate);
    const N_months = parseInt(tenureMonths);

    const defaultResult = {
      maturity: "0.00",
      interest: "0.00",
      principal: "0.00",
    };

    if (!validateInputs()) {
      setResult(defaultResult);
      return;
    }

    if (
      isNaN(P) ||
      P <= 0 ||
      isNaN(annualRate) ||
      annualRate < 0 ||
      isNaN(N_months) ||
      N_months <= 0
    ) {
      setResult(defaultResult);
      return;
    }

    const r_annual_decimal = annualRate / 100;
    const r_quarterly_decimal = r_annual_decimal / 4;

    let maturityAmount = 0;

    for (let k = 1; k <= N_months; k++) {
      const monthsRemaining = N_months - k + 1;
      const compoundingPeriods = Math.floor(monthsRemaining / 3);
      maturityAmount += P * Math.pow(1 + r_quarterly_decimal, compoundingPeriods);
    }

    const totalPrincipal = P * N_months;
    const interestEarned = maturityAmount - totalPrincipal;

    setResult({
      maturity: maturityAmount.toFixed(2),
      interest: interestEarned.toFixed(2),
      principal: totalPrincipal.toFixed(2),
    });
  };

  useEffect(() => {
    calculateRD();
  }, [monthlyAmount, tenureMonths, interestRate]);

  const formatNumber = (num) => {
    if (num === null || isNaN(num) || num === "") return "0.00";
    return parseFloat(num).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const handleTenureChange = (e) => {
    const value = e.target.value;
    if (value === "" || value <= 120) {
      setTenureMonths(value);
      setErrors((prev) => ({ ...prev, tenureMonths: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        tenureMonths: "Tenure must be between 6 and 120 months",
      }));
    }
  };

  const handleRateChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value >= 0 && value <= 25)) {
      setInterestRate(value);
      setErrors((prev) => ({ ...prev, interestRate: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        interestRate: "Rate must be between 0% and 25%",
      }));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    if (value <= 1000000000) {
      setMonthlyAmount(value);
      setErrors((prev) => ({ ...prev, monthlyAmount: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        monthlyAmount: "Amount must be between ?100 and ?1,00,00,000.",
      }));
    }
  };

  const tenureYears =
    parseInt(tenureMonths) >= 12
      ? Math.floor(parseInt(tenureMonths) / 12)
      : 0;
  const remainingMonths = parseInt(tenureMonths) % 12;

  // console.log(tenureYears,tenureMonths,"tensun year ")
  // console.log(remainingMonths,tenureMonths,"tensun year ")

  const [openFAQ, setOpenFAQ] = React.useState(null);
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // RD Calculator FAQs data
  const rdFaqs = [
    {
      q: "Q1: Can I increase or decrease my monthly RD installment during the tenure?",
      a: "A1: Typically, no. Once an RD account is opened, the monthly installment amount is fixed for the entire tenure. If you wish to change the amount, you would usually need to close the existing RD and open a new one.",
    },
    {
      q: "Q2: Can I make partial withdrawals from an RD account?",
      a: "A2: No, partial withdrawals are generally not allowed from an RD account. If you need funds, you might have to prematurely close the account, which usually involves a penalty. Alternatively, some banks offer a loan against your RD.",
    },
    {
      q: "Q3: Is the interest earned on an RD taxable?",
      a: 'A3: Yes, the interest earned on a Recurring Deposit is fully taxable as "Income from Other Sources" as per your applicable income tax slab rates. If the total interest across all your RDs and FDs in a bank exceeds ?40,000 (?50,000 for senior citizens) in a financial year, the bank will deduct TDS (Tax Deducted at Source).',
    },
    {
      q: "Q4: What happens if I miss an RD installment?",
      a: "A4: If you miss an RD installment, most banks levy a small penalty. Repeated defaults might lead to the closure of the RD account. It's advisable to maintain consistency to avoid penalties and ensure your savings plan stays on track.",
    },
    {
      q: "Q5: Is a Recurring Deposit (RD) better than a Fixed Deposit (FD)?",
      a: 'A5: Both RDs and FDs are safe investment options, but they serve different purposes. An FD is ideal if you have a lump sum amount to invest for a fixed period. An RD is perfect for individuals who want to save small amounts regularly over time and build a corpus, fostering a disciplined saving habit. Neither is "better" – it depends on your savings pattern and financial needs.',
    },
  ];
  return (
    <><Header/>
    <div className="rd-section">
      <div className=" rd-container s">
     
        <div className="rd-header ">
          <h1 className="heading-title">Recurring Deposit Calculator</h1>
        
        </div>

       
        <div className="rd-grid ">
          <div className="">
            {/* Input: Monthly Deposit */}
            <div className="rd-field">
              <label htmlFor="monthlyAmount" className="rd-label">
                Monthly Deposit (?)
              </label>
              <div
                className={`rd-input-group
                                            ${
                                              errors.monthlyAmount
                                                ? "rd-input-error"
                                                : "rd-input-focus"
                                            }`}
              >
                 <FaRupeeSign className="rd-icons" />
                <input
                  type="number"
                  id="monthlyAmount"
                  value={monthlyAmount}
                  onChange={handleAmountChange}
                  className="rd-input"
                  min="0"
                  placeholder="e.g., 5000"
                  aria-label="Monthly Deposit"
                />
              </div>
              {errors.monthlyAmount && (
                <p className="error-text">{errors.monthlyAmount}</p>
              )}
            </div>

            {/* Input: Tenure (Months) */}
            <div className="rd-field">
              <label htmlFor="tenureMonths" className="rd-label">
                Tenure (Months)
              </label>
              <div
                className={` rd-input-group
                                            ${
                                              errors.tenureMonths
                                                ? "rd-input-error"
                                                : "rd-input-focus"
                                            }`}
              >
                <input
                  type="number"
                  id="tenureMonths"
                  value={tenureMonths}
                  onChange={handleTenureChange}
                  className="rd-input"
                  min="1"
                  placeholder="e.g., 60"
                  aria-label="Tenure in Months"
                />
              </div>
              {errors.tenureMonths && (
                <p className="error-text">{errors.tenureMonths}</p>
              )}
              {/* Display tenure in years and months */}
              {tenureMonths && parseInt(tenureMonths) >= 1 && (
                <p className="text-gray-500 text-sm mt-1">
                  {tenureYears > 0
                    ? `${tenureYears} Year${tenureYears > 1 ? "s" : ""}`
                    : ""}
                  {tenureYears > 0 && remainingMonths > 0 ? " and " : ""}
                  {remainingMonths > 0
                    ? `${remainingMonths} Month${
                        remainingMonths > 1 ? "s" : ""
                      }`
                    : ""}
                  {tenureYears === 0 &&
                  remainingMonths === 0 &&
                  parseInt(tenureMonths) > 0
                    ? `${tenureMonths} Month${
                        parseInt(tenureMonths) > 1 ? "s" : ""
                      }`
                    : ""}
                </p>
              )}
            </div>

            {/* Input: Annual Interest Rate (%) */}
            <div className="rd-field">
              <label htmlFor="interestRate" className="rd-label">
                Annual Interest Rate (%)
              </label>
              <div
                className={`rd-input-group 
                                            ${
                                              errors.interestRate
                                                ? "rd-input-error"
                                                : "rd-input-focus"
                                            }`}
              >
                <input
                  type="number"
                  id="interestRate"
                  value={interestRate}
                  onChange={handleRateChange}
                  className="rd-input"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 7.5"
                  aria-label="Annual Interest Rate"
                />
                               <label className="rd-label-years">
              %
                </label>
              </div>
              {errors.interestRate && (
                <p className="error-text">{errors.interestRate}</p>
              )}
            </div>
          </div>
          {/* Results Section */}
          <div className="rd-results">
            <div className="rd-results-inner">
              <div className="space-y-4">
                <div className="rd-result-row">
                  <span className="rd-result-field">Deposited Amount:</span>
                  <span className="rd-result-row-span">
                    ₹ {formatNumber(result.principal)}
                  </span>
                </div>
                <div className="rd-result-row">
                  <span className=" rd-result-field">Total Interest Earned:</span>
                  <span className="rd-result-row-span">
                    ₹ {formatNumber(result.interest)}
                  </span>
                </div>
               
              </div>
               <div className="rd-total-row ">
                  <span className=" ">Total Maturity Amount:</span>
                  <span className="">
                    ₹ {formatNumber(result.maturity)}
                  </span>
                </div>
            </div>

          
          </div>
        </div>
      

           <section className="rd-info-section" style={{ marginBottom: "20px" }}>
        <div className="rd-info-content">
          {/* What is a Recurring Deposit (RD)? Section */}
          <section className="">
            <div className="rd-section-grid">
              <div>
                <h2 className="header-main">
                  What is a Recurring Deposit (RD)?
                </h2>
                <p className="p-content ">
                  A <strong className="bold-content">Recurring Deposit (RD)</strong>
                  is a popular savings scheme offered by banks and post offices in
                  India, designed for individuals who wish to save a fixed amount
                  regularly over a specific period. With an RD, you commit to
                  depositing a fixed sum of money every month for a chosen tenure,
                  typically ranging from 6 months to 10 years. In return, your
                  deposits earn a fixed interest rate, and at the end of the tenure,
                  you receive a lump sum amount, including your total invested
                  principal and the accumulated interest. RDs are an excellent tool
                  for disciplined savings towards specific financial goals.
                </p>
              </div>
              <div className="rd-img-box rd-img-hover">
                <img
                  src={rdlogo}
                  alt="Financial planning and savings illustration"
                  className="rd-img"
                  style={{ width: "300px", }}
                />
              </div>
            </div>
          </section>
      
          {/* Key Benefits of Using the UniCX RD Calculator */}
          <section className="">
            <div>
              <h2 className="header-main">
                Key Benefits of Using the UniCX RD Calculator
              </h2>
              <p className="p-content">
                The UniCX RD Calculator empowers you to make smarter savings
                decisions:
              </p>
              <ul className="rd-icon-list">
                <li className="list-content">
                  <strong className="rd-icon-title">
                    <Calculator size={18} className="rd-icon" />
                    Predict Your Earnings:
                  </strong>
                  <span className="rd-icon-desc">
                    Get an instant and accurate estimate of the
                    <strong className="bold-content"> maturity amount</strong>
                    you will receive, including total principal and interest
                    earned.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="rd-icon-title">
                    <Target size={18} className="rd-icon" />
                    Plan Financial Goals:
                  </strong>
                  <span className="rd-icon-desc">
                    Knowing the exact maturity value helps you align your
                    savings with specific goals like a down payment or
                    vacation.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="rd-icon-title">
                    <BarChart2 size={18} className="rd-icon" />
                    Compare Schemes:
                  </strong>
                  <span className="rd-icon-desc">
                    Easily compare potential returns from
                    <strong className="bold-content"> different RD schemes</strong>
                    by simply adjusting the interest rate and tenure.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="rd-icon-title">
                    <TrendingUp size={18} className="rd-icon" />
                    Optimize Your Savings:
                  </strong>
                  <span className="rd-icon-desc">
                    Understand the impact of increasing your monthly
                    installment or extending your tenure on your final amount.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="rd-icon-title">
                    <CheckCircle size={18} className="rd-icon" />
                    Avoid Manual Errors:
                  </strong>
                  <span className="rd-icon-desc">
                    Eliminate the complexity and potential errors of manual
                    calculations, giving you confidence in your financial
                    projections.
                  </span>
                </li>
              </ul>
            </div>
          </section>
      
          {/* How to Use the UniCX RD Calculator Section */}
          <section className="">
            <h2 className="header-main">
              How to Use the UniCX RD Calculator
            </h2>
            <div className="rd-section-grid">
              <div>
                <p className="p-content ">
                  Our <strong className="bold-content">user-friendly RD Calculator</strong>
                  is designed for simplicity and accuracy. To get an instant
                  calculation of your Recurring Deposit maturity amount, simply
                  input the following details:
                </p>
                <ol className="rd-howto-ol">
                  <li className="list-content">
                    <strong>Monthly Installment (?):</strong> Enter the fixed
                    amount you plan to deposit every month.
                  </li>
                  <li className="list-content">
                    <strong>Tenure (Years/Months):</strong> Specify the duration
                    for which you intend to make deposits.
                  </li>
                  <li className="list-content">
                    <strong>Annual Interest Rate (%):</strong> Input the annual
                    interest rate offered for the RD scheme.
                  </li>
                  <li className="list-content">
                    <strong>View Your Results:</strong> The calculator will
                    instantly display your Total Amount Invested, Total Interest
                    Earned, and the final Maturity Amount.
                  </li>
                </ol>
              </div>
              <div className="rd-img-box rd-img-hover">
                <img
                  src={howuse}
                  alt="How to use UniCX RD Calculator - Step by step guide"
                  className="rd-img rd-img-lg"
                />
              </div>
            </div>
          </section>
      
          {/* Key Factors Affecting Your RD Returns */}
          <section className="">
            <h2 className="header-main">
              Key Factors Affecting Your RD Returns
            </h2>
            <p className="p-content ">
              The final maturity amount of your Recurring Deposit is primarily
              influenced by these core factors:
            </p>
            <ul className="rd-icon-list">
              <li className="list-content">
                <strong className="rd-icon-title">
                  <DollarSign size={18} className="rd-icon" />
                  Monthly Installment:
                </strong>
                <span className="rd-icon-desc">
                  This is the most direct factor. A
                  <strong className="bold-content"> higher monthly deposit</strong>
                  will naturally lead to a larger total principal invested and,
                  consequently, a higher maturity amount.
                </span>
              </li>
              <li className="list-content">
                <strong className="rd-icon-title">
                  <Clock size={18} className="rd-icon" />
                  Tenure:
                </strong>
                <span className="rd-icon-desc">
                  The duration for which you invest is crucial. A
                  <strong className="bold-content"> longer tenure</strong>
                  allows your money more time to grow, especially benefiting
                  from the power of compounding interest.
                </span>
              </li>
              <li className="list-content">
                <strong className="rd-icon-title">
                  <TrendingUp size={18} className="rd-icon" />
                  Annual Interest Rate:
                </strong>
                <span className="rd-icon-desc">
                  The
                  <strong className="bold-content"> interest rate offered by the bank</strong>
                  is a direct determinant of your earnings. Even a small
                  difference can significantly impact your total interest
                  earned.
                </span>
              </li>
              <li className="list-content">
                <strong className="rd-icon-title">
                  <BarChart2 size={18} className="rd-icon" />
                  Compounding Frequency:
                </strong>
                <span className="rd-icon-desc">
                  While rates are quoted annually, RD interest is typically
                  <strong className="bold-content"> compounded quarterly</strong>,
                  leading to slightly higher effective returns. Our calculator
                  accounts for this.
                </span>
              </li>
            </ul>
          </section>
      
          {/* Important Considerations for Recurring Deposits (RDs) */}
          <section className="">
            <div className="rd-considerations-box">
              <h2 className="rd-considerations-heading">
                <PiggyBank size={20} className="rd-considerations-icon" />
                Important Considerations for Recurring Deposits (RDs)
              </h2>
              <p className="rd-considerations-desc">
                Before opening an RD, it's beneficial to be aware of these key
                aspects:
              </p>
              <ul className="rd-considerations-list">
                <li>
                  <strong className="rd-icon-title">
                    <CheckCircle size={18} className="rd-icon" />
                    Fixed Interest Rate:
                  </strong>
                  <span className="rd-icon-desc">
                    Once an RD account is opened, the
                    <strong className="bold-content"> interest rate remains fixed</strong>
                    for the entire chosen tenure.
                  </span>
                </li>
                <li>
                  <strong className="rd-icon-title">
                    <CheckCircle size={18} className="rd-icon" />
                    Premature Withdrawal Penalties:
                  </strong>
                  <span className="rd-icon-desc">
                    Most banks allow premature closure, but it usually comes
                    with a <strong className="bold-content">penalty</strong> on
                    the interest earned.
                  </span>
                </li>
                <li>
                  <strong className="rd-icon-title">
                    <CheckCircle size={18} className="rd-icon" />
                    Loan Against RD:
                  </strong>
                  <span className="rd-icon-desc">
                    Many banks offer the facility to take a
                    <strong className="bold-content"> loan against your RD account</strong>,
                    typically up to 80-90% of the deposited amount.
                  </span>
                </li>
                <li>
                  <strong className="rd-icon-title">
                    <CheckCircle size={18} className="rd-icon" />
                    Tax Deducted at Source (TDS):
                  </strong>
                  <span className="rd-icon-desc">
                    If total interest earned from RDs (and FDs) exceeds
                    <strong className="bold-content">
                      ?40,000 (?50,000 for senior citizens)
                    </strong>
                    in a financial year, banks will deduct TDS.
                  </span>
                </li>
                <li>
                  <strong className="rd-icon-title">
                    <CheckCircle size={18} className="rd-icon" />
                    Nomination Facility:
                  </strong>
                  <span className="rd-icon-desc">
                    It is crucial to avail the
                    <strong className="bold-content"> nomination facility</strong>
                    for smooth transfer of maturity amount in unforeseen events.
                  </span>
                </li>
                <li>
                  <strong className="rd-icon-title">
                    <CheckCircle size={18} className="rd-icon" />
                    Missed Installments:
                  </strong>
                  <span className="rd-icon-desc">
                    Missing an installment might attract a
                    <strong className="bold-content"> small penalty</strong>
                    from the bank; consistency is key.
                  </span>
                </li>
              </ul>
            </div>
          </section>
      
          {/* Who Can Benefit from the UniCX RD Calculator? */}
          <section className="">
            <h2 className="header-main">
              Who Can Benefit from the UniCX RD Calculator?
            </h2>
            <div className="rd-section-grid">
              <div>
                <p className="p-content">
                  The <strong className="bold-content">UniCX RD Calculator</strong>
                  is an ideal tool for a wide range of individuals and financial
                  planning scenarios:
                </p>
                <ul className="rd-section-ul">
                  <li className="list-content">
                    <strong>Salaried Individuals:</strong>
                    Who want to save a fixed portion of their income monthly
                    towards a goal without market risks.
                  </li>
                  <li className="list-content">
                    <strong>Students:</strong> Looking
                    to save small amounts regularly for future expenses like
                    higher education or personal purchases.
                  </li>
                  <li className="list-content">
                    <strong>Small Business Owners/Freelancers:</strong>
                    Who might have fluctuating income but want to maintain a
                    disciplined savings habit.
                  </li>
                  <li className="list-content">
                    <strong>Parents:</strong> Saving
                    for their children's future milestones like education or
                    marriage.
                  </li>
                  <li className="list-content">
                    <strong>Anyone with Short-to-Medium Term Goals:</strong>
                    Saving for a new gadget, a holiday, a home appliance, or an
                    emergency fund.
                  </li>
                  <li className="list-content">
                    <strong>Budget-Conscious Savers:</strong>
                    Who prefer a fixed, predictable return on their savings.
                  </li>
                </ul>
              </div>
              <div className="rd-img-box rd-img-hover">
                <img
                  src={benifite}
                  alt="Who can use RD Calculator - Diverse individuals saving"
                  className="rd-img rd-img-lg"
                />
              </div>
            </div>
          </section>
      
          {/* Why Choose UniCX for Your RD Calculation? */}
          <section className="">
            <h2 className="header-main">
              Why Choose UniCX for Your RD Calculation?
            </h2>
            <ul className="rd-section-ul">
              <li className="list-content">
                <strong>Accuracy & Reliability:</strong>
                Our calculator provides <strong className="bold-content">precise results</strong> based
                on standard financial formulas, including quarterly compounding,
                giving you confidence in your projections.
              </li>
              <li className="list-content">
                <strong>User-Friendly Interface:</strong>
                With a <strong className="bold-content">clean and intuitive design</strong>
                , it's easy for anyone to input details and get instant results.
              </li>
              <li className="list-content">
                <strong>Instant Results:</strong> No
                waiting time. Get your maturity amount, total interest earned,
                and total invested amount in seconds.
              </li>
              <li className="list-content">
                <strong>Financial Planning Aid:</strong>
                Helps you <strong className="bold-content">visualize your savings growth</strong>
                and make informed decisions about your RD investments.
              </li>
              <li className="list-content">
                <strong>Completely Free:</strong> A
                valuable resource available to you at <strong className="bold-content">no cost</strong>, anytime,
                anywhere.
              </li>
            </ul>
          </section>
      
          {/* Simplified RD Calculation Concept & Example Scenario */}
          <section className="">
            <h2 className="header-main">
              Simplified RD Calculation Concept & Example
            </h2>
            <p className="p-content">
              While banks use complex formulas for quarterly compounding, the
              <strong className="bold-content"> core concept of an RD</strong>
              is straightforward: you invest regularly, and that money earns
              interest.
            </p>
            <h3 className="rd-section-subheading">
              Basic Concept:
            </h3>
            <p className="list-content">
              The <strong className="bold-content">maturity amount (M)</strong>
              of an RD is essentially the sum of all your
              <strong className="bold-content"> monthly installments (P)</strong>
              over the <strong className="bold-content">tenure (n)</strong>,
              plus the <strong className="bold-content">interest (I)</strong>
              earned on those installments, which compounds over time.
            </p>
            <p className="list-content mt-2">
              Formula (simplified conceptual view, as actual RD calculations are
              complex due to compounding frequency): <br />
              <code className="rd-formula">
                M = (P × number of installments) + Compound Interest
              </code>
            </p>
      <div className="container">
  <div className="table-wrapper">
    <table className="pricing-table">
      <thead className="table-head">
        <tr>
          <th className="table-heading">Example Scenario</th>
          <th className="table-heading">Details</th>
        </tr>
      </thead>
      <tbody className="table-body">
        <tr className="row-alt">
          <td className="table-cell">Monthly Installment</td>
          <td className="table-cell">5,000</td>
        </tr>
        <tr className="">
          <td className="table-cell">Tenure</td>
          <td className="table-cell">3 Years (36 months)</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Annual Interest Rate</td>
          <td className="table-cell">7.00%</td>
        </tr>
        <tr className="">
          <td className="table-cell">Total Amount Invested</td>
          <td className="table-cell">1,80,000</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Total Interest Earned</td>
          <td className="table-cell">?19,770</td>
        </tr>
        <tr className="">
          <td className="table-cell">Maturity Amount</td>
          <td className="table-cell">?1,99,770</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


            <p className="list-content ">
              This example clearly shows how your
              <strong className="bold-content"> regular savings</strong>,
              combined with a steady interest rate and the power of compounding,
              can build a
              <strong className="bold-content"> substantial sum</strong> for
              your future goals.
            </p>
          </section>
      
          {/* FAQs Section */}
          <section className="">
            <h2 className="header-main">
              Frequently Asked Questions (FAQs) about Recurring Deposits
            </h2>
            <div className="rd-faq-list">
              {rdFaqs.map((faq, i) => (
                <div
                  key={i}
                  className={`rd-faq-item${openFAQ === i ? " active" : ""}`}
                  onClick={() => toggleFAQ(i)}
                >
                  <div className={`rd-faq-question${openFAQ !== i ? " rd-faq-question-inactive" : ""}`}>
                    <p className="">{faq.q}</p>
                    <ChevronDown size={18} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
                  </div>
                  <p className={`rd-faq-answer${openFAQ === i ? "" : " inactive"}`}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
      
          {/* Footer note */}
          <section className="rd-footer-note-box">
            <p className="rd-footer-note">
              This Recurring Deposit Calculator and the information provided are
              developed and maintained by
              <strong className="bold-content">
                UniCX (UniconsultX Solutions Private Limited)
              </strong>
              to help users estimate their RD returns. While we strive for
              accuracy, the information is for illustrative purposes only and
              should not be considered financial advice. For personalized
              financial guidance or specific product details, always consult
              with a qualified financial professional or your bank.
            </p>
          </section>
        </div>
      </section>
    </div>
   
    </div>
    </>
  );
}

export default RDCalculator;





