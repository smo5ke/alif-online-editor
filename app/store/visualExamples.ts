import { Node, Edge } from '@xyflow/react';
import { nodeDefinitions } from '../components/AlifNodes';

export interface VisualExample {
  nodes: Node[];
  edges: Edge[];
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
        data: { ...nodeDefinitions['مصفوفات/مصفوفة جديدة'], originalType: 'مصفوفات/مصفوفة جديدة' } 
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
        id: 'set_prop', 
        type: 'dynamic', 
        position: { x: 300, y: 350 }, 
        data: { 
          ...nodeDefinitions['كائنات/تعيين_خاصية'], 
          originalType: 'كائنات/تعيين_خاصية',
          controls: [{ id: 'prop_name', type: 'text', label: 'الخاصية', value: 'السرعة' }] 
        } 
      },
      { 
        id: 'num_val', 
        type: 'dynamic', 
        position: { x: 100, y: 350 }, 
        data: { 
          ...nodeDefinitions['بيانات/رقم'], 
          originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 200 }] 
        } 
      },
      { 
        id: 'obj_assign', 
        type: 'dynamic', 
        position: { x: 50, y: 350 }, 
        data: { 
          ...nodeDefinitions['متغيرات/إسناد'], 
          originalType: 'متغيرات/إسناد',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'سيارتي' }] 
        } 
      },
      { 
        id: 'create_obj', 
        type: 'dynamic', 
        position: { x: -300, y: 350 }, 
        data: { 
          ...nodeDefinitions['كائنات/إنشاء'], 
          originalType: 'كائنات/إنشاء',
          controls: [{ id: 'class_name', type: 'text', label: 'اسم الصنف', value: 'سيارة' }] 
        } 
      },
      { id: 'print', type: 'dynamic', position: { x: 50, y: 500 }, data: { ...nodeDefinitions['أوامر/اطبع'], originalType: 'أوامر/اطبع' } },
      { 
        id: 'read_obj', 
        type: 'dynamic', 
        position: { x: -300, y: 500 }, 
        data: { 
          ...nodeDefinitions['متغيرات/قراءة'], 
          originalType: 'متغيرات/قراءة',
          controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'سيارتي' }] 
        } 
      }
    ],
    edges: [
      { id: 'e1', type: 'deletable', source: 'start', target: 'class_def', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e2', type: 'deletable', source: 'class_def', target: 'set_prop', sourceHandle: 'body_out', targetHandle: 'seq_in' },
      { id: 'e3', type: 'deletable', source: 'num_val', target: 'set_prop', sourceHandle: 'val_out', targetHandle: 'val_in' },
      { id: 'e4', type: 'deletable', source: 'class_def', target: 'obj_assign', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e5', type: 'deletable', source: 'create_obj', target: 'obj_assign', sourceHandle: 'obj_out', targetHandle: 'val_in' },
      { id: 'e6', type: 'deletable', source: 'obj_assign', target: 'print', sourceHandle: 'seq_out', targetHandle: 'seq_in' },
      { id: 'e7', type: 'deletable', source: 'read_obj', target: 'print', sourceHandle: 'val_out', targetHandle: 'val_in' }
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
        data: { ...nodeDefinitions['فهارس/فهرس جديد'], originalType: 'فهارس/فهرس جديد' } 
      },
      { 
        id: 'dict_add', 
        type: 'dynamic', 
        position: { x: 50, y: 350 }, 
        data: { ...nodeDefinitions['فهارس/إضافة للفهرس'], originalType: 'فهارس/إضافة للفهرس' } 
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
  }
};
