import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import { generateAlifCodeFromGraph } from '../AlifGenerator';

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

  it('normalizes legacy backslash division to forward slash', () => {
    const calc = node('calc', 'بيانات/حساب', {
      inputs: [
        { id: 'a_in', label: 'أ', type: 'data' },
        { id: 'b_in', label: 'ب', type: 'data' },
      ],
      outputs: [{ id: 'res_out', label: 'النتيجة', type: 'data' }],
      controls: [{ id: 'op', type: 'select', label: 'عملية', value: '\\', options: [] }],
    });
    const nodes = [startNode(), printNode(), calc, numNode('n1', 10), numNode('n2', 2)];
    const edges = [
      edge('e1', 'start', 'seq_out', 'print', 'seq_in'),
      edge('e2', 'calc', 'res_out', 'print', 'val_in'),
      edge('e3', 'n1', 'val_out', 'calc', 'a_in'),
      edge('e4', 'n2', 'val_out', 'calc', 'b_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    expect(code).toContain('(10 / 2)');
    expect(code).not.toContain('(10 \\ 2)');
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
    expect(code).toContain('ناتج_node_1_out1');
    expect(code).not.toContain('var_');
  });

  it('generates حاول blocks without a trailing نهاية: line', () => {
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
    ];
    const edges = [
      edge('e1', 'start', 'seq_out', 'try1', 'seq_in'),
      edge('e2', 'try1', 'try_out', 'pTry', 'seq_in'),
      edge('e3', 'tTry', 'val_out', 'pTry', 'val_in'),
      edge('e4', 'try1', 'catch_out', 'pCatch', 'seq_in'),
      edge('e5', 'tCatch', 'val_out', 'pCatch', 'val_in'),
    ];
    const code = generateAlifCodeFromGraph(nodes, edges);
    expect(code).toContain('حاول:');
    expect(code).toContain('خلل:');
    expect(code).not.toContain('نهاية:');
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

  it('asks for a start node when the graph is empty of entry points', () => {
    const code = generateAlifCodeFromGraph([printNode()], []);
    expect(code).toContain('بداية البرنامج');
  });
});
