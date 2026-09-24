const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/03_Editorial/03_Editorial_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

// Fix title issue left over from templating
content = content.replace('<title>Brutalism Design System', '<title>Editorial Design System');
content = content.replace('Brutalism Design System - Interactive', 'Editorial Design System - Interactive');

const customCSS = `
/* ========================================= */
/* EDITORIAL STUDIO PANEL REDESIGN (MANUAL)  */
/* ========================================= */

/* The Panel Container */
.interactive-panel {
    background: #FAFAFA !important;
    border-left: 1px solid #E2DDD5 !important;
    box-shadow: -15px 0 30px rgba(0,0,0,0.03) !important;
}

/* The Panel Header */
.panel-header {
    background: #FAFAFA !important;
    border-bottom: 1px solid #111111 !important;
    padding: 32px 40px !important;
}

.panel-header h2 {
    font-family: 'Playfair Display', 'Cormorant Garamond', serif !important;
    font-size: 32px !important;
    font-weight: 400 !important;
    font-style: italic !important;
    letter-spacing: 0.02em !important;
    color: #111111 !important;
}

.panel-btn-icon {
    border: 1px solid #E2DDD5 !important;
    border-radius: 50% !important;
    width: 36px !important;
    height: 36px !important;
    background: transparent !important;
    color: #111111 !important;
    font-weight: 300 !important;
    transition: all 0.3s ease !important;
}

.panel-btn-icon:hover {
    background: #111111 !important;
    color: #FFFFFF !important;
    border-color: #111111 !important;
}

/* Typography Controls / Studio Cards */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas {
    border: none !important;
    border-top: 1px solid #E2DDD5 !important;
    border-bottom: 1px solid #E2DDD5 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: #FFFFFF !important;
    padding: 24px 0 !important;
    margin-bottom: -1px !important;
}

.typo-controls { padding: 32px 40px !important; border:none !important; }
.typo-preview-panel { border:none !important; border-left: 1px solid #E2DDD5 !important; padding: 40px !important;}

/* Inputs and Selects */
input[type=text], select, .device-btn {
    border: none !important;
    border-bottom: 1px solid #111111 !important;
    border-radius: 0 !important;
    font-family: 'Georgia', serif !important;
    background: transparent !important;
    padding: 8px 0 !important;
    color: #111111 !important;
}

.device-btn {
    border: 1px solid #E2DDD5 !important;
    padding: 6px 16px !important;
    border-radius: 20px !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 11px !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
}

.device-btn.active {
    border-color: #111111 !important;
    background: #111111 !important;
    color: #FFFFFF !important;
}

/* Range Sliders (Editorial) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    height: 20px !important;
    border: none !important;
    margin: 12px 0;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 12px;
    width: 12px;
    background: #111111;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -5px;
    border: 1px solid #111111;
}
input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 1px;
    cursor: pointer;
    background: #E2DDD5;
}

/* Labels */
label span {
    font-family: 'Inter', sans-serif !important;
    font-size: 11px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.1em !important;
    color: #666666 !important;
}

.val-label {
    font-family: 'Georgia', serif !important;
    font-size: 14px !important;
    font-style: italic !important;
    color: #111111 !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
}

/* Elegant validation warning */
.range-warn.invalid {
    background: transparent !important;
    color: #8B2335 !important;
    font-size: 11px !important;
    font-family: 'Inter', sans-serif !important;
    font-style: italic !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
    border: none !important;
    padding-left: 8px !important;
    border-left: 2px solid #8B2335 !important;
}

.clear-btn {
    border: 1px solid #8B2335 !important;
    color: #8B2335 !important;
    background: transparent !important;
    font-family: 'Georgia', serif !important;
    font-style: italic !important;
    font-size: 14px !important;
    transition: all 0.3s ease !important;
}
.clear-btn:hover {
    background: #8B2335 !important;
    color: #FFFFFF !important;
}
`;

if (!content.includes('/* EDITORIAL STUDIO PANEL REDESIGN (MANUAL)  */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Editorial CSS and fixed title.');
} else {
    // Just run the title fix if it wasn't done
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected, ran title fix.');
}
