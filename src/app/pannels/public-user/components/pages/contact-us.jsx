import { useLocation } from "react-router-dom";
import { setBanner, showBanner } from "../../../../../globals/banner-data";
import InnerPageBanner from "../../../../common/inner-page-banner";
import { useState } from "react";
import { addContactForm } from "../../../../../adminApi";
// import InnerPageBanner from "../app/common/inner-page-banner";
// import { showBanner, setBanner } from "../globals/banner-data";
function ContactUsPage() {
    const currentpath = useLocation().pathname;
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
  
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
        newErrors.subject = "Subject is required";
  
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
    //     // window.bootstrap.Modal.getInstance(
    //     //   document.getElementById("sign_up_popup")
    //     // ).hide();
  
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

  // 🔥 IMPORTANT: remove focus from submit button
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

    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    const modalEl = document.getElementById("success_popup");
    const modal = new window.bootstrap.Modal(modalEl);

    modal.show();
  } catch (err) {
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

    return (
        <>
            {
                <InnerPageBanner
                    _data={{ title: "Contact Us", crumb: "Contact Us" }}
                    bgImagePath="images/contact-us/Header.webp"
                />
            }
            <div className="section-full twm-contact-one">
                <div className="section-content">
                    <div className="container">
                        {/* CONTACT FORM*/}
                        <div className="contact-one-inner">
                            <div className="row">
                                <div className="col-lg-6 col-md-12">
                                    <div className="contact-form-outer">
                                        {/* title="" START*/}
                                        <div className="section-head left wt-small-separator-outer">
                                            <h2 className="wt-title">Send Us a Message</h2>
                                            <p>Feel free to contact us and we will get back to you as soon as we can.</p>
                                        </div>
                                        {/* title="" END*/}
                                        <form className="cons-contact-form" method="post" onSubmit={handleSubmit} noValidate>
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="form-group mb-3">
                                                        <input name="first_name" type="text" required className="form-control" placeholder="First Name"   value={formData.first_name}
                    onChange={handleChange}/>
                     {errors.first_name && (
                    <small className="text-danger">{errors.first_name}</small>
                  )}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="form-group mb-3">
                                                        <input name="last_name" type="text" required className="form-control" placeholder="Last Name"   value={formData.last_name}
                    onChange={handleChange}/>
                     {errors.last_name && (
                    <small className="text-danger">{errors.last_name}</small>
                  )}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="form-group mb-3">
                                                        <input name="email" type="text" className="form-control" required placeholder="Email" value={formData.email}
                    onChange={handleChange}/>
                     {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="form-group mb-3">
                                                        <input name="phone" type="text" className="form-control" required placeholder="Phone" value={formData.phone}
                    onChange={handleChange}/>
                     {errors.phone && (
                    <small className="text-danger">{errors.phone}</small>
                  )}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <div className="form-group mb-3">
                                                        <input name="subject" type="text" className="form-control" required placeholder="Subject" value={formData.subject}
                    onChange={handleChange}/>
                     {errors.subject && (
                    <small className="text-danger">{errors.subject}</small>
                  )}
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <textarea name="message" className="form-control" rows={3} placeholder="Message" defaultValue={""} value={formData.message}
                    onChange={handleChange}/>
                     {errors.message && (
                    <small className="text-danger">{errors.message}</small>
                  )}
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <button type="submit" className="site-button" disabled={loading}>{loading ? "Sending..." : "Submit Now"}</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-12">
                                    <div className="contact-info-wrap">
                                        <div className="contact-info">
                                            <div className="contact-info-section">
                                                <div className="c-info-column">
                                                    <div className="c-info-icon"><i className=" fas fa-map-marker-alt" /></div>
                                                    <h3 className="twm-title">In the bay area?</h3>
                                                    <p>702, 7th Floor, Shagun Arcade, AB Road, Vijay Nagar Square, Indore, Madhya Pradesh 452010 </p>
                                                </div>
                                                <div className="c-info-column">
                                                    <div className="c-info-icon custome-size"><i className="fas fa-mobile-alt" /></div>
                                                    <h3 className="twm-title">Feel free to contact us</h3>
                                                    <p><a href="tel:+216-761-8331">+91 - 9993993909</a></p>
                                                    <p><a href="tel:+216-761-8331">+91 - 9009980049</a></p>
                                                </div>
                                                <div className="c-info-column">
                                                    <div className="c-info-icon"><i className="fas fa-envelope" /></div>
                                                    <h3 className="twm-title">Support</h3>
                                                    <p>hello@unicx.in</p>
                                                    {/* <p>support12@gmail.com</p> */}
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
            <div className="gmap-outline">
                <div className="google-map">
                    <div style={{ width: '100%' }}>
                        <iframe height={460} src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d229.96484999747514!2d75.89568097207088!3d22.749135922483536!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6c2da4f0072a7f31%3A0xda581b582d64470f!2sUniConsultX%20Solutions%20Pvt.%20Ltd.%20%7C%20Top%20Legal%20-%20Services%20%7C%20Trademark%20Registration%2C%20Copyright%2C%20Logo%20Registration%2C%20Brand%20Security!5e0!3m2!1sen!2sin!4v1751261863913!5m2!1sen!2sin"></iframe>
                    </div>
                </div>
            </div>
            {/* ---------------- SUCCESS MODAL ---------------- */}
      <div className="modal fade" id="success_popup" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="modal-body">
              <h5 className="text-success mb-2">🎉 Message Sent!</h5>
              <p className="text-muted">
                Thank you for contacting us. We’ll get back to you soon.
              </p>
            </div>

            <div className="modal-footer border-0">
            <button
  className="btn btn-success w-100"
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
    )
}

export default ContactUsPage;

