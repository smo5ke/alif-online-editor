import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';

export default function BottomNav() {
  const { activeMode, setMode } = useEditorStore();

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-slate-800 border-t border-slate-700 flex justify-around items-center z-40 pb-safe">
      <button
        onClick={() => setMode('visual')}
        className={`flex-1 py-3 flex flex-col items-center gap-1 ${activeMode === 'visual' ? 'text-blue-400 bg-slate-700/30' : 'text-slate-400'}`}
      >
        <div className="text-xl">🎨</div>
        <span className="text-[10px] font-bold">المرئي</span>
      </button>
      <button
        onClick={() => setMode('code')}
        className={`flex-1 py-3 flex flex-col items-center gap-1 ${activeMode === 'code' ? 'text-blue-400 bg-slate-700/30' : 'text-slate-400'}`}
      >
        <div className="text-xl">💻</div>
        <span className="text-[10px] font-bold">الشيفرة</span>
      </button>
      <button
        onClick={() => setMode('terminal')}
        className={`flex-1 py-3 flex flex-col items-center gap-1 ${activeMode === 'terminal' ? 'text-blue-400 bg-slate-700/30' : 'text-slate-400'}`}
      >
        <div className="text-xl">🖥️</div>
        <span className="text-[10px] font-bold">الطرفية</span>
      </button>
    </nav>
  );
}
