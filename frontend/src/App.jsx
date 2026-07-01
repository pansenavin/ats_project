import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import JobForm from './pages/JobForm';
import PublicJobListing from './pages/PublicJobListing';
import PublicJobApply from './pages/PublicJobApply';
import AdminLayout from './components/AdminLayout';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/jobs/new" element={<JobForm />} />
                    <Route path="/admin/jobs/:id" element={<JobForm />} />
                </Route>

                <Route path="/jobs" element={<PublicJobListing />} />
                <Route path="/jobs/:id" element={<PublicJobApply />} />

                <Route path="/" element={<Navigate to="/jobs" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
