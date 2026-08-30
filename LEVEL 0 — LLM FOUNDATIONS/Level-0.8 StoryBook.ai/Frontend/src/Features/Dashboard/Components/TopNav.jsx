import React from 'react';
import { Bell, Coins } from 'lucide-react';
import { useSelector } from 'react-redux';

const TopNav = ({ userName = "Guest" }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <header className="w-full flex items-center justify-between px-10 py-4 border-b border-purple-100/40 bg-white/80 backdrop-blur-md sticky top-0 z-20">
            {/* Right Greeting Header space can be populated later if needed */}
            <div />

            {/* Utility Cluster Actions */}
            <div className="flex items-center gap-5">
                {/* Credits / Muse Action */}
                <button className="flex items-center gap-2 bg-[#F4F2FA] text-[#4A4765] px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-purple-100/60 transition-colors">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>{user?.generationCredits || 0} Credits</span>
                </button>

                {/* Notification Bell */}
                <button className="p-2 text-[#6E6B85] hover:bg-[#F4F2FA] hover:text-[#110E2C] rounded-xl transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 size-2 bg-pink-500 rounded-full ring-2 ring-white" />
                </button>

                {/* Profile Avatar Trigger */}
                <div className="flex items-center gap-3 pl-2 border-l border-purple-100">
                    <div className="size-9 rounded-full bg-gradient-to-tr from-violet-400 to-pink-400 p-[1.5px] shadow-sm cursor-pointer hover:scale-105 transition-transform">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user?.name || userName}
                                className="w-full h-full rounded-full bg-white object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-violet-500">
                                {user?.name ? user.name.charAt(0).toUpperCase() : user?.username ? user.username.charAt(0).toUpperCase() : userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;