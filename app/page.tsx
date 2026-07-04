"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  applyNodeChanges,
  NodeChange,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import DynamicNode, { NodeData } from './components/DynamicNode';
import DeletableEdge from './components/DeletableEdge';
import { nodeDefinitions } from './components/AlifNodes';
import { generateAlifCodeFromGraph } from './lib/AlifGenerator';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  dynamic: DynamicNode,
};

const edgeTypes = {
  deletable: DeletableEdge,
};

const codeExamples: Record<string, string> = {
  hello: `# طباعة النصوص البسيطة على الشاشة\n\nاطبع("مرحباً بك في لغة ألف 5.3!")\nاطبع("لغة برمجة عربية قوية وسريعة.")\n\n# المتغيرات والعمليات الحسابية\nس = 10\nص = 15\nالنتيجة = س + ص\n\nاطبع(م"ناتج جمع {س} و {ص} هو: {النتيجة}")`,
  cond: `# مثال يوضح استخدام الجمل الشرطية (اذا / اواذا / والا)\n\nدرجة_الطالب = 85\nاطبع(م"درجة الطالب هي: {درجة_الطالب}")\n\nاذا درجة_الطالب >= 90:\n\tاطبع("التقدير: ممتاز")\nاواذا درجة_الطالب >= 80:\n\tاطبع("التقدير: جيد جداً")\nوالا:\n\tاطبع("تحتاج إلى مزيد من الجهد")`,
  loop: `# مثال على حلقات التكرار (لكل / بينما)\n\nاطبع("العد من 1 إلى 5 باستخدام حلقة (لكل):")\nلكل رقم في مدى(5):\n\tاطبع(رقم + 1)\n\nاطبع("-------------------")\n\nالعد = 3\nاطبع("العد التنازلي باستخدام حلقة (بينما):")\nبينما العد > 0:\n\tاطبع(العد)\n\tالعد -= 1\nاطبع("انطلاق 🚀!")`,
  trycatch: `# معالجة الأخطاء الاستثنائية\n\nصنف سيارة:\n\tدالة __تهيئة__(هذا, السرعة, اللون):\n\t\tهذا.السرعة = السرعة\n\t\tهذا.اللون = اللون\n\nالسيارة = سيارة(240, "اسود")\n\nحاول:\n\tالوزن = السيارة.الوزن\n\tاطبع(الوزن)\nخلل خطأ_خاصية:\n\tاطبع("هذه الخاصية غير متوفرة في هذا الكائن")\nوالا:\n\tاطبع("تم إسناد الصفة")`,
  blank: ``,
};

