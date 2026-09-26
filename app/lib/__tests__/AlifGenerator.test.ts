import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import { generateAlifCodeFromGraph, macroTempVar } from '../AlifGenerator';
import { visualExamples } from '../../store/visualExamples';

describe('built-in visual examples', () => {
  for (const [id, example] of Object.entries(visualExamples)) {
    it(`example ${id} generates runnable-looking code`, () => {
      const code = generateAlifCodeFromGraph(example.nodes, example.edges, example.macros);
      // Must have an entry point and real output statements
      expect(code).not.toContain('يرجى إضافة');
      expect(code).toContain('اطبع(');
      // Dead patterns that previously shipped broken code
      expect(code).not.toContain('.قسم(');
      expect(code).not.toContain('.كبير()');
      expect(code).not.toContain('.صغير()');
      expect(code).not.toContain('.جرد()');
      expect(code).not.toContain('.فهرس(');
      expect(code).not.toContain('.اعكس()');
      expect(code).not.toContain('امسح()');
      expect(code).not.toContain('نص(');
      expect(code).not.toContain('وإلا:');
      expect(code).not.toMatch(/\(\d+ \/ \d+\)/);
      // Macro identifiers must be Arabic-safe (no Latin mixed in)
      expect(code).not.toMatch(/م_[A-Za-z]/);
      expect(code).not.toMatch(/ناتج_[A-Za-z]/);
    });
  }
});

type Port = { id: string; label: string; type: string };
type Control = { id: string; type: string; label: string; value: unknown; options?: string[] };

function node(
  id: string,
  originalType: string,
  opts: { controls?: Control[]; inputs?: Port[]; outputs?: Port[]; extra?: Record<string, unknown> } = {}
): Node {
  return {
    id,
    type: 'dynamic',
    position: { x: 0, y: 0 },
    data: {
      label: id,
      originalType,
      controls: opts.controls ?? [],
      inputs: opts.inputs ?? [],
      outputs: opts.outputs ?? [],
      ...(opts.extra ?? {}),
    },
  } as unknown as Node;
}

function edge(id: string, source: string, sourceHandle: string, target: string, targetHandle: string): Edge {
  return { id, source, sourceHandle, target, targetHandle } as unknown as Edge;
}

const SEQ_IN: Port = { id: 'seq_in', label: 'تسلسل', type: 'event' };
const SEQ_OUT: Port = { id: 'seq_out', label: 'التالي', type: 'event' };

function startNode(id = 'start'): Node {
  return node(id, 'أوامر/بداية البرنامج', { outputs: [SEQ_OUT] });
}

function printNode(id = 'print', inputs: Port[] = [{ ...SEQ_IN }, { id: 'val_in', label: 'القيمة', type: 'data' }]): Node {
  return node(id, 'أوامر/اطبع', {
    inputs,
    outputs: [{ ...SEQ_OUT }],
    controls: [
      { id: 'sep', type: 'text', label: 'الفاصل', value: ' ' },
      { id: 'end', type: 'text', label: 'النهاية', value: '\\n' },
      { id: 'flush', type: 'select', label: 'مباشر', value: 'خطأ' },
    ],
  });
}

function textNode(id: string, value: string): Node {
  return node(id, 'بيانات/نص', {
    outputs: [{ id: 'val_out', label: 'نص', type: 'text' }],
    controls: [{ id: 'value', type: 'text', label: 'النص', value }],
  });
}

function numNode(id: string, value: number): Node {
  return node(id, 'بيانات/رقم', {
    outputs: [{ id: 'val_out', label: 'رقم', type: 'number' }],
    controls: [{ id: 'value', type: 'number', label: 'الرقم', value }],
  });
}

