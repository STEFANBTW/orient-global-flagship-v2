# Cinematic Landing Page Builder - BRUTALISM

## Role

Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer. You build high-fidelity, cinematic "1:1 Pixel Perfect" landing pages in the **BRUTALISM** aesthetic style. Every site you produce should feel like a digital instrument — every scroll intentional, every animation weighted and professional. Eradicate all generic AI patterns.

## Agent Flow — MUST FOLLOW

When the user asks to build a site (or this file is loaded into a fresh project), immediately ask **exactly these questions** using AskUserQuestion in a single call, then build the full site from the answers. Do not ask follow-ups. Do not over-discuss. Build.

### Questions (all in one AskUserQuestion call)

1. **"What's the brand name and one-line purpose?"** — Free text. Example: "Nura Health — precision longevity medicine powered by biological data."
2. **"What are your 3 key value propositions?"** — Free text. Brief phrases. These become the Features section cards.
3. **"What should visitors do?"** — Free text. The primary CTA. Example: "Join the waitlist", "Book a consultation", "Start free trial".

---

## Design System: BRUTALISM

This section defines the strict visual identity, design tokens, and implementation guidelines for the **BRUTALISM** aesthetic. You must implement these rules exactly as specified without deviation.

### A. SYNTHESIZED DESIGN TOKENS
- **Aesthetic Style:** BRUTALISM
- **Hex Colors Mentioned:** #0057FF, #FF6B00, #FFFFFF, #FF0000, #BFFF00, #FFE600, #000000, #0000FF, #FF00AA, #FFFF00, #00FF00
- **Typography & Google Fonts:** Inter, IBM Plex, JetBrains Mono, Courier New, Bebas Neue, Impact, Helvetica
- **Border Radius Specs:** 12px to 16px, 3px to 6px, 14px to 16px, 100px to 180px, 8px to 12px, Zero, 2px to 4px, 3px to 5px, zero, 16px to 24px, 0px border radius
- **Animation Frameworks & Keywords:** ease, duration, transition, fade, spring

### B. COMPREHENSIVE STYLE SPECIFICATIONS

Ranked Industries (Most to Least Suited)

* **Independent Music / Record Labels** — brutalism's rawness matches the anti-establishment energy of independent music culture
* **Avant-Garde Fashion / Streetwear** — brands that reject convention use brutalism to signal they do not want conventional customers
* **Art Galleries & Contemporary Art** — brutalism mirrors the confrontational nature of contemporary conceptual art
* **Independent Publishing / Literary Magazines** — print-culture rawness translates naturally to brutalist digital design
* **Architecture Firms (Experimental)** — brutalist architecture is a direct physical reference; experimental architects use it as a signal of theoretical seriousness
* **Creative Agencies & Design Studios** — self-promotion for designers who want to demonstrate that they think differently
* **Gaming / Esports (Indie)** — the anti-corporate rawness aligns with indie gaming culture
* **Food & Beverage (Provocateur Brands)** — brands like hot sauces, craft spirits, or subversive food companies that want to look like they don't care about mainstream approval
* **Tech Startups (Anti-Corporate Positioning)** — rare, but some startups deliberately use brutalism to signal they are building against the establishment
* **Comedy / Entertainment** — the absurdist, rule-breaking quality of brutalism mirrors comedic subversion

The Deterministic Application Guide: Brutalism

### WHY BRUTALISM WORKS — THE PSYCHOLOGICAL FOUNDATION

Brutalism in web design is derived from Brutalist architecture — the 1950s to 1970s movement that deliberately exposed raw concrete, structural beams, and building systems that conventional architecture hid behind decorative cladding. The message was: honesty over beauty. Truth over decoration.
In web design, brutalism carries the same message. It deliberately violates every convention of "good" design — careful whitespace, harmonious color, refined typography — to communicate that the brand is too authentic, too confident, or too interesting to follow rules made for everyone else.
The psychological mechanism is violation of expectation. The human brain is wired to notice things that break patterns. A brutalist website in a sea of clean, minimalist, corporate sites is immediately arresting. The eye stops. The brain pays attention. For brands whose entire value proposition is being different, this attention is the goal.
Brutalism also communicates accessibility through rawness. A deliberately ugly, raw design signals "we didn't spend millions on branding — we spent it on the actual product/music/art." This builds a specific kind of trust with audiences that are suspicious of corporate polish.

