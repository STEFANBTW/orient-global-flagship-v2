const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('dist')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('.');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Remove green blinking dots
    if (content.includes('bg-green-500 rounded-full animate-pulse')) {
        content = content.replace(/<div[^>]*bg-green-500 rounded-full animate-pulse[^>]*><\/div>/g, '');
        changed = true;
    }

    // Rename Orient AI to AURA
    if (content.includes('Orient AI')) {
        content = content.replace(/Orient AI/g, 'AURA');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
