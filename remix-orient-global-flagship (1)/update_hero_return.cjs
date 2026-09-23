const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const heroReturn = `  return (
  <div ref={ref} className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-background">
  <motion.div style={{ y: yBg, scale }} className="absolute inset-0 z-0 bg-background">
  <motion.img 
   initial={{ opacity: 0 }}
   animate={{ opacity: theme === "light" ? 1 : 0 }}
   transition={{ opacity: { duration: 1.5 } }}
   src={lightHeroImg} 
   className="absolute inset-0 w-full h-full object-cover" 
   alt="" 
   loading="eager"
  />
  <motion.img 
   initial={{ opacity: 0 }}
   animate={{ opacity: theme === "dark" ? 1 : 0 }}
   transition={{ opacity: { duration: 1.5 } }}
   src={darkHeroImg} 
   className="absolute inset-0 w-full h-full object-cover" 
   alt="" 
   loading="eager"
  />
  {theme === "light" && <div className="absolute inset-0 bg-white/20 z-[1] pointer-events-none" />}
  </motion.div>`;

// Use a more generic regex to find the start of the return in Hero component
const heroRegex = /return \(\s*<div ref={ref} className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-background">[\s\S]*?<motion\.div style={{ y: yBg, scale }} className="absolute inset-0 z-0 bg-background flex items-center justify-center">[\s\S]*?<\/motion\.div>/;

content = content.replace(heroRegex, heroReturn + '\n  </motion.div>');

fs.writeFileSync('App.tsx', content);
console.log('Hero return block updated.');
