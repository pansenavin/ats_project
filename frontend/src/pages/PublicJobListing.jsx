import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const PublicJobListing = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/public/jobs/');
            setJobs(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Join Our Team</h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Check out our open positions and apply today.</p>
            </header>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {jobs.map(job => (
                    <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: '0 0 0.5rem 0' }}>{job.title}</h2>
                            <p style={{ margin: 0, color: '#94a3b8' }}>{job.location} • {job.job_type} • {job.location_type}</p>
                        </div>
                        <Link to={`/jobs/${job.id}`}>
                            <button>Apply Now</button>
                        </Link>
                    </div>
                ))}
                {jobs.length === 0 && <p style={{ textAlign: 'center' }}>No open positions at the moment.</p>}
            </div>
        </div>
    );
};

export default PublicJobListing;
