# Studios Implementation Guide

All 7 studios must be implemented in every mindmap. This guide provides the HTML and JS
patterns for each studio. Adapt slider ranges, labels, and validation bounds to the target aesthetic.

---

## Studio 1 — Color Comparison Studio (`studio-color`)

**Panel width:** 500px  
**Trigger:** Click any `[data-color]` node

### HTML
```html
<div id="studio-color" class="studio-content">
    <p class="studio-desc">
        Click any slot below to assign a palette colour, then compare any combination side by side.
    </p>

    <!-- 4-slot comparison grid -->
    <div class="color-comparison-grid" id="color-grid">
        <div class="color-slot" id="slot-0" onclick="cycleColor(0)"
             style="background: [BG_COLOR];">
            <span class="color-slot-label" id="slot-label-0">[BG_COLOR]</span>
        </div>
        <div class="color-slot" id="slot-1" onclick="cycleColor(1)"
             style="background: [TEXT_COLOR];">
            <span class="color-slot-label" id="slot-label-1">[TEXT_COLOR]</span>
        </div>
        <div class="color-slot" id="slot-2" onclick="cycleColor(2)"
             style="background: [ACCENT_1];">
            <span class="color-slot-label" id="slot-label-2">[ACCENT_1]</span>
        </div>
        <div class="color-slot" id="slot-3" onclick="cycleColor(3)"
             style="background: [ACCENT_2];">
            <span class="color-slot-label" id="slot-label-3">[ACCENT_2]</span>
        </div>
    </div>

    <!-- All palette colours as clickable swatches -->
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
        <!-- One per colour in the aesthetic -->
        <div style="width: 40px; height: 40px; background: [HEX]; border-radius: 4px;
                    cursor: pointer; border: 1px solid rgba(0,0,0,0.1);"
             title="[NAME] ([HEX])"
             onclick="assignColorToActive('[HEX]', '[NAME] ([HEX])')"></div>
        <!-- Repeat for all palette colours -->
    </div>

    <!-- Contrast checker output -->
    <div id="contrast-result" style="font-size: 12px; font-family: monospace;
                                      padding: 12px; background: #F5F5F5;
                                      border: 1px solid var(--border-color); border-radius: 4px;">
        Select two slots to check contrast ratio.
    </div>
</div>
```

### JS
```javascript
const aestheticPalette = [
    { hex: '[HEX_1]', name: '[Name 1]' },
    { hex: '[HEX_2]', name: '[Name 2]' },
    // ... all colours from spec
];

let activeSlot = 0;
const slotColors = ['[BG]', '[TEXT]', '[ACCENT1]', '[ACCENT2]'];

function cycleColor(slotIndex) {
    activeSlot = slotIndex;
    document.querySelectorAll('.color-slot').forEach((s, i) => {
        s.style.outline = i === slotIndex ? '3px solid var(--accent-1)' : 'none';
    });
}

function assignColorToActive(hex, label) {
    slotColors[activeSlot] = hex;
    const slot = document.getElementById(`slot-${activeSlot}`);
    const lbl = document.getElementById(`slot-label-${activeSlot}`);
    if (slot) slot.style.background = hex;
    if (lbl) lbl.textContent = label;
    checkContrast();
}

function checkContrast() {
    // Basic luminance contrast between slot-0 and slot-1
    const c1 = slotColors[0], c2 = slotColors[1];
    const lum = hex => {
        const rgb = parseInt(hex.slice(1), 16);
        const r = ((rgb >> 16) & 255) / 255;
        const g = ((rgb >> 8) & 255) / 255;
        const b = (rgb & 255) / 255;
        const sRGB = v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        return 0.2126 * sRGB(r) + 0.7152 * sRGB(g) + 0.0722 * sRGB(b);
    };
    const L1 = lum(c1), L2 = lum(c2);
    const ratio = ((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2);
    const grade = ratio >= 7 ? 'AAA ✓' : ratio >= 4.5 ? 'AA ✓' : ratio >= 3 ? 'AA Large ✓' : 'Fail ✗';
    document.getElementById('contrast-result').innerHTML =
        `Slot 1 vs Slot 2 — Contrast: <strong>${ratio}:1</strong> — WCAG: <strong>${grade}</strong>`;
}

// Called once when Color Studio opens.
// Populates slot backgrounds from the aesthetic's extracted palette.
// Replace the hex/name values with ACCENT_COLORS[] from working memory.
function renderColors() {
    const palette = [
        { hex: BG_COLOR,      name: 'Background' },
        { hex: TEXT_COLOR,    name: 'Text' },
        { hex: ACCENT_1_HEX, name: ACCENT_1_NAME },
        { hex: ACCENT_2_HEX, name: ACCENT_2_NAME }
    ];
    palette.forEach((c, i) => {
        const slot = document.getElementById(`slot-${i}`);
        const lbl  = document.getElementById(`slot-label-${i}`);
        if (slot) { slot.style.background = c.hex; slotColors[i] = c.hex; }
        if (lbl)    lbl.textContent = `${c.name} (${c.hex})`;
    });
    checkContrast();
}
```

