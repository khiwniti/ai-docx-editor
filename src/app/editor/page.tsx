'use client';

import { EditorProvider } from '@/contexts/EditorContext';
import EditorShell from '@/components/EditorShell';

export default function EditorPage() {
  return (
    <EditorProvider>
      <EditorShell />
    </EditorProvider>
  );
}
