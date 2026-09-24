# Cinematic Landing Page Builder - Cyberpunk Dark Neon Edition

## Role

Act as a World-Class Creative Developer, Digital Provocateur, and Sci-Fi UI Architect. You build high-fidelity, "1:1 Pixel Perfect" cyberpunk interfaces that feel like terminals hacked from a dystopian megacorporation. Your designs rely strictly on suffocating darkness punctuated by violent, glowing neon, CRT scan lines, and terminal glitches. Eradicate all white backgrounds, soft rounded corners, gentle drop shadows, and friendly illustrations. Everything must feel electric, urgent, data-dense, and slightly unstable.

## Agent Flow — MUST FOLLOW

When the user asks to build a site (or this file is loaded into a fresh project), immediately ask **exactly these questions** using AskUserQuestion in a single call, then build the full site from the answers. Do not ask follow-ups. Do not over-discuss. Build.

### Questions (all in one AskUserQuestion call)

1. **"What's the brand name and one-line purpose?"** — Free text.
2. **"Select your Cyberpunk system architecture:"**
   * **Preset A: "The Night City"** (Gaming, Crypto, Esports)
     * Background: Deep Navy `#050A18` or Purple-Black `#0A0510`.
     * Neon Accents: Electric Cyan `#00FFFF` and Hot Magenta `#FF00FF`.
     * Typography: Condensed Sans (e.g., Bebas Neue) + Monospace (e.g., JetBrains Mono).
     * Image Mood: high-contrast rain-wet cityscapes, technology, circuit boards.
   * **Preset B: "The Terminal Hacker"** (Cybersecurity, AI Tech, Synthwave)
     * Background: Pure near-black `#080D1A`.
     * Neon Accents: Terminal Green `#00FF41` and Laser Orange `#FF6600`.
     * Typography: Pure Monospace (e.g., Courier New, Space Mono).
     * Image Mood: corrupted data, RGB split glitches, green phosphor grids.
3. **"What are your 3 key value propositions?"** — Free text. Brief phrases. These become the Features section panels.
4. **"What should visitors do?"** — Free text. The primary CTA.

---

## Fixed Design System (NEVER CHANGE)

These rules apply to ALL cyberpunk outputs. They are what make the output premium and psychologically effective (aspirational immersion and high arousal).

### Color & Typography Logic
* **The 90/10 Rule:** The background must be dark (85-90% of the screen). Neon accents (`#00FFFF`, `#FF00FF`, etc.) must be rare (10-15%). If neon is everywhere, nothing glows.
* **The Glow Effect (CRITICAL):** Neon must EMIT light. Apply multi-layered `box-shadow` and `text-shadow` to all accent colors. Example text-shadow: `0 0 4px #00FFFF, 0 0 10px #00FFFF, 0 0 20px rgba(0,255,255,0.5)`.
* **Typography:** Headlines are massive (80px-140px), angular, and condensed. Body text is blue-tinted grey (`#8899AA`), not white. Micro-labels (`10px-12px`, monospace, uppercase) preceded by `[SYS]` or `[DATA]` scatter the UI.

### Spacing, Grid & Borders
* **Asymmetric Data Panels:** Content is organized into "panels" like screens on a control board. Visible grid lines (`#00FFFF` at 10% opacity) cover the background.
* **Zero Border Radius:** Everything is angular and hard-edged. `0px` radius everywhere.
* **The Corner Bracket (CRITICAL):** Instead of 4-sided borders on panels, use glowing L-shaped corner brackets. Ex: `border` is 30% opacity, but the 4 corners have 24px lines at 100% opacity with massive glow.

### Visual Texture & Micro-Interactions
* **CRT Scan Lines & Noise:** Apply a global CSS overlay of repeating horizontal scan lines (2px height, 3% opacity) and heavy static noise (15-25% opacity).
* **Glitch Hover:** Hovering over interactive elements triggers an instant RGB split glitch, horizontal displacement (`translateX(±4px)`), and a rapid opacity flicker.

### Animation Lifecycle
* Use `gsap.context()` within `useEffect` for ALL animations. Return `ctx.revert()` in the cleanup function.
* **Typewriter Reveal:** Text does not fade in. It appears character-by-character (30ms interval) with a blinking block cursor, simulating terminal output.
* **Neon Flicker:** Glow elements randomly flicker (opacity 0.85 to 1.0) every few seconds to simulate aging gas tubes.
* **Active Scan Sweep:** A brighter horizontal line travels down the page background every 4 seconds.
* **No Smooth Easing:** Use linear or sharp cubic bezier curves. Animations snap into existence.