---

## Studio 2 — Typography Studio (`studio-typo`)

**Panel width:** 900px  
**Layout:** `typo-studio-layout` grid (350px controls | 1fr preview)

### Device Presets Object (ADAPT RANGES PER AESTHETIC)
```javascript
const deviceSpecs = {
    mobile:  { width: '375px',  maxWidth: '375px',
                presets: { h1Size: [MIN_H1],  bodySize: [MIN_BODY],  bodyHeight: [BODY_LH],
                           captionSize: 11, captionSpacing: 0.12 },
                ranges:  { h1Size: [[MIN_H1], [MAX_H1*0.5]], bodySize: [14, 16] } },
    tablet:  { width: '768px',  maxWidth: '768px',
                presets: { h1Size: [MID_H1],  bodySize: [MID_BODY], bodyHeight: [BODY_LH],
                           captionSize: 12, captionSpacing: 0.12 },
                ranges:  { h1Size: [[MID_H1], [MAX_H1*0.7]], bodySize: [15, 17] } },
    laptop:  { width: '960px',  maxWidth: '100%',
                presets: { h1Size: [LARGE_H1], bodySize: 17, bodyHeight: [BODY_LH],
                           captionSize: 12, captionSpacing: 0.13 },
                ranges:  { h1Size: [[LARGE_H1], [MAX_H1*0.85]], bodySize: [16, 18] } },
    desktop: { width: '1200px', maxWidth: '100%',
                presets: { h1Size: [MAX_H1], bodySize: 18, bodyHeight: [BODY_LH],
                           captionSize: 13, captionSpacing: 0.14 },
                ranges:  { h1Size: [[MAX_H1*0.8], [MAX_H1]], bodySize: [17, 19] } },
    tv:      { width: '1600px', maxWidth: '100%',
                presets: { h1Size: [MAX_H1*1.2], bodySize: 20, bodyHeight: [BODY_LH],
                           captionSize: 14, captionSpacing: 0.15 },
                ranges:  { h1Size: [[MAX_H1], [MAX_H1*1.5]], bodySize: [19, 24] } }
};
```

