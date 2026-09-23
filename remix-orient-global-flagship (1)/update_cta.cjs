const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(/mb-12 group/g, 'mb-4 md:mb-12 group');
content = content.replace(/mb-6 leading-\[0.8\]/g, 'mb-2 md:mb-6 leading-[0.8]');

fs.writeFileSync('App.tsx', content);
console.log('Done');
