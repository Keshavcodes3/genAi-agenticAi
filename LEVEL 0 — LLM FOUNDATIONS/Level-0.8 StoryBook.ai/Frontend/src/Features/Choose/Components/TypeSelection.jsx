import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Rocket } from 'lucide-react';
import ModeCard from './ModeCard';

const TypeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[1000px] mx-auto mb-10 flex flex-col items-center justify-center p-6 md:p-10 animate-fade-in min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-[2.75rem] font-extrabold text-[#110E2C] mb-4 tracking-tight leading-tight">
          What do you want to create?
        </h1>
        <p className="text-[#6E6B85] text-base md:text-lg font-medium max-w-xl mx-auto">
          Select your writing format to enter the creation studio and bring your next masterpiece to life.
        </p>
      </div>

      {/* Mode Select Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <ModeCard
          title="Story"
          description="Create engaging stories with AI assistance"
          icon={BookOpen}
          colorClass="bg-gradient-to-br from-[#8E70FA] to-[#6A4BE0]"
          onClick={() => navigate('/story')}
        />
        <ModeCard
          title="Poem"
          description="Express emotions in beautiful poetry"
          icon={Rocket}
          colorClass="bg-gradient-to-br from-[#D96B85] to-[#C3526E]"
          onClick={() => navigate('/poem')}
        />
      </div>
    </div>
  );
};

export default TypeSelection;
