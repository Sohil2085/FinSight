import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return null;

    // Mock Data for UI demonstration
    const stats = [
        {
            label: 'Total Invoices',
            value: '₹ 1,24,500',
            change: '+12.5%',
            isPositive: true,
            icon: FileText,
            color: 'bg-blue-500'
        },
        {
            label: 'Total Expenses',
            value: '₹ 45,200',
            change: '-2.4%',
            isPositive: true, // Lower expenses is positive
            icon: ArrowDownRight,
            color: 'bg-red-500'
        },
        {
            label: 'Pending Payments',
            value: '₹ 32,000',
            change: '5 Invoices',
            isPositive: false,
            icon: AlertCircle,
            color: 'bg-yellow-500'
        },
        {
            label: 'Cash Balance',
            value: '₹ 8,50,000',
            change: '+5.2%',
            isPositive: true,
            icon: TrendingUp,
            color: 'bg-green-500'
        },
    ];

    const recentActivity = [
        { id: 1, type: 'Invoice', description: 'Web Development Project', amount: '₹ 25,000', status: 'Paid', date: 'Today' },
        { id: 2, type: 'Expense', description: 'Server Hosting (AWS)', amount: '₹ 4,500', status: 'Completed', date: 'Yesterday' },
        { id: 3, type: 'Invoice', description: 'Consulting Services', amount: '₹ 12,000', status: 'Pending', date: '2 days ago' },
        { id: 4, type: 'Invoice', description: 'Mobile App Design', amount: '₹ 45,000', status: 'Pending', date: '3 days ago' },
    ];

    return (
        <div className="space-y-8">
            {/* Top Section: Welcome Message */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                    <p className="text-gray-500 mt-1">
                        Company: <span className="font-medium text-gray-700">{user.company?.name || "My Company"}</span>
                    </p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg py-2 shadow-sm border border-gray-100">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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

            {/* AI Insights & Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* AI Insight Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden h-full">
                        {/* Decorative Background Circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-lg">FinSight AI</h3>
                        </div>

                        <div className="mb-6">
                            <p className="text-blue-200 text-sm mb-1">Cash Flow Prediction</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">Stable</span>
                                <span className="text-sm bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">Low Risk</span>
                            </div>
                        </div>

                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                            <p className="text-sm text-blue-100 leading-relaxed">
                                "Based on your recent invoices and recurring expenses, your cash flow for the next 30 days looks healthy. You have sufficient coverage for upcoming payouts."
                            </p>
                        </div>

                        <button className="mt-6 w-full py-2 bg-white text-blue-900 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">
                            View Detailed Analysis
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Recent Activity</h3>
                            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
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
                                        {recentActivity.map((item) => (
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
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
