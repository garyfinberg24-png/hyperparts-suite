import * as React from "react";
import type { IHyperHeroLayer } from "../../models";
import type { CtaVariant } from "../../models";
import type { IHyperHeroFontSettings, IHyperHeroTextOverlay } from "../../models";
import styles from "./HyperHeroCanvasLayer.module.scss";

export interface IHyperHeroCanvasLayerProps {
  layer: IHyperHeroLayer;
  isSelected: boolean;
  isEditing: boolean;
  onSelect?: (layerId: string) => void;
  onDragStart?: (
    e: React.MouseEvent,
    layerId: string,
    handle: "move" | "resize-nw" | "resize-ne" | "resize-sw" | "resize-se"
  ) => void;
}

// ── Utility functions ──────────────────────────────────────────

/** Text shadow presets */
const TEXT_SHADOW_MAP: Record<string, string> = {
  none: "",
  light: "1px 1px 2px rgba(0,0,0,0.3)",
  medium: "2px 2px 4px rgba(0,0,0,0.5)",
  heavy: "3px 3px 6px rgba(0,0,0,0.7)",
};

/** Convert hex color + opacity (0-100) to rgba string */
function hexToRgba(hex: string, opacity: number): string {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  let r = parseInt(clean.substring(0, 2), 16);
  let g = parseInt(clean.substring(2, 4), 16);
  let b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r)) r = 0;
  if (isNaN(g)) g = 0;
  if (isNaN(b)) b = 0;
  return "rgba(" + r + "," + g + "," + b + "," + (opacity / 100) + ")";
}

/** Build inline font style from font settings */
function buildFontStyle(fs: IHyperHeroFontSettings | undefined): React.CSSProperties {
  if (!fs) return {};
  const s: React.CSSProperties = {};
  if (fs.fontFamily && fs.fontFamily !== "Segoe UI") {
    s.fontFamily = "\"" + fs.fontFamily + "\", sans-serif";
  }
  if (fs.fontSize > 0) s.fontSize = fs.fontSize + "px";
  if (fs.fontWeight > 0) s.fontWeight = fs.fontWeight;
  if (fs.color) s.color = fs.color;
  if (fs.letterSpacing !== 0) s.letterSpacing = fs.letterSpacing + "px";
  if (fs.lineHeight > 0) s.lineHeight = fs.lineHeight;
  if (fs.textTransform && fs.textTransform !== "none") {
    s.textTransform = fs.textTransform as "uppercase" | "lowercase" | "capitalize";
  }
  const shadow = fs.textShadow ? TEXT_SHADOW_MAP[fs.textShadow] : undefined;
  if (shadow) s.textShadow = shadow;
  return s;
}

// ── Button variant style map ───────────────────────────────────

/** Inline styles for each CtaVariant, used to preview buttons on the canvas */
const BUTTON_VARIANT_STYLES: Record<CtaVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#0078d4",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
  },
  secondary: {
    backgroundColor: "#ffffff",
    color: "#0078d4",
    border: "1px solid #0078d4",
    borderRadius: "4px",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#0078d4",
    border: "none",
    borderRadius: "4px",
    textDecoration: "underline",
  },
  pill: {
    backgroundColor: "#0078d4",
    color: "#ffffff",
    border: "none",
    borderRadius: "24px",
    paddingLeft: "24px",
    paddingRight: "24px",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#323130",
    border: "2px solid #323130",
    borderRadius: "4px",
  },
  gradient: {
    backgroundImage: "linear-gradient(135deg, #0078d4, #00bcf2)",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
  },
  shadow: {
    backgroundColor: "#0078d4",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0, 120, 212, 0.4)",
  },
  minimal: {
    backgroundColor: "transparent",
    color: "#0078d4",
    border: "none",
    borderRadius: "0",
    padding: "4px 8px",
  },
  rounded: {
    backgroundColor: "#0078d4",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
  },
  block: {
    backgroundColor: "#0078d4",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
};

// ── Handle names for resize corners ────────────────────────────

type ResizeHandleKey = "resize-nw" | "resize-ne" | "resize-sw" | "resize-se";

interface IResizeHandleConfig {
  handle: ResizeHandleKey;
  className: string;
}

