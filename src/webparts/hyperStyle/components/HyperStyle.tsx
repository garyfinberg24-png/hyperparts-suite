import * as React from "react";
import type { IHyperStyleProps } from "./IHyperStyleProps";
import type { IHyperStyleWebPartProps } from "../models";
import type {
  StyleTemplate, HeaderStyle, FooterStyle, CardStyle,
} from "../models/IHyperStyleEnums";
import { HyperErrorBoundary } from "../../../common/components";
import WelcomeStep from "./wizard/WelcomeStep";
import HyperStyleDemoBar from "./HyperStyleDemoBar";
import { STYLE_TEMPLATES } from "../models";
import styles from "./HyperStyle.module.scss";

// ── CSS injection helpers ──

/** Build a CSS variable block from the current branding props */
function buildCssVariables(props: IHyperStyleProps): string {
  var css = ":root {\n";
  css += "  --hs-primary: " + props.primaryColor + ";\n";
  css += "  --hs-secondary: " + props.secondaryColor + ";\n";
  css += "  --hs-accent: " + props.accentColor + ";\n";
  css += "  --hs-success: " + props.successColor + ";\n";
  css += "  --hs-warning: " + props.warningColor + ";\n";
  css += "  --hs-danger: " + props.dangerColor + ";\n";
  css += "  --hs-border-radius: " + props.borderRadius + "px;\n";
  css += "  --hs-font-primary: '" + props.primaryFont + "', 'Segoe UI', sans-serif;\n";
  css += "  --hs-font-secondary: '" + props.secondaryFont + "', 'Segoe UI', sans-serif;\n";
  css += "  --hs-font-size: " + props.baseFontSize + "px;\n";
  css += "}\n";
  return css;
}

/** Build CSS override rules for web part styling */
function buildWpStyling(props: IHyperStyleProps): string {
  var css = "";

  // Web Part Card Styling
  if (props.enableWpCardStyling) {
    css += ".ControlZone-control {\n";
    css += "  border-radius: " + props.borderRadius + "px;\n";
    css += "  overflow: hidden;\n";

    // Shadow (matches WpShadowStyle: standard|elevated|flat|inset|colored|dramatic)
    if (props.wpShadowStyle === "elevated") {
      css += "  box-shadow: 0 4px 16px rgba(0,0,0,0.16);\n";
    } else if (props.wpShadowStyle === "flat") {
      css += "  box-shadow: none;\n";
    } else if (props.wpShadowStyle === "inset") {
      css += "  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);\n";
    } else if (props.wpShadowStyle === "colored") {
      css += "  box-shadow: 0 4px 16px " + props.primaryColor + "33;\n";
    } else if (props.wpShadowStyle === "dramatic") {
      css += "  box-shadow: 0 8px 32px rgba(0,0,0,0.2);\n";
    }

    // Border (matches WpBorderStyle: standard|rounded|pill|sharp|double|dashed)
    if (props.wpBorderStyle === "rounded") {
      css += "  border: 1px solid rgba(0,0,0,0.08);\n";
      css += "  border-radius: 12px;\n";
    } else if (props.wpBorderStyle === "pill") {
      css += "  border: 1px solid rgba(0,0,0,0.08);\n";
      css += "  border-radius: 24px;\n";
    } else if (props.wpBorderStyle === "sharp") {
      css += "  border: 1px solid rgba(0,0,0,0.1);\n";
      css += "  border-radius: 0;\n";
    } else if (props.wpBorderStyle === "double") {
      css += "  border: 3px double " + props.primaryColor + ";\n";
    } else if (props.wpBorderStyle === "dashed") {
      css += "  border: 1px dashed rgba(0,0,0,0.15);\n";
    }

    // Spacing
    if (props.wpSpacing === "compact") {
      css += "  padding: 8px;\n";
    } else if (props.wpSpacing === "comfortable") {
      css += "  padding: 24px;\n";
    } else if (props.wpSpacing === "spacious") {
      css += "  padding: 32px;\n";
    }

    css += "}\n";
  }

  // Web Part Header Accent
  if (props.enableWpHeaderAccent) {
    css += "[data-automation-id=\"webPartHeader\"] {\n";
    css += "  border-left: 4px solid " + (props.wpHeaderAccentColor || props.primaryColor) + ";\n";
    css += "  padding-left: 12px;\n";
    css += "}\n";
  }

  // Button Restyling
  if (props.enableButtonRestyling) {
    css += "button.ms-Button--primary, .ms-Button--primary {\n";
    css += "  background-color: " + props.primaryColor + " !important;\n";
    css += "  border-color: " + props.primaryColor + " !important;\n";
    css += "  border-radius: " + props.borderRadius + "px !important;\n";
    css += "}\n";
  }

  // Link Styling
  if (props.enableLinkStyling) {
    css += "a:not([class*='ms-']) { color: " + (props.linkColor || props.primaryColor) + "; }\n";
    css += "a:not([class*='ms-']):hover { text-decoration: underline; }\n";
  }

  // Selection Color
  if (props.enableSelectionColor) {
    css += "::selection { background: " + (props.selectionBg || props.primaryColor) + "; color: " + (props.selectionText || "#ffffff") + "; }\n";
  }

  return css;
}

/** Build CSS for design effects */
function buildDesignEffects(props: IHyperStyleProps): string {
  var css = "";

  // Custom scrollbar
  if (props.enableCustomScrollbar) {
    css += "::-webkit-scrollbar { width: 8px; }\n";
    css += "::-webkit-scrollbar-track { background: " + (props.scrollTrackColor || "#f0f0f0") + "; }\n";
    css += "::-webkit-scrollbar-thumb { background: " + (props.scrollThumbColor || "#888888") + "; border-radius: 4px; }\n";
    css += "::-webkit-scrollbar-thumb:hover { background: " + props.primaryColor + "; }\n";
  }

  // Gradient text headings
  if (props.enableGradientText) {
    var dir = props.gradientTextDirection || "135deg";
    var c1 = props.gradientTextColor1 || "#667eea";
    var c2 = props.gradientTextColor2 || "#764ba2";
    css += "h1, h2, h3 {\n";
    css += "  background: linear-gradient(" + dir + ", " + c1 + ", " + c2 + ");\n";
    css += "  -webkit-background-clip: text;\n";
    css += "  -webkit-text-fill-color: transparent;\n";
    css += "  background-clip: text;\n";
    css += "}\n";
  }

  // Dark mode (DarkModePreference: "system" | "manual" | "both")
  if (props.enableDarkMode) {
    var darkCssBlock = "";
    darkCssBlock += "  [data-automation-id=\"CanvasZone\"] {\n";
    darkCssBlock += "    background-color: #1e1e1e;\n";
    darkCssBlock += "    color: #e0e0e0;\n";
    darkCssBlock += "  }\n";
    darkCssBlock += "  .ControlZone-control {\n";
    darkCssBlock += "    background-color: #2d2d2d;\n";
    darkCssBlock += "    color: #e0e0e0;\n";
    darkCssBlock += "  }\n";

    if (props.darkModePreference === "system") {
      css += "@media (prefers-color-scheme: dark) {\n" + darkCssBlock + "}\n";
    } else if (props.darkModePreference === "manual") {
      css += ".hyper-style-dark {\n" + darkCssBlock + "}\n";
    } else {
      // "both": system media query + manual class
      css += "@media (prefers-color-scheme: dark) {\n" + darkCssBlock + "}\n";
      css += ".hyper-style-dark {\n" + darkCssBlock + "}\n";
    }
  }

  return css;
}

/** Build the full injected CSS string */
function buildInjectedCss(props: IHyperStyleProps): string {
  return buildCssVariables(props) + buildWpStyling(props) + buildDesignEffects(props);
}

/** Get the Google Fonts <link> URL for a font name */
function getGoogleFontUrl(fontName: string): string {
  // Skip system fonts
  var systemFonts = ["Segoe UI", "Arial", "Helvetica", "Times New Roman", "Calibri", "Verdana"];
  var isSystem = false;
  systemFonts.forEach(function (f) {
    if (f === fontName) {
      isSystem = true;
    }
  });
  if (isSystem || fontName.length === 0) {
    return "";
  }
  return "https://fonts.googleapis.com/css2?family=" + fontName.replace(/ /g, "+") + ":wght@300;400;600;700&display=swap";
}

