import React from 'react';
import { Sparkles, BookOpen, PenTool, Layers, Users } from 'lucide-react';

const FeaturesBanner = () => {
    const features = [
        {
            icon: Sparkles,
            title: "AI Writing",
            description: "Smart, context-aware assistance"
        },
        {
            icon: BookOpen,
            title: "Stories & Poems",
            description: "From ideas to beautiful creations"
        },
        {
            icon: PenTool,
            title: "Customize",
            description: "Fine-tune tone, style and mood"
        },
        {
            icon: Layers,
            title: "Organize",
            description: "All your works, neatly organized"
        },
        {
            icon: Users,
            title: "Community",
            description: "Share, connect and grow together"
        }
    ];

    return (
        <div className="w-full bg-white rounded-t-[40px] px-8 py-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] border-t border-purple-100/50 z-10 relative mt-16 md:mt-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div key={index} className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-violet-600" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-[#110E2C] font-bold text-sm mb-1">{feature.title}</h4>
                                <p className="text-[#6E6B85] text-xs font-medium leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeaturesBanner;
