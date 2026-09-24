const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/08_Flat_Design/08_Flat_Design_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

// Fix title issue left over from templating
content = content.replace('<title>Flat_Design Design System', '<title>Flat Design System');

const customCSS = `
/* ============================================== */
/* FLAT DESIGN STUDIO PANEL REDESIGN (MANUAL)     */
/* ============================================== */

/* The Panel Container */
.interactive-panel {
    background: #FFFFFF !important;
    border-left: 1px solid #E0E0E0 !important;
    box-shadow: -4px 0 16px rgba(0,0,0,0.05) !important; /* Very subtle elevation */
}

/* The Panel Header */
.panel-header {
    background: #1ABC9C !important; /* Primary Brand Color */
    color: #FFFFFF !important;
    border-bottom: none !important;
    padding: 24px 32px !important;
}

.panel-header h2 {
    font-family: 'Inter', sans-serif !important;
    font-size: 20px !important;
    font-weight: 700 !important;
    color: #FFFFFF !important;
    margin: 0 !important;
}

.panel-btn-icon {
    border: none !important;
    background: transparent !important;
    color: #FFFFFF !important;
    border-radius: 50% !important;
    padding: 8px !important;
    transition: background 0.2s ease !important;
}

.panel-btn-icon:hover {
    background: rgba(255,255,255,0.2) !important;
}

/* Typography Controls / Studio Cards */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    border: 1px solid #E0E0E0 !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    background: #FAFAFA !important; /* Slightly distinct from white background */
    padding: 24px !important;
    margin-bottom: 24px !important;
}

.typo-controls { background: #FFFFFF !important; border: none !important; padding: 24px 32px !important; }

/* Inputs and Selects */
input[type=text], select, .device-btn {
    border: 1px solid #BDBDBD !important;
    border-radius: 4px !important;
    font-family: 'Inter', sans-serif !important;
    background: #FFFFFF !important;
    color: #212121 !important;
    padding: 10px 12px !important;
    font-size: 14px !important;
    transition: border 0.2s ease;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    border: 2px solid #1ABC9C !important;
    padding: 9px 11px !important; /* Adjust for border width change */
}

.device-btn {
    background: #F5F5F5 !important;
    border: 1px solid #E0E0E0 !important;
    color: #757575 !important;
    padding: 8px 16px !important;
    font-weight: 500 !important;
}

.device-btn.active {
    background: #1ABC9C !important;
    color: #FFFFFF !important;
    border-color: #1ABC9C !important;
}

/* Flat Sliders */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: #E0E0E0 !important;
    height: 6px !important;
    border-radius: 3px !important;
    border: none !important;
    margin: 16px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 18px;
    width: 18px;
    background: #1ABC9C;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -6px;
    transition: transform 0.1s ease, background 0.1s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    background: #16A085;
}
input[type=range]::-webkit-slider-thumb:active {
    transform: scale(0.9);
}

/* Functional Checkboxes */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #FFFFFF;
    border: 2px solid #BDBDBD;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
}
input[type=checkbox]:checked {
    background: #1ABC9C;
    border-color: #1ABC9C;
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 2px; left: 6px;
    width: 4px; height: 10px;
    border-right: 2px solid #FFFFFF;
    border-bottom: 2px solid #FFFFFF;
    transform: rotate(45deg);
}

/* Labels */
label span {
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #757575 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
}

.val-label {
    color: #212121 !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
    font-size: 14px !important;
}

/* Validation Warning (Functional Red) */
.range-warn.invalid {
    background: #E74C3C !important;
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 4px 8px !important;
    text-transform: uppercase !important;
}

.clear-btn {
    border: none !important;
    color: #FFFFFF !important;
    background: #E74C3C !important;
    border-radius: 4px !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 600 !important;
    padding: 10px 24px !important;
    transition: background 0.2s ease !important;
}
.clear-btn:hover {
    background: #C0392B !important;
}
`;

if (!content.includes('/* FLAT DESIGN STUDIO PANEL REDESIGN (MANUAL)     */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Flat Design CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
