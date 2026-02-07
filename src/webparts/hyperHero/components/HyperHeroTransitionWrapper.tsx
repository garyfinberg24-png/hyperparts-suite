import * as React from "react";
import { useCallback } from "react";
import type { IHyperHeroRotation, IHyperHeroTile, IHyperHeroCta } from "../models";
import { useAutoRotation } from "../hooks/useAutoRotation";
import { useHyperHeroStore } from "../store/useHyperHeroStore";
import { HyperHeroTile } from "./HyperHeroTile";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroTransitionWrapperProps {
  tiles: IHyperHeroTile[];
  rotation: IHyperHeroRotation;
  gridStyle: React.CSSProperties;
  onCtaClick?: (cta: IHyperHeroCta) => void;
}

const HyperHeroTransitionWrapperInner: React.FC<IHyperHeroTransitionWrapperProps> = (props) => {
  const { tiles, rotation, gridStyle, onCtaClick } = props;

  const activeSlideIndex = useHyperHeroStore((s) => s.activeSlideIndex);
  const goToNextSlide = useHyperHeroStore((s) => s.goToNextSlide);
  const goToPrevSlide = useHyperHeroStore((s) => s.goToPrevSlide);
  const setActiveSlide = useHyperHeroStore((s) => s.setActiveSlide);

  const handleNext = useCallback((): void => {
    goToNextSlide(tiles.length);
  }, [goToNextSlide, tiles.length]);

  const handlePrev = useCallback((): void => {
    goToPrevSlide(tiles.length);
  }, [goToPrevSlide, tiles.length]);

  const { containerProps } = useAutoRotation(
    {
      enabled: rotation.enabled,
      intervalMs: rotation.intervalMs,
      totalSlides: tiles.length,
      pauseOnHover: rotation.pauseOnHover,
    },
    handleNext
  );

  // When rotation is disabled, render all tiles in the grid
  if (!rotation.enabled || tiles.length <= 1) {
    return React.createElement(
      "div",
      { className: styles.heroGrid, style: gridStyle, role: "region" },
      tiles.map((tile) =>
        React.createElement(HyperHeroTile, {
          key: tile.id,
          tile: tile,
          onCtaClick: onCtaClick,
        })
      )
    );
  }

  // Rotation mode: show one tile at a time with transition effects
  const currentIndex = activeSlideIndex % tiles.length;
  const currentTile = tiles[currentIndex];

  // Build transition style
  const transitionStyle: React.CSSProperties = {};
  if (rotation.effect === "fade" || rotation.effect === "zoom") {
    transitionStyle.animation =
      (rotation.effect === "fade" ? "hyperFadeIn" : "hyperZoomIn") +
      " " +
      rotation.transitionDurationMs +
      "ms ease-in-out";
  }

  const kenBurnsClass =
    rotation.effect === "kenBurns" ? " " + styles.kenBurnsActive : "";

  return React.createElement(
    "div",
    {
      className: styles.transitionContainer,
      ...containerProps,
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": "Hero carousel",
    },
    // Active slide
    React.createElement(
      "div",
      {
        key: currentTile.id + "-" + currentIndex,
        className: styles.heroGrid + kenBurnsClass,
        style: { ...gridStyle, ...transitionStyle },
        role: "tabpanel",
        "aria-roledescription": "slide",
        "aria-label": "Slide " + (currentIndex + 1) + " of " + tiles.length,
      },
      React.createElement(HyperHeroTile, {
        tile: currentTile,
        onCtaClick: onCtaClick,
      })
    ),
    // Prev/Next arrows
    rotation.showArrows
      ? React.createElement(
          React.Fragment,
          undefined,
          React.createElement(
            "button",
            {
              className: styles.arrowButton + " " + styles.arrowLeft,
              onClick: handlePrev,
              "aria-label": "Previous slide",
              type: "button",
            },
            "\u2039"
          ),
          React.createElement(
            "button",
            {
              className: styles.arrowButton + " " + styles.arrowRight,
              onClick: handleNext,
              "aria-label": "Next slide",
              type: "button",
            },
            "\u203A"
          )
        )
      : undefined,
    // Navigation dots
    rotation.showDots
      ? React.createElement(
          "div",
          { className: styles.rotationDots, role: "tablist", "aria-label": "Slide navigation" },
          tiles.map((tile, idx) =>
            React.createElement("button", {
              key: tile.id,
              className:
                styles.dot + (idx === currentIndex ? " " + styles.dotActive : ""),
              onClick: () => setActiveSlide(idx),
              role: "tab",
              "aria-selected": idx === currentIndex ? "true" : "false",
              "aria-label": "Go to slide " + (idx + 1),
              type: "button",
            })
          )
        )
      : undefined
  );
};

export const HyperHeroTransitionWrapper = React.memo(HyperHeroTransitionWrapperInner);
