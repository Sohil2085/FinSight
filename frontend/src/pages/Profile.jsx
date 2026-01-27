import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return <div className="pt-24 text-center">Please log in to view profile.</div>;

    return (
        <div className="pt-24 px-6 container mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-secondary p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white text-secondary flex items-center justify-center font-bold text-3xl shadow-lg">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="opacity-90">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                <p className="text-gray-900 font-medium">{user.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                <p className="text-gray-900 font-medium">{user.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                                <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Company Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Company ID</label>
                                <p className="text-gray-900 font-medium">{user.companyId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button className="px-4 py-2 border border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all font-medium text-sm">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
