import { NodeData } from './DynamicNode';

export const nodeDefinitions: Record<string, Omit<NodeData, 'onControlChange'>> = {
  'ماكرو/مدخلات': {
    label: 'مدخلات الماكرو',
    subtitle: 'استقبال البيانات للتنفيذ',
    iconName: 'ArrowRightToLine',
    color: '#8b5cf6', // Purple
    outputs: [{ id: 'seq_out', label: 'بدء', type: 'event' }],
    allowDynamicOutputs: true,
  },
  'ماكرو/مخرجات': {
    label: 'مخرجات الماكرو',
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
    controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }, { id: 'op', type: 'select', label: 'العملية', value: '+=', options: ['+=', '-=', '*=', '\\=', '^='] }],
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
  'ملفات/فتح': {
    label: 'فتح ملف', subtitle: 'افتح', iconName: 'FileText', color: '#64748b',
    inputs: [{ id: 'path_in', label: 'المسار', type: 'data' }], outputs: [{ id: 'file_out', label: 'الملف', type: 'data' }],
    controls: [{ id: 'mode', type: 'select', label: 'الوضع', value: 'ق', options: ['ق', 'ك', 'ا'] }],
  },
  'ملفات/قراءة': {
    label: 'قراءة ملف', subtitle: 'اقرا', iconName: 'BookOpen', color: '#64748b',
    inputs: [{ id: 'file_in', label: 'الملف', type: 'data' }], outputs: [{ id: 'res_out', label: 'المحتوى', type: 'data' }],
    controls: [{ id: 'type', type: 'select', label: 'قراءة', value: 'الكل', options: ['الكل', 'سطر'] }],
  },
  'ملفات/إغلاق': {
    label: 'إغلاق ملف', subtitle: 'اغلق', iconName: 'XSquare', color: '#64748b',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }, { id: 'file_in', label: 'الملف', type: 'data' }], outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
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
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'number' }], outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
    controls: [{ id: 'func', type: 'select', label: 'الدالة', value: 'جيب', options: ['جيب', 'تجيب', 'ظل', 'قيمة_مطلقة', 'المضروب', 'قم_اكبر', 'قم_اصغر', 'حد_اعلى', 'حد_ادنى', 'لوغ', 'راديان', 'درجة'] }],
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
    label: 'خاصية الكائن', subtitle: 'هذا.', iconName: 'Target', color: '#f43f5e',
    outputs: [{ id: 'res_out', label: 'الخاصية', type: 'data' }],
    controls: [{ id: 'prop_name', type: 'text', label: 'الاسم', value: 'العمر' }],
  },
  'كائنات/تعيين_خاصية': {
    label: 'تعيين خاصية', subtitle: 'هذا.س =', iconName: 'Target', color: '#f43f5e',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }, { id: 'val_in', label: 'القيمة', type: 'data' }], outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'prop_name', type: 'text', label: 'الخاصية', value: 'العمر' }],
  },
  'كائنات/إنشاء': {
    label: 'إنشاء كائن', subtitle: 'جديد()', iconName: 'Box', color: '#f43f5e',
    inputs: [{ id: 'arg_in', label: 'المعطيات', type: 'data' }], outputs: [{ id: 'obj_out', label: 'الكائن', type: 'data' }],
    controls: [{ id: 'class_name', type: 'text', label: 'اسم الصنف', value: 'شخص' }],
  },
  'حزم/استيراد': {
    label: 'استيراد حزمة', subtitle: 'استورد', iconName: 'Package', color: '#14b8a6',
    inputs: [{ id: 'seq_in', label: 'تسلسل', type: 'event' }], outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
    controls: [{ id: 'pkg_name', type: 'text', label: 'الحزمة', value: 'مكتبة' }],
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
      { id: 'end', type: 'text', label: 'النهاية', value: '\\س' },
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
      { id: 'false_out', label: 'والا', type: 'event' },
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
    ],
    outputs: [
      { id: 'body_out', label: 'جسم', type: 'event' },
      { id: 'done_out', label: 'انتهى', type: 'event' },
    ],
    controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }],
  },
  'حلقات/بينما': {
    label: 'بينما (While)',
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
    controls: [{ id: 'op', type: 'select', label: 'عملية', value: '+', options: ['+', '-', '*', '\\'] }],
  },
  'رياضيات/باقي القسمة': {
    label: 'باقي القسمة',
    subtitle: 'موديولو (%)',
    iconName: 'Percent',
    color: '#3b82f6',
    inputs: [
      { id: 'a_in', label: 'الرقم', type: 'data' },
      { id: 'b_in', label: 'القاسم', type: 'data' },
    ],
    outputs: [{ id: 'res_out', label: 'الباقي', type: 'data' }],
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
  'بيانات/تحويل لنص': {
    label: 'تحويل لنص',
    subtitle: 'نص()',
    iconName: 'WholeWord',
    color: '#eab308',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'النص', type: 'data' }],
  },
  'بيانات/تحويل لرقم': {
    label: 'تحويل لرقم',
    subtitle: 'رقم()',
    iconName: 'Binary',
    color: '#3b82f6',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'الرقم', type: 'data' }],
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
  'نصوص/تكبير': {
    label: 'تكبير الحروف',
    subtitle: 'نص كبير',
    iconName: 'CaseUpper',
    color: '#eab308',
    inputs: [{ id: 'str_in', label: 'النص', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
  },
  'نصوص/تصغير': {
    label: 'تصغير الحروف',
    subtitle: 'نص صغير',
    iconName: 'CaseLower',
    color: '#eab308',
    inputs: [{ id: 'str_in', label: 'النص', type: 'data' }],
    outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
  },
  'بيانات/إدخال مستخدم': {
    label: 'إدخال مستخدم',
    subtitle: 'طلب إدخال',
    iconName: 'Keyboard',
    color: '#ec4899',
    outputs: [{ id: 'res_out', label: 'إدخال', type: 'data' }],
    controls: [{ id: 'prompt', type: 'text', label: 'الرسالة', value: 'أدخل القيمة: ' }],
  },
  'بيانات/طول': {
    label: 'طول',
    subtitle: 'نص أو مصفوفة',
    iconName: 'Ruler',
    color: '#3b82f6',
    inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
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
    outputs: [{ id: 'body_out', label: 'جسم الدالة', type: 'event' }],
    controls: [
      { id: 'func_name', type: 'text', label: 'الاسم', value: 'عملية' },
      { id: 'arg', type: 'text', label: 'المعامل', value: 'الرقم' },
    ],
  },
  'دوال/استدعاء': {
    label: 'استدعاء دالة',
    subtitle: 'تشغيل',
    iconName: 'PhoneCall',
    color: '#10b981',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'arg_in', label: 'المعامل', type: 'data' },
    ],
    outputs: [
      { id: 'seq_out', label: 'التالي', type: 'event' },
      { id: 'res_out', label: 'النتيجة', type: 'data' },
    ],
    controls: [{ id: 'func_name', type: 'text', label: 'الاسم', value: 'عملية' }],
  },
  'دوال/إرجاع': {
    label: 'إرجاع (Return)',
    subtitle: 'إعادة قيمة',
    iconName: 'CornerDownLeft',
    color: '#10b981',
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'val_in', label: 'قيمة', type: 'data' },
    ],
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
      { id: 'finally_out', label: 'في النهاية', type: 'event' },
    ],
  },
};
