/**
 * Orient Global — Master Brand Identity Tokens & Design System
 * Location: Jos, Plateau State, Nigeria
 * 
 * Provides type-safe constants for colors, font families, typographic hierarchy,
 * division-specific themes, iconography standards, and photographic guidelines.
 */

export const BRAND_IDENTITY = {
  name: "Orient Global",
  tagline: "The Luxury Flagship Destination of Jos",
  location: "Jos, Plateau State, Nigeria",
  philosophy: "Intentional Pairings over Defaults — Institutional-grade trust meets bespoke luxury.",
} as const;

/**
 * 1. TYPOGRAPHY SYSTEM
 */
export const FONT_FAMILIES = {
  display: '"Manrope", sans-serif',
  serif: '"Playfair Display", serif',
  heading: '"Montserrat", sans-serif',
  script: '"Great Vibes", cursive',
  code: '"Source Code Pro", ui-monospace, SFMono-Regular, monospace',
} as const;

export const TYPOGRAPHY_SCALE = {
  hero: {
    fontSize: "clamp(2.75rem, 5vw, 4.5rem)", // 44px to 72px
    lineHeight: "1.05",
    letterSpacing: "-0.03em",
    fontWeight: "800",
    tailwindClass: "text-5xl lg:text-7xl font-extrabold tracking-tight leading-none",
    usage: "Homepage Hero titles, Division Showcase entrances",
  },
  h1: {
    fontSize: "clamp(2.25rem, 4vw, 3rem)", // 36px to 48px
    lineHeight: "1.15",
    letterSpacing: "-0.02em",
    fontWeight: "700",
    tailwindClass: "text-4xl lg:text-5xl font-bold tracking-tight",
    usage: "Major section headers, Manifesto headlines",
  },
  h2: {
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)", // 28px to 36px
    lineHeight: "1.2",
    letterSpacing: "-0.01em",
    fontWeight: "600",
    tailwindClass: "text-2xl lg:text-4xl font-semibold tracking-tight",
    usage: "Division hero headlines, modal sheet titles",
  },
  h3: {
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)", // 20px to 24px
    lineHeight: "1.3",
    letterSpacing: "0",
    fontWeight: "600",
    tailwindClass: "text-xl lg:text-2xl font-semibold",
    usage: "Card titles, bento grid block headings",
  },
  h4: {
    fontSize: "1.125rem", // 18px
    lineHeight: "1.4",
    letterSpacing: "0",
    fontWeight: "600",
    tailwindClass: "text-lg font-semibold",
    usage: "Product titles, catalog subcategories, pricing headers",
  },
  bodyLead: {
    fontSize: "1.125rem", // 18px
    lineHeight: "1.6",
    letterSpacing: "0",
    fontWeight: "400",
    tailwindClass: "text-lg font-normal leading-relaxed",
    usage: "Section intro blurbs, editorial quotes",
  },
  bodyRegular: {
    fontSize: "1rem", // 16px
    lineHeight: "1.65",
    letterSpacing: "0",
    fontWeight: "400",
    tailwindClass: "text-base font-normal leading-relaxed max-w-[70ch]",
    usage: "Standard body copy, paragraphs, form labels, descriptions",
  },
  bodySmall: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.5",
    letterSpacing: "0.01em",
    fontWeight: "400",
    tailwindClass: "text-sm font-normal leading-normal",
    usage: "Secondary helper text, metadata, order timestamps",
  },
  micro: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1.4",
    letterSpacing: "0.08em",
    fontWeight: "600",
    tailwindClass: "text-xs font-semibold uppercase tracking-wider",
    usage: "Status badges, category pills, specs chips, oven alarms",
  },
} as const;

/**
 * 2. BRAND COLOR SYSTEM
 */
export const CORE_COLORS = {
  // Flagship Amber/Gold
  primaryAmber: "#F29E0D",
  actionOrange: "#F97316",
  sovereignGold: "#C27D08",
  goldGlow: "rgba(242, 158, 13, 0.15)",
  
  // High-Contrast Neutrals
  canvasLight: "#FDFDFD",
  canvasDark: "#0F0F0F",
  voidBlack: "#050402",
  
  // Surfaces
  surfaceLight: "#FFFFFF",
  surfaceDark: "#1A1A1A",
  surfaceCardDark: "#161616",
  
  // Borders
  borderLight: "#E2E8F0",
  borderLightSubtle: "#F1F5F9",
  borderDark: "#27272A",
  borderDarkHairline: "rgba(255, 255, 255, 0.08)",
  
  // Text
  textLightPrimary: "#0F172A",
  textLightSecondary: "#64748B",
  textDarkPrimary: "#FDFDFD",
  textDarkSecondary: "#A1A1AA",
} as const;

