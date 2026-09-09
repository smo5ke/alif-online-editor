"use client";

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { highlightAlifCode, formatAlifCode } from '../../lib/alifHighlighter';
import { 
  FileCode, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  AlertCircle 
} from 'lucide-react';

export default function TextEditor() {
  const { 
    activeMode, 
    textCode, 
    setTextCode, 
    errorLineNumber, 
    setErrorLineNumber 
  } = useEditorStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState<number>(15);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Compute highlighted code
  const highlightedHtml = useMemo(() => {
    return highlightAlifCode(textCode) + (textCode.endsWith('\n') ? '\n ' : '');
  }, [textCode]);

  const lines = useMemo(() => {
    return textCode.split('\n');
  }, [textCode]);

  // Sync scrolling between textarea, pre, and gutter
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;

    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  // Track cursor line and column
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const beforeText = textCode.substring(0, pos);
    const lineList = beforeText.split('\n');
    const line = lineList.length;
    const col = lineList[lineList.length - 1].length + 1;
    setCursorPos({ line, col });
  };

  // Keyboard Shortcuts & Intelligence
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 1. Tab Key (Indent / Unindent)
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift + Tab: Remove leading tab if present on current line
        const before = textCode.substring(0, start);
        const lastNewline = before.lastIndexOf('\n');
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
        if (textCode[lineStart] === '\t') {
          const newCode = textCode.substring(0, lineStart) + textCode.substring(lineStart + 1);
          setTextCode(newCode);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 1);
          }, 0);
        }
      } else {
        // Insert Tab '\t'
        const newCode = textCode.substring(0, start) + '\t' + textCode.substring(end);
        setTextCode(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
      return;
    }

    // 2. Enter Key: Smart Auto-Indentation
    if (e.key === 'Enter') {
      const before = textCode.substring(0, start);
      const lastNewline = before.lastIndexOf('\n');
      const currentLine = before.substring(lastNewline === -1 ? 0 : lastNewline + 1);

      // Count leading tabs/spaces on current line
      const leadingTabs = (currentLine.match(/^\t+/) || [''])[0];
      let nextIndent = leadingTabs;

      // If current line ends with ':' (block opener), add an extra tab
      if (currentLine.trim().endsWith(':')) {
        nextIndent += '\t';
      }

      if (nextIndent.length > 0) {
        e.preventDefault();
        const insertText = '\n' + nextIndent;
        const newCode = textCode.substring(0, start) + insertText + textCode.substring(end);
        setTextCode(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
        }, 0);
        return;
      }
    }

    // 3. Auto-Closing Pairs: (), [], {}, "", ''
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
    };

    if (pairs[e.key]) {
      e.preventDefault();
      const open = e.key;
      const close = pairs[e.key];
      const selectedText = textCode.substring(start, end);
      const newCode = textCode.substring(0, start) + open + selectedText + close + textCode.substring(end);
      setTextCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = end + 1;
      }, 0);
      return;
    }

    // 4. Backspace: delete both if between a pair
    if (e.key === 'Backspace' && start === end && start > 0) {
      const prevChar = textCode[start - 1];
      const nextChar = textCode[start];
      const reversePairs: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"',
        "'": "'",
      };
      if (reversePairs[prevChar] === nextChar) {
        e.preventDefault();
        const newCode = textCode.substring(0, start - 1) + textCode.substring(start + 1);
        setTextCode(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 1;
        }, 0);
        return;
      }
    }
  };

  const handleFormat = () => {
    const formatted = formatAlifCode(textCode);
    setTextCode(formatted);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClear = () => {
    if (confirm('هل أنت متأكد من مسح كامل الشيفرة؟')) {
      setTextCode('');
      setErrorLineNumber(null);
    }
  };

  const wordCount = useMemo(() => {
    return textCode.trim() ? textCode.trim().split(/\s+/).length : 0;
  }, [textCode]);

  return (
    <div
      className={`absolute inset-0 flex flex-col bg-[#0b1120] transition-opacity duration-200 ${
        activeMode === 'code' ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
      }`}
      dir="rtl"
    >
      {/* IDE Sub-Header / Tabs Bar */}
      <div className="h-10 bg-slate-900/90 border-b border-slate-700/60 px-4 flex items-center justify-between shrink-0 select-none">
        {/* Active File Tab */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0b1120] border-t-2 border-emerald-400 border-x border-slate-700/60 px-3 py-1.5 rounded-t-lg text-xs font-bold text-slate-100 shadow-sm">
            <FileCode size={14} className="text-emerald-400" />
            <span>الرئيسية.ألف</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" title="نشط" />
          </div>
        </div>

        {/* Quick IDE Tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Format Code */}
          <button
            onClick={handleFormat}
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="تنسيق الكود وضبط المسافات تلقائياً"
          >
            <Sparkles size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">تنسيق الكود</span>
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer"
            title="نسخ الكود بالكامل"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>

          {/* Clear Code */}
          <button
            onClick={handleClear}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 border border-slate-700 text-xs transition-colors cursor-pointer"
            title="مسح الكود"
          >
            <Trash2 size={14} />
          </button>

          <div className="w-px h-4 bg-slate-700 mx-1 self-center" />

          {/* Font Size Adjusters */}
          <button
            onClick={() => setFontSize((s) => Math.max(12, s - 1))}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors cursor-pointer"
            title="تصغير الخط"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[11px] text-slate-400 font-mono w-5 text-center">{fontSize}</span>
          <button
            onClick={() => setFontSize((s) => Math.min(22, s + 1))}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors cursor-pointer"
            title="تكبير الخط"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Editor Body: Gutter + Synchronized Editor View */}
      <div className="relative flex-1 flex min-h-0 min-w-0 bg-[#0b1120] overflow-hidden">
        {/* Line Numbers Gutter */}
        <div
          ref={gutterRef}
          className="code-font w-12 sm:w-14 shrink-0 bg-slate-900/70 border-l border-slate-800/80 text-slate-500 py-4 select-none overflow-hidden flex flex-col items-stretch"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.75',
          }}
        >
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const isError = errorLineNumber === lineNum;
            const isCurrent = cursorPos.line === lineNum;

            return (
              <div
                key={i}
                className={`h-[1.75em] flex items-center justify-between px-2 transition-colors ${
                  isError
                    ? 'bg-red-950/70 text-red-400 font-bold border-r-2 border-red-500'
                    : isCurrent
                    ? 'text-sky-300 font-semibold bg-slate-800/40'
                    : 'text-slate-600'
                }`}
              >
                <span className="text-left font-mono text-[0.85em]">{lineNum}</span>
                {isError && (
                  <span title={`خطأ برمجي في السطر ${lineNum}`} className="flex items-center">
                    <AlertCircle size={12} className="text-red-400 animate-pulse shrink-0" />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Editor Writing Area */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden bg-[#0b1120]">
          {/* Syntax Highlighted Layer */}
          <pre
            ref={preRef}
            className="code-font absolute inset-0 p-4 m-0 overflow-hidden whitespace-pre text-slate-200 pointer-events-none z-0 text-right no-scrollbar select-none"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.75',
              tabSize: 4,
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />

          {/* Interactive Textarea Layer */}
          <textarea
            ref={textareaRef}
            value={textCode}
            onChange={(e) => {
              setTextCode(e.target.value);
              if (errorLineNumber) setErrorLineNumber(null);
            }}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            onClick={updateCursorPosition}
            onKeyUp={updateCursorPosition}
            onSelect={updateCursorPosition}
            className="code-font absolute inset-0 w-full h-full p-4 m-0 bg-transparent text-transparent caret-sky-400 outline-none resize-none overflow-auto whitespace-pre z-10 text-right custom-menu-scroll"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.75',
              tabSize: 4,
            }}
            spellCheck="false"
            wrap="off"
            placeholder="اكتب شيفرة ألف 5.3 هنا..."
          />
        </div>
      </div>

      {/* IDE Status Bar (Footer) */}
      <div className="h-7 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between text-[11px] text-slate-400 select-none shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-mono">
            سطر {cursorPos.line}، عمود {cursorPos.col}
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline">
            الأسطر: {lines.length} | الكلمات: {wordCount}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {errorLineNumber && (
            <span className="text-red-400 font-bold flex items-center gap-1 animate-pulse">
              <AlertCircle size={12} />
              خطأ في السطر {errorLineNumber}
            </span>
          )}
          <span className="text-slate-600">•</span>
          <span>UTF-8</span>
          <span className="text-slate-600">•</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
            ألف 5.3
          </span>
        </div>
      </div>
    </div>
  );
}
