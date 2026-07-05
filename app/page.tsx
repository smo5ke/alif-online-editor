"use client";

import React from 'react';
import { useEditorStore } from './store/useEditorStore';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import VisualEditor from './components/editors/VisualEditor';
import TextEditor from './components/editors/TextEditor';
import TerminalConsole from './components/terminal/TerminalConsole';
export default function Page() {
  const { activeMode, setMode, isTerminalHidden, setIsTerminalHidden } = useEditorStore();

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden text-slate-200" onContextMenu={e => e.preventDefault()}>
      <TopBar />

      <main className="flex-1 flex flex-col md:flex-row bg-[#0b1120] overflow-hidden transition-all duration-300 relative pb-16 md:pb-0">
        
        {/* Editor Section (Visible on Desktop always, or on Mobile if activeTab is visual/code) */}
        <section className={`flex-1 flex-col border-b md:border-b-0 md:border-l border-slate-700/50 min-h-0 min-w-0
          ${activeMode === 'terminal' ? 'hidden md:flex' : 'flex'}
          ${isTerminalHidden ? 'md:flex-none md:w-full' : ''}`}
        >
          {/* Top Bar for Editor Section */}
          <div className="bg-slate-800/50 py-2 px-2 sm:px-4 border-b border-slate-700/50 flex justify-between items-center z-10">
            {/* Desktop Toggle (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setMode(activeMode === 'visual' ? 'code' : 'visual')}
                className="flex items-center gap-2 text-emerald-400 font-bold bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-emerald-900/50 text-sm"
              >
                {activeMode === 'visual' ? 'المحرر المرئي' : 'الشيفرة المصدرية'}
              </button>
            </div>
            
            {/* Mobile Title */}
            <div className="md:hidden font-bold text-slate-300 text-sm px-2">
              {activeMode === 'visual' ? 'المحرر المرئي' : 'الشيفرة المصدرية'}
            </div>

            {/* Terminal Toggle (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setIsTerminalHidden(!isTerminalHidden)} className="text-blue-400 p-1.5 hover:bg-slate-700 rounded text-sm font-bold">
                 {isTerminalHidden ? 'إظهار الطرفية' : 'إخفاء الطرفية'}
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <VisualEditor />
            <TextEditor />
          </div>
        </section>

        <TerminalConsole />
        <BottomNav />
      </main>
    </div>
  );
}
