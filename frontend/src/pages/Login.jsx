import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, TrendingUp } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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
                const response = await loginUser(formData);
                console.log('Login successful:', response);

                // Use the login function from context
                if (response.success && response.data) {
                    const { token, user } = response.data;
                    login(token, user);
                    navigate('/dashboard');
                } else {
                    throw new Error("Invalid response from server");
                }
            } catch (error) {
                console.error("Login error:", error);
                setErrors(prev => ({
                    ...prev,
                    submit: error.message || "Login failed. Please check your credentials."
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
                                <h2 className="text-2xl font-bold text-primary mb-1">Welcome Back</h2>
                                <p className="text-sm text-text-light">Log in to continue to your account</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errors.submit && (
                                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                                        {errors.submit}
                                    </div>
                                )}
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
                                            autoComplete="current-password"
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
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded cursor-pointer"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-secondary hover:text-primary transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>
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
                                            Logging in...
                                        </>
                                    ) : (
                                        <>
                                            Log in
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>

                                {/* Register Link */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="font-medium text-secondary hover:text-primary transition-colors">
                                            Create an account
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
                                <TrendingUp className="h-16 w-16 mb-6 text-accent" />
                                <h3 className="text-4xl font-bold mb-4">Smart Finance & Billing</h3>
                                <p className="text-lg text-slate-200 leading-relaxed">
                                    Automate invoicing and cash-flow with AI-powered insights. Save time and make smarter decisions.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                                    <p className="text-slate-200">Real-time financial analytics</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                                    <p className="text-slate-200">Automated invoice generation</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                                    <p className="text-slate-200">AI-powered cash flow predictions</p>
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

export default Login;