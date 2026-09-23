const fs = require('fs');
let c = fs.readFileSync('App.tsx', 'utf8');

// Footer Logo Simplification
c = c.replace(/<div className="flex items-center gap-4 mb-6">\s*<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-(?:background|white) font-heading font-black text-xl shadow-xl shadow-primary\/20">O<\/div>\s*<span className="font-heading font-black text-2xl tracking-tight text-(?:foreground|white) uppercase">Orient Global<\/span>\s*<\/div>/g,
  `<div className="flex items-center gap-4 mb-6">
  <span className="font-heading font-black text-3xl tracking-tight text-primary uppercase">Orient</span>
  </div>`);

fs.writeFileSync('App.tsx', c);
