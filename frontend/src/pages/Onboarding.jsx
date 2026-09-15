import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Target, Briefcase, BarChart2, CheckCircle2, Loader2,
  Code2, ChevronRight, Trophy
} from 'lucide-react';
import { completeOnboarding } from '../services/api';
import { useApp } from '../context/AppContext';

const SKILLS_LIST = [
  'Arrays', 'Strings', 'Hash Maps', 'Two Pointers', 'Sliding Window',
  'Binary Search', 'Recursion', 'Backtracking', 'Dynamic Programming',
  'Graphs', 'BFS/DFS', 'Trees', 'Heaps', 'Greedy', 'Sorting',
];

const ROLES_LIST = [
  'Software Engineer', 'Backend Developer', 'Frontend Developer',
  'Full Stack Developer', 'Machine Learning Engineer', 'Data Scientist',
  'DevOps Engineer', 'Mobile Developer',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, setUser, addToast } = useApp();

  const [form, setForm] = useState({
    leetcode: '',
    skills: [],
    preferredRoles: [],
    experienceLevel: 'Beginner',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleArrayItem = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.leetcode.trim()) { setError('LeetCode username is required.'); return; }
    if (form.skills.length === 0) { setError('Please select at least one skill.'); return; }
    if (form.preferredRoles.length === 0) { setError('Please select at least one preferred role.'); return; }

    setLoading(true);
    setError('');

    const result = await completeOnboarding(form);
    setLoading(false);

    if (result.success) {
      setUser((prev) => ({ ...prev, onboarded: true }));
      addToast('Profile setup complete! Let\'s start coding 🚀', 'success', 4000);
      navigate('/');
    } else {
      setError(result.message || 'Could not save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-brand-indigo/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-brand-cyan/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            One-time Setup
          </div>
          <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
          <p className="text-slate-400 text-sm mt-2">
            Help us personalize your AI mentor experience
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="glass-panel-glow rounded-2xl p-7 shadow-2xl space-y-7">

            {/* LeetCode Handle */}
            <div className="space-y-2">
              <label htmlFor="ob-leetcode" className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Trophy className="w-4 h-4 text-brand-cyan" />
                LeetCode Username
              </label>
              <input
                id="ob-leetcode"
                name="leetcode"
                type="text"
                value={form.leetcode}
                onChange={(e) => { setForm((p) => ({ ...p, leetcode: e.target.value })); setError(''); }}
                placeholder="your-leetcode-handle"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-750 text-slate-100 placeholder-slate-500 text-sm
                  focus:outline-none focus:border-brand-cyan/60 focus:ring-1 focus:ring-brand-cyan/30 transition-all duration-200"
              />
              <p className="text-xs text-slate-500">We'll fetch your real stats to tailor recommendations.</p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Code2 className="w-4 h-4 text-brand-cyan" />
                DSA Skills you know
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILLS_LIST.map((skill) => {
                  const active = form.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleArrayItem('skills', skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                        active
                          ? 'bg-brand-cyan/20 border-brand-cyan/60 text-brand-cyan'
                          : 'bg-dark-900 border-dark-750 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {active && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Roles */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Briefcase className="w-4 h-4 text-brand-cyan" />
                Preferred Job Roles
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLES_LIST.map((role) => {
                  const active = form.preferredRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleArrayItem('preferredRoles', role)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                        active
                          ? 'bg-brand-indigo/20 border-brand-indigo/60 text-indigo-300'
                          : 'bg-dark-900 border-dark-750 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {active && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <BarChart2 className="w-4 h-4 text-brand-cyan" />
                Experience Level
              </label>
              <div className="flex gap-3">
                {LEVELS.map((level) => {
                  const active = form.experienceLevel === level;
                  const colors = {
                    Beginner: 'brand-cyan',
                    Intermediate: 'amber-400',
                    Advanced: 'rose-400',
                  };
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, experienceLevel: level }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                        active
                          ? level === 'Beginner'
                            ? 'bg-brand-cyan/15 border-brand-cyan/60 text-brand-cyan'
                            : level === 'Intermediate'
                            ? 'bg-amber-400/10 border-amber-400/50 text-amber-300'
                            : 'bg-rose-400/10 border-rose-400/50 text-rose-300'
                          : 'bg-dark-900 border-dark-750 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
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
              id="onboarding-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-brand-indigo to-brand-cyan text-white
                hover:opacity-90 active:scale-[0.98] transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-brand-cyan/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving profile…
                </>
              ) : (
                <>
                  Complete Setup
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6 flex items-center justify-center gap-1">
          <Target className="w-3 h-3" /> Your stats are fetched directly from LeetCode
        </p>
      </div>
    </div>
  );
}
