import * as React from "react";
import styles from "./SliderProgress.module.scss";
import type { ISliderProgressConfig } from "../../models";
import { useHyperSliderStore } from "../../store/useHyperSliderStore";

export interface ISliderProgressProps {
  config: ISliderProgressConfig;
  slideDuration: number;
}

const SliderProgress: React.FC<ISliderProgressProps> = function (props) {
  const currentSlideIndex = useHyperSliderStore(function (s) { return s.currentSlideIndex; });
  const isPaused = useHyperSliderStore(function (s) { return s.isPaused; });

  const [progress, setProgress] = React.useState<number>(0);
  const rafRef = React.useRef<number>(0);
  const startTimeRef = React.useRef<number | undefined>(undefined);

  React.useEffect(function () {
    // Reset progress on slide change
    setProgress(0);
    startTimeRef.current = undefined;

    if (isPaused || props.slideDuration <= 0) {
      return;
    }

    const animate = function (timestamp: number): void {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - (startTimeRef.current as number);
      const pct = Math.min((elapsed / props.slideDuration) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return function (): void {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [currentSlideIndex, isPaused, props.slideDuration]);

  const positionClass = (styles as Record<string, string>)[
    "position" + props.config.position.charAt(0).toUpperCase() + props.config.position.substring(1)
  ] || "";

  const containerClass = [
    styles.progress,
    positionClass,
  ].join(" ").trim();

  const containerStyle: React.CSSProperties = {
    height: props.config.height + "px",
    backgroundColor: props.config.backgroundColor,
  };

  const barStyle: React.CSSProperties = {
    width: progress + "%",
    backgroundColor: props.config.color,
    height: "100%",
  };

  return React.createElement(
    "div",
    {
      className: containerClass,
      style: containerStyle,
      role: "progressbar",
      "aria-valuenow": Math.round(progress),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
    },
    React.createElement("div", {
      className: styles.bar,
      style: barStyle,
    })
  );
};

export default SliderProgress;
