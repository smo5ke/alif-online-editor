import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import { getLayoutedElements } from '../layoutUtils';

function makeNodes(ids: string[]): Node[] {
  return ids.map((id) => ({
    id,
    type: 'dynamic',
    position: { x: 0, y: 0 },
    data: { label: id },
  })) as unknown as Node[];
}

function makeEdge(id: string, source: string, target: string): Edge {
  return { id, source, target } as unknown as Edge;
}

describe('getLayoutedElements', () => {
  it('assigns finite positions to all nodes', () => {
    const { nodes } = getLayoutedElements(
      makeNodes(['a', 'b']),
      [makeEdge('e1', 'a', 'b')],
      'LR'
    );
    expect(nodes).toHaveLength(2);
    for (const n of nodes) {
      expect(Number.isFinite(n.position.x)).toBe(true);
      expect(Number.isFinite(n.position.y)).toBe(true);
    }
  });

  it('does not accumulate nodes between calls (no shared singleton state)', () => {
    const graphA = makeNodes(['a1', 'a2', 'a3']);
    const graphB = makeNodes(['b1']);
    const first = getLayoutedElements(graphB, [], 'LR');
    getLayoutedElements(graphA, [], 'LR');
    const second = getLayoutedElements(graphB, [], 'LR');
    expect(first.nodes).toHaveLength(1);
    expect(second.nodes).toHaveLength(1);
    expect(second.nodes[0].position).toEqual(first.nodes[0].position);
  });
});
