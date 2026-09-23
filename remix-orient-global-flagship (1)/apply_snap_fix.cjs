const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// 2. Replace section heights with h-screen snap-start ONLY on <section> and <footer>
const heightsToReplace = [
  'h-\\[110vh\\]', 'h-\\[65vh\\]', 'h-\\[75vh\\]', 'min-h-\\[65vh\\]', 'min-h-\\[50vh\\]', 'h-\\[50vh\\]'
];

heightsToReplace.forEach(h => {
  // We want to match `className="... h-[65vh] ..."`
  // The height class could be at the start, middle, or end of the className string.
  // We can just match the class name globally within the file, but we only want to do it for <section> and <footer>.
  
  const tagRegex = /(<(?:section|footer)[^>]*className=")([^"]*)(")/g;
  content = content.replace(tagRegex, (match, p1, p2, p3) => {
    // p2 is the class list
    let classes = p2.split(/\s+/);
    let modified = false;
    
    // Check if any of the heights to replace are in the class list
    const unescapedH = h.replace(/\\\[/g, '[').replace(/\\\]/g, ']');
    if (classes.includes(unescapedH)) {
      classes = classes.filter(c => c !== unescapedH);
      classes.push('h-screen', 'snap-start');
      modified = true;
    }
    
    if (modified) {
      return p1 + classes.join(' ') + p3;
    }
    return match;
  });
});

fs.writeFileSync('App.tsx', content);
console.log("Applied snap scrolling classes correctly.");
