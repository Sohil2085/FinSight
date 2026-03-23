import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, FileText, CheckCircle2, Sparkles, Plus, Activity } from 'lucide-react';
import { getInvoices, getInvoiceSummary, getExpenses, getExpenseSummary, createInvoice, createExpense, getActivityLogs } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import CreateInvoiceModal from './CreateInvoiceModal';
import CreateExpenseModal from './CreateExpenseModal';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [invoiceData, setInvoiceData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [teamLogs, setTeamLogs] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        let isMounted = true;

        const fetchData = async () => {
            try {
                setDataLoading(true);
                const token = localStorage.getItem('token');
                if (!token) return;

                const [invoices, invSummary, expenses, expSummary] = await Promise.all([
                    getInvoices(token),
                    getInvoiceSummary(token),
                    getExpenses(token),
                    getExpenseSummary(token)
                ]);

                if (!isMounted) return;

                const totalInvoiced = invSummary?.totalInvoiced || 0;
                const totalExpensesAmt = expSummary?.totalExpenses || 0;
                const pendingAmt = invSummary?.pendingAmount || 0;
                const paidAmt = invSummary?.paidAmount || 0;
                const cashBalance = paidAmt - totalExpensesAmt;

                const computedStats = [
                    {
                        label: 'Total Invoices',
                        value: `₹ ${totalInvoiced.toLocaleString()}`,
                        change: 'All time',
                        isPositive: true,
                        icon: FileText,
                        color: 'bg-blue-500'
                    },
                    {
                        label: 'Total Expenses',
                        value: `₹ ${totalExpensesAmt.toLocaleString()}`,
                        change: 'All time',
                        isPositive: true,
                        icon: ArrowDownRight,
                        color: 'bg-red-500'
                    },
                    {
                        label: 'Pending Payments',
                        value: `₹ ${pendingAmt.toLocaleString()}`,
                        change: 'To collect',
                        isPositive: false,
                        icon: AlertCircle,
                        color: 'bg-yellow-500'
                    },
                    {
                        label: 'Cash Balance',
                        value: `₹ ${cashBalance.toLocaleString()}`,
                        change: 'Paid - Expenses',
                        isPositive: cashBalance >= 0,
                        icon: TrendingUp,
                        color: 'bg-green-500'
                    },
                ];

                setStats(computedStats);

                const expenseTotals = {};
                (expenses || []).forEach(e => {
                    const cat = e.category || 'Other';
                    if (!expenseTotals[cat]) expenseTotals[cat] = 0;
                    expenseTotals[cat] += e.amount;
                });
                
                const expenseChartData = Object.keys(expenseTotals).map(cat => ({
                    name: cat,
                    value: expenseTotals[cat]
                })).filter(item => item.value > 0);
                
                setExpenseData(expenseChartData);

                // Invoice Chart Data
                const sortedInvoices = [...(invoices || [])].sort((a,b) => new Date(a.invoiceDate) - new Date(b.invoiceDate));
                const invoiceMap = {};
                sortedInvoices.forEach(inv => {
                    const dateObj = new Date(inv.invoiceDate);
                    const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
                    if (!invoiceMap[dateStr]) invoiceMap[dateStr] = 0;
                    invoiceMap[dateStr] += inv.totalAmount;
                });
                const invoiceChartData = Object.keys(invoiceMap).map(date => ({
                    date,
                    Amount: invoiceMap[date]
                })).slice(-10); // Last 10 days of activity

                setInvoiceData(invoiceChartData);

                const formattedInvoices = (invoices || []).map(i => ({
                    id: `inv-${i.id}`,
                    type: 'Invoice',
                    description: i.customerName || `Invoice #${i.invoiceNumber || i.id.slice(0,8)}`,
                    amount: `₹ ${i.totalAmount.toLocaleString()}`,
                    status: i.status === 'PAID' ? 'Paid' : i.status === 'UNPAID' ? 'Pending' : 'Overdue',
                    dateObj: new Date(i.invoiceDate),
                    date: new Date(i.invoiceDate).toLocaleDateString()
                }));

                const formattedExpenses = (expenses || []).map(e => ({
                    id: `exp-${e.id}`,
                    type: 'Expense',
                    description: e.description || e.category,
                    amount: `₹ ${e.amount.toLocaleString()}`,
                    status: 'Completed',
                    dateObj: new Date(e.date),
                    date: new Date(e.date).toLocaleDateString()
                }));

                const combined = [...formattedInvoices, ...formattedExpenses]
                    .sort((a, b) => b.dateObj - a.dateObj)
                    .slice(0, 5);

                setRecentActivity(combined);

                if (user.role === 'ADMIN') {
                    try {
                        const logsRes = await getActivityLogs(token);
                        setTeamLogs(logsRes.data || []);
                    } catch(e) {
                         console.error("Failed to load team activity logs", e);
                    }
                }

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                if (isMounted) setDataLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [user, refreshTrigger]);

    const handleCreateInvoice = async (data) => {
        try {
            const token = localStorage.getItem('token');
            await createInvoice(token, data);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to create invoice");
        }
    };

    const handleCreateExpense = async (data) => {
        try {
            const token = localStorage.getItem('token');
            await createExpense(token, data);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to create expense");
        }
    };

    if (authLoading || dataLoading) return (
        <div className="flex items-center justify-center h-full min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="space-y-8">
            {/* Top Section: Welcome Message */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                    <p className="text-gray-500 mt-1">
                        Company: <span className="font-medium text-gray-700">{user.company?.name || "My Company"}</span>
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
                    <div className="text-sm text-gray-500 bg-white px-4 py-2 flex items-center h-10 rounded-lg shadow-sm border border-gray-100 hidden sm:flex">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <Link
                        to="/ai-insight"
                        className="flex items-center justify-center gap-2 px-4 py-2 h-10 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Insights
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Invoice Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Invoice Trends</h3>
                    <div className="h-[300px]">
                        {invoiceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={invoiceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(1)+'k' : value}`} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [`₹ ${value.toLocaleString()}`, 'Amount']}
                                    />
                                    <Area type="monotone" dataKey="Amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No invoice data available.</div>
                        )}
                    </div>
                </div>

                {/* Expense Pie Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Expense Breakdown</h3>
                    <div className="h-[300px]">
                        {expenseData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => `₹ ${value.toLocaleString()}`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No expense data available.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity Table (Full Width) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="font-bold text-gray-900">Recent Activity</h3>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                            onClick={() => setIsExpenseModalOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Expense
                        </button>
                        <button 
                            onClick={() => setIsInvoiceModalOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Invoice
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="pb-4">Description</th>
                                    <th className="pb-4">Type</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentActivity.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">No recent activity yet. Create an invoice or add an expense to see it here.</td>
                                    </tr>
                                ) : recentActivity.map((item) => (
                                    <tr key={item.id} className="text-sm text-gray-700">
                                        <td className="py-4 font-medium">{item.description}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'Invoice' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-500">{item.date}</td>
                                        <td className="py-4 font-medium">{item.amount}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-1.5">
                                                {item.status === 'Paid' || item.status === 'Completed' ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                                )}
                                                <span className={item.status === 'Paid' || item.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Admin Only: Team Activity Logs Component */}
            {user.role === 'ADMIN' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900">Audit Trail: Team Activity</h3>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="pb-4">Team Member</th>
                                        <th className="pb-4">Action</th>
                                        <th className="pb-4">Entity</th>
                                        <th className="pb-4">Timeline</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {teamLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-gray-500">No team activity recorded yet.</td>
                                        </tr>
                                    ) : teamLogs.map((log) => (
                                        <tr key={log.id} className="text-sm text-gray-700">
                                            <td className="py-4 font-medium flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center text-xs font-bold font-mono">
                                                    {(log.user?.name || log.user?.email || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>{log.user?.name}</span>
                                                    <span className="text-xs text-gray-500">{log.user?.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded border text-xs font-medium space-x-1 ${log.action.includes('INVITE') ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-500">{log.entity} {log.entityId ? `(#${log.entityId.slice(0,6)})` : ''}</td>
                                            <td className="py-4 text-gray-500">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <CreateInvoiceModal
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
                onCreate={handleCreateInvoice}
            />
            
            <CreateExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                onCreate={handleCreateExpense}
            />
        </div>
    );
};

export default Dashboard;
