const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(/mb-6 md:mb-12/g, 'mb-2 md:mb-12');
content = content.replace(/mb-2 md:mb-4/g, 'mb-1 md:mb-4');

fs.writeFileSync('App.tsx', content);
console.log('Done');
