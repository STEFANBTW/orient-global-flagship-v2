# 7. SKEUOMORPHISM

## 1. Ranked Industries
- **Music Production Software / DAWs**: virtual mixing boards, equalizers, and audio equipment referencing physical studio gear
- **Gaming (Simulation Games)**: games simulating real-world environments use skeuomorphic UI to reinforce the simulation
- **Luxury Goods E-Commerce**: showing leather-textured product pages for a leather goods brand reinforces material quality
- **Financial Services (Traditional / Heritage Institutions)**: wood-grain and leather textures signal tradition, permanence, and established trust
- **Education Platforms (Especially Children's)**: books that look like real books, notebooks that look like real notebooks — the familiar physical metaphor aids learning
- **Note-Taking / Personal Organization Apps**: the original context for skeuomorphism's renaissance: Apple's Notes app, leather-bound calendar apps
- **Craft / Artisanal Brands**: a coffee roaster whose website feels like parchment, or a whiskey brand whose interface feels like aged wood
- **Legal / Professional Services (Heritage Positioning)**: communicating institutional longevity through material references to libraries, leather, and paper
- **Cooking / Recipe Platforms**: recipe cards that look like index cards, cookbooks that look like real books
- **Subscription Boxes / Gift Products**: the unboxing experience translated into digital — textured, material-rich interfaces that reference the physical gift experience
- **The Deterministic Application Guide**: Skeuomorphism

## 2. Why This Aesthetic Works
- **Skeuomorphism works through familiarity transfer**: it borrows the established meaning and emotional associations of physical objects and transfers them to digital interfaces. A note-taking app that looks like a yellow legal pad is immediately understood — no learning curve required. The user knows what it is because they have used one in real life.
- **This is especially powerful in two situations**: when the target audience is unfamiliar with digital interfaces (older users, non-technical users) and when the brand's entire value proposition is rooted in a physical tradition (a heritage whiskey brand, a luxury leather goods house, a handmade instrument maker).
- **Skeuomorphism also activates material memory**: the brain's ability to recall the sensory experience of a material when seeing it visually. A leather texture on screen triggers the remembered feeling of leather — its weight, its smell, its warmth. A wood grain texture triggers the remembered feeling of real wood. These sensory memories create emotional connections that flat design simply cannot access.

## 3. Color System
### The Palette Logic
- Skeuomorphism's colors are derived directly from the physical materials being referenced. The palette is dictated by the material world, not by brand color theory.
- Common Material Palettes:
- Leather:
- **Dark brown**: #3E1F00, #5C2D0E, #7A3B1E
- **Tan leather**: #C4956A, #D4A574, #A67C52
- **Aged leather**: #8B6249, #7A5240, #6B4532
- **Stitching color (contrasting)**: cream (#F5ECD7) or dark brown (#2C1A08)
- Paper / Parchment:
- **Cream white**: #F5F0DC, #EDE3C5, #F0E8D0
- **Aged paper**: #DDD3B8, #C8BA98, #B5A880
- **Worn edges**: #C4B49A — slightly darker at the edges (created with a gradient overlay darkening toward page edges)
- Wood Grain:
- **Light oak**: #C4956A, #B8845A, #A67C52
- **Dark walnut**: #4A2C1A, #5C3A22, #3E2410
- **Cherry wood**: #6B2D0E, #7A3820, #5A2410
- Metal:
- **Brushed aluminum**: #9E9E9E, #B0B0B0, #888888 (with a repeating linear gradient to simulate brushed texture)
- **Gold**: #C9A84C, #D4A017, #B8860B (with gradient highlights)
- **Steel**: #5C6670, #6B7A84, #4A5560
### Accent Colors
- In skeuomorphism, accent colors come from the material being referenced:
- **Leather stitching**: cream or dark brown
- **Metal details**: polished silver highlights (#FFFFFF at 40% opacity in the right spot)
- **Paper**: red ink (#CC2200) for important markers, blue ink (#1A3B8C) for standard text, as if written with real ink
### Background Color
- The background IS a material texture. It is not a flat color. See the Texture section for how to construct this.

## 4. Typography
### The Core Philosophy
Typography in skeuomorphism references the physical typefaces of the materials being simulated. If the interface is a notebook, the text should reference handwriting or typewriter output. If the interface is a professional legal document, the text should reference formal document typography.
### Font Classification
- For paper/notebook/document interfaces:
- **Typewriter fonts**: Courier Prime, Special Elite, American Typewriter — reference the mechanical printing of typewriters
- **Handwriting fonts (used very sparingly for personal notes)**: Caveat, Kalam, Patrick Hand — must be high quality and legible
### Classic serif: Georgia, Palatino — references traditional document and book typography
- For leather/executive/luxury interfaces:
- **Refined serifs**: Garamond, Caslon, Freight Display — reference the typography of expensive, printed materials
- **Engraved-looking display fonts**: fonts with high thick-thin contrast referencing metal engraving and embossing
- For music production/technical instrument interfaces:
- **Industrial sans-serifs**: fonts that reference LED displays, control panel labeling
- **Monospace**: referencing digital readouts and technical displays
### Sizing Scale
- **Skeuomorphism is not primarily a typographic aesthetic**: the visual interest comes from the material rendering, not typography. Type should be appropriately sized for readability and reference the physical object:
- The text size should match what would be comfortable in the physical analog (a real notebook has body text at approximately 14px to 16px equivalent)
- Headlines should be at a size that would realistically appear on the physical object
- **No extreme headline sizing**: skeuomorphism does not use 96px headlines because no physical notebook has a 96px headline
- Color of Text
- Text color should reference physical ink on the material:
- **On cream/parchment backgrounds**: #2C1A08 (dark brown, like aged ink) or #1A1A2E (near-black blue, like fresh ink)
- **On dark leather**: cream (#F5ECD7) or gold (#C9A84C)
- **On wood**: cream or white depending on the wood darkness

## 5. Spacing & Layout
### The Core Philosophy
Skeuomorphism's spacing is dictated entirely by the physical object being referenced. You are designing a digital object that should be indistinguishable (in its proportions) from the real-world object it simulates.
- The Physical Reference Rule
- **Before making any spacing decision, ask**: what would this be in the real physical object?
- **Notebook lines**: 28px to 32px spacing between lines — referencing the actual ruling of a lined notebook
- **Legal pad margins**: a vertical red line at approximately 80px from the left edge, with text starting to the right of it — the margin rule of a real legal pad
- **Leather portfolio borders**: thick border (20px to 30px) of the leather color around the content area, with stitching detail running along the inside edge
- **Book pages**: the gutter (inner margin) is wider than the outer margin, referencing how real books are bound and held
- Realistic Proportions
A skeuomorphic calendar should have the same 7-column grid as a real calendar. A skeuomorphic keyboard should have the same relative key sizes as a real keyboard. The physical reference is the specification.

## 6. Borders, Shapes & Forms
- The Material Edge
- In skeuomorphism, borders are replaced by material edges. Instead of a 1px solid border, you have:
- A leather-bound edge with visible stitching
- A page edge with subtle curl or aging at the corner
- A metal bezel with a machined groove running around its perimeter
- A wooden frame with visible grain and edge-banding
- These are achieved through a combination of:
- Multi-layer gradient to simulate the edge catching light
- Box-shadow for depth beneath the object
- Detailed background images or CSS constructions for the material itself
- The Bevel Effect
- **Physical objects have beveled edges**: surfaces that are angled between the front face and the side. In skeuomorphism, bevels are simulated with gradient overlays:
- A linear gradient from rgba(255,255,255,0.3) to transparent running along the top and left edges
- A linear gradient from rgba(0,0,0,0.2) to transparent running along the bottom and right edges
- These together create the illusion of a raised, beveled surface
- Button Rendering
- Skeuomorphic buttons are physically rendered objects:
- **A gloss button (like early iPhone app icons)**: radial gradient from a bright highlight at the top (rgba(255,255,255,0.6)) to the button's base color at the bottom
- **A matte button**: a subtle linear gradient from a slightly lighter version of the base color at the top to a slightly darker version at the bottom, with a thin top highlight line (1px rgba(255,255,255,0.4))
- **A pressed state**: the gradient inverts (highlight moves to the bottom), the inner shadow appears (inset box-shadow), and the button moves 1px down (translateY(1px))
### Border Radius
- Varies entirely by the physical object referenced:
- **Real physical buttons**: 6px to 10px
- **Notebook pages**: 0px (paper has square corners)
- **Leather portfolio**: 4px to 8px (leather has slight corner rounding when bound)
- **Metal panels**: 2px to 4px (machined metal has precise, small radii)

## 7. UI Components
### Navigation
- Skeuomorphic navigation references physical navigation systems:
- **A tabbed interface where tabs look like actual folder tabs**: protruding slightly from the top of the content area, with the active tab appearing to sit in front of the inactive tabs
- **A sidebar that looks like the spine of a book**: with a different texture from the main content area
- Navigation buttons that are physical toggles or switches
- Form Elements
- Every form element in skeuomorphism is a physically rendered object:
- **Text inputs**: look like paper recesses or metal-framed input areas with a subtle inner shadow
- **Dropdowns**: look like real selection dials or menus printed on the interface surface
- **Checkboxes**: look like real checkbox forms — with a physical check mark (rendered as a stroke-weight SVG) appearing when checked
- **Radio buttons**: look like the circular physical selector buttons of real forms

## 8. Imagery & Texture
- This is the most technically demanding aspect of skeuomorphism.
- Creating Realistic Material Textures
- Leather:
- Use a high-resolution photograph of real leather as a repeating background image, OR construct synthetically:
- **Base color**: #5C2D0E (medium brown)
- **Noise texture**: a subtle noise overlay at 30% to 40% opacity creates the grain of leather
- **Specular highlight**: a very subtle, large radial gradient from rgba(255,255,255,0.12) to transparent covering the center of the leather surface — the natural sheen of leather
- **Stitching**: a repeating dotted or dashed border element in a contrasting cream color, positioned 16px to 20px from the edge
- Paper/Parchment:
- **Base color**: #F5F0DC
- **Noise texture overlay**: 10% to 15% opacity — paper has grain
- **Edge gradient**: a radial gradient from transparent in the center to rgba(180,160,100,0.3) at the edges — pages are naturally darker at their edges due to aging and handling
- **Optional ruled lines**: repeating horizontal lines at #E8DFC8, 1px height, spacing 28px to 32px
- Wood Grain:
- Use a high-resolution photography of real wood OR use a repeating SVG wood grain pattern
- The grain direction must be consistent across the entire surface (wood grain runs in one direction)
- **Highlight**: a very subtle gradient from rgba(255,255,255,0.08) at the top to transparent halfway down — the way light catches wood
- Metal (Brushed Aluminum):
- **Base color**: #9E9E9E
- **The brushed texture**: a repeating linear gradient of alternating very-slightly-lighter and very-slightly-darker horizontal lines at 1px height each — this creates the look of brushed metal
- **Specular highlight**: a strong linear gradient from rgba(255,255,255,0.4) at the very top to transparent at 30% of the element height

## 9. Animation & Motion
- Skeuomorphism's animations are physically accurate:
- Button press:
- **translateY(1px) over 80ms**: the button physically moves 1 pixel downward when pressed
- The gradient inverts simultaneously (80ms)
- **On release**: returns over 120ms with a slight ease-out
- Page turn (for book/notebook interfaces):
- **A CSS 3D transform**: rotateY from 0deg to -180deg, with perspective set on the parent container
- The page appears to physically turn, revealing the "back" of the page and then the next page
- **Duration**: 400ms to 600ms
- Toggle switch:
- The physical thumb slides from one side to the other (translateX) over 200ms
- The surface texture of the thumb shifts with the movement (a background-position change) to simulate the physical rotation of the toggle
- What to strictly avoid:
- Abstract animations (fades, slides) that have no physical analog — skeuomorphism only animates things that would physically happen to the object being simulated
- **Easing curves that feel digital rather than physical**: use physics-based easing that simulates real object movement (slight overshoot, natural deceleration)

## 10. Master Avoids List
- **Mixing material references on the same surface**: leather texture next to glass next to paper creates a material incoherence. Pick one material for each structural element and maintain it.
- **Low-quality textures**: a pixelated or obviously tiled texture immediately breaks the illusion. Use high-resolution, seamlessly tiling textures.
- **Physical impossibilities**: if you are simulating a book, the layout must follow the structural logic of a book. A book page that is also a tab that is also a folder creates objects that cannot exist in physical reality.
- **Flat color buttons on textured surfaces**: everything must be rendered. A flat button on a leather background looks like someone forgot to finish the design.
- **Modern UI conventions that break the metaphor**: tooltips, modals, and notification badges should all be rendered in the material language of the interface. A standard system tooltip appearing over a leather interface shatters the illusion.
- **Animating non-physical behaviors**: a skeuomorphic page cannot fly across the screen like a Material Design card. It can only move in ways a real page can move.

