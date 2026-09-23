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
      // Scrolled past hero - solid opaque theme adapting
      return 'bg-card border-b border-transparent shadow-sm';
    }
    // Hero state: blurred and transparent
    return 'bg-card/10 backdrop-blur-[10px] border-b border-transparent';
  }

  // All other pages on desktop
  if (!scrolled) {
    return 'bg-card/10 backdrop-blur-[10px] border-b border-transparent';
  }
  return 'bg-card border-b border-transparent shadow-sm';
};`;

const megaMenuStyleRegex = /const getMegaMenuBackgroundStyle = \(\) => \{[\s\S]*?\};/;
const newMegaMenuStyle = `const getMegaMenuBackgroundStyle = () => {
  if (pageType === 'games') {
    return 'backdrop-blur-[40px] bg-black/40';
  }
  
  // Always use the blurred transparent background for dropdowns as requested
  return 'bg-card/10 backdrop-blur-[10px] shadow-2xl';
};`;

c = c.replace(navStyleRegex, newNavStyle);
c = c.replace(megaMenuStyleRegex, newMegaMenuStyle);

fs.writeFileSync('App.tsx', c);
