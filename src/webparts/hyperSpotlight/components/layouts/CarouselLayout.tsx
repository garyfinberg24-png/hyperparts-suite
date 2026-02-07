import * as React from "react";
import type { IHyperSpotlightEmployee } from "../../models";
import type { ICarouselSettings } from "../../models";
import { DEFAULT_CAROUSEL_SETTINGS } from "../../models";
import type { IHyperSpotlightCardProps } from "../HyperSpotlightCard";
import HyperSpotlightCard from "../HyperSpotlightCard";
import styles from "./CarouselLayout.module.scss";

export interface ICarouselLayoutProps extends Omit<IHyperSpotlightCardProps, "employee"> {
  employees: IHyperSpotlightEmployee[];
  carouselSettings?: ICarouselSettings;
}

const CarouselLayout: React.FC<ICarouselLayoutProps> = function (props) {
  const settings = props.carouselSettings || DEFAULT_CAROUSEL_SETTINGS;
  const cardsVisible = typeof settings.cardsVisible === "number" ? settings.cardsVisible : 3;

  const currentIndexRef = React.useRef(0);
  const isHoveredRef = React.useRef(false);
  // eslint-disable-next-line @rushstack/no-new-null
  const timerRef = React.useRef<number | undefined>(undefined);
  const forceUpdate = React.useState(0)[1];

  const maxIndex = Math.max(0, props.employees.length - cardsVisible);

  const goTo = React.useCallback(function (index: number): void {
    currentIndexRef.current = index;
    forceUpdate(function (n) { return n + 1; });
  }, [forceUpdate]);

  const handleNext = React.useCallback(function (): void {
    const cur = currentIndexRef.current;
    const max = Math.max(0, props.employees.length - cardsVisible);
    if (cur < max) {
      goTo(cur + 1);
    } else if (settings.infiniteLoop) {
      goTo(0);
    }
  }, [props.employees.length, cardsVisible, settings.infiniteLoop, goTo]);

  const handlePrevious = React.useCallback(function (): void {
    const cur = currentIndexRef.current;
    const max = Math.max(0, props.employees.length - cardsVisible);
    if (cur > 0) {
      goTo(cur - 1);
    } else if (settings.infiniteLoop) {
      goTo(max);
    }
  }, [props.employees.length, cardsVisible, settings.infiniteLoop, goTo]);

  // Auto-advance effect
  React.useEffect(function () {
    if (!settings.autoAdvance) return undefined;
    const interval = (settings.autoAdvanceInterval || 5) * 1000;
    timerRef.current = window.setInterval(function () {
      if (!isHoveredRef.current || !settings.pauseOnHover) {
        handleNext();
      }
    }, interval);
    return function () {
      if (timerRef.current !== undefined) {
        clearInterval(timerRef.current);
      }
    };
  }, [settings.autoAdvance, settings.autoAdvanceInterval, settings.pauseOnHover, handleNext]);

  const handleMouseEnter = React.useCallback(function (): void {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = React.useCallback(function (): void {
    isHoveredRef.current = false;
  }, []);

  const currentIndex = currentIndexRef.current;
  const translateX = -(currentIndex * (100 / cardsVisible));
  const trackStyle: React.CSSProperties = {
    transform: "translateX(" + translateX + "%)",
    "--cards-visible": cardsVisible,
  } as React.CSSProperties;

  // Build slides
  const slides = props.employees.map(function (employee, index) {
    return React.createElement(
      "div",
      { key: employee.id || index, className: styles.carouselSlide },
      React.createElement(HyperSpotlightCard, {
        employee: employee,
        cardStyle: props.cardStyle,
        animationEntrance: props.animationEntrance,
        showProfilePicture: props.showProfilePicture,
        showEmployeeName: props.showEmployeeName,
        showJobTitle: props.showJobTitle,
        showDepartment: props.showDepartment,
        showCategoryBadge: props.showCategoryBadge,
        showCustomMessage: props.showCustomMessage,
        customMessage: props.customMessage,
        messagePosition: props.messagePosition,
        showActionButtons: props.showActionButtons,
        enableEmailButton: props.enableEmailButton,
        enableTeamsButton: props.enableTeamsButton,
        enableProfileButton: props.enableProfileButton,
        selectedAttributes: props.selectedAttributes,
        attributeLabels: props.attributeLabels,
        showAttributeLabels: props.showAttributeLabels,
        showAttributeIcons: props.showAttributeIcons,
        useCategoryThemes: props.useCategoryThemes,
        styleSettings: props.styleSettings,
        lazyLoadImages: props.lazyLoadImages,
      })
    );
  });

  // Build children
  const children: React.ReactNode[] = [];

  // Previous button
  if (settings.showNavigation && currentIndex > 0) {
    children.push(React.createElement("button", {
      key: "nav-prev",
      className: styles.navButton + " " + styles.navPrevious,
      onClick: handlePrevious,
      "aria-label": "Previous",
    }, "\u2039"));
  }

  // Track
  children.push(React.createElement("div", { key: "track", className: styles.carouselTrack, style: trackStyle }, slides));

  // Next button
  if (settings.showNavigation && currentIndex < maxIndex) {
    children.push(React.createElement("button", {
      key: "nav-next",
      className: styles.navButton + " " + styles.navNext,
      onClick: handleNext,
      "aria-label": "Next",
    }, "\u203A"));
  }

  // Pagination dots
  if (settings.showPagination && maxIndex > 0) {
    const dots: React.ReactElement[] = [];
    let i = 0;
    while (i <= maxIndex) {
      (function (dotIndex: number) {
        dots.push(React.createElement("button", {
          key: dotIndex,
          className: styles.dot + (dotIndex === currentIndex ? " " + styles.dotActive : ""),
          onClick: function () { goTo(dotIndex); },
          "aria-label": "Go to slide " + (dotIndex + 1),
        }));
      })(i);
      i++;
    }
    children.push(React.createElement("div", { key: "pagination", className: styles.pagination }, dots));
  }

  return React.createElement(
    "div",
    {
      className: styles.carouselContainer,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      role: "region",
      "aria-label": "Employee spotlight carousel",
      "aria-roledescription": "carousel",
    },
    children
  );
};

export default CarouselLayout;
