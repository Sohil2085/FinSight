import React, { useState } from 'react';
import { X, Plus, Trash, Check } from 'lucide-react';

const CreateInvoiceModal = ({ isOpen, onClose, onCreate }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        gstType: 'INTRA',
        discount: 0,
        items: [{ description: '', quantity: 1, unitPrice: 0, gstRate: 0, discount: 0 }],
        templateType: 'CLASSIC'
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
            items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, gstRate: 0, discount: 0 }]
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

    const calculatePreview = () => {
        let subtotalCent = 0;
        let totalGSTCent = 0;
        let cgstCent = 0;
        let sgstCent = 0;
        let igstCent = 0;

        formData.items.forEach(item => {
            const qty = Number(item.quantity) || 0;
            const priceCent = Math.round((Number(item.unitPrice) || 0) * 100);
            const itemDiscountCent = Math.round((Number(item.discount) || 0) * 100);
            const gstRate = Number(item.gstRate) || 0;

            const baseTotalCent = Math.max(0, (qty * priceCent) - itemDiscountCent);
            const gstAmountCent = Math.round(baseTotalCent * (gstRate / 100));
            
            subtotalCent += baseTotalCent;
            totalGSTCent += gstAmountCent;
        });

        if (formData.gstType === 'INTER') {
            igstCent = totalGSTCent;
        } else {
            cgstCent = Math.round(totalGSTCent / 2);
            sgstCent = totalGSTCent - cgstCent; 
        }

        const safeInvoiceDiscountCent = Math.round((Number(formData.discount) || 0) * 100);
        const preRoundTotalCent = Math.max(0, subtotalCent + totalGSTCent - safeInvoiceDiscountCent);

        return {
            subTotal: subtotalCent / 100,
            cgst: cgstCent / 100,
            sgst: sgstCent / 100,
            igst: igstCent / 100,
            grandTotal: Math.round(preRoundTotalCent / 100)
        };
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
                            {/* Customer & Dates Configuration */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Legal Client Block */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Client Details</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer / Company Name</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                            placeholder="Enter client name"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <input
                                                type="email"
                                                name="customerEmail"
                                                value={formData.customerEmail}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                                placeholder="client@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <input
                                                type="tel"
                                                name="customerPhone"
                                                value={formData.customerPhone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                                placeholder="+91..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Configuration Block */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Invoice Configuration</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                                            <input
                                                type="date"
                                                name="invoiceDate"
                                                value={formData.invoiceDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                            <input
                                                type="date"
                                                name="dueDate"
                                                value={formData.dueDate}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-sm font-medium text-gray-700">
                                            <label className="block mb-1">GST Type & Region</label>
                                            <select
                                                name="gstType"
                                                value={formData.gstType}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500 transition-shadow"
                                            >
                                                <option value="INTRA">Intra-State (CGST + SGST)</option>
                                                <option value="INTER">Inter-State (IGST)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Overall Discount (₹)</label>
                                            <input
                                                type="number"
                                                name="discount"
                                                min="0"
                                                value={formData.discount || ''}
                                                onChange={handleInputChange}
                                                placeholder="0.00"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Items Table */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Invoice Items</h3>
                                <div className="space-y-3">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-4 sm:flex sm:flex-nowrap gap-3 sm:gap-4 items-center bg-gray-50 border border-gray-100 p-4 rounded-xl sm:bg-transparent sm:border-transparent sm:p-0 mb-4 sm:mb-0">
                                            <div className="col-span-4 sm:flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Item Description"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="col-span-1 sm:w-20">
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-center"
                                                />
                                            </div>
                                            <div className="col-span-1 sm:w-24">
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    min="0"
                                                    value={item.unitPrice || ''}
                                                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-center"
                                                />
                                            </div>
                                            <div className="col-span-1 sm:w-20">
                                                <input
                                                    type="number"
                                                    placeholder="Disc ₹"
                                                    min="0"
                                                    value={item.discount || ''}
                                                    onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-2 py-2 text-sm border border-blue-100 bg-blue-50/50 rounded-lg outline-none focus:border-blue-500 text-center placeholder-blue-300"
                                                />
                                            </div>
                                            <div className="col-span-1 sm:w-20">
                                                <div className="relative h-full">
                                                    <select
                                                        value={item.gstRate || 0}
                                                        onChange={(e) => handleItemChange(index, 'gstRate', parseFloat(e.target.value))}
                                                        className="w-full h-full px-2 py-2 text-sm border border-green-100 bg-green-50/50 rounded-lg outline-none focus:border-green-500 appearance-none text-center"
                                                    >
                                                        <option value={0}>0</option>
                                                        <option value={5}>5</option>
                                                        <option value={12}>12</option>
                                                        <option value={18}>18</option>
                                                        <option value={28}>28</option>
                                                    </select>
                                                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-green-600/50 pointer-events-none text-xs">%</span>
                                                </div>
                                            </div>
                                            <div className="col-span-3 sm:w-28 text-right font-semibold text-gray-700 mt-2 sm:mt-0 flex justify-between sm:block items-center">
                                                <span className="sm:hidden text-xs text-gray-500 font-normal">Line Total</span>
                                                <span>₹ {(item.quantity * item.unitPrice).toFixed(2)}</span>
                                            </div>
                                            <div className="col-span-1 sm:w-auto text-right mt-2 sm:mt-0">
                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors ml-auto flex items-center justify-center"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
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

                            <div className="border-t border-gray-100 pt-4 flex justify-end bg-gray-50 p-4 rounded-lg mt-4">
                                {(() => {
                                    const preview = calculatePreview();
                                    return (
                                        <div className="text-right w-full sm:w-64 space-y-1.5">
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>Subtotal</span>
                                                <span>₹ {preview.subTotal.toFixed(2)}</span>
                                            </div>
                                            {formData.gstType === 'INTER' ? (
                                                <div className="flex justify-between text-sm text-gray-500">
                                                    <span>IGST</span>
                                                    <span>₹ {preview.igst.toFixed(2)}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between text-sm text-gray-500">
                                                        <span>CGST</span>
                                                        <span>₹ {preview.cgst.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-500">
                                                        <span>SGST</span>
                                                        <span>₹ {preview.sgst.toFixed(2)}</span>
                                                    </div>
                                                </>
                                            )}
                                            {Number(formData.discount) > 0 && (
                                                <div className="flex justify-between text-sm text-red-500 font-medium">
                                                    <span>Discount</span>
                                                    <span>- ₹ {Number(formData.discount).toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200 mt-2 shadow-sm rounded">
                                                <span>Grand Total</span>
                                                <span>₹ {preview.grandTotal.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    );
                                })()}
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
                            disabled={!formData.customerName || !formData.dueDate || formData.items.length === 0}
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
