/** CTA button configuration for a HyperHero slide */
export interface IHyperHeroCta {
  id: string;
  label: string;
  url: string;
  openInNewTab: boolean;
  variant: CtaVariant;
  iconName?: string;
  iconPosition: "before" | "after";
  ariaLabel?: string;
  /** Custom background color override (hex) */
  backgroundColor?: string;
  /** Custom text color override (hex) */
  textColor?: string;
  /** Custom padding horizontal in px (default: variant-dependent) */
  paddingX?: number;
  /** Custom padding vertical in px (default: variant-dependent) */
  paddingY?: number;
  /** Button entrance animation */
  animation?: CtaAnimation;
}

export type CtaVariant = "primary" | "secondary" | "ghost" | "pill" | "outline" | "gradient" | "shadow" | "minimal" | "rounded" | "block";

export type CtaAnimation = "none" | "fadeIn" | "bounceIn" | "slideUp" | "slideLeft" | "pulse" | "shake" | "glow";
