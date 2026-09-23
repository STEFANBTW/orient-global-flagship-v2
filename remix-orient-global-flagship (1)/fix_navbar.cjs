const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

content = content.replace(
  "bottom-6 left-0 right-0 mx-auto w-[95%]",
  "bottom-3 left-0 right-0 mx-auto w-[90%]"
);

content = content.replace(
  "rounded-[40px] h-14 sm:h-16 px-4 sm:px-6",
  "rounded-full h-12 px-4"
);

content = content.replace(
  "pl-2 pr-4 border-r border-transparent",
  "pl-2 pr-3 border-r border-transparent"
);

content = content.replace(
  '<span className="font-heading font-black text-2xl sm:text-3xl tracking-tighter leading-none uppercase text-primary">Orient</span>',
  '<span className="font-heading font-black text-xl sm:text-3xl tracking-tighter leading-none uppercase text-primary">Orient</span>'
);

fs.writeFileSync('App.tsx', content);
