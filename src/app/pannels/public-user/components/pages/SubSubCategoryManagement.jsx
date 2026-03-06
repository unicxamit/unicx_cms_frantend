import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SectionEditor from './SectionEditor';
import SectionDisplay from './SectionDisplay';
import sanitizeHtml from '../../../../../utils/sanitizeHtml';
// import {+} from '../../../../../api'
const ServicesManagement = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [Services, setServices] = useState({
    category_id: '',
    subcategory_id: '',
    name: '',
    title: '',
    description: '',
    meta_description: '',
    meta_keywords: '',
    sections: []
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and subcategories for dropdowns
        const [categoriesRes, subCategoriesRes, ServicesRes] = await Promise.all([
          axios.get('/categories'),
          axios.get('/subcategories'),
          axios.get(`/subsubcategories/${id}`)
        ]);

        setCategories(categoriesRes.data);
        setSubCategories(subCategoriesRes.data);

        // Ensure sections is an array
        const fetchedData = ServicesRes.data;
        if (!fetchedData.sections) {
          fetchedData.sections = [];
        }

        setServices(fetchedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please refresh the page.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServices(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionsChange = (updatedSections) => {
    setServices(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await axios.put(`/update-Services/${id}`, Services);
      setServices(response.data);
      alert('Sub-sub-category updated successfully!');
    } catch (err) {
      console.error('Error updating sub-sub-category:', err);
      setError('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Sub-sub-category</h1>
        <button
          type="button"
          onClick={() => setPreviewMode(!previewMode)}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          {previewMode ? 'Back to Edit' : 'Preview'}
        </button>
      </div>

      {previewMode ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{Services.title || Services.name}</h2>
          <div className="mb-8">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(Services.description) }} />
          </div>
          <SectionDisplay sections={Services.sections} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category_id"
                value={Services.category_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subcategory</label>
              <select
                name="subcategory_id"
                value={Services.subcategory_id}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Subcategory</option>
                {subCategories
                  .filter(sc => sc.category_id == Services.category_id)
                  .map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={Services.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={Services.title || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={Services.description || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea
                name="meta_description"
                value={Services.meta_description || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Meta Keywords</label>
              <textarea
                name="meta_keywords"
                value={Services.meta_keywords || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          </div>

          <div className="mb-6">
            <SectionEditor
              sections={Services.sections}
              onChange={handleSectionsChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServicesManagement;
