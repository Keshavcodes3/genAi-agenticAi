/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const AuthButton = ({ children, onClick, type = "submit", isLoading = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={isLoading}
      onClick={onClick}
      className="w-full transition-all duration-300 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold tracking-wide py-3.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(139,92,246,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AuthButton;
