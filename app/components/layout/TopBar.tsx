import React from 'react';
import { useAlifCompiler } from '../../hooks/useAlifCompiler';

export default function TopBar() {
  const { runState, startRun } = useAlifCompiler();

  return (
    <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 p-3 sm:p-4 flex justify-between items-center shadow-lg z-10 shrink-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <img src="/AlifLogo.ico" alt="شعار ألف" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
        <h1 className="text-lg sm:text-2xl font-bold tracking-wide text-slate-100 pt-1">
          محرر <span className="text-blue-400">ألف 5.3</span>
        </h1>
      </div>
      <button
        onClick={startRun}
        disabled={runState === 'connecting' || runState === 'error'}
        className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl text-sm sm:text-base font-bold flex items-center gap-2 shadow-lg transition-all
          ${runState === 'running' ? 'bg-red-600 hover:bg-red-500 text-white' : 
            runState === 'ready' ? 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 text-white' : 
            'bg-slate-600 opacity-80 cursor-not-allowed'}`}
      >
        <span>{runState === 'running' ? 'إيقاف' : runState === 'connecting' ? 'جاري الاتصال...' : runState === 'error' ? 'انقطع الاتصال' : 'تشغيل'}</span>
      </button>
    </header>
  );
}
