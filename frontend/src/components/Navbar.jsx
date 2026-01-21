import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

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
                <div className="hidden md:flex gap-8">
                    <Link to="/solutions" className="text-gray-700 font-medium hover:text-secondary transition-colors">Solutions</Link>
                    <Link to="/about" className="text-gray-700 font-medium hover:text-secondary transition-colors">About</Link>
                    <Link to="/contact" className="text-gray-700 font-medium hover:text-secondary transition-colors">Contact</Link>
                </div>
                <div className="flex gap-4">
                    <Link to="/login" className="px-4 py-2 border border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-white transition-all font-medium text-sm">Login</Link>
                    <Link to="/register" className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-all font-medium text-sm shadow-md hover:shadow-lg">Register</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
