import React, { useState } from 'react';
import {
    ArrowRight,
    CheckCircle2,
    FileText,
    DollarSign,
    Users,
    RefreshCw,
    BarChart3,
    BrainCircuit,
    ShieldCheck,
    TrendingUp,
    AlertTriangle,
    CreditCard,
    Briefcase
} from 'lucide-react';

const Home = () => {
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    const toggleBilling = () => {
        setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly');
    };

    return (
        <div className="home-page overflow-x-hidden">
            {/* 2. Hero Section */}
            <section className="pt-[120px] pb-20 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 text-left">
                        <h1 className="text-[3.5rem] font-bold mb-6 text-primary leading-[1.1]">Smart Finance & Billing for Growing Businesses</h1>
                        <p className="text-xl text-text-light mb-10 leading-relaxed">Automate invoicing and cash-flow with AI-powered insights. Save time and make smarter decisions.</p>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-secondary text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg hover:shadow-xl">Get Started Free</button>
                            <button className="px-6 py-3 border border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all font-medium">Request Demo</button>
                        </div>
                    </div>
                    <div className="flex-1 relative w-full">
                        <div className="w-full h-[400px] bg-gradient-to-br from-[#0B2545]/5 to-[#0081A7]/10 rounded-2xl shadow-xl flex items-center justify-center text-primary font-semibold text-xl">
                            Dashboard Mockup & Charts
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Trust Indicators */}
            <section className="py-10 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <p className="text-center text-text-light text-sm uppercase tracking-widest mb-8">Trusted by 5,000+ SMEs</p>
                    <div className="flex flex-wrap justify-around items-center gap-8 opacity-70">
                        <div className="text-lg font-bold text-text-light flex items-center gap-2"><ShieldCheck size={20} /> Razorpay</div>
                        <div className="text-lg font-bold text-text-light flex items-center gap-2"><CheckCircle2 size={20} /> GST Ready</div>
                        <div className="text-lg font-bold text-text-light flex items-center gap-2"><CreditCard size={20} /> Secure Payments</div>
                        <div className="text-lg font-bold text-text-light flex items-center gap-2"><ShieldCheck size={20} /> SSL Secured</div>
                        <div className="text-lg font-bold text-text-light flex items-center gap-2"><CheckCircle2 size={20} /> ISO Certified</div>
                    </div>
                </div>
            </section>

            {/* 4. Core Features Section */}
            <section className="py-[100px] bg-bg-light" id="solutions">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[2.5rem] font-bold mb-4">Everything you need to run your business</h2>
                        <p className="text-lg text-text-light max-w-[600px] mx-auto">Powerful tools to help you manage your finances, invoices, and team effortlessly.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<FileText />}
                            title="Smart Invoicing"
                            desc="Create professional invoices in seconds and automate reminders."
                        />
                        <FeatureCard
                            icon={<DollarSign />}
                            title="Expense Tracking"
                            desc="Track every penny. Scan receipts and categorize expenses automatically."
                        />
                        <FeatureCard
                            icon={<Users />}
                            title="Payroll Automation"
                            desc="Run payroll in one click. Tax calculations and compliance handled."
                        />
                        <FeatureCard
                            icon={<RefreshCw />}
                            title="Subscription Billing"
                            desc="Handle recurring payments and subscriptions with ease."
                        />
                        <FeatureCard
                            icon={<BarChart3 />}
                            title="Financial Reports"
                            desc="Real-time P&L, Balance Sheet, and Cash Flow statements."
                        />
                        <FeatureCard
                            icon={<BrainCircuit />}
                            title="AI Insights"
                            desc="Get predictive insights on cash flow and business health."
                        />
                    </div>
                </div>
            </section>

            {/* 5. AI-Powered Insights Section */}
            <section className="py-[100px] bg-white">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 text-left">
                        <div className="mb-8 text-left">
                            <h2 className="text-[2.5rem] font-bold mb-4">AI that looks out for your business</h2>
                            <p className="text-lg text-text-light">Don't just track numbers. Understand them with our advanced AI engine that predicts trends and alerts you risks.</p>
                        </div>
                        <ul className="list-none text-left my-8">
                            <li className="mb-3 flex items-center gap-2"><CheckCircle2 size={18} color="var(--color-accent)" /> Cash flow forecasting</li>
                            <li className="mb-3 flex items-center gap-2"><CheckCircle2 size={18} color="var(--color-accent)" /> Smart spending alerts</li>
                            <li className="mb-3 flex items-center gap-2"><CheckCircle2 size={18} color="var(--color-accent)" /> Client payment behavior analysis</li>
                        </ul>
                        <button className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-violet-600 transition-all font-medium shadow-md hover:shadow-lg">See AI in Action</button>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white relative shadow-2xl w-full">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl mb-4 flex items-center gap-4 border-l-4 border-yellow-400">
                            <AlertTriangle color="#fbbf24" />
                            <div>
                                <strong>Cash Flow Alert</strong>
                                <div className="text-sm opacity-80">Cash balance may drop in 12 days based on current spending.</div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl mb-4 flex items-center gap-4 border-l-4 border-accent">
                            <TrendingUp color="var(--color-accent)" />
                            <div>
                                <strong>Payment Insight</strong>
                                <div className="text-sm opacity-80">Your top client "Acme Corp" pays fastest after Tuesday reminders.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. How It Works */}
            <section className="py-[100px] bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-[2.5rem] font-bold">Get started in minutes</h2>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between relative mt-12 md:before:absolute md:before:top-10 md:before:left-12 md:before:right-12 md:before:h-0.5 md:before:bg-gray-200 md:before:z-0">
                        <div className="relative z-10 text-center flex-1 mb-8 md:mb-0 group cursor-default">
                            <div className="w-[80px] h-[80px] bg-white border-2 border-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-secondary font-bold text-2xl transition-all duration-300 group-hover:bg-secondary group-hover:text-white">1</div>
                            <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                            <p className="text-text-light">Create your free account.</p>
                        </div>
                        <div className="relative z-10 text-center flex-1 mb-8 md:mb-0 group cursor-default">
                            <div className="w-[80px] h-[80px] bg-white border-2 border-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-secondary font-bold text-2xl transition-all duration-300 group-hover:bg-secondary group-hover:text-white">2</div>
                            <h3 className="text-xl font-bold mb-2">Add Details</h3>
                            <p className="text-text-light">Add company & employees.</p>
                        </div>
                        <div className="relative z-10 text-center flex-1 mb-8 md:mb-0 group cursor-default">
                            <div className="w-[80px] h-[80px] bg-white border-2 border-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-secondary font-bold text-2xl transition-all duration-300 group-hover:bg-secondary group-hover:text-white">3</div>
                            <h3 className="text-xl font-bold mb-2">Create</h3>
                            <p className="text-text-light">Generate invoices & payroll.</p>
                        </div>
                        <div className="relative z-10 text-center flex-1 group cursor-default">
                            <div className="w-[80px] h-[80px] bg-white border-2 border-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-secondary font-bold text-2xl transition-all duration-300 group-hover:bg-secondary group-hover:text-white">4</div>
                            <h3 className="text-xl font-bold mb-2">Insights</h3>
                            <p className="text-text-light">Get AI reports instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Target Users Section */}
            <section className="py-[100px] bg-bg-light">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[2.5rem] font-bold">Who is FinSight for?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <UserCard
                            icon={<Briefcase />}
                            title="SME Owners"
                            desc="Focus on growth while we handle the boring finance stuff."
                        />
                        <UserCard
                            icon={<FileText />}
                            title="Accountants"
                            desc="Simplify reconciliation and collaborate with clients easily."
                        />
                        <UserCard
                            icon={<Users />}
                            title="HR Teams"
                            desc="Manage payroll, leaves, and reimbursements in one place."
                        />
                    </div>
                </div>
            </section>

            {/* 8. Pricing Section */}
            <section className="py-[100px] bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[2.5rem] font-bold">Simple, transparent pricing</h2>
                    </div>

                    <div className="flex justify-center items-center gap-4 mb-12">
                        <span className={billingPeriod === 'monthly' ? 'font-bold' : 'font-normal'}>Monthly</span>
                        <div className={`relative w-[60px] h-[30px] bg-gray-200 rounded-full cursor-pointer transition-colors duration-300 ${billingPeriod === 'yearly' ? 'bg-secondary' : ''}`} onClick={toggleBilling}>
                            <div className={`absolute top-[2px] left-[2px] w-[26px] h-[26px] bg-white rounded-full transition-transform duration-300 ${billingPeriod === 'yearly' ? 'translate-x-[30px]' : ''}`}></div>
                        </div>
                        <span className={billingPeriod === 'yearly' ? 'font-bold' : 'font-normal'}>Yearly <span className="text-sm text-accent">(Save 20%)</span></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PricingCard
                            title="Basic"
                            price={billingPeriod === 'monthly' ? '$0' : '$0'}
                            features={['Starters & Freelancers', '5 Invoices/mo', 'Basic Reports']}
                        />
                        <PricingCard
                            title="Pro"
                            price={billingPeriod === 'monthly' ? '$29' : '$24'}
                            features={['Growing Teams', 'Unlimited Invoices', 'AI Insights', 'Payroll for 10']}
                            highlighted={true}
                            period={billingPeriod === 'monthly' ? '/mo' : '/mo'}
                        />
                        <PricingCard
                            title="Enterprise"
                            price="Custom"
                            features={['Large Organizations', 'Unlimited Everything', 'Dedicated Support', 'API Access']}
                            period=""
                        />
                    </div>
                </div>
            </section>

            {/* 9. Footer */}
            <footer className="bg-primary text-white py-20 pb-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-16 mb-16 text-left">
                        <div className="footer-brand">
                            <h3 className="text-xl font-bold mb-4">FinSight</h3>
                            <p className="text-slate-400 mt-4 max-w-[300px]">Simplifying finance for the modern business. Powered by AI, designed for humans.</p>
                        </div>
                        <div className="footer-links">
                            <h4 className="text-white mb-6 font-bold">Product</h4>
                            <ul className="list-none">
                                <li className="mb-3"><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                                <li className="mb-3"><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                                <li className="mb-3"><a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4 className="text-white mb-6 font-bold">Company</h4>
                            <ul className="list-none">
                                <li className="mb-3"><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                                <li className="mb-3"><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                                <li className="mb-3"><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4 className="text-white mb-6 font-bold">Support</h4>
                            <ul className="list-none">
                                <li className="mb-3"><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                                <li className="mb-3"><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                                <li className="mb-3"><a href="#" className="text-slate-400 hover:text-white transition-colors">Status</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
                        <div>© 2026 FinSight Inc. All rights reserved.</div>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white">Privacy</a>
                            <a href="#" className="hover:text-white">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper Components
