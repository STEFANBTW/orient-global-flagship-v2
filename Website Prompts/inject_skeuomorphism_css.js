const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/07_Skeuomorphism/07_Skeuomorphism_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

const customCSS = `
/* ============================================== */
/* SKEUOMORPHISM STUDIO PANEL REDESIGN (MANUAL)   */
/* ============================================== */

/* The Panel Container (Leather Base) */
.interactive-panel {
    background: #2E231B url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E") !important;
    border-left: 6px solid #1A130F !important;
    box-shadow: inset 8px 0 15px rgba(255,255,255,0.05), inset 0 0 50px rgba(0,0,0,0.8), -20px 0 40px rgba(0,0,0,0.8) !important;
    position: relative;
}

/* Stitched border effect */
.interactive-panel::after {
    content: '';
    position: absolute;
    top: 10px; bottom: 10px; left: 10px; right: 10px;
    border: 1px dashed rgba(255,255,255,0.15);
    border-radius: 4px;
    pointer-events: none;
    z-index: 10;
}

/* The Panel Header (Metallic Plate) */
.panel-header {
    background: linear-gradient(180deg, #3A3A3A 0%, #1F1F1F 100%) !important;
    border-bottom: 2px solid #000000 !important;
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.2), 0 5px 15px rgba(0,0,0,0.8) !important;
    margin: 10px 10px 20px 10px !important;
    border-radius: 6px !important;
    position: relative;
    padding: 24px !important;
}

/* Screws in corners of the metallic plate */
.panel-header::before, .panel-header::after {
    content: '';
    position: absolute;
    width: 8px; height: 8px;
    background: radial-gradient(circle, #888 0%, #333 100%);
    border-radius: 50%;
    box-shadow: inset 0 -1px 2px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.2);
}
.panel-header::before { top: 12px; left: 12px; }
.panel-header::after { top: 12px; right: 12px; }

.panel-header h2 {
    font-family: 'Playfair Display', serif !important;
    font-size: 24px !important;
    font-weight: 700 !important;
    color: #E0E0E0 !important;
    text-shadow: 0 -1px 1px #000, 0 1px 1px rgba(255,255,255,0.3) !important;
    text-align: center !important;
}

/* Metallic Button */
.panel-btn-icon {
    border: 1px solid #000 !important;
    background: linear-gradient(180deg, #444 0%, #222 100%) !important;
    color: #AA7C11 !important;
    border-radius: 50% !important;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.3), 0 3px 5px rgba(0,0,0,0.6) !important;
    text-shadow: 0 -1px 1px #000 !important;
}

.panel-btn-icon:hover {
    background: linear-gradient(180deg, #555 0%, #333 100%) !important;
    transform: translateY(-1px) !important;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 5px 8px rgba(0,0,0,0.7) !important;
}

.panel-btn-icon:active {
    background: linear-gradient(180deg, #222 0%, #444 100%) !important;
    transform: translateY(1px) !important;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.1) !important;
}

/* Typography Controls / Studio Cards (Inset Panels) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    border: 1px solid #1A130F !important;
    border-radius: 8px !important;
    background: #241A14 !important;
    box-shadow: inset 0 5px 15px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.1) !important;
    margin: 10px !important;
}

.typo-controls { padding: 24px !important; }

/* Inputs and Selects (Engraved/Inset) */
input[type=text], select, .device-btn {
    border: 1px solid #111 !important;
    border-radius: 4px !important;
    font-family: 'Courier New', monospace !important;
    background: #1A130F !important;
    color: #F5EBE0 !important;
    padding: 10px !important;
    box-shadow: inset 0 3px 6px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.1) !important;
    text-shadow: 0 1px 1px #000 !important;
}

.device-btn {
    background: linear-gradient(180deg, #444 0%, #222 100%) !important;
    border: 1px solid #000 !important;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5) !important;
    text-shadow: 0 -1px 1px #000 !important;
    border-radius: 20px !important;
}

.device-btn.active {
    background: linear-gradient(180deg, #111 0%, #222 100%) !important;
    box-shadow: inset 0 3px 6px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.1) !important;
    color: #AA7C11 !important;
    text-shadow: 0 0 5px rgba(170,124,17,0.5) !important;
}

/* Physical Sliders */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: #111 !important;
    height: 14px !important;
    border: 1px solid #000 !important;
    border-radius: 7px !important;
    box-shadow: inset 0 2px 5px rgba(0,0,0,1), 0 1px 1px rgba(255,255,255,0.1) !important;
    margin: 16px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 28px;
    width: 28px;
    background: radial-gradient(circle at 30% 30%, #E6E6E6, #888);
    border: 2px solid #555;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.8), inset 0 -2px 5px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.8);
}

/* Physical Checkboxes */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: #111;
    border: 1px solid #000;
    border-radius: 4px;
    box-shadow: inset 0 3px 6px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.1);
    position: relative;
    cursor: pointer;
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 4px; left: 4px; right: 4px; bottom: 4px;
    background: radial-gradient(circle at 30% 30%, #FFD700, #AA7C11);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(170,124,17,0.8), inset 0 1px 2px rgba(255,255,255,0.5);
}

/* Labels (Brass Plates) */
label span {
    font-family: 'Playfair Display', serif !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #AA7C11 !important;
    text-shadow: 0 -1px 1px #000 !important;
}

.val-label {
    background: #111 !important;
    padding: 2px 8px !important;
    border-radius: 4px !important;
    border: 1px solid #000 !important;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.1) !important;
    color: #F5EBE0 !important;
    font-family: 'Courier New', monospace !important;
}

/* Red LED Warning */
.range-warn.invalid {
    background: #300 !important;
    color: #F00 !important;
    font-family: 'Courier New', monospace !important;
    font-size: 12px !important;
    font-weight: bold !important;
    border: 1px solid #000 !important;
    border-radius: 4px !important;
    padding: 2px 8px !important;
    box-shadow: inset 0 0 10px rgba(255,0,0,0.5), 0 0 15px rgba(255,0,0,0.8) !important;
    text-shadow: 0 0 5px #F00 !important;
}

.clear-btn {
    border: 1px solid #000 !important;
    color: #F00 !important;
    background: linear-gradient(180deg, #551111 0%, #220000 100%) !important;
    border-radius: 6px !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 700 !important;
    padding: 12px 24px !important;
    box-shadow: inset 0 1px 2px rgba(255,100,100,0.3), 0 3px 5px rgba(0,0,0,0.8) !important;
    text-shadow: 0 -1px 1px #000 !important;
}
.clear-btn:hover {
    background: linear-gradient(180deg, #661111 0%, #330000 100%) !important;
}
.clear-btn:active {
    background: linear-gradient(180deg, #220000 0%, #440000 100%) !important;
    box-shadow: inset 0 3px 6px rgba(0,0,0,0.9) !important;
    transform: translateY(1px);
}
`;

if (!content.includes('/* SKEUOMORPHISM STUDIO PANEL REDESIGN (MANUAL)   */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Skeuomorphism CSS.');
} else {
    console.log('CSS already injected.');
}
