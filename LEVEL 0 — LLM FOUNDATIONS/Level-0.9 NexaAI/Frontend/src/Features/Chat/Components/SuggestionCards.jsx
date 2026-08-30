import { Sparkles, Code2, FileText } from 'lucide-react';

const suggestions = [
  {
    id: 1,
    title: 'Brainstorm ideas',
    desc: 'Generate ideas and explore possibilities',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'Write code',
    desc: 'Build components, debug, and ship faster',
    icon: Code2,
  },
  {
    id: 3,
    title: 'Summarize',
    desc: 'Turn long content into quick insights',
    icon: FileText,
  },
];

const SuggestionCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto w-full mt-8 px-4">
      {suggestions.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="group p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900 text-sm mb-1">{card.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestionCards;
