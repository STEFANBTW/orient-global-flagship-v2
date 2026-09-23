const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

// 1. Hero Section
content = content.replace(/h-\[110vh\]/, 'h-[65vh]');
content = content.replace(/text-7xl md:text-\[10rem\] lg:text-\[13rem\]/, 'text-6xl md:text-8xl lg:text-9xl');

// 2. ServicesGrid
content = content.replace(/py-40 px-4 sm:px-8/, 'min-h-[65vh] flex flex-col justify-center py-12 px-4 sm:px-8');
content = content.replace(/lg:max-w-\[67vw\] mx-auto/, 'lg:max-w-[67vw] mx-auto w-full');
content = content.replace(/min-h-\[70vh\]/, 'min-h-[50vh]');

// 3. Deep Dives & Showcases
// Replace py-60 with h-[65vh] flex items-center
content = content.replace(/py-60/g, 'h-[65vh] flex flex-col justify-center py-12');
// Replace py-80 with h-[65vh] flex items-center
content = content.replace(/py-80/g, 'h-[65vh] flex flex-col justify-center py-12');

// 4. Typography reductions
content = content.replace(/text-5xl md:text-7xl/g, 'text-4xl sm:text-5xl');
content = content.replace(/text-6xl md:text-8xl/g, 'text-5xl md:text-6xl');
content = content.replace(/text-7xl md:text-9xl/g, 'text-5xl md:text-6xl');
content = content.replace(/text-8xl md:text-\[12rem\]/g, 'text-6xl md:text-8xl');

// 5. Padding and Gap reductions
content = content.replace(/gap-32/g, 'gap-16');
content = content.replace(/gap-24/g, 'gap-12');
content = content.replace(/p-12/g, 'p-8');
content = content.replace(/p-16/g, 'p-8');
content = content.replace(/rounded-\[4rem\]/g, 'rounded-3xl');
content = content.replace(/rounded-\[3rem\]/g, 'rounded-2xl');
content = content.replace(/rounded-\[2\.5rem\]/g, 'rounded-2xl');

// 6. Image height reductions
content = content.replace(/h-\[80vh\]/g, 'h-[45vh]');
content = content.replace(/h-\[70vh\]/g, 'h-[45vh]');

// 7. Max-width reductions
content = content.replace(/lg:max-w-\[75vw\]/g, 'lg:max-w-[67vw]');

// 8. Text size reductions for paragraphs
content = content.replace(/text-2xl dark:text-gray-400/g, 'text-lg dark:text-gray-400');
content = content.replace(/text-xl dark:text-gray-400/g, 'text-base dark:text-gray-400');

// 9. Final CTA specific fixes
content = content.replace(/w-\[500px\] h-\[500px\]/g, 'w-96 h-96');
content = content.replace(/blur-\[150px\]/g, 'blur-[120px]');

fs.writeFileSync('App.tsx', content);
console.log("Replaced typography and sizing in App.tsx");
