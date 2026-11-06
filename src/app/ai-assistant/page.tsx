'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/context/AppContext';
import { ChatMessage } from '@/types';
import { formatPaise } from '@/lib/financial';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Receipt,
  Lightbulb,
  Scale,
  Loader2,
  Trash2,
} from 'lucide-react';

export default function AIAssistantPage() {
  const { currentUser, groups, expenses, projects, settlements, getUserBalanceSummary } = useApp();

  const balanceSummary = getUserBalanceSummary();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello ${currentUser.fullName}! I am your unified financial & innovation intelligence assistant.
I have real-time visibility into your ${groups.length} expense groups (Net Balance: ${balanceSummary.netPaise > 0 ? '+' : ''}${formatPaise(balanceSummary.netPaise)}) and your innovation funding initiatives.

Ask me about who owes you money, how a bill was divided, or let's draft engineering project milestones!`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const promptSuggestions = [
    'Who owes me money across all groups?',
    'Summarize our Goa trip expenses',
    'How much did I spend out of pocket?',
    'Help me create a robotics project proposal',
    'Suggest a budget breakdown for an autonomous rover',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            userName: currentUser.fullName,
            groups: groups.map((g) => ({ id: g.id, name: g.name, totalSpent: g.totalSpentPaise })),
            recentExpenses: expenses.slice(0, 5).map((e) => ({
              title: e.title,
              amount: e.amountPaise,
              paidBy: e.paidByUserName,
            })),
            projects: projects.map((p) => ({
              title: p.title,
              raised: p.raisedAmountPaise,
              target: p.targetAmountPaise,
            })),
            netBalancePaise: balanceSummary.netPaise,
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.reply || 'I am processing your financial queries.',
        timestamp: 'Just now',
        mock: data.mock,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please try again.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">GroupFund AI Assistant</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  Gemini 2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Unified advisor for group expenses, split auditing, and innovation proposals
              </p>
            </div>
          </div>

          <button
            onClick={() => setMessages(messages.slice(0, 1))}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {promptSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-slate-300 text-xs whitespace-nowrap transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-3xl border border-slate-800 bg-slate-900/40">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {!isUser && msg.mock && (
                    <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
                      Demo data — no API key configured
                    </div>
                  )}
                  <div>{msg.content}</div>
                  <div
                    className={`text-[9px] mt-1.5 text-right ${
                      isUser ? 'text-blue-200' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Gemini is generating response...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about expenses, debts, or robotics proposals..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 pl-4 pr-12 py-3 rounded-2xl border border-slate-800 bg-slate-900 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
