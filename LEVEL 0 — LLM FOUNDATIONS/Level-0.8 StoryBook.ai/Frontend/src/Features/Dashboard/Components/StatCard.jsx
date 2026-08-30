import React from 'react';

const StatCard = ({ title, value, subtitle, trend, iconEmoji }) => {
    return (
        <div className="group bg-white/80 backdrop-blur-md border border-purple-100/60 hover:border-purple-300/80 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(147,51,234,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(147,51,234,0.12)] flex flex-col justify-between min-h-[140px] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-purple-100/40 to-violet-100/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-[#8B88A5] uppercase tracking-wider group-hover:text-purple-500 transition-colors duration-300">{title}</span>
                    {iconEmoji && <span className="text-xl select-none">{iconEmoji}</span>}
                </div>
                <h3 className="text-3xl font-bold text-[#110E2C] tracking-tight">{value}</h3>
            </div>

            <div className="mt-4 flex items-center gap-2 relative z-10">
                {trend && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        {trend.value}
                    </span>
                )}
                <span className="text-xs text-[#8B88A5] font-medium">{subtitle}</span>
            </div>
        </div>
    );
};

export default StatCard;