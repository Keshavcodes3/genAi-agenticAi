import React from 'react';
import { PenTool } from 'lucide-react';

const DailyPrompt = ({ promptText, onStartWriting }) => {
    return (
        <div className="group bg-white/80 backdrop-blur-md border border-purple-100/60 hover:border-purple-300/80 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(147,51,234,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(147,51,234,0.12)] flex flex-col h-full justify-between transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="relative z-10">
                <h4 className="text-sm font-bold text-[#110E2C] mb-4 tracking-tight flex items-center gap-2">
                    Daily Prompt
                    <span className="relative flex h-2 w-2 ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                    </span>
                </h4>
                <p className="text-[#4A4765] text-[15px] leading-relaxed font-normal italic">
                    "{promptText}"
                </p>
            </div>

            <div className="mt-8 relative z-10">
                <button
                    onClick={onStartWriting}
                    className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] flex items-center gap-2 group/btn"
                >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></span>
                    <PenTool className="w-3.5 h-3.5" />
                    Start Writing
                </button>
            </div>
        </div>
    );
};

export default DailyPrompt;