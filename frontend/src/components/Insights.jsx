import React, { useState, useEffect } from 'react';
import { getDashboardInsights } from '../services/api';
import { Lightbulb, AlertCircle, TrendingUp, AlertTriangle, CreditCard, PieChart } from 'lucide-react';

const Insights = () => {
    const [insights, setInsights] = useState([]);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const fetchedData = await getDashboardInsights(token);
                const resData = fetchedData.data || fetchedData;
                if (resData.insights) {
                    setInsights(resData.insights);
                    setSummary(resData.summary || "");
                } else {
                    setInsights(Array.isArray(resData) ? resData : []);
                }
            } catch (error) {
                console.error("Failed to fetch insights", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    const getIconForInsight = (insight) => {
        const text = insight.toLowerCase();
        if (text.includes('pending')) return <AlertCircle className="w-5 h-5 text-amber-500" />;
        if (text.includes('more') || text.includes('increased') || text.includes('spent')) return <TrendingUp className="w-5 h-5 text-rose-500" />;
        if (text.includes('loss')) return <AlertTriangle className="w-5 h-5 text-red-600" />;
        if (text.includes('highest')) return <PieChart className="w-5 h-5 text-purple-500" />;
        if (text.includes('paid') || text.includes('invoices')) return <CreditCard className="w-5 h-5 text-blue-500" />;
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">Smart Insights</h3>
                </div>
                <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (insights.length === 0) {
        return (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">Smart Insights</h3>
                </div>
                <div className="flex items-center justify-center p-4 text-gray-500 text-sm">
                    No insights available
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <div className="bg-cyan-50 p-2 rounded-xl text-blue-600">
                    <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-xl tracking-tight">Smart Business Insights</h3>
                    <p className="text-sm text-gray-500 mt-1">Automatically computed based on your current financial data</p>
                </div>
            </div>
            {summary && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 shadow-sm leading-relaxed text-gray-700 font-medium whitespace-pre-wrap">
                    <p>{summary}</p>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {insights.map((insight, index) => {
                    const insightTitle = insight.title || 'Insight';
                    const insightMessage = insight.message || insight;
                    
                    return (
                    <div 
                        key={index} 
                        className="group flex flex-col justify-start gap-4 p-6 bg-gradient-to-br from-cyan-50/60 to-blue-50/40 rounded-2xl border border-cyan-100/50 hover:border-cyan-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        
                        <div className="shrink-0 bg-white p-3 rounded-xl shadow-sm border border-gray-50 w-fit relative z-10 group-hover:scale-110 transition-transform duration-300">
                            {getIconForInsight(insightTitle + " " + insightMessage)}
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{insightTitle}</h4>
                            <p className="text-[15px] font-medium text-gray-700 leading-relaxed">{insightMessage}</p>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default Insights;
