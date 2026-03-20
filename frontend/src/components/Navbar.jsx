import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full py-4 transition-all duration-300 z-[1000] ${isScrolled ? 'bg-white shadow-sm py-3' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src="/logo1.png" alt="FinSight Logo" className="h-16 w-auto" />
                </Link>
                
                {/* Desktop Nav Links */}
                <div className="hidden md:flex gap-8">
                    <Link to="/solutions" className="text-gray-700 font-medium hover:text-secondary transition-colors">Solutions</Link>
                    <Link to="/about" className="text-gray-700 font-medium hover:text-secondary transition-colors">About</Link>
                    <Link to="/contact" className="text-gray-700 font-medium hover:text-secondary transition-colors">Contact</Link>
                </div>
                
                {/* Desktop Auth Section */}
                <div className="hidden md:flex gap-4 items-center">
                    {user ? (
                        <div className="relative group">
                            <button className="flex items-center gap-2 focus:outline-none">
                                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg shadow-md">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="font-medium text-gray-700">{user.name}</span>
                            </button>
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Dashboard
                                </Link>
                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 border border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all font-medium text-sm">Login</Link>
                            <Link to="/register" className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-all font-medium text-sm shadow-md hover:shadow-lg">Register</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-700 hover:text-secondary focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 flex flex-col gap-4 px-6 z-50 animate-fadeIn fade-in">
                    <Link to="/solutions" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-secondary transition-colors block py-2 border-b border-gray-50">Solutions</Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-secondary transition-colors block py-2 border-b border-gray-50">About</Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-secondary transition-colors block py-2 border-b border-gray-50">Contact</Link>
                    
                    <div className="pt-2 flex flex-col gap-3">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 py-2 border-b border-gray-50 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg shadow-md">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-secondary transition-colors block py-2">Dashboard</Link>
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium hover:text-secondary transition-colors block py-2">Profile</Link>
                                <button
                                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                    className="w-full text-left text-red-600 font-medium hover:text-red-700 transition-colors block py-2"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 mt-2">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-2 border border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all font-medium text-sm">Login</Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-all font-medium text-sm shadow-md hover:shadow-lg">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;