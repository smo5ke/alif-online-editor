import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, MiniMap, Controls, Background, Connection, Edge, ReactFlowInstance, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toPng } from 'html-to-image';
import { v4 as uuidv4 } from 'uuid';
import { useEditorStore } from '../../store/useEditorStore';
import DynamicNode, { NodeData } from '../DynamicNode';
import DeletableEdge from '../DeletableEdge';
import { nodeDefinitions, buildMacroCallPorts } from '../AlifNodes';
import '@xyflow/react/dist/style.css';

import { getLayoutedElements } from '../../lib/layoutUtils';
import { generateRunnableCode } from '../../lib/runnableGraph';
import { LayoutTemplate, Code, X, Camera } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const nodeTypes = {
  dynamic: DynamicNode,
};

const edgeTypes = {
  deletable: DeletableEdge,
};

export default function VisualEditor() {
  const { activeMode, nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, currentGraphId, macros, createMacro, switchGraph, commitHistory, undo, redo } = useEditorStore();
  
  const [menuPos, setMenuPos] = useState<{ x: number; y: number; showAll?: boolean } | null>(null);
  const [editMenuPos, setEditMenuPos] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Combine static node definitions with dynamic macro definitions
  const combinedNodeDefinitions = React.useMemo(() => {
    const combined: Record<string, any> = { ...nodeDefinitions };

    Object.entries(macros || {}).forEach(([id, macro]) => {
      // While viewing the macro itself, read the LIVE nodes so the menu
      // reflects port edits immediately instead of a stale stored copy.
      const defNodes = currentGraphId === id ? nodes : macro.nodes;
      const inputsNode = defNodes.find(n => n.data.originalType === 'ماكرو/مدخلات');
      const outputsNode = defNodes.find(n => n.data.originalType === 'ماكرو/مخرجات');

      // The data outputs of the Macro Inputs node become the data INPUTS
      // of the macro call node (plus canonical seq flow ports).
      const { inputs: macroCallInputs, outputs: macroCallOutputs } = buildMacroCallPorts(
        (inputsNode?.data as any)?.outputs,
        (outputsNode?.data as any)?.inputs
      );

      combined[`macro:${id}`] = {
        label: macro.name,
        subtitle: 'استدعاء كتلة',
        iconName: 'Box',
        color: '#a855f7',
        inputs: macroCallInputs,
        outputs: macroCallOutputs,
        isMacro: true,
        macroId: id,
      };
    });
    return combined;
  }, [macros, nodes, currentGraphId]);

  const onLayout = useCallback(() => {
    commitHistory();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      'RL'
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [nodes, edges, setNodes, setEdges, commitHistory]);

  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target || params.source === params.target) return;
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    
    if (sourceNode && targetNode) {
      const sourceData = sourceNode.data as NodeData;
      const targetData = targetNode.data as NodeData;
      
      const outputPort = sourceData.outputs?.find(o => o.id === params.sourceHandle);
      const inputPort = targetData.inputs?.find(i => i.id === params.targetHandle);

      const reportConnectError = (msg: string) => {
        const st = useEditorStore.getState();
        st.appendTerminalOutput(`⚠️ ${msg}\n`, 'text-amber-400');
        st.setIsTerminalHidden(false);
      };

      if (!outputPort || !inputPort) {
        reportConnectError('اتجاه التوصيل غير صحيح! اسحب الخط دائماً من مخرج العقدة (اليسار) إلى مدخل العقدة التالية (اليمين).');
        return;
      }

      const sourceType = outputPort.type;
      const targetType = inputPort.type;

      // ألف لغة ديناميكية: المنع الصارم فقط لخلط حدث/بيانات أو عكس الاتجاه.
      // اختلاف الأنواع الفرعية للبيانات (رقم مقابل نص...) مجرد تحذير مع السماح بالتوصيل.
      const involvesEvent = sourceType === 'event' || targetType === 'event';

      if (involvesEvent && sourceType !== targetType) {
        reportConnectError('اتجاه التوصيل غير صحيح! وصل مخرجات التسلسل بمدخلات التسلسل فقط، ومخارج البيانات بمدخلات البيانات.');
        return;
      }

      const isWildcard = (t?: string) => t === 'data' || t === 'any';
      if (!involvesEvent && !isWildcard(sourceType) && !isWildcard(targetType) && sourceType !== targetType) {
        const st = useEditorStore.getState();
        st.appendTerminalOutput(`⚠️ تنبيه: توصيل ${sourceType} بمدخل ${targetType} (لغة ألف ديناميكية، تم السماح بالتوصيل).\n`, 'text-amber-400');
      }
      
      commitHistory();

      const animated = outputPort.type === 'event' || params.sourceHandle === 'seq_out';
      
      setEdges((eds) => {
        // Automatically replace any existing edge to the same target handle to avoid duplicate incoming connections
        const filtered = eds.filter(e => !(e.target === params.target && e.targetHandle === params.targetHandle));
        return [
          ...filtered,
          {
            ...params,
            id: `e-${params.source}-${params.target}-${uuidv4()}`,
            type: 'deletable',
            animated,
            data: {
              onDelete: (id: string) => {
                commitHistory(); // Record deletion
                setEdges((edges) => edges.filter((e) => e.id !== id));
              }
            }
          }
        ];
      });
    }
  }, [nodes, setEdges, commitHistory]);

  const isValidConnection = useCallback((connection: Connection | Edge) => {
    if (!connection.source || !connection.target || connection.source === connection.target) return false;
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    if (!sourceNode || !targetNode) return false;

    const sourceData = sourceNode.data as NodeData;
    const targetData = targetNode.data as NodeData;

    // Strictly ensure sourceHandle is an OUTPUT and targetHandle is an INPUT
    const outputPort = sourceData.outputs?.find(o => o.id === connection.sourceHandle);
    const inputPort = targetData.inputs?.find(i => i.id === connection.targetHandle);

    if (!outputPort || !inputPort) return false;

    const sourceType = outputPort.type;
    const targetType = inputPort.type;

    // ألف ديناميكية: الرفض الحي فقط لخلط حدث/بيانات؛ باقي توصيلات البيانات مسموحة
    if (sourceType === 'event' || targetType === 'event') {
      return sourceType === targetType;
    }
    return true;
  }, [nodes]);

  const exportAsImage = useCallback(() => {
    if (nodes.length === 0) {
      const st = useEditorStore.getState();
      st.appendTerminalOutput('⚠️ لا توجد عقد في المخطط لتصديرها!\n', 'text-amber-400');
      st.setIsTerminalHidden(false);
      return;
    }

    const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewportElement) return;

    const nodesBounds = getNodesBounds(nodes);
    const padding = 60;
    const imageWidth = Math.max(nodesBounds.width + padding * 2, 400);
    const imageHeight = Math.max(nodesBounds.height + padding * 2, 300);
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      padding
    );

    toPng(viewportElement, {
      backgroundColor: '#0b1120',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `مخطط-ألف-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('فشل تصدير الصورة:', err);
        const st = useEditorStore.getState();
        st.appendTerminalOutput('⚠️ حدث خطأ أثناء تصدير الصورة.\n', 'text-red-400');
        st.setIsTerminalHidden(false);
      });
  }, [nodes]);

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
    const template = combinedNodeDefinitions[typeKey];
    if (!template) return;
    
    let screenX = window.innerWidth / 2;
    let screenY = window.innerHeight / 2;
    
    if (menuPos) {
      screenX = menuPos.x;
      screenY = menuPos.y;
    } else if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      screenX = rect.left + rect.width / 2;
      screenY = rect.top + rect.height / 2;
    }
    
    let position = { x: screenX - 100, y: screenY - 100 };
    if (reactFlowInstance) {
      position = reactFlowInstance.screenToFlowPosition({ x: screenX, y: screenY });
      position.x -= 100; // offset by half typical node width
      position.y -= 50;  // offset by half typical node height
    }

    const newNode = {
      id: uuidv4(),
      type: 'dynamic',
      position,
      data: {
        ...template,
        originalType: typeKey,
        onControlChange: (cId: string, val: any) => onControlChange(newNode.id, cId, val),
      },
    };
    
    setMenuPos(null);
    // Record pre-add state so Ctrl+Z removes the added node
    useEditorStore.getState().commitHistory();
    setNodes((nds) => nds.concat(newNode));
  };

  useEffect(() => {
    if (nodes.length === 0) {
      if (currentGraphId === 'main') {
        addNode('أوامر/بداية البرنامج');
      } else {
        addNode('ماكرو/مدخلات');
        setTimeout(() => addNode('ماكرو/مخرجات'), 50);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGraphId, nodes.length]);

  return (
    <div ref={wrapperRef} className={`absolute inset-0 transition-opacity duration-200 ${activeMode === 'visual' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
      
      {/* Macro Top Bar */}
      <div className="absolute top-4 right-4 left-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Left side: Back to main (if in macro) */}
        <div className="pointer-events-auto">
          {currentGraphId !== 'main' && (
            <button
              onClick={() => switchGraph('main')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              العودة للرئيسية
            </button>
          )}
        </div>

        {/* Right side: Macros Navigation */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-xl p-2 shadow-lg" dir="rtl">
          <span className="text-slate-300 font-bold text-sm ml-2">المخططات:</span>
          
          <button
            onClick={() => switchGraph('main')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${currentGraphId === 'main' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
          >
            الرئيسية
          </button>
          
          <div className="w-px h-6 bg-slate-600 mx-1"></div>
          
          {Object.entries(macros || {}).map(([id, macro]) => (
            <button
              key={id}
              onClick={() => switchGraph(id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${currentGraphId === id ? 'bg-purple-600 text-white' : 'hover:bg-slate-700 text-slate-400'}`}
            >
              {macro.name}
            </button>
          ))}

          <button
            onClick={() => {
              const name = prompt('أدخل اسم الكتلة الجديدة:');
              if (name) createMacro(name);
            }}
            className="px-3 py-1.5 rounded-lg text-sm font-bold bg-slate-700 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors border border-emerald-500/30 flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            جديد
          </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onNodeDragStart={() => commitHistory()}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={setReactFlowInstance}
        onPaneContextMenu={(e) => { e.preventDefault(); setMenuPos({ x: e.clientX, y: e.clientY }); }}
        onNodeContextMenu={(e, node) => { e.preventDefault(); setEditMenuPos({ x: e.clientX, y: e.clientY, nodeId: node.id }); }}
        fitView
        minZoom={0.1}
        maxZoom={2}
        elevateNodesOnSelect={false}
        onlyRenderVisibleElements={true}
        connectionRadius={40}
        connectionLineStyle={{ stroke: '#fff', strokeWidth: 2, strokeDasharray: '3 3' }}
        defaultEdgeOptions={{
          type: 'deletable',
          style: { stroke: '#52525b', strokeWidth: 1.5 },
        }}
      >
        <Background color="#334155" gap={25} size={1.5} />
        <Controls className="!bottom-20 md:!bottom-4" />
        <MiniMap 
          nodeStrokeColor="#64748b" 
          nodeColor="#1e293b" 
          maskColor="rgba(11, 17, 32, 0.7)" 
          className="!hidden md:!block !bottom-4 !right-4 !bg-slate-900/80 !border !border-slate-700/60 !rounded-xl !shadow-2xl" 
        />
      </ReactFlow>

      <div className="absolute bottom-6 md:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-30">
        <button
          onClick={() => {
            // Always preview the full runnable program (same as Run),
            // even when viewing inside a macro.
            setGeneratedCode(generateRunnableCode());
            setShowCodeModal(true);
          }}
          className="bg-slate-700 hover:bg-slate-600 text-white rounded-full shadow-2xl w-12 h-12 flex items-center justify-center transition-colors border border-slate-600/50"
          title="عرض الشيفرة المصدرية"
        >
          <Code size={20} className="text-blue-400" />
        </button>
        <button
          onClick={onLayout}
          className="bg-slate-700 hover:bg-slate-600 text-white rounded-full shadow-2xl w-12 h-12 flex items-center justify-center transition-colors border border-slate-600/50"
          title="ترتيب العقد تلقائياً"
        >
          <LayoutTemplate size={20} className="text-emerald-400" />
        </button>
        <button
          onClick={exportAsImage}
          className="bg-slate-700 hover:bg-slate-600 text-white rounded-full shadow-2xl w-12 h-12 flex items-center justify-center transition-colors border border-slate-600/50"
          title="تصدير المخطط كصورة (PNG)"
        >
          <Camera size={20} className="text-purple-400" />
        </button>
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            if (wrapperRef.current) {
              const rect = wrapperRef.current.getBoundingClientRect();
              setMenuPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, showAll: true });
            } else {
              setMenuPos({ x: window.innerWidth / 2, y: window.innerHeight / 2, showAll: true }); 
            }
          }}
          className="w-35 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl px-6 py-3.5 font-bold"
        >
          إضافة عقدة
        </button>
      </div>

      {/* Add Node Menu (Mobile friendly Bottom Sheet style on small screens) */}
      {menuPos && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
          {/* Backdrop for mobile */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm md:hidden pointer-events-auto" onClick={() => setMenuPos(null)} />
          
          <div
            className="pointer-events-auto bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-t-2xl md:rounded-xl shadow-2xl w-full md:w-56 max-h-[60vh] md:max-h-[75vh] overflow-hidden flex flex-col transform transition-transform text-right"
            style={{
              position: window.innerWidth < 768 ? 'relative' : 'absolute',
              top: window.innerWidth < 768 ? 'auto' : menuPos.y,
              left: window.innerWidth < 768 ? 'auto' : menuPos.x,
              transform: window.innerWidth < 768 ? 'none' : 'translate(-50%, -50%)',
            }}
          >
            <div className="bg-slate-700/80 px-4 py-3 md:py-2 flex justify-between items-center shrink-0 border-b border-slate-600">
              <span className="text-sm md:text-xs font-bold text-emerald-300">🚀 إضافة أوامر</span>
              <button onClick={() => { setMenuPos(null); setSearchQuery(''); }} className="text-slate-300 hover:text-white text-sm md:text-xs px-2 py-1 bg-slate-600/50 hover:bg-slate-500 rounded transition-colors">✕</button>
            </div>
            
            <div className="px-3 py-2 bg-slate-800 border-b border-slate-600 shrink-0">
              <input
                type="text"
                autoFocus
                placeholder="ابحث عن أمر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded p-1.5 text-right text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                dir="rtl"
              />
            </div>

            <div className="overflow-y-auto custom-menu-scroll pb-6 md:pb-0 flex-1">
              {(() => {
                const search = searchQuery.trim().toLowerCase();
                if (!search && !menuPos.showAll) {
                  return <div className="p-8 text-center text-slate-400 text-sm">ابحث عن اسم الأمر أو العقدة المطلوبة...</div>;
                }

                const importedLibraries = nodes
                  .filter(n => n.data.originalType === 'استيراد/مكتبة')
                  .map(n => (n.data as any).controls?.find((c: any) => c.id === 'lib')?.value);
                const hasMathImport = importedLibraries.includes('الرياضيات');
                const hasTimeImport = importedLibraries.includes('الوقت');
                const hasRandomImport = importedLibraries.includes('العشوائي');

                const filteredEntries = Object.entries(combinedNodeDefinitions).filter(([key, def]) => {
                  if (currentGraphId === 'main' && (key === 'ماكرو/مدخلات' || key === 'ماكرو/مخرجات')) return false;
                  if (currentGraphId !== 'main' && key === 'أوامر/بداية البرنامج') return false;
                  
                  if (key.startsWith('رياضيات/') && !hasMathImport) return false;
                  if (key.startsWith('وقت/') && !hasTimeImport) return false;
                  if (key.startsWith('عشوائي/') && !hasRandomImport) return false;
                  
                  if (!search && menuPos.showAll) return true;
                  return def.label.toLowerCase().includes(search) || 
                         (def.subtitle && def.subtitle.toLowerCase().includes(search)) ||
                         key.toLowerCase().includes(search);
                });

                if (filteredEntries.length === 0) {
                  return <div className="p-4 text-center text-slate-400 text-sm">لم يتم العثور على نتائج</div>;
                }

                const grouped = filteredEntries.reduce((acc, [key, def]) => {
                  let category = key.split('/')[0] || 'أخرى';
                  if (category === 'ماكرو' || key.startsWith('macro:')) category = 'كتل';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push({ key, def });
                  return acc;
                }, {} as Record<string, { key: string, def: any }[]>);

                return Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="mb-2 last:mb-0">
                    <div className="bg-slate-800/80 px-4 py-1.5 border-b border-y border-slate-700/50 flex items-center justify-end sticky top-0 z-10 backdrop-blur-sm">
                      <span className="text-xs font-black text-slate-400 tracking-wider">{category}</span>
                    </div>
                    <div>
                      {items.map(({ key, def }) => {
                        const IconComponent = (def.iconName ? (LucideIcons as any)[def.iconName] : (LucideIcons as any).Code) || (LucideIcons as any).Code;
                        return (
                          <button
                            key={key}
                            onClick={() => addNode(key)}
                            className="w-full text-right px-4 py-3 hover:bg-slate-700/80 text-slate-200 border-b border-slate-700/30 last:border-0 active:bg-slate-600 flex items-center justify-end gap-3 transition-colors group"
                          >
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{def.label}</span>
                              {def.subtitle && <span className="text-[10px] text-slate-400">{def.subtitle}</span>}
                            </div>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-white/5" style={{ backgroundColor: def.color || '#475569' }}>
                              <IconComponent size={16} className="text-white drop-shadow-md" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Edit Node Menu */}
      {editMenuPos && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
          {/* Backdrop for mobile */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm md:hidden pointer-events-auto" onClick={() => setEditMenuPos(null)} />
          
          <div
            className="pointer-events-auto bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-t-2xl md:rounded-xl shadow-2xl w-full md:w-48 overflow-hidden text-right"
            style={{
              position: window.innerWidth < 768 ? 'relative' : 'absolute',
              top: window.innerWidth < 768 ? 'auto' : editMenuPos.y,
              left: window.innerWidth < 768 ? 'auto' : editMenuPos.x,
            }}
          >
            <div className="bg-slate-700/50 px-4 py-3 md:py-2 flex justify-between border-b border-slate-600">
              <span className="text-sm md:text-xs text-yellow-400 font-bold">⚙️ تعديل العقدة</span>
              <button onClick={() => setEditMenuPos(null)} className="text-white text-sm md:text-xs px-2">✕</button>
            </div>
            <button
              onClick={() => {
                useEditorStore.getState().commitHistory();
                setNodes(nds => nds.filter(n => n.id !== editMenuPos.nodeId));
                setEditMenuPos(null);
              }}
              className="w-full text-right px-5 md:px-4 py-4 md:py-3 hover:bg-red-600 text-red-200 text-sm active:bg-red-500"
            >
              حذف العقدة 🗑️
            </button>
            <div className="h-6 md:hidden"></div>
          </div>
        </div>
      )}

      {/* Code Preview Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
          <div className="bg-[#1e1e24] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh] border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#18181b]">
              <div className="flex items-center gap-3">
                <Code className="text-blue-400" size={20} />
                <h3 className="text-lg font-bold text-white">الشيفرة المصدرية المولدة</h3>
              </div>
              <button 
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-[#18181b]/50">
              {generatedCode.trim() ? (
                <pre className="text-sm font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap" dir="ltr" style={{ textAlign: 'left' }}>
                  {generatedCode}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 font-medium text-center">
                  المحرر فارغ. أضف بعض العقد لرؤية الشيفرة المولدة.
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-white/5 bg-[#18181b] flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                نسخ
              </button>
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
