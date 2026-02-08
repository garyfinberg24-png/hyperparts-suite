import * as React from "react";
import styles from "./SliderCount.module.scss";
import type { ISliderCountConfig } from "../../models";
import { useHyperSliderStore } from "../../store/useHyperSliderStore";

export interface ISliderCountProps {
  config: ISliderCountConfig;
  slideCount: number;
}

const SliderCount: React.FC<ISliderCountProps> = function (props) {
  const currentSlideIndex = useHyperSliderStore(function (s) { return s.currentSlideIndex; });

  const currentDisplay = String(currentSlideIndex + 1);
  const totalDisplay = String(props.slideCount);

  const formatted = props.config.format
    .replace("{current}", currentDisplay)
    .replace("{total}", totalDisplay);

  const positionClass = (styles as Record<string, string>)[props.config.position] || "";

  const containerClass = [
    styles.count,
    positionClass,
  ].join(" ").trim();

  const containerStyle: React.CSSProperties = {
    color: props.config.color,
    fontSize: props.config.fontSize + "px",
  };

  return React.createElement(
    "div",
    {
      className: containerClass,
      style: containerStyle,
      "aria-live": "polite",
      "aria-atomic": true,
    },
    formatted
  );
};

export default SliderCount;
