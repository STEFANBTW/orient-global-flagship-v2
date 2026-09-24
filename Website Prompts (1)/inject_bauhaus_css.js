const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/15_Bauhaus_Geometric/15_Bauhaus_Geometric_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Bauhaus_Geometric Design System', '<title>Bauhaus Geometric Design System');

const customCSS = `
/* ======================================================= */
/* BAUHAUS GEOMETRIC STUDIO PANEL REDESIGN (MANUAL)        */
/* ======================================================= */

/* The Panel Container (Strict Geometry) */
.interactive-panel {
    background: #F5F3E9 !important;
    border-left: 4px solid #000000 !important;
    box-shadow: none !important;
    z-index: 1000 !important;
}

/* The Panel Header */
.panel-header {
    background: #D62828 !important; /* Bauhaus Red */
    border-bottom: 4px solid #000000 !important;
    padding: 30px 24px !important;
    display: flex;
    justify-content: space-between;
}

.panel-header h2 {
    font-family: 'Futura', 'Helvetica Neue', 'Inter', sans-serif !important;
    font-size: 24px !important;
    font-weight: 800 !important;
    color: #FFFFFF !important;
    margin: 0 !important;
    text-transform: uppercase !important;
    letter-spacing: -1px !important;
}

/* Close Button (Perfect Circle) */
.panel-btn-icon {
    border: 4px solid #000000 !important;
    background: #003049 !important; /* Bauhaus Blue */
    color: #FFFFFF !important;
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease !important;
}

.panel-btn-icon:hover {
    background: #FFB703 !important; /* Bauhaus Yellow */
    color: #000000 !important;
}

/* Typography Controls / Studio Cards (Solid Color Blocks) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: #FFFFFF !important;
    border: 4px solid #000000 !important;
    border-radius: 0 !important;
    padding: 24px !important;
    margin: 16px !important;
    box-shadow: 8px 8px 0px #003049 !important;
    transition: transform 0.2s ease !important;
}

.typo-controls:hover, .spacing-card:hover {
    transform: translate(2px, 2px) !important;
    box-shadow: 6px 6px 0px #003049 !important;
}

.typo-controls { background: #FDF0D5 !important; border-color: #000000 !important; box-shadow: 8px 8px 0px #D62828 !important; }

/* Inputs and Selects (Stark Rectangles) */
input[type=text], select, .device-btn {
    border: 3px solid #000000 !important;
    border-radius: 0 !important;
    font-family: 'Futura', 'Helvetica Neue', 'Inter', sans-serif !important;
    background: #FFFFFF !important;
    color: #000000 !important;
    padding: 12px 16px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    background: #FFB703 !important; /* Yellow highlight on focus */
}

/* Device Buttons */
.device-btn {
    background: #FFFFFF !important;
    color: #000000 !important;
    text-transform: uppercase !important;
    box-shadow: 4px 4px 0px #000000 !important;
    margin-right: 8px !important;
}

.device-btn:hover {
    background: #003049 !important;
    color: #FFFFFF !important;
}

.device-btn.active {
    background: #D62828 !important;
    color: #FFFFFF !important;
    box-shadow: 2px 2px 0px #000000 !important;
    transform: translate(2px, 2px);
}

/* Sliders (Thick lines, bold circles) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: #000000 !important;
    height: 8px !important;
    border-radius: 0 !important;
    border: none !important;
    margin: 20px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    background: #FFB703; /* Bauhaus Yellow */
    border: 4px solid #000000;
    border-radius: 50%; /* Pure Geometry: Circle */
    cursor: pointer;
    margin-top: -8px;
    transition: background 0.2s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
    background: #D62828; /* Bauhaus Red */
}

/* Functional Checkboxes (Pure Geometry: Square) */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: #FFFFFF;
    border: 3px solid #000000;
    border-radius: 0;
    position: relative;
    cursor: pointer;
}
input[type=checkbox]:checked {
    background: #003049; /* Bauhaus Blue */
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 3px; left: 6px;
    width: 4px; height: 10px;
    border-right: 3px solid #FFFFFF;
    border-bottom: 3px solid #FFFFFF;
    transform: rotate(45deg);
}

/* Labels */
label span {
    font-family: 'Futura', 'Helvetica Neue', 'Inter', sans-serif !important;
    font-size: 14px !important;
    font-weight: 800 !important;
    color: #000000 !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
}

.val-label {
    background: #000000 !important;
    color: #FFFFFF !important;
    padding: 2px 8px !important;
    font-size: 16px !important;
    font-weight: 800 !important;
}

/* Validation Warning (Red Alert Block) */
.range-warn.invalid {
    background: #D62828 !important;
    color: #FFFFFF !important;
    font-family: 'Futura', 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 800 !important;
    border: 3px solid #000000 !important;
    border-radius: 0 !important;
    padding: 6px 12px !important;
    text-transform: uppercase !important;
}

.clear-btn {
    border: 4px solid #000000 !important;
    color: #000000 !important;
    background: #FFB703 !important; /* Bauhaus Yellow */
    border-radius: 0 !important;
    font-family: 'Futura', 'Inter', sans-serif !important;
    font-weight: 800 !important;
    font-size: 16px !important;
    text-transform: uppercase !important;
    padding: 12px 24px !important;
    box-shadow: 6px 6px 0px #000000 !important;
    transition: all 0.2s ease !important;
}
.clear-btn:hover {
    background: #D62828 !important; /* Red */
    color: #FFFFFF !important;
}
.clear-btn:active {
    box-shadow: 2px 2px 0px #000000 !important;
    transform: translate(4px, 4px) !important;
}
`;

if (!content.includes('/* BAUHAUS GEOMETRIC STUDIO PANEL REDESIGN (MANUAL)        */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Bauhaus CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
