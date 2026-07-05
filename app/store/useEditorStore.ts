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
}

export const codeExamples: Record<string, string> = {
  hello: `# طباعة النصوص البسيطة على الشاشة\n\nاطبع("مرحباً بك في لغة ألف 5.3!")\nاطبع("لغة برمجة عربية قوية وسريعة.")\n\n# المتغيرات والعمليات الحسابية\nس = 10\nص = 15\nالنتيجة = س + ص\n\nاطبع(م"ناتج جمع {س} و {ص} هو: {النتيجة}")`,
  cond: `# مثال يوضح استخدام الجمل الشرطية (اذا / اواذا / والا)\n\nدرجة_الطالب = 85\nاطبع(م"درجة الطالب هي: {درجة_الطالب}")\n\nاذا درجة_الطالب >= 90:\n\tاطبع("التقدير: ممتاز")\nاواذا درجة_الطالب >= 80:\n\tاطبع("التقدير: جيد جداً")\nوالا:\n\tاطبع("تحتاج إلى مزيد من الجهد")`,
  loop: `# مثال على حلقات التكرار (لكل / بينما)\n\nاطبع("العد من 1 إلى 5 باستخدام حلقة (لكل):")\nلكل رقم في مدى(5):\n\tاطبع(رقم + 1)\n\nاطبع("-------------------")\n\nالعد = 3\nاطبع("العد التنازلي باستخدام حلقة (بينما):")\nبينما العد > 0:\n\tاطبع(العد)\n\tالعد -= 1\nاطبع("انطلاق 🚀!")`,
  trycatch: `# معالجة الأخطاء الاستثنائية\n\nصنف سيارة:\n\tدالة __تهيئة__(هذا, السرعة, اللون):\n\t\tهذا.السرعة = السرعة\n\t\tهذا.اللون = اللون\n\nالسيارة = سيارة(240, "اسود")\n\nحاول:\n\tالوزن = السيارة.الوزن\n\tاطبع(الوزن)\nخلل خطأ_خاصية:\n\tاطبع("هذه الخاصية غير متوفرة في هذا الكائن")\nوالا:\n\tاطبع("تم إسناد الصفة")`,
  blank: ``,
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
}));
