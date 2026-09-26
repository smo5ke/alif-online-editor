"use client";

import React, { useState } from 'react';
import { BookOpen, X, Copy, PlusCircle, Search, Check, Terminal } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore';

interface CheatItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  code: string;
}

const CHEAT_DATA: CheatItem[] = [
  {
    id: 'print',
    category: 'الطباعة والإدخال',
    title: 'طباعة نص على الشاشة',
    desc: 'دالة الطباعة الأساسية مع دعم فواصل ونهايات مخصصة.',
    code: `اطبع("مرحباً بك في لغة ألف 5.3!")\nاطبع("سطر جديد", النهاية="\\n")`,
  },
  {
    id: 'format_str',
    category: 'الطباعة والإدخال',
    title: 'النصوص المنسقة (f-strings)',
    desc: 'دمج المتغيرات داخل النصوص بسهولة باستخدام م"..." والرمز {}.',
    code: `اسم = "سارة"\nعمر = 22\nاطبع(م"أهلاً {اسم}، عمرك هو {عمر} سنة.")`,
  },
  {
    id: 'input',
    category: 'الطباعة والإدخال',
    title: 'إدخال المستخدم من الطرفية',
    desc: 'قراءة نص من المستخدم مع تحويله إلى أرقام إذا لزم.',
    code: `اسم = ادخل("ما اسمك؟ ")\nعمر = صحيح(ادخل("كم عمرك؟ "))\nاطبع(م"مرحباً {اسم}!")`,
  },
  {
    id: 'if_else',
    category: 'الشروط والمنطق',
    title: 'الجمل الشرطية (اذا / اواذا / والا)',
    desc: 'اتخاذ القرارات بناءً على شروط منطقية.',
    code: `درجة = 85\nاذا درجة >= 90:\n\tاطبع("ممتاز")\nاواذا درجة >= 80:\n\tاطبع("جيد جداً")\nوالا:\n\tاطبع("راسب")`,
  },
  {
    id: 'for_loop',
    category: 'التكرار والحلقات',
    title: 'حلقة التكرار (لكل)',
    desc: 'التكرار على نطاق أرقام أو عناصر مصفوفة.',
    code: `لكل س في مدى(5):\n\tاطبع(م"الرقم الحالي: {س}")`,
  },
  {
    id: 'while_loop',
    category: 'التكرار والحلقات',
    title: 'حلقة التكرار (بينما)',
    desc: 'التكرار طالما الشرط محقق مع إمكانية استخدام توقف واستمر.',
    code: `عداد = 3\nبينما عداد > 0:\n\tاطبع(عداد)\n\tعداد -= 1\nاطبع("انطلاق 🚀")`,
  },
  {
    id: 'functions',
    category: 'الدوال',
    title: 'تعريف واستدعاء دالة',
    desc: 'تجميع المهام البرمجية في دوال مخصصة مع إرجاع قيم.',
    code: `دالة جمع(أ, ب):\n\tارجع أ + ب\n\nالنتيجة = جمع(10, 20)\nاطبع(م"المجموع: {النتيجة}")`,
  },
  {
    id: 'arrays',
    category: 'المصفوفات والقوائم',
    title: 'التعامل مع المصفوفات',
    desc: 'إنشاء المصفوفات والإضافة والترتيب والحذف.',
    code: `أرقام = [5, 2, 9, 1]\nأرقام.اضف(7)\nأرقام.رتب()\nاطبع("المصفوفة المرتبة:", أرقام)`,
  },
  {
    id: 'dicts',
    category: 'الفهارس (القواميس)',
    title: 'الفهارس (Dictionary)',
    desc: 'تخزين البيانات كأزواج مفتاح وقيمة.',
    code: `طالب = {"اسم": "أحمد", "معدل": 94}\nاطبع("الاسم:", طالب["اسم"])\nطالب["مدينة"] = "الرياض"\nاطبع(طالب)`,
  },
  {
    id: 'oop',
    category: 'الكائنات والأصناف',
    title: 'البرمجة كائنية التوجه (OOP)',
    desc: 'بناء الأصناف والوراثة ودالة التهيئة.',
    code: `صنف سيارة:\n\tدالة __تهيئة__(هذا, نوع, سرعة):\n\t\tهذا.نوع = نوع\n\t\tهذا.سرعة = سرعة\n\nمركبة = سيارة("تويوتا", 220)\nاطبع(م"السيارة: {مركبة.نوع}")`,
  },
  {
    id: 'try_catch',
    category: 'معالجة الأخطاء',
    title: 'صائد الأخطاء الاستثنائية',
    desc: 'منع انهيار البرنامج عند حدوث أخطاء تشغيلية.',
    code: `حاول:\n\tقسمة = 10 \\ 0\nخلل:\n\tاطبع("خطأ: لا يمكن القسمة على صفر!")\nوالا:\n\tاطبع("تمت العملية بنجاح")`,
  },
  {
    id: 'modules',
    category: 'المكتبات المدمجة',
    title: 'استيراد الوقت والرياضيات والعشوائي',
    desc: 'استخدام دوال المكتبات المدمجة في ألف 5.3.',
    code: `استورد الوقت\nاستورد الرياضيات\nاستورد العشوائي\n\nاطبع("القيمة المطلقة:", الرياضيات.قيمة_مطلقة(-16))\nاطبع("رقم عشوائي:", العشوائي.عشوائي())\nالوقت.غفوة(1)`,
  },
];

export default function CheatsheetModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { textCode, setTextCode, setMode } = useEditorStore();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  if (!isOpen) return null;

  const categories = ['الكل', ...Array.from(new Set(CHEAT_DATA.map((c) => c.category)))];

  const filtered = CHEAT_DATA.filter((item) => {
    const matchCat = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInsert = (code: string) => {
    const separator = textCode.trim() ? '\n\n' : '';
    setTextCode(textCode + separator + code);
    setMode('code');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">مرجع لغة ألف 5.3 السريع</h2>
              <p className="text-xs text-slate-400">أمثلة وتوثيق مباشر لجميع أوامر وقواعد اللغة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-3">
          <div className="relative">
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن أمر أو دالة (مثل: طباعة، دالة، لكل، الوقت)..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 custom-menu-scroll">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              لم يتم العثور على أي نتائج مطابقة لبحثك.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col gap-2.5 transition-all hover:border-slate-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-medium">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(item.id, item.code)}
                      className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                      title="نسخ الشفرة"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleInsert(item.code)}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      title="إدراج في المحرر النصي"
                    >
                      <PlusCircle size={13} />
                      <span>إدراج في الكود</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400">{item.desc}</p>

                <div className="bg-[#0b1120] border border-slate-800 rounded-lg p-3 overflow-x-auto text-left font-mono text-xs text-emerald-400">
                  <pre style={{ direction: 'rtl', textAlign: 'right' }} className="code-font whitespace-pre">
                    {item.code}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-700/60 bg-slate-800/40 flex items-center justify-between text-xs text-slate-400">
          <span>توثيق لغة ألف 5.3 الرسمي • جميع الحقوق محفوظة لفرق تطوير ألف</span>
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
