import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApp } from '../context/AppContext';
import { 
  ExternalLink, 
  Code2, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function ProblemCard() {
  const { currentProblem, isRecommending, handleLoadBoilerplate, handleFindProblem } = useApp();
  const [showHint, setShowHint] = useState(true);

  // Loading Skeleton
  if (isRecommending) {
    return (
      <div className="glass-panel rounded-xl p-5 border border-dark-750 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 rounded skeleton-shimmer" />
          <div className="h-5 w-20 rounded-full skeleton-shimmer" />
        </div>
        <div className="h-4 w-32 rounded skeleton-shimmer" />
        <div className="space-y-2 pt-2">
          <div className="h-3.5 w-full rounded skeleton-shimmer" />
          <div className="h-3.5 w-5/6 rounded skeleton-shimmer" />
          <div className="h-3.5 w-4/6 rounded skeleton-shimmer" />
        </div>
        <div className="h-20 w-full rounded-lg skeleton-shimmer mt-4" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 w-32 rounded-lg skeleton-shimmer" />
          <div className="h-9 w-32 rounded-lg skeleton-shimmer" />
        </div>
      </div>
    );
  }

  // Empty State
  if (!currentProblem) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-dark-750 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-3.5 text-brand-cyan">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-100 mb-1">
          No Problem Selected
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-5">
          Select a difficulty and DSA topic above, then click <strong className="text-brand-cyan">Find Problem</strong> to get an AI-recommended problem with concept hints.
        </p>

        {/* Quick Suggestion Chips */}
        <div className="w-full max-w-xs space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            Quick Starters:
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <button
              onClick={() => handleFindProblem('Easy', 'Array')}
              className="text-xs px-2.5 py-1 rounded-md bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-dark-700 transition-colors flex items-center gap-1"
            >
              <span>Two Sum</span> <span className="text-emerald-400 text-[10px]">• Easy</span>
            </button>
            <button
              onClick={() => handleFindProblem('Medium', 'Binary Search')}
              className="text-xs px-2.5 py-1 rounded-md bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-dark-700 transition-colors flex items-center gap-1"
            >
              <span>Rotated Array</span> <span className="text-amber-400 text-[10px]">• Med</span>
            </button>
            <button
              onClick={() => handleFindProblem('Medium', 'Graphs')}
              className="text-xs px-2.5 py-1 rounded-md bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-dark-700 transition-colors flex items-center gap-1"
            >
              <span>Course Schedule</span> <span className="text-amber-400 text-[10px]">• Med</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract direct link if present or default
  const leetcodeLinkMatch = currentProblem.markdown.match(/https:\/\/leetcode\.com\/problems\/[a-zA-Z0-9_-]+\/?/);
  const leetcodeUrl = currentProblem.metadata?.leetcodeUrl || (leetcodeLinkMatch ? leetcodeLinkMatch[0] : 'https://leetcode.com/problemset/all/');

  const diff = currentProblem.metadata?.difficulty || 'Medium';
  const getDiffBadgeColor = (d) => {
    switch (d?.toLowerCase()) {
      case 'easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'hard': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-dark-750 shadow-xl space-y-4 relative overflow-hidden transition-all">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-indigo" />

      {/* Header with Platform Badge & Difficulty */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Platform Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold tracking-wide">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .666-1.793L9.57 7.643l5.362-5.787a1.381 1.381 0 0 0-.003-1.955A1.37 1.37 0 0 0 13.483 0z" />
            </svg>
            LeetCode
          </span>

          {/* Difficulty Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getDiffBadgeColor(diff)}`}>
            {diff}
          </span>
        </div>

        {/* Source indicator */}
        <span className="text-[11px] text-slate-400 font-mono">
          {currentProblem.isMock ? 'Smart Mock' : 'Live Gemini'}
        </span>
      </div>

      {/* Rendered Markdown Body */}
      <div className="markdown-body text-slate-200 border-b border-dark-750 pb-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {currentProblem.markdown}
        </ReactMarkdown>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Direct Link to LeetCode */}
        <a
          href={leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-200 hover:text-white border border-dark-700 text-xs font-medium transition-all group"
        >
          <span>Open on LeetCode</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-cyan transition-colors" />
        </a>

        {/* Load Boilerplate button */}
        {currentProblem.boilerplate && (
          <button
            onClick={() => handleLoadBoilerplate(currentProblem.boilerplate)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 text-xs font-medium transition-all"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Load Solution in Editor</span>
          </button>
        )}
      </div>
    </div>
  );
}
