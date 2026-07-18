const fs = require('fs');

let content = fs.readFileSync('app/lib/AlifGenerator.ts', 'utf8');

content = content.replace(/code \+= indent \+ \`([^\n`]*?)\\n\`/g, (match, p1) => {
    if (p1.trim() === '' || p1.trim().startsWith('#')) return match;
    // Don't append if it ends with colon (block start)
    if (p1.trim().endsWith(':')) return match;
    // Don't append if it already has @node
    if (p1.includes('@node:')) return match;
    return `code += indent + \`${p1} # @node:\${currNode.id}\\n\``;
});

// We also need to handle cases like: code += indent + varName + ` = ` + val + `\n`;
// Let's just do a manual replace for the most common ones.
content = content.replace(/code \+= indent \+ (.*?) \+ \`\\n\`/g, (match, p1) => {
    if (p1.includes('@node')) return match;
    return `code += indent + ${p1} + \` # @node:\${currNode.id}\\n\``;
});

fs.writeFileSync('app/lib/AlifGenerator.ts', content);
console.log('Done');
