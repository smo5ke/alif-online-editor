import React from 'react';
import { useEditorStore, codeExamples } from '../../store/useEditorStore';
import { FileText, Copy, Share2, Download, Save, RotateCcw, Maximize, ChevronDown } from 'lucide-react';

export default function EditorToolbar() {
  const { activeMode, setMode, setTextCode, textCode, isTerminalHidden, setIsTerminalHidden } = useEditorStore();

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (codeExamples[val]) {
      setTextCode(codeExamples[val]);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textCode);
      alert('تم نسخ الكود بنجاح!');
    } catch (err) {
      console.error('فشل النسخ:', err);
    }
  };

  const handleShare = async () => {
    try {
      const encoded = btoa(encodeURIComponent(textCode));
      const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
      await navigator.clipboard.writeText(url);
      alert('تم نسخ رابط المشاركة!');
    } catch (err) {
      console.error('فشل المشاركة:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([textCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.alif';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    localStorage.setItem('alif_saved_code', textCode);
    alert('تم حفظ الكود محلياً المتصفح!');
  };

  const handleRestore = () => {
    const saved = localStorage.getItem('alif_saved_code');
    if (saved) {
      setTextCode(saved);
      alert('تم استعادة آخر نسخة محفوظة!');
    } else {
      alert('لا توجد نسخة محفوظة سابقاً.');
    }
  };

  const handleFullscreen = () => {
    setIsTerminalHidden(!isTerminalHidden);
  };

  return (
    <div className="bg-[#1e293b] py-2 px-2 sm:px-4 flex justify-between items-center z-10 border-b border-slate-700/50">
      {/* Right Side (Start) - Icons and Toggle */}
      <div className="flex items-center gap-2">
        {/* Toggle Button */}
        <button
          onClick={() => setMode(activeMode === 'visual' ? 'code' : 'visual')}
          className="flex items-center gap-2 text-emerald-400 font-bold bg-slate-800/50 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-sm transition-colors"
        >
          <FileText size={16} />
          {activeMode === 'visual' ? 'المحرر المرئي' : 'الشيفرة المصدرية'}
        </button>

        {/* Separator */}
        <div className="w-[1px] h-6 bg-slate-600/50 mx-1 hidden sm:block"></div>

        {/* Icon Group */}
        <div className="hidden sm:flex items-center gap-1">
          <button onClick={handleCopy} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors" title="نسخ">
            <Copy size={16} />
          </button>
          <button onClick={handleShare} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors" title="مشاركة">
            <Share2 size={16} />
          </button>
          <button onClick={handleDownload} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors" title="تنزيل">
            <Download size={16} />
          </button>
          <button onClick={handleSave} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors" title="حفظ">
            <Save size={16} />
          </button>
          <button onClick={handleRestore} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors" title="استعادة (تراجع)">
            <RotateCcw size={16} />
          </button>
          <button onClick={handleFullscreen} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors" title="ملء الشاشة">
            <Maximize size={16} />
          </button>
        </div>
      </div>
      
      {/* Mobile Title (Hidden on Desktop) */}
      <div className="sm:hidden font-bold text-slate-300 text-sm px-2 flex-1 text-center">
        {activeMode === 'visual' ? 'المحرر المرئي' : 'الشيفرة المصدرية'}
      </div>

      {/* Left Side (End) - Examples Dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            onChange={handleExampleChange}
            className="appearance-none bg-slate-700/40 text-slate-300 border border-slate-600/50 rounded-md pl-8 pr-3 py-1.5 text-sm outline-none hover:bg-slate-700/60 transition-colors cursor-pointer min-w-[140px] text-right"
            dir="rtl"
          >
            <option value="hello">المثال 1: الطباعة</option>
            <option value="cond">المثال 2: الشروط</option>
            <option value="loop">المثال 3: التكرار</option>
            <option value="trycatch">المثال 4: الأخطاء</option>
            <option value="blank">مستند فارغ</option>
          </select>
          <ChevronDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
