# Orient Global — Master Brand Identity & Design System Specification

> **Location**: Jos, Plateau State, Nigeria  
> **Brand Archetype**: Multi-Archetype Luxury Flagship Destination  
> **Core Philosophy**: *Intentional Pairings over Defaults* — institutional-grade trust meets bespoke divisional aesthetics.

---

## 1. Brand Identity Overview & Architectural Hierarchy

Orient Global is an integrated enterprise hospitality, entertainment, and logistics ecosystem. While unified under a high-trust corporate identity, each division has a distinct visual density and personality:

| Division | Design Archetype | Visual Density | Emotional Anchor |
| :--- | :--- | :--- | :--- |
| **Global Flagship** | Luxury Institutional / Liquid Glass | Balanced (Responsive Snap) | Prestige, Trust, Civic Monument |
| **Orient Bakery** | Warm Organic / Cultural Artisanal | Medium Density (Tactile, Soft) | Warmth, Craft, Fresh Sourdough |
| **Orient Supermarket**| Clean Utility / Rapid Data Grid | High Density (Scannable) | Freshness, Abundance, Reliability |
| **Orient Fine Dining**| Noir Luxury / High Editorial | Low-Medium Density (Airy, Deep) | Elegance, Intimacy, Culinary Art |
| **Orient Games Arena**| Cyber Brutalist / High-Refresh HUD | Ultra-High Density (Borders, HUD) | Adrenaline, Speed, Next-Gen Tech |
| **Orient Spring Water**| Atmospheric / Ultra-Minimalist | Low Density (Breathing, Floating) | Absolute Purity, Hydration, Nature |
| **Orient Lounge** | Prestige / Velvet Nightclub | Medium-Low Density (Moody, Rich) | Exclusivity, Sensual Mixology |

---

## 2. Typography System & Hierarchy

### 2.1 Font Families & Font Stack

All web fonts are loaded via Google Fonts in `index.html` and configured in `index.css` & Tailwind:

```css
/* Google Fonts Import in index.html */
https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@800;900&family=Great+Vibes&family=Source+Code+Pro:wght@400;600;700&display=swap
```

| Token / Key | Font Family | Fallback Stack | Primary Usage |
| :--- | :--- | :--- | :--- |
| **`font-display`** | **Manrope** | `sans-serif` | Clean UI body, modern buttons, navigation links, data tables |
| **`font-serif`** | **Playfair Display** | `serif` | Luxury titles, dining course titles, chef quotes, editorial headers |
| **`font-heading`** | **Montserrat** | `sans-serif` | Heavy display headlines (weights 800/900), sports/games hero banners |
| **`font-script`** | **Great Vibes** | `cursive` | Artisanal bakery signatures, sommelier cellar stamps, luxury flourishes |
| **`font-code`** | **Source Code Pro** | `ui-monospace, monospace` | Arena hardware specs, water chemical purity data, order tracking IDs |

---

### 2.2 Mathematical Typographic Scale & Hierarchy

We follow a **Major Second (1.125) to Minor Third (1.20)** typographic ratio for dense product UI, and a **Perfect Fourth (1.333)** scale for luxury editorial titles:

| Level | Size (px / rem) | Tailwind Class | Line Height | Tracking | Weight | Applied In |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `56px – 72px` (`3.5 – 4.5rem`) | `text-5xl lg:text-7xl` | `1.05` | `-0.03em` | 800 / 900 | Homepage Hero, Division Landing Titles |
| **H1 Major Section** | `36px – 48px` (`2.25 – 3.0rem`)| `text-4xl lg:text-5xl` | `1.15` | `-0.02em` | 700 / 800 | Section Headers, Brand Manifesto Titles |
| **H2 Division Title**| `28px – 36px` (`1.75 – 2.25rem`)| `text-2xl lg:text-4xl` | `1.2` | `-0.01em` | 600 / 700 | Division Hero Banners, Modal Titles |
| **H3 Card Headline** | `20px – 24px` (`1.25 – 1.5rem`) | `text-xl lg:text-2xl` | `1.3` | `0em` | 600 | Bento Grid Cards, Service Feature Heads |
| **H4 Subhead / Lead**| `18px` (`1.125rem`) | `text-lg` | `1.4` | `0em` | 500 / 600 | Category Headers, Product Titles |
| **Body Lead** | `18px` (`1.125rem`) | `text-lg` | `1.6` | `0em` | 400 | Editorial introductions, section intros |
| **Body Standard** | `16px` (`1.0rem`) | `text-base` | `1.65` | `0em` | 400 | Descriptions, articles, forms (65-75ch) |
| **Body Small** | `14px` (`0.875rem`) | `text-sm` | `1.5` | `0.01em` | 400 / 500 | Metadata, timestamps, item subtexts |
| **Micro / Eyebrow** | `11px – 12px` (`0.75rem`) | `text-xs uppercase` | `1.4` | `+0.08em` | 600 / 700 | Badges, tags, status pills, specs |

---

## 3. Color Palette & Brand Tokens

### 3.1 Corporate Core Identity Colors

The primary global identity uses an amber-gold accent paired with refined warm or cool dark neutrals:

```
Core Brand Gold:      #F29E0D  (Primary Flagship Accent)
Vibrant Orange-Amber: #F97316  (Action Buttons & Interactive Rings)
Deep Sovereign Gold:  #C27D08  (Darkened Gold for Light Mode Contrast)
Light Canvas:         #FDFDFD  (Pure Warm Off-White)
Dark Canvas (Noir):   #0F0F0F  (Refined Charcoal Black)
Deep Void:            #050402  (Absolute Pure Shadow for OLED/Hero)
```

| Token | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| `--color-background` | `#FDFDFD` | `#0F0F0F` | Global view canvas |
| `--color-foreground` | `#0F172A` | `#FDFDFD` | Primary readable text |
| `--color-surface` | `#FFFFFF` | `#1A1A1A` | Elevated cards, dialogs, drawers |
| `--color-border` | `#F1F5F9` | `#27272A` | Structural hairline dividers |
| `--color-primary` | `#F97316` / `#F29E0D` | `#F97316` | Key CTAs, active states, focus rings |
| `--color-primary-fg` | `#FFFFFF` | `#FFFFFF` | Text on primary brand buttons |
| `--color-muted` | `#F8FAFC` | `#27272A` | Inactive tabs, disabled backgrounds |
| `--color-muted-fg` | `#64748B` | `#A1A1AA` | Secondary helper text, captions |

---

### 3.2 Division-Specific Signature Palettes

Each division carries a curated color signature that instantly identifies the business vertical:

#### 🥖 1. Orient Bakery
* **Archetype**: Warm Organic, Artisanal Flour & Dough
* **Signature Accent**: Warm Amber `#D97706` & Golden Crust `#B45309`
* **Surface Background**: Soft Dough Cream `#FAF6F0` (Light) / Deep Espresso `#1A1410` (Dark)
* **Highlight Color**: Sourdough Gold `#FDE68A`
* **Text Contrast**: Dark Roasted Wheat `#451A03`

#### 🛒 2. Orient Supermarket
* **Archetype**: Clean Utility, Fresh Produce & High Contrast
* **Signature Accent**: Fresh Leaf Emerald `#10B981` & Grocery Red Alert `#EF4444`
* **Surface Background**: Crisp Porcelain `#FFFFFF` (Light) / Graphite Slate `#121820` (Dark)
* **Highlight Color**: Sunny Citrus `#F59E0B`
* **Text Contrast**: Deep Navy Slate `#0F172A`

#### 🍷 3. Orient Fine Dining
* **Archetype**: Noir Editorial Luxury & Vintage Cellar
* **Signature Accent**: Vintage Champagne Gold `#D4AF37` / `#C5A059`
* **Surface Background**: Velvet Charcoal `#121212` (Light) / Pure Noir `#070707` (Dark)
* **Highlight Color**: Aged Burgundy `#6B1D2F`
* **Text Contrast**: Warm Alabaster `#F5F5F0`