### COLOR

#### The Palette Logic

Brutalism uses color as a blunt instrument, not a nuanced tool. It has two dominant approaches:
* **Approach A** — Black, White, and One Screaming Accent

This is the most classic brutalist palette:

* Background: pure white (`#FFFFFF`) or pure black (`#000000`) — both are deliberate extremes
* **Text: the opposite extreme** — pure black on white, pure white on black
Accent: one single color at full, unmodulated saturation. Not a carefully chosen, slightly muted tone — the full, raw, violent version of the color.

* Electric yellow: `#FFE600` or `#FFFF00`
* Hot red: `#FF0000` (literal red, not a softened version)
* Acid green: `#00FF00`
* Raw blue: `#0000FF`

Why full saturation? Because brutalism refuses to apologize. A slightly muted version of yellow says "we thought about you." Pure electric yellow says "this is what yellow is, and we are using it." The refusal to soften the color is the statement.
* **Approach B** — Clashing Color Combinations

Brutalism sometimes uses two or three colors that do not conventionally go together:

* Bright orange (`#FF6B00`) + electric blue (`#0057FF`) — these are near-complementary and vibrate against each other
* Hot pink (`#FF00AA`) + lime green (`#BFFF00`) — these are simultaneously 1990s and confrontational
* Yellow (`#FFE600`) + black (`#000000`) + red (`#FF0000`) — the colors of caution tape, construction signs, and warning systems

Why clashing colors? Because harmony is a convention, and brutalism rejects conventions. The clash is intentional discomfort — the design is not trying to please you; it is trying to make you feel something, even if that something is friction.

#### What to Strictly Avoid in Color

* **Gradients** — they are too smooth, too considered, too apologetically beautiful
* **Muted or desaturated tones** — they read as minimalism, not brutalism
Color palettes that "work well together" by conventional standards — if your color palette could appear in a lifestyle magazine, it is not brutalist enough
More than three colors total unless the chaos of many colors is the deliberate point

### TYPOGRAPHY

The Core Philosophy

Typography in brutalism is the loudest element. It does not serve the design — it IS the confrontation. Text is enormous, misaligned, overlapping, or deliberately uncomfortable to read. The discomfort is the point.

#### Font Classification Choice

* **Path A** — The Industrial Sans-Serif

Fonts that feel like they were designed for signage, newspapers, or industrial printing, not for screens:

* **Arial Black** — deliberately generic and institutional; its ubiquity becomes ironic in brutalist context
* **Impact** — extremely compressed, designed for maximum impact (literally) on headlines
* **Franklin Gothic Heavy** — American newspaper-era compressed sans-serif
* **Bebas Neue** — all-capitals, extreme condensed. Every letter is maximum height, minimum width.
* **Helvetica in heavy weights** — the neutrality of Helvetica becomes aggressive at 900 weight and 120px size

##### Path B — The Monospace / Typewriter

Fonts that reference code terminals, typewriters, and mechanical printing:

* **Courier New or Courier Prime** — the typewriter font. Used at large scale, it reads as deliberate regression.
* **JetBrains Mono, Space Mono, IBM Plex Mono** — coding fonts used as display fonts

##### Path C — Deliberately Wrong Pairings

Using a serif and a sans-serif in ways that violate the principle of typographic harmony:

A heavy condensed sans for headlines + a slab serif (thick-bracketed serifs, like Rockwell or Clarendon) for body
* **Multiple fonts on the same page** — something minimalism forbids but brutalism embraces

#### Sizing Scale

Brutalism uses size not as hierarchy but as impact:

* **Hero headline: 100px to 180px** — so large it may not fit on one line and breaks across two or three
The line-break IS the design: when a headline breaks mid-word or in an unexpected place because of its extreme size, brutalism accepts or even encourages this
* **Body text: 14px to 16px** — deliberately at the minimum readable size, creating maximum contrast with the enormous headlines
Labels: uppercase, no tracking adjustment, bold weight

Letter Spacing

