import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProblemRecommendation, sendChatMessage, checkBackendHealth } from '../services/api';

const AppContext = createContext(null);

const DEFAULT_STARTER_CODE = `// C++ Solution Space
#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>

using namespace std;

class Solution {
public:
    // Write your solution here
    void solve() {
        // Tip: Click "Find Problem" on the left to load recommendations and boilerplate
    }
};

int main() {
    Solution s;
    s.solve();
    return 0;
}`;

export function AppProvider({ children }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedTopic, setSelectedTopic] = useState('Array');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isRecommending, setIsRecommending] = useState(false);

  const [code, setCode] = useState(DEFAULT_STARTER_CODE);
  const [includeCode, setIncludeCode] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isChatting, setIsChatting] = useState(false);

  const [backendOnline, setBackendOnline] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Check backend connectivity on mount
  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((online) => {
      if (mounted) {
        setBackendOnline(online);
        if (!online) {
          addToast("Connected in Offline Smart Mock Mode. (Backend at port 1800 not detected)", "info", 5000);
        }
      }
    });
    return () => { mounted = false; };
  }, [addToast]);

  // Handler: Find problem
  const handleFindProblem = useCallback(async (difficulty = selectedDifficulty, topic = selectedTopic) => {
    setIsRecommending(true);
    try {
      const res = await fetchProblemRecommendation(difficulty, topic);
      if (res.success) {
        setCurrentProblem(res);
        if (res.isMock) {
          addToast(`Loaded curated ${difficulty} ${topic} problem (Offline Mock Mode)`, 'info', 3000);
        } else {
          addToast(`Live AI recommended problem loaded successfully!`, 'success', 3000);
        }
      } else {
        addToast("Could not retrieve recommendation. Please try again.", "error");
      }
    } catch (err) {
      addToast(`Error fetching problem: ${err.message}`, "error");
    } finally {
      setIsRecommending(false);
    }
  }, [selectedDifficulty, selectedTopic, addToast]);

  // Handler: Send Chat message
  const handleSendMessage = useCallback(async (userInput) => {
    if (!userInput || !userInput.trim()) return;

    const trimmedInput = userInput.trim();
    const currentCodeSnippet = includeCode ? code : '';

    const userMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: trimmedInput,
      codeSnippet: currentCodeSnippet,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsChatting(true);

    try {
      const res = await sendChatMessage(trimmedInput, currentCodeSnippet);
      const assistantMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        text: res.reply,
        isMock: res.isMock,
        source: res.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      addToast(`Failed to reach mentor: ${err.message}`, 'error');
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          role: 'assistant',
          text: `⚠️ **Error:** Backend unreachable at \`http://localhost:5000\`. Check that the backend server is running.`,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsChatting(false);
    }
  }, [code, includeCode, addToast]);

  // Handler: Load boilerplate into code editor
  const handleLoadBoilerplate = useCallback((boilerplateCode) => {
    if (boilerplateCode) {
      setCode(boilerplateCode);
      addToast("Loaded problem C++ starter boilerplate into editor!", "success", 2500);
    }
  }, [addToast]);

  // Reset Chat
  const handleResetChat = useCallback(() => {
    setMessages([]);
    addToast("Chat conversation cleared.", "info", 2000);
  }, [addToast]);

  // Reset Code
  const handleResetCode = useCallback(() => {
    setCode(DEFAULT_STARTER_CODE);
    addToast("Code editor reset to default template.", "info", 2000);
  }, [addToast]);

  const value = {
    selectedDifficulty,
    setSelectedDifficulty,
    selectedTopic,
    setSelectedTopic,
    currentProblem,
    setCurrentProblem,
    isRecommending,
    handleFindProblem,
    code,
    setCode,
    includeCode,
    setIncludeCode,
    messages,
    isChatting,
    handleSendMessage,
    handleLoadBoilerplate,
    handleResetChat,
    handleResetCode,
    backendOnline,
    setBackendOnline,
    toasts,
    addToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