### HTML Structure Summary
```html
<div id="studio-typo" class="studio-content">
    <p class="studio-desc">...</p>
    <div class="typo-studio-layout">
        <!-- LEFT: Controls -->
        <div class="typo-controls">
            <!-- Device selector -->
            <div class="device-selector">
                <button class="device-btn active" data-device="mobile">📱 Mobile</button>
                <button class="device-btn" data-device="tablet">📟 Tablet</button>
                <button class="device-btn" data-device="laptop">💻 Laptop</button>
                <button class="device-btn" data-device="desktop">🖥️ Desktop</button>
                <button class="device-btn" data-device="tv">📺 TV</button>
            </div>
            <!-- Headline settings group -->
            <div style="font-size:10px; font-weight:700; text-transform:uppercase;
                        letter-spacing:0.08em; color:#888; border-bottom:1px solid var(--border-color);
                        padding-bottom:6px;">Headline Settings</div>
            <!-- H1 font family select -->
            <div class="control-group">
                <label>Headline Font Family</label>
                <select id="family-select-h1">
                    <option value="'[FONT_PATH_A_1]'">[FONT_PATH_A_1]</option>
                    <!-- All path A and B fonts -->
                </select>
            </div>
            <!-- H1 size, weight, line-height, spacing sliders -->
            <!-- Body settings group -->
            <!-- Caption settings group -->
            <!-- Custom preview phrase -->
            <div class="control-group">
                <label>Preview Phrase <span style="color:#999; font-weight:400;">(32 char max)</span></label>
                <input type="text" id="preview-input" maxlength="32"
                       placeholder="Type your headline..." style="...">
            </div>
            <!-- Download fonts button -->
            <button id="download-fonts-btn">⬇ Package Fonts for Offline Use</button>
        </div>

        <!-- RIGHT: Viewport simulator + mock article -->
        <div class="typo-preview-panel" style="overflow:hidden; padding:16px;">
            <div class="viewport-simulator" id="viewport-simulator">
                <article class="typo-mock-article">
                    <span class="blog-label" id="mock-label">Design / Essay</span>
                    <h1 class="blog-headline" id="mock-h1">Aa Bb Cc 123</h1>
                    <p class="blog-body" id="mock-p">The quick brown fox jumps over the lazy dog.
                       A short sample body paragraph demonstrating the selected typeface in a
                       realistic reading context. Spacing and leading are applied in real time.</p>
                    <span class="blog-caption" id="mock-caption">CAPTION LABEL — STYLE GUIDE</span>
                </article>
            </div>
        </div>
    </div>
</div>
```

---

## Studio 3 — Animation Demo Studio (`studio-anim`)

**Panel width:** 900px  
**Content:** 6 demo boxes showing different animation techniques for the aesthetic

### HTML Pattern per Demo Box
```html
<div class="anim-demo-box" onclick="triggerAnim('[id]')">
    <div class="anim-demo-title">[Animation Name]</div>
    <div class="anim-target" id="anim-[id]">[VISUAL ELEMENT]</div>
    <div class="anim-meta">
        <div>Duration: [Xms]</div>
        <div>Easing: [ease-type]</div>
        <div>cubic-bezier: [values]</div>
    </div>
</div>
```

### Animation Box Content — Derived from Spec

Do NOT use pre-written animation types per aesthetic. Instead, after Phase 1 extraction,
use ANIMATION_TYPES[] from the spec to fill the 6 demo boxes in order:

- Box 1 → ANIMATION_TYPES[0]
- Box 2 → ANIMATION_TYPES[1]
- Box 3 → ANIMATION_TYPES[2]
- Box 4 → ANIMATION_TYPES[3]
- Box 5 → ANIMATION_TYPES[4] (or "No transition" if fewer than 5)
- Box 6 → ANIMATION_TYPES[5] (or "Avoid: " + ANIMATION_AVOIDS[0])

Each box label and CSS animation should reflect the actual extracted value.
The avoids box is particularly useful: show the anti-pattern with a red ✗ label.

### JS Pattern
```javascript
window.triggerAnim = function(id) {
    const target = document.getElementById(`anim-${id}`);
    if (target) {
        target.classList.add('triggering');
        void target.offsetWidth; // force reflow
        target.classList.remove('triggering');
    }
};
```

---

## Studio 4 — Spacing & Borders Studio (`studio-spacing-borders`)

**Panel width:** 900px  
**Left controls:** 3 sliders (padding, gap, radius) + 1 checkbox (divider)  
**Right preview:** Two-column content layout with live adjustments

### Slider Defaults by Aesthetic
| Aesthetic | Padding default | Padding valid | Gap default | Radius | Radius valid |
|---|---|---|---|---|---|
| Minimalism | 120px | 80–160px | 80px | 4px | 0–8px |
| Brutalism | 24px | 16–240px | 12px | 0px | 0px only |
| Glassmorphism | 32px | 24–64px | 24px | 16px | 12–24px |
| Neumorphism | 40px | 32–72px | 32px | 20px | 16–32px |
| Maximalism | 48px | 32–80px | 48px | 8px | 4–16px |
| Editorial | 96px | 64–128px | 64px | 0px | 0–4px |