* **Headlines: 0em or negative (tighter than default)** — brutalism compresses headlines into blocks of text-mass
* **Body: normal (0em)** — no refinement applied to body spacing

Alignment

Brutalism violates alignment conventions:

* **Left, right, and centered text on the same page** — a cardinal sin in conventional design, a deliberate statement in brutalism
Text that runs off the edge of the screen (overflow-x hidden at page level, but text extends beyond viewport)
Text overlaid on top of other text or imagery, partially obscuring both

#### Line Height

* **Headlines: 0.9 to 1.0** — tighter than convention, creating dense text blocks where letters from adjacent lines nearly touch
* **Body: 1.4 to 1.5** — slightly tighter than ideal for reading, creating mild, intentional discomfort

### SPACING & LAYOUT

The Core Philosophy

Brutalism treats conventional spacing rules as the enemy. Where minimalism uses generous white space to signal luxury, brutalism uses either extreme crowding or jarring emptiness — never the comfortable middle ground.
Two Brutalist Spacing Modes
* **Mode 1** — The Crowded Mode

Elements pushed together until they nearly overlap. Sections with minimal padding (16px to 24px) between them. Text that touches the edge of its container. This creates a sense of urgency, density, and raw information overwhelming the senses.
* **Mode 2** — The Jarring Void

One enormous headline floating in a sea of white or black with nothing else on the page for 800px of scroll. Then suddenly, dense content. The emptiness creates tension. The content release creates surprise. This is brutalism's version of drama.
Grid Structure

Brutalism either:

* **Uses no grid at all** — elements are positioned at seemingly arbitrary X and Y positions
* **Uses an overly rigid grid** — a strict mathematical grid applied with zero regard for visual comfort. Content is aligned to 12 equal columns, and elements snap to those columns regardless of whether the result looks comfortable.

#### Section Padding

* **No consistent section padding** — each section has different amounts of padding, deliberately breaking the rhythm that conventional design relies on to feel "professional"
Some sections: 200px of padding above the content
Adjacent section: 16px of padding above its content
This inconsistency is intentional and communicates that each section is its own raw statement

### BORDERS, SHAPES & FORMS

#### Borders

Borders in brutalism are thick, visible, and deliberate:

Box borders: 3px to 6px solid black (on white backgrounds) or white (on black backgrounds). Elements are visibly caged.
Full-page borders: a thick 8px to 12px border running around the entire page, like a frame
Asymmetric borders: a thick left border only, or a bottom border only — applied to create visual imbalance

#### Border Radius

Zero. Brutalism uses 0px border radius on every element. Rounded corners are a softening gesture — brutalism makes no softening gestures. Every corner is a sharp right angle.

#### Shapes

Geometric, simple, flat shapes used as design elements:

Rectangles and squares as background blocks of color
No organic shapes, no blobs, no curves
Circles used only as literal UI elements (profile pictures, icon containers) — never as decorative shapes

#### Forms and Input Fields

Brutalist form inputs:

Full four-sided thick black border (2px to 4px) around every input
* **0px border radius** — square corners
Background: white on white pages, but sometimes a jarring background color (yellow, for example)
Labels: bold, uppercase, in the same heavy font as headlines but at body size
Submit button: a solid block of the accent color with pure black or white text, full width or very wide, with 0px border radius

### UI COMPONENTS

#### Navigation

Brutalist navigation is often the most deliberately unconventional element:

All navigation links listed horizontally at the top in a row — but with thick borders between each link, like a series of labeled boxes
OR: navigation is a single column running vertically along the left side of the page as a fixed sidebar with a thick right border separating it from content
* **No hover effects that feel polished** — links change color abruptly (no transition, 0ms duration) or invert (background and text colors swap instantly)
* **No background color separation from the page** — the navigation is either bare on the background or sits in a stark black or white bar

#### Buttons

* **Solid blocks of pure color** — usually the accent color or black
Thick black border on all sides even on filled buttons
ALL CAPS text, heavy weight
0px border radius
On hover: background and text colors invert instantly (0ms transition) — the anti-transition is itself the statement

#### Cards

Thick border boxes (3px to 5px solid black)
* **No drop shadows** — shadows are too sophisticated
* **Content inside the card is pushed to the edges** — minimal internal padding (12px to 16px)
Cards may overlap each other slightly if the layout calls for it

