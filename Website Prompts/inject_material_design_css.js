const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/09_Material_Design/09_Material_Design_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Material_Design Design System', '<title>Material Design System');

const customCSS = `
/* ================================================== */
/* MATERIAL DESIGN STUDIO PANEL REDESIGN (MANUAL)     */
/* ================================================== */

/* The Panel Container */
.interactive-panel {
    background: #FAFAFA !important;
    border-left: none !important;
    box-shadow: -8px 0 10px rgba(0,0,0,0.14), -3px 0 14px rgba(0,0,0,0.12), -5px 0 5px rgba(0,0,0,0.2) !important; /* Material Elevation 16dp */
    z-index: 1000 !important;
}

/* The Panel Header (App Bar style) */
.panel-header {
    background: #6200EE !important; /* Primary Color */
    color: #FFFFFF !important;
    border-bottom: none !important;
    padding: 16px 24px !important;
    box-shadow: 0 4px 5px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.2) !important; /* Elevation 4dp */
    position: relative;
    z-index: 4 !important;
}

.panel-header h2 {
    font-family: 'Roboto', 'Inter', sans-serif !important;
    font-size: 20px !important;
    font-weight: 500 !important;
    letter-spacing: 0.15px !important;
    color: #FFFFFF !important;
    margin: 0 !important;
}

/* Close Button - Floating Action Button (FAB) Style or App Bar Icon */
.panel-btn-icon {
    border: none !important;
    background: transparent !important;
    color: #FFFFFF !important;
    border-radius: 50% !important;
    padding: 8px !important;
    width: 40px !important;
    height: 40px !important;
    transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.panel-btn-icon:hover {
    background: rgba(255,255,255,0.12) !important;
}
.panel-btn-icon:active {
    background: rgba(255,255,255,0.24) !important;
}

/* Typography Controls / Studio Cards (Material Cards) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    border: none !important;
    border-radius: 4px !important;
    box-shadow: 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.2) !important; /* Elevation 1dp */
    background: #FFFFFF !important;
    padding: 16px !important;
    margin: 8px 16px 16px 16px !important;
    transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.typo-controls:hover, .spacing-card:hover {
    box-shadow: 0 4px 5px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.2) !important; /* Elevation 4dp on hover */
}

.typo-controls { padding: 16px 24px !important; }

/* Filled Text Fields & Outlined Selects */
input[type=text], select {
    border: none !important;
    border-bottom: 1px solid #757575 !important;
    border-radius: 4px 4px 0 0 !important;
    font-family: 'Roboto', 'Inter', sans-serif !important;
    background: rgba(0, 0, 0, 0.04) !important;
    color: #212121 !important;
    padding: 20px 12px 6px 12px !important;
    font-size: 16px !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

input[type=text]:focus, select:focus {
    outline: none !important;
    border-bottom: 2px solid #6200EE !important;
    background: rgba(98, 0, 238, 0.04) !important;
}

/* Contained Buttons */
.device-btn {
    background: transparent !important;
    border: none !important;
    color: #6200EE !important;
    padding: 0 16px !important;
    height: 36px !important;
    line-height: 36px !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    text-transform: uppercase !important;
    letter-spacing: 1.25px !important;
    border-radius: 4px !important;
    transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.device-btn:hover {
    background: rgba(98, 0, 238, 0.04) !important;
}

.device-btn.active {
    background: rgba(98, 0, 238, 0.12) !important;
    color: #6200EE !important;
}

/* Material Sliders */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent !important;
    height: 36px !important; /* Tap target size */
    border: none !important;
    margin: 8px 0 !important;
    position: relative;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    background: #6200EE;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -9px;
    box-shadow: 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px rgba(0,0,0,0.2);
    transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
input[type=range]::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 10px rgba(98, 0, 238, 0.08), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px rgba(0,0,0,0.2);
}
input[type=range]::-webkit-slider-thumb:active {
    box-shadow: 0 0 0 14px rgba(98, 0, 238, 0.16);
}
input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #CE93D8; /* Light purple track */
}

/* Functional Checkboxes */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: transparent;
    border: 2px solid #757575;
    border-radius: 2px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 4px;
}
input[type=checkbox]:checked {
    background: #6200EE;
    border-color: #6200EE;
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 1px; left: 5px;
    width: 4px; height: 9px;
    border-right: 2px solid #FFFFFF;
    border-bottom: 2px solid #FFFFFF;
    transform: rotate(45deg);
}

/* Labels */
label span {
    font-family: 'Roboto', 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    color: #757575 !important;
    letter-spacing: 0.4px !important;
}

.val-label {
    color: #6200EE !important;
    font-size: 14px !important;
    font-weight: 500 !important;
}

/* Validation Warning (Error Red) */
.range-warn.invalid {
    background: transparent !important;
    color: #B00020 !important; /* Material Error */
    font-family: 'Roboto', 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    border: none !important;
    padding: 0 !important;
    margin-left: 8px !important;
}

.clear-btn {
    border: none !important;
    color: #FFFFFF !important;
    background: #B00020 !important;
    border-radius: 4px !important;
    font-family: 'Roboto', 'Inter', sans-serif !important;
    font-weight: 500 !important;
    font-size: 14px !important;
    letter-spacing: 1.25px !important;
    text-transform: uppercase !important;
    padding: 0 16px !important;
    height: 36px !important;
    line-height: 36px !important;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.clear-btn:hover {
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12) !important;
}
.clear-btn:active {
    box-shadow: 0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12) !important;
}
`;

if (!content.includes('/* MATERIAL DESIGN STUDIO PANEL REDESIGN (MANUAL)     */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Material Design CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
