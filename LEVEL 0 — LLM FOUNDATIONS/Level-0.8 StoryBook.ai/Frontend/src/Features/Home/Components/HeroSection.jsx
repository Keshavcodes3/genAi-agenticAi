import React from 'react';
import { Sparkles, PenTool, Compass, Feather } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-0 relative z-10 flex flex-col lg:flex-row items-center gap-16">
            
            {/* Background Decorative Feather (Optional for absolute positioning) */}
            <div className="absolute -bottom-10 left-10 opacity-10 pointer-events-none w-64 h-64 -rotate-12">
                <Feather className="w-full h-full text-violet-500" />
            </div>

            {/* Left Content */}
            <div className="flex-1 flex flex-col items-start relative z-10">
                {/* Pill */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-violet-50 border border-violet-100 px-4 py-2 rounded-full mb-8"
                >
                    <span className="text-violet-600 font-bold text-xs tracking-wide">v2.0 Generation Pipeline Launched</span>
                    <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                </motion.div>

                {/* Headline */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-[4.5rem] font-extrabold text-[#110E2C] leading-[1.1] tracking-tight mb-6"
                >
                    Where your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-600 inline-block">stories</span>
                    <br/> come alive.
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[#6E6B85] text-lg md:text-xl font-medium max-w-md mb-10 leading-relaxed"
                >
                    AI-powered stories, poems and creativity tools to help you express, reflect and evolve.
                </motion.p>

                {/* Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center gap-4"
                >
                    <Link to="/choose" className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-7 py-3.5 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-violet-500/25 transition-all hover:-translate-y-1">
                        <PenTool className="w-5 h-5" /> Start Writing
                    </Link>
                    <button className="flex items-center gap-2 bg-white text-[#110E2C] border border-gray-200 px-7 py-3.5 rounded-2xl font-bold text-base hover:border-gray-300 hover:shadow-sm transition-all">
                        <Compass className="w-5 h-5 text-[#8B88A5]" /> Explore
                    </button>
                </motion.div>
            </div>

            {/* Right Content - Code Editor Graphic */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                className="flex-1 w-full max-w-xl lg:max-w-none perspective-1000"
            >
                <div className="w-full bg-white rounded-3xl shadow-2xl shadow-purple-900/5 border border-purple-100/50 overflow-hidden transform hover:scale-[1.02] transition-transform duration-700">
                    {/* Mac Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-purple-50/80 bg-white">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#8B88A5]">
                            <Feather className="w-3.5 h-3.5 text-violet-500" /> workspace/the_echo.md
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest">
                            <span className="text-violet-600">LIVE</span>
                            <span className="text-gray-400">DRAFT</span>
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="p-8 md:p-10 font-sans text-sm md:text-base leading-relaxed bg-white">
                        <div className="text-lg font-bold text-[#110E2C] mb-6 flex items-center gap-2">
                            <span className="text-violet-500">#</span> The Silent Echo
                        </div>
                        <div className="text-[#4A4765] pl-4 border-l-2 border-violet-100">
                            Go under the sun, let the golden light fall,<br/>
                            Where the rush of the world doesn't matter at all.<br/>
                            Feel the warmth of the breeze as it brushes your skin,<br/>
                            The quiet, sweet place where the summer begins.<br/>
                            Smell the trees and the plants, how they breathe in the afternoon air,<br/>
                            The scent of the earth, and the wind in your hair.<br/>
                            Enjoy them, my love—every shadow and gleam,<br/>
                            Like walking awake through a beautiful dream.<br/>
                            But look back at me while the meadow is bright,<br/>
                            And know that you hold all my warmth and my light.<br/>
                            For as sweet as the earth and the wild breezes blow,<br/>
                            You are the most beautiful thing that I know. <span className="inline-block w-2 h-4 bg-violet-400 ml-1 animate-pulse translate-y-1"></span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
