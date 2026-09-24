const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/16_Art_Deco/16_Art_Deco_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Art_Deco Design System', '<title>Art Deco Design System');

const customCSS = `
/* ======================================================= */
/* ART DECO STUDIO PANEL REDESIGN (MANUAL)                 */
/* ======================================================= */

/* The Panel Container (Midnight Blue with Gold Border) */
.interactive-panel {
    background: #0B132B !important;
    border-left: 6px solid #D4AF37 !important;
    box-shadow: -15px 0 40px rgba(0,0,0,0.8), inset 4px 0 0px #1C2541, inset 6px 0 0px #D4AF37 !important;
    z-index: 1000 !important;
    position: relative;
}

/* The Panel Header (Ornate Double Border) */
.panel-header {
    background: #0B132B !important;
    border-bottom: 2px solid #D4AF37 !important;
    padding: 30px 24px !important;
    position: relative;
}
.panel-header::after {
    content: '';
    position: absolute;
    bottom: -6px; left: 0; width: 100%; height: 1px;
    background: #D4AF37;
}

.panel-header h2 {
    font-family: 'Playfair Display', serif !important;
    font-size: 22px !important;
    font-weight: 700 !important;
    color: #D4AF37 !important; /* Gold */
    text-transform: uppercase !important;
    letter-spacing: 4px !important;
    margin: 0 !important;
    text-align: center;
}

/* Close Button (Geometric Gold Diamond) */
.panel-btn-icon {
    border: 2px solid #D4AF37 !important;
    background: #1C2541 !important;
    color: #D4AF37 !important;
    border-radius: 0 !important;
    width: 32px !important;
    height: 32px !important;
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(45deg);
    transition: all 0.3s ease !important;
}
.panel-btn-icon * {
    transform: rotate(-45deg); /* Counter-rotate the icon inside */
}
.panel-btn-icon:hover {
    background: #D4AF37 !important;
    color: #0B132B !important;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
}

/* Typography Controls / Studio Cards (Layered Borders) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: #1C2541 !important;
    border: 1px solid #D4AF37 !important;
    border-radius: 0 !important;
    padding: 24px !important;
    margin: 20px 16px !important;
    box-shadow: 0 0 0 3px #0B132B, 0 0 0 4px #D4AF37 !important; /* Art Deco double border */
    position: relative;
}

/* Art Deco Corner Ornaments */
.typo-controls::before, .spacing-card::before {
    content: '';
    position: absolute;
    top: 4px; left: 4px; width: 12px; height: 12px;
    border-top: 2px solid #D4AF37;
    border-left: 2px solid #D4AF37;
}
.typo-controls::after, .spacing-card::after {
    content: '';
    position: absolute;
    bottom: 4px; right: 4px; width: 12px; height: 12px;
    border-bottom: 2px solid #D4AF37;
    border-right: 2px solid #D4AF37;
}

/* Inputs and Selects (Classic Gold Outlines) */
input[type=text], select, .device-btn {
    border: 1px solid #D4AF37 !important;
    border-radius: 0 !important;
    font-family: 'Inter', sans-serif !important;
    background: #0B132B !important;
    color: #D4AF37 !important;
    padding: 10px 14px !important;
    font-size: 14px !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    background: #1C2541 !important;
    box-shadow: inset 0 0 0 1px #D4AF37 !important;
}

/* Device Buttons */
.device-btn {
    background: #1C2541 !important;
    border: 1px solid #D4AF37 !important;
    color: rgba(212, 175, 55, 0.5) !important;
    box-shadow: none !important;
}
.device-btn:hover {
    color: #D4AF37 !important;
}
.device-btn.active {
    background: #D4AF37 !important;
    color: #0B132B !important;
}

/* Sliders (Stepped geometric tracks) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent !important;
    height: 12px !important;
    border: 1px solid #D4AF37 !important;
    margin: 20px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 14px;
    background: #D4AF37;
    border: none;
    cursor: pointer;
    margin-top: -7px;
    box-shadow: -2px 0 0 #0B132B, 2px 0 0 #0B132B, -3px 0 0 #D4AF37, 3px 0 0 #D4AF37; /* Stepped thumb */
}

/* Functional Checkboxes */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #0B132B;
    border: 1px solid #D4AF37;
    box-shadow: 0 0 0 2px #1C2541, 0 0 0 3px #D4AF37;
    position: relative;
    cursor: pointer;
    margin: 4px;
}
input[type=checkbox]:checked {
    background: #D4AF37;
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 2px; left: 5px;
    width: 4px; height: 8px;
    border-right: 2px solid #0B132B;
    border-bottom: 2px solid #0B132B;
    transform: rotate(45deg);
}

/* Labels */
label span {
    font-family: 'Playfair Display', serif !important;
    font-size: 11px !important;
    font-weight: 700 !important;
    color: #D4AF37 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
}

.val-label {
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 14px !important;
    font-weight: 300 !important;
    letter-spacing: 1px !important;
}

/* Validation Warning (Ruby Red) */
.range-warn.invalid {
    background: #8B2635 !important;
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 10px !important;
    font-weight: 600 !important;
    border: 1px solid #D4AF37 !important;
    border-radius: 0 !important;
    padding: 4px 10px !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
}

.clear-btn {
    border: 1px solid #D4AF37 !important;
    color: #0B132B !important;
    background: #D4AF37 !important;
    border-radius: 0 !important;
    font-family: 'Playfair Display', serif !important;
    font-weight: 700 !important;
    font-size: 14px !important;
    text-transform: uppercase !important;
    letter-spacing: 3px !important;
    padding: 12px 24px !important;
    box-shadow: 0 0 0 3px #0B132B, 0 0 0 4px #D4AF37 !important;
    transition: all 0.3s ease !important;
    margin-top: 10px !important;
}
.clear-btn:hover {
    background: #0B132B !important;
    color: #D4AF37 !important;
}
`;

if (!content.includes('/* ART DECO STUDIO PANEL REDESIGN (MANUAL)                 */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Art Deco CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
