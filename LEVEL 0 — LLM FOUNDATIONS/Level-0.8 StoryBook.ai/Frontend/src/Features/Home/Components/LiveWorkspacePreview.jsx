/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Feather } from 'lucide-react';
import { poemLines } from './Text.jsx'; // Assuming this holds your poem lines array

const LiveWorkspacePreview = () => {
  const fullText = poemLines.join('\n');

  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 15);
      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, fullText]);

  return (
    /* Removed restrictive aspect ratios and added an automatic expand path via h-fit + min-h */
    <div className="relative w-full max-w-[500px] h-fit min-h-[520px] bg-[#0A0816]/90 border border-purple-900/30 rounded-2xl flex flex-col shadow-2xl shadow-purple-950/50 backdrop-blur-md overflow-hidden isolate transition-all duration-300">

      {/* Editor Header */}
      <div className="h-11 border-b border-purple-950/60 bg-[#0E0B22]/80 flex items-center px-4 gap-2 relative z-10 select-none w-full shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-900/40" />
          <div className="w-3 h-3 rounded-full bg-purple-900/40" />
          <div className="w-3 h-3 rounded-full bg-purple-900/40" />
        </div>
        <div className="mx-auto text-[11px] text-purple-300/40 font-mono flex items-center gap-2 tracking-wide">
          <Feather size={11} className="text-violet-400" />
          <span>workspace/the_echo.md</span>
        </div>
        <div className="absolute right-4 text-[10px] font-semibold text-purple-300/30 tracking-wider uppercase font-mono hidden sm:block">
          Live Draft
        </div>
      </div>

      {/* Editor Content Box - Swapped scroll rules for clear block adjustments */}
      <div className="p-6 flex-1 text-sm font-mono text-purple-200/90 z-10 relative h-auto">
        {/* Heading Layer */}
        <div className="text-white text-base font-sans font-medium mb-6 flex items-center gap-2.5 select-none">
          <Feather className="text-violet-400 w-4 h-4" />
          # The Silent Echo
        </div>

        {/* Text Block Frame */}
        <div className="font-serif text-[16px] leading-[1.85] max-w-xl block pl-3 border-l-2 border-purple-900/50 whitespace-pre-wrap text-violet-200/95 transform-none transition-none pb-4">
          {displayedText}
          <span className="inline-block w-2 h-4 bg-violet-400 ml-1 align-middle animate-pulse" />
        </div>

        {/* Ambient Deep Backlight Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-violet-900/5 blur-[80px] rounded-full pointer-events-none z-[-1]" />
      </div>
    </div>
  );
};

export default LiveWorkspacePreview;