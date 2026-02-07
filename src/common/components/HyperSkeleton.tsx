import * as React from "react";

export interface IHyperSkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "rectangular" | "circular";
  count?: number;
  style?: React.CSSProperties;
}

const skeletonKeyframes = `
@keyframes hyperSkeletonPulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
`;

export const HyperSkeleton: React.FC<IHyperSkeletonProps> = (props) => {
  const {
    width = "100%",
    height = "16px",
    variant = "text",
    count = 1,
    style,
  } = props;

  const getBorderRadius = (): string => {
    switch (variant) {
      case "circular": return "50%";
      case "rectangular": return "4px";
      case "text":
      default: return "4px";
    }
  };

  const baseStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: getBorderRadius(),
    backgroundColor: "#edebe9",
    animation: "hyperSkeletonPulse 1.5s ease-in-out infinite",
    ...style,
  };

  const items: React.ReactElement[] = [];
  for (let i = 0; i < count; i++) {
    items.push(
      React.createElement("div", {
        key: i,
        style: {
          ...baseStyle,
          marginBottom: i < count - 1 ? "8px" : undefined,
        },
        "aria-hidden": "true",
      })
    );
  }

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("style", null, skeletonKeyframes),
    ...items
  );
};
