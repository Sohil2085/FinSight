import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { acceptInvite } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const Invite = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing invite token. Please check your email link again.");
        }
    }, [token]);

    const validateForm = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Full Name is required';
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                setLoading(true);
                setError(null);
                const response = await acceptInvite({ token, name, password });
                await login(response.data.token, response.data.user);
                navigate("/dashboard");
            } catch (err) {
                setError(err.message || "Failed to accept invite. It may have expired.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (!token && !error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden my-auto">
                <div className="flex flex-col lg:flex-row">
                    
                    {/* Left Side - Form */}
                    <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10">
                        <div className="max-w-md mx-auto">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-primary mb-1">Join Your Team</h2>
                                <p className="text-sm text-gray-500">Complete your registration to access the dashboard</p>
                            </div>

                            {/* Global Error Banner */}
                            {error && (
                                <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {token && !error?.includes("missing") && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    
                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                    if(formErrors.name) setFormErrors({...formErrors, name: ''});
                                                }}
                                                disabled={loading}
                                                className={`block w-full pl-12 pr-4 py-2.5 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-left`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {formErrors.name && <p className="mt-1.5 text-sm text-red-600">{formErrors.name}</p>}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5 text-left">
                                            Choose a Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    if(formErrors.password) setFormErrors({...formErrors, password: ''});
                                                }}
                                                disabled={loading}
                                                className={`block w-full pl-12 pr-12 py-2.5 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-left`}
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
                                        {formErrors.password && <p className="mt-1.5 text-sm text-red-600">{formErrors.password}</p>}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Activating...
                                            </>
                                        ) : (
                                            <>
                                                Accept Invite & Login
                                                <ArrowRight className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                            
                            {/* Fail safe back link */}
                            <div className="mt-6 text-center">
                                <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Return to standard login
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Branding Context */}
                    <div className="hidden lg:block w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-12 relative overflow-hidden">
                        <div className="relative z-10 h-full flex flex-col justify-center text-white">
                            <div className="mb-8">
                                <ShieldCheck className="h-16 w-16 mb-6 text-blue-400" />
                                <h3 className="text-4xl font-bold mb-4">Secure Workspace</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    You've been invited to join an active FinSight workspace. Finish creating your account to gain full access to your team's realtime workflows and financial intelligence.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                                    <p className="text-slate-300">Enterprise grade encryption for all credentials</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                                    <p className="text-slate-300">Strictly enforced role-based access control</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                                    <p className="text-slate-300">Automated permission synchronization</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative background shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Invite;
