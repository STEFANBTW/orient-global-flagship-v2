const fs = require('fs');
let c = fs.readFileSync('App.tsx', 'utf8');

c = c.replace(/\$\{theme === 'dark' \? 'text-background' : 'text-primary'\}/g, 'text-primary');
c = c.replace(/\$\{theme === 'dark' \? 'text-background\/90' : 'text-foreground hover:text-primary'\}/g, 'text-foreground hover:text-primary');
c = c.replace(/\$\{theme === 'dark' \? 'text-background' : 'text-foreground group-hover:text-primary'\}/g, 'text-foreground group-hover:text-primary');
c = c.replace(/\$\{theme === 'dark' \? 'text-background' : 'text-foreground'\}/g, 'text-foreground');
c = c.replace(/\$\{theme === 'dark' \? 'text-muted-foreground' : 'text-muted-foreground'\}/g, 'text-muted-foreground');

fs.writeFileSync('App.tsx', c);
