import * as React from "react";
import * as strings from "HyperSliderWebPartStrings";
import styles from "./SliderArrows.module.scss";
import type { ISliderArrowsConfig } from "../../models";
import { useHyperSliderStore } from "../../store/useHyperSliderStore";

export interface ISliderArrowsProps {
  config: ISliderArrowsConfig;
  slideCount: number;
}

const SliderArrows: React.FC<ISliderArrowsProps> = function (props) {
  const goToPrev = useHyperSliderStore(function (s) { return s.goToPrev; });
  const goToNext = useHyperSliderStore(function (s) { return s.goToNext; });

  const handlePrev = React.useCallback(function (): void {
    goToPrev(props.slideCount);
  }, [goToPrev, props.slideCount]);

  const handleNext = React.useCallback(function (): void {
    goToNext(props.slideCount);
  }, [goToNext, props.slideCount]);

  const styleClass = (styles as Record<string, string>)[props.config.style] || "";

  const arrowStyle: React.CSSProperties = {
    width: props.config.size + "px",
    height: props.config.size + "px",
    backgroundColor: props.config.backgroundColor,
    color: props.config.iconColor,
    fontSize: Math.round(props.config.size * 0.4) + "px",
  };

  const containerClass = [
    styles.arrows,
    props.config.position === "outside"
      ? styles.positionOutside
      : "",
  ].join(" ").trim();

  const prevClass = [
    styles.arrow,
    styles.arrowPrev,
    styleClass,
  ].join(" ").trim();

  const nextClass = [
    styles.arrow,
    styles.arrowNext,
    styleClass,
  ].join(" ").trim();

  return React.createElement(
    "div",
    { className: containerClass },
    React.createElement(
      "button",
      {
        className: prevClass,
        style: arrowStyle,
        onClick: handlePrev,
        "aria-label": strings.PreviousSlideLabel,
        type: "button",
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--ChevronLeft" })
    ),
    React.createElement(
      "button",
      {
        className: nextClass,
        style: arrowStyle,
        onClick: handleNext,
        "aria-label": strings.NextSlideLabel,
        type: "button",
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--ChevronRight" })
    )
  );
};

export default SliderArrows;
