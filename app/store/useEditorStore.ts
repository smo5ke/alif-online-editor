import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

type EditorMode = 'visual' | 'code' | 'terminal';

export interface TerminalLine {
  text: string;
  color: string;
}

interface EditorState {
  // State
  activeMode: EditorMode;
  isTerminalHidden: boolean;
  textCode: string;
  nodes: Node[];
  edges: Edge[];
  terminalOutput: TerminalLine[];

  // Actions
  setMode: (mode: EditorMode) => void;
  setIsTerminalHidden: (hidden: boolean) => void;
  setTextCode: (code: string) => void;
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  appendTerminalOutput: (text: string, color: string) => void;
  clearTerminal: () => void;
  addDynamicInput: (nodeId: string) => void;
  updateNodeControl: (nodeId: string, controlId: string, value: any) => void;
}

export const codeExamples: Record<string, string> = {
  hello: `# طباعة النصوص البسيطة على الشاشة\n\nاطبع("مرحباً بك في لغة ألف 5.3!")\nاطبع("لغة برمجة عربية قوية وسريعة.")\n\n# المتغيرات والعمليات الحسابية\nس = 10\nص = 15\nالنتيجة = س + ص\n\nاطبع(م"ناتج جمع {س} و {ص} هو: {النتيجة}")`,
  cond: `# مثال يوضح استخدام الجمل الشرطية (اذا / اواذا / والا)\n\nدرجة_الطالب = 85\nاطبع(م"درجة الطالب هي: {درجة_الطالب}")\n\nاذا درجة_الطالب >= 90:\n\tاطبع("التقدير: ممتاز")\nاواذا درجة_الطالب >= 80:\n\tاطبع("التقدير: جيد جداً")\nوالا:\n\tاطبع("تحتاج إلى مزيد من الجهد")`,
  loop: `# مثال على حلقات التكرار (لكل / بينما)\n\nاطبع("العد من 1 إلى 5 باستخدام حلقة (لكل):")\nلكل رقم في مدى(5):\n\tاطبع(رقم + 1)\n\nاطبع("-------------------")\n\nالعد = 3\nاطبع("العد التنازلي باستخدام حلقة (بينما):")\nبينما العد > 0:\n\tاطبع(العد)\n\tالعد -= 1\nاطبع("انطلاق 🚀!")`,
  func: `# مثال يوضح كيفية إنشاء واستدعاء الدوال\n\nدالة ترحيب(الاسم):\n\tارجع م"أهلاً بك يا {الاسم} في عالم البرمجة!"\n\nدالة حساب_المربع(العدد):\n\tارجع العدد * العدد\n\n# استدعاء الدوال\nاطبع(ترحيب("علي"))\n\nرقم = 6\nاطبع(م"مربع العدد {رقم} هو: {حساب_المربع(رقم)}")`,
  oop: `# مثال يبرز قوة البرمجة كائنية التوجه (OOP)\n\nصنف انسان:\n\tدالة __تهيئة__(هذا, عمر):\n\t\tهذا.العمر = عمر\n\nصنف شخص(انسان):\n\tدالة __تهيئة__(هذا, عمر, طول):\n\t\tاصل().__تهيئة__(عمر)\n\t\tهذا.الطول = طول\n\n\tدالة __عرض__(هذا):\n\t\tارجع م"الطول: {هذا.الطول} سم، العمر: {هذا.العمر} سنة"\n\n# إنشاء كائن جديد وتجربته\nالبطل = شخص(25, 180)\nاطبع("--- بيانات اللاعب ---")\nاطبع(البطل)`,
  arrays: `# التعامل مع المصفوفات\n\nسيارات = ["رياضية", "عائلية", "كهربائية"]\nاطبع("أول سيارة:", سيارات[0])\n\nسيارات.اضف("شاحنة")\nاطبع("بعد الإضافة:", سيارات)\n\nسيارات.امسح("عائلية")\nاطبع("بعد الحذف:", سيارات)\n\nارقام = [7, 1, 8, 9, 5, 36]\nارقام.رتب()\nاطبع("أرقام مرتبة:", ارقام)`,
  dict: `# القواميس (الفهارس)\n\nعلامات = {"عربي": 95, "رياضيات": 88, "علوم": 92}\nاطبع("مفاتيح الفهرس:", علامات.مفاتيح())\nاطبع("القيم:", علامات.قيم())\n\n# جلب قيمة غير موجودة مع قيمة افتراضية\nتاريخ = علامات.احضر("تاريخ", "المادة غير مسجلة")\nاطبع(م"نتيجة التاريخ: {تاريخ}")`,
  trycatch: `# معالجة الأخطاء الاستثنائية\n\nصنف سيارة:\n\tدالة __تهيئة__(هذا, السرعة, اللون):\n\t\tهذا.السرعة = السرعة\n\t\tهذا.اللون = اللون\n\nالسيارة = سيارة(240, "اسود")\n\nحاول:\n\tالوزن = السيارة.الوزن\n\tاطبع(الوزن)\nخلل خطأ_خاصية:\n\tاطبع("هذه الخاصية غير متوفرة في هذا الكائن")\nوالا:\n\tاطبع("تم إسناد الصفة")`,
  input: `# تفاعل الطرفية مع إدخال المستخدم\n\nالمجموع = 0\nاطبع("--- برنامج جمع الأرقام ---")\n\nلكل س في مدى(3):\n\tرقم = صحيح(ادخل(م"ادخل العدد رقم {س + 1}: "))\n\tالمجموع += رقم\n\nاطبع(م"المجموع النهائي هو: {المجموع}")`,
  blank: ``
};

