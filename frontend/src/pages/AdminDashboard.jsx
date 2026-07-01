import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, LogOut, ExternalLink, Users } from 'lucide-react';
import api from '../api/api';

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/admin/jobs/');
            setJobs(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };



    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/admin/jobs/new">
                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> New Job
                        </button>
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {jobs.map(job => (
                    <div key={job.id} className="card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{job.title}</h3>
                            <span style={{
                                padding: '0.2rem 0.6rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                background: job.status === 'live' ? '#059669' : '#4b5563'
                            }}>
                                {job.status.toUpperCase()}
                            </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8', flexGrow: 1 }}>{job.location} • {job.job_type}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                            <Link to={`/admin/jobs/${job.id}`}>
                                <button style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6' }}>Edit</button>
                            </Link>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <a href={`/jobs/${job.id}`} target="_blank" rel="noreferrer">
                                    <button style={{ background: '#1e293b' }} title="View Public Page"><ExternalLink size={16} /></button>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
                {jobs.length === 0 && <p>No jobs found. Create your first job!</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;
