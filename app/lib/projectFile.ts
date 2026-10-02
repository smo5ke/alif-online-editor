import type { Node, Edge } from '@xyflow/react';
import type { MacroData, ProjectState } from '../store/useEditorStore';

export const PROJECT_FILE_VERSION = 1;

/** Serializable snapshot of a project (no functions). */
export interface ProjectFileData {
  version: number;
  kind: 'alif-project';
  title: string;
  state: ProjectState;
}

function sanitizeNode(node: Node): Node {
  const { onControlChange, onAddDynamicInput, onAddDynamicOutput, ...restData } = (node.data ?? {}) as Record<string, unknown>;
  void onControlChange;
  void onAddDynamicInput;
  void onAddDynamicOutput;
  const { selected, dragging, ...restNode } = node as Record<string, unknown>;
  void selected;
  void dragging;
  return { ...(restNode as object), data: restData } as Node;
}

function sanitizeGraph(graph: { nodes: Node[]; edges: Edge[] }): { nodes: Node[]; edges: Edge[] } {
  return {
    nodes: (graph.nodes || []).map(sanitizeNode),
    edges: (graph.edges || []).map((e) => ({ ...e }) as Edge),
  };
}

function sanitizeMacros(macros: Record<string, MacroData>): Record<string, MacroData> {
  const out: Record<string, MacroData> = {};
  for (const [id, macro] of Object.entries(macros || {})) {
    const g = sanitizeGraph({ nodes: macro.nodes, edges: macro.edges });
    out[id] = { name: macro.name, nodes: g.nodes, edges: g.edges };
  }
  return out;
}

export function sanitizeProject(title: string, state: ProjectState): ProjectFileData {
  const main = sanitizeGraph(state.mainGraph);
  const live = sanitizeGraph({ nodes: state.nodes, edges: state.edges });
  return {
    version: PROJECT_FILE_VERSION,
    kind: 'alif-project',
    title,
    state: {
      textCode: state.textCode,
      nodes: live.nodes,
      edges: live.edges,
      mainGraph: main,
      macros: sanitizeMacros(state.macros),
      currentGraphId: state.currentGraphId,
    },
  };
}

function isNodeArray(v: unknown): v is Node[] {
  return Array.isArray(v);
}

function isEdgeArray(v: unknown): v is Edge[] {
  return Array.isArray(v);
}

/** Validates unknown JSON and returns a clean ProjectFileData, or null. */
export function parseProjectFile(raw: unknown): ProjectFileData | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  if (data.kind !== 'alif-project') return null;
  if (typeof data.version !== 'number' || data.version > PROJECT_FILE_VERSION) return null;
  if (typeof data.title !== 'string') return null;
  const s = data.state as Record<string, unknown> | undefined;
  if (!s || typeof s !== 'object') return null;
  if (typeof s.textCode !== 'string') return null;
  if (!isNodeArray(s.nodes) || !isEdgeArray(s.edges)) return null;
  const mg = s.mainGraph as Record<string, unknown> | undefined;
  if (!mg || !isNodeArray(mg.nodes) || !isEdgeArray(mg.edges)) return null;
  if (!s.macros || typeof s.macros !== 'object') return null;
  for (const macro of Object.values(s.macros as Record<string, unknown>)) {
    if (!macro || typeof macro !== 'object') return null;
    const m = macro as Record<string, unknown>;
    if (typeof m.name !== 'string') return null;
    if (!isNodeArray(m.nodes) || !isEdgeArray(m.edges)) return null;
  }
  if (typeof s.currentGraphId !== 'string') return null;
  return data as unknown as ProjectFileData;
}
