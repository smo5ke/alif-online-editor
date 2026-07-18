import React from 'react';
import { Handle, Position } from '@xyflow/react';
import * as LucideIcons from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';

export type NodeControl = {
  id: string;
  type: 'text' | 'number' | 'select';
  label: string;
  value: any;
  options?: string[];
};

export type DataType = 'event' | 'text' | 'number' | 'boolean' | 'array' | 'dictionary' | 'any' | 'data';

export type NodeData = {
  label: string;
  subtitle?: string;
  color?: string;
  iconName?: keyof typeof LucideIcons;
  iconColor?: string;
  inputs?: { id: string; label: string; type: DataType }[];
  outputs?: { id: string; label: string; type: DataType }[];
  controls?: NodeControl[];
  allowDynamicInputs?: boolean | 'pair';
  allowDynamicOutputs?: boolean;
  onControlChange?: (controlId: string, value: any) => void;
  onAddDynamicInput?: (nodeId: string) => void;
  onAddDynamicOutput?: (nodeId: string) => void;
};

export const getTypeColor = (type?: DataType) => {
  switch(type) {
    case 'event': return '#10b981'; // emerald-500
    case 'text': return '#a855f7'; // purple-500
    case 'number': return '#22c55e'; // green-500
    case 'boolean': return '#ef4444'; // red-500
    case 'array': return '#eab308'; // yellow-500
    case 'dictionary': return '#3b82f6'; // blue-500
    case 'any':
    case 'data':
    default: return '#60a5fa'; // blue-400
  }
};

