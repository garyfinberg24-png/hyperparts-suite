import type { FaqTemplateId } from "./IHyperFaqEnums";

export interface IFaqTemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface IFaqTemplate {
  id: FaqTemplateId;
  name: string;
  description: string;
  colors: IFaqTemplateColors;
  borderRadius: number; // px
  fontFamily: string;
  cardShadow: string;
  accentStyle: string; // e.g. "solid", "gradient", "glow"
}

export const FAQ_TEMPLATES: IFaqTemplate[] = [
  {
    id: "corporate-clean",
    name: "Corporate Clean",
    description: "Professional SharePoint-native look with Microsoft blue accents and subtle shadows",
    colors: {
      primary: "#0078D4",
      secondary: "#106EBE",
      accent: "#2B88D8",
      background: "#FFFFFF",
      surface: "#F3F2F1",
      text: "#323130",
      textSecondary: "#605E5C",
      border: "#EDEBE9",
    },
    borderRadius: 8,
    fontFamily: "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
    cardShadow: "0 2px 4px rgba(0, 0, 0, 0.08), 0 0 2px rgba(0, 0, 0, 0.06)",
    accentStyle: "solid",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean and understated with thin borders and generous whitespace",
    colors: {
      primary: "#1A1A1A",
      secondary: "#404040",
      accent: "#666666",
      background: "#FAFAFA",
      surface: "#FFFFFF",
      text: "#1A1A1A",
      textSecondary: "#717171",
      border: "#E5E5E5",
    },
    borderRadius: 4,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cardShadow: "none",
    accentStyle: "solid",
  },
  {
    id: "bold-colorful",
    name: "Bold & Colorful",
    description: "Vibrant orange accents with energetic color palette for engaging experiences",
    colors: {
      primary: "#FF6B35",
      secondary: "#FF8C42",
      accent: "#FFB347",
      background: "#FFFFFF",
      surface: "#FFF8F0",
      text: "#2D2D2D",
      textSecondary: "#666666",
      border: "#FFE0CC",
    },
    borderRadius: 12,
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cardShadow: "0 4px 12px rgba(255, 107, 53, 0.15)",
    accentStyle: "gradient",
  },
  {
    id: "dark-executive",
    name: "Dark Executive",
    description: "Elegant dark theme with gold accents for a premium executive feel",
    colors: {
      primary: "#E2B714",
      secondary: "#C9A30A",
      accent: "#F5D442",
      background: "#1A1A2E",
      surface: "#16213E",
      text: "#EAEAEA",
      textSecondary: "#A0A0B0",
      border: "#2A2A4A",
    },
    borderRadius: 8,
    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
    cardShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
    accentStyle: "solid",
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass effect with blur backgrounds and semi-transparent surfaces",
    colors: {
      primary: "#667EEA",
      secondary: "#764BA2",
      accent: "#F093FB",
      background: "#F0F0F8",
      surface: "rgba(255, 255, 255, 0.6)",
      text: "#2D2B55",
      textSecondary: "#6C6B8A",
      border: "rgba(255, 255, 255, 0.3)",
    },
    borderRadius: 16,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cardShadow: "0 8px 32px rgba(102, 126, 234, 0.15)",
    accentStyle: "gradient",
  },
  {
    id: "gradient-cards",
    name: "Gradient Cards",
    description: "Colorful gradient headers on cards with smooth purple-to-blue transitions",
    colors: {
      primary: "#667EEA",
      secondary: "#764BA2",
      accent: "#5B86E5",
      background: "#F8F9FE",
      surface: "#FFFFFF",
      text: "#2D3748",
      textSecondary: "#718096",
      border: "#E2E8F0",
    },
    borderRadius: 12,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cardShadow: "0 4px 15px rgba(102, 126, 234, 0.12)",
    accentStyle: "gradient",
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Dark background with neon green glow effects for a modern tech aesthetic",
    colors: {
      primary: "#00FF87",
      secondary: "#60EFFF",
      accent: "#00E5FF",
      background: "#0A0A0A",
      surface: "#1A1A1A",
      text: "#E0E0E0",
      textSecondary: "#888888",
      border: "#2A2A2A",
    },
    borderRadius: 8,
    fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cardShadow: "0 0 20px rgba(0, 255, 135, 0.1), 0 0 40px rgba(0, 255, 135, 0.05)",
    accentStyle: "glow",
  },
  {
    id: "professional-blue",
    name: "Professional Blue",
    description: "Deep navy blue theme with corporate gravitas for enterprise environments",
    colors: {
      primary: "#1B3A5C",
      secondary: "#2C5F8A",
      accent: "#4A90D9",
      background: "#F8F9FA",
      surface: "#FFFFFF",
      text: "#1B3A5C",
      textSecondary: "#5A7694",
      border: "#D1DCE8",
    },
    borderRadius: 6,
    fontFamily: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cardShadow: "0 2px 8px rgba(27, 58, 92, 0.1)",
    accentStyle: "solid",
  },
  {
    id: "warm-earth",
    name: "Warm Earth",
    description: "Natural warm tones with terracotta and cream for an inviting atmosphere",
    colors: {
      primary: "#B85C38",
      secondary: "#C87B5A",
      accent: "#E07C4A",
      background: "#FFF8F0",
      surface: "#FFFFFF",
      text: "#4A3228",
      textSecondary: "#7A6458",
      border: "#E8D5C4",
    },
    borderRadius: 8,
    fontFamily: "'Merriweather', Georgia, 'Times New Roman', serif",
    cardShadow: "0 3px 10px rgba(184, 92, 56, 0.1)",
    accentStyle: "solid",
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    description: "Bold purple gradients with modern rounded corners for innovative brands",
    colors: {
      primary: "#7C3AED",
      secondary: "#9F67FF",
      accent: "#A78BFA",
      background: "#FFFFFF",
      surface: "#FAF5FF",
      text: "#1E1B4B",
      textSecondary: "#6B6B8D",
      border: "#EDE9FE",
    },
    borderRadius: 16,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cardShadow: "0 4px 20px rgba(124, 58, 237, 0.12)",
    accentStyle: "gradient",
  },
  {
    id: "magazine-style",
    name: "Magazine Style",
    description: "Editorial design with serif headlines and sharp edges for content-rich layouts",
    colors: {
      primary: "#1A1A1A",
      secondary: "#333333",
      accent: "#E63946",
      background: "#FFFFFF",
      surface: "#F8F8F8",
      text: "#1A1A1A",
      textSecondary: "#666666",
      border: "#E0E0E0",
    },
    borderRadius: 2,
    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
    cardShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
    accentStyle: "solid",
  },
  {
    id: "apple-inspired",
    name: "Apple Inspired",
    description: "Ultra-clean design inspired by Apple with subtle grays and perfect spacing",
    colors: {
      primary: "#333333",
      secondary: "#555555",
      accent: "#0071E3",
      background: "#F5F5F7",
      surface: "#FFFFFF",
      text: "#1D1D1F",
      textSecondary: "#86868B",
      border: "#D2D2D7",
    },
    borderRadius: 12,
    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    cardShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    accentStyle: "solid",
  },
];

/**
 * Finds a template by its ID. Returns undefined if not found.
 */
export function getFaqTemplateById(id: FaqTemplateId): IFaqTemplate | undefined {
  let found: IFaqTemplate | undefined;
  FAQ_TEMPLATES.forEach(function (t) {
    if (t.id === id) {
      found = t;
    }
  });
  return found;
}
