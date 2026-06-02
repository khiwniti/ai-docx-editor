'use client';

import { SuperDocEditor } from '@superdoc-dev/react';
import { useDocumentEditor } from '@/hooks/useDocumentEditor';

import { EditorToolbar } from '@/components/toolbar/EditorToolbar';

export default function DocumentEditor() {
  const { currentDocument, documentMode, editorRef } = useDocumentEditor();

  if (!currentDocument) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 dark:bg-[#141422] text-zinc-400">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-zinc-200/50 dark:bg-zinc-800/50 flex items-center justify-center shadow-inner">
          <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">Open or upload a document to begin</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden border border-zinc-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-[#1e1e2e] shadow-xl shadow-brand-900/5 mt-4 ml-4">
      <EditorToolbar />
      <div className="flex-1 relative">
        <div id="superdoc-demo-main-editor" className="flex-1 relative transition-colors duration-200 h-full overflow-y-auto p-4 md:p-8 flex justify-center">
          {currentDocument ? (
            <div className="w-full max-w-[850px] bg-white dark:bg-zinc-900 shadow-md ring-1 ring-black/5 dark:ring-white/10 min-h-[1100px] p-10 md:p-16 shrink-0 mb-32">
              <SuperDocEditor 
                // @ts-expect-error - Mismatch between mock and fake package types
                ref={editorRef}
                fileUrl={currentDocument.url}
                mode={documentMode}
                hideToolbar={true}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">No document open</p>
              <p className="text-sm mt-2 max-w-sm text-center">Import a DOCX file from the top right menu to start editing with AI.</p>
            </div>
          )}
        </div>

        {/* Floating AI Prompt */}
        {currentDocument && (
          <div className="flex justify-center w-full mt-4 absolute bottom-[35px] pr-[36px]" style={{ height: '46px', marginBottom: '0px' }}>
            <div className="flex flex-col items-center mx-auto z-20 w-full min-w-[510px] max-w-[510px] px-4 pointer-events-none max-[800px]:hidden">
              <form className="pointer-events-auto flex items-center gap-2 p-[1px] w-full rounded-full bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 shadow-md shadow-slate-300/40 dark:shadow-black/30 hover:ring-1 hover:ring-purple-600/70 active:ring-1 active:ring-purple-700/90 transition-all">
                <div className="flex flex-1 items-center gap-2 bg-white dark:bg-[#1e1e2e] rounded-full py-1.5 pl-4 pr-1.5">
                  <button type="button" className="flex-shrink-0 p-0 border-0 bg-transparent cursor-pointer text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 focus:outline-none" aria-label="Focus AI prompt">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-4 h-4" aria-hidden="true">
                      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle>
                    </svg>
                  </button>
                  <input spellCheck="false" autoCorrect="off" autoCapitalize="off" placeholder="What can I change?" className="flex-1 min-w-0 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none" type="text" defaultValue="" />
                  <div className="relative flex-shrink-0">
                    <button type="button" className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 rounded transition-colors" aria-label="Select AI model" aria-expanded="false" aria-haspopup="listbox">
                      <span className="max-w-[100px] truncate">GPT-5.5</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-3 h-3 transition-transform" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
                    </button>
                  </div>
                  <button type="submit" disabled className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all" aria-label="Submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up w-4 h-4" aria-hidden="true"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
