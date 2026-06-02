'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AgentType } from '@/lib/agent-orchestrator';

export type ThemeMode = 'light' | 'dark';
export type DocumentMode = 'editing' | 'viewing' | 'suggesting';

interface DocumentInfo {
  name: string;
  size: number;
  url?: string;
  file?: File;
}

interface EditorContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  documentMode: DocumentMode;
  setDocumentMode: (mode: DocumentMode) => void;
  currentDocument: DocumentInfo | null;
  setCurrentDocument: (doc: DocumentInfo | null) => void;
  activeAgent: AgentType;
  setActiveAgent: (agent: AgentType) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  toggleChat: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai-docx-theme');
      return (saved as ThemeMode) || 'dark';
    }
    return 'dark';
  });
  const [documentMode, setDocumentMode] = useState<DocumentMode>('editing');
  const [currentDocument, setCurrentDocument] = useState<DocumentInfo | null>(null);
  const [activeAgent, setActiveAgent] = useState<AgentType>('reviewer');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-docx-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        documentMode,
        setDocumentMode,
        currentDocument,
        setCurrentDocument,
        activeAgent,
        setActiveAgent,
        isChatOpen,
        setIsChatOpen,
        toggleChat,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
}