const defaultCode = codeExamples['hello'];

export const useEditorStore = create<EditorState>((set, get) => ({
  activeMode: 'visual',
  isTerminalHidden: false,
  textCode: defaultCode,
  nodes: [],
  edges: [],
  terminalOutput: [],

  setMode: (mode) => set({ activeMode: mode }),
  
  setIsTerminalHidden: (hidden) => set({ isTerminalHidden: hidden }),
  
  setTextCode: (code) => set({ textCode: code }),
  
  setNodes: (nodes) => set((state) => ({ 
    nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes 
  })),
  
  setEdges: (edges) => set((state) => ({ 
    edges: typeof edges === 'function' ? edges(state.edges) : edges 
  })),
  
  onNodesChange: (changes) => set((state) => ({ 
    nodes: applyNodeChanges(changes, state.nodes) 
  })),
  
  onEdgesChange: (changes) => set((state) => ({ 
    edges: applyEdgeChanges(changes, state.edges) 
  })),
  
  appendTerminalOutput: (text, color) => set((state) => ({ 
    terminalOutput: [...state.terminalOutput, { text, color }] 
  })),
  
  clearTerminal: () => set({ terminalOutput: [] }),

  addDynamicInput: (nodeId: string) => set((state) => ({
    nodes: state.nodes.map((node) => {
      if (node.id === nodeId) {
        const currentInputs = (node.data.inputs as any[]) || [];
        const isPair = node.data.allowDynamicInputs === 'pair';
        
        if (isPair) {
          const nextIndex = currentInputs.length / 2;
          const newKeyInput = {
            id: `key_${nextIndex}`,
            label: `مفتاح ${nextIndex + 1}`,
            type: 'data'
          };
          const newValInput = {
            id: `val_${nextIndex}`,
            label: `قيمة ${nextIndex + 1}`,
            type: 'data'
          };
          return {
            ...node,
            data: {
              ...node.data,
              inputs: [...currentInputs, newKeyInput, newValInput]
            }
          };
        } else {
          const nextIndex = currentInputs.length;
          const newInput = {
            id: `item_${nextIndex}`,
            label: `عنصر ${nextIndex + 1}`,
            type: 'data'
          };
          return {
            ...node,
            data: {
              ...node.data,
              inputs: [...currentInputs, newInput]
            }
          };
        }
      }
      return node;
    })
  })),

  updateNodeControl: (nodeId: string, controlId: string, value: any) => set((state) => ({
    nodes: state.nodes.map((node) => {
      if (node.id === nodeId) {
        const newControls = (node.data.controls as any[])?.map(c => c.id === controlId ? { ...c, value } : c);
        return { ...node, data: { ...node.data, controls: newControls } };
      }
      return node;
    })
  })),
}));
