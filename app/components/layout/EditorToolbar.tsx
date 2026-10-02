import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore, codeExamples } from '../../store/useEditorStore';
import { visualExamples } from '../../store/visualExamples';
import { generateRunnableCode } from '../../lib/runnableGraph';
import { buildShareUrl, parseSharedCode } from '../../lib/shareCode';
import { sanitizeProject, parseProjectFile } from '../../lib/projectFile';
import { FileText, Copy, Share2, Download, Save, RotateCcw, Maximize, ChevronDown, Code, Undo2, Redo2, BookOpen, Keyboard, FilePlus2, FolderOpen } from 'lucide-react';
import CheatsheetModal from '../modals/CheatsheetModal';

const SHORTCUTS: Array<[string, string]> = [
  ['Ctrl + Enter', 'تشغيل البرنامج'],
  ['Ctrl + Z', 'تراجع (المحرر المرئي)'],
  ['Ctrl + Shift + Z / Ctrl + Y', 'إعادة (المحرر المرئي)'],
  ['Delete / Backspace', 'حذف العقد والخطوط المحددة'],
  ['Tab / Shift + Tab', 'مسافة بادئة / إزاحتها (محرر الشيفرة)'],
];

function getActiveCode(): string {
  const state = useEditorStore.getState();
  if (state.activeMode === 'visual') {
    return generateRunnableCode();
  }
  return state.textCode.replace(/\u00A0/g, " ");
}

export default function EditorToolbar() {
  const { activeMode, setMode, setTextCode, currentProjectId, customPages, isTerminalHidden, setIsTerminalHidden, setNodes, setEdges, undo, redo, past, future } = useEditorStore();
  const customPageIds = Object.keys(customPages);
  
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const [isCheatsheetOpen, setIsCheatsheetOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside + load shared ?code= links
  // + hydrate user pages + flush pages before unload
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExamplesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    useEditorStore.getState().hydrateCustomPages();

    const flushPages = () => useEditorStore.getState().persistCustomPages();
    window.addEventListener('beforeunload', flushPages);

    try {
      const decoded = parseSharedCode(window.location.search);
      if (decoded) {
        useEditorStore.getState().setTextCode(decoded);
        useEditorStore.getState().setMode('code');
        // Clean the URL so switching examples doesn't reload shared code
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    } catch (e) {
      console.error('فشل تحميل الرابط المشترك:', e);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('beforeunload', flushPages);
    };
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
    { id: 'while', title: 'المثال 10: بينما' },
    { id: 'logic', title: 'المثال 11: المنطق' },
    { id: 'strings', title: 'المثال 12: النصوص' },
    { id: 'advarr', title: 'المثال 13: مصفوفات متقدمة' },
    { id: 'advdict', title: 'المثال 14: فهارس متقدمة' },
    { id: 'timemath', title: 'المثال 15: الوقت والرياضيات' },
    { id: 'random', title: 'المثال 16: العشوائي' },
    { id: 'foreach', title: 'المثال 17: لكل في مصفوفة' },
    { id: 'multiarg', title: 'المثال 18: دوال متعددة' },
    { id: 'macro', title: 'المثال 19: الكتل' },
    { id: 'guess', title: 'المثال 20: التخمين' },
    { id: 'calc', title: 'المثال 21: الآلة الحاسبة' },
    { id: 'files', title: 'المثال 22: الملفات' },
    { id: 'sets', title: 'المثال 23: المميزة' },
    { id: 'lambda', title: 'المثال 24: الخطية' },
    { id: 'custom', title: 'المثال 25: الشيفرة المخصصة' },
    { id: 'blank', title: 'مستند فارغ' },
  ];

  const currentTitle =
    customPages[currentProjectId ?? '']?.title ||
    examplesList.find(ex => ex.id === currentProjectId)?.title ||
    'الأمثلة البرمجية';

  const handleSelectPage = (id: string) => {
    // loadProject restores the cached state when present, else starts blank
    useEditorStore.getState().loadProject(id, '', [], [], {});
    setIsExamplesOpen(false);
  };

  const handleSelectExample = (val: string) => {
    if (codeExamples[val] !== undefined) {
      const code = codeExamples[val];
      const vNodes = visualExamples[val] ? visualExamples[val].nodes : [];
      const vEdges = visualExamples[val] ? visualExamples[val].edges : [];
      const vMacros = visualExamples[val]?.macros;
      useEditorStore.getState().loadProject(val, code, vNodes, vEdges, vMacros);
      if (!visualExamples[val] && val !== 'blank') {
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
      await navigator.clipboard.writeText(getActiveCode());
      alert('تم نسخ الكود بنجاح!');
    } catch (err) {
      console.error('فشل النسخ:', err);
    }
  };

  const handleShare = async () => {
    try {
      const url = buildShareUrl(window.location.origin, window.location.pathname, getActiveCode());
      await navigator.clipboard.writeText(url);
      alert('تم نسخ رابط المشاركة!');
    } catch (err) {
      console.error('فشل المشاركة:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([getActiveCode()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.alif';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportProject = () => {
    try {
      const state = useEditorStore.getState();
      const title =
        state.customPages[state.currentProjectId ?? '']?.title ||
        examplesList.find((ex) => ex.id === state.currentProjectId)?.title ||
        'مشروع ألف';
      // The file always stores the MAIN graph in nodes/edges plus the full
      // macro storage, so it reloads identically regardless of viewed graph.
      const mergedMacros = { ...state.macros };
      let mainNodes = state.nodes;
      let mainEdges = state.edges;
      if (state.currentGraphId !== 'main') {
        mainNodes = state.mainGraph.nodes;
        mainEdges = state.mainGraph.edges;
        if (mergedMacros[state.currentGraphId]) {
          mergedMacros[state.currentGraphId] = {
            ...mergedMacros[state.currentGraphId],
            nodes: state.nodes,
            edges: state.edges,
          };
        }
      }
      const file = sanitizeProject(title, {
        textCode: state.textCode,
        nodes: mainNodes,
        edges: mainEdges,
        mainGraph: { nodes: mainNodes, edges: mainEdges },
        macros: mergedMacros,
        currentGraphId: state.currentGraphId,
      });
      const blob = new Blob([JSON.stringify(file)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'project.alif.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('فشل التصدير:', err);
      alert('فشل تصدير المشروع.');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseProjectFile(JSON.parse(text));
      if (!parsed) {
        alert('ملف المشروع غير صالح.');
        return;
      }
      useEditorStore.getState().loadProjectState(`custom_${Date.now()}`, parsed.title, parsed.state);
      setIsExamplesOpen(false);
      alert(`تم فتح المشروع "${parsed.title}" كصفحة جديدة!`);
    } catch (err) {
      console.error('فشل الاستيراد:', err);
      alert('فشل فتح الملف.');
    }
  };

  const handleCreatePage = () => {
    const title = prompt('اسم الصفحة الجديدة:');
    if (!title || !title.trim()) return;
    useEditorStore.getState().createCustomPage(title);
    setIsExamplesOpen(false);
  };

  const handleSave = () => {
    const state = useEditorStore.getState();
    if (state.activeMode === 'visual') {
      localStorage.setItem('alif_saved_visual', JSON.stringify({
        nodes: state.nodes,
        edges: state.edges,
        mainGraph: state.mainGraph,
        macros: state.macros,
        currentGraphId: state.currentGraphId,
      }));
    } else {
      localStorage.setItem('alif_saved_code', state.textCode);
    }
    alert('تم حفظ الكود محلياً المتصفح!');
  };

  const handleRestore = () => {
    const state = useEditorStore.getState();
    if (state.activeMode === 'visual') {
      const saved = localStorage.getItem('alif_saved_visual');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          state.setNodes(parsed.nodes || []);
          state.setEdges(parsed.edges || []);
          useEditorStore.setState({
            mainGraph: parsed.mainGraph || { nodes: [], edges: [] },
            macros: parsed.macros || {},
            currentGraphId: parsed.currentGraphId || 'main',
          });
          alert('تم استعادة آخر نسخة محفوظة!');
        } catch {
          alert('نسخة الحفظ المرئي تالفة.');
        }
      } else {
        alert('لا توجد نسخة مرئية محفوظة سابقاً.');
      }
    } else {
      const saved = localStorage.getItem('alif_saved_code');
      if (saved) {
        setTextCode(saved);
        alert('تم استعادة آخر نسخة محفوظة!');
      } else {
        alert('لا توجد نسخة محفوظة سابقاً.');
      }
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
            <button onClick={handleSave} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="حفظ سريع">
              <Save size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button onClick={handleRestore} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="استعادة آخر حفظ سريع">
              <RotateCcw size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>

            <div className="w-px h-4 bg-slate-600/50 mx-1 sm:mx-2 self-center" />

            {/* Cheatsheet Modal */}
            <button 
              onClick={() => setIsCheatsheetOpen(true)} 
              className="text-purple-400 hover:text-purple-300 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0 flex items-center gap-1 font-medium text-xs" 
              title="دليل لغة ألف (المرجع السريع للأوامر)"
            >
              <BookOpen size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline">دليل ألف</span>
            </button>

            {activeMode === 'visual' && (
              <>
                <div className="w-px h-4 bg-slate-600/50 mx-1 sm:mx-2 self-center" />
                <button 
                  onClick={undo} 
                  disabled={past.length === 0}
                  className={`p-1.5 rounded-md transition-colors shrink-0 ${past.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`} 
                  title="تراجع (Ctrl+Z)"
                >
                  <Undo2 size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>
                <button 
                  onClick={redo} 
                  disabled={future.length === 0}
                  className={`p-1.5 rounded-md transition-colors shrink-0 ${future.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`} 
                  title="إعادة (Ctrl+Y)"
                >
                  <Redo2 size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
                </button>
              </>
            )}

            <div className="w-px h-4 bg-slate-600/50 mx-1 sm:mx-2 self-center" />
            <button onClick={handleFullscreen} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="ملء الشاشة">
              <Maximize size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <button onClick={() => setIsShortcutsOpen(true)} className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1.5 rounded-md transition-colors shrink-0" title="اختصارات لوحة المفاتيح">
              <Keyboard size={16} className="w-4 h-4 sm:w-4 sm:h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => {
                handleImportFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
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
                {currentTitle}
              </span>
            </button>
            
            {/* Dropdown Menu */}
            {isExamplesOpen && (
              <div className="absolute top-full left-0 mt-2 w-60 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 transform origin-top transition-all animate-in fade-in slide-in-from-top-2 duration-200">
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
                <div className="bg-slate-700/30 px-3 py-2 border-y border-slate-700/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">صفحاتي:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCreatePage}
                      className="p-1 rounded-md text-emerald-400 hover:text-white hover:bg-emerald-600/60 transition-colors"
                      title="صفحة فارغة جديدة"
                    >
                      <FilePlus2 size={14} />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-600/60 transition-colors"
                      title="فتح ملف مشروع (alif.json)"
                    >
                      <FolderOpen size={14} />
                    </button>
                    <button
                      onClick={handleExportProject}
                      className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-600/60 transition-colors"
                      title="تصدير المشروع الحالي كملف"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto custom-menu-scroll py-1">
                  {customPageIds.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-500 text-center">
                      لا صفحات بعد — أنشئ واحدة بزر +
                    </div>
                  ) : (
                    customPageIds.map((id) => (
                      <div
                        key={id}
                        className={`w-full flex items-center justify-between pl-2 pr-4 py-2 text-sm transition-colors border-b border-slate-700/30 last:border-0 group ${
                          currentProjectId === id ? 'bg-emerald-600/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-700/80'
                        }`}
                        dir="rtl"
                      >
                        <button
                          onClick={() => handleSelectPage(id)}
                          className="flex-1 text-right truncate hover:text-emerald-400"
                        >
                          <span>{customPages[id]?.title || 'صفحة'}</span>
                        </button>
                        <span className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100">
                          <button
                            onClick={() => {
                              const t = prompt('اسم جديد للصفحة:', customPages[id]?.title || '');
                              if (t) useEditorStore.getState().renameCustomPage(id, t);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-600/60 text-xs"
                            title="إعادة تسمية"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`حذف الصفحة "${customPages[id]?.title}"؟`)) {
                                useEditorStore.getState().deleteCustomPage(id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-300 hover:bg-red-600/40 text-xs"
                            title="حذف الصفحة"
                          >
                            ✕
                          </button>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CheatsheetModal
        isOpen={isCheatsheetOpen}
        onClose={() => setIsCheatsheetOpen(false)}
      />
      {isShortcutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsShortcutsOpen(false)}>
          <div
            className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/60 bg-slate-800/60">
              <h2 className="text-sm font-bold text-white">اختصارات لوحة المفاتيح</h2>
              <button
                onClick={() => setIsShortcutsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {SHORTCUTS.map(([keys, desc]) => (
                <div key={keys} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-300">{desc}</span>
                  <span className="font-mono px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-300 whitespace-nowrap" dir="ltr">
                    {keys}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
