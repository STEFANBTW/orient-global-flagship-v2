const fs = require('fs');
const path = require('path');

const scale = 1.44;

const sizes = {
  'text-xs': 'text-sm', // xs -> sm is 12px to 14px (not quite 1.44x but close)
  // Actually, wait. 12px * 1.44 = 17px (text-base or text-lg).
  // This is too much manual mapping.
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // 1. Scale arbitrary pixel values: text-[10px], text-[11.5px]
  content = content.replace(/text-\[([0-9.]+)px\]/g, (match, val) => {
    const num = parseFloat(val);
    const scaled = Math.round(num * scale);
    return `text-[${scaled}px]`;
  });

  // 2. Scale standard Tailwind classes.
  // This is tricky because we don't want to replace "text-xs" inside a variable name.
  // We look for boundaries.
  const map = {
    'text-xs': 'text-base', // 12 -> 16 (approx 1.4x)
    'text-sm': 'text-lg', // 14 -> 18 (approx 1.3x)
    'text-base': 'text-xl', // 16 -> 20 (approx 1.3x)
    'text-lg': 'text-2xl', // 18 -> 24 (approx 1.33x)
    'text-xl': 'text-3xl', // 20 -> 30 (approx 1.5x)
    'text-2xl': 'text-4xl', // 24 -> 36 (1.5x)
    'text-3xl': 'text-5xl', // 30 -> 48 (1.6x)
  };

  for (const [key, val] of Object.entries(map)) {
    // Replace if preceded by quote, space, or backtick, and followed by quote, space, or backtick.
    const regex = new RegExp(`(?<=[\\s"'\\\`])${key}(?=[\\s"'\\\`])`, 'g');
    content = content.replace(regex, val);
  }

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
console.log("Done.");
