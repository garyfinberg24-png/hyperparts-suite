import type {
  IHyperWizardConfig,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperNavColorConfig, IHyperNavPanelConfig } from "../../models";
import type { IHyperNavWizardState } from "../../models/IHyperNavWizardState";
import { DEFAULT_NAV_WIZARD_STATE, NAV_TEMPLATES } from "../../models/IHyperNavWizardState";
import { stringifyColorConfig, stringifyPanelConfig } from "../../utils/colorUtils";
import { SAMPLE_NAV_LINKS, SAMPLE_NAV_GROUPS } from "../../utils/sampleData";
import TemplatesStep from "./TemplatesStep";
import LayoutStyleStep from "./LayoutStyleStep";
import DataSourceStep from "./DataSourceStep";
import FeaturesStep from "./FeaturesStep";

/** Result type - maps wizard state to web part props */
export interface INavWizardResult {
  layoutMode: string;
  hoverEffect: string;
  borderRadius: string;
  navTheme: string;
  separator: string;
  colorConfig: string;
  panelConfig: string;
  dataSource: string;
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
  useSampleData: boolean;
  enableDemoMode: boolean;
  links: string;
  groups: string;
}

/** The full wizard config */
export var navWizardConfig: IHyperWizardConfig<IHyperNavWizardState, INavWizardResult> = {
  title: "HyperNav Setup Wizard",
  welcome: {
    productName: "Nav",
    tagline: "Navigate smarter, not harder. 15 layouts with audience targeting & demo mode.",
    taglineBold: ["Navigate", "15 layouts", "audience targeting", "demo mode"],
    features: [
      { icon: "\uD83D\uDCCC", title: "15 Layouts", description: "Topbar, mega menu, sidebar, tiles, fab & more" },
      { icon: "\uD83C\uDFA8", title: "Color Engine", description: "Full link + button state color management" },
      { icon: "\uD83D\uDD27", title: "Demo Mode", description: "Live controls to showcase every feature" },
      { icon: "\uD83D\uDE80", title: "Template Gallery", description: "12 pre-built templates for instant setup" },
    ],
  },
  steps: [
    {
      id: "templates",
      label: "Choose a Template",
      shortLabel: "Template",
      helpText: "Pick a pre-built template or start from scratch. Templates set layout, colors, and features for you.",
      component: TemplatesStep,
    },
    {
      id: "layout-style",
      label: "Layout & Style",
      shortLabel: "Style",
      helpText: "Choose how your navigation looks — layout mode, hover effects, colors, and dropdown panel settings.",
      component: LayoutStyleStep,
    },
    {
      id: "data-source",
      label: "Data Source",
      shortLabel: "Data",
      helpText: "Where should your navigation links come from?",
      component: DataSourceStep,
    },
    {
      id: "features",
      label: "Features",
      shortLabel: "Features",
      helpText: "Toggle the advanced features you want to enable.",
      component: FeaturesStep,
    },
  ],
  initialState: DEFAULT_NAV_WIZARD_STATE,
  buildResult: function (state: IHyperNavWizardState): INavWizardResult {
    var colorConfig: IHyperNavColorConfig = {
      linkDefault: state.linkDefaultColor,
      linkHover: state.linkHoverColor,
      linkActive: state.linkActiveColor,
      linkVisited: state.linkVisitedColor,
      btnDefaultBg: state.btnDefaultBg,
      btnDefaultText: state.btnDefaultText,
      btnHoverBg: state.btnHoverBg,
      btnHoverText: state.btnHoverText,
      btnPressedBg: state.btnPressedBg,
      btnPressedText: state.btnPressedText,
    };
    var panelConfig: IHyperNavPanelConfig = {
      background: state.ddPanelBg,
      borderColor: state.ddPanelBorder,
      shadow: state.ddPanelShadow as "none" | "small" | "medium" | "large",
      animation: state.ddPanelAnimation as "fade" | "slide" | "scale" | "none",
      columns: state.ddPanelColumns,
      padding: state.ddPanelPadding,
      maxHeight: state.ddPanelMaxHeight,
      borderRadius: state.ddPanelRadius,
    };
    return {
      layoutMode: state.layoutMode,
      hoverEffect: state.hoverEffect,
      borderRadius: state.borderRadius,
      navTheme: state.navTheme,
      separator: state.separator,
      colorConfig: stringifyColorConfig(colorConfig),
      panelConfig: stringifyPanelConfig(panelConfig),
      dataSource: state.dataSource,
      showSearch: state.showSearch,
      enablePersonalization: state.enablePersonalization,
      enableAnalytics: state.enableAnalytics,
      enableAudienceTargeting: state.enableAudienceTargeting,
      enableLinkHealthCheck: state.enableLinkHealthCheck,
      showExternalBadge: state.showExternalBadge,
      enableNotifications: state.enableNotifications,
      enableStickyNav: state.enableStickyNav,
      enableDarkModeToggle: state.enableDarkModeToggle,
      enableActiveDetection: state.enableActiveDetection,
      enableTooltips: state.enableTooltips,
      enableCommandPalette: state.enableCommandPalette,
      enableGrouping: state.enableGrouping,
      enableDeepLinks: state.enableDeepLinks,
      useSampleData: state.useSampleData,
      enableDemoMode: state.enableDemoMode,
      links: state.useSampleData ? JSON.stringify(SAMPLE_NAV_LINKS) : "[]",
      groups: state.useSampleData ? JSON.stringify(SAMPLE_NAV_GROUPS) : "[]",
    };
  },
  buildSummary: function (state: IHyperNavWizardState): IWizardSummaryRow[] {
    var templateName = "Custom";
    if (state.templateId) {
      var found: string | undefined;
      NAV_TEMPLATES.forEach(function (t) {
        if (t.id === state.templateId) found = t.name;
      });
      if (found) templateName = found;
    }
    var features: string[] = [];
    if (state.showSearch) features.push("Search");
    if (state.enablePersonalization) features.push("Pinning");
    if (state.enableGrouping) features.push("Grouping");
    if (state.enableStickyNav) features.push("Sticky");
    if (state.enableCommandPalette) features.push("Cmd Palette");
    if (state.enableDarkModeToggle) features.push("Dark Mode");
    if (state.enableTooltips) features.push("Tooltips");
    if (state.enableDeepLinks) features.push("Deep Links");
    return [
      { label: "Template", value: templateName, type: "badge" },
      { label: "Layout", value: state.layoutMode, type: "mono" },
      { label: "Theme", value: state.navTheme, type: "badge" },
      { label: "Hover Effect", value: state.hoverEffect, type: "text" },
      { label: "Data Source", value: state.dataSource, type: "badge" },
      { label: "Sample Data", value: state.useSampleData ? "Yes" : "No", type: state.useSampleData ? "badgeGreen" : "text" },
      { label: "Features", value: features.length > 0 ? features.join(", ") : "None", type: "text" },
      { label: "Demo Mode", value: state.enableDemoMode ? "Enabled" : "Disabled", type: state.enableDemoMode ? "badgeGreen" : "text" },
    ];
  },
  summaryFootnote: "All settings can be changed later in the property pane.",
};
