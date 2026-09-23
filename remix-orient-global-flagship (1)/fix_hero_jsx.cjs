const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// Fix the extra closing motion.div and ensure proper structure
content = content.replace(/<\/motion\.div>\s*<\/motion\.div>\s*\n\s*\n\s*<div className="content-container/, '</motion.div>\n\n  <div className="content-container');

fs.writeFileSync('App.tsx', content);
console.log('Hero JSX fix applied.');
