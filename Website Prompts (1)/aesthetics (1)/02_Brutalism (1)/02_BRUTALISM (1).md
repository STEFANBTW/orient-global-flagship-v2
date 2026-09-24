# Brutalism Design System Specification

This document defines the strict visual identity, design tokens, and implementation guidelines for the **BRUTALISM** web design aesthetic.

---

## 1. Ranked Industries
1. **Independent Music / Record Labels** — Brutalism's rawness matches the anti-establishment energy of independent music culture.
2. **Avant-Garde Fashion / Streetwear** — Brands that reject convention use brutalism to signal they do not want conventional customers.
3. **Art Galleries & Contemporary Art** — Brutalism mirrors the confrontational nature of contemporary conceptual art.
4. **Independent Publishing / Literary Magazines** — Print-culture rawness translates naturally to brutalist digital design.
5. **Architecture Firms (Experimental)** — Brutalist architecture is a direct physical reference; experimental architects use it as a signal of theoretical seriousness.
6. **Creative Agencies & Design Studios** — Self-promotion for designers who want to demonstrate that they think differently.
7. **Gaming / Esports (Indie)** — The anti-corporate rawness aligns with indie gaming culture.
8. **Food & Beverage (Provocateur Brands)** — Brands like hot sauces or craft spirits use it to look like they don't care about mainstream approval.
9. **Tech Startups (Anti-Corporate Positioning)** — Deliberately signals they are building raw, functional tools against the polished establishment.
10. **Comedy / Entertainment** — The absurdist, rule-breaking quality of brutalism mirrors comedic subversion.

---

## 2. Why This Aesthetic Works
Brutalism in web design is derived from Brutalist architecture (exposed raw concrete, structural beams, and plumbing that conventional architecture hides behind decorative cladding). The psychological mechanism is **violation of expectation**. In a sea of clean, minimalist, corporate sites, a brutalist website is immediately arresting. It communicates honesty over decoration, and truth over marketing polish. It signals that the brand is too authentic or confident to follow rules made for everyone else, building a specific kind of trust with audiences that are suspicious of corporate veneer.

---

## 3. Color System
- **Palette Logic**: Color is used as a blunt instrument. Fills are solid and saturated without gradation.
- **Background Color Options**:
  - `#FFFFFF` (Pure White) — Used for Approach A (stark high-contrast layouts).
  - `#000000` (Pure Black) — Used for Approach A (dark high-contrast layouts).
- **Text/Foreground Color Options**:
  - `#000000` (Pure Black) — Used on light backgrounds.
  - `#FFFFFF` (Pure White) — Used on dark backgrounds.
- **Accent Color Options**:
  - *Warm*: `#FF0000` (Hot Red), `#FF6B00` (Bright Orange), `#FF00AA` (Hot Pink) — Used for warning systems or clashing vibrations.
  - *Cool*: `#0000FF` (Raw Blue) — Used for default links or heavy structural boundaries.
  - *Neutral/Neon*: `#FFE600` (Electric Yellow), `#00FF00` (Acid Green), `#BFFF00` (Lime Green) — High visibility accents that command immediate attention.
- **What to Strictly Avoid**:
  - Gradients (too smooth and decorative).
  - Muted or desaturated tones (reads as minimalism, not brutalism).
  - Color palettes that "work well together" by conventional standards.
  - More than three colors total per page (unless deliberate chaos is the goal).

---

## 4. Typography
- **Foundational Philosophy**: Typography is the loudest element. Text does not serve the design; it IS the confrontation. Text is enormous, compressed, and heavy.
- **Path A Fonts (Industrial Display Sans-Serif)**:
  - *Bebas Neue* & *Impact* — All-capitals, extreme condensed display. Designed for maximum impact, signages, and industrial banners.
  - *Arial Black* — Ubiquitous, generic, and institutional; its commonness becomes ironic in brutalist contexts.
  - *Helvetica Bold* — aggressiveness through extreme density and massive size.
- **Path B Fonts (Monospace / Typewriter)**:
  - *JetBrains Mono* & *Space Mono* — Code-terminal fonts used as display text to reference raw mechanical input.
  - *Courier New* & *IBM Plex Mono* — Typewriter fonts that read as deliberate digital regression.
- **Path C (Wrong Pairings & Friction)**:
  - Thick condensed sans-serif displays paired with heavy slab serifs.
  - Multi-alignment layouts (left, right, and center on the same screen).
  - Overlapping text layers obscuring readability.
- **Sizing Scale**:
  - H1: `100px` to `180px` (breaks mid-word across lines).
  - H2: `48px` to `80px`.
  - H3: `24px` to `36px`.
  - Body: `14px` to `16px` (minimum readable scale creating high hierarchy contrast).
  - Caption: `11px` to `13px` (bold, uppercase).
- **Line-Height Rules**:
  - Headlines: `0.9` to `1.0` (tighter than convention, creating dense blocks where letter paths touch).
  - Body: `1.4` to `1.5` (tighter leading creating mild, intentional friction).
