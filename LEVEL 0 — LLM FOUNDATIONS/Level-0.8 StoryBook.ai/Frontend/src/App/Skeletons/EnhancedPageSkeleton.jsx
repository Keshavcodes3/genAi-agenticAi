import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Star } from 'lucide-react';

const EnhancedPageSkeleton = () => {
    const shimmerVariants = {
        initial: { x: '-100%' },
        animate: {
            x: '100%',
            transition: { repeat: Infinity, ease: 'easeInOut', duration: 1.8 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } }
    };

    const floatingVariants = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            transition: { repeat: Infinity, duration: 5, ease: 'easeInOut' }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full h-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white/80 via-violet-50/40 to-purple-50/60 backdrop-blur-sm rounded-3xl p-8"
        >
            {/* Ambient Background Glow Orbs */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1]
                }}
                transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-violet-400/20 via-purple-400/10 to-transparent blur-[120px] rounded-full pointer-events-none"
            />
            <motion.div
                animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.15, 1]
                }}
                transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-1/4 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/15 via-purple-400/10 to-transparent blur-[120px] rounded-full pointer-events-none"
            />

            <div className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 z-10">
                {/* Left Column (Main Content) */}
                <motion.div variants={itemVariants} className="flex-1 space-y-8">
                    {/* Hero Section */}
                    <motion.div
                        animate={{ scale: [1, 1.01, 1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="group"
                    >
                        <div className="flex items-center gap-6">
                            <motion.div
                                variants={floatingVariants}
                                animate="animate"
                                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-200 via-purple-100 to-pink-100 relative overflow-hidden border-2 border-violet-200/60 shadow-lg flex items-center justify-center"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                    className="absolute w-12 h-12"
                                >
                                    <Sparkles className="w-12 h-12 text-violet-400" />
                                </motion.div>
                                <motion.div
                                    variants={shimmerVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                                />
                            </motion.div>

                            <div className="flex-1 space-y-4">
                                {/* Title */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="space-y-2"
                                >
                                    <div className="h-8 w-4/5 rounded-xl bg-gradient-to-r from-violet-200/80 to-purple-200/60 relative overflow-hidden shadow-md">
                                        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                                    </div>
                                    <div className="h-5 w-3/5 rounded-lg bg-zinc-200/50 relative overflow-hidden">
                                        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Text Lines */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                                className={`h-4 rounded-full bg-gradient-to-r from-zinc-200/80 to-zinc-100/60 relative overflow-hidden ${
                                    i === 4 ? 'w-3/4' : 'w-full'
                                }`}
                            >
                                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-2 gap-4 pt-4"
                    >
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 3, delay: i * 0.15 }}
                                className="p-4 rounded-2xl bg-white/40 border border-violet-200/40 backdrop-blur-sm relative overflow-hidden"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-violet-400" />
                                        <div className="h-3 w-16 bg-violet-100/70 rounded-full" />
                                    </div>
                                    <div className="h-2 w-full bg-zinc-100/60 rounded-full relative overflow-hidden">
                                        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                    </div>
                                </div>
                                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Column (Side Panel) */}
                <motion.div
                    variants={itemVariants}
                    className="w-full lg:w-96 space-y-6"
                >
                    {/* Main Card */}
                    <motion.div
                        animate={{
                            y: [0, -12, 0],
                            boxShadow: [
                                '0 20px 40px rgba(139, 92, 246, 0.05)',
                                '0 30px 60px rgba(139, 92, 246, 0.15)',
                                '0 20px 40px rgba(139, 92, 246, 0.05)'
                            ]
                        }}
                        transition={{ repeat: Infinity, duration: 5 }}
                        className="h-96 rounded-3xl bg-gradient-to-br from-violet-100/70 via-purple-50/50 to-transparent border-2 border-violet-200/50 p-8 flex flex-col gap-6 relative overflow-hidden backdrop-blur-md"
                    >
                        {/* Card Header */}
                        <div className="space-y-3">
                            <div className="h-6 w-2/3 rounded-xl bg-violet-200/60 relative overflow-hidden">
                                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                            </div>
                            <div className="h-4 w-1/2 rounded-lg bg-zinc-200/40 relative overflow-hidden">
                                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                            </div>
                        </div>

                        {/* Card Items */}
                        <div className="flex-1 flex flex-col gap-4">
                            {[0, 1].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 4, delay: 0.5 + i * 0.3 }}
                                    className="h-20 w-full rounded-2xl bg-white/50 border border-violet-200/40 flex items-center px-4 gap-4 relative overflow-hidden group hover:bg-white/70 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-200/70 to-purple-200/70 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-24 bg-violet-100/70 rounded-full relative overflow-hidden">
                                            <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                        </div>
                                        <div className="h-2 w-16 bg-zinc-100/60 rounded-full relative overflow-hidden">
                                            <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                        </div>
                                    </div>
                                    <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                                </motion.div>
                            ))}
                        </div>

                        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </motion.div>

                    {/* Bottom Badge */}
                    <motion.div
                        animate={{ scale: [1, 1.02, 1], rotate: [0, 1, -1, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="p-4 rounded-2xl bg-gradient-to-r from-violet-200/60 to-purple-200/40 border border-violet-300/50 flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                        <Wand2 className="w-5 h-5 text-violet-600" />
                        <div className="h-3 w-24 bg-violet-300/60 rounded-full" />
                        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Loading Animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-center pointer-events-none"
            >
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    className="flex items-center gap-2 text-violet-600 font-semibold text-sm tracking-wider uppercase mb-4"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    >
                        <Wand2 className="w-5 h-5" />
                    </motion.div>
                    <span>Weaving Magic</span>
                </motion.div>

                {/* Animated Dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.6, 1],
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.8,
                                delay: i * 0.25
                            }}
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-500"
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EnhancedPageSkeleton;
