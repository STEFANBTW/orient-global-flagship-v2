import fs from 'fs';
import path from 'path';

console.log('__dirname:', __dirname);
console.log('cwd:', process.cwd());
console.log('exists /downloaded_studio/src:', fs.existsSync('/downloaded_studio/src'));
