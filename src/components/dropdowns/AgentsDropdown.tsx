'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditorContext } from '@/contexts/EditorContext';
import { AGENT_PROFILES, AgentType } from '@/lib/agent-orchestrator';

export default function AgentsDropdown() {
  const { activeAgent, setActiveAgent } = useEditorContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentProfile = AGENT_PROFILES.find((p) => p.id === activeAgent);

  return (
    <div className="relative hidden min-[1000px]:block" data-dropdown-root="true" ref={dropdownRef}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-white/10 border border-slate-200/70 dark:border-white/10 rounded-lg hover:border-brand-400/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Select agent"
        id="agents-dropdown-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-500" aria-hidden="true">
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
        <span className="hidden sm:inline">{currentProfile?.icon} {currentProfile?.name || 'Agents'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-white dark:bg-zinc-800 border border-slate-200/70 dark:border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-200/70 dark:border-white/10">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Agents</p>
          </div>
          {AGENT_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => {
                setActiveAgent(profile.id as AgentType);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-white/10 flex items-start gap-3 transition-colors ${
                activeAgent === profile.id
                  ? 'bg-brand-600/10 text-brand-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-200'
              }`}
              id={`agent-${profile.id}`}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">{profile.icon}</span>
              <div>
                <div className="font-semibold">{profile.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{profile.description}</div>
              </div>
              {activeAgent === profile.id && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-auto flex-shrink-0 mt-1 text-brand-600 dark:text-blue-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
