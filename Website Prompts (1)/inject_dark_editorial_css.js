const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/19_Dark_Mode_Editorial/19_Dark_Mode_Editorial_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Dark_Mode_Editorial Design System', '<title>Dark Mode Editorial Design System');

const customCSS = `
/* ======================================================= */
/* DARK MODE EDITORIAL STUDIO PANEL REDESIGN (MANUAL)      */
/* ======================================================= */

/* The Panel Container (Matte Dark) */
.interactive-panel {
    background: #0F0F0F !important;
    border-left: 1px solid #222222 !important;
    box-shadow: -30px 0 60px rgba(0,0,0,0.8) !important;
    z-index: 1000 !important;
}

/* The Panel Header (Understated Elegance) */
.panel-header {
    background: transparent !important;
    border-bottom: 1px solid #222222 !important;
    padding: 48px 40px 32px 40px !important;
    text-align: left !important;
}

.panel-header h2 {
    font-family: 'Playfair Display', 'Lora', serif !important;
    font-size: 24px !important;
    font-weight: 400 !important;
    font-style: italic !important;
    color: #B8860B !important; /* Goldenrod */
    letter-spacing: 1px !important;
    margin: 0 !important;
}

/* Close Button (Fine lines) */
.panel-btn-icon {
    border: none !important;
    background: transparent !important;
    color: #777777 !important;
    border-radius: 0 !important;
    padding: 8px !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 300 !important;
    font-size: 20px !important;
    transition: color 0.4s ease !important;
}

.panel-btn-icon:hover {
    color: #E0E0E0 !important;
}

/* Typography Controls / Studio Cards (Matte Dark Grey, no border) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: #141414 !important;
    border: 1px solid #1A1A1A !important;
    border-radius: 0 !important;
    padding: 32px 40px !important;
    margin-bottom: 2px !important; /* Extremely tight stack, almost flush */
    box-shadow: none !important;
    transition: background 0.4s ease !important;
}

.typo-controls:hover, .spacing-card:hover {
    background: #181818 !important;
}

/* Inputs and Selects (Minimalist Underscores) */
input[type=text], select, .device-btn {
    border: none !important;
    border-bottom: 1px solid #333333 !important;
    border-radius: 0 !important;
    font-family: 'Inter', sans-serif !important;
    background: transparent !important;
    color: #E0E0E0 !important;
    padding: 12px 0 !important;
    font-size: 13px !important;
    font-weight: 300 !important;
    letter-spacing: 0.5px !important;
    transition: all 0.4s ease;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    border-bottom: 1px solid #B8860B !important;
    color: #B8860B !important;
}

/* Device Buttons */
.device-btn {
    color: #555555 !important;
    margin-right: 16px !important;
    padding: 8px 0 !important;
    text-transform: lowercase !important;
}

.device-btn:hover {
    color: #AAAAAA !important;
}

.device-btn.active {
    color: #E0E0E0 !important;
    border-bottom: 1px solid #E0E0E0 !important;
}

/* Sliders (Extremely thin) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: #222222 !important;
    height: 1px !important;
    border: none !important;
    margin: 24px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 12px;
    width: 12px;
    background: #0F0F0F;
    border: 1px solid #B8860B;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -6px;
    transition: background 0.3s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
    background: #B8860B;
}

/* Functional Checkboxes (Fine squares) */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: transparent;
    border: 1px solid #555555;
    border-radius: 0;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}
input[type=checkbox]:checked {
    border-color: #B8860B;
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 2px; left: 4px;
    width: 3px; height: 6px;
    border-right: 1px solid #B8860B;
    border-bottom: 1px solid #B8860B;
    transform: rotate(45deg);
}

/* Labels */
label span {
    font-family: 'Inter', sans-serif !important;
    font-size: 11px !important;
    font-weight: 400 !important;
    color: #777777 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
}

.val-label {
    color: #E0E0E0 !important;
    font-family: 'Playfair Display', serif !important;
    font-size: 15px !important;
    font-weight: 400 !important;
    font-style: italic !important;
}

/* Validation Warning */
.range-warn.invalid {
    background: transparent !important;
    color: #B8860B !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 11px !important;
    font-weight: 400 !important;
    border: 1px solid #B8860B !important;
    border-radius: 0 !important;
    padding: 4px 12px !important;
    letter-spacing: 1px !important;
}

.clear-btn {
    border: 1px solid #333333 !important;
    color: #999999 !important;
    background: transparent !important;
    border-radius: 0 !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 300 !important;
    font-size: 12px !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    padding: 16px 32px !important;
    transition: all 0.4s ease !important;
}
.clear-btn:hover {
    background: #B8860B !important;
    border-color: #B8860B !important;
    color: #0F0F0F !important;
}
`;

if (!content.includes('/* DARK MODE EDITORIAL STUDIO PANEL REDESIGN (MANUAL)      */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Dark Editorial CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
