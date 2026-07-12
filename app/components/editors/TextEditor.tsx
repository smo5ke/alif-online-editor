import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';

export default function TextEditor() {
  const { activeMode, textCode, setTextCode } = useEditorStore();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [highlightedCode, setHighlightedCode] = useState('');

  // Highlighting Logic
  useEffect(() => {
    let html = textCode.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const regex = /(#.*)|(م?"[^"]*")|(^|[^أ-يa-zA-Z0-9_])(اطبع|ادخل|اذا|اواذا|والا|بينما|لكل|في|دالة|ارجع|صح|خطأ|عدم|صنف|اصل|حاول|خلل|نهاية|توقف|استمر|احذف|استورد|من)(?=[^أ-يa-zA-Z0-9_]|$)|(^|[^أ-يa-zA-Z0-9_])(\d+(\.\d+)?)(?=[^أ-يa-zA-Z0-9_]|$)|([=+\-*/!^|]|&lt;|&gt;|&amp;)/g;
    html = html.replace(regex, (match, comment, str, beforeKw, kw, beforeNum, num, numDec, op) => {
        if (comment) return `<span class="text-slate-500">${comment}</span>`; if (str) return `<span class="text-amber-400">${str}</span>`;
        if (kw) return `${beforeKw}<span class="text-fuchsia-400">${kw}</span>`; if (num) return `${beforeNum}<span class="text-cyan-400">${num}</span>`;
        if (op) return `<span class="text-blue-400">${op}</span>`; return match;
    });
    setHighlightedCode(html + (textCode.endsWith('\n') ? '\n ' : ''));
  }, [textCode]);

  return (
    <div className={`absolute inset-0 flex bg-slate-900 transition-opacity duration-200 ${activeMode === 'code' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
      
      {/* Line Numbers */}
      <div 
        ref={lineNumbersRef}
        className="code-font w-10 sm:w-12 shrink-0 bg-slate-800/80 border-l border-slate-700/50 text-slate-500 text-center py-4 select-none overflow-hidden flex flex-col items-center"
      >
        {textCode.split('\n').map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Editor Area */}
      <div className="relative flex-1 overflow-hidden bg-[#0f172a]">
        <pre
          className="code-font absolute inset-0 p-4 overflow-auto whitespace-pre pointer-events-none text-slate-300 z-0 text-right no-scrollbar"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <textarea
          ref={editorRef}
          value={textCode}
          onChange={(e) => setTextCode(e.target.value)}
          onScroll={() => { 
            if(editorRef.current) { 
              const pre = editorRef.current.previousSibling as HTMLPreElement; 
              if(pre) { 
                pre.scrollTop = editorRef.current.scrollTop; 
                pre.scrollLeft = editorRef.current.scrollLeft;
              } 
              if(lineNumbersRef.current) {
                lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
              }
            } 
          }}
          className="code-font absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white outline-none resize-none overflow-auto whitespace-pre z-10 text-right no-scrollbar"
          spellCheck="false"
          wrap="off"
          placeholder="اكتب كود ألف 5.3 هنا..."
        />
      </div>
    </div>
  );
}
