const fs = require('fs');
let c = fs.readFileSync('src/dining/components/UnifiedCheckout.tsx', 'utf8');

const regex = /<div className="flex items-center gap-1\.5">\s*<span className="w-3\.5 h-3\.5 rounded-full bg-background border border-border"><\/span>\s*<span className="text-muted-foreground">Available<\/span>\s*<\/div>\s*<div className="flex items-center gap-1\.5">\s*<span className="w-3\.5 h-3\.5 rounded-full bg-primary\/30 border-2 border-primary"><\/span>\s*<span className="text-foreground font-bold">Selected<\/span>\s*<\/div>\s*<div className="flex items-center gap-1\.5">\s*<span className="w-3\.5 h-3\.5 rounded-full bg-background border border-red-500\/40"><\/span>\s*<span className="text-muted-foreground">Has Bookings<\/span>\s*<\/div>/g;

const replacement = `<div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-card border-2 border-border shadow-sm"></div>
                          <span className="text-muted-foreground font-medium">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary shadow-sm"></div>
                          <span className="text-foreground font-bold">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 border-2 border-red-500 shadow-sm"></div>
                          <span className="text-muted-foreground font-medium">Has Bookings</span>
                        </div>`;

c = c.replace(regex, replacement);
fs.writeFileSync('src/dining/components/UnifiedCheckout.tsx', c);
console.log('Fixed legend icons');
