const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// Add Hero Overlay
const heroPattern = /loading="eager"\s*\/>/;
content = content.replace(heroPattern, 'loading="eager"\n  />\n  {theme === "light" && <div className="absolute inset-0 bg-white/20 z-[1] pointer-events-none" />}');

fs.writeFileSync('App.tsx', content);
console.log('Hero overlay applied via script.');
