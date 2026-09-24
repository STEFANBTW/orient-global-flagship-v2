$path = "c:\Users\saade\Documents\SoriKyo\Sorikyo-warehouse\Website Prompts\aesthetics\15_Bauhaus_Geometric\15_Bauhaus_Geometric_Mindmap.html"
$content = Get-Content -Raw $path
$newStyle = @"
<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap');

:root {
    --bg-color: #FFFFFF;
    --text-color: #000000;
    --border-color: #000000;
    --border-width: 4px;
    --panel-width: 0px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border-radius: 0 !important;
    transition: all 120ms linear !important;
}

body {
    font-family: 'Oswald', 'Arial Narrow', sans-serif;
    background-color: #FFFFFF;
    background-image: linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
    background-size: 32px 32px;
    color: #000000;
    min-height: 100vh;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
}

/* Noise: disable completely */
.noise-bg {
    display: none !important;
}

/* Page Layout */
.header {
    padding: 40px 48px 24px;
    max-width: 1400px;
    margin: 0 auto;
    background: #000000;
    border-bottom: 6px solid #FF0000;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.header-title h1 {
    color: #FFFFFF;
    font-family: 'Oswald';
    font-size: 40px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
}

.header-title p {
    color: #FFFF00;
    font-family: 'Oswald';
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
}

.header-controls {
    display: flex;
    gap: 16px;
}

/* Buttons */
.btn-minimal {
    background: #FF0000;
    border: 3px solid #000000;
    border-radius: 0;
    color: #FFFFFF;
    font-family: 'Oswald';
    text-transform: uppercase;
    letter-spacing: 0.1em;
    box-shadow: 3px 3px 0px #000000;
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
}

.btn-minimal:hover {
    background: #000000;
    border-color: #FF0000;
    box-shadow: 3px 3px 0px #FF0000;
}

/* Ghost buttons */
.btn-minimal-ghost {
    background: #FFFFFF;
    border: 3px solid #000000;
    color: #000000;
    border-radius: 0;
    font-family: 'Oswald';
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
}

.btn-minimal-ghost:hover {
    background: #0000FF;
    color: #FFFFFF;
}

.main {
    padding: 40px 48px;
    max-width: 1400px;
    margin: 0 auto;
    overflow: visible;
}

