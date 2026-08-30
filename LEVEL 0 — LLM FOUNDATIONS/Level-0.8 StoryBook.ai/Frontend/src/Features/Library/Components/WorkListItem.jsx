import React from 'react';
import { Maximize2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkListItem = ({ title, type, metrics, timeAgo, gradientClass, onDelete, onClick }) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.002, backgroundColor: 'rgba(255, 255, 255, 1)' }}
            className="flex items-center justify-between p-4 md:px-6 bg-white/60 border-b border-purple-100/30 hover:border-purple-100/60 transition-colors duration-300 group cursor-pointer"
        >
            <div className="flex items-center gap-5">
                {/* Image Placeholder with Gradient */}
                <div className={`w-14 h-14 rounded-xl shadow-sm bg-gradient-to-br ${gradientClass} flex items-center justify-center shrink-0`}>
                    <div className="w-1/2 h-1/2 bg-white/20 backdrop-blur-sm rounded-lg" />
                </div>

                {/* Typography Stack */}
                <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-[#110E2C] text-base group-hover:text-violet-600 transition-colors duration-200">
                        {title}
                    </h3>
                    <p className="text-sm font-medium text-[#8B88A5]">
                        {type} • {metrics}
                    </p>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#6E6B85] hidden md:block">
                    {timeAgo}
                </span>

                <div className="flex items-center gap-2">
                    <button className="p-2 text-[#8B88A5] hover:text-[#110E2C] hover:bg-[#F4F2FA] rounded-lg transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="p-2 text-[#8B88A5] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default WorkListItem;

