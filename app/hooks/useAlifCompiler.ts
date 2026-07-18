import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { useEditorStore } from '../store/useEditorStore';
import { generateAlifCodeFromGraph } from '../lib/AlifGenerator';

export type RunState = 'ready' | 'connecting' | 'running' | 'error';

interface CompilerStore {
  runState: RunState;
  setRunState: (state: RunState) => void;
}

const useCompilerStore = create<CompilerStore>((set) => ({
  runState: 'connecting',
  setRunState: (state) => set({ runState: state }),
}));

let globalWs: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let isConnecting = false;

export function useAlifCompiler() {
  const { runState, setRunState } = useCompilerStore();
  
  const { 
    activeMode, 
    textCode, 
    nodes, 
    edges, 
    appendTerminalOutput, 
    clearTerminal,
    setIsTerminalHidden
  } = useEditorStore();

  const connectWebSocket = useCallback(() => {
    if (globalWs && (globalWs.readyState === WebSocket.OPEN || globalWs.readyState === WebSocket.CONNECTING)) {
      return; // Already connected or connecting
    }
    
    if (isConnecting) return;
    isConnecting = true;

    try {
      const socket = new WebSocket('wss://alif-playground.onrender.com');
      globalWs = socket;
      
      socket.onopen = () => {
        isConnecting = false;
        useCompilerStore.getState().setRunState('ready');
        useEditorStore.getState().appendTerminalOutput('--- تم الاتصال بمحرك ألف 5.3 بنجاح ---\n', 'text-green-500 font-bold');
      };
      
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'output' || data.type === 'error') {
          const color = data.type === 'error' ? 'text-red-400' : 'text-slate-300';
          useEditorStore.getState().appendTerminalOutput(data.text, color);
        } else if (data.type === 'done') {
          useEditorStore.getState().appendTerminalOutput('\n--- انتهى تنفيذ البرنامج ---\n', 'text-slate-500');
          useCompilerStore.getState().setRunState('ready');
        }
      };
      
      socket.onclose = () => {
        isConnecting = false;
        useCompilerStore.getState().setRunState('error');
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      };
      
      socket.onerror = () => {
        if (socket.readyState !== WebSocket.CLOSED) {
          useEditorStore.getState().appendTerminalOutput('\nحدث خطأ في الاتصال بالسحابة.\n', 'text-red-400');
        }
      };
    } catch (error) {
      isConnecting = false;
      console.error('WS Error:', error);
    }
  }, []);

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  const startRun = () => {
    if (!globalWs || globalWs.readyState !== WebSocket.OPEN) return;
    if (useCompilerStore.getState().runState === 'running') {
      globalWs.close(); // Force reconnect
      useEditorStore.getState().appendTerminalOutput('\n⚠️ تم إيقاف التنفيذ يدوياً.\n', 'text-amber-400 font-bold');
      return;
    }

    clearTerminal();
    setRunState('running');
    
    // Ensure terminal is visible when running
    setIsTerminalHidden(false);

    let codeToRun = '';
    
    if (activeMode === 'visual') {
      const state = useEditorStore.getState();
      let finalMainNodes = state.nodes;
      let finalMainEdges = state.edges;
      let finalMacros = { ...state.macros };

      if (state.currentGraphId !== 'main') {
        finalMainNodes = state.mainGraph.nodes;
        finalMainEdges = state.mainGraph.edges;
        if (finalMacros[state.currentGraphId]) {
          finalMacros[state.currentGraphId] = {
            ...finalMacros[state.currentGraphId],
            nodes: state.nodes,
            edges: state.edges
          };
        }
      }

      const generated = generateAlifCodeFromGraph(finalMainNodes, finalMainEdges, finalMacros);
      codeToRun = generated.replace(/\u00A0/g, " ");
    } else {
      codeToRun = textCode.replace(/\u00A0/g, " ");
    }

    globalWs.send(JSON.stringify({ type: 'run', code: codeToRun }));
  };

  const sendInput = (text: string) => {
    if (!globalWs || globalWs.readyState !== WebSocket.OPEN) return;
    appendTerminalOutput(text + '\n', 'text-green-400');
    globalWs.send(JSON.stringify({ type: 'input', text }));
  };

  return { runState, startRun, sendInput };
}
