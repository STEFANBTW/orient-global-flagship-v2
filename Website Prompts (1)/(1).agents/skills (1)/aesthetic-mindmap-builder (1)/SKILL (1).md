---
name: aesthetic-mindmap-builder
description: >
  Builds a complete interactive HTML mindmap for any of the 20 web design aesthetic
  families in the SoriKyo project. Reads the spec MD file, creates the folder structure,
  downloads fonts and JS assets, generates illustration images (or writes an image-prompts
  fallback file if the quota is exhausted), and produces a fully-wired interactive mindmap
  matching the 01_Minimalism template. Use this skill whenever the user asks to build,
  create, or continue a mindmap for any aesthetic (Brutalism, Glassmorphism, Maximalism, etc.).
---

# Aesthetic Mindmap Builder

The 01_Minimalism mindmap is the **master template**. Every new aesthetic mindmap is that
same file with its design tokens, content, and assets swapped to match the new aesthetic.
Do not reinvent the structure — adapt it.

---

## Aesthetic Family Index

| # | Folder Name | Spec File | Status |
|---|---|---|---|
| 01 | 01_Minimalism | 01_MINIMALISM.md | ✅ DONE |
| 02 | 02_Brutalism | 02_BRUTALISM.md | ✅ DONE |
| 03 | 03_Editorial | 03_EDITORIAL.md | ✅ DONE |
| 04 | 04_Maximalism | 04_MAXIMALISM.md | ✅ DONE |
| 05 | 05_Glassmorphism | 05_GLASSMORPHISM.md | ✅ DONE |
| 06 | 06_Neumorphism | 06_NEUMORPHISM.md | ✅ DONE |
| 07 | 07_Skeuomorphism | 07_SKEUOMORPHISM.md | ✅ DONE |
| 08 | 08_Flat_Design | 08_FLAT_DESIGN.md | ✅ DONE |
| 09 | 09_Material_Design | 09_MATERIAL_DESIGN.md | ✅ DONE |
| 10 | 10_Cyberpunk_Dark_Neon | 10_CYBERPUNK_DARK_NEON.md | ✅ DONE |
| 11 | 11_Vaporwave_Y2K | 11_VAPORWAVE_Y2K_RETRO_FUTURISM.md | ✅ DONE |
| 12 | 12_Organic_Natural | 12_ORGANIC_NATURAL.md | ✅ DONE |
| 13 | 13_Luxury_High_End | 13_LUXURY_HIGH_END.md | ✅ DONE |
| 14 | 14_Corporate_Professional | 14_CORPORATE_PROFESSIONAL.md | ✅ DONE |
| 15 | 15_Bauhaus_Geometric | 15_BAUHAUS_GEOMETRIC.md | ✅ DONE |
| 16 | 16_Art_Deco | 16_ART_DECO.md | ✅ DONE |
| 17 | 17_Swiss_International | 17_SWISS_INTERNATIONAL_STYLE.md | ✅ DONE |
| 18 | 18_Psychedelic_Surrealist | 18_PSYCHEDELIC_SURREALIST.md | ✅ DONE |
| 19 | 19_Dark_Mode_Editorial | 19_DARK_MODE_DARK_EDITORIAL.md | ✅ DONE |
| 20 | 20_Handcrafted_DIY | 20_HANDCRAFTED_DIY.md | ✅ DONE |

**Workspace root:** `c:\Users\saade\Documents\SoriKyo\Sorikyo-warehouse\Website Prompts`

---

## Phase 0 — Identify Target

1. Identify the aesthetic from user input or context. Map to the index above.
2. Set these variables for the rest of the run:
   - `$NUM` = e.g. `02`
   - `$NAME` = e.g. `Brutalism`
   - `$FOLDER` = e.g. `02_Brutalism`
   - `$BASE` = `Website Prompts\aesthetics\$FOLDER`

---

## Phase 0B — Find the Spec (check in order, stop at first hit)

```powershell
$root = "c:\Users\saade\Documents\SoriKyo\Sorikyo-warehouse\Website Prompts"

# Check A — MD file in Landing Page Prompts\Aesthetic Families Prompts
$specA = "$root\Landing Page Prompts\Aesthetic Families Prompts\${NUM}_${NAME}.md"
# (also try uppercase variant e.g. 02_BRUTALISM.md — the files use ALL CAPS names)

# Check B — specs.md inside 20 AES Spec subfolder
$specB = "$root\aesthetics\20 AES Spec\$FOLDER\specs.md"

# Check C — any Word doc matching the aesthetic name
$specC = Get-ChildItem -Recurse $root -Include "*.docx","*.doc" |
         Where-Object { $_.Name -match $NAME } | Select-Object -First 1
```

- **Hit A or B** → Read it with `view_file`. See Phase 1A.
- **Hit C** → Extract text. See Phase 1B.
- **No hits** → Generate from knowledge and confirm with user. See Phase 1C.

---

## Phase 1A — Extract from Existing MD

Read the full file. The files in `Aesthetic Families Prompts/` are structured as landing-page
builder prompts. Extract **only** from the Design System section:

Look for: `### A. SYNTHESIZED DESIGN TOKENS`, `### COLOR`, `### TYPOGRAPHY`,
`### SPACING & LAYOUT`, `### BORDERS`, `### UI COMPONENTS`, `### IMAGERY & TEXTURE`,
`### ANIMATION & MOTION`

Ignore everything under `## Component Architecture` and `## Build Sequence` — those are
for a different purpose.

Extract into working memory (see token schema at bottom of this file). → Go to Phase 2.

---

## Phase 1B — Extract from Word Document

```powershell
# Try Word COM object first (requires Word installed)
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Open($specC.FullName)
    $text = $doc.Content.Text
    $doc.Close(); $word.Quit()
} catch {
    # Fallback: read raw XML from the docx zip
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($specC.FullName)
    $entry = $zip.Entries | Where-Object { $_.Name -eq "document.xml" }
    $reader = New-Object System.IO.StreamReader($entry.Open())
    $xml = $reader.ReadToEnd(); $reader.Close(); $zip.Dispose()
    $text = $xml -replace '<[^>]+>', ' ' -replace '\s+', ' '
}
$text | Out-File "$env:TEMP\spec_temp.txt" -Encoding UTF8
```

Then `view_file` on `$env:TEMP\spec_temp.txt`. Extract per Phase 1A schema. → Go to Phase 2.

---

## Phase 1C — No Source: Generate and Confirm

Generate the spec from your knowledge of the aesthetic. Present it to the user in this
format and **wait for confirmation before proceeding**:

```
No spec file found for [NAME]. Here is what I'll use — correct anything:

BACKGROUND:   [HEX] — [plain description]
TEXT:         [HEX]
ACCENTS:      [HEX] [Name], [HEX] [Name], [HEX] [Name]
BORDER:       [width] solid [HEX]
CORNER RADIUS:[value]
HEADLINE FONT:[font name] — Path A fonts: [f1, f2, f3] — Path B: [f1, f2, f3]
BODY FONT:    [font name]
H1 SIZE:      [range]px  LINE-HEIGHT: [range]  SPACING: [value]
BODY SIZE:    [range]px  LINE-HEIGHT: [range]
SECTION PAD:  [range]px  COLUMN GAP: [range]px
NOISE:        [opacity range]%
PHOTO STYLE:  [description]
AVOIDS:       [comma-separated list]
INDUSTRIES:   1.[X] 2.[Y] 3.[Z] ... 10.[Z]

Reply OK to proceed or correct anything above.
```

After confirmation, save the spec:
```
Website Prompts/Aesthetic Families Prompts/[NUM]_[NAME_UPPERCASE].md
```
→ Go to Phase 2.

---

## Phase 2 — Create Folder Structure

```powershell
$base = "c:\Users\saade\Documents\SoriKyo\Sorikyo-warehouse\Website Prompts\aesthetics\$FOLDER"
New-Item -ItemType Directory -Force "$base\assets\fonts"
New-Item -ItemType Directory -Force "$base\assets\images"
New-Item -ItemType Directory -Force "$base\assets\js"
```

---

## Phase 3 — Download Assets

See `references/asset_checklist.md` for the generic font download function and the
exact font list for each aesthetic.

**Always download JSZip regardless of aesthetic:**
```powershell
Invoke-WebRequest "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" `
  -OutFile "$base\assets\js\jszip.min.js"
