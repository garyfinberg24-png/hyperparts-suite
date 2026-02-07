/** Transition effect types for auto-rotation */
export type TransitionEffect = "slide" | "fade" | "zoom" | "kenBurns" | "none";

/** Auto-rotation configuration */
export interface IHyperHeroRotation {
  enabled: boolean;
  /** Interval between rotations in ms */
  intervalMs: number;
  effect: TransitionEffect;
  /** Transition duration in ms */
  transitionDurationMs: number;
  pauseOnHover: boolean;
  showDots: boolean;
  showArrows: boolean;
}

export const DEFAULT_ROTATION: IHyperHeroRotation = {
  enabled: false,
  intervalMs: 5000,
  effect: "fade",
  transitionDurationMs: 500,
  pauseOnHover: true,
  showDots: true,
  showArrows: true,
};
