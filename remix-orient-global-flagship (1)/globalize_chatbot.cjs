const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// Remove current ChatBot call(s)
content = content.replace(/<ChatBot \/>/g, '');

// Place it before the final concluding tags of the App component
// We want it just before the closing ThemeProvider or the last div
content = content.replace('      </ScrollContext.Provider>', '      </ScrollContext.Provider>\n      <ChatBot />');

fs.writeFileSync('App.tsx', content);
console.log('ChatBot is now global.');
