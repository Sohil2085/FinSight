import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, FileText, CheckCircle2, AlertCircle, Clock, Download } from 'lucide-react';
import { getInvoices, getInvoiceSummary, createInvoice, updateInvoiceStatus } from '../services/api';
import CreateInvoiceModal from './CreateInvoiceModal';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';
import { useAuth } from '../context/AuthContext';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [summary, setSummary] = useState({ totalInvoiced: 0, paidAmount: 0, pendingAmount: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invoicesData, summaryData] = await Promise.all([
                getInvoices(token, { search: searchTerm }),
                getInvoiceSummary(token)
            ]);
            setInvoices(invoicesData);
            setSummary(summaryData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm]);

    const handleCreateInvoice = async (data) => {
        try {
            await createInvoice(token, data);
            fetchData(); // Refresh list
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to create invoice");
        }
    };

    const handleMarkPaid = async (id) => {
        try {
            await updateInvoiceStatus(token, id, 'PAID');
            fetchData();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleDownloadPDF = (invoice) => {
        try {
            // Pass the logical user.company or a fallback
            generateInvoicePDF(invoice, user?.company);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Failed to generate PDF");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>

                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Invoice
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Total Invoiced</p>
                    <p className="text-2xl font-bold text-gray-800">₹ {summary.totalInvoiced.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Paid</p>
                    <p className="text-2xl font-bold text-green-600">₹ {summary.paidAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-orange-500">₹ {summary.pendingAmount.toLocaleString()}</p>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Invoice ID</th>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <FileText className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p>No invoices found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">#{invoice.invoiceNumber || invoice.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4">{invoice.customerName}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium">₹ {invoice.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {invoice.status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                                                {invoice.status === 'UNPAID' && <Clock className="w-3 h-3" />}
                                                {invoice.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleDownloadPDF(invoice)}
                                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                {invoice.status !== 'PAID' && (
                                                    <button
                                                        onClick={() => handleMarkPaid(invoice.id)}
                                                        className="text-blue-600 hover:text-blue-900 text-xs font-medium border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateInvoiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateInvoice}
            />
        </div>
    );
};

export default Invoices;
