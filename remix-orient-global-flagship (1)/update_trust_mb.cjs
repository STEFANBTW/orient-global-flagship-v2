const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(/mb-3 tracking-tight/g, 'mb-1 md:mb-3 tracking-tight');

fs.writeFileSync('App.tsx', content);
console.log('Done');
