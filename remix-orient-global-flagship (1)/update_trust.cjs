const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(/mb-6 lg:mb-12/g, 'mb-2 lg:mb-12');
content = content.replace(/mb-2 lg:mb-6/g, 'mb-1 lg:mb-6');

fs.writeFileSync('App.tsx', content);
console.log('Done');
