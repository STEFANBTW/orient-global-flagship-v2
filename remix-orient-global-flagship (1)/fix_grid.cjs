const fs = require('fs');
let c = fs.readFileSync('src/dining/components/UnifiedCheckout.tsx', 'utf8');
c = c.replace('className="grid grid-cols-1 sm:grid-cols-2 gap-3"', 'className={`grid grid-cols-1 gap-3 ${source === \\'reservation\\' ? \\'\\' : \\'sm:grid-cols-2\\'}`}');
fs.writeFileSync('src/dining/components/UnifiedCheckout.tsx', c);
console.log('Fixed grid cols');
