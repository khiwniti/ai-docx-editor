'use client';

import { useEffect, useRef } from 'react';
import { useEditorContext } from '@/contexts/EditorContext';
import { useAIChat } from '@/hooks/useAIChat';
import { AGENT_PROFILES } from '@/lib/agent-orchestrator';

export default function AIChatPanel() {
  const { isChatOpen } = useEditorContext();
  const { messages, isProcessing, inputValue, setInputValue, sendMessage } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing]);

  if (!isChatOpen) return null;

  return (
    <aside className="w-[380px] h-full flex flex-col bg-white dark:bg-[#1a1a24] border-l border-slate-200 dark:border-white/5 absolute right-0 top-0 shadow-[-8px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[-8px_0_24px_rgba(0,0,0,0.3)] chat-panel-enter z-30 transition-colors duration-200">
      {/* Chat Header */}
      <div className="h-16 px-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between glass-surface sticky top-0 z-10 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-brand-600 dark:text-brand-400">
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">AI Agent Chat</h2>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-green-500"></span>
              </span>
              Connected to MCP
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-transparent">
        {messages.map((msg) => {
          const profile = msg.agentType ? AGENT_PROFILES.find(p => p.id === msg.agentType) : null;
          
          return (
            <div key={msg.id} className={`flex gap-3 chat-message-enter ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' 
                  : msg.role === 'system'
                    ? 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                    : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'
                }`}
              >
                {msg.role === 'user' ? 'U' : msg.role === 'system' ? '⚙️' : profile?.icon || '🤖'}
              </div>
              
              <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role !== 'user' && profile && (
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{profile.name}</span>
                )}
                
                <div className={`text-[13px] px-4 py-3 rounded-2xl leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-[#252533] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 rounded-tl-sm'
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>

                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.actions.map((action, i) => (
                      <div key={i} className="mcp-tool-badge" title={action.description}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                          <polyline points="4 17 10 11 4 5" />
                          <line x1="12" y1="19" x2="20" y2="19" />
                        </svg>
                        {action.tool}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex gap-3 chat-message-enter">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm">
              🤖
            </div>
            <div className="bg-white dark:bg-[#252533] border border-slate-200 dark:border-white/5 px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-brand-500 rounded-full typing-dot"></div>
              <div className="w-1.5 h-1.5 bg-brand-500 rounded-full typing-dot"></div>
              <div className="w-1.5 h-1.5 bg-brand-500 rounded-full typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#1a1a24] transition-colors duration-200">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
          className="relative"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="E.g., Format the headings and fix typos..."
            disabled={isProcessing}
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="absolute right-2 top-2 p-1.5 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-medium tracking-wide">
          Powered by <span className="text-slate-600 dark:text-slate-400">@superdoc-dev/mcp</span>
        </p>
      </div>
    </aside>
  );
}
