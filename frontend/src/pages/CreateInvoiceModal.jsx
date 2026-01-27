import React, { useState } from 'react';
import { X, Plus, Trash, Check } from 'lucide-react';

const CreateInvoiceModal = ({ isOpen, onClose, onCreate }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        templateType: 'CLASSIC' // Default template
    });

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const calculateSubtotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Ensure dates are valid ISO strings for the backend
            const payload = {
                ...formData,
                invoiceDate: new Date(formData.invoiceDate).toISOString(),
                dueDate: new Date(formData.dueDate).toISOString()
            };
            await onCreate(payload);
            onClose();
        } catch (error) {
            console.error("Error creating invoice:", error);
            // Error is handled in parent component
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">
                        {step === 1 ? 'New Invoice Details' : 'Select Template'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 1 ? (
                        <div className="space-y-6">
                            {/* Customer & Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="Enter client name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                                    <input
                                        type="date"
                                        name="invoiceDate"
                                        value={formData.invoiceDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Items Table */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Invoice Items</h3>
                                <div className="space-y-3">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-start">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Description"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="w-32">
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    min="0"
                                                    value={item.unitPrice}
                                                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="w-32 pt-2 text-right font-medium text-gray-700">
                                                ₹ {(item.quantity * item.unitPrice).toFixed(2)}
                                            </div>
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={addItem}
                                    className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Line Item
                                </button>
                            </div>

                            <div className="border-t border-gray-100 pt-4 flex justify-end">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-900">₹ {calculateSubtotal().toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Template 1: Classic */}
                            <div
                                onClick={() => setFormData(prev => ({ ...prev, templateType: 'CLASSIC' }))}
                                className={`cursor-pointer border rounded-xl p-4 transition-all ${formData.templateType === 'CLASSIC' ? 'border-blue-500 ring-2 ring-blue-50 bg-blue-50/10' : 'border-gray-200 hover:border-blue-300'}`}
                            >
                                <div className="h-40 bg-gray-50 rounded-lg border border-gray-100 mb-4 flex items-center justify-center">
                                    <div className="w-24 h-32 bg-white shadow-sm flex flex-col p-2 space-y-2">
                                        <div className="w-full h-2 bg-gray-200 rounded"></div>
                                        <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                                        <div className="grid grid-cols-3 gap-1 mt-4">
                                            <div className="h-1 bg-gray-100"></div><div className="h-1 bg-gray-100"></div><div className="h-1 bg-gray-100"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-900">Classic Professional</h3>
                                        <p className="text-sm text-gray-500">Clean, table-based layout</p>
                                    </div>
                                    {formData.templateType === 'CLASSIC' && <Check className="w-5 h-5 text-blue-500" />}
                                </div>
                            </div>

                            {/* Template 2: Modern */}
                            <div
                                onClick={() => setFormData(prev => ({ ...prev, templateType: 'MODERN' }))}
                                className={`cursor-pointer border rounded-xl p-4 transition-all ${formData.templateType === 'MODERN' ? 'border-blue-500 ring-2 ring-blue-50 bg-blue-50/10' : 'border-gray-200 hover:border-blue-300'}`}
                            >
                                <div className="h-40 bg-gray-50 rounded-lg border border-gray-100 mb-4 flex items-center justify-center">
                                    <div className="w-24 h-32 bg-white shadow-sm flex flex-col p-2">
                                        <div className="w-full h-8 bg-blue-100 rounded mb-2"></div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                                            <div className="flex-1 space-y-1">
                                                <div className="w-full h-2 bg-gray-100"></div>
                                                <div className="w-2/3 h-2 bg-gray-100"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-900">Modern Creative</h3>
                                        <p className="text-sm text-gray-500">Bold header, card-style details</p>
                                    </div>
                                    {formData.templateType === 'MODERN' && <Check className="w-5 h-5 text-blue-500" />}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                        >
                            Back
                        </button>
                    )}
                    {step === 1 ? (
                        <button
                            onClick={() => setStep(2)}
                            disabled={!formData.customerName || !formData.dueDate}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Creating...' : 'Create Invoice'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateInvoiceModal;
