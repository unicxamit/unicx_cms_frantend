import React, { useState } from "react";
import { addExpertContactForm } from "../../../../../adminApi";

const ContactForm = ({ expert, onClose }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    expertName: expert || "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const experts = [
    "Tradmark & Copyright Expert - IPR",
    "Company Registration & Compliances Expert - ROC",
    "Certification & Licenses Expert",
    "Finance & Accounts Expert",
    "Web & Graphics Expert - Digital",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      setErrors((prev) => ({
        ...prev,
        phone: value === digitsOnly ? "" : "Only numbers are allowed",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.expertName.trim()) {
      newErrors.expertName = "Please select an expert";
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        expertName: formData.expertName.trim(),
        contact_name: `${formData.first_name} ${formData.last_name}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      };

      await addExpertContactForm(payload);

      setFormData(initialFormState);
      setIsSubmitted(true);

      document.activeElement?.blur();

      const modalEl = document.getElementById("sign_up_popup");
      if (modalEl) {
        const modalInstance =
          window.bootstrap.Modal.getInstance(modalEl) ||
          new window.bootstrap.Modal(modalEl);
        modalInstance.hide();
      }
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show home-expert-modal__backdrop"></div>

      <div
        className="modal show d-block home-expert-modal"
        style={{ zIndex: 1050 }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content contact-modal__content home-expert-modal__content ui-glass-surface">
            {isSubmitted ? (
              <div className="text-center p-4 p-md-5">
                <div
                  className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="white"
                    className="bi bi-check2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                </div>
                <h4 className="mb-2">Thank You!</h4>
                <p className="text-muted">
                  Your message has been submitted. Our expert will contact you
                  shortly.
                </p>
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="home-expert-modal__layout">
                <div className="home-expert-modal__form-panel">
                  <div className="home-expert-modal__header">
                    <div>
                      <h5 className="home-expert-modal__headline">
                        Contact Our Expert
                      </h5>
                      <p className="home-expert-modal__hint">
                        Fill the form and our team will reach you with the best
                        next step.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={onClose}
                    ></button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="contact-modal__label">
                          Choose Expert
                        </label>
                        <select
                          className="form-select contact-modal__input"
                          name="expertName"
                          value={formData.expertName}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select an expert</option>
                          {experts.map((ex, i) => (
                            <option key={i} value={ex}>
                              {ex}
                            </option>
                          ))}
                        </select>
                        {errors.expertName && (
                          <small className="text-danger">
                            {errors.expertName}
                          </small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="contact-modal__label">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control contact-modal__input"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter first name"
                        />
                        {errors.first_name && (
                          <small className="text-danger">
                            {errors.first_name}
                          </small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="contact-modal__label">Last Name</label>
                        <input
                          type="text"
                          className="form-control contact-modal__input"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter last name"
                        />
                        {errors.last_name && (
                          <small className="text-danger">
                            {errors.last_name}
                          </small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="contact-modal__label">Email</label>
                        <input
                          type="email"
                          className="form-control contact-modal__input"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <small className="text-danger">{errors.email}</small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="contact-modal__label">Phone</label>
                        <input
                          type="tel"
                          className="form-control contact-modal__input"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          inputMode="numeric"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          placeholder="10-digit mobile"
                        />
                        {errors.phone && (
                          <small className="text-danger">{errors.phone}</small>
                        )}
                      </div>

                      <div className="col-12 mb-1">
                        <label className="contact-modal__label">Message</label>
                        <textarea
                          className="form-control contact-modal__textarea"
                          rows="4"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          placeholder="Tell us a bit about what you need..."
                        ></textarea>
                        {errors.message && (
                          <small className="text-danger">{errors.message}</small>
                        )}
                      </div>
                    </div>

                    <div className="contact-modal__footer">
                      <button
                        type="submit"
                        className="contact-modal__submit"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Send Message"}
                      </button>
                      <button
                        type="button"
                        className="home-expert-modal__cancel"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>

                <aside className="home-expert-modal__right-panel">
                  <div className="home-expert-modal__tag">Priority Support</div>
                  <h6 className="home-expert-modal__right-title">
                    What Happens Next
                  </h6>
                  <p className="home-expert-modal__right-subtitle">
                    A specialist will review your request and guide you with
                    clear, actionable steps.
                  </p>

                  <div className="home-expert-modal__stats">
                    <div className="home-expert-modal__stat">
                      <strong>15 min</strong>
                      <span>Average first response</span>
                    </div>
                    <div className="home-expert-modal__stat">
                      <strong>1:1</strong>
                      <span>Dedicated expert support</span>
                    </div>
                  </div>

                  <div className="home-expert-modal__timeline">
                    <div className="home-expert-modal__step">
                      <span>01</span>
                      <p>Requirement review and initial recommendation.</p>
                    </div>
                    <div className="home-expert-modal__step">
                      <span>02</span>
                      <p>Personalized plan with timeline and cost clarity.</p>
                    </div>
                    <div className="home-expert-modal__step">
                      <span>03</span>
                      <p>Execution support till completion.</p>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
