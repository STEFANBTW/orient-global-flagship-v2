const fs = require('fs');
const path = 'c:/Users/saade/Documents/SoriKyo/Sorikyo-warehouse/Website Prompts/aesthetics/14_Corporate_Professional/14_Corporate_Professional_Mindmap.html';

let content = fs.readFileSync(path, 'utf8');

content = content.replace('<title>Corporate_Professional Design System', '<title>Corporate Professional Design System');

const customCSS = `
/* ========================================================== */
/* CORPORATE / PROFESSIONAL STUDIO PANEL REDESIGN (MANUAL)    */
/* ========================================================== */

/* The Panel Container (Clean Slate Grey) */
.interactive-panel {
    background: #FFFFFF !important;
    border-left: 1px solid #E2E8F0 !important;
    box-shadow: -10px 0 25px rgba(26, 54, 93, 0.05) !important;
    z-index: 1000 !important;
}

/* The Panel Header */
.panel-header {
    background: #1A365D !important; /* Navy Blue */
    border-bottom: 4px solid #2B6CB0 !important; /* Bright Blue Accent */
    padding: 24px 32px !important;
}

.panel-header h2 {
    font-family: 'Inter', sans-serif !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #FFFFFF !important;
    margin: 0 !important;
    letter-spacing: 0.5px !important;
}

/* Close Button (Professional Subtle) */
.panel-btn-icon {
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    background: rgba(255, 255, 255, 0.1) !important;
    color: #FFFFFF !important;
    border-radius: 4px !important; /* slightly rounded corners */
    padding: 8px 12px !important;
    font-size: 14px !important;
    transition: all 0.2s ease !important;
}

.panel-btn-icon:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
}

/* Typography Controls / Studio Cards (Structured White Cards) */
.typo-controls, .typo-preview-panel, .color-slot, .spacing-card, #texture-canvas, #ui-card-preview, #ui-checklist, #ui-nav-preview {
    background: #FFFFFF !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 6px !important;
    padding: 24px !important;
    margin-bottom: 24px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
    transition: box-shadow 0.2s ease !important;
}

.typo-controls:hover, .spacing-card:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;
}

.typo-controls { background: #F7FAFC !important; padding: 20px 24px !important; border-bottom: 2px solid #E2E8F0 !important; }

/* Inputs and Selects (Clear, Accessible) */
input[type=text], select, .device-btn {
    border: 1px solid #CBD5E0 !important;
    border-radius: 4px !important;
    font-family: 'Inter', sans-serif !important;
    background: #FFFFFF !important;
    color: #2D3748 !important;
    padding: 10px 14px !important;
    font-size: 14px !important;
    transition: all 0.2s ease;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.02) !important;
}

input[type=text]:focus, select:focus {
    outline: none !important;
    border-color: #2B6CB0 !important;
    box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.1) !important;
}

/* Device Buttons */
.device-btn {
    background: #F7FAFC !important;
    color: #4A5568 !important;
    font-weight: 500 !important;
    border-color: #E2E8F0 !important;
}

.device-btn:hover {
    background: #EDF2F7 !important;
}

.device-btn.active {
    background: #EBF8FF !important;
    color: #2B6CB0 !important;
    border-color: #2B6CB0 !important;
    box-shadow: 0 1px 2px rgba(43, 108, 176, 0.1) !important;
}

/* Sliders (Clean, trackable) */
input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: #E2E8F0 !important;
    height: 6px !important;
    border-radius: 3px !important;
    border: none !important;
    margin: 16px 0 !important;
}
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 18px;
    width: 18px;
    background: #2B6CB0;
    border: 2px solid #FFFFFF;
    border-radius: 50%;
    cursor: pointer;
    margin-top: -6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.1s ease;
}
input[type=range]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    background: #1A365D;
}
input[type=range]::-webkit-slider-thumb:active {
    background: #2B6CB0;
    box-shadow: 0 0 0 4px rgba(43, 108, 176, 0.2);
}

/* Functional Checkboxes */
input[type=checkbox] {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #FFFFFF;
    border: 1px solid #CBD5E0;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
}
input[type=checkbox]:checked {
    background: #2B6CB0;
    border-color: #2B6CB0;
}
input[type=checkbox]:checked::after {
    content: '';
    position: absolute;
    top: 2px; left: 5px;
    width: 4px; height: 9px;
    border-right: 2px solid #FFFFFF;
    border-bottom: 2px solid #FFFFFF;
    transform: rotate(45deg);
}

/* Labels */
label span {
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #4A5568 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
}

.val-label {
    color: #1A365D !important;
    font-size: 14px !important;
    font-weight: 700 !important;
}

/* Validation Warning */
.range-warn.invalid {
    background: #FFF5F5 !important;
    color: #C53030 !important;
    font-family: 'Inter', sans-serif !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    border: 1px solid #FEB2B2 !important;
    border-radius: 4px !important;
    padding: 4px 8px !important;
}

.clear-btn {
    border: 1px solid #CBD5E0 !important;
    color: #4A5568 !important;
    background: #FFFFFF !important;
    border-radius: 4px !important;
    font-family: 'Inter', sans-serif !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    padding: 10px 24px !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
}
.clear-btn:hover {
    background: #F7FAFC !important;
    border-color: #A0AEC0 !important;
    color: #2D3748 !important;
}
.clear-btn:active {
    background: #EDF2F7 !important;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05) !important;
}
`;

if (!content.includes('/* CORPORATE / PROFESSIONAL STUDIO PANEL REDESIGN (MANUAL)    */')) {
    content = content.replace('</style>', customCSS + '\n</style>');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Successfully injected custom Corporate CSS.');
} else {
    fs.writeFileSync(path, content, 'utf8');
    console.log('CSS already injected. Updated title.');
}
