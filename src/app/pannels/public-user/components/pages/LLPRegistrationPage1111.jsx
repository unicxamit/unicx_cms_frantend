import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServicesById } from '../../../../../api'; // Assuming this API is accessible and relevant for fetching content by ID
import { loadScript, publicUrlFor } from "../../../../../globals/constants";
import JobZImage from "../../../../common/jobz-img";
import SectionDisplay from '../../LLPRegistrationPage/SectionDisplay'; // Assuming SectionDisplay is a reusable component

function CandidateDetail1Page() {
    // State to hold the dynamic data fetched from the API
    const [candidateData, setCandidateData] = useState({
        name: 'Loading Candidate...',
        title: 'Senior UI / UX Designer and Developer at Google INC', // Static default, consider making dynamic with API
        description: 'No description available.',
        meta_description: '', // Can be repurposed or omitted
        meta_keywords: '',    // Can be repurposed, potentially for skills
        sections: [],
        fee: '$20 / Day', // Static default, consider making dynamic with API
        location: 'United States', // Static default, consider making dynamic with API
        profileImage: 'images/candidates/pic2.jpg', // Static default, consider making dynamic with API
        // Hardcoded arrays for demonstration. Ideally, these would come from the API as well.
        skills: [
            "Finance", "Sales", "Part-time", "Administration", "Retail",
            "Engineering", "Developer", "Work from home", "IT Consulting", "Manufacturing"
        ],
        workExperience: [
            { date: "2012 to 2016", title: "Bluetech, Inc", position: "Senior PHP Developer", description: "One of the main areas that I work on with my clients is shedding these non-supportive beliefs and replacing them with beliefs that will help them to accomplish their desires." },
            { date: "2016 to 2020", title: "Amazon, Inc", position: "IT & Development", description: "One of the main areas that I work on with my clients is shedding these non-supportive beliefs and replacing them with beliefs that will help them to accomplish their desires." },
            { date: "2020 to 2023", title: "BGoogle, Inc", position: "Senior UI / UX Designer and Developer", description: "One of the main areas that I work on with my clients is shedding these non-supportive beliefs and replacing them with beliefs that will help them to accomplish their desires." }
        ],
        education: [
            { date: "2004 to 2006", title: "BCA - Bachelor of Computer Applications" }
        ]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Get the 'id' from the URL

    useEffect(() => {
        // Load external JS script, if required for UI interactions

        const fetchCandidateDetails = async () => {
            try {
                setLoading(true);
                // Call the API to get sub-sub-category details based on the ID
                const data = await getServicesById(id);

                console.log("Fetched data for CandidateDetail1Page:", data);

                // Parse sections data if it's a string, otherwise use directly
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

                // Update the state with fetched data, merging with existing static defaults
                setCandidateData(prevData => ({
                    ...prevData,
                    name: data.name || prevData.name,
                    description: data.description || prevData.description,
                    meta_keywords: data.meta_keywords || prevData.meta_keywords, // Use meta_keywords for skills
                    sections: sectionsData || prevData.sections
                }));
            } catch (err) {
                console.error("Failed to fetch candidate details:", err);
                setError("Failed to load details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCandidateDetails();
        } else {
            setLoading(false); // If no ID is provided in the URL, stop loading
            setError("No ID provided for candidate details.");
        }
    }, [id]); // Re-run effect if ID changes

    if (loading) {
        return <div className="text-center p-t120 p-b90">Loading candidate details...</div>;
    }

    if (error) {
        return <div className="text-center p-t120 p-b90 text-danger">{error}</div>;
    }

    return (
        <>
            <div className="section-full p-t120 p-b90 bg-white">
                <div className="container">
                    <div className="section-content">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8 col-md-12">
                                <div className="cabdidate-de-info">
                                    {/* Candidate Short Introduction Section */}
                                    <div className="twm-candi-self-wrap overlay-wraper" style={{ backgroundImage: `url(${publicUrlFor("images/candidates/candidate-bg.jpg")})` }}>
                                        <div className="overlay-main site-bg-primary opacity-01" />
                                        <div className="twm-candi-self-info">
                                            <div className="twm-candi-self-top">
                                                <div className="twm-candi-fee">{candidateData.fee}</div>
                                                <div className="twm-media">
                                                    <JobZImage src={publicUrlFor(candidateData.profileImage)} alt="Candidate Profile" />
                                                </div>
                                                <div className="twm-mid-content">
                                                    <h4 className="twm-job-title">{candidateData.name} </h4>
                                                    <p>{candidateData.title}</p>
                                                    <p className="twm-candidate-address"><i className="feather-map-pin" />{candidateData.location}</p>
                                                </div>
                                            </div>
                                            <div className="twm-candi-self-bottom">
                                                <a href="#" className="site-button outline-white">Hire Me Now</a>
                                                <a href="#" className="site-button secondry">Download CV</a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* About Me Section */}
                                    <h4 className="twm-s-title">About Me</h4>
                                    <p>{candidateData.description}</p>

                                    {/* Skills Section - Dynamically populated from meta_keywords if available */}
                                    {candidateData.meta_keywords && candidateData.meta_keywords.length > 0 ? (
                                        <>
                                            <h4 className="twm-s-title">Skills</h4>
                                            <div className="tw-sidebar-tags-wrap">
                                                <div className="tagcloud">
                                                    {candidateData.meta_keywords.split(',').map((skill, index) => (
                                                        <a key={index} href="#">{skill.trim()}</a>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="twm-s-title">Skills</h4>
                                            <div className="tw-sidebar-tags-wrap">
                                                <div className="tagcloud">
                                                    {candidateData.skills.map((skill, index) => (
                                                        <a key={index} href="#">{skill}</a>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}


                                    {/* Work Experience Section (Currently static, would need API integration) */}
                                    <h4 className="twm-s-title">Work Experience</h4>
                                    <div className="twm-timing-list-wrap">
                                        {candidateData.workExperience.map((exp, index) => (
                                            <div className="twm-timing-list" key={index}>
                                                <div className="twm-time-list-date">{exp.date}</div>
                                                <div className="twm-time-list-title">{exp.title}</div>
                                                <div className="twm-time-list-position">{exp.position}</div>
                                                <div className="twm-time-list-discription">
                                                    <p>{exp.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Education & Training Section (Currently static, would need API integration) */}
                                    <h4 className="twm-s-title">Education &amp; Training</h4>
                                    <div className="twm-timing-list-wrap">
                                        {candidateData.education.map((edu, index) => (
                                            <div className="twm-timing-list" key={index}>
                                                <div className="twm-time-list-date">{edu.date}</div>
                                                <div className="twm-time-list-title">{edu.title}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dynamic Sections (from API, similar to LLPRegistrationPage) */}
                                    {candidateData.sections && candidateData.sections.length > 0 && (
                                        <>
                                            <div className="wt-divider bg-gray-700"><i className="fa fa-dot-circle-o" /></div>
                                            <h4 className="twm-s-title">Additional Details</h4>
                                            {/* SectionDisplay component assumes it can handle the structure of candidateData.sections */}
                                            <SectionDisplay sections={candidateData.sections} />
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CandidateDetail1Page;

