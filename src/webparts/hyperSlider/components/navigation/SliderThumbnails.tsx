import * as React from "react";
import * as strings from "HyperSliderWebPartStrings";
import styles from "./SliderThumbnails.module.scss";
import type { ISliderThumbnailsConfig, ISliderSlide } from "../../models";
import { useHyperSliderStore } from "../../store/useHyperSliderStore";
import { getSlideThumbnailUrl } from "../../utils/layerUtils";

export interface ISliderThumbnailsProps {
  config: ISliderThumbnailsConfig;
  slides: ISliderSlide[];
}

const SliderThumbnails: React.FC<ISliderThumbnailsProps> = function (props) {
  const currentSlideIndex = useHyperSliderStore(function (s) { return s.currentSlideIndex; });
  const setCurrentSlide = useHyperSliderStore(function (s) { return s.setCurrentSlide; });

  const handleClick = React.useCallback(function (index: number): void {
    setCurrentSlide(index);
  }, [setCurrentSlide]);

  const positionClass = (styles as Record<string, string>)[
    "position" + props.config.position.charAt(0).toUpperCase() + props.config.position.substring(1)
  ] || "";

  const containerClass = [
    styles.thumbnails,
    positionClass,
  ].join(" ").trim();

  const containerStyle: React.CSSProperties = {
    gap: props.config.gap + "px",
  };

  const thumbnailElements: React.ReactNode[] = [];

  props.slides.forEach(function (slide, i) {
    const isActive = i === currentSlideIndex;
    const thumbnailUrl = getSlideThumbnailUrl(slide);

    const thumbClass = [
      styles.thumbnail,
      isActive ? styles.thumbnailActive : "",
    ].join(" ").trim();

    const thumbStyle: React.CSSProperties = {
      width: props.config.width + "px",
      height: props.config.height + "px",
      opacity: isActive
        ? props.config.activeOpacity
        : props.config.inactiveOpacity,
    };

    const idx = i;
    thumbnailElements.push(
      React.createElement(
        "button",
        {
          key: slide.id,
          className: thumbClass,
          style: thumbStyle,
          type: "button",
          "aria-label": strings.GoToSlideLabel + " " + (i + 1),
          onClick: function (): void { handleClick(idx); },
        },
        thumbnailUrl
          ? React.createElement("img", {
              src: thumbnailUrl,
              alt: slide.title || strings.SlideLabel + " " + (i + 1),
            })
          : React.createElement(
              "div",
              {
                style: {
                  width: "100%",
                  height: "100%",
                  backgroundColor: slide.background.backgroundColor || "#cccccc",
                },
              }
            )
      )
    );
  });

  return React.createElement(
    "div",
    {
      className: containerClass,
      style: containerStyle,
      role: "tablist",
      "aria-label": strings.SlideNavigationLabel,
    },
    thumbnailElements
  );
};

export default SliderThumbnails;