/**
 * 3. DIVISION THEME SPECIFICATIONS
 */
export const DIVISION_THEMES = {
  bakery: {
    name: "Orient Bakery",
    archetype: "Warm Organic / Cultural Artisanal",
    density: "Medium (Approachably Tactile)",
    fonts: {
      heading: FONT_FAMILIES.serif,
      body: FONT_FAMILIES.display,
      accent: FONT_FAMILIES.script,
    },
    colors: {
      accent: "#D97706",       // Warm Amber
      crustBrown: "#B45309",   // Golden Crust
      doughCream: "#FAF6F0",   // Warm Off-White Light BG
      darkEspresso: "#1A1410", // Dark BG
      goldHighlight: "#FDE68A",
      textContrast: "#451A03",
    },
    borderRadius: "rounded-3xl", // 24px-32px rounded to evoke dough/bread
    shadow: "shadow-[0_8px_30px_rgb(217,119,6,0.08)]",
  },
  supermarket: {
    name: "Orient Supermarket",
    archetype: "Clean Utility / Rapid Data Grid",
    density: "High (Dense, Scannable Inventory)",
    fonts: {
      heading: FONT_FAMILIES.display,
      body: FONT_FAMILIES.display,
      accent: FONT_FAMILIES.code,
    },
    colors: {
      accent: "#10B981",       // Fresh Green
      alertRed: "#EF4444",     // Sale / Promo Red
      sunYellow: "#F59E0B",    // Value deals
      bgLight: "#FFFFFF",
      bgDark: "#0F141C",
      borderLight: "#E2E8F0",
      textContrast: "#0F172A",
    },
    borderRadius: "rounded-xl", // 12px clean bento boxes
    shadow: "shadow-sm hover:shadow-md",
  },
  dining: {
    name: "Orient Fine Dining",
    archetype: "Noir Luxury / High Editorial",
    density: "Low-Medium (Spacious, Intimate)",
    fonts: {
      heading: FONT_FAMILIES.serif,
      body: FONT_FAMILIES.display,
      accent: FONT_FAMILIES.serif,
    },
    colors: {
      accent: "#D4AF37",       // Champagne Gold
      agedBurgundy: "#4A0E17", // Cellar Wine
      bgNoir: "#080808",       // Pure Dining Noir
      surfaceCard: "#141414",
      borderGold: "rgba(212, 175, 55, 0.2)",
      textAlabaster: "#F5F5F0",
    },
    borderRadius: "rounded-none md:rounded-lg", // Architectural, classic
    shadow: "shadow-[0_20px_50px_rgba(0,0,0,0.8)]",
  },
  games: {
    name: "Orient Esports Arena",
    archetype: "Cyber Brutalist / High-Refresh HUD",
    density: "Ultra-High (Data-Rich, Monospace, HUD)",
    fonts: {
      heading: FONT_FAMILIES.heading,
      body: FONT_FAMILIES.code,
      accent: FONT_FAMILIES.code,
    },
    colors: {
      accentCyan: "#00F3FF",       // Cyber Cyan
      neonPurple: "#B026FF",       // Neon Violet
      tournamentYellow: "#FAC015", // Tournament Gold
      laserBlue: "#135BEC",
      bgVoid: "#020202",
      hudBorder: "rgba(0, 243, 255, 0.25)",
    },
    borderRadius: "rounded-sm", // Technical 2px-4px corners
    shadow: "shadow-[0_0_20px_rgba(0,243,255,0.15)]",
  },
  water: {
    name: "Orient Spring Water",
    archetype: "Atmospheric / Ultra-Minimalist",
    density: "Low (Expansive, Breathing, Transparent)",
    fonts: {
      heading: FONT_FAMILIES.display,
      body: FONT_FAMILIES.display,
      accent: FONT_FAMILIES.code,
    },
    colors: {
      accentSky: "#38BDF8",     // Glacial Aqua
      deepOcean: "#0284C7",     // Deep Spring
      bgLight: "#F5F7FA",       // Aero White
      bgDark: "#08131F",       // Deep Marine
      glassBorder: "rgba(56, 189, 248, 0.2)",
    },
    borderRadius: "rounded-2xl", // 16px-20px fluid curves
    shadow: "shadow-[0_10px_40px_rgba(56,189,248,0.1)]",
  },
  lounge: {
    name: "Orient Executive Lounge",
    archetype: "Prestige / Velvet Nightclub",
    density: "Medium-Low (Moody, Immersive)",
    fonts: {
      heading: FONT_FAMILIES.serif,
      body: FONT_FAMILIES.display,
      accent: FONT_FAMILIES.script,
    },
    colors: {
      accentCognac: "#92400E",   // Smoked Amber
      velvetRuby: "#831843",     // Deep Lounge Berry
      neonWarm: "#FB923C",
      bgPitch: "#080808",
      borderSubtle: "rgba(251, 146, 60, 0.15)",
    },
    borderRadius: "rounded-xl",
    shadow: "shadow-[0_20px_60px_rgba(0,0,0,0.9)]",
  },
} as const;

