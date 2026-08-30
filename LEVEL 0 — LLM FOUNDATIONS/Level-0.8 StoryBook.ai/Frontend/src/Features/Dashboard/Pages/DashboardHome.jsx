import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatCard from '../Components/StatCard';
import DailyPrompt from '../Components/DailyPrompt';
import RecentWorks from '../Components/RecentWorks';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTotalStats, fetchRecentWorks } from '../../Stories/Redux/stories.slice';
import { getPersonalizedGreeting } from '../../../utils/greeting';

const DashboardHome = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const displayName = user?.name || user?.username || 'there';
    const greeting = getPersonalizedGreeting(displayName);

    const { totalStats, recentWorks } = useSelector(state => state.stories);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTotalStats());
        dispatch(fetchRecentWorks(3));
    }, [dispatch]);

    const statsData = [
        { title: "Writing Streak", value: user?.Streak || 0, subtitle: "days", iconEmoji: null, trend: null },
        { title: "Total Creations", value: totalStats?.totalCreations || 0, subtitle: "Saved creations", iconEmoji: null, trend: null },
        { title: "Stories", value: totalStats?.totalStories || 0, subtitle: "Total stories", iconEmoji: null, trend: null },
        { title: "Poems", value: totalStats?.totalPoems || 0, subtitle: "Total poems", iconEmoji: null, trend: null }
    ];

    const currentPrompt = "Write about a memory that still makes you smile.";

    const recentWorksData = (recentWorks || []).map(work => ({
        _id: work._id,
        title: work.title,
        type: work.format === 'story' ? 'Story' : 'Poem',
        timeAgo: 'Recently'
    }));

    const handlePromptWriteAction = () => {
        // Redirect to Editor with a pre-filled prompt query parameter
        navigate(`/editor?type=story&prompt=${encodeURIComponent(currentPrompt)}`);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div 
            initial="hidden" 
            animate="show" 
            variants={containerVariants}
            className="p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-10"
        >
            {/* Welcome User Core Frame Banner */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold tracking-tight text-[#110E2C] mb-1">
                    {greeting}
                </h1>
                <p className="text-sm text-[#6E6B85] font-medium tracking-wide">
                    Let's write something beautiful today.
                </p>
            </motion.div>

            {/* Core Analytics Matrix Grid Layout */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                    <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                        <StatCard
                            title={stat.title}
                            value={stat.value}
                            subtitle={stat.subtitle}
                            trend={stat.trend}
                            iconEmoji={stat.iconEmoji}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Action Tasks Split Grid Area */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <motion.div variants={itemVariants} className="h-full">
                    <DailyPrompt
                        promptText={currentPrompt}
                        onStartWriting={handlePromptWriteAction}
                    />
                </motion.div>
                <motion.div variants={itemVariants} className="h-full">
                    <RecentWorks
                        works={recentWorksData}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardHome;