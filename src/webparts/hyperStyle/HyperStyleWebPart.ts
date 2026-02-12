import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperStyleWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperStyle from "./components/HyperStyle";
import type { IHyperStyleProps } from "./components/IHyperStyleProps";
import type { IHyperStyleWebPartProps } from "./models";
import {
  ALL_TEMPLATES, getTemplateDisplayName,
  ALL_HEADER_STYLES, getHeaderStyleDisplayName,
  ALL_FOOTER_STYLES, getFooterStyleDisplayName,
} from "./models";
import { createGroupHeaderField, createQuickActionsGroup } from "../../common/propertyPane";

export default class HyperStyleWebPart extends BaseHyperWebPart<IHyperStyleWebPartProps> {

  private _onDemoModeChange = (enabled: boolean): void => {
    this.properties.enableDemoMode = enabled;
    this.render();
  };

  private _onWizardApply = (result: Partial<IHyperStyleWebPartProps>): void => {
    var props = this.properties;
    var keys = Object.keys(result);
    keys.forEach(function (key: string) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (props as any)[key] = (result as any)[key];
    });
    // Mark wizard as completed
    props.wizardCompleted = true;
    props.showWizardOnInit = false;
    this.render();
  };

  public render(): void {
    var componentProps: IHyperStyleProps = {
      // Spread all web part properties
      wizardCompleted: this.properties.wizardCompleted,
      showWizardOnInit: this.properties.showWizardOnInit,
      enableDemoMode: this.properties.enableDemoMode,
      selectedTemplate: this.properties.selectedTemplate,
      logoUrl: this.properties.logoUrl,
      brandTitle: this.properties.brandTitle,
      tagline: this.properties.tagline,
      primaryColor: this.properties.primaryColor,
      secondaryColor: this.properties.secondaryColor,
      accentColor: this.properties.accentColor,
      successColor: this.properties.successColor,
      warningColor: this.properties.warningColor,
      dangerColor: this.properties.dangerColor,
      primaryFont: this.properties.primaryFont,
      secondaryFont: this.properties.secondaryFont,
      baseFontSize: this.properties.baseFontSize,
      headingScale: this.properties.headingScale,
      iconLibrary: this.properties.iconLibrary,
      headerStyle: this.properties.headerStyle,
      headerSticky: this.properties.headerSticky,
      headerAnnouncement: this.properties.headerAnnouncement,
      headerAnnouncementText: this.properties.headerAnnouncementText,
      headerSearch: this.properties.headerSearch,
      headerProfile: this.properties.headerProfile,
      footerStyle: this.properties.footerStyle,
      footerColumns: this.properties.footerColumns,
      footerSocial: this.properties.footerSocial,
      footerBackToTop: this.properties.footerBackToTop,
      footerCookie: this.properties.footerCookie,
      footerCopyrightText: this.properties.footerCopyrightText,
      cardStyle: this.properties.cardStyle,
      borderRadius: this.properties.borderRadius,
      shadowPreset: this.properties.shadowPreset,
      enableAurora: this.properties.enableAurora,
      enableParticles: this.properties.enableParticles,
      enableWaves: this.properties.enableWaves,
      enableScrollReveal: this.properties.enableScrollReveal,
      scrollRevealStyle: this.properties.scrollRevealStyle,
      enableHoverMicro: this.properties.enableHoverMicro,
      hoverEffect: this.properties.hoverEffect,
      enablePageTransition: this.properties.enablePageTransition,
      pageTransitionStyle: this.properties.pageTransitionStyle,
      enableDarkMode: this.properties.enableDarkMode,
      darkModePreference: this.properties.darkModePreference,
      enableCustomScrollbar: this.properties.enableCustomScrollbar,
      scrollThumbColor: this.properties.scrollThumbColor,
      scrollTrackColor: this.properties.scrollTrackColor,
      enableGradientText: this.properties.enableGradientText,
      gradientTextDirection: this.properties.gradientTextDirection,
      gradientTextColor1: this.properties.gradientTextColor1,
      gradientTextColor2: this.properties.gradientTextColor2,
      enableCustomCursor: this.properties.enableCustomCursor,
      cursorStyle: this.properties.cursorStyle,
      wpHeaderStyle: this.properties.wpHeaderStyle,
      wpBorderStyle: this.properties.wpBorderStyle,
      wpShadowStyle: this.properties.wpShadowStyle,
      wpSpacing: this.properties.wpSpacing,
      enableWpCardStyling: this.properties.enableWpCardStyling,
      enableWpHeaderAccent: this.properties.enableWpHeaderAccent,
      wpHeaderAccentColor: this.properties.wpHeaderAccentColor,
      enableButtonRestyling: this.properties.enableButtonRestyling,
      enableLinkStyling: this.properties.enableLinkStyling,
      linkColor: this.properties.linkColor,
      enableSelectionColor: this.properties.enableSelectionColor,
      selectionBg: this.properties.selectionBg,
      selectionText: this.properties.selectionText,
      // Component-specific props
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onWizardApply: this._onWizardApply,
      onDemoModeChange: this._onDemoModeChange,
      onConfigure: (): void => { this.context.propertyPane.open(); },
    };
    var element: React.ReactElement<IHyperStyleProps> =
      React.createElement(HyperStyle, componentProps);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    var p = this.properties;
    // Wizard state
    if (p.wizardCompleted === undefined) { p.wizardCompleted = false; }
    if (p.showWizardOnInit === undefined) { p.showWizardOnInit = true; }
    if (p.enableDemoMode === undefined) { p.enableDemoMode = false; }
    // Template
    if (p.selectedTemplate === undefined) { p.selectedTemplate = ""; }
    // Branding
    if (p.logoUrl === undefined) { p.logoUrl = ""; }
    if (p.brandTitle === undefined) { p.brandTitle = "Contoso Digital Workplace"; }
    if (p.tagline === undefined) { p.tagline = ""; }
    if (p.primaryColor === undefined) { p.primaryColor = "#0078d4"; }
    if (p.secondaryColor === undefined) { p.secondaryColor = "#106ebe"; }
    if (p.accentColor === undefined) { p.accentColor = "#ca5010"; }
    if (p.successColor === undefined) { p.successColor = "#107c10"; }
    if (p.warningColor === undefined) { p.warningColor = "#ffb900"; }
    if (p.dangerColor === undefined) { p.dangerColor = "#d13438"; }
    if (p.primaryFont === undefined) { p.primaryFont = "Inter"; }
    if (p.secondaryFont === undefined) { p.secondaryFont = "Segoe UI"; }
    if (p.baseFontSize === undefined) { p.baseFontSize = 14; }
    if (p.headingScale === undefined) { p.headingScale = "1.250"; }
    if (p.iconLibrary === undefined) { p.iconLibrary = "fluent"; }
    // Header
    if (p.headerStyle === undefined) { p.headerStyle = "classic"; }
    if (p.headerSticky === undefined) { p.headerSticky = true; }
    if (p.headerAnnouncement === undefined) { p.headerAnnouncement = false; }
    if (p.headerAnnouncementText === undefined) { p.headerAnnouncementText = ""; }
    if (p.headerSearch === undefined) { p.headerSearch = true; }
    if (p.headerProfile === undefined) { p.headerProfile = true; }
    // Footer
    if (p.footerStyle === undefined) { p.footerStyle = "classic"; }
    if (p.footerColumns === undefined) { p.footerColumns = 4; }
    if (p.footerSocial === undefined) { p.footerSocial = true; }
    if (p.footerBackToTop === undefined) { p.footerBackToTop = true; }
    if (p.footerCookie === undefined) { p.footerCookie = false; }
    if (p.footerCopyrightText === undefined) { p.footerCopyrightText = ""; }
    // Design Effects
    if (p.cardStyle === undefined) { p.cardStyle = "standard"; }
    if (p.borderRadius === undefined) { p.borderRadius = 8; }
    if (p.shadowPreset === undefined) { p.shadowPreset = "medium"; }
    if (p.enableAurora === undefined) { p.enableAurora = false; }
    if (p.enableParticles === undefined) { p.enableParticles = false; }
    if (p.enableWaves === undefined) { p.enableWaves = false; }
    if (p.enableScrollReveal === undefined) { p.enableScrollReveal = false; }
    if (p.scrollRevealStyle === undefined) { p.scrollRevealStyle = "fade-up"; }
    if (p.enableHoverMicro === undefined) { p.enableHoverMicro = false; }
    if (p.hoverEffect === undefined) { p.hoverEffect = "lift"; }
    if (p.enablePageTransition === undefined) { p.enablePageTransition = false; }
    if (p.pageTransitionStyle === undefined) { p.pageTransitionStyle = "fade"; }
    if (p.enableDarkMode === undefined) { p.enableDarkMode = false; }
    if (p.darkModePreference === undefined) { p.darkModePreference = "system"; }
    if (p.enableCustomScrollbar === undefined) { p.enableCustomScrollbar = false; }
    if (p.scrollThumbColor === undefined) { p.scrollThumbColor = "#888888"; }
    if (p.scrollTrackColor === undefined) { p.scrollTrackColor = "#f0f0f0"; }
    if (p.enableGradientText === undefined) { p.enableGradientText = false; }
    if (p.gradientTextDirection === undefined) { p.gradientTextDirection = "135deg"; }
    if (p.gradientTextColor1 === undefined) { p.gradientTextColor1 = "#667eea"; }
    if (p.gradientTextColor2 === undefined) { p.gradientTextColor2 = "#764ba2"; }
    if (p.enableCustomCursor === undefined) { p.enableCustomCursor = false; }
    if (p.cursorStyle === undefined) { p.cursorStyle = "default"; }
    // Web Part Styling
    if (p.wpHeaderStyle === undefined) { p.wpHeaderStyle = "standard"; }
    if (p.wpBorderStyle === undefined) { p.wpBorderStyle = "standard"; }
    if (p.wpShadowStyle === undefined) { p.wpShadowStyle = "standard"; }
    if (p.wpSpacing === undefined) { p.wpSpacing = "standard"; }
    // CSS Overrides
    if (p.enableWpCardStyling === undefined) { p.enableWpCardStyling = false; }
    if (p.enableWpHeaderAccent === undefined) { p.enableWpHeaderAccent = false; }
    if (p.wpHeaderAccentColor === undefined) { p.wpHeaderAccentColor = "#0078d4"; }
    if (p.enableButtonRestyling === undefined) { p.enableButtonRestyling = false; }
    if (p.enableLinkStyling === undefined) { p.enableLinkStyling = false; }
    if (p.linkColor === undefined) { p.linkColor = "#0078d4"; }
    if (p.enableSelectionColor === undefined) { p.enableSelectionColor = false; }
    if (p.selectionBg === undefined) { p.selectionBg = "#0078d4"; }
    if (p.selectionText === undefined) { p.selectionText = "#ffffff"; }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    // Clean up injected style tags
    var styleTag = document.getElementById("hyper-style-injected");
    if (styleTag && styleTag.parentNode) {
      styleTag.parentNode.removeChild(styleTag);
    }
    var fontTag = document.getElementById("hyper-style-font");
    if (fontTag && fontTag.parentNode) {
      fontTag.parentNode.removeChild(fontTag);
    }
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // Template dropdown
    var templateOptions: Array<{ key: string; text: string }> = [
      { key: "", text: "None (Custom)" },
    ];
    ALL_TEMPLATES.forEach(function (id) {
      templateOptions.push({ key: id, text: getTemplateDisplayName(id) });
    });

    // Header style dropdown
    var headerOptions: Array<{ key: string; text: string }> = [];
    ALL_HEADER_STYLES.forEach(function (id) {
      headerOptions.push({ key: id, text: getHeaderStyleDisplayName(id) });
    });

    // Footer style dropdown
    var footerOptions: Array<{ key: string; text: string }> = [];
    ALL_FOOTER_STYLES.forEach(function (id) {
      footerOptions.push({ key: id, text: getFooterStyleDisplayName(id) });
    });

    return {
      pages: [
        // ── Page 1: Branding ──
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            createQuickActionsGroup({
              onReopenWizard: this._handleReopenWizard.bind(this),
              onEditInEditor: this._handleEditInEditor.bind(this),
              onToggleDemoMode: this._handleToggleDemoMode.bind(this),
            }),
            {
              groupName: strings.BrandingGroupName,
              groupFields: [
                createGroupHeaderField("_brandingHeader", { icon: "\uD83D\uDCCB", title: "Branding", subtitle: "Identity & colors", color: "green" }),
                PropertyPaneTextField("brandTitle", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneTextField("logoUrl", {
                  label: strings.LogoFieldLabel,
                }),
                PropertyPaneTextField("tagline", {
                  label: strings.TaglineFieldLabel,
                }),
                PropertyPaneDropdown("selectedTemplate", {
                  label: "Template",
                  options: templateOptions,
                }),
                PropertyPaneTextField("primaryColor", {
                  label: strings.PrimaryColorLabel,
                }),
                PropertyPaneTextField("secondaryColor", {
                  label: strings.SecondaryColorLabel,
                }),
                PropertyPaneTextField("accentColor", {
                  label: strings.AccentColorLabel,
                }),
                PropertyPaneTextField("primaryFont", {
                  label: strings.PrimaryFontLabel,
                }),
                PropertyPaneTextField("secondaryFont", {
                  label: strings.SecondaryFontLabel,
                }),
                PropertyPaneSlider("baseFontSize", {
                  label: strings.BaseFontSizeLabel,
                  min: 10,
                  max: 20,
                  step: 1,
                }),
                PropertyPaneDropdown("headingScale", {
                  label: strings.HeadingScaleLabel,
                  options: [
                    { key: "1.125", text: "Minor Second (1.125)" },
                    { key: "1.200", text: "Minor Third (1.200)" },
                    { key: "1.250", text: "Major Third (1.250)" },
                    { key: "1.333", text: "Perfect Fourth (1.333)" },
                  ],
                }),
                PropertyPaneDropdown("iconLibrary", {
                  label: strings.IconLibraryLabel,
                  options: [
                    { key: "fluent", text: "Fluent UI" },
                    { key: "fontawesome", text: "Font Awesome 6" },
                    { key: "material", text: "Material Icons" },
                    { key: "none", text: "None" },
                  ],
                }),
              ],
            },
          ],
        },
        // ── Page 2: Header & Footer ──
        {
          header: { description: "Configure global header and footer layout." },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                createGroupHeaderField("_layoutHeader", { icon: "\uD83C\uDFA8", title: "Layout", subtitle: "Header & footer", color: "blue" }),
                PropertyPaneDropdown("headerStyle", {
                  label: strings.HeaderStyleLabel,
                  options: headerOptions,
                }),
                PropertyPaneToggle("headerSticky", {
                  label: "Sticky Header",
                }),
                PropertyPaneToggle("headerAnnouncement", {
                  label: "Announcement Bar",
                }),
                PropertyPaneTextField("headerAnnouncementText", {
                  label: "Announcement Text",
                }),
                PropertyPaneToggle("headerSearch", {
                  label: "Show Search",
                }),
                PropertyPaneToggle("headerProfile", {
                  label: "Show Profile",
                }),
                PropertyPaneDropdown("footerStyle", {
                  label: strings.FooterStyleLabel,
                  options: footerOptions,
                }),
                PropertyPaneSlider("footerColumns", {
                  label: strings.FooterColumnsLabel,
                  min: 2,
                  max: 6,
                  step: 1,
                }),
                PropertyPaneToggle("footerSocial", {
                  label: "Social Links",
                }),
                PropertyPaneToggle("footerBackToTop", {
                  label: "Back to Top",
                }),
                PropertyPaneToggle("footerCookie", {
                  label: "Cookie Banner",
                }),
                PropertyPaneTextField("footerCopyrightText", {
                  label: "Copyright Text",
                }),
              ],
            },
          ],
        },
        // ── Page 3: Design Effects ──
        {
          header: { description: "Configure visual effects, web part styling, and CSS overrides." },
          groups: [
            {
              groupName: strings.EffectsGroupName,
              groupFields: [
                createGroupHeaderField("_effectsHeader", { icon: "\uD83C\uDFAF", title: "Effects", subtitle: "Visual effects", color: "red" }),
                PropertyPaneDropdown("cardStyle", {
                  label: strings.CardStyleLabel,
                  options: [
                    { key: "standard", text: "Standard" },
                    { key: "glass", text: "Glassmorphism" },
                    { key: "neo", text: "Neomorphism" },
                    { key: "flat", text: "Flat" },
                  ],
                }),
                PropertyPaneSlider("borderRadius", {
                  label: strings.BorderRadiusLabel,
                  min: 0,
                  max: 24,
                  step: 2,
                }),
                PropertyPaneDropdown("shadowPreset", {
                  label: strings.ShadowPresetLabel,
                  options: [
                    { key: "none", text: "None" },
                    { key: "subtle", text: "Subtle" },
                    { key: "medium", text: "Medium" },
                    { key: "elevated", text: "Elevated" },
                    { key: "dramatic", text: "Dramatic" },
                  ],
                }),
                PropertyPaneToggle("enableDarkMode", {
                  label: "Dark Mode",
                }),
                PropertyPaneToggle("enableCustomScrollbar", {
                  label: "Custom Scrollbar",
                }),
                PropertyPaneToggle("enableGradientText", {
                  label: "Gradient Text Headings",
                }),
                PropertyPaneToggle("enableScrollReveal", {
                  label: "Scroll Reveal Animations",
                }),
                PropertyPaneToggle("enableHoverMicro", {
                  label: "Hover Micro-Animations",
                }),
                PropertyPaneToggle("enableAurora", {
                  label: "Aurora Background",
                }),
                PropertyPaneToggle("enableParticles", {
                  label: "Particle Effect",
                }),
                PropertyPaneToggle("enableWaves", {
                  label: "Wave Dividers",
                }),
              ],
            },
            {
              groupName: "Web Part Styling",
              groupFields: [
                createGroupHeaderField("_wpStylingHeader", { icon: "\uD83C\uDFAF", title: "Web Part Styling", subtitle: "Component styles", color: "red" }),
                PropertyPaneDropdown("wpHeaderStyle", {
                  label: strings.WpHeaderStyleLabel,
                  options: [
                    { key: "standard", text: "Standard" },
                    { key: "accent-bar", text: "Accent Bar" },
                    { key: "bordered", text: "Bordered" },
                    { key: "underlined", text: "Underlined" },
                    { key: "shadowed", text: "Shadowed" },
                    { key: "gradient-bar", text: "Gradient Bar" },
                    { key: "icon-accent", text: "Icon Accent" },
                  ],
                }),
                PropertyPaneDropdown("wpBorderStyle", {
                  label: strings.WpBorderStyleLabel,
                  options: [
                    { key: "standard", text: "Standard" },
                    { key: "rounded", text: "Rounded" },
                    { key: "pill", text: "Pill" },
                    { key: "sharp", text: "Sharp" },
                    { key: "double", text: "Double" },
                    { key: "dashed", text: "Dashed" },
                  ],
                }),
                PropertyPaneDropdown("wpShadowStyle", {
                  label: strings.WpShadowStyleLabel,
                  options: [
                    { key: "standard", text: "Standard" },
                    { key: "elevated", text: "Elevated" },
                    { key: "flat", text: "Flat" },
                    { key: "inset", text: "Inset" },
                    { key: "colored", text: "Colored" },
                    { key: "dramatic", text: "Dramatic" },
                  ],
                }),
                PropertyPaneDropdown("wpSpacing", {
                  label: strings.WpSpacingLabel,
                  options: [
                    { key: "compact", text: "Compact" },
                    { key: "standard", text: "Standard" },
                    { key: "comfortable", text: "Comfortable" },
                    { key: "spacious", text: "Spacious" },
                  ],
                }),
                PropertyPaneToggle("enableWpCardStyling", {
                  label: "Enable Card Styling",
                }),
                PropertyPaneToggle("enableWpHeaderAccent", {
                  label: "Enable Header Accent",
                }),
                PropertyPaneToggle("enableButtonRestyling", {
                  label: "Enable Button Restyling",
                }),
                PropertyPaneToggle("enableLinkStyling", {
                  label: "Enable Link Styling",
                }),
                PropertyPaneToggle("enableSelectionColor", {
                  label: "Enable Selection Color",
                }),
              ],
            },
          ],
        },
        // ── Page 4: Advanced ──
        {
          header: { description: "Advanced settings and wizard re-run." },
          groups: [
            {
              groupName: strings.AdvancedGroupName,
              groupFields: [
                createGroupHeaderField("_advancedHeader", { icon: "\u2699\uFE0F", title: "Advanced", subtitle: "Overrides & debug", color: "orange" }),
                PropertyPaneTextField("wpHeaderAccentColor", {
                  label: "WP Header Accent Color",
                }),
                PropertyPaneTextField("linkColor", {
                  label: "Link Color",
                }),
                PropertyPaneTextField("selectionBg", {
                  label: "Selection Background",
                }),
                PropertyPaneTextField("selectionText", {
                  label: "Selection Text Color",
                }),
                PropertyPaneTextField("scrollThumbColor", {
                  label: "Scrollbar Thumb Color",
                }),
                PropertyPaneTextField("scrollTrackColor", {
                  label: "Scrollbar Track Color",
                }),
                PropertyPaneTextField("gradientTextDirection", {
                  label: "Gradient Text Direction",
                }),
                PropertyPaneTextField("gradientTextColor1", {
                  label: "Gradient Color 1",
                }),
                PropertyPaneTextField("gradientTextColor2", {
                  label: "Gradient Color 2",
                }),
                PropertyPaneToggle("showWizardOnInit", {
                  label: "Show Wizard on First Load",
                }),
                PropertyPaneButton("_rerunWizard", {
                  text: strings.RerunWizardLabel,
                  buttonType: PropertyPaneButtonType.Normal,
                  onClick: this._handleReRunWizard.bind(this),
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  private _handleReRunWizard(): void {
    this.properties.wizardCompleted = false;
    this.properties.showWizardOnInit = true;
    this.render();
  }
}
