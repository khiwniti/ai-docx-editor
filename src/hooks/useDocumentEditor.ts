'use client';

import { useState, useCallback, useRef } from 'react';
import { useEditorContext } from '@/contexts/EditorContext';

export interface SuperDocInstance {
  export: (opts: { triggerDownload?: boolean; format?: string }) => Promise<Blob>;
}

export interface SuperDocRef {
  getInstance: () => SuperDocInstance | null;
}

export function useDocumentEditor() {
  const { currentDocument, setCurrentDocument, documentMode, setDocumentMode } = useEditorContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<SuperDocRef | null>(null);

  const importDocument = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        // Upload file to server
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload document');
        }

        const data = await response.json();

        setCurrentDocument({
          name: file.name,
          size: file.size,
          url: data.filePath,
          file,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import document');
      } finally {
        setIsLoading(false);
      }
    },
    [setCurrentDocument]
  );

  const exportDocument = useCallback(
    async (format: 'docx' | 'pdf' | 'html' = 'docx') => {
      const instance = editorRef.current?.getInstance();
      if (instance) {
        try {
          await instance.export({ triggerDownload: true, format });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to export');
        }
      }
    },
    []
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        importDocument(file);
      }
    },
    [importDocument]
  );

  return {
    currentDocument,
    documentMode,
    setDocumentMode,
    isLoading,
    error,
    editorRef,
    importDocument,
    exportDocument,
    handleFileSelect,
  };
}
