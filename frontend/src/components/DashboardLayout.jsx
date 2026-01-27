import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center">
                    <img src="/logo1.png" alt="FinSight" className="h-16 w-auto mr-2" />
                </div>
                <button onClick={toggleSidebar} className="p-2 text-gray-600 rounded-lg hover:bg-gray-100">
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar with mobile toggle logic */}
            <div className={`fixed inset-y-0 left-0 bg-white z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen w-64 border-r border-gray-200 ${isSidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'}`}>
                <Sidebar isMobile={true} onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
