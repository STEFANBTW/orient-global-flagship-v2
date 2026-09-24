const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/04_Maximalism/04_Maximalism_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

const customCSS = `
/* ========================================= */
/* MAXIMALISM STUDIO PANEL REDESIGN (MANUAL) */
/* ========================================= */

/* The Panel Container */
.interactive-panel {
    background: linear-gradient(135deg, #1E0A30, #4A0E8F) !important;
    border-left: 6px double #D4AF37 !important;
    box-shadow: -20px 0 50px rgba(233,30,140,0.3) !important;
    position: relative;
    overflow: hidden;
}

/* Background overlay texture in the panel */
.interactive-panel::before {
    content: '';
    position: absolute;
    top:0; left:0; right:0; bottom:0;
    background-image: radial-gradient(circle at 80% 20%, rgba(204,26,74,0.4) 0%, transparent 50%),
                      radial-gradient(circle at 20% 80%, rgba(0,180,216,0.3) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
}

/* The Panel Header */
.panel-header {
    background: rgba(30,10,48,0.8) !important;
    backdrop-filter: blur(10px) !important;
    border-bottom: 4px solid #D4AF37 !important;
    padding: 30px !important;
    position: relative;
    box-shadow: 0 10px 20px rgba(0,0,0,0.5) !important;
}

.panel-header h2 {
    font-family: 'Playfair Display', serif !important;
    font-size: 34px !important;
    font-weight: 900 !important;
    font-style: italic !important;
    background: linear-gradient(90deg, #D4AF37, #F0D58C, #D4AF37);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    letter-spacing: 0.05em !important;
}

.panel-btn-icon {
    border: 2px solid #D4AF37 !important;
    border-radius: 50% !important;
    background: linear-gradient(45deg, #CC1A4A, #E91E8C) !important;
    color: #FFFFFF !important;
    box-shadow: 0 0 10px rgba(233,30,140,0.5) !important;
}

.panel-btn-icon:hover {
    transform: rotate(90deg) scale(1.1) !important;
    box-shadow: 0 0 20px rgba(233,30,140,0.8) !important;
}

/* Typography Controls / Studio Cards */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas {
    border: 3px solid #D4AF37 !important;
    border-radius: 20px 0 20px 0 !important;
    box-shadow: 8px 8px 0px rgba(204,26,74,0.6) !important;
    background: rgba(10,22,40,0.8) !important;
    backdrop-filter: blur(5px);
}

.typo-controls { padding: 30px !important; }

/* Inputs and Selects */
input[type=text], select, .device-btn {
    border: 2px solid #E91E8C !important;
    border-radius: 12px !important;
    font-family: 'Inter', sans-serif !important;
    background: rgba(30,10,48,0.6) !important;
    color: #F0D58C !important;
    padding: 10px !important;
    font-weight: 600 !important;
}

.device-btn {
    border-color: #00B4D8 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.1em !important;
}

.device-btn.active {
    background: linear-gradient(45deg, #00B4D8, #4A0E8F) !important;
    border-color: #F0D58C !important;
    color: #FFFFFF !important;
    box-shadow: 0 0 15px rgba(0,180,216,0.6) !important;
}

/* Range Sliders */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    height: 16px !important;
    border: 2px solid #E91E8C !important;
    border-radius: 8px;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    background: radial-gradient(circle, #F0D58C, #D4AF37);
    border: 2px solid #1E0A30;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -6px;
    box-shadow: 0 0 10px rgba(212,175,55,0.8);
}
input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: rgba(233,30,140,0.3);
    border-radius: 6px;
}

/* Labels */
label span {
    font-family: 'Playfair Display', serif !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    color: #D4AF37 !important;
    letter-spacing: 0.05em !important;
}

.val-label {
    font-family: 'Inter', sans-serif !important;
    font-size: 14px !important;
    color: #00B4D8 !important;
    background: rgba(0,180,216,0.1) !important;
    padding: 2px 8px !important;
    border-radius: 8px !important;
}

/* Elegant validation warning */
.range-warn.invalid {
    background: linear-gradient(45deg, #CC1A4A, #E85D04) !important;
    color: #FFFFFF !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 800 !important;
    border: 2px solid #F0D58C !important;
    border-radius: 8px !important;
    padding: 4px 10px !important;
    box-shadow: 0 0 15px rgba(204,26,74,0.8) !important;
    animation: pulse 1s infinite alternate;
}

@keyframes pulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.05); }
}

.clear-btn {
    border: 2px solid #00B4D8 !important;
    color: #00B4D8 !important;
    background: rgba(0,180,216,0.1) !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    border-radius: 12px !important;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}
.clear-btn:hover {
    background: #00B4D8 !important;
    color: #1E0A30 !important;
    transform: scale(1.05) !important;
    box-shadow: 0 0 20px rgba(0,180,216,0.6) !important;
}
`;

if (!content.includes('/* MAXIMALISM STUDIO PANEL REDESIGN (MANUAL) */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Maximalism CSS.');
} else {
    console.log('CSS already injected.');
}
