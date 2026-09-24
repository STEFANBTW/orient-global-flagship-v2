# 10. CYBERPUNK / DARK NEON

## 1. Ranked Industries
- **Gaming (PC / Console, Especially Sci-Fi and Action)**: cyberpunk is the visual language of gaming's most ambitious, technologically-driven genre
- **Cryptocurrency & DeFi Platforms**: the radical, anti-establishment technology of crypto aligns with cyberpunk's anti-corporate futurism
- **Esports Organizations & Tournaments**: the visual energy and drama of dark neon matches competitive gaming's intense atmosphere
- **VR / AR Technology Products**: cyberpunk is the design language of near-future digital-physical hybrid experiences
- **Electronic Music / EDM Producers & Labels**: the dark neon aesthetic is the visual equivalent of the music itself
- **Cybersecurity / Ethical Hacking Firms**: the hacker aesthetic references the real cultural world these companies operate in
- **Streetwear Brands (Tech-Influenced)**: the fusion of technology and fashion that streetwear increasingly represents
- **AI Technology Companies (Provocateur Positioning)**: companies that want to communicate that they are building something radical rather than something corporate
- **Energy Drinks & Performance Products**: the intense, extreme visual energy matches the product's promise
- **Independent Film / Sci-Fi Creative Projects**: filmmakers and productions in the science fiction genre
- **The Deterministic Application Guide**: Cyberpunk / Dark Neon

## 2. Why This Aesthetic Works
Cyberpunk's visual language is borrowed from the science fiction tradition — specifically from the films and literature that imagined a near future in which technology has become overwhelming, corporations have grown more powerful than governments, and human identity is increasingly defined by digital and physical augmentation.
- **The aesthetic works through aspirational immersion**: the viewer is placed inside a future world that is simultaneously thrilling and dangerous. The dark backgrounds reference the night city of cyberpunk fiction. The neon lights reference the commercial signage of that overcrowded, over-commercialized future. The glitch effects reference the digital fragility of a world run entirely on technology that can be hacked, corrupted, or manipulated.
- **For technology-forward brands, this aesthetic communicates**: we are operating at the frontier. The visual language signals that the company is not playing it safe — it is building in territory that did not previously exist. For gaming and entertainment, the aesthetic creates immediate excitement — the brain responds to neon, movement, and darkness with heightened alertness and arousal.

