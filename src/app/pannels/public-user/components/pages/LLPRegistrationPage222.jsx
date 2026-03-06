import React, { useEffect, useState } from 'react';
import { getServicesById } from '../../../../../api';
import { useParams } from 'react-router-dom';
import SectionDisplay from './SectionDisplay';

// Custom CSS styles
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
    },
    nav: {
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '8px 32px'
    },
    navInner: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center'
    },
    breadcrumbs: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        padding: '8px 0'
    },
    breadcrumbLink: {
        color: '#2563eb',
        textDecoration: 'none'
    },
    breadcrumbSeparator: {
        margin: '0 8px',
        color: '#6b7280'
    },
    breadcrumbCurrent: {
        color: '#374151'
    },
    main: {
        flexGrow: 1,
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 16px'
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
    },
    leftColumn: {
        flex: '7'
    },
    rightColumn: {
        flex: '5',
        marginTop: '32px'
    },
    heading: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '24px'
    },
    featureList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '16px'
    },
    featureItem: {
        display: 'flex',
        alignItems: 'flex-start'
    },
    featureIcon: {
        marginTop: '4px',
        marginRight: '12px',
        color: '#3b82f6',
        width: '20px',
        height: '20px'
    },
    featureText: {
        color: '#4b5563',
        fontSize: '15px'
    },
    linkBlue: {
        color: '#3b82f6',
        cursor: 'pointer'
    },
    buttonRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '48px',
        marginBottom: '32px'
    },
    buttonPrimary: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 24px',
        backgroundColor: '#fde047',
        borderRadius: '9999px',
        border: 'none',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '14px'
    },
    buttonSecondary: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 24px',
        backgroundColor: '#f3f4f6',
        borderRadius: '9999px',
        border: 'none',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '14px'
    },
    buttonIcon: {
        marginRight: '8px',
        width: '16px',
        height: '16px'
    },
    statsText: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#111827',
        marginTop: '48px'
    },
    divider: {
        borderTop: '1px solid #e5e7eb',
        marginTop: '64px',
        paddingTop: '48px'
    },
    sectionHeading: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '16px'
    },
    paragraph: {
        color: '#4b5563',
        marginBottom: '16px',
        lineHeight: '1.6',
        fontSize: '14px'
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '24px',
        position: 'relative'
    },
    saleBadge: {
        position: 'absolute',
        top: '-16px',
        right: '32px'
    },
    saleBadgeInner: {
        backgroundColor: '#fef9c3',
        padding: '4px 12px',
        borderRadius: '8px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    monthTag: {
        position: 'absolute',
        top: '-16px',
        right: '12px',
        backgroundColor: '#fbbf24',
        fontSize: '12px',
        borderRadius: '9999px',
        padding: '2px 8px'
    },
    saleText: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginRight: '8px'
    },
    discountTag: {
        backgroundColor: '#ef4444',
        color: 'white',
        fontSize: '12px',
        padding: '2px 8px',
        borderRadius: '4px'
    },
    formHeading: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '24px',
        marginTop: '16px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px'
    },
    whatsappRow: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        paddingTop: '8px'
    },
    whatsappLabel: {
        color: '#4b5563',
        marginRight: '8px'
    },
    whatsappIcon: {
        width: '16px',
        height: '16px',
        color: '#22c55e',
        marginRight: '4px'
    },
    toggleContainer: {
        position: 'relative',
        display: 'inline-block',
        width: '36px',
        height: '20px',
        marginLeft: '4px'
    },
    toggleInput: {
        opacity: 0,
        width: 0,
        height: 0
    },
    toggleSlider: {
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#e5e7eb',
        borderRadius: '34px',
        transition: '0.4s'
    },
    toggleKnob: {
        position: 'absolute',
        content: '""',
        height: '16px',
        width: '16px',
        left: '2px',
        bottom: '2px',
        backgroundColor: 'white',
        borderRadius: '50%',
        transition: '0.4s',
        border: '1px solid #d1d5db'
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#fbbf24',
        padding: '12px',
        borderRadius: '8px',
        fontWeight: 'bold',
        color: '#1f2937',
        border: 'none',
        cursor: 'pointer',
        marginTop: '16px'
    },
    ratingSection: {
        marginTop: '32px',
        display: 'flex',
        alignItems: 'center'
    },
    googleIcon: {
        marginRight: '16px',
        width: '36px',
        height: '36px',
        borderRadius: '50%'
    },
    ratingInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    ratingText: {
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '1.4'
    },
    starContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '4px'
    },
    star: {
        color: '#f59e0b',
        width: '16px',
        height: '16px'
    },
    starHalf: {
        color: '#f59e0b',
        width: '16px',
        height: '16px',
        clipPath: 'inset(0 50% 0 0)'
    },
    ratingValue: {
        fontSize: '12px',
        marginLeft: '4px'
    },
    reviewCount: {
        fontSize: '12px',
        marginLeft: '16px'
    },
    fontMedium: {
        fontWeight: '500'
    },
    // Media query style handling
    '@media (min-width: 768px)': {
        contentWrapper: {
            flexDirection: 'row'
        },
        rightColumn: {
            marginTop: '0'
        },
        buttonRow: {
            flexDirection: 'row'
        }
    }
};

