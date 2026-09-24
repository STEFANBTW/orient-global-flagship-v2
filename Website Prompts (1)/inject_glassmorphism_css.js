const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/05_Glassmorphism/05_Glassmorphism_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

const customCSS = `
/* ============================================== */
/* GLASSMORPHISM STUDIO PANEL REDESIGN (MANUAL)   */
/* ============================================== */

/* The Panel Container */
.interactive-panel {
    background: rgba(15, 23, 42, 0.7) !important;
    backdrop-filter: blur(24px) saturate(150%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(150%) !important;
    border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5), inset 1px 0 0 rgba(255,255,255,0.05) !important;
}

/* The Panel Header */
.panel-header {
    background: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.panel-header h2 {
    font-family: 'Inter', sans-serif !important;
    font-size: 20px !important;
    font-weight: 300 !important;
    letter-spacing: 0.1em !important;
    color: #F8FAFC !important;
    background: linear-gradient(90deg, #F8FAFC, rgba(248,250,252,0.5));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.panel-btn-icon {
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    background: rgba(255, 255, 255, 0.05) !important;
    color: #F8FAFC !important;
    border-radius: 50% !important;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
    backdrop-filter: blur(10px) !important;
}

.panel-btn-icon:hover {
    background: rgba(59, 130, 246, 0.2) !important;
    border-color: rgba(59, 130, 246, 0.5) !important;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.4) !important;
}

/* Typography Controls / Studio Cards */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 16px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1) !important;
    background: rgba(255, 255, 255, 0.03) !important;
    backdrop-filter: blur(16px) !important;
}

/* Inputs and Selects */
input[type=text], select, .device-btn {
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 8px !important;
    font-family: 'Inter', sans-serif !important;
    background: rgba(0, 0, 0, 0.2) !important;
    color: #F8FAFC !important;
    padding: 8px 12px !important;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2) !important;
    transition: all 0.3s ease;
}

input[type=text]:focus, select:focus {
    border-color: rgba(59, 130, 246, 0.5) !important;
    background: rgba(0, 0, 0, 0.4) !important;
    outline: none !important;
}

.device-btn.active {
    background: rgba(59, 130, 246, 0.3) !important;
    border-color: rgba(59, 130, 246, 0.6) !important;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3) !important;
}

/* Range Sliders */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    height: 4px !important;
    border-radius: 2px !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border: none !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    background: #3B82F6;
    border: 2px solid #F8FAFC;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -6px;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
    transition: transform 0.2s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

/* Labels */
label span {
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    color: rgba(248, 250, 252, 0.7) !important;
}

.val-label {
    color: #3B82F6 !important;
    font-weight: 600 !important;
}

/* Elegant validation warning */
.range-warn.invalid {
    background: rgba(236, 72, 153, 0.1) !important;
    color: #EC4899 !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    border: 1px solid rgba(236, 72, 153, 0.3) !important;
    border-radius: 6px !important;
    padding: 2px 6px !important;
    box-shadow: 0 0 10px rgba(236, 72, 153, 0.2) !important;
}

.clear-btn {
    border: 1px solid rgba(236, 72, 153, 0.3) !important;
    color: #EC4899 !important;
    background: rgba(236, 72, 153, 0.05) !important;
    border-radius: 8px !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(4px) !important;
}
.clear-btn:hover {
    background: rgba(236, 72, 153, 0.2) !important;
    border-color: rgba(236, 72, 153, 0.6) !important;
    box-shadow: 0 0 15px rgba(236, 72, 153, 0.4) !important;
}

/* Fix text colors inside the preview panels so they are legible against the dark background */
h4, p, span {
    color: #F8FAFC;
}
`;

if (!content.includes('/* GLASSMORPHISM STUDIO PANEL REDESIGN (MANUAL)   */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Glassmorphism CSS.');
} else {
    console.log('CSS already injected.');
}
