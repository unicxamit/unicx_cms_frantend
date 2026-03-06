// import { useState } from "react";
// import { addContactForm } from "../../../adminApi";

// function SignUpPopup() {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     contact_name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//   });
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };



// const handleCreate = async (e) => {
//   e.preventDefault();

//   try {
//     setLoading(true);

//     const res = await addContactForm(formData);

//     setMessage(res?.message || "Contact-us Form created successfully");

  

//     // ✅ RESET FORM (EMPTY INPUTS)
//     setFormData({
//       contact_name: "",
//       email: "",
//       phone: "",
//       subject: "",
//       message: "",
//     });

//    document.activeElement?.blur();

//     // ✅ CLOSE BOOTSTRAP MODAL SAFELY
  
//        const modalEl = document.getElementById("sign_up_popup");
//     const modalInstance =
//       window.bootstrap.Modal.getInstance(modalEl) ||
//       new window.bootstrap.Modal(modalEl);

//     modalInstance.hide();


//   } catch (err) {
//     console.error("Create Error:", err);
//     setMessage(
//       err?.response?.data?.message || "Error occurred while saving."
//     );
//   } finally {
//     setLoading(false);
//   }
// };




//   return (
//     <>
//       <div
//         className="modal fade twm-sign-up"
//         id="sign_up_popup"
//         aria-hidden="true"
//         aria-labelledby="sign_up_popupLabel"
//         tabIndex={-1}
//       >
//         <div className="modal-dialog modal-dialog-centered">
//           <div className="modal-content">
//             <form onSubmit={handleCreate}>
//               <button
//                 type="button"
//                 className="btn-close "
//                 style={{ marginLeft: "34rem", marginTop: "0.5rem" }}
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               />

//               <div className="modal-header">
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     rowGap: "1rem",
//                     padding: "1rem",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <h2
//                     className="modal-title text-center"
//                     style={{ marginLeft: "5rem" }}
//                     id="sign_up_popupLabel"
//                   >
//                     Contact-us
//                   </h2>
//                   <p className="text-center" style={{ marginLeft: "5rem" }}>
//                     Sign Up and get access to all the features of Jobzilla
//                   </p>
//                 </div>
//               </div>
//               <div className="modal-body mb-5">
//                 <div className="twm-tabs-style-2">
//                   <div className="tab-content" id="myTabContent">
//                     {/*Signup Candidate Content*/}
//                     <div
//                       className="tab-pane fade show active"
//                       id="sign-candidate"
//                     >
//                       <div className="row">
//                         <div className="col-lg-12 px-4">
//                           <div className="form-group mb-3">
//                             <label> Name</label>
//                             <input
                              
//                               type="text"
//                               name="contact_name"
//                               value={formData.contact_name}
//                               onChange={handleChange}
//                               required
//                               className="form-control mt-1"
//                               placeholder="Name*"
//                             />
//                           </div>
//                         </div>
//                         <div className="col-lg-12 px-4">
//                           <div className="form-group mb-3">
//                             <label> Email</label>
//                             <input
                              

//                               type="text"
//                               name="email"
//                               value={formData.email}
//                               onChange={handleChange}
//                               className="form-control mt-1"
//                               required
//                               placeholder="Email*"
//                             />
//                           </div>
//                         </div>
//                         <div className="col-lg-12 px-4">
//                           <div className="form-group mb-3">
//                             <label> Phone</label>
//                             <input
                              
                              
//                               type="tel"
//                               name="phone"
//                               value={formData.phone}
//                               onChange={handleChange}
//                               className="form-control mt-1"
//                               required
//                               placeholder="Phone*"
//                             />
//                           </div>
//                         </div>
//                         <div className="col-lg-12 px-4">
//                           <div className="form-group mb-3">
//                             <label> Subject</label>
//                             <input
                              
//                               type="text"
// name="subject"
//                               value={formData.subject}
//                               onChange={handleChange}
//                               className="form-control mt-1"
//                               required
//                               placeholder="Subject*"
//                             />
//                           </div>
//                         </div>
//                         <div className="col-lg-12 px-4">
//                           <div className="form-group mb-3">
//                             <label> Message</label>
//                             <input
                              
