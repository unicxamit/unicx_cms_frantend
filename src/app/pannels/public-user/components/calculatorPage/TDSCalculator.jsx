import React, { useState, useEffect } from "react";
// import { FaRupeeSign } from "react-icons/fa";
import {
  ShieldCheck,
  FileText,
  Banknote,
  ListChecks,
  ScrollText,
  CheckCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import Header from "../component/Header";
import tdslogo from "../assets/images/calculators_img/BG IMAGES/tds1.png"
import benifite from "../assets/images/calculators_img/BG IMAGES/4 png.png"
import howuse from "../assets/images/calculators_img/BG IMAGES/how2.png";
import "../calculatorCss/TDSCalculator.css"; // Importing the CSS file for TDS Calculator
function TDSCalculator() {
  // List of TDS sections with their logic (Unique keys now)
  const tdsOptions = [
    {
      key: "salary",
      label: "Salary",
      section: "192",
      rate: "slab",
      threshold: "-",
    },
    {
      key: "interest_fd",
      label: "Interest on FD",
      section: "194A",
      rate: 0.1,
      threshold: "?40,000 (?50,000 for seniors)",
    },
    {
      key: "professional",
      label: "Professional Fees",
      section: "194J",
      rate: 0.1,
      threshold: "?30,000",
    },
    {
      key: "rent",
      label: "Rent",
      section: "194I",
      rate: 0.1,
      threshold: "?2,40,000/year",
    },
    {
      key: "commission",
      label: "Commission",
      section: "194H",
      rate: 0.05,
      threshold: "?15,000",
    },
    {
      key: "contractor",
      label: "Contractor Payment",
      section: "194C",
      rate: { individual: 0.01, others: 0.02 },
      threshold: "?30,000 per contract or ?1 lakh/year",
    },
    {
      key: "lottery",
      label: "Lottery Winnings",
      section: "194B",
      rate: 0.3,
      threshold: "?10,000",
    },
    {
      key: "premature_epf",
      label: "Premature EPF withdrawal*",
      section: "192A",
      rate: 0.1,
      threshold: "?50,000",
    },
    {
      key: "interest_securities",
      label: "Interest on Securities",
      section: "193",
      rate: 0.1,
      threshold: "?10,000",
    },
    {
      key: "dividend",
      label: "Payment of Dividend",
      section: "194",
      rate: 0.1,
      threshold: "?5,000",
    },
    {
      key: "interest_banks_po",
      label: "Interest from Banks/Post Offices on Deposits",
      section: "194A",
      rate: 0.1,
      threshold: "?40,000",
    },
    {
      key: "interest_others",
      label: "Interest by others (apart from on securities)",
      section: "194A",
      rate: 0.1,
      threshold: "?5,000",
    },
  ];

  const [recipientType, setRecipientType] = useState("individual");
  const [hasPAN, setHasPAN] = useState(true);
  const [selectedKey, setSelectedKey] = useState("interest_fd"); // Changed default to a unique key
  const [paymentAmount, setPaymentAmount] = useState("50000");
  const [result, setResult] = useState({
    label: "",
    section: "",
    threshold: "",
    rate: "0.00",
    tds: "0.00",
    net: "0.00",
  });
  const [paymentAmountError, setPaymentAmountError] = useState(""); // Specific error for payment amount

  // --- Calculation Logic ---
  const calculateTDS = () => {
    setPaymentAmountError(""); // Clear previous error messages for payment amount
    const amount = parseFloat(paymentAmount);

    // Input validation for paymentAmount
    if (isNaN(amount) || amount < 100 || amount > 1000000000) {
      setResult({
        label: "",
        section: "",
        threshold: "",
        rate: "0.00",
        tds: "0.00",
        net: "0.00",
      });
      setPaymentAmountError(
        "Payment amount must be between ?100 and ?10,00,00,000."
      );
      return;
    }

    const selected = tdsOptions.find((opt) => opt.key === selectedKey);

    if (!selected) {
      // This should ideally not happen if selectedKey is always from tdsOptions
      setResult({
        label: "",
        section: "",
        threshold: "",
        rate: "0.00",
        tds: "0.00",
        net: "0.00",
      });
      setPaymentAmountError("Invalid payment type selected.");
      return;
    }

    let rate;
    let tdsAmount = 0;
    let netAmount = 0;

    if (selected.key === "salary") {
      setResult({
        label: selected.label,
        section: selected.section,
        threshold: selected.threshold,
        rate: "N/A",
        tds: "N/A",
        net: "N/A",
      });
      setPaymentAmountError(
        "TDS on Salary (Section 192) is calculated based on individual income tax slab rates and deductions, not a flat percentage on the payment amount. This calculator does not support detailed salary TDS calculation."
      );
      return;
    }

    if (!hasPAN) {
      rate = 0.2; // Default higher rate if PAN not available
    } else if (selected.key === "contractor") {
      rate = selected.rate[recipientType];
    } else {
      rate = selected.rate;
    }

    tdsAmount = amount * rate;
    netAmount = amount - tdsAmount;

    setResult({
      label: selected.label,
      section: selected.section,
      threshold: selected.threshold,
      rate: (rate * 100).toFixed(2),
      tds: tdsAmount.toFixed(2),
      net: netAmount.toFixed(2),
    });
  };

  // Use useEffect to trigger calculation on input changes
  useEffect(() => {
    // Debounce calculation for better performance on rapid input
    const handler = setTimeout(() => {
      calculateTDS();
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [recipientType, hasPAN, selectedKey, paymentAmount]);

  // --- Formatting Function ---
  const formatNumber = (num) => {
    if (num === null || isNaN(num) || num === "N/A")
      return num === "N/A" ? "N/A" : "0.00";
    return parseFloat(num).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  // --- Input Change Handlers ---
  const handlePaymentAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty string or numbers only
    if (value === "" || /^\d+$/.test(value)) {
      if (value <= 1000000000) {
        setPaymentAmount(value);
        setPaymentAmountError(""); // Clear error if input is valid so far
      } else {
        setPaymentAmountError("Payment amount must be between ?100 and ?10,00,00,000.");
      }
    } else {
      setPaymentAmountError("Payment amount must be between ?100 and ?10,00,00,000.");
    }
  };

  const handleSelectedKeyChange = (e) => {
    setSelectedKey(e.target.value);
    setPaymentAmountError(""); // Clear payment amount error when type of payment changes
  };

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const tdsFaqs = [
    {
      q: "Q1: What is the primary difference between TDS and TCS?",
      a: "A1: TDS (Tax Deducted at Source) is deducted by the payer on certain incomes (like salary, rent, fees) before making payment to the recipient. TCS (Tax Collected at Source) is collected by the seller from the buyer on specific goods (like scrap, timber, motor vehicle sales) at the time of sale. Both are mechanisms for early tax collection but apply at different stages and for different types of transactions.",
    },
    {
      q: "Q2: Who is a 'deductor' and a 'deductee' in TDS?",
      a: "A2: A 'deductor' is the person or entity (e.g., employer, company, individual paying rent) who is required to deduct tax at source before making a payment. A 'deductee' is the person or entity who receives the payment from which tax has been deducted.",
    },
    {
      q: "Q3: What happens if TDS is not deducted or not deposited on time?",
      a: "A3: If TDS is not deducted or not deposited on time, the deductor can face severe penalties, including interest on the delayed payment, penalties for non-deduction or non-payment, and even prosecution in some cases. The expense for which TDS was not deducted might also be disallowed for income tax purposes.",
    },
    {
      q: "Q4: Can I claim a refund for excess TDS deducted?",
      a: "A4: Yes, if the TDS deducted from your income is more than your actual tax liability for the financial year, you can claim a refund when you file your Income Tax Return (ITR). The refund amount will be credited to your bank account by the Income Tax Department.",
    },
    {
      q: "Q5: How often should TDS be deposited with the government?",
      a: "A5: Generally, TDS deducted by non-government deductors must be deposited by the 7th of the subsequent month. For the month of March, it can be deposited by April 30th. For government deductors, the rules may vary slightly. Quarterly TDS returns also need to be filed.",
    },
    {
      q: "Q6: Is TDS applicable on all types of payments?",
      a: "A6: No, TDS is applicable only on specific types of payments as defined under various sections of the Income Tax Act, and often only when the payment amount exceeds certain threshold limits in a financial year. Common examples include salary, rent, professional fees, interest, commission, etc.",
    },
    {
      q: "Q7: What is Form 26AS and why is it important?",
      a: "A7: Form 26AS is an annual consolidated statement available on the Income Tax Department's e-filing portal. It shows all tax deducted at source (TDS), tax collected at source (TCS), advance tax paid, and self-assessment tax paid against your PAN. It is crucial for verifying that the TDS deducted from your income has been correctly deposited by the deductor and for claiming credit when filing your ITR.",
    },
  ];
  return (
    <><Header/>
    <div className="tds-input-group-section">
      <div
        className="tds-input-group-container">
{/* <div className="border-2"> */}
        <div className="tds-input-group-header">
          <h1 className="heading-title">TDS Calculator (India)</h1>
         
        </div>
        {/* Right Section: Calculator Inputs and Results */}
        <div className="tds-input-group-grid">
          <div className="">
            {/* Input: Recipient Type */}
            <div className="tds-input-group-field">
              <label htmlFor="recipientType" className="tds-input-group-label">
                Recipient Type:
              </label>
                            <div className="tds-select-group">
                <select
                  id="recipientType"
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="tds-select"
                  aria-label="Recipient Type"
                >
                  <option value="individual">Individual / HUF</option>
                  <option value="others">Company / Firm / Others</option>
                </select>
              </div>
            </div>

            {/* Input: Has PAN? */}
                 <div className="tds-input-group">
              <label className="tds-label">Do you have PAN?</label>
              <div className="tds-radio-group">
                <label className="tds-radio-label">
                  <input
                    type="radio"
                    className="tds-radio"
                    checked={hasPAN}
                    onChange={() => setHasPAN(true)}
                    name="hasPan"
                  />
                  <span className="tds-radio-text">Yes</span>
                </label>
                <label className="tds-radio-label">
                  <input
                    type="radio"
                    className="tds-radio"
                    checked={!hasPAN}
                    onChange={() => setHasPAN(false)}
                    name="hasPan"
                  />
                  <span className="tds-radio-text">No (Higher TDS)</span>
                </label>
              </div>
            </div>

            {/* Input: Type of Payment */}
                        <div className="tds-field-group">
              <label htmlFor="selectedKey" className="tds-label">
                Type of Payment:
              </label>
              <div className="tds-select-group">
                <select
                  id="selectedKey"
                  value={selectedKey}
                  onChange={handleSelectedKeyChange}
                  className="tds-select"
                  aria-label="Type of Payment"
                >
                  {tdsOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label} (Section {option.section})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input: Payment Amount */}
            <div className="tds-input-group-field">
              <label htmlFor="paymentAmount" className="tds-input-group-label">
                Payment Amount (₹):
              </label>
              <div
                className={`tds-input-group-input-group
                                            ${
                                              paymentAmountError
                                                ? "border-red-700 shadow-red-300"
                                                : "tds-input-group-input-focus"
                                            }`}
              >
                <label className="size-5 text-md font-normal text-gray-500">
                  
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={handlePaymentAmountChange}
                  className="simpleinterest-input"
                  min="0"
                  placeholder="e.g., 50000"
                  aria-label="Payment Amount"
                />
              </div>
              {paymentAmountError && (
                <p className="error-text">{paymentAmountError}</p>
              )}
            </div>
          </div>

          <div className="tds-input-group-results">
            <div className="tds-results-inner">
              <div className="space-y-6">
                <div className="tds-input-group-result-row">
                  <span className=" tds-input-group-results-field">
                    TDS Deducted:
                  </span>

                  <span className="tds-input-group">
                    ₹ {formatNumber(result.tds)}
                  </span>
                </div>

                
              </div>
              <div className="tds-input-group-total-row ">
                  <span className=" ">
                    Net Amount (After TDS):
                  </span>

                  <span className="">
                    ₹ {formatNumber(result.net)}
                  </span>
                </div>
           

            <p className="tds-estimate-note">
              * This calculator provides an estimate. Actual TDS may vary based
              on specific tax laws, amendments, and individual circumstances.
              Consult a tax professional for precise calculations.
            </p>
             </div>
          </div>
        </div>

              <section className="tds-info-section">
          <div className="tds-info-content">
            {/* What is Tax Deducted at Source (TDS)? */}
            <section className="">
              <h2 className="header-main ">
                What is Tax Deducted at Source (TDS)?
              </h2>
              <div className="tds-section-grid">
                <div>
                  <p className="p-content">
                    Understanding Tax Deducted at Source (TDS) is crucial for both
                    individuals and businesses in India. TDS is essentially a
                    mechanism introduced by the Indian Income Tax Department to
                    collect tax at the very source of income. It ensures a steady
                    flow of revenue to the government and widens the tax base by
                    bringing more transactions under tax purview.
                  </p>
                  <ul className="tds-section-ul">
                    <li className="list-content">
                      <strong className="bold-content">How it works:</strong> When certain payments (like
                      salary, rent, professional fees, interest, commission, etc.)
                      are made, the payer (deductor) is mandated to deduct a
                      specific percentage as tax before making the final payment to
                      the recipient (deductee).
                    </li>
                    <li className="list-content">
                      <strong className="bold-content">Purpose:</strong> The amount deducted as TDS is then
                      remitted by the deductor to the government. The deductee, in
                      turn, receives a credit for this deducted tax, which they can
                      claim against their total tax liability when filing their
                      annual income tax return.
                    </li>
                  </ul>
                  <p className="list-content">
                    The <strong className="bold-content">UniCX TDS Calculator</strong> is designed to
                    simplify these intricate calculations, helping you effortlessly
                    determine the applicable TDS amounts and ensure compliance with
                    tax regulations.
                  </p>
                </div>
                <div className="tds-img-box tds-img-hover">
                  <img
                    src={tdslogo}
                    alt="Financial planning and savings illustration"
                    className="tds-img"
                  />
                </div>
              </div>
            </section>
        
            {/* Why Use the UniCX TDS Calculator? */}
            <section className="">
              <div>
                <h2 className="header-main ">
                  Why Use the UniCX TDS Calculator?
                </h2>
                <p className="p-content ">
                  Navigating the various TDS sections, rates, and thresholds
                  can be complex. Our calculator offers a straightforward
                  solution to these challenges:
                </p>
                <ul className="tds-icon-list">
                  <li className="list-content">
                    <strong className="tds-icon-title">
                      <ShieldCheck size={18} className="tds-icon" />
                      Accuracy & Simplicity:
                    </strong>
                    <span className="tds-icon-desc">
                      Get precise TDS calculations in moments, without needing
                      to remember complex formulas or different rates for
                      various sections.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="tds-icon-title">
                      <FileText size={18} className="tds-icon" />
                      Compliance Assurance:
                    </strong>
                    <span className="tds-icon-desc">
                      Helps both deductors and deductees understand their tax
                      obligations and rights, reducing the chances of errors
                      and penalties.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="tds-icon-title">
                      <Banknote size={18} className="tds-icon" />
                      Financial Planning:
                    </strong>
                    <span className="tds-icon-desc">
                      Provides clarity on the net amount to be paid or
                      received, aiding in better financial management and
                      budgeting.
                    </span>
                  </li>
                  <li className="list-content">
                    <strong className="tds-icon-title">
                      <ListChecks size={18} className="tds-icon" />
                      Versatility:
                    </strong>
                    <span className="tds-icon-desc">
                      Covers multiple common TDS sections, making it a
                      comprehensive tool for diverse users.
                    </span>
                  </li>
                </ul>
              </div>
            </section>
        
            {/* How to Use the UniCX TDS Calculator */}
            <section className="">
              <h2 className="header-main ">
                How to Use the UniCX TDS Calculator
              </h2>
              <div className="tds-section-grid">
                <div>
                  <p className="p-content ">
                    Our calculator is designed for intuitive use, allowing you
                    to quickly determine your TDS estimates. You will typically
                    input the following:
                  </p>
                  <ol className="tds-howto-ol">
                    <li className="list-content">
                      <strong>Select Payment Type:</strong> Choose the nature of
                      the payment from a dropdown (e.g., Salary, Rent,
                      Professional Fees, Interest, etc.). This determines the
                      applicable TDS section and rate.
                    </li>
                    <li className="list-content">
                      <strong>Enter Payment Amount:</strong> Input the gross
                      amount of the payment before any deductions.
                    </li>
                    <li className="list-content">
                      <strong>PAN Availability:</strong> Indicate whether the
                      deductee's Permanent Account Number (PAN) is available.
                      This is critical as non-furnishing of PAN leads to higher
                      TDS rates.
                    </li>
                    <li className="list-content">
                      <strong>Resident Status:</strong> Specify if the deductee
                      is a Resident or Non-Resident (relevant for certain
                      sections like 195).
                    </li>
                    <li className="list-content">
                      <strong>Select Financial Year:</strong> Choose the
                      appropriate financial year for which the calculation is
                      being made, as rates and rules can change annually.
                    </li>
                    <li className="list-content">
                      <strong>Calculate:</strong> Click the "Calculate TDS"
                      button to instantly view the results.
                    </li>
                  </ol>
                  <h3 className="tds-section-subheading">Outputs:</h3>
                  <ul className="tds-section-ul">
                    <li className="list-content">
                      <strong>Applicable TDS Section & Rate:</strong> The
                      specific section of the Income Tax Act under which TDS is
                      to be deducted, along with the percentage rate.
                    </li>
                    <li className="list-content">
                      <strong>Calculated TDS Amount:</strong> The exact amount
                      of tax to be deducted.
                    </li>
                    <li className="list-content">
                      <strong>Net Amount Payable/Receivable:</strong> The amount
                      remaining after TDS deduction.
                    </li>
                  </ul>
                </div>
                <div className="tds-img-box tds-img-hover">
                  <img
                    src={howuse}
                    alt="How to use UniCX TDS Calculator - Step by step guide"
                    className="tds-img tds-img-lg"
                  />
                </div>
              </div>
            </section>
        
            {/* Key Sections Covered by the TDS Calculator (Table) */}
            <section className="">
              <h2 className="header-main ">
                Key Sections Covered by the UniCX TDS Calculator
              </h2>
              <p className="p-content ">
                Our calculator helps you compute TDS for some of the most common
                payment types:
              </p>
              <div className="table-wrapper">
  <table className="styled-table">
    <thead>
      <tr>
        <th className="table-cell">Section</th>
        <th className="table-cell">Nature of Payment</th>
        <th className="table-cell">Common Rate*</th>
        <th className="table-cell">Threshold Limit (Approx.)*</th>
      </tr>
    </thead>
    <tbody className="table-body">
      <tr className="row-alts">
        <td className="table-cell">192</td>
        <td className="table-cell">Salaries</td>
        <td className="table-cell">Slab Rates</td>
        <td className="table-cell">Basic Exemption Limit</td>
      </tr>
      <tr>
        <td className="table-cell">194A</td>
        <td className="table-cell">Interest other than Interest on Securities</td>
        <td className="table-cell">10%</td>
        <td className="table-cell">?40,000 (Banks), ?5,000 (Others)</td>
      </tr>
      <tr className="row-alts">
        <td className="table-cell">194C</td>
        <td className="table-cell">Payment to Contractors</td>
        <td className="table-cell">1% (Ind/HUF), 2% (Co/Firm)</td>
        <td className="table-cell">?30,000 (single), ?1,00,000 (aggregate)</td>
      </tr>
      <tr>
        <td className="table-cell">194H</td>
        <td className="table-cell">Commission or Brokerage</td>
        <td className="table-cell">5%</td>
        <td className="table-cell">?15,000</td>
      </tr>
      <tr className="row-alts">
        <td className="table-cell">194I</td>
        <td className="table-cell">Rent</td>
        <td className="table-cell">10% (Plant/Machinery/Equipment), 10% (Land/Building/Furniture)</td>
        <td className="table-cell">?2,40,000</td>
      </tr>
      <tr>
        <td className="table-cell">194J</td>
        <td className="table-cell">Professional or Technical Fees</td>
        <td className="table-cell">10%</td>
        <td className="table-cell">?30,000</td>
      </tr>
      <tr className="row-alts">
        <td className="table-cell">194IA</td>
        <td className="table-cell">Transfer of Certain Immovable Property</td>
        <td className="table-cell">1%</td>
        <td className="table-cell">?50 Lakhs</td>
      </tr>
    </tbody>
  </table>
</div>

              <p className="tds-table-note">
                *_Rates and thresholds are illustrative and subject to change as
                per Income Tax Act amendments. Always refer to the latest tax
                laws for definitive rates._*
              </p>
            </section>
        
            {/* The Crucial Role of PAN in TDS Calculations */}
            <section className="">
              <h2 className="header-main ">
                The Crucial Role of PAN in TDS Calculations
              </h2>
              <div className="tds-considerations-box">
                <p className="tds-considerations-desc">
                  The Permanent Account Number (PAN) is paramount in TDS
                  deductions:
                </p>
                <ul className="tds-considerations-list">
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      Standard Deduction:
                    </strong>
                    <span className="tds-icon-desc">
                      When a deductee furnishes their valid PAN, TDS is deducted
                      at the rates specified under the respective sections of
                      the Income Tax Act.
                    </span>
                  </li>
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      Higher Deduction without PAN:
                    </strong>
                    <span className="tds-icon-desc">
                      If the deductee fails to furnish their PAN to the
                      deductor, the TDS will be deducted at a higher rate. This
                      rate is typically 20% or the rate specified for that
                      section, whichever is higher.
                    </span>
                  </li>
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      Benefit of PAN:
                    </strong>
                    <span className="tds-icon-desc">
                      Providing PAN ensures that TDS is deducted at the correct,
                      usually lower, rate and allows the deductee to easily
                      claim credit for the deducted tax against their final tax
                      liability.
                    </span>
                  </li>
                </ul>
              </div>
            </section>
        
            {/* Who Can Benefit from the UniCX TDS Calculator? */}
            <section className="">
              <h2 className="header-main ">
                Who Can Benefit from the UniCX TDS Calculator?
              </h2>
              <div className="tds-section-grid">
                <div>
                  <p className="p-content ">
                    This versatile calculator is beneficial for a wide array of
                    users:
                  </p>
                  <ul className="tds-section-ul">
                    <li className="list-content">
                      <strong>Salaried Individuals:</strong> To understand the
                      TDS deducted from their salary and verify its accuracy.
                    </li>
                    <li className="list-content">
                      <strong>Employers:</strong> For accurate and compliant TDS
                      deductions from employee salaries.
                    </li>
                    <li className="list-content">
                      <strong>Businesses & Freelancers:</strong> To calculate
                      TDS on payments made for professional services, contracts,
                      commissions, or interest.
                    </li>
                    <li className="list-content">
                      <strong>Property Owners & Tenants:</strong> To determine
                      TDS on rent payments (especially above thresholds).
                    </li>
                    <li className="list-content">
                      <strong>Accountants & Tax Professionals:</strong> As a
                      quick reference tool for TDS computation for their
                      clients.
                    </li>
                    <li className="list-content">
                      <strong>Financial Departments:</strong> For precise
                      calculation and compliance across various payment
                      categories.
                    </li>
                    <li className="list-content">
                      <strong>Students & Learners:</strong> To grasp practical
                      aspects of tax deductions.
                    </li>
                  </ul>
                </div>
                <div className="tds-img-box tds-img-hover">
                  <img
                    src={benifite}
                    alt="Who can use UniCX TDS Calculator - Diverse users"
                    className="tds-img tds-img-lg"
                  />
                </div>
              </div>
            </section>
        
            {/* Key Considerations & Important Notes Regarding TDS */}
            <section className="">
              <div className="tds-considerations-box">
                <h2 className="tds-considerations-heading">
                  <ScrollText size={20} className="tds-considerations-icon" />
                  Key Considerations & Important Notes Regarding TDS
                </h2>
                <p className="tds-considerations-desc">
                  While the calculator simplifies the process, it's essential to
                  be aware of the broader TDS landscape:
                </p>
                <ul className="tds-considerations-list">
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      Threshold Limits:
                    </strong>
                    <span className="tds-icon-desc">
                      TDS is applicable only if the payment amount exceeds
                      certain specified threshold limits for each section in a
                      financial year. Below these limits, no TDS is required.
                    </span>
                  </li>
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      TDS Certificates (Form 16/16A):
                    </strong>
                    <span className="tds-icon-desc">
                      Deductors are legally required to issue TDS certificates
                      (Form 16 for salaries, Form 16A for non-salary payments)
                      to deductees. These certificates are crucial for the
                      deductee to claim tax credit.
                    </span>
                  </li>
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      Timely Deposit & Filing:
                    </strong>
                    <span className="tds-icon-desc">
                      Deductors must deposit the deducted TDS with the
                      government and file quarterly TDS returns (Forms 24Q, 26Q,
                      27Q, etc.) within prescribed due dates.
                    </span>
                  </li>
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      Penalties for Non-Compliance:
                    </strong>
                    <span className="tds-icon-desc">
                      Non-deduction, delayed deduction, non-payment, or delayed
                      payment of TDS can attract significant penalties and
                      interest under the Income Tax Act.
                    </span>
                  </li>
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      TDS Credit & Refunds:
                    </strong>
                    <span className="tds-icon-desc">
                      Deductees can claim the TDS amount against their final
                      income tax liability. If the TDS deducted is more than
                      their actual tax liability, they can claim a refund when
                      filing their Income Tax Return (ITR).
                    </span>
                  </li>
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      Lower Deduction Certificate (Section 197):
                    </strong>
                    <span className="tds-icon-desc">
                      Taxpayers can apply to the Assessing Officer (AO) for a
                      certificate to allow deduction of TDS at a lower rate or
                      even nil rate if their estimated tax liability is low.
                    </span>
                  </li>
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      TDS on Cash Withdrawals (Section 194N):
                    </strong>
                    <span className="tds-icon-desc">
                      Banks are required to deduct TDS on cash withdrawals
                      exceeding certain limits (e.g., ?20 lakhs for non-filers,
                      ?1 crore for filers) in a financial year.
                    </span>
                  </li>
                  <li>
                    <strong className="tds-icon-title">
                      <CheckCircle size={18} className="tds-icon" />
                      Form 26AS:
                    </strong>
                    <span className="tds-icon-desc">
                      This annual statement provides details of all TDS (and
                      TCS) deducted against your PAN and deposited with the
                      government. It's crucial for verifying TDS credits.
                    </span>
                  </li>
                </ul>
              </div>
            </section>
        
            {/* FAQs Section */}
            <section className="">
              <h2 className="header-main ">
                Frequently Asked Questions (FAQs) about TDS
              </h2>
              <div className="tds-faq-list">
                {tdsFaqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`tds-faq-item${openFAQ === i ? " active" : ""}`}
                    onClick={() => toggleFAQ(i)}
                  >
                    <div className={`tds-faq-question${openFAQ !== i ? " tds-faq-question-inactive" : ""}`}>
                      <p className="">{faq.q}</p>
                      <ChevronDown size={18} className={`calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
                    </div>
                    <p className={`tds-faq-answer${openFAQ === i ? "" : " inactive"}`}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
        
            {/* Conclusion */}
            <section className="tds-footer-note-box">
              <p className="tds-footer-note">
                The UniCX TDS Calculator is your reliable partner in navigating
                the complexities of tax deducted at source. Empower yourself
                with accurate calculations and ensure seamless compliance with
                Indian tax laws. Try it now and simplify your financial life!
                <br />
                <br />
                This TDS Calculator and the information provided are developed
                and maintained by
                <strong className="bold-content">
                  UniCX (UniconsultX Solutions Private Limited)
                </strong>
                to help users understand TDS calculations. While we strive for
                accuracy, the information is for illustrative purposes only and
                should not be considered financial advice. For personalized tax
                advice or specific product details, always consult with a
                qualified tax professional.
              </p>
            </section>
          </div>
        </section>
      </div>{" "}
    </div>
    {/* </div> */}
    </>
    
  );
}

export default TDSCalculator;