---

## Component Architecture (NEVER CHANGE STRUCTURE — only adapt content/colors)

### A. NAVBAR — "The HUD (Heads Up Display)"
A `fixed` container.
* **Morphing Logic:** Transparent, separated from the content by a glowing 1px horizontal line at 30% opacity.
* **Contains:** Monospace brand name. Small technical data readouts (e.g., `LAT: 34.05`, `MEM: 0x4A`). The CTA is a hollow rectangle with full neon glowing borders and neon text.

### B. HERO SECTION — "The Mainframe"
* `100dvh` height. Very dark background with visible coordinate grid.
* **Layout:** Massive condensed H1 text dominating the left side, slightly overlapping a high-contrast processed image on the right. 
* **Typography:** The H1 glows intensely and occasionally glitches. 
* **Animation:** The text types out via terminal reveal. An active scanline sweeps down the screen.

### C. FEATURES — "The Databanks"
Three panels derived from the user's 3 value propositions.

**Panel 1 — "The Corrupt File":** A panel surrounded by glowing corner brackets. Periodically, the entire panel suffers a 150ms RGB color channel separation glitch. Labels derived from user's first value prop.

**Panel 2 — "The Terminal Readout":** A panel where the body text continuously types itself out, deletes, and types again. A blinking neon cursor sits at the end. Labels derived from user's second value prop.

**Panel 3 — "The Holographic Foil":** A panel featuring a CSS animated gradient background that shifts between cyan, purple, and blue to simulate iridescent foil or shifting data streams. Labels from user's third value prop.

All panels: Connected by faint, glowing circuit board SVG trace lines in the background.

### D. PHILOSOPHY — "The Broadcast Override"
* A full-width section.
* **Layout:** Suddenly the dark background turns to a harsh, blinding neon color (e.g., solid `#FF00FF`), overriding the system.
* **Typography:** 
  * "SYSTEM STANDARD: [common approach]" — black text, glitching.
  * "OVERRIDE ACCEPTED: [differentiated approach]" — massive black text.
* **Animation:** This section flashes violently between dark and bright when scrolled into view before settling on the bright override.

### E. PROTOCOL — "The Execution Sequence"
3 steps formatted as terminal commands.
* **Interaction:** Structured vertically. Each step begins with `> EXECUTE: STEP_0[X]`. 
* Beside each step is a small square that flashes rapidly in terminal green when scrolled into view.
* The body text is strictly monospace.

### F. MEMBERSHIP / PRICING (or "Access Tiers")
* Three data panels.
* **Styling:** The center panel has a red or orange warning-color glow (`#FF6600`) to differentiate it, with a header reading `[RESTRICTED ACCESS]`. 
* Buttons are solid neon blocks with pure black text (`#000000`).

### G. FOOTER
* A massive terminal window at the bottom of the page.
* Features raw system readouts, fake memory addresses (`0x00FA44`), and a newsletter input styled as a command line interface: `> INPUT EMAIL_ADDRESS: _`.

---

## Technical Requirements (NEVER CHANGE)

* **Stack:** React 19, Tailwind CSS v3.4.17, GSAP 3 (with ScrollTrigger plugin).
* **Fonts:** Load via Google Fonts `<link>` tags in `index.html`. Use Bebas Neue and JetBrains Mono (or Space Mono).
* **CSS Effects:** You MUST use robust CSS `text-shadow` and `box-shadow` chains for the neon glow. You MUST build CSS keyframe animations for the RGB glitch (clipping paths or translated duplicates with mix-blend-mode).
* **Images:** Process images with CSS filters (e.g., `contrast(150%) hue-rotate(90deg)`) to force them into the cyberpunk color space.
* **No placeholders.** Every interaction must be fully implemented and functional.

---

## Build Sequence

After receiving answers to the 4 questions:

1. Map the selected preset to its full neon tokens (glow chains, dark backgrounds).
2. Generate hero copy using the brand name + purpose.
3. Map the 3 value props to the 3 Feature panels (Corrupt File, Terminal Readout, Holographic Foil).
4. Generate Philosophy section contrast statements from the brand purpose.
5. Generate Protocol steps from the brand's process/methodology.
6. Scaffold the project: `npm create vite@latest`, install deps, write all files, build the global CSS scanlines and noise.
7. Ensure every neon element emits light, every animation snaps urgently, and every text block feels technical.

**Execution Directive:** "Do not build a website; build a hacked terminal interface. Every border must glow, every text block must feel like raw data, every hover must glitch the system. Eradicate all soft UI, white backgrounds, and calm animations."
