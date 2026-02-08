import * as React from "react";
import type { IParticleInstance, ParticleDirection, ParticleShape } from "../../models";
import { getParticleShapeSvg, getParticleAnimationName } from "../../utils/particleUtils";

import styles from "./ParticleOverlay.module.scss";

export interface IParticleOverlayProps {
  particles: IParticleInstance[];
  direction: ParticleDirection;
  shape: ParticleShape;
}

const ParticleOverlay: React.FC<IParticleOverlayProps> = function (props) {
  const { particles, direction, shape } = props;
  const animationName = getParticleAnimationName(direction);
  const shapeSvg = getParticleShapeSvg(shape);
  const usesSvg = shape !== "circle" && shape !== "square" && shapeSvg.length > 0;

  const particleElements = React.useMemo(function (): React.ReactElement[] {
    const elements: React.ReactElement[] = [];

    particles.forEach(function (particle) {
      const particleStyle: React.CSSProperties = {
        left: particle.x + "%",
        top: particle.y + "%",
        width: particle.size + "px",
        height: particle.size + "px",
        opacity: particle.opacity,
        animationName: animationName,
        animationDelay: particle.animationDelay + "ms",
        animationDuration: particle.animationDuration + "ms",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      };

      let className = styles.particle;
      if (shape === "square") {
        className = styles.particle + " " + styles.particleSquare;
      }

      if (usesSvg) {
        // For triangle, star, snow shapes — render SVG via dangerouslySetInnerHTML
        const svgWithColor = shapeSvg.replace(
          "<svg ",
          '<svg style="fill: ' + particle.color + '; width: 100%; height: 100%;" '
        );

        elements.push(
          React.createElement("div", {
            key: particle.id,
            className: className,
            style: particleStyle,
            dangerouslySetInnerHTML: { __html: svgWithColor },
          })
        );
      } else {
        // Circle or square — use backgroundColor
        particleStyle.backgroundColor = particle.color;

        elements.push(
          React.createElement("div", {
            key: particle.id,
            className: className,
            style: particleStyle,
          })
        );
      }
    });

    return elements;
  }, [particles, animationName, shape, usesSvg, shapeSvg]);

  return React.createElement(
    "div",
    {
      className: styles.particleOverlay,
      "aria-hidden": "true",
    },
    particleElements
  );
};

export default ParticleOverlay;
