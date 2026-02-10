// Template identifiers
export type StyleTemplate =
  | "corporateClassic" | "modernMinimal" | "darkExecutive" | "glassmorphismPro"
  | "gradientVibes" | "neonGlow" | "softPastels" | "materialDesign"
  | "brutalist" | "swissClean" | "warmEarth" | "oceanBreeze"
  | "forestDark" | "sunsetCoral" | "techStartup";

// Template categories
export type StyleTemplateCategory = "corporate" | "modern" | "dark" | "creative" | "minimal";

// Header styles (6 built-in)
export type HeaderStyle = "classic" | "modern" | "glassmorphism" | "gradient" | "transparent" | "minimal";

// Footer styles (4 built-in)
export type FooterStyle = "classic" | "modern" | "minimal" | "expanded";

// Card visual style
export type CardStyle = "standard" | "glass" | "neo" | "flat";

// Shadow preset
export type ShadowPreset = "none" | "subtle" | "medium" | "elevated" | "dramatic";

// Icon library
export type IconLibrary = "fluent" | "fontawesome" | "material" | "none";

// Heading scale ratio
export type HeadingScale = "1.125" | "1.200" | "1.250" | "1.333";

// Web Part header styling
export type WpHeaderStyle = "standard" | "accent-bar" | "bordered" | "underlined" | "shadowed" | "gradient-bar" | "icon-accent";

// Web Part border styling
export type WpBorderStyle = "standard" | "rounded" | "pill" | "sharp" | "double" | "dashed";

// Web Part shadow styling
export type WpShadowStyle = "standard" | "elevated" | "flat" | "inset" | "colored" | "dramatic";

// Web Part spacing
export type WpSpacing = "compact" | "standard" | "comfortable" | "spacious";

// Scroll reveal style
export type ScrollRevealStyle = "fade-up" | "slide-left" | "scale" | "rotate";

// Hover micro-animation
export type HoverEffect = "lift" | "glow" | "scale" | "tilt";

// Page transition style
export type PageTransitionStyle = "fade" | "slide" | "zoom";

// Dark mode preference
export type DarkModePreference = "system" | "manual" | "both";

// Custom cursor style
export type CursorStyle = "default" | "crosshair" | "dot" | "circle";

// All templates array for iteration
export var ALL_TEMPLATES: StyleTemplate[] = [
  "corporateClassic", "modernMinimal", "darkExecutive", "glassmorphismPro",
  "gradientVibes", "neonGlow", "softPastels", "materialDesign",
  "brutalist", "swissClean", "warmEarth", "oceanBreeze",
  "forestDark", "sunsetCoral", "techStartup",
];

// Template category mapping
export var TEMPLATE_CATEGORIES: Record<StyleTemplate, StyleTemplateCategory> = {
  corporateClassic: "corporate",
  modernMinimal: "minimal",
  darkExecutive: "dark",
  glassmorphismPro: "creative",
  gradientVibes: "creative",
  neonGlow: "dark",
  softPastels: "modern",
  materialDesign: "modern",
  brutalist: "creative",
  swissClean: "minimal",
  warmEarth: "creative",
  oceanBreeze: "modern",
  forestDark: "dark",
  sunsetCoral: "modern",
  techStartup: "corporate",
};

// All header styles for iteration
export var ALL_HEADER_STYLES: HeaderStyle[] = ["classic", "modern", "glassmorphism", "gradient", "transparent", "minimal"];

// All footer styles for iteration
export var ALL_FOOTER_STYLES: FooterStyle[] = ["classic", "modern", "minimal", "expanded"];

// Display name helpers
export function getTemplateDisplayName(template: StyleTemplate): string {
  var names: Record<StyleTemplate, string> = {
    corporateClassic: "Corporate Classic",
    modernMinimal: "Modern Minimal",
    darkExecutive: "Dark Executive",
    glassmorphismPro: "Glassmorphism Pro",
    gradientVibes: "Gradient Vibes",
    neonGlow: "Neon Glow",
    softPastels: "Soft Pastels",
    materialDesign: "Material Design",
    brutalist: "Brutalist",
    swissClean: "Swiss Clean",
    warmEarth: "Warm Earth",
    oceanBreeze: "Ocean Breeze",
    forestDark: "Forest Dark",
    sunsetCoral: "Sunset Coral",
    techStartup: "Tech Startup",
  };
  return names[template] || String(template);
}

export function getHeaderStyleDisplayName(style: HeaderStyle): string {
  var names: Record<HeaderStyle, string> = {
    classic: "Classic", modern: "Modern", glassmorphism: "Glassmorphism",
    gradient: "Gradient", transparent: "Transparent", minimal: "Minimal",
  };
  return names[style] || String(style);
}

export function getFooterStyleDisplayName(style: FooterStyle): string {
  var names: Record<FooterStyle, string> = {
    classic: "Classic", modern: "Modern", minimal: "Minimal", expanded: "Expanded",
  };
  return names[style] || String(style);
}
