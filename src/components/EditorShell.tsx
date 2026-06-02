'use client';

import { useEditorContext } from '@/contexts/EditorContext';
import TopBar from './toolbar/TopBar';
import DocumentEditor from './DocumentEditor';
import AIChatPanel from './AIChatPanel';

export default function EditorShell() {
  const { isChatOpen } = useEditorContext();

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-dark-900 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${isChatOpen ? 'w-[calc(100%-380px)]' : 'w-full'}`}>
        <TopBar />
        <DocumentEditor />
      </div>
      <AIChatPanel />
    </div>
  );
}
