const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace(/border-border/g, 'border-transparent');
fs.writeFileSync('App.tsx', content);
console.log('Replaced border-border with border-transparent in App.tsx');
