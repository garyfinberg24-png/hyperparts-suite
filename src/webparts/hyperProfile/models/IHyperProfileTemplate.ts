import type { IHyperProfileWebPartProps } from "./IHyperProfileWebPartProps";
import type { TemplateCategory, ProfileAnimation, ProfileHeaderStyle, PhotoShape } from "./IHyperProfileAnimation";

/** Template type identifiers — V2 expanded to 15 */
export type TemplateType =
  /* Classic (4) */
  | "executive"
  | "standard"
  | "compact"
  | "corporate"
  /* Modern (5) */
  | "social"
  | "bento"
  | "glass"
  | "hero"
  | "sidebar"
  /* Creative (6) */
  | "neon"
  | "gradient"
  | "magazine"
  | "flipCard"
  | "minimal"
  | "mosaic";

/** V1 template IDs that mapped to V2 equivalents */
export type LegacyTemplateType = "detailed" | "minimalist" | "custom";

/** Maps legacy V1 template IDs to their V2 replacements */
export function mapLegacyTemplate(id: string): TemplateType {
  if (id === "detailed") return "standard";
  if (id === "minimalist") return "minimal";
  if (id === "custom") return "standard";
  return id as TemplateType;
}

/** Represents a template preset with predefined configuration */
export interface IHyperTemplate {
  id: TemplateType;
  name: string;
  description: string;
  /** Emoji icon for gallery display */
  icon: string;
  /** Gallery category filter */
  category: TemplateCategory;
  /** Preview accent color */
  accentColor: string;
  /** Preview gradient for gallery card */
  previewGradient: string;
  /** Feature badges shown on gallery card (e.g., "Skills", "Flip", "Dark") */
  featureBadges: string[];
  /** Default V2 feature flags for this template */
  defaults: ITemplateDefaults;
  /** Full web part property overrides */
  configuration: Partial<IHyperProfileWebPartProps>;
}

/** Simple template list for dropdowns/selectors */
export const TEMPLATE_LIST: Array<{ id: TemplateType; name: string; category: TemplateCategory }> = [
  { id: "executive", name: "Executive", category: "classic" },
  { id: "standard", name: "Standard", category: "classic" },
  { id: "compact", name: "Compact", category: "classic" },
  { id: "corporate", name: "Corporate", category: "classic" },
  { id: "social", name: "Social", category: "modern" },
  { id: "bento", name: "Bento Grid", category: "modern" },
  { id: "glass", name: "Glassmorphism", category: "modern" },
  { id: "hero", name: "Hero Banner", category: "modern" },
  { id: "sidebar", name: "Sidebar", category: "modern" },
  { id: "neon", name: "Neon Glow", category: "creative" },
  { id: "gradient", name: "Gradient", category: "creative" },
  { id: "magazine", name: "Magazine", category: "creative" },
  { id: "flipCard", name: "Flip Card", category: "creative" },
  { id: "minimal", name: "Minimal", category: "creative" },
  { id: "mosaic", name: "Mosaic", category: "creative" },
];

/** V2 template default feature/appearance settings */
export interface ITemplateDefaults {
  accentColor: string;
  headerStyle: ProfileHeaderStyle;
  photoShape: PhotoShape;
  animation: ProfileAnimation;
  showSkills: boolean;
  showBadges: boolean;
  showHobbies: boolean;
  showSlogan: boolean;
  showEducation: boolean;
  showOrgChart: boolean;
  showCalendar: boolean;
  shadow: string;
}
