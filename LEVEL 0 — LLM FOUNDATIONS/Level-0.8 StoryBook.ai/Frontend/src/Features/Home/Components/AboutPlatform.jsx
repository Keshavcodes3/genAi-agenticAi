import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PenTool, BookOpen } from 'lucide-react';
import girlReadingImg from '../../../assets/images/girl_reading_purple.png';
import boyWritingImg from '../../../assets/images/boy_writing_purple.png';

const AboutPlatform = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-32">
        {/* Section 1: Story Generation */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-2">
              <img
                src={girlReadingImg}
                alt="Girl immersed in a magical story"
                className="w-full h-auto rounded-xl object-cover"
              />
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white/90">Immersive Stories</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Idea to Story
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Turn your fleeting thoughts into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">magical worlds</span>.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Don't let your brilliant ideas fade away. With our advanced AI, simply describe your vision, and watch as it transforms into a beautifully crafted narrative. Experience the magic of seeing your imagination come to life on the page, instantly.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Instant world-building and character development",
                "Adaptive writing styles tailored to your taste",
                "Rich, descriptive language that captivates"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Section 2: Poem Generation */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
              <PenTool className="w-4 h-4" />
              Poetic Expression
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Weave your emotions into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">timeless verses</span>.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Expressing yourself has never been more beautiful. Whether it's a sonnet, a haiku, or free verse, our platform helps you capture the essence of your feelings. Let floating words crystallize into profound poetry that resonates deeply.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Versatile poetic forms and structures",
                "Emotional depth and rhythmic perfection",
                "Seamless translation of abstract feelings into words"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-l from-purple-500/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-2">
              <img
                src={boyWritingImg}
                alt="Boy thoughtfully writing a poem"
                className="w-full h-auto rounded-xl object-cover"
              />
              <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white/90">Lyrical Poetry</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPlatform;