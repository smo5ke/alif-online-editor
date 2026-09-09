"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore, ProjectState } from '../../store/useEditorStore';
import { FolderArchive, X, Plus, Trash2, Download, Upload, Check, FolderOpen, Calendar, Layers, FileCode } from 'lucide-react';

export interface SavedProjectItem {
  id: string;
  name: string;
  updatedAt: string;
  state: ProjectState;
}

const STORAGE_KEY = 'alif_saved_projects_list';

export default function ProjectManagerModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { getCurrentProjectSnapshot, loadCustomProject } = useEditorStore();
  const [projects, setProjects] = useState<SavedProjectItem[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load projects from localStorage on mount and open
  useEffect(() => {
    if (isOpen) {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          setProjects(JSON.parse(data));
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error('Failed to parse saved projects', err);
      }
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const saveProjectsToStorage = (updated: SavedProjectItem[]) => {
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newProjectName.trim() || `مشروع ${new Date().toLocaleDateString('ar-SA')}`;
    const snapshot = getCurrentProjectSnapshot();

    const newItem: SavedProjectItem = {
      id: `proj_${Date.now()}`,
      name,
      updatedAt: new Date().toLocaleString('ar-SA', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      state: snapshot,
    };

    const updated = [newItem, ...projects];
    saveProjectsToStorage(updated);
    setNewProjectName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLoad = (item: SavedProjectItem) => {
    loadCustomProject(item.state);
    onClose();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف المشروع "${name}"؟`)) {
      const updated = projects.filter((p) => p.id !== id);
      saveProjectsToStorage(updated);
    }
  };

  const handleExport = (item: SavedProjectItem) => {
    const jsonStr = JSON.stringify(item, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.name.replace(/\s+/g, '_')}.alifproj`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const parsed = JSON.parse(content);

        // Validate structure
        if (!parsed.state || !parsed.name) {
          alert('الملف غير صالح، تأكد من اختيار ملف مشروع ألف (.alifproj)');
          return;
        }

        const newItem: SavedProjectItem = {
          id: `proj_${Date.now()}`,
          name: `${parsed.name} (مستورد)`,
          updatedAt: new Date().toLocaleString('ar-SA', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }),
          state: parsed.state,
        };

        const updated = [newItem, ...projects];
        saveProjectsToStorage(updated);
        alert(`تم استيراد المشروع "${newItem.name}" بنجاح!`);
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف المشروع.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FolderArchive size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">مدير المشاريع</h2>
              <p className="text-xs text-slate-400">حفظ واسترجاع وتصدير مشاريعك البرمجية الكاملة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 custom-menu-scroll">
          
          {/* Section: Save Current Project */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Plus size={16} className="text-emerald-400" />
              حفظ المشروع الحالي كنسخة جديدة
            </h3>
            <form onSubmit={handleSaveCurrent} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="أدخل اسم المشروع (مثال: حاسبة المعدل)..."
                className="flex-1 w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check size={16} className="text-white" />
                    <span>تم الحفظ!</span>
                  </>
                ) : (
                  <>
                    <span>حفظ المشروع</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Section: Import & Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <FolderOpen size={16} className="text-blue-400" />
              المشاريع المحفوظة ({projects.length})
            </h3>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportFile}
                accept=".alifproj,.json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-600/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload size={14} className="text-blue-400" />
                <span>استيراد ملف (.alifproj)</span>
              </button>
            </div>
          </div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-slate-700/60 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3">
              <FolderArchive size={36} className="text-slate-600" />
              <p className="text-sm">لا توجد مشاريع محفوظة بعد.</p>
              <p className="text-xs text-slate-500">قم بإدخال اسم في الحقل أعلاه واضغط "حفظ المشروع" للاحتفاظ بنسختك.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {projects.map((item) => {
                const nodeCount = (item.state.nodes?.length || 0);
                const macroCount = Object.keys(item.state.macros || {}).length;
                const lineCount = (item.state.textCode || '').split('\n').filter(l => l.trim()).length;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-800/80 group"
                  >
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <h4 className="text-base font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-slate-500" />
                          {item.updatedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers size={13} className="text-slate-500" />
                          {nodeCount} عقدة
                          {macroCount > 0 && ` • ${macroCount} كتل`}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileCode size={13} className="text-slate-500" />
                          {lineCount} سطر كود
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleLoad(item)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <FolderOpen size={14} />
                        <span>فتح</span>
                      </button>
                      <button
                        onClick={() => handleExport(item)}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="تصدير كملف"
                      >
                        <Download size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-2 bg-slate-700 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                        title="حذف المشروع"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-700/60 bg-slate-800/40 flex items-center justify-between text-xs text-slate-400">
          <span>يتم حفظ المشاريع محلياً داخل متصفحك بشكل آمن ودائم.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