// ── Main inner component ──

var STYLE_TAG_ID = "hyper-style-injected";
var FONT_TAG_ID = "hyper-style-font";

var HyperStyleInner: React.FC<IHyperStyleProps> = function (props) {
  var wizardOpenState = React.useState<boolean>(false);
  var wizardOpen = wizardOpenState[0];
  var setWizardOpen = wizardOpenState[1];

  // ── Demo mode local state ──
  var demoTemplateState = React.useState<StyleTemplate | "">(props.selectedTemplate || "");
  var demoTemplate = demoTemplateState[0];
  var setDemoTemplate = demoTemplateState[1];

  var demoHeaderStyleState = React.useState<HeaderStyle>(props.headerStyle || "classic");
  var demoHeaderStyle = demoHeaderStyleState[0];
  var setDemoHeaderStyle = demoHeaderStyleState[1];

  var demoFooterStyleState = React.useState<FooterStyle>(props.footerStyle || "classic");
  var demoFooterStyle = demoFooterStyleState[0];
  var setDemoFooterStyle = demoFooterStyleState[1];

  var demoCardStyleState = React.useState<CardStyle>(props.cardStyle || "standard");
  var demoCardStyle = demoCardStyleState[0];
  var setDemoCardStyle = demoCardStyleState[1];

  var demoDarkModeState = React.useState<boolean>(props.enableDarkMode || false);
  var demoDarkMode = demoDarkModeState[0];
  var setDemoDarkMode = demoDarkModeState[1];

  var demoScrollRevealState = React.useState<boolean>(props.enableScrollReveal || false);
  var demoScrollReveal = demoScrollRevealState[0];
  var setDemoScrollReveal = demoScrollRevealState[1];

  var demoHoverMicroState = React.useState<boolean>(props.enableHoverMicro || false);
  var demoHoverMicro = demoHoverMicroState[0];
  var setDemoHoverMicro = demoHoverMicroState[1];

  var demoCustomScrollbarState = React.useState<boolean>(props.enableCustomScrollbar || false);
  var demoCustomScrollbar = demoCustomScrollbarState[0];
  var setDemoCustomScrollbar = demoCustomScrollbarState[1];

  // ── Effective values: demo overrides when demo mode is on ──
  var effectiveTemplate = props.enableDemoMode ? demoTemplate : props.selectedTemplate;
  var effectiveHeaderStyle = props.enableDemoMode ? demoHeaderStyle : props.headerStyle;
  var effectiveFooterStyle = props.enableDemoMode ? demoFooterStyle : props.footerStyle;
  var effectiveCardStyle = props.enableDemoMode ? demoCardStyle : props.cardStyle;
  var effectiveDarkMode = props.enableDemoMode ? demoDarkMode : props.enableDarkMode;
  var effectiveScrollReveal = props.enableDemoMode ? demoScrollReveal : props.enableScrollReveal;
  var effectiveHoverMicro = props.enableDemoMode ? demoHoverMicro : props.enableHoverMicro;
  var effectiveCustomScrollbar = props.enableDemoMode ? demoCustomScrollbar : props.enableCustomScrollbar;

  // Build effective props for CSS injection (merge demo overrides)
  var effectiveProps: IHyperStyleProps = React.useMemo(function () {
    if (!props.enableDemoMode) return props;
    // Create a shallow copy with demo overrides
    var merged: Record<string, unknown> = {};
    var propKeys = Object.keys(props);
    propKeys.forEach(function (k) {
      merged[k] = (props as unknown as Record<string, unknown>)[k];
    });
    merged.selectedTemplate = effectiveTemplate;
    merged.headerStyle = effectiveHeaderStyle;
    merged.footerStyle = effectiveFooterStyle;
    merged.cardStyle = effectiveCardStyle;
    merged.enableDarkMode = effectiveDarkMode;
    merged.enableScrollReveal = effectiveScrollReveal;
    merged.enableHoverMicro = effectiveHoverMicro;
    merged.enableCustomScrollbar = effectiveCustomScrollbar;
    return merged as unknown as IHyperStyleProps;
  }, [
    props, props.enableDemoMode,
    effectiveTemplate, effectiveHeaderStyle, effectiveFooterStyle, effectiveCardStyle,
    effectiveDarkMode, effectiveScrollReveal, effectiveHoverMicro, effectiveCustomScrollbar,
  ]);

  // Show wizard on first load if configured
  React.useEffect(function () {
    if (props.isEditMode && !props.wizardCompleted) {
      setWizardOpen(true);
    }
  }, [props.isEditMode, props.wizardCompleted]);

  // ── Inject CSS ──
  React.useEffect(function () {
    if (!props.wizardCompleted) {
      return;
    }
    var css = buildInjectedCss(effectiveProps);
    var existing = document.getElementById(STYLE_TAG_ID);
    if (existing) {
      existing.textContent = css;
    } else {
      var tag = document.createElement("style");
      tag.id = STYLE_TAG_ID;
      tag.textContent = css;
      document.head.appendChild(tag);
    }
    return function () {
      // Cleanup on unmount
      var el = document.getElementById(STYLE_TAG_ID);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [
    props.wizardCompleted, effectiveProps,
    props.primaryColor, props.secondaryColor, props.accentColor,
    props.successColor, props.warningColor, props.dangerColor,
    props.borderRadius, props.primaryFont, props.secondaryFont, props.baseFontSize,
    props.enableWpCardStyling, props.wpShadowStyle, props.wpBorderStyle, props.wpSpacing,
    props.enableWpHeaderAccent, props.wpHeaderAccentColor,
    props.enableButtonRestyling, props.enableLinkStyling, props.linkColor,
    props.enableSelectionColor, props.selectionBg, props.selectionText,
    effectiveCustomScrollbar, props.scrollThumbColor, props.scrollTrackColor,
    props.enableGradientText, props.gradientTextDirection, props.gradientTextColor1, props.gradientTextColor2,
    effectiveDarkMode, props.darkModePreference,
  ]);

  // ── Inject Google Font ──
  React.useEffect(function () {
    if (!props.wizardCompleted) {
      return;
    }
    var fontUrl = getGoogleFontUrl(props.primaryFont);
    if (fontUrl.length === 0) {
      return;
    }
    var existing = document.getElementById(FONT_TAG_ID);
    if (existing) {
      existing.setAttribute("href", fontUrl);
    } else {
      var link = document.createElement("link");
      link.id = FONT_TAG_ID;
      link.rel = "stylesheet";
      link.href = fontUrl;
      document.head.appendChild(link);
    }
    return function () {
      var el = document.getElementById(FONT_TAG_ID);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [props.wizardCompleted, props.primaryFont]);

  // Wizard handlers
  var handleWizardApply = React.useCallback(function (result: Partial<IHyperStyleWebPartProps>): void {
    setWizardOpen(false);
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
  }, [props.onWizardApply]);

  var handleWizardClose = React.useCallback(function (): void {
    setWizardOpen(false);
  }, []);

  var handleReRunWizard = React.useCallback(function (): void {
    setWizardOpen(true);
  }, []);

  // Find selected template name
  var templateName = "";
  if (props.selectedTemplate) {
    STYLE_TEMPLATES.forEach(function (t) {
      if (t.id === props.selectedTemplate) {
        templateName = t.name;
      }
    });
  }

  // Build children
  var children: React.ReactElement[] = [];

  // Demo bar (when demo mode is enabled)
  if (props.enableDemoMode) {
    children.push(
      React.createElement(HyperStyleDemoBar, {
        key: "demo",
        currentTemplate: demoTemplate,
        currentHeaderStyle: demoHeaderStyle,
        currentFooterStyle: demoFooterStyle,
        currentCardStyle: demoCardStyle,
        darkMode: demoDarkMode,
        scrollReveal: demoScrollReveal,
        hoverMicro: demoHoverMicro,
        customScrollbar: demoCustomScrollbar,
        onTemplateChange: function (template: StyleTemplate): void { setDemoTemplate(template); },
        onHeaderStyleChange: function (headerStyle: HeaderStyle): void { setDemoHeaderStyle(headerStyle); },
        onFooterStyleChange: function (footerStyle: FooterStyle): void { setDemoFooterStyle(footerStyle); },
        onCardStyleChange: function (cardStyle: CardStyle): void { setDemoCardStyle(cardStyle); },
        onToggleDarkMode: function (): void { setDemoDarkMode(!demoDarkMode); },
        onToggleScrollReveal: function (): void { setDemoScrollReveal(!demoScrollReveal); },
        onToggleHoverMicro: function (): void { setDemoHoverMicro(!demoHoverMicro); },
        onToggleCustomScrollbar: function (): void { setDemoCustomScrollbar(!demoCustomScrollbar); },
        onExitDemo: function (): void {
          if (props.onDemoModeChange) {
            props.onDemoModeChange(false);
          }
        },
      })
    );
  }

  // Edit mode bar
  if (props.isEditMode) {
    if (props.wizardCompleted) {
      // Show active status bar
      children.push(
        React.createElement("div", { key: "edit-bar", className: styles.editBar },
          React.createElement("div", { className: styles.editBarLeft },
            React.createElement("span", { className: styles.editBarIcon }, "\uD83C\uDFA8"),
            React.createElement("div", undefined,
              React.createElement("div", { className: styles.editBarTitle },
                "HyperStyle",
                templateName.length > 0
                  ? React.createElement("span", { className: styles.templateBadge, style: { marginLeft: "8px" } }, templateName)
                  : undefined
              ),
              React.createElement("div", { className: styles.editBarSub },
                "Global branding active \u2022 ",
                props.primaryFont,
                " \u2022 ",
                props.primaryColor
              )
            )
          ),
          React.createElement("div", { className: styles.editBarActions },
            React.createElement("div", { className: styles.activeIndicator },
              React.createElement("span", { className: styles.statusDot }),
              "Active"
            ),
            React.createElement("button", {
              className: styles.editBarBtnSecondary,
              onClick: handleReRunWizard,
              type: "button",
            }, "\u2728 Re-run Wizard")
          )
        )
      );
    } else {
      // Show setup prompt
      children.push(
        React.createElement("div", { key: "setup-bar", className: styles.editBar },
          React.createElement("div", { className: styles.editBarLeft },
            React.createElement("span", { className: styles.editBarIcon }, "\uD83C\uDFA8"),
            React.createElement("div", undefined,
              React.createElement("div", { className: styles.editBarTitle }, "HyperStyle"),
              React.createElement("div", { className: styles.editBarSub }, "Global branding engine \u2014 run the setup wizard to get started")
            )
          ),
          React.createElement("div", { className: styles.editBarActions },
            React.createElement("button", {
              className: styles.editBarBtn,
              onClick: function () { setWizardOpen(true); },
              type: "button",
            }, "\u2728 Run Setup Wizard")
          )
        )
      );
    }
  }

  // Wizard modal
  if (wizardOpen) {
    children.push(
      React.createElement(WelcomeStep, {
        key: "wizard",
        isOpen: wizardOpen,
        onClose: handleWizardClose,
        onApply: handleWizardApply,
        currentProps: props.wizardCompleted ? props : undefined,
      })
    );
  }

  // When not in edit mode and wizard is completed, this web part renders nothing visible
  // (it only injects CSS globally)
  if (!props.isEditMode && children.length === 0) {
    return React.createElement("div", {
      className: styles.hyperStyle,
      "data-automation-id": "HyperStyle",
      style: { display: "none" },
    });
  }

  return React.createElement("div", {
    className: styles.hyperStyle,
    "data-automation-id": "HyperStyle",
    role: "region",
    "aria-label": "HyperStyle Branding Engine",
  }, children);
};

var HyperStyle: React.FC<IHyperStyleProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperStyleInner, props)
  );
};

export default HyperStyle;
