import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Copy, 
  Check, 
  Trash2, 
  RotateCcw, 
  Code2, 
  FileCode, 
  ChevronDown, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';

const C_PLUS_PLUS_TEMPLATES = {
  'Two Pointers': `// Pattern: Two Pointers (C++20)
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxWater = 0;
        
        while (left < right) {
            int currentHeight = min(height[left], height[right]);
            int currentWidth = right - left;
            maxWater = max(maxWater, currentHeight * currentWidth);
            
            // Move pointer with smaller height
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxWater;
    }
};`,
  'Binary Search': `// Pattern: Binary Search (C++20)
#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int low = 0, high = nums.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2; // Prevents overflow
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1; // Not found
    }
};`,
  'Graph BFS / Kahn': `// Pattern: Graph BFS / Topological Sort (C++20)
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);
        
        for (auto& edge : prerequisites) {
            adj[edge[1]].push_back(edge[0]);
            inDegree[edge[0]]++;
        }
        
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) q.push(i);
        }
        
        vector<int> order;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            order.push_back(u);
            for (int v : adj[u]) {
                if (--inDegree[v] == 0) q.push(v);
            }
        }
        return order.size() == numCourses ? order : vector<int>();
    }
};`,
  'DP Memoization': `// Pattern: Dynamic Programming / Memoization (C++20)
#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

class Solution {
    int memo[301][10001];
    
    int solve(int idx, int remaining, vector<int>& coins) {
        if (remaining == 0) return 0;
        if (idx >= coins.size() || remaining < 0) return 1e9;
        if (memo[idx][remaining] != -1) return memo[idx][remaining];
        
        // Pick coin or skip
        int take = 1 + solve(idx, remaining - coins[idx], coins);
        int skip = solve(idx + 1, remaining, coins);
        
        return memo[idx][remaining] = min(take, skip);
    }
public:
    int coinChange(vector<int>& coins, int amount) {
        memset(memo, -1, sizeof(memo));
        int ans = solve(0, amount, coins);
        return ans >= 1e9 ? -1 : ans;
    }
};`
};

export default function CodeEditor() {
  const { code, setCode, addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Sync scrolling between textarea and line numbers gutter
  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  // Handle Tab key to insert 4 spaces
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const spaces = '    ';
      const newCode = code.substring(0, selectionStart) + spaces + code.substring(selectionEnd);
      setCode(newCode);

      // Move cursor after inserted spaces
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart + spaces.length;
          textareaRef.current.selectionEnd = selectionStart + spaces.length;
        }
      }, 0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      addToast("C++ code copied to clipboard!", "success", 2000);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Failed to copy code.", "error");
    }
  };

  const handleClear = () => {
    setCode("");
    addToast("Code cleared.", "info", 1500);
  };

  const lines = code.split('\n');
  const lineCount = lines.length;

  return (
    <div className={`glass-panel rounded-xl border border-dark-750 flex flex-col shadow-xl transition-all duration-300 ${
      isExpanded ? 'h-[580px]' : 'h-[360px] sm:h-[400px]'
    }`}>
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-dark-900/90 border-b border-dark-750 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="h-4 w-[1px] bg-dark-700 mx-1" />

          {/* Language Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-dark-800 text-brand-cyan border border-brand-cyan/20 text-xs font-mono font-medium">
            <Code2 className="w-3.5 h-3.5" />
            <span>solution.cpp</span>
            <span className="text-[10px] text-slate-400 bg-dark-900 px-1 rounded">C++20</span>
          </div>

          {/* Lines & Chars Counter */}
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
            {lineCount} lines • {code.length} chars
          </span>
        </div>

        {/* Action Controls & Preset Dropdown */}
        <div className="flex items-center gap-1.5">
          {/* Preset Selector */}
          <div className="relative">
            <select
              id="template-select"
              onChange={(e) => {
                const val = e.target.value;
                if (val && C_PLUS_PLUS_TEMPLATES[val]) {
                  setCode(C_PLUS_PLUS_TEMPLATES[val]);
                  addToast(`Loaded ${val} C++ template`, 'info', 2000);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-dark-850 hover:bg-dark-800 text-slate-300 text-xs rounded-md px-2.5 py-1 border border-dark-700 focus:outline-none focus:border-brand-cyan transition-colors cursor-pointer"
            >
              <option value="" disabled>Templates...</option>
              {Object.keys(C_PLUS_PLUS_TEMPLATES).map((tmpl) => (
                <option key={tmpl} value={tmpl} className="bg-dark-900 text-slate-200">
                  {tmpl}
                </option>
              ))}
            </select>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy Code"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-dark-800 border border-transparent hover:border-dark-700 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            title="Clear Code"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-dark-800 border border-transparent hover:border-dark-700 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Expand / Minimize height toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse Editor" : "Expand Editor"}
            className="p-1.5 rounded-md text-slate-400 hover:text-brand-cyan hover:bg-dark-800 border border-transparent hover:border-dark-700 transition-all"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body: Gutter + Textarea */}
      <div className="flex-1 relative flex overflow-hidden bg-dark-950 font-mono text-xs sm:text-sm">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="select-none py-3 px-2 sm:px-3 text-right text-slate-600 bg-dark-900/60 border-r border-dark-800 overflow-hidden min-w-[2.75rem] leading-[1.65rem]"
        >
          {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
            <div key={i + 1} className="font-mono text-[11px] sm:text-xs">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="cpp-code-editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="// Paste or write your C++ solution here..."
          className="flex-1 w-full h-full resize-none p-3 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs sm:text-sm leading-[1.65rem] code-scroll selection:bg-brand-cyan/20 selection:text-brand-cyan whitespace-pre"
        />
      </div>

      {/* Editor Footer Status */}
      <div className="px-4 py-1.5 bg-dark-900 border-t border-dark-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Tab Indent: 4 spaces</span>
        <span className="text-slate-400">Press Tab to indent without losing focus</span>
      </div>
    </div>
  );
}
