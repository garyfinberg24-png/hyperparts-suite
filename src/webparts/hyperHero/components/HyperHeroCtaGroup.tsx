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
      const className = variantClassMap[cta.variant] ?? styles.ctaPrimary;

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
