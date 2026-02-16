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

/** V2 template definition — includes full preset overrides */
export interface INavTemplate {
  id: string;
  name: string;
  description: string;
  category: "corporate" | "department" | "portal" | "quick";
  color: string;
  /** Partial wizard state overrides applied when template is selected */
  preset: Partial<IHyperNavWizardState>;
}

/** Available templates with full color/feature presets */
export var NAV_TEMPLATES: INavTemplate[] = [
  {
    id: "corporate", name: "Corporate Intranet",
    description: "Full-featured corporate navigation with mega menu",
    category: "corporate", color: "#0078d4",
    preset: {
      layoutMode: "megaMenu", hoverEffect: "lift", borderRadius: "slight",
      navTheme: "light", separator: "none",
      linkDefaultColor: "#323130", linkHoverColor: "#0078d4", linkActiveColor: "#004578", linkVisitedColor: "#8764b8",
      btnDefaultBg: "#0078d4", btnDefaultText: "#ffffff", btnHoverBg: "#106ebe", btnHoverText: "#ffffff", btnPressedBg: "#004578", btnPressedText: "#ffffff",
      ddPanelShadow: "large", ddPanelAnimation: "fade", ddPanelColumns: "3",
      showSearch: true, enableGrouping: true, enableDeepLinks: true, enableTooltips: true,
      enableStickyNav: false, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
  {
    id: "department", name: "Department Hub",
    description: "Team-focused sidebar with quick access links",
    category: "department", color: "#8764b8",
    preset: {
      layoutMode: "sidebar", hoverEffect: "bgfill", borderRadius: "rounded",
      navTheme: "light", separator: "none",
      linkDefaultColor: "#3b3a39", linkHoverColor: "#8764b8", linkActiveColor: "#5c2d91", linkVisitedColor: "#8661c5",
      btnDefaultBg: "#8764b8", btnDefaultText: "#ffffff", btnHoverBg: "#5c2d91", btnHoverText: "#ffffff", btnPressedBg: "#4a2578", btnPressedText: "#ffffff",
      ddPanelShadow: "medium", ddPanelAnimation: "slide",
      showSearch: true, enableGrouping: true, enableDeepLinks: false, enableTooltips: true,
      enableStickyNav: true, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
  {
    id: "quicklinks", name: "Quick Links",
    description: "Simple, fast-access link collection as tiles",
    category: "quick", color: "#00b294",
    preset: {
      layoutMode: "tiles", hoverEffect: "lift", borderRadius: "rounded",
      navTheme: "light", separator: "none",
      linkDefaultColor: "#323130", linkHoverColor: "#00b294", linkActiveColor: "#008272", linkVisitedColor: "#00b294",
      btnDefaultBg: "#00b294", btnDefaultText: "#ffffff", btnHoverBg: "#008272", btnHoverText: "#ffffff", btnPressedBg: "#006b5e", btnPressedText: "#ffffff",
      ddPanelShadow: "small", ddPanelAnimation: "scale",
      showSearch: false, enableGrouping: false, enableDeepLinks: false, enableTooltips: false,
      enableStickyNav: false, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
  {
    id: "applauncher", name: "App Launcher",
    description: "Application grid like Office 365 waffle",
    category: "portal", color: "#ff8c00",
    preset: {
      layoutMode: "grid", hoverEffect: "zoom", borderRadius: "rounded",
      navTheme: "light", separator: "none",
      linkDefaultColor: "#323130", linkHoverColor: "#ff8c00", linkActiveColor: "#d47300", linkVisitedColor: "#ff8c00",
      btnDefaultBg: "#ff8c00", btnDefaultText: "#ffffff", btnHoverBg: "#d47300", btnHoverText: "#ffffff", btnPressedBg: "#b35f00", btnPressedText: "#ffffff",
      ddPanelShadow: "medium", ddPanelAnimation: "scale",
      showSearch: true, enableGrouping: true, enableDeepLinks: false, enableTooltips: true,
      enableStickyNav: false, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
  {
    id: "project", name: "Project Dashboard",
    description: "Project-centric navigation with status cards",
    category: "department", color: "#e74856",
    preset: {
      layoutMode: "card", hoverEffect: "lift", borderRadius: "slight",
      navTheme: "light", separator: "none",
      linkDefaultColor: "#323130", linkHoverColor: "#e74856", linkActiveColor: "#c50f1f", linkVisitedColor: "#e74856",
      btnDefaultBg: "#e74856", btnDefaultText: "#ffffff", btnHoverBg: "#c50f1f", btnHoverText: "#ffffff", btnPressedBg: "#a80000", btnPressedText: "#ffffff",
      ddPanelShadow: "medium", ddPanelAnimation: "fade",
      showSearch: false, enableGrouping: true, enableDeepLinks: true, enableTooltips: true,
      enableStickyNav: false, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
  {
    id: "helpdesk", name: "Help Desk",
    description: "IT support and knowledge base navigation",
    category: "department", color: "#16c60c",
    preset: {
      layoutMode: "list", hoverEffect: "underline", borderRadius: "none",
      navTheme: "light", separator: "line",
      linkDefaultColor: "#323130", linkHoverColor: "#16c60c", linkActiveColor: "#10a00a", linkVisitedColor: "#107c10",
      btnDefaultBg: "#16c60c", btnDefaultText: "#ffffff", btnHoverBg: "#10a00a", btnHoverText: "#ffffff", btnPressedBg: "#0c7a08", btnPressedText: "#ffffff",
      ddPanelShadow: "small", ddPanelAnimation: "fade",
      showSearch: true, enableGrouping: true, enableDeepLinks: true, enableTooltips: true,
      enableStickyNav: false, enableCommandPalette: true, enableDarkModeToggle: false,
    },
  },
  {
    id: "executive", name: "Executive Dashboard",
    description: "High-level KPI and report access bar",
    category: "corporate", color: "#886ce4",
    preset: {
      layoutMode: "topbar", hoverEffect: "glow", borderRadius: "pill",
      navTheme: "dark", separator: "dot",
      linkDefaultColor: "#e0d8f0", linkHoverColor: "#c4b5f0", linkActiveColor: "#ffffff", linkVisitedColor: "#b8a9e0",
      btnDefaultBg: "#886ce4", btnDefaultText: "#ffffff", btnHoverBg: "#7558d6", btnHoverText: "#ffffff", btnPressedBg: "#5c3fbf", btnPressedText: "#ffffff",
      ddPanelBg: "#2d2145", ddPanelBorder: "#4a3872",
      ddPanelShadow: "large", ddPanelAnimation: "fade",
      showSearch: false, enableGrouping: false, enableDeepLinks: false, enableTooltips: false,
      enableStickyNav: true, enableCommandPalette: false, enableDarkModeToggle: true,
    },
  },
  {
    id: "training", name: "Training Portal",
    description: "Learning paths and course catalog tabs",
    category: "portal", color: "#0099bc",
    preset: {
      layoutMode: "tabbar", hoverEffect: "underline", borderRadius: "slight",
      navTheme: "light", separator: "pipe",
      linkDefaultColor: "#323130", linkHoverColor: "#0099bc", linkActiveColor: "#007a96", linkVisitedColor: "#0099bc",
      btnDefaultBg: "#0099bc", btnDefaultText: "#ffffff", btnHoverBg: "#007a96", btnHoverText: "#ffffff", btnPressedBg: "#005c72", btnPressedText: "#ffffff",
      ddPanelShadow: "medium", ddPanelAnimation: "slide",
      showSearch: true, enableGrouping: true, enableDeepLinks: true, enableTooltips: true,
      enableStickyNav: false, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
  {
    id: "newemployee", name: "New Employee",
    description: "Onboarding-focused navigation cards",
    category: "portal", color: "#f7630c",
    preset: {
      layoutMode: "card", hoverEffect: "lift", borderRadius: "rounded",
      navTheme: "light", separator: "none",
      linkDefaultColor: "#323130", linkHoverColor: "#f7630c", linkActiveColor: "#d05108", linkVisitedColor: "#f7630c",
      btnDefaultBg: "#f7630c", btnDefaultText: "#ffffff", btnHoverBg: "#d05108", btnHoverText: "#ffffff", btnPressedBg: "#b04006", btnPressedText: "#ffffff",
      ddPanelShadow: "medium", ddPanelAnimation: "scale",
      showSearch: false, enableGrouping: false, enableDeepLinks: false, enableTooltips: true,
      enableStickyNav: false, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
  {
    id: "sales", name: "Sales Toolkit",
    description: "Sales resources and CRM links with dropdowns",
    category: "department", color: "#e3008c",
    preset: {
      layoutMode: "dropdown", hoverEffect: "darken", borderRadius: "slight",
      navTheme: "light", separator: "pipe",
      linkDefaultColor: "#323130", linkHoverColor: "#e3008c", linkActiveColor: "#b4006f", linkVisitedColor: "#e3008c",
      btnDefaultBg: "#e3008c", btnDefaultText: "#ffffff", btnHoverBg: "#b4006f", btnHoverText: "#ffffff", btnPressedBg: "#8c0056", btnPressedText: "#ffffff",
      ddPanelShadow: "large", ddPanelAnimation: "slide", ddPanelColumns: "2",
      showSearch: true, enableGrouping: true, enableDeepLinks: true, enableTooltips: true,
      enableStickyNav: false, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
  {
    id: "hr", name: "HR Hub",
    description: "People, policies, and benefits sidebar",
    category: "corporate", color: "#038387",
    preset: {
      layoutMode: "sidebar", hoverEffect: "bgfill", borderRadius: "rounded",
      navTheme: "light", separator: "none",
      linkDefaultColor: "#323130", linkHoverColor: "#038387", linkActiveColor: "#026b6f", linkVisitedColor: "#038387",
      btnDefaultBg: "#038387", btnDefaultText: "#ffffff", btnHoverBg: "#026b6f", btnHoverText: "#ffffff", btnPressedBg: "#015456", btnPressedText: "#ffffff",
      ddPanelShadow: "medium", ddPanelAnimation: "fade",
      showSearch: true, enableGrouping: true, enableDeepLinks: true, enableTooltips: true,
      enableStickyNav: true, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
  {
    id: "modern", name: "Modern Intranet",
    description: "Clean, minimal modern top bar design",
    category: "corporate", color: "#767676",
    preset: {
      layoutMode: "topbar", hoverEffect: "underline", borderRadius: "none",
      navTheme: "light", separator: "slash",
      linkDefaultColor: "#605e5c", linkHoverColor: "#323130", linkActiveColor: "#000000", linkVisitedColor: "#605e5c",
      btnDefaultBg: "#323130", btnDefaultText: "#ffffff", btnHoverBg: "#201f1e", btnHoverText: "#ffffff", btnPressedBg: "#000000", btnPressedText: "#ffffff",
      ddPanelShadow: "small", ddPanelAnimation: "fade",
      showSearch: false, enableGrouping: false, enableDeepLinks: false, enableTooltips: false,
      enableStickyNav: false, enableCommandPalette: false, enableDarkModeToggle: false,
    },
  },
];
