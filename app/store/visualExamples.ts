import { Node, Edge } from '@xyflow/react';
import { nodeDefinitions } from '../components/AlifNodes';

export interface VisualExample {
  nodes: Node[];
  edges: Edge[];
  macros?: Record<string, { name: string; nodes: Node[]; edges: Edge[] }>;
}

export const visualExamples: Record<string, VisualExample> = {
  hello: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      { id: 'print', type: 'dynamic', position: { x: 50, y: 200 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { 
        id: 'text1', 
        type: 'dynamic', 
        position: { x: -300, y: 200 }, 
        data: { 
          ...nodeDefinitions['بيانات/نص'], 
          originalType: 'بيانات/نص', 
          controls: [{ id: 'value', type: 'text', label: 'النص', value: 'مرحباً بك في لغة ألف!' }] 
        } 
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'print', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'text1', target: 'print', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  loop: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      { 
        id: 'loop1', 
        type: 'dynamic', 
        position: { x: 50, y: 200 }, 
        data: { 
          ...nodeDefinitions['حلقات/لكل'], 
          originalType: 'حلقات/لكل', 
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'رقم' }] 
        } 
      },
      { 
        id: 'num0', 
        type: 'dynamic', 
        position: { x: -300, y: 150 }, 
        data: { 
          ...nodeDefinitions['بيانات/رقم'], 
          originalType: 'بيانات/رقم', 
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }] 
        } 
      },
      { 
        id: 'num5', 
        type: 'dynamic', 
        position: { x: -300, y: 300 }, 
        data: { 
          ...nodeDefinitions['بيانات/رقم'], 
          originalType: 'بيانات/رقم', 
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 5 }] 
        } 
      },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 400 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { 
        id: 'read_var', 
        type: 'dynamic', 
        position: { x: -300, y: 450 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة', 
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'رقم' }] 
        } 
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'loop1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'num0', target: 'loop1', sourceHandle: 'val_out', targetHandle: 'start_in' },
      { id: 'e3', type: 'deletable', source: 'num5', target: 'loop1', sourceHandle: 'val_out', targetHandle: 'end_in' },
      { id: 'e4', type: 'deletable', source: 'loop1', target: 'print1', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e5', type: 'deletable', source: 'read_var', target: 'print1', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  arrays: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      { 
        id: 'arr_assign', 
        type: 'dynamic', 
        position: { x: 50, y: 200 }, 
        data: { 
          ...nodeDefinitions['متغيرات/إسناد'], 
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'مصفوفة_أرقام' }] 
        } 
      },
      { 
        id: 'new_arr', 
        type: 'dynamic', 
        position: { x: -300, y: 200 }, 
        data: { ...nodeDefinitions['مصفوفات/جديدة'], originalType: 'مصفوفات/جديدة' } 
      },
      { 
        id: 'arr_insert', 
        type: 'dynamic', 
        position: { x: 50, y: 350 }, 
        data: { ...nodeDefinitions['مصفوفات/إدراج'], originalType: 'مصفوفات/إدراج' } 
      },
      { 
        id: 'read_arr', 
        type: 'dynamic', 
        position: { x: -300, y: 350 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'مصفوفة_أرقام' }] 
        } 
      },
      { 
        id: 'num_val', 
        type: 'dynamic', 
        position: { x: -300, y: 450 }, 
        data: { 
          ...nodeDefinitions['بيانات/رقم'], 
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 99 }] 
        } 
      },
      { id: 'print', type: 'dynamic', position: { x: 50, y: 500 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { 
        id: 'read_arr2', 
        type: 'dynamic', 
        position: { x: -300, y: 550 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'مصفوفة_أرقام' }] 
        } 
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'arr_assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'new_arr', target: 'arr_assign', sourceHandle: 'arr_out', targetHandle: 'val_in' },
      { id: 'e3', type: 'deletable', source: 'arr_assign', target: 'arr_insert', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e4', type: 'deletable', source: 'read_arr', target: 'arr_insert', sourceHandle: 'val_out', targetHandle: 'arr_in' },
      { id: 'e5', type: 'deletable', source: 'num_val', target: 'arr_insert', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e6', type: 'deletable', source: 'arr_insert', target: 'print', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e7', type: 'deletable', source: 'read_arr2', target: 'print', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  oop: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'class_def',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['كائنات/صنف'],
          originalType: 'كائنات/صنف',
          controls: [{ id: 'class_name', type: 'text', label: 'اسم الصنف', value: 'سيارة' }, { id: 'inherits', type: 'text', label: 'يرث من', value: '' }]
        }
      },
      {
        id: 'init_def',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: {
          ...nodeDefinitions['دوال/تعريف دالة'],
          originalType: 'دوال/تعريف دالة',
          controls: [{ id: 'func_name', type: 'text', label: 'الاسم', value: '__تهيئة__' }, { id: 'arg', type: 'text', label: 'المعاملات (افصل بفاصلة ,)', value: 'هذا, السرعة' }]
        }
      },
      {
        id: 'set_prop',
        type: 'dynamic',
        position: { x: 650, y: 200 },
        data: {
          ...nodeDefinitions['كائنات/تعيين_خاصية'],
          originalType: 'كائنات/تعيين_خاصية',
          controls: [{ id: 'prop_name', type: 'text', label: 'الخاصية', value: 'السرعة' }]
        }
      },
      {
        id: 'read_speed',
        type: 'dynamic',
        position: { x: 650, y: 350 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'السرعة' }]
        }
      },
      {
        id: 'obj_assign',
        type: 'dynamic',
        position: { x: 50, y: 400 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'سيارتي' }]
        }
      },
      {
        id: 'create_obj',
        type: 'dynamic',
        position: { x: -300, y: 400 },
        data: {
          ...nodeDefinitions['كائنات/إنشاء'],
          originalType: 'كائنات/إنشاء',
          controls: [{ id: 'class_name', type: 'text', label: 'اسم الصنف', value: 'سيارة' }]
        }
      },
      {
        id: 'num_val',
        type: 'dynamic',
        position: { x: -300, y: 520 },
        data: {
          ...nodeDefinitions['بيانات/رقم'],
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 200 }]
        }
      },
      { id: 'print', type: 'dynamic', position: { x: 50, y: 560 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_prop',
        type: 'dynamic',
        position: { x: -300, y: 620 },
        data: {
          ...nodeDefinitions['كائنات/هذا'],
          originalType: 'كائنات/هذا',
          controls: [{ id: 'prop_name', type: 'text', label: 'الاسم', value: 'السرعة' }]
        }
      },
      {
        id: 'read_car',
        type: 'dynamic',
        position: { x: -600, y: 620 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'سيارتي' }]
        }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'class_def', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'class_def', target: 'init_def', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e3', type: 'deletable', source: 'init_def', target: 'set_prop', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e4', type: 'deletable', source: 'read_speed', target: 'set_prop', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e5', type: 'deletable', source: 'class_def', target: 'obj_assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e6', type: 'deletable', source: 'num_val', target: 'create_obj', sourceHandle: 'val_out', targetHandle: 'arg_in' },
      { id: 'e7', type: 'deletable', source: 'create_obj', target: 'obj_assign', sourceHandle: 'obj_out', targetHandle: 'val_in' },
      { id: 'e8', type: 'deletable', source: 'obj_assign', target: 'print', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e9', type: 'deletable', source: 'read_car', target: 'read_prop', sourceHandle: 'val_out', targetHandle: 'obj_in' },
      { id: 'e10', type: 'deletable', source: 'read_prop', target: 'print', sourceHandle: 'res_out', targetHandle: 'val_in' }
    ]
  },
  dict: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      { 
        id: 'dict_assign', 
        type: 'dynamic', 
        position: { x: 50, y: 200 }, 
        data: { 
          ...nodeDefinitions['متغيرات/إسناد'], 
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'قاموس_جديد' }] 
        } 
      },
      { 
        id: 'new_dict', 
        type: 'dynamic', 
        position: { x: -300, y: 200 }, 
        data: { ...nodeDefinitions['فهارس/جديد'], originalType: 'فهارس/جديد' } 
      },
      { 
        id: 'dict_add', 
        type: 'dynamic', 
        position: { x: 50, y: 350 }, 
        data: { ...nodeDefinitions['فهارس/إضافة'], originalType: 'فهارس/إضافة' } 
      },
      { 
        id: 'read_dict', 
        type: 'dynamic', 
        position: { x: -300, y: 350 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'قاموس_جديد' }] 
        } 
      },
      { 
        id: 'key_val', 
        type: 'dynamic', 
        position: { x: -300, y: 450 }, 
        data: { 
          ...nodeDefinitions['بيانات/نص'], 
          originalType: 'بيانات/نص',
          controls: [{ id: 'value', type: 'text', label: 'النص', value: 'مفتاح_سري' }] 
        } 
      },
      { 
        id: 'val_val', 
        type: 'dynamic', 
        position: { x: -300, y: 550 }, 
        data: { 
          ...nodeDefinitions['بيانات/رقم'], 
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 777 }] 
        } 
      },
      { id: 'print', type: 'dynamic', position: { x: 50, y: 700 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { 
        id: 'read_dict2', 
        type: 'dynamic', 
        position: { x: -300, y: 700 }, 
        data: { 
          ...nodeDefinitions['فهارس/مفاتيح_وقيم'], 
          originalType: 'فهارس/مفاتيح_وقيم',
          controls: [{ id: 'type', type: 'select', label: 'استخراج', value: 'مفاتيح', options: ['مفاتيح', 'قيم'] }] 
        } 
      },
      { 
        id: 'read_dict_var', 
        type: 'dynamic', 
        position: { x: -600, y: 700 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'قاموس_جديد' }] 
        } 
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'dict_assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'new_dict', target: 'dict_assign', sourceHandle: 'dict_out', targetHandle: 'val_in' },
      { id: 'e3', type: 'deletable', source: 'dict_assign', target: 'dict_add', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e4', type: 'deletable', source: 'read_dict', target: 'dict_add', sourceHandle: 'val_out', targetHandle: 'dict_in' },
      { id: 'e5', type: 'deletable', source: 'key_val', target: 'dict_add', sourceHandle: 'val_out', targetHandle: 'key_in' },
      { id: 'e6', type: 'deletable', source: 'val_val', target: 'dict_add', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e7', type: 'deletable', source: 'dict_add', target: 'print', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e8', type: 'deletable', source: 'read_dict2', target: 'print', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e9', type: 'deletable', source: 'read_dict_var', target: 'read_dict2', sourceHandle: 'val_out', targetHandle: 'dict_in' }
    ]
  },
  cond: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      { 
        id: 'var_assign', 
        type: 'dynamic', 
        position: { x: 50, y: 200 }, 
        data: { 
          ...nodeDefinitions['متغيرات/إسناد'], 
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'الدرجة' }] 
        } 
      },
      { 
        id: 'grade_val', 
        type: 'dynamic', 
        position: { x: -300, y: 200 }, 
        data: { 
          ...nodeDefinitions['بيانات/رقم'], 
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 85 }] 
        } 
      },
      { 
        id: 'if_node', 
        type: 'dynamic', 
        position: { x: 50, y: 350 }, 
        data: { ...nodeDefinitions['شروط/اذا'], originalType: 'شروط/اذا' } 
      },
      { 
        id: 'cond_logic', 
        type: 'dynamic', 
        position: { x: -300, y: 350 }, 
        data: { 
          ...nodeDefinitions['شروط/مقارنة'], 
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '>=', options: ['==', '!=', '>', '<', '>=', '<='] }] 
        } 
      },
      { 
        id: 'read_grade', 
        type: 'dynamic', 
        position: { x: -600, y: 350 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'الدرجة' }] 
        } 
      },
      { 
        id: 'num_80', 
        type: 'dynamic', 
        position: { x: -600, y: 450 }, 
        data: { 
          ...nodeDefinitions['بيانات/رقم'], 
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 80 }] 
        } 
      },
      { id: 'print_good', type: 'dynamic', position: { x: 300, y: 500 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { 
        id: 'text_good', 
        type: 'dynamic', 
        position: { x: 300, y: 650 }, 
        data: { 
          ...nodeDefinitions['بيانات/نص'], 
          originalType: 'بيانات/نص',
          controls: [{ id: 'value', type: 'text', label: 'النص', value: 'الدرجة 80 أو أكثر: جيد جداً' }] 
        } 
      },
      { id: 'print_bad', type: 'dynamic', position: { x: -100, y: 500 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { 
        id: 'text_bad', 
        type: 'dynamic', 
        position: { x: -100, y: 650 }, 
        data: { 
          ...nodeDefinitions['بيانات/نص'], 
          originalType: 'بيانات/نص',
          controls: [{ id: 'value', type: 'text', label: 'النص', value: 'الدرجة أقل من 80: تحتاج إلى مزيد من الجهد' }] 
        } 
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'var_assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'grade_val', target: 'var_assign', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e3', type: 'deletable', source: 'var_assign', target: 'if_node', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e4', type: 'deletable', source: 'cond_logic', target: 'if_node', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e5', type: 'deletable', source: 'read_grade', target: 'cond_logic', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e6', type: 'deletable', source: 'num_80', target: 'cond_logic', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e7', type: 'deletable', source: 'if_node', target: 'print_good', sourceHandle: 'true_out', targetHandle: 'seq_in' },
      { id: 'e8', type: 'deletable', source: 'if_node', target: 'print_bad', sourceHandle: 'false_out', targetHandle: 'seq_in' },
      { id: 'e9', type: 'deletable', source: 'text_good', target: 'print_good', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e10', type: 'deletable', source: 'text_bad', target: 'print_bad', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  func: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      { 
        id: 'func_def', 
        type: 'dynamic', 
        position: { x: 50, y: 200 }, 
        data: { 
          ...nodeDefinitions['دوال/تعريف دالة'], 
          originalType: 'دوال/تعريف دالة',
          controls: [{ id: 'func_name', type: 'text', label: 'الاسم', value: 'حساب_المربع' }, { id: 'arg', type: 'text', label: 'المعامل', value: 'العدد' }] 
        } 
      },
      { 
        id: 'func_ret', 
        type: 'dynamic', 
        position: { x: 300, y: 350 }, 
        data: { ...nodeDefinitions['دوال/إرجاع'], originalType: 'دوال/إرجاع' } 
      },
      { 
        id: 'math_op', 
        type: 'dynamic', 
        position: { x: 550, y: 350 }, 
        data: { 
          ...nodeDefinitions['بيانات/حساب'], 
          originalType: 'بيانات/حساب',
          controls: [{ id: 'op', type: 'select', label: 'عملية', value: '*', options: ['+', '-', '*', '\\', '\\\\', '\\*', '^'] }] 
        } 
      },
      { 
        id: 'read_param1', 
        type: 'dynamic', 
        position: { x: 800, y: 350 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'العدد' }] 
        } 
      },
      { 
        id: 'read_param2', 
        type: 'dynamic', 
        position: { x: 800, y: 450 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'العدد' }] 
        } 
      },
      { id: 'print', type: 'dynamic', position: { x: 50, y: 400 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { 
        id: 'call_func', 
        type: 'dynamic', 
        position: { x: -300, y: 400 }, 
        data: { 
          ...nodeDefinitions['دوال/استدعاء'], 
          originalType: 'دوال/استدعاء',
          controls: [{ id: 'func_name', type: 'text', label: 'الاسم', value: 'حساب_المربع' }] 
        } 
      },
      { 
        id: 'arg_val', 
        type: 'dynamic', 
        position: { x: -550, y: 400 }, 
        data: { 
          ...nodeDefinitions['بيانات/رقم'], 
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 6 }] 
        } 
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'func_def', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'func_def', target: 'func_ret', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e3', type: 'deletable', source: 'math_op', target: 'func_ret', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e4', type: 'deletable', source: 'read_param1', target: 'math_op', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e5', type: 'deletable', source: 'read_param2', target: 'math_op', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e6', type: 'deletable', source: 'func_def', target: 'print', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e7', type: 'deletable', source: 'call_func', target: 'print', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e8', type: 'deletable', source: 'arg_val', target: 'call_func', sourceHandle: 'val_out', targetHandle: 'arg_in' }
    ]
  },
  trycatch: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'class_def',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['كائنات/صنف'],
          originalType: 'كائنات/صنف',
          controls: [{ id: 'class_name', type: 'text', label: 'اسم الصنف', value: 'سيارة' }, { id: 'inherits', type: 'text', label: 'يرث من', value: '' }]
        }
      },
      {
        id: 'init_def',
        type: 'dynamic',
        position: { x: 350, y: 200 },
        data: {
          ...nodeDefinitions['دوال/تعريف دالة'],
          originalType: 'دوال/تعريف دالة',
          controls: [{ id: 'func_name', type: 'text', label: 'الاسم', value: '__تهيئة__' }, { id: 'arg', type: 'text', label: 'المعاملات (افصل بفاصلة ,)', value: 'هذا, السرعة' }]
        }
      },
      {
        id: 'set_prop',
        type: 'dynamic',
        position: { x: 650, y: 200 },
        data: {
          ...nodeDefinitions['كائنات/تعيين_خاصية'],
          originalType: 'كائنات/تعيين_خاصية',
          controls: [{ id: 'prop_name', type: 'text', label: 'الخاصية', value: 'السرعة' }]
        }
      },
      {
        id: 'read_speed',
        type: 'dynamic',
        position: { x: 650, y: 350 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'السرعة' }]
        }
      },
      {
        id: 'obj_assign',
        type: 'dynamic',
        position: { x: 50, y: 400 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'السيارة' }]
        }
      },
      {
        id: 'create_obj',
        type: 'dynamic',
        position: { x: -300, y: 400 },
        data: {
          ...nodeDefinitions['كائنات/إنشاء'],
          originalType: 'كائنات/إنشاء',
          controls: [{ id: 'class_name', type: 'text', label: 'اسم الصنف', value: 'سيارة' }]
        }
      },
      {
        id: 'num240', type: 'dynamic', position: { x: -300, y: 520 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 240 }] }
      },
      { id: 'try_node', type: 'dynamic', position: { x: 50, y: 600 }, data: { ...nodeDefinitions['أخطاء/محاولة'], originalType: 'أخطاء/محاولة' } },
      { id: 'print_try', type: 'dynamic', position: { x: 350, y: 700 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_attr',
        type: 'dynamic',
        position: { x: 50, y: 750 },
        data: {
          ...nodeDefinitions['كائنات/هذا'],
          originalType: 'كائنات/هذا',
          controls: [{ id: 'prop_name', type: 'text', label: 'الاسم', value: 'الوزن' }]
        }
      },
      {
        id: 'read_car',
        type: 'dynamic',
        position: { x: -300, y: 750 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'السيارة' }]
        }
      },
      { id: 'print_catch', type: 'dynamic', position: { x: 50, y: 900 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'text_catch',
        type: 'dynamic',
        position: { x: 50, y: 1050 },
        data: {
          ...nodeDefinitions['بيانات/نص'],
          originalType: 'بيانات/نص',
          controls: [{ id: 'value', type: 'text', label: 'النص', value: 'حدث خطأ وتم التقاطه!' }]
        }
      },
      { id: 'print_else', type: 'dynamic', position: { x: -300, y: 900 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'text_else',
        type: 'dynamic',
        position: { x: -300, y: 1050 },
        data: {
          ...nodeDefinitions['بيانات/نص'],
          originalType: 'بيانات/نص',
          controls: [{ id: 'value', type: 'text', label: 'النص', value: 'لا يوجد خلل' }]
        }
      },
      { id: 'print_finally', type: 'dynamic', position: { x: -650, y: 900 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'text_finally',
        type: 'dynamic',
        position: { x: -650, y: 1050 },
        data: {
          ...nodeDefinitions['بيانات/نص'],
          originalType: 'بيانات/نص',
          controls: [{ id: 'value', type: 'text', label: 'النص', value: 'الجزء (نهاية) يتنفذ دائماً' }]
        }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'class_def', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'class_def', target: 'init_def', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e3', type: 'deletable', source: 'init_def', target: 'set_prop', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e4', type: 'deletable', source: 'read_speed', target: 'set_prop', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e5', type: 'deletable', source: 'class_def', target: 'obj_assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e6', type: 'deletable', source: 'num240', target: 'create_obj', sourceHandle: 'val_out', targetHandle: 'arg_in' },
      { id: 'e7', type: 'deletable', source: 'create_obj', target: 'obj_assign', sourceHandle: 'obj_out', targetHandle: 'val_in' },
      { id: 'e8', type: 'deletable', source: 'obj_assign', target: 'try_node', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e9', type: 'deletable', source: 'try_node', target: 'print_try', sourceHandle: 'try_out', targetHandle: 'seq_in' },
      { id: 'e10', type: 'deletable', source: 'read_attr', target: 'print_try', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e11', type: 'deletable', source: 'read_car', target: 'read_attr', sourceHandle: 'val_out', targetHandle: 'obj_in' },
      { id: 'e12', type: 'deletable', source: 'try_node', target: 'print_catch', sourceHandle: 'catch_out', targetHandle: 'seq_in' },
      { id: 'e13', type: 'deletable', source: 'text_catch', target: 'print_catch', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e14', type: 'deletable', source: 'try_node', target: 'print_else', sourceHandle: 'else_out', targetHandle: 'seq_in' },
      { id: 'e15', type: 'deletable', source: 'text_else', target: 'print_else', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e16', type: 'deletable', source: 'try_node', target: 'print_finally', sourceHandle: 'finally_out', targetHandle: 'seq_in' },
      { id: 'e17', type: 'deletable', source: 'text_finally', target: 'print_finally', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  input: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      { 
        id: 'assign_input', 
        type: 'dynamic', 
        position: { x: 50, y: 200 }, 
        data: { 
          ...nodeDefinitions['متغيرات/إسناد'], 
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'الاسم' }] 
        } 
      },
      { 
        id: 'user_input', 
        type: 'dynamic', 
        position: { x: -300, y: 200 }, 
        data: { 
          ...nodeDefinitions['أوامر/إدخال مستخدم'], 
          originalType: 'أوامر/إدخال مستخدم',
          controls: [{ id: 'prompt', type: 'text', label: 'الرسالة', value: 'أدخل اسمك:' }]
        } 
      },
      { id: 'print', type: 'dynamic', position: { x: 50, y: 350 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { 
        id: 'read_input', 
        type: 'dynamic', 
        position: { x: -300, y: 350 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'الاسم' }] 
        } 
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'assign_input', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'user_input', target: 'assign_input', sourceHandle: 'res_out', targetHandle: 'val_in' },
      
      { id: 'e4', type: 'deletable', source: 'assign_input', target: 'print', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e5', type: 'deletable', source: 'read_input', target: 'print', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  while: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'assign',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'العد' }]
        }
      },
      {
        id: 'num3',
        type: 'dynamic',
        position: { x: -300, y: 200 },
        data: {
          ...nodeDefinitions['بيانات/رقم'],
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 3 }]
        }
      },
      { id: 'while1', type: 'dynamic', position: { x: 50, y: 350 }, data: { ...nodeDefinitions['حلقات/بينما'], originalType: 'حلقات/بينما' } },
      {
        id: 'cmp',
        type: 'dynamic',
        position: { x: -300, y: 350 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '>', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'read_c1',
        type: 'dynamic',
        position: { x: -600, y: 330 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'العد' }]
        }
      },
      {
        id: 'num0',
        type: 'dynamic',
        position: { x: -600, y: 430 },
        data: {
          ...nodeDefinitions['بيانات/رقم'],
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 0 }]
        }
      },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 520 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_c2',
        type: 'dynamic',
        position: { x: -300, y: 520 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'العد' }]
        }
      },
      {
        id: 'retro',
        type: 'dynamic',
        position: { x: 50, y: 670 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد رجعي'],
          originalType: 'متغيرات/إسناد رجعي',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'العد' }, { id: 'op', type: 'select', label: 'العملية', value: '-=', options: ['+=', '-=', '*=', '\\=', '\\\\=', '\\*=', '^='] }]
        }
      },
      {
        id: 'num1',
        type: 'dynamic',
        position: { x: -300, y: 670 },
        data: {
          ...nodeDefinitions['بيانات/رقم'],
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }]
        }
      },
      { id: 'print_end', type: 'dynamic', position: { x: 50, y: 820 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'text_end',
        type: 'dynamic',
        position: { x: -300, y: 820 },
        data: {
          ...nodeDefinitions['بيانات/نص'],
          originalType: 'بيانات/نص',
          controls: [{ id: 'value', type: 'text', label: 'النص', value: 'انطلاق!' }]
        }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'num3', target: 'assign', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e3', type: 'deletable', source: 'assign', target: 'while1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e4', type: 'deletable', source: 'cmp', target: 'while1', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e5', type: 'deletable', source: 'read_c1', target: 'cmp', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e6', type: 'deletable', source: 'num0', target: 'cmp', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e7', type: 'deletable', source: 'while1', target: 'print1', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e8', type: 'deletable', source: 'read_c2', target: 'print1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e9', type: 'deletable', source: 'print1', target: 'retro', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e10', type: 'deletable', source: 'num1', target: 'retro', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e11', type: 'deletable', source: 'while1', target: 'print_end', sourceHandle: 'done_out', targetHandle: 'seq_in' },
      { id: 'e12', type: 'deletable', source: 'text_end', target: 'print_end', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  logic: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'cmp1',
        type: 'dynamic',
        position: { x: -300, y: 150 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '>', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'cmp2',
        type: 'dynamic',
        position: { x: -300, y: 300 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '<', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'n5', type: 'dynamic', position: { x: -600, y: 120 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 5 }] }
      },
      {
        id: 'n3', type: 'dynamic', position: { x: -600, y: 220 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 3 }] }
      },
      {
        id: 'n2a', type: 'dynamic', position: { x: -600, y: 320 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 2 }] }
      },
      {
        id: 'n4', type: 'dynamic', position: { x: -600, y: 420 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 4 }] }
      },
      {
        id: 'and1',
        type: 'dynamic',
        position: { x: -300, y: 470 },
        data: {
          ...nodeDefinitions['شروط/عملية منطقية'],
          originalType: 'شروط/عملية منطقية',
          controls: [{ id: 'op', type: 'select', label: 'عملية', value: 'و', options: ['و', 'أو'] }]
        }
      },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 200 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'not1', type: 'dynamic', position: { x: -300, y: 600 }, data: { ...nodeDefinitions['شروط/ليس'], originalType: 'شروط/ليس' } },
      {
        id: 'bool1',
        type: 'dynamic',
        position: { x: -600, y: 600 },
        data: {
          ...nodeDefinitions['بيانات/منطق'],
          originalType: 'بيانات/منطق',
          controls: [{ id: 'value', type: 'select', label: 'منطق', value: 'صح', options: ['صح', 'خطأ'] }]
        }
      },
      { id: 'print2', type: 'dynamic', position: { x: 50, y: 350 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'mem1',
        type: 'dynamic',
        position: { x: -300, y: 730 },
        data: {
          ...nodeDefinitions['شروط/انتماء'],
          originalType: 'شروط/انتماء',
          controls: [{ id: 'op', type: 'select', label: 'العملية', value: 'في', options: ['في', 'ليس في'] }]
        }
      },
      {
        id: 'n2b', type: 'dynamic', position: { x: -600, y: 700 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 2 }] }
      },
      {
        id: 'arr123',
        type: 'dynamic',
        position: { x: -600, y: 800 },
        data: {
          ...nodeDefinitions['مصفوفات/جديدة'],
          originalType: 'مصفوفات/جديدة',
          inputs: [
            { id: 'item_0', label: 'عنصر 1', type: 'data' },
            { id: 'item_1', label: 'عنصر 2', type: 'data' },
            { id: 'item_2', label: 'عنصر 3', type: 'data' }
          ]
        }
      },
      {
        id: 'a1', type: 'dynamic', position: { x: -850, y: 770 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }] }
      },
      {
        id: 'a2', type: 'dynamic', position: { x: -850, y: 850 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 2 }] }
      },
      {
        id: 'a3', type: 'dynamic', position: { x: -850, y: 930 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 3 }] }
      },
      { id: 'print3', type: 'dynamic', position: { x: 50, y: 500 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'print1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'n5', target: 'cmp1', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e3', type: 'deletable', source: 'n3', target: 'cmp1', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e4', type: 'deletable', source: 'n2a', target: 'cmp2', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e5', type: 'deletable', source: 'n4', target: 'cmp2', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e6', type: 'deletable', source: 'cmp1', target: 'and1', sourceHandle: 'res_out', targetHandle: 'a_in' },
      { id: 'e7', type: 'deletable', source: 'cmp2', target: 'and1', sourceHandle: 'res_out', targetHandle: 'b_in' },
      { id: 'e8', type: 'deletable', source: 'and1', target: 'print1', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e9', type: 'deletable', source: 'print1', target: 'print2', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e10', type: 'deletable', source: 'bool1', target: 'not1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e11', type: 'deletable', source: 'not1', target: 'print2', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e12', type: 'deletable', source: 'print2', target: 'print3', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e13', type: 'deletable', source: 'n2b', target: 'mem1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e14', type: 'deletable', source: 'arr123', target: 'mem1', sourceHandle: 'arr_out', targetHandle: 'list_in' },
      { id: 'e15', type: 'deletable', source: 'a1', target: 'arr123', sourceHandle: 'val_out', targetHandle: 'item_0' },
      { id: 'e16', type: 'deletable', source: 'a2', target: 'arr123', sourceHandle: 'val_out', targetHandle: 'item_1' },
      { id: 'e17', type: 'deletable', source: 'a3', target: 'arr123', sourceHandle: 'val_out', targetHandle: 'item_2' },
      { id: 'e18', type: 'deletable', source: 'mem1', target: 'print3', sourceHandle: 'res_out', targetHandle: 'val_in' }
    ]
  },
  strings: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'raw',
        type: 'dynamic',
        position: { x: -300, y: 150 },
        data: {
          ...nodeDefinitions['بيانات/نص'],
          originalType: 'بيانات/نص',
          controls: [{ id: 'value', type: 'text', label: 'النص', value: 'السلام,عليكم' }]
        }
      },
      {
        id: 'comma',
        type: 'dynamic',
        position: { x: -600, y: 150 },
        data: {
          ...nodeDefinitions['بيانات/نص'],
          originalType: 'بيانات/نص',
          controls: [{ id: 'value', type: 'text', label: 'النص', value: ',' }]
        }
      },
      { id: 'split1', type: 'dynamic', position: { x: -300, y: 300 }, data: { ...nodeDefinitions['نصوص/تقسيم'], originalType: 'نصوص/تقسيم' } },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 200 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'cut1', type: 'dynamic', position: { x: -300, y: 450 }, data: { ...nodeDefinitions['نصوص/قص'], originalType: 'نصوص/قص' } },
      {
        id: 'num0', type: 'dynamic', position: { x: -600, y: 420 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 0 }] }
      },
      {
        id: 'num6', type: 'dynamic', position: { x: -600, y: 500 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 6 }] }
      },
      { id: 'print2', type: 'dynamic', position: { x: 50, y: 350 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'repl1', type: 'dynamic', position: { x: -300, y: 600 }, data: { ...nodeDefinitions['نصوص/استبدال'], originalType: 'نصوص/استبدال' } },
      {
        id: 'old1',
        type: 'dynamic',
        position: { x: -600, y: 570 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'عليكم' }] }
      },
      {
        id: 'new1',
        type: 'dynamic',
        position: { x: -600, y: 650 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'أهلا' }] }
      },
      { id: 'print3', type: 'dynamic', position: { x: 50, y: 500 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'find1', type: 'dynamic', position: { x: -300, y: 750 }, data: { ...nodeDefinitions['نصوص/اوجد'], originalType: 'نصوص/اوجد' } },
      { id: 'print4', type: 'dynamic', position: { x: 50, y: 650 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'count1', type: 'dynamic', position: { x: -300, y: 900 }, data: { ...nodeDefinitions['نصوص/عدد'], originalType: 'نصوص/عدد' } },
      {
        id: 'la1',
        type: 'dynamic',
        position: { x: -600, y: 870 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'لا لا' }] }
      },
      {
        id: 'la2',
        type: 'dynamic',
        position: { x: -600, y: 950 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'لا' }] }
      },
      { id: 'print5', type: 'dynamic', position: { x: 50, y: 800 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'join1', type: 'dynamic', position: { x: -300, y: 1050 }, data: { ...nodeDefinitions['نصوص/اربط'], originalType: 'نصوص/اربط' } },
      {
        id: 'dash1',
        type: 'dynamic',
        position: { x: -600, y: 1020 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: '-' }] }
      },
      {
        id: 'arrAB',
        type: 'dynamic',
        position: { x: -600, y: 1100 },
        data: {
          ...nodeDefinitions['مصفوفات/جديدة'],
          originalType: 'مصفوفات/جديدة',
          inputs: [
            { id: 'item_0', label: 'عنصر 1', type: 'data' },
            { id: 'item_1', label: 'عنصر 2', type: 'data' }
          ]
        }
      },
      {
        id: 'ta1',
        type: 'dynamic',
        position: { x: -850, y: 1070 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'أ' }] }
      },
      {
        id: 'tb1',
        type: 'dynamic',
        position: { x: -850, y: 1150 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'ب' }] }
      },
      { id: 'print6', type: 'dynamic', position: { x: 50, y: 950 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'len1', type: 'dynamic', position: { x: -300, y: 1200 }, data: { ...nodeDefinitions['دوال/طول'], originalType: 'دوال/طول' } },
      { id: 'print7', type: 'dynamic', position: { x: 50, y: 1100 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'print1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'raw', target: 'split1', sourceHandle: 'val_out', targetHandle: 'str_in' },
      { id: 'e3', type: 'deletable', source: 'comma', target: 'split1', sourceHandle: 'val_out', targetHandle: 'sep_in' },
      { id: 'e4', type: 'deletable', source: 'split1', target: 'print1', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e5', type: 'deletable', source: 'print1', target: 'print2', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e6', type: 'deletable', source: 'raw', target: 'cut1', sourceHandle: 'val_out', targetHandle: 'str_in' },
      { id: 'e7', type: 'deletable', source: 'num0', target: 'cut1', sourceHandle: 'val_out', targetHandle: 'start_in' },
      { id: 'e8', type: 'deletable', source: 'num6', target: 'cut1', sourceHandle: 'val_out', targetHandle: 'end_in' },
      { id: 'e9', type: 'deletable', source: 'cut1', target: 'print2', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e10', type: 'deletable', source: 'print2', target: 'print3', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e11', type: 'deletable', source: 'raw', target: 'repl1', sourceHandle: 'val_out', targetHandle: 'str_in' },
      { id: 'e12', type: 'deletable', source: 'old1', target: 'repl1', sourceHandle: 'val_out', targetHandle: 'old_in' },
      { id: 'e13', type: 'deletable', source: 'new1', target: 'repl1', sourceHandle: 'val_out', targetHandle: 'new_in' },
      { id: 'e14', type: 'deletable', source: 'repl1', target: 'print3', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e15', type: 'deletable', source: 'print3', target: 'print4', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e16', type: 'deletable', source: 'raw', target: 'find1', sourceHandle: 'val_out', targetHandle: 'str_in' },
      { id: 'e17', type: 'deletable', source: 'old1', target: 'find1', sourceHandle: 'val_out', targetHandle: 'target_in' },
      { id: 'e18', type: 'deletable', source: 'find1', target: 'print4', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e19', type: 'deletable', source: 'print4', target: 'print5', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e20', type: 'deletable', source: 'la1', target: 'count1', sourceHandle: 'val_out', targetHandle: 'str_in' },
      { id: 'e21', type: 'deletable', source: 'la2', target: 'count1', sourceHandle: 'val_out', targetHandle: 'target_in' },
      { id: 'e22', type: 'deletable', source: 'count1', target: 'print5', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e23', type: 'deletable', source: 'print5', target: 'print6', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e24', type: 'deletable', source: 'dash1', target: 'join1', sourceHandle: 'val_out', targetHandle: 'str_in' },
      { id: 'e25', type: 'deletable', source: 'arrAB', target: 'join1', sourceHandle: 'arr_out', targetHandle: 'target_in' },
      { id: 'e26', type: 'deletable', source: 'ta1', target: 'arrAB', sourceHandle: 'val_out', targetHandle: 'item_0' },
      { id: 'e27', type: 'deletable', source: 'tb1', target: 'arrAB', sourceHandle: 'val_out', targetHandle: 'item_1' },
      { id: 'e28', type: 'deletable', source: 'join1', target: 'print6', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e29', type: 'deletable', source: 'print6', target: 'print7', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e30', type: 'deletable', source: 'raw', target: 'len1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e31', type: 'deletable', source: 'len1', target: 'print7', sourceHandle: 'res_out', targetHandle: 'val_in' }
    ]
  },
  advarr: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'arr_new',
        type: 'dynamic',
        position: { x: -300, y: 200 },
        data: {
          ...nodeDefinitions['مصفوفات/جديدة'],
          originalType: 'مصفوفات/جديدة',
          inputs: [
            { id: 'item_0', label: 'عنصر 1', type: 'data' },
            { id: 'item_1', label: 'عنصر 2', type: 'data' },
            { id: 'item_2', label: 'عنصر 3', type: 'data' }
          ]
        }
      },
      {
        id: 'v3', type: 'dynamic', position: { x: -600, y: 150 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 3 }] }
      },
      {
        id: 'v1', type: 'dynamic', position: { x: -600, y: 230 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }] }
      },
      {
        id: 'v2', type: 'dynamic', position: { x: -600, y: 310 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 2 }] }
      },
      {
        id: 'assign',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }]
        }
      },
      { id: 'add1', type: 'dynamic', position: { x: 50, y: 350 }, data: { ...nodeDefinitions['مصفوفات/إضافة'], originalType: 'مصفوفات/إضافة' } },
      {
        id: 'read_a1',
        type: 'dynamic',
        position: { x: -300, y: 350 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }]
        }
      },
      {
        id: 'num9', type: 'dynamic', position: { x: -300, y: 430 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 9 }] }
      },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 500 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_a2',
        type: 'dynamic',
        position: { x: -300, y: 500 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }]
        }
      },
      { id: 'sort1', type: 'dynamic', position: { x: 50, y: 650 }, data: { ...nodeDefinitions['مصفوفات/ترتيب'], originalType: 'مصفوفات/ترتيب' } },
      {
        id: 'read_a3',
        type: 'dynamic',
        position: { x: -300, y: 650 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }]
        }
      },
      { id: 'print2', type: 'dynamic', position: { x: 50, y: 800 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_a4',
        type: 'dynamic',
        position: { x: -300, y: 800 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }]
        }
      },
      { id: 'print3', type: 'dynamic', position: { x: 50, y: 950 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_a6',
        type: 'dynamic',
        position: { x: -300, y: 1100 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }]
        }
      },
      { id: 'read0', type: 'dynamic', position: { x: -300, y: 1200 }, data: { ...nodeDefinitions['مصفوفات/قراءة'], originalType: 'مصفوفات/قراءة' } },
      {
        id: 'read_a7',
        type: 'dynamic',
        position: { x: -600, y: 1180 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }]
        }
      },
      {
        id: 'idx0', type: 'dynamic', position: { x: -600, y: 1260 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 0 }] }
      },
      { id: 'print4', type: 'dynamic', position: { x: 50, y: 1250 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'mod1', type: 'dynamic', position: { x: 50, y: 1400 }, data: { ...nodeDefinitions['مصفوفات/تعديل عنصر'], originalType: 'مصفوفات/تعديل عنصر' } },
      {
        id: 'read_a8',
        type: 'dynamic',
        position: { x: -300, y: 1380 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }]
        }
      },
      {
        id: 'idx0b', type: 'dynamic', position: { x: -300, y: 1440 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 0 }] }
      },
      {
        id: 'num99', type: 'dynamic', position: { x: -300, y: 1500 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 99 }] }
      },
      { id: 'print5', type: 'dynamic', position: { x: 50, y: 1550 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_a9',
        type: 'dynamic',
        position: { x: -300, y: 1550 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }]
        }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'v3', target: 'arr_new', sourceHandle: 'val_out', targetHandle: 'item_0' },
      { id: 'e2', type: 'deletable', source: 'v1', target: 'arr_new', sourceHandle: 'val_out', targetHandle: 'item_1' },
      { id: 'e3', type: 'deletable', source: 'v2', target: 'arr_new', sourceHandle: 'val_out', targetHandle: 'item_2' },
      { id: 'e4', type: 'deletable', source: 'start', target: 'assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e5', type: 'deletable', source: 'arr_new', target: 'assign', sourceHandle: 'arr_out', targetHandle: 'val_in' },
      { id: 'e6', type: 'deletable', source: 'assign', target: 'add1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e7', type: 'deletable', source: 'read_a1', target: 'add1', sourceHandle: 'val_out', targetHandle: 'arr_in' },
      { id: 'e8', type: 'deletable', source: 'num9', target: 'add1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e9', type: 'deletable', source: 'add1', target: 'print1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e10', type: 'deletable', source: 'read_a2', target: 'print1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e11', type: 'deletable', source: 'print1', target: 'sort1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e12', type: 'deletable', source: 'read_a3', target: 'sort1', sourceHandle: 'val_out', targetHandle: 'arr_in' },
      { id: 'e13', type: 'deletable', source: 'sort1', target: 'print2', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e14', type: 'deletable', source: 'read_a4', target: 'print2', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e15', type: 'deletable', source: 'print2', target: 'print3', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e16', type: 'deletable', source: 'read_a6', target: 'print3', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e19', type: 'deletable', source: 'print3', target: 'print4', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e20', type: 'deletable', source: 'read_a7', target: 'read0', sourceHandle: 'val_out', targetHandle: 'arr_in' },
      { id: 'e21', type: 'deletable', source: 'idx0', target: 'read0', sourceHandle: 'val_out', targetHandle: 'idx_in' },
      { id: 'e22', type: 'deletable', source: 'read0', target: 'print4', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e23', type: 'deletable', source: 'print4', target: 'mod1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e24', type: 'deletable', source: 'read_a8', target: 'mod1', sourceHandle: 'val_out', targetHandle: 'arr_in' },
      { id: 'e25', type: 'deletable', source: 'idx0b', target: 'mod1', sourceHandle: 'val_out', targetHandle: 'idx_in' },
      { id: 'e26', type: 'deletable', source: 'num99', target: 'mod1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e27', type: 'deletable', source: 'mod1', target: 'print5', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e28', type: 'deletable', source: 'read_a9', target: 'print5', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  advdict: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'new_dict',
        type: 'dynamic',
        position: { x: -300, y: 200 },
        data: {
          ...nodeDefinitions['فهارس/جديد'],
          originalType: 'فهارس/جديد',
          inputs: [
            { id: 'key_0', label: 'مفتاح 1', type: 'data' },
            { id: 'val_0', label: 'قيمة 1', type: 'data' }
          ]
        }
      },
      {
        id: 'k_name',
        type: 'dynamic',
        position: { x: -600, y: 170 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'اسم' }] }
      },
      {
        id: 'v_name',
        type: 'dynamic',
        position: { x: -600, y: 250 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'أحمد' }] }
      },
      {
        id: 'assign',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'طالب' }]
        }
      },
      { id: 'dict_add', type: 'dynamic', position: { x: 50, y: 350 }, data: { ...nodeDefinitions['فهارس/إضافة'], originalType: 'فهارس/إضافة' } },
      {
        id: 'read_d1',
        type: 'dynamic',
        position: { x: -300, y: 330 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'طالب' }]
        }
      },
      {
        id: 'k_avg',
        type: 'dynamic',
        position: { x: -300, y: 420 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'معدل' }] }
      },
      {
        id: 'n94', type: 'dynamic', position: { x: -300, y: 500 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 94 }] }
      },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 550 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'dict_read', type: 'dynamic', position: { x: -300, y: 600 }, data: { ...nodeDefinitions['فهارس/قراءة'], originalType: 'فهارس/قراءة' } },
      {
        id: 'read_d2',
        type: 'dynamic',
        position: { x: -600, y: 580 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'طالب' }]
        }
      },
      {
        id: 'k_avg2',
        type: 'dynamic',
        position: { x: -600, y: 660 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'معدل' }] }
      },
      { id: 'print2', type: 'dynamic', position: { x: 50, y: 700 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'dict_get', type: 'dynamic', position: { x: -300, y: 750 }, data: { ...nodeDefinitions['فهارس/احضر'], originalType: 'فهارس/احضر' } },
      {
        id: 'read_d3',
        type: 'dynamic',
        position: { x: -600, y: 730 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'طالب' }]
        }
      },
      {
        id: 'k_city',
        type: 'dynamic',
        position: { x: -600, y: 810 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'مدينة' }] }
      },
      {
        id: 'v_def',
        type: 'dynamic',
        position: { x: -600, y: 890 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'غير مسجلة' }] }
      },
      { id: 'print3', type: 'dynamic', position: { x: 50, y: 850 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'dict_has', type: 'dynamic', position: { x: -300, y: 1000 }, data: { ...nodeDefinitions['فهارس/فحص مفتاح'], originalType: 'فهارس/فحص مفتاح' } },
      {
        id: 'read_d4',
        type: 'dynamic',
        position: { x: -600, y: 980 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'طالب' }]
        }
      },
      {
        id: 'k_name2',
        type: 'dynamic',
        position: { x: -600, y: 1060 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'اسم' }] }
      },
      { id: 'dict_del', type: 'dynamic', position: { x: 50, y: 1000 }, data: { ...nodeDefinitions['فهارس/حذف مفتاح'], originalType: 'فهارس/حذف مفتاح' } },
      {
        id: 'read_d5',
        type: 'dynamic',
        position: { x: -300, y: 1130 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'طالب' }]
        }
      },
      {
        id: 'k_avg3',
        type: 'dynamic',
        position: { x: -300, y: 1210 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'معدل' }] }
      },
      { id: 'print4', type: 'dynamic', position: { x: 50, y: 1150 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_d6',
        type: 'dynamic',
        position: { x: -300, y: 1290 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'طالب' }]
        }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'k_name', target: 'new_dict', sourceHandle: 'val_out', targetHandle: 'key_0' },
      { id: 'e2', type: 'deletable', source: 'v_name', target: 'new_dict', sourceHandle: 'val_out', targetHandle: 'val_0' },
      { id: 'e3', type: 'deletable', source: 'start', target: 'assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e4', type: 'deletable', source: 'new_dict', target: 'assign', sourceHandle: 'dict_out', targetHandle: 'val_in' },
      { id: 'e5', type: 'deletable', source: 'assign', target: 'dict_add', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e6', type: 'deletable', source: 'read_d1', target: 'dict_add', sourceHandle: 'val_out', targetHandle: 'dict_in' },
      { id: 'e7', type: 'deletable', source: 'k_avg', target: 'dict_add', sourceHandle: 'val_out', targetHandle: 'key_in' },
      { id: 'e8', type: 'deletable', source: 'n94', target: 'dict_add', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e9', type: 'deletable', source: 'dict_add', target: 'print1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e10', type: 'deletable', source: 'read_d2', target: 'dict_read', sourceHandle: 'val_out', targetHandle: 'dict_in' },
      { id: 'e11', type: 'deletable', source: 'k_avg2', target: 'dict_read', sourceHandle: 'val_out', targetHandle: 'key_in' },
      { id: 'e12', type: 'deletable', source: 'dict_read', target: 'print1', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e13', type: 'deletable', source: 'print1', target: 'print2', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e14', type: 'deletable', source: 'read_d3', target: 'dict_get', sourceHandle: 'val_out', targetHandle: 'dict_in' },
      { id: 'e15', type: 'deletable', source: 'k_city', target: 'dict_get', sourceHandle: 'val_out', targetHandle: 'key_in' },
      { id: 'e16', type: 'deletable', source: 'v_def', target: 'dict_get', sourceHandle: 'val_out', targetHandle: 'default_in' },
      { id: 'e17', type: 'deletable', source: 'dict_get', target: 'print2', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e18', type: 'deletable', source: 'print2', target: 'print3', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e19', type: 'deletable', source: 'read_d4', target: 'dict_has', sourceHandle: 'val_out', targetHandle: 'dict_in' },
      { id: 'e20', type: 'deletable', source: 'k_name2', target: 'dict_has', sourceHandle: 'val_out', targetHandle: 'key_in' },
      { id: 'e21', type: 'deletable', source: 'dict_has', target: 'print3', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e22', type: 'deletable', source: 'print3', target: 'dict_del', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e23', type: 'deletable', source: 'read_d5', target: 'dict_del', sourceHandle: 'val_out', targetHandle: 'dict_in' },
      { id: 'e24', type: 'deletable', source: 'k_avg3', target: 'dict_del', sourceHandle: 'val_out', targetHandle: 'key_in' },
      { id: 'e25', type: 'deletable', source: 'dict_del', target: 'print4', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e26', type: 'deletable', source: 'read_d6', target: 'print4', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  timemath: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'imp_time',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['استيراد/مكتبة'],
          originalType: 'استيراد/مكتبة',
          controls: [{ id: 'lib', type: 'select', label: 'المكتبة', value: 'الوقت', options: ['الوقت', 'الرياضيات', 'العشوائي'] }]
        }
      },
      {
        id: 'imp_math',
        type: 'dynamic',
        position: { x: 50, y: 350 },
        data: {
          ...nodeDefinitions['استيراد/مكتبة'],
          originalType: 'استيراد/مكتبة',
          controls: [{ id: 'lib', type: 'select', label: 'المكتبة', value: 'الرياضيات', options: ['الوقت', 'الرياضيات', 'العشوائي'] }]
        }
      },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 500 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'now1', type: 'dynamic', position: { x: -300, y: 500 }, data: { ...nodeDefinitions['وقت/الآن'], originalType: 'وقت/الآن' } },
      { id: 'print2', type: 'dynamic', position: { x: 50, y: 650 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'fmt1', type: 'dynamic', position: { x: -300, y: 650 }, data: { ...nodeDefinitions['وقت/منسق'], originalType: 'وقت/منسق' } },
      {
        id: 'sin1',
        type: 'dynamic',
        position: { x: -300, y: 800 },
        data: {
          ...nodeDefinitions['رياضيات/دوال'],
          originalType: 'رياضيات/دوال',
          controls: [{ id: 'func', type: 'select', label: 'الدالة', value: 'جيب', options: ['جيب', 'تجيب', 'ظل', 'قيمة_مطلقة', 'المضروب', 'قم_اكبر', 'قم_اصغر', 'حد_اعلى', 'حد_ادنى', 'لوغ', 'راديان', 'درجة', 'مسافة'] }]
        }
      },
      {
        id: 'n90', type: 'dynamic', position: { x: -600, y: 800 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 90 }] }
      },
      { id: 'print3', type: 'dynamic', position: { x: 50, y: 800 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'abs1',
        type: 'dynamic',
        position: { x: -300, y: 950 },
        data: {
          ...nodeDefinitions['رياضيات/دوال'],
          originalType: 'رياضيات/دوال',
          controls: [{ id: 'func', type: 'select', label: 'الدالة', value: 'قيمة_مطلقة', options: ['جيب', 'تجيب', 'ظل', 'قيمة_مطلقة', 'المضروب', 'قم_اكبر', 'قم_اصغر', 'حد_اعلى', 'حد_ادنى', 'لوغ', 'راديان', 'درجة', 'مسافة'] }]
        }
      },
      {
        id: 'nneg7', type: 'dynamic', position: { x: -600, y: 950 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: -7 }] }
      },
      { id: 'print4', type: 'dynamic', position: { x: 50, y: 950 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'wait1', type: 'dynamic', position: { x: 50, y: 1100 }, data: { ...nodeDefinitions['وقت/انتظر'], originalType: 'وقت/انتظر' } },
      {
        id: 'n1', type: 'dynamic', position: { x: -300, y: 1100 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }] }
      },
      { id: 'print5', type: 'dynamic', position: { x: 50, y: 1250 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 't_end',
        type: 'dynamic',
        position: { x: -300, y: 1250 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'انتهى الانتظار' }] }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'imp_time', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'imp_time', target: 'imp_math', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e3', type: 'deletable', source: 'imp_math', target: 'print1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e4', type: 'deletable', source: 'now1', target: 'print1', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e5', type: 'deletable', source: 'print1', target: 'print2', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e6', type: 'deletable', source: 'fmt1', target: 'print2', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e7', type: 'deletable', source: 'print2', target: 'print3', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e8', type: 'deletable', source: 'n90', target: 'sin1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e9', type: 'deletable', source: 'sin1', target: 'print3', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e10', type: 'deletable', source: 'print3', target: 'print4', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e11', type: 'deletable', source: 'nneg7', target: 'abs1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e12', type: 'deletable', source: 'abs1', target: 'print4', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e13', type: 'deletable', source: 'print4', target: 'wait1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e14', type: 'deletable', source: 'n1', target: 'wait1', sourceHandle: 'val_out', targetHandle: 'ms_in' },
      { id: 'e15', type: 'deletable', source: 'wait1', target: 'print5', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e16', type: 'deletable', source: 't_end', target: 'print5', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  random: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'imp_rand',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['استيراد/مكتبة'],
          originalType: 'استيراد/مكتبة',
          controls: [{ id: 'lib', type: 'select', label: 'المكتبة', value: 'العشوائي', options: ['الوقت', 'الرياضيات', 'العشوائي'] }]
        }
      },
      { id: 'seed1', type: 'dynamic', position: { x: 50, y: 350 }, data: { ...nodeDefinitions['عشوائي/بذرة'], originalType: 'عشوائي/بذرة' } },
      {
        id: 'n60', type: 'dynamic', position: { x: -300, y: 350 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 60 }] }
      },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 500 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'rand1', type: 'dynamic', position: { x: -300, y: 500 }, data: { ...nodeDefinitions['عشوائي/رقم'], originalType: 'عشوائي/رقم' } },
      { id: 'print2', type: 'dynamic', position: { x: 50, y: 650 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'uni1', type: 'dynamic', position: { x: -300, y: 650 }, data: { ...nodeDefinitions['عشوائي/منتظم'], originalType: 'عشوائي/منتظم' } },
      {
        id: 'nneg1', type: 'dynamic', position: { x: -600, y: 620 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: -1 }] }
      },
      {
        id: 'n1', type: 'dynamic', position: { x: -600, y: 700 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }] }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'imp_rand', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'imp_rand', target: 'seed1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e3', type: 'deletable', source: 'n60', target: 'seed1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e4', type: 'deletable', source: 'seed1', target: 'print1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e5', type: 'deletable', source: 'rand1', target: 'print1', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e6', type: 'deletable', source: 'print1', target: 'print2', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e7', type: 'deletable', source: 'nneg1', target: 'uni1', sourceHandle: 'val_out', targetHandle: 'min_in' },
      { id: 'e8', type: 'deletable', source: 'n1', target: 'uni1', sourceHandle: 'val_out', targetHandle: 'max_in' },
      { id: 'e9', type: 'deletable', source: 'uni1', target: 'print2', sourceHandle: 'res_out', targetHandle: 'val_in' }
    ]
  },
  foreach: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'arr_new',
        type: 'dynamic',
        position: { x: -300, y: 200 },
        data: {
          ...nodeDefinitions['مصفوفات/جديدة'],
          originalType: 'مصفوفات/جديدة',
          inputs: [
            { id: 'item_0', label: 'عنصر 1', type: 'data' },
            { id: 'item_1', label: 'عنصر 2', type: 'data' },
            { id: 'item_2', label: 'عنصر 3', type: 'data' }
          ]
        }
      },
      {
        id: 'f1',
        type: 'dynamic',
        position: { x: -600, y: 150 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'تفاح' }] }
      },
      {
        id: 'f2',
        type: 'dynamic',
        position: { x: -600, y: 230 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'موز' }] }
      },
      {
        id: 'f3',
        type: 'dynamic',
        position: { x: -600, y: 310 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'عنب' }] }
      },
      {
        id: 'assign',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'فواكه' }]
        }
      },
      {
        id: 'loop1',
        type: 'dynamic',
        position: { x: 50, y: 350 },
        data: {
          ...nodeDefinitions['حلقات/لكل في مصفوفة'],
          originalType: 'حلقات/لكل في مصفوفة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'فاكهة' }]
        }
      },
      {
        id: 'read_arr',
        type: 'dynamic',
        position: { x: -300, y: 350 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'فواكه' }]
        }
      },
      { id: 'if1', type: 'dynamic', position: { x: 50, y: 520 }, data: { ...nodeDefinitions['شروط/اذا'], originalType: 'شروط/اذا' } },
      {
        id: 'cmp',
        type: 'dynamic',
        position: { x: -300, y: 520 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '==', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'read_f',
        type: 'dynamic',
        position: { x: -600, y: 500 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'فاكهة' }]
        }
      },
      {
        id: 't_banana',
        type: 'dynamic',
        position: { x: -600, y: 580 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'موز' }] }
      },
      { id: 'skip1', type: 'dynamic', position: { x: 350, y: 520 }, data: { ...nodeDefinitions['حلقات/استمر'], originalType: 'حلقات/استمر' } },
      { id: 'print1', type: 'dynamic', position: { x: -150, y: 670 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_f2',
        type: 'dynamic',
        position: { x: -450, y: 670 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'فاكهة' }]
        }
      },
      { id: 'print_len', type: 'dynamic', position: { x: 50, y: 820 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { id: 'len1', type: 'dynamic', position: { x: -300, y: 820 }, data: { ...nodeDefinitions['دوال/طول'], originalType: 'دوال/طول' } },
      {
        id: 'read_arr2',
        type: 'dynamic',
        position: { x: -600, y: 820 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'فواكه' }]
        }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'f1', target: 'arr_new', sourceHandle: 'val_out', targetHandle: 'item_0' },
      { id: 'e2', type: 'deletable', source: 'f2', target: 'arr_new', sourceHandle: 'val_out', targetHandle: 'item_1' },
      { id: 'e3', type: 'deletable', source: 'f3', target: 'arr_new', sourceHandle: 'val_out', targetHandle: 'item_2' },
      { id: 'e4', type: 'deletable', source: 'start', target: 'assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e5', type: 'deletable', source: 'arr_new', target: 'assign', sourceHandle: 'arr_out', targetHandle: 'val_in' },
      { id: 'e6', type: 'deletable', source: 'assign', target: 'loop1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e7', type: 'deletable', source: 'read_arr', target: 'loop1', sourceHandle: 'val_out', targetHandle: 'arr_in' },
      { id: 'e8', type: 'deletable', source: 'loop1', target: 'if1', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e9', type: 'deletable', source: 'cmp', target: 'if1', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e10', type: 'deletable', source: 'read_f', target: 'cmp', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e11', type: 'deletable', source: 't_banana', target: 'cmp', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e12', type: 'deletable', source: 'if1', target: 'skip1', sourceHandle: 'true_out', targetHandle: 'seq_in' },
      { id: 'e13', type: 'deletable', source: 'if1', target: 'print1', sourceHandle: 'false_out', targetHandle: 'seq_in' },
      { id: 'e14', type: 'deletable', source: 'read_f2', target: 'print1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e15', type: 'deletable', source: 'loop1', target: 'print_len', sourceHandle: 'done_out', targetHandle: 'seq_in' },
      { id: 'e16', type: 'deletable', source: 'read_arr2', target: 'len1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e17', type: 'deletable', source: 'len1', target: 'print_len', sourceHandle: 'res_out', targetHandle: 'val_in' }
    ]
  },
  multiarg: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'func_def',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['دوال/تعريف دالة'],
          originalType: 'دوال/تعريف دالة',
          controls: [{ id: 'func_name', type: 'text', label: 'الاسم', value: 'جمع' }, { id: 'arg', type: 'text', label: 'المعاملات (افصل بفاصلة ,)', value: 'أ, ب' }]
        }
      },
      { id: 'func_ret', type: 'dynamic', position: { x: 350, y: 200 }, data: { ...nodeDefinitions['دوال/إرجاع'], originalType: 'دوال/إرجاع' } },
      {
        id: 'math_op',
        type: 'dynamic',
        position: { x: 650, y: 200 },
        data: {
          ...nodeDefinitions['بيانات/حساب'],
          originalType: 'بيانات/حساب',
          controls: [{ id: 'op', type: 'select', label: 'عملية', value: '+', options: ['+', '-', '*', '\\', '\\\\', '\\*', '^'] }]
        }
      },
      {
        id: 'read_a',
        type: 'dynamic',
        position: { x: 900, y: 180 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'أ' }]
        }
      },
      {
        id: 'read_b',
        type: 'dynamic',
        position: { x: 900, y: 280 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ب' }]
        }
      },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 420 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'call1',
        type: 'dynamic',
        position: { x: -300, y: 420 },
        data: {
          ...nodeDefinitions['دوال/استدعاء'],
          originalType: 'دوال/استدعاء',
          inputs: [
            { id: 'seq_in', label: 'تسلسل', type: 'event' },
            { id: 'arg_in', label: 'المعامل', type: 'data' },
            { id: 'item_0', label: 'معامل 2', type: 'data' }
          ],
          controls: [{ id: 'func_name', type: 'text', label: 'الاسم', value: 'جمع' }]
        }
      },
      {
        id: 'n7', type: 'dynamic', position: { x: -600, y: 400 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 7 }] }
      },
      {
        id: 'n8', type: 'dynamic', position: { x: -600, y: 480 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 8 }] }
      },
      {
        id: 'cond1',
        type: 'dynamic',
        position: { x: 50, y: 570 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد شرطي'],
          originalType: 'متغيرات/إسناد شرطي',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'الوصف' }]
        }
      },
      {
        id: 'cmp1',
        type: 'dynamic',
        position: { x: -300, y: 550 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '>', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'n15', type: 'dynamic', position: { x: -600, y: 530 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 15 }] }
      },
      {
        id: 'n10', type: 'dynamic', position: { x: -600, y: 610 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 10 }] }
      },
      {
        id: 't_big',
        type: 'dynamic',
        position: { x: -300, y: 680 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'كبير' }] }
      },
      {
        id: 't_small',
        type: 'dynamic',
        position: { x: -300, y: 760 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'صغير' }] }
      },
      { id: 'print2', type: 'dynamic', position: { x: 50, y: 800 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_desc',
        type: 'dynamic',
        position: { x: -300, y: 800 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'الوصف' }]
        }
      },
      {
        id: 'del1',
        type: 'dynamic',
        position: { x: 50, y: 1100 },
        data: {
          ...nodeDefinitions['متغيرات/حذف'],
          originalType: 'متغيرات/حذف',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'مؤقت' }]
        }
      },
      {
        id: 'assign_tmp',
        type: 'dynamic',
        position: { x: 50, y: 950 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'مؤقت' }]
        }
      },
      {
        id: 'num1t', type: 'dynamic', position: { x: -300, y: 950 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }] }
      }
    ],
    edges: [
      { id: 'e2', type: 'deletable', source: 'func_def', target: 'func_ret', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e3', type: 'deletable', source: 'math_op', target: 'func_ret', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e4', type: 'deletable', source: 'read_a', target: 'math_op', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e5', type: 'deletable', source: 'read_b', target: 'math_op', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e6', type: 'deletable', source: 'start', target: 'print1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e7', type: 'deletable', source: 'call1', target: 'print1', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e8', type: 'deletable', source: 'n7', target: 'call1', sourceHandle: 'val_out', targetHandle: 'arg_in' },
      { id: 'e9', type: 'deletable', source: 'n8', target: 'call1', sourceHandle: 'val_out', targetHandle: 'item_0' },
      { id: 'e10', type: 'deletable', source: 'print1', target: 'cond1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e11', type: 'deletable', source: 'cmp1', target: 'cond1', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e12', type: 'deletable', source: 'n15', target: 'cmp1', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e13', type: 'deletable', source: 'n10', target: 'cmp1', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e14', type: 'deletable', source: 't_big', target: 'cond1', sourceHandle: 'val_out', targetHandle: 'true_in' },
      { id: 'e15', type: 'deletable', source: 't_small', target: 'cond1', sourceHandle: 'val_out', targetHandle: 'false_in' },
      { id: 'e16', type: 'deletable', source: 'cond1', target: 'print2', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e17', type: 'deletable', source: 'read_desc', target: 'print2', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e18', type: 'deletable', source: 'print2', target: 'assign_tmp', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e19', type: 'deletable', source: 'num1t', target: 'assign_tmp', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e20', type: 'deletable', source: 'assign_tmp', target: 'del1', sourceHandle: 'seq_out', targetHandle: 'seq_in' }
    ]
  },
  guess: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'imp_rand',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['استيراد/مكتبة'],
          originalType: 'استيراد/مكتبة',
          controls: [{ id: 'lib', type: 'select', label: 'المكتبة', value: 'العشوائي', options: ['الوقت', 'الرياضيات', 'العشوائي'] }]
        }
      },
      { id: 'seed1', type: 'dynamic', position: { x: 50, y: 350 }, data: { ...nodeDefinitions['عشوائي/بذرة'], originalType: 'عشوائي/بذرة' } },
      {
        id: 'n7', type: 'dynamic', position: { x: -300, y: 350 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 7 }] }
      },
      {
        id: 'assign_target',
        type: 'dynamic',
        position: { x: 50, y: 500 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'الهدف' }]
        }
      },
      { id: 'uni1', type: 'dynamic', position: { x: -300, y: 500 }, data: { ...nodeDefinitions['عشوائي/منتظم'], originalType: 'عشوائي/منتظم' } },
      {
        id: 'int_target', type: 'dynamic', position: { x: -550, y: 500 },
        data: { ...nodeDefinitions['بيانات/تحويل لصحيح'], originalType: 'بيانات/تحويل لصحيح' }
      },
      {
        id: 'n1', type: 'dynamic', position: { x: -600, y: 470 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }] }
      },
      {
        id: 'n20', type: 'dynamic', position: { x: -850, y: 470 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 21 }] }
      },
      {
        id: 'assign_tries',
        type: 'dynamic',
        position: { x: 50, y: 650 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'المحاولات' }]
        }
      },
      {
        id: 'n0', type: 'dynamic', position: { x: -300, y: 650 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 0 }] }
      },
      { id: 'print_start', type: 'dynamic', position: { x: 50, y: 800 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 't_start',
        type: 'dynamic',
        position: { x: -300, y: 800 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'خمن الرقم من 1 إلى 20!' }] }
      },
      { id: 'while1', type: 'dynamic', position: { x: 50, y: 950 }, data: { ...nodeDefinitions['حلقات/بينما'], originalType: 'حلقات/بينما' } },
      {
        id: 'bool_true',
        type: 'dynamic',
        position: { x: -300, y: 950 },
        data: {
          ...nodeDefinitions['بيانات/منطق'],
          originalType: 'بيانات/منطق',
          controls: [{ id: 'value', type: 'select', label: 'منطق', value: 'صح', options: ['صح', 'خطأ'] }]
        }
      },
      {
        id: 'assign_guess',
        type: 'dynamic',
        position: { x: 50, y: 1100 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'تخمين' }]
        }
      },
      { id: 'sahih1', type: 'dynamic', position: { x: -300, y: 1100 }, data: { ...nodeDefinitions['بيانات/تحويل لصحيح'], originalType: 'بيانات/تحويل لصحيح' } },
      {
        id: 'ask1',
        type: 'dynamic',
        position: { x: -600, y: 1100 },
        data: {
          ...nodeDefinitions['أوامر/إدخال مستخدم'],
          originalType: 'أوامر/إدخال مستخدم',
          controls: [{ id: 'prompt', type: 'text', label: 'الرسالة', value: 'تخمينك: ' }]
        }
      },
      {
        id: 'retro1',
        type: 'dynamic',
        position: { x: 50, y: 1250 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد رجعي'],
          originalType: 'متغيرات/إسناد رجعي',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'المحاولات' }, { id: 'op', type: 'select', label: 'العملية', value: '+=', options: ['+=', '-=', '*=', '\\=', '\\\\=', '\\*=', '^='] }]
        }
      },
      {
        id: 'n1b', type: 'dynamic', position: { x: -300, y: 1250 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }] }
      },
      { id: 'if1', type: 'dynamic', position: { x: 50, y: 1400 }, data: { ...nodeDefinitions['شروط/اذا'], originalType: 'شروط/اذا' } },
      {
        id: 'cmp_eq',
        type: 'dynamic',
        position: { x: -300, y: 1400 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '==', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'read_g1',
        type: 'dynamic',
        position: { x: -600, y: 1380 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'تخمين' }]
        }
      },
      {
        id: 'read_t1',
        type: 'dynamic',
        position: { x: -600, y: 1460 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'الهدف' }]
        }
      },
      { id: 'print_ok', type: 'dynamic', position: { x: 350, y: 1400 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 't_ok',
        type: 'dynamic',
        position: { x: 350, y: 1550 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'صح! أحسنت' }] }
      },
      { id: 'print_count', type: 'dynamic', position: { x: 350, y: 1700 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_c',
        type: 'dynamic',
        position: { x: 100, y: 1700 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'المحاولات' }]
        }
      },
      { id: 'stop1', type: 'dynamic', position: { x: 350, y: 1850 }, data: { ...nodeDefinitions['حلقات/توقف'], originalType: 'حلقات/توقف' } },
      { id: 'elif1', type: 'dynamic', position: { x: -150, y: 1550 }, data: { ...nodeDefinitions['شروط/اواذا'], originalType: 'شروط/اواذا' } },
      {
        id: 'cmp_lt',
        type: 'dynamic',
        position: { x: -450, y: 1550 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '<', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'read_g2',
        type: 'dynamic',
        position: { x: -700, y: 1530 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'تخمين' }]
        }
      },
      {
        id: 'read_t2',
        type: 'dynamic',
        position: { x: -700, y: 1610 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'الهدف' }]
        }
      },
      { id: 'print_big', type: 'dynamic', position: { x: -150, y: 1700 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 't_big',
        type: 'dynamic',
        position: { x: -150, y: 1850 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'أكبر!' }] }
      },
      { id: 'print_small', type: 'dynamic', position: { x: -450, y: 1850 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 't_small',
        type: 'dynamic',
        position: { x: -450, y: 2000 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'أصغر!' }] }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'imp_rand', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'imp_rand', target: 'seed1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e3', type: 'deletable', source: 'n7', target: 'seed1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e4', type: 'deletable', source: 'seed1', target: 'assign_target', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e5', type: 'deletable', source: 'n1', target: 'uni1', sourceHandle: 'val_out', targetHandle: 'min_in' },
      { id: 'e6', type: 'deletable', source: 'n20', target: 'uni1', sourceHandle: 'val_out', targetHandle: 'max_in' },
      { id: 'e7', type: 'deletable', source: 'uni1', target: 'int_target', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e7b', type: 'deletable', source: 'int_target', target: 'assign_target', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e8', type: 'deletable', source: 'assign_target', target: 'assign_tries', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e9', type: 'deletable', source: 'n0', target: 'assign_tries', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e10', type: 'deletable', source: 'assign_tries', target: 'print_start', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e11', type: 'deletable', source: 't_start', target: 'print_start', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e12', type: 'deletable', source: 'print_start', target: 'while1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e13', type: 'deletable', source: 'bool_true', target: 'while1', sourceHandle: 'val_out', targetHandle: 'cond_in' },
      { id: 'e14', type: 'deletable', source: 'while1', target: 'assign_guess', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e15', type: 'deletable', source: 'ask1', target: 'sahih1', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e16', type: 'deletable', source: 'sahih1', target: 'assign_guess', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e17', type: 'deletable', source: 'assign_guess', target: 'retro1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e18', type: 'deletable', source: 'n1b', target: 'retro1', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e19', type: 'deletable', source: 'retro1', target: 'if1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e20', type: 'deletable', source: 'cmp_eq', target: 'if1', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e21', type: 'deletable', source: 'read_g1', target: 'cmp_eq', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e22', type: 'deletable', source: 'read_t1', target: 'cmp_eq', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e23', type: 'deletable', source: 'if1', target: 'print_ok', sourceHandle: 'true_out', targetHandle: 'seq_in' },
      { id: 'e24', type: 'deletable', source: 't_ok', target: 'print_ok', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e25', type: 'deletable', source: 'print_ok', target: 'print_count', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e26', type: 'deletable', source: 'read_c', target: 'print_count', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e27', type: 'deletable', source: 'print_count', target: 'stop1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e28', type: 'deletable', source: 'if1', target: 'elif1', sourceHandle: 'false_out', targetHandle: 'seq_in' },
      { id: 'e29', type: 'deletable', source: 'cmp_lt', target: 'elif1', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e30', type: 'deletable', source: 'read_g2', target: 'cmp_lt', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e31', type: 'deletable', source: 'read_t2', target: 'cmp_lt', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e32', type: 'deletable', source: 'elif1', target: 'print_big', sourceHandle: 'true_out', targetHandle: 'seq_in' },
      { id: 'e33', type: 'deletable', source: 't_big', target: 'print_big', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e34', type: 'deletable', source: 'elif1', target: 'print_small', sourceHandle: 'false_out', targetHandle: 'seq_in' },
      { id: 'e35', type: 'deletable', source: 't_small', target: 'print_small', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  calc: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      { id: 'print_head', type: 'dynamic', position: { x: 50, y: 200 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 't_head',
        type: 'dynamic',
        position: { x: -300, y: 200 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: '--- الآلة الحاسبة ---' }] }
      },
      {
        id: 'assign_a',
        type: 'dynamic',
        position: { x: 50, y: 350 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'أ' }]
        }
      },
      { id: 'conv_a', type: 'dynamic', position: { x: -300, y: 350 }, data: { ...nodeDefinitions['بيانات/تحويل لرقم'], originalType: 'بيانات/تحويل لرقم' } },
      {
        id: 'ask_a',
        type: 'dynamic',
        position: { x: -600, y: 350 },
        data: {
          ...nodeDefinitions['أوامر/إدخال مستخدم'],
          originalType: 'أوامر/إدخال مستخدم',
          controls: [{ id: 'prompt', type: 'text', label: 'الرسالة', value: 'العدد الأول: ' }]
        }
      },
      {
        id: 'assign_op',
        type: 'dynamic',
        position: { x: 50, y: 500 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'عملية' }]
        }
      },
      {
        id: 'ask_op',
        type: 'dynamic',
        position: { x: -300, y: 500 },
        data: {
          ...nodeDefinitions['أوامر/إدخال مستخدم'],
          originalType: 'أوامر/إدخال مستخدم',
          controls: [{ id: 'prompt', type: 'text', label: 'الرسالة', value: 'العملية (+ - * \\): ' }]
        }
      },
      {
        id: 'assign_b',
        type: 'dynamic',
        position: { x: 50, y: 650 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ب' }]
        }
      },
      { id: 'conv_b', type: 'dynamic', position: { x: -300, y: 650 }, data: { ...nodeDefinitions['بيانات/تحويل لرقم'], originalType: 'بيانات/تحويل لرقم' } },
      {
        id: 'ask_b',
        type: 'dynamic',
        position: { x: -600, y: 650 },
        data: {
          ...nodeDefinitions['أوامر/إدخال مستخدم'],
          originalType: 'أوامر/إدخال مستخدم',
          controls: [{ id: 'prompt', type: 'text', label: 'الرسالة', value: 'العدد الثاني: ' }]
        }
      },
      { id: 'if1', type: 'dynamic', position: { x: 50, y: 800 }, data: { ...nodeDefinitions['شروط/اذا'], originalType: 'شروط/اذا' } },
      {
        id: 'cmp_plus',
        type: 'dynamic',
        position: { x: -300, y: 800 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '==', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'read_op1',
        type: 'dynamic',
        position: { x: -600, y: 780 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'عملية' }]
        }
      },
      {
        id: 't_plus',
        type: 'dynamic',
        position: { x: -600, y: 860 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: '+' }] }
      },
      {
        id: 'asg_plus',
        type: 'dynamic',
        position: { x: 400, y: 800 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'النتيجة' }]
        }
      },
      {
        id: 'math_plus',
        type: 'dynamic',
        position: { x: 150, y: 950 },
        data: {
          ...nodeDefinitions['بيانات/حساب'],
          originalType: 'بيانات/حساب',
          controls: [{ id: 'op', type: 'select', label: 'عملية', value: '+', options: ['+', '-', '*', '\\', '\\\\', '\\*', '^'] }]
        }
      },
      {
        id: 'read_a1',
        type: 'dynamic',
        position: { x: -100, y: 930 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'أ' }]
        }
      },
      {
        id: 'read_b1',
        type: 'dynamic',
        position: { x: -100, y: 1010 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ب' }]
        }
      },
      { id: 'elif1', type: 'dynamic', position: { x: 50, y: 1150 }, data: { ...nodeDefinitions['شروط/اواذا'], originalType: 'شروط/اواذا' } },
      {
        id: 'cmp_minus',
        type: 'dynamic',
        position: { x: -300, y: 1150 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '==', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'read_op2',
        type: 'dynamic',
        position: { x: -600, y: 1130 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'عملية' }]
        }
      },
      {
        id: 't_minus',
        type: 'dynamic',
        position: { x: -600, y: 1210 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: '-' }] }
      },
      {
        id: 'asg_minus',
        type: 'dynamic',
        position: { x: 400, y: 1150 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'النتيجة' }]
        }
      },
      {
        id: 'math_minus',
        type: 'dynamic',
        position: { x: 150, y: 1300 },
        data: {
          ...nodeDefinitions['بيانات/حساب'],
          originalType: 'بيانات/حساب',
          controls: [{ id: 'op', type: 'select', label: 'عملية', value: '-', options: ['+', '-', '*', '\\', '\\\\', '\\*', '^'] }]
        }
      },
      {
        id: 'read_a2',
        type: 'dynamic',
        position: { x: -100, y: 1280 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'أ' }]
        }
      },
      {
        id: 'read_b2',
        type: 'dynamic',
        position: { x: -100, y: 1360 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ب' }]
        }
      },
      { id: 'elif2', type: 'dynamic', position: { x: 50, y: 1500 }, data: { ...nodeDefinitions['شروط/اواذا'], originalType: 'شروط/اواذا' } },
      {
        id: 'cmp_star',
        type: 'dynamic',
        position: { x: -300, y: 1500 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '==', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'read_op3',
        type: 'dynamic',
        position: { x: -600, y: 1480 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'عملية' }]
        }
      },
      {
        id: 't_star',
        type: 'dynamic',
        position: { x: -600, y: 1560 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: '*' }] }
      },
      {
        id: 'asg_star',
        type: 'dynamic',
        position: { x: 400, y: 1500 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'النتيجة' }]
        }
      },
      {
        id: 'math_star',
        type: 'dynamic',
        position: { x: 150, y: 1650 },
        data: {
          ...nodeDefinitions['بيانات/حساب'],
          originalType: 'بيانات/حساب',
          controls: [{ id: 'op', type: 'select', label: 'عملية', value: '*', options: ['+', '-', '*', '\\', '\\\\', '\\*', '^'] }]
        }
      },
      {
        id: 'read_a3',
        type: 'dynamic',
        position: { x: -100, y: 1630 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'أ' }]
        }
      },
      {
        id: 'read_b3',
        type: 'dynamic',
        position: { x: -100, y: 1710 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ب' }]
        }
      },
      { id: 'elif3', type: 'dynamic', position: { x: 50, y: 1850 }, data: { ...nodeDefinitions['شروط/اواذا'], originalType: 'شروط/اواذا' } },
      {
        id: 'cmp_back',
        type: 'dynamic',
        position: { x: -300, y: 1850 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '==', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'read_op4',
        type: 'dynamic',
        position: { x: -600, y: 1830 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'عملية' }]
        }
      },
      {
        id: 't_back',
        type: 'dynamic',
        position: { x: -600, y: 1910 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: '\\' }] }
      },
      { id: 'if_zero', type: 'dynamic', position: { x: 400, y: 1850 }, data: { ...nodeDefinitions['شروط/اذا'], originalType: 'شروط/اذا' } },
      {
        id: 'cmp_zero',
        type: 'dynamic',
        position: { x: 150, y: 2000 },
        data: {
          ...nodeDefinitions['شروط/مقارنة'],
          originalType: 'شروط/مقارنة',
          controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '==', options: ['==', '!=', '>', '<', '>=', '<='] }]
        }
      },
      {
        id: 'read_b4',
        type: 'dynamic',
        position: { x: -100, y: 1980 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ب' }]
        }
      },
      {
        id: 'n0', type: 'dynamic', position: { x: -100, y: 2060 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 0 }] }
      },
      {
        id: 'asg_err',
        type: 'dynamic',
        position: { x: 650, y: 2000 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'النتيجة' }]
        }
      },
      {
        id: 't_err',
        type: 'dynamic',
        position: { x: 400, y: 2150 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'خطأ: قسمة على صفر' }] }
      },
      {
        id: 'asg_div',
        type: 'dynamic',
        position: { x: 150, y: 2150 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'النتيجة' }]
        }
      },
      {
        id: 'math_div',
        type: 'dynamic',
        position: { x: -100, y: 2300 },
        data: {
          ...nodeDefinitions['بيانات/حساب'],
          originalType: 'بيانات/حساب',
          controls: [{ id: 'op', type: 'select', label: 'عملية', value: '\\', options: ['+', '-', '*', '\\', '\\\\', '\\*', '^'] }]
        }
      },
      {
        id: 'read_a4',
        type: 'dynamic',
        position: { x: -350, y: 2280 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'أ' }]
        }
      },
      {
        id: 'read_b5',
        type: 'dynamic',
        position: { x: -350, y: 2360 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ب' }]
        }
      },
      {
        id: 'asg_unknown',
        type: 'dynamic',
        position: { x: 400, y: 2450 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'النتيجة' }]
        }
      },
      {
        id: 't_unknown',
        type: 'dynamic',
        position: { x: 150, y: 2600 },
        data: { ...nodeDefinitions['بيانات/نص'], originalType: 'بيانات/نص', controls: [{ id: 'value', type: 'text', label: 'النص', value: 'عملية مجهولة' }] }
      },
      { id: 'print_res', type: 'dynamic', position: { x: 50, y: 2750 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'read_res',
        type: 'dynamic',
        position: { x: -300, y: 2750 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'النتيجة' }]
        }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'print_head', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 't_head', target: 'print_head', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e3', type: 'deletable', source: 'print_head', target: 'assign_a', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e4', type: 'deletable', source: 'ask_a', target: 'conv_a', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e5', type: 'deletable', source: 'conv_a', target: 'assign_a', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e6', type: 'deletable', source: 'assign_a', target: 'assign_op', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e7', type: 'deletable', source: 'ask_op', target: 'assign_op', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e8', type: 'deletable', source: 'assign_op', target: 'assign_b', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e9', type: 'deletable', source: 'ask_b', target: 'conv_b', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e10', type: 'deletable', source: 'conv_b', target: 'assign_b', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e11', type: 'deletable', source: 'assign_b', target: 'if1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e12', type: 'deletable', source: 'cmp_plus', target: 'if1', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e13', type: 'deletable', source: 'read_op1', target: 'cmp_plus', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e14', type: 'deletable', source: 't_plus', target: 'cmp_plus', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e15', type: 'deletable', source: 'if1', target: 'asg_plus', sourceHandle: 'true_out', targetHandle: 'seq_in' },
      { id: 'e16', type: 'deletable', source: 'math_plus', target: 'asg_plus', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e17', type: 'deletable', source: 'read_a1', target: 'math_plus', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e18', type: 'deletable', source: 'read_b1', target: 'math_plus', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e19', type: 'deletable', source: 'if1', target: 'elif1', sourceHandle: 'false_out', targetHandle: 'seq_in' },
      { id: 'e20', type: 'deletable', source: 'cmp_minus', target: 'elif1', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e21', type: 'deletable', source: 'read_op2', target: 'cmp_minus', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e22', type: 'deletable', source: 't_minus', target: 'cmp_minus', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e23', type: 'deletable', source: 'elif1', target: 'asg_minus', sourceHandle: 'true_out', targetHandle: 'seq_in' },
      { id: 'e24', type: 'deletable', source: 'math_minus', target: 'asg_minus', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e25', type: 'deletable', source: 'read_a2', target: 'math_minus', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e26', type: 'deletable', source: 'read_b2', target: 'math_minus', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e27', type: 'deletable', source: 'elif1', target: 'elif2', sourceHandle: 'false_out', targetHandle: 'seq_in' },
      { id: 'e28', type: 'deletable', source: 'cmp_star', target: 'elif2', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e29', type: 'deletable', source: 'read_op3', target: 'cmp_star', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e30', type: 'deletable', source: 't_star', target: 'cmp_star', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e31', type: 'deletable', source: 'elif2', target: 'asg_star', sourceHandle: 'true_out', targetHandle: 'seq_in' },
      { id: 'e32', type: 'deletable', source: 'math_star', target: 'asg_star', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e33', type: 'deletable', source: 'read_a3', target: 'math_star', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e34', type: 'deletable', source: 'read_b3', target: 'math_star', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e35', type: 'deletable', source: 'elif2', target: 'elif3', sourceHandle: 'false_out', targetHandle: 'seq_in' },
      { id: 'e36', type: 'deletable', source: 'cmp_back', target: 'elif3', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e37', type: 'deletable', source: 'read_op4', target: 'cmp_back', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e38', type: 'deletable', source: 't_back', target: 'cmp_back', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e39', type: 'deletable', source: 'elif3', target: 'if_zero', sourceHandle: 'true_out', targetHandle: 'seq_in' },
      { id: 'e40', type: 'deletable', source: 'cmp_zero', target: 'if_zero', sourceHandle: 'res_out', targetHandle: 'cond_in' },
      { id: 'e41', type: 'deletable', source: 'read_b4', target: 'cmp_zero', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e42', type: 'deletable', source: 'n0', target: 'cmp_zero', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e43', type: 'deletable', source: 'if_zero', target: 'asg_err', sourceHandle: 'true_out', targetHandle: 'seq_in' },
      { id: 'e44', type: 'deletable', source: 't_err', target: 'asg_err', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e45', type: 'deletable', source: 'if_zero', target: 'asg_div', sourceHandle: 'false_out', targetHandle: 'seq_in' },
      { id: 'e46', type: 'deletable', source: 'math_div', target: 'asg_div', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e47', type: 'deletable', source: 'read_a4', target: 'math_div', sourceHandle: 'val_out', targetHandle: 'a_in' },
      { id: 'e48', type: 'deletable', source: 'read_b5', target: 'math_div', sourceHandle: 'val_out', targetHandle: 'b_in' },
      { id: 'e49', type: 'deletable', source: 'elif3', target: 'asg_unknown', sourceHandle: 'false_out', targetHandle: 'seq_in' },
      { id: 'e50', type: 'deletable', source: 't_unknown', target: 'asg_unknown', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e51', type: 'deletable', source: 'if1', target: 'print_res', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e52', type: 'deletable', source: 'read_res', target: 'print_res', sourceHandle: 'val_out', targetHandle: 'val_in' }
    ]
  },
  macro: {
    nodes: [
      { id: 'start', type: 'dynamic', position: { x: 50, y: 50 }, data: { ...nodeDefinitions['أوامر/بداية البرنامج'], originalType: 'أوامر/بداية البرنامج' } },
      {
        id: 'assign',
        type: 'dynamic',
        position: { x: 50, y: 200 },
        data: {
          ...nodeDefinitions['متغيرات/إسناد'],
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }]
        }
      },
      {
        id: 'num5', type: 'dynamic', position: { x: -300, y: 350 },
        data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 5 }] }
      },
      {
        id: 'call_block',
        type: 'dynamic',
        position: { x: 50, y: 500 },
        data: {
          label: 'مضاعفة',
          subtitle: 'استدعاء كتلة',
          iconName: 'Box',
          color: '#a855f7',
          isMacro: true,
          macroId: 'macro_double',
          originalType: 'macro:macro_double',
          inputs: [
            { id: 'seq_in', label: 'تسلسل', type: 'event' },
            { id: 'num_arg', label: 'عدد', type: 'data' }
          ],
          outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }]
        }
      },
      {
        id: 'read_s',
        type: 'dynamic',
        position: { x: -300, y: 500 },
        data: {
          ...nodeDefinitions['متغيرات/قراءة'],
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }]
        }
      },
      { id: 'print1', type: 'dynamic', position: { x: 50, y: 650 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      {
        id: 'custom1',
        type: 'dynamic',
        position: { x: 50, y: 800 },
        data: {
          ...nodeDefinitions['أوامر/سطر مخصص'],
          originalType: 'أوامر/سطر مخصص',
          controls: [{ id: 'code', type: 'text', label: 'التعليمة البرمجية', value: 'اطبع("انتهت الكتلة")' }]
        }
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e3', type: 'deletable', source: 'num5', target: 'assign', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e4', type: 'deletable', source: 'assign', target: 'call_block', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e5', type: 'deletable', source: 'read_s', target: 'call_block', sourceHandle: 'val_out', targetHandle: 'num_arg' },
      { id: 'e6', type: 'deletable', source: 'call_block', target: 'print1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e7', type: 'deletable', source: 'call_block', target: 'print1', sourceHandle: 'res_out', targetHandle: 'val_in' },
      { id: 'e8', type: 'deletable', source: 'print1', target: 'custom1', sourceHandle: 'seq_out', targetHandle: 'seq_in' }
    ],
    macros: {
      macro_double: {
        name: 'مضاعفة',
        nodes: [
          {
            id: 'min1',
            type: 'dynamic',
            position: { x: 50, y: 50 },
            data: {
              ...nodeDefinitions['ماكرو/مدخلات'],
              originalType: 'ماكرو/مدخلات',
              outputs: [
                { id: 'seq_out', label: 'بدء', type: 'event' },
                { id: 'num_in', label: 'عدد', type: 'data' }
              ]
            }
          },
          {
            id: 'mult1',
            type: 'dynamic',
            position: { x: -300, y: 200 },
            data: {
              ...nodeDefinitions['بيانات/حساب'],
              originalType: 'بيانات/حساب',
              controls: [{ id: 'op', type: 'select', label: 'عملية', value: '*', options: ['+', '-', '*', '\\', '\\\\', '\\*', '^'] }]
            }
          },
          {
            id: 'read_n',
            type: 'dynamic',
            position: { x: -600, y: 150 },
            data: {
              ...nodeDefinitions['متغيرات/قراءة'],
              originalType: 'متغيرات/قراءة',
              controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'مدخل_1' }]
            }
          },
          {
            id: 'num2m', type: 'dynamic', position: { x: -600, y: 250 },
            data: { ...nodeDefinitions['بيانات/رقم'], originalType: 'بيانات/رقم', controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 2 }] }
          },
          {
            id: 'mout1',
            type: 'dynamic',
            position: { x: 50, y: 350 },
            data: {
              ...nodeDefinitions['ماكرو/مخرجات'],
              originalType: 'ماكرو/مخرجات',
              inputs: [
                { id: 'seq_in', label: 'إنهاء', type: 'event' },
                { id: 'res_in', label: 'ناتج', type: 'data' }
              ]
            }
          }
        ],
        edges: [
          { id: 'e1', type: 'deletable', source: 'min1', target: 'mout1', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
          { id: 'e2', type: 'deletable', source: 'read_n', target: 'mult1', sourceHandle: 'val_out', targetHandle: 'a_in' },
          { id: 'e3', type: 'deletable', source: 'num2m', target: 'mult1', sourceHandle: 'val_out', targetHandle: 'b_in' },
          { id: 'e4', type: 'deletable', source: 'mult1', target: 'mout1', sourceHandle: 'res_out', targetHandle: 'res_in' }
        ]
      }
    }
  }
};
