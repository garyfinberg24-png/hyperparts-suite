/** Gradient settings */
export interface IGradientSettings {
  color1: string;
  color2: string;
  direction: "horizontal" | "vertical" | "diagonal-tl-br" | "diagonal-tr-bl";
  opacity: number;
}

/** Image background settings */
export interface IImageSettings {
  url: string;
  fit: "cover" | "contain" | "fill" | "none";
  position: string;
  overlayColor?: string;
  overlayOpacity?: number;
}

/** Custom shadow settings */
export interface IShadowSettings {
  xOffset: number;
  yOffset: number;
  blurRadius: number;
  spreadRadius: number;
  color: string;
  opacity: number;
}

/** Main style settings interface */
export interface IStyleSettings {
  backgroundType: "color" | "gradient" | "image" | "theme" | "category";
  backgroundColor?: string;
  backgroundOpacity?: number;
  backgroundGradient?: IGradientSettings;
  backgroundImage?: IImageSettings;
  borderEnabled: boolean;
  borderWidth: number;
  borderStyle: "solid" | "dashed" | "dotted" | "double" | "none";
  borderColor: string;
  borderRadius: number;
  shadowEnabled: boolean;
  shadowPreset?: "subtle" | "medium" | "strong";
  customShadow?: IShadowSettings;
}

export const DEFAULT_STYLE_SETTINGS: IStyleSettings = {
  backgroundType: "theme",
  borderEnabled: true,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#e1e1e1",
  borderRadius: 8,
  shadowEnabled: true,
  shadowPreset: "subtle",
};

/* ── Style generation ── */

const GRADIENT_DIRECTION_MAP: { [key: string]: string } = {
  horizontal: "to right",
  vertical: "to bottom",
  "diagonal-tl-br": "135deg",
  "diagonal-tr-bl": "45deg",
};

const SHADOW_PRESETS: { [key: string]: string } = {
  subtle: "0 1px 2px rgba(0, 0, 0, 0.05)",
  small: "0 2px 4px rgba(0, 0, 0, 0.1)",
  medium: "0 4px 8px rgba(0, 0, 0, 0.12)",
  strong: "0 8px 16px rgba(0, 0, 0, 0.15)",
};

/** Convert hex colour + opacity to rgba string */
export function rgbaColor(color: string, opacity: number): string {
  if (color.charAt(0) === "#") {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
  }
  return color;
}

/** Generate inline CSS from IStyleSettings */
export function generateStyles(settings: IStyleSettings): React.CSSProperties {
  const styles: React.CSSProperties = {};

  // Background
  if (settings.backgroundType === "color" && settings.backgroundColor) {
    styles.backgroundColor = settings.backgroundColor;
    if (settings.backgroundOpacity !== undefined) {
      styles.opacity = settings.backgroundOpacity / 100;
    }
  } else if (settings.backgroundType === "gradient" && settings.backgroundGradient) {
    const g = settings.backgroundGradient;
    const dir = GRADIENT_DIRECTION_MAP[g.direction] || "to right";
    styles.background = "linear-gradient(" + dir + ", " + g.color1 + ", " + g.color2 + ")";
  } else if (settings.backgroundType === "image" && settings.backgroundImage) {
    const img = settings.backgroundImage;
    styles.backgroundImage = "url(" + img.url + ")";
    styles.backgroundSize = img.fit || "cover";
    styles.backgroundPosition = img.position || "center";
    styles.backgroundRepeat = "no-repeat";
  }

  // Border
  if (settings.borderEnabled) {
    styles.borderWidth = (settings.borderWidth || 1) + "px";
    styles.borderStyle = settings.borderStyle || "solid";
    styles.borderColor = settings.borderColor || "#e1e1e1";
  }
  if (settings.borderRadius !== undefined) {
    styles.borderRadius = settings.borderRadius + "px";
  }

  // Shadow
  if (settings.shadowEnabled && settings.shadowPreset) {
    styles.boxShadow = SHADOW_PRESETS[settings.shadowPreset] || SHADOW_PRESETS.subtle;
  } else if (settings.shadowEnabled && settings.customShadow) {
    const s = settings.customShadow;
    const c = rgbaColor(s.color, s.opacity / 100);
    styles.boxShadow = s.xOffset + "px " + s.yOffset + "px " + s.blurRadius + "px " + s.spreadRadius + "px " + c;
  }

  return styles;
}
