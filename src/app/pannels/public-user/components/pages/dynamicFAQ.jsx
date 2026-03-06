import { useState, useEffect, useRef } from "react";
import { getFaqBootstrap } from "../../../../../adminApi";
import sanitizeHtml from "../../../../../utils/sanitizeHtml";
import { LuMessageSquareShare } from "react-icons/lu";

const DynamicFaqTabs = () => {
    const [categories, setCategories] = useState([]);
    const [faqs, setFAQs] = useState([]);
    const [activeTab, setActiveTab] = useState("General");
    const [openIndexes, setOpenIndexes] = useState({ General: 0 });
    const faqRefs = useRef({});

    const generalFaqs = [
        {
            _id: "general-1",
            question: "What is UniConsultX and how can it help my business?",
            answer:
                "UniConsultX is an all-in-one business consulting firm offering legal, financial, digital, and licensing services. We help you start, structure, and scale your business right from choosing the right brand name to getting it legally protected, financially compliant, digitally visible, and properly licensed.",
        },
        {
            _id: "general-2",
            question: "Why do I need a professional website for my business?",
            answer:
                "A professional website acts as your 24/7 digital storefront. It builds credibility, showcases your services, reaches a wider audience, and generates leads.",
        },
        {
            _id: "general-3",
            question: "Why is good graphic design important for my brand?",
            answer:
                "Good graphic design makes your business look professional and trustworthy. It helps create strong brand identity and improves recognition.",
        },
        {
            _id: "general-4",
            question: "What kind of businesses do you work with?",
            answer:
                "We work with startups, small businesses, growing brands, and enterprises. Our solutions are tailored to your goals and budget.",
        },
        {
            _id: "general-5",
            question: "Do I need to be located in Indore to work with you?",
            answer:
                "No. We work with clients across India and globally through calls, email, and virtual meetings.",
        },
        {
            _id: "general-6",
            question: "What is your design process from start to finish?",
            answer:
                "Our process is collaborative and structured: Discovery and consultation, project proposal, design mockups, development/build, review and revisions, and final launch or delivery.",
        },
        {
            _id: "general-7",
            question: "What do you need from me to get started?",
            answer:
                "Usually we need your logo (if available), brand references, and text/images for your pages. If needed, our team can also help with content and assets.",
        },
        {
            _id: "general-8",
            question: "How involved can I be in the process?",
            answer:
                "As involved as you want. We keep your feedback loop active at every stage and align the output with your goals.",
        },
        {
            _id: "general-9",
            question: "Will my website be mobile-friendly?",
            answer:
                "Yes. We build responsive interfaces that adapt properly across desktop, tablet, and mobile devices.",
        },
        {
            _id: "general-10",
            question: "Will I be able to update the website myself?",
            answer:
                "Yes. We use manageable CMS-based setups where your team can update text, images, and content without deep technical dependency.",
        },
    ];

    useEffect(() => {
        const fetchFAQData = async () => {
            try {
                const data = await getFaqBootstrap();
                setCategories(data.categories || []);
                setFAQs(data.faqs || []);
            } catch (error) {
                console.error("Error fetching FAQ data:", error);
            }
        };

        fetchFAQData();
    }, []);

    const toggleFAQ = (tabKey, index) => {
        setOpenIndexes((prev) => ({
            ...prev,
            [tabKey]: prev[tabKey] === index ? -1 : index,
        }));
    };

    const getEditorPlainText = (value) => {
        const safeHtml = sanitizeHtml(String(value || ""));
        if (typeof window === "undefined") {
            return safeHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        }
        const template = document.createElement("template");
        template.innerHTML = safeHtml;
        return (template.content.textContent || "").replace(/\s+/g, " ").trim();
    };

    const renderFaqAccordion = (faqList, categoryName, tabKey) => {
        const openIndex = openIndexes[tabKey] ?? 0;

        return (
            <div className="faq-main-sections home-faq-main">
                <div className="faqs-containers home-faq-container">
                    <div className="faqs-lefts home-faq-left">
                        <p className="faq-labels">FAQS</p>
                        <h2 className="faq-titles">Questions? We're glad you asked</h2>
                        <p className="faq-subtitles">Find quick answers about {categoryName}.</p>
                    </div>

                    <div className="faqs-rights home-faq-right">
                        {faqList.length ? (
                            faqList.map((faq, index) => (
                                <div
                                    key={faq._id || `${tabKey}-${index}`}
                                    className={`faq-items ${openIndex === index ? "active" : ""}`}
                                    onClick={() => toggleFAQ(tabKey, index)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            toggleFAQ(tabKey, index);
                                        }
                                    }}
                                >
                                    <div className="faq-questions">
                                        <span>
                                            {index + 1}. {getEditorPlainText(faq.question)}
                                        </span>
                                        <span className="faq-icons">{openIndex === index ? "-" : "+"}</span>
                                    </div>
                                    <div
                                        className="faq-answers-wrapper"
                                        ref={(el) => {
                                            if (!faqRefs.current[tabKey]) faqRefs.current[tabKey] = [];
                                            faqRefs.current[tabKey][index] = el;
                                        }}
                                        style={{
                                            maxHeight:
                                                openIndex === index
                                                    ? `${faqRefs.current[tabKey]?.[index]?.scrollHeight || 1000}px`
                                                    : "0px",
                                        }}
                                    >
                                        <div
                                            className="faq-answers"
                                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer) }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="faq-items faq-items-empty" role="status" aria-live="polite">
                                    <p className="home-faq-empty-msg">
                                        No FAQs available yet.{" "}
                                        <span className="home-faq-empty-highlight">Need help? Contact support.</span>
                                    </p>
                                </div>
                                <div className="faq-items faq-items-form-wrap">
                                    <div className="contact-form-card home-faq-contact-card">
                                        <h3 style={{ color: "black" }}>Get in Touch</h3>
                                        <form>
                                            <label htmlFor={`faq-name-${tabKey}`}>Name</label>
                                            <input type="text" id={`faq-name-${tabKey}`} placeholder="Your Name" required />
                                            <label htmlFor={`faq-email-${tabKey}`}>Email</label>
                                            <input
                                                type="email"
                                                id={`faq-email-${tabKey}`}
                                                placeholder="you@example.com"
                                                required
                                            />
                                            <label htmlFor={`faq-message-${tabKey}`}>Message</label>
                                            <textarea
                                                id={`faq-message-${tabKey}`}
                                                rows={3}
                                                placeholder="How can we help?"
                                                required
                                                defaultValue=""
                                            />
                                            <button type="submit">
                                                <LuMessageSquareShare
                                                    size={28}
                                                    style={{ padding: "0 0.2rem 0 0" }}
                                                />{" "}
                                                Send Message
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="section-full p-t120 p-b90 site-bg-white FAQ home-faq-block">
            <style>{`
                .home-faq-block .nav-tabs {
                    border-bottom: none;
                    gap: 10px;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 1.4rem;
                }
                .home-faq-block .nav-tabs .nav-link {
                    border: 1px solid #dbe7fb;
                    background: #f5f9ff;
                    color: #1e3a5f;
                    border-radius: 999px;
                    font-weight: 600;
                    font-size: 14px;
                    padding: 9px 16px;
                    line-height: 1.2;
                    transition: all 0.25s ease;
                }
                .home-faq-block .nav-tabs .nav-link:hover {
                    border-color: #9bbce6;
                    background: #edf4ff;
                    color: #174a8d;
                }
                .home-faq-block .nav-tabs .nav-link.active {
                    border-color: #1967d2;
                    background: linear-gradient(90deg, #9bbee7, #1967D2);
                    color: #fff;
                    box-shadow: 0 10px 20px rgba(25, 103, 210, 0.22);
                }
                .home-faq-main {
                    padding: 2.5rem 1.5rem;
                    background:
                        radial-gradient(circle at 12% 8%, rgba(171, 198, 236, 0.32), transparent 42%),
                        radial-gradient(circle at 92% 88%, rgba(131, 172, 228, 0.24), transparent 35%),
                        linear-gradient(145deg, rgba(255, 255, 255, 0.62), rgba(235, 245, 255, 0.45));
                    border: 1px solid rgba(255, 255, 255, 0.58);
                    border-radius: 26px;
                    box-shadow:
                        0 16px 32px rgba(15, 59, 120, 0.12),
                        inset 0 1px 0 rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(14px) saturate(140%);
                    -webkit-backdrop-filter: blur(14px) saturate(140%);
                }
                .home-faq-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 48px;
                }
                .home-faq-left {
                    position: sticky;
                    top: 120px;
                    align-self: start;
                    height: fit-content;
                    padding: 0 0 0 1.3rem;
                }
                .home-faq-right {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .home-faq-main .faq-items {
                    border: 1px solid rgba(255, 255, 255, 0.62);
                    border-radius: 16px;
                    padding: 18px 18px 17px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    background: linear-gradient(155deg, rgba(255, 255, 255, 0.58), rgba(238, 246, 255, 0.34));
                    backdrop-filter: blur(10px) saturate(130%);
                    -webkit-backdrop-filter: blur(10px) saturate(130%);
                }
                .home-faq-main .faq-items.active {
                    background: linear-gradient(165deg, rgba(255, 255, 255, 0.74), rgba(239, 247, 255, 0.46));
                    border-color: rgba(255, 255, 255, 0.82);
                    box-shadow:
                        0 14px 26px rgba(25, 103, 210, 0.16),
                        inset 0 1px 0 rgba(255, 255, 255, 0.86);
                }
                .home-faq-main .faq-items:hover {
                    border-color: #bfd5f6;
                    transform: translateY(-1px);
                }
                .home-faq-main .faq-items-empty {
                    cursor: default;
                    color: #4c6382;
                    text-align: left;
                    font-weight: 500;
                    background: #ffffff;
                    border: 1px solid transparent;
                    animation: none;
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                    max-width: 520px;
                    width: 100%;
                    margin: 0 auto;
                    box-shadow:
                        0 12px 24px rgba(25, 103, 210, 0.14),
                        0 2px 6px rgba(15, 23, 42, 0.06);
                }
                .home-faq-main .home-faq-empty-msg {
                    margin-bottom: 0;
                    color: #4c6382;
                    font-size: 15px;
                    font-weight: 600;
                }
                .home-faq-main .home-faq-empty-highlight {
                    color: #1967d2;
                    font-weight: 700;
                }
                .home-faq-main .faq-items-form-wrap {
                    animation: none;
                    text-align: left;
                    max-width: 520px;
                    width: 100%;
                    margin: 0 auto;
                    border: none;
                    background: transparent;
                    box-shadow: none;
                    padding: 0;
                }
                .home-faq-main .faq-items-empty:hover {
                    transform: none;
                    border: 1px dashed #b9cde9;
                    box-shadow:
                        0 12px 24px rgba(25, 103, 210, 0.14),
                        0 2px 6px rgba(15, 23, 42, 0.06);
                }
                .home-faq-main .home-faq-contact-card {
                    max-width: 520px;
                    width: 100%;
                    margin-top: 0.25rem;
                    padding: 1.4rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    background-image: linear-gradient(
                        to top right,
                        #ffffff 20%,
                        #B3D1F7 60%,
                        #ffffff 85%
                    );
                    background-color: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                }
                .home-faq-main .home-faq-contact-card h3 {
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }
                .home-faq-main .home-faq-contact-card label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 0.25rem;
                }
                .home-faq-main .home-faq-contact-card input,
                .home-faq-main .home-faq-contact-card textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 0.95rem;
                    color: #111827;
                    outline: none;
                    margin-bottom: 1rem;
                }
                .home-faq-main .home-faq-contact-card input:focus,
                .home-faq-main .home-faq-contact-card textarea:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
                }
                .home-faq-main .home-faq-contact-card button {
                    width: 100%;
                    padding: 0.75rem;
                    background: #000000;
                    color: #ffffff;
                    font-size: 1rem;
                    font-weight: 600;
                    border-radius: 0.5rem;
                    border: none;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                    transition: color 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2px;
                }
                .home-faq-main .home-faq-contact-card button::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: #1967d2;
                    z-index: -1;
                    transition: left 0.4s ease;
                }
                .home-faq-main .home-faq-contact-card button:hover::before {
                    left: 0;
                }
                .home-faq-main .home-faq-contact-card button:hover {
                    color: #fff;
                }
                .home-faq-main .faq-questions {
                    display: flex;
                    justify-content: space-between;
                    gap: 12px;
                    font-weight: 600;
                    color: #183153;
                    font-size: 15.5px;
                    line-height: 1.45;
                }
                .home-faq-main .faq-icons {
                    width: 22px;
                    min-width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    border: 1px solid #8eb3e6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 1;
                    color: #1967d2;
                    background: #edf4ff;
                }
                .home-faq-main .faq-answers-wrapper {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.45s ease;
                }
                .home-faq-main .faq-answers {
                    margin-top: 11px;
                    font-size: 15px;
                    line-height: 1.68;
                    color: #526581;
                }
                .home-faq-main .faq-labels {
                    color: #1967d2;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }
                .home-faq-main .faq-titles {
                    font-size: 38px;
                    font-weight: 700;
                    line-height: 1.2;
                    margin-bottom: 14px;
                    color: #102746;
                }
                .home-faq-main .faq-subtitles {
                    font-size: 15px;
                    line-height: 1.65;
                    color: #4e6482;
                }
                @media (max-width: 991px) {
                    .home-faq-container {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .home-faq-left {
                        position: static;
                        top: auto;
                        padding: 0;
                    }
                    .home-faq-main .faq-titles {
                        font-size: 30px;
                    }
                    .home-faq-main {
                        padding: 1.8rem 1rem;
                    }
                }
                @keyframes faqNoticeFloat {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-2px); }
                    100% { transform: translateY(0); }
                }
            `}</style>
            <div className="container">
                <div className="section-content">
                    <div className="twm-tabs-style-1 center">
                        <ul className="nav nav-tabs" role="tablist">
                            {/* General tab */}
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "General" ? "active" : ""}`}
                                    onClick={() => setActiveTab("General")}
                                    type="button"
                                    role="tab"
                                    aria-controls="General"
                                >
                                    General
                                </button>
                            </li>

                            {/* Dynamic tabs */}
                            {categories.map((category) => (
                                <li className="nav-item" role="presentation" key={category._id}>
                                    <button
                                        className={`nav-link ${activeTab === category.name ? "active" : ""}`}
                                        onClick={() => setActiveTab(category.name)}
                                        type="button"
                                        role="tab"
                                        aria-controls={category.name}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="tab-content">
                            {/* General tab content */}
                            <div
                                className={`tab-pane fade ${activeTab === "General" ? "show active" : ""}`}
                                id="General"
                                role="tabpanel"
                            >
                                {renderFaqAccordion(generalFaqs, "General", "General")}
                            </div>

                            {/* Dynamic tab content */}
                            {categories.map((category) => (
                                <div
                                    className={`tab-pane fade ${activeTab === category.name ? "show active" : ""}`}
                                    id={category.name}
                                    role="tabpanel"
                                    key={category._id}
                                >
                                    {renderFaqAccordion(
                                        faqs.filter(
                                            (faq) => {
                                                const statusOk = String(faq?.status || "").toLowerCase() === "active";
                                                const ids = Array.isArray(faq?.category)
                                                    ? faq.category.map((cat) => cat?._id || cat)
                                                    : [faq?.category?._id || faq?.category || faq?.categoryId?._id || faq?.categoryId];
                                                const categoryOk = ids.some((id) => String(id) === String(category?._id));
                                                return statusOk && categoryOk;
                                            }
                                        ),
                                        category.name,
                                        category.name
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicFaqTabs;

