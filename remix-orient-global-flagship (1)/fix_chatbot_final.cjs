const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace('</ScrollContext.Provider>', '</ScrollContext.Provider>\n <ChatBot />');
fs.writeFileSync('App.tsx', content);
console.log('Global ChatBot applied.');
