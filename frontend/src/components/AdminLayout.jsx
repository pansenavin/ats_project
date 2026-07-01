import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem 2rem', 
                background: 'rgba(255,255,255,0.02)', 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '2rem'
            }}>
                <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Job Portal Admin</h2>
                </Link>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#ef4444' }}>
                    <LogOut size={18} /> Logout
                </button>
            </header>
            <main style={{ flexGrow: 1, padding: '0 2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
