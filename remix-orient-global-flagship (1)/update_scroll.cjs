const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// We need to modify the main wrapper to be a snap container
content = content.replace(
  /<div className="bg-slate-50 dark:bg-background-dark transition-colors duration-700 dark:text-white text-slate-900 selection:bg-primary selection:text-black relative z-10">/,
  '<div className="bg-slate-50 dark:bg-background-dark transition-colors duration-700 dark:text-white text-slate-900 selection:bg-primary selection:text-black relative z-10 h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth" id="main-scroll-container">'
);

// Update handleScroll to listen to the container instead of window
content = content.replace(
  /const currentScrollY = window\.scrollY;/g,
  "const container = document.getElementById('main-scroll-container');\n      if (!container) return;\n      const currentScrollY = container.scrollTop;"
);
content = content.replace(
  /window\.innerHeight/g,
  "container.clientHeight"
);
content = content.replace(
  /window\.addEventListener\('scroll', handleScroll, \{ passive: true \}\);/g,
  "const container = document.getElementById('main-scroll-container');\n    if (container) container.addEventListener('scroll', handleScroll, { passive: true });"
);
content = content.replace(
  /return \(\) => window\.removeEventListener\('scroll', handleScroll\);/g,
  "return () => {\n      const container = document.getElementById('main-scroll-container');\n      if (container) container.removeEventListener('scroll', handleScroll);\n    };"
);

// We need to update window.scrollTo(0, 0) to container.scrollTo(0, 0)
content = content.replace(
  /window\.scrollTo\(0, 0\)/g,
  "document.getElementById('main-scroll-container')?.scrollTo(0, 0)"
);

fs.writeFileSync('App.tsx', content);
console.log("Updated scroll container");