/* Mindmap container */
.mindmap-container {
    position: relative;
    background: #FFFFFF;
    border: 4px solid #000000;
    border-radius: 0;
    box-shadow: 6px 6px 0px #000000;
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

/* ALL .node-content */
.node-content {
    background: #FFFFFF;
    border: 2px solid #000000;
    border-radius: 0;
    color: #000000;
    font-family: 'Oswald', 'Arial Narrow', sans-serif;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 10px 18px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.node-content:hover {
    background: #000000;
    color: #FFFFFF;
    border-color: #000000;
}

/* Root node */
.node.root > .node-content {
    background: #FF0000;
    border: 4px solid #000000;
    border-radius: 0;
    color: #FFFFFF;
    font-family: 'Oswald';
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 12px 28px;
    box-shadow: 4px 4px 0px #000000;
}
.node.root > .node-content:hover {
    background: #000000;
    color: #FFFFFF;
    border-color: #000000;
}

/* Category nodes */
.node.category-color > .node-content {
    background: #FF0000; border: 3px solid #000000; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;
}
.node.category-type > .node-content {
    background: #0000FF; border: 3px solid #000000; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;
}
.node.category-spacing > .node-content {
    background: #FFFF00; border: 3px solid #000000; color: #000000; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;
}
.node.category-borders > .node-content {
    background: #000000; border: 3px solid #FF0000; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;
}
.node.category-ui > .node-content {
    background: #FF0000; border: 3px solid #000000; color: #FFFF00; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;
}
.node.category-imagery > .node-content {
    background: #FFFFFF; border: 3px solid #000000; color: #0000FF; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;
}
.node.category-anim > .node-content {
    background: #FFFF00; border: 3px solid #0000FF; color: #000000; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;
}
.node.category-avoid > .node-content {
    background: #000000; border: 3px solid #FF0000; color: #FF0000; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;
}

/* Collapse styling */
.tree li.collapsed > ul {
    display: none;
}

.tree-color-box {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 0;
    border: 1px solid #000000;
    vertical-align: middle;
}

/* Interactive-leaf */
.node.interactive-leaf > .node-content {
    background: #FFFF00;
    border: 3px solid #000000;
    color: #000000;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 0;
}
.node.interactive-leaf > .node-content:hover {
    background: #000000;
    color: #FFFF00;
    border-color: #FFFF00;
}

/* Panel */
.panel-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    opacity: 0;
    z-index: 999;
}
.panel-overlay.active {
    pointer-events: none;
    opacity: 0;
}

.interactive-panel {
    position: fixed;
    top: 0; right: 0;
    height: 100vh;
    width: 0; 
    background: #FFFFFF;
    border-left: 6px solid #FF0000;
    box-shadow: none;
    z-index: 1000;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

/* Panel header */
.panel-header {
    padding: 24px 32px;
    background: #000000;
    border-bottom: 4px solid #FF0000;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Panel h2 */
.panel-header h2 {
    color: #FFFFFF;
    font-family: 'Oswald';
    font-size: 20px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
}

.panel-header-buttons {
    display: flex;
    gap: 12px;
}

/* Panel buttons */
.panel-btn-icon {
    border: 3px solid #FFFFFF;
    color: #FFFFFF;
    background: transparent;
    border-radius: 0;
    font-family: 'Oswald';
    text-transform: uppercase;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
}

.panel-btn-icon:hover {
    background: #FF0000;
    border-color: #FF0000;
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
    color: #000000;
    line-height: 1.6;
}

/* Color cards */
.comparison-slots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.color-card {
    background: #FFFFFF;
    border: 3px solid #000000;
    border-radius: 0;
    color: #000000;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
}

.color-card-swatch {
    width: 100%;
    height: 80px;
    border: 3px solid #000000;
}

.color-card-name {
    font-size: 11px;
    font-weight: 700;
    text-align: center;
    word-break: break-word;
}

.color-card-hex {
    font-family: 'Oswald', monospace;
    font-size: 10px;
}

.color-card-remove {
    position: absolute;
    top: 4px; right: 4px;
    background: transparent;
    border: none;
    font-size: 12px;
    color: #000000;
    cursor: pointer;
    font-weight: bold;
}
.color-card-remove:hover {
    color: #FF0000;
}

.clear-btn {
    margin-top: 16px;
    padding: 12px;
    background: #FFFFFF;
    border: 3px solid #000000;
    color: #000000;
    border-radius: 0;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    width: 100%;
}
.clear-btn:hover {
    background: #000000;
    color: #FFFFFF;
}

/* Typo Studio */
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
    background: #FFFFFF;
    border: 3px solid #000000;
    padding: 24px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow-y: auto;
    box-sizing: border-box;
}
.typo-controls::-webkit-scrollbar { display: none; }

.device-selector {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 3px solid #000000;
    padding-bottom: 12px;
    flex-wrap: wrap;
}
.device-btn {
    background: #FFFFFF;
    border: 3px solid #000000;
    padding: 6px 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    color: #000000;
}
.device-btn:hover {
    background: #FF0000;
    color: #FFFFFF;
}
.device-btn.active {
    background: #000000;
    color: #FFFFFF;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.control-group label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    justify-content: space-between;
}

.control-group select, .control-group input[type="text"] {
    padding: 8px 12px;
    border: 3px solid #000000;
    background: #FFFFFF;
    font-family: inherit;
    font-size: 13px;
    outline: none;
    cursor: pointer;
}
.control-group input[type="text"]:focus {
    border-color: #FF0000;
}
.control-group input[type="range"] {
    width: 100%;
    cursor: pointer;
    accent-color: #FF0000;
}

.val-label { font-family: monospace; }
.range-warn { font-size: 11px; font-weight: 700; margin-top: 2px; display: inline-flex; align-items: center; gap: 4px; }
.range-warn.valid { color: #0000FF; }
.range-warn.invalid { color: #FF0000; }

.typo-preview-panel {
    background: #FFFFFF;
    border: 3px solid #000000;
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: start;
    box-sizing: border-box;
}

.viewport-simulator {
    background: #FFFFFF;
    border: 3px solid #000000;
    width: 375px;
    max-width: 100%;
    padding: 28px;
    box-sizing: border-box;
}

.typo-mock-article { display: flex; flex-direction: column; text-align: left; }
.blog-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: var(--preview-caption-spacing, 0.15em); color: #000000; margin-bottom: 12px; }
.blog-headline { font-family: var(--preview-font, 'Oswald'); font-size: var(--preview-h1-size, 84px); font-weight: var(--preview-h1-weight, 700); line-height: var(--preview-h1-height, 1.1); letter-spacing: var(--preview-h1-spacing, -0.02em); color: #000000; margin-bottom: 24px; }
.blog-meta { font-size: 12px; color: #000000; margin-bottom: 16px; font-weight: 700; }
.blog-divider { border: none; border-top: 3px solid #000000; margin-bottom: 24px; }
.blog-paragraph { font-family: 'Oswald', sans-serif; font-size: var(--preview-body-size, 18px); font-weight: 500; line-height: var(--preview-body-height, 1.8); color: #000000; max-width: 680px; }

/* Anim Studio Grid */
.anim-studio-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 12px; }
.anim-studio-box { background: #FFFFFF; border: 3px solid #000000; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.anim-studio-box.warning-box { border-color: #FF0000; }
.anim-studio-box h4 { font-size: 13px; font-weight: 700; color: #000000; }
.anim-studio-box.warning-box h4 { color: #FF0000; }
.anim-spec { font-size: 11px; color: #000000; font-weight: 500; }
.anim-stage { height: 110px; background: #FFFFFF; border: 3px solid #000000; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.flex-stage { gap: 8px; }

.anim-target { padding: 10px 20px; background: #0000FF; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: 3px solid #000000;}
.anim-btn { padding: 6px 12px; background: #FFFFFF; border: 3px solid #000000; color: #000000; cursor: pointer; font-size: 11px; font-weight: 700; width: max-content; }
.anim-btn:hover { background: #FF0000; color: #FFFFFF; }

.anim-target.min-fade { opacity: 1; transition: opacity 120ms linear !important; }
.anim-target.min-fade.triggering { opacity: 0; }
.anim-target.min-slide-up { transform: translateY(0); transition: transform 120ms linear !important; }
.anim-target.min-slide-up.triggering { transform: translateY(40px); }

.anim-pill-stagger { padding: 6px 12px; background: #000000; color: #FFFFFF; font-size: 10px; font-weight: 700; opacity: 0; transform: translateY(10px); border: 2px solid #FFFFFF;}
.anim-pill-stagger.animate { animation: staggerFadeIn 120ms linear forwards; animation-delay: calc(var(--i) * 50ms); }
@keyframes staggerFadeIn { to { opacity: 1; transform: translateY(0); } }

.anim-btn-interactive { padding: 10px 20px; background: #FFFF00; color: #000000; border: 3px solid #000000; font-size: 11px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: background 120ms linear !important; }
.anim-btn-interactive:hover { background: #FF0000; color: #FFFFFF; }

.anim-target.avoid-spring { transform: scale(1); transition: transform 120ms linear !important; }
.anim-target.avoid-spring.triggering { transform: scale(0.2); }

.anim-pill-slow { padding: 6px 12px; background: #FF0000; color: #FFFFFF; font-size: 10px; font-weight: 700; opacity: 0; transform: translateY(10px); border: 2px solid #000000;}
.anim-pill-slow.animate { animation: staggerFadeIn 120ms linear forwards; animation-delay: calc(var(--i) * 120ms); }

.font-capsule { display: flex; flex-direction: column; align-items: stretch; padding: 12px 16px; gap: 6px; min-width: 200px; border: 3px solid #000000; }
.font-capsule-header { display: flex; justify-content: space-between; align-items: center; font-size: 11px; border-bottom: 3px solid #000000; padding-bottom: 4px; font-weight: 700;}
.font-capsule-name { font-weight: 700; color: #000000; }
</style>
"@
$content = $content -replace "(?s)<style>.*?</style>\s*<style>.*?</style>", $newStyle
Set-Content -Path $path -Value $content -Encoding UTF8
