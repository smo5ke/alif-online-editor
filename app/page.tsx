"use client";

import React from 'react';
import { useEditorStore } from './store/useEditorStore';
import TopBar from './components/layout/TopBar';
import VisualEditor from './components/editors/VisualEditor';
import TextEditor from './components/editors/TextEditor';
import TerminalConsole from './components/terminal/TerminalConsole';
import EditorToolbar from './components/layout/EditorToolbar';
export default function Page() {
  const { activeMode, setMode, isTerminalHidden, setIsTerminalHidden } = useEditorStore();

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden text-slate-200" onContextMenu={e => e.preventDefault()}>
      <TopBar />

      <main className="flex-1 flex flex-col md:flex-row bg-[#0b1120] overflow-hidden transition-all duration-300 relative">
        
        {/* Editor Section */}
        <section className={`flex-1 flex flex-col border-b md:border-b-0 md:border-l border-slate-700/50 min-h-0 min-w-0
          ${isTerminalHidden ? 'w-full' : ''}`}
        >
          <EditorToolbar />

          <div className="flex-1 relative">
            <VisualEditor />
            <TextEditor />
          </div>
        </section>

        <TerminalConsole />
      </main>
    </div>
  );
}
