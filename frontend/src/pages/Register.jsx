import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Building, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        companyGst: ''
    });
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
        return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company name is required';
        }

        if (!formData.companyGst.trim()) {
            newErrors.companyGst = 'Company GST is required';
        } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.companyGst.toUpperCase())) {
            newErrors.companyGst = 'Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)';
        }

        if (!acceptTerms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            setErrors({});

            try {
                const registerData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    companyName: formData.companyName,
                    gstNumber: formData.companyGst
                };

                const response = await registerUser(registerData);

                if (response.success && response.data) {
                    const { token, user } = response.data;
                    login(token, user);
                    navigate('/dashboard');
                } else {
                    // Fallback if token not returned (shouldn't happen with updated backend)
                    navigate('/login');
                }
            } catch (error) {
                setErrors(prev => ({
                    ...prev,
                    submit: error.message || "Registration failed. Please try again."
                }));
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden my-auto">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Form */}
                    <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10">
                        <div className="max-w-md mx-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-primary mb-1">Create Account</h2>
                                <p className="text-sm text-text-light">Join thousands of businesses using FinSight</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                {errors.submit && (
                                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                                        {errors.submit}
                                    </div>
                                )}
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`block w-full pl-12 pr-4 py-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none text-left`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`block w-full pl-12 pr-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none text-left`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`block w-full pl-12 pr-12 py-2.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none text-left`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-600">Password strength:</span>
                                                <span className={`text-xs font-medium ${passwordStrength.label === 'Weak' ? 'text-red-600' :
                                                    passwordStrength.label === 'Medium' ? 'text-yellow-600' :
                                                        'text-green-600'
                                                    }`}>{passwordStrength.label}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`}
                                                    style={{ width: `${passwordStrength.strength}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Company Name Field */}
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Building className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="companyName"
                                            name="companyName"
                                            type="text"
                                            autoComplete="organization"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className={`block w-full pl-12 pr-4 py-2.5 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none text-left`}
                                            placeholder="Acme Corporation"
                                        />
                                    </div>
                                    {errors.companyName && (
                                        <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
                                    )}
                                </div>

                                {/* Company GST Field */}
                                <div>
                                    <label htmlFor="companyGst" className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                                        Company GST Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="companyGst"
                                            name="companyGst"
                                            type="text"
                                            value={formData.companyGst}
                                            onChange={handleChange}
                                            className={`block w-full pl-12 pr-4 py-2.5 border ${errors.companyGst ? 'border-red-500' : 'border-gray-300'
                                                } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none uppercase text-left`}
                                            placeholder="22AAAAA0000A1Z5"
                                            maxLength={15}
                                        />
                                    </div>
                                    {errors.companyGst && (
                                        <p className="mt-2 text-sm text-red-600">{errors.companyGst}</p>
                                    )}
                                </div>

                                {/* Terms and Conditions */}
                                <div>
                                    <div className="flex items-start">
                                        <input
                                            id="accept-terms"
                                            name="accept-terms"
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={(e) => {
                                                setAcceptTerms(e.target.checked);
                                                if (errors.terms) {
                                                    setErrors(prev => ({ ...prev, terms: '' }));
                                                }
                                            }}
                                            className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded cursor-pointer mt-1"
                                        />
                                        <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                            I agree to the{' '}
                                            <a href="#" className="font-medium text-secondary hover:text-primary transition-colors">
                                                Terms and Conditions
                                            </a>{' '}
                                            and{' '}
                                            <a href="#" className="font-medium text-secondary hover:text-primary transition-colors">
                                                Privacy Policy
                                            </a>
                                        </label>
                                    </div>
                                    {errors.terms && (
                                        <p className="mt-2 text-sm text-red-600">{errors.terms}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>

                                {/* Login Link */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link to="/login" className="font-medium text-secondary hover:text-primary transition-colors">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Branding */}
                    <div className="hidden lg:block w-1/2 bg-gradient-to-br from-primary to-secondary p-12 relative overflow-hidden">
                        <div className="relative z-10 h-full flex flex-col justify-center text-white">
                            <div className="mb-8">
                                <CheckCircle2 className="h-16 w-16 mb-6 text-accent" />
                                <h3 className="text-4xl font-bold mb-4">Start Your Journey</h3>
                                <p className="text-lg text-slate-200 leading-relaxed">
                                    Join thousands of businesses that trust FinSight for their financial management needs.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border-l-4 border-accent">
                                    <h4 className="font-bold mb-1">Free Trial</h4>
                                    <p className="text-sm text-slate-200">Start with our free plan and upgrade anytime</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border-l-4 border-accent">
                                    <h4 className="font-bold mb-1">No Credit Card</h4>
                                    <p className="text-sm text-slate-200">Get started without any payment information</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border-l-4 border-accent">
                                    <h4 className="font-bold mb-1">24/7 Support</h4>
                                    <p className="text-sm text-slate-200">Our team is here to help you succeed</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;