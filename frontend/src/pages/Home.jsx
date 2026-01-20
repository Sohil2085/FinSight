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
import './Home.css';

const Home = () => {
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    const toggleBilling = () => {
        setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly');
    };

    return (
        <div className="home-page">
            {/* 2. Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <div className="hero-text">
                        <h1>Smart Finance & Billing for Growing Businesses</h1>
                        <p>Automate invoicing and cash-flow with AI-powered insights. Save time and make smarter decisions.</p>
                        <div className="hero-buttons">
                            <button className="btn-primary">Get Started Free</button>
                            <button className="btn-outline">Request Demo</button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-image-placeholder">
                            Dashboard Mockup & Charts
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Trust Indicators */}
            <section className="trust-section">
                <div className="container">
                    <p className="trust-title">Trusted by 5,000+ SMEs</p>
                    <div className="trust-logos">
                        <div className="trust-logo"><ShieldCheck size={20} /> Razorpay</div>
                        <div className="trust-logo"><CheckCircle2 size={20} /> GST Ready</div>
                        <div className="trust-logo"><CreditCard size={20} /> Secure Payments</div>
                        <div className="trust-logo"><ShieldCheck size={20} /> SSL Secured</div>
                        <div className="trust-logo"><CheckCircle2 size={20} /> ISO Certified</div>
                    </div>
                </div>
            </section>

            {/* 4. Core Features Section */}
            <section className="features-section" id="solutions">
                <div className="container">
                    <div className="section-header">
                        <h2>Everything you need to run your business</h2>
                        <p>Powerful tools to help you manage your finances, invoices, and team effortlessly.</p>
                    </div>
                    <div className="grid-3">
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
            <section className="ai-section">
                <div className="container ai-container">
                    <div className="ai-content">
                        <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                            <h2>AI that looks out for your business</h2>
                            <p>Don't just track numbers. Understand them with our advanced AI engine that predicts trends and alerts you risks.</p>
                        </div>
                        <ul className="features-list">
                            <li><CheckCircle2 size={18} color="var(--accent-color)" /> Cash flow forecasting</li>
                            <li><CheckCircle2 size={18} color="var(--accent-color)" /> Smart spending alerts</li>
                            <li><CheckCircle2 size={18} color="var(--accent-color)" /> Client payment behavior analysis</li>
                        </ul>
                        <button className="btn-accent">See AI in Action</button>
                    </div>
                    <div className="ai-visual">
                        <div className="insight-alert insight-warning">
                            <AlertTriangle color="#fbbf24" />
                            <div>
                                <strong>Cash Flow Alert</strong>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Cash balance may drop in 12 days based on current spending.</div>
                            </div>
                        </div>
                        <div className="insight-alert">
                            <TrendingUp color="var(--accent-color)" />
                            <div>
                                <strong>Payment Insight</strong>
                                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Your top client "Acme Corp" pays fastest after Tuesday reminders.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Get started in minutes</h2>
                    </div>
                    <div className="steps-container">
                        <div className="step-item">
                            <div className="step-icon">1</div>
                            <h3>Sign Up</h3>
                            <p>Create your free account.</p>
                        </div>
                        <div className="step-item">
                            <div className="step-icon">2</div>
                            <h3>Add Details</h3>
                            <p>Add company & employees.</p>
                        </div>
                        <div className="step-item">
                            <div className="step-icon">3</div>
                            <h3>Create</h3>
                            <p>Generate invoices & payroll.</p>
                        </div>
                        <div className="step-item">
                            <div className="step-icon">4</div>
                            <h3>Insights</h3>
                            <p>Get AI reports instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Target Users Section */}
            <section className="target-users-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Who is FinSight for?</h2>
                    </div>
                    <div className="grid-3">
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
            <section className="pricing-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Simple, transparent pricing</h2>
                    </div>

                    <div className="pricing-toggle">
                        <span style={{ fontWeight: billingPeriod === 'monthly' ? '700' : '400' }}>Monthly</span>
                        <div className={`toggle-switch ${billingPeriod === 'yearly' ? 'active' : ''}`} onClick={toggleBilling}>
                            <div className="toggle-slider"></div>
                        </div>
                        <span style={{ fontWeight: billingPeriod === 'yearly' ? '700' : '400' }}>Yearly <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>(Save 20%)</span></span>
                    </div>

                    <div className="grid-3">
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
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h3>FinSight</h3>
                            <p>Simplifying finance for the modern business. Powered by AI, designed for humans.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Product</h4>
                            <ul>
                                <li><a href="#">Features</a></li>
                                <li><a href="#">Pricing</a></li>
                                <li><a href="#">Security</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Blog</a></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Status</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div>© 2026 FinSight Inc. All rights reserved.</div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Helper Components
const FeatureCard = ({ icon, title, desc }) => (
    <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

const UserCard = ({ icon, title, desc }) => (
    <div className="user-card">
        <div className="feature-icon" style={{ margin: '0 auto 1.5rem' }}>{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

const PricingCard = ({ title, price, features, highlighted = false, period = '' }) => (
    <div className={`pricing-card ${highlighted ? 'highlighted' : ''}`}>
        {highlighted && <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', padding: '5px', background: 'var(--secondary-color)', color: 'white', borderRadius: '15px 15px 0 0', fontSize: '0.8rem', fontWeight: 'bold' }}>MOST POPULAR</div>}
        <h3 style={{ marginTop: highlighted ? '1rem' : '0' }}>{title}</h3>
        <div className="price">{price}<span style={{ fontSize: '1rem', color: 'var(--text-light)', fontWeight: 'normal' }}>{period}</span></div>
        <ul className="features-list">
            {features.map((feat, i) => (
                <li key={i}><CheckCircle2 size={16} color="var(--secondary-color)" /> {feat}</li>
            ))}
        </ul>
        <button className={highlighted ? 'btn-primary' : 'btn-outline'} style={{ width: '100%' }}>Choose {title}</button>
    </div>
);

export default Home;
