'use client';

import { useRef } from 'react';
import { useEditorContext } from '@/contexts/EditorContext';
import { useDocumentEditor } from '@/hooks/useDocumentEditor';
import ExportDropdown from '../dropdowns/ExportDropdown';
import AgentsDropdown from '../dropdowns/AgentsDropdown';
import ThemeToggle from '../ThemeToggle';

export default function TopBar() {
  const { currentDocument, isChatOpen, toggleChat } = useEditorContext();
  const { handleFileSelect, exportDocument } = useDocumentEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4 border-b border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/5 px-5 py-3 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileSelect}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload w-4 h-4">
              <path d="M12 3v12" />
              <path d="m17 8-5-5-5 5" />
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            </svg>
            Import DOCX
          </button>
          <a
            href="https://github.com/superdoc-dev/superdoc/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center text-xs font-medium tracking-wide text-zinc-400 dark:text-zinc-500 no-underline hover:no-underline cursor-pointer"
          >
            v1.38.0
          </a>
        </div>

        {/* Right Side */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden min-[1000px]:block">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-white/10 border border-slate-200/70 dark:border-white/10 rounded-lg hover:border-brand-400/50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Share collaboration link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus w-4 h-4 text-blue-500">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          <AgentsDropdown />

          <button
            type="button"
            aria-pressed={isChatOpen}
            onClick={toggleChat}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-white/10 border-slate-200/70 dark:border-white/10 hover:border-brand-400/50"
            aria-label="Toggle AI chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-4 h-4 text-blue-500">
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              <path d="M20 2v4" />
              <path d="M22 4h-4" />
              <circle cx="4" cy="20" r="2" />
            </svg>
            <span className="hidden sm:inline">Chat</span>
          </button>

          <div className="relative hidden sm:block">
            <ThemeToggle />
          </div>

          <ExportDropdown onExport={exportDocument} disabled={!currentDocument} />
        </div>
      </div>
    </div>
  );
}
