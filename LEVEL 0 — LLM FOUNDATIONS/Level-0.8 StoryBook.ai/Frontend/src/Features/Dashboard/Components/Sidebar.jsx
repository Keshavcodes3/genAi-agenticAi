/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Home, PenTool, BookOpen, BarChart2,
    Users, Compass, Settings, Feather, ChevronLeft, ShieldAlert
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = ({ activeTab = 'Home', onTabChange, isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const menuItems = [
        { name: 'Home', icon: Home, path: '/dashboard' },
        { name: 'Write', icon: PenTool, path: '/choose' },
        { name: 'Library', icon: BookOpen, path: '/library' },
        { name: 'AI Muse', icon: Compass, path: '/muse' },
        ...(user?.role === 'admin' ? [{ name: 'Admin Dashboard', icon: ShieldAlert, path: '/admin' }] : []),
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    // Auto-detect active tab based on current path if activeTab prop isn't strictly overriding it
    const currentActive = menuItems.find(item => item.path === location.pathname)?.name || activeTab;

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 256 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="h-screen fixed left-0 top-0 bg-[#F9F8FC] border-r border-purple-100/60 flex flex-col p-4 z-50 select-none will-change-[width]"
        >
            <div className={`flex items-center mb-10 h-10 relative ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2.5"
                        >
                            <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/10 shrink-0">
                                <Feather className="w-4.5 h-4.5" />
                            </div>
                            <span className="font-bold text-base tracking-tight text-[#110E2C] whitespace-nowrap">
                                StoryBook<span className="text-violet-500">.ai</span>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isCollapsed && (
                    <motion.div
                        layoutId="collapsed-logo"
                        className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/10 shrink-0"
                    >
                        <Feather className="w-4.5 h-4.5" />
                    </motion.div>
                )}

                {/* COLLAPSE/EXPAND TOGGLE BUTTON */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`absolute -right-7 top-1.5 size-6 rounded-full border border-purple-100 bg-white flex items-center justify-center text-[#8B88A5] hover:text-[#110E2C] hover:bg-purple-50 shadow-sm transition-transform duration-300 z-50 cursor-pointer ${isCollapsed ? 'rotate-180' : ''}`}
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* NAVIGATION STACK */}
            <nav className="flex-1 space-y-1 relative">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.name === currentActive;

                    return (
                        <button
                            key={item.name}
                            onClick={() => {
                                if (item.path) {
                                    navigate(item.path);
                                }
                                if (onTabChange) {
                                    onTabChange(item.name);
                                }
                            }}
                            className={`w-full flex items-center rounded-xl text-sm font-medium tracking-wide relative py-3 px-4 transition-colors duration-200 group cursor-pointer ${isActive ? 'text-violet-600' : 'text-[#6E6B85] hover:text-[#110E2C]'
                                } ${isCollapsed ? 'justify-center' : 'gap-3.5'}`}
                        >
                            {/* SMOOTH BACKGROUND LAYOUT PILL TRACK */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeNavigationPill"
                                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                                    className="absolute inset-0 bg-gradient-to-r from-violet-500/8 to-purple-500/4 rounded-xl border-l-[3px] border-violet-500 z-0 pointer-events-none"
                                />
                            )}

                            {/* ICON */}
                            <Icon
                                className={`w-4.5 h-4.5 z-10 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-violet-600' : 'text-[#8B88A5]'
                                    }`}
                            />

                            {/* TEXT LINK TEXT */}
                            <AnimatePresence mode="popLayout">
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -6 }}
                                        transition={{ duration: 0.15 }}
                                        className="z-10 whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* TOOLTIP ON HOVER WHEN COLLAPSED */}
                            {isCollapsed && (
                                <div className="absolute left-16 px-2.5 py-1.5 bg-[#110E2C] text-white text-xs font-semibold rounded-lg opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-md whitespace-nowrap z-50">
                                    {item.name}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>
        </motion.aside>
    );
};

export default Sidebar;