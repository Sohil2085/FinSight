import React from 'react';
import { Bell, Shield, User, Globe, Moon } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your application preferences and configuration.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {/* General Settings */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-500" />
                        Account Preferences
                    </h2>
                    <div className="space-y-4 max-w-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Language</p>
                                <p className="text-sm text-gray-500">Select your preferred language.</p>
                            </div>
                            <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                                <option>English (US)</option>
                                <option>Hindi</option>
                                <option>Spanish</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Time Zone</p>
                                <p className="text-sm text-gray-500">Set your local time zone.</p>
                            </div>
                            <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                                <option>UTC-5 (Eastern Time)</option>
                                <option>UTC+5:30 (IST)</option>
                                <option>UTC+0 (GMT)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-gray-500" />
                        Notifications
                    </h2>
                    <div className="space-y-4 max-w-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Email Alerts</p>
                                <p className="text-sm text-gray-500">Receive daily summaries and alerts.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">Push Notifications</p>
                                <p className="text-sm text-gray-500">Receive real-time updates.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-gray-500" />
                        Security
                    </h2>
                    <div className="space-y-4">
                        <button className="text-blue-600 font-medium hover:underline text-sm">
                            Change Password
                        </button>
                        <br />
                        <button className="text-blue-600 font-medium hover:underline text-sm">
                            Enable Two-Factor Authentication
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
