import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { useAlifCompiler } from '../../hooks/useAlifCompiler';

export default function TerminalConsole() {
  const { activeMode, isTerminalHidden, terminalOutput, clearTerminal } = useEditorStore();
  const { sendInput } = useAlifCompiler();
  
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new output
  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleTerminalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = e.currentTarget.value;
      if (!val) return;
      sendInput(val);
      e.currentTarget.value = '';
    }
  };

  return (
    <section className={`flex-1 flex flex-col bg-black/40 shadow-inner min-h-0 min-w-0 transition-all duration-300
      ${isTerminalHidden ? 'hidden' : 'flex'}`}
    >
      <div className="bg-slate-800/50 text-slate-400 text-sm py-2 px-4 border-b border-slate-700/50 flex justify-between items-center shrink-0">
        <span>طرفية المخرجات</span>
        <button onClick={clearTerminal} className="text-slate-500 hover:text-slate-200 px-2 py-1 hover:bg-slate-700/50 rounded text-xs">مسح الشاشة</button>
      </div>
      
      <div ref={outputContainerRef} className="flex-1 p-4 overflow-y-auto w-full text-right pb-4">
        {terminalOutput.map((out, i) => (
          <span key={i} className={out.color} style={{ whiteSpace: 'pre-wrap' }}>{out.text}</span>
        ))}
      </div>

      <div className="bg-slate-900/80 backdrop-blur border-t border-slate-700/50 flex items-center px-4 py-3 shrink-0">
        <span className="text-green-500 font-bold ml-2">{'>>'}</span>
        <input
          ref={terminalInputRef}
          type="text"
          onKeyDown={handleTerminalInput}
          className="flex-1 bg-transparent text-white outline-none text-sm placeholder-slate-600"
          placeholder="اكتب إدخالك هنا واضغط Enter..."
        />
      </div>
    </section>
  );
}
