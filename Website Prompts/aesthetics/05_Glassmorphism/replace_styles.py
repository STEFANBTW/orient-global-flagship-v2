import sys

file_path = r'c:\Users\saade\Documents\SoriKyo\Sorikyo-warehouse\Website Prompts\aesthetics\05_Glassmorphism\05_Glassmorphism_Mindmap.html'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_style = """<style>
/* GLASSMORPHISM DESIGN SYSTEM CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap');

:root {
    --text-primary: #FFFFFF;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', 'Manrope', sans-serif;
    background: linear-gradient(135deg, #4A0E8F 0%, #0057FF 30%, #E91E8C 65%, #00B4D8 100%);
    background-attachment: fixed;
    color: #FFFFFF;
    min-height: 100vh;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
}

.noise-bg {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
}

/* Page Layout */
.header {
    padding: 40px 48px 24px;
    margin: 0 auto;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.2);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.header-title h1 {
    font-family: 'Inter', sans-serif;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #FFFFFF;
    margin-bottom: 6px;
}

.header-title p {
    font-size: 13px;
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: 0.12em;
}

.header-controls {
    display: flex;
    gap: 16px;
}

.btn-minimal, .btn-minimal-ghost {
    padding: 10px 20px;
    background: rgba(255,255,255,0.15);
    color: #FFFFFF;
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: all 300ms ease;
    text-decoration: none;
}

.btn-minimal:hover, .btn-minimal-ghost:hover {
    background: rgba(255,255,255,0.25);
}

.main {
    padding: 40px 48px;
    max-width: 1400px;
    margin: 0 auto;
    overflow: visible;
}

.mindmap-container {
    position: relative;
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 20px;
    padding: 64px;
    margin-bottom: 40px;
    overflow: visible;
    width: max-content;
    min-width: 100%;
    min-height: 600px;
}

#mindmap-svg-canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 1;
}

.tree ul {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0;
    margin: 0;
    list-style: none;
    position: relative;
    z-index: 2;
}

.tree li {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 80px;
    position: relative;
}

.node-content {
    padding: 12px 20px;
    border-radius: 14px;
    cursor: pointer;
    transition: all 300ms ease;
    font-size: 13px;
    font-weight: 500;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.35);
    color: #FFFFFF;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    user-select: none;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.node-content:hover {
    background: rgba(255,255,255,0.22);
    box-shadow: 0 6px 24px rgba(0,0,0,0.3);
}

.node.root > .node-content {
    background: rgba(255,255,255,0.25);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.5);
    color: #FFFFFF;
    font-weight: 700;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.6);
    padding: 16px 28px;
    font-size: 15px;
}

/* Category Accents */
.node.category-color > .node-content { background: rgba(233,30,140,0.15); }
.node.category-type > .node-content { background: rgba(0,87,255,0.15); }
.node.category-spacing > .node-content { background: rgba(74,14,143,0.15); }
.node.category-borders > .node-content { background: rgba(0,180,216,0.15); }
.node.category-industries > .node-content { background: rgba(255,255,255,0.15); }

.tree li.collapsed > ul {
    display: none;
}

.tree-color-box {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.4);
    vertical-align: middle;
}

.node.interactive-leaf > .node-content {
    border: 1px dashed rgba(255,255,255,0.7);
}
.node.interactive-leaf > .node-content:hover {
    background: rgba(255,255,255,0.3);
    border-style: solid;
}

.panel-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: transparent;
    opacity: 0;
    pointer-events: none;
    transition: none;
    z-index: 999;
}
.panel-overlay.active {
    opacity: 0;
    pointer-events: none;
}

.interactive-panel {
    position: fixed;
    top: 0; right: 0;
    height: 100vh;
    width: 0;
    background: rgba(10,22,40,0.7);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-left: 1px solid rgba(255,255,255,0.2);
    color: #FFFFFF;
    z-index: 1000;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    transition: width 350ms cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-header {
    padding: 24px 32px;
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid rgba(255,255,255,0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
}

.panel-header-buttons {
    display: flex;
    gap: 12px;
}

.panel-btn-icon {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 8px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: all 300ms ease;
    color: rgba(255,255,255,0.7);
}

.panel-btn-icon:hover {
    background: rgba(255,255,255,0.15);
    color: #FFFFFF;
}

.panel-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 32px;
}

.studio-content {
    display: none;
    flex-direction: column;
    gap: 24px;
    height: 100%;
}
.studio-content.active {
    display: flex;
}

.studio-desc {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
}

.comparison-slots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.color-card {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    color: #FFFFFF;
}

.color-card-swatch {
    width: 100%;
    height: 80px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.2);
}

.color-card-name {
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    word-break: break-word;
}

.color-card-hex {
    font-family: monospace;
    font-size: 10px;
    color: rgba(255,255,255,0.7);
}

.color-card-remove {
    position: absolute;
    top: 4px; right: 4px;
    background: transparent;
    border: none;
    font-size: 12px;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
}
.color-card-remove:hover {
    color: #FFFFFF;
}

.clear-btn {
    margin-top: 16px;
    padding: 12px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.4);
    color: #FFFFFF;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 300ms ease;
    width: 100%;
}
.clear-btn:hover {
    background: rgba(255,255,255,0.2);
}

.typo-studio-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 32px;
    height: 100%;
    align-items: stretch;
}
@media (max-width: 1024px) {
    .typo-studio-layout { grid-template-columns: 1fr; gap: 20px; }
}

.typo-controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 24px;
}

.device-selector {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 12px;
    flex-wrap: wrap;
}
.device-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 300ms ease;
    color: #FFFFFF;
}
.device-btn.active {
    background: rgba(255,255,255,0.3);
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.control-group label {
    font-size: 12px;
    font-weight: 600;
    color: #FFFFFF;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
}

.control-group select, .control-group input[type="text"] {
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: #FFFFFF;
    font-family: inherit;
    font-size: 13px;
    outline: none;
}

.control-group select option {
    background: #1e1b4b;
    color: #FFFFFF;
}

.control-group input[type="range"] {
    width: 100%;
    cursor: pointer;
    accent-color: rgba(255,255,255,0.8);
}

.val-label {
    font-family: monospace;
    color: rgba(255,255,255,0.7);
    font-weight: 400;
}

.typo-preview-panel {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: start;
}

.viewport-simulator {
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 12px;
    width: 375px;
    max-width: 100%;
    padding: 28px;
    transition: width 300ms ease;
}

.typo-mock-article {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.blog-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
    margin-bottom: 12px;
}

.blog-headline {
    font-family: var(--preview-font, 'Inter', sans-serif);
    font-size: var(--preview-h1-size, 48px);
    font-weight: var(--preview-h1-weight, 700);
    line-height: var(--preview-h1-height, 1.1);
    letter-spacing: var(--preview-h1-spacing, -0.02em);
    color: #FFFFFF;
    margin-bottom: 24px;
}

.blog-meta {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 16px;
}

.blog-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.2);
    margin-bottom: 24px;
}

.blog-paragraph {
    font-family: 'Inter', sans-serif;
    font-size: var(--preview-body-size, 16px);
    font-weight: 400;
    line-height: var(--preview-body-height, 1.6);
    color: rgba(255,255,255,0.9);
}

.anim-studio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
    margin-top: 12px;
}

.anim-studio-box {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.anim-studio-box h4 {
    font-size: 13px;
    font-weight: 600;
    color: #FFFFFF;
}

.anim-spec {
    font-size: 11px;
    color: rgba(255,255,255,0.7);
    line-height: 1.4;
}

.anim-stage {
    height: 110px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.flex-stage { gap: 8px; }

.anim-target {
    padding: 10px 20px;
    background: rgba(255,255,255,0.2);
    color: #FFFFFF;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 500;
    border: 1px solid rgba(255,255,255,0.4);
}

.anim-btn {
    padding: 8px 12px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.4);
    color: #FFFFFF;
    border-radius: 8px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 500;
    transition: all 300ms ease;
    width: max-content;
}
.anim-btn:hover { background: rgba(255,255,255,0.25); }

.anim-target.min-fade {
    opacity: 1;
    transition: opacity 600ms ease-out;
}
.anim-target.min-fade.triggering {
    opacity: 0;
    transition: none;
}

.anim-target.min-slide-up {
    transform: translateY(0);
    transition: transform 300ms ease;
}
.anim-target.min-slide-up.triggering {
    transform: translateY(40px);
    transition: none;
}

.anim-pill-stagger {
    padding: 6px 12px;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.4);
    color: #FFFFFF;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    opacity: 0;
    transform: translateY(10px);
}
.anim-pill-stagger.animate {
    animation: staggerFadeIn 400ms ease forwards;
    animation-delay: calc(var(--i) * 70ms);
}
@keyframes staggerFadeIn {
    to { opacity: 1; transform: translateY(0); }
}

.anim-btn-interactive {
    padding: 10px 20px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.4);
    color: #FFFFFF;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 300ms ease;
}
.anim-btn-interactive:hover {
    background: rgba(255,255,255,0.25);
}

.anim-target.avoid-spring {
    transform: scale(1);
    transition: transform 300ms ease;
}
.anim-target.avoid-spring.triggering {
    transform: scale(0.2);
    transition: none;
}
.anim-pill-slow {
    padding: 6px 12px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    color: #FFFFFF;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
    opacity: 0;
    transform: translateY(10px);
}
.anim-pill-slow.animate {
    animation: staggerFadeIn 500ms ease-out forwards;
    animation-delay: calc(var(--i) * 250ms);
}

.font-capsule {
    display: flex;
    flex-direction: column;
    padding: 12px 16px;
    gap: 6px;
    min-width: 200px;
}
.font-capsule-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 4px;
}
.font-capsule-name { font-weight: 600; color: #FFFFFF; }
.font-capsule-spec { font-size: 9px; color: rgba(255,255,255,0.6); }
.font-capsule-preview {
    font-size: 18px;
    text-align: center;
    padding: 4px 0;
    color: #FFFFFF;
    transition: font-weight 300ms ease;
}
.font-capsule-weights {
    display: flex;
    gap: 6px;
    justify-content: center;
}
.font-capsule-weights span {
    font-size: 9px;
    font-family: monospace;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    cursor: pointer;
    color: rgba(255,255,255,0.8);
    transition: all 300ms ease;
}
.font-capsule-weights span:hover, .font-capsule-weights span.active {
    background: rgba(255,255,255,0.3);
    color: #FFFFFF;
}

.font-spec-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.font-spec-card h3 {
    font-size: 24px;
    font-weight: 600;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 8px;
    color: #FFFFFF;
}
.font-spec-alphabet {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
    word-break: break-all;
}
.font-spec-preview-sentence {
    font-size: 18px;
    line-height: 1.5;
    color: #FFFFFF;
    padding: 12px 0;
    border-top: 1px dashed rgba(255,255,255,0.2);
    border-bottom: 1px dashed rgba(255,255,255,0.2);
}
.font-spec-weight-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.7);
}
.font-spec-weights { display: flex; gap: 8px; }
.font-spec-weights button {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 10px;
    cursor: pointer;
    color: #FFFFFF;
    transition: all 300ms ease;
}
.font-spec-weights button:hover, .font-spec-weights button.active {
    background: rgba(255,255,255,0.3);
}

.typo-group-section {
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 16px;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.typo-group-section h3 {
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    margin-bottom: 4px;
}
.anim-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    font-size: 10px;
    font-family: monospace;
    color: rgba(255,255,255,0.7);
    margin-top: 8px;
}
</style>"""

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if '<style>' in line and start_idx == -1:
        start_idx = i
    if '</style>' in line:
        end_idx = i

if start_idx != -1 and end_idx != -1:
    lines = lines[:start_idx] + [new_style + '\n'] + lines[end_idx+1:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Replaced styles successfully.')
else:
    print('Failed to find <style> tags.')
