# 19. DARK MODE / DARK EDITORIAL

## 1. Ranked Industries
- **Creative Agencies & Design Studios**: dark editorial is the dominant self-presentation aesthetic for serious creative agencies
- **Developer Tools & Code Editors**: dark mode is the native environment of developers globally; using it for the product's marketing site creates cultural alignment
- **Music & Audio Production Platforms**: professional audio software runs in dark mode; the design of its marketing environment should match
- **Film Production & Post-Production**: the dark environments of editing suites and screening rooms translate to dark editorial digital presence
- **Luxury Fashion (Contemporary, Avant-Garde)**: dark editorial is used by fashion brands that want sophistication without the conservatism of traditional luxury
- **Gaming (Atmospheric, Narrative)**: story-driven games use dark editorial aesthetics for their promotional sites and press kits
- **Premium Journalism & Long-Form Publishing**: night-reading mode and the drama of dark editorial suits long-form content
- **Architecture (Atmospheric, Cinematic)**: architectural photography is often more striking against dark backgrounds
- **Cybersecurity & Security-First Technology**: the dark environment references the professional security community's visual culture
- **Cannabis (Premium Positioning)**: premium cannabis brands use dark editorial to signal sophistication and product quality
- **The Deterministic Application Guide**: Dark Mode / Dark Editorial

## 2. Why This Aesthetic Works
Dark mode design works through several distinct psychological mechanisms:
- **Depth and Atmosphere**: Dark backgrounds create a visual sense of depth — elements appear to sit within a dark field rather than on top of a white surface. This depth is cinematic, referencing the experience of film viewing (in a dark cinema, the image seems to extend through the screen).
- **Content Focus**: On a dark background, light-colored content (text, images, data visualizations) appears to be the only source of light. The eye is drawn exclusively to illuminated content, with nothing in the background competing for attention.
- **Premium Association**: OLED screens (on premium iPhones, Samsung displays, and many laptop screens) produce true black by turning off individual pixels — there is no backlight, meaning dark mode on OLED is the screen consuming almost no power and producing light only where content exists. This is the most efficient display mode, and users of premium devices experience dark mode as physically superior. The aesthetic therefore carries a premium association.
- **Professional Cultural Alignment**: In creative, technical, and design communities, dark mode is the professional default. Developers, video editors, audio engineers, and graphic designers work in dark environments. A brand that uses dark editorial is speaking the visual language of professionals in these fields.

