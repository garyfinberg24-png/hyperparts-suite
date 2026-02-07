import * as React from "react";
import type { IHyperHeroTile, IHyperHeroCta } from "../models";
import { HyperHeroGradientOverlay } from "./HyperHeroGradientOverlay";
import { HyperHeroCtaGroup } from "./HyperHeroCtaGroup";
import { HyperHeroCountdown } from "./HyperHeroCountdown";
import { HyperHeroParallaxImage } from "./HyperHeroParallaxImage";
import { HyperHeroVideoBackground } from "./HyperHeroVideoBackground";
import { HyperHeroLottieBackground } from "./HyperHeroLottieBackground";
import { HyperHeroEditOverlay } from "./HyperHeroEditOverlay";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroTileProps {
  tile: IHyperHeroTile;
  onCtaClick?: (cta: IHyperHeroCta) => void;
  isEditMode?: boolean;
  onEditTile?: (tileId: string) => void;
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

const HyperHeroTileInner: React.FC<IHyperHeroTileProps> = (props) => {
  const { tile, onCtaClick, isEditMode, onEditTile } = props;

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

  // Content layer
  const textStyle: React.CSSProperties = tile.textColor
    ? { color: tile.textColor }
    : {};

  // Countdown (renders above heading when enabled)
  const countdownEl = tile.countdown && tile.countdown.enabled
    ? React.createElement(HyperHeroCountdown, { config: tile.countdown })
    : undefined;

  const headingEl = tile.heading
    ? React.createElement("h2", { className: styles.heading, style: textStyle }, tile.heading)
    : undefined;

  const subheadingEl = tile.subheading
    ? React.createElement("p", { className: styles.subheading, style: textStyle }, tile.subheading)
    : undefined;

  const descriptionEl = tile.description
    ? React.createElement("p", { className: styles.description, style: textStyle }, tile.description)
    : undefined;

  const ctaEl = tile.ctas && tile.ctas.length > 0
    ? React.createElement(HyperHeroCtaGroup, { ctas: tile.ctas, onCtaClick: onCtaClick })
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

  // Edit mode overlay — shown only in edit mode
  const editOverlay = isEditMode
    ? React.createElement(HyperHeroEditOverlay, { tileId: tile.id, onEdit: onEditTile })
    : undefined;

  // Tile link wrapper — makes entire tile clickable (disabled in edit mode)
  if (tile.tileLink && !isEditMode) {
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
    contentLayer,
    editOverlay
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
