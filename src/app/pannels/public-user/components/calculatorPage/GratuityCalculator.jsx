import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa"; // Import FaRupeeSign for consistency
import {
  Landmark,
  Briefcase,
  Calculator,
  ScrollText,
  Scale,
  Award,
  FileText,
  ChevronDown,
  HandCoins,
 
  HelpCircle,
} from "lucide-react";
import Header from "../component/Header";
import gratuitylogo from "../assets/images/calculators_img/BG IMAGES/gratuity1.png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how5.png"

import "../calculatorCss/GratuityCalculator.css";

function GratuityCalculator() {
  const [lastSalary, setLastSalary] = useState("10000");
  const [yearsOfService, setYearsOfService] = useState("5");
  const [covered, setCovered] = useState("yes"); // 'yes' = Covered under Act, 'no' = Not covered
  const [gratuity, setGratuity] = useState(0);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let newErrors = {};
    let isValid = true;

    const salary = parseFloat(lastSalary);
    const years = parseFloat(yearsOfService);

    if (isNaN(salary) || salary < 100 || salary > 1000000000) {
      newErrors.lastSalary = "Salary must be between ?100 and ?1,00,00,000.";
      isValid = false;
    }

    if (isNaN(years) || years <= 0 || years > 50) {
      newErrors.yearsOfService = "Years of service must be between 1 and 50.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const calculateGratuity = () => {
    if (!validateInputs()) {
      setGratuity(0);
      return;
    }

    const salary = parseFloat(lastSalary);
    const years = parseFloat(yearsOfService);
    let actualYears = Math.floor(years);
    let yearsForCalculation = actualYears;
    let amount = 0;

    if (covered === "yes") {
      // If more than or equal to 0.75 year, round up
      if (years - actualYears >= 0.75) {
        yearsForCalculation = actualYears + 1;
      }

      // 15 days' salary for every completed year
      amount = Math.floor((salary * 15 * yearsForCalculation) / 26);
    } else {
      // Not covered: 0.5 month's salary per completed year
      amount = Math.floor((salary / 2) * actualYears);
    }

    setGratuity(amount);
  };

  useEffect(() => {
    calculateGratuity();
  }, [lastSalary, yearsOfService, covered]);

  const formatNumber = (num) => {
    if (num === null || isNaN(num)) return "";
    return parseFloat(num).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value <= 1000000000) {
      setLastSalary(value);
      setErrors((prev) => ({ ...prev, lastSalary: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        lastSalary: "Salary must be between ?100 and ?1,00,00,000.",
      }));
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value <= 50) {
      setYearsOfService(value);
      setErrors((prev) => ({ ...prev, yearsOfService: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        yearsOfService: "Years of service must be between 1 and 50.",
      }));
    }
  };

  const handleCoverageChange = (e) => {
    setCovered(e.target.value);
  };
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      q: "What is the minimum service period required to be eligible for gratuity?",
      a: "Under the Payment of Gratuity Act, 1972, an employee must complete at least five years of continuous service to be eligible for gratuity. This rule has exceptions in cases of death or disablement.",
    },
    {
      q: "Is gratuity taxable?",
      a: "Gratuity is taxable, but there are significant exemptions. For government employees, it's fully exempt. For private sector employees, the least of the actual gratuity received, ?20 lakhs (or ?10 lakhs for those not covered by the Act), or a specific formula-based amount is exempt.",
    },
    {
      q: "Can I get gratuity if I resign?",
      a: "Yes, you can receive gratuity upon resignation, provided you have completed at least five years of continuous service with the employer.",
    },
    {
      q: "What is 'Last Drawn Salary' for gratuity calculation?",
      a: "For employees covered by the Gratuity Act, 'Last Drawn Salary' typically includes Basic Salary + Dearness Allowance. For those not covered, it often includes Basic Salary + Dearness Allowance + all other fixed monthly allowances, as per company policy.",
    },
    {
      q: "Can an employer deny gratuity payment?",
      a: "An employer can only deny or forfeit gratuity in specific circumstances, such as termination due to an employee's gross misconduct, riotous or disorderly behavior, violence, or any act involving moral turpitude, which caused damage or loss to the employer.",
    },
  ];

  return (
    <><Header/>
    <div className="gratuity-section">
      <div className="gratuity-container">
        
        <div className="gratuity-header">
          <h1 className="gratuity-title">Gratuity Calculator</h1>
         
        </div>

      
        <div className="gratuity-grid">
          <div className="">
            {/* Input: Last Drawn Salary */}
            <div className="gratuity-field">
              <label htmlFor="lastSalary" className="gratuity-label">
                Last Drawn Salary (Basic + DA) (₹)
              </label>
              <div
                className={`gratuity-input-group
                                            ${
                                              errors.lastSalary
                                                ? "gratuity-input-error"
                                                : "gratuity-input-focus"
                                            }`}
              >
                <FaRupeeSign className="gratuity-icon" />
                <input
                  type="number"
                  id="lastSalary"
                  value={lastSalary}
                  onChange={handleAmountChange}
                  className="gratuity-input"
                  min="0"
                  placeholder="e.g., 50000"
                  aria-label="Last Drawn Salary"
                />
              </div>
              {errors.lastSalary && (
                <p className="error-text">{errors.lastSalary}</p>
              )}
            </div>
            {/* Input: Years of Service */}
            <div className="gratuity-field">
              <label htmlFor="yearsOfService" className="gratuity-label">
                Years of Service
              </label>
              <div
                className={`gratuity-input-group
                                            ${
                                              errors.yearsOfService
                                                ? "gratuity-input-error"
                                                : "gratuity-input-focus"
                                            }`}
              >
                <input
                  type="number"
                  id="yearsOfService"
                  value={yearsOfService}
                  onChange={handleYearChange}
                  className="gratuity-input"
                  min="0"
                  step="0.01" // Allow decimal for months (e.g., 5.5 years)
                  placeholder="e.g., 10.5"
                  aria-label="Years of Service"
                />
              </div>
              {errors.yearsOfService && (
                <p className="error-text">{errors.yearsOfService}</p>
              )}
            </div>
            {/* Select: Covered under Gratuity Act */}
            <div className="gratuity-field">
              <label htmlFor="covered" className="gratuity-label">
                Are you covered under the Gratuity Act?
              </label>
              <div className="gratuity-select-group">
                <select
                  id="covered"
                  value={covered}
                  onChange={(e) => setCovered(e.target.value)}
                  className="gratuity-select"
                  aria-label="Covered under Gratuity Act"
                >
                  <option value="yes">Yes (Covered)</option>
                  <option value="no">No (Not Covered)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="gratuity-results">
            <div className="gratuity-results-inner">
              <div className="space-y-4">
                <div className="gratuity-total-row">
                  <span className=" ">
                    Estimated Gratuity Amount:
                  </span>
                  <span className="">
                    ₹{formatNumber(gratuity) || "0.00"}
                  </span>
                </div>

                               <p className="gratuity-estimate-note">
                  * This calculation is an estimate and may vary based on
                  specific company policies and the Gratuity Act rules.
                </p>
              </div>
            </div>
          </div>
        </div>
<section className="gratuity-info-section">
  <div className="gratuity-info-content">
    {/* What is Gratuity? */}
    <section className="">
      <h2 className="header-main">What is Gratuity?</h2>
      <div className="gratuity-section-grid">
        <div>
          <p className="p-content ">
            <strong className="bold-content">Gratuity</strong> is a lump sum payment made by an employer to an
            employee upon the employee's superannuation (retirement),
            resignation, death, or disablement, provided they meet certain
            eligibility criteria, primarily related to the length of
            service. It's a statutory benefit for employees covered under
            the <strong className="bold-content">Payment of Gratuity Act, 1972</strong>, and a policy-based
            benefit for others.
          </p>
          <p className="p-content">
            It serves as a long-term benefit for employees, recognizing
            their loyalty and contribution to the company over the years.
          </p>
        </div>
        <div className="gratuity-img-box gratuity-img-hover">
          <img
            src={gratuitylogo}
            alt="Gratuity - Retirement Savings and Security"
            className="gratuity-img"
          />
        </div>
      </div>
    </section>

    {/* The Payment of Gratuity Act, 1972 (and its Scope) */}
    <section className="">
      <h2 className="header-main flex items-center gap-2">
        <Landmark size={22} className="gratuity-section-icon" />
        The Payment of Gratuity Act, 1972 (and its Scope)
      </h2>
      <p className="p-content ">
        The <strong className="bold-content">Payment of Gratuity Act, 1972</strong> is a central act that
        mandates the payment of gratuity to employees engaged in
        factories, mines, oilfields, plantations, ports, railway
        companies, shops or other establishments, and for matters
        connected therewith or incidental thereto.
      </p>
      <ul className="gratuity-section-ul">
        <li className="list-content">
          <strong>Applicability:</strong> Applies to
          establishments employing <strong>10 or more persons</strong> on any day in
          the preceding 12 months. Once the Act becomes applicable, it
          continues to apply even if the number of employees falls below
          10.
        </li>
        <li className="list-content">
          <strong>Purpose:</strong> To provide a
          social security net for employees in their old age or upon
          cessation of employment after significant service.
        </li>
      </ul>
    </section>

    {/* Eligibility Criteria for Gratuity */}
    <section className="">
      <h2 className="header-main flex items-center gap-2">
        <Briefcase size={22} className="gratuity-section-icon" />
        Eligibility Criteria for Gratuity
      </h2>
      <p className="p-content ">
        To be eligible for gratuity under the Payment of Gratuity Act,
        1972, an employee must have completed <strong>at least five years of
        continuous service</strong> with the same employer.
      </p>
      <ul className="gratuity-section-ul">
        <li className="list-content">
          <strong>Exceptions to 5-Year Rule:</strong>
          The five-year continuous service rule does not apply in cases
          of:
          <ul className="gratuity-section-ul-indent">
            <li>Death of the employee.</li>
            <li>
              Disablement of the employee due to accident or disease.
            </li>
          </ul>
          In such cases, gratuity is payable even if the service period
          is less than five years.
        </li>
      </ul>
    </section>

    {/* How Gratuity is Calculated? */}
    <section className="">
      <h2 className="header-main flex items-center gap-2">
        <Calculator size={22} className="gratuity-section-icon" />
        How Gratuity is Calculated?
      </h2>
      <p className="p-content ">
        The method of calculating gratuity differs based on whether the
        employee is covered under the Payment of Gratuity Act, 1972.
      </p>

      <h3 className="gratuity-section-subheading">
        A. For Employees Covered Under the Payment of Gratuity Act, 1972
      </h3>
      <p className="gratuity-section-formula">
        <strong>Gratuity = (Last Drawn Salary) × (15/26) × (Number
        of Years of Service)</strong>
      </p>
      <ul className="gratuity-section-ul-indent ">
        <li className="list-content">
          <strong>Last Drawn Salary:</strong> This includes Basic Salary + Dearness
          Allowance (DA). Any other allowances are generally not
          included.
        </li>
        <li className="list-content">
          <strong>15/26:</strong> Represents 15 days' salary for every completed year
          of service, assuming a month has 26 working days.
        </li>
        <li className="list-content">
          <strong>Number of Years of Service:</strong>
          <ul className="gratuity-section-ul-indent">
            <li>
              If the service period is six months or more in a year, it
              is rounded up to the next full year. (e.g., 5 years 7
              months is considered 6 years).
            </li>
            <li>
              If the service period is less than six months in a year,
              it is ignored. (e.g., 5 years 4 months is considered 5
              years).
            </li>
          </ul>
        </li>
        <li className="list-content">
          <strong>Maximum Limit:</strong> The maximum gratuity payable under the Act
          is currently <strong>?20 Lakhs</strong> (as per the Gratuity Amendment Act,
          2018).
        </li>
      </ul>

      <h3 className="gratuity-section-subheading">
        B. For Employees NOT Covered Under the Payment of Gratuity Act,
        1972
      </h3>
      <p className="p-content ">
        For employees working in establishments not covered by the Act,
        gratuity payment is typically based on the company's internal
        policy or employment contract. The calculation formula commonly
        used in such cases is:
      </p>
      <p className="gratuity-section-formula">
        <strong>Gratuity = (Last Drawn Salary) × (15/30) × (Number
        of Years of Service)</strong>
      </p>
      <ul className="gratuity-section-ul-indent">
        <li className="list-content">
          <strong>Last Drawn Salary:</strong> This usually includes Basic Salary +
          Dearness Allowance + all other allowances (fixed monthly
          payments).
        </li>
        <li className="list-content">
          <strong>15/30:</strong> Represents 15 days' salary for every completed year
          of service, assuming a month has 30 working days.
        </li>
        <li className="list-content">
          <strong>Number of Years of Service:</strong> No rounding up for months is
          generally applied; only completed years of service are
          considered.
        </li>
        <li className="list-content">
          <strong>Maximum Limit:</strong> The maximum limit is as per the company's
          policy, often capped at ?20 Lakhs, similar to the Act, but can
          vary.
        </li>
      </ul>
    </section>

    {/* Taxation of Gratuity */}
    <section className="">
      <h2 className="header-main flex items-center gap-2">
        <Scale size={22} className="gratuity-section-icon" />
        Taxation of Gratuity
      </h2>
      <p className="p-content ">
        The tax treatment of gratuity varies based on the type of
        employer:
      </p>
      <ul className="gratuity-section-ul">
        <li className="list-content">
          <strong>For Government Employees (Central/State/Local Authority):</strong>
          Gratuity received by government employees is <strong>fully exempt
          from income tax</strong>.
        </li>
        <li className="list-content">
          <strong>For Private Sector Employees (Covered under Payment of
          Gratuity Act, 1972):</strong>
          The <em>least</em> of the following three amounts is exempt from tax:
          <ol className="gratuity-section-ol-indent">
            <li className="list-content">Actual Gratuity Received.</li>
            <li className="list-content">
              ?20,00,000 (Twenty Lakh Rupees) - The statutory limit.
            </li>
            <li className="list-content">
              15 days' salary for each completed year of service or part
              thereof in excess of six months (calculated as per the
              Act's formula: Last Drawn Salary × 15/26 × No.
              of Years of Service).
            </li>
          </ol>
        </li>
        <li className="list-content">
          <strong>For Private Sector Employees (NOT Covered under Payment of
          Gratuity Act, 1972):</strong>
          The <em>least</em> of the following three amounts is exempt from tax:
          <ol className="gratuity-section-ol-indent">
            <li className="list-content">Actual Gratuity Received.</li>
            <li className="list-content">
              ?10,00,000 (Ten Lakh Rupees) - The statutory limit (Note:
              This limit was ?10 Lakhs and is not updated to ?20 Lakhs
              for this category unless specified by latest
              rules/policy).
            </li>
            <li className="list-content">
              Half-month's average salary for each completed year of
              service (calculated as: Average Last 10 months' Salary
              × 1/2 × No. of Completed Years of Service).
            </li>
          </ol>
        </li>
        <li className="list-content">
          <strong>Gratuity received by dependents of an employee who dies in
          service:</strong>
          This is <strong>fully exempt from tax</strong>.
        </li>
      </ul>
    </section>

    {/* How to Use the UniCX Free Online Gratuity Calculator */}
    <section className="">
      <h2 className="header-main flex items-center gap-2">
        <Calculator size={22} className="gratuity-section-icon" />
        How to Use the UniCX Free Online Gratuity Calculator
      </h2>
      <div className="gratuity-section-grid">
        <div>
          <p className="p-content ">
            Our UniCX Gratuity Calculator makes estimating your potential
            returns simple and quick. Follow these steps to see your wealth
            growth potential:
          </p>
          <ol className="gratuity-howto-ol">
            <li className="list-content">
              <strong>Coverage Status:</strong> Select whether you are 'Covered under
              Gratuity Act' or 'Not Covered under Gratuity Act'. This
              determines the calculation method.
            </li>
            <li className="list-content">
              <strong>Last Drawn Basic Salary (Monthly ?):</strong> Enter your monthly
              Basic Salary.
            </li>
            <li className="list-content">
              <strong>Last Drawn Dearness Allowance (Monthly ?):</strong> Enter your
              monthly Dearness Allowance (DA). If applicable for those not
              covered, include other fixed allowances here.
            </li>
            <li className="list-content">
              <strong>Years of Service (Completed Years):</strong> Enter the number of
              full years you have completed with the employer.
            </li>
            <li className="list-content">
              <strong>Months in Excess (if any):</strong> If applicable (for those
              covered by the Act), enter the number of additional months (0
              to 11).
            </li>
            <li className="list-content">
              <strong>Click "Calculate":</strong> The calculator will instantly display
              your "Estimated Gratuity Amount" and "Taxable Gratuity (if
              any)."
            </li>
          </ol>
        </div>
        <div className="gratuity-img-box-howto gratuity-img-howto">
          <img
            src={howuse}
            alt="How to use Gratuity Calculator"
            className="gratuity-img-howto gratuity-img-lg"
          />
        </div>
      </div>
    </section>

    {/* Understanding Your Gratuity Calculator Results */}
    <section className="">
      <h2 className="header-main flex items-center gap-2">
        <FileText size={22} className="gratuity-section-icon" />
        Understanding Your Gratuity Calculator Results
      </h2>
      <p className="p-content ">
        Once you input your details, our calculator provides a clear
        breakdown of your potential gratuity:
      </p>
      <ul className="gratuity-section-ul gratuity-section-ul-indent">
        <li className="list-content">
          <strong>Estimated Gratuity Amount:</strong> This is the calculated gratuity
          payment you are potentially eligible for.
        </li>
        <li className="list-content">
          <strong>Tax Exempt Gratuity:</strong> This is the portion of your gratuity
          that is exempt from income tax, based on the applicable rules.
        </li>
        <li className="list-content">
          <strong>Taxable Gratuity:</strong> This is any remaining portion of your
          gratuity that will be added to your taxable income and taxed
          as per your applicable income tax slab.
        </li>
      </ul>
     <div className="container">
  <div className="table-wrapper">
    <table className="pricing-table">
      <thead className="table-head">
        <tr>
          <th className="table-heading">Example Calculation (Covered by Act)</th>
          <th className="table-heading">Details</th>
        </tr>
      </thead>
      <tbody className="table-body">
        <tr className="alt-row">
          <td className="table-cell">Last Drawn Basic + DA</td>
          <td className="table-cell">?50,000</td>
        </tr>
        <tr >
          <td className="table-cell">Years of Service</td>
          <td className="table-cell">15 Years, 8 Months (Calculated as 16 years)</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Estimated Gratuity Amount</td>
          <td className="table-cell">?4,61,538</td>
        </tr>
        <tr >
          <td className="table-cell">Tax Exempt (Example)</td>
          <td className="table-cell">?4,61,538</td>
        </tr>
        <tr className="row-alts">
          <td className="table-cell">Taxable Gratuity</td>
          <td className="table-cell">?0</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    </section>

    {/* Important Gratuity Rules & Considerations */}
    <section className="">
      <h2 className="header-main flex items-center gap-2">
        <ScrollText size={22} className="gratuity-section-icon" />
        Important Gratuity Rules & Considerations
      </h2>
      <p className="p-content ">
        While gratuity is a significant benefit, keep these important
        points in mind:
      </p>
      <ul className="gratuity-section-ul">
        <li className="list-content">
          <strong>Continuous Service:</strong> This
          means uninterrupted service, including periods of leave,
          absence due to accident/sickness, or strike/lockout not due to
          employee's fault.
        </li>
        <li className="list-content">
          <strong>Termination:</strong> Gratuity is
          payable upon termination of employment for any reason
          (superannuation, resignation, death, disablement, or even
          retrenchment).
        </li>
        <li className="list-content">
          <strong>Forfeiture of Gratuity:</strong>
          Gratuity can be wholly or partially forfeited if the
          employee's services have been terminated for certain acts of
          omission or negligence causing damage or loss to the employer,
          or for riotous/disorderly conduct, or any act involving moral
          turpitude committed in the course of employment.
        </li>
        <li className="list-content">
          <strong>Employer's Obligation:</strong>
          The employer is legally obligated to pay gratuity within 30
          days of it becoming payable. If not, they are liable to pay
          simple interest on the unpaid amount.
        </li>
      </ul>
    </section>

    {/* Advantages of Using the UniCX Gratuity Calculator */}
    <section className="">
      <h2 className="header-main flex items-center gap-2">
        <Award size={22} className="gratuity-section-icon" />
        Advantages of Using the UniCX Gratuity Calculator
      </h2>
      <p className="list-content ">
        Leveraging our <strong className="bold-content">free online Gratuity calculator</strong> offers
        significant benefits for accurate financial planning:
      </p>
      <div className="gratuity-advantage-list">
        <div className="gratuity-advantage-card">
          <h3 className="gratuity-advantage-title">
            <Calculator size={20} className="gratuity-advantage-icon" /> Accuracy & Ease:
          </h3>
          <p className="list-content">
            Ensures precise calculation based on relevant Act or company
            policy, simplifying complex computations.
          </p>
        </div>
        <div className="gratuity-advantage-card">
          <h3 className="gratuity-advantage-title">
            <Briefcase size={20} className="gratuity-advantage-icon" /> Clarity on Eligibility:
          </h3>
          <p className="list-content">
            Helps understand eligibility conditions and their impact on
            your payout.
          </p>
        </div>
        <div className="gratuity-advantage-card">
          <h3 className="gratuity-advantage-title">
            <Scale size={20} className="gratuity-advantage-icon" /> Tax Impact Analysis:
          </h3>
          <p className="list-content">
            Provides insight into the taxability of your gratuity
            payout.
          </p>
        </div>
        <div className="gratuity-advantage-card">
          <h3 className="gratuity-advantage-title">
            <HandCoins size={20} className="gratuity-advantage-icon" /> Financial Planning:
          </h3>
          <p className="list-content">
            Aids in estimating your retirement or end-of-service corpus
            for better financial security.
          </p>
        </div>
      </div>
    </section>

    {/* Frequently Asked Questions (FAQs) about Gratuity */}
    <section className="">
      <h2 className="header-main flex items-center gap-2">
        <HelpCircle size={22} className="gratuity-section-icon" />
        Frequently Asked Questions (FAQs) about Gratuity
      </h2>
      <div className="gratuity-faq-list">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`gratuity-faq-item${openFAQ === i ? " active" : ""}`}
            onClick={() => toggleFAQ(i)}
          >
            <div className={`gratuity-faq-question${openFAQ !== i ? " gratuity-faq-question-inactive" : ""}`}>
              <p className="">{faq.q}</p>
              <ChevronDown size={18} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
            </div>
            <p className={`gratuity-faq-answer${openFAQ === i ? "" : " inactive"}`}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* UniCX Expert Support & Resources */}
    <section id="contact" className="">
      <h2 className="header-main">
        Beyond Calculations: UniCX - Your Partner in Financial Planning
      </h2>
      <p className="p-content ">
        At <strong className="bold-content">UniconsultX Solutions Private Limited (UniCX)</strong>, our
        commitment extends beyond providing powerful financial
        calculators. We understand that navigating end-of-service
        benefits, taxation, and overall financial planning requires
        expert guidance. That's why we offer <strong>comprehensive support and
        resources</strong> to help you optimize your finances.
      </p>
      <h3 className="gratuity-support-title">
        Our Expert Financial Services Include:
      </h3>
      <ul className="gratuity-section-ul">
        <li className="list-content">
          <strong>Retirement Planning:</strong> Strategies to ensure a secure and
          comfortable post-employment life.
        </li>
        <li className="list-content">
          <strong>Tax Consulting:</strong> Expert advice on gratuity taxation, income
          tax filing, and overall tax optimization.
        </li>
        <li className="list-content">
          <strong>Wealth Management:</strong> Holistic financial planning to grow and
          protect your wealth.
        </li>
        <li className="list-content">
          <strong>Investment Advisory:</strong> Guidance on suitable investment
          avenues for your long-term goals.
        </li>
      </ul>
      <p className="gratuity-support-note">
        <strong>Plan Your Financial Future with UniCX:</strong> We are dedicated to
        being your reliable source for all things financial planning and
        tax advisory. Explore our website for more in-depth articles,
        common FAQs, and the latest updates. Partner with UniCX for
        peace of mind in your wealth creation journey.
      </p>
      <div className="gratuity-support-btn-box">
        <button className="gratuity-support-btn">
          Get Expert Financial Planning Consultation
        </button>
      </div>
    </section>

    {/* Footer note */}
    <footer className="gratuity-footer-note-box">
      <p className="gratuity-footer-note">
        This Gratuity calculator and information is developed and
        maintained by <strong>UniCX (UniconsultX Solutions Private Limited)</strong>
        to help users estimate their potential gratuity as per general
        understanding of the Payment of Gratuity Act, 1972, and common
        practices. For precise calculations, specific legal advice, or
        personalized financial planning, always consult with a qualified
        legal or tax professional or{" "}
        <a href="#contact" className="bold-content gratuity-footer-link">
          contact UniCX directly
        </a>
        . Tax laws are subject to change.
      </p>
    </footer>
  </div>
</section>
      </div>
    </div>
    </>
  );
}

export default GratuityCalculator;




