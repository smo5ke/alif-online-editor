import type { Monaco } from '@monaco-editor/react';

export function setupAlifLanguage(monaco: Monaco) {
  // 1. Register Alif Language
  if (!monaco.languages.getLanguages().some((lang: any) => lang.id === 'alif')) {
    monaco.languages.register({ id: 'alif', extensions: ['.alif'] });
  }

  // 2. Syntax Highlighting (Monarch Tokens)
  monaco.languages.setMonarchTokensProvider('alif', {
    keywords: [
      'اطبع', 'ادخل', 'اذا', 'اواذا', 'والا', 'بينما', 'لكل', 'في',
      'دالة', 'ارجع', 'صح', 'خطأ', 'عدم', 'صنف', 'اصل', 'حاول',
      'خلل', 'نهاية', 'توقف', 'استمر', 'احذف', 'استورد', 'من', 'هذا'
    ],
    builtins: [
      'الرياضيات', 'الوقت', 'العشوائي', 'مدى', 'صحيح', 'عشري', 'نص',
      'قائمة', 'فهرس', 'طول', 'نوع', 'قيمة_مطلقة', 'جيب', 'تجيب', 'ظل', 'غفوة', 'الان'
    ],
    operators: [
      '=', '+=', '-=', '*=', '/=', '^=', '==', '!=', '<', '>', '<=', '>=',
      '+', '-', '*', '/', '%', '^'
    ],

    tokenizer: {
      root: [
        // Comments
        [/#.*$/, 'comment'],

        // Formatted strings (f-strings)
        [/م"[^"\\]*(?:\\.[^"\\]*)*"/, 'string.formatted'],

        // Normal strings
        [/"[^"\\]*(?:\\.[^"\\]*)*"/, 'string'],
        [/'[^'\\]*(?:\\.[^'\\]*)*'/, 'string'],

        // Numbers
        [/\b\d+(\.\d+)?\b/, 'number'],

        // Identifiers & Keywords (Unicode Arabic Support)
        [
          /[\u0600-\u06FFa-zA-Z_][\u0600-\u06FFa-zA-Z0-9_]*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@builtins': 'type.identifier',
              '@default': 'identifier',
            },
          },
        ],

        // Delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[=><!~?:&|+\-*\/\^%]+/, 'operator'],
      ],
    },
  });

  // 3. Language Configuration (Brackets, Comments, Indentation)
  monaco.languages.setLanguageConfiguration('alif', {
    comments: {
      lineComment: '#',
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      ['[', ']'],
      ['(', ')'],
      ['"', '"'],
      ["'", "'"],
    ],
  });

  // 4. Autocomplete / IntelliSense
  monaco.languages.registerCompletionItemProvider('alif', {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        // Snippets
        {
          label: 'دالة',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'دالة ${1:اسم_الدالة}(${2:المعامل}):\n\t${3:ارجع عدم}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'إنشاء دالة مخصصة مع معاملات وإرجاع قيمة',
          range,
        },
        {
          label: 'اذا',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'اذا ${1:شرط}:\n\t${2:تجاوز}\nوالا:\n\t${3:تجاوز}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'جملة شرطية لاتخاذ القرارات',
          range,
        },
        {
          label: 'لكل',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'لكل ${1:عنصر} في ${2:مدى(5)}:\n\t${3:اطبع(${1:عنصر})}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'حلقة تكرار لكل عنصر في نطاق أو مصفوفة',
          range,
        },
        {
          label: 'بينما',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'بينما ${1:شرط}:\n\t${2:تجاوز}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'حلقة تكرار بينما الشرط صحيح',
          range,
        },
        {
          label: 'صنف',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'صنف ${1:اسم_الصنف}:\n\tدالة __تهيئة__(هذا, ${2:معامل}):\n\t\tهذا.${2:معامل} = ${2:معامل}\n',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'إنشاء صنف جديد (Class) في البرمجة كائنية التوجه',
          range,
        },
        {
          label: 'حاول',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'حاول:\n\t${1:تجاوز}\nخلل:\n\t${2:اطبع("حدث خطأ")}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'معالجة الأخطاء الاستثنائية (Try / Catch)',
          range,
        },
        {
          label: 'اطبع',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'اطبع(${1:القيمة})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'طباعة نص أو قيمة على شاشة المخرجات',
          range,
        },
        {
          label: 'ادخل',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'ادخل("${1:أدخل قيمة: }")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'قراءة مدخلات من المستخدم في الطرفية',
          range,
        },
        {
          label: 'استورد',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'استورد ${1|الوقت,الرياضيات,العشوائي|}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'استيراد مكتبة خارجية مدمجة',
          range,
        },
      ];

      return { suggestions };
    },
  });

  // 5. Custom Sleek Dark Theme
  monaco.editor.defineTheme('alif-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'e879f9', fontStyle: 'bold' }, // Fuchsia-400
      { token: 'type.identifier', foreground: '38bdf8', fontStyle: 'bold' }, // Sky-400
      { token: 'string', foreground: 'facc15' }, // Amber-400
      { token: 'string.formatted', foreground: 'fb923c' }, // Orange-400
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' }, // Slate-500
      { token: 'number', foreground: '22d3ee' }, // Cyan-400
      { token: 'operator', foreground: '60a5fa' }, // Blue-400
      { token: 'identifier', foreground: 'f1f5f9' }, // Slate-100
    ],
    colors: {
      'editor.background': '#0f172a', // Slate-900
      'editor.foreground': '#f8fafc',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#38bdf8',
      'editorCursor.foreground': '#38bdf8',
      'editor.selectionBackground': '#33415580',
      'editor.inactiveSelectionBackground': '#1e293b80',
      'editorIndentGuide.background': '#1e293b',
      'editorIndentGuide.activeBackground': '#334155',
    },
  });
}
