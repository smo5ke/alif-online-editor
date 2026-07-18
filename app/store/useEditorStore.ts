import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

type EditorMode = 'visual' | 'code' | 'terminal';

export interface TerminalLine {
  text: string;
  color: string;
}

export interface MacroData {
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export type GraphSnapshot = {
  nodes: Node[];
  edges: Edge[];
  mainGraph: { nodes: Node[]; edges: Edge[] };
  macros: Record<string, MacroData>;
  currentGraphId: string;
};

interface EditorState {
  // State
  activeMode: EditorMode;
  isTerminalHidden: boolean;
  textCode: string;
  nodes: Node[];
  edges: Edge[];
  terminalOutput: TerminalLine[];
  
  currentGraphId: string;
  mainGraph: { nodes: Node[]; edges: Edge[] };
  macros: Record<string, MacroData>;

  errorNodeId: string | null;
  lastRunCode: string;

  past: GraphSnapshot[];
  future: GraphSnapshot[];

  // Actions
  commitHistory: () => void;
  undo: () => void;
  redo: () => void;
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
  addDynamicOutput: (nodeId: string) => void;
  removeDynamicInput: (nodeId: string, portId: string) => void;
  removeDynamicOutput: (nodeId: string, portId: string) => void;
  syncMacroInstances: (macroId: string) => void;
  updateNodeControl: (nodeId: string, controlId: string, value: any) => void;

  createMacro: (name: string) => void;
  switchGraph: (targetId: string) => void;
  setErrorNode: (nodeId: string | null) => void;
  setLastRunCode: (code: string) => void;
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
  
  currentGraphId: 'main',
  mainGraph: { nodes: [], edges: [] },
  macros: {},
  errorNodeId: null,
  lastRunCode: '',
  past: [],
  future: [],