```

**Font download — use the generic function in asset_checklist.md**, passing the font names
from the extracted spec (FONT_PATH_A, FONT_PATH_B, BODY_FONT, HEADLINE_FONT).
The function outputs `fonts.css` into `$base\assets\fonts\`.

---

## Phase 4 — Generate Images

Construct all 8 prompts dynamically using the live spec tokens.
See `references/image_prompts_bank.md` for the template for each image type.

**The 8 required images:**
| Filename | Subject |
|---|---|
| `hero_scene.png` | Atmospheric wide shot embodying the aesthetic |
| `typography_editorial.png` | Headline + body font in an editorial layout |
| `color_palette.png` | Swatch card with exact hex labels |
| `ui_components.png` | Buttons, nav, card in the aesthetic style |
| `spacing_grid.png` | Layout diagram illustrating spacing rules |
| `photography_product.png` | Product styled to the aesthetic |
| `photography_person.png` | Person photographed to match the aesthetic |
| `photography_place.png` | Location or architecture that fits the aesthetic |

After generating each image, copy it from the artifact directory to the assets folder:
```powershell
Copy-Item "ARTIFACT_PATH\FILENAME.png" "$base\assets\images\FILENAME.png"
```

**If `generate_image` returns 429 (quota exceeded) on any image:**
1. Record which images succeeded and which were blocked
2. Write `$base\image_prompts_fallback.md` with all 8 constructed prompts and their status
3. Continue to Phase 5 — do not stop

---

## Phase 5 — Build the HTML Mindmap

**Output file:** `$base\$NUM_$NAME_Mindmap.html`
e.g. `aesthetics\02_Brutalism\02_Brutalism_Mindmap.html`

**Method:** Use the 01_Minimalism mindmap as the literal base. Adapt it by changing:

### What to change (aesthetic-specific)
| Element | Change to |
|---|---|
| `<title>` | `[NAME] Design System — Interactive Mindmap` |
| `:root` CSS variables | Extracted BG, TEXT, BORDER, ACCENT colours |
| `font-family` on `body` | BODY_FONT |
| `font-family` on `h1` in header | HEADLINE_FONT |
| `border-radius` on `.node-content` | CORNER_RADIUS |
| `border` on `.node-content` | BORDER_WIDTH |
| All font capsule entries | FONT_PATH_A, FONT_PATH_B, FONT_PATH_C fonts |
| All colour swatch nodes `[data-color]` | ACCENT_COLORS with correct hex values |
| Ranked Industries branch | RANKED_INDUSTRIES (10 items) |
| Studio slider ranges (min/max/default) | Extracted spec ranges |
| Studio validation thresholds | Extracted spec ranges (for [!] alerts) |
| Image references in Imagery Lab | `assets/images/FILENAME.png` |
| Animation demo box content | ANIMATION_TYPES for this aesthetic |
| UI compliance checklist items | Aesthetic's specific rules from AVOIDS |
| `noise-bg` SVG opacity | Derived from NOISE_OPACITY |

### What stays identical (do not change)
- All JS logic: connection drawing, panel open/close, font specimen, image switcher,
  weight picker, device selector, viewport auto-scale, font packager, validation helper
- Panel HTML structure and all 7 studio layouts
- Tree HTML structure (branches, capsule pattern, interactive leaf pattern)
- Custom text input in Typography branch
- Expand All / Collapse All / Fullscreen controls

### Colour Studio — fix renderColors()
The colour studio must populate its slots on open. Use this pattern:

```javascript
function renderColors() {
    // Populate slots with aesthetic's palette on first open
    const palette = [
        { hex: '[BG_COLOR]', name: 'Background' },
        { hex: '[TEXT_COLOR]', name: 'Text' },
        { hex: '[ACCENT_1_HEX]', name: '[ACCENT_1_NAME]' },
        { hex: '[ACCENT_2_HEX]', name: '[ACCENT_2_NAME]' }
    ];
    palette.forEach((c, i) => {
        const slot = document.getElementById(`slot-${i}`);
        const lbl = document.getElementById(`slot-label-${i}`);
        if (slot) { slot.style.background = c.hex; slotColors[i] = c.hex; }
        if (lbl) lbl.textContent = `${c.name} (${c.hex})`;
    });
    checkContrast();
}
```

---

## Phase 6 — Serve and Verify

```powershell
# Ensure live-server is running on port 8080
# If not running, start it:
Start-Process powershell -ArgumentList "-NoExit", "-Command",
  "npx --yes live-server 'c:\Users\saade\Documents\SoriKyo\Sorikyo-warehouse\Website Prompts' --port=8080 --no-browser"
```

Open in browser: `http://127.0.0.1:8080/aesthetics/$FOLDER/$NUM_${NAME}_Mindmap.html`

**Final checks:**
- [ ] CSS variables reflect the correct aesthetic colours
- [ ] All font capsules render the right local font
- [ ] Custom text input syncs to all capsules
- [ ] All 7 studios open and close correctly
- [ ] Sliders show [!] alerts when out of spec range
- [ ] Image switcher in Imagery Lab works
- [ ] `image_prompts_fallback.md` written if quota was hit

---

## Token Schema (working memory)

```
AESTHETIC_NAME         plain name e.g. Brutalism
BG_COLOR               hex
TEXT_COLOR             hex
BORDER_COLOR           hex
BORDER_WIDTH           e.g. 3px–6px solid
ACCENT_COLORS[]        array of {hex, name} — up to 6
HEADLINE_FONT          font name
BODY_FONT              font name
MONO_FONT              font name or null
FONT_PATH_A[]          3 font names
FONT_PATH_B[]          3 font names
FONT_PATH_C[]          3 font names or empty
RANKED_INDUSTRIES[]    10 strings
H1_SIZE_MIN            px
H1_SIZE_MAX            px
BODY_SIZE_MIN          px
BODY_SIZE_MAX          px
H1_LINE_HEIGHT         e.g. "0.9–1.0"
BODY_LINE_HEIGHT       e.g. "1.4–1.5"
H1_SPACING             e.g. "0em" or "-0.02em"
CAPTION_SPACING        e.g. "0.12em"
PADDING_MIN            px
PADDING_MAX            px
GAP_MIN                px
GAP_MAX                px
CORNER_RADIUS          px (0 for Brutalism)
NOISE_OPACITY          e.g. "20%–40%"
PHOTO_STYLE            description string
ANIMATION_TYPES[]      list of animation names
ANIMATION_AVOIDS[]     list of animation anti-patterns
AVOIDS[]               full list of what this aesthetic forbids
```
