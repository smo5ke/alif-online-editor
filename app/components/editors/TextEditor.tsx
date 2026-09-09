"use client";

import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useEditorStore } from '../../store/useEditorStore';
import { setupAlifLanguage } from '../../lib/alifMonacoLanguage';

export default function TextEditor() {
  const { activeMode, textCode, setTextCode } = useEditorStore();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setupAlifLanguage(monaco);
    monaco.editor.setTheme('alif-dark');
  };

  return (
    <div
      className={`absolute inset-0 bg-[#0f172a] transition-opacity duration-200 ${
        activeMode === 'code' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
      }`}
    >
      <Editor
        height="100%"
        language="alif"
        theme="vs-dark"
        value={textCode}
        onChange={(value) => setTextCode(value || '')}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full text-slate-400 text-sm gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            جاري تحميل محرر موناكو...
          </div>
        }
        options={{
          fontSize: 15,
          fontFamily: 'var(--font-noto-kufi), "Noto Kufi Arabic", monospace',
          tabSize: 4,
          insertSpaces: false,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          contextmenu: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
