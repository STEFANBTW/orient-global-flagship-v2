const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(/grid-cols-1 lg:grid-cols-2 gap-16/g, 'grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-16');
content = content.replace(/flex-col md:flex-row items-center gap-16/g, 'flex-col md:flex-row items-center gap-5 md:gap-16');

fs.writeFileSync('App.tsx', content);
console.log('Done');
