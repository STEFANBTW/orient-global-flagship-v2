const fs = require('fs');
const glob = require('glob');

const files = fs.readdirSync('src').filter(f => f.startsWith('Bakery') && f.endsWith('.tsx')).map(f => 'src/' + f);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-background-dark/g, 'bg-orange-950');
  content = content.replace(/bg-background-light/g, 'bg-orange-50');
  content = content.replace(/bg-slate-50/g, 'bg-orange-50');
  content = content.replace(/bg-stone-900/g, 'bg-orange-950');
  content = content.replace(/bg-stone-800/g, 'bg-orange-900');
  content = content.replace(/bg-stone-100/g, 'bg-orange-100');
  content = content.replace(/bg-stone-50/g, 'bg-orange-50');
  content = content.replace(/bg-\[#2c1f17\]/g, 'bg-orange-950');
  content = content.replace(/bg-\[#3a2a20\]/g, 'bg-orange-900');
  fs.writeFileSync(file, content);
});
console.log('Bakery replaced');