export default function DynamicNode({ data, id }: { data: NodeData; id: string }) {
  const { updateNodeControl, addDynamicInput, errorNodeId } = useEditorStore();
  const isError = errorNodeId === id;
  const IconComponent = data.iconName ? LucideIcons[data.iconName] as React.ElementType : LucideIcons.Code;
  
  // Use a vibrant color for the header, defaulting to a nice pink/purple if none provided
  const headerColor = data.iconColor || data.color || '#ec4899'; 
  
  const allInputs = data.inputs || [];
  const allOutputs = data.outputs || [];

  return (
    <div
      className={`flex flex-col w-[260px] rounded-2xl shadow-2xl transition-all border ${
        isError ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse' : 'border-white/5'
      }`}
      style={{ backgroundColor: '#18181b' }} // Very dark, sleek background
      dir="rtl"
    >
      {/* Header */}
      <div 
        className="flex items-center gap-3 px-4 py-3 rounded-t-2xl relative overflow-hidden"
        style={{ backgroundColor: `${headerColor}25` }} // 25 opacity hex
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{ background: `linear-gradient(to right, transparent, ${headerColor})` }}
        />
        <div 
          className="flex items-center justify-center w-8 h-8 rounded-lg z-10"
          style={{ backgroundColor: `${headerColor}30`, color: headerColor }}
        >
          <IconComponent size={18} />
        </div>
        <div className="flex flex-col z-10 min-w-0 flex-1">
          <span className="text-sm font-bold text-slate-100 truncate">{data.label}</span>
          {data.subtitle && (
            <span className="text-[10px] text-slate-400 font-medium truncate">{data.subtitle}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow relative">
        
        {/* Controls Section (Text Inputs, Selects, etc) */}
        {data.controls && data.controls.length > 0 && (
          <div className="flex flex-col gap-4 px-3 py-4">
            {data.controls.map((control) => (
              <div key={control.id} className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-bold text-slate-300 px-1">{control.label}</label>
                {control.type === 'select' ? (
                  <div className="relative">
                    <select
                      className="w-full bg-[#27272a] border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:ring-2 transition-all nodrag appearance-none font-medium cursor-pointer"
                      style={{ '--tw-ring-color': headerColor } as React.CSSProperties}
                      value={control.value}
                      onChange={(e) => {
                        updateNodeControl(id, control.id, e.target.value);
                        data.onControlChange?.(control.id, e.target.value);
                      }}
                    >
                      {control.options?.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#27272a] text-slate-200">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <LucideIcons.ChevronDown size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                ) : (
                  <input
                    type={control.type}
                    className="w-full bg-[#27272a] border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:ring-2 transition-all nodrag font-medium"
                    style={{ '--tw-ring-color': headerColor } as React.CSSProperties}
                    value={control.value}
                    onChange={(e) => {
                      updateNodeControl(id, control.id, e.target.value);
                      data.onControlChange?.(control.id, e.target.value);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Separator if both controls and ports exist */}
        {data.controls && data.controls.length > 0 && (allInputs.length > 0 || allOutputs.length > 0) && (
          <div className="h-px bg-white/5 mx-3" />
        )}

        {/* Ports (Inputs / Outputs) Section */}
        {(allInputs.length > 0 || allOutputs.length > 0 || data.allowDynamicInputs) && (
          <div className="flex flex-col gap-2 py-4">
            {/* Inputs (Right side) */}
            {allInputs.map((input) => {
              const pinColor = getTypeColor(input.type);
              return (
                <div key={`in-${input.id}`} className="relative flex items-center justify-start h-8 px-4 group">
                  <Handle
                    type="target"
                    position={Position.Right}
                    id={input.id}
                    className="flex items-center justify-center w-10 h-10 bg-transparent border-none z-10 cursor-crosshair -right-5"
                  >
                    {/* Large Circular Visual Handle */}
                    <div 
                      className="w-[18px] h-[18px] rounded-full bg-[#18181b] border-[3px] shadow-md transition-all duration-200 group-hover:scale-125 pointer-events-none"
                      style={{ borderColor: pinColor, boxShadow: `0 0 10px ${pinColor}40` }}
                    />
                  </Handle>
                  <span className="text-sm font-bold text-slate-300 mr-2">{input.label}</span>
                  {data.allowDynamicInputs && input.id !== 'seq_in' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        useEditorStore.getState().removeDynamicInput(id, input.id);
                      }}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 mr-2 text-slate-500 hover:text-red-500 transition-opacity nodrag"
                      title="حذف"
                    >
                      <LucideIcons.Minus size={14} />
                    </button>
                  )}
                </div>
              );
            })}
            
            {data.allowDynamicInputs && (
              <div className="flex justify-start px-4 mt-1">
                <button
                  onClick={() => {
                    addDynamicInput(id);
                    data.onAddDynamicInput?.(id);
                  }}
                  className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800 hover:bg-emerald-600/80 text-slate-400 hover:text-white border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer shadow-sm nodrag"
                  title="إضافة عنصر"
                >
                  <LucideIcons.Plus size={14} />
                </button>
              </div>
            )}

            {/* Outputs (Left side) */}
            {allOutputs.map((output) => {
              const pinColor = getTypeColor(output.type);
              return (
                <div key={`out-${output.id}`} className="relative flex items-center justify-end h-8 px-4 group">
                  {data.allowDynamicOutputs && output.id !== 'seq_out' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        useEditorStore.getState().removeDynamicOutput(id, output.id);
                      }}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 ml-2 text-slate-500 hover:text-red-500 transition-opacity nodrag"
                      title="حذف"
                    >
                      <LucideIcons.Minus size={14} />
                    </button>
                  )}
                  <span className="text-sm font-bold text-slate-300 ml-2">{output.label}</span>
                  <Handle
                    type="source"
                    position={Position.Left}
                    id={output.id}
                    className="flex items-center justify-center w-10 h-10 bg-transparent border-none z-10 cursor-crosshair -left-5"
                  >
                    {/* Large Circular Visual Handle */}
                    <div 
                      className="w-[18px] h-[18px] rounded-full bg-[#18181b] border-[3px] shadow-md transition-all duration-200 group-hover:scale-125 pointer-events-none"
                      style={{ borderColor: pinColor, boxShadow: `0 0 10px ${pinColor}40` }}
                    />
                  </Handle>
                </div>
              );
            })}

            {data.allowDynamicOutputs && (
              <div className="flex justify-end px-4 mt-1">
                <button
                  onClick={() => {
                    useEditorStore.getState().addDynamicOutput(id);
                    data.onAddDynamicOutput?.(id);
                  }}
                  className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-800 hover:bg-emerald-600/80 text-slate-400 hover:text-white border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer shadow-sm nodrag"
                  title="إضافة مخرج"
                >
                  <LucideIcons.Plus size={14} />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
