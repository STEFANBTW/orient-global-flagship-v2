# 6. NEUMORPHISM

## 1. Ranked Industries
- **Consumer Finance Apps / Personal Banking**: the soft, tactile quality makes abstract financial data feel tangible and controllable
- **Health & Wellness Apps**: the gentle, soft aesthetic matches the calm, nurturing tone of wellness products
- **Smart Home Control Interfaces**: neumorphism references physical control panels, knobs, and switches — the metaphor is exact
- **Meditation & Mental Health Apps**: the softness and quietness of the aesthetic matches the emotional register of these products
- **Music Player / Audio Apps**: volume knobs, equalizer sliders, and play buttons rendered in neumorphism feel physically satisfying
- **Wearable Tech Companion Apps**: the companion apps for smartwatches and fitness trackers benefit from a soft, device-like aesthetic
- **Productivity / Task Management Tools**: the tactile, pressable quality of neumorphic buttons makes task completion feel physically rewarding
- **Weather Applications**: soft, rounded interfaces match the atmospheric, gentle nature of weather information
- **E-Learning Platforms (Children)**: the soft, approachable quality is non-threatening for young learners
- **Luxury Automotive Companion Apps**: referencing the soft-touch materials and physical controls of premium car interiors
- **The Deterministic Application Guide**: Neumorphism

## 2. Why This Aesthetic Works
Neumorphism (a portmanteau of "new" and "skeuomorphism") creates the illusion that interface elements are physically extruded from or pressed into the background surface. A button appears to push in when clicked. A card appears to rise slightly from the surface. A toggle appears to sit in a recess.
- **This works through the principle of embodied cognition**: the theory that the human brain processes digital experiences using the same neural pathways it uses for physical experiences. When a button visually behaves like a physical button (it has a raised surface that depresses when pressed), the brain responds with the same satisfaction it would feel pressing a real physical button. This is deeply satisfying in a way that flat buttons simply cannot replicate.
The key technical mechanism is dual-shadow lighting simulation. Neumorphism creates its 3D illusion using two shadows: one light shadow (white or near-white) on the upper-left, and one dark shadow on the lower-right. This simulates a light source coming from the upper-left — the same light direction that human vision has been calibrated to interpret since we evolved under a sun that is above us. The upper-left light convention is so deeply embedded in human perception that any surface lit from this direction is instantly read as raised, and any surface with this lighting inverted is instantly read as recessed.
- **The critical limitation of neumorphism**: and the reason it must be applied carefully — is accessibility. Because neumorphic elements rely entirely on subtle shadow differences rather than color contrast to distinguish interactive from non-interactive states, they can be nearly invisible to users with low vision or in bright ambient light. Every neumorphic design must be tested rigorously for accessibility.

