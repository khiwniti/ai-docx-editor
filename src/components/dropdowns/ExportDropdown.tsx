'use client';

import { useState, useRef, useEffect } from 'react';

interface ExportDropdownProps {
  onExport: (format: 'docx' | 'pdf' | 'html') => void;
  disabled?: boolean;
}

export default function ExportDropdown({ onExport, disabled }: ExportDropdownProps) {
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

  return (
    <div className="relative" data-dropdown-root="true" ref={dropdownRef}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-busy="false"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-white/10 border border-slate-200/70 dark:border-white/10 rounded-lg hover:border-brand-400/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Export"
        disabled={disabled}
        id="export-dropdown-btn"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 2h8l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
          <path d="M14 2v4h4" />
          <path d="M12 10v6" />
          <path d="M9 13l3 3 3-3" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-800 border border-slate-200/70 dark:border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
          <button
            onClick={() => { onExport('docx'); setIsOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-3 transition-colors"
            id="export-docx"
          >
            <span className="text-blue-500">📄</span> Export as DOCX
          </button>
          <button
            onClick={() => { onExport('pdf'); setIsOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-3 transition-colors"
            id="export-pdf"
          >
            <span className="text-red-500">📕</span> Export as PDF
          </button>
          <button
            onClick={() => { onExport('html'); setIsOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-3 transition-colors"
            id="export-html"
          >
            <span className="text-green-500">🌐</span> Export as HTML
          </button>
        </div>
      )}
    </div>
  );
}
