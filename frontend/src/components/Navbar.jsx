import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Terminal, Sparkles, LogOut, LogIn, UserPlus, User } from 'lucide-react';

export default function Navbar() {
  const { user, handleLogout } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-750 bg-dark-900/90 backdrop-blur-md px-4 lg:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3">
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
              Interactive C++ Editor, Code Reviews &amp; LeetCode Problem Recommender
            </p>
          </div>
        </Link>

        {/* Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* User badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-800 border border-dark-750 text-sm text-slate-200">
                <User className="w-3.5 h-3.5 text-brand-cyan" />
                <span className="font-medium">{user.username}</span>
              </div>
              {/* Logout */}
              <button
                id="navbar-logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-300
                  bg-dark-800 border border-dark-750 hover:border-red-500/40 hover:text-red-400
                  transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                id="navbar-login-link"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-300
                  bg-dark-800 border border-dark-750 hover:border-brand-cyan/40 hover:text-brand-cyan
                  transition-all duration-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
              <Link
                to="/register"
                id="navbar-register-link"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white
                  bg-gradient-to-r from-brand-indigo to-brand-cyan
                  hover:opacity-90 transition-all duration-200 shadow-md shadow-brand-cyan/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
