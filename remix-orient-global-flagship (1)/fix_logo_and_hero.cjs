const fs = require('fs');
let c = fs.readFileSync('App.tsx', 'utf8');

// Simplify Logo in Navbar
const logoNavbarRegex = /<motion\.div[^>]+initial=\{skipAnimation \? \{ clipPath: 'polygon\(0% 0%, 100% 0%, 100% 100%, 0% 100%\)' \} : \{ clipPath: 'polygon\(0% -50%, 100% -150%, 100% -150%, 0% -50%\)' \}\}[^>]+animate=\{isReady \? \{ clipPath: 'polygon\(0% 0%, 100% 0%, 100% 100%, 0% 100%\)' \} : \{ clipPath: 'polygon\(0% -50%, 100% -150%, 100% -150%, 0% -50%\)' \}\}[^>]+transition=\{\{ duration: 1\.5, delay: skipAnimation \? 0 : \(isReady \? 2\.9 : 0\), ease: \[0\.76, 0, 0\.24, 1\] \}\}[^>]+className=\{`flex items-center gap-2 sm:gap-3 cursor-pointer \$\{isMobile \? 'pl-2 pr-4 border-r border-transparent' : ''\}`\} onClick=\{\(\) => \{ setCurrentView\('home'\); document\.getElementById\('main-scroll-container'\)\?\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\); \}\}>[\s\S]*?<\/motion\.div>/;

const newLogoNavbar = `  <motion.div 
  initial={skipAnimation ? { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' } : { clipPath: 'polygon(0% -50%, 100% -150%, 100% -150%, 0% -50%)' }}
  animate={isReady ? { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' } : { clipPath: 'polygon(0% -50%, 100% -150%, 100% -150%, 0% -50%)' }}
  transition={{ duration: 1.5, delay: skipAnimation ? 0 : (isReady ? 2.9 : 0), ease: [0.76, 0, 0.24, 1] }}
  className={\`flex items-center gap-2 sm:gap-3 cursor-pointer \${isMobile ? 'pl-2 pr-4 border-r border-transparent' : ''}\`} onClick={() => { setCurrentView('home'); document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
  <span className="font-heading font-black text-2xl sm:text-3xl tracking-tighter leading-none uppercase text-primary">Orient</span>
  </motion.div>`;

c = c.replace(logoNavbarRegex, newLogoNavbar);

// Fix Hero Image
// Change src logic to ensure the image is loaded correctly. 
// Also adding a key to force re-render on theme change.
c = c.replace(/src=\{theme === 'dark' \? darkHeroImg : lightHeroImg\}/, 'key={theme} src={theme === \"dark\" ? darkHeroImg : lightHeroImg}');

fs.writeFileSync('App.tsx', c);
