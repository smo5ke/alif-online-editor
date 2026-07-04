import React from 'react';
import { Handle, Position } from '@xyflow/react';
import * as LucideIcons from 'lucide-react';

export type NodeControl = {
  id: string;
  type: 'text' | 'number' | 'select';
  label: string;
  value: any;
  options?: string[];
};

export type NodeData = {
  label: string;
  subtitle?: string;
  color?: string;
  iconName?: keyof typeof LucideIcons;
  iconColor?: string;
  inputs?: { id: string; label: string; type: 'event' | 'data' }[];
  outputs?: { id: string; label: string; type: 'event' | 'data' }[];
  controls?: NodeControl[];
  onControlChange?: (controlId: string, value: any) => void;
};

export default function DynamicNode({ data }: { data: NodeData }) {
  const IconComponent = data.iconName ? LucideIcons[data.iconName] as React.ElementType : LucideIcons.Code;
  
  // Use a vibrant color for the header, defaulting to a nice pink/purple if none provided
  const headerColor = data.iconColor || data.color || '#ec4899'; 
  
  const allInputs = data.inputs || [];
  const allOutputs = data.outputs || [];

  return (
    <div
      className="flex flex-col w-[260px] rounded-2xl shadow-2xl transition-all border border-white/5"
      style={{ backgroundColor: '#18181b' }} // Very dark, sleek background
      dir="rtl"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 rounded-t-2xl relative"
        style={{ backgroundColor: headerColor }}
      >
        <div className="flex items-center gap-2.5">
          <IconComponent size={18} className="text-white opacity-90 drop-shadow-sm" strokeWidth={2.5} />
          <span className="text-white font-extrabold text-[15px] tracking-wide drop-shadow-sm">
            {data.label}
          </span>
        </div>
        <LucideIcons.HelpCircle size={15} className="text-white/60 hover:text-white cursor-help transition-colors" />
      </div>

      {/* Body */}
      <div className="flex flex-col p-1">
        
        {/* Controls Section */}
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
                      onChange={(e) => data.onControlChange?.(control.id, e.target.value)}
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
                    onChange={(e) => data.onControlChange?.(control.id, e.target.value)}
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
        {(allInputs.length > 0 || allOutputs.length > 0) && (
          <div className="flex flex-col gap-2 py-4">
            {/* Inputs (Right side) */}
            {allInputs.map((input) => (
              <div key={`in-${input.id}`} className="relative flex items-center justify-start h-8 px-4 group">
                <Handle
                  type="target"
                  position={Position.Right}
                  id={input.id}
                  className="flex items-center justify-center w-10 h-10 bg-transparent border-none z-10 cursor-crosshair -right-5"
                >
                  {/* Large Circular Visual Handle */}
                  <div className="w-[18px] h-[18px] rounded-full bg-[#18181b] border-[3px] border-slate-500 shadow-md transition-all duration-200 group-hover:scale-125 group-hover:border-emerald-400 group-hover:bg-emerald-950 pointer-events-none" />
                </Handle>
                <span className="text-sm font-bold text-slate-300 mr-2">{input.label}</span>
              </div>
            ))}

            {/* Outputs (Left side) */}
            {allOutputs.map((output) => (
              <div key={`out-${output.id}`} className="relative flex items-center justify-end h-8 px-4 group">
                <span className="text-sm font-bold text-slate-300 ml-2">{output.label}</span>
                <Handle
                  type="source"
                  position={Position.Left}
                  id={output.id}
                  className="flex items-center justify-center w-10 h-10 bg-transparent border-none z-10 cursor-crosshair -left-5"
                >
                  {/* Large Circular Visual Handle */}
                  <div className="w-[18px] h-[18px] rounded-full bg-[#18181b] border-[3px] border-slate-500 shadow-md transition-all duration-200 group-hover:scale-125 group-hover:border-emerald-400 group-hover:bg-emerald-950 pointer-events-none" />
                </Handle>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
