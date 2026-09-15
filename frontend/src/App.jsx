import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProblemFilter from './components/ProblemFilter';
import ProblemCard from './components/ProblemCard';
import CodeEditor from './components/CodeEditor';
import ChatStream from './components/ChatStream';
import ChatActionBar from './components/ChatActionBar';
import Toast from './components/Toast';
import { Compass, Code2, Bot } from 'lucide-react';

export default function App() {
  const [mobileTab, setMobileTab] = useState('split'); // 'split', 'problem', 'editor', 'chat'

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Responsive Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col">
        {/* Mobile Tab Switcher (Visible on screens < md) */}
        <div className="flex md:hidden items-center justify-around bg-dark-900 border border-dark-750 p-1 rounded-xl mb-4 text-xs font-medium">
          <button
            onClick={() => setMobileTab('problem')}
            className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'problem'
                ? 'bg-brand-cyan/20 text-brand-cyan font-semibold border border-brand-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Problem</span>
          </button>
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'editor'
                ? 'bg-brand-cyan/20 text-brand-cyan font-semibold border border-brand-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>C++ Editor</span>
          </button>
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex-1 py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'chat'
                ? 'bg-brand-cyan/20 text-brand-cyan font-semibold border border-brand-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Mentor</span>
          </button>
        </div>

        {/* 2-Column Responsive Layout (degrades cleanly to stacked on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 items-start">
          {/* Left Panel: Problem Explorer & Recommender */}
          <section
            id="left-panel-problem-explorer"
            className={`space-y-4 md:col-span-5 flex flex-col ${
              mobileTab !== 'problem' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <ProblemFilter />
            <ProblemCard />
          </section>

          {/* Right Panel: Interactive AI Chat & C++ Editor Space */}
          <section
            id="right-panel-workspace"
            className={`space-y-4 md:col-span-7 flex flex-col ${
              mobileTab === 'problem' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Interactive C++ Code Editor */}
            <div className={`${mobileTab === 'chat' ? 'hidden md:block' : 'block'}`}>
              <CodeEditor />
            </div>

            {/* AI Chat & Message Stream Space */}
            <div className={`glass-panel rounded-xl border border-dark-750 flex flex-col overflow-hidden shadow-xl ${
              mobileTab === 'editor' ? 'hidden md:flex' : 'flex'
            }`}>
              <div className="px-4 py-2.5 bg-dark-900 border-b border-dark-750 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Bot className="w-4 h-4 text-brand-cyan" />
                  <span>Interactive AI Chat Stream</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Gemini 3.6 Flash
                </span>
              </div>
              <ChatStream />
              <ChatActionBar />
            </div>
          </section>
        </div>
      </main>

      {/* Floating Toast Notification System */}
      <Toast />
    </div>
  );
}
