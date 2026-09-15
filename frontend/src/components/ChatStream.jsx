import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Code2,
  ChevronDown
} from 'lucide-react';

// Custom Markdown Code Block with Copy Button
function ChatCodeBlock({ node, inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeText = String(children).replace(/\n$/, '');

  if (inline) {
    return (
      <code className="bg-dark-800 text-brand-cyan px-1.5 py-0.5 rounded text-[12px] font-mono border border-dark-700" {...props}>
        {children}
      </code>
    );
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden border border-dark-700 bg-dark-950 font-mono text-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-dark-900 border-b border-dark-800 text-slate-400">
        <span className="text-[11px] font-mono uppercase tracking-wider text-brand-cyan">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors p-1 rounded"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-slate-100 font-mono text-xs leading-relaxed">
        <code>{codeText}</code>
      </pre>
    </div>
  );
}

export default function ChatStream() {
  const { messages, isChatting, handleSendMessage } = useApp();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom smoothly on new message or loading change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatting]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 code-scroll min-h-[300px]"
    >
      {/* Empty State */}
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-cyan/20 to-brand-indigo/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mb-4 shadow-lg shadow-brand-cyan/10">
            <Bot className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">
            DSA Mentor AI Space
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Select filters to find a problem or ask the mentor a question. Get line-by-line C++ code reviews, TLE diagnosis, and Big-O complexity breakdowns.
          </p>

          {/* Quick Question Chips */}
          <div className="w-full max-w-lg space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Popular Mentor Inquiries:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              <button
                onClick={() => handleSendMessage("Why am I getting Time Limit Exceeded (TLE) on large inputs?")}
                className="p-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-brand-cyan/40 text-xs text-slate-300 hover:text-white transition-all flex items-start gap-2 group"
              >
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium group-hover:text-brand-cyan transition-colors">
                    "Why am I getting TLE?"
                  </div>
                  <div className="text-[10px] text-slate-500">Analyze time limits & nested loops</div>
                </div>
              </button>

              <button
                onClick={() => handleSendMessage("Review my C++ code for logic bugs and edge cases.")}
                className="p-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-brand-cyan/40 text-xs text-slate-300 hover:text-white transition-all flex items-start gap-2 group"
              >
                <Code2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium group-hover:text-brand-cyan transition-colors">
                    "Review my C++ code"
                  </div>
                  <div className="text-[10px] text-slate-500">Detect bugs & verify correctness</div>
                </div>
              </button>

              <button
                onClick={() => handleSendMessage("What is the Time and Space Complexity of my solution?")}
                className="p-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-brand-cyan/40 text-xs text-slate-300 hover:text-white transition-all flex items-start gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-brand-indigo shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium group-hover:text-brand-indigo transition-colors">
                    "Check Time & Space Big-O"
                  </div>
                  <div className="text-[10px] text-slate-500">Evaluate theoretical complexity</div>
                </div>
              </button>

              <button
                onClick={() => handleSendMessage("Are there any upcoming competitive programming contests?")}
                className="p-2.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-dark-750 hover:border-brand-cyan/40 text-xs text-slate-300 hover:text-white transition-all flex items-start gap-2 group"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium group-hover:text-emerald-400 transition-colors">
                    "Upcoming CP Contests"
                  </div>
                  <div className="text-[10px] text-slate-500">LeetCode & Codeforces schedule</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message History */}
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md ${
                isUser
                  ? 'bg-gradient-to-tr from-brand-indigo to-brand-blue text-white'
                  : 'bg-dark-800 border border-brand-cyan/40 text-brand-cyan'
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble Container */}
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition-all shadow-md ${
                isUser
                  ? 'bg-brand-indigo/15 text-slate-100 border border-brand-indigo/30 rounded-tr-sm'
                  : 'bg-dark-900 text-slate-100 border border-dark-750 rounded-tl-sm'
              }`}
            >
              {/* Header inside bubble */}
              <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-dark-700/50 text-[11px] text-slate-400 font-mono">
                <span className="font-semibold text-slate-300">
                  {isUser ? 'You (Candidate)' : 'Gemini DSA Mentor'}
                </span>
                <span className="text-[10px] opacity-75">{msg.timestamp}</span>
              </div>

              {/* User Attached Code Preview Pill */}
              {isUser && msg.codeSnippet && (
                <div className="mb-2.5 p-2 rounded bg-dark-950/70 border border-dark-700 text-[11px] font-mono text-brand-cyan flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Attached C++ Solution ({msg.codeSnippet.split('\n').length} lines)</span>
                </div>
              )}

              {/* Message Content */}
              <div className="markdown-body text-slate-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ChatCodeBlock
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>

              {/* Footer source note */}
              {!isUser && msg.source && (
                <div className="mt-2 pt-1 border-t border-dark-800 text-[10px] font-mono text-slate-500 text-right">
                  {msg.source}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading Skeleton during AI response generation */}
      {isChatting && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-dark-800 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 animate-pulse" />
          </div>
          <div className="w-[75%] rounded-2xl rounded-tl-sm p-4 bg-dark-900 border border-dark-750 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-brand-cyan font-semibold">
                Mentor is analyzing algorithm...
              </span>
            </div>
            <div className="h-3.5 w-full rounded skeleton-shimmer" />
            <div className="h-3.5 w-4/5 rounded skeleton-shimmer" />
            <div className="h-16 w-full rounded skeleton-shimmer" />
            <div className="h-3.5 w-2/3 rounded skeleton-shimmer" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
