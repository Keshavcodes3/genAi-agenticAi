import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, BookMarked, Users } from 'lucide-react';

const DashboardSkeleton = () => {
    const shimmer = {
        initial: { x: '-100%' },
        animate: {
            x: '100%',
            transition: { repeat: Infinity, ease: 'easeInOut', duration: 2 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
    };

    // Stat Card Component
    const StatCard = ({ icon: Icon, delay, color }) => (
        <motion.div
            variants={itemVariants}
            custom={delay}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, delay }}
            className={`rounded-2xl bg-gradient-to-br ${color} border border-white/20 p-6 relative overflow-hidden backdrop-blur-sm`}
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white/60" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-white/20 rounded-lg relative overflow-hidden">
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>
                    <div className="h-6 w-16 bg-white/30 rounded-lg relative overflow-hidden">
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </div>
                </div>
            </div>
            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full min-h-screen bg-gradient-to-br from-white via-violet-50/20 to-purple-50/30 p-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="mb-12">
                <div className="h-8 w-48 bg-violet-200/40 rounded-xl relative overflow-hidden mb-4">
                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="h-5 w-80 bg-zinc-100/50 rounded-lg relative overflow-hidden">
                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={TrendingUp}
                    delay={0}
                    color="from-violet-400/60 to-purple-500/60"
                />
                <StatCard
                    icon={Zap}
                    delay={0.1}
                    color="from-orange-400/60 to-red-500/60"
                />
                <StatCard
                    icon={BookMarked}
                    delay={0.2}
                    color="from-blue-400/60 to-cyan-500/60"
                />
                <StatCard
                    icon={Users}
                    delay={0.3}
                    color="from-pink-400/60 to-rose-500/60"
                />
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Large Chart */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 rounded-3xl bg-white/40 backdrop-blur-md border border-violet-200/30 p-8 relative overflow-hidden"
                >
                    <div className="space-y-6">
                        {/* Chart Header */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-5 w-32 bg-violet-100/60 rounded-lg relative overflow-hidden">
                                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                                </div>
                                <div className="h-4 w-24 bg-zinc-100/50 rounded-lg relative overflow-hidden">
                                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                                </div>
                            </div>
                        </div>

                        {/* Chart Bars */}
                        <motion.div className="flex items-end justify-between h-48 gap-3">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: ['40%', '80%', '60%', '40%'],
                                        opacity: [0.6, 1, 0.8, 0.6]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        delay: i * 0.15
                                    }}
                                    className="flex-1 rounded-t-xl bg-gradient-to-t from-violet-400/60 to-purple-300/60 relative overflow-hidden min-h-[20%]"
                                >
                                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>

                {/* Side Panel */}
                <motion.div variants={itemVariants} className="space-y-6">
                    {/* Info Card 1 */}
                    <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="rounded-2xl bg-gradient-to-br from-violet-100/60 to-purple-50/60 border border-violet-200/30 p-6 relative overflow-hidden"
                    >
                        <div className="space-y-4">
                            <div className="h-4 w-28 bg-violet-200/40 rounded-lg" />
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-3 w-full bg-violet-100/50 rounded-full relative overflow-hidden">
                                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                </div>
                            ))}
                        </div>
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </motion.div>

                    {/* Info Card 2 */}
                    <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 4, delay: 0.3 }}
                        className="rounded-2xl bg-gradient-to-br from-purple-100/60 to-pink-50/60 border border-purple-200/30 p-6 relative overflow-hidden"
                    >
                        <div className="space-y-4">
                            <div className="h-4 w-28 bg-purple-200/40 rounded-lg" />
                            <div className="flex gap-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.5,
                                            delay: i * 0.2
                                        }}
                                        className="flex-1 h-8 rounded-lg bg-purple-200/40"
                                    />
                                ))}
                            </div>
                        </div>
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                variants={itemVariants}
                className="rounded-3xl bg-white/40 backdrop-blur-md border border-violet-200/30 p-8 relative overflow-hidden"
            >
                <div className="mb-6">
                    <div className="h-5 w-32 bg-violet-100/60 rounded-lg relative overflow-hidden">
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </div>
                </div>

                {/* Activity Items */}
                <div className="space-y-4">
                    {[0, 1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 + i * 0.1 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/30 hover:bg-white/50 transition-colors relative overflow-hidden"
                        >
                            <div className="w-4 h-4 rounded-full bg-violet-300/60 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-40 bg-violet-100/50 rounded-full relative overflow-hidden">
                                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                </div>
                                <div className="h-2 w-28 bg-zinc-100/40 rounded-full relative overflow-hidden">
                                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                </div>
                            </div>
                            <div className="h-3 w-16 bg-zinc-100/50 rounded-full relative overflow-hidden">
                                <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            </div>
                            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </motion.div>
                    ))}
                </div>
                <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>
        </motion.div>
    );
};

export default DashboardSkeleton;
