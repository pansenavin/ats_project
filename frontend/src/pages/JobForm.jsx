import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Trash } from 'lucide-react';
import api from '../api/api';

const JobForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        pay_range_start: '',
        pay_range_end: '',
        job_type: 'full-time',
        location_type: 'on-site',
        status: 'draft',
        application_config: {
            require_covering_letter: true,
            custom_questions: []
        }
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            fetchJob();
        }
    }, [id]);

    const fetchJob = async () => {
        try {
            const response = await api.get(`/admin/jobs/${id}/`);
            setFormData(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConfigChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            application_config: { ...prev.application_config, [name]: checked }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Frontend validation
        let newErrors = {};
        let hasErrors = false;

        if (!formData.title?.trim()) {
            newErrors.title = ["Job title is required."];
            hasErrors = true;
        }
        if (!formData.location?.trim()) {
            newErrors.location = ["Location is required."];
            hasErrors = true;
        }
        if (!formData.description?.trim()) {
            newErrors.description = ["Description is required."];
            hasErrors = true;
        }
        if (formData.pay_range_start && Number(formData.pay_range_start) > 1000000000) {
            newErrors.pay_range_start = ["Maximum salary cannot exceed 1,000,000,000."];
            hasErrors = true;
        }
        if (formData.pay_range_end && Number(formData.pay_range_end) > 1000000000) {
            newErrors.pay_range_end = ["Maximum salary cannot exceed 1,000,000,000."];
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        try {
            if (id) {
                await api.put(`/admin/jobs/${id}/`, formData);
            } else {
                await api.post('/admin/jobs/', formData);
            }
            navigate('/admin');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setErrors(err.response.data);
            } else {
                setErrors({ general: ["An unexpected error occurred."] });
            }
        }
    };

    return (
        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/admin')} style={{ background: 'transparent', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <h1>{id ? 'Edit Job' : 'Create New Job'}</h1>

            <form onSubmit={handleSubmit} className="card" noValidate>
                <label>Job Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required />
                {errors.title && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '-0.5rem 0 1rem 0' }}>{errors.title[0]}</p>}

                <label>Location</label>
                <input name="location" value={formData.location} onChange={handleChange} required />
                {errors.location && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '-0.5rem 0 1rem 0' }}>{errors.location[0]}</p>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Job Type</label>
                        <select name="job_type" value={formData.job_type} onChange={handleChange}>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="internship">Internship</option>
                            <option value="contract">Contract</option>
                        </select>
                    </div>
                    <div>
                        <label>Location Type</label>
                        <select name="location_type" value={formData.location_type} onChange={handleChange}>
                            <option value="on-site">On-Site</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Minimum Pay Range</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ paddingRight: '8px', color: '#666', fontWeight: 'bold' }}>RS.</span>
                            <input name="pay_range_start" type="number" step="0.01" value={formData.pay_range_start} onChange={handleChange} style={{ flexGrow: 1 }} />
                            <span style={{ paddingLeft: '8px', color: '#666' }}>Monthly</span>
                        </div>
                        {errors.pay_range_start && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>{errors.pay_range_start[0]}</p>}
                    </div>
                    <div>
                        <label>Maximum Pay Range</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ paddingRight: '8px', color: '#666', fontWeight: 'bold' }}>RS.</span>
                            <input name="pay_range_end" type="number" step="0.01" value={formData.pay_range_end} onChange={handleChange} style={{ flexGrow: 1 }} />
                            <span style={{ paddingLeft: '8px', color: '#666' }}>Monthly</span>
                        </div>
                        {errors.pay_range_end && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>{errors.pay_range_end[0]}</p>}
                    </div>
                </div>

                <label>Description</label>
                <textarea name="description" rows="5" value={formData.description} onChange={handleChange} required />
                {errors.description && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '-0.5rem 0 1rem 0' }}>{errors.description[0]}</p>}

                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="live">Live</option>
                    <option value="closed">Closed</option>
                </select>

                <h3 style={{ marginTop: '2rem' }}>Application Form Settings</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="require_covering_letter"
                        style={{ width: 'auto' }}
                        checked={formData.application_config.require_covering_letter}
                        onChange={handleConfigChange}
                    />
                    Require Covering Letter
                </label>

                {errors.general && <div style={{ color: '#ef4444', background: '#fef2f2', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{errors.general[0]}</div>}

                <button type="submit" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={18} /> {id ? 'Update Job' : 'Create Job'}
                </button>
            </form>
        </div>
    );
};

export default JobForm;
