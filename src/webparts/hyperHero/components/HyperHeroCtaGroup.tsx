import * as React from "react";
import type { IHyperHeroCta } from "../models";
import styles from "./HyperHero.module.scss";

export interface IHyperHeroCtaGroupProps {
  ctas: IHyperHeroCta[];
  onCtaClick?: (cta: IHyperHeroCta) => void;
}

const variantClassMap: Record<string, string> = {
  primary: styles.ctaPrimary,
  secondary: styles.ctaSecondary,
  ghost: styles.ctaGhost,
  pill: styles.ctaPill,
  outline: styles.ctaOutline,
  gradient: styles.ctaGradient,
  shadow: styles.ctaShadow,
  minimal: styles.ctaMinimal,
  rounded: styles.ctaRounded,
  block: styles.ctaBlock,
};

const animClassMap: Record<string, string> = {
  fadeIn: styles.ctaAnimFadeIn || "",
  bounceIn: styles.ctaAnimBounceIn || "",
  slideUp: styles.ctaAnimSlideUp || "",
  slideLeft: styles.ctaAnimSlideLeft || "",
  pulse: styles.ctaAnimPulse || "",
  shake: styles.ctaAnimShake || "",
  glow: styles.ctaAnimGlow || "",
};

export const HyperHeroCtaGroup: React.FC<IHyperHeroCtaGroupProps> = (props) => {
  const { ctas, onCtaClick } = props;

  if (!ctas || ctas.length === 0) {
    return React.createElement("span");
  }

  return React.createElement(
    "div",
    { className: styles.ctaGroup },
    ctas.map((cta) => {
      const baseClass = variantClassMap[cta.variant] ?? styles.ctaPrimary;
      const animSuffix = cta.animation && animClassMap[cta.animation] ? " " + animClassMap[cta.animation] : "";
      const className = baseClass + animSuffix;

      let customStyle: React.CSSProperties | undefined = undefined;
      if (cta.backgroundColor || cta.textColor || cta.paddingX !== undefined || cta.paddingY !== undefined) {
        customStyle = {};
        if (cta.backgroundColor) { customStyle.backgroundColor = cta.backgroundColor; }
        if (cta.textColor) { customStyle.color = cta.textColor; }
        if (cta.paddingX !== undefined) { customStyle.paddingLeft = cta.paddingX + "px"; customStyle.paddingRight = cta.paddingX + "px"; }
        if (cta.paddingY !== undefined) { customStyle.paddingTop = cta.paddingY + "px"; customStyle.paddingBottom = cta.paddingY + "px"; }
      }

      const handleClick = (e: React.MouseEvent): void => {
        if (onCtaClick) {
          onCtaClick(cta);
        }
        // Allow default link behavior
      };

      const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (onCtaClick) {
            onCtaClick(cta);
          }
          window.open(cta.url, cta.openInNewTab ? "_blank" : "_self");
        }
      };

      return React.createElement(
        "a",
        {
          key: cta.id,
          className: className,
          style: customStyle,
          href: cta.url,
          target: cta.openInNewTab ? "_blank" : "_self",
          rel: cta.openInNewTab ? "noopener noreferrer" : undefined,
          "aria-label": cta.ariaLabel ?? cta.label,
          onClick: handleClick,
          onKeyDown: handleKeyDown,
        },
        cta.iconName && cta.iconPosition === "before"
          ? React.createElement("span", { className: styles.ctaIcon, "aria-hidden": "true" }, cta.iconName)
          : undefined,
        React.createElement("span", undefined, cta.label),
        cta.iconName && cta.iconPosition === "after"
          ? React.createElement("span", { className: styles.ctaIcon, "aria-hidden": "true" }, cta.iconName)
          : undefined
      );
    })
  );
};
