const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/13_Luxury_High_End/13_Luxury_High_End_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Luxury_High_End Design System', '<title>Luxury High End Design System');

const customCSS = `
/* ======================================================= */
/* LUXURY / HIGH END STUDIO PANEL REDESIGN (MANUAL)        */
/* ======================================================= */

/* The Panel Container (Matte Black) */
.interactive-panel {
    background: #0A0A0A !important;
    border-left: 1px solid rgba(201, 169, 110, 0.3) !important;
    box-shadow: -20px 0 50px rgba(0,0,0,0.9) !important;
    z-index: 1000 !important;
}

/* The Panel Header */
.panel-header {
    background: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    padding: 40px 32px 30px 32px !important;
    text-align: center !important;
}

.panel-header h2 {
    font-family: 'Playfair Display', 'Bodoni MT', serif !important;
    font-size: 20px !important;
    font-weight: 300 !important;
    color: #C9A96E !important; /* Gold */
    text-transform: uppercase !important;
    letter-spacing: 4px !important;
    margin: 0 !important;
}

/* Close Button (Minimalist Gold Ring) */
.panel-btn-icon {
    border: 1px solid rgba(201, 169, 110, 0.3) !important;
    background: transparent !important;
    color: #C9A96E !important;
    border-radius: 50% !important;
    padding: 12px !important;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.panel-btn-icon:hover {
    background: #C9A96E !important;
    color: #0A0A0A !important;
    transform: rotate(90deg) !important;
}

/* Typography Controls / Studio Cards (Matte dark grey cards) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: #111111 !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 0 !important;
    padding: 32px !important;
    margin-bottom: 32px !important;
    box-shadow: none !important;
    transition: border-color 0.4s ease !important;
}

.typo-controls:hover, .spacing-card:hover {
    border-color: rgba(201, 169, 110, 0.3) !important;
}

.typo-controls { padding: 24px 32px !important; }

/* Inputs and Selects (Understated Minimal) */
input[type=text], select, .device-btn {
    border: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 0 !important;
    font-family: 'Inter', sans-serif !important;
    background: transparent !important;
    color: #FFFFFF !important;
    padding: 12px 0 !important;
    font-size: 13px !important;
    letter-spacing: 1px !important;
    transition: all 0.4s ease;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    border-bottom: 1px solid #C9A96E !important;
}

/* Device Buttons */
.device-btn {
    color: rgba(255, 255, 255, 0.5) !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    font-size: 11px !important;
    border-bottom: 1px solid transparent !important;
}

.device-btn:hover {
    color: #FFFFFF !important;
}

.device-btn.active {
    background: transparent !important;
    color: #C9A96E !important;
    border-bottom: 1px solid #C9A96E !important;
}

/* Sliders (Ultra thin gold line) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: rgba(255, 255, 255, 0.1) !important;
    height: 1px !important;
    border: none !important;
    margin: 24px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 12px;
    width: 12px;
    background: #0A0A0A;
    border: 1px solid #C9A96E;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -6px;
    transition: all 0.3s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
    background: #C9A96E;
    transform: scale(1.5);
}

/* Functional Checkboxes */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0;
    position: relative;
    cursor: pointer;
    transition: all 0.4s ease;
}
input[type=checkbox]:checked {
    border-color: #C9A96E;
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 2px; left: 5px;
    width: 3px; height: 8px;
    border-right: 1px solid #C9A96E;
    border-bottom: 1px solid #C9A96E;
    transform: rotate(45deg);
}

/* Labels */
label span {
    font-family: 'Inter', sans-serif !important;
    font-size: 10px !important;
    font-weight: 300 !important;
    color: rgba(255, 255, 255, 0.5) !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
}

.val-label {
    color: #C9A96E !important;
    font-family: 'Playfair Display', serif !important;
    font-size: 16px !important;
    font-style: italic !important;
    font-weight: 400 !important;
    letter-spacing: 0 !important;
}

/* Validation Warning */
.range-warn.invalid {
    background: transparent !important;
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 10px !important;
    font-weight: 300 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 0 !important;
    padding: 4px 12px !important;
}

.clear-btn {
    border: 1px solid #C9A96E !important;
    color: #C9A96E !important;
    background: transparent !important;
    border-radius: 0 !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 300 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    font-size: 11px !important;
    padding: 16px 32px !important;
    transition: all 0.5s ease !important;
}
.clear-btn:hover {
    background: #C9A96E !important;
    color: #0A0A0A !important;
}
`;

if (!content.includes('/* LUXURY / HIGH END STUDIO PANEL REDESIGN (MANUAL)        */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Luxury High End CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
