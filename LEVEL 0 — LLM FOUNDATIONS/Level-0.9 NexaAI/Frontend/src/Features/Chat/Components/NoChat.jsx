import {
  Sparkles,
  Map,
  ArrowUpRight,
  Lightbulb,
} from "lucide-react";
import { getTimeOfDay } from "../Utils/Time";

const cards = [
  {
    title: "Ask Anything",
    desc: "Chat with NexaAI in real time to solve complex problems.",
    icon: Sparkles,
    color: "text-amber-500 bg-amber-50 border-amber-100",
    hoverBg: "hover:border-amber-200 hover:bg-amber-50/30",
    mode: "casual",
  },
  {
    title: "Explanation",
    desc: "Understand complex topics simply and clearly.",
    icon: Lightbulb,
    color: "text-blue-500 bg-blue-50 border-blue-100",
    hoverBg: "hover:border-blue-200 hover:bg-blue-50/30",
    mode: "explanation",
  },
  {
    title: "Roadmaps",
    desc: "Structured personalized learning paths.",
    icon: Map,
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
    hoverBg: "hover:border-emerald-200 hover:bg-emerald-50/30",
    mode: "roadmap",
  },
];

export default function NoChat({ onModeSelect }) {
  const greeting = getTimeOfDay();

  return (
    <div className="flex h-full w-full flex-col bg-slate-50/50">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              Good {greeting}
            </h1>

            <p className="mx-auto max-w-md text-base text-slate-500 sm:text-lg">
              What would you like to explore with{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text font-semibold text-transparent">
                NexaAI
              </span>
              ?
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cards.map((card, i) => {
              const Icon = card.icon;

              return (
                <button
                  key={i}
                  onClick={() => onModeSelect?.(card.mode)}
                  className={`group relative flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.hoverBg}`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${card.color}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="mt-5 flex flex-1 flex-col">
                    <h3 className="text-base font-semibold text-slate-800">
                      {card.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {card.desc}
                    </p>
                  </div>

                  <div className="absolute right-4 top-4 opacity-0 transition group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
