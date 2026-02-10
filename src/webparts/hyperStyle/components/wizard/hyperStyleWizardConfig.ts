import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperStyleWebPartProps } from "../../models";
import type { IStyleWizardState } from "../../models/IHyperStyleWizardState";
import { DEFAULT_STYLE_WIZARD_STATE } from "../../models/IHyperStyleWizardState";
import { getTemplateDisplayName, getHeaderStyleDisplayName, getFooterStyleDisplayName } from "../../models";
import TemplatesStep from "./TemplatesStep";
import BrandingStep from "./BrandingStep";
import LayoutStep from "./LayoutStep";
import EffectsStep from "./EffectsStep";

var steps: Array<IWizardStepDef<IStyleWizardState>> = [
  {
    id: "templates",
    label: "Template Gallery",
    shortLabel: "Templates",
    helpText: "Choose a template to pre-fill your design settings, or skip to configure from scratch.",
    component: TemplatesStep,
  },
  {
    id: "branding",
    label: "Branding",
    shortLabel: "Brand",
    helpText: "Set your logo, colors, typography, and icon library.",
    component: BrandingStep,
  },
  {
    id: "layout",
    label: "Header & Footer",
    shortLabel: "Layout",
    helpText: "Choose how your header and footer look and behave.",
    component: LayoutStep,
  },
  {
    id: "effects",
    label: "Design Effects",
    shortLabel: "Effects",
    helpText: "Add visual effects, web part styling, and CSS overrides.",
    component: EffectsStep,
  },
];

function buildResult(state: IStyleWizardState): Partial<IHyperStyleWebPartProps> {
  var result: Partial<IHyperStyleWebPartProps> = {
    wizardCompleted: true,
    selectedTemplate: state.selectedTemplate,
    logoUrl: state.logoUrl,
    brandTitle: state.brandTitle,
    tagline: state.tagline,
    primaryColor: state.primaryColor,
    secondaryColor: state.secondaryColor,
    accentColor: state.accentColor,
    successColor: state.successColor,
    warningColor: state.warningColor,
    dangerColor: state.dangerColor,
    primaryFont: state.primaryFont,
    secondaryFont: state.secondaryFont,
    baseFontSize: state.baseFontSize,
    headingScale: state.headingScale,
    iconLibrary: state.iconLibrary,
    headerStyle: state.headerStyle,
    headerSticky: state.headerSticky,
    headerAnnouncement: state.headerAnnouncement,
    headerSearch: state.headerSearch,
    headerProfile: state.headerProfile,
    footerStyle: state.footerStyle,
    footerColumns: state.footerColumns,
    footerSocial: state.footerSocial,
    footerBackToTop: state.footerBackToTop,
    footerCookie: state.footerCookie,
    cardStyle: state.cardStyle,
    borderRadius: state.borderRadius,
    shadowPreset: state.shadowPreset,
    enableAurora: state.enableAurora,
    enableParticles: state.enableParticles,
    enableWaves: state.enableWaves,
    enableScrollReveal: state.enableScrollReveal,
    scrollRevealStyle: state.scrollRevealStyle,
    enableHoverMicro: state.enableHoverMicro,
    hoverEffect: state.hoverEffect,
    enablePageTransition: state.enablePageTransition,
    pageTransitionStyle: state.pageTransitionStyle,
    enableDarkMode: state.enableDarkMode,
    darkModePreference: state.darkModePreference,
    enableCustomScrollbar: state.enableCustomScrollbar,
    enableGradientText: state.enableGradientText,
    enableCustomCursor: state.enableCustomCursor,
    wpHeaderStyle: state.wpHeaderStyle,
    wpBorderStyle: state.wpBorderStyle,
    wpShadowStyle: state.wpShadowStyle,
    wpSpacing: state.wpSpacing,
    enableWpCardStyling: state.enableWpCardStyling,
    enableWpHeaderAccent: state.enableWpHeaderAccent,
    enableButtonRestyling: state.enableButtonRestyling,
    enableLinkStyling: state.enableLinkStyling,
    enableSelectionColor: state.enableSelectionColor,
  };
  return result;
}

