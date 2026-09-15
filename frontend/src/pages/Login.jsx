import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Sparkles, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { loginUser } from '../services/api';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser, addToast } = useApp();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await loginUser(form);
    setLoading(false);

    if (result.success) {
      setUser({ username: form.username });
      addToast(`Welcome back, ${form.username}! 🎉`, 'success', 3000);
      navigate('/');
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-indigo/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-cyan/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-indigo via-brand-blue to-brand-cyan shadow-lg shadow-brand-cyan/25">
            <Terminal className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-cyan"></span>
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 justify-center">
              AlgoMentor <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-indigo">AI</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to continue your DSA journey</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel-glow rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <LogIn className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-lg font-semibold text-white">Welcome back</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="login-username" className="block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                placeholder="e.g. priyanshu17"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-750 text-slate-100 placeholder-slate-500 text-sm
                  focus:outline-none focus:border-brand-cyan/60 focus:ring-1 focus:ring-brand-cyan/30
                  transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-dark-900 border border-dark-750 text-slate-100 placeholder-slate-500 text-sm
                    focus:outline-none focus:border-brand-cyan/60 focus:ring-1 focus:ring-brand-cyan/30
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-cyan transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-brand-indigo to-brand-cyan text-white
                hover:opacity-90 active:scale-[0.98] transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-cyan/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-brand-cyan font-medium hover:underline underline-offset-4 transition-colors"
            >
              Create one →
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" /> Powered by Gemini AI &amp; LeetCode API
        </p>
      </div>
    </div>
  );
}
