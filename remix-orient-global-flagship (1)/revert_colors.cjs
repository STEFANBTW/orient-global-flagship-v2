const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Bakery
walkDir('src', function(filePath) {
  if (filePath.startsWith('src/Bakery') && (filePath.endsWith('.tsx') || filePath.endsWith('.ts'))) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-orange-950/g, 'bg-background-dark');
    content = content.replace(/bg-orange-900/g, 'bg-stone-900');
    content = content.replace(/bg-orange-100/g, 'bg-stone-100');
    content = content.replace(/bg-orange-50/g, 'bg-slate-50');
    fs.writeFileSync(filePath, content);
  }
});

// Supermarket
walkDir('src/supermarket', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-green-950/g, 'bg-slate-950');
    content = content.replace(/bg-green-900/g, 'bg-slate-900');
    content = content.replace(/bg-green-800/g, 'bg-slate-800');
    content = content.replace(/bg-green-700/g, 'bg-slate-700');
    content = content.replace(/bg-green-50/g, 'bg-slate-50');
    fs.writeFileSync(filePath, content);
  }
});

// Dining
walkDir('src/dining', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-rose-950/g, 'bg-background-dark');
    content = content.replace(/bg-rose-900/g, 'bg-stone-900');
    content = content.replace(/bg-rose-50/g, 'bg-slate-50');
    fs.writeFileSync(filePath, content);
  }
});

// Games
walkDir('src/games', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-violet-950/g, 'bg-[#050505]');
    content = content.replace(/bg-violet-900/g, 'bg-gray-900');
    content = content.replace(/bg-violet-800/g, 'bg-gray-800');
    content = content.replace(/bg-violet-50/g, 'bg-slate-50');
    fs.writeFileSync(filePath, content);
  }
});

// Water
walkDir('src/water', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-cyan-950/g, 'bg-slate-950');
    content = content.replace(/bg-cyan-900/g, 'bg-slate-900');
    content = content.replace(/bg-cyan-800/g, 'bg-slate-800');
    content = content.replace(/bg-cyan-50/g, 'bg-slate-50');
    fs.writeFileSync(filePath, content);
  }
});

// Lounge
walkDir('src/lounge', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/bg-amber-950/g, 'bg-background-dark');
    content = content.replace(/bg-amber-900/g, 'bg-stone-900');
    content = content.replace(/bg-amber-800/g, 'bg-stone-800');
    content = content.replace(/bg-amber-50/g, 'bg-slate-50');
    fs.writeFileSync(filePath, content);
  }
});

console.log('Reverted colors to unified base');
