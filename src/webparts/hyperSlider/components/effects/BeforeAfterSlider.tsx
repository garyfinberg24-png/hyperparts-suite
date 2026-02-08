import * as React from "react";
import type { ISliderBeforeAfter } from "../../models";
import { useBeforeAfter } from "../../hooks/useBeforeAfter";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require("./BeforeAfterSlider.module.scss");

export interface IBeforeAfterSliderProps {
  config: ISliderBeforeAfter;
}

const BeforeAfterSlider: React.FC<IBeforeAfterSliderProps> = function (props) {
  const { config } = props;

  // eslint-disable-next-line @rushstack/no-new-null
  const containerRef = React.useRef<HTMLDivElement>(null);

  const {
    position,
    handleRef,
    handleMouseDown,
    handleTouchStart,
  } = useBeforeAfter({
    config: config,
    containerRef: containerRef,
  });

  const isHorizontal = config.orientation === "horizontal";

  // Build clip-path for the "after" image based on orientation and handle position
  const afterClipPath = isHorizontal
    ? "inset(0 0 0 " + position + "%)"
    : "inset(" + position + "% 0 0 0)";

  // Handle positioning
  const handleStyle: React.CSSProperties = isHorizontal
    ? { left: position + "%", transform: "translateX(-50%)" }
    : {
        top: position + "%",
        transform: "translateY(-50%)",
        left: 0,
        width: "100%",
        height: "auto",
        flexDirection: "row" as const,
      };

  // Handle bar styles
  const handleBarStyle: React.CSSProperties = isHorizontal
    ? {
        width: "4px",
        height: "100%",
        backgroundColor: config.handleColor,
      }
    : {
        width: "100%",
        height: "4px",
        backgroundColor: config.handleColor,
      };

  // Handle grip styles
  const handleGripStyle: React.CSSProperties = {
    width: config.handleSize + "px",
    height: config.handleSize + "px",
    backgroundColor: config.handleColor,
  };

  // Before image element
  const beforeImageEl = React.createElement(
    "div",
    { className: styles.beforeImage },
    React.createElement("img", {
      src: config.beforeImageUrl,
      alt: config.beforeLabel || "Before",
      draggable: false,
    })
  );

  // After image element with clip-path reveal
  const afterImageEl = React.createElement(
    "div",
    {
      className: styles.afterImage,
      style: { clipPath: afterClipPath },
    },
    React.createElement("img", {
      src: config.afterImageUrl,
      alt: config.afterLabel || "After",
      draggable: false,
    })
  );

  // Handle grip icon — left/right arrows for horizontal, up/down for vertical
  const gripIconClass = isHorizontal ? "ms-Icon ms-Icon--GripperBarHorizontal" : "ms-Icon ms-Icon--GripperBarVertical";

  // Handle element
  const handleEl = React.createElement(
    "div",
    {
      ref: handleRef,
      className: styles.handle,
      style: handleStyle,
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      role: "slider",
      "aria-label": "Before/After comparison slider",
      "aria-valuenow": Math.round(position),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      tabIndex: 0,
    },
    React.createElement("div", {
      className: styles.handleBar,
      style: handleBarStyle,
    }),
    React.createElement(
      "div",
      {
        className: styles.handleGrip,
        style: handleGripStyle,
      },
      React.createElement("i", { className: gripIconClass })
    )
  );

  // Labels
  const children: React.ReactNode[] = [beforeImageEl, afterImageEl, handleEl];

  if (config.showLabels) {
    const beforeLabelEl = React.createElement(
      "span",
      { className: styles.label + " " + styles.labelBefore },
      config.beforeLabel || "Before"
    );

    const afterLabelEl = React.createElement(
      "span",
      { className: styles.label + " " + styles.labelAfter },
      config.afterLabel || "After"
    );

    children.push(beforeLabelEl);
    children.push(afterLabelEl);
  }

  return React.createElement(
    "div",
    {
      ref: containerRef,
      className: styles.beforeAfter,
      style: isHorizontal ? undefined : { cursor: "ns-resize" },
    },
    children
  );
};

export default BeforeAfterSlider;