#### 🎮 4. Orient Esports & Games Arena
* **Archetype**: Cyberpunk HUD, Tournament Gaming
* **Signature Accent**: Cyber Cyan `#00F3FF` & Neon Purple `#B026FF`
* **Tournament Accent**: Victory Yellow `#FAC015` & Laser Blue `#135BEC`
* **Surface Background**: Pure Void `#020202`
* **Borders**: 1px High-Tech Wireframe `#00F3FF33` (20% cyan)

#### 💧 5. Orient Spring Water
* **Archetype**: Atmospheric Purity & Crystal Hydration
* **Signature Accent**: Pure Alpine Sky `#38BDF8` & Mineral Ocean `#0284C7`
* **Surface Background**: Aero White `#F5F7FA` (Light) / Deep Marine Obsidian `#08131F` (Dark)
* **Highlight Color**: Glacial Frost `#E0F2FE`
* **Translucency**: 60% Frosted Glass with 30px backdrop blur

#### 🍸 6. Orient Executive Lounge
* **Archetype**: Speakeasy Prestige & Nightlife Mystery
* **Signature Accent**: Smoked Cognac `#92400E` & Rich Ruby `#831843`
* **Ambient Glow**: Warm Sunset Neon `#FB923C`
* **Surface Background**: Pitch Velvet `#080808`
* **Text Contrast**: Soft Brushed Platinum `#E2E8F0`

---

## 4. Graphic Elements & Geometry Rules

### 4.1 Surface Treatments & Glassmorphism

Orient Global uses optical depth instead of heavy shadows:

```css
/* Glassmorphism Light */
.glass-morph {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Glassmorphism Dark */
.glass-morph-dark {
  background: rgba(15, 15, 15, 0.6);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Dynamic Spotlight Card Hover */
.spotlight-card {
  position: relative;
  overflow: hidden;
}
.spotlight-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(242, 158, 13, 0.08), transparent 40%);
  pointer-events: none;
}
```

### 4.2 Border Radius Hierarchy & Mathematical Nesting

* **Buttons & Badges**: Fully rounded pills (`rounded-full` / `9999px`) or `rounded-lg` (`8px`).
* **Standard Content Cards**: `rounded-xl` (`12px` to `16px`).
* **Bakery Division Cards**: `rounded-3xl` (`24px` to `32px`) to evoke organic bread loaf contours.
* **Games Arena HUD Panels**: Sharp technical corners `rounded-sm` (`2px` to `4px`) with 1px border.
* **Mathematical Nested Radius Rule**:
  $$\text{Inner Corner Radius} = \text{Outer Corner Radius} - \text{Padding}$$
  *Example*: A card with outer radius of `16px` and padding of `8px` has child elements styled with an inner radius of `8px`.

### 4.3 Elevation & Shadows

Orient avoids murky default drop shadows, preferring high-contrast directional elevation:

* **Soft Elevation (`--shadow-soft`)**: `0 4px 6px -1px rgba(0, 0, 0, 0.04)`
* **Elite Floating Card (`--shadow-elite`)**: `0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)`
* **Brand Glow (`.orange-glow`)**: `0 4px 24px rgba(249, 115, 22, 0.18)`
* **Cyber Glow (Games)**: `0 0 15px rgba(0, 243, 255, 0.25)`

---

## 5. Iconography System

### 5.1 Approved Icon Families

Orient Global strictly uses two cohesive icon libraries:

1. **`lucide-react` (Primary Vector Icon Library)**:
   * Used for all interactive UI controls, buttons, navigations, form inputs, status checks, and KPI counters.
   * **Attributes**: Clean 24px grid, unified geometric round caps.
2. **`Material Symbols Outlined` (Display & Architectural Glyphs)**:
   * Used for decorative badge accents and specific building/amenity markers in `index.html`.

### 5.2 Stroke Width & Scale Standards

