import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    Wallet,
    Users,
    Building2,
    Settings,
    LogOut
} from 'lucide-react';

const Sidebar = ({ isMobile, onClose }) => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Invoices', path: '/invoices' },
        { icon: Wallet, label: 'Expenses', path: '/expenses' },
        { icon: Users, label: 'Team / Members', path: '/team' },
        { icon: Building2, label: 'Company Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleNavClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Logo Section - Hidden on mobile inside sidebar as header has it, but good to keep for desktop or if drawer is open */}
            <div className="h-20 flex items-center justify-center border-b border-gray-100 md:flex">
                <img src="/logo1.png" alt="FinSight" className="h-16 w-auto" />
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {/* <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Menu
                </div> */}
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
