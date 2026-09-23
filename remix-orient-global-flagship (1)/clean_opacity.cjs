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
      if (!fullPath.includes('node_modules')) {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
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
  
  // Find " /10" or " /40" and remove it if it stands alone
  content = content.replace(/ \/[0-9]{1,2}(?=[ "'`]|$)/g, '');
  content = content.replace(/hover: /g, ''); // "hover: " 

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned ${file}`);
  }
});
