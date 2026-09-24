const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/12_Organic_Natural/12_Organic_Natural_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Organic_Natural Design System', '<title>Organic Natural Design System');

const customCSS = `
/* ======================================================= */
/* ORGANIC / NATURAL STUDIO PANEL REDESIGN (MANUAL)        */
/* ======================================================= */

/* The Panel Container (Earthy, textured base) */
.interactive-panel {
    background: #F2EBD9 url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E") !important;
    border-left: none !important;
    border-top-left-radius: 40px !important;
    border-bottom-left-radius: 40px !important;
    box-shadow: -10px 0 40px rgba(47, 62, 38, 0.1) !important;
    z-index: 1000 !important;
}

/* The Panel Header */
.panel-header {
    background: transparent !important;
    border-bottom: 1px solid rgba(163, 177, 155, 0.4) !important;
    padding: 32px 24px 24px 32px !important;
}

.panel-header h2 {
    font-family: 'Lora', 'Georgia', serif !important;
    font-size: 24px !important;
    font-weight: 400 !important;
    color: #2F3E26 !important;
    margin: 0 !important;
    letter-spacing: 0.5px !important;
}

/* Close Button (Soft Circle) */
.panel-btn-icon {
    border: 1px solid rgba(163, 177, 155, 0.5) !important;
    background: #F8F5EE !important;
    color: #2F3E26 !important;
    border-radius: 50% !important;
    padding: 10px !important;
    transition: all 0.4s ease !important;
    box-shadow: 0 4px 10px rgba(47, 62, 38, 0.05) !important;
}

.panel-btn-icon:hover {
    background: #A3B19B !important;
    color: #FFFFFF !important;
    transform: scale(1.05) !important;
    border-color: #A3B19B !important;
    box-shadow: 0 8px 15px rgba(163, 177, 155, 0.3) !important;
}

/* Typography Controls / Studio Cards (Soft Pebbles/Leaves) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: #F8F5EE !important;
    border: none !important;
    border-radius: 24px !important;
    padding: 24px !important;
    margin-bottom: 24px !important;
    box-shadow: 0 8px 24px rgba(47, 62, 38, 0.04), 0 2px 8px rgba(47, 62, 38, 0.02) !important;
    transition: transform 0.4s ease, box-shadow 0.4s ease !important;
}

.typo-controls:hover, .spacing-card:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 30px rgba(47, 62, 38, 0.06), 0 4px 12px rgba(47, 62, 38, 0.03) !important;
}

/* Inputs and Selects (Soft Pills) */
input[type=text], select, .device-btn {
    border: 1px solid rgba(163, 177, 155, 0.5) !important;
    border-radius: 20px !important;
    font-family: 'Inter', sans-serif !important;
    background: #FFFFFF !important;
    color: #2F3E26 !important;
    padding: 12px 20px !important;
    font-size: 14px !important;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(47, 62, 38, 0.02) !important;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    border-color: #687B5B !important;
    box-shadow: 0 0 0 4px rgba(104, 123, 91, 0.1) !important;
}

/* Device Buttons */
.device-btn {
    background: transparent !important;
    color: #687B5B !important;
    padding: 8px 16px !important;
    font-weight: 500 !important;
    border-color: #A3B19B !important;
}

.device-btn.active {
    background: #A3B19B !important;
    color: #FFFFFF !important;
    border-color: #A3B19B !important;
    box-shadow: 0 4px 10px rgba(163, 177, 155, 0.3) !important;
}

/* Sliders (Smooth continuous natural tracks) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: #E8E2D2 !important;
    height: 8px !important;
    border-radius: 4px !important;
    border: none !important;
    margin: 16px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    background: #687B5B;
    border: 2px solid #FFFFFF;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -8px;
    box-shadow: 0 4px 8px rgba(104, 123, 91, 0.3);
    transition: transform 0.3s ease, background 0.3s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    background: #2F3E26;
}

/* Functional Checkboxes (Soft leaves) */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    background: #FFFFFF;
    border: 2px solid #A3B19B;
    border-radius: 8px; /* Slightly squircle */
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}
input[type=checkbox]:checked {
    background: #A3B19B;
    border-color: #A3B19B;
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 3px; left: 7px;
    width: 4px; height: 10px;
    border-right: 2px solid #FFFFFF;
    border-bottom: 2px solid #FFFFFF;
    transform: rotate(45deg);
}

/* Labels */
label span {
    font-family: 'Inter', sans-serif !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    color: #687B5B !important;
    letter-spacing: 0.2px !important;
}

.val-label {
    color: #2F3E26 !important;
    font-size: 15px !important;
    font-weight: 600 !important;
}

/* Validation Warning (Terracotta) */
.range-warn.invalid {
    background: #FFF3EB !important;
    color: #D68C45 !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    border: 1px solid rgba(214, 140, 69, 0.3) !important;
    border-radius: 12px !important;
    padding: 4px 10px !important;
}

.clear-btn {
    border: 1px solid rgba(214, 140, 69, 0.5) !important;
    color: #D68C45 !important;
    background: #FFFFFF !important;
    border-radius: 20px !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 600 !important;
    padding: 12px 24px !important;
    transition: all 0.4s ease !important;
}
.clear-btn:hover {
    background: #D68C45 !important;
    color: #FFFFFF !important;
    border-color: #D68C45 !important;
    box-shadow: 0 8px 16px rgba(214, 140, 69, 0.2) !important;
}
`;

if (!content.includes('/* ORGANIC / NATURAL STUDIO PANEL REDESIGN (MANUAL)        */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Organic Natural CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
