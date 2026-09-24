const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/10_Cyberpunk_Dark_Neon/10_Cyberpunk_Dark_Neon_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Cyberpunk_Dark_Neon Design System', '<title>Cyberpunk Dark Neon Design System');

const customCSS = `
/* ======================================================= */
/* CYBERPUNK DARK NEON STUDIO PANEL REDESIGN (MANUAL)      */
/* ======================================================= */

/* The Panel Container */
.interactive-panel {
    background: #0D0E15 !important;
    background-image: linear-gradient(0deg, transparent 24%, rgba(57, 255, 255, 0.05) 25%, rgba(57, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(57, 255, 255, 0.05) 75%, rgba(57, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(57, 255, 255, 0.05) 25%, rgba(57, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(57, 255, 255, 0.05) 75%, rgba(57, 255, 255, 0.05) 76%, transparent 77%, transparent) !important;
    background-size: 50px 50px !important;
    border-left: 2px solid #39FFFF !important;
    box-shadow: -5px 0 20px rgba(57, 255, 255, 0.2), inset 0 0 50px rgba(0,0,0,0.9) !important;
    position: relative;
    z-index: 1000 !important;
}

/* Neon Glow on Border */
.interactive-panel::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: -2px; width: 2px;
    background: #39FFFF;
    box-shadow: 0 0 15px #39FFFF, 0 0 30px #39FFFF;
    z-index: 10;
}

/* The Panel Header */
.panel-header {
    background: linear-gradient(90deg, rgba(57, 255, 255, 0.1), transparent) !important;
    border-bottom: 2px solid #FF007F !important;
    padding: 24px !important;
    box-shadow: 0 5px 15px rgba(255, 0, 127, 0.2) !important;
    position: relative;
}

/* Glitch Accent on Header */
.panel-header::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0; width: 30%; height: 2px;
    background: #39FFFF;
    box-shadow: 0 0 10px #39FFFF;
}

.panel-header h2 {
    font-family: 'Courier New', monospace !important;
    font-size: 22px !important;
    font-weight: 700 !important;
    color: #39FFFF !important;
    text-shadow: 0 0 5px rgba(57,255,255,0.5), 2px 2px 0px rgba(255,0,127,0.5) !important;
    margin: 0 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
}

/* Close Button */
.panel-btn-icon {
    border: 1px solid #FF007F !important;
    background: rgba(255, 0, 127, 0.1) !important;
    color: #FF007F !important;
    border-radius: 0 !important;
    padding: 8px !important;
    box-shadow: 0 0 10px rgba(255,0,127,0.3) !important;
    transition: all 0.2s ease !important;
    clip-path: polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%);
}

.panel-btn-icon:hover {
    background: #FF007F !important;
    color: #0D0E15 !important;
    box-shadow: 0 0 15px #FF007F, 0 0 30px #FF007F !important;
}

/* Typography Controls / Studio Cards */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    border: 1px solid #39FFFF !important;
    background: rgba(13, 14, 21, 0.8) !important;
    box-shadow: inset 0 0 10px rgba(57,255,255,0.1), 0 0 10px rgba(57,255,255,0.1) !important;
    border-radius: 0 !important;
    padding: 20px !important;
    margin-bottom: 24px !important;
    position: relative;
    clip-path: polygon(0 0, 95% 0, 100% 15px, 100% 100%, 5% 100%, 0 calc(100% - 15px));
}

/* Corner Accents on Cards */
.typo-controls::before, .spacing-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 15px; height: 15px;
    border-top: 2px solid #FF007F;
    border-left: 2px solid #FF007F;
}

/* Inputs and Selects */
input[type=text], select, .device-btn {
    border: 1px solid rgba(57,255,255,0.5) !important;
    border-radius: 0 !important;
    font-family: 'Courier New', monospace !important;
    background: rgba(57,255,255,0.05) !important;
    color: #39FFFF !important;
    padding: 10px !important;
    transition: all 0.2s ease;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    border-color: #FF007F !important;
    background: rgba(255,0,127,0.1) !important;
    box-shadow: 0 0 10px rgba(255,0,127,0.5) !important;
}

.device-btn {
    border-color: #39FFFF !important;
    color: #39FFFF !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    font-size: 12px !important;
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

.device-btn.active {
    background: #39FFFF !important;
    color: #0D0E15 !important;
    box-shadow: 0 0 15px #39FFFF !important;
    font-weight: bold !important;
}

/* Sliders */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: rgba(57,255,255,0.2) !important;
    height: 4px !important;
    border: none !important;
    margin: 16px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 10px;
    background: #FF007F;
    border: none;
    cursor: pointer;
    margin-top: -8px;
    box-shadow: 0 0 10px #FF007F, 0 0 20px #FF007F;
    border-radius: 0;
}

/* Checkboxes */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: rgba(57,255,255,0.1);
    border: 1px solid #39FFFF;
    position: relative;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(57,255,255,0.3);
}
input[type=checkbox]:checked {
    background: #FF007F;
    border-color: #FF007F;
    box-shadow: 0 0 10px #FF007F;
}
input[type=checkbox]:checked::after {
    content: 'X';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    color: #0D0E15;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    font-size: 14px;
}

/* Labels */
label span {
    font-family: 'Courier New', monospace !important;
    font-size: 12px !important;
    color: #BD00FF !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    text-shadow: 0 0 5px rgba(189,0,255,0.5) !important;
}

.val-label {
    color: #FF007F !important;
    text-shadow: 0 0 5px rgba(255,0,127,0.5) !important;
    font-weight: bold !important;
}

/* Validation Warning */
.range-warn.invalid {
    background: rgba(255,0,0,0.2) !important;
    color: #FF0000 !important;
    font-family: 'Courier New', monospace !important;
    font-size: 12px !important;
    font-weight: bold !important;
    border: 1px solid #FF0000 !important;
    padding: 2px 8px !important;
    text-transform: uppercase !important;
    box-shadow: 0 0 10px rgba(255,0,0,0.5) !important;
    animation: glitchWarn 0.5s infinite;
}

@keyframes glitchWarn {
    0% { transform: translate(0) }
    20% { transform: translate(-2px, 1px) }
    40% { transform: translate(-1px, -1px) }
    60% { transform: translate(2px, 1px) }
    80% { transform: translate(1px, -1px) }
    100% { transform: translate(0) }
}

.clear-btn {
    border: 1px solid #BD00FF !important;
    color: #BD00FF !important;
    background: rgba(189,0,255,0.1) !important;
    border-radius: 0 !important;
    font-family: 'Courier New', monospace !important;
    font-weight: bold !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    padding: 12px 24px !important;
    box-shadow: 0 0 10px rgba(189,0,255,0.3) !important;
    transition: all 0.2s ease !important;
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}
.clear-btn:hover {
    background: #BD00FF !important;
    color: #0D0E15 !important;
    box-shadow: 0 0 20px #BD00FF, 0 0 40px #BD00FF !important;
}
`;

if (!content.includes('/* CYBERPUNK DARK NEON STUDIO PANEL REDESIGN (MANUAL)      */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Cyberpunk CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
