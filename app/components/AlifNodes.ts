import { NodeData } from './DynamicNode';

export const nodeDefinitions: Record<string, Omit<NodeData, 'onControlChange'>> = {
  'أوامر/بداية البرنامج': {
    label: 'بداية البرنامج',
    subtitle: 'نقطة الانطلاق',
    iconName: 'PlayCircle',
    color: '#ec4899', // Pink
    outputs: [{ id: 'seq_out', label: 'تسلسل', type: 'event' }],
  },
  'أوامر/اطبع': {
    label: 'اطبع',
    subtitle: 'مخرجات الشاشة',
    iconName: 'Printer',
    color: '#ec4899', 
    inputs: [
      { id: 'seq_in', label: 'تسلسل', type: 'event' },
      { id: 'val_in', label: 'القيمة', type: 'data' },
    ],
    outputs: [{ id: 'seq_out', label: 'التالي', type: 'event' }],
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

  'حلقات/لكل': {
    label: 'لكل (تكرار)',
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
    outputs: [{ id: 'res_out', label: 'الناتج', type: 'data' }],
    controls: [{ id: 'op', type: 'select', label: 'العملية', value: '+', options: ['+', '-', '*', '/', '^', '%'] }],
  },
  'بيانات/رقم': {
    label: 'رقم',
    subtitle: 'قيمة رقمية',
    iconName: 'Hash',
    color: '#3b82f6',
    outputs: [{ id: 'val_out', label: 'رقم', type: 'data' }],
    controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 0 }],
  },
  'بيانات/نص': {
    label: 'نص',
    subtitle: 'سلسلة نصية',
    iconName: 'Type',
    color: '#eab308', // Yellow
    outputs: [{ id: 'val_out', label: 'نص', type: 'data' }],
    controls: [{ id: 'value', type: 'text', label: 'النص', value: 'مرحباً' }],
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
    outputs: [{ id: 'val_out', label: 'قيمة', type: 'data' }],
    controls: [{ id: 'value', type: 'select', label: 'منطق', value: 'صح', options: ['صح', 'خطأ'] }],
  },
  'بيانات/إدخال مستخدم': {
    label: 'إدخال مستخدم',
    subtitle: 'طلب إدخال',
    iconName: 'Keyboard',
    color: '#ec4899',
    outputs: [{ id: 'res_out', label: 'إدخال', type: 'data' }],
    controls: [{ id: 'prompt', type: 'text', label: 'الرسالة', value: 'أدخل القيمة: ' }],
  },

  'مصفوفات/جديدة': {
    label: 'مصفوفة جديدة',
    subtitle: 'فارغة',
    iconName: 'ListPlus',
    color: '#06b6d4', // Cyan
    outputs: [{ id: 'arr_out', label: 'مصفوفة', type: 'data' }],
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
};
