import React, { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  ChevronDown,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import gstlogo from "../assets/images/calculators_img/gstlogo.png";
import calculator from "../assets/images/calculators_img/BG IMAGES/how2.png";
import benifite from "../assets/images/calculators_img/BG IMAGES/2 png .png";

import "../calculatorCss/Gst.css";
import Header from "../component/Header";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";
function GSTCalculator() {
  const [show, setShow] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [cost, setCost] = useState("100");
  const [gst, setGst] = useState(["0.00"]);
  const [error, setError] = useState("");
  const [supplyType, setSupplyType] = useState("Inter-state");
  const rates = [0.1, 0.25, 1, 1.5, 3, 5, 6, 7.5, 12, 18, 28];
  const [gstAmount, setGstAmount] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [igstAmount, setIgstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // GST calculation logic
  const toggleShow = () => setShowAll(!showAll);
  useEffect(() => {
    const costNum = parseFloat(cost) || 0;
    const gstNum = parseFloat(gst) || 0;

    // GST Exclusive
    const gstAmt = (costNum * gstNum) / 100;
    const totalAmt = costNum + gstAmt;

    // GST Inclusive
    const basePrice = (costNum * 100) / (100 + gstNum);
    const gstInclusive = costNum - basePrice;

    const cgst = show ? gstAmt / 2 : gstInclusive / 2;
    const sgst = show ? gstAmt / 2 : gstInclusive / 2;
    const igst = show ? gstAmt : gstInclusive;

    if (show) {
      setGstAmount(gstAmt.toFixed(2));
      setTotalAmount(totalAmt.toFixed(2));
    } else {
      setGstAmount(gstInclusive.toFixed(2));
      setTotalAmount(basePrice.toFixed(2));
    }

    setCgstAmount(cgst.toFixed(2));
    setSgstAmount(sgst.toFixed(2));
    setIgstAmount(igst.toFixed(2));
    if (!gst && rates?.length > 0) {
      setGst(rates[0]);
    }
  }, [cost, gst, show, rates]);

  const handleCostChange = (e) => {
    const value = e.target.value;

    // Allow empty string (user clearing input)
    if (value === "") {
      setCost("");
      setError("");
      return;
    }

    // Ensure it's a number
    if (!/^\d+$/.test(value)) {
      setError("Only numbers are allowed");
      return;
    }

    // Check for 15 digit limit
    if (value > 1000000000000) {
      setError("Value must be between 1 and 10000000000");
      return;
    }

    setCost(value);
    setError("");
  };

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (i) => {
    setOpenFAQ(openFAQ === i ? null : i);
  };

  const faqs = [
    {
      q: "What are the major GST changes effective July 2025?",
      a: "From July 1, 2025, GSTR-3B will be hard-locked based on auto-populated data from GSTR-1/1A/IFF, meaning manual edits for outward supply liability will no longer be allowed. A strict three-year time limit for filing all GST returns (GSTR-1, 3B, etc.) is also now in effect. The new E-Way Bill 2.0 portal has also been launched for improved stability and real-time synchronization.",
    },
    {
      q: "Why is GSTR-3B becoming non-editable from July 2025?",
      a: "This change aims to ensure greater consistency between GSTR-1 (sales data) and GSTR-3B (tax payment summary), reducing discrepancies, curbing fraudulent Input Tax Credit (ITC) claims, and moving towards a more digitally governed and accurate GST ecosystem.",
    },
    {
      q: "What is the new 3-year time limit for filing GST returns?",
      a: "Effective July 1, 2025, any GST return (including GSTR-1, GSTR-3B, GSTR-9) that is more than three years past its original due date will be permanently blocked from filing on the GST portal. Taxpayers with pending returns older than this limit were advised to clear them by June 30, 2025.",
    },
    {
      q: "Is the UniCX GST calculator updated for 2025 with the latest rules?",
      a: "Yes. UniCX is committed to keeping this calculator and all our resources fully updated in line with current Indian GST rules, latest notifications, and all applicable slab rates to ensure accuracy for 2025 and beyond.",
    },
    {
      q: "What are the current GST slab rates in India?",
      a: "The primary GST slab rates are 0%, 5%, 12%, 18%, and 28%. Specific goods and services fall under different slabs. It's important to note that discussions are ongoing regarding potential rationalization of these slabs, including the possible removal of the 12% bracket. Some essential items are exempt from GST.",
    },
    {
      q: "What is Input Tax Credit (ITC) under GST?",
      a: "<strong>Input Tax Credit (ITC)</strong> is a fundamental mechanism under GST that allows businesses to claim credit for the GST paid on purchases of goods or services used in the course or furtherance of business. This reduces the overall tax burden by avoiding the cascading effect of taxes.",
    },
  ];

  return (
    <>
      <Header />
      <section className="gst-section ">
  <div className="gst-container ">
    <div className="">
    <div>
      <section className="gst-header">
        <h1 className="gst-title">
          GST Calculator
        </h1>
      </section>
      <div className="gst-grid ">
        {/* Left section */}
        <div className="">
          <div className="gst-field">
            <label className="gst-label">
              Amount (?)
            </label>
            <div className={`gst-input-group ${error ? "gst-input-error" : "gst-input-focus"}`}>
              <FaRupeeSign className="gst-icon" />
              <input
                type="number"
                value={cost}
                onChange={handleCostChange}
                className="gst-input"
                placeholder="0.00"
              />
            </div>
            {error && <p className="error-text">{error}</p>}
          </div>

          {/* Calculation Type */}
          <div className="gst-field">
            <label className="gst-label">
              Calculation Type
            </label>
            <div className="gst-type-group">
              <button
                className={`gst-type-btn ${show ? "gst-type-active" : "gst-type-inactive"}`}
                onClick={() => setShow(true)}
              >
                Adding GST
              </button>
              <button
                className={`gst-type-btn ${!show ? "gst-type-active" : "gst-type-inactive"}`}
                onClick={() => setShow(false)}
              >
                Exclusive GST
              </button>
            </div>
          </div>

          {/* GST Rate Selection */}
          <div className="gst-field">
            <label className="gst-label">
              GST Rate (%)
            </label>
            <div className="gst-rate-grid">
              {rates.map((rate, index) => {
                const isVisible = showAll || index < 11;
                const isActive = parseFloat(gst) === rate;
                return (
                  isVisible && (
                    <button
                      key={index}
                      onClick={() => setGst(rate)}
                      className={`gst-rate-btn ${isActive ? "gst-rate-active" : "gst-rate-inactive"}`}
                    >
                      {rate}%
                    </button>
                  )
                );
              })}
            </div>
          </div>

          {/* Supply Type */}
          <div className="gst-field">
  <label htmlFor="supplyType" className="gst-label">
    Supply Type
  </label>
  <div className="gst-select-group">
    <select
      id="supplyType"
      className="gst-select"
      value={supplyType}
      onChange={(e) => setSupplyType(e.target.value)}
      aria-label="Select supply type"
    >
      <option value="Inter-state">Inter-state</option>
      <option value="Intra-state">Intra-state</option>
    </select>
  </div>
</div>
        </div>

        {/* Right - Results */}
        <div className="gst-results">
          <div className="gst-results-inner">
            <div className="gst-result-row">
              <span className="gst-result-field">Original Amount</span>
              <span className="gst-result-row-span">₹ {parseFloat(cost).toFixed(2)}</span>
            </div>
            <div className="gst-result-row">
              <span className="gst-result-field">GST Amount</span>
              <span className="gst-result-row-span">₹ {gstAmount}</span>
            </div>
            <div className="gst-breakdown">
              <p className="gst-breakdown-title">
                Breakdown
              </p>
              {supplyType === "Intra-state" ? (
                <>
                  <div className="gst-result-row">
                    <span className="gst-result-field">CGST (50%)</span>
                    <span className="gst-result-row-span">₹ {cgstAmount}</span>
                  </div>
                  <div className="gst-result-row">
                    <span className="gst-result-field">SGST (50%)</span>
                    <span className="gst-result-row-span">₹ {sgstAmount}</span>
                  </div>
                </>
              ) : (
                <div className="gst-result-row">
                  <span className="gst-result-field">IGST (100%)</span>
                  <span className="gst-result-row-span">₹ {igstAmount}</span>
                </div>
              )}
              <div className="gst-result-row gst-mt">
                <span className="gst-result-field">GST Rate</span>
                <span className="gst-result-row-span">{gst}%</span>
              </div>
              <div className="gst-total-row">
                <h2>Total Amount</h2>
                <p>₹ {totalAmount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  


           <div className="gst-info-section ">
  <div className="gst-info-content">
    {/* Intro - Expanded */}
    <section className="gst-info-intro ">
      <h2 className="gst-info-title" >
        <AlertCircle size={18} className="gst-info-icon" />
        Important GST Updates: What's New from July 2025!
      </h2>
      <p className="gst-info-highlight" style={{marginLeft:'25px'}}>
        The <strong>GST framework in India</strong> has undergone significant procedural updates effective <strong>July 1, 2025</strong>. It is crucial for all taxpayers to understand and adapt to these changes to maintain compliance and avoid penalties.
      </p>
      <ul className="gst-info-list">
        <li>
          <strong className="gst-info-list-title">
            <CheckCircle size={18} className="gst-info-list-icon" />
            GSTR-3B Auto-Locking:
          </strong>
          <span className="gst-info-list-desc">
            From the <strong>July 2025 tax period</strong> (to be filed in August), your <strong>GSTR-3B</strong> will be <strong>hard-locked</strong> based on auto-populated data from <strong>GSTR-1, GSTR-1A, or IFF</strong>. Manual editing of outward supply liability will no longer be permitted. Ensure your <strong>GSTR-1/IFF</strong> is accurate, and use <strong>GSTR-1A</strong> for any corrections *before* filing GSTR-3B.
          </span>
        </li>
        <li>
          <strong className="gst-info-list-title">
            <Clock size={18} className="gst-info-list-icon" />
            Strict 3-Year Time Limit for Returns:
          </strong>
          <span className="gst-info-list-desc">
            A <strong>strict three-year deadline</strong> is now enforced for filing all GST returns (<strong>GSTR-1, 3B, 4, 5, 5A, 6, 7, 8, 9</strong>) from their original due dates. Returns older than this limit were permanently blocked from <strong>July 1, 2025</strong>. Ensure all past compliance is up to date to avoid loss of Input Tax Credit (ITC) or penalties.
          </span>
        </li>
        <li>
          <strong className="gst-info-list-title">
            <CheckCircle size={18} className="gst-info-list-icon" />
            New E-Way Bill Portal 2.0:
          </strong>
          <span className="gst-info-list-desc">
            The <strong>E-Way Bill 2.0 portal</strong> (accessible at <a href="https://ewaybill2.gst.gov.in" target="_blank" rel="noopener noreferrer" className="gst-info-link">ewaybill2.gst.gov.in</a>) has been launched for enhanced stability, uninterrupted access, and real-time synchronization of data with the existing portal. Your existing credentials work on both.
          </span>
        </li>
        <li>
          <strong className="gst-info-list-title">
            <CheckCircle size={18} className="gst-info-list-icon" />
            12% GST Slab Review:
          </strong>
          <span className="gst-info-list-desc">
            The GST Council is actively discussing a major revamp, potentially <strong>removing the 12% GST slab</strong> and redistributing items between the 5% and 18% brackets. Stay tuned for official announcements, as this could significantly impact various goods and services.
          </span>
        </li>
      </ul>
      <p className="gst-info-contact">
        UniCX is here to help you navigate these changes! For personalized guidance, <a href="#contact" className="gst-info-link">contact our GST experts</a>.
      </p>
    </section>

    {/* What is GST */}
    <section className="">
        <h2 className="gst-section-title">
            What is Goods and Services Tax (GST) in India?
          </h2>
      <div className="gst-section-grid">
        <div>
        
          <span>
            <p className="gst-section-paragraph">
              <strong className="gst-blue">GST (Goods and Services Tax)</strong> is a landmark unified, indirect tax system introduced in India on <strong>July 1, 2017</strong>. It marked a significant reform, replacing a multitude of cascading indirect taxes such as <strong className="gst-blue">Value Added Tax (VAT)</strong>, <strong className="gst-blue">Service Tax, Excise Duty</strong>, and more. GST is levied at each step of the supply chain on the "supply" of goods and services and is ultimately borne by the final consumer, creating a "One Nation, One Tax" regime across India.
            </p>
            <p className="gst-section-paragraph">
              As a <strong className="gst-blue">comprehensive, multi-stage, destination-based tax</strong>, GST aims to streamline taxation, reduce complexity, and foster economic growth by eliminating the tax-on-tax effect through the robust <strong className="gst-blue">Input Tax Credit (ITC)</strong> mechanism. Goods and services are primarily categorized into <strong className="gst-blue">five distinct GST slabs:</strong> <strong className="gst-blue">0%, 5%, 12%, 18%, and 28%</strong>, although some products like petroleum, alcoholic drinks, and electricity are not taxed under GST and fall under the purview of individual state governments.
            </p>
          </span>
        </div>
        <div className="gst-img-box">
          <img
            src={gstlogo}
            alt="GST India Logo | Goods and Services Tax explained"
            className="gst-img"
          />
        </div>
      </div>
    </section>

    {/* Types of GST */}
    <section className="">
      <h2 className="gst-section-title">
        Types of GST in India: CGST, SGST, IGST, UTGST Explained
      </h2>
      <p className="gst-section-paragraph">
        Understanding the <strong className="gst-blue">four types of GST</strong> is crucial for accurate tax computation and compliance, as they apply depending on the nature and location of the supply:
      </p>
      <div className="gst-section-grid">
        <div className="gst-section-card">
          <h3 className="gst-card-title">CGST (Central GST)</h3>
          <p className="gst-card-desc">
            <strong>Central Goods and Services Tax</strong>. Collected by the <strong>Central Government</strong> for <strong>intra-state (within the same state/UT)</strong> supply of goods and services. Governed by the CGST Act and is charged along with SGST (or UTGST).
          </p>
        </div>
        <div className="gst-section-card">
          <h3 className="gst-card-title">SGST (State GST)</h3>
          <p className="gst-card-desc">
            <strong>State Goods and Services Tax</strong>. Collected by the <strong>State Government</strong> for <strong>intra-state (within the same state/UT)</strong> supply of goods and services. Governed by the respective SGST Act and is charged along with CGST.
          </p>
        </div>
        <div className="gst-section-card">
          <h3 className="gst-card-title">IGST (Integrated GST)</h3>
          <p className="gst-card-desc">
            <strong>Integrated Goods and Services Tax</strong>. Collected by the <strong>Central Government</strong> on <strong>inter-state (between different states/UTs)</strong> supply of goods and services, as well as on <strong>imports</strong>. The collected IGST is then distributed among the respective states.
          </p>
        </div>
        <div className="gst-section-card">
          <h3 className="gst-card-title">UTGST (Union Territory GST)</h3>
          <p className="gst-card-desc">
            <strong>Union Territory Goods and Services Tax</strong>. Applicable on the supply of goods or services within any of <strong>India's eight Union Territories</strong>. Collected along with CGST, similar to SGST.
          </p>
        </div>
      </div>
    </section>

    {/* How to Use Calculator */}
    <section className="">
      <h2 className="gst-section-title">
        How to Use the UniCX Free Online GST Calculator
      </h2>
      <div className="gst-section-grid">
        <div>
          <p className="gst-section-paragraph">
            Our <strong className="gst-blue">user-friendly GST calculator</strong> simplifies complex tax computations. Follow these simple steps to get <strong>accurate results instantly</strong>:
          </p>
          <ol className="gst-section-ol">
            <li><strong>Enter the Price:</strong> Input the base price of your goods or services in the designated "Amount" field.</li>
            <li><strong>Select Calculation Type:</strong> Choose whether the price you entered is "Inclusive of Tax" (to extract GST) or "Exclusive of Tax" (to add GST).</li>
            <li><strong>Choose GST Rate:</strong> Select the applicable GST rate (e.g., 5%, 12%, 18%, or 28%) from the available options. This corresponds to the tax slab for your specific product or service.</li>
            <li><strong>Pick Supply Type (if applicable):</strong> Indicate if the supply is Inter-state or Intra-state. Our calculator intelligently determines the <strong className="gst-blue">CGST, SGST</strong>, or <strong className="gst-blue">IGST</strong> components.</li>
            <li><strong>View Instant Breakdown:</strong> The calculator will automatically display a clear breakdown of the total amount, GST amount, and the net amount, helping you understand your tax liabilities.</li>
          </ol>
        </div>
        <div className="gst-img-box gst-img-hover">
          <img
            src={calculator}
            alt="GST India Logo | Goods and Services Tax explained"
            className="gst-img"
          />
        </div>
      </div>
    </section>

    {/* GST Calculation Formulas & Examples */}
    <section className="">
      <h2 className="gst-section-title">
        GST Calculation Formulas & Practical Examples
      </h2>
      <p className="gst-section-paragraph">
        While our <strong className="gst-blue">UniCX GST Calculator</strong> automates everything, understanding the underlying formulas can provide deeper insights into your tax liabilities:
      </p>
      <h3 className="gst-card-title">1. When the Price is Exclusive of GST (Adding GST):</h3>
      <ul className="gst-section-ul">
        <li><strong>GST Amount</strong> = (Value of Supply x GST%) / 100</li>
        <li><strong>Price to be Charged</strong> = Value of Supply + GST Amount</li>
      </ul>
      <h3 className="gst-card-title">2. When the Price is Inclusive of GST (Removing GST):</h3>
      <ul className="gst-section-ul">
        <li><strong>GST Amount</strong> = Value of Supply – [Value of Supply x {`{100 / (100 + GST%)}`} ]</li>
        <li><strong>Original Price (Pre-GST)</strong> = Value of Supply - GST Amount</li>
      </ul>
     <div className="table-container">
  <div className="table-wrapper">
    <table className="pricing-table">
      <thead className="table-head">
        <tr>
          <th className="table-heading">Particulars</th>
          <th className="table-heading">Amount</th>
        </tr>
      </thead>
      <tbody className="table-body">
        <tr className="row-alt">
          <td className="table-cell">Invoice value</td>
          <td className="table-cell">?100,000</td>
        </tr>
        <tr>
          <td className="table-cell">GST @12%</td>
          <td className="table-cell">?12,000</td>
        </tr>
        <tr className="row-alt">
          <td className="table-cell">Price to be charged on the Invoice</td>
          <td className="table-cell">?112,000</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

      <p className="gst-section-paragraph">
        <strong>Impact of GST across the Supply Chain:</strong> GST's <strong>Input Tax Credit (ITC) mechanism</strong> significantly reduces the cascading effect of taxes (tax on tax), benefiting <strong>manufacturers, wholesalers, and retailers</strong>, and ultimately leading to potentially lower prices for the <strong>end consumer</strong>.
      </p>
    </section>

    {/* Who Can Benefit */}
    <section className="">
      <h2 className="gst-section-title">
        Who Can Benefit from the UniCX GST Calculator?
      </h2>
      <p className="gst-section-paragraph">
        Our <strong>GST calculator</strong> is a versatile tool designed to assist a wide range of users in accurately managing their GST-related calculations:
      </p>
      <ul className="gst-section-ul">
        <li><strong>Small business owners & startups:</strong> For accurate invoicing and expense tracking.</li>
        <li><strong>Freelancers and service providers:</strong> To easily determine service charges inclusive or exclusive of GST.</li>
        <li><strong>Retailers and e-commerce sellers:</strong> For precise product pricing and tax compliance.</li>
        <li><strong>Manufacturers and Wholesalers:</strong> To calculate GST payable at each stage of the supply chain and manage Input Tax Credit effectively.</li>
        <li><strong>Customers:</strong> To verify the final GST charges on purchases.</li>
        <li><strong>Accountants & Tax Professionals:</strong> As a quick verification tool for clients' GST computations.</li>
      </ul>
      <div className="gst-img-box gst-img-hover gst-benefit-img-bg">
        <img
          src={benifite}
          alt="GST India Logo | Goods and Services Tax explained"
          className="gst-img gst-benefit-img"
        />
      </div>
    </section>

    {/* Advantages */}
    <section className="">
      <h2 className="gst-section-title">
        Advantages of Using the UniCX GST Calculator
      </h2>
      <p className="gst-section-paragraph">
        Leveraging our <strong>free online GST calculator</strong> offers significant benefits for individuals and businesses alike:
      </p>
      <ul className="gst-section-ul">
        <li><strong>Accuracy Guaranteed:</strong> Automated calculations eliminate the common errors associated with manual tax computations, ensuring precise GST calculations for invoicing, pricing, and tax filings.</li>
        <li><strong>Significant Time Savings:</strong> Get instant results, freeing up valuable time that can be redirected to core business activities and strategic planning.</li>
        <li><strong>Simplifies Complexity:</strong> Easily bifurcate between CGST, SGST, and IGST components, providing clarity in your tax breakdown.</li>
        <li><strong>Aids Budgeting & Pricing:</strong> Quickly determine net or gross product prices based on GST rates, which is essential for effective financial planning and competitive pricing.</li>
        <li><strong>Ensures Compliance:</strong> Helps you stay on top of your GST liabilities and prevents potential penalties due to calculation errors.</li>
        <li><strong>User-Friendly Interface:</strong> Designed for ease of use, even for individuals without extensive tax knowledge, making GST accessible to everyone.</li>
      </ul>
    </section>

    {/* Tip box */}
    <section className="">
      <div className="gst-tip-box">
        <p>
          <strong>UniCX Tip:</strong> For B2B invoices, always display both CGST and SGST (or IGST for inter-state supplies) clearly. This helps your clients accurately claim their <strong>Input Tax Credit (ITC)</strong>, which is a cornerstone of the GST regime. Remember the new GSTR-3B locking rules for July 2025!
        </p>
      </div>
    </section>

    {/* Expert Support */}
    <section id="contact" className="">
      <h2 className="gst-section-title">
        Beyond Calculations: UniCX - Your Partner in GST Compliance & Growth
      </h2>
      <p className="gst-section-paragraph">
        At <strong>UniconsultX Solutions Private Limited (UniCX)</strong>, our commitment extends beyond providing a powerful GST calculator. We understand that <strong>GST is a dynamic and evolving tax regime</strong>, and navigating its complexities requires more than just tools. That's why we offer <strong>comprehensive support and resources</strong> to ensure your business remains compliant and leverages GST for sustainable growth.
      </p>
      <h3 className="gst-card-title">Our Expert GST Services Include:</h3>
      <ul className="gst-section-ul">
        <li><strong>GST Registration Guidance:</strong> Seamless assistance with obtaining your <strong>Goods and Services Tax Identification Number (GSTIN)</strong>.</li>
        <li><strong>GST Return Filing Support:</strong> Expert help with accurate and timely filing of various GST returns (e.g., GSTR-1, GSTR-3B), keeping in mind the new 3-year time limit and GSTR-3B auto-locking.</li>
        <li><strong>Input Tax Credit (ITC) Optimization:</strong> Strategies to maximize your ITC claims, reducing your overall tax liability and ensuring compliance with the latest rules.</li>
        <li><strong>GST Advisory & Consulting:</strong> Personalized advice on complex GST issues, ensuring your business adheres to the latest regulations and avoids pitfalls, including guidance on new e-way bill procedures.</li>
        <li><strong>GST Audit & Reconciliation:</strong> Support for GST audits and reconciling your books with GST records.</li>
        <li><strong>Educational Resources:</strong> Access to informative articles, FAQs, and timely updates on GST laws and amendments.</li>
      </ul>
      <p className="gst-section-paragraph">
        <strong>Stay Ahead with UniCX:</strong> We are dedicated to being your reliable source for all things GST. Explore our website for more in-depth articles, common FAQs, and the latest updates from the GST Council. Partner with UniCX for peace of mind in your GST journey.
      </p>
      <div className="gst-expert-btn-box">
        <button className="gst-expert-btn">
          Get Expert GST Consultation
        </button>
      </div>
    </section>

    {/* FAQs */}
    <section className="">
      <h2 className="gst-section-title">
        Frequently Asked Questions (FAQs) about GST
      </h2>
      <div className="gst-faq-list">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`gst-faq-item${openFAQ === i ? " active" : ""}`}
            onClick={() => toggleFAQ(i)}
          >
            <div className={`gst-faq-question${openFAQ !== i ? " gst-faq-question-inactive" : ""}`}>
              <p className="gst-faq-q">{faq.q}</p>
              <ChevronDown size={18} className={`gst-faq-chevron calc-faq-chevron${openFAQ === i ? " is-open" : ""}`} />
            </div>
            <p className={`gst-faq-answer${openFAQ === i ? "" : " inactive"}`}>
              <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.a) }} />
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* Footer note */}
    <section className=" gst-footer-note-box">
      <p className="gst-footer-note">
        This GST calculator and information is developed and maintained by <strong>UniCX (UniconsultX Solutions Private Limited)</strong> to help users simplify Goods and Services Tax computations as per current Indian tax laws. For complex tax situations or personalized advice, always consult with a qualified tax professional or <a href="#contact" className="gst-info-link">contact UniCX directly</a>.
      </p>
    </section>
  </div>
</div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}

export default GSTCalculator;




