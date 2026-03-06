import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Editor } from "primereact/editor";
import {
  createCaseStudyDetails,
  getCaseStudyById,
  getCaseStudyDetails,
  getTestimonial,
  updateCasestudyDetails,
} from "../adminApi";
import "./serviceStyle/blogDetails.css";

const createEmptySection = () => ({
  title: "",
  description: "",
  image: [],
  newImages: [],
  replacementImages: [],
  removedImages: [],
});

const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const CaseStudyDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [testimonialOptions, setTestimonialOptions] = useState([]);
  const [testimonialLoading, setTestimonialLoading] = useState(false);

  const [caseStudyTitle, setCaseStudyTitle] = useState("");

  const [formData, setFormData] = useState({
    client_name: "",
  
    project_duration: "",
    project_url: "",
    AchivementsCount: "",
    successRate: "",
    testimonial: "",
  });

  const [sections, setSections] = useState([createEmptySection()]);
  const sectionsRef = useRef([createEmptySection()]);

  const revokeReplacementPreviews = (replacementImages = []) => {
    replacementImages.forEach((asset) => {
      if (asset?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(asset.previewUrl);
      }
    });
  };

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  useEffect(() => {
    return () => {
      sectionsRef.current.forEach((section) => revokeReplacementPreviews(section.replacementImages));
    };
  }, []);

  useEffect(() => {
    if (location.state?.title) {
      setCaseStudyTitle(location.state.title);
    }
  }, [location.state]);

  const fetchTestimonials = async () => {
    try {
      setTestimonialLoading(true);
      const res = await getTestimonial();
      const list = Array.isArray(res?.testimonials) ? res.testimonials : [];
      setTestimonialOptions(list);
    } catch (err) {
      console.error("Failed to fetch testimonials", err);
      setTestimonialOptions([]);
    } finally {
      setTestimonialLoading(false);
    }
  };

  const fetchDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      const res = await getCaseStudyDetails(id);
      const details = Array.isArray(res?.caseStudyDetails) ? res.caseStudyDetails[0] : null;

      if (!details) {
        setIsEdit(false);
        setSections([createEmptySection()]);
        return;
      }

      setIsEdit(true);
      setFormData({
        client_name: details?.client_name || "",
       
        project_duration: details?.project_duration || "",
        project_url: details?.project_url || "",
        AchivementsCount:
          details?.AchivementsCount === 0 || details?.AchivementsCount
            ? String(details.AchivementsCount)
            : "",
        successRate:
          details?.successRate === 0 || details?.successRate
            ? String(details.successRate)
            : "",
        testimonial: Array.isArray(details?.testimonial)
          ? details.testimonial
              .map((item) => (typeof item === "string" ? item : item?._id))
              .filter(Boolean)
              .join(",")
          : "",
      });

      const nextSections =
        Array.isArray(details?.content) && details.content.length > 0
          ? details.content.map((item) => ({
              title: item?.title || "",
              description: item?.description || "",
              image: Array.isArray(item?.image) ? item.image : [],
              newImages: [],
              replacementImages: [],
              removedImages: [],
            }))
          : [createEmptySection()];

      setSections(nextSections);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch case study details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    fetchDetails();
  }, [id]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestimonialChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, testimonial: value }));
  };

  const addSection = () => {
    setSections((prev) => [...prev, createEmptySection()]);
  };

  const removeSection = (index) => {
    setSections((prev) => {
      if (prev.length <= 1) return prev;
      revokeReplacementPreviews(prev[index]?.replacementImages || []);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSectionChange = (index, field, value) => {
    setSections((prev) =>
      prev.map((section, i) => (i === index ? { ...section, [field]: value } : section))
    );
  };

  const handleSectionImageChange = (index, files) => {
    const fileArray = Array.from(files || []);
    if (fileArray.length === 0) return;
    setSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, newImages: [...section.newImages, ...fileArray] } : section
      )
    );
  };

  const removeExistingImage = (sectionIndex, imageIndex) => {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;
        const nextReplacementImages = (section.replacementImages || [])
          .filter((asset) => {
            if (asset.targetIndex === imageIndex) {
              if (asset?.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(asset.previewUrl);
              return false;
            }
            return true;
          })
          .map((asset) =>
            asset.targetIndex > imageIndex
              ? { ...asset, targetIndex: asset.targetIndex - 1 }
              : asset
          );
        return {
          ...section,
          removedImages: [...(section.removedImages || []), section.image[imageIndex]].filter(Boolean),
          image: section.image.filter((_, idx) => idx !== imageIndex),
          replacementImages: nextReplacementImages,
        };
      })
    );
  };

  const removeNewImage = (sectionIndex, imageIndex) => {
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;
        return {
          ...section,
          newImages: section.newImages.filter((_, idx) => idx !== imageIndex),
        };
      })
    );
  };

  const handleReplaceExistingImage = (sectionIndex, imageIndex, file) => {
    if (!file) return;
    setSections((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;
        const current = Array.isArray(section.replacementImages) ? [...section.replacementImages] : [];
        const existingAtIndex = current.findIndex((asset) => asset.targetIndex === imageIndex);
        if (existingAtIndex !== -1) {
          const oldPreview = current[existingAtIndex]?.previewUrl;
          if (oldPreview?.startsWith("blob:")) URL.revokeObjectURL(oldPreview);
          current[existingAtIndex] = {
            targetIndex: imageIndex,
            file,
            previewUrl: URL.createObjectURL(file),
          };
        } else {
          current.push({
            targetIndex: imageIndex,
            file,
            previewUrl: URL.createObjectURL(file),
          });
        }
        return { ...section, replacementImages: current };
      })
    );
  };

  const validate = useMemo(() => {
    return String(formData.client_name || "").trim().length > 0;
  }, [formData.client_name]);

  const totalExistingImages = sections.reduce(
    (sum, section) => sum + (Array.isArray(section.image) ? section.image.length : 0),
    0
  );
  const totalNewImages = sections.reduce(
    (sum, section) => sum + (Array.isArray(section.newImages) ? section.newImages.length : 0),
    0
  );

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("casestudyId", id);
    payload.append("client_name", formData.client_name);
  
    payload.append("project_duration", formData.project_duration);
    payload.append("project_url", formData.project_url);
    payload.append("AchivementsCount", formData.AchivementsCount || 0);
    payload.append("successRate", formData.successRate || 0);

    const testimonialIds = parseArray(formData.testimonial);
    payload.append("testimonial", JSON.stringify(testimonialIds));

    // Send section text fields with indexed multipart keys.
    // This avoids stale/duplicate parsing between "content" JSON and indexed fields.

    sections.forEach((section, sectionIndex) => {
      payload.append(`content[${sectionIndex}][title]`, String(section.title || ""));
      payload.append(`content[${sectionIndex}][description]`, String(section.description || ""));

      section.newImages.forEach((file) => {
        payload.append(`content[${sectionIndex}][image]`, file);
      });
      const removedImages = (section.removedImages || [])
        .map((url) => String(url || "").trim())
        .filter(Boolean);
      if (removedImages.length > 0) {
        payload.append(`content[${sectionIndex}][removeImages]`, JSON.stringify(removedImages));
      }
      const replacementImages = (section.replacementImages || [])
        .filter((asset) => Number.isInteger(asset?.targetIndex) && asset?.file)
        .sort((a, b) => a.targetIndex - b.targetIndex);
      if (replacementImages.length > 0) {
        replacementImages.forEach((asset) => {
          payload.append(`content[${sectionIndex}][replaceIndexes]`, String(asset.targetIndex));
          payload.append(
            `content[${sectionIndex}][replace_image][${asset.targetIndex}]`,
            asset.file
          );
        });
      }
    });

    return payload;
  };

  const submitDetails = async (isUpdating) => {
    if (!id) {
      setError("CaseStudy ID is missing");
      return;
    }

    if (!validate) {
      setError("Client name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");
      const payload = buildPayload();

      const res = isUpdating
        ? await updateCasestudyDetails(id, payload)
        : await createCaseStudyDetails(payload);

      setMessage(res?.message || `CaseStudy details ${isUpdating ? "updated" : "created"} successfully`);
      await fetchDetails();
      navigate("/admin/add-caseStudy");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          `Failed to ${isUpdating ? "update" : "create"} case study details`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await submitDetails(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await submitDetails(true);
  };

  return (
    <div className="blogdetails-page">
      <div className="blogdetails-shell">
        <div className="blogdetails-topbar">
          <div>
            <h2 className="blogdetails-title">
              {isEdit ? "Update Case Study Details" : "Create Case Study Details"}
            </h2>
            <p className="blogdetails-subtitle">
              Case Study: {caseStudyTitle || "-"}
            </p>
          </div>
          <div className="blogdetails-stats">
            <span className="blogdetails-stat-chip">{sections.length} Sections</span>
            <span className="blogdetails-stat-chip">{totalExistingImages} Existing Images</span>
            <span className="blogdetails-stat-chip">{totalNewImages} New Images</span>
          </div>
        </div>

        {loading ? <p className="blogdetails-alert">Loading details...</p> : null}
        {message ? <p className="blogdetails-alert success">{message}</p> : null}
        {error ? <p className="blogdetails-alert error">{error}</p> : null}

        <Form className="blogdetails-form" onSubmit={isEdit ? handleUpdate : handleCreate}>
          <section className="blogdetails-panel">

            <h5 className="blogdetails-panel-title">Case Study Basics</h5>
            <div style={{display:'flex',columnGap:"1rem"}}>
            <Form.Group className="mb-3">
              <Form.Label>CaseStudy Title</Form.Label>
              <Form.Control value={caseStudyTitle || ""} disabled readOnly style={{width:"650px"}}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                name="client_name"
                value={formData.client_name}
                onChange={handleFieldChange}
                style={{width:"650px"}}
                required
              />
            </Form.Group>
</div>
           
<div style={{display:'flex',columnGap:"1rem"}}>
            <Form.Group className="mb-3">
              <Form.Label>Project Duration</Form.Label>
              <Form.Control
                name="project_duration"
                value={formData.project_duration}
                onChange={handleFieldChange}
                 style={{width:"650px"}}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Project URL</Form.Label>
              <Form.Control
                name="project_url"
                value={formData.project_url}
                onChange={handleFieldChange}
                 style={{width:"650px"}}
              />
            </Form.Group>
            </div>
<div style={{display:'flex',columnGap:"1rem"}}>
    <Form.Group className="mb-3">
              <Form.Label>Achievements Count</Form.Label>
              <Form.Control
                type="number"
                name="AchivementsCount"
                value={formData.AchivementsCount}
                onChange={handleFieldChange}
                 style={{width:"650px"}}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Success Rate</Form.Label>
              <Form.Control
                type="number"
                name="successRate"
                value={formData.successRate}
                onChange={handleFieldChange}
                 style={{width:"650px"}}
              />
            </Form.Group>
</div>
          

            <Form.Group>
              <Form.Label>Select Testimonial</Form.Label>
              <Form.Select
                name="testimonial"
                value={formData.testimonial || ""}
                onChange={handleTestimonialChange}
                disabled={testimonialLoading}
              >
                <option value="">Select testimonial</option>
                {testimonialOptions.map((item) => {
                  const optionId = String(item?._id || "");
                  const fullName = [item?.first_name, item?.last_name].filter(Boolean).join(" ").trim();
                  const role = String(item?.role || "").trim();
                  const company = String(item?.companyname || "").trim();
                  const labelParts = [
                    fullName || "Unnamed",
                    role ? `(${role})` : "",
                    company ? `- ${company}` : "",
                  ].filter(Boolean);

                  return (
                    <option key={optionId} value={optionId}>
                      {labelParts.join(" ")}
                    </option>
                  );
                })}
              </Form.Select>
              <small className="text-muted">
                {testimonialLoading
                  ? "Loading testimonials..."
                  : "Select one testimonial from the dropdown."}
              </small>
            </Form.Group>
          </section>

          <section className="blogdetails-panel">
            <h5 className="blogdetails-panel-title">Content Blocks</h5>
            {sections.map((section, index) => (
              <div key={index} className="blogdetails-section-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong className="blogdetails-section-title">Section {index + 1}</strong>
                    <p className="blogdetails-section-meta mb-0">
                      Existing: {section.image.length} | New: {section.newImages.length}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeSection(index)}
                  >
                    Remove
                  </Button>
                </div>

                <div className="blogdetails-editor-wrapper mb-2">
                  <Editor
                    value={section.title}
                    onTextChange={(e) => handleSectionChange(index, "title", e.htmlValue)}
                    style={{ height: "140px" }}
                  />
                </div>
                <div className="blogdetails-editor-wrapper mb-2">
                  <Editor
                    value={section.description}
                    onTextChange={(e) => handleSectionChange(index, "description", e.htmlValue)}
                    style={{ height: "220px" }}
                  />
                </div>

                {section.image.length > 0 ? (
                  <div className="blogdetails-inline-preview-list mb-2">
                    {section.image.map((img, imgIndex) => (
                      <div key={`${img}_${imgIndex}`} className="blogdetails-inline-preview-card">
                        <img
                          src={
                            section.replacementImages?.find((asset) => asset.targetIndex === imgIndex)
                              ?.previewUrl || img
                          }
                          alt={`existing_${imgIndex}`}
                          className="blogdetails-inline-preview-image"
                        />
                        <span className="blogdetails-inline-preview-index">{imgIndex + 1}</span>
                        <label
                          className="btn btn-sm btn-outline-primary"
                          style={{ position: "absolute", left: "8px", bottom: "8px", lineHeight: 1 }}
                        >
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              handleReplaceExistingImage(index, imgIndex, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ position: "absolute", top: "8px", right: "8px", lineHeight: 1 }}
                          onClick={() => removeExistingImage(index, imgIndex)}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                {section.newImages.length > 0 ? (
                  <div className="blogdetails-inline-preview-list mb-2">
                    {section.newImages.map((img, imgIndex) => (
                      <div key={`${img?.name || "new"}_${imgIndex}`} className="blogdetails-inline-preview-card">
                        <div className="blogdetails-inline-preview-image d-flex align-items-center justify-content-center text-center px-2">
                          <small>{img?.name || `image_${imgIndex + 1}`}</small>
                        </div>
                        <span className="blogdetails-inline-preview-index">N{imgIndex + 1}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ position: "absolute", top: "8px", right: "8px", lineHeight: 1 }}
                          onClick={() => removeNewImage(index, imgIndex)}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <label className="blogdetails-upload-box">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="blogdetails-hidden-input"
                    onChange={(e) => handleSectionImageChange(index, e.target.files)}
                  />
                  <span className="blogdetails-upload-title">Upload Section Images</span>
                  <span className="blogdetails-upload-subtitle">PNG, JPG up to 10MB</span>
                </label>
              </div>
            ))}

            <Button type="button" variant="outline-primary" onClick={addSection}>
              + Add Section
            </Button>
          </section>

          <div className="blogdetails-actionbar">
            <Button type="button" variant="outline-secondary" onClick={() => navigate("/admin/add-caseStudy")}>
              Back
            </Button>
            <Button type="submit" variant="success" disabled={saving || loading}>
              {saving ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CaseStudyDetailsPage;
