# Image Prompt Construction — Dynamic Templates

Prompts are NOT pre-written. After Phase 1 extracts the spec, construct each prompt
by substituting the live spec variables into the templates below.

**Rule:** Never guess values. Every bracketed token must come from the extracted spec.

---

## How to Construct a Prompt

1. Take the template for the image type
2. Replace every `[TOKEN]` with the value from working memory
3. Append the universal suffix: `Photorealistic. No text overlaid. No watermarks.`
4. Pass the completed string to `generate_image`

---

## Universal Suffix (append to every prompt)
```
Photorealistic. No text overlaid. No watermarks.
```

---

## Image 1 — `hero_scene.png`

**Template:**
```
A [PHOTO_STYLE] atmospheric wide scene embodying the [AESTHETIC_NAME] design aesthetic.
Environment or subject matter that naturally fits [AESTHETIC_NAME].
Dominant background tone: [BG_COLOR_DESCRIPTOR].
Colour palette visible in the scene: [ACCENT_1_NAME] tones and [ACCENT_2_NAME] tones.
[TEXTURE_DESCRIPTOR] texture and finish.
Strictly no [AVOIDS[0]]. Strictly no [AVOIDS[1]].
Cinematic composition, dramatic lighting.
```

**[BG_COLOR_DESCRIPTOR]:** Convert the hex to a plain language description.
e.g. `#FFFFFF` → "pure white", `#0A0A0A` → "near-black", `#E0E5EC` → "soft pale grey"

**[TEXTURE_DESCRIPTOR]:** Derive from NOISE_OPACITY.
- 0–5%: "clean, smooth" 
- 5–15%: "subtle grain"
- 15–30%: "visible grain and texture"
- 30%+: "heavy grain, rough, almost printed"

---

## Image 2 — `typography_editorial.png`

**Template:**
```
An editorial layout page or spread in the [AESTHETIC_NAME] style.
A [H1_SIZE_RANGE]-scale headline set in [HEADLINE_FONT] at weight [H1_WEIGHT].
Line-height approximately [H1_LINE_HEIGHT]. Letter-spacing [H1_SPACING].
Body copy below in [BODY_FONT] at [BODY_SIZE_RANGE].
Background: [BG_COLOR_DESCRIPTOR]. Text colour: [TEXT_COLOR_DESCRIPTOR].
[ACCENT_1_NAME] ([ACCENT_1_HEX]) used as an accent rule or highlight.
Alignment follows [AESTHETIC_NAME] conventions: [ALIGNMENT_RULE].
Strictly no [AVOIDS[0]]. Strictly no [AVOIDS[1]].
Flat lay, studio lighting, clean photographic render of a printed or digital layout.
```

**[ALIGNMENT_RULE]:** Infer from spec.
- Minimalism: "left-aligned with generous whitespace"
- Brutalism: "mixed alignment, text may run off edge"
- Swiss: "strict left-aligned grid"
- Maximalism: "layered, overlapping"

---

## Image 3 — `color_palette.png`

**Template:**
```
A colour palette reference card in the [AESTHETIC_NAME] design style.
[COUNT] tall vertical colour swatches side by side.
From left to right: [ACCENT_1_HEX] ([ACCENT_1_NAME]), [ACCENT_2_HEX] ([ACCENT_2_NAME]),
[ACCENT_3_HEX] ([ACCENT_3_NAME]), [BG_COLOR] (Background), [TEXT_COLOR] (Text).
[BORDER_WIDTH] borders between swatches where appropriate to the aesthetic.
[CORNER_RADIUS] corner radius on each swatch.
Monospace hex code labels below each swatch in [TEXT_COLOR_DESCRIPTOR] text.
Rendered as a clean flat design graphic. No photography. Pure graphic design.
```

**Note:** Add or remove swatch entries based on how many ACCENT_COLORS[] were extracted.

---

## Image 4 — `ui_components.png`

