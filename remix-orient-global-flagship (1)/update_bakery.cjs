const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(/grid-cols-1 gap-8/g, 'grid-cols-1 gap-2 md:gap-8');

fs.writeFileSync('App.tsx', content);
console.log('Done');
