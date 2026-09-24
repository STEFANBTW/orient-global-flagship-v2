const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/06_Neumorphism/06_Neumorphism_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

// Fix title issue left over from templating
content = content.replace('<title>Neumorphism Design System', '<title>Neumorphism Design System'); // Just in case it was wrong

const customCSS = `
/* ============================================== */
/* NEUMORPHISM STUDIO PANEL REDESIGN (MANUAL)     */
/* ============================================== */

/* The Panel Container */
.interactive-panel {
    background: #E0E8F6 !important;
    border: none !important;
    box-shadow: -15px 0 30px rgba(0,0,0,0.05) !important;
}

/* The Panel Header */
.panel-header {
    background: transparent !important;
    border: none !important;
    padding-bottom: 20px !important;
    margin-bottom: 20px !important;
    box-shadow: 0 10px 15px -10px rgba(190, 200, 215, 0.5) !important;
}

.panel-header h2 {
    font-family: 'Inter', sans-serif !important;
    font-size: 22px !important;
    font-weight: 700 !important;
    color: #3E5066 !important;
    letter-spacing: -0.02em !important;
}

.panel-btn-icon {
    border: none !important;
    background: #E0E8F6 !important;
    color: #3E5066 !important;
    border-radius: 50% !important;
    box-shadow: 4px 4px 8px #BEC8D7, -4px -4px 8px #FFFFFF !important;
    transition: all 0.2s ease !important;
}

.panel-btn-icon:hover {
    box-shadow: inset 4px 4px 8px #BEC8D7, inset -4px -4px 8px #FFFFFF !important;
    color: #3A86C8 !important;
}

/* Typography Controls / Studio Cards */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    border: none !important;
    border-radius: 20px !important;
    background: #E0E8F6 !important;
    box-shadow: 8px 8px 16px #BEC8D7, -8px -8px 16px #FFFFFF !important;
    margin-bottom: 24px !important;
}

.typo-controls { padding: 30px !important; }

/* Inputs and Selects */
input[type=text], select, .device-btn {
    border: none !important;
    border-radius: 12px !important;
    font-family: 'Inter', sans-serif !important;
    background: #E0E8F6 !important;
    color: #3E5066 !important;
    padding: 12px !important;
    box-shadow: inset 4px 4px 8px #BEC8D7, inset -4px -4px 8px #FFFFFF !important;
    font-weight: 500 !important;
    transition: all 0.2s ease;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    box-shadow: inset 6px 6px 12px #BEC8D7, inset -6px -6px 12px #FFFFFF !important;
}

.device-btn {
    box-shadow: 4px 4px 8px #BEC8D7, -4px -4px 8px #FFFFFF !important;
    border-radius: 20px !important;
    padding: 8px 20px !important;
    font-size: 12px !important;
}

.device-btn.active {
    box-shadow: inset 4px 4px 8px #BEC8D7, inset -4px -4px 8px #FFFFFF !important;
    color: #3A86C8 !important;
    font-weight: 700 !important;
}

/* Range Sliders */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: #E0E8F6 !important;
    height: 12px !important;
    border: none !important;
    border-radius: 6px !important;
    box-shadow: inset 3px 3px 6px #BEC8D7, inset -3px -3px 6px #FFFFFF !important;
    margin: 16px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    background: #E0E8F6;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -6px;
    box-shadow: 4px 4px 8px #BEC8D7, -4px -4px 8px #FFFFFF;
}

/* Labels */
label span {
    font-family: 'Inter', sans-serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #7A899C !important;
}

.val-label {
    color: #3A86C8 !important;
}

/* Elegant validation warning */
.range-warn.invalid {
    background: #E0E8F6 !important;
    color: #E25C84 !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 4px 10px !important;
    box-shadow: inset 3px 3px 6px rgba(226, 92, 132, 0.2), inset -3px -3px 6px #FFFFFF !important;
}

.clear-btn {
    border: none !important;
    color: #E25C84 !important;
    background: #E0E8F6 !important;
    border-radius: 16px !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 700 !important;
    padding: 12px 24px !important;
    box-shadow: 4px 4px 8px #BEC8D7, -4px -4px 8px #FFFFFF !important;
    transition: all 0.2s ease !important;
}
.clear-btn:hover {
    box-shadow: inset 4px 4px 8px #BEC8D7, inset -4px -4px 8px #FFFFFF !important;
}
`;

if (!content.includes('/* NEUMORPHISM STUDIO PANEL REDESIGN (MANUAL)     */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Neumorphism CSS.');
} else {
    console.log('CSS already injected.');
}