## 3. Color System
### The Palette Logic
- **Cyberpunk's color system is built on one rule**: pure darkness with controlled, violent light. The darkness is not simply dark — it is the deep, suffocating dark of a night city. The light is not simply bright — it is neon: electric, impossible-seeming color that appears to glow from within.
### Background Colors
- **The background must be very dark**: but not pure black. Pure black (#000000) is flat and dimensionless. Cyberpunk backgrounds have depth — they are slightly colored, referencing the polluted, chemical-tinged night sky of the genre:
- **Deep navy**: #050A18 or #080D1A — the near-black with a blue tint. The most versatile cyberpunk background.
- **Deep purple-black**: #0A0510 or #0D0818 — for purple/magenta-dominant palettes
- **Deep teal-black**: #030D10 or #050F0F — for teal/cyan-dominant palettes
- **Never pure #000000 as the only background**: it is too flat and needs at least 3% blue or purple tint to have cyberpunk depth
- Neon Accent Colors
These are the electric, glowing colors that define the aesthetic. Critically: these colors must appear to emit light rather than simply be colored. This is achieved through glow effects (text-shadow and box-shadow with the same color as the element).
- **Electric cyan**: #00FFFF or #00F5FF — the most recognizable cyberpunk color. References Tron, Blade Runner, and decades of sci-fi imagery.
- **Hot magenta/pink**: #FF00FF or #FF0080 — the second canonical cyberpunk color. Warm to cyan's cool, creating maximum color tension.
- **Neon green**: #00FF41 or #39FF14 — the hacker/terminal green. References The Matrix and the green phosphor displays of early computers.
- **Electric violet**: #9B00FF or #7700FF — a more sophisticated cyberpunk accent, slightly less common than cyan and magenta
- **Laser orange**: #FF6600 or #FF4500 — used in industrial/warning contexts within cyberpunk aesthetics
- The Color Ratio Rule
- **Background darkness**: 85% to 90% of any given page area
- **Neon accents**: 10% to 15% of any given page area
- The accents must be rare enough to glow. If neon is everywhere, nothing glows — the rarity of the light against the darkness is what creates the electric quality.
- The Glow Effect (Non-Negotiable)
- Cyberpunk neon elements must glow. In CSS:
- text-shadow:
- 0 0 4px #00FFFF,     /* tight inner glow */
- 0 0 8px #00FFFF,     /* medium glow */
- 0 0 20px #00FFFF,    /* outer ambient glow */
- 0 0 40px rgba(0,255,255,0.5); /* far ambient */
- For box elements:
- box-shadow:
- 0 0 4px #00FFFF,
- 0 0 10px #00FFFF,
- 0 0 24px rgba(0,255,255,0.6),
- inset 0 0 10px rgba(0,255,255,0.1); /* inner glow */

## 4. Typography
### The Core Philosophy
Typography in cyberpunk communicates technology, code, and the future. The font choices reference digital displays, terminal output, and the compressed, information-dense typography of sci-fi interfaces.
### Font Classification
### Path A — Monospace / Code Terminal
- **JetBrains Mono**: elegant monospace with subtle rounded details. The best monospace choice for cyberpunk that needs to be readable at body text sizes.
- **Courier New**: deliberately retro — references old terminals and the hacker aesthetic of the 1990s internet
- **Space Mono**: geometric monospace with personality — its squared-off letterforms have a robotic quality
### Path B — Condensed Geometric Sans
- **Bebas Neue**: extremely tall, condensed, all-caps. Every letter is a vertical rectangle. Used for large cyberpunk headlines.
- **Orbitron**: specifically designed to look like sci-fi technology typography. Its highly geometric letterforms reference LCD displays and futuristic interfaces. Use sparingly — it can read as clichéd if overused.
- **Rajdhani**: condensed, angular, with a slight technological feel. More refined than Orbitron.
### Path C — Glitch Typography
- **Typography with a glitch effect applied**: the letters appear to be corrupted, with horizontal displacement and color channel separation (where the red, green, and blue channels of an image appear slightly offset from each other). This is achieved through CSS animation or SVG filter techniques.
### Sizing Scale
- **Hero headline**: 80px to 140px. Large headlines in Bebas Neue or a condensed font at this size function as graphic elements.
- **Section headline**: 40px to 60px
- **Body text**: 14px to 16px in a monospace or clean sans-serif
- **Technical labels**: 11px to 13px, monospace, uppercase, with wide letter-spacing (0.15em to 0.20em)
- **"Classified" / "System" labels**: 10px to 12px, monospace, preceded by characters like [SYS], [DATA], [WARN]
- Color of Type
- **Primary headlines**: the primary neon color (#00FFFF) with glow effect
- **Secondary headlines**: white (#FFFFFF) or near-white (#F0F0FF)
- **Body text**: a desaturated, slightly blue-tinted grey (#8899AA or #99AACC) — not bright white, which would compete with the neon accents
- **Code/technical text**: the terminal neon green (#00FF41)
- **Muted labels**: the primary neon color at 40% to 50% opacity

## 5. Spacing & Layout
### The Core Philosophy
Cyberpunk layout references the information-dense displays of science fiction — the cockpit screens, the hacker terminals, the surveillance feeds. It is information-rich, sometimes deliberately dense, and organized around a sense of system logic rather than elegant composition.
- Layout Characteristics
- **Grid lines as design elements**: in cyberpunk UI, the grid is visible. Thin lines (#00FFFF at 10% to 20% opacity) run across the background, suggesting a coordinate system or a data grid.
- **Asymmetric layouts**: content does not necessarily sit in centered, balanced columns. Panels are arranged like screens on a control panel — different sizes, positioned at different locations.
- **Vertical space**: cyberpunk uses vertical space differently from other aesthetics. Sections of dense content are separated by large expanses of near-dark background with only a faint grid pattern — like an empty section of the night sky.
- **Scan lines**: a repeating horizontal pattern of lines at 2px to 4px intervals, at 3% to 5% opacity, overlaid on sections or the entire page — references the scan lines of CRT monitors and establishes the analog-digital tension of the genre
- Panel Structure
- **Content is organized into "panels"**: bordered rectangular regions that suggest the sub-screens of a larger system interface
- **Panel borders**: 1px solid [neon color] at 30% to 50% opacity, with the corner points of the border emphasized by small L-shaped corner markers in the full neon color
- **Panel headers**: a thin bar (32px to 40px height) at the top of the panel in a slightly lighter dark color, containing a small label in the technical text style

## 6. Borders, Shapes & Forms
### Border Radius
- **Zero on most elements. Cyberpunk is angular and hard-edged**: the genre's physical aesthetic references metal, glass, and machined surfaces. The exception:
- **Small status indicators and badges**: 2px to 4px radius — barely perceptible rounding
- **Profile avatars**: sometimes fully circular
- Cyberpunk Border Treatments
- The defining border treatment in cyberpunk is the corner bracket — instead of a full four-sided border, only the corners of a panel are marked, using small L-shaped lines:
- [┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐]
- [│                         CONTENT                                   │]
- [└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘]
These corner brackets are constructed using CSS pseudo-elements or border-image techniques. The bracket lines extend 16px to 24px from each corner and are the full neon color with glow effect.
- Dividers and Separators
- Thin horizontal lines (1px) in the neon color at 30% opacity between sections
- **Occasionally**: a 2px horizontal line with a strong glow effect (text-shadow: 0 0 8px [neon]) used as a dramatic section divider
- Form Elements
- **Input fields**: dark background (#0A0F1A), 1px neon border at 50% opacity, neon border at full opacity and glow on focus
- **Border-radius**: 0px to 2px maximum
- **Label**: monospace, uppercase, neon color at 60% opacity
- **Placeholder text**: neon color at 30% opacity
- **Submit button**: solid neon color background with very dark text, OR transparent with full neon border and neon text, with glow effect

## 7. UI Components
Navigation**: Left-aligned vertical sidebar representing a terminal display, or horizontal top navigation with thin scanlines. Font weight is Light (300) or Bold (700) monospace. Hover behavior triggers green terminal blinking cursor and red glitch text displacement. On mobile, it expands into a full-height command prompt overlay.
Primary Button**: Angle-clipped/slashed corners on the card edge. Solid neon cyan fill with a black text label. Radius is 0px (strict sharp angles). Hover state swaps fill to hot magenta instantly with a digital sound-flicker style glitch.
- Secondary Button**: Transparent fill, 1px scanline outline, neon green glowing border. Hover state glows intensely and shows warning stripes.
- Cards**: Slanted corner cards with digital UI grid frames, neon drop shadow glows, and hazard decal striping. Avoids centered, floating organic shapes.

## 8. Imagery & Texture
- Photography and Imagery
- Heavily processed, high-contrast photography
- **Color-graded to match the neon palette**: images processed to push blues and purples into shadows, with selective neon color in highlights
- **Subject matter**: cityscapes at night, technology, circuit boards, human-technology interaction, rain-wet surfaces reflecting neon signs
- **Glitch effects applied to images**: horizontal slicing of the image with slight horizontal offsets on specific slices, RGB channel separation
- Essential Cyberpunk Textures
- **CRT scan lines**: as described in the layout section — a CSS background-image of repeating horizontal lines
- **Noise/static**: a high-opacity grain (15% to 25%) that references analog television static
- **Grid overlay**: a fine grid pattern (at 4% to 8% opacity) that references graph paper and digital coordinate systems
- **Circuit board patterns**: SVG line patterns referencing PCB traces — used as decorative background elements at low opacity (5% to 10%)
- **Holographic foil effect**: an iridescent, color-shifting gradient applied to specific elements — shifts between cyan, purple, and blue depending on viewing angle (simulated with an animated gradient)

## 9. Animation & Motion
- Cyberpunk's animation is the most kinetically rich of all aesthetics:
- The Glitch Effect
- **The signature cyberpunk animation**: elements momentarily distort, as if affected by electromagnetic interference:
- Random horizontal displacement of the element (translateX by ±4px to ±8px)
- Brief color channel separation (achieved by duplicating the element, offsetting the copies in red and blue, and rapidly flickering them)
- **Duration**: 50ms to 150ms, triggered randomly every 3 to 8 seconds for ambient effect, or triggered on hover for interactive elements
- Scan Line Animation
- The scan line background pattern can animate:
- A single brighter horizontal line travels down the page at a steady speed (simulating a CRT electron gun sweep) — this is the "active scan" effect
- **Duration**: one sweep every 3 to 5 seconds, at 8% opacity on the scan line — visible but not distracting
- Text Typing Animation
Text appears character by character, as if being typed in real time by a terminal — referencing hacker movies and computer terminal output. Each character appears on a timed interval (30ms to 50ms per character) with a blinking block cursor.
- Neon Flicker
- Neon lights flicker in the real world when the gas tubes are aging. This is simulated with:
- Random opacity variations (0.85 to 1.0) on the glow elements
- **Duration**: each flicker is 50ms to 100ms, occurring every 4 to 10 seconds randomly
- What to strictly avoid:
- **Smooth, calm animations**: every animation in cyberpunk should have energy and urgency
- **Slow fade-ins**: cyberpunk elements snap into existence, don't drift in
- **Natural easing curves**: use linear or sharp cubic bezier curves

## 10. Master Avoids List
- **Bright backgrounds**: even the lightest possible cyberpunk background must still be very dark. Light backgrounds destroy the neon glow effect entirely.
- **More than two neon colors as accents**: more than two competing neon colors create visual chaos rather than controlled intensity
- **Soft, rounded corners on primary elements**: the aesthetic is angular and hard. Rounded corners read as friendly and approachable, which is antithetical to cyberpunk's energy.
- **Serif typography**: there are no serifs in the cyberpunk aesthetic. The genre's typography is entirely technical.
- **Photography without processing**: natural, unprocessed photography is visually inconsistent with the heavily produced, neon-infused visual world of cyberpunk
- **Neon on light colors**: glow effects require darkness to be visible. A neon element on a white or light background simply looks like a brightly colored object, not a glowing light source.
- **Animations that are too slow or calm**: cyberpunk's motion is urgent, electric, and slightly unstable. Slow, gentle animations contradict the aesthetic entirely.
- I am approaching the output limit for this response.
- I have now covered Aesthetic Families 6 through 10 in full:
- Neumorphism
- Skeuomorphism
- Flat Design
- Material Design
- Cyberpunk / Dark Neon
- The remaining 10 families are:
- Vaporwave / Y2K / Retro-Futurism
- Organic / Natural
- Luxury / High-End
- Corporate / Professional
- Bauhaus / Geometric
- Art Deco
- Swiss / International Style
- Psychedelic / Surrealist
- Dark Mode / Dark Editorial
- Handcrafted / DIY

