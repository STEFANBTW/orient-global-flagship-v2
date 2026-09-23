const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

// Remove min-h-[75dvh] max-h-[80dvh] h-auto lg:min-h-0 lg:max-h-none lg:h-auto
content = content.replace(/min-h-\[75dvh\] max-h-\[80dvh\] h-auto lg:w-full lg:min-h-0 lg:max-h-none lg:h-auto /g, '');

// Remove flex-1 justify-center from the text/button containers
content = content.replace(/flex-1 justify-center/g, '');

fs.writeFileSync('App.tsx', content);
console.log('Done');
