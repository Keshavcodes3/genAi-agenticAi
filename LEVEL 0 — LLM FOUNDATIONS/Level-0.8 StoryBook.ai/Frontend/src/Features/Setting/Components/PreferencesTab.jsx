import React, { useState, useEffect } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

const PreferencesTab = ({ user, loading, handleUpdate }) => {
    const [theme, setTheme] = useState(user?.theme || 'light');

    useEffect(() => {
        setTheme(user?.theme || 'light');
    }, [user]);

    const themes = [
        { id: 'light', name: 'Light Mode', icon: Sun },
        { id: 'dark', name: 'Dark Mode', icon: Moon },
        { id: 'system', name: 'System Default', icon: Laptop }
    ];

    const saveTheme = (selectedTheme) => {
        setTheme(selectedTheme);
        handleUpdate({ theme: selectedTheme });
    };

    return (
        <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-zinc-900 mb-6">Display Settings</h3>
            
            <div className="space-y-4">
                <label className="text-sm font-medium text-zinc-700">Theme Preference</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {themes.map(t => (
                        <button
                            key={t.id}
                            onClick={() => saveTheme(t.id)}
                            disabled={loading}
                            className={`flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all ${
                                theme === t.id 
                                ? 'border-purple-600 bg-purple-50/50 text-purple-700 shadow-[0_8px_30px_-12px_rgba(147,51,234,0.15)]' 
                                : 'border-zinc-100 bg-white text-zinc-500 hover:border-purple-200 hover:bg-zinc-50'
                            }`}
                        >
                            <div className={`p-3 rounded-2xl ${theme === t.id ? 'bg-purple-100/50 text-purple-600' : 'bg-zinc-50 text-zinc-400'}`}>
                                <t.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[15px] font-medium tracking-tight">{t.name}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mt-12 p-6 rounded-3xl bg-purple-50/50 border border-purple-100/50">
                <h4 className="text-sm font-semibold text-purple-800 mb-2">Did you know?</h4>
                <p className="text-sm text-purple-700/80 leading-relaxed font-light">
                    Your theme preference will automatically sync across all your devices when you log in.
                </p>
            </div>
        </div>
    );
};

export default PreferencesTab;
