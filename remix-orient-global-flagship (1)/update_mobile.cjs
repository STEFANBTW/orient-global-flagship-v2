const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

// 1. Replace the inner wrappers
content = content.replace(/className="w-\[90dvw\] h-\[(65|70|75|80)dvh\] lg:w-full lg:h-auto lg:max-w-\[67vw\] mx-auto flex flex-col justify-center/g, 'className="w-[90dvw] min-h-[75dvh] max-h-[80dvh] h-auto lg:w-full lg:min-h-0 lg:max-h-none lg:h-auto lg:max-w-[67vw] mx-auto flex flex-col justify-center');

content = content.replace(/className="w-\[90dvw\] h-\[(65|70|75|80)dvh\] lg:w-full lg:h-auto lg:max-w-\[75vw\] xl:max-w-\[67vw\] mx-auto flex flex-col justify-center/g, 'className="w-[90dvw] min-h-[75dvh] max-h-[80dvh] h-auto lg:w-full lg:min-h-0 lg:max-h-none lg:h-auto lg:max-w-[75vw] xl:max-w-[67vw] mx-auto flex flex-col justify-center');

content = content.replace(/className="w-\[90dvw\] h-\[(65|70|75|80)dvh\] lg:w-full lg:h-auto lg:max-w-\[67vw\] mx-auto flex flex-col items-center justify-center/g, 'className="w-[90dvw] min-h-[75dvh] max-h-[80dvh] h-auto lg:w-full lg:min-h-0 lg:max-h-none lg:h-auto lg:max-w-[67vw] mx-auto flex flex-col items-center justify-center');

// 2. Replace the gap-4 lg:gap-16
content = content.replace(/gap-4 lg:gap-16/g, 'gap-1 lg:gap-16');

// 3. Replace mb-3 with mb-1 in the specific DeepDive sections where it applies to mobile.
content = content.replace(/mb-3 lg:mb-0/g, 'mb-1 lg:mb-0');
content = content.replace(/shrink-0 mb-3/g, 'shrink-0 mb-1');

fs.writeFileSync('App.tsx', content);
console.log('Done');
