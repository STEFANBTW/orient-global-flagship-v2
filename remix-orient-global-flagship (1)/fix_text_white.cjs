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

  // Find occurrences of text-background and if they are on an element that has bg-primary, or bg-orange, etc, or if the text-background is inside a string with those classes.
  // Actually, a simpler regex: replace `text-background` with `text-white` when immediately preceded or followed closely by bg-primary, etc.
  // But even simpler: if a class string contains `bg-primary` and `text-background`, replace `text-background` with `text-white` in that string.
  
  // Replace text-background to text-white in any className attribute that does NOT also have bg-foreground or background-related adapting classes.
  // Actually, let's just do a blanket regex:
  // /bg-(primary|blue-\d+|orange-\d+|red-\d+|green-\d+|emerald-\d+|purple-\d+|yellow-\d+)(?:\/[0-9]+)?(.*?)text-background/g
  
  content = content.replace(/(bg-(?:primary|blue|orange|red|green|emerald|purple|yellow|olive)(?:-\d+)?(?:\[[^\]]+\])?(?:\/[0-9]+)?(?:[a-zA-Z0-9\-\s:]+))text-background/g, '$1text-white');
  content = content.replace(/text-background((?:[a-zA-Z0-9\-\s:]+)bg-(?:primary|blue|orange|red|green|emerald|purple|yellow|olive)(?:-\d+)?(?:\[[^\]]+\])?(?:\/[0-9]+)?)/g, 'text-white$1');

  // Let's do it multiple times to catch all
  for(let i=0; i<3; i++) {
    content = content.replace(/(bg-(?:primary|blue|orange|red|green|emerald|purple|yellow|olive)(?:-\d+)?(?:\[[^\]]+\])?(?:\/[0-9]+)?(?:[a-zA-Z0-9\-\s:']+|[\n\r]+)*?)text-background\b/g, '$1text-white');
    content = content.replace(/\btext-background((?:[a-zA-Z0-9\-\s:']+|[\n\r]+)*?bg-(?:primary|blue|orange|red|green|emerald|purple|yellow|olive)(?:-\d+)?(?:\[[^\]]+\])?(?:\/[0-9]+)?)/g, 'text-white$1');
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
