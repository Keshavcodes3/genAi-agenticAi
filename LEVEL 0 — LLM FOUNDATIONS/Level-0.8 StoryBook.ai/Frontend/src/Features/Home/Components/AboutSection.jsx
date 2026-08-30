import React from 'react';
import { motion } from 'framer-motion';
import { Feather, Sparkles, Wand2, PenTool, BrainCircuit } from 'lucide-react';

const AboutSection = () => {
    const services = [
        {
            icon: BrainCircuit,
            title: "Context-Aware Storytelling",
            desc: "Our AI understands your characters, plot arcs, and world-building rules, ensuring consistency from chapter one to the finale."
        },
        {
            icon: Sparkles,
            title: "Lyrical Poetry Generation",
            desc: "Explore meter, rhyme, and emotion. Whether you need a structured sonnet or emotional free verse, our engine crafts poetry that resonates."
        },
        {
            icon: Wand2,
            title: "The AI Muse Assistant",
            desc: "Stuck on a scene? Chat with your AI Muse to brainstorm ideas, overcome writer's block, and explore alternate directions."
        },
        {
            icon: PenTool,
            title: "Authorial Voice Matching",
            desc: "Dial in the exact mood, genre, and tone. Our engine adapts to match your unique writing style seamlessly."
        }
    ];

    return (
        <section id="about" className="py-28 bg-white border-y border-purple-100/60 relative overflow-hidden">
            {/* Decorative blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-300/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAFAFE] border border-purple-100 shadow-sm text-sm font-bold text-violet-600 mb-6"
                    >
                        <Feather className="w-4 h-4" /> About StoryBook.ai
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight"
                    >
                        We build tools for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                            the modern storyteller.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[#6E6B85] leading-relaxed max-w-2xl mx-auto"
                    >
                        StoryBook.ai is on a mission to democratize creativity. We believe everyone has a masterpiece inside them, and our AI is here to help you get it onto the page.
                    </motion.p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-3xl bg-[#FAFAFE] border border-purple-100/60 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <service.icon className="w-7 h-7 text-violet-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[#110E2C]">{service.title}</h3>
                            <p className="text-[#6E6B85] leading-relaxed">
                                {service.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