  commitHistory: () => set((state) => {
    // Avoid storing history if past is full or whatever, but let's just keep max 50 states
    const snapshot: GraphSnapshot = {
      nodes: state.nodes,
      edges: state.edges,
      mainGraph: state.mainGraph,
      macros: state.macros,
      currentGraphId: state.currentGraphId
    };
    
    // Only commit if there are actually some changes? React Flow handles objects nicely.
    // For simplicity, we just push the snapshot.
    const newPast = [...state.past, snapshot];
    if (newPast.length > 50) newPast.shift(); // Keep last 50 states
    
    return {
      past: newPast,
      future: [] // Any new action invalidates the redo future
    };
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return {};
    
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    
    const currentSnapshot: GraphSnapshot = {
      nodes: state.nodes,
      edges: state.edges,
      mainGraph: state.mainGraph,
      macros: state.macros,
      currentGraphId: state.currentGraphId
    };
    
    return {
      past: newPast,
      future: [currentSnapshot, ...state.future],
      nodes: previous.nodes,
      edges: previous.edges,
      mainGraph: previous.mainGraph,
      macros: previous.macros,
      currentGraphId: previous.currentGraphId
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return {};
    
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    
    const currentSnapshot: GraphSnapshot = {
      nodes: state.nodes,
      edges: state.edges,
      mainGraph: state.mainGraph,
      macros: state.macros,
      currentGraphId: state.currentGraphId
    };
    
    return {
      past: [...state.past, currentSnapshot],
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
      mainGraph: next.mainGraph,
      macros: next.macros,
      currentGraphId: next.currentGraphId
    };
  }),

  setMode: (mode) => set({ activeMode: mode }),
  
  setIsTerminalHidden: (hidden) => set({ isTerminalHidden: hidden }),
  
  setTextCode: (code) => set({ textCode: code }),
  
  setNodes: (nodes) => set((state) => ({ 
    nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes 
  })),
  
  setEdges: (edges) => set((state) => ({ 
    edges: typeof edges === 'function' ? edges(state.edges) : edges 
  })),
  
  onNodesChange: (changes) => set((state) => {
    if (changes.some(c => c.type === 'remove' || c.type === 'add')) {
      state.commitHistory();
    }
    return { nodes: applyNodeChanges(changes, state.nodes), errorNodeId: null };
  }),
  
  onEdgesChange: (changes) => set((state) => {
    if (changes.some(c => c.type === 'remove' || c.type === 'add')) {
      state.commitHistory();
    }
    return { edges: applyEdgeChanges(changes, state.edges), errorNodeId: null };
  }),
  
  appendTerminalOutput: (text, color) => set((state) => ({ 
    terminalOutput: [...state.terminalOutput, { text, color }] 
  })),
  
  clearTerminal: () => set({ terminalOutput: [], errorNodeId: null }),
  
  setErrorNode: (nodeId) => set({ errorNodeId: nodeId }),
  setLastRunCode: (code) => set({ lastRunCode: code }),

  addDynamicInput: (nodeId: string) => set((state) => {
    state.commitHistory();
    const newNodes = state.nodes.map((node) => {
      if (node.id === nodeId) {
        const currentInputs = (node.data.inputs as any[]) || [];
        const isPair = node.data.allowDynamicInputs === 'pair';
        
        if (isPair) {
          const nextIndex = currentInputs.length / 2;
          const newKeyInput = { id: `key_${nextIndex}_${Date.now()}`, label: `مفتاح ${nextIndex + 1}`, type: 'data' };
          const newValInput = { id: `val_${nextIndex}_${Date.now()}`, label: `قيمة ${nextIndex + 1}`, type: 'data' };
          return { ...node, data: { ...node.data, inputs: [...currentInputs, newKeyInput, newValInput] } };
        } else {
          const nextIndex = currentInputs.length;
          const newInput = { id: `item_${nextIndex}_${Date.now()}`, label: `عنصر ${nextIndex + 1}`, type: 'data' };
          return { ...node, data: { ...node.data, inputs: [...currentInputs, newInput] } };
        }
      }
      return node;
    });

    if (state.currentGraphId !== 'main') {
      setTimeout(() => useEditorStore.getState().syncMacroInstances(state.currentGraphId), 0);
    }
    
    return { nodes: newNodes };
  }),

  updateNodeControl: (nodeId: string, controlId: string, value: any) => set((state) => {
    state.commitHistory();
    return {
      nodes: state.nodes.map((node) => {
      if (node.id === nodeId) {
        const newControls = (node.data.controls as any[])?.map(c => c.id === controlId ? { ...c, value } : c);
        return { ...node, data: { ...node.data, controls: newControls } };
      }
      return node;
      })
    };
  }),

  addDynamicOutput: (nodeId: string) => set((state) => {
    state.commitHistory();
    const newNodes = state.nodes.map((node) => {
      if (node.id === nodeId) {
        const currentOutputs = (node.data.outputs as any[]) || [];
        const nextIndex = currentOutputs.length;
        const newOutput = { id: `out_${nextIndex}_${Date.now()}`, label: `مخرج ${nextIndex + 1}`, type: 'data' };
        return { ...node, data: { ...node.data, outputs: [...currentOutputs, newOutput] } };
      }
      return node;
    });

    if (state.currentGraphId !== 'main') {
      setTimeout(() => useEditorStore.getState().syncMacroInstances(state.currentGraphId), 0);
    }

    return { nodes: newNodes };
  }),

  removeDynamicInput: (nodeId: string, portId: string) => set((state) => {
    state.commitHistory();
    const newNodes = state.nodes.map((node) => {
      if (node.id === nodeId) {
        const currentInputs = (node.data.inputs as any[]) || [];
        return {
          ...node,
          data: {
            ...node.data,
            inputs: currentInputs.filter(i => i.id !== portId)
          }
        };
      }
      return node;
    });
    
    // Cleanup edges connected to this port
    const newEdges = state.edges.filter(e => !(e.target === nodeId && e.targetHandle === portId));

    if (state.currentGraphId !== 'main') {
      setTimeout(() => useEditorStore.getState().syncMacroInstances(state.currentGraphId), 0);
    }

    return { nodes: newNodes, edges: newEdges };
  }),

  removeDynamicOutput: (nodeId: string, portId: string) => set((state) => {
    state.commitHistory();
    const newNodes = state.nodes.map((node) => {
      if (node.id === nodeId) {
        const currentOutputs = (node.data.outputs as any[]) || [];
        return {
          ...node,
          data: {
            ...node.data,
            outputs: currentOutputs.filter(o => o.id !== portId)
          }
        };
      }
      return node;
    });

    // Cleanup edges connected to this port
    const newEdges = state.edges.filter(e => !(e.source === nodeId && e.sourceHandle === portId));

    if (state.currentGraphId !== 'main') {
      setTimeout(() => useEditorStore.getState().syncMacroInstances(state.currentGraphId), 0);
    }

    return { nodes: newNodes, edges: newEdges };
  }),

  syncMacroInstances: (macroId: string) => set((state) => {
    // Determine where the macro's latest definition is
    const macroNodes = state.currentGraphId === macroId ? state.nodes : state.macros[macroId]?.nodes || [];
    
    const inputsNode = macroNodes.find(n => (n.data as any).originalType === 'ماكرو/مدخلات');
    const outputsNode = macroNodes.find(n => (n.data as any).originalType === 'ماكرو/مخرجات');
    
    const macroCallInputs = (inputsNode?.data as any)?.outputs || [];
    const macroCallOutputs = (outputsNode?.data as any)?.inputs || [];

    const updateNodes = (nodes: Node[]) => nodes.map(n => {
      if ((n.data as any).isMacro && (n.data as any).macroId === macroId) {
        return {
          ...n,
          data: {
            ...n.data,
            inputs: macroCallInputs,
            outputs: macroCallOutputs
          }
        };
      }
      return n;
    });

    const cleanEdges = (edges: Edge[], nodes: Node[]) => edges.filter(e => {
      const sourceNode = nodes.find(n => n.id === e.source);
      const targetNode = nodes.find(n => n.id === e.target);
      if (!sourceNode || !targetNode) return false;
      
      const sourceHasOutput = (sourceNode.data as any).outputs?.some((o: any) => o.id === e.sourceHandle);
      const targetHasInput = (targetNode.data as any).inputs?.some((i: any) => i.id === e.targetHandle);
      
      if ((sourceNode.data as any).isMacro && !sourceHasOutput) return false;
      if ((targetNode.data as any).isMacro && !targetHasInput) return false;
      return true;
    });

    const newState: Partial<EditorState> = {};
    
    if (state.currentGraphId === 'main') {
      newState.nodes = updateNodes(state.nodes);
      newState.edges = cleanEdges(state.edges, newState.nodes);
      
      const newMacros = { ...state.macros };
      Object.keys(newMacros).forEach(key => {
        newMacros[key] = {
          ...newMacros[key],
          nodes: updateNodes(newMacros[key].nodes),
          edges: cleanEdges(newMacros[key].edges, updateNodes(newMacros[key].nodes))
        };
      });
      newState.macros = newMacros;
    } else {
      newState.nodes = updateNodes(state.nodes);
      newState.edges = cleanEdges(state.edges, newState.nodes);
      
      newState.mainGraph = {
        nodes: updateNodes(state.mainGraph.nodes),
        edges: cleanEdges(state.mainGraph.edges, updateNodes(state.mainGraph.nodes))
      };
      
      const newMacros = { ...state.macros };
      Object.keys(newMacros).forEach(key => {
        if (key !== state.currentGraphId) {
          newMacros[key] = {
            ...newMacros[key],
            nodes: updateNodes(newMacros[key].nodes),
            edges: cleanEdges(newMacros[key].edges, updateNodes(newMacros[key].nodes))
          };
        }
      });
      newState.macros = newMacros;
    }

    return newState;
  }),

  createMacro: (name: string) => set((state) => {
    state.commitHistory();
    const macroId = `macro_${Date.now()}`;
    return {
      macros: {
        ...state.macros,
        [macroId]: {
          name,
          nodes: [],
          edges: []
        }
      }
    };
  }),

  switchGraph: (targetId: string) => set((state) => {
    if (state.currentGraphId === targetId) return {};

    state.commitHistory();

    // 1. Save current active nodes/edges to their storage
    let newMainGraph = state.mainGraph;
    let newMacros = { ...state.macros };
    if (state.currentGraphId === 'main') {
      newMainGraph = { nodes: state.nodes, edges: state.edges };
    } else if (newMacros[state.currentGraphId]) {
      newMacros[state.currentGraphId] = { 
        ...newMacros[state.currentGraphId], 
        nodes: state.nodes, 
        edges: state.edges 
      };
    }

    // 2. Load target graph
    let targetNodes: Node[] = [];
    let targetEdges: Edge[] = [];
    if (targetId === 'main') {
      targetNodes = newMainGraph.nodes;
      targetEdges = newMainGraph.edges;
    } else if (newMacros[targetId]) {
      targetNodes = newMacros[targetId].nodes;
      targetEdges = newMacros[targetId].edges;
    }

    return {
      currentGraphId: targetId,
      mainGraph: newMainGraph,
      macros: newMacros,
      nodes: targetNodes,
      edges: targetEdges
    };
  }),
}));
