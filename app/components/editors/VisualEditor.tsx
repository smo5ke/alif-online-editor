import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, Connection } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { useEditorStore } from '../../store/useEditorStore';
import DynamicNode, { NodeData } from '../DynamicNode';
import DeletableEdge from '../DeletableEdge';
import { nodeDefinitions } from '../AlifNodes';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  dynamic: DynamicNode,
};

const edgeTypes = {
  deletable: DeletableEdge,
};

export default function VisualEditor() {
  const { activeMode, nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange } = useEditorStore();
  
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [editMenuPos, setEditMenuPos] = useState<{ x: number; y: number; nodeId: string } | null>(null);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => [
      ...eds,
      {
        ...params,
        id: `e-${params.source}-${params.target}-${uuidv4()}`,
        type: 'deletable',
        data: {
          onDelete: (id: string) => setEdges((edges) => edges.filter((e) => e.id !== id))
        }
      }
    ]);
  }, [setEdges]);

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
    
    const newNode = {
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

  useEffect(() => {
    if (nodes.length === 0) {
      addNode('أوامر/بداية البرنامج');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`absolute inset-0 transition-opacity duration-200 ${activeMode === 'visual' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
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
        <Controls className="!bottom-20 md:!bottom-4" />
      </ReactFlow>

      <button
        onClick={(e) => { e.stopPropagation(); setMenuPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 }); }}
        className="absolute bottom-6 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl px-6 py-3.5 font-bold z-30"
      >
        إضافة عقدة
      </button>

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
              <button onClick={() => setMenuPos(null)} className="text-slate-300 hover:text-white text-sm md:text-xs px-2 py-1 bg-slate-600/50 hover:bg-slate-500 rounded transition-colors">✕</button>
            </div>
            <div className="overflow-y-auto custom-menu-scroll pb-6 md:pb-0 flex-1">
              {(() => {
                const grouped = Object.entries(nodeDefinitions).reduce((acc, [key, def]) => {
                  const category = key.split('/')[0] || 'أخرى';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push({ key, def });
                  return acc;
                }, {} as Record<string, { key: string, def: any }[]>);
                
                // Import LucideIcons to use them dynamically in the menu
                const LucideIcons = require('lucide-react');

                return Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="mb-2 last:mb-0">
                    <div className="bg-slate-800/80 px-4 py-1.5 border-b border-y border-slate-700/50 flex items-center justify-end sticky top-0 z-10 backdrop-blur-sm">
                      <span className="text-xs font-black text-slate-400 tracking-wider">{category}</span>
                    </div>
                    <div>
                      {items.map(({ key, def }) => {
                        const IconComponent = def.iconName ? LucideIcons[def.iconName] : LucideIcons.Code;
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
    </div>
  );
}
