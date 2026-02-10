import type {
  StyleTemplate, HeaderStyle, FooterStyle, CardStyle, ShadowPreset,
  IconLibrary, HeadingScale, WpHeaderStyle, WpBorderStyle, WpShadowStyle, WpSpacing,
  ScrollRevealStyle, HoverEffect, PageTransitionStyle, DarkModePreference,
} from "./IHyperStyleEnums";

export interface IStyleWizardState {
  // Template selection
  selectedTemplate: StyleTemplate | "";

  // Branding
  logoUrl: string;
  brandTitle: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  successColor: string;
  warningColor: string;
  dangerColor: string;
  primaryFont: string;
  secondaryFont: string;
  baseFontSize: number;
  headingScale: HeadingScale;
  iconLibrary: IconLibrary;

  // Header
  headerStyle: HeaderStyle;
  headerSticky: boolean;
  headerAnnouncement: boolean;
  headerSearch: boolean;
  headerProfile: boolean;

  // Footer
  footerStyle: FooterStyle;
  footerColumns: number;
  footerSocial: boolean;
  footerBackToTop: boolean;
  footerCookie: boolean;

  // Effects
  cardStyle: CardStyle;
  borderRadius: number;
  shadowPreset: ShadowPreset;
  enableAurora: boolean;
  enableParticles: boolean;
  enableWaves: boolean;
  enableScrollReveal: boolean;
  scrollRevealStyle: ScrollRevealStyle;
  enableHoverMicro: boolean;
  hoverEffect: HoverEffect;
  enablePageTransition: boolean;
  pageTransitionStyle: PageTransitionStyle;
  enableDarkMode: boolean;
  darkModePreference: DarkModePreference;
  enableCustomScrollbar: boolean;
  enableGradientText: boolean;
  enableCustomCursor: boolean;

  // Web Part Styling
  wpHeaderStyle: WpHeaderStyle;
  wpBorderStyle: WpBorderStyle;
  wpShadowStyle: WpShadowStyle;
  wpSpacing: WpSpacing;

  // CSS Overrides
  enableWpCardStyling: boolean;
  enableWpHeaderAccent: boolean;
  enableButtonRestyling: boolean;
  enableLinkStyling: boolean;
  enableSelectionColor: boolean;
}

export var DEFAULT_STYLE_WIZARD_STATE: IStyleWizardState = {
  selectedTemplate: "",
  logoUrl: "",
  brandTitle: "Contoso Digital Workplace",
  tagline: "",
  primaryColor: "#0078d4",
  secondaryColor: "#106ebe",
  accentColor: "#ca5010",
  successColor: "#107c10",
  warningColor: "#ffb900",
  dangerColor: "#d13438",
  primaryFont: "Inter",
  secondaryFont: "Segoe UI",
  baseFontSize: 14,
  headingScale: "1.250",
  iconLibrary: "fluent",
  headerStyle: "classic",
  headerSticky: true,
  headerAnnouncement: false,
  headerSearch: true,
  headerProfile: true,
  footerStyle: "classic",
  footerColumns: 4,
  footerSocial: true,
  footerBackToTop: true,
  footerCookie: false,
  cardStyle: "standard",
  borderRadius: 8,
  shadowPreset: "medium",
  enableAurora: false,
  enableParticles: false,
  enableWaves: false,
  enableScrollReveal: false,
  scrollRevealStyle: "fade-up",
  enableHoverMicro: false,
  hoverEffect: "lift",
  enablePageTransition: false,
  pageTransitionStyle: "fade",
  enableDarkMode: false,
  darkModePreference: "system",
  enableCustomScrollbar: false,
  enableGradientText: false,
  enableCustomCursor: false,
  wpHeaderStyle: "standard",
  wpBorderStyle: "standard",
  wpShadowStyle: "standard",
  wpSpacing: "standard",
  enableWpCardStyling: false,
  enableWpHeaderAccent: false,
  enableButtonRestyling: false,
  enableLinkStyling: false,
  enableSelectionColor: false,
};