// CheckCircle icon component
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.featureIcon}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

// Play icon component
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.buttonIcon}>
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="10 8 16 12 10 16 10 8"></polygon>
    </svg>
);

// FileText icon component
const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.buttonIcon}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

// WhatsApp icon component
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={styles.whatsappIcon}>
        <path d="M17.6 6.32A8.78 8.78 0 0 0 12.25 4.75a8.94 8.94 0 0 0-7.86 4.53 8.85 8.85 0 0 0 1.24 10.13l.11.12-.47 1.7 1.73-.46L8.28 21a8.88 8.88 0 0 0 3.97.94 8.94 8.94 0 0 0 8.09-5 8.81 8.81 0 0 0-2.74-10.62zm-1.21 7.31c-.18.27-.4.5-.66.67-.28.18-.57.29-.9.33-.35.05-.81.03-1.29-.08-.65-.15-1.37-.44-2.22-.87-1.59-.82-2.78-1.96-3.38-2.57-.06-.06-.07-.06-.04-.03-1.88-1.93-2.49-3.27-2.51-4.54 0-.44.12-.79.34-1.03.18-.19.39-.29.64-.31h.88c.18-.01.39.1.6.3.21.2.47.59.68 1.05l.19.39c.13.25.21.47.26.58.09.2.05.37-.12.59-.12.14-.26.3-.43.48-.12.12-.21.22-.27.29-.17.18-.2.33-.09.52.51.91 1.11 1.64 1.81 2.19.77.6 1.81 1.13 2.68 1.35.1.03.2.03.27.02.11-.01.22-.08.32-.17 0 0 .06-.05.19-.19l.21-.21c.18-.18.34-.23.51-.19.16.04.71.33 1.03.5.32.17.87.49 1.12.65.25.16.39.28.45.39.1.18.07.35-.12.54z" />
    </svg>
);

