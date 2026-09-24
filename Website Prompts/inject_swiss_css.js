const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/17_Swiss_International/17_Swiss_International_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Swiss_International Design System', '<title>Swiss International Design System');

const customCSS = `
/* ======================================================= */
/* SWISS INTERNATIONAL STUDIO PANEL REDESIGN (MANUAL)      */
/* ======================================================= */

/* The Panel Container (Strict Grid, Pure White) */
.interactive-panel {
    background: #FFFFFF !important;
    border-left: 2px solid #111111 !important;
    box-shadow: none !important;
    z-index: 1000 !important;
}

/* The Panel Header (Typographic Focus) */
.panel-header {
    background: #FFFFFF !important;
    border-bottom: 2px solid #111111 !important;
    padding: 40px 32px !important;
    text-align: left !important;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.panel-header h2 {
    font-family: 'Helvetica Neue', 'Helvetica', 'Inter', sans-serif !important;
    font-size: 32px !important;
    font-weight: 700 !important;
    color: #111111 !important;
    letter-spacing: -1px !important;
    line-height: 1 !important;
    margin: 0 !important;
}

/* Close Button (Strict Geometry) */
.panel-btn-icon {
    border: none !important;
    background: transparent !important;
    color: #111111 !important;
    border-radius: 0 !important;
    width: 32px !important;
    height: 32px !important;
    padding: 0 !important;
    font-family: 'Helvetica', sans-serif !important;
    font-size: 24px !important;
    font-weight: 400 !important;
    transition: color 0.2s ease !important;
}

.panel-btn-icon:hover {
    color: #E74C3C !important; /* Swiss Red */
    background: transparent !important;
}

/* Typography Controls / Studio Cards (Grid Aligned, No borders, Left bordered) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: #FFFFFF !important;
    border: none !important;
    border-left: 4px solid #111111 !important;
    border-radius: 0 !important;
    padding: 24px 32px !important;
    margin-bottom: 40px !important;
    box-shadow: none !important;
}

/* Specific highlight for active sections */
.typo-controls { 
    border-left: 4px solid #E74C3C !important; 
    background: #FAFAFA !important;
}

/* Inputs and Selects (Minimalist lines) */
input[type=text], select, .device-btn {
    border: none !important;
    border-bottom: 2px solid #95A5A6 !important;
    border-radius: 0 !important;
    font-family: 'Helvetica Neue', 'Helvetica', 'Inter', sans-serif !important;
    background: transparent !important;
    color: #111111 !important;
    padding: 8px 0 !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    transition: all 0.2s ease;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    border-bottom: 2px solid #111111 !important;
}

/* Device Buttons */
.device-btn {
    border-bottom: 2px solid transparent !important;
    color: #95A5A6 !important;
    padding: 8px 16px !important;
    margin-right: 8px !important;
    text-transform: lowercase !important; /* Modern Swiss touch */
}

.device-btn:hover {
    color: #111111 !important;
}

.device-btn.active {
    color: #E74C3C !important;
    border-bottom: 2px solid #E74C3C !important;
}

/* Sliders (Sharp, thin) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: #111111 !important;
    height: 2px !important;
    border-radius: 0 !important;
    border: none !important;
    margin: 24px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 8px; /* Rectangular thumb */
    background: #111111;
    border: none;
    border-radius: 0;
    cursor: pointer;
    margin-top: -9px;
    transition: background 0.2s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
    background: #E74C3C;
}

/* Functional Checkboxes (Sharp squares) */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #FFFFFF;
    border: 2px solid #111111;
    border-radius: 0;
    position: relative;
    cursor: pointer;
}
input[type=checkbox]:checked {
    background: #111111;
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
    font-family: 'Helvetica Neue', 'Helvetica', 'Inter', sans-serif !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    color: #95A5A6 !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
}

.val-label {
    color: #111111 !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    letter-spacing: -0.5px !important;
}

/* Validation Warning */
.range-warn.invalid {
    background: #E74C3C !important;
    color: #FFFFFF !important;
    font-family: 'Helvetica Neue', 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 4px 12px !important;
    display: inline-block;
}

.clear-btn {
    border: 2px solid #111111 !important;
    color: #111111 !important;
    background: #FFFFFF !important;
    border-radius: 0 !important;
    font-family: 'Helvetica Neue', 'Inter', sans-serif !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    padding: 12px 24px !important;
    transition: all 0.2s ease !important;
}
.clear-btn:hover {
    background: #111111 !important;
    color: #FFFFFF !important;
}
`;

if (!content.includes('/* SWISS INTERNATIONAL STUDIO PANEL REDESIGN (MANUAL)      */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Swiss CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