const RESIZE_HANDLES: IResizeHandleConfig[] = [
  { handle: "resize-nw", className: styles.resizeHandleNw },
  { handle: "resize-ne", className: styles.resizeHandleNe },
  { handle: "resize-sw", className: styles.resizeHandleSw },
  { handle: "resize-se", className: styles.resizeHandleSe },
];

// ── Component ──────────────────────────────────────────────────

const HyperHeroCanvasLayerInner: React.FC<IHyperHeroCanvasLayerProps> = function (props) {
  const { layer, isSelected, isEditing, onSelect, onDragStart } = props;

  // Hidden layers return an empty span
  if (!layer.visible) {
    // eslint-disable-next-line @rushstack/no-new-null
    return React.createElement("span", { style: { display: "none" } });
  }

  // ── Container style ────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: layer.x + "%",
    top: layer.y + "%",
    width: layer.width + "%",
    height: layer.height > 0 ? layer.height + "%" : "auto",
    opacity: layer.opacity / 100,
    transform: "rotate(" + layer.rotation + "deg)",
    zIndex: layer.zIndex,
  };

  // ── Container CSS classes ──────────────────────────────────
  const classNames: string[] = [styles.layerContainer];
  if (isSelected && isEditing) {
    classNames.push(styles.layerContainerSelected);
  }
  if (layer.locked) {
    classNames.push(styles.layerContainerLocked);
  }

  // ── Click handler (select layer) ──────────────────────────
  const handleClick = function (e: React.MouseEvent): void {
    e.stopPropagation();
    if (onSelect && !layer.locked) {
      onSelect(layer.id);
    }
  };

  // ── Mouse down for move drag ──────────────────────────────
  const handleMouseDown = function (e: React.MouseEvent): void {
    if (layer.locked) return;
    if (onDragStart) {
      onDragStart(e, layer.id, "move");
    }
  };

  // ── Render layer content by type ──────────────────────────
  const contentEl = renderLayerContent(layer);

  // ── Build children array ──────────────────────────────────
  const children: React.ReactNode[] = [];
  children.push(contentEl);

  // Resize handles when selected + editing
  if (isSelected && isEditing) {
    RESIZE_HANDLES.forEach(function (cfg) {
      const handleMouseDownResize = function (e: React.MouseEvent): void {
        e.stopPropagation();
        e.preventDefault();
        if (onDragStart && !layer.locked) {
          onDragStart(e, layer.id, cfg.handle);
        }
      };
      children.push(
        React.createElement("div", {
          key: cfg.handle,
          className: styles.resizeHandle + " " + cfg.className,
          onMouseDown: handleMouseDownResize,
        })
      );
    });
  }

  return React.createElement(
    "div",
    {
      className: classNames.join(" "),
      style: containerStyle,
      onClick: handleClick,
      onMouseDown: handleMouseDown,
      "data-layer-id": layer.id,
    },
    children
  );
};

// ── Content rendering by layer type ────────────────────────────

function renderLayerContent(layer: IHyperHeroLayer): React.ReactElement {
  if (layer.type === "text") {
    return renderTextLayer(layer);
  }
  if (layer.type === "image") {
    return renderImageLayer(layer);
  }
  if (layer.type === "button") {
    return renderButtonLayer(layer);
  }
  if (layer.type === "shape") {
    return renderShapeLayer(layer);
  }
  if (layer.type === "icon") {
    return renderIconLayer(layer);
  }
  // Fallback — unknown layer type
  return React.createElement("div");
}

// ── Text layer ─────────────────────────────────────────────────

function renderTextLayer(layer: IHyperHeroLayer): React.ReactElement {
  const fontStyle = buildFontStyle(layer.fontConfig);
  const overlayStyle = buildTextOverlayStyle(layer.textOverlay);
  const combinedStyle: React.CSSProperties = { ...fontStyle, ...overlayStyle };

  return React.createElement(
    "span",
    {
      className: styles.textLayer,
      style: combinedStyle,
    },
    layer.textContent || ""
  );
}

