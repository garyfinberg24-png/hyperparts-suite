import * as React from "react";
import * as strings from "HyperSliderWebPartStrings";
import styles from "./SliderBullets.module.scss";
import type { ISliderBulletsConfig } from "../../models";
import { useHyperSliderStore } from "../../store/useHyperSliderStore";

export interface ISliderBulletsProps {
  config: ISliderBulletsConfig;
  slideCount: number;
}

const SliderBullets: React.FC<ISliderBulletsProps> = function (props) {
  const currentSlideIndex = useHyperSliderStore(function (s) { return s.currentSlideIndex; });
  const setCurrentSlide = useHyperSliderStore(function (s) { return s.setCurrentSlide; });

  const handleClick = React.useCallback(function (index: number): void {
    setCurrentSlide(index);
  }, [setCurrentSlide]);

  const positionClass = (styles as Record<string, string>)[
    "position" + props.config.position.charAt(0).toUpperCase() + props.config.position.substring(1)
  ] || "";

  const styleClass = (styles as Record<string, string>)[props.config.style] || "";

  const containerStyle: React.CSSProperties = {
    gap: props.config.spacing + "px",
  };

  const containerClass = [
    styles.bullets,
    positionClass,
  ].join(" ").trim();

  const bulletElements: React.ReactNode[] = [];

  for (let i = 0; i < props.slideCount; i++) {
    const isActive = i === currentSlideIndex;

    const bulletClass = [
      styles.bullet,
      styleClass,
      isActive ? styles.bulletActive : "",
    ].join(" ").trim();

    const bulletStyle: React.CSSProperties = {
      width: props.config.size + "px",
      height: props.config.style === "dash"
        ? "4px"
        : props.config.size + "px",
      backgroundColor: isActive
        ? props.config.activeColor
        : props.config.inactiveColor,
    };

    const idx = i;
    bulletElements.push(
      React.createElement(
        "button",
        {
          key: i,
          className: bulletClass,
          style: bulletStyle,
          role: "tab",
          "aria-selected": isActive,
          "aria-label": strings.GoToSlideLabel + " " + (i + 1),
          type: "button",
          onClick: function (): void { handleClick(idx); },
        },
        props.config.style === "numbered"
          ? String(i + 1)
          : undefined
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: containerClass,
      style: containerStyle,
      role: "tablist",
      "aria-label": strings.SlideNavigationLabel,
    },
    bulletElements
  );
};

export default SliderBullets;