| Icon Context | Size (px) | Tailwind Sizing | Stroke Width | Color Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Inline / Micro Tags** | `14px – 16px` | `w-3.5 h-3.5` / `w-4 h-4` | `2.0` | Matches text color (`currentColor`) |
| **Interactive Buttons** | `18px – 20px` | `w-4.5 h-4.5` / `w-5 h-5` | `1.75` | High contrast to button background |
| **Card Feature Badges**| `24px – 28px` | `w-6 h-6` / `w-7 h-7` | `1.5` | Wrapped in 10% tint circular badge |
| **Hero Landmark Icons** | `36px – 48px` | `w-10 h-10` / `w-12 h-12`| `1.25` | Golden amber or silver accent |

### 5.3 Icon Styling Anti-Patterns
* ❌ **Forbidden**: Never place bare gray icons on low-contrast colored backgrounds.
* ❌ **Forbidden**: Never use solid filled clunky icons mixed with outline icons in the same view.
* ❌ **Forbidden**: Never scale icons non-proportionally.

---

## 6. Photography & Art Direction Guidelines

### 6.1 Core Aesthetic: Authentic Luxury in Jos

Orient Global imagery must look **tactile, natural, and editorial** — rejecting over-processed, plastic AI tropes:

* **Lighting**: Natural morning sun or evening golden hour; warm candlelight for Dining and Lounge; crisp daylight for Supermarket fresh produce.
* **Color Grading**: Deep, rich blacks with preserved shadow detail; natural food saturation; no neon hyper-saturation outside the Games Arena.
* **Depth of Field**: Shallow depth of field (f/1.8 – f/2.8) for culinary and artisanal bakery macros; expansive deep focus for architecture and supermarkets.

### 6.2 Division Photographic Briefs

1. **Artisanal Bakery**:
   * *Subject*: Crisp scored sourdough loaves dusted with white flour; bubbling starter jars; golden flaked croissants with visible butter lamination.
   * *Surfaces*: Slate, marble rolling counters, natural dark oak peel boards.
2. **Fresh Supermarket**:
   * *Subject*: Fresh Plateau State agricultural crops (crisp Jos cabbage, strawberries, tomatoes, peppers); organized aisle geometry with bright ambient light.
3. **Haute Dining**:
   * *Subject*: Plated modern Nigerian and international gastronomy; delicate reduction drizzles; vintage wine stemware reflecting intimate candlelight.
4. **Esports Arena**:
   * *Subject*: Liquid cooling tubes glowing with neon coolant; mechanical keyboard keycaps; focused tournament players with headset silhouettes.
5. **Spring Water**:
   * *Subject*: High-speed macro photography of crystalline water drops; condensation on recycled glass bottles; stainless steel purification manifolds.
6. **Executive Lounge**:
   * *Subject*: Crystal tumbler with single large clear ice sphere; swirling bourbon or bespoke craft cocktail; subtle velvet banquettes and dim mood lamps.

### 6.3 Standard Image Aspect Ratios

* **Hero Banners & Ambient Video**: `16:9` (e.g., `1920x1080` or `1280x720`)
* **Product Catalog & Bento Grid**: `4:3` (e.g., `800x600`) or `1:1` square (`600x600`)
* **Editorial Portraits & Sommelier Bottles**: `3:4` vertical (e.g., `600x800`)
* **Banner Strips**: `21:9` ultra-wide (`1920x820`)

---

## 7. Motion & Interaction Principles

* **Scroll Mechanics**: CSS scroll snap (`snap-y snap-mandatory`) on desktop with custom easing for magnetic section anchoring.
* **Micro-Transitions**: Fast, responsive UI feedback (`transition-all duration-200 ease-out`).
* **Luxury Parallax**: Subtle image scale shifts (`scale-105` on hover) and Y-axis offsets (`useScroll` & `useTransform` from `motion/react`).
* **Text Reveal Masks**: Staggered character or line reveal masks (`clip-path: polygon(...)`) for major hero title entrances.
