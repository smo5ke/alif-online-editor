import { useEditorStore } from '../store/useEditorStore';
import { generateAlifCodeFromGraph } from './AlifGenerator';

/**
 * Assembles the runnable program from the store, merging the currently
 * viewed graph (main or macro) back into its storage first, so previews
 * and runs always reflect the latest on-screen edits.
 */
export function buildRunnableGraph() {
  const state = useEditorStore.getState();
  let finalMainNodes = state.nodes;
  let finalMainEdges = state.edges;
  const finalMacros = { ...state.macros };

  if (state.currentGraphId !== 'main') {
    finalMainNodes = state.mainGraph.nodes;
    finalMainEdges = state.mainGraph.edges;
    if (finalMacros[state.currentGraphId]) {
      finalMacros[state.currentGraphId] = {
        ...finalMacros[state.currentGraphId],
        nodes: state.nodes,
        edges: state.edges,
      };
    }
  }

  return { finalMainNodes, finalMainEdges, finalMacros };
}

export function generateRunnableCode(): string {
  const { finalMainNodes, finalMainEdges, finalMacros } = buildRunnableGraph();
  return generateAlifCodeFromGraph(finalMainNodes, finalMainEdges, finalMacros).replace(/\u00A0/g, ' ');
}
