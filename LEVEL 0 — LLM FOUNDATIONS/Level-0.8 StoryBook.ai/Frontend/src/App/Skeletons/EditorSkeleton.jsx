import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Zap } from 'lucide-react';

const EditorSkeleton = () => {
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
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full h-screen bg-gradient-to-br from-white via-violet-50/30 to-purple-50/20 flex flex-col overflow-hidden"
        >
            {/* Header Toolbar */}
            <motion.div
                variants={itemVariants}
                className="border-b border-violet-200/30 bg-white/40 backdrop-blur-md px-6 py-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-300 to-purple-200 flex items-center justify-center relative overflow-hidden">
                        <BookOpen className="w-5 h-5 text-violet-700" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-4 w-32 bg-violet-100/60 rounded-lg relative overflow-hidden">
                            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>
                        <div className="h-3 w-24 bg-zinc-100/40 rounded-md relative overflow-hidden">
                            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                            className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-200/60 to-purple-100/60 relative overflow-hidden"
                        >
                            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <div className="flex flex-1 gap-4 p-6 overflow-hidden">
                {/* Main Editor Area */}
                <motion.div
                    variants={itemVariants}
                    className="flex-1 flex flex-col gap-4 min-w-0"
                >
                    {/* Title Block */}
                    <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="h-16 rounded-2xl bg-gradient-to-r from-violet-100/50 to-purple-100/50 border border-violet-200/30 p-5 flex items-center relative overflow-hidden"
                    >
                        <div className="h-8 w-2/3 bg-violet-200/40 rounded-lg" />
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </motion.div>

                    {/* Content Area */}
                    <motion.div
                        variants={itemVariants}
                        className="flex-1 rounded-3xl bg-white/50 backdrop-blur-md border border-violet-200/30 p-8 overflow-hidden relative"
                    >
                        <div className="space-y-5">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className={`h-4 rounded-full bg-zinc-100/70 relative overflow-hidden ${
                                        i === 4 ? 'w-5/6' : i === 5 ? 'w-3/4' : 'w-full'
                                    }`}
                                >
                                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Floating Particle Effects */}
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    x: [0, 100, -50, 0],
                                    y: [0, -100, 50, 0],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 5,
                                    delay: i * 1.5,
                                    ease: 'easeInOut'
                                }}
                                className="absolute w-2 h-2 rounded-full bg-violet-300/40"
                                style={{
                                    left: `${20 + i * 30}%`,
                                    top: `${30 + i * 20}%`
                                }}
                            />
                        ))}

                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </motion.div>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    variants={itemVariants}
                    className="w-80 space-y-4"
                >
                    {/* Section 1 */}
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="rounded-2xl bg-gradient-to-br from-violet-100/50 to-purple-50/50 border border-violet-200/30 p-5 relative overflow-hidden"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-4 h-4 text-violet-500" />
                                <div className="h-4 w-20 bg-violet-200/40 rounded-md" />
                            </div>
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="h-3 w-full bg-violet-200/30 rounded-full relative overflow-hidden">
                                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                </div>
                            ))}
                        </div>
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </motion.div>

                    {/* Section 2 */}
                    <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                        className="rounded-2xl bg-gradient-to-br from-purple-100/50 to-pink-50/50 border border-purple-200/30 p-5 relative overflow-hidden"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-4 h-4 text-purple-500" />
                                <div className="h-4 w-20 bg-purple-200/40 rounded-md" />
                            </div>
                            {[0, 1].map((i) => (
                                <div key={i} className="h-10 w-full bg-white/40 rounded-lg border border-purple-200/20 relative overflow-hidden" />
                            ))}
                        </div>
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </motion.div>

                    {/* Section 3 - Stats */}
                    <motion.div
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                        className="rounded-2xl bg-gradient-to-br from-violet-200/30 to-purple-200/30 border border-violet-200/40 p-5 relative overflow-hidden"
                    >
                        <div className="space-y-4">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="h-3 w-12 bg-violet-200/40 rounded-full" />
                                    <div className="h-4 w-8 bg-violet-300/40 rounded-lg" />
                                </div>
                            ))}
                        </div>
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EditorSkeleton;
