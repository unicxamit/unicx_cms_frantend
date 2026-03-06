import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  Calculator,
  PieChart,
  TrendingUp,
  Handshake,
  Landmark,
  Car,
  HeartHandshake,
  School,
  Banknote,
  HelpCircle,
  ChevronDown,
  Lightbulb,
  CheckCircle,
  FileText,
} from "lucide-react";


import emilogo from "../assets/images/calculators_img/BG IMAGES/emi1.png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how3.png"
import benifite from  "../assets/images/calculators_img/BG IMAGES/3 png.png"
import Header from "../component/Header";
import "../calculatorCss/EMICalculator.css";
function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState("2000000");
  const [interestRate, setInterestRate] = useState("14");
  const [loanPeriod, setLoanPeriod] = useState("30");
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

    if (isNaN(P) || P < 100 || P > 1000000000) {
      newErrors.loanAmount = "Amount must be between ?100 and ?10,00,00,000.";
      isValid = false;
    }
    if (isNaN(r) || r <= 0 || r > 30) {
      // Corrected max rate to 30% for consistency
      newErrors.interestRate = "Annual Return must be between 0.1% and 30%.";
      isValid = false;
    }
    if (isNaN(n) || n <= 0 || n > 50) {
      // Corrected max period to 50 years for consistency
      newErrors.loanPeriod = "Duration must be between 1 and 50 years.";
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
      setMonthlyResult({ emi: 0, total: 0, interest: 0 });
      setYearlyResult({ emi: 0, total: 0, interest: 0 });
    }
  }, [loanAmount, interestRate, loanPeriod, frequency]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value <= 1000000000) {
      setLoanAmount(value);
      setErrors((prev) => ({ ...prev, loanAmount: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        loanAmount: "Amount must be between ?100 and ?10,00,00,000.",
      }));
    }
  };

  const handleRateChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) <= 30 && Number(value) >= 0)) {
      setInterestRate(value);
      setErrors((prev) => ({ ...prev, interestRate: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        interestRate: "Annual Return must be between 0.1% and 30%.",
      }));
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) <= 50 && Number(value) >= 0)) {
      setLoanPeriod(value);
      setErrors((prev) => ({ ...prev, loanPeriod: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        loanPeriod: "Loan tenure between 1 and 50 years.",
      }));
    }
  };
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const emiFaqs = [
    {
      q: "Q1: What exactly is EMI?",
      a: "A1: EMI stands for Equated Monthly Installment. It is a fixed payment amount that you pay to your lender every month on a specific date, covering both the principal amount of your loan and the interest accrued on the outstanding balance. The EMI amount remains constant throughout the loan tenure.",
    },
    {
      q: "Q2: How is EMI calculated?",
      a: "A2: The most common formula for calculating EMI is:\n\n$EMI = [P \\times R \\times (1+R)^N] / [(1+R)^N-1]$\n\nWhere:\n* P = Principal Loan Amount\n* R = Monthly Interest Rate (Annual Rate / 12 / 100)\n* N = Loan Tenure in Months\n\nThe UniCX EMI Calculator does this complex calculation instantly for you!",
    },
    {
      q: "Q3: Does my EMI change if the interest rate changes?",
      a: "A3: If you have a loan with a **fixed interest rate**, your EMI will remain constant regardless of market fluctuations. However, if you have a loan with a **floating interest rate**, your EMI (or sometimes the tenure) will change whenever the benchmark interest rate to which your loan is linked is revised by the lender.",
    },
    {
      q: "Q4: Can I reduce my EMI during the loan tenure?",
      a: "A4: Yes, there are ways to potentially reduce your EMI:\n* **Partial Prepayments:** Making extra payments towards your principal loan amount can reduce the outstanding balance, leading to a lower future EMI or a shorter tenure.\n* **Refinancing/Balance Transfer:** You can transfer your outstanding loan to another lender offering a lower interest rate.\n* **Extension of Tenure:** Some lenders might allow you to extend your loan tenure, which will reduce your monthly EMI, though it will increase the total interest paid.",
    },
    {
      q: "Q5: What is an amortization schedule?",
      a: "A5: An amortization schedule is a table that shows the breakdown of each EMI payment throughout the loan tenure. It illustrates how much of each payment goes towards paying off the principal amount and how much goes towards paying interest. Initially, a larger portion is interest, gradually shifting to more principal as the loan matures.",
    },
    {
      q: "Q6: Is it better to take a longer or shorter loan tenure?",
      a: "A6:\n* **Longer Tenure:** Results in a **lower EMI**, making it more affordable monthly, but you end up paying **significantly more total interest** over the loan's lifetime.\n* **Shorter Tenure:** Results in a **higher EMI**, but you pay **much less total interest**, saving a considerable amount of money.\n\nThe best choice depends on your current financial capacity, income stability, and overall financial goals.",
    },
    {
      q: "Q7: What documents are typically needed for a loan application?",
      a: "A7: Common documents include: Identity Proof (Aadhaar, PAN, Passport, Driving License), Address Proof (Aadhaar, Passport, Utility Bills), Income Proof (Salary Slips, Bank Statements, ITR for self-employed), Employment Proof, and specific property/vehicle documents for secured loans.",
    },
    {
      q: "Q8: What is considered a good credit score for a loan in India?",
      a: "A8: In India, a CIBIL score (one of the main credit scores) generally ranges from 300 to 900. A score of **750 or above** is typically considered a very good credit score. It indicates a strong repayment history and financial discipline, making you a more attractive borrower and potentially qualifying you for lower interest rates and better loan terms.",
    },
  ];
  return (
    <>
    <Header/>
    <section className="emi-section">
      <div className="emi-container">
        {/* <div className="border-2"> */}
        <section className="emi-header">
          <h1 className="heading-title">
            EMI Calculator
          </h1>
          
        </section>
         <div className="emi-grid ">
          <div className="">
        
                {/* Loan Amount */}
                <div className="emi-field">
                  <label
                    htmlFor="loanAmount"
                    className="emi-label"
                  >
                    Loan Amount (?)
                  </label>
                  <div
                    className={`emi-input-group
                        ${
                          errors.loanAmount
                            ? "emi-input-error"
                            : "emi-input-focus"
                        }`}
                  >
                    <FaRupeeSign className="emi-icons" />
                    <input
                      id="loanAmount"
                      type="number"
                      value={loanAmount}
                      onChange={handleAmountChange}
                      className="emi-input"
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
                <div className="emi-field">
                  <label
                    htmlFor="interestRate"
                    className="emi-label"
                  >
                    Annual Interest Rate (%)
                  </label>
                  <div
                    className={`emi-input-group
                        ${
                          errors.interestRate
                            ? "emi-input-error"
                            : "emi-input-focus"
                        }`}
                  >
                    <input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={handleRateChange}
                      className="emi-input"
                      placeholder="e.g. 8.5"
                      min="0"
                      step="0.01"
                    />
                    <label className="emi-label-years">
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
                <div className="emi-field">
                  <label
                    htmlFor="loanPeriod"
                    className="emi-label"
                  >
                    Loan Tenure (Years)
                  </label>
                  <div
                    className={`emi-input-group
                        ${
                          errors.loanPeriod
                            ? "emi-input-error"
                            : "emi-input-focus"
                        }`}
                  >
                    <input
                      id="loanPeriod"
                      type="number"
                      value={loanPeriod}
                      onChange={handleYearChange}
                      className="emi-input"
                      placeholder="e.g. 5"
                      min="0"
                    />
                    <label className="emi-label-years">
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
                <div className="emi-field">
                  <label
                    htmlFor="frequency"
                    className="emi-label"
                  >
                    Payment Frequency
                  </label>
                                   <div className="emi-select-group">
                    <select
                      id="frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="emi-select"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
             
          
          </div>
          {/* Results Display */}
          <div className="emi-results">
            
              
              {/* Monthly EMI Results */}
              {(frequency === "monthly" || frequency === "both") && (
                <div className={`${frequency==="both"?"emi-both":""}`}>
                <div className="emi-results-inner">
                                  {/* <h3 className="emi-results-title">
                    Monthly EMI
                  </h3> */}
                  <div className="emi-result-row">
                    <span className="emi-result-field">EMI:</span>
                    <span className="emi-result-row-span">
                      ₹{monthlyResult.emi.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="emi-result-row">
                    <span className="emi-result-field">
                      Total Interest:
                    </span>
                    <span className="emi-result-row-span">
                      ₹{monthlyResult.interest.toLocaleString("en-IN")}
                    </span>
                  </div>
                 
                </div>
                <div className="emi-total-row ">
                    <span className="">
                      Total Payment:
                    </span>
                    <span className="flex items-center gap-1">
                      <FaRupeeSign />
                      ₹{monthlyResult.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}

              {/* Yearly EMI Results */}
              {(frequency === "yearly" || frequency === "both") && (
                <div className={`${frequency==="both"?"emi-both":""}`}>
                  {/* <h3 className="emi-results-title">
                    Yearly EMI
                  </h3> */}
                  <div className="">
                  <div className="emi-result-row">
                    <span className="emi-result-field ">EMI:</span>
                    <span className="emi-result-row-span">
                      ₹{yearlyResult.emi.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="emi-result-row">
                    <span className="emi-result-field ">
                      Total Interest:
                    </span>
                    <span className="emi-result-row-span">
                     ₹{yearlyResult.interest.toLocaleString("en-IN")}
                    </span>
                  </div>
                 
                </div>
                <div className="emi-total-row ">
                    <span className="">
                      Total Payment:
                    </span>
                    <span className="flex items-center gap-1">
                      <FaRupeeSign />
                      ₹{yearlyResult.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                
              )}
            </div>
         
        </div>

               <section className="emi-info-section" style={{ marginBottom: "26px" }}>
          <div className="emi-info-content">
            {/* What is EMI? */}
            <section className="">
              <h2 className="header-main">What is EMI?</h2>
              <div className="emi-section-grid">
                <div>
                  <p className="p-content">
                    EMI stands for <strong className="bold-content">Equated Monthly Installment</strong>.
                    It is a fixed payment amount that a borrower pays to a lender
                    at a specified date each month. This monthly payment combines
                    both the principal loan amount and the interest accrued on the
                    outstanding loan balance. The EMI remains constant throughout
                    the loan tenure, making it easy for borrowers to budget their
                    finances.
                  </p>
                  <p className="p-content ">
                    Whether it's a home loan, car loan, personal loan, or any other
                    type of financing, EMIs are the standard method of repayment,
                    ensuring a systematic and predictable way to clear your debt.
                  </p>
                </div>
                <div className="emi-img-box emi-img-hover">
                  <img
                    src={emilogo}
                    alt="EMI - Loan Repayment"
                    className="emi-img"
                  />
                </div>
              </div>
            </section>
        
            {/* Why is an EMI Calculator Important? */}
            <section className="">
              <h2 className="header-main">
                Why is an EMI Calculator Important?
              </h2>
              <ul className="emi-icon-list">
                <li className="list-content">
                  <strong className="emi-icon-title">
                    <PieChart size={18} className="emi-icon" />
                    Financial Planning:
                  </strong>
                  <span className="emi-icon-desc">
                    It helps you determine your exact monthly outflow,
                    allowing you to budget effectively and avoid financial
                    strain.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="emi-icon-title">
                    <Calculator size={18} className="emi-icon" />
                    Loan Comparison:
                  </strong>
                  <span className="emi-icon-desc">
                    Easily compare EMI amounts for different loan offers
                    by inputting varying principal amounts, interest rates, and
                    tenures.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="emi-icon-title">
                    <TrendingUp size={18} className="emi-icon" />
                    Optimal Tenure & Rate Selection:
                  </strong>
                  <span className="emi-icon-desc">
                    Experiment with different loan tenures and interest
                    rates to understand their direct impact on your monthly
                    EMI and the total interest you'll pay over the loan's
                    lifetime.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="emi-icon-title">
                    <Handshake size={18} className="emi-icon" />
                    Informed Decision-Making:
                  </strong>
                  <span className="emi-icon-desc">
                    Armed with precise figures, you can make smarter choices
                    about how much you can comfortably borrow and for how
                    long.
                  </span>
                </li>
              </ul>
              <p className="p-content ">
                The <strong className="bold-content">UniCX EMI Calculator</strong> simplifies the complex calculations involved in loan
                repayments, giving you instant insights to manage your debt
                responsibly and efficiently.
              </p>
            </section>
        
            {/* How to Use the UniCX EMI Calculator */}
            <section className="">
              <h2 className="header-main">
                How to Use the UniCX EMI Calculator
              </h2>
              <div className="emi-section-grid">
                <div>
                  <p className="p-content">
                    Our EMI calculator is designed for simplicity and accuracy,
                    providing you with immediate results:
                  </p>
                  <ol className="emi-howto-ol">
                    <li className="list-content">
                      <strong>Enter Principal Loan Amount:</strong> Input the
                      total amount you wish to borrow (e.g., ?5,00,000 for a car
                      loan, ?50,00,000 for a home loan).
                    </li>
                    <li className="list-content">
                      <strong>Enter Interest Rate (%):</strong> Provide the
                      annual interest rate offered by the lender.
                    </li>
                    <li className="list-content">
                      <strong>Specify Loan Tenure:</strong> Choose the duration
                      of the loan in either "Years" or "Months."
                    </li>
                    <li className="list-content">
                      <strong>Calculate:</strong> Click the "Calculate EMI"
                      button to get your results instantly.
                    </li>
                  </ol>
                  <h3 className="emi-section-subheading">The UniCX EMI Calculator will then provide you with:</h3>
                  <ul className="emi-section-ul">
                    <li className="list-content">
                      <strong>Monthly EMI Amount:</strong> The exact amount you
                      will need to pay each month.
                    </li>
                    <li className="list-content">
                      <strong>Total Interest Payable:</strong> The total amount
                      of interest you will pay over the entire loan tenure.
                    </li>
                    <li className="list-content">
                      <strong>Total Amount Payable:</strong> The sum of your
                      principal loan amount and the total interest payable.
                    </li>
                    <li className="list-content">
                      <strong>Amortization Schedule:</strong> A detailed
                      breakdown showing how your principal and interest
                      components change with each EMI payment over the loan
                      tenure.
                    </li>
                  </ul>
                </div>
                <div className="emi-img-box emi-img-hover">
                  <img
                    src={howuse}
                    alt="How to use UniCX EMI Calculator"
                    className="emi-img emi-img-lg"
                  />
                </div>
              </div>
            </section>
        
            {/* Understanding EMI: Key Aspects of Loan Repayment */}
            <section className="">
              <h2 className="header-main">
                Understanding EMI: Key Aspects of Loan Repayment
              </h2>
              <p className="p-content ">
                To effectively manage your loan, it's important to understand
                the core concepts behind EMI:
              </p>
              <h3 className="emi-section-subheading flex items-center">
                <Banknote size={18} className="emi-icon" /> Components of EMI
              </h3>
              <p className="p-content ">
                Every EMI payment consists of two parts:
              </p>
              <ul className="emi-section-ul">
                <li className="list-content">
                  <strong>Principal Component:</strong> This is the portion of
                  your payment that goes towards reducing your actual borrowed
                  amount.
                </li>
                <li className="list-content">
                  <strong>Interest Component:</strong> This is the cost of
                  borrowing money, calculated on the outstanding principal
                  balance.
                </li>
              </ul>
              <p className="p-content ">
                In the initial years of a loan, a larger portion of your EMI
                goes towards paying interest. As the loan progresses and the
                principal outstanding reduces, a larger portion of your EMI
                starts contributing to the principal repayment.
              </p>
              <h3 className="emi-section-subheading flex items-center">
                <Calculator size={18} className="emi-icon" /> Factors Affecting EMI
              </h3>
              <p className="p-content ">
                Three primary factors directly influence your EMI:
              </p>
              <ul className="emi-section-ul">
                <li className="list-content">
                  <strong>Principal Loan Amount:</strong> A higher loan amount
                  will naturally result in a higher EMI, assuming other factors
                  remain constant.
                </li>
                <li className="list-content">
                  <strong>Interest Rate:</strong> The interest rate is a
                  critical factor. Even a small change in the interest rate can
                  significantly impact your EMI and the total interest paid.
                </li>
                <li className="list-content">
                  <strong>Loan Tenure (Duration):</strong> This is the period
                  over which you choose to repay the loan.
                  <ul className="emi-section-ul ml-6 mt-1">
                    <li className="list-content">
                      <strong>Longer Tenure:</strong> Leads to a lower EMI but
                      results in a higher total interest paid over the loan's
                      lifetime.
                    </li>
                    <li className="list-content">
                      <strong>Shorter Tenure:</strong> Results in a higher EMI
                      but significantly reduces the total interest paid.
                    </li>
                  </ul>
                </li>
              </ul>
              <h3 className="emi-section-subheading flex items-center">
                <FileText size={18} className="emi-icon" /> Types of Loans (Repaid via EMI)
              </h3>
              <p className="p-content ">
                EMIs are the most common repayment method for various types of
                loans:
              </p>
              <ul className="emi-icon-list">
                <li className="list-content">
                  <strong className="emi-icon-title">
                    <Landmark size={18} className="emi-icon" />
                    Home Loans:
                  </strong>
                  <span className="emi-icon-desc">
                    Long-term loans used to purchase or construct a house.
                    Typically have lower interest rates and longer tenures.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="emi-icon-title">
                    <Car size={18} className="emi-icon" />
                    Car Loans:
                  </strong>
                  <span className="emi-icon-desc">
                    Loans for purchasing new or used vehicles. Usually have
                    moderate interest rates and tenures.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="emi-icon-title">
                    <HeartHandshake size={18} className="emi-icon" />
                    Personal Loans:
                  </strong>
                  <span className="emi-icon-desc">
                    Unsecured loans for various personal needs. Generally have
                    higher interest rates and shorter tenures.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="emi-icon-title">
                    <School size={18} className="emi-icon" />
                    Education Loans:
                  </strong>
                  <span className="emi-icon-desc">
                    Loans to finance higher education. Often come with flexible
                    repayment options and tax benefits.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="emi-icon-title">
                    <Banknote size={18} className="emi-icon" />
                    Other Loans:
                  </strong>
                  <span className="emi-icon-desc">
                    Includes consumer durable loans, business loans, etc.
                  </span>
                </li>
              </ul>
            </section>
        
            {/* Who Can Benefit from the UniCX EMI Calculator? */}
            <section className="">
              <h2 className="header-main">
                Who Can Benefit from the UniCX EMI Calculator?
              </h2>
              <div className="emi-section-grid">
                <div>
                  <p className="p-content ">
                    The UniCX EMI Calculator is an indispensable tool for a wide
                    range of individuals and businesses:
                  </p>
                  <ul className="emi-section-ul">
                    <li className="list-content">
                      <strong>Prospective Borrowers:</strong> Anyone considering
                      taking out a new loan can pre-calculate their potential
                      EMIs and total repayment costs.
                    </li>
                    <li className="list-content">
                      <strong>Existing Loan Holders:</strong> To understand
                      their current loan's amortization schedule, or to evaluate
                      the impact of prepayments or refinancing.
                    </li>
                    <li className="list-content">
                      <strong>Financial Planners & Advisors:</strong> To quickly
                      illustrate loan scenarios for their clients and help them
                      make informed borrowing decisions.
                    </li>
                    <li className="list-content">
                      <strong>Budget-Conscious Individuals:</strong> To ensure
                      that potential loan repayments fit comfortably within
                      their monthly budget.
                    </li>
                  </ul>
                </div>
                <div className="emi-img-box emi-img-hover">
                  <img
                    src={benifite}
                    alt="Who can use UniCX EMI Calculator"
                    className="emi-img emi-img-lg"
                  />
                </div>
              </div>
            </section>
        
            {/* Key Considerations & Important Notes Before Taking a Loan */}
            <section className="">
              <div className="emi-considerations-box">
                <h2 className="emi-considerations-heading">
                  <Lightbulb size={20} className="emi-considerations-icon" />
                  Key Considerations & Important Notes Before Taking a Loan
                </h2>
                <p className="emi-considerations-desc">
                  While an EMI calculator provides clarity on your monthly
                  payments, remember to consider these broader factors before
                  committing to a loan:
                </p>
                <ul className="emi-considerations-list">
                  <li>
                    <strong className="emi-icon-title">
                      <CheckCircle size={18} className="emi-icon" />
                      Processing Fees & Other Charges:
                    </strong>
                    <span className="emi-icon-desc">
                      Beyond the interest rate, loans often involve processing
                      fees, legal fees, technical valuation fees, stamp duty,
                      etc. Factor these into your overall loan cost.
                    </span>
                  </li>
                  <li>
                    <strong className="emi-icon-title">
                      <CheckCircle size={18} className="emi-icon" />
                      Prepayment & Foreclosure Rules:
                    </strong>
                    <span className="emi-icon-desc">
                      Understand if your lender allows partial prepayments or
                      full foreclosure, and if any penalties apply. Prepaying
                      can significantly reduce your total interest burden.
                    </span>
                  </li>
                  <li>
                    <strong className="emi-icon-title">
                      <CheckCircle size={18} className="emi-icon" />
                      Floating vs. Fixed Interest Rates:
                    </strong>
                    <span className="emi-icon-desc">
                      Decide whether a stable EMI (fixed) or one that fluctuates
                      with market rates (floating) suits your risk profile.
                    </span>
                  </li>
                  <li>
                    <strong className="emi-icon-title">
                      <CheckCircle size={18} className="emi-icon" />
                      Credit Score:
                    </strong>
                    <span className="emi-icon-desc">
                      Your credit score significantly impacts the interest rate
                      you'll be offered. A higher score generally qualifies you
                      for lower rates.
                    </span>
                  </li>
                  <li>
                    <strong className="emi-icon-title">
                      <CheckCircle size={18} className="emi-icon" />
                      Debt-to-Income (DTI) Ratio & Eligibility:
                    </strong>
                    <span className="emi-icon-desc">
                      Lenders assess your DTI and specific eligibility criteria
                      (age, income, employment stability).
                    </span>
                  </li>
                  <li>
                    <strong className="emi-icon-title">
                      <CheckCircle size={18} className="emi-icon" />
                      Emergency Fund:
                    </strong>
                    <span className="emi-icon-desc">
                      Ensure you have an adequate emergency fund even after
                      taking a loan, to handle unforeseen financial disruptions
                      without defaulting on EMIs.
                    </span>
                  </li>
                </ul>
              </div>
            </section>
        
            {/* FAQs Section */}
            <section className="">
              <h2 className="header-main flex items-center">
                <HelpCircle size={20} className="emi-icon" />
                Frequently Asked Questions (FAQs) about EMI
              </h2>
              <div className="emi-faq-list">
                {emiFaqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`emi-faq-item${openFAQ === i ? " active" : ""}`}
                  >
                    <button
                      className={`emi-faq-question${openFAQ !== i ? " emi-faq-question-inactive" : ""}`}
                      onClick={() => toggleFAQ(i)}
                      aria-expanded={openFAQ === i ? "true" : "false"}
                      aria-controls={`faq-answer-${i}`}
                    >
                      <p className="">{faq.q}</p>
                      <ChevronDown size={20} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
                    </button>
                    <p
                      id={`faq-answer-${i}`}
                      className={`emi-faq-answer${openFAQ === i ? "" : " inactive"}`}
                      aria-hidden={openFAQ !== i}
                    >
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
        
            {/* Conclusion */}
            <section className="emi-footer-note-box">
              <p className="emi-footer-note">
                The UniCX EMI Calculator is an indispensable tool for anyone
                navigating the world of loans. It provides clarity, helps with
                budgeting, and empowers you to make informed decisions about
                your financial commitments.
                <br />
                <br />
                This EMI Calculator and the information provided are developed
                and maintained by
                <strong className="bold-content">
                  UniCX (UniconsultX Solutions Private Limited)
                </strong>
                to help users understand EMI calculations. While we strive for
                accuracy, the information is for illustrative purposes only and
                should not be considered financial advice. For personalized
                financial advice or specific loan product details, always
                consult with a qualified financial advisor or your lender.
              </p>
            </section>
          </div>
        </section>
        {/* </div> */}
      </div>
   
    </section>
    </>
  );
}

export default EMICalculator;