//                               type="text"
//                               name="message"
//                               value={formData.message}
//                               onChange={handleChange}
//                               className="form-control mt-1"
//                               required
//                               placeholder="Message*"
//                             />
//                           </div>
//                         </div>

//                         <div className="col-md-12 mt-3">
//                           <button
//                             type="submit"
//                             className="site-button"
//                             style={{ width: "100%" }}
//                                 disabled={loading}
//                           >
//                              {loading ? "Submitting..." : "Contact-Us"}
//                           </button>
//                         </div>
//                         <div className="col-md-12 mt-3">
//                           <button
//                             type="button"
//                             data-bs-dismiss="modal"
//                             aria-label="Close"
//                             style={{
//                               width: "100%",
//                               padding: "0.5rem",
//                               borderRadius: "0.5rem",
//                               outline: "none",
//                               border: "1px solid #000",
//                             }}
//                           >
//                             Close
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default SignUpPopup;

import { useEffect, useRef, useState } from "react";
import { addContactForm, getCategories } from "../../../adminApi";

function SignUpPopup() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const categoryDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // ---------------- CHANGE HANDLER ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((p) => ({ ...p, phone: digitsOnly }));
      setErrors((p) => ({
        ...p,
        phone: value === digitsOnly ? "" : "Only numbers are allowed",
      }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";

    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Enter 10-digit phone number";

    if (!formData.subject.trim())
      newErrors.subject = "Please select a category";

    if (!formData.message.trim())
      newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT ----------------
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   setLoading(true);

  //   try {
  //     await addContactForm(formData);

  //     // Close contact modal
  //     window.bootstrap.Modal.getInstance(
  //       document.getElementById("sign_up_popup")
  //     ).hide();

  //     // Reset form
  //     setFormData({
  //       contact_name: "",
  //       email: "",
  //       phone: "",
  //       subject: "",
  //       message: "",
  //     });

  //     // Open success modal
  //     new window.bootstrap.Modal(
  //       document.getElementById("success_popup")
  //     ).show();
  //   } catch (err) {
  //     alert("Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  // ✅ REMOVE focus before closing modal
  if (document.activeElement) {
    document.activeElement.blur();
  }

  setLoading(true);

  try {
    const payload = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    await addContactForm(payload);

    const signupModalEl = document.getElementById("sign_up_popup");
    const signupModal =
      window.bootstrap.Modal.getInstance(signupModalEl) ||
      new window.bootstrap.Modal(signupModalEl);
    signupModal.hide();

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    const successModalEl = document.getElementById("success_popup");
    const successModal = new window.bootstrap.Modal(successModalEl);

    successModal.show();
  } catch (err) {
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      const rawCategories = data?.category || data?.categories || [];
      const activeCategories = rawCategories.filter((item) => {
        if (!item) return false;
        if (!item.status) return true;
        return String(item.status).toLowerCase() === "active";
      });
      setCategories(activeCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  fetchCategories();
}, []);

useEffect(() => {
  const modalEl = document.getElementById("success_popup");
  if (!modalEl) return;

  const onHidden = () => {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  modalEl.addEventListener("hidden.bs.modal", onHidden);

  return () => {
    modalEl.removeEventListener("hidden.bs.modal", onHidden);
  };
}, []);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      categoryDropdownRef.current &&
      !categoryDropdownRef.current.contains(event.target)
    ) {
      setIsCategoryDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const handleCategorySelect = (categoryName) => {
  setFormData((prev) => ({ ...prev, subject: categoryName }));
  setErrors((prev) => ({ ...prev, subject: "" }));
  setIsCategoryDropdownOpen(false);
};

  return (
    <>
      {/* ---------------- CONTACT FORM MODAL ---------------- */}
      <div className="modal fade contact-modal" id="sign_up_popup" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content contact-modal__content">
            <form onSubmit={handleSubmit} noValidate>
              <div className="contact-modal__layout">
                <div className="contact-modal__aside">
                  <div className="contact-modal__badge">How It Works</div>
                  <h5 className="contact-modal__title">Talk to an Expert</h5>
                  <p className="contact-modal__subtitle">
                    Share your details and we will get back within 24 hours.
                  </p>
                  <div className="contact-modal__infographic">
                    <img
                      src="/assets/images/contact-us/2.png"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/assets/images/contact-us/contact.png";
                      }}
                      alt="Contact us infographic"
                    />
                  </div>
                  {/* <ul className="contact-modal__list">
                    <li>Free consultation</li>
                    <li>Clear, step-by-step guidance</li>
                    <li>Fast response team</li>
                  </ul> */}
                </div>

                <div className="contact-modal__main">
                  <div className="contact-modal__header">
                    <div>
                      <h5 className="contact-modal__headline">Contact Us</h5>
                      <p className="contact-modal__hint">
                        Have a question? Send us a message.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    />
                  </div>

                  <div className="contact-modal__body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="contact-modal__label">First Name</label>
                        <input
                          name="first_name"
                          className="form-control contact-modal__input"
                          placeholder="Enter first name"
                          onChange={handleChange}
                          value={formData.first_name}
                        />
                        {errors.first_name && (
                          <small className="text-danger">{errors.first_name}</small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="contact-modal__label">Last Name</label>
                        <input
                          name="last_name"
                          className="form-control contact-modal__input"
                          placeholder="Enter last name"
                          onChange={handleChange}
                          value={formData.last_name}
                        />
                        {errors.last_name && (
                          <small className="text-danger">{errors.last_name}</small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="contact-modal__label">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control contact-modal__input"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <small className="text-danger">{errors.email}</small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="contact-modal__label">Options</label>
                        <div
                          className="contact-modal__dropdown"
                          ref={categoryDropdownRef}
                        >
                          <button
                            type="button"
                            className="contact-modal__dropdown-trigger form-control contact-modal__input"
                            onClick={() =>
                              setIsCategoryDropdownOpen((prev) => !prev)
                            }
                            aria-expanded={isCategoryDropdownOpen}
                          >
                            <span
                              className={
                                formData.subject
                                  ? "contact-modal__dropdown-value"
                                  : "contact-modal__dropdown-placeholder"
                              }
                            >
                              {formData.subject || "Select a category"}
                            </span>
                            <span className="contact-modal__dropdown-arrow">
                              <span
                                className={`contact-modal__dropdown-caret${
                                  isCategoryDropdownOpen ? " is-open" : ""
                                }`}
                                aria-hidden="true"
                              />
                            </span>
                          </button>

                          {isCategoryDropdownOpen && (
                            <div className="contact-modal__dropdown-menu">
                              {categories.length === 0 ? (
                                <div className="contact-modal__dropdown-empty">
                                  No categories found
                                </div>
                              ) : (
                                categories.map((category) => {
                                  const label = category?.name || "";
                                  return (
                                    <button
                                      type="button"
                                      key={category?._id || label}
                                      className="contact-modal__dropdown-item"
                                      onClick={() => handleCategorySelect(label)}
                                    >
                                      {label}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                        {errors.subject && (
                          <small className="text-danger">{errors.subject}</small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="contact-modal__label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control contact-modal__input"
                          placeholder="10-digit mobile"
                          value={formData.phone}
                          onChange={handleChange}
                          inputMode="numeric"
                          maxLength={10}
                          pattern="[0-9]{10}"
                        />
                        {errors.phone && (
                          <small className="text-danger">{errors.phone}</small>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="contact-modal__label">Message</label>
                        <textarea
                          name="message"
                          className="form-control contact-modal__textarea"
                          rows="4"
                          placeholder="Tell us a bit about what you need..."
                          value={formData.message}
                          onChange={handleChange}
                        />
                        {errors.message && (
                          <small className="text-danger">{errors.message}</small>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="contact-modal__footer">
                    <button
                      type="submit"
                      className="site-button"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                    <div className="contact-modal__note">
                      By submitting, you agree to be contacted regarding your request.
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ---------------- SUCCESS MODAL ---------------- */}
      <div className="modal fade contact-success-modal" id="success_popup" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center contact-success-modal__content">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="modal-body">
              <div className="contact-success-modal__icon">Message Sent</div>
              <h5 className="contact-success-modal__title">Thanks for reaching out!</h5>
              <p className="contact-success-modal__text">
                Our team will contact you shortly with the next steps.
              </p>
            </div>

            <div className="modal-footer border-0">
              <button
                className="contact-modal__submit"
                data-bs-dismiss="modal"
                onClick={(e) => e.currentTarget.blur()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpPopup;



