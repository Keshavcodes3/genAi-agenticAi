/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const AuthInput = ({ label, type = "text", placeholder, value, onChange, name, required = true, icon: Icon }) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-[#110E2C] text-sm font-bold">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B88A5] group-focus-within:text-violet-600 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full bg-white border border-purple-100/60 rounded-xl ${Icon ? 'pl-10' : 'px-4'} py-3 text-[#110E2C] placeholder:text-[#8B88A5] placeholder:text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 shadow-sm`}
        />
      </div>
    </div>
  );
};

export default AuthInput;
