import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps, useReactFlow } from '@xyflow/react';
import { getTypeColor } from './DynamicNode';

export default function DeletableEdge(props: EdgeProps) {
  const {
    id,
    source,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    sourceHandleId,
    style = {},
    markerEnd,
    data,
    selected,
  } = props;
  
  const { getNode } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const sourceNode = getNode(source);
  const outputPort = (sourceNode?.data?.outputs as any[])?.find(o => o.id === sourceHandleId);
  const sourceType = outputPort?.type || 'data';
  const edgeColor = getTypeColor(sourceType);

  const edgeStyle = {
    ...style,
    strokeWidth: selected ? 4 : 2,
    stroke: selected ? '#ffffff' : edgeColor,
    filter: `drop-shadow(0 0 5px ${edgeColor}60)`
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStyle} />
      
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan z-50"
          >
            <button
              className="w-6 h-6 bg-red-500 border-2 border-slate-800 rounded-full flex items-center justify-center text-sm font-bold text-white hover:bg-red-600 transition-all shadow-xl cursor-pointer hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                const edgeData = data as { onDelete?: (id: string) => void } | undefined;
                edgeData?.onDelete?.(id);
              }}
              title="حذف هذا الاتصال"
            >
              ✕
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
