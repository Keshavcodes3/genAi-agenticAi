import React from 'react';
import { FileText, Edit3, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentWorks = ({ works = [] }) => {
    const navigate = useNavigate();

    return (
        <div className="group bg-white/80 backdrop-blur-md border border-purple-100/60 hover:border-purple-300/80 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(147,51,234,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(147,51,234,0.12)] h-full transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-violet-100/40 to-pink-100/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <h4 className="text-sm font-bold text-[#110E2C] mb-5 tracking-tight relative z-10">
                Recent Works
            </h4>

            <div className="divide-y divide-purple-50/60 relative z-10">
                {works.map((work, idx) => {
                    const IsStory = work.type.toLowerCase() === 'story';
                    return (
                        <div 
                            key={idx} 
                            onClick={() => navigate(`/editor?type=${work.type.toLowerCase()}&id=${work._id}`)}
                            className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group/item cursor-pointer hover:bg-violet-50/40 -mx-2 px-2 rounded-lg transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-transform duration-300 group-hover/item:scale-110 ${IsStory ? 'bg-violet-50 text-violet-600' : 'bg-pink-50 text-pink-600'}`}>
                                    {IsStory ? <BookOpen className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h5 className="text-[14px] font-semibold text-[#110E2C] group-hover/item:text-violet-600 transition-colors">
                                        {work.title}
                                    </h5>
                                    <span className="text-[11px] text-[#8B88A5] font-medium tracking-wide">
                                        {work.type}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs text-[#8B88A5] font-medium font-mono group-hover/item:text-violet-500 transition-colors">
                                {work.timeAgo}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentWorks;