import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let border = 'border-brand-cyan/30';
        let bg = 'bg-dark-900/95';
        let icon = <Info className="w-4 h-4 text-brand-cyan shrink-0" />;

        if (toast.type === 'error') {
          border = 'border-rose-500/30';
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
        } else if (toast.type === 'success') {
          border = 'border-emerald-500/30';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${border} ${bg} shadow-2xl backdrop-blur-md transition-all transform translate-y-0`}
          >
            <div className="mt-0.5">{icon}</div>
            <p className="text-xs text-slate-200 flex-1 leading-relaxed">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