/** Build inline overlay style (background, padding, borderRadius) */
function buildTextOverlayStyle(ov: IHyperHeroTextOverlay | undefined): React.CSSProperties {
  if (!ov || !ov.enabled) return {};
  const s: React.CSSProperties = {};
  s.backgroundColor = hexToRgba(ov.backgroundColor || "#000000", ov.opacity || 50);
  if (ov.paddingVertical || ov.paddingHorizontal) {
    s.padding =
      (ov.paddingVertical || ov.padding || 24) + "px " +
      (ov.paddingHorizontal || ov.padding || 24) + "px";
  } else if (ov.padding) {
    s.padding = ov.padding + "px";
  }
  if (ov.borderRadius) s.borderRadius = ov.borderRadius + "px";
  return s;
}

// ── Image layer ────────────────────────────────────────────────

function renderImageLayer(layer: IHyperHeroLayer): React.ReactElement {
  const imageStyle: React.CSSProperties = {
    backgroundImage: layer.imageUrl ? "url(" + layer.imageUrl + ")" : "none",
    backgroundSize: layer.imageFit || "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100%",
  };

  return React.createElement("div", {
    className: styles.imageLayer,
    style: imageStyle,
    role: "img",
    "aria-label": layer.imageAlt || "Layer image",
  });
}

// ── Button layer ───────────────────────────────────────────────

function renderButtonLayer(layer: IHyperHeroLayer): React.ReactElement {
  const variant: CtaVariant = layer.buttonVariant || "primary";
  const variantStyle = BUTTON_VARIANT_STYLES[variant] || BUTTON_VARIANT_STYLES.primary;

  return React.createElement(
    "span",
    {
      className: styles.buttonLayer,
      style: variantStyle,
      role: "button",
      "aria-label": layer.buttonLabel || "Button",
    },
    layer.buttonLabel || "Button"
  );
}

// ── Shape layer ────────────────────────────────────────────────

function renderShapeLayer(layer: IHyperHeroLayer): React.ReactElement {
  const shapeType = layer.shapeType || "rectangle";
  const color = layer.shapeColor || "#0078d4";
  const borderWidth = layer.shapeBorderWidth || 0;
  const borderColor = layer.shapeBorderColor || "#000000";

  if (shapeType === "circle") {
    const circleStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      backgroundColor: color,
    };
    if (borderWidth > 0) {
      circleStyle.border = borderWidth + "px solid " + borderColor;
      circleStyle.boxSizing = "border-box";
    }
    return React.createElement("div", {
      className: styles.shapeLayer,
      style: circleStyle,
      "aria-hidden": "true",
    });
  }

  if (shapeType === "line") {
    const lineStyle: React.CSSProperties = {
      width: "100%",
      height: "2px",
      backgroundColor: color,
    };
    return React.createElement("div", {
      className: styles.shapeLayer,
      style: lineStyle,
      "aria-hidden": "true",
    });
  }

  if (shapeType === "triangle") {
    // CSS border trick: transparent left/right + colored bottom
    const halfWidth = "50%";
    const triangleStyle: React.CSSProperties = {
      width: "0",
      height: "0",
      borderLeft: halfWidth + " solid transparent",
      borderRight: halfWidth + " solid transparent",
      borderBottom: "100% solid " + color,
      backgroundColor: "transparent",
    };
    return React.createElement("div", {
      className: styles.shapeLayer,
      style: triangleStyle,
      "aria-hidden": "true",
    });
  }

  // Default: rectangle
  const rectStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundColor: color,
    borderRadius: "0",
  };
  if (borderWidth > 0) {
    rectStyle.border = borderWidth + "px solid " + borderColor;
    rectStyle.boxSizing = "border-box";
  }
  return React.createElement("div", {
    className: styles.shapeLayer,
    style: rectStyle,
    "aria-hidden": "true",
  });
}

// ── Icon layer ─────────────────────────────────────────────────

function renderIconLayer(layer: IHyperHeroLayer): React.ReactElement {
  const iconSize = layer.iconSize || 48;

  return React.createElement(
    "div",
    {
      className: styles.iconLayer,
      style: { fontSize: iconSize + "px", lineHeight: 1 },
      "aria-label": layer.iconEmoji || "Icon",
      role: "img",
    },
    layer.iconEmoji || ""
  );
}

// ── Export ──────────────────────────────────────────────────────

export const HyperHeroCanvasLayer = React.memo(HyperHeroCanvasLayerInner);