/**
 * 4. GRAPHIC & GEOMETRIC DESIGN ELEMENTS
 */
export const GRAPHIC_ELEMENTS = {
  glassmorphism: {
    light: "bg-white/75 backdrop-blur-xl border border-white/40 shadow-sm",
    dark: "bg-black/40 backdrop-blur-2xl border border-white/5 shadow-2xl",
    ultraDark: "bg-black/80 backdrop-blur-3xl border border-white/10",
  },
  spotlight: {
    wrapperClass: "spotlight-card relative overflow-hidden",
    radialGradient: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(242, 158, 13, 0.08), transparent 40%)",
  },
  glows: {
    orangeGlow: "box-shadow: 0 4px 24px rgba(249, 115, 22, 0.18)",
    cyanGlow: "box-shadow: 0 0 20px rgba(0, 243, 255, 0.25)",
    goldGlow: "box-shadow: 0 4px 30px rgba(212, 175, 55, 0.2)",
  },
  radii: {
    pill: "rounded-full",
    sm: "rounded-sm", // 2px (hud, buttons in tech)
    md: "rounded-md", // 6px
    lg: "rounded-lg", // 8px (default cards, controls)
    xl: "rounded-xl", // 12px (major bento tiles)
    "2xl": "rounded-2xl", // 16px (division cards)
    "3xl": "rounded-3xl", // 24px-32px (bakery organic cards)
  },
  nestedRadiusFormula: "Inner_Radius = Outer_Radius - Padding",
} as const;

/**
 * 5. ICONOGRAPHY STANDARDS
 */
export const ICONOGRAPHY_SYSTEM = {
  primaryLibrary: "lucide-react",
  secondaryLibrary: "Material Symbols Outlined (architectural and display badges)",
  standards: {
    micro: {
      sizePx: 14,
      tailwindSize: "w-3.5 h-3.5",
      strokeWidth: 2.0,
      usage: "Inline tag icons, status indicators, breadcrumbs",
    },
    interactive: {
      sizePx: 18,
      tailwindSize: "w-4.5 h-4.5 md:w-5 md:h-5",
      strokeWidth: 1.75,
      usage: "Navigation links, action buttons, search inputs, dropdown chevrons",
    },
    featureCard: {
      sizePx: 24,
      tailwindSize: "w-6 h-6",
      strokeWidth: 1.5,
      usage: "Bento grid feature icons, category badges",
    },
    heroBadge: {
      sizePx: 40,
      tailwindSize: "w-10 h-10",
      strokeWidth: 1.25,
      usage: "Landmark highlights, award medallions, trust emblems",
    },
  },
  rules: [
    "Always import icons as named imports from 'lucide-react'",
    "Never use gray icons on colored background; maintain WCAG AA contrast",
    "Containerize feature icons in subtle 10% opacity colored rounded pills or circles",
    "Keep stroke-width consistent (1.5 to 1.75) within the same container",
  ],
} as const;

/**
 * 6. PHOTOGRAPHY & ART DIRECTION GUIDELINES
 */
export const PHOTOGRAPHY_GUIDELINES = {
  style: "Tactile, Editorial, High Dynamic Range, and Authentic to Jos, Nigeria",
  lighting: {
    daylight: "Natural morning sun with soft shadow transitions (Bakeries, Supermarkets)",
    candlelight: "Warm 2700K ambient illumination with high specular highlights (Dining, Lounge)",
    highTech: "Directional neon spill with high-contrast black backdrops (Games Arena)",
    pristine: "High-key, clear, diffuse natural light (Spring Water plant)",
  },
  compositionAspectRatios: {
    hero: "16:9 (1920x1080 or 1280x720) for cinematic full-width banners",
    bentoCard: "4:3 (800x600) for standard responsive cards",
    catalogSquare: "1:1 (600x600) for product items and dishes",
    editorialVertical: "3:4 (600x800) for sommelier bottles, chef profiles, and VIP cards",
    panoramicStrip: "21:9 (1920x820) for divider banners",
  },
  bannedTropes: [
    "No over-saturated artificial HDR plastic food",
    "No generic Western stock grocery photos; depict fresh Nigerian & Plateau produce",
    "No blurry low-resolution textures",
    "Always set referrerPolicy='no-referrer' on standard <img> tags",
  ],
} as const;
