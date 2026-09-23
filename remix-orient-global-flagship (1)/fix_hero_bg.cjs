const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// Update Hero div
content = content.replace(
    /<div ref={ref} className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-transparent">/,
    '<div ref={ref} className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-background">'
);

// Update motion.div inside Hero
content = content.replace(
    /<motion.div style={{ y: yBg, scale }} className="absolute inset-0 z-0">/,
    '<motion.div style={{ y: yBg, scale }} className="absolute inset-0 z-0 bg-background flex items-center justify-center">'
);

// Simplify motion.img
content = content.replace(
    /src={theme === "dark" \? darkHeroImg : lightHeroImg}\s*className="w-full h-full object-cover relative z-0"/,
    'src={theme === "dark" ? darkHeroImg : lightHeroImg} className="w-full h-full object-cover relative z-0"'
);

fs.writeFileSync('App.tsx', content);
console.log('Hero background fixes applied.');
