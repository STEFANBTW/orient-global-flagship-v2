const fs = require('fs');
let c = fs.readFileSync('App.tsx', 'utf8');

const navStyleRegex = /const getNavBackgroundStyle = \(\) => \{[\s\S]*?\};/;
const newNavStyle = `const getNavBackgroundStyle = () => {
  if (isMobile) {
    if (isHomepage && isOnHero) return '';
    return 'bg-card/30 backdrop-blur-[16px] border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]';
  }
  
  if (isHomepage) {
    if (!isOnHero) {
      return 'bg-card border-b border-transparent shadow-sm';
    }
    // At scroll zero on Home: 
    // Transparent by default, blurred only when hovering a link
    if (activeTab) {
      return 'bg-card/10 backdrop-blur-[10px] border-b border-transparent';
    }
    return 'bg-transparent border-b border-transparent';
  }

  // All other pages on desktop
  if (!scrolled) {
    // For other pages, we can keep it blurred at zero for aesthetics,
    // or mirror the home behavior if that was the intent.
    // Given the user specifically called out the "Homepage", I'll apply it there.
    // However, consistency often looks better, so I will mirror it: 
    // Top of page is clean (transparent) unless interacting.
    if (activeTab) {
      return 'bg-card/10 backdrop-blur-[10px] border-b border-transparent';
    }
    return 'bg-transparent border-b border-transparent';
  }
  return 'bg-card border-b border-transparent shadow-sm';
};`;

c = c.replace(navStyleRegex, newNavStyle);

fs.writeFileSync('App.tsx', c);
