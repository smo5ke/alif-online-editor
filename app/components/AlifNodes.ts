import { NodeData, DataType } from './DynamicNode';

export type MacroPort = { id: string; label: string; type: DataType };

/**
 * Builds the ports of a macro CALL node from a macro definition:
 * canonical seq_in/seq_out flow ports plus the mirrored data ports
 * (event ports of the definition are intentionally NOT mirrored).
 */
export function buildMacroCallPorts(
  defOutputs: MacroPort[] | undefined,
  defInputs: MacroPort[] | undefined
): { inputs: MacroPort[]; outputs: MacroPort[] } {
  const dataOuts = (defOutputs || []).filter((o) => o.type !== 'event');
  const dataIns = (defInputs || []).filter((i) => i.type !== 'event');
  return {
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }, ...dataOuts],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }, ...dataIns],
  };
}

export const nodeDefinitions: Record<string, Omit<NodeData, 'onControlChange'>> = {
  'ماكرو/مدخلات': {
    label: 'مدخلات الكتلة',
    subtitle: 'استقبال البيانات للتنفيذ',
    iconName: 'ArrowRightToLine',
    color: '#8b5cf6', // Purple
    outputs: [{ id: 'seq_out', label: 'بدء', type: 'event' }],
    allowDynamicOutputs: true,
  },
  'ماكرو/مخرجات': {
    label: 'مخرجات الكتلة',
    subtitle: 'إرسال النتائج للخارج',
    iconName: 'ArrowRightFromLine',
    color: '#8b5cf6', // Purple
    inputs: [{ id: 'seq_in', label: 'إنهاء', type: 'event' }],
    allowDynamicInputs: true,
  },
  'أوامر/بداية البرنامج': {
    label: 'بداية البرنامج',
    subtitle: 'نقطة الانطلاق',
    iconName: 'PlayCircle',
    color: '#ec4899', // Pink
    outputs: [{ id: 'seq_out', label: 'تسلسل', type: 'event' }],
  },
  'متغيرات/إسناد رجعي': {
    label: 'إسناد رجعي', subtitle: '+=, -=, ...', iconName: 'ArrowRightLeft', color: '#f97316',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }, { id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }, { id: 'op', type: 'select', label: 'العملية', value: '+=', options: ['+=', '-=', '*=', '\\=', '\\\\=', '\\*=', '^='] }],
  },
  'متغيرات/إسناد شرطي': {
    label: 'إسناد شرطي', subtitle: 'اذا / والا', iconName: 'HelpCircle', color: '#f97316',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }, { id: 'cond_in', label: 'الشرط', type: 'data' }, { id: 'true_in', label: 'صح', type: 'data' }, { id: 'false_in', label: 'خطأ', type: 'data' }],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }],
  },
  'متغيرات/حذف': {
    label: 'حذف متغير', subtitle: 'احذف', iconName: 'Trash2', color: '#f97316',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }], outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }],
  },

  'وقت/الآن': {
    label: 'الوقت الحالي', subtitle: 'الان()', iconName: 'Clock', color: '#0ea5e9',
    outputs: [{ id: 'res_out', label: 'الوقت', type: 'data' }],
  },
  'وقت/منسق': {
    label: 'تاريخ منسق', subtitle: 'منسق()', iconName: 'Calendar', color: '#0ea5e9',
    outputs: [{ id: 'res_out', label: 'التاريخ', type: 'data' }],
  },
  'رياضيات/دوال': {
    label: 'دالة رياضية', subtitle: 'الرياضيات', iconName: 'Sigma', color: '#3b82f6',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }], outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
    controls: [{ id: 'func', type: 'select', label: 'الدالة', value: 'جيب', options: ['جيب', 'تجيب', 'ظل', 'قيمة_مطلقة', 'المضروب', 'قم_اكبر', 'قم_اصغر', 'حد_اعلى', 'حد_ادنى', 'لوغ', 'راديان', 'درجة', 'مسافة'] }],
  },

  'استيراد/مكتبة': {
    label: 'استيراد', subtitle: 'استيراد مكتبة', iconName: 'Package', color: '#14b8a6',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'lib', type: 'text', label: 'المكتبة (نقاط للفرعية)', value: 'الوقت' }],
  },
  'استيراد/من': {
    label: 'استيراد من', subtitle: 'من X استورد Y', iconName: 'Download', color: '#14b8a6',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [
      { id: 'pkg', type: 'text', label: 'الحزمة', value: 'الوقت' },
      { id: 'name', type: 'text', label: 'الاسم', value: 'غفوة' },
    ],
  },
  'عشوائي/بذرة': {
    label: 'تعيين البذرة', subtitle: 'البذرة()', iconName: 'Dices', color: '#8b5cf6',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }, { id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },
  'عشوائي/رقم': {
    label: 'توليد عشوائي', subtitle: 'عشوائي()', iconName: 'Dices', color: '#8b5cf6',
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
  },
  'عشوائي/منتظم': {
    label: 'توليد منتظم', subtitle: 'منتظم()', iconName: 'Dices', color: '#8b5cf6',
    inputs: [{ id: 'min_in', label: 'الأدنى', type: 'data' }, { id: 'max_in', label: 'الأعلى', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
  },
  'مصفوفات/إدراج': {
    label: 'إدراج عنصر', subtitle: 'ادرج', iconName: 'ListPlus', color: '#06b6d4',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }, { id: 'arr_in', label: 'المصفوفة', type: 'data' }, { id: 'idx_in', label: 'الفهرس', type: 'data' }, { id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },
  'فهارس/مفاتيح_وقيم': {
    label: 'مفاتيح وقيم', subtitle: 'الفهرس', iconName: 'Key', color: '#a855f7',
    inputs: [{ id: 'dict_in', label: 'الفهرس', type: 'data' }], outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
    controls: [{ id: 'type', type: 'select', label: 'استخراج', value: 'مفاتيح', options: ['مفاتيح', 'قيم'] }],
  },
  'شروط/انتماء': {
    label: 'انتماء', subtitle: 'في / ليس في', iconName: 'Inspect', color: '#8b5cf6',
    inputs: [{ id: 'val_in', label: 'العنصر', type: 'data' }, { id: 'list_in', label: 'المجموعة', type: 'data' }], outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
    controls: [{ id: 'op', type: 'select', label: 'العملية', value: 'في', options: ['في', 'ليس في'] }],
  },
  'كائنات/صنف': {
    label: 'تعريف صنف', subtitle: 'صنف', iconName: 'Component', color: '#f43f5e',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }],
    outputs: [{ id: 'body_out', label: 'المحتوى', type: 'event' }, { id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'class_name', type: 'text', label: 'اسم الصنف', value: 'شخص' }, { id: 'inherits', type: 'text', label: 'يرث من', value: '' }],
  },
  'كائنات/هذا': {
    label: 'خاصية الكائن', subtitle: 'كائن.خاصية', iconName: 'Target', color: '#f43f5e',
    inputs: [{ id: 'obj_in', label: 'الكائن (فارغ = هذا)', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'الخاصية', type: 'data' }],
    controls: [{ id: 'prop_name', type: 'text', label: 'الاسم', value: 'العمر' }],
  },
  'كائنات/تعيين_خاصية': {
    label: 'تعيين خاصية', subtitle: 'كائن.س =', iconName: 'Target', color: '#f43f5e',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }, { id: 'obj_in', label: 'الكائن (فارغ = هذا)', type: 'data' }, { id: 'val_in', label: 'القيمة', type: 'data' }], outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'prop_name', type: 'text', label: 'الخاصية', value: 'العمر' }],
  },
  'كائنات/إنشاء': {
    label: 'إنشاء كائن', subtitle: 'جديد()', iconName: 'Box', color: '#f43f5e',
    allowDynamicInputs: true,
    dynamicInputLabel: 'معامل',
    inputs: [{ id: 'arg_in', label: 'المعطيات', type: 'data' }], outputs: [{ id: 'obj_out', label: 'الكائن', type: 'data' }],
    controls: [{ id: 'class_name', type: 'text', label: 'اسم الصنف', value: 'شخص' }],
  },

  'أوامر/اطبع': {
    label: 'اطبع',
    subtitle: 'مخرجات الشاشة',
    iconName: 'Printer',
    color: '#ec4899', 
    allowDynamicInputs: true,
    dynamicInputLabel: 'قيمة',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'val_in', label: 'القيمة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [
      { id: 'sep', type: 'text', label: 'الفاصل', value: ' ' },
      { id: 'end', type: 'text', label: 'النهاية', value: '\\n' },
      { id: 'flush', type: 'select', label: 'مباشر', value: 'خطأ', options: ['صح', 'خطأ'] }
    ]
  },

  'وقت/انتظر': {
    label: 'انتظر (تأخير)',
    subtitle: 'إيقاف مؤقت',
    iconName: 'Clock',
    color: '#06b6d4',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'ms_in', label: 'ثواني', type: 'number' }
    ],
    outputs: [{ id: 'seq_out', label: 'بعد الانتظار', type: 'event' }],
  },
  
  'شروط/اذا': {
    label: 'اذا / والا',
    subtitle: 'تفرع شرطي',
    iconName: 'GitBranch',
    color: '#8b5cf6', // Violet
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'cond_in', label: 'الشرط', type: 'data' },
    ],
    outputs: [
      { id: 'true_out', label: 'اذا صح', type: 'event' },
      { id: 'false_out', label: 'والا / اواذا', type: 'event' },
      { id: 'seq_out', label: 'التالي', type: 'event' },
    ],
  },
  'شروط/اواذا': {
    label: 'اواذا',
    subtitle: 'شرط إضافي (تُربط بعد اذا)',
    iconName: 'GitBranch',
    color: '#8b5cf6',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'cond_in', label: 'الشرط', type: 'data' },
    ],
    outputs: [
      { id: 'true_out', label: 'اذا صح', type: 'event' },
      { id: 'false_out', label: 'والا / اواذا', type: 'event' },
    ],
  },
  'شروط/مقارنة': {
    label: 'مقارنة',
    subtitle: 'منطق',
    iconName: 'Scale',
    color: '#8b5cf6', 
    inputs: [
      { id: 'a_in', label: 'أ', type: 'data' },
      { id: 'b_in', label: 'ب', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'نتيجة', type: 'data' }],
    controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '==', options: ['==', '!=', '>', '<', '>=', '<='] }],
  },
  'شروط/عملية منطقية': {
    label: 'عملية منطقية',
    subtitle: 'و / أو',
    iconName: 'BrainCircuit',
    color: '#8b5cf6',
    inputs: [
      { id: 'a_in', label: 'أ', type: 'data' },
      { id: 'b_in', label: 'ب', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'نتيجة', type: 'data' }],
    controls: [{ id: 'op', type: 'select', label: 'عملية', value: 'و', options: ['و', 'أو'] }],
  },
  'شروط/ليس': {
    label: 'نفي (ليس)',
    subtitle: 'عكس الشرط',
    iconName: 'ToggleLeft',
    color: '#8b5cf6',
    inputs: [{ id: 'val_in', label: 'الشرط', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
  },

  'حلقات/لكل': {
    label: 'لكل',
    subtitle: 'حلقة تكرارية',
    iconName: 'Repeat',
    color: '#f97316', // Orange
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'start_in', label: 'من', type: 'data' },
      { id: 'end_in', label: 'إلى', type: 'data' },
      { id: 'step_in', label: 'الخطوة (اختياري)', type: 'data' },
    ],
    outputs: [
      { id: 'body_out', label: 'جسم', type: 'event' },
      { id: 'done_out', label: 'انتهى', type: 'event' },
    ],
    controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }],
  },
  'حلقات/بينما': {
    label: 'بينما',
    subtitle: 'تكرار مشروط',
    iconName: 'RefreshCcw',
    color: '#f97316',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'cond_in', label: 'الشرط', type: 'data' },
    ],
    outputs: [
      { id: 'body_out', label: 'جسم', type: 'event' },
      { id: 'done_out', label: 'انتهى', type: 'event' },
    ],
  },
  'حلقات/توقف': {
    label: 'توقف',
    subtitle: 'كسر الحلقة',
    iconName: 'OctagonX',
    color: '#f97316',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }],
  },

  'متغيرات/إسناد': {
    label: 'إسناد متغير',
    subtitle: 'حفظ قيمة',
    iconName: 'Database',
    color: '#14b8a6', // Teal
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'val_in', label: 'القيمة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }],
  },
  'متغيرات/قراءة': {
    label: 'قراءة متغير',
    subtitle: 'استرجاع',
    iconName: 'Eye',
    color: '#14b8a6',
    outputs: [{ id: 'val_out', label: 'القيمة', type: 'data' }],
    controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }],
  },
  'متغيرات/إسناد متعدد': {
    label: 'إسناد متعدد',
    subtitle: 'س, ص = ...',
    iconName: 'Database',
    color: '#14b8a6',
    allowDynamicInputs: true,
    dynamicInputLabel: 'قيمة',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'val_in', label: 'القيمة 1', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'var_names', type: 'text', label: 'المتغيرات (افصل بفاصلة)', value: 'س, ص' }],
  },

  'بيانات/حساب': {
    label: 'عملية حسابية',
    subtitle: 'رياضيات',
    iconName: 'Calculator',
    color: '#3b82f6', // Blue
    inputs: [
      { id: 'a_in', label: 'أ', type: 'data' },
      { id: 'b_in', label: 'ب', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
    controls: [{ id: 'op', type: 'select', label: 'عملية', value: '+', options: ['+', '-', '*', '\\', '\\\\', '\\*', '^'] }],
  },

  'بيانات/رقم': {
    label: 'رقم',
    subtitle: 'قيمة رقمية',
    iconName: 'Hash',
    color: '#3b82f6',
    outputs: [{ id: 'val_out', label: 'رقم', type: 'number' }],
    controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 0 }],
  },
  'بيانات/نص': {
    label: 'نص',
    subtitle: 'سلسلة نصية',
    iconName: 'Type',
    color: '#eab308', // Yellow
    outputs: [{ id: 'val_out', label: 'نص', type: 'text' }],
    controls: [{ id: 'value', type: 'text', label: 'النص', value: 'مرحباً' }],
  },
  'بيانات/تحويل لرقم': {
    label: 'تحويل لرقم',
    subtitle: 'رقم()',
    iconName: 'Binary',
    color: '#3b82f6',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'الرقم', type: 'data' }],
  },
  'بيانات/تحويل لصحيح': {
    label: 'تحويل لصحيح',
    subtitle: 'صحيح()',
    iconName: 'Hash',
    color: '#3b82f6',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'العدد الصحيح', type: 'data' }],
  },
  'بيانات/تحويل لمصفوفة': {
    label: 'تحويل لمصفوفة',
    subtitle: 'مصفوفة()',
    iconName: 'List',
    color: '#06b6d4',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'المصفوفة', type: 'data' }],
  },
  'بيانات/تحويل لمنطق': {
    label: 'تحويل لمنطق',
    subtitle: 'منطق()',
    iconName: 'ToggleRight',
    color: '#3b82f6',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'صح/خطأ', type: 'data' }],
  },
  'بيانات/تحويل لمترابطة': {
    label: 'تحويل لمترابطة',
    subtitle: 'مترابطة()',
    iconName: 'Combine',
    color: '#06b6d4',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'المترابطة', type: 'data' }],
  },
  'بيانات/تحويل لمميزة': {
    label: 'تحويل لمميزة',
    subtitle: 'مميزة()',
    iconName: 'Hash',
    color: '#a855f7',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'المميزة', type: 'data' }],
  },
  'بيانات/نوع': {
    label: 'نوع البيانات',
    subtitle: 'نوع()',
    iconName: 'Fingerprint',
    color: '#8b5cf6',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'النوع', type: 'data' }],
  },
  'بيانات/دمج نصوص': {
    label: 'دمج نصوص',
    subtitle: 'ربط',
    iconName: 'TextSelect',
    color: '#eab308',
    inputs: [
      { id: 'a_in', label: 'أ (نص)', type: 'data' },
      { id: 'b_in', label: 'ب (نص)', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'الناتج', type: 'data' }],
  },
  'بيانات/منطق': {
    label: 'صح / خطأ',
    subtitle: 'قيمة منطقية',
    iconName: 'ToggleRight',
    color: '#3b82f6',
    outputs: [{ id: 'val_out', label: 'قيمة', type: 'boolean' }],
    controls: [{ id: 'value', type: 'select', label: 'منطق', value: 'صح', options: ['صح', 'خطأ'] }],
  },
  'نصوص/قص': {
    label: 'قص نص',
    subtitle: 'اقتطاع جزء',
    iconName: 'Scissors',
    color: '#eab308',
    inputs: [
      { id: 'str_in', label: 'النص', type: 'data' },
      { id: 'start_in', label: 'من', type: 'data' },
      { id: 'end_in', label: 'إلى', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
  },
  'نصوص/استبدال': {
    label: 'استبدال نص',
    subtitle: 'تغيير كلمة',
    iconName: 'Replace',
    color: '#eab308',
    inputs: [
      { id: 'str_in', label: 'النص', type: 'data' },
      { id: 'old_in', label: 'القديم', type: 'data' },
      { id: 'new_in', label: 'الجديد', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
  },
  'شروط/منطق': {
    label: 'صح / خطأ',
    subtitle: 'قيمة منطقية',
    iconName: 'ToggleRight',
    color: '#3b82f6',
    outputs: [{ id: 'res_out', label: 'القيمة', type: 'data' }],
    controls: [{ id: 'value', type: 'select', label: 'منطق', value: 'صح', options: ['صح', 'خطأ'] }],
  },
  'أوامر/إدخال مستخدم': {
    label: 'إدخال مستخدم',
    subtitle: 'طلب إدخال',
    iconName: 'Keyboard',
    color: '#8b5cf6',
    outputs: [{ id: 'res_out', label: 'إدخال', type: 'data' }],
    controls: [{ id: 'prompt', type: 'text', label: 'الرسالة', value: 'أدخل قيمة:' }],
  },
  'دوال/طول': {
    label: 'طول',
    subtitle: 'طول(س)',
    iconName: 'Ruler',
    color: '#06b6d4',
    inputs: [{ id: 'val_in', label: 'عنصر', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'الطول', type: 'data' }],
  },

  'مصفوفات/جديدة': {
    label: 'مصفوفة جديدة',
    subtitle: 'فارغة',
    iconName: 'ListPlus',
    color: '#06b6d4', // Cyan
    allowDynamicInputs: true,
    outputs: [{ id: 'arr_out', label: 'مصفوفة', type: 'array' }],
  },
  'مصفوفات/إضافة': {
    label: 'إضافة للمصفوفة',
    subtitle: 'إدراج',
    iconName: 'ListStart',
    color: '#06b6d4',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'arr_in', label: 'المصفوفة', type: 'data' },
      { id: 'val_in', label: 'القيمة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },
  'مصفوفات/حذف': {
    label: 'حذف من المصفوفة',
    subtitle: 'إزالة',
    iconName: 'ListMinus',
    color: '#06b6d4',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'arr_in', label: 'المصفوفة', type: 'data' },
      { id: 'val_in', label: 'القيمة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },
  'مصفوفات/قراءة': {
    label: 'قراءة عنصر',
    subtitle: 'فهرس',
    iconName: 'ListFilter',
    color: '#06b6d4',
    inputs: [
      { id: 'arr_in', label: 'المصفوفة', type: 'data' },
      { id: 'idx_in', label: 'الفهرس', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
  },
  'مصفوفات/ترتيب': {
    label: 'ترتيب المصفوفة',
    subtitle: 'رتب()',
    iconName: 'ArrowDownUp',
    color: '#06b6d4',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'arr_in', label: 'المصفوفة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },
  
  'فهارس/جديد': {
    label: 'فهرس جديد',
    subtitle: 'قاموس فارغ',
    iconName: 'Library',
    color: '#a855f7', // Purple
    allowDynamicInputs: 'pair',
    outputs: [{ id: 'dict_out', label: 'فهرس', type: 'dictionary' }],
  },
  'فهارس/إضافة': {
    label: 'إضافة للفهرس',
    subtitle: 'مفتاح وقيمة',
    iconName: 'BookPlus',
    color: '#a855f7',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'dict_in', label: 'الفهرس', type: 'data' },
      { id: 'key_in', label: 'المفتاح', type: 'data' },
      { id: 'val_in', label: 'القيمة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },
  'فهارس/قراءة': {
    label: 'قراءة من فهرس',
    subtitle: 'جلب قيمة',
    iconName: 'BookOpen',
    color: '#a855f7',
    inputs: [
      { id: 'dict_in', label: 'الفهرس', type: 'data' },
      { id: 'key_in', label: 'المفتاح', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
  },
  
  'دوال/تعريف دالة': {
    label: 'تعريف دالة',
    subtitle: 'دالة مخصصة',
    iconName: 'Cog',
    color: '#10b981', // Emerald
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }],
    outputs: [
      { id: 'body_out', label: 'جسم الدالة', type: 'event' },
      { id: 'seq_out', label: 'التالي', type: 'event' },
    ],
    controls: [
      { id: 'func_name', type: 'text', label: 'الاسم', value: 'عملية' },
      { id: 'arg', type: 'text', label: 'المعاملات (افصل بفاصلة ,)', value: 'الرقم' },
    ],
  },
  'دوال/استدعاء': {
    label: 'استدعاء دالة',
    subtitle: 'تشغيل',
    iconName: 'PhoneCall',
    color: '#10b981',
    allowDynamicInputs: true,
    dynamicInputLabel: 'معامل',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'arg_in', label: 'المعامل', type: 'data' },
    ],
    outputs: [
      { id: 'seq_out', label: 'التالي', type: 'event' },
      { id: 'res_out', label: 'النتيجة', type: 'data' },
    ],
    controls: [
      { id: 'func_name', type: 'text', label: 'الاسم', value: 'عملية' },
      { id: 'kwargs', type: 'text', label: 'مفتاحية (ليمون = "10")', value: '' },
    ],
  },
  'دوال/إرجاع': {
    label: 'إرجاع',
    subtitle: 'إعادة قيمة',
    iconName: 'CornerDownLeft',
    color: '#10b981',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'val_in', label: 'قيمة', type: 'data' },
    ],
  },
  'دوال/خطية': {
    label: 'دالة خطية',
    subtitle: 'خطية س: ...',
    iconName: 'FileCode',
    color: '#10b981',
    inputs: [{ id: 'body_in', label: 'الجسم', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'الدالة', type: 'data' }],
    controls: [{ id: 'params', type: 'text', label: 'المعاملات', value: 'س' }],
  },
  'دوال/تحقق_اي': {
    label: 'تحقق أي',
    subtitle: 'تحقق_اي()',
    iconName: 'Eye',
    color: '#06b6d4',
    inputs: [{ id: 'val_in', label: 'القائمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'صح/خطأ', type: 'data' }],
  },
  'دوال/هل_نوع': {
    label: 'هل النوع؟',
    subtitle: 'هل_نوع()',
    iconName: 'Fingerprint',
    color: '#8b5cf6',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'صح/خطأ', type: 'data' }],
    controls: [{ id: 'typename', type: 'select', label: 'النوع', value: 'صحيح', options: ['صحيح', 'عشري', 'نص', 'مصفوفة', 'مترابطة', 'مميزة', 'فهرس'] }],
  },
  'أخطاء/محاولة': {
    label: 'محاولة / خطأ',
    subtitle: 'معالجة الاستثناءات',
    iconName: 'ShieldAlert',
    color: '#ef4444', // Red
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }],
    outputs: [
      { id: 'try_out', label: 'حاول', type: 'event' },
      { id: 'catch_out', label: 'في حال الخطأ', type: 'event' },
      { id: 'else_out', label: 'والا (بلا خطأ)', type: 'event' },
      { id: 'finally_out', label: 'نهاية (دائماً)', type: 'event' },
      { id: 'seq_out', label: 'التالي', type: 'event' },
    ],
    controls: [{ id: 'err_type', type: 'text', label: 'نوع الخطأ (فارغ = الكل)', value: '' }],
  },

  // --- حزمة التحكم والتكرار ---
  'حلقات/لكل في مصفوفة': {
    label: 'لكل في مصفوفة',
    subtitle: 'تكرار العناصر',
    iconName: 'ListOrdered',
    color: '#f97316',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'arr_in', label: 'المصفوفة', type: 'data' },
    ],
    outputs: [
      { id: 'body_out', label: 'جسم الحلقة', type: 'event' },
      { id: 'done_out', label: 'انتهى', type: 'event' },
    ],
    controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'عنصر' }],
  },
  'حلقات/استمر': {
    label: 'استمر (تخطي)',
    subtitle: 'للدورة التالية',
    iconName: 'FastForward',
    color: '#f97316',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }],
  },

  // --- حزمة النصوص ---
  'نصوص/تقسيم': {
    label: 'تقسيم نص',
    subtitle: 'قسم()',
    iconName: 'Split',
    color: '#eab308',
    inputs: [
      { id: 'str_in', label: 'النص', type: 'data' },
      { id: 'sep_in', label: 'الفاصل', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'المصفوفة', type: 'data' }],
    controls: [{ id: 'sep', type: 'text', label: 'الفاصل الافتراضي', value: ' ' }],
  },
  'نصوص/فحص': {
    label: 'فحص النص',
    subtitle: 'يحتوي (في)',
    iconName: 'SearchCode',
    color: '#eab308',
    inputs: [
      { id: 'str_in', label: 'النص', type: 'data' },
      { id: 'target_in', label: 'المستهدف', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
    controls: [{ id: 'check_type', type: 'select', label: 'نوع الفحص', value: 'يحتوي', options: ['يحتوي'] }],
  },
  'نصوص/اوجد': {
    label: 'موقع نص فرعي',
    subtitle: 'اوجد()',
    iconName: 'Search',
    color: '#eab308',
    inputs: [
      { id: 'str_in', label: 'النص', type: 'data' },
      { id: 'target_in', label: 'المستهدف', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'الموقع', type: 'data' }],
  },
  'نصوص/عدد': {
    label: 'عد التكرارات',
    subtitle: 'كم()',
    iconName: 'Hash',
    color: '#eab308',
    inputs: [
      { id: 'str_in', label: 'النص', type: 'data' },
      { id: 'target_in', label: 'المستهدف', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'العدد', type: 'data' }],
  },
  'نصوص/اربط': {
    label: 'ربط مصفوفة بنص',
    subtitle: 'فاصل.اربط()',
    iconName: 'Link',
    color: '#eab308',
    inputs: [
      { id: 'str_in', label: 'الفاصل', type: 'data' },
      { id: 'target_in', label: 'المصفوفة', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'النص', type: 'data' }],
  },

  // --- حزمة المصفوفات ---
  'مصفوفات/دمج': {
    label: 'دمج مصفوفتين',
    subtitle: 'أ + ب',
    iconName: 'Combine',
    color: '#06b6d4',
    inputs: [
      { id: 'a_in', label: 'مصفوفة أ', type: 'data' },
      { id: 'b_in', label: 'مصفوفة ب', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'المصفوفة', type: 'data' }],
  },
  'مصفوفات/مقرون': {
    label: 'مقرون (zip)',
    subtitle: 'مقرون(...)',
    iconName: 'Combine',
    color: '#06b6d4',
    allowDynamicInputs: true,
    dynamicInputLabel: 'قائمة',
    inputs: [
      { id: 'a_in', label: 'قائمة أ', type: 'data' },
      { id: 'b_in', label: 'قائمة ب', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'المقرون', type: 'data' }],
  },
  'مصفوفات/معكوس': {
    label: 'معكوس (كائن)',
    subtitle: 'معكوس() + مصفوفة()',
    iconName: 'ArrowLeftRight',
    color: '#06b6d4',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'المعكوس', type: 'data' }],
  },

  // --- حزمة المميزة (Sets) ---
  'مميزة/جديدة': {
    label: 'مميزة جديدة',
    subtitle: '{...}',
    iconName: 'Hash',
    color: '#a855f7',
    allowDynamicInputs: true,
    dynamicInputLabel: 'عنصر',
    outputs: [{ id: 'set_out', label: 'مميزة', type: 'array' }],
  },
  'مميزة/إضافة': {
    label: 'إضافة لمميزة',
    subtitle: 'اضف()',
    iconName: 'ListPlus',
    color: '#a855f7',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'set_in', label: 'المميزة', type: 'data' },
      { id: 'val_in', label: 'القيمة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },
  'مميزة/اسحب': {
    label: 'سحب من مميزة',
    subtitle: 'اسحب()',
    iconName: 'ListMinus',
    color: '#a855f7',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'set_in', label: 'المميزة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },

  // --- حزمة الملفات ---
  'ملفات/افتح': {
    label: 'فتح ملف',
    subtitle: 'افتح()',
    iconName: 'FileText',
    color: '#14b8a6',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'path_in', label: 'المسار', type: 'data' },
      { id: 'mode_in', label: 'الوضع', type: 'data' },
    ],
    outputs: [
      { id: 'seq_out', label: 'التالي', type: 'event' },
      { id: 'file_out', label: 'الملف', type: 'data' },
    ],
    controls: [
      { id: 'var_name', type: 'text', label: 'متغير الملف', value: 'ملف_مفتوح' },
      { id: 'path', type: 'text', label: 'المسار', value: 'ملف.الف' },
      { id: 'mode', type: 'select', label: 'الوضع', value: 'ق', options: ['ق', 'ك', 'ض', 'ج'] },
    ],
  },
  'ملفات/اكتب': {
    label: 'كتابة في ملف',
    subtitle: 'اكتب()',
    iconName: 'FileText',
    color: '#14b8a6',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'file_in', label: 'الملف', type: 'data' },
      { id: 'text_in', label: 'النص', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },
  'ملفات/اقرا': {
    label: 'قراءة ملف',
    subtitle: 'اقرا()',
    iconName: 'BookOpen',
    color: '#14b8a6',
    inputs: [{ id: 'file_in', label: 'الملف', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'المحتوى', type: 'data' }],
  },
  'ملفات/اقرا سطر': {
    label: 'قراءة سطر',
    subtitle: 'اقرا_سطر()',
    iconName: 'BookOpen',
    color: '#14b8a6',
    inputs: [{ id: 'file_in', label: 'الملف', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'السطر', type: 'data' }],
  },
  'ملفات/اغلق': {
    label: 'إغلاق ملف',
    subtitle: 'اغلق()',
    iconName: 'X',
    color: '#14b8a6',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'file_in', label: 'الملف', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },
  // --- حزمة الأوامر والطرفية ---

  // --- حزمة الفهارس المتقدمة ---
  'فهارس/احضر': {
    label: 'جلب بقيمة افتراضية',
    subtitle: 'احضر(مفتاح, افتراضي)',
    iconName: 'FolderSearch',
    color: '#3b82f6',
    inputs: [
      { id: 'dict_in', label: 'الفهرس', type: 'data' },
      { id: 'key_in', label: 'المفتاح', type: 'data' },
      { id: 'default_in', label: 'قيمة افتراضية', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'القيمة', type: 'data' }],
  },
  'فهارس/فحص مفتاح': {
    label: 'فحص وجود مفتاح',
    subtitle: 'مفتاح في فهرس',
    iconName: 'KeyRound',
    color: '#3b82f6',
    inputs: [
      { id: 'dict_in', label: 'الفهرس', type: 'data' },
      { id: 'key_in', label: 'المفتاح', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'النتيجة (صح/خطأ)', type: 'data' }],
  },
  'فهارس/حذف مفتاح': {
    label: 'حذف مفتاح من فهرس',
    subtitle: 'احذف فهرس[مفتاح]',
    iconName: 'Trash2',
    color: '#3b82f6',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'dict_in', label: 'الفهرس', type: 'data' },
      { id: 'key_in', label: 'المفتاح', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },

  // --- حزمة المصفوفات المتقدمة ---
  'مصفوفات/تعديل عنصر': {
    label: 'تعديل عنصر بمصفوفة',
    subtitle: 'مصفوفة[فهرس] = قيمة',
    iconName: 'FileEdit',
    color: '#06b6d4',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'arr_in', label: 'المصفوفة', type: 'data' },
      { id: 'idx_in', label: 'الفهرس', type: 'data' },
      { id: 'val_in', label: 'القيمة الجديدة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
  },

  // --- حزمة الكائنات المتقدمة ---
  'كائنات/استدعاء طريقة': {
    label: 'استدعاء دالة كائن',
    subtitle: 'كائن.دالة(معامل)',
    iconName: 'Cpu',
    color: '#6366f1',
    allowDynamicInputs: true,
    dynamicInputLabel: 'معامل',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'obj_in', label: 'الكائن', type: 'data' },
      { id: 'arg_in', label: 'المعامل', type: 'data' },
    ],
    outputs: [
      { id: 'seq_out', label: 'التالي', type: 'event' },
      { id: 'res_out', label: 'النتيجة', type: 'data' },
    ],
    controls: [
      { id: 'method_name', type: 'text', label: 'اسم الدالة / الطريقة', value: 'تشغيل' },
      { id: 'kwargs', type: 'text', label: 'مفتاحية (اختياري)', value: '' },
    ],
  },

  // --- حزمة الشيفرة الحرة المخصصة ---
  'بيانات/تعبير مخصص': {
    label: 'تعبير برمجي مخصص',
    subtitle: 'تعبير ألف حر',
    iconName: 'FileCode',
    color: '#8b5cf6',
    inputs: [
      { id: 'a_in', label: 'مدخل أ (اختياري)', type: 'data' },
      { id: 'b_in', label: 'مدخل ب (اختياري)', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
    controls: [{ id: 'expr', type: 'text', label: 'التعبير (استخدم أ و ب)', value: 'أ + ب' }],
  },
  'أوامر/سطر مخصص': {
    label: 'سطر برمجي مخصص',
    subtitle: 'تعليمة ألف حرة',
    iconName: 'Terminal',
    color: '#ec4899',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'a_in', label: 'مدخل أ (اختياري)', type: 'data' },
      { id: 'b_in', label: 'مدخل ب (اختياري)', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'code', type: 'text', label: 'التعليمة البرمجية', value: 'اطبع("مرحباً بك!")' }],
  },
};
