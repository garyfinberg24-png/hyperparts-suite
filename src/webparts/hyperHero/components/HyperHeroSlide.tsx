import * as React from "react";
import type { IHyperHeroSlide, IHyperHeroCta, IElementAnimation, IHyperHeroFontSettings } from "../models";
import { HyperHeroGradientOverlay } from "./HyperHeroGradientOverlay";
import { HyperHeroCtaGroup } from "./HyperHeroCtaGroup";
import { HyperHeroCountdown } from "./HyperHeroCountdown";
import { HyperHeroParallaxImage } from "./HyperHeroParallaxImage";
import { HyperHeroVideoBackground } from "./HyperHeroVideoBackground";
import { HyperHeroLottieBackground } from "./HyperHeroLottieBackground";
import { HyperHeroCanvasLayer } from "./canvas/HyperHeroCanvasLayer";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroSlideProps {
  slide: IHyperHeroSlide;
  onCtaClick?: (cta: IHyperHeroCta) => void;
  /** When true, disables link navigation and CTA clicks (for editor preview) */
  previewMode?: boolean;
}

const verticalAlignMap: Record<string, string> = {
  top: styles.slideAlignTop,
  center: styles.slideAlignCenter,
  bottom: styles.slideAlignBottom,
};

const textAlignMap: Record<string, string> = {
  left: styles.slideTextLeft,
  center: styles.slideTextCenter,
  right: styles.slideTextRight,
};

/** Map EntranceEffect values to their CSS @keyframes animation names */
const ENTRANCE_KEYFRAME_MAP: Record<string, string> = {
  fadeUp: "hyperFadeUp",
  fadeDown: "hyperFadeDown",
  fadeIn: "hyperFadeInAnim",
  slideLeft: "hyperSlideLeft",
  slideRight: "hyperSlideRight",
  slideUp: "hyperSlideUp",
  slideDown: "hyperSlideDown",
  scaleUp: "hyperScaleUp",
  scaleDown: "hyperScaleDown",
  rotateIn: "hyperRotateIn",
  bounceIn: "hyperBounceIn",
};

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

/** Build inline font style from font settings (returns empty object if all defaults) */
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

/** Build inline animation style from an IElementAnimation config */
function buildAnimationStyle(anim: IElementAnimation | undefined): React.CSSProperties {
  if (!anim || anim.effect === "none") return {};
  const keyframeName = ENTRANCE_KEYFRAME_MAP[anim.effect];
  if (!keyframeName) return {};
  return {
    opacity: 0,
    animationName: keyframeName,
    animationDuration: anim.durationMs + "ms",
    animationDelay: anim.delayMs + "ms",
    animationFillMode: "forwards",
    animationTimingFunction: anim.effect === "bounceIn" ? "ease" : "ease-out",
  };
}

