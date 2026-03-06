import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  Calculator,
  Home,
  DollarSign,
  TrendingUp,
  Handshake,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  CheckCircle,
  Users,
  CreditCard,
  Cake,
  Scale,
  Square,
  Hammer,
  Paintbrush,
  Maximize,
  RefreshCcw,
  FileText,
  Banknote,
  Percent,
} from "lucide-react";
import homelogo from "../assets/images/calculators_img/BG IMAGES/hemi1.png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how5.png"
import benifite from "../assets/images/calculators_img/BG IMAGES/5 png .png"
import "../calculatorCss/HomeLoanCalculator.css";
import Header from "../component/Header";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";
function HomeEMICalculator() {
  const [loanAmount, setLoanAmount] = useState("10000");
  const [interestRate, setInterestRate] = useState("6");
  const [loanPeriod, setLoanPeriod] = useState("3");
  const [frequency, setFrequency] = useState("monthly");
  const [monthlyResult, setMonthlyResult] = useState({
    emi: 0,
    total: 0,
    interest: 0,
  });
  const [yearlyResult, setYearlyResult] = useState({
    emi: 0,
    total: 0,
    interest: 0,
  });
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let newErrors = {};
    let isValid = true;
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate);
    const n = parseFloat(loanPeriod);

    if (isNaN(P) || P < 100 || P > 100000000) {
      newErrors.loanAmount = "Amount must be between ?100 and ?10,00,00,000.";
      isValid = false;
    }
    if (isNaN(r) || r <= 0 || r > 12) {
      newErrors.interestRate = "Annual Return must be between 0.1% and 12%.";
      isValid = false;
    }
    if (isNaN(n) || n <= 0 || n > 30) {
      newErrors.loanPeriod = "Duration must be between 1 and 30 years.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  /**
   * @param {number} P
   * @param {number} R
   * @param {number} N
   * @returns {{emi: number, total: number, interest: number}}
   */
  const calculateEmi = (P, R, N) => {
    if (R === 0) {
      const emi = P / N;
      const total = P;
      const interest = 0;
      return {
        emi: Math.round(emi),
        total: Math.round(total),
        interest: Math.round(interest),
      };
    }
    const onePlusR_pow_n = Math.pow(1 + R, N);

    const emi = (P * R * onePlusR_pow_n) / (onePlusR_pow_n - 1);

    const total = emi * N;

    const interest = total - P;

    return {
      emi: Math.round(emi),
      total: Math.round(total),
      interest: Math.round(interest),
    };
  };

  useEffect(() => {
    if (validateInputs()) {
      const P = parseFloat(loanAmount);
      const years = parseFloat(loanPeriod);
      const annualRate = parseFloat(interestRate);

      if (frequency === "monthly" || frequency === "both") {
        const R_monthly = annualRate / 12 / 100;
        const months = years * 12;
        const result = calculateEmi(P, R_monthly, months);
        setMonthlyResult(result);
      } else {
        setMonthlyResult({ emi: 0, total: 0, interest: 0 });
      }

      if (frequency === "yearly" || frequency === "both") {
        const R_yearly = annualRate / 100;
        const result = calculateEmi(P, R_yearly, years);
        setYearlyResult(result);
      } else {
        setYearlyResult({ emi: 0, total: 0, interest: 0 });
      }
    } else {
      // Clear results if inputs are invalid
      setMonthlyResult({ emi: 0, total: 0, interest: 0 });
      setYearlyResult({ emi: 0, total: 0, interest: 0 });
    }
  }, [loanAmount, interestRate, loanPeriod, frequency]);

  // Loan Amount Validation
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value <= 100000000) {
      setLoanAmount(value);
      setErrors((prev) => ({ ...prev, loanAmount: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        loanAmount: "Amount cannot exceed ?100,000,000 .",
      }));
    }
  };

  // Interest Rate Validation
  const handleRateChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) <= 12 && Number(value) >= 0)) {
      setInterestRate(value);
      setErrors((prev) => ({ ...prev, interestRate: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        interestRate: "Annual Return must be between 0.1% and 12%.",
      }));
    }
  };

  // Loan Tenure (Years) Validation
  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) <= 30 && Number(value) >= 0)) {
      setLoanPeriod(value);
      setErrors((prev) => ({ ...prev, loanPeriod: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        loanPeriod: "Loan tenure cannot exceed 30 years",
      }));
    }
  };
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const homeLoanFaqs = [
    {
      q: "Q1: What is a home loan EMI?",
      a: "A1: Home Loan EMI stands for Equated Monthly Installment. It's the fixed amount you pay to your lender each month to repay your home loan. It comprises both the principal loan amount and the interest accrued on the outstanding balance.",
    },
    {
      q: "Q2: How is home loan eligibility determined?",
      a: "A2: Home loan eligibility is primarily determined by your repayment capacity, which lenders assess based on your income, age, credit score, existing financial obligations (debt-to-income ratio), and the Loan to Value (LTV) ratio of the property.",
    },
    {
      q: "Q3: What is the ideal home loan tenure?",
      a: 'A3: There\'s no single "ideal" tenure. A longer tenure means lower EMI but higher total interest paid. A shorter tenure means higher EMI but significant savings on total interest. The ideal tenure balances your monthly affordability with minimizing total interest costs.',
    },
    {
      q: "Q4: Should I choose a fixed or floating interest rate?",
      a: 'A4:\n<span className="font-bold">Fixed Rate:</span> Offers stability and predictability of EMIs, good if you expect interest rates to rise.\n<span className="font-bold">Floating Rate:</span> EMIs fluctuate with market rates. Can be beneficial if rates fall, but risky if they rise. Most home loans in India are floating rate.\nYour choice depends on your risk appetite and market outlook.',
    },
    {
      q: "Q5: Can I get tax benefits on a home loan in India?",
      a: 'A5: Yes, significant tax benefits are available:\n* <span className="font-bold">Section 80C:</span> Deduction for principal repayment (up to ?1.5 Lakh/year).\n* <span className="font-bold">Section 24(b):</span> Deduction for interest paid (up to ?2 Lakh/year for self-occupied property, full interest for rented property with certain limits).\n* Additional benefits under <span className="font-bold">80EE/80EEA</span> for first-time homebuyers.',
    },
    {
      q: "Q6: What is the Loan to Value (LTV) ratio in a home loan?",
      a: "A6: The LTV ratio is the proportion of the property's value that the bank is willing to finance. For example, an 80% LTV on a ?50 Lakh property means the bank will lend ?40 Lakh, and you need to pay the remaining ?10 Lakh as a down payment.",
    },
    {
      q: "Q7: What happens if I prepay my home loan?",
      a: "A7: Prepaying your home loan (making payments over and above your EMI) reduces your outstanding principal. This can significantly reduce the total interest you pay over the loan's lifetime and/or shorten your loan tenure. Most floating-rate home loans for individuals in India do not have prepayment penalties.",
    },
    {
      q: "Q8: What documents are required for a home loan?",
      a: "A8: Typically, lenders require: Identity Proof (PAN, Aadhaar, Passport), Address Proof, Income Proof (Salary slips, Bank statements, ITRs for last 2-3 years), Employment Proof, and Property Documents (Sale agreement, chain documents, NOCs, etc.).",
    },
  ];
  return (
    <>
    <Header/>
    <section className="home-section">
      <div className="home-container">
        {/* <div className="border-2"> */}
        <section className="home-header">
          <h1 className="heading-title">
            Home Loan Calculator
          </h1>
         
        </section>
         <div className="home-grid ">
                  <div className="">
                
                        {/* Loan Amount */}
                        <div className="home-field">
                          <label
                            htmlFor="loanAmount"
                            className="home-label"
                          >
                            Loan Amount (?)
                          </label>
                          <div
                            className={`home-input-group
                                ${
                                  errors.loanAmount
                                    ? "home-input-error"
                                    : "home-input-focus"
                                }`}
                          >
                            <FaRupeeSign className="home-icons" />
                            <input
                              id="loanAmount"
                              type="number"
                              value={loanAmount}
                              onChange={handleAmountChange}
                              className="home-input"
                              placeholder="e.g. 500000"
                              min="0"
                            />
                          </div>
                          {errors.loanAmount && (
                            <p className="error-text">
                              {errors.loanAmount}
                            </p>
                          )}
                        </div>
                        <div className="home-field">
                          <label
                            htmlFor="interestRate"
                            className="home-label"
                          >
                            Annual Interest Rate (%)
                          </label>
                          <div
                            className={`home-input-group
                                ${
                                  errors.interestRate
                                    ? "home-input-error"
                                    : "home-input-focus"
                                }`}
                          >
                            <input
                              id="interestRate"
                              type="number"
                              value={interestRate}
                              onChange={handleRateChange}
                              className="home-input"
                              placeholder="e.g. 8.5"
                              min="0"
                              step="0.01"
                            />
                            <label className="home-label-years">
                              %
                            </label>
                          </div>
                          {errors.interestRate && (
                            <p className="error-text">
                              {errors.interestRate}
                            </p>
                          )}
                        </div>
        
                        {/* Loan Tenure */}
                        <div className="home-field">
                          <label
                            htmlFor="loanPeriod"
                            className="home-label"
                          >
                            Loan Tenure (Years)
                          </label>
                          <div
                            className={`home-input-group
                                ${
                                  errors.loanPeriod
                                    ? "home-input-error"
                                    : "home-input-focus"
                                }`}
                          >
                            <input
                              id="loanPeriod"
                              type="number"
                              value={loanPeriod}
                              onChange={handleYearChange}
                              className="home-input"
                              placeholder="e.g. 5"
                              min="0"
                            />
                            <label className="home-label-years">
                              years
                            </label>
                          </div>
                          {errors.loanPeriod && (
                            <p className="error-text">
                              {errors.loanPeriod}
                            </p>
                          )}
                        </div>
        
                        {/* Payment Frequency */}
                        <div className="home-field">
                          <label
                            htmlFor="frequency"
                            className="home-label"
                          >
                            Payment Frequency
                          </label>
                                           <div className="home-select-group">
                            <select
                              id="frequency"
                              value={frequency}
                              onChange={(e) => setFrequency(e.target.value)}
                              className="home-select"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                              <option value="both">Both</option>
                            </select>
                          </div>
                        </div>
                     
                  
                  </div>
                  {/* Results Display */}
                  <div className="home-results">
                    
                      
                      {/* Monthly EMI Results */}
                      {(frequency === "monthly" || frequency === "both") && (
                        <div className={`${frequency==="both"?"home-both":""}`}>
                        <div className="home-results-inner">
                                          {/* <h3 className="home-results-title">
                            Monthly EMI
                          </h3> */}
                          <div className="home-result-row">
                            <span className="home-result-field">EMI:</span>
                            <span className="home-result-row-span">
                              ₹{monthlyResult.emi.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="home-result-row">
                            <span className="home-result-field">
                              Total Interest:
                            </span>
                            <span className="home-result-row-span">
                              ₹{monthlyResult.interest.toLocaleString("en-IN")}
                            </span>
                          </div>
                         
                        </div>
                         <div className="home-total-row ">
                            <span className="">
                              Total Payment:
                            </span>
                            <span className="">
                              ₹{monthlyResult.total.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      )}
        
                      {/* Yearly EMI Results */}
                      {(frequency === "yearly" || frequency === "both") && (
                        <div className={`${frequency==="both"?"home-both":""}`}>
                          {/* <h3 className="home-results-title">
                            Yearly EMI
                          </h3> */}
                          <div className="space-y-6">
                          <div className="home-result-row">
                            <span className="home-result-field ">EMI:</span>
                            <span className="home-result-row-span">
                              ₹{yearlyResult.emi.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="home-result-row">
                            <span className="home-result-field ">
                              Total Interest:
                            </span>
                            <span className="home-result-row-span">
                              ₹{yearlyResult.interest.toLocaleString("en-IN")}
                            </span>
                          </div>
                         
                        </div>
                        <div className="home-total-row ">
                            <span className="">
                              Total Payment:
                            </span>
                            <span className="">
                              ₹{yearlyResult.total.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                        
                      )}
                    </div>
                 
                </div>
<div className="home-info-section">
  <div className="home-info-container">
    {/* What is a Home Loan? */}
    <section className="home-info-block">
      <div className="home-info-grid">
        <div>
          <h2 className="home-info-headings">What is a Home Loan?</h2>
          <p className="home-info-paragraph">
            A <strong className="home-info-highlight">Home Loan</strong> is a secured financial facility offered by banks and Housing Finance Companies (HFCs) to help individuals purchase, construct, extend, or renovate a residential property. It's considered a "secured" loan because the property itself serves as collateral. Home loans are typically repaid through Equated Monthly Installments (EMIs) over a long tenure, making homeownership accessible to many.
          </p>
          <p className="home-info-paragraph">
            Given the substantial amount involved and the long repayment period, a home loan is one of the most significant financial commitments an individual undertakes.
          </p>
        </div>
        <div className="home-info-img-wrap">
          <img
            src={homelogo}
            alt="Financial planning and savings illustration"
            className="home-info-img"
          />
        </div>
      </div>
    </section>

    {/* Why is a Home Loan Calculator Important? */}
    <section className="home-info-block">
      <h2 className="home-info-headings">Why is a Home Loan Calculator Important?</h2>
      <p className="home-info-paragraph">
        A Home Loan Calculator is an indispensable tool for anyone planning to take on a mortgage. Here's why it's crucial:
      </p>
      <ul className="home-info-list">
        <li className="home-info-list-item">
          <span className="home-info-list-title">
            <Calculator size={18} className="home-info-icon-blue" />
            Accurate EMI Estimation:
          </span>
          <span className="home-info-list-desc">
            Instantly determine your exact monthly EMI outflow, allowing you to effectively budget and manage your household expenses.
          </span>
        </li>
        <li className="home-info-list-item">
          <span className="home-info-list-title">
            <DollarSign size={18} className="home-info-icon-blue" />
            Total Cost Visibility:
          </span>
          <span className="home-info-list-desc">
            Gain a clear understanding of the total interest you'll pay over the entire loan tenure, revealing the true cost of borrowing.
          </span>
        </li>
        <li className="home-info-list-item">
          <span className="home-info-list-title">
            <Handshake size={18} className="home-info-icon-blue" />
            Loan Option Comparison:
          </span>
          <span className="home-info-list-desc">
            Easily compare different home loan offers from various lenders.
          </span>
        </li>
        <li className="home-info-list-item">
          <span className="home-info-list-title">
            <TrendingUp size={18} className="home-info-icon-blue" />
            Optimal Tenure Planning:
          </span>
          <span className="home-info-list-desc">
            Experiment with different loan durations to find the right balance for your financial comfort.
          </span>
        </li>
      </ul>
      <p className="home-info-highlight">
        The <span className="home-info-highlight-text">UniCX Home Loan Calculator</span> empowers you with immediate insights, transforming complex loan calculations into simple, actionable information for your homeownership journey.
      </p>
    </section>

    {/* How to Use the UniCX Home Loan Calculator */}
    <section className="home-info-block">
      <h2 className="home-info-headings">How to Use the UniCX Home Loan Calculator</h2>
      <div className="home-info-grid">
        <div>
          <p className="home-info-paragraph">
            Our Home Loan calculator is designed for simplicity, accuracy, and providing you with comprehensive results:
          </p>
          <ol className="home-info-ol">
            <li className="home-info-list-item">
              <span className="home-info-list-title">Enter Principal Loan Amount:</span> Input the total amount you wish to borrow for your home (e.g., ?30,00,000 or ?75,00,000).
            </li>
            
            <li className="home-info-list-item">
              <span className="home-info-list-title">Enter Annual Interest Rate (%):</span> Provide the annual interest rate offered by the lender (e.g., 8.5%, 9.0%).
            </li>
            <li className="home-info-list-item">
              <span className="home-info-list-title">Specify Loan Tenure (Years):</span> Choose the duration over which you plan to repay the loan (e.g., 15 years, 20 years, 30 years).
            </li>
            <li className="home-info-list-item">
              <span className="home-info-list-title">Calculate:</span> Click the "Calculate Home Loan" button.
            </li>
          </ol>
          <h3 className="home-info-subheading">
            The UniCX Home Loan Calculator will instantly provide you with:
          </h3>
          <ul className="home-info-ul">
            <li>
              <span className="home-info-list-title">Monthly EMI Amount:</span> The exact amount you will need to pay each month.
            </li>
            <li>
              <span className="home-info-list-title">Total Interest Payable:</span> The absolute amount of interest you will pay over the entire loan tenure.
            </li>
            <li>
              <span className="home-info-list-title">Total Amount Payable:</span> The sum of your principal loan amount and the total interest payable (your total repayment).
            </li>
            <li>
              <span className="home-info-list-title">Amortization Schedule:</span> A detailed year-wise breakdown showing how much of each EMI payment goes towards principal repayment and how much towards interest.
            </li>
          </ul>
        </div>
        <div className="home-info-img-wrap">
          <img
            src={howuse}
            alt="Image showing the UniCX Home Loan calculator interface with input fields and calculated outputs"
            className="home-info-img"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    {/* Continue with the same class naming pattern for all other sections... */}


        {/* Understanding Home Loans: Key Aspects of Your Mortgage Section */}
              <section className="home-loan-section">
          <h2 className="home-loan-headings">
            Understanding Home Loans: Key Aspects of Your Mortgage
          </h2>
          <p className="home-loan-paragraph">
            Navigating a home loan requires understanding its various components and implications:
          </p>
        
          <h3 className="home-loan-subheading">
            Components of a Home Loan & Factors Affecting Eligibility
          </h3>
          <ul className="home-loan-list home-loan-list-disc">
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Principal:</span> The actual amount of money you borrow.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Interest:</span> The cost of borrowing, paid on the outstanding principal balance.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">EMI (Equated Monthly Installment):</span> A fixed monthly payment combining both principal and interest.
            </li>
          </ul>
        
          <div className="home-loan-factors-box">
            <h4 className="home-loan-factors-heading">
              Key Factors Affecting Your Home Loan Eligibility & EMI:
            </h4>
            <ul className="home-loan-list home-loan-list-none">
              <li className="home-loan-list-item">
                <span className="home-loan-list-title home-loan-list-flex">
                  <Users size={18} className="home-loan-list-icon home-loan-list-indigo" />
                  Income & Employment Stability:
                </span>
                <span className="home-loan-list-desc">
                  Your monthly income, employer reputation, and work experience are primary determinants. Lenders assess your repayment capacity.
                </span>
              </li>
              <li className="home-loan-list-item">
                <span className="home-loan-list-title home-loan-list-flex">
                  <CreditCard size={18} className="home-loan-list-icon home-loan-list-indigo" />
                  Credit Score (CIBIL Score):
                </span>
                <span className="home-loan-list-desc">
                  A strong credit score (typically 750+) is crucial. It reflects your creditworthiness and can significantly impact the interest rate you are offered.
                </span>
              </li>
              <li className="home-loan-list-item">
                <span className="home-loan-list-title home-loan-list-flex">
                  <Cake size={18} className="home-loan-list-icon home-loan-list-indigo" />
                  Age:
                </span>
                <span className="home-loan-list-desc">
                  Your age at loan application and at loan maturity impacts the maximum permissible tenure.
                </span>
              </li>
              <li className="home-loan-list-item">
                <span className="home-loan-list-title home-loan-list-flex">
                  <Scale size={18} className="home-loan-list-icon home-loan-list-indigo" />
                  Existing Debts (DTI Ratio):
                </span>
                <span className="home-loan-list-desc">
                  Your current loan obligations are considered. A high Debt-to-Income (DTI) ratio can reduce your eligibility.
                </span>
              </li>
              <li className="home-loan-list-item">
                <span className="home-loan-list-title home-loan-list-flex">
                  <Home size={18} className="home-loan-list-icon home-loan-list-indigo" />
                  Property Value & Type:
                </span>
                <span className="home-loan-list-desc">
                  The market value and type of property influence the Loan to Value (LTV) ratio.
                </span>
              </li>
            </ul>
          </div>
          <div className="home-loan-img-box">
            {/* <img
              src={homeLoanUnderstandingImage}
              alt="Diagram illustrating factors affecting home loan eligibility and different loan types"
              className="home-loan-img"
              loading="lazy"
            /> */}
          </div>
        
          <h3 className="home-loan-subheadings">
            Types of Home Loans
          </h3>
          <p className="home-loan-paragraph ">
            Lenders offer various home loan products tailored to specific needs:
          </p>
          <ul className="home-loan-list home-loan-list-none">
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <Home size={18} className="home-loan-list-icon home-loan-list-blue" />
                Home Purchase Loan:
              </span>
              For buying a new or resale residential property.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <Square size={18} className="home-loan-list-icon home-loan-list-blue" />
                Plot Loan:
              </span>
              For purchasing a plot of land for residential construction.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <Hammer size={18} className="home-loan-list-icon home-loan-list-blue" />
                Home Construction Loan:
              </span>
              For building a house on a self-owned plot.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <Paintbrush size={18} className="home-loan-list-icon home-loan-list-blue" />
                Home Renovation/Improvement Loan:
              </span>
              For repairs, renovations, or upgrades to an existing home.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <Maximize size={18} className="home-loan-list-icon home-loan-list-blue" />
                Home Extension Loan:
              </span>
              For adding new rooms or floors to an existing house.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <RefreshCcw size={18} className="home-loan-list-icon home-loan-list-blue" />
                Home Loan Balance Transfer:
              </span>
              For transferring your existing home loan to another lender, usually for a lower interest rate or better terms.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <TrendingUp size={18} className="home-loan-list-icon home-loan-list-blue" />
                Top-Up Loan:
              </span>
              An additional loan sanctioned over an existing home loan, often for any personal or business need.
            </li>
          </ul>
        
          <h3 className="home-loan-subheadings">
            Interest Rate Types
          </h3>
          <ul className="home-loan-list home-loan-list-disc">
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Fixed Interest Rate:</span> The interest rate remains constant throughout the loan tenure, providing predictable EMIs.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Floating Interest Rate:</span> The interest rate fluctuates with market conditions. EMIs can increase or decrease.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Hybrid Interest Rate:</span> A combination, fixed for an initial period then converts to floating.
            </li>
          </ul>
        
          <h3 className="home-loan-subheadings">
            Key Home Loan Terms to Know
          </h3>
          <ul className="home-loan-list home-loan-list-disc">
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Loan to Value (LTV) Ratio:</span> The maximum percentage of the property's value that a bank can finance.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Processing Fees:</span> A one-time fee charged by the lender for processing your loan application.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Prepayment/Foreclosure Charges:</span> Fees charged if you repay a part or the entire loan before tenure (often zero for floating-rate loans for individuals).
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Stamp Duty & Registration Charges:</span> Government levies on the property transaction, not covered by the loan.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Legal & Technical Valuation Fees:</span> Charges for legal verification of documents and property valuation.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title">Moratorium Period:</span> A temporary period during which the borrower is not required to make full EMI payments.
            </li>
          </ul>
        
          <h3 className="home-loan-subheadings">
            Tax Benefits on Home Loans (India Specific)
          </h3>
          <p className="home-loan-paragraph ">
            Home loans offer significant tax benefits in India under the Income Tax Act, 1961:
          </p>
          <ul className="home-loan-list home-loan-list-none">
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <FileText size={18} className="home-loan-list-icon home-loan-list-green" />
                Section 80C:
              </span>
              Deduction for principal repayment up to ?1.5 Lakh per financial year.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <DollarSign size={18} className="home-loan-list-icon home-loan-list-green" />
                Section 24(b):
              </span>
              Deduction for interest paid. Up to ?2 Lakh for self-occupied property.
            </li>
            <li className="home-loan-list-item">
              <span className="home-loan-list-title home-loan-list-flex">
                <Percent size={18} className="home-loan-list-icon home-loan-list-green" />
                Section 80EE/80EEA:
              </span>
              Additional deductions for interest paid for first-time homebuyers.
            </li>
          </ul>
        </section>

        {/* FAQs Section */}
              <section className="home-faq-section">
          <h2 className="home-faq-headings "style={{display:"flex",alignItems:"center"}}>
            <HelpCircle size={20} className="home-faq-icon" />
            Frequently Asked Questions (FAQs) about Home Loans
          </h2>
          <div className="home-faq-list">
            {homeLoanFaqs.map((faq, i) => (
              <div
                key={i}
                className={`home-faq-item ${
                  openFAQ === i ? "home-faq-open" : ""
                }`}
              >
                <button
                  className={`home-faq-question ${
                    openFAQ !== i ? "home-faq-question-closed" : ""
                  }`}
                  onClick={() => toggleFAQ(i)}
                  aria-expanded={openFAQ === i ? "true" : "false"}
                  aria-controls={`faq-answer-${i}`}
                >
                  <p className="home-faq-question-text">{faq.q}</p>
                  <ChevronDown size={20} className={`home-faq-chevron calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
                </button>
                <p
                  id={`faq-answer-${i}`}
                  className={`home-faq-answer ${
                    openFAQ === i ? "home-faq-answer-open" : ""
                  }`}
                  aria-hidden={openFAQ !== i}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.a) }}
                ></p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="home-conclusion-section">
          <p className="home-conclusion-text">
            The UniCX Home Loan Calculator is your trusted partner in navigating
            the complexities of home financing. It provides the clarity and
            insights you need to make empowered decisions for your dream home.
            <br />
            <br />
            This Home Loan Calculator and the information provided are developed
            and maintained by{" "}
            <span className="home-conclusion-bold">
              UniCX (UniconsultX Solutions Private Limited)
            </span>{" "}
            to help users understand home loan calculations. While we strive for
            accuracy, the information is for illustrative purposes only and
            should not be considered financial advice. For personalized
            financial advice or specific loan product details, always consult
            with a qualified financial advisor or your lender.
          </p>
        </section>
      </div>
      </div>
      </div>
      {/* </div> */}
     
    </section>
    </>
  );
}

export default HomeEMICalculator;





