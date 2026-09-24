# Mindmap Architecture Reference

This document describes the exact HTML/CSS/JS structure of the interactive mindmap,
based on the 01_Minimalism template. Every new aesthetic mindmap must follow this architecture.

---

## File Structure

```
XX_Name_Mindmap.html   (single-file, self-contained)
assets/
  fonts/
    fonts.css          (local @font-face declarations)
    *.woff2            (downloaded font files)
  images/
    hero_scene.png
    typography_editorial.png
    color_palette.png
    ui_components.png
    spacing_grid.png
    photography_product.png
    photography_person.png
    photography_place.png
  js/
    jszip.min.js
```

---

## HTML Shell

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[AESTHETIC] Design System — Interactive Mindmap</title>
    <link rel="stylesheet" href="assets/fonts/fonts.css">
    <style>
        /* === ALL CSS HERE (do not use external stylesheets) === */
    </style>
</head>
<body>
    <div class="noise-bg"></div>

    <!-- HEADER BAR -->
    <header class="header">...</header>

    <!-- INTERACTIVE SIDE PANEL -->
    <div id="panel-overlay" class="panel-overlay"></div>
    <div id="interactive-panel" class="interactive-panel">
        <div class="panel-header">...</div>
        <div class="panel-body">
            <!-- Studios injected here -->
        </div>
    </div>

    <!-- TREE CANVAS -->
    <div class="tree-canvas">
        <svg class="connection-canvas" id="connection-canvas"></svg>
        <div class="tree-wrapper">
            <ul class="tree">
                <li class="node root">...</li>
            </ul>
        </div>
    </div>

    <script src="assets/js/jszip.min.js"></script>
    <script>
        /* === ALL JS HERE === */
    </script>
</body>
</html>
```

---

## CSS Architecture (all within `<style>`)

### :root Variables (ADAPT PER AESTHETIC)
```css
:root {
    --bg-color: #FAFAFA;
    --text-color: #1A1A1A;
    --border-color: #E0E0E0;
    --accent-1: #C4674F;      /* Primary accent */
    --accent-2: #1B3A5C;      /* Secondary accent */
    --accent-3: #C9A96E;
    --accent-4: #2D5016;
    --accent-5: #4A6FA5;
    --accent-6: #B87D7D;
    --accent-red: #C0392B;    /* Warning colour — keep red for all aesthetics */
    --panel-width: 0px;       /* Updated dynamically by JS */
}
```

### Noise Background
```css
.noise-bg {
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    background-image: url("data:image/svg+xml,...");  /* inline SVG noise */
    pointer-events: none; z-index: 9999;
}
```

### Page Layout
```css
.header { padding: 40px 48px 24px; max-width: 1400px; margin: 0 auto;
          border-bottom: 1px solid var(--border-color);
          display: flex; justify-content: space-between; align-items: flex-end; }

.header-title h1 { font-family: [HEADLINE_FONT], serif; font-size: 32px;
                   font-weight: [APPROPRIATE_WEIGHT]; }

.tree-canvas { position: relative; padding: 48px 48px 120px; overflow: visible; }

.tree-wrapper { position: relative; z-index: 1; }
```

### Tree Nodes
```css
.tree { list-style: none; padding-left: 32px; }
.tree li { position: relative; padding: 4px 0; }
.node-content {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;           /* 0px for Brutalism, etc. */
    font-size: 13px; cursor: default;
    transition: all 150ms ease;
    white-space: nowrap;
}
.node-content:hover { background: var(--accent-1); color: #fff; }

/* Category nodes (Level 1) */
.category > .node-content { font-weight: 600; font-size: 14px; padding: 10px 18px; }

/* Collapsed state */
.node.collapsed > ul { display: none; }

/* Font capsule nodes */
.font-capsule { display: flex; flex-direction: column; gap: 6px; padding: 12px 16px;
                min-width: 180px; cursor: pointer; }
.font-capsule-preview { font-size: 22px; line-height: 1.2; }
.font-capsule-weights { display: flex; gap: 6px; }
.font-capsule-weights span { font-size: 10px; padding: 2px 6px;
                              border: 1px solid var(--border-color);
                              border-radius: 2px; cursor: pointer; }
.font-capsule-weights span.active { background: var(--text-color); color: var(--bg-color); }

/* Color box nodes */
.tree-color-box { width: 16px; height: 16px; border-radius: 2px;
                  border: 1px solid rgba(0,0,0,0.15); flex-shrink: 0; }

/* Interactive leaf nodes (studio launchers) */
.interactive-leaf > .node-content {
    border-style: dashed; color: var(--accent-1); font-style: italic;
}
.interactive-leaf > .node-content:hover { border-style: solid; }
```

### Connection SVG
```css
.connection-canvas {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 0; overflow: visible;
}
```

### Side Panel
```css
.interactive-panel {
    position: fixed; top: 0; right: 0; height: 100vh;
    background: var(--bg-color); border-left: 1px solid var(--border-color);
    transform: translateX(100%);
    transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1), width 350ms cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1000; display: flex; flex-direction: column; overflow: hidden;
    width: 500px;
}
.interactive-panel.open { transform: translateX(0); }

