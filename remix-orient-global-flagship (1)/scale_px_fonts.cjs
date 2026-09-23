const fs = require('fs');
const path = require('path');

const scale = 1.2;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // Scale arbitrary pixel values: text-[10px], text-[11.5px]
  content = content.replace(/text-\[([0-9.]+)px\]/g, (match, val) => {
    const num = parseFloat(val);
    const scaled = Math.round(num * scale);
    return `text-[${scaled}px]`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'src', 'app', 'dashboard'));
console.log("Done scaling arbitrary text sizes.");
