import React from 'react';
import { motion } from 'framer-motion';

const ModeCard = ({ title, description, icon: Icon, colorClass, active, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full h-48 md:h-64 rounded-3xl p-5 flex flex-col items-center justify-center text-white text-center transition-all duration-300 shadow-md ${colorClass} ${active ? 'ring-4 ring-offset-4 ring-[#7B5EEA] shadow-xl shadow-[#7B5EEA]/30' : 'opacity-90 hover:opacity-100 hover:shadow-lg'}`}
    >
      <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-md">
        <Icon className="w-6 h-6 text-white drop-shadow-md" strokeWidth={2} />
      </div>
      <h3 className="text-xl font-bold mb-1.5 tracking-wide drop-shadow-sm">{title}</h3>
      <p className="text-sm text-white/90 max-w-[90%] leading-relaxed font-medium drop-shadow-sm">{description}</p>
    </motion.button>
  );
};

export default ModeCard;
