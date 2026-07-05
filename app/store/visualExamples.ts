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
  }
};
