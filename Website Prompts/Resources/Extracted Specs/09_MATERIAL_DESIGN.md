# 9. MATERIAL DESIGN

## 1. Ranked Industries
- **Enterprise SaaS / B2B Software Platforms**: Material Design's systematic approach handles complex information architecture elegantly
- **E-Commerce Platforms**: the clear hierarchy and interaction patterns optimize conversion flows
- **Healthcare Apps (Patient-Facing)**: clarity, consistency, and accessibility built into the system
- **Productivity & Project Management Tools**: the card-based, elevated system handles complex data beautifully
- **Educational Technology (All Ages)**: Material's clear affordances (visual cues that communicate how to interact) make it learnable
- **Government Digital Services**: accessible, consistent, and functional across all device types
- **Financial Services Apps**: the systematic approach handles data density professionally
- **News & Media Apps**: content-first with strong typographic hierarchy
- **Travel & Logistics Apps**: complex information (routes, schedules, maps) organized with Material's elevation system
- **Internal Tools / Operations Software**: the predictability of the Material system reduces training time for new users
- **The Deterministic Application Guide**: Material Design

## 2. Why This Aesthetic Works
Material Design, created by Google in 2014, is built on a specific metaphor: the surface. Every element in Material Design is a surface — a physical slab of material floating at a specific height above the base surface. Surfaces can overlap, cast shadows on surfaces below them, and respond to user touch by generating ripple effects from the point of contact.
This surface metaphor creates a coherent spatial model that users can internalize. Once a user understands that shadows indicate height, and height indicates interactivity and priority, they can navigate any Material Design interface without explicit instruction. The spatial logic is consistent everywhere.
The ripple effect (the expanding circle that emanates from a touch point on buttons and list items) is Material Design's most distinctive feature. It references the physical reality of dropping something onto a flat surface — the ripple communicates "your touch landed here" with a satisfying, physically referential animation.

