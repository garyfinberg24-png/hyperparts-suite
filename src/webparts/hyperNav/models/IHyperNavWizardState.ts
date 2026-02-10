import type {
  HyperNavLayoutMode,
  HyperNavHoverEffect,
  HyperNavBorderRadius,
  HyperNavTheme,
  HyperNavSeparator,
} from "./IHyperNavLink";

/** Wizard state tracked across all steps */
export interface IHyperNavWizardState {
  // Step 0: Template
  templateId: string;
  // Step 1: Layout & Style
  layoutMode: HyperNavLayoutMode;
  hoverEffect: HyperNavHoverEffect;
  borderRadius: HyperNavBorderRadius;
  navTheme: HyperNavTheme;
  separator: HyperNavSeparator;
  // Step 1b: Colors
  linkDefaultColor: string;
  linkHoverColor: string;
  linkActiveColor: string;
  linkVisitedColor: string;
  btnDefaultBg: string;
  btnDefaultText: string;
  btnHoverBg: string;
  btnHoverText: string;
  btnPressedBg: string;
  btnPressedText: string;
  // Step 1c: Dropdown / Flyout Panel
  ddPanelBg: string;
  ddPanelBorder: string;
  ddPanelShadow: string;
  ddPanelAnimation: string;
  ddPanelColumns: string;
  ddPanelPadding: number;
  ddPanelMaxHeight: number;
  ddPanelRadius: number;
  // Step 2: Data Source
  dataSource: "manual" | "spList" | "siteNav" | "json";
  // Step 3: Features
  showSearch: boolean;
  enablePersonalization: boolean;
  enableAnalytics: boolean;
  enableAudienceTargeting: boolean;
  enableLinkHealthCheck: boolean;
  showExternalBadge: boolean;
  enableNotifications: boolean;
  enableStickyNav: boolean;
  enableDarkModeToggle: boolean;
  enableActiveDetection: boolean;
  enableTooltips: boolean;
  enableCommandPalette: boolean;
  enableGrouping: boolean;
  enableDeepLinks: boolean;
  // Demo / Sample
  useSampleData: boolean;
  enableDemoMode: boolean;
}

export var DEFAULT_NAV_WIZARD_STATE: IHyperNavWizardState = {
  templateId: "",
  layoutMode: "topbar",
  hoverEffect: "lift",
  borderRadius: "slight",
  navTheme: "light",
  separator: "line",
  linkDefaultColor: "#323130",
  linkHoverColor: "#0078d4",
  linkActiveColor: "#004578",
  linkVisitedColor: "#8764b8",
  btnDefaultBg: "#0078d4",
  btnDefaultText: "#ffffff",
  btnHoverBg: "#106ebe",
  btnHoverText: "#ffffff",
  btnPressedBg: "#004578",
  btnPressedText: "#ffffff",
  ddPanelBg: "#ffffff",
  ddPanelBorder: "#edebe9",
  ddPanelShadow: "large",
  ddPanelAnimation: "fade",
  ddPanelColumns: "1",
  ddPanelPadding: 12,
  ddPanelMaxHeight: 400,
  ddPanelRadius: 8,
  dataSource: "manual",
  showSearch: true,
  enablePersonalization: true,
  enableAnalytics: false,
  enableAudienceTargeting: false,
  enableLinkHealthCheck: true,
  showExternalBadge: true,
  enableNotifications: false,
  enableStickyNav: false,
  enableDarkModeToggle: false,
  enableActiveDetection: true,
  enableTooltips: true,
  enableCommandPalette: false,
  enableGrouping: true,
  enableDeepLinks: true,
  useSampleData: true,
  enableDemoMode: false,
};

/** V2 template definition */
export interface INavTemplate {
  id: string;
  name: string;
  description: string;
  category: "corporate" | "department" | "portal" | "quick";
  color: string;
  layout: HyperNavLayoutMode;
}

/** Available templates */
export var NAV_TEMPLATES: INavTemplate[] = [
  { id: "corporate", name: "Corporate Intranet", description: "Full-featured corporate navigation with mega menu", category: "corporate", color: "#0078d4", layout: "megaMenu" },
  { id: "department", name: "Department Hub", description: "Team-focused sidebar with quick access links", category: "department", color: "#8764b8", layout: "sidebar" },
  { id: "quicklinks", name: "Quick Links", description: "Simple, fast-access link collection as tiles", category: "quick", color: "#00b294", layout: "tiles" },
  { id: "applauncher", name: "App Launcher", description: "Application grid like Office 365 waffle", category: "portal", color: "#ff8c00", layout: "grid" },
  { id: "project", name: "Project Dashboard", description: "Project-centric navigation with status cards", category: "department", color: "#e74856", layout: "card" },
  { id: "helpdesk", name: "Help Desk", description: "IT support and knowledge base navigation", category: "department", color: "#16c60c", layout: "list" },
  { id: "executive", name: "Executive Dashboard", description: "High-level KPI and report access bar", category: "corporate", color: "#886ce4", layout: "topbar" },
  { id: "training", name: "Training Portal", description: "Learning paths and course catalog tabs", category: "portal", color: "#0099bc", layout: "tabbar" },
  { id: "newemployee", name: "New Employee", description: "Onboarding-focused navigation cards", category: "portal", color: "#f7630c", layout: "card" },
  { id: "sales", name: "Sales Toolkit", description: "Sales resources and CRM links with dropdowns", category: "department", color: "#e3008c", layout: "dropdown" },
  { id: "hr", name: "HR Hub", description: "People, policies, and benefits sidebar", category: "corporate", color: "#038387", layout: "sidebar" },
  { id: "modern", name: "Modern Intranet", description: "Clean, minimal modern top bar design", category: "corporate", color: "#767676", layout: "topbar" },
];
