import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getServicesById,
    getCategories,
    getSubCategories,
    addServices,
    updateServices
} from '../../../../../api';
import SectionEditor from './SectionEditor'; // Import the SectionEditor component

function ServicesDetailsAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        category_id: '',
        subcategory_id: '',
        meta_description: '',
        meta_keywords: '',
        description: '',
        sections: [] // Initialize with empty array
    });

    // Load categories on component mount
    useEffect(() => {
        loadCategories();
    }, []);

    // If ID is provided, fetch details; also load subcategories when category changes
    useEffect(() => {
        if (isEditing) {
            fetchServicesDetails();
        }

        if (formData.category_id) {
            loadSubcategories(formData.category_id);
        }
    }, [id, formData.category_id]);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            setMessage('Failed to load categories.');
        }
    };

    const loadSubcategories = async (categoryId) => {
        try {
            const data = await getSubCategories();
            const filteredSubcategories = data.filter(
                subcategory => subcategory.category_id.toString() === categoryId.toString()
            );
            setSubcategories(filteredSubcategories);
        } catch (error) {
            setMessage('Failed to load subcategories.');
        }
    };

    const fetchServicesDetails = async () => {
        try {
            setLoading(true);
            const data = await getServicesById(id);

            console.log("Fetched data:", data);

            // Process sections data
            let sectionsData = [];
            if (data.sections) {
                if (typeof data.sections === 'string') {
                    try {
                        sectionsData = JSON.parse(data.sections);
                    } catch (e) {
                        console.error('Error parsing sections:', e);
                        sectionsData = [];
                    }
                } else if (Array.isArray(data.sections)) {
                    sectionsData = data.sections;
                }
            }

            // Initialize form data with all fields including sections
            setFormData({
                name: data.name || '',
                title: data.title || '',
                category_id: data.category_id || '',
                subcategory_id: data.subcategory_id || '',
                meta_description: data.meta_description || '',
                meta_keywords: data.meta_keywords || '',
                description: data.description || '',
                sections: sectionsData
            });

            setDataLoaded(true);
        } catch (error) {
            setMessage('Failed to fetch sub-sub-category details.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle the sections data from SectionEditor
    const handleSectionsChange = (updatedSections) => {
        setFormData(prev => ({
            ...prev,
            sections: updatedSections
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setMessage('Please enter a name for the sub-sub-category.');
            return false;
        }

        if (!formData.title.trim()) {
            setMessage('Please enter a title for the sub-sub-category.');
            return false;
        }

        if (!formData.category_id) {
            setMessage('Please select a category.');
            return false;
        }

        if (!formData.subcategory_id) {
            setMessage('Please select a subcategory.');
            return false;
        }

        // Validate sections
        for (let i = 0; i < formData.sections.length; i++) {
            const section = formData.sections[i];
            if (!section.title || !section.description) {
                setMessage(`Please fill all required fields in section ${i + 1}`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Prepare data for submission
            const submitData = {
                ...formData,
                sections: formData.sections.length > 0 ? formData.sections : null
            };

            let response;
            if (isEditing) {
                response = await updateServices(id, submitData);

                // Update local state with the returned data
                if (response.sections) {
                    setFormData(prev => ({
                        ...prev,
                        ...response,
                        sections: response.sections
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        ...response,
                        sections: []
                    }));
                }
            } else {
                response = await addServices(submitData);
                navigate('/admin/subsubcategories');
            }

            setMessage(response.message || `Sub-sub-category ${isEditing ? 'updated' : 'created'} successfully`);

        } catch (error) {
            setMessage(error.response?.data?.message || `Error ${isEditing ? 'updating' : 'creating'} sub-sub-category.`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
            <h2 className="text-center mb-4">
                {isEditing ? 'Edit Sub-Sub-Category Details' : 'Create New Sub-Sub-Category'}
            </h2>

            {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`}>
                    {message}
                </div>
            )}

            {loading && !dataLoaded ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>Basic Information</h4>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter name (for internal reference)"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter title (displayed to users)"
                                />
                            </div>


                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Main Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter main description"
                                ></textarea>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="meta_keywords" className="form-label">Meta Keywords</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="meta_keywords"
                                        name="meta_keywords"
                                        value={formData.meta_keywords}
                                        onChange={handleInputChange}
                                        placeholder="Comma separated keywords"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="meta_description" className="form-label">Meta Description</label>
                                    <textarea
                                        className="form-control"
                                        id="meta_description"
                                        name="meta_description"
                                        rows="2"
                                        value={formData.meta_description}
                                        onChange={handleInputChange}
                                        placeholder="Brief description for SEO"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>Content Sections</h4>
                        </div>
                        <div className="card-body">
                            {/* Replace the old sections handling with SectionEditor */}
                            <SectionEditor
                                sections={formData.sections}
                                onChange={handleSectionsChange}
                            />
                        </div>
                    </div>

                    <div className="d-grid gap-2">
                        <button
                            type="submit"
                            className="btn btn-success btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                isEditing ? 'Update Sub-Sub-Category' : 'Create Sub-Sub-Category'
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default ServicesDetailsAdmin;