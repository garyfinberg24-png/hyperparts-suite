import * as React from "react";
import type { ILinksLayoutProps } from "./index";
import { HyperLinksLinkItem } from "../HyperLinksLinkItem";
import { useFilmstripScroll } from "../../hooks/useFilmstripScroll";
import styles from "./FilmstripLayout.module.scss";

const TILE_SIZE_WIDTH: Record<string, number> = {
  small: 140,
  medium: 200,
  large: 280,
};

export const FilmstripLayout: React.FC<ILinksLayoutProps> = function (props) {
  const scroll = useFilmstripScroll();
  const cardWidth = TILE_SIZE_WIDTH[props.tileSize] || 200;

  return React.createElement(
    "div",
    {
      className: styles.filmstrip,
      "aria-roledescription": "Filmstrip",
    },
    // Left arrow
    React.createElement(
      "button",
      {
        className: styles.arrowButton + " " + styles.arrowLeft,
        onClick: scroll.scrollLeft,
        disabled: !scroll.canScrollLeft,
        "aria-label": "Scroll left",
      },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--ChevronLeft",
        "aria-hidden": "true",
      })
    ),
    // Scrollable container
    React.createElement(
      "div",
      {
        className: styles.scrollContainer,
        ref: scroll.containerRef,
        role: "list",
      },
      props.links.map(function (link) {
        return React.createElement(
          "div",
          {
            key: link.id,
            className: styles.filmstripCard,
            style: { minWidth: cardWidth + "px" },
            role: "listitem",
          },
          React.createElement(HyperLinksLinkItem, {
            link: link,
            showIcon: props.showIcons,
            showDescription: props.showDescriptions,
            showThumbnail: false,
            iconSize: props.iconSize,
            hoverEffect: props.hoverEffect,
            borderRadius: props.borderRadius,
            enableColorCustomization: props.enableColorCustomization,
            onLinkClick: props.onLinkClick,
            className: styles.filmstripItem,
          })
        );
      })
    ),
    // Right arrow
    React.createElement(
      "button",
      {
        className: styles.arrowButton + " " + styles.arrowRight,
        onClick: scroll.scrollRight,
        disabled: !scroll.canScrollRight,
        "aria-label": "Scroll right",
      },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--ChevronRight",
        "aria-hidden": "true",
      })
    )
  );
};
