const fs = require('fs');

const path = 'src/dining/components/ReservationsScreen.tsx';
let c = fs.readFileSync(path, 'utf8');

const regex = /\{\/\* AI Assistant: The Concierge \*\/\}[\s\S]*?<span className="material-icons text-foreground text-3xl font-bold">theater_comedy<\/span>\n\s*<\/button>\n\s*<\/div>/m;
c = c.replace(regex, '');

fs.writeFileSync(path, c, 'utf8');
console.log('Removed Concierge button');
