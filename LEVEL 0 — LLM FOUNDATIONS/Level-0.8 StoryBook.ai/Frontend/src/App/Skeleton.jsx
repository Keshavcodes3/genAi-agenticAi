import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';

const Loader = () => {
    const shimmerVariants = {
        initial: { x: '-100%' },
        animate: {
            x: '100%',
            transition: { repeat: Infinity, ease: 'easeInOut', duration: 1.5 }
        }
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-3xl p-8">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-400/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Left Column (Content Skeleton) */}
                <div className="flex-1 space-y-6">
                    {/* Header Block */}
                    <div className="flex items-center gap-4">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-50 relative overflow-hidden border border-purple-100/50 shadow-sm flex items-center justify-center"
                        >
                            <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
                            <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full" />
                        </motion.div>
                        <div className="flex-1 space-y-3">
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                                className="h-6 w-3/4 rounded-lg bg-violet-50 relative overflow-hidden"
                            >
                                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-100/50 to-transparent w-full" />
                            </motion.div>
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                                className="h-4 w-1/2 rounded-md bg-purple-50 relative overflow-hidden"
                            >
                                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/50 to-transparent w-full" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Text Lines */}
                    <div className="space-y-4 pt-4">
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                                className={`h-4 rounded-md bg-zinc-100 relative overflow-hidden ${i === 3 ? 'w-2/3' : 'w-full'}`}
                            >
                                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-full" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column (Side Panel Skeleton) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full md:w-80 shrink-0 h-80 rounded-3xl bg-gradient-to-b from-violet-50/50 to-transparent border border-violet-100/60 p-6 flex flex-col gap-4 relative overflow-hidden shadow-[0_8px_30px_-4px_rgba(139,92,246,0.05)]"
                >
                    <div className="h-8 w-1/2 rounded-lg bg-violet-100/50 relative overflow-hidden">
                        <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full" />
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-3 mt-4">
                        {[0, 1].map((i) => (
                            <div key={i} className="h-16 w-full rounded-xl bg-white/60 border border-violet-100/40 relative overflow-hidden flex items-center px-4 gap-3">
                                <div className="w-8 h-8 rounded-full bg-violet-50" />
                                <div className="h-3 w-1/2 rounded bg-violet-50/80" />
                                <motion.div variants={shimmerVariants} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Central Typography Animation */}
            <div className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-center pointer-events-none">
                <motion.div 
                    animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="flex items-center gap-2 text-violet-500 font-semibold text-sm tracking-widest uppercase mb-2"
                >
                    <Wand2 className="w-4 h-4" />
                    <span>Weaving Magic</span>
                </motion.div>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div 
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-violet-400"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Loader;