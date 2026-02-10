import * as React from "react";
import type { IHyperRollupItem } from "../../models";
import type { ICarouselLayoutProps } from "./ILayoutProps";
import { flattenGroups } from "./ILayoutProps";
import styles from "./CarouselLayout.module.scss";

const CarouselLayoutInner: React.FC<ICarouselLayoutProps> = function (props) {
  var allItems = flattenGroups(props.groups);
  var currentIndex = React.useState(0);
  var index = currentIndex[0];
  var setIndex = currentIndex[1];

  // eslint-disable-next-line @rushstack/no-new-null
  var timerRef = React.useRef<number>(0);
  var isPausedRef = React.useRef<boolean>(false);

  var itemCount = allItems.length;

  // Auto-play
  React.useEffect(function () {
    if (!props.autoPlay || itemCount <= 1) return undefined;

    function tick(): void {
      if (!isPausedRef.current) {
        setIndex(function (prev) { return (prev + 1) % itemCount; });
      }
    }

    timerRef.current = window.setInterval(tick, props.autoPlayInterval || 5000);
    return function () { window.clearInterval(timerRef.current); };
  }, [props.autoPlay, props.autoPlayInterval, itemCount]); // eslint-disable-line react-hooks/exhaustive-deps

  var handlePrev = React.useCallback(function (): void {
    setIndex(function (prev) { return prev <= 0 ? itemCount - 1 : prev - 1; });
  }, [itemCount]);

  var handleNext = React.useCallback(function (): void {
    setIndex(function (prev) { return (prev + 1) % itemCount; });
  }, [itemCount]);

  var handleDotClick = React.useCallback(function (i: number): void {
    setIndex(i);
  }, []);

  var handleMouseEnter = React.useCallback(function (): void {
    isPausedRef.current = true;
  }, []);

  var handleMouseLeave = React.useCallback(function (): void {
    isPausedRef.current = false;
  }, []);

  if (itemCount === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  var currentItem: IHyperRollupItem = allItems[index] || allItems[0];
  var modifiedDate = currentItem.modified
    ? new Date(currentItem.modified).toLocaleDateString()
    : "";

  // Slide content
  var slideElement = React.createElement(
    "div",
    { className: styles.carouselSlide },
    // Thumbnail area
    React.createElement(
      "div",
      { className: styles.carouselThumb },
      React.createElement("i", {
        className: "ms-Icon ms-Icon--Page",
        "aria-hidden": "true",
        style: { fontSize: "40px" },
      })
    ),
    // Content area
    React.createElement(
      "div",
      { className: styles.carouselContent },
      React.createElement("h3", { className: styles.carouselTitle }, currentItem.title),
      currentItem.description
        ? React.createElement(
            "p",
            { className: styles.carouselDesc },
            currentItem.description.length > 200
              ? currentItem.description.substring(0, 200) + "..."
              : currentItem.description
          )
        : undefined,
      React.createElement(
        "div",
        { className: styles.carouselMeta },
        currentItem.author
          ? React.createElement("span", undefined, currentItem.author)
          : undefined,
        modifiedDate
          ? React.createElement("span", undefined, modifiedDate)
          : undefined,
        React.createElement("span", undefined, currentItem.sourceListName || currentItem.sourceSiteName),
        currentItem.fileType
          ? React.createElement("span", { className: styles.metaBadge }, currentItem.fileType.toUpperCase())
          : undefined
      )
    )
  );

  // Dots
  var dotElements: React.ReactElement[] = [];
  allItems.forEach(function (_item: IHyperRollupItem, i: number) {
    dotElements.push(
      React.createElement("button", {
        key: i,
        className: styles.carouselDot + (i === index ? " " + styles.activeDot : ""),
        onClick: function () { handleDotClick(i); },
        "aria-label": "Go to slide " + String(i + 1),
      })
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.carouselContainer,
      role: "region",
      "aria-label": "Carousel view",
      "aria-roledescription": "carousel",
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    // Left arrow
    itemCount > 1
      ? React.createElement(
          "button",
          {
            className: styles.carouselArrow + " " + styles.arrowLeft,
            onClick: handlePrev,
            "aria-label": "Previous slide",
          },
          React.createElement("i", { className: "ms-Icon ms-Icon--ChevronLeft", "aria-hidden": "true" })
        )
      : undefined,
    // Slide
    slideElement,
    // Right arrow
    itemCount > 1
      ? React.createElement(
          "button",
          {
            className: styles.carouselArrow + " " + styles.arrowRight,
            onClick: handleNext,
            "aria-label": "Next slide",
          },
          React.createElement("i", { className: "ms-Icon ms-Icon--ChevronRight", "aria-hidden": "true" })
        )
      : undefined,
    // Dots
    itemCount > 1
      ? React.createElement("div", { className: styles.carouselDots, role: "tablist" }, dotElements)
      : undefined,
    // Auto-play indicator
    props.autoPlay
      ? React.createElement(
          "div",
          { className: styles.autoPlayIndicator },
          React.createElement("i", { className: "ms-Icon ms-Icon--Play", "aria-hidden": "true", style: { fontSize: "10px" } }),
          " Auto-play: " + String(Math.round((props.autoPlayInterval || 5000) / 1000)) + "s"
        )
      : undefined
  );
};

export const CarouselLayout = React.memo(CarouselLayoutInner);
