import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { generateAlifCodeFromGraph } from '../lib/AlifGenerator';

export type RunState = 'ready' | 'connecting' | 'running' | 'error';

export function useAlifCompiler() {
  const [runState, setRunState] = useState<RunState>('connecting');
  const ws = useRef<WebSocket | null>(null);
  
  const { 
    activeMode, 
    textCode, 
    nodes, 
    edges, 
    appendTerminalOutput, 
    clearTerminal,
    setMode
  } = useEditorStore();

  const connectWebSocket = useCallback(() => {
    try {
      const socket = new WebSocket('wss://alif-playground.onrender.com');
      ws.current = socket;
      
      socket.onopen = () => {
        setRunState('ready');
        appendTerminalOutput('--- تم الاتصال بمحرك ألف 5.3 بنجاح ---\n', 'text-green-500 font-bold');
      };
      
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'output' || data.type === 'error') {
          const color = data.type === 'error' ? 'text-red-400' : 'text-slate-300';
          appendTerminalOutput(data.text, color);
        } else if (data.type === 'done') {
          appendTerminalOutput('\n--- انتهى تنفيذ البرنامج ---\n', 'text-slate-500');
          setRunState('ready');
        }
      };
      
      socket.onclose = () => {
        setRunState('error');
        setTimeout(connectWebSocket, 3000);
      };
      
      socket.onerror = () => {
        if (socket.readyState !== WebSocket.CLOSED) {
          appendTerminalOutput('\nحدث خطأ في الاتصال بالسحابة.\n', 'text-red-400');
        }
      };
    } catch (error) {
      console.error('WS Error:', error);
    }
  }, [appendTerminalOutput]);

  useEffect(() => {
    connectWebSocket();
    return () => { ws.current?.close(); };
  }, [connectWebSocket]);

  const startRun = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    if (runState === 'running') {
      ws.current.close(); // Force reconnect
      appendTerminalOutput('\n⚠️ تم إيقاف التنفيذ يدوياً.\n', 'text-amber-400 font-bold');
      return;
    }

    clearTerminal();
    setRunState('running');
    
    // Auto switch to terminal on mobile
    if (window.innerWidth < 768) {
      setMode('terminal');
    }

    let codeToRun = '';
    
    // Execution logic based on current Mutually Exclusive Workspace
    if (activeMode === 'visual') {
      const generated = generateAlifCodeFromGraph(nodes, edges);
      codeToRun = generated.replace(/\u00A0/g, " ");
    } else {
      codeToRun = textCode.replace(/\u00A0/g, " ");
    }

    ws.current.send(JSON.stringify({ type: 'run', code: codeToRun }));
  };

  const sendInput = (text: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    appendTerminalOutput(text + '\n', 'text-green-400');
    ws.current.send(JSON.stringify({ type: 'input', text }));
  };

  return { runState, startRun, sendInput };
}
