const fs = require('fs');

// 1. Update Navigation and Dropdown Logic in App.tsx
let appContent = fs.readFileSync('App.tsx', 'utf8');

const navStyleTarget = /const getNavBackgroundStyle = \(\) => \{[\s\S]*?return 'bg-card border-b border-transparent shadow-sm';\n\s*?\};/;
const navStyleReplacement = `const getNavBackgroundStyle = () => {
  if (isMobile) {
    if (scrolled) return 'bg-white dark:bg-black border-b border-white/10 shadow-md';
    return 'bg-transparent border-transparent';
  }
  
  if (scrolled) {
    // State C: Completely opaque when scrolled
    return 'bg-white dark:bg-black border-b border-transparent shadow-sm';
  }

  // State A: Homepage at Scroll Zero
  if (isHomepage) {
    if (activeTab) {
      // 72% transparent + dense blur on hover
      return 'bg-white/72 dark:bg-black/72 backdrop-blur-[80px] border-b border-white/10';
    }
    // Fully transparent default
    return 'bg-transparent border-transparent';
  }

  // State B: Subpages at top
  // 72% transparent + dense blur
  return 'bg-white/72 dark:bg-black/72 backdrop-blur-[80px] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]';
};`;

const megaMenuStyleTarget = /const getMegaMenuBackgroundStyle = \(\) => \{[\s\S]*?return 'bg-card\/10 backdrop-blur-\[10px\] shadow-2xl';\n\s*?\};/;
const megaMenuStyleReplacement = `const getMegaMenuBackgroundStyle = () => {
  if (pageType === 'games') {
    return 'backdrop-blur-[40px] bg-black/40';
  }
  
  if (scrolled) {
    // Completely opaque when scrolled
    return 'bg-white dark:bg-black shadow-2xl';
  }
  
  // 72% transparent + dense blur
  return 'bg-white/72 dark:bg-black/72 backdrop-blur-[80px] shadow-2xl';
};`;

appContent = appContent.replace(navStyleTarget, navStyleReplacement);
appContent = appContent.replace(megaMenuStyleTarget, megaMenuStyleReplacement);

fs.writeFileSync('App.tsx', appContent);
console.log('App.tsx navigation styles updated.');

// 2. Remove Redundant Chat from Market Home.tsx
let marketHomeContent = fs.readFileSync('src/supermarket/pages/Home.tsx', 'utf8');

// Remove Chat related states
marketHomeContent = marketHomeContent.replace(/const \[isChatOpen, setIsChatOpen\] = useState\(false\);/g, '');
marketHomeContent = marketHomeContent.replace(/const \[chatMessage, setChatMessage\] = useState\(''\);/g, '');
marketHomeContent = marketHomeContent.replace(/const \[chatHistory, setChatHistory\] = useState<\{sender: 'user' \| 'bot', text: string\}\[\]>\(\[\n\s*?\{sender: 'bot', text: "Hi! I noticed you're buying pasta\. Need tomato sauce\?"\}\n\s*?\]\);/g, '');
marketHomeContent = marketHomeContent.replace(/const handleSendChat = \(e: React\.FormEvent\) => \{[\s\S]*?\}\);[\s\S]*?\};/g, '');

// Remove Chat UI Section
const chatUiTarget = /\{[\s\S]*?Floating AI Chat Assistant[\s\S]*?animate=\{\{ y: \[0, -5, 0\] \}\}[\s\S]*?<\/motion\.button>[\s\S]*?<\/motion\.div>[\s\S]*?\}/;
marketHomeContent = marketHomeContent.replace(chatUiTarget, '');

fs.writeFileSync('src/supermarket/pages/Home.tsx', marketHomeContent);
console.log('Market Home.tsx redundant chat removed.');
