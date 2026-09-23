const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

// Add currentView to Navbar calls
content = content.replace(/<Navbar theme=\{globalTheme\} toggleTheme=\{toggleGlobalTheme\} setCurrentView=\{setCurrentView\} scrolled=\{scrolled\} navHidden=\{navHidden\} isSubpage \/>/g, 
  '<Navbar theme={globalTheme} toggleTheme={toggleGlobalTheme} currentView={currentView} setCurrentView={setCurrentView} scrolled={scrolled} navHidden={navHidden} isSubpage />');

// Update padding for subpages
content = content.replace(/<div className="pt-12 sm:pt-14">/g, '<div className="pt-0 sm:pt-14 pb-20 sm:pb-0">');

fs.writeFileSync('App.tsx', content);
