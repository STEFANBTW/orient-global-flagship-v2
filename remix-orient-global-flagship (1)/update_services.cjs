const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(/mb-4 sm:mb-8/g, 'mb-1 sm:mb-8');
content = content.replace(/gap-2 sm:gap-4/g, 'gap-1 sm:gap-4');

fs.writeFileSync('App.tsx', content);
console.log('Done');
