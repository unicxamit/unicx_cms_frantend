import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import "./headerNav.css";
// import "./header1.css";
const WHATSAPP_NUMBER_E164 = "919999999999";
const EXPERT_HELP_PHONE_STORAGE_KEY = "expert_help_phone";
const RESOURCE_CATEGORY_ID = "static-resources-category";

/* ================= HELPERS ================= */

const getSubsForCategory = (categoryId, subCategories) => {
  return subCategories.filter(
    (sub) =>
      sub.status === "active" &&
      Array.isArray(sub.category) &&
      sub.category[0]?._id === categoryId
  );
};

const getServicesForSubCategory = (subCategoryId, services) => {
  return services.filter(
    (s) =>
      s.status === "active" &&
      Array.isArray(s.subcategory) &&
      s.subcategory[0]?._id === subCategoryId
  );
};

/* ================= COMPONENT ================= */

const NavHeader = ({
  isVisible = true,
  activeCategoryId = null,
  panelTop = 0,
  categories = [],
  subCategories = [],
  services = [],
  onRequestClose,
}) => {
  const [hoveredSubId, setHoveredSubId] = useState(null);
  const [serviceQuery, setServiceQuery] = useState("");
  const [ctaExpanded, setCtaExpanded] = useState(false);
  const [ctaState, setCtaState] = useState("idle");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const phoneInputRef = useRef(null);
  const sentResetTimeoutRef = useRef(null);

  useEffect(() => {
    if (sentResetTimeoutRef.current) {
      clearTimeout(sentResetTimeoutRef.current);
      sentResetTimeoutRef.current = null;
    }
    setHoveredSubId(null);
    setServiceQuery("");
    setCtaExpanded(false);
    setCtaState("idle");
    setLeadPhone("");
    setLeadTime("");
  }, [activeCategoryId]);

  useEffect(() => {
    return () => {
      if (sentResetTimeoutRef.current) {
        clearTimeout(sentResetTimeoutRef.current);
      }
    };
  }, []);

  const activeCategory = useMemo(() => {
    return categories.find((c) => c._id === activeCategoryId);
  }, [categories, activeCategoryId]);

  const activeSubCategories = useMemo(() => {
    if (!activeCategory) return [];
    return getSubsForCategory(activeCategory._id, subCategories);
  }, [activeCategory, subCategories]);

  const activeSubCategory = useMemo(() => {
    if (!activeSubCategories.length) return null;
    return (
      activeSubCategories.find((s) => s._id === hoveredSubId) ||
      activeSubCategories[0]
    );
  }, [activeSubCategories, hoveredSubId]);

  const activeServices = useMemo(() => {
    if (!activeSubCategory) return [];
    return getServicesForSubCategory(activeSubCategory._id, services);
  }, [activeSubCategory, services]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = serviceQuery.trim().toLowerCase();
    if (!normalizedQuery) return activeServices;

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    return activeServices.filter((s) => {
      const serviceName = (s.name || "").toLowerCase();
      return terms.every((term) => serviceName.includes(term));
    });
  }, [activeServices, serviceQuery]);

  const isResourcesCategory = activeCategory?._id === RESOURCE_CATEGORY_ID;
  const subCategoryHeading = isResourcesCategory
    ? "Sections"
    : "Sub-Categories";
  const servicesHeading = isResourcesCategory
    ? "Links"
    : "Services";
  const servicesSearchPlaceholder = isResourcesCategory
    ? "Search links..."
    : "Search services...";
  const emptyServicesLabel = isResourcesCategory
    ? "No links found."
    : "No services found.";
  const ctaTitle = isResourcesCategory
    ? "Need help finding the right resource?"
    : "Need help choosing the right service?";
  const ctaContextNoun = isResourcesCategory ? "resource" : "service";

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER_E164}`;

  const submitLead = (e) => {
    e.preventDefault();
    if (ctaState === "sending") return;
    const sanitizedPhone = leadPhone.replace(/[^\d]/g, "").slice(0, 10);

    if (sanitizedPhone.length < 10) {
      phoneInputRef.current?.focus();
      return;
    }

    try {
      localStorage.setItem(EXPERT_HELP_PHONE_STORAGE_KEY, sanitizedPhone);
    } catch (error) {
      console.error("Unable to save expert help phone:", error);
    }

    setCtaState("sending");
    setTimeout(() => {
      setCtaState("sent");
      setCtaExpanded(false);
      setLeadPhone(sanitizedPhone);

      if (sentResetTimeoutRef.current) {
        clearTimeout(sentResetTimeoutRef.current);
      }
      sentResetTimeoutRef.current = setTimeout(() => {
        setCtaState("idle");
        sentResetTimeoutRef.current = null;
      }, 5000);
    }, 700);
  };

  if (!isVisible || !activeCategoryId || !activeCategory) return null;

  const handlePanelMouseLeave = () => {
    onRequestClose?.();
  };

  return (
    <div className="navheader-panel-root" style={{ top: panelTop }}>
      <div
        className="h1-mega-panel h1-mega-panel--root"
      >
        <div className="h1-mega-container">
          <div
            className="h1-mega-card ui-glass-surface--premium"
            onMouseLeave={handlePanelMouseLeave}
          >
            <button
              type="button"
              className="h1-mega-close"
              onClick={onRequestClose}
              aria-label="Close services panel"
            >
              &times;
            </button>
            <div className="h1-mega-grid">
              <div className="h1-col-subcats">
                <p className="h1-subcats-heading">{subCategoryHeading}</p>
                <div className="h1-subcats-list">
                  {activeSubCategories.map((sub) => {
                    const isActive = activeSubCategory?._id === sub._id;
                    const serviceCount = getServicesForSubCategory(
                      sub._id,
                      services
                    ).length;
                    return (
                      <button
                        key={sub._id}
                        type="button"
                        onMouseEnter={() => setHoveredSubId(sub._id)}
                        onFocus={() => setHoveredSubId(sub._id)}
                        aria-current={isActive ? "true" : undefined}
                        className={`h1-subcat-btn ${isActive ? "is-active" : ""}`}
                      >
                        <ChevronRight
                          size={14}
                          className={`h1-subcat-chevron ${isActive ? "is-active" : ""
                            }`}
                        />
                        <span className="h1-subcat-name">{sub.name}</span>
                        <span
                          className={`h1-subcat-badge ${isActive ? "is-active" : ""
                            }`}
                        >
                          {serviceCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h1-col-services">
                <div className="h1-services-header">
                  <div>
                    <p className="h1-services-heading">{servicesHeading}</p>
                    <h4 className="h1-services-title">
                      {activeSubCategory?.name}
                    </h4>

                  </div>
                </div>

                <div className="h1-services-search-block">
                  <div className="h1-services-search">
                    <Search size={16} className="h1-services-search-icon" />
                    <input
                      value={serviceQuery}
                      onChange={(e) => setServiceQuery(e.target.value)}
                      placeholder={servicesSearchPlaceholder}
                      className="h1-services-search-input"
                    />
                  </div>

                  <div
                    key={activeSubCategory?._id}
                    className="h1-services-list"
                  >
                    {filteredServices.map((ser) => (
                      <NavLink
                        key={ser._id || ser.id}
                        to={ser.to || `/subsubcategory/${ser._id}`}
                        onClick={onRequestClose}
                        className="h1-services-link"
                      >
                        {ser.name}
                      </NavLink>
                    ))}
                    {filteredServices.length === 0 && (
                      <div className="h1-services-empty">{emptyServicesLabel}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h1-col-cta">
                <div className="h1-cta-card">
                  <div className="h1-cta-glow" />
                  <div>
                    <div className="h1-cta-head">
                      <div className="h1-cta-kicker">
                        <Sparkles size={14} className="h1-icon-white-soft" />
                        Expert Help
                      </div>
                      <span className="h1-cta-badge">Free consult</span>
                    </div>
                    <p className="h1-cta-title">{ctaTitle}</p>
                    <p className="h1-cta-desc">
                      Get a quick callback with the right{" "}
                      <span className="h1-cta-desc-highlight">
                        {activeSubCategory?.name || `this ${ctaContextNoun}`}
                      </span>
                      {" "}for you.
                    </p>
                    <div className="h1-cta-meta">
                      <div className="h1-cta-rating">
                        <Star size={14} className="h1-icon-amber" />
                        <span className="h1-cta-rating-value">4.8</span>
                        <span className="h1-cta-rating-slash">/5</span>
                      </div>
                      <span className="h1-cta-meta-sep">|</span>
                      <span>10k+ consultations</span>
                    </div>
                  </div>

                  <div className="h1-cta-body">
                    <div className="h1-cta-body-inner">
                      <div
                        className={`h1-cta-layer ${ctaExpanded ? "is-hide-down" : "is-show"
                          }`}
                      >
                        <div className="h1-cta-collapsed">
                          <div className="h1-cta-actions">
                            <button
                              type="button"
                              onClick={() => setCtaExpanded(true)}
                              disabled={ctaState === "sending"}
                              className="h1-cta-primary-btn"
                            >
                              {ctaState === "sent" ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                <PhoneCall size={16} />
                              )}
                              {ctaState === "sent"
                                ? "We'll call you shortly"
                                : ctaState === "sending"
                                  ? "Requesting..."
                                  : "Get Expert Callback"}
                              <ArrowRight size={16} />
                            </button>
                            <a
                              href={whatsappHref}
                              target="_blank"
                              rel="noreferrer"
                              className="h1-cta-secondary-btn"
                            >
                              <MessageCircle size={16} />
                              WhatsApp Expert
                              <ArrowRight size={16} />
                            </a>
                          </div>
                          <div className="h1-cta-foot">
                            <span>No spam</span>
                            <span className="h1-cta-foot-item">
                              <Clock size={14} /> ~15 min callback
                            </span>
                          </div>
                          <div className="h1-cta-privacy">
                            <ShieldCheck
                              size={14}
                              className="h1-icon-white-muted"
                            />
                            Private & secure
                          </div>
                        </div>
                      </div>

                      <div
                        className={`h1-cta-layer ${ctaExpanded ? "is-show" : "is-hide-up"
                          }`}
                      >
                        <form onSubmit={submitLead} className="h1-cta-form">
                          <div className="h1-cta-fields">
                            <div className="h1-cta-field">
                              <label className="h1-cta-label">Phone</label>
                              <div className="h1-cta-input-row">
                                <span className="h1-cta-country-code">+91</span>
                                <input
                                  ref={phoneInputRef}
                                  value={leadPhone}
                                  onChange={(e) =>
                                    setLeadPhone(
                                      e.target.value
                                        .replace(/[^\d]/g, "")
                                        .slice(0, 10)
                                    )
                                  }
                                  placeholder="Enter 10-digit number"
                                  inputMode="tel"
                                  className="h1-cta-input"
                                />
                              </div>
                            </div>
                            {/* <div className="h1-cta-field">
                              <label className="h1-cta-label">
                                Preferred Time (Optional)
                              </label>
                              <input
                                value={leadTime}
                                onChange={(e) => setLeadTime(e.target.value)}
                                placeholder="e.g. Today 6-8 PM"
                                className="h1-cta-input h1-cta-input--mt"
                              />
                            </div> */}
                            {ctaState === "sent" && (
                              <div className="h1-cta-success">
                                Request received. We'll call you shortly.
                              </div>
                            )}
                          </div>
                          <div className="h1-cta-form-footer">
                            <button
                              type="submit"
                              disabled={
                                ctaState === "sending" ||
                                leadPhone.trim().length < 10
                              }
                              className="h1-cta-submit"
                            >
                              <PhoneCall size={16} />
                              {ctaState === "sending"
                                ? "Requesting..."
                                : ctaState === "sent"
                                  ? "Request Sent"
                                  : "Talk to Expert"}
                              <ArrowRight size={16} />
                            </button>
                            <div className="h1-cta-form-actions">
                              <button
                                type="button"
                                onClick={() => setCtaExpanded(false)}
                                className="h1-cta-back"
                              >
                                Back
                              </button>
                              <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noreferrer"
                                className="h1-cta-whatsapp"
                              >
                                <MessageCircle size={14} /> Use WhatsApp instead
                              </a>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavHeader;
