import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Editor } from "primereact/editor";
import "./serviceStyle/serviceDetails.css";

import {
  addServiceDetails,
  getServiceDetailsByserviceId,
  updateServiceDetails,
} from "../adminApi";

const ServiceDetailsPage = () => {
  const { id } = useParams();

  const location = useLocation();
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceSubcategory, setServiceSubcategory] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (location.state) {
      setName(location.state.serviceName || "");
      setServiceCategory(location.state.categoryName || "");
      setServiceSubcategory(location.state.subcategoryName || "");
    }
  }, [location.state]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState("");

  const [formData, setFormData] = useState({
    service: id,
    title: "",
    description: "",
    metaKeyword: "",
    metaDescription: "",
  });

  const [sections, setSections] = useState([
    {
      sectionTitle: "",
      sectionDescription: "",
      sectionImage: "",
      sectionImageFile: null,
      sectionImagePreview: "",
    },
  ]);

  const [faq_sections, setFaq_sections] = useState([
    {
      faq_question: "",
      faq_answer: "",
    },
  ]);

  const normalizePlainText = (value) =>
    String(value ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.metaKeyword.trim()) newErrors.metaKeyword = "Meta keyword is required";
    if (!formData.metaDescription.trim()) newErrors.metaDescription = "Meta description is required";

    sections.forEach((section, index) => {
      if (!normalizePlainText(section.sectionTitle)) {
        newErrors[`sectionTitle_${index}`] = "Section title is required";
      }

      // if (!section.sectionDescription || section.sectionDescription === "<p><br></p>") {
      //   newErrors[`sectionDescription_${index}`] = "Section description is required";
      // }

      // if (!section.sectionImage && !section.sectionImageFile) {
      //   newErrors[`sectionImage_${index}`] = "Section image is required";
      // }
    });

    faq_sections.forEach((section, index) => {
      if (!normalizePlainText(section.faq_question)) {
        newErrors[`faq_question_${index}`] = "FAQ question is required";
      }

      if (!section.faq_answer || section.faq_answer === "<p><br></p>") {
        newErrors[`faq_answer_${index}`] = "FAQ answer is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const res = await getServiceDetailsByserviceId(id);

      if (res?.service?.length) {
        const data = res.service[0];
        setIsEdit(true);

        setFormData({
          service: data.service?.[0] || id,
          title: data.title || "",
          description: data.description || "",
          metaKeyword: data.metaKeyword || "",
          metaDescription: data.metaDescription || "",
        });

        setSections(
          (data.sections || []).map((sec, index) => ({
            sectionTitle: sec.sectionTitle || "",
            sectionDescription: sec.sectionDescription || "",
            sectionImage: sec.sectionImage || data.images?.[index] || "",
            sectionImageFile: null,
            sectionImagePreview: "",
          }))
        );
        setBannerImage(null);
        setBannerImagePreview(data.bannerImage || "");

        setFaq_sections(
          Array.isArray(data.faq_sections) && data.faq_sections.length > 0
            ? data.faq_sections.map((sec) => ({
                faq_answer: sec.faq_answer || "",
                faq_question: sec.faq_question || "",
              }))
            : [{ faq_question: "", faq_answer: "" }]
        );
      } else {
        setIsEdit(false);
        setSections([
          {
            sectionTitle: "",
            sectionDescription: "",
            sectionImage: "",
            sectionImageFile: null,
            sectionImagePreview: "",
          },
        ]);
        setBannerImage(null);
        setBannerImagePreview("");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        sectionTitle: "",
        sectionDescription: "",
        sectionImage: "",
        sectionImageFile: null,
        sectionImagePreview: "",
      },
    ]);
  };

  const addfaq_sections = () => {
    setFaq_sections((prev) => [...prev, { faq_answer: "", faq_question: "" }]);
  };

  const removeFaqSection = (index) => {
    setFaq_sections((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleFaqSectionChange = (index, field, value) => {
    const updated = [...faq_sections];
    updated[index][field] = value;
    setFaq_sections(updated);
    setErrors((prev) => {
      const key = `${field}_${index}`;
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const removeSection = (index) => {
    setSections((prev) => {
      if (prev.length <= 1) return prev;
      const current = prev[index];
      if (current?.sectionImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(current.sectionImagePreview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
    setErrors((prev) => {
      const key = `${field}_${index}`;
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSectionImage = (index, file) => {
    if (!file) return;
    setSections((prev) => {
      const updated = [...prev];
      if (updated[index].sectionImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(updated[index].sectionImagePreview);
      }
      updated[index].sectionImageFile = file;
      updated[index].sectionImagePreview = URL.createObjectURL(file);
      return updated;
    });
    // setErrors((prev) => ({ ...prev, [`sectionImage_${index}`]: "" }));
  };

  const removeSectionImage = (index) => {
    setSections((prev) => {
      const updated = [...prev];
      if (updated[index].sectionImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(updated[index].sectionImagePreview);
      }
      updated[index].sectionImage = "";
      updated[index].sectionImageFile = null;
      updated[index].sectionImagePreview = "";
      return updated;
    });
    setErrors((prev) => ({ ...prev, [`sectionImage_${index}`]: "" }));
  };

  const handleBannerImage = (file) => {
    if (!file) return;
    if (bannerImagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerImagePreview);
    }
    setBannerImage(file);
    setBannerImagePreview(URL.createObjectURL(file));
  };

  const removeBannerImage = () => {
    if (bannerImagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerImagePreview);
    }
    setBannerImage(null);
    setBannerImagePreview("");
  };

  const getSectionPreviewSrc = (section) => {
    return section.sectionImagePreview || section.sectionImage || null;
  };

  const dataUrlToFile = async (dataUrl, filePrefix = "section-editor-image") => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const mimeType = blob.type || "image/png";
    const extension = (mimeType.split("/")[1] || "png").split(";")[0];
    const fileName = `${filePrefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${extension}`;
    return new File([blob], fileName, { type: mimeType });
  };

  const prepareSectionsForSubmit = async (sectionsToPrepare = []) => {
    const preparedSections = [];
    const editorImageFiles = [];
    const editorImageTokens = [];

    for (let sectionIndex = 0; sectionIndex < sectionsToPrepare.length; sectionIndex += 1) {
      const currentSection = sectionsToPrepare[sectionIndex];
      const sectionDescription = currentSection?.sectionDescription || "";

      if (!sectionDescription || typeof window === "undefined") {
        preparedSections.push(currentSection);
        continue;
      }

      const template = document.createElement("template");
      template.innerHTML = sectionDescription;

      const inlineImages = Array.from(template.content.querySelectorAll("img[src]"));
      for (let imgIndex = 0; imgIndex < inlineImages.length; imgIndex += 1) {
        const img = inlineImages[imgIndex];
        const src = img.getAttribute("src") || "";
        if (!src.startsWith("data:image/")) continue;

        try {
          const token = `__SECTION_EDITOR_IMAGE_${sectionIndex}_${imgIndex}_${editorImageTokens.length}__`;
          const file = await dataUrlToFile(src, `section-${sectionIndex + 1}`);
          img.setAttribute("src", token);
          editorImageFiles.push(file);
          editorImageTokens.push(token);
        } catch (error) {
          console.error("Inline editor image conversion failed:", error);
        }
      }

      preparedSections.push({
        ...currentSection,
        sectionDescription: template.innerHTML,
      });
    }

    return { preparedSections, editorImageFiles, editorImageTokens };
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = new FormData();
      const { preparedSections, editorImageFiles, editorImageTokens } =
        await prepareSectionsForSubmit(sections);

      payload.append("service", formData.service);
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("metaKeyword", formData.metaKeyword);
      payload.append("metaDescription", formData.metaDescription);
      payload.append("name", name);
      payload.append("category", serviceCategory);
      payload.append("subcategory", serviceSubcategory);

      payload.append(
        "sections",
        JSON.stringify(
          preparedSections.map(({ sectionTitle, sectionDescription, sectionImage }) => ({
            sectionTitle: normalizePlainText(sectionTitle),
            sectionDescription,
            sectionImage,
          }))
        )
      );

      payload.append(
        "faq_sections",
        JSON.stringify(
          faq_sections.map(({ faq_answer, faq_question }) => ({
            faq_answer,
            faq_question: normalizePlainText(faq_question),
          }))
        )
      );

      const sectionImageIndexes = [];
      sections.forEach((section, index) => {
        if (section.sectionImageFile) {
          payload.append("sectionImages", section.sectionImageFile);
          sectionImageIndexes.push(index);
        }
      });
      if (sectionImageIndexes.length > 0) {
        payload.append("sectionImageIndexes", JSON.stringify(sectionImageIndexes));
      }
      if (editorImageFiles.length > 0) {
        editorImageFiles.forEach((file) => payload.append("editorSectionImages", file));
        payload.append("editorSectionImageTokens", JSON.stringify(editorImageTokens));
      }
      if (bannerImage) {
        payload.append("bannerImage", bannerImage);
      }

      const res = await addServiceDetails(payload);
      setMessage(res?.message || "Service details created successfully");
      fetchServiceDetails();
      navigate("/admin/add-Services");
    } catch (err) {
      console.error("Create Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = new FormData();
      const { preparedSections, editorImageFiles, editorImageTokens } =
        await prepareSectionsForSubmit(sections);

      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("metaKeyword", formData.metaKeyword);
      payload.append("metaDescription", formData.metaDescription);

      payload.append(
        "sections",
        JSON.stringify(
          preparedSections.map(({ sectionTitle, sectionDescription, sectionImage }) => ({
            sectionTitle: normalizePlainText(sectionTitle),
            sectionDescription,
            sectionImage,
          }))
        )
      );

      payload.append(
        "faq_sections",
        JSON.stringify(
          faq_sections.map(({ faq_answer, faq_question }) => ({
            faq_answer,
            faq_question: normalizePlainText(faq_question),
          }))
        )
      );

      const sectionImageIndexes = [];
      sections.forEach((section, index) => {
        if (section.sectionImageFile) {
          payload.append("sectionImages", section.sectionImageFile);
          sectionImageIndexes.push(index);
        }
      });
      if (sectionImageIndexes.length > 0) {
        payload.append("sectionImageIndexes", JSON.stringify(sectionImageIndexes));
      }
      if (editorImageFiles.length > 0) {
        editorImageFiles.forEach((file) => payload.append("editorSectionImages", file));
        payload.append("editorSectionImageTokens", JSON.stringify(editorImageTokens));
      }
      if (bannerImage) {
        payload.append("bannerImage", bannerImage);
      }

      const res = await updateServiceDetails(id, payload);
      setMessage(res?.message || "Service details updated successfully");
      fetchServiceDetails();
      navigate("/admin/add-Services");
    } catch (err) {
      console.error("Update Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalSections = sections.length;
  const totalFaqs = faq_sections.length;
  const totalNewSectionImages = sections.filter((section) => section.sectionImageFile).length;

  return (
    <div className="servicedetails-page">
      <div className="servicedetails-shell">
        <div className="servicedetails-topbar">
          <div>
            <h2 className="servicedetails-title">
              {isEdit ? "Update Service Details" : "Create Service Details"}
            </h2>
            <p className="servicedetails-subtitle">Add content blocks, media, and FAQs in one place.</p>
          </div>
          <div className="servicedetails-stats">
            <span className="servicedetails-stat-chip">{totalSections} Sections</span>
            <span className="servicedetails-stat-chip">{totalFaqs} FAQs</span>
            <span className="servicedetails-stat-chip">{totalNewSectionImages} New Section Images</span>
          </div>
        </div>

        {message ? <p className="servicedetails-alert success">{message}</p> : null}

        <Form className="servicedetails-form">
          <section className="servicedetails-panel">
            <h5 className="servicedetails-panel-title">Service Basics</h5>

            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control value={name} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={formData.title}
                required
                onChange={handleChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meta Keyword</Form.Label>
              <Form.Control
                name="metaKeyword"
                value={formData.metaKeyword}
                onChange={handleChange}
                required
                isInvalid={!!errors.metaKeyword}
              />
              <Form.Control.Feedback type="invalid">{errors.metaKeyword}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Service Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                required
                isInvalid={!!errors.metaDescription}
              />
              <Form.Control.Feedback type="invalid">{errors.metaDescription}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="servicedetails-upload-label mb-1">Upload Banner Image</Form.Label>
              <Form.Control
                type="file"
                className="servicedetails-file-input"
                onChange={(e) => handleBannerImage(e.target.files[0])}
              />
              {bannerImagePreview && (
                <div className="mt-3">
                  <img src={bannerImagePreview} alt="banner" className="servicedetails-preview" />
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    className="mt-2"
                    onClick={removeBannerImage}
                  >
                    Remove Banner Image
                  </Button>
                </div>
              )}
            </Form.Group>
          </section>

          <section className="servicedetails-panel">
            <h5 className="servicedetails-panel-title">Sections</h5>

            {sections.map((section, index) => (
              <div key={index} className="servicedetails-card">
                <div className="servicedetails-card-head">
                  <span className="servicedetails-card-title">Section {index + 1}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    className="servicedetails-remove-btn"
                    onClick={() => removeSection(index)}
                  >
                    Remove
                  </Button>
                </div>
               <div className="mb-2">
                <p>Section Title</p>
                <Editor
                  className="mb-2"
                  value={section.sectionTitle}
                  onTextChange={(e) => handleSectionChange(index, "sectionTitle", e.htmlValue)}
                  style={{ height: "120px" }}
                  required
                />
                <div className="text-danger small">{errors[`sectionTitle_${index}`]}</div>

               </div>

                <div
                  className={`servicedetails-editor-shell mb-2 mt-3`}
                >
                  <p>Section Description</p>
                  <Editor
                    value={section.sectionDescription}
                    onTextChange={(e) => handleSectionChange(index, "sectionDescription", e.htmlValue)}
                    style={{ height: "200px" }}
                    required
                  />
                </div>

                {/* {errors[`sectionDescription_${index}`] && (
                  <div className="text-danger small mt-1">{errors[`sectionDescription_${index}`]}</div>
                )} */}

                {getSectionPreviewSrc(section) && (
                    <div className="mt-3">
                      <img
                        src={getSectionPreviewSrc(section)}
                        alt="section"
                        className="servicedetails-preview"
                      />
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        className="mt-2"
                        onClick={() => removeSectionImage(index)}
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}

                <Form.Label className="servicedetails-upload-label mt-2 mb-1">Upload Section Image</Form.Label>
                <Form.Control
                  type="file"
                  className="servicedetails-file-input"
                  onChange={(e) => handleSectionImage(index, e.target.files[0])}
                />

                {/* {errors[`sectionImage_${index}`] && (
                  <div className="text-danger small mt-1">{errors[`sectionImage_${index}`]}</div>
                )} */}
              </div>
            ))}

            <Button type="button" variant="outline-primary" onClick={addSection}>
              + Add Section
            </Button>
          </section>

          <section className="servicedetails-panel">
            <h5 className="servicedetails-panel-title">FAQ Sections</h5>

            {faq_sections.map((faq, index) => (
              <div key={index} className="servicedetails-card">
                <div className="servicedetails-card-head">
                  <span className="servicedetails-card-title">FAQ {index + 1}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    className="servicedetails-remove-btn"
                    onClick={() => removeFaqSection(index)}
                  >
                    Remove
                  </Button>
                </div>
               <div className="mb-2">
                <p>Faq Question</p>
<Editor
                  className="mb-2"
                  value={faq.faq_question}
                  onTextChange={(e) => handleFaqSectionChange(index, "faq_question", e.htmlValue)}
                  style={{ height: "120px" }}
                  required
                />
                <div className="text-danger small">{errors[`faq_question_${index}`]}</div>

               </div>
                
                <div
                  className={`servicedetails-editor-shell ${
                    errors[`faq_answer_${index}`] ? "invalid" : ""
                  }`}
                >
                  <p>Faq Answer</p>
                  <Editor
                    value={faq.faq_answer}
                    onTextChange={(e) => handleFaqSectionChange(index, "faq_answer", e.htmlValue)}
                    style={{ height: "200px" }}
                    required
                  />
                </div>

                {errors[`faq_answer_${index}`] && (
                  <div className="text-danger small mt-1">{errors[`faq_answer_${index}`]}</div>
                )}
              </div>
            ))}

            <Button type="button" variant="outline-primary" onClick={addfaq_sections}>
              + Add FAQ Section
            </Button>
          </section>

          <div className="servicedetails-actionbar">
            <Button type="button" variant="outline-secondary" onClick={() => navigate("/admin/add-Services")}>
              Back
            </Button>
            <Button variant="success" onClick={isEdit ? handleUpdate : handleSubmit} disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
