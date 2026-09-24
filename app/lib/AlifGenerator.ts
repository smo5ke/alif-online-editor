import { Node, Edge } from '@xyflow/react';
import { NodeData } from '../components/DynamicNode';

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
      // Legacy graphs stored division as backslash; Alif 5.3 uses forward slash
      if (op === '\\') return '/';
      if (op === '\\=') return '/=';
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
        return `ناتج_${node.id.replace(/-/g, '_')}_${sourceHandle}`;
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
      if (type === 'شروط/منطق') return getControlValue('value');
      if (type === 'أوامر/إدخال مستخدم') return `ادخل("${escapeAlifString(getControlValue('prompt'))}")`;
      if (type === 'متغيرات/قراءة') return getControlValue('var_name');
      if (type === 'دوال/طول') {
        let val = resolveInput(node.id, 'val_in') ?? '""';
        return `طول(${val})`;
      }
      if (type === 'بيانات/تحويل لنص') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `نص(${val})`;
      }
      if (type === 'بيانات/تحويل لرقم') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `عشري(${val})`;
      }
      if (type === 'بيانات/نوع') {
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `نوع(${val})`;
      }
      if (type === 'بيانات/عشوائي') {
        let a = resolveInput(node.id, 'min_in') ?? 1;
        let b = resolveInput(node.id, 'max_in') ?? 100;
        return `عشوائي(${a}, ${b})`;
      }
      if (type === 'بيانات/تقريب') {
        let val = resolveInput(node.id, 'val_in') ?? 0;
        return `قرب(${val})`;
      }
      if (type === 'دوال/استدعاء') {
        const args = resolveCallArgs(node);
        return `${getControlValue('func_name')}(${args.join(', ')})`;
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
      if (type === 'مصفوفات/موقع عنصر') {
        let arr = resolveInput(node.id, 'arr_in') ?? '[]';
        let val = resolveInput(node.id, 'val_in') ?? 'عدم';
        return `${arr}.فهرس(${val})`;
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
      if (type === 'نصوص/تكبير') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        return `${str}.كبير()`;
      }
      if (type === 'نصوص/تصغير') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        return `${str}.صغير()`;
      }
      if (type === 'نصوص/تقسيم') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        let sepIn = resolveInput(node.id, 'sep_in');
        let sep = sepIn !== undefined && sepIn !== null ? sepIn : `"${escapeAlifString(getControlValue('sep') || ' ')}"`;
        return `${str}.قسم(${sep})`;
      }
      if (type === 'نصوص/تنظيف') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        return `${str}.جرد()`;
      }
      if (type === 'نصوص/فحص') {
        let str = resolveInput(node.id, 'str_in') ?? '""';
        let target = resolveInput(node.id, 'target_in') ?? '""';
        let checkType = getControlValue('check_type') || 'يحتوي';
        if (checkType === 'يبدأ_بـ') return `${str}.يبدأ_بـ(${target})`;
        if (checkType === 'ينتهي_بـ') return `${str}.ينتهي_بـ(${target})`;
        return `(${target} في ${str})`;
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
        return `هذا.${getControlValue('prop_name')}`;
      }
      if (type === 'كائنات/إنشاء') {
        const args = resolveCallArgs(node);
        return `${getControlValue('class_name')}(${args.join(', ')})`;
      }
      if (type === 'كائنات/استدعاء طريقة') {
        let obj = resolveInput(node.id, 'obj_in') ?? 'كائن';
        let method = getControlValue('method_name') || 'تشغيل';
        const methodArgs = resolveCallArgsExcept(node, ['obj_in']);
        return `${obj}.${method}(${methodArgs.join(', ')})`;
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
          const mName = (data.macroId || 'م_مجهول').replace('macro_', 'م_');
          const mInputs = (data.inputs || []).filter((i: any) => i.type !== 'event');
          const resolvedArgs = mInputs.map((inp: any) => resolveInput(currNode.id, inp.id) ?? 'عدم');
          
          const mOutputs = (data.outputs || []).filter((o: any) => o.type !== 'event');
          if (mOutputs.length > 0) {
             const outVars = mOutputs.map((out: any) => `ناتج_${currNode.id.replace(/-/g, '_')}_${out.id}`);
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
        } else if (type === 'أوامر/مسح الطرفية') {
          code += indent + `امسح() # @node:${currNode.id}\n`;
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
        } else if (type === 'مصفوفات/إزالة') {
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
        } else if (type === 'مصفوفات/عكس') {
          let arrName = resolveInput(currNode.id, 'arr_in') ?? 'مصفوفة';
          code += indent + `${arrName}.اعكس() # @node:${currNode.id}\n`;
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
          code += indent + `${getControlValue('func_name')}(${args.join(', ')}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');

        } else if (type === 'كائنات/تعيين_خاصية') {
          let prop = getControlValue('prop_name');
          let val = resolveInput(currNode.id, 'val_in') ?? 'عدم';
          code += indent + `هذا.${prop} = ${val} # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'كائنات/استدعاء طريقة') {
          let obj = resolveInput(currNode.id, 'obj_in') ?? 'كائن';
          let method = getControlValue('method_name') || 'تشغيل';
          const methodArgs = resolveCallArgsExcept(currNode, ['obj_in']);
          code += indent + `${obj}.${method}(${methodArgs.join(', ')}) # @node:${currNode.id}\n`;
          currNodeId = getNextNodeId(currNode.id, 'seq_out');

        } else if (type === 'استيراد/مكتبة') {
          let lib = getControlValue('lib') || 'الوقت';
          code += indent + `استورد ${lib} # @node:${currNode.id}\n`;
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
        } else if (type === 'شروط/اذا') {
          let cond = resolveInput(currNode.id, 'cond_in') ?? 'خطأ';
          code += indent + `اذا ${cond}:\n`;
          let trueNodeId = getNextNodeId(currNode.id, 'true_out');
          if (trueNodeId) code += walkExecution(trueNodeId, indent + '\t', new Set(pathVisited));
          else code += indent + '\tتجاوز\n';
          
          let falseNodeId = getNextNodeId(currNode.id, 'false_out');
          if (falseNodeId) {
            code += indent + `والا:\n`;
            code += walkExecution(falseNodeId, indent + '\t', new Set(pathVisited));
          }
          // Continuation after the branch (new seq_out); old graphs without it simply end here
          currNodeId = getNextNodeId(currNode.id, 'seq_out');
        } else if (type === 'حلقات/لكل') {
          let startVal = resolveInput(currNode.id, 'start_in') ?? 1;
          let endVal = resolveInput(currNode.id, 'end_in') ?? 10;
          let varName = getControlValue('var_name') || 'س';
          code += indent + `لكل ${varName} في مدى(${startVal}, ${endVal}):\n`;
          
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
            code += indent + `خلل:\n`;
            code += walkExecution(catchNodeId, indent + '\t', new Set(pathVisited));
          }
          
          let finallyNodeId = getNextNodeId(currNode.id, 'finally_out');
          if (finallyNodeId) {
            code += indent + `وإلا:\n`;
            code += walkExecution(finallyNodeId, indent + '\t', new Set(pathVisited));
          }
          code += indent + `نهاية:\n`;
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
        } else if (type === 'أوامر/بداية البرنامج' || type === 'دوال/تعريف دالة' || type === 'ماكرو/مدخلات') {
          currNodeId = getNextNodeId(currNode.id, 'seq_out') || getNextNodeId(currNode.id, 'body_out');
        } else {
          break;
        }
      }
      return code;
    }
  
    let localCode = '';
    
    // Support definition functions inside the graph
    const funcNodes = nodes.filter(n => (n.data as any).originalType === 'دوال/تعريف دالة');
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
  
  // Auto-import modules if specific nodes are used anywhere (main or macros)
  const allNodes = [
    ...mainNodes,
    ...(macros ? Object.values(macros).flatMap(m => m.nodes) : [])
  ];

  const usesTime = allNodes.some(n => (n.data as any).originalType === 'وقت/انتظر' || (n.data as any).originalType === 'وقت/الآن' || (n.data as any).originalType === 'وقت/منسق');
  if (usesTime) {
    finalCode += 'استورد الوقت\n\n';
  }
  
  // Pre-compile macros as functions
  if (macros) {
    Object.entries(macros).forEach(([id, macro]) => {
      // Use macro ID to generate a 100% Arabic-compliant safe identifier
      const safeName = id.replace('macro_', 'م_');
      finalCode += compileContext(macro.nodes, macro.edges, true, safeName);
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
