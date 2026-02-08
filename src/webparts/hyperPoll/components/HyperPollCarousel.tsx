import * as React from "react";
import { useHyperPollStore } from "../store/useHyperPollStore";
import styles from "./HyperPollCarousel.module.scss";

export interface IHyperPollCarouselProps {
  totalPolls: number;
  children?: React.ReactNode;
}

const HyperPollCarousel: React.FC<IHyperPollCarouselProps> = function (props) {
  const store = useHyperPollStore();

  const handlePrev = function (): void {
    store.prevPoll();
  };

  const handleNext = function (): void {
    store.nextPoll(props.totalPolls);
  };

  const handleKeyDown = function (e: React.KeyboardEvent): void {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Build dot indicators
  const dots: React.ReactElement[] = [];
  for (let i = 0; i < props.totalPolls; i++) {
    const dotIdx = i;
    const dotClass = styles.carouselDot
      + (store.activePollIndex === dotIdx ? " " + styles.carouselDotActive : "");

    dots.push(
      React.createElement("button", {
        key: dotIdx,
        type: "button",
        className: dotClass,
        "aria-label": "Go to poll " + (dotIdx + 1),
        onClick: function () { store.setActivePollIndex(dotIdx); },
      })
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.carousel,
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": "Poll carousel, showing poll " + (store.activePollIndex + 1) + " of " + props.totalPolls,
      onKeyDown: handleKeyDown,
    },
    React.createElement(
      "div",
      { className: styles.carouselContent, "aria-live": "polite" },
      props.children
    ),
    props.totalPolls > 1
      ? React.createElement(
          "div",
          { className: styles.carouselNav },
          React.createElement(
            "button",
            {
              type: "button",
              className: styles.carouselButton,
              disabled: store.activePollIndex === 0,
              "aria-label": "Previous poll",
              onClick: handlePrev,
            },
            "\u25C0"
          ),
          React.createElement("div", { className: styles.carouselDots }, dots),
          React.createElement(
            "button",
            {
              type: "button",
              className: styles.carouselButton,
              disabled: store.activePollIndex === props.totalPolls - 1,
              "aria-label": "Next poll",
              onClick: handleNext,
            },
            "\u25B6"
          )
        )
      : undefined
  );
};

export default HyperPollCarousel;
