import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CardSkeleton = ({ count = 3 }) => {
    const shimmer = {
        initial: { x: '-100%' },
        animate: {
            x: '100%',
            transition: { repeat: Infinity, ease: 'easeInOut', duration: 2 }
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
            {[...Array(count)].map((_, idx) => (
                <motion.div
                    key={idx}
                    variants={item}
                    className="group relative"
                >
                    {/* Gradient Border Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />

                    <div className="relative bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden border border-violet-200/30 p-5 h-80 flex flex-col gap-4">
                        {/* Shimmer overlay */}
                        <motion.div
                            variants={shimmer}
                            initial="initial"
                            animate="animate"
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        />

                        {/* Image Skeleton */}
                        <div className="relative w-full h-40 rounded-xl bg-gradient-to-br from-violet-100 to-purple-50 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-violet-300 animate-pulse" />
                            </div>
                            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>

                        {/* Title Skeleton */}
                        <div className="relative h-5 w-3/4 rounded-lg bg-violet-100/60 overflow-hidden">
                            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                        </div>

                        {/* Description Lines */}
                        <div className="flex-1 space-y-3 relative">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`h-3 rounded-md bg-zinc-100/60 overflow-hidden relative ${
                                        i === 2 ? 'w-4/5' : 'w-full'
                                    }`}
                                >
                                    <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                                </div>
                            ))}
                        </div>

                        {/* Footer Badge */}
                        <div className="relative h-8 w-20 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 overflow-hidden">
                            <motion.div variants={shimmer} initial="initial" animate="animate" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default CardSkeleton;
