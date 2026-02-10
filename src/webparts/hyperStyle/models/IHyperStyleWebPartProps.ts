import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type {
  StyleTemplate, HeaderStyle, FooterStyle, CardStyle, ShadowPreset,
  IconLibrary, HeadingScale, WpHeaderStyle, WpBorderStyle, WpShadowStyle, WpSpacing,
  ScrollRevealStyle, HoverEffect, PageTransitionStyle, DarkModePreference, CursorStyle,
} from "./IHyperStyleEnums";

export interface IHyperStyleWebPartProps extends IBaseHyperWebPartProps {
  // Wizard state
  wizardCompleted: boolean;
  showWizardOnInit: boolean;

  // Template
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
  headerAnnouncementText: string;
  headerSearch: boolean;
  headerProfile: boolean;

  // Footer
  footerStyle: FooterStyle;
  footerColumns: number;
  footerSocial: boolean;
  footerBackToTop: boolean;
  footerCookie: boolean;
  footerCopyrightText: string;

  // Design Effects
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
  scrollThumbColor: string;
  scrollTrackColor: string;
  enableGradientText: boolean;
  gradientTextDirection: string;
  gradientTextColor1: string;
  gradientTextColor2: string;
  enableCustomCursor: boolean;
  cursorStyle: CursorStyle;

  // Web Part Styling
  wpHeaderStyle: WpHeaderStyle;
  wpBorderStyle: WpBorderStyle;
  wpShadowStyle: WpShadowStyle;
  wpSpacing: WpSpacing;

  // CSS Overrides
  enableWpCardStyling: boolean;
  enableWpHeaderAccent: boolean;
  wpHeaderAccentColor: string;
  enableButtonRestyling: boolean;
  enableLinkStyling: boolean;
  linkColor: string;
  enableSelectionColor: boolean;
  selectionBg: string;
  selectionText: string;
}
