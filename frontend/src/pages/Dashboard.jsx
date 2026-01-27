import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="pt-24 px-6 container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Welcome back, {user.name}!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <h3 className="font-medium text-blue-800">Your Company</h3>
                        <p className="text-2xl font-bold text-blue-900 mt-2">FinSight Inc.</p>
                        <p className="text-sm text-blue-600 mt-1">ID: {user.companyId}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-md border border-green-100">
                        <h3 className="font-medium text-green-800">Role</h3>
                        <p className="text-2xl font-bold text-green-900 mt-2">{user.role}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                        <h3 className="font-medium text-purple-800">Account Status</h3>
                        <p className="text-2xl font-bold text-purple-900 mt-2">Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
