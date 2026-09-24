const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/18_Psychedelic_Surrealist/18_Psychedelic_Surrealist_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Psychedelic_Surrealist Design System', '<title>Psychedelic Surrealist Design System');

const customCSS = `
/* ========================================================== */
/* PSYCHEDELIC SURREALIST STUDIO PANEL REDESIGN (MANUAL)      */
/* ========================================================== */

/* The Panel Container (Trippy Wavy Gradients) */
.interactive-panel {
    background: linear-gradient(135deg, #240046 0%, #9D4EDD 50%, #FF007F 100%) !important;
    border-left: 4px solid #FFEA00 !important;
    border-top-left-radius: 60px 20px !important;
    border-bottom-left-radius: 20px 60px !important;
    box-shadow: -10px 0 30px #FF007F, inset 0 0 20px #FF9E00 !important;
    z-index: 1000 !important;
}

/* The Panel Header (Vibrating Colors) */
.panel-header {
    background: transparent !important;
    border-bottom: 3px dashed #FFEA00 !important;
    padding: 30px 24px !important;
    text-align: center !important;
}

.panel-header h2 {
    font-family: 'Comic Sans MS', 'Trebuchet MS', sans-serif !important; /* Funky fallback */
    font-size: 26px !important;
    font-weight: 900 !important;
    color: #FFEA00 !important;
    text-shadow: 2px 2px 0px #FF007F, -2px -2px 0px #9D4EDD !important;
    margin: 0 !important;
    letter-spacing: 2px !important;
    transform: rotate(-2deg);
}

/* Close Button (Wobbly Circle) */
.panel-btn-icon {
    border: 3px solid #FF9E00 !important;
    background: #FF007F !important;
    color: #FFEA00 !important;
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50% !important; /* Organic blob shape */
    padding: 12px !important;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
}

.panel-btn-icon:hover {
    background: #FFEA00 !important;
    color: #FF007F !important;
    border-color: #FF007F !important;
    transform: rotate(45deg) scale(1.2) !important;
    border-radius: 50% !important;
}

/* Typography Controls / Studio Cards (Blobs and vibrant boxes) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: rgba(36, 0, 70, 0.8) !important;
    border: 2px solid #FF9E00 !important;
    border-radius: 30px 10px 30px 10px !important;
    padding: 24px !important;
    margin: 20px 16px !important;
    box-shadow: 6px 6px 0px #9D4EDD !important;
    transition: all 0.3s ease !important;
}

.typo-controls:hover, .spacing-card:hover {
    transform: skew(-2deg, 1deg) scale(1.02) !important;
    box-shadow: -6px 6px 0px #FF007F !important;
    border-color: #FF007F !important;
}

.typo-controls { padding: 20px 24px !important; }

/* Inputs and Selects (Rounded, brightly bordered) */
input[type=text], select, .device-btn {
    border: 2px solid #9D4EDD !important;
    border-radius: 20px !important;
    font-family: 'Inter', sans-serif !important;
    background: #FFEA00 !important;
    color: #240046 !important;
    padding: 10px 16px !important;
    font-size: 14px !important;
    font-weight: 700 !important;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    background: #FF9E00 !important;
    border-color: #FFEA00 !important;
    box-shadow: 0 0 10px #FF9E00 !important;
}

/* Device Buttons */
.device-btn {
    background: transparent !important;
    color: #FFEA00 !important;
    border-color: #FFEA00 !important;
    border-radius: 50px !important;
}

.device-btn:hover {
    background: rgba(255, 234, 0, 0.2) !important;
}

.device-btn.active {
    background: #FF007F !important;
    color: #FFEA00 !important;
    border-color: #FF007F !important;
    box-shadow: 0 0 10px #FF007F !important;
}

/* Sliders (Rainbow track) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: linear-gradient(90deg, #9D4EDD, #FF007F, #FF9E00, #FFEA00) !important;
    height: 12px !important;
    border-radius: 10px !important;
    border: 2px solid #240046 !important;
    margin: 20px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    background: #FFEA00;
    border: 3px solid #FF007F;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -8px;
    box-shadow: 0 0 10px #FF007F;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.3) rotate(15deg);
    background: #FF9E00;
}

/* Functional Checkboxes (Blobby checkboxes) */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    background: #240046;
    border: 2px solid #FFEA00;
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; /* blob */
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
}
input[type=checkbox]:checked {
    background: #FF007F;
    border-color: #FF007F;
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 4px; left: 8px;
    width: 4px; height: 10px;
    border-right: 3px solid #FFEA00;
    border-bottom: 3px solid #FFEA00;
    transform: rotate(45deg);
}

/* Labels */
label span {
    font-family: 'Inter', sans-serif !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    color: #FF9E00 !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
}

.val-label {
    background: #9D4EDD !important;
    color: #FFEA00 !important;
    padding: 2px 8px !important;
    border-radius: 10px !important;
    font-size: 14px !important;
    font-weight: 800 !important;
    border: 1px solid #FFEA00 !important;
}

/* Validation Warning */
.range-warn.invalid {
    background: #FF007F !important;
    color: #FFEA00 !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 800 !important;
    border: 2px dashed #FFEA00 !important;
    border-radius: 15px !important;
    padding: 6px 12px !important;
    text-transform: uppercase !important;
    animation: pulse 1s infinite alternate;
}

@keyframes pulse {
    from { transform: scale(1); }
    to { transform: scale(1.05); }
}

.clear-btn {
    border: 2px solid #FFEA00 !important;
    color: #FFEA00 !important;
    background: #9D4EDD !important;
    border-radius: 30px !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 900 !important;
    font-size: 16px !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    padding: 12px 24px !important;
    box-shadow: 4px 4px 0px #FF007F !important;
    transition: all 0.2s ease !important;
}
.clear-btn:hover {
    background: #FF007F !important;
    color: #FFEA00 !important;
    box-shadow: -4px -4px 0px #9D4EDD !important;
    transform: translate(2px, 2px);
}
`;

if (!content.includes('/* PSYCHEDELIC SURREALIST STUDIO PANEL REDESIGN (MANUAL)      */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Psychedelic CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
