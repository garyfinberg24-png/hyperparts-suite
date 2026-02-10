import type { StyleTemplate, StyleTemplateCategory } from "./IHyperStyleEnums";

export interface IStyleTemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  headerBg: string;
  footerBg: string;
  text: string;
  cardBg: string;
}

export interface IStyleTemplate {
  id: StyleTemplate;
  name: string;
  description: string;
  category: StyleTemplateCategory;
  icon: string;
  colors: IStyleTemplateColors;
  font: string;
}

export var STYLE_TEMPLATES: IStyleTemplate[] = [
  { id: "corporateClassic", name: "Corporate Classic", description: "Navy header, white body, 4-column footer. Professional and trusted.", category: "corporate", icon: "\uD83C\uDFE2", colors: { primary: "#1b3a5c", secondary: "#2c5282", accent: "#dd6b20", background: "#ffffff", headerBg: "#1b3a5c", footerBg: "#1b3a5c", text: "#1a202c", cardBg: "#ffffff" }, font: "Segoe UI" },
  { id: "modernMinimal", name: "Modern Minimal", description: "Ultra-clean aesthetic with Inter font, thin borders, and ample whitespace.", category: "minimal", icon: "\u2728", colors: { primary: "#2563eb", secondary: "#3b82f6", accent: "#8b5cf6", background: "#fafafa", headerBg: "#ffffff", footerBg: "#f9fafb", text: "#111827", cardBg: "#ffffff" }, font: "Inter" },
  { id: "darkExecutive", name: "Dark Executive", description: "Near-black backgrounds with elegant light text. Premium and powerful.", category: "dark", icon: "\uD83C\uDF11", colors: { primary: "#6366f1", secondary: "#818cf8", accent: "#f59e0b", background: "#111111", headerBg: "#0a0a0a", footerBg: "#0a0a0a", text: "#e5e5e5", cardBg: "#1a1a1a" }, font: "Inter" },
  { id: "glassmorphismPro", name: "Glassmorphism Pro", description: "Frosted glass panels, aurora backgrounds, and translucent overlays.", category: "creative", icon: "\uD83D\uDCA0", colors: { primary: "#7c3aed", secondary: "#8b5cf6", accent: "#06b6d4", background: "#1a1033", headerBg: "rgba(255,255,255,0.08)", footerBg: "rgba(255,255,255,0.05)", text: "#f0e6ff", cardBg: "rgba(255,255,255,0.1)" }, font: "Inter" },
  { id: "gradientVibes", name: "Gradient Vibes", description: "Vibrant gradient header and footer with bold, energetic brand presence.", category: "creative", icon: "\uD83C\uDF08", colors: { primary: "#ec4899", secondary: "#8b5cf6", accent: "#3b82f6", background: "#fdf2f8", headerBg: "linear-gradient(135deg,#ec4899,#8b5cf6)", footerBg: "linear-gradient(135deg,#8b5cf6,#3b82f6)", text: "#1f2937", cardBg: "#ffffff" }, font: "Poppins" },
  { id: "neonGlow", name: "Neon Glow", description: "Dark backgrounds with neon accent borders and glowing highlights.", category: "dark", icon: "\uD83D\uDD2E", colors: { primary: "#00fff5", secondary: "#ff00ff", accent: "#39ff14", background: "#0a0a0a", headerBg: "#050505", footerBg: "#050505", text: "#e0e0e0", cardBg: "#141414" }, font: "Montserrat" },
  { id: "softPastels", name: "Soft Pastels", description: "Light pastel palette with rounded corners and a warm, friendly feel.", category: "modern", icon: "\uD83C\uDF38", colors: { primary: "#ec4899", secondary: "#a78bfa", accent: "#34d399", background: "#fef7ff", headerBg: "#fce7f3", footerBg: "#fce7f3", text: "#4a3548", cardBg: "#ffffff" }, font: "Nunito" },
  { id: "materialDesign", name: "Material Design", description: "Google Material colors with elevation shadows and crisp hierarchy.", category: "modern", icon: "\uD83D\uDCCC", colors: { primary: "#2196f3", secondary: "#1976d2", accent: "#ff5722", background: "#fafafa", headerBg: "#2196f3", footerBg: "#263238", text: "#212121", cardBg: "#ffffff" }, font: "Roboto" },
  { id: "brutalist", name: "Brutalist", description: "Raw, bold design with monospace fonts and thick black borders.", category: "creative", icon: "\u25A0", colors: { primary: "#000000", secondary: "#333333", accent: "#ff0000", background: "#ffffff", headerBg: "#ffffff", footerBg: "#000000", text: "#000000", cardBg: "#ffffff" }, font: "Source Code Pro" },
  { id: "swissClean", name: "Swiss Clean", description: "Helvetica-inspired typography with strong grid-based hierarchy.", category: "minimal", icon: "\u2795", colors: { primary: "#1a1a1a", secondary: "#333333", accent: "#e53e3e", background: "#ffffff", headerBg: "#ffffff", footerBg: "#1a1a1a", text: "#1a1a1a", cardBg: "#ffffff" }, font: "Inter" },
  { id: "warmEarth", name: "Warm Earth", description: "Terracotta, sage green, and sand tones for a natural, grounded look.", category: "creative", icon: "\uD83C\uDF3F", colors: { primary: "#92400e", secondary: "#6b7f3b", accent: "#d97706", background: "#fef7ed", headerBg: "#92400e", footerBg: "#78350f", text: "#451a03", cardBg: "#ffffff" }, font: "Raleway" },
  { id: "oceanBreeze", name: "Ocean Breeze", description: "Blue gradients with wave shapes for a fresh, coastal vibe.", category: "modern", icon: "\uD83C\uDF0A", colors: { primary: "#0891b2", secondary: "#06b6d4", accent: "#f59e0b", background: "#ecfeff", headerBg: "linear-gradient(135deg,#0891b2,#06b6d4)", footerBg: "#164e63", text: "#164e63", cardBg: "#ffffff" }, font: "Open Sans" },
  { id: "forestDark", name: "Forest Dark", description: "Deep greens and blacks for a sophisticated, nature-inspired dark theme.", category: "dark", icon: "\uD83C\uDF32", colors: { primary: "#10b981", secondary: "#059669", accent: "#f59e0b", background: "#0f1f17", headerBg: "#064e3b", footerBg: "#052e16", text: "#d1fae5", cardBg: "#1a2f23" }, font: "Inter" },
  { id: "sunsetCoral", name: "Sunset Coral", description: "Warm coral and peach gradients for a vibrant, inviting experience.", category: "modern", icon: "\uD83C\uDF05", colors: { primary: "#f43f5e", secondary: "#fb7185", accent: "#f97316", background: "#fff7ed", headerBg: "linear-gradient(135deg,#fb7185,#fdba74)", footerBg: "#881337", text: "#4c0519", cardBg: "#ffffff" }, font: "Poppins" },
  { id: "techStartup", name: "Tech Startup", description: "Electric blue accents with dark nav and modern, fast-paced energy.", category: "corporate", icon: "\uD83D\uDE80", colors: { primary: "#3b82f6", secondary: "#2563eb", accent: "#10b981", background: "#f8fafc", headerBg: "#0f172a", footerBg: "#0f172a", text: "#0f172a", cardBg: "#ffffff" }, font: "Inter" },
];
