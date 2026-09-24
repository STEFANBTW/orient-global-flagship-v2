const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/02_Brutalism/02_Brutalism_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

const customCSS = `
/* ========================================= */
/* BRUTALISM STUDIO PANEL REDESIGN (MANUAL)  */
/* ========================================= */

/* The Panel Container */
.interactive-panel {
    background: #FFFFFF !important;
    border-left: 8px solid #000000 !important;
    box-shadow: none !important;
}

/* The Panel Header */
.panel-header {
    background: #FFE600 !important;
    color: #000000 !important;
    border-bottom: 8px solid #000000 !important;
}

.panel-header h2 {
    font-family: 'JetBrains Mono', 'Courier New', monospace !important;
    font-size: 24px !important;
    font-weight: 900 !important;
    text-transform: uppercase !important;
    letter-spacing: -0.05em !important;
    color: #000000 !important;
}

.panel-btn-icon {
    border: 4px solid #000000 !important;
    color: #000000 !important;
    background: #FFFFFF !important;
    border-radius: 0 !important;
}

.panel-btn-icon:hover {
    background: #FF0000 !important;
    color: #FFFFFF !important;
}

/* Typography Controls / Studio Cards */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas {
    border: 4px solid #000000 !important;
    border-radius: 0 !important;
    box-shadow: 6px 6px 0px #000000 !important;
    background: #FFFFFF !important;
}

/* Range Sliders (Brutal) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    border: 4px solid #000000 !important;
    height: 32px !important;
    margin: 8px 0;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 32px;
    width: 24px;
    background: #000000;
    cursor: pointer;
    border-radius: 0;
}
input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: #FFE600;
}

/* Red flashing validation warning */
.range-warn.invalid {
    background: #FF0000 !important;
    color: #FFFFFF !important;
    padding: 2px 8px !important;
    font-weight: 900 !important;
    font-family: 'JetBrains Mono', monospace !important;
    border: 2px solid #000000 !important;
    animation: flash 0.3s step-end infinite;
}

@keyframes flash {
    0% { background: #FF0000; color: #FFFFFF; }
    50% { background: #000000; color: #FF0000; }
    100% { background: #FF0000; color: #FFFFFF; }
}

/* Make sure all inputs have 0 border radius and thick borders */
input[type=text], .device-btn {
    border: 3px solid #000000 !important;
    border-radius: 0 !important;
    font-family: 'JetBrains Mono', monospace !important;
    text-transform: uppercase !important;
    font-weight: 800 !important;
}

.device-btn.active {
    background: #000000 !important;
    color: #FFFFFF !important;
}

/* Hide hairline dividers */
#spacing-hairline {
    background: #000000 !important;
    width: 4px !important;
}

.clear-btn {
    border: 4px solid #FF0000 !important;
    color: #FF0000 !important;
    background: #FFFFFF !important;
    font-family: 'Bebas Neue', sans-serif !important;
    font-size: 20px !important;
    box-shadow: 4px 4px 0px #FF0000 !important;
}
.clear-btn:hover {
    background: #FF0000 !important;
    color: #FFFFFF !important;
    box-shadow: 0px 0px 0px #FF0000 !important;
    transform: translate(4px, 4px);
}
`;

if (!content.includes('/* BRUTALISM STUDIO PANEL REDESIGN (MANUAL)  */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Brutalism CSS.');
} else {
    console.log('CSS already injected.');
}
