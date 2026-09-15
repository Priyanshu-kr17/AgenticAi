import React from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Terminal, RefreshCw, Trash2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export default function Navbar() {
  const { backendOnline, setBackendOnline, handleResetChat, handleResetCode, addToast } = useApp();

  const handlePingBackend = async () => {
    addToast("Checking backend connectivity at http://localhost:5000...", "info", 2000);
    const online = await checkBackendHealth();
    setBackendOnline(online);
    if (online) {
      addToast("Successfully connected to live backend!", "success");
    } else {
      addToast("Backend still offline. Operating in Smart Mock Mode.", "info");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-750 bg-dark-900/90 backdrop-blur-md px-4 lg:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-blue to-brand-cyan shadow-lg shadow-brand-cyan/20">
            <Terminal className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cyan"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                AlgoMentor <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-indigo">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                <Sparkles className="w-3 h-3" /> DSA Mentor
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive C++ Editor, Code Reviews & LeetCode Problem Recommender
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Controls */}
        
      </div>
    </header>
  );
}
