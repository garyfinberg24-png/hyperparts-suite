// HyperFAQ V2 enum types, dropdown option arrays, and display name helpers

// Display layouts (expanded from none to 8)
export type FaqLayout =
  | "accordion"
  | "cardGrid"
  | "magazine"
  | "tabs"
  | "timeline"
  | "masonry"
  | "compact"
  | "knowledgeBase";

// Accordion styles (expanded from 4 to 8)
export type FaqAccordionStyle =
  | "clean"
  | "boxed"
  | "bordered"
  | "minimal"
  | "card"
  | "gradient"
  | "numbered"
  | "iconAccent";

// Sort modes (same as V1)
export type FaqSortMode = "alphabetical" | "popular" | "recent" | "category";

// Template IDs
export type FaqTemplateId =
  | "corporate-clean"
  | "modern-minimal"
  | "bold-colorful"
  | "dark-executive"
  | "glassmorphism"
  | "gradient-cards"
  | "neon-glow"
  | "professional-blue"
  | "warm-earth"
  | "tech-startup"
  | "magazine-style"
  | "apple-inspired";

// Category icons mapping
export type FaqCategoryIcon = "Shield" | "People" | "Mail" | "Heart" | "Lock" | "Emoji";

// ── ALL_* arrays ──

export const ALL_FAQ_LAYOUTS: FaqLayout[] = [
  "accordion",
  "cardGrid",
  "magazine",
  "tabs",
  "timeline",
  "masonry",
  "compact",
  "knowledgeBase",
];

export const ALL_ACCORDION_STYLES: FaqAccordionStyle[] = [
  "clean",
  "boxed",
  "bordered",
  "minimal",
  "card",
  "gradient",
  "numbered",
  "iconAccent",
];

export const ALL_SORT_MODES: FaqSortMode[] = [
  "alphabetical",
  "popular",
  "recent",
  "category",
];

export const ALL_FAQ_TEMPLATE_IDS: FaqTemplateId[] = [
  "corporate-clean",
  "modern-minimal",
  "bold-colorful",
  "dark-executive",
  "glassmorphism",
  "gradient-cards",
  "neon-glow",
  "professional-blue",
  "warm-earth",
  "tech-startup",
  "magazine-style",
  "apple-inspired",
];

export const ALL_FAQ_CATEGORY_ICONS: FaqCategoryIcon[] = [
  "Shield",
  "People",
  "Mail",
  "Heart",
  "Lock",
  "Emoji",
];

// ── Display name helpers ──

export function getFaqLayoutDisplayName(layout: FaqLayout): string {
  const map: Record<FaqLayout, string> = {
    accordion: "Accordion",
    cardGrid: "Card Grid",
    magazine: "Magazine",
    tabs: "Tabs",
    timeline: "Timeline",
    masonry: "Masonry",
    compact: "Compact",
    knowledgeBase: "Knowledge Base",
  };
  return map[layout];
}

export function getAccordionStyleDisplayName(style: FaqAccordionStyle): string {
  const map: Record<FaqAccordionStyle, string> = {
    clean: "Clean",
    boxed: "Boxed",
    bordered: "Bordered",
    minimal: "Minimal",
    card: "Card",
    gradient: "Gradient",
    numbered: "Numbered",
    iconAccent: "Icon Accent",
  };
  return map[style];
}

export function getSortModeDisplayName(mode: FaqSortMode): string {
  const map: Record<FaqSortMode, string> = {
    alphabetical: "Alphabetical",
    popular: "Most Popular",
    recent: "Most Recent",
    category: "By Category",
  };
  return map[mode];
}

export function getFaqTemplateDisplayName(templateId: FaqTemplateId): string {
  const map: Record<FaqTemplateId, string> = {
    "corporate-clean": "Corporate Clean",
    "modern-minimal": "Modern Minimal",
    "bold-colorful": "Bold & Colorful",
    "dark-executive": "Dark Executive",
    "glassmorphism": "Glassmorphism",
    "gradient-cards": "Gradient Cards",
    "neon-glow": "Neon Glow",
    "professional-blue": "Professional Blue",
    "warm-earth": "Warm Earth",
    "tech-startup": "Tech Startup",
    "magazine-style": "Magazine Style",
    "apple-inspired": "Apple Inspired",
  };
  return map[templateId];
}

export function getFaqCategoryIconDisplayName(icon: FaqCategoryIcon): string {
  const map: Record<FaqCategoryIcon, string> = {
    Shield: "Shield",
    People: "People",
    Mail: "Mail",
    Heart: "Heart",
    Lock: "Lock",
    Emoji: "Emoji",
  };
  return map[icon];
}
