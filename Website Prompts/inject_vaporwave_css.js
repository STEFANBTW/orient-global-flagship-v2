const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/11_Vaporwave_Y2K/11_Vaporwave_Y2K_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Vaporwave_Y2K Design System', '<title>Vaporwave Y2K Design System');

const customCSS = `
/* ================================================== */
/* VAPORWAVE / Y2K STUDIO PANEL REDESIGN (MANUAL)     */
/* ================================================== */

/* The Panel Container (Windows 95 Window Style) */
.interactive-panel {
    background: #C0C0C0 !important;
    border: 2px solid !important;
    border-color: #FFFFFF #808080 #808080 #FFFFFF !important;
    box-shadow: -4px 4px 0 rgba(0,0,0,0.2) !important;
    z-index: 1000 !important;
    font-family: 'Courier New', monospace !important;
}

/* The Panel Header (Classic Win95 Title Bar) */
.panel-header {
    background: linear-gradient(90deg, #000080, #1084d0) !important;
    color: #FFFFFF !important;
    border: none !important;
    padding: 4px 8px !important;
    margin: 4px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    height: 30px !important;
}

.panel-header h2 {
    font-family: 'MS Sans Serif', 'Arial', sans-serif !important;
    font-size: 14px !important;
    font-weight: bold !important;
    color: #FFFFFF !important;
    margin: 0 !important;
    letter-spacing: 0 !important;
}

/* Close Button (Win95 style 'X' button) */
.panel-btn-icon {
    background: #C0C0C0 !important;
    color: #000000 !important;
    border: 2px solid !important;
    border-color: #FFFFFF #808080 #808080 #FFFFFF !important;
    border-radius: 0 !important;
    width: 20px !important;
    height: 20px !important;
    padding: 0 !important;
    font-family: 'Arial', sans-serif !important;
    font-weight: bold !important;
    font-size: 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: none !important;
}

.panel-btn-icon:active {
    border-color: #808080 #FFFFFF #FFFFFF #808080 !important;
    padding-top: 2px !important;
    padding-left: 2px !important;
}

/* Typography Controls / Studio Cards (Inset panels) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: #FFFFFF !important;
    border: 2px solid !important;
    border-color: #808080 #FFFFFF #FFFFFF #808080 !important;
    border-radius: 0 !important;
    padding: 16px !important;
    margin: 8px 16px 16px 16px !important;
    box-shadow: none !important;
}

.typo-controls { background: #C0C0C0 !important; border: none !important; padding: 12px 16px !important; }

/* Inputs and Selects (Win95 Inset) */
input[type=text], select {
    background: #FFFFFF !important;
    color: #000000 !important;
    border: 2px solid !important;
    border-color: #808080 #FFFFFF #FFFFFF #808080 !important;
    border-radius: 0 !important;
    font-family: 'MS Sans Serif', 'Arial', sans-serif !important;
    padding: 4px 6px !important;
    font-size: 13px !important;
}

input[type=text]:focus, select:focus {
    outline: 1px dotted #000000 !important;
    outline-offset: -4px !important;
}

/* Buttons */
.device-btn {
    background: #C0C0C0 !important;
    color: #000000 !important;
    border: 2px solid !important;
    border-color: #FFFFFF #808080 #808080 #FFFFFF !important;
    border-radius: 0 !important;
    font-family: 'MS Sans Serif', 'Arial', sans-serif !important;
    padding: 4px 12px !important;
    font-size: 13px !important;
}
.device-btn:active {
    border-color: #808080 #FFFFFF #FFFFFF #808080 !important;
    padding-top: 5px !important;
}

.device-btn.active {
    background: #FF70A6 !important; /* Vaporwave pink active state */
    color: #FFFFFF !important;
    border-color: #808080 #FFFFFF #FFFFFF #808080 !important;
    background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 4px) !important;
}

/* Sliders */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent !important;
    height: 24px !important;
    border: none !important;
    margin: 4px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 12px;
    background: #C0C0C0;
    border: 2px solid;
    border-color: #FFFFFF #808080 #808080 #FFFFFF;
    cursor: pointer;
    margin-top: -8px;
}
input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: #808080;
    border-bottom: 1px solid #FFFFFF;
    border-right: 1px solid #FFFFFF;
}

/* Functional Checkboxes */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #FFFFFF;
    border: 2px solid;
    border-color: #808080 #FFFFFF #FFFFFF #808080;
    position: relative;
    cursor: pointer;
}
input[type=checkbox]:checked::after {
    content: '?';
    position: absolute;
    top: -2px; left: 1px;
    color: #000000;
    font-size: 14px;
    font-family: 'Arial', sans-serif;
}

/* Labels */
label span {
    font-family: 'MS Sans Serif', 'Arial', sans-serif !important;
    font-size: 12px !important;
    color: #000000 !important;
}

.val-label {
    background: #000080 !important;
    color: #FFFFFF !important;
    font-family: 'Courier New', monospace !important;
    font-size: 12px !important;
    padding: 0 4px !important;
    border: 1px solid #000000 !important;
}

/* Validation Warning (Error Red) */
.range-warn.invalid {
    background: #FF0000 !important;
    color: #FFFF00 !important;
    font-family: 'MS Sans Serif', 'Arial', sans-serif !important;
    font-size: 12px !important;
    font-weight: bold !important;
    border: 2px solid !important;
    border-color: #808080 #FFFFFF #FFFFFF #808080 !important;
    padding: 2px 4px !important;
}

.clear-btn {
    background: #C0C0C0 !important;
    color: #000000 !important;
    border: 2px solid !important;
    border-color: #FFFFFF #808080 #808080 #FFFFFF !important;
    border-radius: 0 !important;
    font-family: 'MS Sans Serif', 'Arial', sans-serif !important;
    font-weight: bold !important;
    padding: 6px 16px !important;
}
.clear-btn:active {
    border-color: #808080 #FFFFFF #FFFFFF #808080 !important;
    padding-top: 8px !important; /* visual click */
}
`;

if (!content.includes('/* VAPORWAVE / Y2K STUDIO PANEL REDESIGN (MANUAL)     */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Vaporwave Y2K CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
