import React from 'react';
import { motion } from 'framer-motion';

const ChatSkeleton = () => {
    const shimmer = {
        initial: { x: '-100%' },
        animate: {
            x: '100%',
            transition: { repeat: Infinity, ease: 'easeInOut', duration: 2 }
        }
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    const bubbleVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        show: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4 }
        }
    };

    return (
        <div className="w-full h-screen flex flex-col bg-gradient-to-b from-white to-violet-50/30">
            {/* Header */}
            <div className="border-b border-violet-200/30 backdrop-blur-md bg-white/40 p-4 sticky top-0">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-200 to-purple-100 relative overflow-hidden">
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-violet-100/50 rounded-lg relative overflow-hidden">
                            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>
                        <div className="h-3 w-24 bg-zinc-100/50 rounded-md relative overflow-hidden">
                            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Messages Container */}
            <motion.div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                {/* AI Message 1 */}
                <motion.div
                    variants={messageVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0 }}
                    className="flex gap-4 items-end"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-300 to-purple-200 shrink-0" />
                    <motion.div
                        variants={bubbleVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.1 }}
                        className="max-w-xs rounded-3xl rounded-tl-none bg-gradient-to-br from-violet-100/80 to-purple-50/80 backdrop-blur-sm p-4 border border-violet-200/50 relative overflow-hidden"
                    >
                        <div className="space-y-3">
                            <div className="h-3 w-full bg-violet-200/40 rounded-full relative overflow-hidden">
                                <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                            </div>
                            <div className="h-3 w-5/6 bg-violet-200/40 rounded-full relative overflow-hidden">
                                <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                            </div>
                            <div className="h-3 w-3/4 bg-violet-200/40 rounded-full relative overflow-hidden">
                                <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                            </div>
                        </div>
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </motion.div>
                </motion.div>

                {/* User Message */}
                <motion.div
                    variants={messageVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.3 }}
                    className="flex gap-4 items-end justify-end"
                >
                    <motion.div
                        variants={bubbleVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.4 }}
                        className="max-w-xs rounded-3xl rounded-tr-none bg-gradient-to-br from-violet-400/70 to-purple-500/70 backdrop-blur-sm p-4 border border-violet-400/50 relative overflow-hidden"
                    >
                        <div className="space-y-3">
                            <div className="h-3 w-5/6 bg-white/30 rounded-full relative overflow-hidden">
                                <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                            </div>
                            <div className="h-3 w-4/5 bg-white/30 rounded-full relative overflow-hidden">
                                <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                            </div>
                        </div>
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </motion.div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-blue-200 shrink-0" />
                </motion.div>

                {/* AI Message 2 - Typing */}
                <motion.div
                    variants={messageVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 items-end"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-300 to-purple-200 shrink-0" />
                    <motion.div
                        variants={bubbleVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.7 }}
                        className="rounded-3xl rounded-tl-none bg-gradient-to-br from-violet-100/80 to-purple-50/80 backdrop-blur-sm p-4 border border-violet-200/50 relative overflow-hidden"
                    >
                        <div className="flex gap-2 items-center h-4">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.2,
                                        delay: i * 0.2
                                    }}
                                    className="w-2 h-2 rounded-full bg-violet-400"
                                />
                            ))}
                        </div>
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Input Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="border-t border-violet-200/30 backdrop-blur-md bg-white/40 p-4"
            >
                <div className="flex gap-4">
                    <div className="flex-1 h-12 rounded-2xl bg-white/60 border border-violet-200/30 relative overflow-hidden">
                        <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 relative overflow-hidden"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default ChatSkeleton;