function buildSummary(state: IStyleWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Template
  if (state.selectedTemplate) {
    rows.push({ label: "Template", value: getTemplateDisplayName(state.selectedTemplate), type: "badge" });
  } else {
    rows.push({ label: "Template", value: "Custom (from scratch)", type: "text" });
  }

  // Branding
  rows.push({ label: "Primary Color", value: state.primaryColor, type: "mono" });
  rows.push({ label: "Font Stack", value: state.primaryFont + " / " + state.secondaryFont, type: "text" });
  rows.push({ label: "Icon Library", value: state.iconLibrary, type: "text" });

  // Layout
  rows.push({ label: "Header Style", value: getHeaderStyleDisplayName(state.headerStyle), type: "badge" });
  rows.push({ label: "Footer Style", value: getFooterStyleDisplayName(state.footerStyle) + ", " + String(state.footerColumns) + " columns", type: "badge" });

  // Effects
  var effects: string[] = [];
  if (state.cardStyle !== "standard") effects.push(state.cardStyle);
  if (state.enableAurora) effects.push("Aurora");
  if (state.enableParticles) effects.push("Particles");
  if (state.enableWaves) effects.push("Waves");
  if (state.enableScrollReveal) effects.push("Scroll Reveal");
  if (state.enableHoverMicro) effects.push("Hover Effects");
  if (state.enableGradientText) effects.push("Gradient Text");
  if (state.enableDarkMode) effects.push("Dark Mode");
  rows.push({ label: "Design Effects", value: effects.length > 0 ? effects.join(", ") : "None", type: "text" });

  // Web Part Styling
  if (state.wpHeaderStyle !== "standard") {
    rows.push({ label: "WP Header", value: state.wpHeaderStyle, type: "badge" });
  }
  if (state.wpBorderStyle !== "standard") {
    rows.push({ label: "WP Borders", value: state.wpBorderStyle, type: "badge" });
  }

  // CSS Overrides
  var overrides: string[] = [];
  if (state.enableWpCardStyling) overrides.push("Card styling");
  if (state.enableWpHeaderAccent) overrides.push("Header accent");
  if (state.enableButtonRestyling) overrides.push("Buttons");
  if (state.enableLinkStyling) overrides.push("Links");
  if (state.enableSelectionColor) overrides.push("Selection");
  if (overrides.length > 0) {
    rows.push({ label: "CSS Overrides", value: overrides.join(", "), type: "text" });
  }

  return rows;
}

export function buildStateFromProps(props: IHyperStyleWebPartProps): IStyleWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }
  return {
    selectedTemplate: props.selectedTemplate || "",
    logoUrl: props.logoUrl || "",
    brandTitle: props.brandTitle || "Contoso Digital Workplace",
    tagline: props.tagline || "",
    primaryColor: props.primaryColor || "#0078d4",
    secondaryColor: props.secondaryColor || "#106ebe",
    accentColor: props.accentColor || "#ca5010",
    successColor: props.successColor || "#107c10",
    warningColor: props.warningColor || "#ffb900",
    dangerColor: props.dangerColor || "#d13438",
    primaryFont: props.primaryFont || "Inter",
    secondaryFont: props.secondaryFont || "Segoe UI",
    baseFontSize: props.baseFontSize || 14,
    headingScale: props.headingScale || "1.250",
    iconLibrary: props.iconLibrary || "fluent",
    headerStyle: props.headerStyle || "classic",
    headerSticky: props.headerSticky !== false,
    headerAnnouncement: props.headerAnnouncement || false,
    headerSearch: props.headerSearch !== false,
    headerProfile: props.headerProfile !== false,
    footerStyle: props.footerStyle || "classic",
    footerColumns: props.footerColumns || 4,
    footerSocial: props.footerSocial !== false,
    footerBackToTop: props.footerBackToTop !== false,
    footerCookie: props.footerCookie || false,
    cardStyle: props.cardStyle || "standard",
    borderRadius: props.borderRadius || 8,
    shadowPreset: props.shadowPreset || "medium",
    enableAurora: props.enableAurora || false,
    enableParticles: props.enableParticles || false,
    enableWaves: props.enableWaves || false,
    enableScrollReveal: props.enableScrollReveal || false,
    scrollRevealStyle: props.scrollRevealStyle || "fade-up",
    enableHoverMicro: props.enableHoverMicro || false,
    hoverEffect: props.hoverEffect || "lift",
    enablePageTransition: props.enablePageTransition || false,
    pageTransitionStyle: props.pageTransitionStyle || "fade",
    enableDarkMode: props.enableDarkMode || false,
    darkModePreference: props.darkModePreference || "system",
    enableCustomScrollbar: props.enableCustomScrollbar || false,
    enableGradientText: props.enableGradientText || false,
    enableCustomCursor: props.enableCustomCursor || false,
    wpHeaderStyle: props.wpHeaderStyle || "standard",
    wpBorderStyle: props.wpBorderStyle || "standard",
    wpShadowStyle: props.wpShadowStyle || "standard",
    wpSpacing: props.wpSpacing || "standard",
    enableWpCardStyling: props.enableWpCardStyling || false,
    enableWpHeaderAccent: props.enableWpHeaderAccent || false,
    enableButtonRestyling: props.enableButtonRestyling || false,
    enableLinkStyling: props.enableLinkStyling || false,
    enableSelectionColor: props.enableSelectionColor || false,
  };
}

export var STYLE_WIZARD_CONFIG: IHyperWizardConfig<IStyleWizardState, Partial<IHyperStyleWebPartProps>> = {
  title: "HyperStyle Setup Wizard",
  welcome: {
    productName: "Style",
    tagline: "The most powerful SharePoint UI customizer with 15 templates, glassmorphism, aurora backgrounds, dark mode, and web part styling",
    features: [
      { icon: "\uD83C\uDFA8", title: "15 Templates", description: "Corporate, dark, glassmorphism, neon, brutalist & more" },
      { icon: "\u2728", title: "Design Effects", description: "Aurora backgrounds, particles, wave dividers, scroll reveal" },
      { icon: "\uD83C\uDF19", title: "Dark Mode", description: "Full dark theme with system-preference detection" },
      { icon: "\uD83D\uDD27", title: "CSS Engine", description: "Override any SharePoint element with custom styling" },
    ],
  },
  steps: steps,
  initialState: DEFAULT_STYLE_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can change any setting later in the property pane or by clicking Re-run Setup in edit mode.",
};