// Star icon component
const StarIcon = ({ full = true }) => (
    <svg className={full ? "star" : "star-half"} style={full ? styles.star : styles.starHalf} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export default function LLPRegistrationPage() {
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
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [message, setMessage] = useState('');
    const { id } = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCheckboxChange = () => {
        setFormData({
            ...formData,
            whatsappUpdates: !formData.whatsappUpdates
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };



    // Apply media query styles
    const getResponsiveStyles = () => {
        if (window.innerWidth >= 768) {
            return {
                contentWrapper: {
                    ...styles.contentWrapper,
                    flexDirection: 'row'
                },
                rightColumn: {
                    ...styles.rightColumn,
                    marginTop: 0
                },
                buttonRow: {
                    ...styles.buttonRow,
                    flexDirection: 'row'
                }
            };
        }
        return {};
    };

    // Combine base styles with responsive styles
    const responsiveStyles = {
        ...styles,
        ...getResponsiveStyles()
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

            console.log(formData.sections);

            setDataLoaded(true);
        } catch (error) {
            setMessage('Failed to fetch sub-sub-category details.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServicesDetails();
    }, [id]);

    return (
        <div style={styles.container}>
            {/* Navigation */}

            {/* Main Content */}
            <main style={styles.main}>
                <div style={window.innerWidth >= 768 ?
                    { ...styles.contentWrapper, flexDirection: 'row' } :
                    styles.contentWrapper}>

                    {/* Left column - Registration Info */}
                    <div style={styles.leftColumn}>
                        <h1 style={styles.heading}>
                            {formData.name}
                        </h1>

                        <div style={styles.featureList}>
                            <div style={styles.featureItem}>
                                <CheckCircleIcon />
                                <div>
                                    <p style={styles.featureText}>
                                        {formData.description}
                                    </p>
                                </div>
                            </div>

                            <div style={styles.featureItem}>
                                <CheckCircleIcon />
                                <div>
                                    <p style={styles.featureText}>
                                        {formData.meta_description}
                                    </p>
                                </div>
                            </div>

                            <div style={styles.featureItem}>
                                <CheckCircleIcon />
                                <div>
                                    <p style={styles.featureText}>
                                        {formData.meta_keywords}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div style={window.innerWidth >= 768 ?
                            { ...styles.buttonRow, flexDirection: 'row' } :
                            styles.buttonRow}>
                            <button style={styles.buttonPrimary}>
                                <PlayIcon />
                                <span>Know about LLP registration in 60 sec</span>
                            </button>

                            <button style={styles.buttonSecondary}>
                                <FileTextIcon />
                                <span>View Sample Certificate</span>
                            </button>
                        </div>

                        <div>
                            <h2 style={styles.statsText}>
                                <span>10,000+</span> LLP registrations since 2011
                            </h2>
                        </div>

                    </div>


                    {/* Right column - Registration Form */}
                    <div style={window.innerWidth >= 768 ?
                        { ...styles.rightColumn, marginTop: 0 } :
                        styles.rightColumn}>
                        <div style={styles.formCard}>
                            {/* Sale Badge */}
                            <div style={styles.saleBadge}>
                                <div style={styles.saleBadgeInner}>
                                    <span style={styles.monthTag}>April</span>
                                    <span style={styles.saleText}>Festive sale</span>
                                    <div style={styles.discountTag}>50% OFF</div>
                                </div>
                            </div>

                            <h3 style={styles.formHeading}>Register your company today</h3>

                            <form style={styles.form} onSubmit={handleSubmit}>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        placeholder="Mobile Number"
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="City/Pincode"
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.whatsappRow}>
                                    <span style={styles.whatsappLabel}>Get easy updates through</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <WhatsAppIcon />
                                        <span>Whatsapp</span>
                                        <label style={styles.toggleContainer}>
                                            <input
                                                type="checkbox"
                                                style={styles.toggleInput}
                                                checked={formData.whatsappUpdates}
                                                onChange={handleCheckboxChange}
                                            />
                                            <span style={{
                                                ...styles.toggleSlider,
                                                backgroundColor: formData.whatsappUpdates ? '#22c55e' : '#e5e7eb'
                                            }}>
                                                <span style={{
                                                    ...styles.toggleKnob,
                                                    transform: formData.whatsappUpdates ? 'translateX(16px)' : 'translateX(0)'
                                                }}></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={styles.submitButton}
                                >
                                    Get Started
                                </button>
                            </form>

                            <div style={styles.ratingSection}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" style={styles.googleIcon}>
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                    </svg>
                                </div>
                                <div style={styles.ratingInfo}>
                                    <p style={styles.ratingText}>India's highest-rated<br />legal tax and compliance platform.</p>
                                    <div style={styles.starContainer}>
                                        <div style={{ display: 'flex' }}>
                                            <StarIcon />
                                            <StarIcon />
                                            <StarIcon />
                                            <StarIcon />
                                            <StarIcon full={false} />
                                        </div>
                                        <span style={styles.ratingValue}>4.5/5</span>
                                        <span style={styles.reviewCount}>18k+ Happy Reviews</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <SectionDisplay sections={formData.sections} />
        </div>


    );
}

