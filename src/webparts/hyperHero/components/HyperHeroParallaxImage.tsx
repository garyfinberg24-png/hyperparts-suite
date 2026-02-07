import * as React from "react";
import type { IHyperHeroTileBackground, IHyperHeroParallax } from "../models";
import { useParallax } from "../hooks";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroParallaxImageProps {
  background: IHyperHeroTileBackground;
  parallax: IHyperHeroParallax;
  heading: string;
}

const HyperHeroParallaxImageInner: React.FC<IHyperHeroParallaxImageProps> = (props) => {
  const { background, parallax, heading } = props;
  const { containerRef, imageRef } = useParallax({
    enabled: parallax.enabled,
    speed: parallax.speed,
  });

  if (background.type !== "image" || !background.imageUrl) {
    return React.createElement(React.Fragment);
  }

  const posX = background.imageFocalPoint ? background.imageFocalPoint.x + "%" : "center";
  const posY = background.imageFocalPoint ? background.imageFocalPoint.y + "%" : "center";

  return React.createElement(
    "div",
    {
      ref: containerRef,
      className: styles.backgroundLayer,
      "aria-hidden": "true",
    },
    React.createElement("div", {
      ref: imageRef,
      className: styles.parallaxContainer,
      style: {
        backgroundImage: "url(" + background.imageUrl + ")",
        backgroundSize: "cover",
        backgroundPosition: posX + " " + posY,
        backgroundRepeat: "no-repeat",
      },
      role: "img",
      "aria-label": background.imageAlt ?? heading,
    })
  );
};

export const HyperHeroParallaxImage = React.memo(HyperHeroParallaxImageInner);
