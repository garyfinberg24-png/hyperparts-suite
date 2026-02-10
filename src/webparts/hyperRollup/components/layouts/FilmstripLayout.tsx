import * as React from "react";
import type { IHyperRollupItem } from "../../models";
import type { IFilmstripLayoutProps } from "./ILayoutProps";
import { flattenGroups } from "./ILayoutProps";
import { HyperRollupItemCard } from "../HyperRollupItemCard";
import styles from "./FilmstripLayout.module.scss";

const FilmstripLayoutInner: React.FC<IFilmstripLayoutProps> = function (props) {
  var allItems = flattenGroups(props.groups);
  // eslint-disable-next-line @rushstack/no-new-null
  var trackRef = React.useRef<HTMLDivElement>(null);

  var scrollBy = React.useCallback(function (direction: number): void {
    var track = trackRef.current;
    if (!track) return;
    var scrollAmount = track.clientWidth * 0.7;
    track.scrollBy({ left: direction * scrollAmount, behavior: "smooth" as ScrollBehavior });
  }, []);

  var handlePrev = React.useCallback(function (): void {
    scrollBy(-1);
  }, [scrollBy]);

  var handleNext = React.useCallback(function (): void {
    scrollBy(1);
  }, [scrollBy]);

  if (allItems.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  var cardElements: React.ReactElement[] = [];
  allItems.forEach(function (item: IHyperRollupItem) {
    cardElements.push(
      React.createElement(
        "div",
        { key: item.id, className: styles.filmstripCard },
        React.createElement(HyperRollupItemCard, {
          item: item,
          isSelected: props.selectedItemId === item.id,
          onSelect: props.onSelectItem,
          onPreview: props.onPreviewItem,
        })
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.filmstripContainer,
      role: "region",
      "aria-label": "Filmstrip view",
    },
    // Left arrow
    React.createElement(
      "button",
      {
        className: styles.filmstripArrow + " " + styles.arrowLeft,
        onClick: handlePrev,
        "aria-label": "Scroll left",
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--ChevronLeft", "aria-hidden": "true" })
    ),
    // Track
    React.createElement(
      "div",
      { ref: trackRef, className: styles.filmstripTrack },
      cardElements
    ),
    // Right arrow
    React.createElement(
      "button",
      {
        className: styles.filmstripArrow + " " + styles.arrowRight,
        onClick: handleNext,
        "aria-label": "Scroll right",
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--ChevronRight", "aria-hidden": "true" })
    )
  );
};

export const FilmstripLayout = React.memo(FilmstripLayoutInner);
