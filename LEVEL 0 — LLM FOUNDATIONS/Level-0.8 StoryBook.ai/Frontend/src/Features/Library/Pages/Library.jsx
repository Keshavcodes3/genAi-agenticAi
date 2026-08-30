import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WorkListItem from '../Components/WorkListItem';
import { useChoose } from '../../Choose/Hooks/useChoose';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllContent } from '../../Stories/Redux/stories.slice';

const TABS = ['All', 'Stories', 'Poems'];

const Library = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { removeWork } = useChoose();
    const { allContent, loading } = useSelector(state => state.stories);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchAllContent());
    }, [dispatch]);

    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays}d ago`;
    };

    const getMetrics = (item) => {
        if (item.format === 'story') {
            const words = item.generatedText ? item.generatedText.split(/\s+/).filter(Boolean).length : 0;
            return `${words} words`;
        } else {
            const lines = item.generatedText ? item.generatedText.split('\n').filter(Boolean).length : 0;
            return `${lines} lines`;
        }
    };

    const getGradientClass = (item) => {
        if (item.format === 'story') {
            return "from-[#8E70FA] to-[#6A4BE0]";
        } else {
            return "from-[#D96B85] to-[#C3526E]";
        }
    };

    // Merge stories and poems from backend
    const allCreations = [
        ...(allContent?.stories || []).map(s => ({ ...s, category: 'Stories', type: 'Story' })),
        ...(allContent?.poems || []).map(p => ({ ...p, category: 'Poems', type: 'Poem' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const filteredWorks = allCreations.filter(work => {
        // Filter by Tab
        if (activeTab === 'Stories' && work.category !== 'Stories') return false;
        if (activeTab === 'Poems' && work.category !== 'Poems') return false;

        // Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const titleMatch = work.title?.toLowerCase().includes(query);
            const promptMatch = work.userPrompt?.toLowerCase().includes(query);
            const textMatch = work.generatedText?.toLowerCase().includes(query);
            return titleMatch || promptMatch || textMatch;
        }

        return true;
    });

    const handleDelete = async (id, format) => {
        if (window.confirm("Are you sure you want to delete this masterpiece forever?")) {
            try {
                // Backend requires either 'story' or 'poetry'
                const deleteType = format === 'poetry' ? 'poetry' : 'story';
                await removeWork(deleteType, id);
                dispatch(fetchAllContent()); // Refresh the Redux store after deletion
            } catch (err) {
                console.error("Failed to delete creation:", err);
            }
        }
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10 min-h-full">
            {/* Header Stack */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-8">
                    <h1 className="text-lg font-bold tracking-widest text-violet-600 uppercase">
                        LIBRARY / MY WORKS
                    </h1>
                </div>

                {/* Controls Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-purple-100/40 pb-4">

                    {/* Tab Selection Controller */}
                    <div className="flex items-center gap-2 bg-transparent p-1 overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative px-4 py-2 text-sm font-bold transition-colors duration-300 rounded-full whitespace-nowrap ${isActive ? 'text-violet-700' : 'text-[#6E6B85] hover:text-[#110E2C]'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeLibraryTab"
                                            transition={{ type: "spring", stiffness: 220, damping: 26 }}
                                            className="absolute inset-0 bg-violet-50 rounded-full z-0 border border-violet-100/60 shadow-sm"
                                        />
                                    )}
                                    <span className="relative z-10">{tab}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Utility */}
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-[#8B88A5]" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search works..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-purple-100/60 rounded-xl text-sm font-medium text-[#110E2C] placeholder:text-[#8B88A5] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Works Registry List */}
            <div className="bg-white rounded-3xl border border-purple-100/60 shadow-sm flex flex-col min-h-[200px] relative">
                {loading && allCreations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 gap-3">
                        <svg className="animate-spin h-8 w-8 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm font-bold text-[#8B88A5]">Opening your personal archive...</span>
                    </div>
                ) : (
                    <>
                        <AnimatePresence mode="popLayout">
                            {filteredWorks.map((work) => (
                                <motion.div
                                    key={work._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="last:border-b-0 border-b border-purple-100/30"
                                >
                                    <WorkListItem
                                        title={work.title}
                                        type={work.type}
                                        metrics={getMetrics(work)}
                                        timeAgo={formatTimeAgo(work.createdAt)}
                                        gradientClass={getGradientClass(work)}
                                        onDelete={() => handleDelete(work._id, work.format)}
                                        onClick={() => navigate(`/editor?type=${work.type.toLowerCase()}&id=${work._id}`)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredWorks.length === 0 && (
                            <div className="p-12 text-center text-[#8B88A5] font-bold text-sm">
                                No works found. Start weaving a new masterpiece on the write tab!
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Library;