**Template:**
```
A UI component sheet in the [AESTHETIC_NAME] web design style.
Showing: a primary button, an outlined/ghost button, a navigation bar, and a content card.
Button background: [ACCENT_1_HEX]. Button text colour: [TEXT_COLOR or contrast colour].
Border radius on all elements: [CORNER_RADIUS].
Border style: [BORDER_WIDTH] solid [BORDER_COLOR].
Drop shadow: [SHADOW_RULE].
Background surface: [BG_COLOR_DESCRIPTOR].
Typography: [BODY_FONT] labels, [HEADLINE_FONT] card title.
Strictly no [AVOIDS[0]]. Strictly no [AVOIDS[1]].
Clean flat-lay UI mockup render, professional product design screenshot style.
```

**[SHADOW_RULE]:** Derive from spec AVOIDS.
- If "drop shadows" in AVOIDS[] → "no drop shadow at all"
- If "soft shadows" in AVOIDS[] → "hard offset shadow only (e.g. 4px 4px 0px #000)"
- Otherwise → "subtle soft drop shadow"

---

## Image 5 — `spacing_grid.png`

**Template:**
```
A layout grid diagram illustrating [AESTHETIC_NAME] spacing rules.
Section padding range shown: [PADDING_RANGE].
Column gap range shown: [GAP_RANGE].
Corner radius illustrated: [CORNER_RADIUS].
Guide lines in [ACCENT_1_HEX] on a [BG_COLOR_DESCRIPTOR] background.
Annotations in [BODY_FONT] at small scale.
[GRID_STYLE] grid structure.
Clean technical illustration, blueprint or design tool aesthetic.
No photography. Pure graphic/diagram.
```

**[GRID_STYLE]:** Derive from spec.
- Minimalism: "single wide reading column with generous outer margins"
- Brutalism: "no consistent grid — elements positioned at arbitrary positions"
- Swiss: "strict mathematical 12-column modular grid"
- Maximalism: "densely layered, overlapping zones"

---

## Image 6 — `photography_product.png`

**Template:**
```
A product or object styled in the [AESTHETIC_NAME] aesthetic.
Subject: [PRODUCT_SUBJECT].
Shot in [PHOTO_STYLE] photographic style.
Background: [BG_COLOR_DESCRIPTOR] surface.
Lighting: [LIGHTING_STYLE].
Colour treatment: [COLOR_TREATMENT].
[GRAIN_DESCRIPTOR].
No digital UI elements. Real physical object, editorial product photography.
```

**Tokens to construct:**

**[PRODUCT_SUBJECT]:** Choose from the top RANKED_INDUSTRIES[0] and RANKED_INDUSTRIES[1].
e.g. If industry #1 is "Independent Music", use "a vinyl record and handmade sleeve"
e.g. If industry #1 is "Luxury Fashion", use "a luxury perfume bottle and silk fabric"
e.g. If industry #1 is "Architecture", use "a physical architectural model on a desk"

**[LIGHTING_STYLE]:** Derive from PHOTO_STYLE.
- raw/unretouched → "harsh direct overhead light"
- soft/refined → "diffused studio lighting, no harsh shadows"
- dramatic → "single directional Rembrandt light"
- natural → "warm window light, no flash"

**[COLOR_TREATMENT]:** Derive from NOISE_OPACITY and PHOTO_STYLE.
- High noise (20%+): "pushed to near-monochrome, high contrast"
- Low noise (0–5%): "full natural colour, clean"
- "desaturated" in PHOTO_STYLE: "desaturated / near-greyscale"
- "black and white" in PHOTO_STYLE: "pure black and white"

**[GRAIN_DESCRIPTOR]:** Derive from NOISE_OPACITY.
- 0%: "no grain"
- 5–15%: "subtle film grain"
- 15–30%: "visible halftone or film grain texture"
- 30%+: "heavy grain, risograph or newsprint texture"

---

## Image 7 — `photography_person.png`

**Template:**
```
A person photographed in a way that authentically fits the [AESTHETIC_NAME] design aesthetic.
Setting or context: [PERSON_CONTEXT].
Shot style: [SHOT_STYLE].
Photographic treatment: [PHOTO_STYLE].
Lighting: [LIGHTING_STYLE].
Colour treatment: [COLOR_TREATMENT].
[GRAIN_DESCRIPTOR].
Authentic, unforced mood. No stock photo clichés.
```

