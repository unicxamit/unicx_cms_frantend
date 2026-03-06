import React, { useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
// import "../css/Hra.css";
import {
  ChevronDown,
  AlertCircle,
  FileText,
  CheckCircle,
  MapPin,
  Users,
} from "lucide-react"; 
import Header from "../component/Header";
import hralogo from "../assets/images/calculators_img/BG IMAGES/hra1.png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how3.png";

import "../calculatorCss/HRACalculator.css";

const HRACalculator = () => {
  const [basic, setBasic] = useState("600000");
  const [da, setDa] = useState("998");
  const [hra, setHra] = useState("240000");
  const [rent, setRent] = useState("180000");
  const [isMetro, setIsMetro] = useState(false);

  const [error, setError] = useState("");
  const [errorDa, setErrorDa] = useState("");
  const [errorHra, setErrorHra] = useState("");
  const [errorRent, setErrorRent] = useState("");

  const basicNum = parseFloat(basic) || 0;
  const daNum = parseFloat(da) || 0;
  const hraNum = parseFloat(hra) || 0;
  const rentNum = parseFloat(rent) || 0;

  const salary = basicNum + daNum;

  const actualHRAReceived = hraNum;
  const percentOfSalary = isMetro ? 0.5 : 0.4;
  const percentOfBasic = percentOfSalary * basicNum;
  const rentExcess = rentNum - 0.1 * salary;
  const rentPaidExcess = rentExcess > 0 ? rentExcess : 0;

  const hraExempt = Math.min(actualHRAReceived, percentOfBasic, rentPaidExcess);
  const hraTaxable = actualHRAReceived - hraExempt;

  const validateValue = (value) => {
    if (!/^\d+$/.test(value)) {
      return "Only numbers are allowed";
    }
    const numeric = parseInt(value, 10);
    if ( numeric > 100000000) {
      return "Value must be between 1000 and 100000000";
    }
    return "";
  };

  const handleCostChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setBasic("");
      setError("");
      return;
    }
    const errorMsg = validateValue(value);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setBasic(value);
      setError("");
    }
  };

  const handleDaChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setDa("");
      setErrorDa("");
      return;
    }
    const errorMsg = validateValue(value);
    if (errorMsg) {
      setErrorDa(errorMsg);
    } else {
      setDa(value);
      setErrorDa("");
    }
  };

  const handleHraChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setHra("");
      setErrorHra("");
      return;
    }
    const errorMsg = validateValue(value);
    if (errorMsg) {
      setErrorHra(errorMsg);
    } else {
      setHra(value);
      setErrorHra("");
    }
  };

  const handleRentChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setRent("");
      setErrorRent("");
      return;
    }
    const errorMsg = validateValue(value);
    if (errorMsg) {
      setErrorRent(errorMsg);
    } else {
      setRent(value);
      setErrorRent("");
    }
  };
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      q: "Can I claim HRA if I live with my parents?",
      a: "Yes, you can, provided you genuinely pay rent to your parents, and they declare this as rental income in their tax returns. Ensure you have proper rent receipts to avoid issues.",
    },
    {
      q: "Do I need my landlord's PAN for HRA exemption?",
      a: "Yes, if your annual rent payment exceeds ?1,00,000 (Rupees One Lakh), you must provide your landlord's PAN to your employer. If the landlord does not have a PAN, a declaration to that effect is required.",
    },
    {
      q: "What if I move to a new city during the financial year?",
      a: "Your HRA exemption will be calculated proportionately for the period you paid rent in each type of city (metro/non-metro) and for the actual HRA received during those periods. The calculation considers the rent paid in each city.",
    },
    {
      q: "Can both husband and wife claim HRA exemption for the same rented property?",
      a: "Only one person can claim the HRA exemption for the same property to avoid double deductions. If both are paying rent, they can claim HRA proportionally to their rent payment if it's genuinely split and documented, or one person can claim the full eligible amount.",
    },
    {
      q: "What is Basic Salary + DA for HRA calculation?",
      a: "For HRA calculation, 'salary' typically includes your Basic Salary and Dearness Allowance (DA), but only if DA forms part of your retirement benefits. Other allowances or perquisites are generally excluded from this calculation.",
    },
  ];
  return (
    <><Header/>
    <section className="hra-section">
      <div className="hra-container">
      <div className=""> 

      
        <div className="hra-header">
          <h1 className="hra-title">HRA Calculator</h1>
          
        </div>
        <div className="hra-grid ">
          <div className="  ">
            <div className="hra-field">
              <label className="hra-label">Basic salary received (?)</label>

              <div
                className={`hra-input-group
        ${
          error
            ? "hra-input-error"
            : "hra-input-focus"
        }
      `}
              >
                <FaRupeeSign className="hra-icon" />
                <input
                  type="number"
                  inputMode="numeric"
                  value={basic}
                  onChange={handleCostChange}
                  className="hra-input"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              {error && <p className="error-text">{error}</p>}
            </div>
            <div className="hra-field">
              <label className="hra-label">
                Dearness Allowance received (?)
              </label>

              <div
                className={`hra-input-group
        ${
          errorDa
            ? "hra-input-error"
            : "hra-input-focus"
        }
      `}
              >
                 <FaRupeeSign className="hra-icon" />
                <input
                  type="number"
                  inputMode="numeric"
                  value={da}
                  onChange={handleDaChange}
                  className="hra-input"
                  placeholder="0.00"
                  min="0"
                />
              </div>
               {errorDa && (
                <p className="error-text">{errorDa}</p>
              )}
            </div>

            <div className="hra-field">
              <label className="hra-label">
                HRA received (?)
              </label>

              <div
                className={`hra-input-group
        ${
          errorHra
            ? "hra-input-error"
            : "hra-input-focus"
        }
      `}
              >
             <FaRupeeSign className="hra-icon" />
                <input
                  type="number"
                  inputMode="numeric"
                  value={hra}
                  onChange={handleHraChange}
                  className="hra-input"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              {errorHra && (
                <p className="error-text">{errorHra}</p>
              )}
            </div>

            <div className="hra-field">
              <label className="hra-label">
                Total Rent paid (?)
              </label>

              <div
                className={`hra-input-group
        ${errorRent
           ? "hra-input-error"
           : "hra-input-focus"
       }
      `}
              >
                <FaRupeeSign className="gst-icon" />
                <input
                  type="number"
                  inputMode="numeric"
                  value={rent}
                  onChange={handleRentChange}
                  className="hra-input"
                  placeholder="0.00"
                  min="0"
                />
              </div>
              {errorRent && (
                <p className="error-text">{errorRent}</p>
              )}
            </div>

                       <p className="hra-radio-label">
              Do you live in Delhi, Mumbai, Kolkata or Chennai?
            </p>
            <div className="hra-radio-group">
              <div className="hra-radio-option">
                <input
                  type="radio"
                  id="yes"
                  name="metro"
                  checked={isMetro}
                  onChange={() => setIsMetro(true)}
                />
                <label htmlFor="yes" className="hra-radio-text">
                  Yes
                </label>
              </div>
              <div className="hra-radio-option">
                <input
                  type="radio"
                  id="no"
                  name="metro"
                  checked={!isMetro}
                  onChange={() => setIsMetro(false)}
                />
                <label htmlFor="no" className="hra-radio-text">
                  No
                </label>
              </div>
            </div>
          </div>

          <div className="hra-results">
            {" "}
            {/* flex-col to stack its children vertically */}
            <div className="hra-results-inner">
           
   <div className="hra-result-row">
        <span className="hra-result-field ">Actual HRA received</span>
        <span className="hra-result-row-span">?{actualHRAReceived}</span>
      </div>
              {/* <div className="flex flex-col py-2 space-y-4"> */}
                <div className="hra-result-row">
                  <p className="hra-result-field ">
                    {isMetro ? "50%" : "40%"} of basic salary
                  </p>
                  <span className="hra-result-row-span">
                    ₹{percentOfBasic.toFixed(2)}
                  </span>
                </div>
                <div className="hra-result-row">
                  <p className="hra-result-field ">
                    Rent Paid in excess of 10% of salary
                  </p>
                  <span className="hra-result-row-span">
                    ₹{rentPaidExcess.toFixed(2)}
                  </span>
                </div>

                {/* <hr className="my-4 pb-4 border-gray-500" /> */}

                {/* <span className=" text-gray-800 block   text-md font-normal ">
                  The least of the above three is exempt from HRA
                </span> */}

                <div className="hra-result-row">
                  <p className="hra-result-field ">Amount of exempted HRA</p>
                  <span className="hra-result-row-span">₹{hraExempt.toFixed(2)}</span>
                </div>

                 
              
              

            </div>
            
                <div className="hra-total-row">
          <h2 className="">Total Amount</h2>
          <p className="">₹{hraTaxable.toFixed(2)}</p>
        </div>
          </div>
        </div>
     

           <div className="hra-info-section">
        <div className="hra-info-content">
          {/* Intro - Expanded with Updates/Rules style */}
          <section className="hra-intro-box ">
            <h2 className="hra-intro-heading">
              <AlertCircle size={18} className="hra-intro-icon" />
              HRA Tax Exemption: Important Updates & Rules You Need to Know!
            </h2>
            <p className="hra-intro-text">
              Understanding the <strong>House Rent Allowance (HRA)</strong>
              rules is crucial for salaried individuals looking to minimize
              their income tax liability. Stay informed about these key
              regulations to accurately claim your HRA exemption and ensure
              compliance.
            </p>
            <ul className="hra-intro-list">
              <li>
                <strong className="hra-intro-list-title">
                  <FileText size={18} className="hra-intro-list-icon" />
                  Mandatory Landlord PAN for High Rent:
                </strong>
                <span className="hra-intro-list-desc">
                  If your annual rent payment exceeds <strong>?1,00,000 (Rupees One Lakh)</strong>, it is mandatory
                  to furnish your landlord's PAN details to your employer.
                  Ensure you obtain this to claim your full HRA benefit.
                </span>
              </li>
              <li>
                <strong className="hra-intro-list-title">
                  <CheckCircle size={18} className="hra-intro-list-icon" />
                  Retain Rent Receipts as Proof:
                </strong>
                <span className="hra-intro-list-desc">
                  Always collect and retain <strong>proper rent receipts</strong> for the rent paid. These
                  documents are essential evidence for your HRA claim and may be
                  required during tax assessments.
                </span>
              </li>
              <li>
                <strong className="hra-intro-list-title">
                  <MapPin size={18} className="hra-intro-list-icon" />
                  Metro vs. Non-Metro City Definition:
                </strong>
                <span className="hra-intro-list-desc">
                  The percentage of HRA exemption depends on your city of
                  residence. <strong>Metro cities</strong> are defined as Delhi,
                  Mumbai, Kolkata, and Chennai (50% exemption), while all other
                  cities fall under the <strong>non-metro</strong> category (40%
                  exemption). Confirm your city status for accurate calculation.
                </span>
              </li>
              <li>
                <strong className="hra-intro-list-title">
                  <Users size={18} className="hra-intro-list-icon" />
                  Claiming HRA for Rent Paid to Parents:
                </strong>
                <span className="hra-intro-list-desc">
                  You can claim HRA exemption even if you pay rent to your
                  parents, provided the transaction is genuine. Your parents
                  must declare this rent as income in their tax returns. Ensure
                  all documentation is clear and verifiable.
                </span>
              </li>
            </ul>
            <p className="hra-intro-note">
              Our UniCX HRA Calculator is here to help you navigate these rules
              and accurately calculate your tax exemption.
            </p>
          </section>
      
          {/* What is House Rent Allowance (HRA)? */}
          <section className="">
            <h2 className="header-main">
              What is House Rent Allowance (HRA)?
            </h2>
            <div className="hra-section-grid">
              
              <div>
                 {/* <h2 className="main-heading ">
              What is House Rent Allowance (HRA)?
            </h2> */}
                <p className="p-content ">
                  <strong className="bold-content">House Rent Allowance (HRA)</strong> is a special allowance
                  provided by employers to their employees to help cover the cost of
                  rented accommodation. It is a part of a salaried individual's
                  compensation package and is specifically designed to provide tax
                  relief on the housing expenses incurred by the employee.
                </p>
                <p className="p-content">
                  While HRA is a part of your salary, it is not fully taxable; a
                  certain portion of it can be claimed as an exemption under{" "}
                  <strong className="bold-content">Section 10(13A)</strong> of the Income Tax Act, 1961,
                  provided certain conditions are met. This makes HRA a crucial
                  component for effective tax planning for those living in rented
                  homes.
                </p>
              </div>
              <div className="hra-img-box">
                <img
                  src={hralogo}
                  alt="Financial planning and savings illustration"
                  className="hra-img"
                />
              </div>
            </div>
          </section>
      
          {/* Key Benefits & Tax Exemption Rules of HRA */}
          <section className="">
            <h2 className="header-main mb-3">
              Key Benefits & Tax Exemption Rules of HRA
            </h2>
            <p className="p-content mb-5">
              The primary benefit of HRA is its potential for tax exemption,
              which directly reduces your taxable income. The amount of HRA that
              is exempt from tax is the{" "}
              <strong className="bold-content">least of the following three amounts</strong>:
            </p>
            <div className="hra-benefit-list">
              <div className="hra-benefit-card">
                <h3 className="hra-benefit-title">Actual HRA Received:</h3>
                <p className="list-content">
                  The full House Rent Allowance amount that your employer pays
                  to you.
                </p>
              </div>
              <div className="hra-benefit-card">
                <h3 className="hra-benefit-title">Rent Paid Minus 10% of Basic Salary + DA:</h3>
                <p className="list-content">
                  The actual rent you pay for your accommodation, reduced by 10%
                  of your Basic Salary plus Dearness Allowance (if it forms part
                  of your retirement benefits).
                </p>
              </div>
              <div className="hra-benefit-card">
                <h3 className="hra-benefit-title">Percentage of Basic Salary + DA Based on City:</h3>
                <ul className="hra-benefit-ul">
                  <li className="list-content">
                    <strong>50% of Basic Salary + DA</strong> if you live in a{" "}
                    <strong>metro city</strong> (Delhi, Mumbai, Kolkata,
                    Chennai).
                  </li>
                  <li className="list-content">
                    <strong>40% of Basic Salary + DA</strong> if you live in any{" "}
                    <strong>non-metro city</strong>.
                  </li>
                </ul>
              </div>
            </div>
            <p className="hra-benefit-note">
              <strong>Note:</strong> For HRA calculation purposes, 'salary'
              typically includes Basic Salary and Dearness Allowance (DA), only
              if DA is part of your retirement benefits. It generally excludes
              other allowances and perquisites.
            </p>
            <p className="hra-benefit-eligibility">
              <strong className="bold-content">Eligibility for HRA Exemption:</strong> You must be a
              salaried individual, actively paying rent for accommodation, and
              not own a house in the city for which the HRA is claimed.
            </p>
          </section>
      
          {/* How to Use the UniCX Free Online HRA Calculator */}
          <section className="">
            <h2 className="header-main mb-3">
              How to Use the UniCX Free Online HRA Calculator
            </h2>
            <div className="hra-section-grid">
              <div>
                <p className="p-content mb-4">
                  Our UniCX HRA Calculator makes determining your tax-exempt HRA
                  simple and quick. Just follow these steps:
                </p>
                <ol className="hra-howto-ol">
                  <li className="list-content">
                    <strong>Basic Salary (Monthly ?):</strong> Input your monthly
                    basic salary as per your payslip.
                  </li>
                  <li className="list-content">
                    <strong>Dearness Allowance (DA) (Monthly ?):</strong> Enter your
                    monthly Dearness Allowance if it is considered for retirement
                    benefits. If not applicable, you can enter '0'.
                  </li>
                  <li className="list-content">
                    <strong>HRA Received (Monthly ?):</strong> Provide the actual
                    monthly House Rent Allowance you receive from your employer.
                  </li>
                  <li className="list-content">
                    <strong>Actual Rent Paid (Monthly ?):</strong> Fill in the
                    actual monthly rent you pay for your accommodation.
                  </li>
                  <li className="list-content">
                    <strong>City Type:</strong> Select whether your residence is in
                    a 'Metro City' (Delhi, Mumbai, Kolkata, Chennai) or a 'Non-Metro
                    City'. This selection impacts the tax exemption calculation.
                  </li>
                  <li className="list-content">
                    <strong>View Your Results:</strong> The calculator will
                    instantly display your "Exempt HRA Amount" and "Taxable HRA
                    Amount."
                  </li>
                </ol>
              </div>
              <div className="hra-img-box-howto">
                <img
                  src={howuse}
                  alt="How to use HRA Calculator"
                  className="hra-img-howto hra-img-lg"
                />
              </div>
            </div>
          </section>
      
          {/* Understanding Your HRA Calculator Results */}
          <section className="">
            <h2 className="header-main mb-3">
              Understanding Your HRA Calculator Results
            </h2>
            <p className="p-content mb-4">
              Once you input your details, our calculator provides a clear
              breakdown of your HRA benefits:
            </p>
            <ul className="hra-section-ul hra-section-ul-indent">
              <li className="list-content">
                <strong>Exempt HRA Amount:</strong> This is the portion of your
                HRA that is <strong>completely free from income tax</strong>.
                This amount will reduce your gross taxable income, leading to
                direct tax savings.
              </li>
              <li className="list-content">
                <strong>Taxable HRA Amount:</strong> This is the remaining
                portion of your HRA (Actual HRA Received - Exempt HRA Amount)
                that will be <strong>added to your taxable income</strong>. This
                portion will be taxed as per your applicable income tax slab.
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
          <td className="table-cell">Monthly Investment</td>
          <td className="table-cell">?5,000</td>
        </tr>
        <tr className="">
          <td className="table-cell">Investment Period</td>
          <td className="table-cell">10 Years</td>
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
      
          {/* Important HRA Rules & Considerations */}
          <section className="">
            <h2 className="header-main mb-3">
              Important HRA Rules & Considerations
            </h2>
            <p className="p-content mb-4">
              To ensure you can successfully claim HRA exemption, keep the
              following rules and considerations in mind:
            </p>
            <ul className="hra-section-ul">
              <li className="list-content">
                <strong>Proof of Rent Payment:</strong> It
                is mandatory to keep proper rent receipts or bank statements
                showing rent transfers. Your employer will typically ask for
                these proofs.
              </li>
              <li className="list-content">
                <strong>Rent Agreement:</strong> A valid
                rent agreement is crucial, especially for higher rent amounts,
                as it serves as primary proof of your rental obligation.
              </li>
              <li className="list-content">
                <strong>Landlord's PAN Details:</strong> If
                your annual rent payment exceeds{" "}
                <strong>?1,00,000 (Rupees One Lakh)</strong>, you must furnish
                the PAN of your landlord to your employer. A declaration is
                required if the landlord does not have a PAN.
              </li>
              <li className="list-content">
                <strong>Living in Your Own House:</strong>{" "}
                You cannot claim HRA exemption if you live in a house that you
                own in the same city for which you are claiming HRA.
              </li>
              <li className="list-content">
                <strong>Paying Rent to Parents:</strong> You
                can pay rent to your parents and claim HRA exemption, provided
                the transaction is genuine, and your parents declare the rental
                income in their tax returns.
              </li>
              <li className="list-content">
                <strong>No HRA in Salary (Section 80GG):</strong>{" "}
                If you are a salaried individual but do not receive HRA as part
                of your salary, or if you are a self-employed professional
                paying rent, you can still claim a deduction for rent paid under{" "}
                <strong>Section 80GG</strong> of the Income Tax Act.
              </li>
              <li className="list-content">
                <strong>Metro vs. Non-Metro Cities:</strong>{" "}
                For HRA purposes, metro cities generally include{" "}
                <strong>Delhi, Mumbai, Kolkata, and Chennai</strong>. All other
                cities fall under the <strong>'non-metro'</strong> category.
              </li>
            </ul>
          </section>
      
          {/* Advantages of Using the UniCX HRA Calculator */}
          <section className="">
            <h2 className="header-main mb-3">
              Advantages of Using the UniCX HRA Calculator
            </h2>
            <p className="p-content mb-4">
              Leveraging our <strong>free online HRA calculator</strong> offers
              significant benefits for accurate tax planning:
            </p>
            <div className="hra-advantage-list">
              <div className="hra-advantage-card">
                <h3 className="hra-advantage-title">Accurate Exemption Calculation:</h3>
                <p className="list-content">
                  Instantly determine the precise tax-exempt portion of your
                  HRA, avoiding manual errors.
                </p>
              </div>
              <div className="hra-advantage-card">
                <h3 className="hra-advantage-title">Simplify Complex Rules:</h3>
                <p className="list-content">
                  Our calculator handles the "least of three" rule, making
                  complex tax provisions easy to understand.
                </p>
              </div>
              <div className="hra-advantage-card">
                <h3 className="hra-advantage-title">Efficient Tax Planning:</h3>
                <p className="list-content">
                  Get clear insights into how HRA impacts your taxable income,
                  aiding in better financial decisions.
                </p>
              </div>
              <div className="hra-advantage-card">
                <h3 className="hra-advantage-title">Time-Saving:</h3>
                <p className="list-content">
                  Quickly get results without needing to manually apply
                  percentages and deductions.
                </p>
              </div>
              <div className="hra-advantage-card">
                <h3 className="hra-advantage-title">User-Friendly Interface:</h3>
                <p className="list-content">
                  Designed for ease of use, even for individuals without
                  in-depth tax knowledge.
                </p>
              </div>
            </div>
          </section>
      
          {/* Tip box */}
          <section className="">
            <div className="hra-tip-box">
              <p className="hra-tip-text">
                <strong>UniCX Tip:</strong> Always retain all your rent receipts
                and rent agreement copies. These are crucial documents for
                claiming HRA exemption and may be required by your employer or
                during income tax assessment. For rent paid in cash, ensure the
                receipts are duly signed by the landlord.
              </p>
            </div>
          </section>
      
          {/* UniCX Expert Support & Resources */}
          <section id="contact" className="">
            <h2 className="header-main mb-3">
              Beyond Calculations: UniCX - Your Partner in Tax & Financial
              Planning
            </h2>
            <p className="p-content mb-4">
              At <strong className="bold-content">UniconsultX Solutions Private Limited (UniCX)</strong>,
              our commitment extends beyond providing a powerful HRA calculator.
              We understand that navigating the complexities of income tax and
              financial planning requires comprehensive support. That's why we
              offer <strong>comprehensive support and resources</strong> to help
              you optimize your finances.
            </p>
            <h3 className="hra-support-title">
              Our Expert Financial Services Include:
            </h3>
            <ul className="hra-section-ul">
              <li className="list-content">
                <strong>Income Tax Filing Assistance:</strong> Expert help with
                accurate and timely filing of your income tax returns.
              </li>
              <li className="list-content">
                <strong>Tax Planning & Optimization:</strong> Personalized
                strategies to maximize your tax savings through various
                deductions and exemptions (including HRA, 80C, etc.).
              </li>
              <li className="list-content">
                <strong>Investment Advisory:</strong> Guidance on suitable
                investment avenues to achieve your financial goals.
              </li>
              <li className="list-content">
                <strong>Financial Consulting:</strong> Holistic financial
                planning to grow and protect your wealth.
              </li>
              <li className="list-content">
                <strong>Compliance & Advisory:</strong> Keeping you updated on
                the latest tax laws and regulations.
              </li>
            </ul>
            <p className="hra-support-note">
              <strong>Optimize Your Savings with UniCX:</strong> We are
              dedicated to being your reliable source for all things tax and
              financial planning. Explore our website for more in-depth
              articles, common FAQs, and the latest updates. Partner with UniCX
              for peace of mind in your financial journey.
            </p>
            <div className="hra-support-btn-box">
              <button className="hra-support-btn">
                Get Expert Tax Consultation
              </button>
            </div>
          </section>
      
          {/* FAQs */}
          <section className="">
            <h2 className="header-main mb-3">
              Frequently Asked Questions (FAQs) about HRA
            </h2>
            <div className="hra-faq-list">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`hra-faq-item${openFAQ === i ? " active" : ""}`}
                  onClick={() => toggleFAQ(i)}
                >
                  <div className={`hra-faq-question${openFAQ !== i ? " hra-faq-question-inactive" : ""}`}>
                    <p className="">{faq.q}</p>
                    <ChevronDown size={18} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
                  </div>
                  <p className={`hra-faq-answer${openFAQ === i ? "" : " inactive"}`}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
      
          {/* Footer note */}
          <footer className="hra-footer-note-box">
            <p className="hra-footer-note">
              This HRA calculator and information is developed and maintained by{" "}
              <strong>UniCX (UniconsultX Solutions Private Limited)</strong> to
              help users simplify House Rent Allowance computations as per
              current Indian income tax laws. For complex tax situations or
              personalized advice, always consult with a qualified tax
              professional or{" "}
              <a href="#contact" className="bold-content hra-footer-link">
                contact UniCX directly
              </a>
              .
            </p>
          </footer>
        </div>
      </div>
    </div>
    </div>
    </section>
    </>
   
  );
};

export default HRACalculator;





