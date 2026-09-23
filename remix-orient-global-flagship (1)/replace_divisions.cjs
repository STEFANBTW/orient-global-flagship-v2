const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Supermarket
walkDir('src/supermarket', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-slate-950/g, 'bg-green-950');
    content = content.replace(/bg-slate-900/g, 'bg-green-900');
    content = content.replace(/bg-slate-800/g, 'bg-green-800');
    content = content.replace(/bg-slate-700/g, 'bg-green-700');
    content = content.replace(/bg-\[#f8f7f5\]/g, 'bg-green-50');
    content = content.replace(/bg-gray-50/g, 'bg-green-50');
    content = content.replace(/bg-\[#f8f6f6\]/g, 'bg-green-50');
    content = content.replace(/bg-\[#f6f8f6\]/g, 'bg-green-50');
    content = content.replace(/bg-slate-50/g, 'bg-green-50');
    fs.writeFileSync(filePath, content);
  }
});

// Dining
walkDir('src/dining', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-background-dark/g, 'bg-rose-950');
    content = content.replace(/bg-background-light/g, 'bg-rose-50');
    content = content.replace(/bg-surface-dark/g, 'bg-rose-900');
    fs.writeFileSync(filePath, content);
  }
});

// Games
walkDir('src/games', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-black/g, 'bg-violet-950');
    content = content.replace(/bg-\[#050505\]/g, 'bg-violet-950');
    content = content.replace(/bg-\[#0f0805\]/g, 'bg-violet-950');
    content = content.replace(/bg-\[#221710\]/g, 'bg-violet-900');
    content = content.replace(/bg-gray-900/g, 'bg-violet-900');
    content = content.replace(/bg-gray-800/g, 'bg-violet-800');
    content = content.replace(/bg-gray-50/g, 'bg-violet-50');
    fs.writeFileSync(filePath, content);
  }
});

// Water
walkDir('src/water', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-slate-900/g, 'bg-cyan-900');
    content = content.replace(/bg-slate-950/g, 'bg-cyan-950');
    content = content.replace(/bg-slate-800/g, 'bg-cyan-800');
    content = content.replace(/bg-slate-50/g, 'bg-cyan-50');
    fs.writeFileSync(filePath, content);
  }
});

// Lounge
walkDir('src/lounge', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-background-dark/g, 'bg-amber-950');
    content = content.replace(/bg-background-light/g, 'bg-amber-50');
    content = content.replace(/bg-stone-900/g, 'bg-amber-900');
    content = content.replace(/bg-stone-800/g, 'bg-amber-800');
    content = content.replace(/bg-stone-50/g, 'bg-amber-50');
    fs.writeFileSync(filePath, content);
  }
});

console.log('All divisions replaced');
