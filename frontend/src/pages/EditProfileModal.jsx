import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUser, updateCompany } from '../services/api';

const EditProfileModal = ({ isOpen, onClose, onSaveSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // User data state
    const [userData, setUserData] = useState({
        name: '',
        email: ''
    });
    
    // Company data state
    const [companyData, setCompanyData] = useState({
        name: '',
        gstNumber: ''
    });

    // Track consent locally
    const [consentChecked, setConsentChecked] = useState(false);

    useEffect(() => {
        if (user && isOpen) {
            setUserData({
                name: user.name || '',
                email: user.email || ''
            });
            setCompanyData({
                name: user.company?.name || '',
                gstNumber: user.company?.gstNumber || ''
            });
            setConsentChecked(false);
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleUserChange = (e) => {
        setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCompanyChange = (e) => {
        setCompanyData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isCompanyChanged = () => {
        return companyData.name !== (user?.company?.name || '') || 
               companyData.gstNumber !== (user?.company?.gstNumber || '');
    };

    const handleBackdropClick = (e) => {
        // Close if click is exactly on the backdrop (not its children)
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const companyChanged = isCompanyChanged();

        if (companyChanged && !consentChecked) {
            alert("Please check the consent box to update company details.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // 1. Update user if changed
            if (userData.name !== user.name || userData.email !== user.email) {
                await updateUser(token, userData);
            }

            // 2. Update company if changed
            if (companyChanged) {
                await updateCompany(token, companyData);
            }

            onSaveSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to update profile", error);
            alert(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Personal Information */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleUserChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleUserChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Company Details */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Company Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={companyData.name}
                                    onChange={handleCompanyChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                <input
                                    type="text"
                                    name="gstNumber"
                                    value={companyData.gstNumber}
                                    onChange={handleCompanyChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                />
                            </div>
                        </div>

                        {/* Consent Checkbox - Only show if company details changed */}
                        {isCompanyChanged() && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-yellow-800 mb-2">Consent Required</h4>
                                        <label className="flex items-start gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={consentChecked}
                                                onChange={(e) => setConsentChecked(e.target.checked)}
                                                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-yellow-700">
                                                I confirm that I have the authorization to modify the registered legal details of this company. This change may affect invoicing and compliance records.
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-gray-100 mt-6 -mx-6 px-6 pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-4 px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (isCompanyChanged() && !consentChecked)}
                            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
