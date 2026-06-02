'use client';

import { useState, useCallback } from 'react';
import { useEditorContext } from '@/contexts/EditorContext';
import { AgentType, AgentAction } from '@/lib/agent-orchestrator';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  actions?: AgentAction[];
  agentType?: AgentType;
}

export function useAIChat() {
  const { activeAgent } = useEditorContext();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'system-1',
      role: 'system',
      content: 'AI Document Agent ready. Select an agent and describe what you want to do with your document.',
      timestamp: Date.now(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const sendMessage = useCallback(
    async (instruction: string) => {
      if (!instruction.trim() || isProcessing) return;

      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: instruction,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsProcessing(true);

      try {
        const response = await fetch('/api/agent/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instruction,
            agentType: activeAgent,
          }),
        });

        const data = await response.json();

        const assistantMessage: ChatMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.message || 'Processing complete.',
          timestamp: Date.now(),
          actions: data.actions,
          agentType: data.agentType,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Failed to process instruction'}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    },
    [activeAgent, isProcessing]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'system',
        content: 'Chat cleared. AI Document Agent ready.',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  return {
    messages,
    isProcessing,
    inputValue,
    setInputValue,
    sendMessage,
    clearMessages,
  };
}
