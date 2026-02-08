import * as React from "react";
import type { ISliderParticle, IParticleInstance } from "../models";

export interface IUseSliderParticlesOptions {
  config: ISliderParticle;
}

export interface IUseSliderParticlesResult {
  particles: IParticleInstance[];
}

export function useSliderParticles(options: IUseSliderParticlesOptions): IUseSliderParticlesResult {
  const { config } = options;

  const particles = React.useMemo(function (): IParticleInstance[] {
    if (!config.enabled) {
      return [];
    }

    const instances: IParticleInstance[] = [];

    for (let i = 0; i < config.count; i++) {
      const sizeVariation = config.size.min + Math.random() * (config.size.max - config.size.min);
      const opacityVariation = config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min);
      const colorIndex = Math.floor(Math.random() * config.color.length);
      const speedVariation = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
      const delayVariation = Math.random() * 5000;
      // Slower speed = longer animation duration
      const durationMs = Math.floor((10 - speedVariation) * 1000);

      instances.push({
        id: "particle-" + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: sizeVariation,
        color: config.color[colorIndex],
        opacity: opacityVariation,
        animationDelay: delayVariation,
        animationDuration: Math.max(1000, durationMs)
      });
    }

    return instances;
  }, [
    config.enabled,
    config.count,
    config.size.min,
    config.size.max,
    config.opacity.min,
    config.opacity.max,
    config.color,
    config.speed.min,
    config.speed.max,
    config.shape
  ]);

  return {
    particles
  };
}
