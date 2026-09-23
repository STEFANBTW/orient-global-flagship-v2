const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(/grid-cols-2 gap-4/g, 'grid-cols-2 gap-1 md:gap-4');

fs.writeFileSync('App.tsx', content);
console.log('Done');