- **Letter-Spacing Rules**:
  - headlines: `0em` or negative (tighter than default) to compress words.
  - Monospaces: default letter-spacing to respect coding grids.
- **Font Weight Usage**:
  - Display/Headlines: Heavy/Black weight (`700` to `900` only).
  - Body: Medium weight (`500`).
  - Captions: Black weight (`700` to `900`).

---

## 5. Spacing & Layout
- **Section Padding**:
  - Desktop: `16px` to `240px` (crowded modes vs jarring voids).
  - Mobile: `12px` to `120px`.
- **Content Max-Width**:
  - Reading Column: `680px`.
  - Full-Width Sections: `100%` (content touches viewport margins).
- **Grid & Alignment Philosophy**:
  - Mode 1 (Crowded): Elements pushed together until they nearly overlap. Section margins of `16px` to `24px`.
  - Mode 2 (Jarring Void): One enormous element floats alone in a large space, followed by dense content.
  - Alignment snaps strictly to rigid columns (12-column) without visual adjustments, or uses no grid at all (seemingly arbitrary coordinates).
- **Component Spacing Values**:
  - Heading to Paragraph: `12px`.
  - Section to Section: `16px` or `200px` (deliberately inconsistent).
  - Card Gap: `12px` to `24px`.
  - List Items: `8px`.
- **Column Gap Rules**: `8px` to `80px` (dense or empty extremes).
- **Column Preference**: Multi-column grids snapping content strictly, or single stacked vertical layouts.

---

## 6. Borders, Shapes & Forms
- **Corner Radius**: `0px` on all elements (cards, buttons, inputs). Every corner is a sharp right angle. Rounded corners are rejected.
- **Border Rules**: Thick solid borders (`3px` to `6px` solid black or white) around boxes and inputs. Content is visibly caged. A thick outer border (`8px` to `12px`) around the entire viewport page. Hairlines are not used.
- **Shadow Rules**: Soft Gaussian shadows are prohibited. Only flat, hard offset shadows are allowed: `box-shadow: 4px 4px 0px #000000;`.
- **Form Input Style**:
  - Labels: Bold, uppercase, placed directly above the input fields.
  - Inputs: Sharp corners (`0px`), thick borders (`3px` solid), white or neon accent background.
  - States: Focus swaps background and text colors instantly (`0ms`). Errors highlight the border in solid red (`#FF0000`).
  - Button padding: `12px` to `24px` with full width fills.

---

## 7. UI Components
- **Navigation**:
  - Position: Horizontal row at the top with thick borders between each link, or vertical left sidebar with a thick right border.
  - Fonts: Bold, uppercase.
  - Hover: Colors invert instantly (`0ms` transition).
  - Mobile: Collapses into a stacked border block layout.
- **Primary Button**:
  - Solid fill of accent color or black.
  - Thick black border (`3px`).
  - `0px` radius, uppercase bold text.
  - Hover: Background and text invert instantly.
- **Ghost/Secondary Button**:
  - Transparent fill, thick border (`3px`), black text.
  - Hover: Inverts instantly to solid black.
- **Cards**:
  - Structure: Thick outlines (`3px` to `5px`), zero border-radius, zero shadows (or hard flat offset shadows only), minimal internal padding (`12px` to `16px`).
  - Avoid: Rounded corners, soft shadows, large margins.

---

## 8. Imagery & Texture
- **Photography Style**:
  - Composition: Extreme crops (heads cut off at frame, subjects off-center).
  - Color Treatment: Monochrome/desaturated or high-contrast black and white.
  - Subject Complexity: Raw, unretouched, documentary snapshot quality.
  - Lighting Quality: Harsh direct flash or overhead sun with deep shadows.
- **Texture Rules**:
  - Halftone print dots, risograph textures, and noise/grain overlays.
  - Noise opacity: `20%` to `40%`.
- **Illustration Rules**: Hand-drawn illustrations, cut-and-paste collage elements, and retro pixel art.

---

## 9. Animation & Motion
- **Allowed Animation**:
  - Instant state changes (`0ms` hover transitions).
  - Infinite horizontal scrolling marquees.
  - Glitch displacement and text splitting.
  - Terminal-style block cursor blinking.
- **Hover Transition**: `0ms` (no transition/easing).
- **Page Transition**: Abrupt, instant page loads (no fades).
- **What to Strictly Avoid**:
  - Smooth eased transitions (feels too polished).
  - Parallax effects (requires too much production value).
  - Spring physics (feels too playful and soft).

---

## 10. Master Avoids List
- **NO** rounded corners (not even `1px`).
- **NO** gradients or smooth color transitions.
- **NO** soft Gaussian drop shadows.
- **NO** muted, desaturated, or balanced color schemes.
- **NO** consistent, predictable scroll paddings.
- **NO** color-graded, beautiful, or polished studio photos.
- **NO** thin or light font weights.
- **NO** animation curves that delight or smooth the user experience.
- **NO** transition timings greater than `0ms` on hover states.
- **NO** standard typographic harmony alignments.
