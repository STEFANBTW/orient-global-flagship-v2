const fs = require('fs');

// Fix Market Dashboard
let dashboardContent = fs.readFileSync('src/supermarket/pages/Dashboard.tsx', 'utf8');
const dashboardChatTarget = /<motion\.div initial=\{\{ y: 20 \}\} animate=\{\{ y: 0 \}\} className="fixed bottom-6 right-6 z-50">[\s\S]*?<\/motion\.div>/;
dashboardContent = dashboardContent.replace(dashboardChatTarget, '');
fs.writeFileSync('src/supermarket/pages/Dashboard.tsx', dashboardContent);
console.log('Market Dashboard redundant chat removed.');

// Clean up scripts
try {
    fs.unlinkSync('standardize_ui.cjs');
    fs.unlinkSync('globalize_chatbot.cjs');
} catch (e) {}
