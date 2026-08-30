import React from 'react';

const PopularModes = ({ modes, activeMode, onSelect }) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
              activeMode === mode
                ? 'border-[#7B5EEA] bg-[#7B5EEA]/10 text-[#7B5EEA] shadow-sm'
                : 'border-purple-100/50 bg-white/50 text-[#6E6B85] hover:border-[#7B5EEA]/40 hover:bg-[#7B5EEA]/5 hover:text-[#110E2C]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularModes;
