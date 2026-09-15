import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Sparkles, Eye, EyeOff, UserPlus, Loader2, CheckCircle2 } from 'lucide-react';
import { registerUser } from '../services/api';
import { useApp } from '../context/AppContext';

const FIELDS = [
  { name: 'name',     label: 'Full Name',        type: 'text',     placeholder: 'Priyanshu Kumar',   autoComplete: 'name' },
  { name: 'username', label: 'Username',          type: 'text',     placeholder: 'priyanshu17',       autoComplete: 'username' },
  { name: 'email',    label: 'Email Address',     type: 'email',    placeholder: 'you@example.com',   autoComplete: 'email' },
  { name: 'leetcode', label: 'LeetCode Username (optional)', type: 'text', placeholder: 'your-lc-handle', autoComplete: 'off' },
];

export default function Register() {
  const navigate = useNavigate();
  const { addToast } = useApp();

  const [form, setForm] = useState({ name: '', username: '', email: '', leetcode: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 3) return 'Full name must be at least 3 characters.';
    if (!form.username.trim() || form.username.trim().length < 8) return 'Username must be at least 8 characters.';
    if (form.username.trim().length > 20) return 'Username must be 20 characters or less.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'A valid email is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');

    const result = await registerUser({
      username: form.username,
      name: form.name,
      email: form.email,
      password: form.password,
      leetcode: form.leetcode,
    });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      addToast('Account created! Please sign in.', 'success', 4000);
      setTimeout(() => navigate('/login'), 1800);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-cyan/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-indigo/10 blur-[120px] pointer-events-none" />

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
            <p className="text-slate-400 text-sm mt-1">Create your free account to get started</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel-glow rounded-2xl p-8 shadow-2xl">
          {success ? (
            <div className="flex flex-col items-center py-6 gap-4 text-center">
              <CheckCircle2 className="w-14 h-14 text-green-400" />
              <p className="text-lg font-semibold text-white">Account Created!</p>
              <p className="text-slate-400 text-sm">Redirecting you to login…</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <UserPlus className="w-5 h-5 text-brand-cyan" />
                <h2 className="text-lg font-semibold text-white">Create Account</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {FIELDS.map(({ name, label, type, placeholder, autoComplete }) => (
                  <div key={name} className="space-y-1.5">
                    <label htmlFor={`reg-${name}`} className="block text-sm font-medium text-slate-300">
                      {label}
                    </label>
                    <input
                      id={`reg-${name}`}
                      name={name}
                      type={type}
                      autoComplete={autoComplete}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-750 text-slateate-100 placeholder-slate-500 text-sm
                        focus:outline-none focus:border-brand-cyan/60 focus:ring-1 focus:ring-brand-cyan/30 text-slate-100
                        transition-all duration-200"
                    />
                  </div>
                ))}

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-password" className="block text-sm font-medium text-slate-300">Password</label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="w-full px-4 py-2.5 pr-11 rounded-xl bg-dark-900 border border-dark-750 text-slate-100 placeholder-slate-500 text-sm
                        focus:outline-none focus:border-brand-cyan/60 focus:ring-1 focus:ring-brand-cyan/30
                        transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-cyan transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-300">Confirm Password</label>
                  <input
                    id="reg-confirm"
                    name="confirm"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-750 text-slate-100 placeholder-slate-500 text-sm
                      focus:outline-none focus:border-brand-cyan/60 focus:ring-1 focus:ring-brand-cyan/30
                      transition-all duration-200"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  id="register-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm mt-2
                    bg-gradient-to-r from-brand-indigo to-brand-cyan text-white
                    hover:opacity-90 active:scale-[0.98] transition-all duration-200
                    disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-cyan/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-6">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-brand-cyan font-medium hover:underline underline-offset-4 transition-colors"
                >
                  Sign in →
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" /> Powered by Gemini AI &amp; LeetCode API
        </p>
      </div>
    </div>
  );
}
