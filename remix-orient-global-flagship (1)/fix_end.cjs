const fs = require('fs');
let c = fs.readFileSync('src/dining/components/UnifiedCheckout.tsx', 'utf8');

const idx = c.indexOf('\\n\\n\\n                <div>\\n');
if (idx !== -1) {
  c = c.substring(0, idx);
  fs.writeFileSync('src/dining/components/UnifiedCheckout.tsx', c);
  console.log('Fixed file end');
} else {
  console.log('Not found');
}
