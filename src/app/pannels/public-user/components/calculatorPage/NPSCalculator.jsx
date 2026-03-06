import React, { useEffect, useState } from "react";


import { ChevronDown } from "lucide-react";
import npslogo from "../assets/images/calculators_img/BG IMAGES/nps.png";
import benifite from "../assets/images/calculators_img/BG IMAGES/2 png .png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how2.png"
import Header from "../component/Header";
import "../calculatorCss/NPSCalculator.css"
import { FaRupeeSign } from "react-icons/fa";


function NPSCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState(10);

  const [totalInvestment, setTotalInvestment] = useState(0);
  const [interestEarned, setInterestEarned] = useState(0);
  const [totalCorpus, setTotalCorpus] = useState(0);
  const [lumpSumWithdrawal, setLumpSumWithdrawal] = useState(0);
  const [annuityAmount, setAnnuityAmount] = useState(0);
  const [monthlyPension, setMonthlyPension] = useState(0);
  const [error, setError] = useState({
    currentAge: "",
    monthlyContribution: "",
    expectedAnnualReturn: "",
  }); // Add error message state

  const fixedRetirementAge = 60;
  const fixedAnnuityPurchasePercentage = 40; // Minimum 40% as per NPS rules
  const fixedExpectedAnnuityReturn = 6;

  useEffect(() => {
    const handler = setTimeout(() => {
      if (validateInputs()) {
        calculateNPS();
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [currentAge, monthlyContribution, expectedAnnualReturn]);

  /**
   * Validates all input fields and sets an error message if any validation fails.
   * @returns {boolean} True if all inputs are valid, false otherwise.
   */

  const validateInputs = () => {
    let valid = true;
    const newErrors = {
      currentAge: "",
      monthlyContribution: "",
      expectedAnnualReturn: "",
    };

    if (currentAge < 18 || currentAge >= fixedRetirementAge) {
      newErrors.currentAge = "Age must be between 18 and 59";
      valid = false;
    }

    if (monthlyContribution <= 0 || monthlyContribution >= 1000000000) {
      newErrors.monthlyContribution = "Value must be between 1 and 10000000";
      valid = false;
    }

    if (expectedAnnualReturn <= 0 || expectedAnnualReturn > 20) {
      newErrors.expectedAnnualReturn =
        "Expected return must be between 0.1% and 20%";
      valid = false;
    }

    setError(newErrors);
    return valid;
  };
  const calculateNPS = () => {
    const age = parseFloat(currentAge);
    const contribution = parseFloat(monthlyContribution);
    const annualReturn = parseFloat(expectedAnnualReturn);

    const investmentDurationYears = fixedRetirementAge - age;
    const totalMonths = investmentDurationYears * 12;

    const calculatedTotalInvestment = contribution * totalMonths;

    const monthlyRate = annualReturn / 100 / 12;

    let calculatedCorpus = 0;
    if (monthlyRate === 0) {
      calculatedCorpus = calculatedTotalInvestment;
    } else {
      calculatedCorpus =
        contribution *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);
    }

    const calculatedInterestEarned =
      calculatedCorpus - calculatedTotalInvestment;

    const calculatedAnnuityAmount =
      calculatedCorpus * (fixedAnnuityPurchasePercentage / 100);
    const calculatedLumpSum = calculatedCorpus - calculatedAnnuityAmount;

    const calculatedMonthlyPension =
      (calculatedAnnuityAmount * (fixedExpectedAnnuityReturn / 100)) / 12;

    setTotalInvestment(parseFloat(calculatedTotalInvestment.toFixed(2)));
    setInterestEarned(parseFloat(calculatedInterestEarned.toFixed(2)));
    setTotalCorpus(parseFloat(calculatedCorpus.toFixed(2)));
    setLumpSumWithdrawal(parseFloat(calculatedLumpSum.toFixed(2)));
    setAnnuityAmount(parseFloat(calculatedAnnuityAmount.toFixed(2)));
    setMonthlyPension(parseFloat(calculatedMonthlyPension.toFixed(2)));
  };

  const handlemonthlyBasicDAChange = (e) => {
    const value = e.target.value;
    // Keeping your character limit validation
    if (value <= 1000000000) {
      setMonthlyContribution(value);
      setError((prev) => ({ ...prev, monthlyContribution: "" }));
    } else {
      setError((prev) => ({
        ...prev,
        monthlyContribution: "Value must be between 1 and 10000000",
      }));
    }
  };

  const handleCurrentAge = (e) => {
    const value = e.target.value;
    if (value <= 59) {
      setCurrentAge(value);
      setError((prev) => ({ ...prev, currentAge: "" }));
    } else {
      setError((prev) => ({
        ...prev,
        currentAge: "Value must be between 18 and 59",
      }));
    }
  };

  const handleAnnualSalaryPercent = (e) => {
    const value = e.target.value;
    if (value <= 20) {
      setExpectedAnnualReturn(value);
      setError((prev) => ({ ...prev, expectedAnnualReturn: "" }));
    } else {
      setError((prev) => ({
        ...prev,
        expectedAnnualReturn:
          "Expected annual increase must be between 0% and 20%",
      }));
    }
  };
  const [openFAQ, setOpenFAQ] = useState(null); // null means no FAQ is open initially

  // Function to toggle the FAQ visibility
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      q: "What is the minimum contribution for NPS?",
      a: "For a Tier-I account, the minimum contribution is currently ?500 for initial contribution and ?1000 annually.",
    },
    {
      q: "Can I change my asset allocation in NPS?",
      a: "Yes, you can change your asset allocation (Active Choice) or switch between Active and Auto Choice once a year.",
    },
    {
      q: "Is NPS better than EPF/PPF?",
      a: "NPS, EPF, and PPF serve different purposes and have distinct features. NPS is market-linked with potential for higher returns and offers unique tax benefits. EPF is mandatory for salaried employees with fixed contributions, while PPF is a fixed-income, long-term savings scheme. The 'best' depends on your financial goals, risk appetite, and employment status. It's often recommended to diversify across these instruments.",
    },
    {
      q: "What happens if I don't buy an annuity at retirement?",
      a: "As per NPS rules, a minimum of 40% of your corpus must be used to purchase an annuity if your total corpus exceeds ?5 lakh at retirement age (60). If the corpus is less than or equal to ?5 lakh, you can withdraw the entire amount.",
    },
  ];

  return (
    <><Header/>
    <section className="nps-section">
      <div className="nps-container ">
        <div className="">
          <section className="nps-header">
            <h1 className="nps-title">
              NPS Calculator
            </h1>
         
          </section>
          <div className="nps-grid ">
            {/* <div className="flex-grow grid grid-cols-1 2sm:grid-cols-2 2sm:px-2 px-4 2sm:space-x-3 py-4 overflow-y-auto"> */}

            <div className="">
              {/* Input: Current Age */}
              <div className="nps-field">
                <label
                  htmlFor="currentAge"
                  className="nps-label"
                >
                  Current Age (Years)
                </label>
                <div
                  className={`nps-input-group ${
                    error.currentAge
                      ? "nps-input-error"
                      : "nps-input-focus"
                  }`}
                >
                  <input
                    type="number"
                    id="currentAge"
                    className="nps-input"
                    value={currentAge}
                    onChange={handleCurrentAge}
                    min="18"
                    max={fixedRetirementAge - 1}
                    aria-label="Current Age"
                  />
                </div>
                {error.currentAge && (
                  <p className="error-text">{error.currentAge}</p>
                )}
              </div>
              {/* Input: Monthly Contribution */}
              <div className="nps-field">
                <label
                  htmlFor="monthlyContribution"
                  className="nps-label"
                >
                  Monthly Contribution (?)
                </label>
                <div
                  className={`nps-input-group  ${
                    error.monthlyContribution
                      ? "nps-input-error"
                      : "nps-input-focus"
                  }`}
                >
                  <FaRupeeSign className="nps-icon" />
                  <input
                    type="number"
                    id="monthlyContribution"
                    className="nps-input"
                    value={monthlyContribution}
                    onChange={handlemonthlyBasicDAChange}
                    min="1"
                    placeholder="e.g., 5000"
                    aria-label="Monthly Contribution"
                  />
                </div>
                {error.monthlyContribution && (
                  <p className="error-text">{error.monthlyContribution}</p>
                )}
              </div>

              {/* Input: Expected Annual Return */}
              <div className="nps-field">
                <label
                  htmlFor="expectedAnnualReturn"
                  className="nps-label"
                >
                  Expected Annual Return (%)
                </label>
                <div
                  className={`nps-input-group  ${
                    error.expectedAnnualReturn
                      ? "nps-input-error"
                      : "nps-input-focus"
                  }`}
                >
                  <input
                    type="number"
                    id="expectedAnnualReturn"
                    className="nps-input"
                    value={expectedAnnualReturn}
                    onChange={handleAnnualSalaryPercent}
                    step="0.1"
                    min="0.1"
                    max="20"
                    placeholder="e.g., 10"
                    aria-label="Expected Annual Return"
                  />
                </div>
                {error.expectedAnnualReturn && (
                  <p className="error-text">{error.expectedAnnualReturn}</p>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="nps-results ">
              <div className="nps-results-inner">
                <div className="space-y-4">
                  {/* Output: Total Investment */}
                  <div className="nps-result-row">
                    <span className="nps-result-field">Total Investment:</span>
                    <span className="nps-result-row-span">
                      ₹
                      {totalInvestment.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>

                  {/* Output: Interest Earned */}
                  <div className="nps-result-row">
                    <span className="nps-result-field">Interest Earned:</span>
                    <span className="nps-result-row-span">
                      ₹
                      {interestEarned.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>

                  {/* Output: Total Corpus at Maturity (Maturity Amount) */}
                  <div className="nps-result-row">
                    <span className="nps-result-field">Maturity Amount:</span>
                    <span className="nps-result-row-span">
                      ₹
                      {totalCorpus.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>

                  {/* Output: Lump Sum Withdrawal */}
                  <div className="nps-result-row">
                    <span className="nps-result-field">
                      Lump Sum Withdrawal (Tax-Free):
                    </span>
                    <span className="nps-result-row-span">
                      ₹
                      {lumpSumWithdrawal.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>

                  {/* Output: Annuity Purchase Amount */}
                  <div className="nps-result-row">
                    <span className="nps-result-field">
                      Annuity Purchase Amount:
                    </span>
                    <span className="nps-result-row-span">
                      ₹
                      {annuityAmount.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>

                  {/* Output: Estimated Monthly Pension */}
                </div>

                <div className="nps-total-row">
                  <span className="">Estimated Monthly Pension:</span>
                  <span className="">
                    ₹
                    {monthlyPension.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
                <div className="nps-info-section ">
            <div className="nps-info-content">
              {/* What is NPS */}
              <section className=" ">
                <div className="nps-section-grid">
                  <div>
                    <h2 className="main-heading ">
                      What is the National Pension System (NPS)?
                    </h2>
                    <p className="p-content">
                      The <strong className="bold-content">National Pension System (NPS)</strong> is a
                      voluntary, long-term investment product introduced by the
                      Government of India to provide retirement security for its
                      citizens. Regulated by the Pension Fund Regulatory and
                      Development Authority (PFRDA), NPS is a market-linked
                      product that aims to build a substantial retirement corpus
                      through systematic savings over your working life. It's
                      suitable for both salaried and self-employed individuals
                      looking for a disciplined approach to long-term wealth
                      creation.
                    </p>
                  </div>
                  <div className="nps-img-box">
                    <img
                      src={npslogo}
                      alt="Financial planning and savings illustration"
                      className="nps-img"
                    />
                  </div>
                </div>
              </section>
          
              {/* Key Benefits */}
              <section className="">
                <h2 className="main-heading ">
                  Key Benefits of Investing in NPS
                </h2>
                <p className="p-content mb-4">
                  NPS offers several compelling advantages, making it a robust
                  choice for your retirement planning:
                </p>
                <div className="nps-benefit-list">
                  <div className="nps-benefit-card">
                    <h3 className="nps-benefit-title">
                      Significant Tax Benefits
                    </h3>
                    <ul className="nps-benefit-ul">
                      <li className="list-content">
                        Contributions are eligible for deduction under{" "}
                        <strong>Section 80C</strong> (up to ?1.5 lakh) and an
                        additional deduction under{" "}
                        <strong>Section 80CCD(1B)</strong> (up to ?50,000) for
                        Tier-I accounts.
                      </li>
                      <li className="list-content">
                        Employer's contribution (up to 10% of basic salary + DA)
                        is tax-deductible under{" "}
                        <strong>Section 80CCD(2)</strong> (for salaried
                        employees).
                      </li>
                      <li className="list-content">
                        The maturity amount and lump-sum withdrawal are largely
                        tax-exempt, offering a triple tax benefit (EEE - Exempt,
                        Exempt, Exempt) status under certain conditions.
                      </li>
                    </ul>
                  </div>
                  <div className="nps-benefit-card">
                    <h3 className="nps-benefit-title">
                      Long-Term Wealth Creation
                    </h3>
                    <p className="list-content">
                      As a market-linked product, NPS offers the potential for
                      higher returns compared to traditional fixed-income
                      instruments, leveraging the power of compounding over
                      several decades.
                    </p>
                  </div>
                  <div className="nps-benefit-card">
                    <h3 className="nps-benefit-title">
                      Flexibility & Choice
                    </h3>
                    <p className="list-content">
                      You can choose your asset allocation (equity, corporate
                      debt, government securities) and select between "Active
                      Choice" (you decide allocation) or "Auto Choice"
                      (age-based dynamic allocation).
                    </p>
                  </div>
                  <div className="nps-benefit-card">
                    <h3 className="nps-benefit-title">Portability</h3>
                    <p className="list-content">
                      NPS is entirely portable across jobs and locations,
                      meaning your account remains the same regardless of your
                      employment changes.
                    </p>
                  </div>
                  <div className="nps-benefit-card">
                    <h3 className="nps-benefit-title">Low Cost</h3>
                    <p className="list-content">
                      NPS is known for its low fund management charges, which
                      ensures a larger portion of your contributions goes
                      towards investment growth.
                    </p>
                  </div>
                </div>
              </section>
          
              {/* How to Use */}
              <section className="">
                <h2 className="main-heading mb-3">
                  How to Use the UniCX Free Online NPS Calculator
                </h2>
                <div className="nps-section-grid">
                  <div>
                    <p className="p-content mb-4">
                      Our <strong className="bold-content">UniCX NPS Calculator</strong> makes projecting
                      your retirement savings simple. Just follow these steps:
                    </p>
                    <ol className="nps-howto-ol">
                      <li className="list-content">
                        <strong>Current Age (Years):</strong> Enter your current
                        age. This helps determine your remaining investment
                        period.
                      </li>
                      <li className="list-content">
                        <strong>Monthly Contribution (?):</strong> Input the
                        amount you plan to contribute to NPS each month.
                      </li>
                      <li className="list-content">
                        <strong>Expected Annual Return (%):</strong> Provide
                        your estimated annual return percentage. NPS investments
                        are market-linked, so this is an estimate. (Typical
                        range might be 8-12% but is subject to market
                        conditions).
                      </li>
                      <li className="list-content">
                        <strong>Retirement Age:</strong> The calculator uses the
                        standard retirement age of 60 years.
                      </li>
                      <li className="list-content">
                        <strong>% of Corpus for Annuity:</strong> The calculator
                        assumes 40% of your maturity amount will be used to
                        purchase an annuity, as per NPS rules.
                      </li>
                      <li className="list-content">
                        <strong>Expected Annuity Return:</strong> Enter the
                        expected interest rate you anticipate from your annuity
                        plan.
                      </li>
                      <li className="list-content">
                        <strong>View Your Results:</strong> The calculator will
                        instantly display your projected total investment,
                        interest earned, maturity amount, tax-free lump sum,
                        annuity purchase amount, and estimated monthly pension.
                      </li>
                    </ol>
                  </div>
                  <div className="nps-img-box nps-img-hover">
                    <img
                      src={howuse}
                      alt="How to use NPS Calculator"
                      className="nps-img nps-img-lg"
                    />
                  </div>
                </div>
              </section>
          
              {/* Understanding Results */}
              <section className="">
                <h2 className="main-heading mb-3">
                  Understanding Your NPS Calculator Results
                </h2>
                <p className="p-content mb-4">
                  Once you input your details, our calculator provides a
                  comprehensive breakdown of your potential NPS returns:
                </p>
                <ul className="nps-section-ul nps-section-ul-indent">
                  <li className="list-content">
                    <strong>Total Investment:</strong> This is the cumulative
                    sum of all your monthly contributions until retirement.
                  </li>
                  <li className="list-content">
                    <strong>Interest Earned:</strong> This shows the total
                    interest or capital appreciation your investment is
                    estimated to generate over the years, thanks to compounding.
                  </li>
                  <li className="list-content">
                    <strong>Maturity Amount:</strong> This is your total
                    accumulated corpus at retirement (Current EPF Balance +
                    Total Contributions + Total Interest Earned).
                  </li>
                  <li className="list-content">
                    <strong>Lump Sum Withdrawal (Tax-Free):</strong> As per
                    current NPS rules, up to 60% of your maturity corpus can be
                    withdrawn as a tax-free lump sum at retirement.
                  </li>
                  <li className="list-content">
                    <strong>Annuity Purchase Amount:</strong> The remaining 40%
                    (or more, if you choose) of your corpus must be used to
                    purchase an annuity. This amount is used by the annuity
                    provider to give you a regular pension.
                  </li>
                  <li className="list-content">
                    <strong>Estimated Monthly Pension:</strong> This is the
                    projected monthly income you would receive from the annuity
                    purchased with the mandatory portion of your corpus.
                  </li>
                </ul>
    <div className="table-container">
  <div className="table-wrapper">
   
    <table className="pricing-table">
      <thead className="table-head">
        <tr>
          <th className="table-heading">NPS Calculation Example</th>
          <th className="table-heading">Details</th>
        </tr>
      </thead>
      <tbody className="table-body">
        <tr>
          <td className="table-cell">Current Age</td>
          <td className="table-cell">30 years</td>
        </tr>
        <tr className="row-alt">
          <td className="table-cell">Monthly Contribution</td>
          <td className="table-cell">?5,000</td>
        </tr>
        <tr>
          <td className="table-cell">Expected Annual Return</td>
          <td className="table-cell">10%</td>
        </tr>
        <tr className="row-alt">
          <td className="table-cell">Estimated Maturity at 60</td>
          <td className="table-cell">?1,13,96,627 (approx.)</td>
        </tr>
        <tr>
          <td className="table-cell">Estimated Monthly Pension</td>
          <td className="table-cell">?22,793 (approx.)</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
              </section>
          
              {/* Important NPS Rules & Considerations */}
              <section className="">
                <h2 className="main-heading mb-3">
                  Important NPS Rules & Considerations
                </h2>
                <ul className="nps-section-ul">
                  <li className="list-content">
                    <strong>Eligibility:</strong> Any Indian citizen, resident
                    or non-resident, between 18 and 70 years of age can open an
                    NPS account.
                  </li>
                  <li className="list-content">
                    <strong>Minimum Contributions:</strong> There are minimum
                    annual contribution requirements (currently ?1,000 for Tier
                    I).
                  </li>
                  <li className="list-content">
                    <strong>Tier I vs. Tier II Accounts:</strong>
                    <ul className="nps-section-ul nps-section-ul-indent">
                      <li className="list-content">
                        <strong>Tier I:</strong> This is your primary retirement
                        account, with tax benefits and withdrawal restrictions.
                      </li>
                      <li className="list-content">
                        <strong>Tier II:</strong> A voluntary savings account,
                        offering greater flexibility for withdrawals but without
                        direct tax benefits on contributions.
                      </li>
                    </ul>
                  </li>
                  <li className="list-content">
                    <strong>Partial Withdrawals:</strong> Limited partial
                    withdrawals (up to 25% of your own contributions) are
                    allowed from Tier I accounts for specific purposes (e.g.,
                    higher education, marriage, house purchase, critical
                    illness) after 3 years of opening the account, with a
                    maximum of three withdrawals over the entire tenure.
                  </li>
                  <li className="list-content">
                    <strong>Mandatory Annuity:</strong> At least 40% of your
                    accumulated corpus must be utilized to purchase an annuity
                    plan from an Annuity Service Provider (ASP) upon attaining
                    60 years of age.
                  </li>
                  <li className="list-content">
                    <strong>Taxation of Annuity:</strong> The monthly pension
                    received from the annuity is taxable as per your income tax
                    slab in the year of receipt.
                  </li>
                </ul>
              </section>
          
              {/* Who Can Benefit */}
              <section className=" ">
                <h2 className="main-heading mb-3">
                  Who Can Benefit from the UniCX NPS Calculator?
                </h2>
                <div className="nps-section-grid">
                  <div>
                    <p className="p-content mb-4">
                      Our <strong className="bold-content">NPS calculator</strong> is a versatile tool
                      designed to assist a wide range of users in accurately
                      managing their NPS-related projections:
                    </p>
                    <ul className="nps-section-ul">
                      <li className="list-content">
                        <strong>Individuals planning for retirement:</strong> To
                        estimate their retirement corpus and pension.
                      </li>
                      <li className="list-content">
                        <strong>Salaried employees:</strong> To understand how NPS
                        can complement their EPF/PF savings.
                      </li>
                      <li className="list-content">
                        <strong>Self-employed professionals:</strong> To build a
                        disciplined retirement fund with tax advantages.
                      </li>
                      <li className="list-content">
                        <strong>Financial advisors:</strong> As a quick tool to
                        demonstrate NPS benefits to clients.
                      </li>
                      <li className="list-content">
                        <strong>
                          Anyone interested in long-term wealth creation:
                        </strong>{" "}
                        To visualize the power of compounding with NPS.
                      </li>
                    </ul>
                  </div>
                  <div className="nps-img-box nps-img-hover">
                    <img
                      src={benifite}
                      alt="Who can use this calculator - target audience icon"
                      className="nps-img nps-benefit-img"
                    />
                  </div>
                </div>
              </section>
          
              {/* Advantages of NPS Calculator */}
              <section className="">
                <h2 className="main-heading mb-3">
                  Advantages of Using the UniCX NPS Calculator
                </h2>
                <p className="p-content mb-3">
                  Leveraging our <strong className="bold-content">free online NPS calculator</strong>
                  offers significant benefits for individuals planning their
                  retirement:
                </p>
                <ul className="nps-section-ul">
                  <li className="list-content">
                    <strong>Clarity on Retirement Corpus:</strong> Get a clear
                    projection of your accumulated wealth at retirement.
                  </li>
                  <li className="list-content">
                    <strong>Estimate Monthly Pension:</strong> Understand the
                    potential regular income you could receive post-retirement.
                  </li>
                  <li className="list-content">
                    <strong>Visualize Growth:</strong> See how compounding works
                    over decades to build a substantial fund.
                  </li>
                  <li className="list-content">
                    <strong>Aids Financial Planning:</strong> Helps in setting
                    realistic retirement goals and adjusting contributions
                    accordingly.
                  </li>
                  <li className="list-content">
                    <strong>Understand Annuity Impact:</strong> Provides insight
                    into how the mandatory annuity purchase affects your lump
                    sum and pension.
                  </li>
                  <li className="list-content">
                    <strong>User-Friendly Interface:</strong> Designed for ease
                    of use, making complex retirement projections simple and
                    accessible.
                  </li>
                </ul>
              </section>
          
              {/* Tip Box */}
              <section className=" ">
                <div className="nps-tip-box">
                  <p className="nps-tip-text">
                    <strong>UniCX Tip:</strong> Start investing in NPS early to
                    maximize the benefits of compounding. Even small monthly
                    contributions over a long period can lead to a substantial
                    retirement corpus. Explore both Active and Auto Choice
                    options based on your risk appetite!
                  </p>
                </div>
              </section>
          
              {/* Expert Support & Resources */}
              <section id="contact" className=" ">
                <h2 className="main-heading mb-3">
                  Beyond Calculations: UniCX - Your Partner in Retirement
                  Planning & Financial Growth
                </h2>
                <p className="p-content mb-4">
                  At{" "}
                  <strong>UniconsultX Solutions Private Limited (UniCX)</strong>
                  , our commitment extends beyond providing a powerful NPS
                  calculator. We understand that{" "}
                  <strong className="bold-content">retirement planning is a long-term journey</strong>,
                  and navigating its complexities requires comprehensive
                  support. That's why we offer{" "}
                  <strong>comprehensive support and resources</strong> to ensure
                  your financial future is secure.
                </p>
                <h3 className="nps-support-title">
                  Our Expert Financial Services Include:
                </h3>
                <ul className="nps-section-ul">
                  <li className="list-content">
                    <strong>Retirement Planning Guidance:</strong> Personalized
                    strategies to help you achieve your retirement goals.
                  </li>
                  <li className="list-content">
                    <strong>Investment Advisory:</strong> Expert advice on
                    various investment avenues, including NPS, mutual funds,
                    etc.
                  </li>
                  <li className="list-content">
                    <strong>Tax Planning:</strong> Strategies to optimize your
                    tax savings through instruments like NPS, ELSS, etc.
                  </li>
                  <li className="list-content">
                    <strong>Annuity Selection Assistance:</strong> Guidance on
                    choosing the right annuity plan for your post-retirement
                    needs.
                  </li>
                  <li className="list-content">
                    <strong>Wealth Management:</strong> Holistic financial
                    planning to grow and protect your wealth.
                  </li>
                  <li className="list-content">
                    <strong>Educational Resources:</strong> Access to
                    informative articles, FAQs, and timely updates on retirement
                    planning and investment strategies.
                  </li>
                </ul>
                <p className="nps-support-note">
                  <strong>Secure Your Future with UniCX:</strong> We are
                  dedicated to being your reliable source for all things
                  retirement planning. Explore our website for more in-depth
                  articles, common FAQs, and the latest updates. Partner with
                  UniCX for peace of mind in your financial journey.
                </p>
                <div className="nps-support-btn-box">
                  <button className="nps-support-btn">
                    Get Expert Retirement Consultation
                  </button>
                </div>
              </section>
          
              {/* FAQs */}
              <section className=" ">
                <h2 className="main-heading ">
                  Frequently Asked Questions (FAQs) about NPS
                </h2>
                <div className="nps-faq-list">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className={`nps-faq-item${openFAQ === i ? " active" : ""}`}
                      onClick={() => toggleFAQ(i)}
                    >
                      <div className={`nps-faq-question${openFAQ !== i ? " nps-faq-question-inactive" : ""}`}>
                        <p className="">{faq.q}</p>
                        <ChevronDown size={18} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
                      </div>
                      <p className={`nps-faq-answer${openFAQ === i ? "" : " inactive"}`}>
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
          
              {/* Footer note */}
              <section className="nps-footer-note-box">
                <p className="nps-footer-note">
                  This NPS calculator and information is developed and
                  maintained by{" "}
                  <strong>UniCX (UniconsultX Solutions Private Limited)</strong>{" "}
                  to help users simplify National Pension System projections as
                  per current Indian regulations. For complex financial
                  situations or personalized advice, always consult with a
                  qualified financial professional or{" "}
                  <a href="#contact" className="bold-content nps-footer-link">
                    contact UniCX directly
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default NPSCalculator;