const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-left">
        <div className="w-[50px] h-[50px] bg-secondary/10 rounded-xl flex items-center justify-center mb-6 text-secondary">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-text-light text-[0.95rem] leading-relaxed">{desc}</p>
    </div>
);

const UserCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-2xl text-center border border-transparent hover:border-secondary hover:-translate-y-1 transition-all duration-300">
        <div className="w-[50px] h-[50px] bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-secondary">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-text-light">{desc}</p>
    </div>
);

const PricingCard = ({ title, price, features, highlighted = false, period = '' }) => (
    <div className={`border rounded-2xl p-10 text-center relative ${highlighted ? 'border-secondary bg-secondary/5 scale-105 shadow-xl z-10' : 'border-gray-200'}`}>
        {highlighted && <div className="absolute top-0 left-0 w-full p-[5px] bg-secondary text-white rounded-t-2xl text-[0.8rem] font-bold">MOST POPULAR</div>}
        <h3 className={`text-xl font-bold ${highlighted ? 'mt-4' : ''}`}>{title}</h3>
        <div className="text-[2.5rem] font-bold my-6 text-primary">{price}<span className="text-base text-text-light font-normal">{period}</span></div>
        <ul className="list-none text-left my-8">
            {features.map((feat, i) => (
                <li key={i} className="mb-3 flex items-center gap-2"><CheckCircle2 size={16} color="var(--color-secondary)" /> {feat}</li>
            ))}
        </ul>
        <button className={`w-full py-3 rounded-lg font-medium transition-all ${highlighted ? 'bg-secondary text-white hover:opacity-90 shadow-lg' : 'border border-secondary text-secondary hover:bg-secondary hover:text-white'}`}>Choose {title}</button>
    </div>
);

export default Home;
