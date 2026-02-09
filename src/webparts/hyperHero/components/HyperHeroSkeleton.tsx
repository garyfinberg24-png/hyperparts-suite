import * as React from "react";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroSkeletonProps {
  height: number;
}

export const HyperHeroSkeleton: React.FC<IHyperHeroSkeletonProps> = (props) => {
  return React.createElement("div", {
    className: styles.skeletonSlide,
    style: {
      width: "100%",
      height: props.height + "px",
      borderRadius: "8px",
    },
    "aria-label": "Loading hero content",
    role: "status",
  });
};
