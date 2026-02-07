import * as React from "react";
import type { IHyperHeroGradient } from "../models";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroGradientOverlayProps {
  gradient: IHyperHeroGradient;
}

export const HyperHeroGradientOverlay: React.FC<IHyperHeroGradientOverlayProps> = (props) => {
  const { gradient } = props;

  if (!gradient.enabled || gradient.stops.length === 0) {
    return React.createElement("span");
  }

  const stops = gradient.stops
    .map((stop) => {
      const r = parseInt(stop.color.substring(1, 3), 16);
      const g = parseInt(stop.color.substring(3, 5), 16);
      const b = parseInt(stop.color.substring(5, 7), 16);
      return "rgba(" + r + "," + g + "," + b + "," + stop.opacity + ") " + stop.position + "%";
    })
    .join(", ");

  const background =
    gradient.type === "radial"
      ? "radial-gradient(circle, " + stops + ")"
      : "linear-gradient(" + (gradient.angle ?? "180deg") + ", " + stops + ")";

  return React.createElement("div", {
    className: styles.gradientOverlay,
    style: { background },
    "aria-hidden": "true",
  });
};