## 3. Color System
### The Palette Logic
- Neumorphism has the most constrained color palette of all 20 aesthetic families. The entire visual language collapses if the colors are wrong. Here is exactly why:
The dual-shadow technique requires that the background color sits precisely between the light shadow color and the dark shadow color. If the background is too light, the dark shadow is visible but the light shadow disappears into the background. If the background is too dark, the light shadow is visible but the dark shadow disappears. Only a mid-tone background can support both shadows simultaneously, making the raised-surface illusion work.
- The Only Valid Background Colors
- Neumorphism works in three color modes:
- **Mode 1**: Soft Grey (The Classic)
- **Background**: #E0E5EC or #DDE1E7 or #E4E9F0 — a soft, slightly cool light grey
- **Light shadow**: #FFFFFF or #F8FAFF — pure or near-pure white
- **Dark shadow**: #A3B1C6 or #9BAACF — a medium blue-grey
- **Text**: #4A5568 or #2D3748 — a dark blue-grey
Why this exact shade of grey? Because it is light enough to allow white shadows to read as highlights (if the background were white, the white shadow would be invisible) and dark enough to allow the blue-grey shadow to read as a proper shadow (if the background were very dark, the dark shadow would disappear into it).
- **Mode 2**: Soft Warm Beige
- **Background**: #E8E0D5 or #EDE4D8 — a warm, cream-tinted light grey
- **Light shadow**: #FFFFFF
- **Dark shadow**: #C4B8A8 — a warm, darker beige
- **Text**: #5C4D3C — a warm dark brown
- **Accent**: #D4956A — a warm terracotta
- **Mode 3**: Dark Neumorphism
- **Background**: #2D3142 or #1E2030 — a dark blue-grey or near-black
- **Light shadow**: rgba(255,255,255,0.07) — white at very low opacity (7%)
- **Dark shadow**: rgba(0,0,0,0.5) — black at 50% opacity
- **Text**: #C8D0E7 — a light blue-grey
Dark neumorphism is significantly more challenging to execute because the shadow range is compressed — the contrast between the light and dark shadows is smaller on a dark background, making the 3D effect more subtle.
- Accent Color
- Neumorphism uses exactly one accent color, applied sparingly:
- Used only on active states, selected toggles, and the primary CTA button
- The accent must be a saturated color that breaks through the monochromatic palette: a medium blue (#4A80C4), a teal (#38B2AC), a warm orange (#ED8936), or a purple (#805AD5)
- The accent color appears in the active state of a toggle, in the fill of a progress bar, and on the primary button — nowhere else
### What to Strictly Avoid in Color
- **Multiple accent colors**: the monochromatic palette cannot hold more than one color intrusion
- **Very saturated backgrounds**: they destroy the shadow contrast
- **Pure white or pure black backgrounds**: they collapse the dual-shadow technique
- Dark text on dark neumorphic backgrounds without sufficient contrast — accessibility failure

## 4. Typography
### The Core Philosophy
Typography in neumorphism is deliberately quiet. The visual interest comes from the surface treatments (shadows, depth, extrusion) — not from the type. Type must be readable and unobtrusive. It provides information; the UI elements provide the experience.
### Font Classification
- Rounded sans-serifs are the perfect match for neumorphism because their letterform geometry mirrors the rounded, soft quality of neumorphic shapes:
- **Nunito**: the definitive neumorphism font. Rounded terminals, balanced proportions, extremely legible. Its rounded quality at every weight makes it feel soft and approachable.
- **Poppins**: geometric but with subtle rounding. Very popular for neumorphic dashboards and app UIs.
- **Quicksand**: more explicitly rounded than Poppins. Better for consumer-facing products.
- **Comfortaa**: very rounded, almost to the point of being childlike — use for children's apps and wellness products where maximum approachability is the goal.
- **DM Sans**: less rounded but clean and geometric. Use when you want slightly more professionalism without losing the modern, soft quality.
- Why Rounded Fonts?
The visual language of neumorphism is defined by soft, rounded, extruded forms. A sharp, angular typeface (like Futura or Helvetica) would create a visual conflict — the sharp geometry of the letterforms would clash with the rounded, soft geometry of the UI elements. Rounded fonts are in visual harmony with the rounded corners and soft shadows of neumorphic elements.
### Sizing Scale
- **Screen/section title**: 28px to 36px, SemiBold (600)
- **Card headline**: 18px to 22px, SemiBold (600)
- **Body text**: 14px to 16px, Regular (400)
- **Labels on UI elements (button labels, input labels)**: 13px to 15px, Medium (500)
- **Captions and metadata**: 11px to 12px, Regular (400) in the muted text color
- Weight Usage
- **Never use Bold (700) or Black (900) in neumorphism**: heavy weights feel hard and aggressive in a design that is built on softness
- SemiBold (600) is the maximum weight for any text element
- The weight restraint reinforces the softness of the overall aesthetic
### Letter Spacing
- **Body text**: 0em to 0.01em — default
- **Labels and uppercase elements**: 0.05em to 0.08em — very slight loosening
- **Never compress letter spacing**: negative tracking creates density that conflicts with neumorphism's airy softness
### Line Height
- **All text**: 1.6 to 1.8 — generous, open, calm

## 5. Spacing & Layout
### The Core Philosophy
Neumorphism requires the most generous spacing of any aesthetic. Every element needs physical room to cast its shadows, and shadows need empty space around them to be visible. A neumorphic element squeezed into too-tight a space will have its shadow clipped by adjacent elements, destroying the 3D illusion.
- The Minimum Shadow Clearance Rule
Whatever your shadow offset and blur values are (more on this below), the clearance between any neumorphic element and the nearest adjacent element must be at least equal to the blur radius of your shadow. If your shadow is `box-shadow: 8px 8px 16px ..., your clearance must be at least 16px. In practice this means`:
- **Internal padding within neumorphic cards**: 24px to 32px minimum
- **Gap between neumorphic cards**: 24px to 32px minimum
- **Padding around neumorphic buttons**: 14px vertical, 28px horizontal minimum
- Layout Structure
- **Neumorphism works best in dashboard and app layouts**: not full-page marketing sites. The reasons:
- Dashboard layouts have defined regions (sidebar, main content area, header) — neumorphic elements fill these regions naturally
- **App layouts have finite, defined screens**: the restraint of mobile viewport forces exactly the kind of focused, single-purpose design that neumorphism requires
- Marketing sites need scroll-through sections with varied visual interest — neumorphism's monochromatic sameness becomes monotonous over long scroll distances
- Page/Screen Background
The entire background of the screen should be the neumorphic background color — not white. This is non-negotiable. The shadows of neumorphic elements are cast on the background, which means the background IS the surface from which elements emerge. If sections of the page are white and other sections are the neumorphic grey, the shadows will look wrong on the white sections.
- Grid
- **8-point grid**: all spacing values are multiples of 8px
- **Simple 1-column or 2-column layouts**: neumorphism's complexity is in the depth, not in the grid structure. Complicated multi-column grids with neumorphic elements create visual congestion.

## 6. Borders, Shapes & Forms
- Border Radius (The Most Important Shape Decision)
- Neumorphism uses very generous border radius:
- **Cards and containers**: 16px to 24px border radius. The softness of the corner matches the softness of the shadows.
- **Buttons**: 12px to fully rounded (border-radius: 50px for pill-shaped buttons). Pill-shaped buttons are extremely common in neumorphism.
- **Toggles/switches**: fully rounded (50% radius) — they are physically referencing light switches and physical toggles
- **Icons and small containers**: 12px to 16px radius
- **The rounder the better**: the extreme roundness reinforces the physical softness of the aesthetic
- The Neumorphic Shadow Formula (The Critical Technical Specification)
- This is the most precise technical requirement in all of these aesthetic guides. The shadows must be exactly right for the illusion to work.
- For a raised element (appears to protrude from the surface):
- box-shadow:
- 6px 6px 12px [dark shadow color],
- 6px -6px 12px [light shadow color];
The offset values (6px) determine how pronounced the 3D effect is. The blur radius (12px) determines how soft the shadow edge is. The ratio of offset to blur should be approximately 1:2.
- For a pressed/inset element (appears to be pushed into the surface):
- box-shadow:
- inset 6px 6px 12px [dark shadow color],
- inset -6px -6px 12px [light shadow color];
- **The inset keyword reverses the direction of the shadows**: the dark shadow now falls on the upper-left (inside the element) and the light shadow falls on the lower-right (inside the element), creating the inverse lighting that reads as a surface pressed inward.
- Shadow Color Values for the Soft Grey palette:
- **Dark shadow**: #A3B1C6 (for lighter neumorphism) or rgba(163,177,198,0.6)
- **Light shadow**: #FFFFFF or rgba(255,255,255,0.8)
- Adjusting the Effect Strength:
- **More pronounced 3D**: increase offset values (8px, 10px) and increase blur (16px, 20px)
- **More subtle 3D**: decrease offset values (4px) and decrease blur (8px)
- **Very subtle (for secondary elements)**: 3px offset, 6px blur
- Borders on Neumorphic Elements
No traditional CSS borders on neumorphic elements. The edge of the element is defined entirely by the shadow contrast. Adding a border ruins the illusion because real extruded surfaces do not have outlines — they have edges that catch light.
- **The one exception**: a 1px border in a very light shade (rgba(255,255,255,0.5) on the grey palette) on the top and left edges of a raised element, to enhance the light-catching quality. This is an optional refinement, not a requirement.
### Forms and Input Fields
- **Neumorphic inputs use the inset shadow technique**: they appear pressed into the background surface, like a physical recess into which you type:
- **Background**: same as page background (#E0E5EC)
- **Box-shadow**: inset 4px 4px 8px [dark], inset -4px -4px 8px [light]
- Border: none
- **Border-radius**: 10px to 12px
- **On focus**: the inset shadow deepens slightly (increase offset to 6px and blur to 12px) — the recess appears to deepen as you begin typing
- The label appears above the input in the muted text color, in a small size

## 7. UI Components
- **Buttons**: The Most Important Neumorphic Component
- Neumorphic buttons are the clearest demonstration of the aesthetic's power. They appear as physical buttons on the surface.
- Resting state (unpressed):
- **Background**: same as page background
- **Shadow**: raised dual-shadow formula
- **Text**: in the muted text color (NOT the accent color in the resting state)
- Active/pressed state:
- **Background**: same as page background (no color change)
- **Shadow**: switches from raised to inset formula — the button visibly depresses
- **Text**: changes to the accent color
- **Transition**: 100ms to 150ms — fast enough to feel like a physical press
- Primary button (the main CTA):
- **Background**: the accent color (#4A80C4 or equivalent) at full opacity
- **Shadow**: the raised formula, but using darker and lighter versions of the accent color instead of grey shadows
- **Dark shadow**: a 30% darker version of the accent
- **Light shadow**: a 30% lighter version of the accent
- Text: white
- **On press**: inset shadows in accent color variants
- Toggles/Switches
- The most satisfying neumorphic component:
- **Outer container**: inset shadow (appears as a recess)
- **Inner circle/thumb**: raised shadow (appears as a protruding button within the recess)
- **When toggled ON**: the inner circle moves to the right AND the container background transitions to the accent color
- **The transition duration**: 200ms to 250ms with ease-in-out — physically satisfying
### Cards
- Neumorphic cards have no background color change from the page (they are the same color as the background) and no border — they exist purely through shadow:
- **Raised cards**: standard dual-shadow formula
- **Content cards that contain information (not interactive)**: slightly lighter shadow values — they are raised but not dramatically so
- **Interactive cards (clickable entire-card links)**: stronger shadow values that visibly depress on hover
- Sliders and Range Inputs
- **The slider track**: inset shadow (a recessed groove)
- **The slider thumb**: raised shadow (a physical protruding circle)
- **The filled portion of the track**: the accent color
- This creates the most physically intuitive control element in neumorphism — it genuinely looks and feels like a physical slider control.

## 8. Imagery & Texture
### Photography
- Neumorphism rarely uses photography in traditional ways. When it does:
- **Images sit within neumorphic frames**: a raised border surrounds a circular or rounded-rectangle image container
- Photography should be soft, desaturated, and tonally consistent with the neumorphic background palette — harsh colors in photos will destroy the monochromatic harmony
- Profile images in circular neumorphic frames are extremely common
- Icons
- Neumorphism requires a specific icon treatment:
- Line icons (stroke-based, not filled) in the muted text color — thin lines at 1.5px to 2px stroke weight
- **Icon containers are themselves neumorphic**: a small square or circle with neumorphic shadows, containing the icon
- **Avoid heavy, filled icon sets**: they are too visually dense for the soft palette
- **Recommended icon library**: Feather Icons or Phosphor Icons — both use thin, clean, consistent line weights
### Texture
- **None. Zero. Neumorphism's surface IS the texture**: the subtle shadow play across a clean, smooth surface. Adding any texture overlay disrupts the shadow reading and collapses the 3D illusion.

## 9. Animation & Motion
- Neumorphism's animation is the most restrained and physically accurate of all aesthetics:
- The Press Animation (Most Critical)
- **Duration**: 100ms to 150ms ease-in
- The element transitions from raised shadow to inset shadow
- **No scale change**: neumorphic elements do not scale; they press in
- **The reverse (release)**: 150ms to 200ms ease-out
- Card Hover (Raised Elements)
- **Duration**: 200ms ease-out
- The shadow offset values increase slightly (from 6px to 8px) — the element appears to lift higher off the surface
- The light shadow brightens marginally
- **No translateY movement**: neumorphic elements do not physically move; their shadow changes to imply height
- Toggle Animation
- **The thumb slides horizontally**: 200ms to 250ms with cubic-bezier(0.34, 1.56, 0.64, 1) — a slight overshoot at the end simulates physical momentum
- The container background color transitions: 200ms
- What to strictly avoid:
- **Scale transforms on press**: physical buttons do not get smaller when pressed; they move inward
- **Rotation**: no neumorphic element should rotate; the dual-shadow lighting convention only works from one direction
- **Fast animations under 100ms**: the 3D illusion requires enough time for the shadow change to register
- **Opacity changes**: neumorphic elements should not fade; they are solid physical objects

## 10. Master Avoids List
- **Colored backgrounds**: only the three valid background modes work. Any other background color destroys the shadow contrast.
- **Multiple shadow directions**: all shadows must follow the upper-left light source convention. Mixing shadow directions (some elements lit from above, others from the side) collapses the spatial logic.
- **Too many interactive elements in close proximity**: the shadows need room. Cramped neumorphic elements look muddy.
- Text directly on the neumorphic surface without sufficient contrast — the muted palette means text contrast must be checked obsessively against WCAG standards
- **Heavy, filled icons**: they are too visually dense for the soft palette
- **Using neumorphism for entire marketing websites**: it is a UI/app aesthetic, not a content presentation aesthetic. Long-scroll marketing pages built in neumorphism become monotonous and visually fatiguing.
- **Pure white or black anything**: no pure whites, no pure blacks. Everything is a tinted, softened version.
- **Animations faster than 100ms**: the physical metaphor requires time to register