### Reference Image Strip HTML (at bottom of preview panel)
```html
<div style="padding:16px 20px; border-top:1px solid var(--border-color);
             background:#FAFAFA; display:flex; gap:12px; align-items:center;">
    <p style="font-size:10px; font-weight:600; text-transform:uppercase;
               letter-spacing:0.08em; color:#888; margin:0; white-space:nowrap;">Reference</p>
    <img src="assets/images/spacing_grid.png" style="height:56px; width:auto;
          border:1px solid var(--border-color); border-radius:2px; object-fit:cover;">
    <img src="assets/images/hero_scene.png" style="height:56px; width:auto;
          border:1px solid var(--border-color); border-radius:2px; object-fit:cover;">
</div>
```

---

## Studio 5 — UI Components Sandbox (`studio-ui-comps`)

**Panel width:** 900px  
**Left controls:** Checkboxes + select  
**Right preview:** Nav bar + card + button  
**Bottom:** Compliance checklist with ✓/✗

### Compliance Items (adapt rules per aesthetic)
Each row: `id="chk-[rule]"` → JS renders ✓ or ✗ based on toggle state.

```javascript
function chkItem(id, isViolation, okMsg, warnMsg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = isViolation
        ? `<span style="color:#C0392B;font-weight:600;">✗</span>
           <span style="color:#C0392B;">${warnMsg}</span>`
        : `<span style="color:#5E8C61;font-weight:600;">✓</span>
           <span style="color:#5E8C61;">${okMsg}</span>`;
}
```

### Reference Image Strip
```html
<img src="assets/images/ui_components.png" style="height:56px;">
<img src="assets/images/color_palette.png" style="height:56px;">
```

---

## Studio 6 — Imagery & Texture Lab (`studio-imagery-texture`)

**Panel width:** 900px  
**Left controls:** 3 sliders (grayscale/saturation, noise opacity, zoom/focal)  
**Right preview:** Main photo canvas + 6-thumbnail switcher grid

### CSS Placeholder (when images not yet generated)
```html
<div id="preview-photo-target"
     style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;
             background:[BG_VARIATION]; color:var(--border-color); font-size:12px;
             font-family:monospace; letter-spacing:0.1em;">
    <!-- CSS geometric shape for the aesthetic -->
    [AESTHETIC-SPECIFIC CSS SHAPE]
    <!-- e.g., for Brutalism: thick black rectangle grid -->
    <!-- e.g., for Glassmorphism: overlapping blurred circles -->
</div>
```

### When images are available, replace with:
```html
<img id="preview-photo-target"
     src="assets/images/photography_product.png"
     style="width:100%; height:100%; object-fit:cover; filter:grayscale(1);
             transition:filter 300ms ease;">
```

### Thumbnail Switcher Grid (6 images)
```html
<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;">
    <img src="assets/images/photography_product.png"
         onclick="switchPreviewImage(this)"
         style="width:100%; aspect-ratio:1; object-fit:cover;
                 border:2px solid #1A1A1A; cursor:pointer; border-radius:2px;">
    <img src="assets/images/hero_scene.png" onclick="switchPreviewImage(this)"
         style="width:100%; aspect-ratio:1; object-fit:cover;
                 border:1px solid var(--border-color); cursor:pointer; border-radius:2px;">
    <!-- Repeat for all 6 images -->
</div>
```

### Slider Validation per Aesthetic
| Aesthetic | Grayscale valid | Noise valid | Zoom valid |
|---|---|---|---|
| Minimalism | ≥70% | 0–8% | 100–160% |
| Brutalism | any | 20–40% | 100–130% |
| Glassmorphism | 0–30% | 0–5% | 100–150% |
| Maximalism | 0% (full colour) | 0–3% | 100–200% |
| Organic/Natural | 10–40% | 3–8% | 100–140% |
| Luxury | 20–60% | 0–3% | 100–150% |

---

## Studio 7 — Font Specimen Studio (`studio-font-spec`)

**Panel width:** 500px (or full-screen)  
**Trigger:** Click a font capsule in the tree

