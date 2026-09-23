const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = [
  ...walk('./src/app/dashboard'),
  ...walk('./src/components/dashboard'),
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Text colors
  content = content.replace(/text-slate-900/g, 'text-foreground');
  content = content.replace(/text-slate-800/g, 'text-foreground/90');
  content = content.replace(/text-slate-700/g, 'text-foreground/80');
  content = content.replace(/text-slate-600/g, 'text-muted-foreground');
  content = content.replace(/text-slate-500/g, 'text-muted-foreground');
  content = content.replace(/text-slate-400/g, 'text-muted-foreground/70');
  content = content.replace(/text-slate-300/g, 'text-muted-foreground/50');
  content = content.replace(/text-slate-200/g, 'text-muted-foreground/30');
  content = content.replace(/text-slate-100/g, 'text-muted-foreground/20');
  content = content.replace(/text-slate-50/g, 'text-muted-foreground/10');
  
  // Background colors
  content = content.replace(/bg-slate-950/g, 'bg-background');
  content = content.replace(/bg-slate-900/g, 'bg-card');
  content = content.replace(/bg-slate-800/g, 'bg-secondary');
  content = content.replace(/bg-slate-700/g, 'bg-muted');
  content = content.replace(/bg-slate-100/g, 'bg-secondary');
  content = content.replace(/bg-slate-50/g, 'bg-muted/50');
  
  // Border colors
  content = content.replace(/border-slate-950/g, 'border-border');
  content = content.replace(/border-slate-900/g, 'border-border');
  content = content.replace(/border-slate-800/g, 'border-border');
  content = content.replace(/border-slate-700/g, 'border-border');
  content = content.replace(/border-slate-400/g, 'border-primary/40');
  content = content.replace(/border-slate-300/g, 'border-primary/30');
  content = content.replace(/border-slate-200/g, 'border-border');
  content = content.replace(/border-slate-100/g, 'border-border');
  content = content.replace(/border-slate-50/g, 'border-border');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
