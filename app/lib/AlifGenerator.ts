import { Node, Edge } from '@xyflow/react';
import { NodeData } from '../components/DynamicNode';

export function generateAlifCodeFromGraph(nodes: Node[], edges: Edge[]): string {
  let visitedNodes = new Set<string>();
  
  function getNextNodeId(nodeId: string, sourceHandle: string): string | null {
    const edge = edges.find((e) => e.source === nodeId && e.sourceHandle === sourceHandle);
    return edge ? edge.target : null;
  }

  function resolveInput(nodeId: string, targetHandle: string): any {
    const edge = edges.find((e) => e.target === nodeId && e.targetHandle === targetHandle);
    if (edge) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode) {
        return resolveValue(sourceNode);
      }
    }
    return null;
  }

  function resolveValue(node: Node): any {
    if (!node) return 'عدم';
    const type = (node.data as any).originalType;
    const controls = (node.data as NodeData).controls || [];
    
    const getControlValue = (id: string) => controls.find((c) => c.id === id)?.value;

    if (type === 'بيانات/نص') return `"${getControlValue('value')}"`;
    if (type === 'بيانات/رقم') {
      let val = Number(getControlValue('value'));
      if (!Number.isInteger(val)) val = parseFloat(val.toFixed(4));
      return val;
    }
    if (type === 'بيانات/منطق') return getControlValue('value');
    if (type === 'بيانات/إدخال مستخدم') return `ادخل("${getControlValue('prompt')}")`;
    if (type === 'متغيرات/قراءة') return getControlValue('var_name');
    if (type === 'بيانات/طول') {
      let val = resolveInput(node.id, 'val_in') || '""';
      return `طول(${val})`;
    }
    if (type === 'بيانات/تحويل لنص') {
      let val = resolveInput(node.id, 'val_in') || 'عدم';
      return `نص(${val})`;
    }
    if (type === 'بيانات/تحويل لرقم') {
      let val = resolveInput(node.id, 'val_in') || 'عدم';
      return `رقم(${val})`;
    }
    if (type === 'بيانات/نوع') {
      let val = resolveInput(node.id, 'val_in') || 'عدم';
      return `نوع(${val})`;
    }
    if (type === 'بيانات/عشوائي') {
      let a = resolveInput(node.id, 'min_in') || 1;
      let b = resolveInput(node.id, 'max_in') || 100;
      return `عشوائي(${a}, ${b})`;
    }
    if (type === 'بيانات/تقريب') {
      let val = resolveInput(node.id, 'val_in') || 0;
      return `قرب(${val})`;
    }
    if (type === 'دوال/استدعاء') {
      let arg = resolveInput(node.id, 'arg_in') || 'عدم';
      return `${getControlValue('func_name')}(${arg})`;
    }
    if (type === 'شروط/ليس') {
      let val = resolveInput(node.id, 'val_in') || 'خطأ';
      return `(ليس ${val})`;
    }
    if (type === 'بيانات/حساب' || type === 'شروط/مقارنة' || type === 'شروط/عملية منطقية') {
      let a = resolveInput(node.id, 'a_in') || 0;
      let b = resolveInput(node.id, 'b_in') || 0;
      return `(${a} ${getControlValue('op')} ${b})`;
    }
    if (type === 'بيانات/دمج نصوص') {
      let a = resolveInput(node.id, 'a_in') || '""';
      let b = resolveInput(node.id, 'b_in') || '""';
      return `(${a} + ${b})`;
    }
    if (type === 'مصفوفات/جديدة') return `[]`;
    if (type === 'مصفوفات/قراءة') {
      let arrName = resolveInput(node.id, 'arr_in') || 'مصفوفة';
      let idx = resolveInput(node.id, 'idx_in') || 0;
      return `${arrName}[${idx}]`;
    }
    if (type === 'نصوص/قص') {
      let str = resolveInput(node.id, 'str_in') || '""';
      let start = resolveInput(node.id, 'start_in') || 0;
      let end = resolveInput(node.id, 'end_in') || 0;
      return `${str}[${start}:${end}]`;
    }
    if (type === 'نصوص/استبدال') {
      let str = resolveInput(node.id, 'str_in') || '""';
      let oldStr = resolveInput(node.id, 'old_in') || '""';
      let newStr = resolveInput(node.id, 'new_in') || '""';
      return `${str}.استبدل(${oldStr}, ${newStr})`;
    }
    if (type === 'فهارس/جديد') return `{}`;
    if (type === 'فهارس/قراءة') {
      let dictName = resolveInput(node.id, 'dict_in') || 'فهرس';
      let key = resolveInput(node.id, 'key_in') || '""';
      return `${dictName}[${key}]`;
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
      visitedNodes.add(currNodeId); // Still keep global for the "unconnected nodes" warning
      const currNode = nodes.find((n) => n.id === currNodeId);
      if (!currNode) break;

      const type = (currNode.data as any).originalType;
      const controls = (currNode.data as NodeData).controls || [];
      const getControlValue = (id: string) => controls.find((c) => c.id === id)?.value;

      if (type === 'أوامر/اطبع') {
        let printVal = resolveInput(currNode.id, 'val_in') || '""';
        code += indent + `اطبع(${printVal})\n`;
        currNodeId = getNextNodeId(currNode.id, 'seq_out');
      } else if (type === 'متغيرات/إسناد') {
        let varName = getControlValue('var_name');
        let val = resolveInput(currNode.id, 'val_in') || 'عدم';
        code += indent + `${varName} = ${val}\n`;
        currNodeId = getNextNodeId(currNode.id, 'seq_out');
      } else if (type === 'مصفوفات/إضافة') {
        let arrName = resolveInput(currNode.id, 'arr_in') || 'مصفوفة';
        let val = resolveInput(currNode.id, 'val_in') || 'عدم';
        code += indent + `${arrName}.اضف(${val})\n`;
        currNodeId = getNextNodeId(currNode.id, 'seq_out');
      } else if (type === 'مصفوفات/حذف') {
        let arrName = resolveInput(currNode.id, 'arr_in') || 'مصفوفة';
        let val = resolveInput(currNode.id, 'val_in') || 'عدم';
        code += indent + `${arrName}.امسح(${val})\n`;
        currNodeId = getNextNodeId(currNode.id, 'seq_out');
      } else if (type === 'مصفوفات/ترتيب') {
        let arrName = resolveInput(currNode.id, 'arr_in') || 'مصفوفة';
        code += indent + `${arrName}.رتب()\n`;
        currNodeId = getNextNodeId(currNode.id, 'seq_out');
      } else if (type === 'فهارس/إضافة') {
        let dictName = resolveInput(currNode.id, 'dict_in') || 'فهرس';
        let key = resolveInput(currNode.id, 'key_in') || '""';
        let val = resolveInput(currNode.id, 'val_in') || 'عدم';
        code += indent + `${dictName}[${key}] = ${val}\n`;
        currNodeId = getNextNodeId(currNode.id, 'seq_out');
      } else if (type === 'دوال/استدعاء') {
        let arg = resolveInput(currNode.id, 'arg_in') || 'عدم';
        code += indent + `${getControlValue('func_name')}(${arg})\n`;
        currNodeId = getNextNodeId(currNode.id, 'seq_out');
      } else if (type === 'دوال/إرجاع') {
        let retVal = resolveInput(currNode.id, 'val_in') || 'عدم';
        code += indent + `ارجع ${retVal}\n`;
        currNodeId = getNextNodeId(currNode.id, 'seq_out');
      } else if (type === 'شروط/اذا') {
        let cond = resolveInput(currNode.id, 'cond_in') || 'خطأ';
        code += indent + `اذا ${cond}:\n`;
        let trueNodeId = getNextNodeId(currNode.id, 'true_out');
        if (trueNodeId) code += walkExecution(trueNodeId, indent + '\t', new Set(pathVisited));
        else code += indent + '\tاستمر\n';
        
        let falseNodeId = getNextNodeId(currNode.id, 'false_out');
        if (falseNodeId) {
          code += indent + `والا:\n`;
          code += walkExecution(falseNodeId, indent + '\t', new Set(pathVisited));
        }
        break; // Branches are fully evaluated recursively
      } else if (type === 'حلقات/لكل') {
        let startVal = resolveInput(currNode.id, 'start_in') || 1;
        let endVal = resolveInput(currNode.id, 'end_in') || 10;
        let varName = getControlValue('var_name') || 'س';
        code += indent + `لكل ${varName} في مدى(${startVal}, ${endVal}):\n`;
        
        let bodyNodeId = getNextNodeId(currNode.id, 'body_out');
        if (bodyNodeId) code += walkExecution(bodyNodeId, indent + '\t', new Set(pathVisited));
        else code += indent + '\tاستمر\n';
        
        currNodeId = getNextNodeId(currNode.id, 'done_out');
      } else if (type === 'حلقات/بينما') {
        let cond = resolveInput(currNode.id, 'cond_in') || 'خطأ';
        code += indent + `بينما ${cond}:\n`;
        
        let bodyNodeId = getNextNodeId(currNode.id, 'body_out');
        if (bodyNodeId) code += walkExecution(bodyNodeId, indent + '\t', new Set(pathVisited));
        else code += indent + '\tاستمر\n';
        
        currNodeId = getNextNodeId(currNode.id, 'done_out');
      } else if (type === 'حلقات/توقف') {
        code += indent + `توقف\n`;
        break;
      } else if (type === 'أوامر/مسح الشاشة') {
        code += indent + `مسح()\n`;
        currNodeId = getNextNodeId(currNode.id, 'seq_out');
      } else if (type === 'أخطاء/محاولة') {
        code += indent + `حاول:\n`;
        let tryNodeId = getNextNodeId(currNode.id, 'try_out');
        if (tryNodeId) code += walkExecution(tryNodeId, indent + '\t', new Set(pathVisited));
        else code += indent + '\tاستمر\n';
        
        let catchNodeId = getNextNodeId(currNode.id, 'catch_out');
        if (catchNodeId) {
          code += indent + `امسك:\n`;
          code += walkExecution(catchNodeId, indent + '\t', new Set(pathVisited));
        }
        
        let finallyNodeId = getNextNodeId(currNode.id, 'finally_out');
        if (finallyNodeId) {
          code += indent + `اخيرا:\n`;
          code += walkExecution(finallyNodeId, indent + '\t', new Set(pathVisited));
        }
        break;
      } else if (type === 'أوامر/بداية البرنامج' || type === 'دوال/تعريف دالة') {
        currNodeId = getNextNodeId(currNode.id, 'seq_out') || getNextNodeId(currNode.id, 'body_out');
      } else {
        break;
      }
    }
    return code;
  }

  let code = '# تم التوليد برمجياً من المحرر المرئي 🕸️\n\n';
  
  const funcNodes = nodes.filter(n => (n.data as any).originalType === 'دوال/تعريف دالة');
  funcNodes.forEach((node) => {
    const getControlValue = (id: string) => ((node.data as NodeData).controls || []).find((c) => c.id === id)?.value;
    code += `دالة ${getControlValue('func_name')}(${getControlValue('arg')}):\n`;
    let bodyNodeId = getNextNodeId(node.id, 'body_out');
    if (bodyNodeId) code += walkExecution(bodyNodeId, '\t', new Set<string>());
    else code += '\tاستمر\n';
    code += '\n';
  });

  const startNodes = nodes.filter(n => (n.data as any).originalType === 'أوامر/بداية البرنامج');
  if (startNodes.length > 0) {
    code += walkExecution(startNodes[0].id, '', new Set<string>());
  } else if (funcNodes.length === 0) {
    return '# يرجى إضافة وتوصيل عقدة (بداية البرنامج) أو (تعريف دالة)\n';
  }

  // Find all unvisited nodes to inform the user
  const unvisitedNodes = nodes.filter(n => !visitedNodes.has(n.id) && (n.data as any).originalType !== 'أوامر/بداية البرنامج' && (n.data as any).originalType !== 'دوال/تعريف دالة');
  if (unvisitedNodes.length > 0) {
    code += '\n# ⚠️ يوجد عقد غير متصلة بمسار التنفيذ (لن تظهر في الشفرة الحية):\n';
    unvisitedNodes.forEach(n => {
      code += `# - ${(n.data as any).label}\n`;
    });
  }

  return code;
}