.panel-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.15);
    opacity: 0; pointer-events: none; z-index: 999;
    transition: opacity 300ms ease;
}
.panel-overlay.active { opacity: 1; pointer-events: all; }

.panel-header {
    padding: 20px 24px; border-bottom: 1px solid var(--border-color);
    display: flex; justify-content: space-between; align-items: center;
    flex-shrink: 0;
}

.panel-body { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

.studio-content { display: none; flex: 1; flex-direction: column; overflow: hidden; padding: 24px; gap: 16px; }
.studio-content.active { display: flex; }
.studio-desc { font-size: 12px; color: #666; line-height: 1.6; }
```

### Typography Studio Layout
```css
.typo-studio-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 32px; height: 100%; align-items: stretch;
}
.typo-controls {
    overflow-y: scroll; scrollbar-width: none;
    display: flex; flex-direction: column; gap: 20px;
}
.typo-controls::-webkit-scrollbar { display: none; }
.typo-preview-panel {
    background: #F5F5F5; border: 1px solid var(--border-color);
    border-radius: 4px; padding: 24px; display: flex;
    justify-content: center; align-items: start; box-sizing: border-box;
}
```

### Control Groups (Sliders & Labels)
```css
.control-group { display: flex; flex-direction: column; gap: 8px; }
.control-group label { display: flex; justify-content: space-between;
                       font-size: 11px; font-weight: 600; text-transform: uppercase;
                       letter-spacing: 0.05em; color: #555; }
.control-group input[type="range"] { width: 100%; cursor: pointer; }
.val-label { font-family: monospace; font-size: 11px;
             background: #F0F0F0; padding: 1px 6px; border-radius: 2px; }
.range-warn { font-size: 10px; font-family: monospace; cursor: help; }
.range-warn.invalid { color: var(--accent-red); }
.range-warn.valid { color: transparent; }
```

### Device Selector (Typography Studio)
```css
.device-selector { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.device-btn { padding: 5px 10px; font-size: 10px; font-weight: 600;
              text-transform: uppercase; letter-spacing: 0.04em;
              border: 1px solid var(--border-color); background: transparent;
              cursor: pointer; border-radius: 2px; transition: all 150ms; }
.device-btn.active { background: var(--text-color); color: var(--bg-color); border-color: var(--text-color); }
```

### Viewport Simulator
```css
.viewport-simulator {
    background: var(--bg-color); border: 1px solid var(--border-color);
    border-radius: 4px; transition: width 300ms cubic-bezier(0.16, 1, 0.3, 1);
    width: 375px; max-width: 100%; padding: 28px; box-sizing: border-box;
}
```

### Color Studio
```css
.color-comparison-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.color-slot { height: 120px; border: 1px solid var(--border-color); border-radius: 4px;
              cursor: pointer; display: flex; align-items: flex-end; padding: 10px 12px; }
.color-slot-label { font-size: 11px; font-family: monospace; background: rgba(255,255,255,0.85);
                    padding: 2px 6px; border-radius: 2px; }
```

---

## JS Architecture

### 1. Connection Drawing Engine

```javascript
function getCategoryColor(node) {
    // Returns a color based on which category branch the node belongs to
    // Map category index → accent color
    const categories = document.querySelectorAll('.tree > li > ul > li.category');
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].contains(node)) {
            const colors = ['var(--accent-1)','var(--accent-2)','var(--accent-3)',
                           'var(--accent-4)','var(--accent-5)','var(--accent-6)',
                           'var(--accent-1)','var(--accent-2)'];
            return colors[i % colors.length];
        }
    }
    return 'var(--border-color)';
}

function drawConnections() {
    const canvas = document.getElementById('connection-canvas');
    canvas.innerHTML = '';
    const canvasRect = canvas.getBoundingClientRect();
    // For each visible child node, draw a cubic bezier path from parent to child
    // See full implementation in 01_Minimalism_Mindmap.html lines 1800–1865
}
```

### 2. Side Panel Management

```javascript
const panel = document.getElementById('interactive-panel');
const overlay = document.getElementById('panel-overlay');
const panelTitle = document.getElementById('panel-title');
const fullscreenBtn = document.getElementById('panel-fullscreen-btn');
let isFullscreen = false;

function openStudio(mode) {
    document.querySelectorAll('.studio-content').forEach(el => el.classList.remove('active'));
    panel.setAttribute('data-mode', mode);

    if (isFullscreen) {
        panel.style.width = '100vw';
    } else {
        const widths = { color: '500px', typo: '900px', anim: '900px',
                         'spacing-borders': '900px', 'ui-comps': '900px',
                         'imagery-texture': '900px' };
        const titles = { color: 'Color Comparison Studio',
                         typo: 'Interactive Typography Studio',
                         anim: 'Animation Demo Studio',
                         'spacing-borders': 'Spacing & Borders Studio',
                         'ui-comps': 'UI Components Sandbox',
                         'imagery-texture': 'Imagery & Texture Lab' };
        panel.style.width = widths[mode] || '500px';
        panelTitle.textContent = titles[mode] || '';
    }

    const content = document.getElementById(`studio-${mode}`);
    if (content) content.classList.add('active');
    panel.style.transform = 'translateX(0)';
    overlay.classList.add('active');
}

function closePanel() {
    panel.style.transform = 'translateX(100%)';
    overlay.classList.remove('active');
}

overlay.addEventListener('click', closePanel);
document.getElementById('panel-close-btn').addEventListener('click', closePanel);
fullscreenBtn.addEventListener('click', () => {
    isFullscreen = !isFullscreen;
    panel.style.width = isFullscreen ? '100vw' : '';
    fullscreenBtn.textContent = isFullscreen ? '⊡' : '⊞';
});
```

### 3. DOMContentLoaded Bindings

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Expand All button
    document.getElementById('expand-all-btn').addEventListener('click', () => {
        document.querySelectorAll('.tree li').forEach(n => n.classList.remove('collapsed'));
        drawConnections();
    });

    // Collapse All button
    document.getElementById('collapse-all-btn').addEventListener('click', () => {
        document.querySelectorAll('.tree li').forEach(n => {
            if (n.querySelector('ul') && !n.classList.contains('root'))
                n.classList.add('collapsed');
        });
        drawConnections();
    });

    // Default collapse deep nodes
    document.querySelectorAll('.node .node .node').forEach(n => {
        if (n.querySelector('ul')) n.classList.add('collapsed');
    });

    // Toggle collapse on click
    document.querySelectorAll('.tree .node-content').forEach(badge => {
        const li = badge.parentElement;
        if (li.querySelector('ul') && !li.classList.contains('root')) {
            badge.addEventListener('click', () => {
                li.classList.toggle('collapsed');
                drawConnections();
            });
        }
    });

    // Color node click → open Color Studio
    document.querySelectorAll('[data-color]').forEach(node => {
        node.addEventListener('click', e => {
            e.stopPropagation();
            openStudio('color');
            // Optional: pre-select the clicked color
        });
    });

    // Font capsule click → open Font Specimen studio
    document.querySelectorAll('.node-font').forEach(node => {
        const fontName = node.getAttribute('data-font');
        const fontLabel = node.querySelector('.font-capsule-name').textContent;
        node.querySelector('.font-capsule').addEventListener('click', e => {
            if (e.target.closest('.font-capsule-weights')) return;
            e.stopPropagation();
            openFontSpecimen(fontName, fontLabel);
        });
    });

    // Interactive leaf nodes → open studios
    document.querySelectorAll('.interactive-leaf').forEach(leaf => {
        const mode = leaf.getAttribute('data-studio');
        leaf.querySelector('.node-content').addEventListener('click', e => {
            e.stopPropagation();
            openStudio(mode);
        });
    });

    // Custom font preview text sync
    // (input is inside Typography branch — see updateTreeFontPreviews function)

    // Color studio setup
    renderColors();

    // Draw connections
    setTimeout(drawConnections, 100);
    window.addEventListener('resize', drawConnections);
});
```

### 4. Validation Helper

```javascript
function validate(id, condition, label) {
    const el = document.getElementById(`warn-${id}`);
    if (!el) return;
    if (condition) {
        el.className = 'range-warn valid';
        el.innerHTML = '';
    } else {
        el.className = 'range-warn invalid';
        el.innerHTML = ' [!]';
        el.title = `Out of recommended range! Spec: ${label}`;
    }
}
```

### 5. Tree Font Preview Sync

```javascript
function updateTreeFontPreviews(val) {
    const text = val.trim() === '' ? 'Aa Bb Cc 123' : val;
    document.querySelectorAll('.font-capsule-preview').forEach(p => p.textContent = text);
}

window.setCapsuleWeight = function(event, el, weight) {
    event.stopPropagation();
    el.parentElement.querySelectorAll('span').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    const preview = el.parentElement.parentElement.querySelector('.font-capsule-preview');
    if (preview) preview.style.fontWeight = weight;
};
```

---

## Tree HTML Skeleton

```html
<ul class="tree">
    <li class="node root">
        <div class="node-content">[AESTHETIC] Design System</div>
        <ul>
            <!-- 🏛️ Ranked Industries -->
            <li class="node category category-industries">
                <div class="node-content">🏛️ Ranked Industries</div>
                <ul>
                    <li><div class="node-content">1. [Industry Name] — [brief reason]</div></li>
                    <!-- ... 10 items total ... -->
                </ul>
            </li>

            <!-- 🎨 Color System -->
            <li class="node category category-color">
                <div class="node-content">🎨 Color System</div>
                <ul>
                    <li><div class="node-content" data-color="#HEX">
                        <span class="tree-color-box" style="background:#HEX;"></span>
                        Color Name (#HEX)
                    </div></li>
                    <!-- ... all colors ... -->
                    <li class="node interactive-leaf" data-studio="color">
                        <div class="node-content">Launch Color Comparison Studio</div>
                    </li>
                </ul>
            </li>

            <!-- 🔤 Typography -->
            <li class="node category category-type">
                <div class="node-content">🔤 Typography</div>
                <ul>
                    <!-- Custom preview input -->
                    <li style="margin-bottom:16px;">
                        <div style="background:var(--bg-color); border:1px solid var(--border-color);
                                    border-radius:4px; padding:12px 16px; display:inline-flex;
                                    flex-direction:column; gap:8px;">
                            <label style="font-size:10px; font-weight:600; text-transform:uppercase;
                                          color:#888; letter-spacing:0.05em;">Preview Text</label>
                            <input type="text" maxlength="32" placeholder="Aa Bb Cc 123"
                                   oninput="updateTreeFontPreviews(this.value)"
                                   style="border:none; border-bottom:1px solid #E0E0E0;
                                          padding:4px 0; font-size:14px; outline:none; width:200px;">
                        </div>
                    </li>

                    <!-- Path A -->
                    <li>
                        <div class="node-content">Path A — [Path Name]</div>
                        <ul>
                            <li class="node node-font" data-font="[FontName]">
                                <div class="node-content font-capsule">
                                    <div class="font-capsule-header">
                                        <span class="font-capsule-name">[FontName]</span>
                                        <span class="font-capsule-spec">[Role e.g. Structural]</span>
                                    </div>
                                    <div class="font-capsule-preview"
                                         style="font-family:'[FontName]';">Aa Bb Cc 123</div>
                                    <div class="font-capsule-weights">
                                        <span onclick="setCapsuleWeight(event,this,'400')" class="active">400</span>
                                        <span onclick="setCapsuleWeight(event,this,'500')">500</span>
                                        <span onclick="setCapsuleWeight(event,this,'600')">600</span>
                                        <span onclick="setCapsuleWeight(event,this,'700')">700</span>
                                    </div>
                                </div>
                            </li>
                            <!-- Repeat for fonts 2 and 3 in this path -->
                        </ul>
                    </li>

                    <!-- Repeat for Path B, Path C -->

                    <!-- Launch Studio -->
                    <li class="node interactive-leaf" data-studio="typo">
                        <div class="node-content">Launch Typography Studio</div>
                    </li>
                </ul>
            </li>

            <!-- Remaining categories follow same pattern -->
        </ul>
    </li>
</ul>
```
