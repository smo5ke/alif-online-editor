import { Node, Edge } from '@xyflow/react';
import { NodeData } from '../components/DynamicNode';

// Macro ids may contain Latin characters (e.g. custom test ids), which are
// invalid inside Alif identifiers, so derive a deterministic Arabic-safe name.
export function macroSafeName(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return `م_${h}`;
}

// Temporary variables for macro call outputs must also be fully Arabic-safe
// (Alif rejects mixed identifiers like ناتج_call_block_res_out).
export function macroTempVar(nodeId: string, sourceHandle?: string): string {
  const base = `${nodeId}_${sourceHandle ?? ''}`;
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0;
  return `ناتج_${h}`;
}

export function generateAlifCodeFromGraph(
  mainNodes: Node[], 
  mainEdges: Edge[],
  macros?: Record<string, {name: string, nodes: Node[], edges: Edge[]}>
): string {
  
  function compileContext(nodes: Node[], edges: Edge[], isMacro: boolean, macroName?: string): string {
    let visitedNodes = new Set<string>();

    const escapeAlifString = (s: any): string => {
      return String(s ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '');
    };

    const normalizeOp = (op: any): string => {
      // Batches 1-6 stored '/' and '%' (invalid in Alif: '/' and '%' are syntax errors).
      // Canonical Alif operators verified against the interpreter:
      // \ division, \\ modulo, \* integer division, ^ power
      if (op === '/') return '\\';
      if (op === '%') return '\\\\';
      if (op === '/=') return '\\=';
      if (op === '%=') return '\\\\=';
      return op;
    };
    
    function getNextNodeId(nodeId: string, sourceHandle: string): string | null {
      const edge = edges.find((e) => e.source === nodeId && e.sourceHandle === sourceHandle);
      return edge ? edge.target : null;
    }
  
    function resolveInput(nodeId: string, targetHandle: string): any {
      const edge = edges.find((e) => e.target === nodeId && e.targetHandle === targetHandle);
      if (edge) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (sourceNode) {
          return resolveValue(sourceNode, edge.sourceHandle || undefined);
        }
      }
      return null;
    }

    // Collect connected call arguments (supports N dynamic inputs; empty = no args)
    function resolveCallArgs(node: Node): string[] {
      return resolveCallArgsExcept(node, []);
    }

    // Same as above but skips inputs with the given ids (e.g. obj_in of method calls)
    function resolveCallArgsExcept(node: Node, excludeIds: string[]): string[] {
      const callInputs = (((node.data as any).inputs as any[]) || [])
        .filter((i: any) => i.type !== 'event' && !excludeIds.includes(i.id));
      const args: string[] = [];
      callInputs.forEach((inp: any) => {
        const v = resolveInput(node.id, inp.id);
        if (v !== null && v !== undefined) args.push(v);
      });
      return args;
    }
  
    function resolveValue(node: Node, sourceHandle?: string): any {
      if (!node) return 'عدم';
      visitedNodes.add(node.id);
      const data = node.data as any;
      const type = data.originalType;
      const controls = data.controls || [];
      
      if (data.isMacro) {
        return macroTempVar(node.id, sourceHandle);
      }

      if (type === 'ماكرو/مدخلات') {
        const outputs = data.outputs || [];
        // seq_out is at index 0 usually, but we filter out events
        const dataOutputs = outputs.filter((o: any) => o.type !== 'event');
        const index = dataOutputs.findIndex((o: any) => o.id === sourceHandle);
        return index >= 0 ? `مدخل_${index + 1}` : 'عدم';
      }

      const getControlValue = (id: string) => controls.find((c: any) => c.id === id)?.value;
  
      if (type === 'بيانات/نص') return `"${escapeAlifString(getControlValue('value'))}"`;
      if (type === 'بيانات/رقم') {
        let val = Number(getControlValue('value'));
        if (!Number.isInteger(val)) val = parseFloat(val.toFixed(4));
        return val;
      }
      if (type === 'شروط/منطق' || type === 'بيانات/منطق') return getControlValue('value');
      if (type === 'أوامر/إدخال مستخدم') return `ادخل("${escapeAlifString(getControlValue('prompt'))}")`;
      if (type === 'متغيرات/قراءة') return getControlValue('var_name');
      if (type === 'دوال/طول') {
        let val = resolveInput(node.id, 'val_in') ?? '""';
        return `طول(${val})`;
      }
      if (type === 'بيانات/تحويل لرقم') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `عشري(${val})`;
      }
      if (type === 'بيانات/تحويل لصحيح') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `صحيح(${val})`;
      }
      if (type === 'بيانات/تحويل لمصفوفة') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `مصفوفة(${val})`;
      }
      if (type === 'بيانات/تحويل لمنطق') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `منطق(${val})`;
      }
      if (type === 'بيانات/تحويل لمترابطة') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `مترابطة(${val})`;
      }
      if (type === 'بيانات/تحويل لمميزة') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `مميزة(${val})`;
      }
      if (type === 'بيانات/نوع') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `نوع(${val})`;
      }
      if (type === 'دوال/استدعاء') {
        const args = resolveCallArgs(node);
        const kwargs = (getControlValue('kwargs') || '').trim();
        const all = kwargs ? [...args, kwargs].join(', ') : args.join(', ');
        return `${getControlValue('func_name')}(${all})`;
      }
      if (type === 'شروط/ليس') {
        let val = resolveInput(node.id, 'val_in') ?? 'خطأ';
        return `(ليس ${val})`;
      }
      if (type === 'بيانات/حساب' || type === 'شروط/مقارنة' || type === 'شروط/عملية منطقية') {
        let a = resolveInput(node.id, 'a_in') ?? 0;
        let b = resolveInput(node.id, 'b_in') ?? 0;
        return `(${a} ${normalizeOp(getControlValue('op'))} ${b})`;
      }
      if (type === 'بيانات/دمج نصوص') {
        let a = resolveInput(node.id, 'a_in') ?? '""';
        let b = resolveInput(node.id, 'b_in') ?? '""';
        return `(${a} + ${b})`;
      }
      if (type === 'مصفوفات/جديدة') {
        const inputs = data.inputs || [];
        const elements = inputs.map((input: any) => resolveInput(node.id, input.id) ?? 'عدم');
        return `[${elements.join(', ')}]`;
      }
      if (type === 'مصفوفات/قراءة') {
        let arrName = resolveInput(node.id, 'arr_in') ?? 'مصفوفة';
        let idx = resolveInput(node.id, 'idx_in') ?? 0;
        return `${arrName}[${idx}]`;
      }
      if (type === 'مصفوفات/دمج') {
        let a = resolveInput(node.id, 'a_in') ?? '[]';
        let b = resolveInput(node.id, 'b_in') ?? '[]';
        return `(${a} + ${b})`;
      }
      if (type === 'مصفوفات/مقرون') {
        const lists = (((node.data as any).inputs as any[]) || [])
          .filter((i: any) => i.type !== 'event')
          .map((inp: any) => resolveInput(node.id, inp.id) ?? '[]');
        return `مقرون(${lists.join(', ')})`;
      }
      if (type === 'مصفوفات/معكوس') {
        let val = resolveInput(node.id, 'val_in') ?? '[]';
        return `معكوس(${val})`;
      }
      if (type === 'مميزة/جديدة') {
        const inputs = data.inputs || [];
        const elements = inputs.map((input: any) => resolveInput(node.id, input.id) ?? 'عدم');
        return `{${elements.join(', ')}}`;
      }
      if (type === 'ملفات/اقرا') {
        let file = resolveInput(node.id, 'file_in') ?? 'ملف_مفتوح';
        return `${file}.اقرا()`;
      }
      if (type === 'ملفات/افتح') {
        // Usable as an expression (the assigned variable) or as a flow statement
        const varName = controls.find((c: any) => c.id === 'var_name')?.value || 'ملف_مفتوح';
        return varName;
      }
      if (type === 'ملفات/اقرا سطر') {
        let file = resolveInput(node.id, 'file_in') ?? 'ملف';
        return `${file}.اقرا_سطر()`;
      }
      if (type === 'دوال/خطية') {
        const params = getControlValue('params') || 'س';
        const body = resolveInput(node.id, 'body_in') ?? 'عدم';
        return `(خطية ${params}: ${body})`;
      }
      if (type === 'دوال/تحقق_اي') {
        let val = resolveInput(node.id, 'val_in') ?? '[]';
        return `تحقق_اي(${val})`;
      }
      if (type === 'دوال/هل_نوع') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        const typename = getControlValue('typename') || 'صحيح';
        return `هل_نوع(${val}, ${typename})`;
      }
      if (type === 'نصوص/قص') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        let start = resolveInput(node.id, 'start_in') ?? 0;
        let end = resolveInput(node.id, 'end_in') ?? 0;
        return `${str}[${start}:${end}]`;
      }
      if (type === 'نصوص/استبدال') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        let oldStr = resolveInput(node.id, 'old_in') ?? '""';
        let newStr = resolveInput(node.id, 'new_in') ?? '""';
        return `${str}.استبدل(${oldStr}, ${newStr})`;
      }
      if (type === 'نصوص/تقسيم') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        let sepIn = resolveInput(node.id, 'sep_in');
        if (sepIn !== undefined && sepIn !== null) return `${str}.افصل(${sepIn})`;
        const defaultSep = getControlValue('sep') || ' ';
        if (defaultSep === ' ') return `${str}.افصل()`;
        return `${str}.افصل("${escapeAlifString(defaultSep)}")`;
      }
      if (type === 'نصوص/فحص') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        let target = resolveInput(node.id, 'target_in') ?? '""';
        return `(${target} في ${str})`;
      }
      if (type === 'نصوص/اوجد') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        let target = resolveInput(node.id, 'target_in') ?? '""';
        return `${str}.اوجد(${target})`;
      }
      if (type === 'نصوص/عدد') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        let target = resolveInput(node.id, 'target_in') ?? '""';
        return `${str}.كم(${target})`;
      }
      if (type === 'نصوص/اربط') {
        let sep = resolveInput(node.id, 'str_in') ?? '""';
        let arr = resolveInput(node.id, 'target_in') ?? '[]';
        return `${sep}.اربط(${arr})`;
      }
      if (type === 'فهارس/جديد') {
        const inputs = data.inputs || [];
        const pairs = [];
        for (let i = 0; i < inputs.length; i += 2) {
          if (inputs[i] && inputs[i+1]) {
            const key = resolveInput(node.id, inputs[i].id) ?? '""';
            const val = resolveInput(node.id, inputs[i+1].id) ?? 'عدم';
            pairs.push(`${key}: ${val}`);
          }
        }
        return `{${pairs.join(', ')}}`;
      }
      if (type === 'فهارس/قراءة') {
        let dictName = resolveInput(node.id, 'dict_in') ?? 'فهرس';
        let key = resolveInput(node.id, 'key_in') ?? '""';
        return `${dictName}[${key}]`;
      }

      if (type === 'وقت/الآن') return `الوقت.الان()`;
      if (type === 'وقت/منسق') return `الوقت.منسق()`;
      if (type === 'رياضيات/دوال') {
        let func = getControlValue('func');
        if (func === 'مسافة') {
          let p1 = resolveInput(node.id, 'p1_in') ?? '[0, 0]';
          let p2 = resolveInput(node.id, 'p2_in') ?? '[0, 0]';
          return `الرياضيات.مسافة(${p1}, ${p2})`;
        } else {
          let val = resolveInput(node.id, 'val_in') ?? 0;
          return `الرياضيات.${func}(${val})`;
        }
      }
      if (type === 'عشوائي/رقم') {
        return `العشوائي.عشوائي()`;
      }
      if (type === 'عشوائي/منتظم') {
        let min = resolveInput(node.id, 'min_in') ?? 0;
        let max = resolveInput(node.id, 'max_in') ?? 1;
        return `العشوائي.منتظم(${min}, ${max})`;
      }
      if (type === 'فهارس/مفاتيح_وقيم') {
        let dict = resolveInput(node.id, 'dict_in') ?? 'فهرس';
        return `${dict}.${getControlValue('type')}()`;
      }
      if (type === 'شروط/انتماء') {
        let val = resolveInput(node.id, 'val_in') ?? '""';
        let list = resolveInput(node.id, 'list_in') ?? '[]';
        return `(${val} ${normalizeOp(getControlValue('op'))} ${list})`;
      }
      if (type === 'كائنات/هذا') {
        const objTarget = resolveInput(node.id, 'obj_in') ?? 'هذا';
        return `${objTarget}.${getControlValue('prop_name')}`;
      }
      if (type === 'كائنات/إنشاء') {
        const args = resolveCallArgs(node);
        return `${getControlValue('class_name')}(${args.join(', ')})`;
      }
      if (type === 'كائنات/استدعاء طريقة') {
        let obj = resolveInput(node.id, 'obj_in') ?? 'كائن';
        let method = getControlValue('method_name') || 'تشغيل';
        const methodArgs = resolveCallArgsExcept(node, ['obj_in']);
        const kwargs = (getControlValue('kwargs') || '').trim();
        const all = kwargs ? [...methodArgs, kwargs].join(', ') : methodArgs.join(', ');
        return `${obj}.${method}(${all})`;
      }
      if (type === 'فهارس/احضر') {
        let dict = resolveInput(node.id, 'dict_in') ?? 'فهرس';
        let key = resolveInput(node.id, 'key_in') ?? '""';
        let defVal = resolveInput(node.id, 'default_in') ?? 'عدم';
        return `${dict}.احضر(${key}, ${defVal})`;
      }
      if (type === 'فهارس/فحص مفتاح') {
        let dict = resolveInput(node.id, 'dict_in') ?? 'فهرس';
        let key = resolveInput(node.id, 'key_in') ?? '""';
        return `(${key} في ${dict})`;
      }
      if (type === 'بيانات/تعبير مخصص') {
        let expr = getControlValue('expr') || 'أ + ب';
        let a = resolveInput(node.id, 'a_in');
        let b = resolveInput(node.id, 'b_in');
        if (a !== null && a !== undefined) {
          expr = expr.replace(/\bأ\b/g, `(${a})`);
        }
        if (b !== null && b !== undefined) {
          expr = expr.replace(/\bب\b/g, `(${b})`);
        }
        return `(${expr})`;
      }
      return 'عدم';
    }
  
    function walkExecution(currNodeId: string | null, indent: string, pathVisited: Set<string>): string {
      let code = '';
      let safetyLimit = 0;

      // Emits اواذا chain members or a final والا: block for a false-branch target
      const emitFalseBranch = (falseId: string | null): void => {
        if (!falseId) return;
        const falseNode = nodes.find((n) => n.id === falseId);
        if (falseNode && (falseNode.data as any).originalType === 'شروط/اواذا') {
          if (pathVisited.has(falseId)) {
            code += indent + '# تحذير: حلقة لا نهائية\n';
            return;
          }
          pathVisited.add(falseId);
          visitedNodes.add(falseId);
          const cond2 = resolveInput(falseId, 'cond_in') ?? 'خطأ';
          code += indent + `اواذا ${cond2}:\n`;
          const t2 = getNextNodeId(falseId, 'true_out');
          if (t2) code += walkExecution(t2, indent + '\t', new Set(pathVisited));
          else code += indent + '\tتجاوز\n';
          emitFalseBranch(getNextNodeId(falseId, 'false_out'));
          return;
        }
        code += indent + `والا:\n`;
        code += walkExecution(falseId, indent + '\t', new Set(pathVisited));
      };
  
      while (currNodeId && safetyLimit < 100) {
        safetyLimit++;
        if (pathVisited.has(currNodeId)) {
          code += indent + '# تحذير: حلقة لا نهائية\n';
          break;
        }
        pathVisited.add(currNodeId);
        visitedNodes.add(currNodeId);
        const currNode = nodes.find((n) => n.id === currNodeId);
        if (!currNode) break;
  
        const data = currNode.data as any;
        const type = data.originalType;
        const controls = data.controls || [];
        const getControlValue = (id: string) => controls.find((c: any) => c.id === id)?.value;
        
        if (data.isMacro) {
          const mName = macroSafeName(data.macroId || 'م_مجهول');
          const mInputs = (data.inputs || []).filter((i: any) => i.type !== 'event');
          const resolvedArgs = mInputs.map((inp: any) => resolveInput(currNode.id, inp.id) ?? 'عدم');
          
          const mOutputs = (data.outputs || []).filter((o: any) => o.type !== 'event');
          if (mOutputs.length > 0) {
             const outVars = mOutputs.map((out: any) => macroTempVar(currNode.id, out.id));
             code += indent + `${outVars.join(', ')} = ${mName}(${resolvedArgs.join(', ')}) # @node:${currNode.id}\n`;
          } else {
             code += indent + `${mName}(${resolvedArgs.join(', ')}) # @node:${currNode.id}\n`;
          }
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
          continue;
        }

        if (type === 'ماكرو/مخرجات') {
          const mInputs = (data.inputs || []).filter((i: any) => i.type !== 'event');
          const resolvedReturns = mInputs.map((inp: any) => resolveInput(currNode.id, inp.id) ?? 'عدم');
          if (resolvedReturns.length > 0) {
             code += indent + `ارجع ${resolvedReturns.join(', ')} # @node:${currNode.id}\n`;
          } else {
             code += indent + `ارجع # @node:${currNode.id}\n`;
          }
          break; // Stop execution flow when hitting output
        }
        
        if (type === 'أوامر/اطبع') {
          const mInputs = data.inputs as any[] || [];
          const printVals = mInputs
            .filter((inp: any) => inp.type === 'data')
            .map((inp: any) => resolveInput(currNode.id, inp.id) ?? '""');
            
          let argsStr = printVals.join(', ');
          
          let kwargs = [];
          const sep = getControlValue('sep');
          const end = getControlValue('end');
          const flush = getControlValue('flush');

          // Emit kwargs only when they differ from the node defaults (' ' and '\n')
          if (sep !== undefined && sep !== ' ') kwargs.push(`الفاصل="${escapeAlifString(sep)}"`);
          if (end !== undefined && end !== '\\n') kwargs.push(`النهاية="${escapeAlifString(end)}"`);
          if (flush === 'صح') kwargs.push(`مباشر=صح`);
          
          if (kwargs.length > 0) {
              argsStr += (argsStr ? ', ' : '') + kwargs.join(', ');
          }
          
          code += indent + `اطبع(${argsStr}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'أوامر/سطر مخصص') {
          let cmd = getControlValue('code') || 'تجاوز';
          let a = resolveInput(currNode.id, 'a_in');
          let b = resolveInput(currNode.id, 'b_in');
          if (a !== null && a !== undefined) {
            cmd = cmd.replace(/\bأ\b/g, `${a}`);
          }
          if (b !== null && b !== undefined) {
            cmd = cmd.replace(/\bب\b/g, `${b}`);
          }
          code += indent + `${cmd} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'متغيرات/إسناد') {
          let varName = getControlValue('var_name');
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `${varName} = ${val} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'متغيرات/إسناد رجعي') {
          let varName = getControlValue('var_name');
          let op = normalizeOp(getControlValue('op'));
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `${varName} ${op} ${val} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'متغيرات/إسناد شرطي') {
          let varName = getControlValue('var_name');
          let cond = resolveInput(currNode.id, 'cond_in') ?? 'خطأ';
          let trueVal = resolveInput(currNode.id, 'true_in') ?? 'عدم';
          let falseVal = resolveInput(currNode.id, 'false_in') ?? 'عدم';
          code += indent + `${varName} = ${trueVal} اذا ${cond} والا ${falseVal} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'متغيرات/حذف') {
          let varName = getControlValue('var_name');
          code += indent + `احذف ${varName} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'مصفوفات/إضافة') {
          let arrName = resolveInput(currNode.id, 'arr_in') ?? 'مصفوفة';
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `${arrName}.اضف(${val}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'مصفوفات/حذف') {
          let arrName = resolveInput(currNode.id, 'arr_in') ?? 'مصفوفة';
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `${arrName}.امسح(${val}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'مصفوفات/إدراج') {
          let arrName = resolveInput(currNode.id, 'arr_in') ?? 'مصفوفة';
          let idx = resolveInput(currNode.id, 'idx_in') ?? 0;
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `${arrName}.ادرج(${idx}, ${val}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'مصفوفات/ترتيب') {
          let arrName = resolveInput(currNode.id, 'arr_in') ?? 'مصفوفة';
          code += indent + `${arrName}.رتب() # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'مصفوفات/تعديل عنصر') {
          let arr = resolveInput(currNode.id, 'arr_in') ?? 'مصفوفة';
          let idx = resolveInput(currNode.id, 'idx_in') ?? 0;
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `${arr}[${idx}] = ${val} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'فهارس/إضافة') {
          let dictName = resolveInput(currNode.id, 'dict_in') ?? 'فهرس';
          let key = resolveInput(currNode.id, 'key_in') ?? '""';
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `${dictName}[${key}] = ${val} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'فهارس/حذف مفتاح') {
          let dictName = resolveInput(currNode.id, 'dict_in') ?? 'فهرس';
          let key = resolveInput(currNode.id, 'key_in') ?? '""';
          code += indent + `احذف ${dictName}[${key}] # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'دوال/استدعاء') {
          const args = resolveCallArgs(currNode);
          const kwargs = (getControlValue('kwargs') || '').trim();
          const all = kwargs ? [...args, kwargs].join(', ') : args.join(', ');
          code += indent + `${getControlValue('func_name')}(${all}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');

        } else if (type === 'كائنات/تعيين_خاصية') {
          let prop = getControlValue('prop_name');
          const objTarget = resolveInput(currNode.id, 'obj_in') ?? 'هذا';
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `${objTarget}.${prop} = ${val} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'كائنات/استدعاء طريقة') {
          let obj = resolveInput(currNode.id, 'obj_in') ?? 'كائن';
          let method = getControlValue('method_name') || 'تشغيل';
          const methodArgs = resolveCallArgsExcept(currNode, ['obj_in']);
          const kwargs = (getControlValue('kwargs') || '').trim();
          const all = kwargs ? [...methodArgs, kwargs].join(', ') : methodArgs.join(', ');
          code += indent + `${obj}.${method}(${all}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');

        } else if (type === 'استيراد/مكتبة') {
          let lib = getControlValue('lib') || 'الوقت';
          code += indent + `استورد ${lib} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'استيراد/من') {
          let pkg = getControlValue('pkg') || 'الوقت';
          let name = getControlValue('name') || 'غفوة';
          code += indent + `من ${pkg} استورد ${name} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'ملفات/افتح') {
          const varName = getControlValue('var_name') || 'ملف_مفتوح';
          const pathIn = resolveInput(currNode.id, 'path_in');
          const modeIn = resolveInput(currNode.id, 'mode_in');
          const pathStr = pathIn !== null && pathIn !== undefined ? pathIn : `"${escapeAlifString(getControlValue('path') || 'ملف.الف')}"`;
          const modeVal = modeIn !== null && modeIn !== undefined ? modeIn : getControlValue('mode') || 'ق';
          const modeStr = String(modeVal).startsWith('"') ? modeVal : `"${escapeAlifString(modeVal)}"`;
          code += indent + `${varName} = افتح(${pathStr}, ${modeStr}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'ملفات/اكتب') {
          let file = resolveInput(currNode.id, 'file_in') ?? 'ملف_مفتوح';
          let text = resolveInput(currNode.id, 'text_in') ?? '""';
          code += indent + `${file}.اكتب(${text}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'ملفات/اغلق') {
          let file = resolveInput(currNode.id, 'file_in') ?? 'ملف_مفتوح';
          code += indent + `${file}.اغلق() # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'مميزة/إضافة') {
          let setName = resolveInput(currNode.id, 'set_in') ?? 'مميزة';
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `${setName}.اضف(${val}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'مميزة/اسحب') {
          let setName = resolveInput(currNode.id, 'set_in') ?? 'مميزة';
          code += indent + `${setName}.اسحب() # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'متغيرات/إسناد متعدد') {
          const varNames = getControlValue('var_names') || 'س, ص';
          const vals = (((currNode.data as any).inputs as any[]) || [])
            .filter((i: any) => i.type !== 'event')
            .map((inp: any) => resolveInput(currNode.id, inp.id) ?? 'عدم');
          code += indent + `${varNames} = ${vals.join(', ')} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'عشوائي/بذرة') {
          let val = resolveInput(currNode.id, 'val_in') ?? 0;
          code += indent + `العشوائي.البذرة(${val}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'وقت/انتظر') {
          let ms = resolveInput(currNode.id, 'ms_in') ?? 3;
          code += indent + `الوقت.غفوة(${ms}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'دوال/إرجاع') {
          let retVal = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `ارجع ${retVal} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'شروط/اذا' || type === 'شروط/اواذا') {
          // A standalone اواذا (not chained after اذا/اواذا) is emitted as اذا to stay valid
          const chained = type === 'شروط/اواذا' &&
            edges.some((e) => e.sourceHandle === 'false_out' && e.target === currNode.id);
          const keyword = type === 'شروط/اواذا' && chained ? 'اواذا' : 'اذا';
          let cond = resolveInput(currNode.id, 'cond_in') ?? 'خطأ';
          code += indent + `${keyword} ${cond}:\n`;
          let trueNodeId = getNextNodeId(currNode.id, 'true_out');
          if (trueNodeId) code += walkExecution(trueNodeId, indent + '\t', new Set(pathVisited));
          else code += indent + '\tتجاوز\n';

          emitFalseBranch(getNextNodeId(currNode.id, 'false_out'));
          // Continuation after the branch (new seq_out); old graphs without it simply end here
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'حلقات/لكل') {
          const startVal = resolveInput(currNode.id, 'start_in');
          const endVal = resolveInput(currNode.id, 'end_in');
          const stepVal = resolveInput(currNode.id, 'step_in');
          const has = (v: unknown) => v !== null && v !== undefined;
          let rangeArgs: string;
          if (has(stepVal)) {
            rangeArgs = `${has(startVal) ? startVal : 1}, ${has(endVal) ? endVal : 10}, ${stepVal}`;
          } else if (has(startVal) && has(endVal)) {
            rangeArgs = `${startVal}, ${endVal}`;
          } else if (has(startVal)) {
            rangeArgs = `${startVal}`;
          } else if (has(endVal)) {
            rangeArgs = `${endVal}`;
          } else {
            rangeArgs = '1, 10';
          }
          let varName = getControlValue('var_name') || 'س';
          code += indent + `لكل ${varName} في مدى(${rangeArgs}):\n`;
          
          let bodyNodeId = getNextNodeId(currNode.id, 'body_out');
          if (bodyNodeId) code += walkExecution(bodyNodeId, indent + '\t', new Set(pathVisited));
          else code += indent + '\tتجاوز\n';
          
          currNodeId = getNextNodeId(currNode.id, 'done_out');
        } else if (type === 'حلقات/بينما') {
          let cond = resolveInput(currNode.id, 'cond_in') ?? 'خطأ';
          code += indent + `بينما ${cond}:\n`;
          
          let bodyNodeId = getNextNodeId(currNode.id, 'body_out');
          if (bodyNodeId) code += walkExecution(bodyNodeId, indent + '\t', new Set(pathVisited));
          else code += indent + '\tتجاوز\n';
          
          currNodeId = getNextNodeId(currNode.id, 'done_out');
        } else if (type === 'حلقات/توقف') {
          code += indent + `توقف # @node:${currNode.id}\n`;
          break;
        } else if (type === 'حلقات/استمر') {
          code += indent + `استمر # @node:${currNode.id}\n`;
          break;
        } else if (type === 'حلقات/لكل في مصفوفة') {
          let arr = resolveInput(currNode.id, 'arr_in') ?? '[]';
          let varName = getControlValue('var_name') || 'عنصر';
          code += indent + `لكل ${varName} في ${arr}:\n`;
          
          let bodyNodeId = getNextNodeId(currNode.id, 'body_out');
          if (bodyNodeId) code += walkExecution(bodyNodeId, indent + '\t', new Set(pathVisited));
          else code += indent + '\tتجاوز\n';
          
          currNodeId = getNextNodeId(currNode.id, 'done_out');

        } else if (type === 'أخطاء/محاولة') {
          code += indent + `حاول:\n`;
          let tryNodeId = getNextNodeId(currNode.id, 'try_out');
          if (tryNodeId) code += walkExecution(tryNodeId, indent + '\t', new Set(pathVisited));
          else code += indent + '\tتجاوز\n';

          let catchNodeId = getNextNodeId(currNode.id, 'catch_out');
          if (catchNodeId) {
            const errType = (getControlValue('err_type') || '').trim();
            code += indent + (errType ? `خلل ${errType}:\n` : `خلل:\n`);
            code += walkExecution(catchNodeId, indent + '\t', new Set(pathVisited));
          }

          let elseNodeId = getNextNodeId(currNode.id, 'else_out');
          if (elseNodeId) {
            code += indent + `والا:\n`;
            code += walkExecution(elseNodeId, indent + '\t', new Set(pathVisited));
          }

          let finallyNodeId = getNextNodeId(currNode.id, 'finally_out');
          if (finallyNodeId) {
            code += indent + `نهاية:\n`;
            code += walkExecution(finallyNodeId, indent + '\t', new Set(pathVisited));
          }
          // Continuation after try/catch (new seq_out); old graphs without it simply end here
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'كائنات/صنف') {
          let className = getControlValue('class_name');
          let inherits = getControlValue('inherits');
          code += indent + `صنف ${className}`;
          if (inherits) code += `(${inherits})`;
          code += `:\n`;
          
          let bodyNodeId = getNextNodeId(currNode.id, 'body_out');
          if (bodyNodeId) code += walkExecution(bodyNodeId, indent + '\t', new Set(pathVisited));
          else code += indent + '\tتجاوز\n';
          
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'دوال/تعريف دالة' && indent !== '') {
          // Nested definition (e.g. a method inside صنف body): emit it inline
          const fname = getControlValue('func_name') || 'دالة';
          const farg = getControlValue('arg') || '';
          code += indent + `دالة ${fname}(${farg}): # @node:${currNode.id}\n`;
          const defBodyId = getNextNodeId(currNode.id, 'body_out');
          if (defBodyId) code += walkExecution(defBodyId, indent + '\t', new Set(pathVisited));
          else code += indent + '\tتجاوز\n';
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'أوامر/بداية البرنامج' || type === 'دوال/تعريف دالة' || type === 'ماكرو/مدخلات') {
          currNodeId = getNextNodeId(currNode.id, 'seq_out') || getNextNodeId(currNode.id, 'body_out');
        } else {
          break;
        }
      }
      return code;
    }
  
    let localCode = '';
    
    // Definitions nested under a صنف body are emitted inline by walkExecution;
    // exclude them from the top-level pass to avoid duplicates
    const nestedDefIds = new Set<string>();
    {
      const branchHandles = ['body_out', 'true_out', 'false_out', 'try_out', 'catch_out', 'finally_out'];
      const stack: string[] = nodes
        .filter(n => (n.data as any).originalType === 'كائنات/صنف')
        .map(n => n.id);
      const seen = new Set<string>();
      while (stack.length > 0) {
        const nid = stack.pop() as string;
        if (seen.has(nid)) continue;
        seen.add(nid);
        for (const h of branchHandles) {
          const next = getNextNodeId(nid, h);
          if (next) {
            const target = nodes.find(n => n.id === next);
            if (target && (target.data as any).originalType === 'دوال/تعريف دالة') {
              nestedDefIds.add(next);
            }
            stack.push(next);
          }
        }
      }
    }

    // Support definition functions inside the graph
    const funcNodes = nodes.filter(n => (n.data as any).originalType === 'دوال/تعريف دالة' && !nestedDefIds.has(n.id));
    funcNodes.forEach((node) => {
      const getControlValue = (id: string) => ((node.data as NodeData).controls || []).find((c: any) => c.id === id)?.value;
      localCode += `دالة ${getControlValue('func_name')}(${getControlValue('arg')}):\n`;
      let bodyNodeId = getNextNodeId(node.id, 'body_out');
      if (bodyNodeId) localCode += walkExecution(bodyNodeId, '\t', new Set<string>());
      else localCode += '\tتجاوز\n';
      localCode += '\n';
    });
  
    if (isMacro && macroName) {
      const inputNode = nodes.find(n => (n.data as any).originalType === 'ماكرو/مدخلات');
      let args: string[] = [];
      
      if (inputNode) {
        const dataOutputs = ((inputNode.data as any).outputs || []).filter((o: any) => o.type !== 'event');
        args = dataOutputs.map((_: any, i: number) => `مدخل_${i + 1}`);
      }
      
      localCode += `دالة ${macroName}(${args.join(', ')}):\n`;
      let bodyNodeId = inputNode ? getNextNodeId(inputNode.id, 'seq_out') : null;
      if (bodyNodeId) {
        localCode += walkExecution(bodyNodeId, '\t', new Set<string>());
      } else {
        localCode += '\tتجاوز\n';
      }
      localCode += '\n';
    } else {
      const startNodes = nodes.filter(n => (n.data as any).originalType === 'أوامر/بداية البرنامج');
      if (startNodes.length > 0) {
        localCode += walkExecution(startNodes[0].id, '', new Set<string>());
      } else if (funcNodes.length === 0) {
        return '# يرجى إضافة وتوصيل عقدة (بداية البرنامج) أو (تعريف دالة)\n';
      }
    }
  
    // Inform user about unvisited nodes ONLY for main graph
    if (!isMacro) {
      const unvisitedNodes = nodes.filter(n => !visitedNodes.has(n.id) && 
        (n.data as any).originalType !== 'أوامر/بداية البرنامج' && 
        (n.data as any).originalType !== 'دوال/تعريف دالة' &&
        !(n.data as any).isMacro);
      
      if (unvisitedNodes.length > 0) {
        localCode += '\n# ⚠️ يوجد عقد غير متصلة بمسار التنفيذ (لن تظهر في الشفرة الحية):\n';
        unvisitedNodes.forEach(n => {
          localCode += `# - ${(n.data as any).label}\n`;
        });
      }
    }
  
    return localCode;
  }

  let finalCode = '# تم التوليد برمجياً من المحرر المرئي 🕸️\n\n';
  
  // Auto-import modules if specific nodes are used anywhere (main or macros),
  // unless the user already imports them explicitly via استيراد/مكتبة nodes
  const allNodes = [
    ...mainNodes,
    ...(macros ? Object.values(macros).flatMap(m => m.nodes) : [])
  ];

  const explicitImports = new Set(
    allNodes
      .filter(n => (n.data as any).originalType === 'استيراد/مكتبة')
      .map(n => ((n.data as any).controls as any[] || []).find((c: any) => c.id === 'lib')?.value)
      .filter((v): v is string => typeof v === 'string')
  );

  const usesTime = allNodes.some(n => (n.data as any).originalType === 'وقت/انتظر' || (n.data as any).originalType === 'وقت/الآن' || (n.data as any).originalType === 'وقت/منسق');
  if (usesTime && !explicitImports.has('الوقت')) {
    finalCode += 'استورد الوقت\n\n';
  }
  
  // Pre-compile macros as functions
  if (macros) {
    Object.entries(macros).forEach(([id, macro]) => {
      finalCode += compileContext(macro.nodes, macro.edges, true, macroSafeName(id));
    });
  }

  // Compile Main Graph
  // If we are currently viewing a macro, generateAlifCodeFromGraph is called with mainNodes = macroNodes.
  // We can detect this by checking if the mainNodes have a "ماكرو/مدخلات" node instead of "بداية البرنامج".
  const hasMacroInput = mainNodes.some(n => (n.data as any).originalType === 'ماكرو/مدخلات');
  const hasMainStart = mainNodes.some(n => (n.data as any).originalType === 'أوامر/بداية البرنامج');

  if (hasMacroInput && !hasMainStart) {
    // We are generating code WHILE inside a macro. Let's just generate the macro function!
    finalCode += compileContext(mainNodes, mainEdges, true, 'م_حالي');
  } else {
    // Standard execution
    finalCode += compileContext(mainNodes, mainEdges, false);
  }

  return finalCode;
}