## 3. Color System
### The Palette Logic
Dark editorial's most important and most frequently misunderstood rule: never use pure black (#000000) as the primary dark background. Pure black is flat, two-dimensional, and creates extreme contrast that causes visual strain. Instead, every dark background has subtle color information — a slight blue, green, or neutral grey bias that gives it depth.
- Background Color Hierarchy (Multiple Dark Levels)
- **Dark editorial requires multiple levels of dark**: creating visual hierarchy through background lightness, not just color contrast:
- **Level 1**: Darkest (page background):
- **Deep dark**: #0F1117 or #111318 — near-black with a subtle cool bias
- **Pure dark**: #121212 — the Android Material dark background standard
- **Warm dark**: #0F0E0D — near-black with a warm bias (for dark editorial with warmer tones)
- **Level 2**: Dark surface (cards, panels):
- `#1A1D24 or #1E2028`: slightly lighter than the background, clearly differentiated on a quality display
- **Level 3**: Elevated surface (modals, dropdowns, hover states):
- `#252830 or #2A2D38`: clearly lighter than level 2; elevated elements are visible as distinct layers
- **Level 4**: Highest elevated surface:
- #313540 or #363A47
Why multiple levels? Because on a dark background, elevation hierarchy cannot be communicated with shadows (shadows on dark backgrounds are invisible). Instead, Material Design's dark mode specification — and professional dark editorial design practice — uses lightness to indicate elevation: the higher the element, the lighter its background. This is the inverse of the light-mode system where higher elements cast darker shadows.
- Text Colors on Dark Backgrounds
- The most critical accessibility decision in dark editorial:
- **Primary text**: #FFFFFF at 87% opacity = rgba(255,255,255,0.87) — NOT pure white. Pure white text on dark backgrounds creates extreme contrast that causes visual fatigue during extended reading. 87% opacity white is the standard established by Material Design after extensive testing.
- **Secondary text**: #FFFFFF at 60% opacity = rgba(255,255,255,0.60)
- **Disabled/hint text**: #FFFFFF at 38% opacity = rgba(255,255,255,0.38)
- On very dark backgrounds, these three opacity levels create a clear, accessible hierarchy
- Accent Color on Dark Backgrounds
- **Accent colors need adjustment for dark mode**: the same accent color that works on white does not work on dark backgrounds:
- **Saturation should be decreased by 15% to 20%**: highly saturated colors on dark backgrounds vibrate too intensely
- **Lightness should be increased by 10% to 15%**: the same color value reads darker on a dark background because there is no white to reflect its brightness
- **Example**: if your light-mode accent is a deep blue (#1B6CA8), your dark-mode accent should be a slightly lighter, slightly desaturated blue (#4A9ED4)

## 4. Typography
### The Core Philosophy
Dark editorial typography must balance the editorial richness of the editorial aesthetic (see Aesthetic #3) with the specific legibility constraints of dark backgrounds. The result is a typographic system that is simultaneously more dramatic and more precise than standard editorial typography.
### Font Classification
- The font choices for dark editorial are the same as standard editorial — serif display fonts with clean body fonts — but with specific adjustments:
- Display Fonts
All editorial display serifs work on dark backgrounds, but with a specific quality to prefer: high contrast between thick and thin strokes. On a dark background, the thin strokes of a high-contrast serif become almost invisible, leaving only the thick strokes visible. At very large display sizes, this creates an extremely dramatic effect where the headline appears to be composed of floating black geometric forms rather than complete letterforms. This is the defining dark editorial typographic effect.
- **Playfair Display**: the thick strokes are bold and visible; the thin strokes nearly disappear at large sizes on dark backgrounds — creating a beautiful, mysterious headline effect
- **Bodoni**: the same effect, more dramatic due to Bodoni's more extreme thick-thin contrast
- **Didot**: the most extreme version of this effect — the thin strokes are hair-thin even at body text sizes
- Body Fonts on Dark
- **Increase font weight by one step compared to light mode**: if you would use Regular (400) on white, use Medium (500) on dark. The dark background reduces perceived contrast, and the slightly heavier weight compensates.
- **Use larger body text**: 18px to 20px instead of the 16px to 17px standard. Extended dark reading is harder than light reading; the larger body text reduces eye strain.
- **Increase line-height slightly**: 1.85 to 2.0 instead of 1.7 to 1.9 — the dark background makes maintaining reading position on a line slightly harder; the extra line spacing helps.
- Color of Display Text
- Unlike body text (which uses opacity-reduced white for eye comfort), display headlines can be:
- **Full white (#FFFFFF)**: maximum impact, maximum drama. The whiteness of the headline against the dark background is itself the visual event.
- **The accent color**: especially for editorial-style eyebrow text (small category labels above headlines)
- **A gradient fill**: the headline text filled with a gradient transitioning from the accent color to white — referencing the illumination of text emerging from darkness

## 5. Spacing & Layout
### The Core Philosophy
Dark editorial spacing is the same as standard editorial spacing (see Aesthetic #3), with one key adjustment: sections feel more separated in dark editorial because each section's background can shift slightly in lightness without using color. A section at Level 1 dark, followed by a section at Level 2 dark, followed back to Level 1 creates a visual rhythm of depth shifts — like walking through differently-lit rooms.
- Photography and Image Placement
- The dark background dramatically changes how photography is perceived:
- Images have more visual weight on dark backgrounds because there is no competing brightness in the surrounding space
- **Use higher contrast imagery**: photography that has been processed to have stronger blacks and brighter highlights reads more dramatically on dark backgrounds
- **Full-width section images**: the image can bleed into the dark background at its edges (using a gradient overlay that transitions from the image to the dark background color) — creating a seamless integration of photography and dark environment
- Section Differentation
- Without the white/off-white background shifts available in light editorial, dark editorial differentiates sections through:
- Background lightness shifts (Level 1 to Level 2 to Level 1)
- A single horizontal rule (1px) in the accent color or in white at 15% opacity
- A full-width band of the accent color at very low opacity (8% to 12%) for specific emphasis sections

## 6. Borders, Shapes & Forms
### Border Radius
- **Dark editorial follows editorial conventions**: 0px for image frames, 4px to 8px for card elements. The darkness of the aesthetic suits sharp corners, which feel more dramatic.
- Borders and Dividers
- On dark backgrounds, borders must be lighter than the background to be visible:
- **Standard divider**: 1px solid rgba(255,255,255,0.12) — very subtle, barely visible, but providing structure
- **Emphasis divider**: 1px solid rgba(255,255,255,0.25) — clearly visible
- **Accent divider**: 1px solid [accent color] at 60% to 80% opacity — for high-priority section boundaries
- Glow Effects (Unique to Dark Mode)
- Unlike any light-mode aesthetic, dark editorial can use glow effects legitimately — because glow is only visible against dark backgrounds:
- A text element in the accent color with a subtle text-shadow in the same accent color at 30% to 40% opacity (blur radius: 12px to 16px)
- **This creates a soft luminous quality**: the text appears to emit a slight light — without being as aggressive as cyberpunk neon glow
- Used only on the primary CTA button, key interactive elements, or the most important headline on a page

## 7. UI Components
### Navigation
- Dark editorial navigation sits on a background matching the page background (Level 1 dark):
- **Logo**: white text or a white version of the logo mark
- **Navigation links**: rgba(255,255,255,0.70) — secondary-level white, not full white — indicating they are not the primary content
- **Active link**: rgba(255,255,255,0.87) — primary white, slightly brighter than inactive links
- **CTA button**: the accent color, with a subtle glow effect (box-shadow in the accent color)
- **On scroll**: the navbar gains a background of Level 2 dark with a bottom border at rgba(255,255,255,0.08) — clearly elevated from the page
### Cards
- **Background**: Level 2 dark (slightly lighter than page)
- **Border**: 1px solid rgba(255,255,255,0.08) — very subtle definition
- **No drop shadow (invisible on dark)**: elevation is communicated by the background lightness differential
- **Hover**: background transitions to Level 3 dark (slightly lighter again) — the card appears to rise toward the viewer
### Buttons
- **Primary**: accent color background, dark text OR white text (determined by which provides better contrast)
- **Secondary**: transparent background, accent color 1px border, accent color text
- **Ghost**: transparent background, rgba(255,255,255,0.20) border, white text
- **Hover on primary**: a subtle glow appears (box-shadow in the accent color)

## 8. Imagery & Texture
- Photography Processing for Dark Mode
- Photography requires different processing for dark editorial than for light editorial:
- **Increase contrast**: push blacks further and lift highlights — the increased dynamic range reads dramatically on dark backgrounds
- **Lift the color temperature toward cool**: a slightly cooler image integrates with the blue-biased dark backgrounds better than warm photography
- **Remove any pure white backgrounds in product photography**: on a dark page, product photography with white backgrounds creates a jarring disconnection. Use transparent backgrounds or dark studio photography.
- Noise Texture
- Dark editorial uses a grain/noise texture overlay at slightly higher opacity than light-mode minimalism:
- **6% to 10% opacity noise texture on dark backgrounds**: this prevents the dark background from reading as flat and digital
- The noise adds a physical, material quality that references the grain of film photography and the texture of dark theatrical spaces

## 9. Animation & Motion
- Dark editorial animation is the same as light editorial animation, with specific adjustments for dark context:
- Appropriate animations:
- All standard editorial scroll animations (see Aesthetic #3)
- **Glow pulse on primary CTA**: the CTA button's glow effect gently pulses (opacity: 0.6 to 1.0 of the glow) on a 3-second cycle — drawing the eye without demanding attention
- **Dark section entry**: elements do not just fade in — they emerge from darkness. Begin at opacity 0 AND at a scale of 0.98, transitioning to opacity 1 and scale 1.0 over 600ms. The scale shift creates the feeling of the element becoming visible as it moves toward the viewer out of a dark space.

## 10. Master Avoids List
- **Pure black (#000000) as the background**: it is flat, two-dimensional, and creates accessibility-failing contrast ratios
- **Pure white (#FFFFFF) as body text**: use 87% opacity white for extended reading comfort
- **Light-mode accent colors without adjustment**: saturated colors vibrate too intensely on dark backgrounds; adjust saturation and lightness
- **Photography with white backgrounds**: incompatible with dark editorial; always use transparent or dark-background photography
Color-coded information using dark versions of status colors — the dark background changes how status colors read; always verify contrast ratios for all status colors on the actual dark background
- **Warm backgrounds**: dark editorial is cool-biased. Warm dark backgrounds (brown, warm grey) read as dingy rather than sophisticated.
- **High-contrast animation**: in dark environments, bright flashes of white or light color are physically jarring. All animations must stay within the dark-to-medium-light range.

