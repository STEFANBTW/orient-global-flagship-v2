const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// Revert the previous bad replacements
content = content.replace(/className="rounded-3xl h-screen snap-start/g, 'className="rounded-3xl h-[50vh]');

// 1. Update the main scroll container to have snap-y snap-mandatory
if (!content.includes('id="main-scroll-container"')) {
  content = content.replace(
    /<div className="bg-slate-50 dark:bg-background-dark transition-colors duration-700 dark:text-white text-slate-900 selection:bg-primary selection:text-black relative z-10">/,
    '<div className="bg-slate-50 dark:bg-background-dark transition-colors duration-700 dark:text-white text-slate-900 selection:bg-primary selection:text-black relative z-10 h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth" id="main-scroll-container">'
  );
}

// 2. Replace section heights with h-screen snap-start ONLY on <section> and <footer>
const heightsToReplace = [
  'h-\\[110vh\\]', 'h-\\[65vh\\]', 'h-\\[75vh\\]', 'min-h-\\[65vh\\]', 'min-h-\\[50vh\\]', 'h-\\[50vh\\]'
];

heightsToReplace.forEach(h => {
  const regex = new RegExp(`(<(?:section|footer)[^>]*className="[^"]*?)(?:\\s|^)${h}(?:\\s|$)([^"]*")`, 'g');
  content = content.replace(regex, (match, p1, p2) => {
    let newClasses = p1 + ' h-screen snap-start ' + p2;
    newClasses = newClasses.replace(/\s+/g, ' ').trim();
    return newClasses;
  });
});

// 3. Wrap the inner contents in a 80vw x 70vh container.
const sectionsToWrap = [
  {
    find: '<div className="flex flex-col md:flex-row gap-16 items-center">',
    replace: '<div className="w-[80vw] h-[70vh] mx-auto flex flex-col md:flex-row gap-16 items-center justify-center">'
  },
  {
    find: '<div className="flex flex-col md:flex-row-reverse gap-16 items-center">',
    replace: '<div className="w-[80vw] h-[70vh] mx-auto flex flex-col md:flex-row-reverse gap-16 items-center justify-center">'
  },
  {
    find: '<div className="lg:max-w-[67vw] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">',
    replace: '<div className="w-[80vw] h-[70vh] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center content-center">'
  },
  {
    find: '<div className="relative z-10 lg:max-w-[67vw] mx-auto text-center">',
    replace: '<div className="relative z-10 w-[80vw] h-[70vh] mx-auto flex flex-col justify-center items-center text-center">'
  },
  {
    find: '<div className="relative z-20 max-w-7xl w-full">',
    replace: '<div className="relative z-20 w-[80vw] h-[70vh] mx-auto flex flex-col justify-center items-center w-full">'
  },
  {
    find: '<div className="lg:max-w-[67vw] mx-auto w-full">',
    replace: '<div className="w-[80vw] h-[70vh] mx-auto flex flex-col justify-center w-full">'
  },
  {
    find: '<div className="lg:max-w-[67vw] mx-auto w-full text-center">',
    replace: '<div className="w-[80vw] h-[70vh] mx-auto flex flex-col justify-center items-center text-center w-full">'
  },
  {
    find: '<div className="lg:max-w-[67vw] mx-auto w-full relative z-10">',
    replace: '<div className="w-[80vw] h-[70vh] mx-auto flex flex-col justify-center w-full relative z-10">'
  }
];

sectionsToWrap.forEach(({ find, replace }) => {
  content = content.split(find).join(replace);
});

// Also fix the Footer inner container
content = content.replace(
  '<div className="lg:max-w-[67vw] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">',
  '<div className="w-[80vw] h-[70vh] mx-auto flex flex-col justify-center w-full">\n<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">'
);
content = content.replace(
  '          <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">\n            <p className="text-sm dark:text-gray-500 text-slate-500 font-medium">© 2024 Orient Global. All rights reserved.</p>\n            <div className="flex items-center gap-6">\n              <a href="#" className="text-sm dark:text-gray-500 text-slate-500 hover:text-primary transition-colors font-medium">Privacy Policy</a>\n              <a href="#" className="text-sm dark:text-gray-500 text-slate-500 hover:text-primary transition-colors font-medium">Terms of Service</a>\n            </div>\n          </div>\n        </div>\n      </footer>',
  '          <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">\n            <p className="text-sm dark:text-gray-500 text-slate-500 font-medium">© 2024 Orient Global. All rights reserved.</p>\n            <div className="flex items-center gap-6">\n              <a href="#" className="text-sm dark:text-gray-500 text-slate-500 hover:text-primary transition-colors font-medium">Privacy Policy</a>\n              <a href="#" className="text-sm dark:text-gray-500 text-slate-500 hover:text-primary transition-colors font-medium">Terms of Service</a>\n            </div>\n          </div>\n        </div>\n        </div>\n      </footer>'
);

// We need to make sure that the sections themselves have `flex flex-col justify-center items-center`
const sectionTagRegex = /<section([^>]*)className="([^"]*?)"/g;
content = content.replace(sectionTagRegex, (match, p1, p2) => {
  if (!p2.includes('items-center')) {
    let newClasses = p2 + ' items-center';
    newClasses = newClasses.replace(/\s+/g, ' ').trim();
    return `<section${p1}className="${newClasses}"`;
  }
  return match;
});

fs.writeFileSync('App.tsx', content);
console.log("Applied snap scrolling classes and inner containers to sections.");
