import * as React from "react";
import * as strings from "HyperSliderWebPartStrings";
import styles from "./SliderTabs.module.scss";
import type { ISliderTabsConfig } from "../../models";
import { useHyperSliderStore } from "../../store/useHyperSliderStore";

export interface ISliderTabsProps {
  config: ISliderTabsConfig;
  slideCount: number;
}

const SliderTabs: React.FC<ISliderTabsProps> = function (props) {
  const currentSlideIndex = useHyperSliderStore(function (s) { return s.currentSlideIndex; });
  const setCurrentSlide = useHyperSliderStore(function (s) { return s.setCurrentSlide; });

  const handleClick = React.useCallback(function (index: number): void {
    setCurrentSlide(index);
  }, [setCurrentSlide]);

  const positionClass = (styles as Record<string, string>)[
    "position" + props.config.position.charAt(0).toUpperCase() + props.config.position.substring(1)
  ] || "";

  const containerClass = [
    styles.tabs,
    positionClass,
  ].join(" ").trim();

  const tabElements: React.ReactNode[] = [];

  for (let i = 0; i < props.slideCount; i++) {
    const isActive = i === currentSlideIndex;
    const label = props.config.labels && props.config.labels.length > i
      ? props.config.labels[i]
      : strings.SlideLabel + " " + (i + 1);

    const tabClass = [
      styles.tab,
      isActive ? styles.tabActive : "",
    ].join(" ").trim();

    const idx = i;
    tabElements.push(
      React.createElement(
        "button",
        {
          key: i,
          className: tabClass,
          role: "tab",
          "aria-selected": isActive,
          "aria-label": label,
          type: "button",
          onClick: function (): void { handleClick(idx); },
        },
        label
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: containerClass,
      role: "tablist",
      "aria-label": strings.SlideNavigationLabel,
    },
    tabElements
  );
};

export default SliderTabs;