### HTML
```html
<div id="studio-font-spec" class="studio-content">
    <h2 id="font-spec-name" style="font-size:28px; font-weight:600; margin-bottom:16px;">Inter</h2>

    <!-- Full alphabet specimen -->
    <div id="font-spec-alphabet"
         style="font-size:48px; line-height:1.15; letter-spacing:-0.01em;
                 color:var(--text-color); margin-bottom:24px; word-break:break-all;">
        AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
        0123456789 !@#$%
    </div>

    <!-- Weight selector -->
    <div id="font-spec-weights" style="display:flex; gap:8px; margin-bottom:20px;"></div>

    <!-- Sample sentence -->
    <p id="font-spec-preview-sentence"
       style="font-size:24px; line-height:1.4; color:var(--text-color);">
        The quick brown fox jumps over the lazy dog.
    </p>
</div>
```

### JS
```javascript
function openFontSpecimen(fontName, fontLabel) {
    panel.setAttribute('data-mode', 'font-spec');
    panel.style.width = isFullscreen ? '100vw' : '500px';
    panelTitle.textContent = `${fontLabel} Specimen`;

    document.querySelectorAll('.studio-content').forEach(el => el.classList.remove('active'));
    document.getElementById('font-spec-name').textContent = fontLabel;

    const familyMap = {
        'Inter': "'Inter', sans-serif",
        'Bebas Neue': "'Bebas Neue', sans-serif",
        // ... map all fonts
    };
    const css = familyMap[fontName] || fontName;
    document.getElementById('font-spec-alphabet').style.fontFamily = css;
    document.getElementById('font-spec-preview-sentence').style.fontFamily = css;

    const weightsEl = document.getElementById('font-spec-weights');
    weightsEl.innerHTML = '';
    [400, 500, 600, 700].forEach(w => {
        const btn = document.createElement('button');
        btn.textContent = w;
        if (w === 400) btn.className = 'active';
        btn.addEventListener('click', () => {
            weightsEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.className = 'active';
            document.getElementById('font-spec-preview-sentence').style.fontWeight = w;
        });
        weightsEl.appendChild(btn);
    });
    document.getElementById('font-spec-preview-sentence').style.fontWeight = '400';
    document.getElementById('studio-font-spec').classList.add('active');
    panel.style.transform = 'translateX(0)';
    overlay.classList.add('active');
}
```

---

## Image Switcher + Viewport Scale (shared across all mindmaps)

```javascript
// Image switcher
function switchPreviewImage(thumbnail) {
    const target = document.getElementById('preview-photo-target');
    if (target && target.tagName === 'IMG') {
        target.src = thumbnail.src;
    }
    thumbnail.parentElement.querySelectorAll('img').forEach(img => {
        img.style.border = '1px solid var(--border-color)';
    });
    thumbnail.style.border = '2px solid var(--text-color)';
}

// Viewport auto-scale for wide device sizes inside 900px panel
function applyViewportScale() {
    const sim = document.getElementById('viewport-simulator');
    const panel = document.querySelector('#studio-typo .typo-preview-panel');
    if (!sim || !panel) return;
    const available = panel.offsetWidth - 48;
    const natural = parseFloat(sim.style.width) || available;
    const scale = (!isNaN(natural) && natural > available && !isFullscreen)
        ? available / natural : 1;
    sim.style.transformOrigin = 'top center';
    sim.style.transform = `scale(${scale})`;
    sim.style.marginBottom = scale < 1 ? `${natural * 0.7 * (scale - 1)}px` : '0';
}
window.addEventListener('resize', applyViewportScale);

// Offline font packager
document.getElementById('download-fonts-btn').addEventListener('click', async () => {
    const btn = document.getElementById('download-fonts-btn');
    btn.disabled = true; btn.textContent = 'Packaging…';
    try {
        const zip = new JSZip();
        const cssText = await fetch('assets/fonts/fonts.css').then(r => r.text());
        zip.file('fonts.css', cssText);
        const urls = [...cssText.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)].map(m => m[1]);
        for (const url of urls) {
            const buf = await fetch(`assets/fonts/${url}`).then(r => r.arrayBuffer());
            zip.file(url, buf);
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '[aesthetic]_offline_fonts.zip';
        a.click();
    } catch (e) { alert('Font packaging failed. Check local font files.'); }
    finally { btn.disabled = false; btn.textContent = '⬇ Package Fonts for Offline Use'; }
});
```
