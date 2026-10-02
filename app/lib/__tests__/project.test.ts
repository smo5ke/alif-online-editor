import { describe, it, expect } from 'vitest';
import type { Node } from '@xyflow/react';
import { sanitizeProject, parseProjectFile } from '../projectFile';
import { useEditorStore } from '../../store/useEditorStore';
import type { ProjectState } from '../../store/useEditorStore';

function blankState(): ProjectState {
  return {
    textCode: 'اطبع(1)',
    nodes: [
      {
        id: 'n1', type: 'dynamic', position: { x: 0, y: 0 },
        data: {
          label: 'x', originalType: 'بيانات/رقم',
          controls: [{ id: 'value', type: 'number', label: 'الرقم', value: 1 }],
          // function props must be stripped by sanitizeProject
          onControlChange: () => {},
        },
      } as unknown as Node,
    ],
    edges: [],
    mainGraph: { nodes: [], edges: [] },
    macros: {},
    currentGraphId: 'main',
  };
}

describe('projectFile', () => {
  it('round-trips a project and strips functions', () => {
    const file = sanitizeProject('صفحتي', blankState());
    expect(file.kind).toBe('alif-project');
    expect(file.title).toBe('صفحتي');
    const json = JSON.parse(JSON.stringify(file));
    const parsed = parseProjectFile(json);
    expect(parsed).not.toBeNull();
    expect(parsed?.state.textCode).toBe('اطبع(1)');
    expect((parsed?.state.nodes[0]?.data as any)?.onControlChange).toBeUndefined();
  });

  it('rejects garbage', () => {
    expect(parseProjectFile(null)).toBeNull();
    expect(parseProjectFile({})).toBeNull();
    expect(parseProjectFile({ kind: 'alif-project', version: 99, title: 'x', state: {} })).toBeNull();
    expect(parseProjectFile({ kind: 'other', version: 1, title: 'x', state: blankState() })).toBeNull();
  });
});

describe('custom pages', () => {
  it('creates, renames, switches and deletes pages', () => {
    const st = useEditorStore.getState();
    const id = st.createCustomPage('  تجربة  ');
    expect(useEditorStore.getState().customPages[id]?.title).toBe('تجربة');
    expect(useEditorStore.getState().currentProjectId).toBe(id);

    useEditorStore.getState().setTextCode('اطبع(2)');
    // switching away and back preserves the edited code via cache
    useEditorStore.getState().loadProject('hello', 'x', [], []);
    expect(useEditorStore.getState().currentProjectId).toBe('hello');
    useEditorStore.getState().loadProject(id, '', [], [], {});
    expect(useEditorStore.getState().textCode).toBe('اطبع(2)');

    useEditorStore.getState().renameCustomPage(id, 'جديدة');
    expect(useEditorStore.getState().customPages[id]?.title).toBe('جديدة');
    useEditorStore.getState().renameCustomPage(id, '   ');
    expect(useEditorStore.getState().customPages[id]?.title).toBe('جديدة');

    useEditorStore.getState().deleteCustomPage(id);
    expect(useEditorStore.getState().customPages[id]).toBeUndefined();
  });
});