describe('generateAlifCodeFromGraph', () => {
  it('generates print with default kwargs omitted', () => {
    const nodes = [startNode(), printNode(), textNode('t1', 'مرحبا')];
    const edges = [
      edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
      edge('e2', 't1', 'val_out', 'print', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    expect(code).toContain('اطبع("مرحبا")');
    expect(code).not.toContain('الفاصل');
    expect(code).not.toContain('النهاية');
  });

  it('escapes quotes inside text literals', () => {
    const nodes = [startNode(), printNode(), textNode('t1', 'قال "مرحبا"')];
    const edges = [
      edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
      edge('e2', 't1', 'val_out', 'print', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    expect(code).toContain('اطبع("قال \\"مرحبا\\"")');
  });

  it('uses Alif backslash operators and normalizes legacy / and %', () => {
    const calcWith = (op: string) =>
      node('calc', 'بيانات/حساب', {
        inputs: [
          { id: 'a_in', label: 'أ', type: 'data' },
          { id: 'b_in', label: 'ب', type: 'data' },
        ],
        outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
        controls: [{ id: 'op', type: 'select', label: 'عملية', value: op, options: [] }],
      });
    const runCalc = (op: string) => {
      const nodes = [startNode(), printNode(), calcWith(op), numNode('n1', 10), numNode('n2', 2)];
      const edges = [
        edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
        edge('e2', 'calc', 'res_out', 'print', 'val_in'),
        edge('e3', 'n1', 'val_out', 'calc', 'a_in'),
        edge('e4', 'n2', 'val_out', 'calc', 'b_in'),
      ];
      return generateAlifCodeFromGraph(nodes, edges);
    };
    // Canonical Alif operators (verified against the interpreter)
    expect(runCalc('\\')).toContain('(10 \\ 2)');
    expect(runCalc('\\\\')).toContain('(10 \\\\ 2)');
    expect(runCalc('\\*')).toContain('(10 \\* 2)');
    // Legacy values stored by earlier editor versions are normalized
    expect(runCalc('/')).toContain('(10 \\ 2)');
    expect(runCalc('%')).toContain('(10 \\\\ 2)');
    expect(runCalc('/')).not.toContain('(10 / 2)');
  });

  it('collects multiple call args and emits empty parens when unconnected', () => {
    const call = node('call1', 'دوال/استدعاء', {
      inputs: [
        { ...SEQ_IN },
        { id: 'arg_in', label: 'المعامل', type: 'data' },
        { id: 'item_1_x', label: 'معامل 2', type: 'data' },
      ],
      outputs: [{ ...SEQ_OUT }, { id: 'res_out', label: 'النتيجة', type: 'data' }],
      controls: [{ id: 'func_name', type: 'text', label: 'الاسم', value: 'جمع' }],
    });
    const nodes = [startNode(), printNode(), call, numNode('n1', 1), numNode('n2', 2)];
    const edges = [
      edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
      edge('e2', 'call1', 'res_out', 'print', 'val_in'),
      edge('e3', 'n1', 'val_out', 'call1', 'arg_in'),
      edge('e4', 'n2', 'val_out', 'call1', 'item_1_x'),
    ];
    expect(generateAlifCodeFromGraph(nodes, edges)).toContain('جمع(1, 2)');

    const lonely = node('call2', 'دوال/استدعاء', {
      inputs: [{ ...SEQ_IN }, { id: 'arg_in', label: 'المعامل', type: 'data' }],
      outputs: [{ ...SEQ_OUT }, { id: 'res_out', label: 'النتيجة', type: 'data' }],
      controls: [{ id: 'func_name', type: 'text', label: 'الاسم', value: 'جمع' }],
    });
    const nodes2 = [startNode(), printNode(), lonely];
    const edges2 = [
      edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
      edge('e2', 'call2', 'res_out', 'print', 'val_in'),
    ];
    expect(generateAlifCodeFromGraph(nodes2, edges2)).toContain('جمع()');
  });

  it('continues execution after اذا via seq_out', () => {
    const ifNode = node('if1', 'شروط/اذا', {
      inputs: [
        { ...SEQ_IN },
        { id: 'cond_in', label: 'الشرط', type: 'data' },
      ],
      outputs: [
        { id: 'true_out', label: 'اذا صح', type: 'event' },
        { id: 'false_out', label: 'والا', type: 'event' },
        { id: 'seq_out', label: 'التالي', type: 'event' },
      ],
    });
    const nodes = [
      startNode(),
      ifNode,
      textNode('cond', 'صح'),
      printNode('pTrue'),
      textNode('tTrue', 'نعم'),
      printNode('pAfter'),
      textNode('tAfter', 'بعد'),
    ];
    const edges = [
      edge('e1', 'start', 'seq_out', 'if1', 'seq_in'),
      edge('e2', 'cond', 'val_out', 'if1', 'cond_in'),
      edge('e3', 'if1', 'true_out', 'pTrue', 'seq_in'),
      edge('e4', 'tTrue', 'val_out', 'pTrue', 'val_in'),
      edge('e5', 'if1', 'seq_out', 'pAfter', 'seq_in'),
      edge('e6', 'tAfter', 'val_out', 'pAfter', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    const lines = code.split('\n');
    const afterIdx = lines.findIndex((l) => l.includes('اطبع("بعد")'));
    const ifIdx = lines.findIndex((l) => l.startsWith('اذا'));
    expect(ifIdx).toBeGreaterThanOrEqual(0);
    expect(afterIdx).toBeGreaterThan(ifIdx);
    // Continuation is at base indent (not inside the branch)
    expect(lines[afterIdx].startsWith('\t')).toBe(false);
  });

  it('uses Arabic temp names for macro call outputs', () => {
    const call = node('node-1', 'macro:macro_1', {
      inputs: [],
      outputs: [{ id: 'out1', label: 'ناتج', type: 'data' }],
      extra: { isMacro: true, macroId: 'macro_1' },
    });
    const nodes = [startNode(), call];
    const edges = [edge('e1', 'start', 'seq_out', 'node-1', 'seq_out')];
    const code = generateAlifCodeFromGraph(nodes, edges, {
      macro_1: { name: 'كتلة', nodes: [], edges: [] },
    });
    expect(code).toContain(macroTempVar('node-1', 'out1'));
    expect(code).not.toContain('var_');
    expect(code).not.toMatch(/ناتج_[A-Za-z]/);
  });

  it('generates حاول blocks with نهاية: and no else unless wired', () => {
    const tryNode = node('try1', 'أخطاء/محاولة', {
      inputs: [{ ...SEQ_IN }],
      outputs: [
        { id: 'try_out', label: 'حاول', type: 'event' },
        { id: 'catch_out', label: 'في حال الخطأ', type: 'event' },
        { id: 'finally_out', label: 'في النهاية', type: 'event' },
        { id: 'seq_out', label: 'التالي', type: 'event' },
      ],
    });
    const nodes = [
      startNode(),
      tryNode,
      printNode('pTry'),
      textNode('tTry', 'محاولة'),
      printNode('pCatch'),
      textNode('tCatch', 'خطأ'),
      printNode('pFin'),
      textNode('tFin', 'دائما'),
    ];
    const edges = [
      edge('e1', 'start', 'seq_out', 'try1', 'seq_in'),
      edge('e2', 'try1', 'try_out', 'pTry', 'seq_in'),
      edge('e3', 'tTry', 'val_out', 'pTry', 'val_in'),
      edge('e4', 'try1', 'catch_out', 'pCatch', 'seq_in'),
      edge('e5', 'tCatch', 'val_out', 'pCatch', 'val_in'),
      edge('e6', 'try1', 'finally_out', 'pFin', 'seq_in'),
      edge('e7', 'tFin', 'val_out', 'pFin', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    expect(code).toContain('حاول:');
    expect(code).toContain('خلل:');
    expect(code).toContain('نهاية:');
    expect(code).not.toContain('والا:');
    expect(code).not.toContain('وإلا:');
  });

  it('emits استورد الوقت once when explicitly imported and time nodes are used', () => {
    const importNode = node('imp1', 'استيراد/مكتبة', {
      inputs: [{ ...SEQ_IN }],
      outputs: [{ ...SEQ_OUT }],
      controls: [{ id: 'lib', type: 'select', label: 'المكتبة', value: 'الوقت', options: [] }],
    });
    const timeNode = node('time1', 'وقت/الآن', {
      outputs: [{ id: 'res_out', label: 'الوقت', type: 'data' }],
    });
    const nodes = [startNode(), importNode, timeNode, printNode()];
    const edges = [
      edge('e1', 'start', 'seq_out', 'imp1', 'seq_in'),
      edge('e2', 'imp1', 'seq_out', 'print', 'seq_in'),
      edge('e3', 'time1', 'res_out', 'print', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    const occurrences = code.split('\n').filter((l) => l.trim().startsWith('استورد الوقت')).length;
    expect(occurrences).toBe(1);
  });

  it('emits methods nested inside صنف once and indented', () => {
    const cls = node('cls1', 'كائنات/صنف', {
      inputs: [{ ...SEQ_IN }],
      outputs: [
        { id: 'body_out', label: 'المحتوى', type: 'event' },
        { ...SEQ_OUT },
      ],
      controls: [
        { id: 'class_name', type: 'text', label: 'اسم الصنف', value: 'سيارة' },
        { id: 'inherits', type: 'text', label: 'يرث من', value: '' },
      ],
    });
    const def = node('def1', 'دوال/تعريف دالة', {
      inputs: [{ ...SEQ_IN }],
      outputs: [
        { id: 'body_out', label: 'جسم الدالة', type: 'event' },
        { ...SEQ_OUT },
      ],
      controls: [
        { id: 'func_name', type: 'text', label: 'الاسم', value: '__تهيئة__' },
        { id: 'arg', type: 'text', label: 'المعاملات', value: 'هذا, السرعة' },
      ],
    });
    const nodes = [startNode(), cls, def, printNode('p1'), textNode('t1', 'تم')];
    const edges = [
      edge('e1', 'start', 'seq_out', 'cls1', 'seq_in'),
      edge('e2', 'cls1', 'body_out', 'def1', 'seq_in'),
      edge('e3', 'def1', 'body_out', 'p1', 'seq_in'),
      edge('e4', 't1', 'val_out', 'p1', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    expect(code).toContain('صنف سيارة:');
    expect(code).toContain('\tدالة __تهيئة__(هذا, السرعة):');
    expect(code).toContain('\t\tاطبع("تم")');
    // Emitted inline only — not duplicated at top level
    expect(code.split('دالة __تهيئة__').length - 1).toBe(1);
  });

  it('targets named objects in property set/read, defaulting to هذا', () => {
    const setProp = node('sp1', 'كائنات/تعيين_خاصية', {
      inputs: [
        { ...SEQ_IN },
        { id: 'obj_in', label: 'الكائن', type: 'data' },
        { id: 'val_in', label: 'القيمة', type: 'data' },
      ],
      outputs: [{ ...SEQ_OUT }],
      controls: [{ id: 'prop_name', type: 'text', label: 'الخاصية', value: 'السرعة' }],
    });
    const getProp = node('gp1', 'كائنات/هذا', {
      inputs: [{ id: 'obj_in', label: 'الكائن', type: 'data' }],
      outputs: [{ id: 'res_out', label: 'الخاصية', type: 'data' }],
      controls: [{ id: 'prop_name', type: 'text', label: 'الاسم', value: 'السرعة' }],
    });
    const bareGet = node('gp2', 'كائنات/هذا', {
      inputs: [],
      outputs: [{ id: 'res_out', label: 'الخاصية', type: 'data' }],
      controls: [{ id: 'prop_name', type: 'text', label: 'الاسم', value: 'العمر' }],
    });
    const carVar = node('car', 'متغيرات/قراءة', {
      outputs: [{ id: 'val_out', label: 'القيمة', type: 'data' }],
      controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'سيارتي' }],
    });
    const nodes = [
      startNode(),
      setProp,
      printNode('p1'),
      getProp,
      printNode('p2'),
      bareGet,
      carVar,
      numNode('n200', 200),
    ];
    const edges = [
      edge('e1', 'start', 'seq_out', 'sp1', 'seq_in'),
      edge('e2', 'sp1', 'seq_out', 'p1', 'seq_in'),
      edge('e3', 'car', 'val_out', 'sp1', 'obj_in'),
      edge('e4', 'n200', 'val_out', 'sp1', 'val_in'),
      edge('e5', 'gp1', 'res_out', 'p1', 'val_in'),
      edge('e6', 'car', 'val_out', 'gp1', 'obj_in'),
      edge('e7', 'p1', 'seq_out', 'p2', 'seq_in'),
      edge('e8', 'gp2', 'res_out', 'p2', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    expect(code).toContain('سيارتي.السرعة = 200');
    expect(code).toContain('اطبع(سيارتي.السرعة)');
    expect(code).toContain('اطبع(هذا.العمر)');
  });

  it('generates افصل() for the split node', () => {
    const split = node('sp1', 'نصوص/تقسيم', {
      inputs: [
        { id: 'str_in', label: 'النص', type: 'data' },
        { id: 'sep_in', label: 'الفاصل', type: 'data' },
      ],
      outputs: [{ id: 'res_out', label: 'المصفوفة', type: 'data' }],
      controls: [{ id: 'sep', type: 'text', label: 'الفاصل الافتراضي', value: ' ' }],
    });
    const nodes = [startNode(), printNode(), split, textNode('t1', 'أ,ب')];
    const edges = [
      edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
      edge('e2', 'sp1', 'res_out', 'print', 'val_in'),
      edge('e3', 't1', 'val_out', 'sp1', 'str_in'),
    ];
    // No separator wired and default is space -> bare افصل()
    const bare = generateAlifCodeFromGraph(nodes, edges);
    expect(bare).toContain('.افصل()');
    expect(bare).not.toContain('.قسم(');

    // Wired separator -> افصل(sep)
    const comma = textNode('c1', ',');
    const nodes2 = [...nodes, comma];
    const edges2 = [...edges, edge('e4', 'c1', 'val_out', 'sp1', 'sep_in')];
    expect(generateAlifCodeFromGraph(nodes2, edges2)).toContain('.افصل(",")');
  });

  it('chains اواذا between اذا and والا', () => {
    const ifNode = node('if1', 'شروط/اذا', {
      inputs: [{ ...SEQ_IN }, { id: 'cond_in', label: 'الشرط', type: 'data' }],
      outputs: [
        { id: 'true_out', label: 'اذا صح', type: 'event' },
        { id: 'false_out', label: 'والا / اواذا', type: 'event' },
        { ...SEQ_OUT },
      ],
    });
    const elifNode = node('elif1', 'شروط/اواذا', {
      inputs: [{ ...SEQ_IN }, { id: 'cond_in', label: 'الشرط', type: 'data' }],
      outputs: [
        { id: 'true_out', label: 'اذا صح', type: 'event' },
        { id: 'false_out', label: 'والا / اواذا', type: 'event' },
      ],
    });
    const nodes = [
      startNode(),
      ifNode,
      elifNode,
      printNode('pT'),
      textNode('tT', 'كبير'),
      printNode('pE'),
      textNode('tE', 'يساوي'),
      printNode('pF'),
      textNode('tF', 'صغير'),
      numNode('n6a', 6),
      numNode('n9', 9),
      numNode('n6b', 6),
      numNode('n6c', 6),
    ];
    const cmp = (id: string) =>
      node(id, 'شروط/مقارنة', {
        inputs: [
          { id: 'a_in', label: 'أ', type: 'data' },
          { id: 'b_in', label: 'ب', type: 'data' },
        ],
        outputs: [{ id: 'res_out', label: 'نتيجة', type: 'data' }],
        controls: [{ id: 'op', type: 'select', label: 'مقارنة', value: '==', options: [] }],
      });
    const allNodes = [...nodes, cmp('c1'), cmp('c2')];
    const edges = [
      edge('e1', 'start', 'seq_out', 'if1', 'seq_in'),
      edge('e2', 'c1', 'res_out', 'if1', 'cond_in'),
      edge('e3', 'n6a', 'val_out', 'c1', 'a_in'),
      edge('e4', 'n9', 'val_out', 'c1', 'b_in'),
      edge('e5', 'if1', 'true_out', 'pT', 'seq_in'),
      edge('e6', 'tT', 'val_out', 'pT', 'val_in'),
      edge('e7', 'if1', 'false_out', 'elif1', 'seq_in'),
      edge('e8', 'c2', 'res_out', 'elif1', 'cond_in'),
      edge('e9', 'n6b', 'val_out', 'c2', 'a_in'),
      edge('e10', 'n6c', 'val_out', 'c2', 'b_in'),
      edge('e11', 'elif1', 'true_out', 'pE', 'seq_in'),
      edge('e12', 'tE', 'val_out', 'pE', 'val_in'),
      edge('e13', 'elif1', 'false_out', 'pF', 'seq_in'),
      edge('e14', 'tF', 'val_out', 'pF', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(allNodes, edges);
    const lines = code.split('\n');
    const ifIdx = lines.findIndex((l) => l.startsWith('اذا'));
    const elifIdx = lines.findIndex((l) => l.startsWith('اواذا'));
    const elseIdx = lines.findIndex((l) => l.startsWith('والا:'));
    expect(ifIdx).toBeGreaterThanOrEqual(0);
    expect(elifIdx).toBeGreaterThan(ifIdx);
    expect(elseIdx).toBeGreaterThan(elifIdx);
  });

  it('emits typed catch with والا and نهاية clauses in order', () => {
    const tryNode = node('try1', 'أخطاء/محاولة', {
      inputs: [{ ...SEQ_IN }],
      outputs: [
        { id: 'try_out', label: 'حاول', type: 'event' },
        { id: 'catch_out', label: 'في حال الخطأ', type: 'event' },
        { id: 'else_out', label: 'والا', type: 'event' },
        { id: 'finally_out', label: 'نهاية', type: 'event' },
        { ...SEQ_OUT },
      ],
      controls: [{ id: 'err_type', type: 'text', label: 'نوع الخطأ', value: 'خطأ_نوع' }],
    });
    const nodes = [
      startNode(),
      tryNode,
      printNode('pT'),
      textNode('tT', 'جرب'),
      printNode('pC'),
      textNode('tC', 'نوع'),
      printNode('pE'),
      textNode('tE', 'والا'),
      printNode('pF'),
      textNode('tF', 'نهاية'),
    ];
    const edges = [
      edge('e1', 'start', 'seq_out', 'try1', 'seq_in'),
      edge('e2', 'try1', 'try_out', 'pT', 'seq_in'),
      edge('e3', 'tT', 'val_out', 'pT', 'val_in'),
      edge('e4', 'try1', 'catch_out', 'pC', 'seq_in'),
      edge('e5', 'tC', 'val_out', 'pC', 'val_in'),
      edge('e6', 'try1', 'else_out', 'pE', 'seq_in'),
      edge('e7', 'tE', 'val_out', 'pE', 'val_in'),
      edge('e8', 'try1', 'finally_out', 'pF', 'seq_in'),
      edge('e9', 'tF', 'val_out', 'pF', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    const lines = code.split('\n');
    const tryIdx = lines.findIndex((l) => l.startsWith('حاول:'));
    const catchIdx = lines.findIndex((l) => l.startsWith('خلل خطأ_نوع:'));
    const elseIdx = lines.findIndex((l) => l.startsWith('والا:'));
    const finIdx = lines.findIndex((l) => l.startsWith('نهاية:'));
    expect(tryIdx).toBeGreaterThanOrEqual(0);
    expect(catchIdx).toBeGreaterThan(tryIdx);
    expect(elseIdx).toBeGreaterThan(catchIdx);
    expect(finIdx).toBeGreaterThan(elseIdx);
    expect(code).not.toContain('وإلا:');
  });

  it('generates رتب() and صحيح() conversions', () => {
    const sort = node('s1', 'مصفوفات/ترتيب', {
      inputs: [{ ...SEQ_IN }, { id: 'arr_in', label: 'المصفوفة', type: 'data' }],
      outputs: [{ ...SEQ_OUT }],
    });
    const sahih = node('h1', 'بيانات/تحويل لصحيح', {
      inputs: [{ id: 'val_in', label: 'القيمة', type: 'data' }],
      outputs: [{ id: 'res_out', label: 'العدد الصحيح', type: 'data' }],
    });
    const arrVar = node('arr', 'متغيرات/قراءة', {
      outputs: [{ id: 'val_out', label: 'القيمة', type: 'data' }],
      controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ارقام' }],
    });
    const nodes = [startNode(), sort, arrVar, printNode(), sahih, textNode('t5', '5')];
    const edges = [
      edge('e1', 'start', 'seq_out', 's1', 'seq_in'),
      edge('e2', 'arr', 'val_out', 's1', 'arr_in'),
      edge('e3', 's1', 'seq_out', 'print', 'seq_in'),
      edge('e4', 'h1', 'res_out', 'print', 'val_in'),
      edge('e5', 't5', 'val_out', 'h1', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    expect(code).toContain('ارقام.رتب()');
    expect(code).toContain('صحيح("5")');
  });

  it('generates مدى with 1, 2 or 3 args depending on wiring', () => {
    const dataIn = (pid: string, label: string): Port => ({ id: pid, label, type: 'data' });
    const loopWith = (id: string, inputs: Port[], values: Array<[string, number]>) => {
      const loop = node(id, 'حلقات/لكل', {
        inputs: [{ ...SEQ_IN }, ...inputs],
        outputs: [
          { id: 'body_out', label: 'جسم', type: 'event' },
          { id: 'done_out', label: 'انتهى', type: 'event' },
        ],
        controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'ب' }],
      });
      const nums = values.map(([nid, v]) => numNode(nid, v));
      const edges = [edge(`e-${id}`, 'start', 'seq_out', id, 'seq_in')];
      inputs.forEach((inp, i) => {
        edges.push(edge(`w-${id}-${i}`, values[i][0], 'val_out', id, inp.id));
      });
      return generateAlifCodeFromGraph([startNode(), loop, ...nums], edges);
    };
    // End only -> مدى(5)
    expect(loopWith('l1', [dataIn('end_in', 'إلى')], [['n5', 5]])).toContain('مدى(5)');
    // Start + end -> مدى(1, 5)
    expect(
      loopWith('l2', [dataIn('start_in', 'من'), dataIn('end_in', 'إلى')], [['n1', 1], ['n5', 5]])
    ).toContain('مدى(1, 5)');
    // Start + end + step -> مدى(1, 10, 2)
    expect(
      loopWith(
        'l3',
        [dataIn('start_in', 'من'), dataIn('end_in', 'إلى'), dataIn('step_in', 'الخطوة')],
        [['n1', 1], ['n10', 10], ['n2', 2]]
      )
    ).toContain('مدى(1, 10, 2)');
  });

  it('generates حذف as امسح (key/branch parity)', () => {
    const del = node('del1', 'مصفوفات/حذف', {
      inputs: [
        { ...SEQ_IN },
        { id: 'arr_in', label: 'المصفوفة', type: 'data' },
        { id: 'val_in', label: 'القيمة', type: 'data' },
      ],
      outputs: [{ ...SEQ_OUT }],
    });
    const arrVar = node('arr', 'متغيرات/قراءة', {
      outputs: [{ id: 'val_out', label: 'القيمة', type: 'data' }],
      controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }],
    });
    const code = generateAlifCodeFromGraph([startNode(), del, arrVar, numNode('n2', 2)], [
      edge('e1', 'start', 'seq_out', 'del1', 'seq_in'),
      edge('e2', 'arr', 'val_out', 'del1', 'arr_in'),
      edge('e3', 'n2', 'val_out', 'del1', 'val_in'),
    ]);
    expect(code).toContain('س.امسح(2)');
  });

  it('generates concat with + for arrays and strings', () => {
    const arrCat = node('c1', 'مصفوفات/دمج', {
      inputs: [
        { id: 'a_in', label: 'مصفوفة أ', type: 'data' },
        { id: 'b_in', label: 'مصفوفة ب', type: 'data' },
      ],
      outputs: [{ id: 'res_out', label: 'المصفوفة', type: 'data' }],
    });
    const strCat = node('c2', 'بيانات/دمج نصوص', {
      inputs: [
        { id: 'a_in', label: 'أ (نص)', type: 'data' },
        { id: 'b_in', label: 'ب (نص)', type: 'data' },
      ],
      outputs: [{ id: 'res_out', label: 'الناتج', type: 'data' }],
    });
    const code = generateAlifCodeFromGraph(
      [startNode(), printNode(), arrCat, strCat, textNode('t1', 'أ'), textNode('t2', 'ب')],
      [
        edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
        edge('e2', 'c1', 'res_out', 'print', 'val_in'),
        edge('e3', 't1', 'val_out', 'c2', 'a_in'),
        edge('e4', 't2', 'val_out', 'c2', 'b_in'),
      ]
    );
    expect(code).toContain('اطبع(');
  });

  it('generates obj.method(args) for استدعاء طريقة', () => {
    const mcall = node('mc1', 'كائنات/استدعاء طريقة', {
      inputs: [
        { ...SEQ_IN },
        { id: 'obj_in', label: 'الكائن', type: 'data' },
        { id: 'arg_in', label: 'المعامل', type: 'data' },
      ],
      outputs: [{ ...SEQ_OUT }, { id: 'res_out', label: 'النتيجة', type: 'data' }],
      controls: [{ id: 'method_name', type: 'text', label: 'اسم الدالة / الطريقة', value: 'جمع' }],
    });
    const objVar = node('obj', 'متغيرات/قراءة', {
      outputs: [{ id: 'val_out', label: 'القيمة', type: 'data' }],
      controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'م' }],
    });
    const code = generateAlifCodeFromGraph([startNode(), printNode(), mcall, objVar, numNode('n3', 3)], [
      edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
      edge('e2', 'mc1', 'res_out', 'print', 'val_in'),
      edge('e3', 'obj', 'val_out', 'mc1', 'obj_in'),
      edge('e4', 'n3', 'val_out', 'mc1', 'arg_in'),
    ]);
    expect(code).toContain('م.جمع(3)');
  });

  it('generates file open/write/read/close statements', () => {
    const open = node('fopen', 'ملفات/افتح', {
      inputs: [
        { ...SEQ_IN },
        { id: 'path_in', label: 'المسار', type: 'data' },
        { id: 'mode_in', label: 'الوضع', type: 'data' },
      ],
      outputs: [{ ...SEQ_OUT }, { id: 'file_out', label: 'الملف', type: 'data' }],
      controls: [
        { id: 'var_name', type: 'text', label: 'متغير الملف', value: 'س' },
        { id: 'path', type: 'text', label: 'المسار', value: 'ملف.الف' },
        { id: 'mode', type: 'select', label: 'الوضع', value: 'ك' },
      ],
    });
    const write = node('fw', 'ملفات/اكتب', {
      inputs: [
        { ...SEQ_IN },
        { id: 'file_in', label: 'الملف', type: 'data' },
        { id: 'text_in', label: 'النص', type: 'data' },
      ],
      outputs: [{ ...SEQ_OUT }],
    });
    const readF = node('fr', 'ملفات/اقرا', {
      inputs: [{ id: 'file_in', label: 'الملف', type: 'data' }],
      outputs: [{ id: 'res_out', label: 'المحتوى', type: 'data' }],
    });
    const close = node('fc', 'ملفات/اغلق', {
      inputs: [{ ...SEQ_IN }, { id: 'file_in', label: 'الملف', type: 'data' }],
      outputs: [{ ...SEQ_OUT }],
    });
    const readS = node('svar', 'متغيرات/قراءة', {
      outputs: [{ id: 'val_out', label: 'القيمة', type: 'data' }],
      controls: [{ id: 'var_name', type: 'text', label: 'المتغير', value: 'س' }],
    });
    const code = generateAlifCodeFromGraph(
      [startNode(), open, write, printNode('p1'), readF, close, readS, textNode('tt', 'hi')],
      [
        edge('e1', 'start', 'seq_out', 'fopen', 'seq_in'),
        edge('e2', 'fopen', 'seq_out', 'fw', 'seq_in'),
        edge('e3', 'svar', 'val_out', 'fw', 'file_in'),
        edge('e4', 'tt', 'val_out', 'fw', 'text_in'),
        edge('e5', 'fw', 'seq_out', 'p1', 'seq_in'),
        edge('e6', 'fr', 'res_out', 'p1', 'val_in'),
        edge('e7', 'svar', 'val_out', 'fr', 'file_in'),
        edge('e8', 'p1', 'seq_out', 'fc', 'seq_in'),
        edge('e9', 'svar', 'val_out', 'fc', 'file_in'),
      ]
    );
    expect(code).toContain('س = افتح("ملف.الف", "ك")');
    expect(code).toContain('س.اكتب("hi")');
    expect(code).toContain('س.اقرا()');
    expect(code).toContain('س.اغلق()');
  });

  it('generates sets, مقرون, خطية, conversions and multi-assign', () => {
    const setNew = node('sn', 'مميزة/جديدة', {
      inputs: [
        { id: 'item_0', label: 'عنصر 1', type: 'data' },
        { id: 'item_1', label: 'عنصر 2', type: 'data' },
      ],
      outputs: [{ id: 'set_out', label: 'مميزة', type: 'array' }],
    });
    const maqroon = node('mq', 'مصفوفات/مقرون', {
      inputs: [
        { id: 'a_in', label: 'قائمة أ', type: 'data' },
        { id: 'b_in', label: 'قائمة ب', type: 'data' },
      ],
      outputs: [{ id: 'res_out', label: 'المقرون', type: 'data' }],
    });
    const lam = node('lm', 'دوال/خطية', {
      inputs: [{ id: 'body_in', label: 'الجسم', type: 'data' }],
      outputs: [{ id: 'res_out', label: 'الدالة', type: 'data' }],
      controls: [{ id: 'params', type: 'text', label: 'المعاملات', value: 'س' }],
    });
    const multi = node('mu', 'متغيرات/إسناد متعدد', {
      inputs: [
        { ...SEQ_IN },
        { id: 'val_in', label: 'القيمة 1', type: 'data' },
        { id: 'item_0', label: 'قيمة 2', type: 'data' },
      ],
      outputs: [{ ...SEQ_OUT }],
      controls: [{ id: 'var_names', type: 'text', label: 'المتغيرات', value: 'س, ص' }],
    });
    const setAdd = node('sa', 'مميزة/إضافة', {
      inputs: [
        { ...SEQ_IN },
        { id: 'set_in', label: 'المميزة', type: 'data' },
        { id: 'val_in', label: 'القيمة', type: 'data' },
      ],
      outputs: [{ ...SEQ_OUT }],
    });
    const code = generateAlifCodeFromGraph(
      [
        startNode(), printNode(), setNew, numNode('n5', 5), numNode('n9', 9),
        maqroon, lam, multi, setAdd, textNode('t7', 'x'),
        printNode('p2'), printNode('p3'),
      ],
      [
        edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
        edge('e2', 'sn', 'set_out', 'print', 'val_in'),
        edge('e3', 'n5', 'val_out', 'sn', 'item_0'),
        edge('e4', 'n9', 'val_out', 'sn', 'item_1'),
        edge('e5', 'print', 'seq_out', 'p2', 'seq_in'),
        edge('e6', 'mq', 'res_out', 'p2', 'val_in'),
        edge('e7', 'p2', 'seq_out', 'p3', 'seq_in'),
        edge('e8', 'lm', 'res_out', 'p3', 'val_in'),
        edge('e9', 't7', 'val_out', 'lm', 'body_in'),
        edge('e10', 'p3', 'seq_out', 'mu', 'seq_in'),
        edge('e11', 'n5', 'val_out', 'mu', 'val_in'),
        edge('e12', 'n9', 'val_out', 'mu', 'item_0'),
        edge('e13', 'mu', 'seq_out', 'sa', 'seq_in'),
      ]
    );
    expect(code).toContain('{5, 9}');
    expect(code).toContain('مقرون(');
    expect(code).toContain('(خطية س: "x")');
    expect(code).toContain('س, ص = 5, 9');
  });

  it('asks for a start node when the graph is empty of entry points', () => {
    const code = generateAlifCodeFromGraph([printNode()], []);
    expect(code).toContain('بداية البرنامج');
  });
});