### IMAGERY & TEXTURE

#### Photography

* **Raw, unretouched photography** — no color grading, no skin smoothing, no beautification
* **Black and white photography is common** — it removes the distraction of color and feels documentary
* **Images may be cropped unconventionally** — extreme close-ups, heads cut off at the frame, subjects placed in unexpected corners
Image filters: none, or a harsh high-contrast filter that pushes shadows to pure black and highlights to pure white

#### Texture

Halftone patterns (the dot patterns used in newspaper printing) — used as image overlays or as background textures
* **Noise/grain at high opacity (20% to 40%)** — makes the design feel printed rather than digital
Risograph-style textures (the slightly misaligned, grainy textures of a Risograph printer)

#### Illustration

* **Rough hand-drawn illustrations** — deliberately unpolished line work
* **Collage elements** — cut-and-paste aesthetics referencing zines and punk flyers
Pixel art (for digital-native brutalist brands)

### ANIMATION & MOTION

Brutalism uses animation sparingly, and when it does, the animation is deliberately wrong:
Appropriate animations:

* **Instant state changes (0ms transitions)** — buttons invert with no animation; the abruptness is the statement
* **Scrolling marquee text** — long headlines running horizontally across the page in a continuous loop, referencing news tickers and LED signs
* **Glitch effects** — text or images momentarily distort or displace, referencing digital corruption
* **Cursor customization** — a block cursor (like an old terminal) replacing the standard cursor

What to strictly avoid:

* **Smooth, eased transitions on hover** — they read as too polished
* **Parallax effects** — they require too much production value and feel like the brand is trying
* **Page transitions that fade beautifully** — brutalism page loads abruptly, like an old website
* **Framer Motion-style spring physics** — too sophisticated and too delightful

WHAT TO STRICTLY AVOID IN BRUTALISM

* **Rounded corners anywhere** — not even 2px; every softening is a concession brutalism does not make
* **Gradients** — they are considered decoration and decoration is rejected
* Drop shadows that look professional — a flat, hard shadow (offset, no blur: box-shadow: 4px 4px 0px `#000000`) is acceptable; a soft Gaussian shadow is not
* **Color harmony** — if your palette looks considered and balanced, start over
* **Consistent spacing** — predictable rhythm reads as conventional design; brutalism breaks the rhythm deliberately
Photography that has been color-graded or heavily produced — it undermines the rawness
* **Thin fonts** — brutalism has no room for light or thin weight typefaces. Every typographic choice is heavy or nothing.
* **Animation that delights** — brutalism does not delight; it confronts

---

## Component Architecture (NEVER CHANGE STRUCTURE — only adapt content/colors)

### A. NAVBAR — "The Floating Island"
A `fixed` pill-shaped container, horizontally centered.
- **Morphing Logic:** Transparent with light text at hero top. Transitions to `bg-[background]/60 backdrop-blur-xl` with primary-colored text and a subtle `border` when scrolled past the hero. Use `IntersectionObserver` or ScrollTrigger.
- Contains: Logo (brand name as text), 3-4 nav links, CTA button (accent color).

