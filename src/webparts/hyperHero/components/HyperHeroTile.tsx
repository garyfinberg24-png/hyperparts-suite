import * as React from "react";
import type { IHyperHeroTile, IHyperHeroCta, IElementAnimation } from "../models";
import { HyperHeroGradientOverlay } from "./HyperHeroGradientOverlay";
import { HyperHeroCtaGroup } from "./HyperHeroCtaGroup";
import { HyperHeroCountdown } from "./HyperHeroCountdown";
import { HyperHeroParallaxImage } from "./HyperHeroParallaxImage";
import { HyperHeroVideoBackground } from "./HyperHeroVideoBackground";
import { HyperHeroLottieBackground } from "./HyperHeroLottieBackground";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroTileProps {
  tile: IHyperHeroTile;
  onCtaClick?: (cta: IHyperHeroCta) => void;
}

const verticalAlignMap: Record<string, string> = {
  top: styles.tileAlignTop,
  center: styles.tileAlignCenter,
  bottom: styles.tileAlignBottom,
};

const textAlignMap: Record<string, string> = {
  left: styles.tileTextLeft,
  center: styles.tileTextCenter,
  right: styles.tileTextRight,
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

const HyperHeroTileInner: React.FC<IHyperHeroTileProps> = (props) => {
  const { tile, onCtaClick } = props;

  const tileClasses = [
    styles.tile,
    verticalAlignMap[tile.verticalAlign] ?? styles.tileAlignBottom,
    textAlignMap[tile.textAlign] ?? styles.tileTextLeft,
  ].join(" ");

  const tileStyle: React.CSSProperties = {
    gridArea: tile.gridArea,
  };

  // Background layer
  const backgroundElement = renderBackground(tile);

  // Gradient overlay
  const gradientElement = tile.gradientOverlay
    ? React.createElement(HyperHeroGradientOverlay, { gradient: tile.gradientOverlay })
    : undefined;

  // Per-element animation configs
  const anims = tile.elementAnimations;

  // Content layer — base text color style
  const textStyle: React.CSSProperties = tile.textColor
    ? { color: tile.textColor }
    : {};

  // Countdown (renders above heading when enabled)
  const countdownEl = tile.countdown && tile.countdown.enabled
    ? React.createElement(HyperHeroCountdown, { config: tile.countdown })
    : undefined;

  // Heading with animation
  const headingAnimStyle = anims ? buildAnimationStyle(anims.heading) : {};
  const headingEl = tile.heading
    ? React.createElement("h2", {
        className: styles.heading,
        style: { ...textStyle, ...headingAnimStyle },
      }, tile.heading)
    : undefined;

  // Subheading with animation
  const subAnimStyle = anims ? buildAnimationStyle(anims.subheading) : {};
  const subheadingEl = tile.subheading
    ? React.createElement("p", {
        className: styles.subheading,
        style: { ...textStyle, ...subAnimStyle },
      }, tile.subheading)
    : undefined;

  // Description with animation
  const descAnimStyle = anims ? buildAnimationStyle(anims.description) : {};
  const descriptionEl = tile.description
    ? React.createElement("p", {
        className: styles.description,
        style: { ...textStyle, ...descAnimStyle },
      }, tile.description)
    : undefined;

  // CTAs with animation
  const ctaAnimStyle = anims ? buildAnimationStyle(anims.ctas) : {};
  const ctaEl = tile.ctas && tile.ctas.length > 0
    ? React.createElement("div", { style: ctaAnimStyle },
        React.createElement(HyperHeroCtaGroup, { ctas: tile.ctas, onCtaClick: onCtaClick })
      )
    : undefined;

  const contentLayer = React.createElement(
    "div",
    { className: styles.contentLayer },
    countdownEl,
    headingEl,
    subheadingEl,
    descriptionEl,
    ctaEl
  );

  // Tile link wrapper — makes entire tile clickable
  if (tile.tileLink) {
    return React.createElement(
      "a",
      {
        className: tileClasses,
        style: { ...tileStyle, textDecoration: "none", color: "inherit", display: "flex" },
        href: tile.tileLink.url,
        target: tile.tileLink.openInNewTab ? "_blank" : "_self",
        rel: tile.tileLink.openInNewTab ? "noopener noreferrer" : undefined,
        "aria-label": tile.tileLink.ariaLabel ?? tile.heading,
      },
      backgroundElement,
      gradientElement,
      contentLayer
    );
  }

  return React.createElement(
    "div",
    { className: tileClasses, style: tileStyle },
    backgroundElement,
    gradientElement,
    contentLayer
  );
};

function renderBackground(tile: IHyperHeroTile): React.ReactElement | undefined {
  const bg = tile.background;

  // Image with parallax effect
  if (bg.type === "image" && bg.imageUrl && tile.parallax && tile.parallax.enabled) {
    return React.createElement(HyperHeroParallaxImage, {
      background: bg,
      parallax: tile.parallax,
      heading: tile.heading,
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
      "aria-label": bg.imageAlt ?? tile.heading,
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

export const HyperHeroTile = React.memo(HyperHeroTileInner);
