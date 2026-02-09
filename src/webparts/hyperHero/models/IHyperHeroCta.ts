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
}

export type CtaVariant = "primary" | "secondary" | "ghost" | "pill" | "outline" | "gradient" | "shadow" | "minimal" | "rounded" | "block";
