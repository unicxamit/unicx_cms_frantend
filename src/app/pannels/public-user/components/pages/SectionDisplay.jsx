import React, { useState } from 'react';
import sanitizeHtml from '../../../../../utils/sanitizeHtml';

const SectionDisplay = ({ sections }) => {
  const sectionData = Array.isArray(sections) ? sections : [];
  const [errorImages, setErrorImages] = useState({});

  const BASE_URL = 'https://api.unicx.in';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    return `${BASE_URL}${imagePath}`;
  };

  const handleImageError = (index) => {
    if (!errorImages[index]) {
      console.error("Image failed to load for section:", index);
      setErrorImages(prev => ({ ...prev, [index]: true }));
    }
  };

  const sectionHasValidImage = (section, index) => {
    return section.image &&
      typeof section.image === 'string' &&
      section.image.trim() !== '' &&
      !errorImages[index];
  };

  if (sectionData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No sections available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {sectionData.map((section, index) => {
        const hasImage = sectionHasValidImage(section, index);
        if (!hasImage) {
          return (
            <div key={index} className="mb-16">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="text-blue-500"> {section.title}</span>
                </h2>
                <div
                  className="text-lg text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.description || '') }}
                />
              </div>
            </div>
          );
        }

        // For sections with images - always text on left, image on right
        return (

          <div key={index} className="mb-16">
            <div className="flex flex-col md:flex-row items-start gap-8" style={{ display: 'flex', margin: '2rem', justifyContent: 'space-between', width: '100%' }}>
              <div className="flex w-full md:w-2/3" >
                <h2 className="text-3xl font-bold mb-6" style={{ marginRight: '67px' }}>

                  {section.title || `Section ${index + 1}`}
                </h2>
                <div
                  className="text-lg text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.description || '') }}
                />
              </div>
              <div className="w-small md:w-1/3" style={{ maxWidth: '20%' }}>
                <img
                  src={getImageUrl(section.image)}
                  alt={section.title || 'Section image'}
                  className="w-full object-contain"
                  onError={() => handleImageError(index)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionDisplay;
