import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore, codeExamples } from '../../store/useEditorStore';
import { visualExamples } from '../../store/visualExamples';
import { FileText, Copy, Share2, Download, Save, RotateCcw, Maximize, ChevronDown, Code } from 'lucide-react';

export default function EditorToolbar() {
  const { activeMode, setMode, setTextCode, textCode, isTerminalHidden, setIsTerminalHidden, setNodes, setEdges } = useEditorStore();
  
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExamplesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const examplesList = [
    { id: 'hello', title: 'المثال 1: الطباعة' },
    { id: 'cond', title: 'المثال 2: الشروط' },
    { id: 'loop', title: 'المثال 3: التكرار' },
    { id: 'func', title: 'المثال 4: الدوال' },
    { id: 'oop', title: 'المثال 5: الكائنات' },
    { id: 'arrays', title: 'المثال 6: المصفوفات' },
    { id: 'dict', title: 'المثال 7: الفهارس' },
    { id: 'trycatch', title: 'المثال 8: الأخطاء' },
    { id: 'input', title: 'المثال 9: الإدخال' },
    { id: 'blank', title: 'مستند فارغ' },
  ];

  const handleSelectExample = (val: string) => {
    if (codeExamples[val]) {
      setTextCode(codeExamples[val]);
      
      if (visualExamples[val]) {
        // Populate visual editor if there's a visual example
        setNodes(visualExamples[val].nodes);
        setEdges(visualExamples[val].edges);
        // User stays in their current mode. Both modes are updated.
      } else {
        // Fallback to code mode for advanced examples
        if (activeMode !== 'code') {
          setMode('code');
          alert('هذا المثال المتقدم متوفر فقط في محرر الشيفرة حالياً.');
        }
      }
    }
    setIsExamplesOpen(false);
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
    <div className="relative z-50 bg-[#1e293b] border-b border-slate-700/50 w-full">
      <div className="py-2 px-2 sm:px-4 flex items-center justify-between w-full">
        {/* Right Side (Start) - Icons and Toggle */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Toggle Button */}
          <button
            onClick={() => setMode(activeMode === 'visual' ? 'code' : 'visual')}
            className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 font-bold bg-slate-800/50 hover:bg-slate-700/80 px-2.5 sm:px-3 py-1.5 rounded-lg border border-emerald-500/30 text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
          >
            <FileText size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {activeMode === 'visual' ? 'المحرر المرئي' : 'الشيفرة المصدرية'}
          </button>

          {/* Icon Group - Scrollable on Mobile to prevent dropdown clipping */}
          <div className="flex items-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1 sm:px-2 mr-1 sm:mr-2">
            <button onClick={handleCopy} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="نسخ">
              <Copy size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleShare} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="مشاركة">
              <Share2 size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleDownload} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="تنزيل">
              <Download size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleSave} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="حفظ">
              <Save size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleRestore} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="استعادة (تراجع)">
              <RotateCcw size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleFullscreen} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="ملء الشاشة">
              <Maximize size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
        
        {/* Left Side (End) - Examples Dropdown */}
        <div className="flex items-center shrink-0 pr-1 sm:pr-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsExamplesOpen(!isExamplesOpen)}
              className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-md text-slate-300 border border-slate-600/50 hover:border-emerald-500/50 hover:text-emerald-400 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm outline-none transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap max-w-[120px] sm:max-w-none"
              dir="rtl"
            >
              <ChevronDown size={14} className={`transition-transform duration-300 shrink-0 ${isExamplesOpen ? 'rotate-180' : ''}`} />
              <span className="font-semibold truncate">
                {examplesList.find(ex => codeExamples[ex.id] === textCode)?.title || 'الأمثلة البرمجية'}
              </span>
            </button>
            
            {/* Dropdown Menu */}
            {isExamplesOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 transform origin-top transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-slate-700/30 px-3 py-2 border-b border-slate-700/50">
                  <span className="text-xs font-bold text-slate-400">اختر مثالاً لتجربته:</span>
                </div>
                <div className="max-h-64 overflow-y-auto custom-menu-scroll py-1">
                  {examplesList.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => handleSelectExample(ex.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/80 hover:text-emerald-400 transition-colors border-b border-slate-700/30 last:border-0"
                      dir="rtl"
                    >
                      <span>{ex.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
