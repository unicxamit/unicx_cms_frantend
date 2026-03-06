import React, { useState, useEffect } from "react";
// Assuming you're using Lucide icons, adjust imports as needed
import {
  Clock,
  Landmark,
  TrendingUp,
  DollarSign,
  Target,
  Briefcase,
  BarChart,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import Header from "../component/Header";
import gratuitylogo from "../assets/images/calculators_img/BG IMAGES/retir1.png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how1.png";
import benifite from "../assets/images/calculators_img/BG IMAGES/3 png.png"

import "../calculatorCss/RetirementCalculator.css";
import { FaRupeeSign } from "react-icons/fa";

function RetirementCalculator() {
  // State variables for user inputs
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState(50000);
  const [inflationRate, setInflationRate] = useState(5); // in %
  const [preRetirementROI, setPreRetirementROI] = useState(10); // in %
  const [postRetirementROI, setPostRetirementROI] = useState(7); // in %
  const [existingSavings, setExistingSavings] = useState(100000);
  const [retirementBenefits, setRetirementBenefits] = useState(0);
  const [errors, setErrors] = useState({});

  // State variables for calculated results
  const [monthlyExpensesAtRetirement, setMonthlyExpensesAtRetirement] =
    useState(0);
  const [corpusRequired, setCorpusRequired] = useState(0);
  const [monthlySIPRequired, setMonthlySIPRequired] = useState(0);
  const [message, setMessage] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Function to format numbers to Indian Rupee system
  const formatIndianRupee = (amount) => {
    if (isNaN(amount) || amount === 0) return "₹0";
    const parts = Math.round(amount).toString().split(".");
    let lastThree = parts[0].substring(parts[0].length - 3);
    let otherNumbers = parts[0].substring(0, parts[0].length - 3);
    if (otherNumbers !== "") {
      lastThree = "," + lastThree;
    }
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return "₹" + res + (parts.length > 1 ? "." + parts[1] : "");
  };

  // Centralized validation function
  const validateInputs = () => {
    let newErrors = {};
    let isValid = true;

    // Current Age validation
    if (
      currentAge === "" ||
      Number(currentAge) < 15 ||
      Number(currentAge) > 60
    ) {
      newErrors.currentAge = "Current age must be between 15 and 60 years.";
      isValid = false;
    }

    // Retirement Age validation
    if (
      retirementAge === "" ||
      Number(retirementAge) <= Number(currentAge) ||
      Number(retirementAge) > 70
    ) {
      newErrors.retirementAge =
        "Retirement age must be greater than current age and less than or equal to 70.";
      isValid = false;
    }

    // Life Expectancy validation
    if (
      lifeExpectancy === "" ||
      Number(lifeExpectancy) <= Number(retirementAge) ||
      Number(lifeExpectancy) > 100
    ) {
      newErrors.lifeExpectancy =
        "Life expectancy must be greater than retirement age and less than or equal to 100.";
      isValid = false;
    }

    // Current Monthly Expenses validation
    if (
      currentMonthlyExpenses === "" ||
      Number(currentMonthlyExpenses) < 0 ||
      String(currentMonthlyExpenses).length > 1000000000
    ) {
      newErrors.currentMonthlyExpenses =
        "Monthly expenses must be a non-negative number and cannot be more than 1000000000 .";
      isValid = false;
    }

    // Inflation Rate validation
    if (
      inflationRate === "" ||
      Number(inflationRate) < 0 ||
      Number(inflationRate) > 15
    ) {
      newErrors.inflationRate = "Inflation rate must be between 0% and 15%.";
      isValid = false;
    }

    // Pre-Retirement ROI validation
    if (
      preRetirementROI === "" ||
      Number(preRetirementROI) < 0 ||
      Number(preRetirementROI) > 60
    ) {
      newErrors.preRetirementROI =
        "Pre-retirement ROI must be between 0% and 60%.";
      isValid = false;
    }

    // Post-Retirement ROI validation
    if (
      postRetirementROI === "" ||
      Number(postRetirementROI) < 0 ||
      Number(postRetirementROI) > 30
    ) {
      newErrors.postRetirementROI =
        "Post-retirement ROI must be between 0% and 30%.";
      isValid = false;
    }

    // Existing Savings validation
    if (
      existingSavings === "" ||
      Number(existingSavings) < 0 ||
      Number(existingSavings) > 1000000000
    ) {
      newErrors.existingSavings =
        "Existing savings must be a 1 and cannot be more than 1000000000 .";
      isValid = false;
    }

    // Retirement Benefits validation
    if (
      retirementBenefits === "" ||
      Number(retirementBenefits) < 0 ||
      Number(retirementBenefits) > 1000000000
    ) {
      newErrors.retirementBenefits =
        "Retirement benefits must be a 1  and cannot be more than 1000000000.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Function to calculate retirement planning
  const calculateRetirement = () => {
    if (!validateInputs()) {
      setShowResults(false);
      return;
    }

    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    // Convert percentages to decimals
    const inflRateDecimal = inflationRate / 100;
    const preRetROI_Decimal = preRetirementROI / 100;
    const postRetROI_Decimal = postRetirementROI / 100;

    // 1. Calculate future monthly expenses at retirement
    const futureMonthlyExpenses =
      currentMonthlyExpenses * Math.pow(1 + inflRateDecimal, yearsToRetirement);
    setMonthlyExpensesAtRetirement(futureMonthlyExpenses);

    // 2. Calculate the total corpus required at retirement
    const annualExpensesAtRetirement = futureMonthlyExpenses * 12;

    let corpusNeededForRetirement = 0;
    // Calculate inflation-adjusted return during retirement
    const realRateOfReturnPostRetirement =
      (1 + postRetROI_Decimal) / (1 + inflRateDecimal) - 1;

    if (realRateOfReturnPostRetirement === 0) {
      // If real rate of return is 0, simple multiplication
      corpusNeededForRetirement =
        annualExpensesAtRetirement * yearsInRetirement;
    } else {
      // Present value of an annuity formula for corpus
      corpusNeededForRetirement =
        (annualExpensesAtRetirement *
          (1 -
            Math.pow(1 + realRateOfReturnPostRetirement, -yearsInRetirement))) /
        realRateOfReturnPostRetirement;
    }
    setCorpusRequired(corpusNeededForRetirement);

    // 3. Calculate future value of existing savings and retirement benefits
    const fvExistingSavings =
      existingSavings * Math.pow(1 + preRetROI_Decimal, yearsToRetirement);
    const fvRetirementBenefits = retirementBenefits; // Assuming retirement benefits are received at retirement, so no future value calculation needed for them if they are current values

    const netCorpusToBuild =
      corpusNeededForRetirement - fvExistingSavings - fvRetirementBenefits;

    // 4. Calculate monthly SIP required
    let requiredSIP = 0;
    if (netCorpusToBuild <= 0) {
      setMessage(
        "Congratulations! Based on your current savings and benefits, you already have enough or more than enough for your estimated retirement corpus."
      );
      setMonthlySIPRequired(0);
    } else {
      const monthsToRetirement = yearsToRetirement * 12;
      const monthlyPreRetROI = Math.pow(1 + preRetROI_Decimal, 1 / 12) - 1;

      if (monthlyPreRetROI === 0) {
        requiredSIP = netCorpusToBuild / monthsToRetirement;
      } else {
        // Future value of annuity formula for SIP
        requiredSIP =
          netCorpusToBuild *
          (monthlyPreRetROI /
            (Math.pow(1 + monthlyPreRetROI, monthsToRetirement) - 1));
      }
      setMonthlySIPRequired(requiredSIP);
      setMessage(""); // Clear any previous messages if there was a "have enough" message
    }
    setShowResults(true);
  };

  // useEffect to recalculate when any input changes, and validate
  useEffect(() => {
    calculateRetirement();
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentMonthlyExpenses,
    inflationRate,
    preRetirementROI,
    postRetirementROI,
    existingSavings,
    retirementBenefits,
  ]);

  // Input change handlers with validation
  const handleCurrentAgeChange = (e) => {
    const value = e.target.value;
    if (value <= 60) {
      setCurrentAge(value);
      setErrors((prev) => ({ ...prev, currentAge: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        currentAge: "Current age must be between 15 and 60 years.",
      }));
    }
  };

  const handleRetirementAgeChange = (e) => {
    const value = e.target.value;
    if (value <= 70) {
      setRetirementAge(value);
      setErrors((prev) => ({ ...prev, retirementAge: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        retirementAge:
          "Retirement age must be greater than current age and less than or equal to 70.",
      }));
    }
  };

  const handleLifeExpectancyChange = (e) => {
    const value = e.target.value;

    if (value <= 100) {
      setLifeExpectancy(value);
      setErrors((prev) => ({ ...prev, lifeExpectancy: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        lifeExpectancy:
          "Life expectancy must be greater than retirement age and less than or equal to 100.",
      }));
    }
  };

  const handleCurrentMonthlyExpensesChange = (e) => {
    const value = e.target.value;
    if (value <= 1000000000) {
      setCurrentMonthlyExpenses(value);
      setErrors((prev) => ({ ...prev, currentMonthlyExpenses: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        currentMonthlyExpenses:
          "Monthly expenses must be a non-negative number and cannot be more than 1000000000.",
      }));
    }
  };

  const handleInflationRateChange = (e) => {
    const value = e.target.value;
    if (value <= 15) {
      setInflationRate(value);
      setErrors((prev) => ({ ...prev, inflationRate: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        inflationRate: "Inflation rate must be between 0% and 15%.",
      }));
    }
  };

  const handlePreRetirementROIChange = (e) => {
    const value = e.target.value;
    if (value <= 60) {
      setPreRetirementROI(value);
      setErrors((prev) => ({ ...prev, preRetirementROI: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        preRetirementROI: "Pre-retirement ROI must be between 0% and 60%.",
      }));
    }
  };

  const handlePostRetirementROIChange = (e) => {
    const value = e.target.value;
    if (value <= 30) {
      setPostRetirementROI(value);
      setErrors((prev) => ({ ...prev, postRetirementROI: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        postRetirementROI: "Post-retirement ROI must be between 0% and 30%..",
      }));
    }
  };

  const handleExistingSavingsChange = (e) => {
    const value = e.target.value;
    if (value <= 1000000000) {
      setExistingSavings(value);
      setErrors((prev) => ({ ...prev, existingSavings: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        existingSavings:
          "Existing savings must be a 1 and cannot be more than 1000000000 .",
      }));
    }
  };

  const handleRetirementBenefitsChange = (e) => {
    const value = e.target.value;
    if (value <= 1000000000) {
      setRetirementBenefits(value);
      setErrors((prev) => ({ ...prev, retirementBenefits: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        retirementBenefits:
          "Retirement benefits must be a 1  and cannot be more than 1000000000.",
      }));
    }
  };

  const [openFAQ, setOpenFAQ] = React.useState(null);
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Retirement Calculator FAQs data
  const retirementFaqs = [
    {
      q: "Q1: When should I start planning for retirement?",
      a: "A1: The earlier, the better. Starting in your 20s or early 30s gives your investments the maximum time to grow due to compounding, significantly reducing the pressure to save large amounts later.",
    },
    {
      q: "Q2: How much should I save for retirement?",
      a: "A2: There's no single answer as it depends on your desired retirement lifestyle, current age, income, and inflation. A common rule of thumb is to save 10-15% of your income, increasing it over time. Our calculator helps personalize this number.",
    },
    {
      q: "Q3: What is a safe withdrawal rate in retirement?",
      a: "A3: The '4% rule' is a widely discussed guideline, suggesting you can withdraw 4% of your initial retirement corpus in the first year of retirement, adjusted for inflation annually, with a high probability of not running out of money for 30 years. However, this rule has nuances and should be adapted to individual circumstances.",
    },
    {
      q: "Q4: Should I consider inflation when planning for retirement?",
      a: "A4: Absolutely. Inflation is crucial. It operates in the background, eroding purchasing power over time. What costs ?100 today might cost significantly more in 20-30 years. Our calculator incorporates inflation to provide a realistic future expense estimate.",
    },
    {
      q: "Q5: What investment options are suitable for retirement?",
      a: "A5: A diversified portfolio is key. Common options include: Equity Mutual Funds/Stocks (for long-term growth), Public Provident Fund (PPF), Employees' Provident Fund (EPF), National Pension System (NPS), and Fixed Deposits/Bonds (for stability). Always align your investments with your risk tolerance and financial goals.",
    },
  ];
  return (
    <><Header/>
    <section className="retirement-section">
      <div className="retirement-container">
        <div className="retirement-header">
          <h1 className="heading-title">Retirement Calculator</h1>
         
        </div>

        {/* Right Section: Calculator Inputs and Results */}
        <div className="retirement-grid">
          {/* Input Fields Section */}
          <div className="">
            {/* Current Age */}
            <div className="retirement-field">
              <label htmlFor="currentAge" className="retirement-label">
                Current Age (Years)
              </label>
              <div
                className={` retirement-input-group 
                        ${
                          errors.currentAge
                            ?"retirement-input-error": "retirement-input-focus"
                        }`}
              >
                <input
                  type="number"
                  id="currentAge"
                  className="retirement-input "
                  value={currentAge}
                  onChange={handleCurrentAgeChange}
                  min="15"
                  max="60"
                />
                             <label className="retirement-label-years">
                  years
                </label>
              </div>
              {errors.currentAge && (
                <p className="error-text">{errors.currentAge}</p>
              )}
            </div>

            {/* Retirement Age */}
            <section className=""> 
              <div className="retirement-field">
              <label htmlFor="retirementAge" className="retirement-label">
                Retirement Age(Yrs)
              </label>
              <div
                className={`retirement-input-group
                        ${
                          errors.retirementAge
                            ? "retirement-input-error"
                            : "retirement-input-focus"
                        }`}
              >
                <input
                  type="number"
                  id="retirementAge"
                  className="retirement-input "
                  value={retirementAge}
                  onChange={handleRetirementAgeChange}
                  min={Number(currentAge) + 1}
                  max="70"
                />
                                <label className="retirement-label-years">
                  years
                </label>
              </div>
              {errors.retirementAge && (
                <p className="error-text">{errors.retirementAge}</p>
              )}
            </div>

            {/* Life Expectancy */}
            <div className="retirement-field">
              <label htmlFor="lifeExpectancy" className="retirement-label">
                Life Expectancy
              </label>
              <div
                className={`retirement-input-group
                        ${
                          errors.lifeExpectancy
                            ? "retirement-input-error"
                            : "retirement-input-focus"
                        }`}
              >
                <input
                  type="number"
                  id="lifeExpectancy"
                  className="retirement-input"
                  value={lifeExpectancy}
                  onChange={handleLifeExpectancyChange}
                  min={Number(retirementAge) + 1}
                  max="100"
                />
                               <label className="retirement-label-years">
                  years
                </label>
              </div>
              {errors.lifeExpectancy && (
                <p className="error-text">{errors.lifeExpectancy}</p>
              )}
            </div></section>
           
<section className="custom-grid-section"> <div className="retirement-field">
              <label htmlFor="currentMonthlyExpenses" className="retirement-label">
                Current Monthly Expenses (?)
              </label>
              <div
                className={`retirement-input-group
                        ${
                          errors.currentMonthlyExpenses
                            ? "retirement-input-error"
                            : "retirement-input-focus"
                        }`}
              >
                <FaRupeeSign className="retirement-icons" />
                <input
                  type="number"
                  id="currentMonthlyExpenses"
                  className="retirement-input"
                  value={currentMonthlyExpenses}
                  onChange={handleCurrentMonthlyExpensesChange}
                  min="0"
                />
              </div>
              {errors.currentMonthlyExpenses && (
                <p className="error-text">{errors.currentMonthlyExpenses}</p>
              )}
            </div>

            {/* Inflation Rate */}
            <div className="retirement-field">
              <label htmlFor="inflationRate" className="retirement-label">
                Expected Inflation Rate (%)
              </label>
              <div
                className={`retirement-input-group
                        ${
                          errors.inflationRate
                            ? "retirement-input-error"
                            : "retirement-input-focus"
                        }`}
              >
                <input
                  type="number"
                  id="inflationRate"
                  className="retirement-input"
                  value={inflationRate}
                  onChange={handleInflationRateChange}
                  min="0"
                  max="15"
                  step="0.1"
                />
                                <label className="retirement-label-years">
                  %
                </label>
              </div>
              {errors.inflationRate && (
                <p className="error-text">{errors.inflationRate}</p>
              )}
            </div></section>
            {/* Current Monthly Expenses */}
           
<section className="custom-grid-section">   <div className="retirement-field">
              <label htmlFor="preRetirementROI" className="retirement-label">
                ROI (Pre-Retirement, %)
              </label>
              <div
                className={` retirement-input-group
                        ${
                          errors.preRetirementROI
                            ? "retirement-input-error"
                            : "retirement-input-focus"
                        }`}
              >
                <input
                  type="number"
                  id="preRetirementROI"
                  className="retirement-input"
                  value={preRetirementROI}
                  onChange={handlePreRetirementROIChange}
                  min="0"
                  max="60"
                  step="0.1"
                />
                              <label className="retirement-label-years">
                  years
                </label>
              </div>
              {errors.preRetirementROI && (
                <p className="error-text">{errors.preRetirementROI}</p>
              )}
            </div>

            {/* Post-Retirement ROI */}
            <div className="retirement-field">
              <label htmlFor="postRetirementROI" className="retirement-label">
               ROI (Post-Retirement, %)
              </label>
              <div
                className={`retirement-input-group
                        ${
                          errors.postRetirementROI
                            ? "retirement-input-error"
                            : "retirement-input-focus"
                        }`}
              >
                <input
                  type="number"
                  id="postRetirementROI"
                  className="retirement-input"
                  value={postRetirementROI}
                  onChange={handlePostRetirementROIChange}
                  min="0"
                  max="60"
                  step="0.1"
                />
                               <label className="retirement-label-years">
                 %
                </label>
              </div>
              {errors.postRetirementROI && (
                <p className="error-text">{errors.postRetirementROI}</p>
              )}
            </div></section>
            {/* Pre-Retirement ROI */}
         
<section className="custom-grid-section">  <div className="retirement-field">
              <label htmlFor="existingSavings" className="retirement-label">
                Existing Retirement Savings (?)
              </label>
              <div
                className={`retirement-input-group 
                        ${
                          errors.existingSavings
                            ? "retirement-input-error"
                            : "retirement-input-focus"
                        }`}
              >
                  <FaRupeeSign className="retirement-icons" />
                <input
                  type="number"
                  id="existingSavings"
                  className="retirement-input"
                  value={existingSavings}
                  onChange={handleExistingSavingsChange}
                  min="0"
                />
              </div>
              {errors.existingSavings && (
                <p className="error-text">{errors.existingSavings}</p>
              )}
            </div>

            {/* Retirement Benefits */}
            <div className="retirement-field">
              <label htmlFor="retirementBenefits" className="retirement-label">
                 Retirement Benefits (?)
              </label>
              <div
                className={`retirement-input-group
                        ${
                          errors.retirementBenefits
                            ? "retirement-input-error"
                            : "retirement-input-focus"
                        }`}
              >
                 <FaRupeeSign className="retirement-icons" />
                <input
                  type="number"
                  id="retirementBenefits"
                  className="retirement-input"
                  value={retirementBenefits}
                  onChange={handleRetirementBenefitsChange}
                  min="0"
                />
              </div>
              {errors.retirementBenefits && (
                <p className="error-text">{errors.retirementBenefits}</p>
              )}
            </div></section>
            {/* Existing Savings */}
          
          </div>

          {/* Results Display */}
          <div className="retirement-results">
            <div className="retirement-results-inner">
              {/* {showResults && Object.keys(errors).length === 0 ? ( */}
              <div className="">
              
                <div className="retirement-result-row">
                  <span className="retirement-result-field">
                    Monthly Expenses at Retirement Age ({retirementAge} yrs):
                  </span>
                  <span className="retirement-result-row-span">
                    {formatIndianRupee(monthlyExpensesAtRetirement)}
                  </span>
                </div>
                <div className="retirement-result-row">
                  <span className="retirement-result-field ">
                    Total Corpus Required at Retirement:
                  </span>
                  <span className="retirement-result-row-span">
                    {formatIndianRupee(corpusRequired)}
                  </span>
                </div>
                <div className="retirement-result-row">
                  <span className="retirement-result-field">
                    Monthly SIP Required to Achieve Goal:
                  </span>
                  <span className="retirement-result-row-span">
                    {formatIndianRupee(monthlySIPRequired)}
                  </span>
                </div>
               

                {/* Detailed Retirement Insights */}
                <h3 className="retirement-breakdown-title ">
                  Detailed Retirement Insights
                </h3>
{/* <span className=" mt-20"> */}
                
                <div className="retirement-result-row">
                  <span className="retirement-result-field">
                    Annual Income Required :
                  </span>
                  <span className="retirement-result-row-span">
                    {formatIndianRupee(monthlyExpensesAtRetirement * 12)}
                  </span>
                </div>
                <div className="retirement-result-row">
                  <span className="retirement-result-field">
                    Additional Retirement Fund :
                  </span>
                  <span className="retirement-result-row-span">
                    {formatIndianRupee(
                      corpusRequired -
                        existingSavings *
                          Math.pow(
                            1 + preRetirementROI / 100,
                            retirementAge - currentAge
                          ) -
                        retirementBenefits
                    )}
                  </span>
                </div>
                {/* </span> */}
               
              </div>
              <div className="retirement-total-row">
                  <span className="">Monthly Savings :</span>
                  <span className="">
                    {formatIndianRupee(monthlySIPRequired)}
                  </span>
                </div>

                <p className="retirement-estimate-note">
                  *All values are estimates based on your inputs and assumed
                  rates. Consult a financial advisor for personalized planning.
                </p>
            </div>
          </div>
        </div>

        {/* add content
         */}

               <section className="retirement-info-section">
          <div className="retirement-info-content">
            {/* What is Retirement Planning? Section */}
            <section className="">
              <div className="retirement-section-grid">
                <div>
                  <h2 className="header-main ">
                    What is Retirement Planning?
                  </h2>
                  <p className="p-content">
                    <strong className="bold-content">Retirement planning</strong>
                    is the process of setting financial goals for your post-working
                    life and developing a strategy to achieve them. It involves
                    assessing your future expenses, estimating the funds required to
                    cover them, and setting aside adequate savings and investments
                    over your working years. Effective retirement planning aims to
                    ensure you maintain your desired lifestyle and financial
                    independence long after you stop earning an active income.
                  </p>
                </div>
                <div className="retirement-img-box retirement-img-hover">
                  <img
                    src={gratuitylogo}
                    alt="Retirement Savings and Security"
                    className="retirement-img"
                    style={{ width: "295px", }}
                  />
                </div>
              </div>
            </section>
        
            {/* Securing Your Future: Why a Retirement Calculator is Essential Section */}
            {/* <section className="">
              <h2 className="header-main ">
                Securing Your Future: Why a Retirement Calculator is Essential
              </h2>
              <p className="p-content ">
                <strong className="bold-content">Retirement planning</strong>
                is not just about saving money; it's about building a financial
                foundation that ensures your comfort, independence, and desired
                lifestyle long after your working years. The
                <strong className="bold-content"> UniCX Retirement Calculator</strong>
                is a powerful tool designed to help you visualize your financial
                future, estimate the corpus you'll need, and understand if your
                current savings trajectory is sufficient to achieve your
                retirement goals. It brings clarity to a crucial, often
                overwhelming, aspect of long-term financial planning.
              </p>
            </section> */}
        
            {/* Why Retirement Planning is Crucial Section */}
            <section className="">
              <div>
                <h2 className="header-main ">
                  The Indispensable Benefits of Early Retirement Planning
                </h2>
                <p className="p-content ">
                  <strong className="bold-content">Starting early</strong>
                  with your retirement planning, and regularly checking your
                  progress with a calculator, offers significant advantages:
                </p>
                <ul className="retirement-icon-list">
                  <li className="list-content">
                    <strong className="retirement-icon-title">
                      <Clock size={18} className="retirement-icon" />
                      Harnessing Compounding Power:
                    </strong>
                    <span className="retirement-icon-desc">
                      Time is your greatest ally. The longer your investments
                      grow, the more the <strong className="bold-content">power of compounding</strong>
                      multiplies your wealth, even with smaller, consistent
                      contributions.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="retirement-icon-title">
                      <BarChart size={18} className="retirement-icon" />
                      Beating Inflation:
                    </strong>
                    <span className="retirement-icon-desc">
                      Retirement is decades away. <strong className="bold-content">Inflation</strong>
                      will significantly erode the purchasing power of money.
                      Proper planning accounts for this, ensuring your future
                      savings can actually buy what you need.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="retirement-icon-title">
                      <Landmark size={18} className="retirement-icon" />
                      Financial Independence:
                    </strong>
                    <span className="retirement-icon-desc">
                      Avoid relying on family or external support. A
                      well-planned retirement means you maintain control over
                      your finances and lifestyle choices.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="retirement-icon-title">
                      <CheckCircle size={18} className="retirement-icon" />
                      Peace of Mind:
                    </strong>
                    <span className="retirement-icon-desc">
                      Knowing you're on track for a secure retirement reduces
                      financial stress and allows you to enjoy your present
                      more fully.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="retirement-icon-title">
                      <Target size={18} className="retirement-icon" />
                      Achieving Lifestyle Goals:
                    </strong>
                    <span className="retirement-icon-desc">
                      Whether it's travel, hobbies, or simply comfortable
                      living, a calculator helps you quantify the cost of your
                      desired retirement lifestyle and plan accordingly.
                    </span>
                  </li>
                </ul>
              </div>
            </section>
        
            {/* How to Use the UniCX Free Online Retirement Calculator Section */}
            <section className="">
              <h2 className="header-main ">
                How to Use the UniCX Free Online Retirement Calculator
              </h2>
              <div className="retirement-section-grid">
                <div>
                  <p className="p-content ">
                    Our <strong className="bold-content">intuitive UniCX Retirement Calculator</strong>
                    simplifies the process of estimating your retirement needs.
                    To get started, simply input the following details:
                  </p>
                  <ol className="retirement-howto-ol">
                    <li className="list-content">
                      <strong>Current Age:</strong> Your current age in years.
                    </li>
                    <li className="list-content">
                      <strong>Retirement Age:</strong> The age at which you plan
                      to retire.
                    </li>
                    <li className="list-content">
                      <strong>Current Monthly Expenses (?):</strong> Your
                      estimated current monthly expenditure.
                    </li>
                    <li className="list-content">
                      <strong>Inflation Rate (%):</strong> The expected annual
                      inflation rate.
                    </li>
                    <li className="list-content">
                      <strong>
                        Expected Rate of Return (Pre-Retirement, %):
                      </strong>
                      Expected return from investments before retirement.
                    </li>
                    <li className="list-content">
                      <strong>
                        Expected Rate of Return (Post-Retirement, %):
                      </strong>
                      Expected return from investments after retirement.
                    </li>
                    <li className="list-content">
                      <strong>Current Retirement Savings (if any, ?):</strong>
                      Your existing retirement corpus.
                    </li>
                    <li className="list-content">
                      <strong>Monthly Savings Towards Retirement (?):</strong>
                      The amount you currently save monthly for retirement.
                    </li>
                    <li className="list-content">
                      <strong>View Your Results:</strong> The calculator will
                      show your estimated monthly expenses in retirement, the
                      total corpus needed, and your retirement readiness.
                    </li>
                  </ol>
                </div>
                <div className="retirement-img-box retirement-img-hover">
                  <img
                    src={howuse}
                    alt="How to use UniCX Retirement Calculator - Step by step guide"
                    className="retirement-img retirement-img-lg"
                  />
                </div>
              </div>
            </section>
        
            {/* Key Factors Influencing Your Retirement Corpus */}
            <section className="">
              <h2 className="header-main ">
                Key Factors Influencing Your Retirement Corpus
              </h2>
              <p className="p-content ">
                Several variables play a critical role in determining how much
                you need for retirement and how quickly you can accumulate it:
              </p>
              <ul className="retirement-icon-list">
                <li className="list-content">
                  <strong className="retirement-icon-title">
                    <DollarSign size={18} className="retirement-icon" />
                    Inflation:
                  </strong>
                  <span className="retirement-icon-desc">
                    The <strong className="bold-content">silent wealth-eroder</strong>.
                    What costs ?100 today might cost ?300-400 in 30 years due
                    to inflation. Accounting for it ensures your retirement
                    funds have real purchasing power.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="retirement-icon-title">
                    <TrendingUp size={18} className="retirement-icon" />
                    Investment Returns:
                  </strong>
                  <span className="retirement-icon-desc">
                    The higher and more consistent your annual returns, the
                    faster your corpus grows. However, balance returns with risk
                    tolerance.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="retirement-icon-title">
                    <Clock size={18} className="retirement-icon" />
                    Retirement Age & Life Expectancy:
                  </strong>
                  <span className="retirement-icon-desc">
                    Retiring earlier means fewer earning years and more
                    retirement years to fund. Longer life expectancy means
                    needing a larger corpus.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="retirement-icon-title">
                    <Target size={18} className="retirement-icon" />
                    Post-Retirement Expenses:
                  </strong>
                  <span className="retirement-icon-desc">
                    Your desired lifestyle in retirement (travel, healthcare,
                    hobbies) directly dictates your annual expenses and,
                    consequently, the required corpus.
                  </span>
                </li>
                <li className="list-content">
                  <strong className="retirement-icon-title">
                    <Briefcase size={18} className="retirement-icon" />
                    Current Savings & Future Contributions:
                  </strong>
                  <span className="retirement-icon-desc">
                    The amount you've already saved and your consistent future
                    contributions are fundamental to reaching your goal.
                  </span>
                </li>
              </ul>
            </section>
        
            {/* Important Considerations for Robust Retirement Planning */}
            <section className="">
              <div className="retirement-considerations-box">
                <h2 className="retirement-considerations-heading">
                  <Target size={20} className="retirement-considerations-icon" />
                  Important Considerations for Robust Retirement Planning
                </h2>
                <p className="retirement-considerations-desc">
                  Beyond the numbers, a <strong className="bold-content">holistic approach</strong>
                  to retirement planning involves several key aspects:
                </p>
                <ul className="retirement-considerations-list">
                  <li>
                    <strong className="retirement-icon-title">
                      <CheckCircle size={18} className="retirement-icon" />
                      Start Early, Stay Consistent:
                    </strong>
                    <span className="retirement-icon-desc">
                      The <strong>most impactful advice</strong>.
                      Even small amounts saved consistently over a long period
                      can become substantial due to compounding.
                    </span>
                  </li>
                  <li>
                    <strong className="retirement-icon-title">
                      <CheckCircle size={18} className="retirement-icon" />
                      Diversify Investments:
                    </strong>
                    <span className="retirement-icon-desc">
                      Don't put all your eggs in one basket. A
                      <strong className="bold-content"> diversified portfolio</strong>
                      can mitigate risk and optimize returns.
                    </span>
                  </li>
                  <li>
                    <strong className="retirement-icon-title">
                      <CheckCircle size={18} className="retirement-icon" />
                      Account for Healthcare:
                    </strong>
                    <span className="retirement-icon-desc">
                      <strong className="bold-content">Healthcare costs</strong>
                      typically rise with age. Factor in potential medical
                      expenses, health insurance, and critical illness cover.
                    </span>
                  </li>
                  <li>
                    <strong className="retirement-icon-title">
                      <CheckCircle size={18} className="retirement-icon" />
                      Review Regularly:
                    </strong>
                    <span className="retirement-icon-desc">
                      Life circumstances, inflation, and market conditions
                      change. <strong className="bold-content">Review your retirement plan annually</strong>
                      and adjust your savings or investment strategy as needed.
                    </span>
                  </li>
                  <li>
                    <strong className="retirement-icon-title">
                      <CheckCircle size={18} className="retirement-icon" />
                      Consider Professional Advice:
                    </strong>
                    <span className="retirement-icon-desc">
                      A <strong className="bold-content">financial advisor</strong>
                      can provide personalized guidance, help you create a
                      tailored plan, and optimize your investment strategy.
                    </span>
                  </li>
                  <li>
                    <strong className="retirement-icon-title">
                      <CheckCircle size={18} className="retirement-icon" />
                      Factor in Contingencies:
                    </strong>
                    <span className="retirement-icon-desc">
                      Build an <strong className="bold-content">emergency fund</strong>
                      separate from your retirement savings to handle unforeseen
                      circumstances without derailing your long-term goals.
                    </span>
                  </li>
                </ul>
              </div>
            </section>
        
            {/* Who Can Benefit from the UniCX Retirement Calculator? */}
            <section className="">
              <h2 className="header-main ">
                Who Can Benefit from the UniCX Retirement Calculator?
              </h2>
              <div className="retirement-section-grid">
                <div>
                  <p className="p-content ">
                    Our <strong className="bold-content">Retirement Calculator</strong>
                    is a versatile and invaluable tool for:
                  </p>
                  <ul className="retirement-section-ul">
                    <li className="list-content">
                      <strong>Young Professionals:</strong>
                      To kickstart their retirement planning early and
                      understand the magic of compounding.
                    </li>
                    <li className="list-content">
                      <strong>Mid-Career Individuals:</strong>
                      To assess if they are on track and make necessary
                      adjustments to their savings strategy.
                    </li>
                    <li className="list-content">
                      <strong>Individuals Approaching Retirement:</strong>
                      To fine-tune their plans and ensure they have adequate
                      funds.
                    </li>
                    <li className="list-content">
                      <strong>Financial Advisors:</strong>
                      As a quick estimation tool for client consultations and
                      initial planning discussions.
                    </li>
                    <li className="list-content">
                      <strong>Anyone Concerned About Their Future:</strong>
                      To gain clarity and actionable insights into their
                      long-term financial security.
                    </li>
                  </ul>
                </div>
                <div className="retirement-img-box retirement-img-hover">
                  <img
                    src={benifite}
                    alt="Who can use Retirement Calculator - Diverse age groups"
                    className="retirement-img retirement-img-lg"
                  />
                </div>
              </div>
            </section>
        
            {/* Why Use UniCX Retirement Calculator? */}
            <section className="">
              <h2 className="header-main ">
                Why Choose UniCX for Your Retirement Planning Needs?
              </h2>
              <p className="p-content ">
                Leveraging our <strong className="bold-content">free online Retirement Calculator</strong>
                offers significant advantages for your financial planning:
              </p>
              <ul className="retirement-section-ul">
                <li className="list-content">
                  <strong>User-Friendly Interface:</strong>
                  Designed for simplicity, allowing anyone to estimate their
                  retirement needs with ease.
                </li>
                <li className="list-content">
                  <strong>Comprehensive Inputs:</strong>
                  Takes into account crucial factors like inflation and
                  pre/post-retirement returns for a more realistic projection.
                </li>
                <li className="list-content">
                  <strong>Instant & Accurate Results:</strong>
                  Get immediate insights into your retirement readiness.
                </li>
                <li className="list-content">
                  <strong>Empowering Decisions:</strong>
                  Helps you make informed choices about your savings and
                  investments.
                </li>
                <li className="list-content">
                  <strong>Free & Accessible:</strong>
                  A valuable resource available to you anytime, anywhere.
                </li>
              </ul>
            </section>
        
            {/* Simplified Retirement Calculation Concept & Example Scenario */}
            <section className="">
              <h2 className="header-main ">
                Simplified Retirement Calculation Concept & Example Scenario
              </h2>
              <p className="p-content ">
                While the calculator handles the detailed math, the
                <strong className="bold-content"> core idea</strong> is:
              </p>
              <h3 className="retirement-section-subheading">
                Core Calculation Principles:
              </h3>
              <ul className="retirement-section-ul-indent">
                <li className="list-content">
                  <strong>Future Value of Expenses:</strong> Project your
                  current monthly expenses into the future using an inflation
                  rate.
                </li>
                <li className="list-content">
                  <strong>Corpus Needed:</strong> Estimate the total corpus
                  required to cover your desired retirement lifestyle,
                  considering post-retirement returns.
                </li>
                <li className="list-content">
                  <strong>Future Value of Current & Future Savings:</strong>
                  Calculate how much your existing savings and regular
                  contributions will grow to by retirement.
                </li>
                <li className="list-content">
                  <strong>Gap Analysis:</strong> Compare your total estimated
                  future savings against the total corpus needed to identify any
                  shortfall or surplus.
                </li>
              </ul>
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
          <td className="table-cell">Current Age</td>
          <td className="table-cell">30 years</td>
        </tr>
        <tr >
          <td className="table-cell">Retirement Age</td>
          <td className="table-cell">60 years</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Current Monthly Expenses</td>
          <td className="table-cell">?30,000</td>
        </tr>
        <tr >
          <td className="table-cell">Inflation Rate</td>
          <td className="table-cell">6%</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Expected Pre-Retirement Return</td>
          <td className="table-cell">10%</td>
        </tr>
        <tr className="">
          <td className="table-cell">Expected Post-Retirement Return</td>
          <td className="table-cell">7%</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Estimated Total Corpus Needed at 60</td>
          <td className="table-cell">?3.5 Crores</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

              <p className="p-content ">
                <strong className="bold-content">
                  The Power of Compounding:
                </strong>
                This example illustrates how consistent contributions, coupled
                with annual salary increments and compounding interest, can lead
                to a significant retirement fund over time. The earlier you
                start, the more substantial your corpus can become.
              </p>
            </section>
        
            {/* FAQs Section */}
            <section className="">
              <h2 className="header-main ">
                Frequently Asked Questions (FAQs) about Retirement Planning
              </h2>
              <div className="retirement-faq-list">
                {retirementFaqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`retirement-faq-item${openFAQ === i ? " active" : ""}`}
                    onClick={() => toggleFAQ(i)}
                  >
                    <div className={`retirement-faq-question${openFAQ !== i ? " retirement-faq-question-inactive" : ""}`}>
                      <p className="">{faq.q}</p>
                      <ChevronDown size={18} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
                    </div>
                    <p className={`retirement-faq-answer${openFAQ === i ? "" : " inactive"}`}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
        
            {/* Footer note */}
            <section className="retirement-footer-note-box">
              <p className="retirement-footer-note">
                This Retirement Calculator and information is developed and
                maintained by <strong className="bold-content">
                  UniCX (UniconsultX Solutions Private Limited)
                </strong>
                to help users estimate their retirement needs and plan for a
                secure financial future. For personalized financial advice or
                complex retirement planning scenarios, always consult with a
                qualified financial professional.
              </p>
            </section>
          </div>
        </section>
      </div>
    </section>
    </>
  );
}

export default RetirementCalculator;




