import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import axios from 'axios'; // Remove axios as we will use the shared API instance
import { uploadSectionImage } from '../../../../../api';

const SectionEditor = ({ sections = [], onChange }) => {
  const [loading, setLoading] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  const API_BASE_URL_FOR_STATIC_FILES = 'https://api.unicx.in';

  const sectionData = Array.isArray(sections) ? sections : [];

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sectionData];
    if (!updatedSections[index]) {
      updatedSections[index] = {};
    }
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    onChange(updatedSections);
  };

  const handleImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return; // Exit if no file is selected

    setImageErrors(prev => ({ ...prev, [index]: false }));

    setLoading(prev => ({ ...prev, [index]: true }));

    try {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should not exceed 5MB');
        setLoading(prev => ({ ...prev, [index]: false }));
        return;
      }

      const formData = new FormData();
      formData.append('image', file); // 'image' should match the name your backend expects (req.files.image)

      const responseData = await uploadSectionImage(formData);

      if (responseData && responseData.path) {
        let imagePath = responseData.path;
        handleSectionChange(index, 'image', imagePath);
      } else {
        throw new Error('Invalid response from server: missing path for uploaded image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
      setImageErrors(prev => ({ ...prev, [index]: true }));
    } finally {
      setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const addSection = () => {
    const newSection = { title: '', description: '', image: '' };
    onChange([...sectionData, newSection]); // Add new section and update parent state
  };

  const removeSection = (index) => {
    const updatedSections = [...sectionData];
    updatedSections.splice(index, 1); // Remove section from array
    onChange(updatedSections); // Update parent state

    if (imageErrors[index]) {
      const newErrors = { ...imageErrors };
      delete newErrors[index];
      setImageErrors(newErrors);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    return `${API_BASE_URL_FOR_STATIC_FILES}${imagePath}`;
  };

  return (
    <div>
      {sectionData.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">No sections added yet. Click "Add Section" to create content.</p>
        </div>
      )}

      {sectionData.map((section, index) => (
        <div key={index} className="card mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5>{section.title || `Section ${index + 1}`}</h5>
            <button
              type="button"
              onClick={() => removeSection(index)}
              className="btn btn-sm btn-danger"
            >
              Remove
            </button>
          </div>

          <div className="card-body">
            <div className="mb-3">
              <label htmlFor={`section-title-${index}`} className="form-label">Section Title</label>
              <input
                type="text"
                id={`section-title-${index}`}
                value={section.title || ''}
                onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor={`section-description-${index}`} className="form-label">Section Description (Rich Text)</label>
              <ReactQuill
                id={`section-description-${index}`}
                value={section.description || ''}
                onChange={(value) => handleSectionChange(index, 'description', value)}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                  ]
                }}
              />
              <small className="text-muted">Add formatting, lists and links to make your content more engaging</small>
            </div>

            <div className="mb-3">
              <label htmlFor={`section-image-${index}`} className="form-label">Section Image</label>
              <input
                type="file"
                id={`section-image-${index}`}
                accept="image/*"
                onChange={(e) => handleImageChange(index, e)}
                className="form-control"
              />

              {loading[index] && (
                <div className="mt-2">
                  <span className="spinner-border spinner-border-sm text-primary me-2" role="status" aria-hidden="true"></span>
                  <span className="text-primary">Uploading...</span>
                </div>
              )}

              {section.image && (
                <div className="mt-3">
                  {imageErrors[index] ? (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Image failed to load. Please try uploading again.
                    </div>
                  ) : (
                    <img
                      src={getImageUrl(section?.image)} // Get the full URL for display
                      alt="Section preview"
                      className="img-thumbnail"
                      style={{ maxHeight: '150px' }}
                      onError={(e) => {
                        if (!imageErrors[index]) {
                          console.error("Image failed to load:", section.image);
                          setImageErrors(prev => ({ ...prev, [index]: true }));
                          e.target.style.display = 'none'; // Hide broken image icon
                        }
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleSectionChange(index, 'image', ''); // Clear the image path
                      setImageErrors(prev => { // Clear any related error state
                        const newErrors = { ...prev };
                        delete newErrors[index];
                        return newErrors;
                      });
                    }}
                    className="btn btn-sm btn-danger mt-2 d-block"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-center mb-4">
        <button
          type="button"
          onClick={addSection}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Section
        </button>
      </div>
    </div>
  );
};

export default SectionEditor;
