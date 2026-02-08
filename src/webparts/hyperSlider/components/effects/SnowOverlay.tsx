import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./SnowOverlay.module.scss");

export interface ISnowOverlayProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
}

interface ISnowflakeInstance {
  id: string;
  left: number;
  size: number;
  animationDelay: number;
  animationDuration: number;
  opacity: number;
}

const DEFAULT_COUNT = 50;
const DEFAULT_MIN_SIZE = 2;
const DEFAULT_MAX_SIZE = 6;
const MIN_DURATION = 5;
const MAX_DURATION = 15;

const SnowOverlay: React.FC<ISnowOverlayProps> = function (props) {
  const count = props.count !== undefined ? props.count : DEFAULT_COUNT;
  const minSize = props.minSize !== undefined ? props.minSize : DEFAULT_MIN_SIZE;
  const maxSize = props.maxSize !== undefined ? props.maxSize : DEFAULT_MAX_SIZE;

  const snowflakes = React.useMemo(function (): ISnowflakeInstance[] {
    const flakes: ISnowflakeInstance[] = [];

    for (let i = 0; i < count; i++) {
      const size = minSize + Math.random() * (maxSize - minSize);
      const durationSeconds = MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION);
      const delaySeconds = Math.random() * MAX_DURATION;
      const opacity = 0.4 + Math.random() * 0.6;

      flakes.push({
        id: "snow-" + i,
        left: Math.random() * 100,
        size: size,
        animationDelay: delaySeconds,
        animationDuration: durationSeconds,
        opacity: opacity,
      });
    }

    return flakes;
  }, [count, minSize, maxSize]);

  const snowflakeElements: React.ReactElement[] = [];

  snowflakes.forEach(function (flake) {
    const flakeStyle: React.CSSProperties = {
      left: flake.left + "%",
      width: flake.size + "px",
      height: flake.size + "px",
      opacity: flake.opacity,
      animationName: "snowfall",
      animationDelay: flake.animationDelay + "s",
      animationDuration: flake.animationDuration + "s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
    };

    snowflakeElements.push(
      React.createElement("div", {
        key: flake.id,
        className: styles.snowflake,
        style: flakeStyle,
      })
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.snowOverlay,
      "aria-hidden": "true",
    },
    snowflakeElements
  );
};

export default SnowOverlay;