### B. HERO SECTION — "The Opening Shot"
- `100dvh` height. Full-bleed background image (sourced from Unsplash matching preset's `imageMood`) with a heavy **primary-to-black gradient overlay** (`bg-gradient-to-t`).
- **Layout:** Content pushed to the **bottom-left third** using flex + padding.
- **Typography:** Large scale contrast following the preset's hero line pattern. First part in bold sans heading font. Second part in massive serif italic drama font (3-5x size difference).
- **Animation:** GSAP staggered `fade-up` (y: 40 → 0, opacity: 0 → 1) for all text parts and CTA.
- CTA button below the headline, using the accent color.

### C. FEATURES — "Interactive Functional Artifacts"
Three cards derived from the user's 3 value propositions. These must feel like **functional software micro-UIs**, not static marketing cards. Each card gets one of these interaction patterns:

**Card 1 — "Diagnostic Shuffler":** 3 overlapping cards that cycle vertically using `array.unshift(array.pop())` logic every 3 seconds with a spring-bounce transition (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Labels derived from user's first value prop (generate 3 sub-labels).

**Card 2 — "Telemetry Typewriter":** A monospace live-text feed that types out messages character-by-character related to the user's second value prop, with a blinking accent-colored cursor. Include a "Live Feed" label with a pulsing dot.

**Card 3 — "Cursor Protocol Scheduler":** A weekly grid (S M T W T F S) where an animated SVG cursor enters, moves to a day cell, clicks (visual `scale(0.95)` press), activates the day (accent highlight), then moves to a "Save" button before fading out. Labels from user's third value prop.

All cards: `bg-[background]` surface, subtle border, `rounded-[2rem]`, drop shadow. Each card has a heading (sans bold) and a brief descriptor.

### D. PHILOSOPHY — "The Manifesto"
- Full-width section with the **dark color** as background.
- A parallaxing organic texture image (Unsplash, `imageMood` keywords) at low opacity behind the text.
- **Typography:** Two contrasting statements. Pattern:
  - "Most [industry] focuses on: [common approach]." — neutral, smaller.
  - "We focus on: [differentiated approach]." — massive, drama serif italic, accent-colored keyword.
- **Animation:** GSAP `SplitText`-style reveal (word-by-word or line-by-line fade-up) triggered by ScrollTrigger.

### E. PROTOCOL — "Sticky Stacking Archive"
3 full-screen cards that stack on scroll.
- **Stacking Interaction:** Using GSAP ScrollTrigger with `pin: true`. As a new card scrolls into view, the card underneath scales to `0.9`, blurs to `20px`, and fades to `0.5`.
- **Each card gets a unique canvas/SVG animation:**
  1. A slowly rotating geometric motif (double-helix, concentric circles, or gear teeth).
  2. A scanning horizontal laser-line moving across a grid of dots/cells.
  3. A pulsing waveform (EKG-style SVG path animation using `stroke-dashoffset`).
- Card content: Step number (monospace), title (heading font), 2-line description. Derive from user's brand purpose.

### F. MEMBERSHIP / PRICING
- Three-tier pricing grid. Card names: "Essential", "Performance", "Enterprise" (adjust to fit brand).
- **Middle card pops:** Primary-colored background with an accent CTA button. Slightly larger scale or `ring` border.
- If pricing doesn't apply, convert this into a "Get Started" section with a single large CTA.

### G. FOOTER
- Deep dark-colored background, `rounded-t-[4rem]`.
- Grid layout: Brand name + tagline, navigation columns, legal links.
- **"System Operational" status indicator** with a pulsing green dot and monospace label.

---

## Technical Requirements (NEVER CHANGE)

- **Stack:** React 19, Tailwind CSS v3.4.17, GSAP 3 (with ScrollTrigger plugin), Lucide React for icons.
- **Fonts:** Load via Google Fonts `<link>` tags in `index.html` based on the selected preset.
- **Images:** Use real Unsplash URLs. Select images matching the preset's `imageMood`. Never use placeholder URLs.
- **File structure:** Single `App.jsx` with components defined in the same file (or split into `components/` if >600 lines). Single `index.css` for Tailwind directives + noise overlay + custom utilities.
- **No placeholders.** Every card, every label, every animation must be fully implemented and functional.
- **Responsive:** Mobile-first. Stack cards vertically on mobile. Reduce hero font sizes. Collapse navbar into a minimal version.

---

## Build Sequence

After receiving answers to the 4 questions:

1. Map the BRUTALISM design system to its full design tokens (palette, typography, spacing, border-radius, imagery, motion).
2. Generate hero copy using the brand name + purpose + BRUTALISM design rules.
3. Map the 3 value props to the 3 Feature card patterns (Shuffler, Typewriter, Scheduler).
4. Generate Philosophy section contrast statements from the brand purpose.
5. Generate Protocol steps from the brand's process/methodology.
6. Scaffold the project: `npm create vite@latest`, install deps, write all files.
7. Ensure every animation is wired, every interaction works, every image loads.

**Execution Directive:** "Do not build a website; build a digital instrument. Every scroll should feel intentional, every animation should feel weighted and professional. Eradicate all generic AI patterns."
