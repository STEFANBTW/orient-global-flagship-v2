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
  
  // Border colors
  content = content.replace(/border-white\/5/g, 'border-border');
  content = content.replace(/border-white\/10/g, 'border-border');
  content = content.replace(/border-white\/20/g, 'border-border');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated borders in ${file}`);
  }
});
