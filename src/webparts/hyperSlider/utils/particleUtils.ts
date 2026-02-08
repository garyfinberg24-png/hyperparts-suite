import type {
  ISliderParticle,
  IParticleInstance,
  ParticleShape,
  ParticleDirection
} from "../models";

/**
 * Generate random particles based on config
 */
export function generateParticles(config: ISliderParticle): IParticleInstance[] {
  const particles: IParticleInstance[] = [];

  for (let i = 0; i < config.count; i++) {
    const size = randomInRange(config.size.min, config.size.max);
    const opacity = randomInRange(config.opacity.min, config.opacity.max);
    const colorIndex = Math.floor(Math.random() * config.color.length);
    const color = config.color[colorIndex];
    const animationDelay = Math.floor(Math.random() * 5000);

    // Animation duration based on speed range (higher speed = shorter duration)
    const speedVal = randomInRange(config.speed.min, config.speed.max);
    const durationMs = Math.max(1000, Math.floor((10 - speedVal) * 1000));

    particles.push({
      id: "particle-" + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: size,
      color: color,
      opacity: opacity,
      animationDelay: animationDelay,
      animationDuration: durationMs
    });
  }

  return particles;
}

/**
 * Generate random number in range
 */
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Get SVG markup for particle shape
 */
export function getParticleShapeSvg(shape: ParticleShape): string {
  if (shape === "circle" || shape === "square") {
    // Handled by CSS border-radius
    return "";
  }

  if (shape === "star") {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  }

  if (shape === "triangle") {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,22 2,22"/></svg>';
  }

  if (shape === "snow") {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M5.64 18.36L18.36 5.64M12 2l-2 2m4 0l-2-2M12 22l-2-2m4 0l-2 2M2 12l2-2m0 4l-2-2M22 12l-2-2m0 4l2-2"/></svg>';
  }

  return "";
}

/**
 * Get CSS animation name for particle direction
 */
export function getParticleAnimationName(direction: ParticleDirection): string {
  return "particleFloat" + direction.charAt(0).toUpperCase() + direction.substring(1);
}
