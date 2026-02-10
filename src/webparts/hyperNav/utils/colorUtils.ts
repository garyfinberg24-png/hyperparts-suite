import type { IHyperNavColorConfig, IHyperNavPanelConfig } from "../models/IHyperNavLink";
import { DEFAULT_COLOR_CONFIG, DEFAULT_PANEL_CONFIG } from "../models/IHyperNavLink";

/**
 * Parse serialized color config JSON string, falling back to defaults.
 */
export function parseColorConfig(json: string | undefined): IHyperNavColorConfig {
  if (!json) return DEFAULT_COLOR_CONFIG;
  try {
    var parsed = JSON.parse(json) as IHyperNavColorConfig;
    return {
      linkDefault: parsed.linkDefault || DEFAULT_COLOR_CONFIG.linkDefault,
      linkHover: parsed.linkHover || DEFAULT_COLOR_CONFIG.linkHover,
      linkActive: parsed.linkActive || DEFAULT_COLOR_CONFIG.linkActive,
      linkVisited: parsed.linkVisited || DEFAULT_COLOR_CONFIG.linkVisited,
      btnDefaultBg: parsed.btnDefaultBg || DEFAULT_COLOR_CONFIG.btnDefaultBg,
      btnDefaultText: parsed.btnDefaultText || DEFAULT_COLOR_CONFIG.btnDefaultText,
      btnHoverBg: parsed.btnHoverBg || DEFAULT_COLOR_CONFIG.btnHoverBg,
      btnHoverText: parsed.btnHoverText || DEFAULT_COLOR_CONFIG.btnHoverText,
      btnPressedBg: parsed.btnPressedBg || DEFAULT_COLOR_CONFIG.btnPressedBg,
      btnPressedText: parsed.btnPressedText || DEFAULT_COLOR_CONFIG.btnPressedText,
    };
  } catch (_e) {
    return DEFAULT_COLOR_CONFIG;
  }
}

/**
 * Stringify color config to JSON.
 */
export function stringifyColorConfig(config: IHyperNavColorConfig): string {
  return JSON.stringify(config);
}

/**
 * Parse serialized panel config JSON string, falling back to defaults.
 */
export function parsePanelConfig(json: string | undefined): IHyperNavPanelConfig {
  if (!json) return DEFAULT_PANEL_CONFIG;
  try {
    var parsed = JSON.parse(json) as IHyperNavPanelConfig;
    return {
      background: parsed.background || DEFAULT_PANEL_CONFIG.background,
      borderColor: parsed.borderColor || DEFAULT_PANEL_CONFIG.borderColor,
      shadow: parsed.shadow || DEFAULT_PANEL_CONFIG.shadow,
      animation: parsed.animation || DEFAULT_PANEL_CONFIG.animation,
      columns: parsed.columns || DEFAULT_PANEL_CONFIG.columns,
      padding: parsed.padding !== undefined ? parsed.padding : DEFAULT_PANEL_CONFIG.padding,
      maxHeight: parsed.maxHeight !== undefined ? parsed.maxHeight : DEFAULT_PANEL_CONFIG.maxHeight,
      borderRadius: parsed.borderRadius !== undefined ? parsed.borderRadius : DEFAULT_PANEL_CONFIG.borderRadius,
    };
  } catch (_e) {
    return DEFAULT_PANEL_CONFIG;
  }
}

/**
 * Stringify panel config to JSON.
 */
export function stringifyPanelConfig(config: IHyperNavPanelConfig): string {
  return JSON.stringify(config);
}

/**
 * Build CSS custom properties (inline style object) from color config.
 */
export function buildColorCssVars(config: IHyperNavColorConfig): Record<string, string> {
  var vars: Record<string, string> = {};
  vars["--hnav-link-default"] = config.linkDefault;
  vars["--hnav-link-hover"] = config.linkHover;
  vars["--hnav-link-active"] = config.linkActive;
  vars["--hnav-link-visited"] = config.linkVisited;
  vars["--hnav-btn-default-bg"] = config.btnDefaultBg;
  vars["--hnav-btn-default-text"] = config.btnDefaultText;
  vars["--hnav-btn-hover-bg"] = config.btnHoverBg;
  vars["--hnav-btn-hover-text"] = config.btnHoverText;
  vars["--hnav-btn-pressed-bg"] = config.btnPressedBg;
  vars["--hnav-btn-pressed-text"] = config.btnPressedText;
  return vars;
}

/**
 * Build CSS custom properties for panel config.
 */
export function buildPanelCssVars(config: IHyperNavPanelConfig): Record<string, string> {
  var vars: Record<string, string> = {};
  vars["--hnav-panel-bg"] = config.background;
  vars["--hnav-panel-border"] = config.borderColor;
  vars["--hnav-panel-padding"] = config.padding + "px";
  vars["--hnav-panel-max-height"] = config.maxHeight + "px";
  vars["--hnav-panel-radius"] = config.borderRadius + "px";

  // Shadow mapping
  var shadowMap: Record<string, string> = {
    none: "none",
    small: "0 2px 4px rgba(0,0,0,0.1)",
    medium: "0 4px 8px rgba(0,0,0,0.12)",
    large: "0 8px 16px rgba(0,0,0,0.14)",
  };
  vars["--hnav-panel-shadow"] = shadowMap[config.shadow] || shadowMap.large;

  return vars;
}

/**
 * Merge color + panel CSS vars into a single style object.
 */
export function buildNavCssVars(
  colorConfig: IHyperNavColorConfig,
  panelConfig: IHyperNavPanelConfig
): Record<string, string> {
  var colorVars = buildColorCssVars(colorConfig);
  var panelVars = buildPanelCssVars(panelConfig);
  var merged: Record<string, string> = {};
  Object.keys(colorVars).forEach(function (key) { merged[key] = colorVars[key]; });
  Object.keys(panelVars).forEach(function (key) { merged[key] = panelVars[key]; });
  return merged;
}
