const fs = require('fs');
let c = fs.readFileSync('App.tsx', 'utf8');

// 1. Splash Screen Logo Simplification
c = c.replace(/<div className="flex flex-col items-center justify-center text-center">\s*<span className="text-foreground font-\['Playfair_Display'\] font-black text-4xl tracking-\[0\.2em\] uppercase leading-none">ORIENT<\/span>\s*<span className="text-amber-500 font-\['Great_Vibes'\] text-5xl leading-none mt-2">Global<\/span>\s*<\/div>/g, 
  `<div className="flex flex-col items-center justify-center text-center">
  <span className="text-primary font-['Playfair_Display'] font-black text-4xl tracking-[0.2em] uppercase leading-none">ORIENT</span>
  </div>`);

// 2. Mobile Menu Logo Simplification
c = c.replace(/<div className="flex items-center justify-between mb-8">\s*<div className="flex items-center gap-3" onClick=\{\(\) => \{ setCurrentView\('home'\); setMobileMenuOpen\(false\); document\.getElementById\('main-scroll-container'\)\?\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\); \}\}>\s*<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary\/20">\s*<span className="material-icons text-background text-xl">diamond<\/span>\s*<\/div>\s*<div className="flex flex-col">\s*<span className="font-heading font-black text-sm tracking-tighter text-primary leading-none uppercase">Orient<\/span>\s*<span className="text-\[9px\] font-bold tracking-\[0\.3em\] text-foreground uppercase leading-none mt-0\.5">Global<\/span>\s*<\/div>\s*<\/div>/g,
  `<div className="flex items-center justify-between mb-8">
  <div className="flex items-center gap-3" onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
  <span className="font-heading font-black text-2xl tracking-tighter text-primary leading-none uppercase">Orient</span>
  </div>`);

// 3. Hero Greeting Simplification
c = c.replace(/Welcome to <span className="text-primary">Orient<\/span> Global/g, 'Welcome to <span className="text-primary uppercase">Orient</span>');

// 4. Hero Image Fix - Try adding loading eager and ensuring z-index
c = c.replace(/<motion\.img\s*animate=\{\{ scale: \[1, 1\.05, 1\] \}\}\s*transition=\{\{ duration: 20, ease: "linear", repeat: Infinity \}\}\s*key=\{theme\} src=\{theme === "dark" \? darkHeroImg : lightHeroImg\}\s*className="w-full h-full object-cover"\s*alt=""\s*\/>/g,
  `<motion.img 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1, scale: [1, 1.05, 1] }}
  transition={{ opacity: { duration: 1 }, scale: { duration: 20, ease: "linear", repeat: Infinity } }}
  key={theme} 
  src={theme === "dark" ? darkHeroImg : lightHeroImg} 
  className="w-full h-full object-cover relative z-0" 
  alt="" 
  loading="eager"
  />`);

fs.writeFileSync('App.tsx', c);
