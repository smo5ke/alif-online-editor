import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { useEditorStore } from '../store/useEditorStore';
import { generateRunnableCode } from '../lib/runnableGraph';

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
let isManualStop = false;

function openAlifSocket() {
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
      useEditorStore.getState().appendTerminalOutput('--- تم الاتصال بمفسر ألف 5.3 بنجاح ---\n', 'text-green-500 font-bold');
    };

    socket.onmessage = (event) => {
      let data: { type?: string; text?: string };
      try {
        data = JSON.parse(event.data) as { type?: string; text?: string };
      } catch {
        console.error('تجاهل رسالة غير صالحة من المفسر');
        return;
      }
      if (typeof data.type !== 'string') return;
      if (data.type === 'output' || data.type === 'error') {
        const text = typeof data.text === 'string' ? data.text : '';
        const color = data.type === 'error' ? 'text-red-400' : 'text-slate-300';

        if (data.type === 'error') {
           const match = text.match(/السطر\s+(\d+)/);
           if (match) {
               const lineNum = parseInt(match[1]);
               const state = useEditorStore.getState();
               state.setErrorLineNumber(lineNum);
               const codeLines = state.lastRunCode.split('\n');
               if (lineNum > 0 && lineNum <= codeLines.length) {
                   const lineText = codeLines[lineNum - 1];
                   const nodeMatch = lineText.match(/# @node:([a-zA-Z0-9-]+)/);
                   if (nodeMatch) {
                       state.setErrorNode(nodeMatch[1]);
                   }
               }
           }
        }

        useEditorStore.getState().appendTerminalOutput(text, color);
      } else if (data.type === 'done') {
        useEditorStore.getState().appendTerminalOutput('\n--- انتهى تنفيذ البرنامج ---\n', 'text-slate-500');
        useCompilerStore.getState().setRunState('ready');
      }
      // أنواع الرسائل الأخرى (مثل إشعارات الحالة) تُتجاهل عمداً
    };

    socket.onclose = () => {
      isConnecting = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (isManualStop) {
        isManualStop = false;
        useCompilerStore.getState().setRunState('connecting');
      } else {
        useCompilerStore.getState().setRunState('error');
      }
      reconnectTimeout = setTimeout(openAlifSocket, 3000);
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
}

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
    openAlifSocket();
  }, []);

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  const startRun = () => {
    if (!globalWs || globalWs.readyState !== WebSocket.OPEN) {
      useEditorStore.getState().appendTerminalOutput('\nجاري إعادة الاتصال بالمفسر... حاول التشغيل مجدداً بعد لحظات.\n', 'text-amber-400');
      setIsTerminalHidden(false);
      openAlifSocket();
      return;
    }
    if (useCompilerStore.getState().runState === 'running') {
      isManualStop = true;
      setRunState('connecting');
      globalWs.close(); // Kill server execution, then auto-reconnect
      useEditorStore.getState().appendTerminalOutput('\n⚠️ تم إيقاف التنفيذ يدوياً.\n', 'text-amber-400 font-bold');
      return;
    }

    clearTerminal();
    setRunState('running');
    
    // Ensure terminal is visible when running
    setIsTerminalHidden(false);

    let codeToRun = '';

    if (activeMode === 'visual') {
      codeToRun = generateRunnableCode();
    } else {
      codeToRun = textCode.replace(/\u00A0/g, " ");
    }

    useEditorStore.getState().setLastRunCode(codeToRun);

    if (!codeToRun || codeToRun.trim() === '') {
      useEditorStore.getState().appendTerminalOutput('❌ لم يتم العثور على أي كود لتشغيله!\n(إذا كنت في المحرر المرئي، تأكد من وجود عقدة "بداية البرنامج")', 'text-amber-400');
      setRunState('ready');
      return;
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
