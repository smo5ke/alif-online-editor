import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import { buildMacroCallPorts } from '../../components/AlifNodes';
import { generateAlifCodeFromGraph } from '../AlifGenerator';
import { useEditorStore } from '../../store/useEditorStore';

function edge(id: string, source: string, sourceHandle: string, target: string, targetHandle: string): Edge {
  return { id, source, sourceHandle, target, targetHandle } as unknown as Edge;
}

const SEQ_IN = { id: 'seq_in', label: 'تسلسل', type: 'event' };
const SEQ_OUT = { id: 'seq_out', label: 'التالي', type: 'event' };

function startNode(): Node {
  return {
    id: 'start', type: 'dynamic', position: { x: 0, y: 0 },
    data: { label: 'start', originalType: 'أوامر/بداية البرنامج', outputs: [{ ...SEQ_OUT }] },
  } as unknown as Node;
}

function printNode(id: string): Node {
  return {
    id, type: 'dynamic', position: { x: 0, y: 0 },
    data: {
      label: id, originalType: 'أوامر/اطبع',
      inputs: [{ ...SEQ_IN }, { id: 'val_in', label: 'القيمة', type: 'data' }],
      outputs: [{ ...SEQ_OUT }],
      controls: [
        { id: 'sep', type: 'text', label: 'الفاصل', value: ' ' },
        { id: 'end', type: 'text', label: 'النهاية', value: '\\n' },
        { id: 'flush', type: 'select', label: 'مباشر', value: 'خطأ' },
      ],
    },
  } as unknown as Node;
}

function macroCallNode(id: string, macroId: string): Node {
  const { inputs, outputs } = buildMacroCallPorts(
    [{ id: 'num_in', label: 'عدد', type: 'data' }],
    [{ id: 'res_in', label: 'ناتج', type: 'data' }]
  );
  return {
    id, type: 'dynamic', position: { x: 0, y: 0 },
    data: {
      label: 'مضاعفة', originalType: `macro:${macroId}`,
      isMacro: true, macroId, inputs, outputs,
    },
  } as unknown as Node;
}

describe('buildMacroCallPorts', () => {
  it('always includes seq flow ports and drops definition event ports', () => {
    const { inputs, outputs } = buildMacroCallPorts(
      [
        { id: 'seq_out', label: 'بدء', type: 'event' },
        { id: 'num_in', label: 'عدد', type: 'data' },
      ],
      [
        { id: 'seq_in', label: 'إنهاء', type: 'event' },
        { id: 'res_in', label: 'ناتج', type: 'data' },
      ]
    );
    expect(inputs[0]).toMatchObject({ id: 'seq_in', type: 'event' });
    expect(outputs[0]).toMatchObject({ id: 'seq_out', type: 'event' });
    expect(inputs.some((p) => p.id === 'seq_out')).toBe(false);
    expect(outputs.some((p) => p.id === 'seq_in')).toBe(false);
    expect(inputs.map((p) => p.id)).toContain('num_in');
    expect(outputs.map((p) => p.id)).toContain('res_in');
  });
});

describe('syncMacroInstances', () => {
  it('preserves seq edges of call nodes when macro ports change', () => {
    const call = macroCallNode('call1', 'm1');
    useEditorStore.setState({
      nodes: [startNode(), call, printNode('p1')],
      edges: [
        edge('e1', 'start', 'seq_out', 'call1', 'seq_in'),
        edge('e2', 'call1', 'seq_out', 'p1', 'seq_in'),
      ],
      mainGraph: { nodes: [], edges: [] },
      macros: {
        m1: {
          name: 'مضاعفة',
          nodes: [
            {
              id: 'min1', type: 'dynamic', position: { x: 0, y: 0 },
              data: {
                label: 'مدخلات', originalType: 'ماكرو/مدخلات',
                outputs: [
                  { id: 'seq_out', label: 'بدء', type: 'event' },
                  { id: 'num_in', label: 'عدد', type: 'data' },
                  { id: 'extra_in', label: 'زائد', type: 'data' },
                ],
              },
            } as unknown as Node,
            {
              id: 'mout1', type: 'dynamic', position: { x: 0, y: 0 },
              data: {
                label: 'مخرجات', originalType: 'ماكرو/مخرجات',
                inputs: [
                  { id: 'seq_in', label: 'إنهاء', type: 'event' },
                  { id: 'res_in', label: 'ناتج', type: 'data' },
                ],
              },
            } as unknown as Node,
          ],
          edges: [],
        },
      },
      currentGraphId: 'main',
      past: [],
      future: [],
    });

    useEditorStore.getState().syncMacroInstances('m1');

    const state = useEditorStore.getState();
    // Both seq edges survive the sync
    expect(state.edges).toHaveLength(2);
    expect(state.edges.map((e) => e.id).sort()).toEqual(['e1', 'e2']);
    // Call node gained the new data port while keeping flow ports
    const syncedCall = state.nodes.find((n) => n.id === 'call1');
    const inputIds = ((syncedCall?.data as any)?.inputs || []).map((p: any) => p.id);
    const outputIds = ((syncedCall?.data as any)?.outputs || []).map((p: any) => p.id);
    expect(inputIds).toContain('seq_in');
    expect(inputIds).toContain('extra_in');
    expect(outputIds).toContain('seq_out');
    expect(outputIds).toContain('res_in');
  });
});

describe('macro code generation with flow', () => {
  it('continues execution after a macro call', () => {
    const code = generateAlifCodeFromGraph(
      [startNode(), macroCallNode('call1', 'm1'), printNode('p1')],
      [
        edge('e1', 'start', 'seq_out', 'call1', 'seq_in'),
        edge('e2', 'call1', 'seq_out', 'p1', 'seq_in'),
      ],
      {
        m1: {
          name: 'مضاعفة',
          nodes: [
            {
              id: 'min1', type: 'dynamic', position: { x: 0, y: 0 },
              data: {
                label: 'مدخلات', originalType: 'ماكرو/مدخلات',
                outputs: [
                  { id: 'seq_out', label: 'بدء', type: 'event' },
                  { id: 'num_in', label: 'عدد', type: 'data' },
                ],
              },
            } as unknown as Node,
            {
              id: 'mout1', type: 'dynamic', position: { x: 0, y: 0 },
              data: {
                label: 'مخرجات', originalType: 'ماكرو/مخرجات',
                inputs: [
                  { id: 'seq_in', label: 'إنهاء', type: 'event' },
                  { id: 'res_in', label: 'ناتج', type: 'data' },
                ],
              },
            } as unknown as Node,
          ],
          edges: [
            edge('e1', 'min1', 'seq_out', 'mout1', 'seq_in'),
          ],
        },
      }
    );
    const lines = code.split('\n');
    const callIdx = lines.findIndex((l) => l.includes('# @node:call1'));
    const printIdx = lines.findIndex((l) => l.includes('# @node:p1'));
    expect(callIdx).toBeGreaterThanOrEqual(0);
    expect(printIdx).toBeGreaterThan(callIdx);
  });
});
