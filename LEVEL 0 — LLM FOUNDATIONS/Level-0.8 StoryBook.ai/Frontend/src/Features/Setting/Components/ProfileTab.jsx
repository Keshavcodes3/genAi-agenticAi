import React, { useState, useEffect } from 'react';

const ProfileTab = ({ user, loading, handleUpdate }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        bio: user?.bio || '',
    });

    useEffect(() => {
        setFormData({
            name: user?.name || '',
            username: user?.username || '',
            bio: user?.bio || '',
        });
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleUpdate(formData);
    };

    return (
        <div className="max-w-2xl">
            <div className="flex flex-col md:flex-row items-start gap-10">
                <div className="flex flex-col items-center gap-4">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">Profile Picture</span>
                    <div className="w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-4xl font-semibold border-[3px] border-purple-200/50 shadow-sm relative">
                        {formData.name?.charAt(0) || formData.username?.charAt(0) || 'U'}
                        <div className="absolute bottom-0 right-0 w-7 h-7 bg-purple-600 rounded-full border-4 border-white flex items-center justify-center shadow-sm"></div>
                    </div>
                    <button className="px-5 py-2 mt-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-100/50">
                        Change
                    </button>
                </div>
                
                <form onSubmit={onSubmit} className="flex-1 space-y-7 w-full">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100/50 outline-none transition-all text-zinc-800 text-[15px]"
                            placeholder="Your full name"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Username</label>
                        <input 
                            type="text" 
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100/50 outline-none transition-all text-zinc-800 text-[15px]"
                            placeholder="@username"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Bio</label>
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100/50 outline-none transition-all text-zinc-800 text-[15px] resize-none"
                            placeholder="Tell us about yourself"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold transition-all disabled:opacity-50 shadow-[0_4px_20px_-8px_rgba(147,51,234,0.5)]"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileTab;