## 3. Color System
- The Material Color System
- **Material Design has a formal, published color system**: one of the most sophisticated color systems in design. Understanding it fully is essential to applying Material Design correctly.
- The Material Color Palette
- Material Design organizes colors into hue families, each with 14 swatches ranging from 50 (very light) to 900 (very dark), plus four accent colors (A100, A200, A400, A700).
- Example hue family (Blue):
- **Blue 50**: #E3F2FD (near-white blue)
- **Blue 100**: #BBDEFB
- **Blue 200**: #90CAF9
- **Blue 300**: #64B5F6
- **Blue 400**: #42A5F5
- **Blue 500**: #2196F3 ← The standard reference shade
- **Blue 600**: #1E88E5
- **Blue 700**: #1976D2 ← Common primary shade
- **Blue 800**: #1565C0
- **Blue 900**: #0D47A1 (near-navy)
- **Blue A100**: #82B1FF (accent)
- **Blue A200**: #448AFF (accent)
- **Blue A400**: #2979FF (accent)
- **Blue A700**: #2962FF (accent)
- How to Choose Your Palette
- Material Design requires three color roles:
- **Primary color**: the main brand color — used for the app bar, primary buttons, and active states. Choose the 500 or 700 shade of your hue.
- **Primary variant**: a darker shade of the primary — used for the status bar and navigation elements. Choose the 700 or 900 shade.
- **Secondary color (Accent)**: a contrasting color for FABs (Floating Action Buttons), selection controls, and links. Choose from the A200 or A400 accent swatches of a different hue family.
- Example palette:
- **Primary**: Blue 700 (#1976D2)
- **Primary variant**: Blue 900 (#0D47A1)
- **Secondary**: Teal A400 (#1DE9B6)
- **Background**: #FFFFFF
- **Surface**: #FFFFFF
- **Error**: #B00020
- Surface Colors
- **Background**: #FFFFFF — the base surface at elevation 0
- **Surface**: #FFFFFF — the color of cards, sheets, and menus
- **Error**: #B00020 — a specific, defined error red (not the brighter #E74C3C of flat design — Material's error red has more depth)

## 4. Typography
- The Material Type Scale
- Material Design has a formally defined type scale with 13 levels. Each level has a specific role.
- Using Roboto (the canonical Material font):
StyleSizeWeightLine HeightLetter SpacingH196pxLight (300)112px-1.5pxH260pxLight (300)72px-0.5pxH348pxRegular (400)56px0pxH434pxRegular (400)42px0.25pxH524pxRegular (400)32px0pxH620pxMedium (500)28px0.15pxSubtitle 116pxRegular (400)24px0.15pxSubtitle 214pxMedium (500)24px0.1pxBody 116pxRegular (400)24px0.5pxBody 214pxRegular (400)20px0.25pxButton14pxMedium (500)20px1.25px (uppercase)Caption12pxRegular (400)16px0.4pxOverline10pxRegular (400)16px1.5px (uppercase)
- **The letter-spacing values above are in pixels**: in CSS, divide by the font size to get em values (e.g., 0.15px at 16px = 0.009375em ≈ 0.01em).
- Why these specific values?
The Material type scale was developed by Google's typography team through extensive legibility research. The specific letter-spacing values compensate for the way Roboto's letterforms interact at different sizes — at very large sizes, letters need tighter spacing to read as unified words; at very small sizes, they need looser spacing to maintain legibility.

## 5. Spacing & Layout
- The Material Grid System
- Material Design uses a responsive grid system:
- **Desktop (1240px+)**: 12 columns, 24px gutters, 200px margins
- **Tablet (600px to 1239px)**: 8 columns, 16px gutters, 24px margins
- **Mobile (0px to 599px)**: 4 columns, 16px gutters, 16px margins
- Elevation (The Core Spatial Concept)
- Elevation is measured in density-independent pixels (dp) and represents the height of a surface above the base surface. Each elevation level has a prescribed shadow:
- **0dp**: No shadow (base surface — the background)
- **1dp**: box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) — switches, drawers at rest
- **2dp**: Slightly more pronounced — cards at rest
- **4dp**: Cards on hover
- **6dp**: Floating buttons (FABs) at rest
- **8dp**: Bottom sheets, menus, side drawers
- **12dp**: FABs on press
- **16dp**: Navigation drawers
- **24dp**: Dialogs and pickers (the highest elevation — the most important floating element)
- The shadow formula increases in both offset and blur as elevation increases. This creates a coherent, physically consistent spatial hierarchy across the entire interface.
### Component Spacing
- Material Design uses a baseline grid of 8dp for most spacing, with a 4dp grid for smaller components:
- **List item height**: 48dp (standard), 56dp (with secondary text), 72dp (with three lines)
- **Card padding**: 16dp on all sides
- **Button padding**: 8dp vertical, 16dp horizontal (standard), 8dp vertical, 24dp horizontal (extended)
- Dialog padding: 24dp

## 6. Borders, Shapes & Forms
- The Material Shape System
- Material Design 2 introduced a formal shape system where every component has a defined shape category:
- **Small components (buttons, chips, text fields)**: use rounded corners — 4dp to 8dp
- **Medium components (cards, dialogs)**: use either rounded (8dp to 12dp) or cut corners
- **Large components (navigation drawers, sheets)**: use rounded top corners only (16dp to 24dp top, 0dp bottom)
- The Ripple Effect (The Defining Interaction)
- The ripple is Material Design's most recognizable interaction pattern:
- **On touch/click**: a circle expands from the exact point of contact, radiating outward to fill the interactive element
- **Ripple color**: on dark backgrounds: rgba(255,255,255,0.32). On light backgrounds: rgba(0,0,0,0.12)
- **Duration**: 300ms to 500ms depending on the size of the element (larger elements need longer ripples)
- **The ripple does not wait for the animation to complete**: the action (navigation, form submission) happens immediately while the ripple plays simultaneously
- Form Elements (Text Fields)
- Material Design defines two text field styles:
- **Filled text field**: a colored background (the primary color at 12% opacity, deepening on hover to 16%) with a bottom line that changes to the primary color on focus
- **Outlined text field**: a full border (1px) that changes to the primary color and increases to 2px on focus, with the label floating above the border
The floating label (a label inside the input that moves up and out of the way when the user types) is Material Design's signature form pattern. Implementation: the label starts at the same position as placeholder text (inside the input, 16px font), then animates upward and shrinks (12px) when the input is focused or has content.

## 7. UI Components
- The App Bar
- The top app bar is the most distinctive Material component:
- **Background**: the primary color
- **Title**: white, H6 weight (20px Medium), left-aligned
- **Icons**: white, 24px, right-aligned (search, more options, etc.)
- **On scroll**: in Material 2, the app bar remains fixed at the top. In Material 3, it can scroll with the content and re-appear on scroll-up.
- The Floating Action Button (FAB)
- **The FAB is the most prominent action on any screen**: a circular button floating above all content at a high elevation:
- **Size**: 56dp diameter
- **Background**: the secondary (accent) color
- **Icon**: white, 24px
- **Elevation**: 6dp at rest, 12dp on press
- **Position**: bottom-right of the screen, 16dp from the bottom and right edges
- The FAB is for the single most important action on the screen. There should only ever be one FAB per screen.
### Cards
- Material cards are the primary content container:
- **Background**: white (#FFFFFF)
- **Border-radius**: 4dp (Material 2) or 12dp (Material 3)
- **Elevation**: 1dp to 2dp at rest, 8dp on hover
- No border (elevation shadow provides the boundary)
- **Internal padding**: 16dp on all sides
- Navigation Drawer
- The side navigation panel:
- **Width**: 256dp on desktop, full screen on mobile
- **Background**: white, at elevation 16dp
- **Selected item**: primary color at 12% opacity as the background, primary color text
- **Non-selected items**: black text at 87% opacity, grey icons

## 8. Imagery & Texture
- Material Design uses photography and illustration purposefully:
- **Photography ratios**: 16:9, 3:2, or 1:1 — standardized across the design system
- **Photography quality**: high-production, consistent tone — Material Design images are never raw or unedited
- **Material illustration style (Material 3)**: geometric, flat-color illustrations with soft shadows — the illustrations themselves follow the Material elevation model
- Zero physical texture. Material Design surfaces are perfectly smooth. Texture belongs to skeuomorphism.

## 9. Animation & Motion
- Material Design has a published motion specification:
- Duration guidelines:
- **Simple transitions (color, opacity)**: 100ms to 200ms
- **Complex transitions (entering/leaving screen)**: 225ms to 375ms
- **Elaborate sequences**: 400ms to 500ms maximum
- Easing curves:
- **Standard easing (most transitions)**: cubic-bezier(0.4, 0, 0.2, 1) — starts quickly, decelerates sharply at the end
- **Decelerate easing (elements entering the screen)**: cubic-bezier(0, 0, 0.2, 1) — maximum speed at the start, smooth stop
- **Accelerate easing (elements leaving the screen)**: cubic-bezier(0.4, 0, 1, 1) — starts slow, exits at full speed
- Shared element transitions:
When navigating from a list to a detail view, the image or card from the list view physically transforms into the hero image of the detail view — scaling, repositioning, and reshaping across the screen transition. This is Material Design's most sophisticated animation technique and communicates spatial continuity between screens.

## 10. Master Avoids List
- **Ignoring the elevation system**: applying shadows arbitrarily breaks the spatial logic entirely
- **Using non-Material colors**: the Material color system is a complete specification; mixing in arbitrary hex codes breaks the systematic harmony
- **Multiple FABs**: one per screen, maximum. Two FABs on the same screen is a Material Design specification violation.
- **Custom easing curves**: the three standard Material easing curves cover every use case. Custom curves that don't match these feel physically wrong within the Material spatial model.
- **Serif typography**: Material Design is a sans-serif system (Roboto). Introducing serifs creates a typography conflict with the functional, systematic aesthetic.
- **Decorative backgrounds**: Material surfaces are white or the primary color. Textured, photographed, or gradient backgrounds are incompatible with the surface metaphor.
- **Skipping the ripple effect**: the ripple is both a functional affordance and a signature of the aesthetic. Replacing it with a flat color change produces a visually correct but experientially incomplete Material interface.