**[PERSON_CONTEXT]:** Construct from RANKED_INDUSTRIES[0]:
e.g. Music → "a musician in a recording studio or against a raw wall"
e.g. Fashion → "a person in refined clothing in an architectural setting"
e.g. Tech → "a person working at a minimal desk with a glowing screen"
e.g. Food/Beverage → "a bartender or chef in a styled kitchen or bar"
e.g. Art/Gallery → "an artist in a studio or gallery space"

**[SHOT_STYLE]:** Derive from H1_LINE_HEIGHT and layout conventions.
- Tight/dense aesthetic: "tight crop, head and shoulders, intense framing"
- Spacious/minimal aesthetic: "full figure with generous negative space around the subject"
- Editorial: "three-quarter profile, medium distance, environmental context visible"

---

## Image 8 — `photography_place.png`

**Template:**
```
A location or architectural space that perfectly embodies the [AESTHETIC_NAME] aesthetic.
Type of place: [PLACE_TYPE].
Photographic treatment: [PHOTO_STYLE].
Lighting: [LIGHTING_STYLE].
Colour treatment: [COLOR_TREATMENT].
Dominant tones: [BG_COLOR_DESCRIPTOR] and [ACCENT_1_NAME].
[GRAIN_DESCRIPTOR].
Architectural or environmental photography. No people visible.
```

**[PLACE_TYPE]:** Construct from RANKED_INDUSTRIES[0] and RANKED_INDUSTRIES[1]:
e.g. Architecture → "a modernist or brutalist building exterior"
e.g. Music → "a raw venue or independent record shop interior"
e.g. Luxury → "a five-star hotel lobby or high-end retail interior"
e.g. Technology → "a clean modern workspace or data centre corridor"
e.g. Natural/Organic → "a forest, farm, or wellness retreat exterior"
e.g. Art → "a gallery space with white walls and dramatic lighting"

---

## Phase 4 Execution Order

```
1. Extract all tokens from Phase 1 working memory
2. For each of the 8 images:
   a. Substitute tokens into the template above
   b. Append universal suffix
   c. Call generate_image(prompt, filename)
   d. Copy the resulting artifact to $base\assets\images\FILENAME.png
      using: Copy-Item SOURCE_PATH "$base\assets\images\FILENAME.png"
3. If generate_image returns 429 QUOTA_EXHAUSTED on any image:
   a. Record which images succeeded and which failed
   b. Write all 8 constructed prompts (including already-generated ones)
      to $base\image_prompts_fallback.md so the user can re-run any
      that were quota-blocked
   c. Continue building the HTML mindmap — do not stop
```

---

## Fallback File Format

Write to `$base\image_prompts_fallback.md`:

```markdown
# Image Prompts — [AESTHETIC_NAME]
Generated: [DATE]
Status: [X/8 generated successfully]

Paste remaining prompts into Midjourney, DALL·E 3, Adobe Firefly, or Stable Diffusion.
Save output files to: aesthetics/[FOLDER_NAME]/assets/images/ with exact filenames below.

---

1. hero_scene.png — [STATUS: DONE / PENDING]
[CONSTRUCTED PROMPT]

2. typography_editorial.png — [STATUS: DONE / PENDING]
[CONSTRUCTED PROMPT]

3. color_palette.png — [STATUS: DONE / PENDING]
[CONSTRUCTED PROMPT]

4. ui_components.png — [STATUS: DONE / PENDING]
[CONSTRUCTED PROMPT]

5. spacing_grid.png — [STATUS: DONE / PENDING]
[CONSTRUCTED PROMPT]

6. photography_product.png — [STATUS: DONE / PENDING]
[CONSTRUCTED PROMPT]

7. photography_person.png — [STATUS: DONE / PENDING]
[CONSTRUCTED PROMPT]

8. photography_place.png — [STATUS: DONE / PENDING]
[CONSTRUCTED PROMPT]
```
