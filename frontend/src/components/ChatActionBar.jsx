import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Code2, Loader2, Sparkles } from 'lucide-react';

export default function ChatActionBar() {
  const { code, includeCode, setIncludeCode, isChatting, handleSendMessage } = useApp();
  const [inputText, setInputText] = useState('');

  const lineCount = code.trim() ? code.trim().split('\n').length : 0;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isChatting) return;
    handleSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-dark-900 border-t border-dark-750">
      {/* Code Attachment Toggle Bar */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <input
            id="include-code-toggle"
            type="checkbox"
            checked={includeCode}
            onChange={(e) => setIncludeCode(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-8 h-4.5 bg-dark-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-brand-cyan relative"></div>
          <span className="text-xs font-medium text-slate-300 group-hover:text-slate-100 transition-colors flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Send Code with Message</span>
          </span>
        </label>

        {includeCode && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-dark-800 text-brand-cyan border border-brand-cyan/20 animate-fade-in">
            <span>{lineCount} C++ lines bundled</span>
          </span>
        )}
      </div>

      {/* Input Field & Send Action */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id="chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask mentor (e.g., 'Why am I getting TLE on testcase 42?', 'Explain optimal approach')..."
            className="w-full bg-dark-950 text-slate-100 placeholder-slate-500 text-xs sm:text-sm rounded-xl px-4 py-3 border border-dark-700 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
            disabled={isChatting}
          />
        </div>

        {/* Send Button */}
        <button
          id="send-message-btn"
          type="submit"
          disabled={!inputText.trim() || isChatting}
          className="relative group overflow-hidden rounded-xl p-[1px] font-medium text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-indigo group-hover:opacity-100 transition-opacity"></span>
          <span className="relative flex items-center gap-1.5 px-4 py-3 rounded-[11px] bg-dark-900 group-hover:bg-dark-850 text-slate-100 font-semibold transition-all">
            {isChatting ? (
              <Loader2 className="w-4 h-4 text-brand-cyan animate-spin" />
            ) : (
              <>
                <span>Send</span>
                <Send className="w-3.5 h-3.5 text-brand-cyan group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
