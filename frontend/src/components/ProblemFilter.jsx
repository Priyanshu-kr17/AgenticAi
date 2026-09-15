import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Filter, Loader2, Compass, Layers, Zap } from 'lucide-react';

const DIFFICULTIES = [
  { label: 'Easy', value: 'Easy', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { label: 'Medium', value: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { label: 'Hard', value: 'Hard', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
];

const TOPICS = [
  'Array',
  'Binary Search',
  'Dynamic Programming',
  'Graphs',
  'Two Pointers',
  'Sliding Window',
  'Trees',
  'Stack / Queue',
  'Greedy',
  'Backtracking',
  'Bit Manipulation'
];

export default function ProblemFilter() {
  const {
    selectedDifficulty,
    setSelectedDifficulty,
    selectedTopic,
    setSelectedTopic,
    handleFindProblem,
    isRecommending,
  } = useApp();

  const handleSearch = (e) => {
    e.preventDefault();
    if (isRecommending) return;
    handleFindProblem(selectedDifficulty, selectedTopic);
  };

  return (
    <div className="glass-panel rounded-xl p-4 sm:p-5 border border-dark-750 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-dark-750">
        <div className="flex items-center gap-2 text-white font-semibold text-sm sm:text-base">
          <Compass className="w-4 h-4 text-brand-cyan" />
          <span>Problem Explorer & Recommender</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400 border border-dark-700">
          AI Curated
        </span>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Difficulty Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-cyan" /> Difficulty Level
            </label>
            <div className="relative">
              <select
                id="difficulty-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-dark-850 text-slate-100 text-sm rounded-lg px-3 py-2.5 border border-dark-700 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-all appearance-none cursor-pointer"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff.value} value={diff.value} className="bg-dark-900 text-slate-200">
                    {diff.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Topic Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-indigo" /> DSA Topic
            </label>
            <div className="relative">
              <select
                id="topic-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-dark-850 text-slate-100 text-sm rounded-lg px-3 py-2.5 border border-dark-700 focus:border-brand-indigo focus:outline-none focus:ring-1 focus:ring-brand-indigo transition-all appearance-none cursor-pointer"
              >
                {TOPICS.map((topic) => (
                  <option key={topic} value={topic} className="bg-dark-900 text-slate-200">
                    {topic}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Find Problem CTA Button */}
        <button
          id="find-problem-btn"
          type="submit"
          disabled={isRecommending}
          className="w-full relative group overflow-hidden rounded-lg p-[1px] font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-indigo group-hover:opacity-100 transition-opacity"></span>
          <span className="relative block w-full px-4 py-2.5 rounded-[7px] bg-dark-900 group-hover:bg-dark-850 text-slate-100 font-semibold flex items-center justify-center gap-2 transition-all">
            {isRecommending ? (
              <>
                <Loader2 className="w-4 h-4 text-brand-cyan animate-spin" />
                <span>Recommending Optimal Problem...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-brand-cyan group-hover:rotate-12 transition-transform" />
                <span>Find Problem</span>
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
