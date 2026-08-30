import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../Hooks/useSettings';
import ProfileTab from '../Components/ProfileTab';
import PreferencesTab from '../Components/PreferencesTab';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const SettingsPage = () => {
    const { user, loading, error, success, handleUpdate } = useSettings();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'preferences', label: 'Preferences' }
    ];

    return (
        <div className="flex-1 w-full h-full bg-[#F8F9FA] overflow-y-auto p-8 md:p-12 font-sans custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-10">

                <div className="flex items-center gap-3">

                    <h1 className="text-2xl font-bold text-purple-800 tracking-wide uppercase">Settings</h1>
                </div>

                <div className="bg-white rounded-[32px] border border-purple-100/40 shadow-[0_8px_40px_rgba(0,0,0,0.02)] p-8 md:p-12 min-h-[600px]">

                    <div className="flex items-center gap-2 mb-10 pb-6 border-b border-zinc-100 overflow-x-auto custom-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-3 rounded-2xl text-[15px] font-semibold transition-colors z-10 ${activeTab === tab.id ? 'text-purple-700' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="settingsTab"
                                        className="absolute inset-0 border border-purple-200/60 bg-purple-50/70 rounded-2xl -z-10 shadow-[0_4px_20px_-8px_rgba(147,51,234,0.15)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-[15px] font-medium border border-red-100">
                                    <AlertCircle className="w-5 h-5" /> {error}
                                </div>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 text-[15px] font-medium border border-emerald-100">
                                    <CheckCircle2 className="w-5 h-5" /> Profile successfully updated
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                    >
                        {activeTab === 'profile' && (
                            <ProfileTab user={user} loading={loading} handleUpdate={handleUpdate} />
                        )}
                        {activeTab === 'preferences' && (
                            <PreferencesTab user={user} loading={loading} handleUpdate={handleUpdate} />
                        )}
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
