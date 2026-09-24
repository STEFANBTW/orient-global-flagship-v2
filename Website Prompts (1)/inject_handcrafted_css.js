const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/20_Handcrafted_DIY/20_Handcrafted_DIY_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Handcrafted_DIY Design System', '<title>Handcrafted DIY Design System');

const customCSS = `
/* ======================================================= */
/* HANDCRAFTED DIY STUDIO PANEL REDESIGN (MANUAL)          */
/* ======================================================= */

/* The Panel Container (Scrapbook paper look) */
.interactive-panel {
    background: #E3D5CA url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E") !important;
    border-left: 4px dashed #D4A373 !important; /* Stitched edge */
    box-shadow: -15px 0 25px rgba(67, 40, 24, 0.15) !important;
    z-index: 1000 !important;
}

/* The Panel Header (Tape or Stamp effect) */
.panel-header {
    background: rgba(255, 255, 255, 0.4) !important;
    border-bottom: 3px solid #B5C99A !important;
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px !important; /* Hand-drawn box effect */
    padding: 30px 24px !important;
    margin: 16px !important;
    transform: rotate(-1deg) !important; /* Slightly crooked */
    box-shadow: 2px 2px 0 rgba(67, 40, 24, 0.1) !important;
}

.panel-header h2 {
    font-family: 'Patrick Hand', 'Comic Sans MS', cursive, sans-serif !important;
    font-size: 26px !important;
    font-weight: 700 !important;
    color: #432818 !important; /* Dark Brown */
    margin: 0 !important;
    letter-spacing: 1px !important;
}

/* Close Button (Sticker/Stamp look) */
.panel-btn-icon {
    border: 2px solid #432818 !important;
    background: #D4A373 !important;
    color: #432818 !important;
    border-radius: 50% !important;
    padding: 8px !important;
    width: 34px !important;
    height: 34px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Patrick Hand', cursive !important;
    font-size: 18px !important;
    transform: rotate(10deg) !important;
    transition: all 0.3s ease !important;
    box-shadow: 2px 2px 0 rgba(67, 40, 24, 0.2) !important;
}

.panel-btn-icon:hover {
    background: #B5C99A !important;
    transform: rotate(-10deg) scale(1.1) !important;
}

/* Typography Controls / Studio Cards (Scrapbook photos/cards) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: #FDFBF7 !important;
    border: 2px solid #432818 !important;
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px !important; /* Hand-drawn look */
    padding: 24px !important;
    margin: 16px 20px 24px 20px !important;
    box-shadow: 4px 4px 0 rgba(67, 40, 24, 0.15) !important;
    transition: all 0.3s ease !important;
    transform: rotate(0.5deg) !important;
}

.typo-controls:hover, .spacing-card:hover {
    transform: rotate(0deg) translateY(-2px) !important;
    box-shadow: 6px 6px 0 rgba(67, 40, 24, 0.2) !important;
}

/* Alternate rotation for organic feel */
.typo-controls:nth-child(even), .spacing-card:nth-child(even) {
    transform: rotate(-0.5deg) !important;
}

/* Inputs and Selects (Marker lines) */
input[type=text], select, .device-btn {
    border: none !important;
    border-bottom: 2px dashed #432818 !important; /* Dashed underlines like notebook paper */
    border-radius: 0 !important;
    font-family: 'Patrick Hand', 'Comic Sans MS', cursive !important;
    background: transparent !important;
    color: #432818 !important;
    padding: 10px 8px !important;
    font-size: 18px !important;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    background: rgba(181, 201, 154, 0.2) !important; /* Light sage highlight */
}

/* Device Buttons */
.device-btn {
    border: 2px solid #432818 !important;
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px !important;
    padding: 8px 16px !important;
    margin-right: 8px !important;
    font-size: 16px !important;
    transition: all 0.2s ease;
}

.device-btn:hover {
    background: #D4A373 !important;
}

.device-btn.active {
    background: #B5C99A !important;
    color: #432818 !important;
    box-shadow: 2px 2px 0 rgba(67, 40, 24, 0.2) !important;
    transform: scale(1.05) rotate(-2deg);
}

/* Sliders (Drawn lines) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent !important;
    height: 12px !important;
    border-bottom: 2px solid #432818 !important;
    border-radius: 0 !important;
    margin: 20px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    background: #D4A373;
    border: 2px solid #432818;
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; /* Skewed circle */
    cursor: pointer;
    margin-top: -6px;
    box-shadow: 2px 2px 0 rgba(67, 40, 24, 0.2);
    transition: background 0.2s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
    background: #B5C99A;
}

/* Functional Checkboxes (Hand drawn boxes) */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    background: #FDFBF7;
    border: 2px solid #432818;
    border-radius: 4px 6px 3px 5px; /* Wobbly square */
    position: relative;
    cursor: pointer;
}
input[type=checkbox]:checked {
    background: #B5C99A;
}
input[type=checkbox]:checked::after {
    content: 'X';
    position: absolute;
    top: -2px; left: 3px;
    font-family: 'Patrick Hand', cursive;
    font-size: 20px;
    color: #432818;
}

/* Labels */
label span {
    font-family: 'Patrick Hand', cursive !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #86B899 !important;
    letter-spacing: 1px !important;
}

.val-label {
    background: #D4A373 !important;
    color: #432818 !important;
    font-family: 'Patrick Hand', cursive !important;
    padding: 2px 8px !important;
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px !important;
    font-size: 16px !important;
    border: 2px solid #432818 !important;
    box-shadow: 2px 2px 0 rgba(67, 40, 24, 0.2) !important;
}

/* Validation Warning (Marker Scribble) */
.range-warn.invalid {
    background: #E07A5F !important;
    color: #FDFBF7 !important;
    font-family: 'Patrick Hand', cursive !important;
    font-size: 14px !important;
    border: 2px dashed #432818 !important;
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px !important;
    padding: 4px 12px !important;
    transform: rotate(2deg) !important;
}

.clear-btn {
    border: 2px solid #432818 !important;
    color: #432818 !important;
    background: #B5C99A !important;
    border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px !important;
    font-family: 'Patrick Hand', cursive !important;
    font-weight: 700 !important;
    font-size: 20px !important;
    padding: 12px 24px !important;
    box-shadow: 4px 4px 0 rgba(67, 40, 24, 0.2) !important;
    transition: all 0.2s ease !important;
}
.clear-btn:hover {
    background: #D4A373 !important;
    transform: translate(-2px, -2px) rotate(-1deg) !important;
    box-shadow: 6px 6px 0 rgba(67, 40, 24, 0.2) !important;
}
.clear-btn:active {
    transform: translate(2px, 2px) !important;
    box-shadow: 2px 2px 0 rgba(67, 40, 24, 0.2) !important;
}
`;

if (!content.includes('/* HANDCRAFTED DIY STUDIO PANEL REDESIGN (MANUAL)          */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Handcrafted CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
