const fs = require('fs');
const path = require('path');

const dir = 'src';

function updateNav(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace animate={{ y: navHidden ? -100 : 0 }} with animate={{ y: (isMobile || !navHidden) ? 0 : -100 }}
  content = content.replace(/animate=\{\{ y: navHidden \? -100 : 0 \}\}/g, 'animate={{ y: (isMobile || !navHidden) ? 0 : -100 }}');
  
  // Replace className="sticky w-full z-40 top-12 sm:top-14 ... " with className={`sticky w-full z-40 ${isMobile ? 'top-0' : 'top-12 sm:top-14'} ... `}
  content = content.replace(/className="sticky w-full z-40 top-12 sm:top-14 (.*?)"/g, 'className={`sticky w-full z-40 ${isMobile ? \'top-0\' : \'top-12 sm:top-14\'} $1`}');
  
  fs.writeFileSync(filePath, content);
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      updateNav(fullPath);
    }
  }
}

walk(dir);
