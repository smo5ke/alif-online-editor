/**
 * Alif 5.3 Syntax Highlighter & Code Formatter Engine
 * Optimized for Arabic code with RTL support, formatted strings, and high-contrast dark theme.
 */

// Escape HTML entities to prevent XSS and rendering glitches
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function highlightAlifCode(code: string): string {
  if (!code) return '';

  const lines = code.split('\n');

  const highlightedLines = lines.map((line) => {
    // If line is entirely a comment
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      return `<span class="text-slate-500 italic">${escapeHtml(line)}</span>`;
    }

    // Tokenize line safely
    // Match strings (regular and formatted), comments, identifiers, numbers, and operators
    const tokenRegex = new RegExp(
      '(#.*$)|' +
      '(م"(?:[^"\\\\]|\\\\.)*"|م\'(?:[^\'\\\\]|\\\\.)*\')|' +
      '("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')|' +
      '([\\u0600-\\u06FFa-zA-Z_][\\u0600-\\u06FFa-zA-Z0-9_]*)|' +
      '(\\b\\d+(?:\\.\\d+)?\\b)|' +
      '(==|!=|<=|>=|\\+=|-=|\\*=|\\/=|%=|\\^=|[+\\-*/%=^<>!:]|[{}()\\[\\]])',
      'g'
    );

    let lastIndex = 0;
    let result = '';
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      // Add plain text before match
      if (match.index > lastIndex) {
        result += escapeHtml(line.substring(lastIndex, match.index));
      }

      const [
        full,
        comment,
        fString,
        normalString,
        identifier,
        number,
        operator
      ] = match;

      if (comment) {
        result += `<span class="text-slate-500 italic">${escapeHtml(comment)}</span>`;
      } else if (fString) {
        // Highlight formatted string with expressions inside { }
        const escaped = escapeHtml(fString);
        const withInterpolation = escaped.replace(
          /\{([^}]+)\}/g,
          '<span class="text-cyan-300 font-bold">{$1}</span>'
        );
        result += `<span class="text-orange-300">${withInterpolation}</span>`;
      } else if (normalString) {
        result += `<span class="text-amber-300">${escapeHtml(normalString)}</span>`;
      } else if (identifier) {
        // Classify identifier
        if (isKeyword(identifier)) {
          result += `<span class="text-fuchsia-400 font-bold">${escapeHtml(identifier)}</span>`;
        } else if (isBuiltin(identifier)) {
          result += `<span class="text-sky-400 font-semibold">${escapeHtml(identifier)}</span>`;
        } else if (isLibrary(identifier)) {
          result += `<span class="text-emerald-400 font-semibold">${escapeHtml(identifier)}</span>`;
        } else if (isBooleanOrNone(identifier)) {
          result += `<span class="text-purple-300 font-bold">${escapeHtml(identifier)}</span>`;
        } else {
          result += `<span class="text-slate-200">${escapeHtml(identifier)}</span>`;
        }
      } else if (number) {
        result += `<span class="text-teal-300">${escapeHtml(number)}</span>`;
      } else if (operator) {
        if (operator === ':') {
          result += `<span class="text-pink-400 font-bold">:</span>`;
        } else if ('{}[]()'.includes(operator)) {
          result += `<span class="text-yellow-400/90 font-bold">${escapeHtml(operator)}</span>`;
        } else {
          result += `<span class="text-blue-400">${escapeHtml(operator)}</span>`;
        }
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      result += escapeHtml(line.substring(lastIndex));
    }

    return result;
  });

  return highlightedLines.join('\n');
}

const KEYWORDS = new Set([
  'دالة', 'ارجع', 'اذا', 'اواذا', 'والا', 'بينما', 'لكل', 'في',
  'صنف', 'اصل', 'حاول', 'خلل', 'نهاية', 'توقف', 'استمر', 'احذف',
  'استورد', 'من', 'هذا'
]);

const BUILTINS = new Set([
  'اطبع', 'ادخل', 'مدى', 'صحيح', 'عشري', 'نص', 'قائمة', 'فهرس',
  'طول', 'نوع', 'قيمة_مطلقة', 'جيب', 'تجيب', 'ظل', 'غفوة', 'الان', 'منسق'
]);

const LIBRARIES = new Set([
  'الرياضيات', 'الوقت', 'العشوائي'
]);

const BOOLEAN_NONE = new Set([
  'صح', 'خطأ', 'عدم'
]);

function isKeyword(id: string): boolean {
  return KEYWORDS.has(id);
}

function isBuiltin(id: string): boolean {
  return BUILTINS.has(id);
}

function isLibrary(id: string): boolean {
  return LIBRARIES.has(id);
}

function isBooleanOrNone(id: string): boolean {
  return BOOLEAN_NONE.has(id);
}

/**
 * Smart Formatter for Alif 5.3 code:
 * - Fixes indentation based on colons (:)
 * - Cleans trailing whitespace
 * - Standardizes tab indents
 */
export function formatAlifCode(code: string): string {
  const lines = code.split('\n');
  let currentIndent = 0;
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      formattedLines.push('');
      continue;
    }

    // Check if line should unindent (like والا, اواذا, خلل)
    if (/^(والا|اواذا|خلل)\b/.test(trimmed)) {
      currentIndent = Math.max(0, currentIndent - 1);
    }

    // Build indented line
    const indentStr = '\t'.repeat(currentIndent);
    formattedLines.push(indentStr + trimmed);

    // If line opens a block (ends with :)
    if (trimmed.endsWith(':')) {
      currentIndent++;
    }
  }

  return formattedLines.join('\n');
}