const HyperHeroSlideInner: React.FC<IHyperHeroSlideProps> = (props) => {
  const { slide, onCtaClick, previewMode } = props;

  const slideClasses = [
    styles.slide,
    verticalAlignMap[slide.verticalAlign] ?? styles.slideAlignBottom,
    textAlignMap[slide.textAlign] ?? styles.slideTextLeft,
  ].join(" ");

  const slideStyle: React.CSSProperties = {
    gridArea: slide.gridArea,
  };

  // Background layer
  const backgroundElement = renderBackground(slide);

  // Gradient overlay
  const gradientElement = slide.gradientOverlay
    ? React.createElement(HyperHeroGradientOverlay, { gradient: slide.gradientOverlay })
    : undefined;

  // Per-element animation configs
  const anims = slide.elementAnimations;

  // Content layer — base text color style
  const textStyle: React.CSSProperties = slide.textColor
    ? { color: slide.textColor }
    : {};

  // Font config per element
  const fc = slide.fontConfig;
  const headingFontStyle = fc ? buildFontStyle(fc.heading) : {};
  const subFontStyle = fc ? buildFontStyle(fc.subheading) : {};
  const descFontStyle = fc ? buildFontStyle(fc.description) : {};

  // Countdown (renders above heading when enabled)
  const countdownEl = slide.countdown && slide.countdown.enabled
    ? React.createElement(HyperHeroCountdown, { config: slide.countdown })
    : undefined;

  // Heading with animation + font
  const headingAnimStyle = anims ? buildAnimationStyle(anims.heading) : {};
  const headingEl = slide.heading
    ? React.createElement("h2", {
        className: styles.heading,
        style: { ...textStyle, ...headingFontStyle, ...headingAnimStyle },
      }, slide.heading)
    : undefined;

  // Subheading with animation + font
  const subAnimStyle = anims ? buildAnimationStyle(anims.subheading) : {};
  const subheadingEl = slide.subheading
    ? React.createElement("p", {
        className: styles.subheading,
        style: { ...textStyle, ...subFontStyle, ...subAnimStyle },
      }, slide.subheading)
    : undefined;

  // Description with animation + font
  const descAnimStyle = anims ? buildAnimationStyle(anims.description) : {};
  const descriptionEl = slide.description
    ? React.createElement("p", {
        className: styles.description,
        style: { ...textStyle, ...descFontStyle, ...descAnimStyle },
      }, slide.description)
    : undefined;

  // CTAs with animation
  const ctaAnimStyle = anims ? buildAnimationStyle(anims.ctas) : {};
  const ctaWrapStyle: React.CSSProperties = previewMode
    ? { ...ctaAnimStyle, pointerEvents: "none" }
    : ctaAnimStyle;
  const ctaEl = slide.ctas && slide.ctas.length > 0
    ? React.createElement("div", { style: ctaWrapStyle },
        React.createElement(HyperHeroCtaGroup, {
          ctas: slide.ctas,
          onCtaClick: previewMode ? undefined : onCtaClick,
        })
      )
    : undefined;

  // Text overlay styles applied to content layer
  const overlayStyle: React.CSSProperties = {};
  const ov = slide.textOverlay;
  if (ov && ov.enabled) {
    overlayStyle.backgroundColor = hexToRgba(ov.backgroundColor || "#000000", ov.opacity || 50);
    if (ov.paddingVertical || ov.paddingHorizontal) {
      overlayStyle.padding = (ov.paddingVertical || ov.padding || 24) + "px " + (ov.paddingHorizontal || ov.padding || 24) + "px";
    } else if (ov.padding) {
      overlayStyle.padding = ov.padding + "px";
    }
    if (ov.borderRadius) overlayStyle.borderRadius = ov.borderRadius + "px";
    if (ov.margin) overlayStyle.margin = ov.margin + "px";
    if (ov.maxWidth > 0 && ov.maxWidth < 100) overlayStyle.maxWidth = ov.maxWidth + "%";
  }

  // Canvas mode: render free-positioned layers instead of stack content
  const isCanvasMode = slide.contentMode === "canvas" && slide.layers && slide.layers.length > 0;

  let contentLayer: React.ReactElement;
  if (isCanvasMode) {
    // Render canvas layers (sorted by zIndex)
    const sortedLayers = slide.layers!.slice().sort(function (a, b) { return a.zIndex - b.zIndex; });
    const canvasChildren: React.ReactElement[] = [];
    sortedLayers.forEach(function (layer) {
      if (!layer.visible) return;
      canvasChildren.push(
        React.createElement(HyperHeroCanvasLayer, {
          key: layer.id,
          layer: layer,
          isSelected: false,
          isEditing: false,
        })
      );
    });
    contentLayer = React.createElement(
      "div",
      {
        style: { position: "relative", width: "100%", height: "100%", zIndex: 2 },
      },
      canvasChildren
    );
  } else {
    // If no per-element animations are set, add a default content fade-in
    // so the Replay button always produces visible feedback
    var hasAnyAnimation = anims && (
      (anims.heading && anims.heading.effect !== "none") ||
      (anims.subheading && anims.subheading.effect !== "none") ||
      (anims.description && anims.description.effect !== "none") ||
      (anims.ctas && anims.ctas.effect !== "none")
    );
    var contentStyle: React.CSSProperties = { ...overlayStyle };
    if (!hasAnyAnimation) {
      contentStyle.animationName = "hyperFadeInAnim";
      contentStyle.animationDuration = "500ms";
      contentStyle.animationFillMode = "forwards";
      contentStyle.animationTimingFunction = "ease-out";
    }
    contentLayer = React.createElement(
      "div",
      { className: styles.contentLayer, style: contentStyle },
      countdownEl,
      headingEl,
      subheadingEl,
      descriptionEl,
      ctaEl
    );
  }

  // Slide link wrapper — makes entire slide clickable (disabled in preview mode)
  if (slide.slideLink && !previewMode) {
    return React.createElement(
      "a",
      {
        className: slideClasses,
        style: { ...slideStyle, textDecoration: "none", color: "inherit", display: "flex" },
        href: slide.slideLink.url,
        target: slide.slideLink.openInNewTab ? "_blank" : "_self",
        rel: slide.slideLink.openInNewTab ? "noopener noreferrer" : undefined,
        "aria-label": slide.slideLink.ariaLabel ?? slide.heading,
      },
      backgroundElement,
      gradientElement,
      contentLayer
    );
  }

  return React.createElement(
    "div",
    { className: slideClasses, style: slideStyle },
    backgroundElement,
    gradientElement,
    contentLayer
  );
};

function renderBackground(slide: IHyperHeroSlide): React.ReactElement | undefined {
  const bg = slide.background;

  // Image with parallax effect
  if (bg.type === "image" && bg.imageUrl && slide.parallax && slide.parallax.enabled) {
    return React.createElement(HyperHeroParallaxImage, {
      background: bg,
      parallax: slide.parallax,
      heading: slide.heading,
    });
  }

  // Standard image (no parallax)
  if (bg.type === "image" && bg.imageUrl) {
    const posX = bg.imageFocalPoint ? bg.imageFocalPoint.x + "%" : "center";
    const posY = bg.imageFocalPoint ? bg.imageFocalPoint.y + "%" : "center";
    return React.createElement("div", {
      className: styles.backgroundImage,
      style: {
        backgroundImage: "url(" + bg.imageUrl + ")",
        backgroundPosition: posX + " " + posY,
      },
      role: "img",
      "aria-label": bg.imageAlt ?? slide.heading,
    });
  }

  if (bg.type === "solidColor" && bg.backgroundColor) {
    return React.createElement("div", {
      className: styles.backgroundLayer,
      style: { backgroundColor: bg.backgroundColor },
      "aria-hidden": "true",
    });
  }

  // Video background
  if (bg.type === "video" && bg.video) {
    return React.createElement(HyperHeroVideoBackground, { config: bg.video });
  }

  // Lottie animation background
  if (bg.type === "lottie" && bg.lottie) {
    return React.createElement(HyperHeroLottieBackground, { config: bg.lottie });
  }

  return undefined;
}

export const HyperHeroSlide = React.memo(HyperHeroSlideInner);
