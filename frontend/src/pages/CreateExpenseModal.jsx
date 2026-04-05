import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { categorizeExpense } from '../services/api';
import toast from 'react-hot-toast';

const CreateExpenseModal = ({ isOpen, onClose, onCreate }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAutoCategorize = async () => {
        if (!formData.description) {
            toast.error("Please enter a description first");
            return;
        }
        setIsCategorizing(true);
        try {
            const token = localStorage.getItem('token');
            const data = await categorizeExpense(token, formData.description);
            if (data) {
                // Ensure the first letter is capitalized to match options
                const aiCategory = data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1) : prev.category;
                
                setFormData(prev => ({
                    ...prev,
                    category: aiCategory,
                    amount: data.amount ? String(data.amount) : prev.amount,
                    description: data.title ? data.title : prev.description
                }));
            }
        } catch (error) {
            console.error("Auto-categorize failed:", error);
            toast.error("Failed to auto-categorize. Please try again.");
        } finally {
            setIsCategorizing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                date: new Date(formData.date).toISOString()
            };
            await onCreate(payload);
            
            // Reset form
            setFormData({
                amount: '',
                category: 'Operations',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
            onClose();
        } catch (error) {
            console.error("Error creating expense:", error);
            // Error handled by parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Expenses</h2>
                        {user?.company?.name && (
                            <p className="text-sm text-gray-500">{user.company.name}</p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                placeholder="What was this expense for?"
                            />
                            <button
                                type="button"
                                onClick={handleAutoCategorize}
                                disabled={isCategorizing || !formData.description}
                                className="w-full sm:w-auto justify-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 border border-purple-200"
                                title="Auto-categorize using AI"
                            >
                                <Sparkles className={`w-4 h-4 ${isCategorizing ? 'animate-pulse' : ''}`} />
                                {isCategorizing ? 'AI...' : 'AI Categorize'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            readOnly
                            placeholder="AI will prioritize this..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none transition-shadow"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.amount || !formData.date}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {loading ? 'Saving...' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExpenseModal;
