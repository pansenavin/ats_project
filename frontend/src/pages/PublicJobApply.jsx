import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../api/api';

const PublicJobApply = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        resume: null,
        covering_letter: '',
        custom_answers: {}
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const response = await api.get(`/public/jobs/${id}/`);
            setJob(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let newErrors = {};
        let hasErrors = false;

        if (!formData.full_name?.trim()) {
            newErrors.full_name = ["Full Name is required."];
            hasErrors = true;
        }
        
        if (!formData.email?.trim()) {
            newErrors.email = ["Email Address is required."];
            hasErrors = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = ["Please enter a valid email address."];
            hasErrors = true;
        }

        if (!formData.resume) {
            newErrors.resume = ["Please upload a resume."];
            hasErrors = true;
        }

        if (job.application_config?.require_covering_letter && !formData.covering_letter?.trim()) {
            newErrors.covering_letter = ["Covering Letter is required."];
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        try {
            const data = new FormData();
            data.append('job', id);
            data.append('full_name', formData.full_name);
            data.append('email', formData.email);
            data.append('resume', formData.resume);
            if (formData.covering_letter) {
                data.append('covering_letter', formData.covering_letter);
            }
            data.append('custom_answers', JSON.stringify(formData.custom_answers));

            await api.post('/applications/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setErrors(err.response.data);
            } else {
                setErrors({ general: ["An unexpected error occurred. Please try again."] });
            }
        }
    };

    if (!job) return <div>Loading...</div>;

    if (submitted) {
        return (
            <div className="card" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
                <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
                <h1>Application Submitted!</h1>
                <p>Thank you for applying for the {job.title} position. We'll be in touch soon.</p>
                <button onClick={() => navigate('/jobs')} style={{ marginTop: '2rem' }}>Back to Jobs</button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/jobs')} style={{ background: 'transparent', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}>
                <ArrowLeft size={18} /> Back to Openings
            </button>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: '0 0 0.5rem 0' }}>{job.title}</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>{job.location} • {job.job_type}</p>
                <hr style={{ border: '0', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />
                <div style={{ whiteSpace: 'pre-wrap' }}>{job.description}</div>
            </div>

            <div className="card">
                <h2>Apply for this position</h2>
                {errors.general && <div style={{ color: '#ef4444', background: '#fee2e2', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{errors.general[0]}</div>}
                <form onSubmit={handleSubmit} noValidate>
                    <label>Full Name</label>
                    <input name="full_name" value={formData.full_name} onChange={handleChange} required />
                    {errors.full_name && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '-0.5rem 0 1rem 0' }}>{errors.full_name[0]}</p>}

                    <label>Email Address</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                    {errors.email && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '-0.5rem 0 1rem 0' }}>{errors.email[0]}</p>}

                    <label>Resume File</label>
                    <input name="resume" type="file" onChange={handleChange} required />
                    {errors.resume && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '-0.5rem 0 1rem 0' }}>{errors.resume[0]}</p>}

                    {job.application_config?.require_covering_letter && (
                        <>
                            <label>Covering Letter</label>  
                            <textarea name="covering_letter" rows="5" value={formData.covering_letter} onChange={handleChange} required />
                            {errors.covering_letter && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '-0.5rem 0 1rem 0' }}>{errors.covering_letter[0]}</p>}
                        </>
                    )}

                    <button type="submit" style={{ width: '100%', marginTop: '2rem', height: '3.5rem', fontSize: '1.1rem' }}>Submit Application</button>
                </form>
            </div>
        </div>
    );
};

export default PublicJobApply;
