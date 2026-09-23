const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    let fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('./src');
files.push('./App.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Find className="..." strings and string literals
  content = content.replace(/(?:className=|className \+= )[`"']([^`"']+)[`"']/g, (match, classStr) => {
    let classes = classStr.split(/\s+/);
    
    // Check if the element has bg-foreground or similar adapting background.
    const hasSolidAdaptingBg = classes.some(c => c === 'bg-foreground' || c === 'bg-background' || c === 'bg-card' || c === 'bg-surface-foreground');
    const hasColorBg = classes.some(c => c.startsWith('bg-primary') || /bg-(blue|orange|red|green|emerald|purple|yellow|olive)-\d+/.test(c) || c.startsWith('bg-[#'));

    if (hasColorBg && !hasSolidAdaptingBg) {
      classes = classes.map(c => {
        if (c.includes('text-background')) {
          return c.replace('text-background', 'text-white');
        }
        return c;
      });
    }

    // Replace the matched classes back
    return match.replace(classStr, classes.join(' '));
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