export default function Page() {
  const [isVisualMode, setIsVisualMode] = useState(false);
  const [isTerminalHidden, setIsTerminalHidden] = useState(false);
  const [code, setCode] = useState(codeExamples['hello']);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<{ text: string; color: string }[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [editMenuPos, setEditMenuPos] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const [runState, setRunState] = useState<'connecting' | 'ready' | 'running' | 'error'>('connecting');
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Highlighting Logic
  useEffect(() => {
    let html = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const regex = /(#.*)|(م?"[^"]*")|(^|[^أ-يa-zA-Z0-9_])(اطبع|ادخل|اذا|اواذا|والا|بينما|لكل|في|دالة|ارجع|صح|خطأ|عدم|صنف|اصل|حاول|خلل|نهاية|توقف|استمر|احذف|استورد|من)(?=[^أ-يa-zA-Z0-9_]|$)|(^|[^أ-يa-zA-Z0-9_])(\d+(\.\d+)?)(?=[^أ-يa-zA-Z0-9_]|$)|([=+\-*/!^|]|&lt;|&gt;|&amp;)/g;
    html = html.replace(regex, (match, comment, str, beforeKw, kw, beforeNum, num, numDec, op) => {
        if (comment) return `<span class="text-slate-500">${comment}</span>`; if (str) return `<span class="text-amber-400">${str}</span>`;
        if (kw) return `${beforeKw}<span class="text-fuchsia-400">${kw}</span>`; if (num) return `${beforeNum}<span class="text-cyan-400">${num}</span>`;
        if (op) return `<span class="text-blue-400">${op}</span>`; return match;
    });
    setHighlightedCode(html + (code.endsWith('\n') ? '\n ' : ''));
  }, [code]);

  // WebSocket Connection
  useEffect(() => {
    function connect() {
      setRunState('connecting');
      try {
        const socket = new WebSocket('wss://alif-playground.onrender.com');
        ws.current = socket;
        
        socket.onopen = () => {
          setRunState('ready');
          appendToTerminal('--- تم الاتصال بمحرك ألف 5.3 بنجاح ---\n', 'text-green-500 font-bold');
        };
        
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'output' || data.type === 'error') {
            const color = data.type === 'error' ? 'text-red-400' : 'text-slate-300';
            appendToTerminal(data.text, color);
            if (terminalInputRef.current) {
              terminalInputRef.current.disabled = false;
              terminalInputRef.current.focus();
            }
          } else if (data.type === 'done') {
            appendToTerminal('\n--- انتهى تنفيذ البرنامج ---\n', 'text-slate-500');
            if (terminalInputRef.current) terminalInputRef.current.disabled = true;
            setRunState('ready');
          }
        };
        
        socket.onclose = () => {
          setRunState('error');
          setTimeout(connect, 3000);
        };
        
        socket.onerror = () => {
          if (socket.readyState !== WebSocket.CLOSED) {
            appendToTerminal('\nحدث خطأ في الاتصال بالسحابة.\n', 'text-red-400');
          }
        };
      } catch (error) {
        console.error('WS Error:', error);
      }
    }
    connect();
    return () => { ws.current?.close(); };
  }, []);

  const appendToTerminal = (text: string, color: string) => {
    setTerminalOutput(prev => [...prev, { text, color }]);
    setTimeout(() => {
      if (outputContainerRef.current) {
        outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  const showToastMsg = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      type: 'deletable',
      data: {
        onDelete: (id: string) => setEdges((edges) => edges.filter((e) => e.id !== id))
      }
    }, eds));
  }, [setEdges]);

  // Sync Graph to Code
  useEffect(() => {
    if (isVisualMode) {
      const generatedCode = generateAlifCodeFromGraph(nodes, edges);
      setCode(generatedCode);
    }
  }, [nodes, edges, isVisualMode]);

  const onControlChange = useCallback((nodeId: string, controlId: string, value: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          const newControls = (n.data as NodeData).controls?.map(c => c.id === controlId ? { ...c, value } : c);
          return { ...n, data: { ...n.data, controls: newControls } };
        }
        return n;
      })
    );
  }, [setNodes]);

  const addNode = (typeKey: string) => {
    const template = nodeDefinitions[typeKey];
    if (!template) return;
    
    const newNode: Node = {
      id: uuidv4(),
      type: 'dynamic',
      position: { x: (menuPos?.x || window.innerWidth / 2) - 100, y: (menuPos?.y || window.innerHeight / 2) - 100 },
      data: {
        ...template,
        originalType: typeKey,
        onControlChange: (cId: string, val: any) => onControlChange(newNode.id, cId, val),
      },
    };
    
    setNodes((nds) => nds.concat(newNode));
    setMenuPos(null);
  };

  const startRun = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    if (runState === 'running') {
      ws.current.close(); // Force reconnect
      appendToTerminal('\n⚠️ تم إيقاف التنفيذ يدوياً.\n', 'text-amber-400 font-bold');
      return;
    }
    setTerminalOutput([]);
    setRunState('running');
    if (terminalInputRef.current) {
      terminalInputRef.current.disabled = false;
      terminalInputRef.current.value = '';
    }
    const cleanCode = code.replace(/\u00A0/g, " ");
    ws.current.send(JSON.stringify({ type: 'run', code: cleanCode }));
  };

  const handleTerminalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = e.currentTarget.value;
      if (!val) return;
      appendToTerminal(val + '\n', 'text-green-400');
      ws.current?.send(JSON.stringify({ type: 'input', text: val }));
      e.currentTarget.value = '';
    }
  };

  // Setup Initial Start Node
  useEffect(() => {
    if (nodes.length === 0) {
      addNode('أوامر/بداية البرنامج');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden text-slate-200" onContextMenu={e => e.preventDefault()}>
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 p-3 sm:p-4 flex justify-between items-center shadow-lg z-10 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="text-lg sm:text-2xl font-bold tracking-wide text-slate-100 pt-1">
            محرر <span className="text-blue-400">ألف 5.3</span>
          </h1>
        </div>
        <button
          onClick={startRun}
          disabled={runState === 'connecting' || runState === 'error'}
          className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl text-sm sm:text-base font-bold flex items-center gap-2 shadow-lg transition-all
            ${runState === 'running' ? 'bg-red-600 hover:bg-red-500 text-white' : 
              runState === 'ready' ? 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 text-white' : 
              'bg-slate-600 opacity-80 cursor-not-allowed'}`}
        >
          <span>{runState === 'running' ? 'إيقاف' : runState === 'connecting' ? 'جاري الاتصال...' : runState === 'error' ? 'انقطع الاتصال' : 'تشغيل'}</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col md:flex-row bg-[#0b1120] overflow-hidden transition-all duration-300">
        {/* Editor Section */}
        <section className={`flex-1 flex flex-col border-b md:border-b-0 md:border-l border-slate-700/50 min-h-0 min-w-0 ${isTerminalHidden ? 'md:flex-none md:w-full' : ''}`}>
          <div className="bg-slate-800/50 py-2 px-2 sm:px-4 border-b border-slate-700/50 flex justify-between items-center z-10">
            <button
              onClick={() => setIsVisualMode(!isVisualMode)}
              className="flex items-center gap-2 text-emerald-400 font-bold bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-emerald-900/50 text-sm"
            >
              {isVisualMode ? 'المحرر المرئي' : 'الشيفرة المصدرية'}
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsTerminalHidden(!isTerminalHidden)} className="text-blue-400 p-1.5 hover:bg-slate-700 rounded text-sm font-bold">
                 {isTerminalHidden ? 'إظهار الطرفية' : 'إخفاء الطرفية'}
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            {/* Visual Editor */}
            <div className={`absolute inset-0 transition-opacity duration-200 ${isVisualMode ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onPaneContextMenu={(e) => { e.preventDefault(); setMenuPos({ x: e.clientX, y: e.clientY }); }}
                onNodeContextMenu={(e, node) => { e.preventDefault(); setEditMenuPos({ x: e.clientX, y: e.clientY, nodeId: node.id }); }}
                fitView
                connectionRadius={40}
                connectionLineStyle={{ stroke: '#fff', strokeWidth: 2, strokeDasharray: '3 3' }}
                defaultEdgeOptions={{
                  type: 'deletable',
                  style: { stroke: '#52525b', strokeWidth: 1.5 },
                }}
              >
                <Background color="#334155" gap={25} size={1.5} />
                <Controls />
              </ReactFlow>

              <button
                onClick={(e) => { e.stopPropagation(); setMenuPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 }); }}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl px-6 py-3.5 font-bold z-30"
              >
                إضافة عقدة
              </button>
            </div>

            {/* Text Editor */}
            <div className={`absolute inset-0 transition-opacity duration-200 ${!isVisualMode ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
              <pre
                className="code-font absolute inset-0 p-4 overflow-y-auto whitespace-pre-wrap break-all pointer-events-none text-slate-300 z-0 text-right no-scrollbar"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={() => { if(editorRef.current) { const pre = editorRef.current.previousSibling as HTMLPreElement; if(pre) { pre.scrollTop = editorRef.current.scrollTop; } } }}
                className="code-font absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white outline-none resize-none overflow-y-auto whitespace-pre-wrap break-all z-10 text-right no-scrollbar"
                spellCheck="false"
                placeholder="اكتب كود ألف 5.3 هنا..."
              />
            </div>
          </div>
        </section>

        {/* Terminal Section */}
        {!isTerminalHidden && (
          <section className="flex-1 flex flex-col bg-black/40 shadow-inner min-h-0 min-w-0 transition-all duration-300">
            <div className="bg-slate-800/50 text-slate-400 text-sm py-2 px-4 border-b border-slate-700/50 flex justify-between items-center shrink-0">
              <span>طرفية المخرجات</span>
              <button onClick={() => setTerminalOutput([])} className="text-slate-500 hover:text-slate-200 px-2 py-1 hover:bg-slate-700/50 rounded text-xs">مسح الشاشة</button>
            </div>
            
            <div ref={outputContainerRef} className="flex-1 p-4 overflow-y-auto w-full text-right">
              {terminalOutput.map((out, i) => (
                <span key={i} className={out.color} style={{ whiteSpace: 'pre-wrap' }}>{out.text}</span>
              ))}
            </div>

            <div className="bg-slate-900/80 backdrop-blur border-t border-slate-700/50 flex items-center px-4 py-3">
              <span className="text-green-500 font-bold ml-2">{'>>'}</span>
              <input
                ref={terminalInputRef}
                type="text"
                disabled
                onKeyDown={handleTerminalInput}
                className="flex-1 bg-transparent text-white outline-none text-sm placeholder-slate-600"
                placeholder="اكتب إدخالك هنا واضغط Enter..."
              />
            </div>
          </section>
        )}
      </main>

      {/* Add Node Menu */}
      {menuPos && (
        <div
          className="fixed bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-xl shadow-2xl z-50 w-56 max-h-[75vh] overflow-y-auto custom-menu-scroll text-right"
          style={{ top: menuPos.y, left: menuPos.x, transform: 'translate(-50%, -50%)' }}
        >
          <div className="bg-slate-700/80 px-4 py-2 flex justify-between sticky top-0 border-b border-slate-600">
            <span className="text-xs font-bold text-emerald-300">🚀 أوامر</span>
            <button onClick={() => setMenuPos(null)} className="text-white text-xs">✕</button>
          </div>
          {Object.entries(nodeDefinitions).map(([key, def]) => (
            <button
              key={key}
              onClick={() => addNode(key)}
              className="w-full text-right px-4 py-2 hover:bg-slate-700 text-slate-200 text-sm border-b border-slate-700/50"
            >
              {def.label}
            </button>
          ))}
        </div>
      )}

      {/* Edit Node Menu */}
      {editMenuPos && (
        <div
          className="fixed bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-xl shadow-2xl z-50 w-48 text-right"
          style={{ top: editMenuPos.y, left: editMenuPos.x }}
        >
          <div className="bg-slate-700/50 px-4 py-2 flex justify-between border-b border-slate-600">
            <span className="text-xs text-yellow-400 font-bold">⚙️ تعديل العقدة</span>
            <button onClick={() => setEditMenuPos(null)} className="text-white text-xs">✕</button>
          </div>
          <button
            onClick={() => {
              setNodes(nds => nds.filter(n => n.id !== editMenuPos.nodeId));
              setEditMenuPos(null);
            }}
            className="w-full text-right px-4 py-3 hover:bg-red-600 text-red-200 text-sm"
          >
            حذف العقدة 🗑️
          </button>
        </div>
      )}

      {/* Toast Message */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 px-5 py-2.5 rounded-xl shadow-2xl z-50 text-sm font-bold border border-slate-700 ${toast.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
