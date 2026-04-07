import React from 'react';
import Insights from '../components/Insights';
import { Sparkles } from 'lucide-react';

const AiInsight = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative flex flex-col items-center justify-center p-12 bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-800 rounded-[2rem] shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-cyan-300 opacity-20 blur-3xl mix-blend-overlay"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-3xl mix-blend-overlay"></div>
                
                <div className="flex items-center gap-4 mb-6 text-white z-10">
                    <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-[2.5rem] font-extrabold tracking-tight drop-shadow-md">FinSight AI Insights</h1>
                </div>
                <p className="text-cyan-50 text-lg text-center max-w-2xl z-10 leading-relaxed font-medium">
                    Discover intelligent, data-driven insights about your business. We automatically analyze your invoices, expenses, and overall payment health to help you make actionable decisions.
                </p>
            </div>

            {/* Content Section */}
            <div className="w-full">
                <Insights />
            </div>
        </div>
    );
};

export default AiInsight;
