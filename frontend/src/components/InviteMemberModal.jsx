import React, { useState } from 'react';
import { X } from 'lucide-react';

const InviteMemberModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('EMPLOYEE');
    const [permissions, setPermissions] = useState({
        canCreateInvoice: false,
        canViewInvoice: true,
        canAddExpense: false,
        canViewExpense: true,
        canViewDashboard: false
    });

    if (!isOpen) return null;

    const handlePermissionChange = (e) => {
        setPermissions({
            ...permissions,
            [e.target.name]: e.target.checked
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, role, permissions });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg bg-white overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">Invite New Member</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="colleague@company.com"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ACCOUNTANT">Accountant</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {role !== 'ADMIN' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Permissions</label>
                            <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                {Object.keys(permissions).map((permKey) => (
                                    <label key={permKey} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name={permKey}
                                            checked={permissions[permKey]}
                                            onChange={handlePermissionChange}
                                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700 select-none">
                                            {permKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Invite'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberModal;
