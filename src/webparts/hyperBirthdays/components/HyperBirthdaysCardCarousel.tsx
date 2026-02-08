import * as React from "react";
import type { ICelebration } from "../models";
import HyperBirthdaysCard from "./HyperBirthdaysCard";
import styles from "./HyperBirthdaysCardCarousel.module.scss";

export interface IHyperBirthdaysCardCarouselProps {
  celebrations: ICelebration[];
  photoMap: Record<string, string>;
  photoSize: number;
  enableTeamsDeepLink: boolean;
  enableMilestoneBadges: boolean;
  sendWishesLabel: string;
  onSelectCelebration: (id: string) => void;
}

const SCROLL_AMOUNT = 300;

const HyperBirthdaysCardCarousel: React.FC<IHyperBirthdaysCardCarouselProps> = function (props) {
  // eslint-disable-next-line @rushstack/no-new-null
  const trackRef = React.useRef<HTMLDivElement>(null);

  const handlePrev = React.useCallback(function (): void {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
    }
  }, []);

  const handleNext = React.useCallback(function (): void {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
    }
  }, []);

  const cardElements: React.ReactNode[] = [];
  props.celebrations.forEach(function (c) {
    cardElements.push(
      React.createElement(
        "div",
        { key: c.id, className: styles.carouselItem },
        React.createElement(HyperBirthdaysCard, {
          celebration: c,
          photoUrl: props.photoMap[c.userId] || "",
          photoSize: props.photoSize,
          enableTeamsDeepLink: props.enableTeamsDeepLink,
          enableMilestoneBadges: props.enableMilestoneBadges,
          sendWishesLabel: props.sendWishesLabel,
          onClick: function (): void { props.onSelectCelebration(c.id); },
        })
      )
    );
  });

  const showNav = props.celebrations.length > 3;

  return React.createElement(
    "div",
    { className: styles.carouselContainer },
    showNav
      ? React.createElement(
          "button",
          {
            className: styles.navButton + " " + styles.navPrev,
            onClick: handlePrev,
            type: "button",
            "aria-label": "Previous",
          },
          React.createElement("i", { className: "ms-Icon ms-Icon--ChevronLeft", "aria-hidden": "true" })
        )
      : undefined,
    React.createElement(
      "div",
      {
        className: styles.carouselTrack,
        ref: trackRef,
        role: "list",
        "aria-label": "Celebrations carousel",
      },
      cardElements
    ),
    showNav
      ? React.createElement(
          "button",
          {
            className: styles.navButton + " " + styles.navNext,
            onClick: handleNext,
            type: "button",
            "aria-label": "Next",
          },
          React.createElement("i", { className: "ms-Icon ms-Icon--ChevronRight", "aria-hidden": "true" })
        )
      : undefined
  );
};

export default HyperBirthdaysCardCarousel;
