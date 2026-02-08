import * as React from "react";
import type { IButtonLayerConfig } from "../../models";
import styles from "./ButtonLayer.module.scss";

export interface IButtonLayerProps {
  config: IButtonLayerConfig;
}

const ButtonLayer: React.FC<IButtonLayerProps> = function (props) {
  const { config } = props;

  // Build class names based on variant
  const classNames: string[] = [styles.buttonLayer];
  const variantClass = (styles as Record<string, string>)[config.variant];
  if (variantClass) {
    classNames.push(variantClass);
  }

  // Inline styles
  const inlineStyle: React.CSSProperties = {
    borderRadius: config.borderRadius + "px",
    paddingTop: config.padding.top + "px",
    paddingRight: config.padding.right + "px",
    paddingBottom: config.padding.bottom + "px",
    paddingLeft: config.padding.left + "px",
  };

  // Custom variant applies custom colors inline
  if (config.variant === "custom") {
    inlineStyle.backgroundColor = config.customBgColor;
    inlineStyle.color = config.customTextColor;
  }

  // Link attributes
  const linkProps: Record<string, unknown> = {
    className: classNames.join(" "),
    style: inlineStyle,
    href: config.url,
  };

  if (config.openInNewTab) {
    linkProps.target = "_blank";
    linkProps.rel = "noopener noreferrer";
  }

  // Build children: label text + optional icon
  const children: React.ReactNode[] = [];

  // Add icon element if iconName is set
  if (config.iconName) {
    const iconClassName = config.iconPosition === "after" ? styles.iconAfter : styles.iconBefore;
    children.push(
      React.createElement("i", {
        key: "icon",
        className: "ms-Icon ms-Icon--" + config.iconName + " " + iconClassName,
        "aria-hidden": "true",
      })
    );
  }

  // Add label text
  children.push(
    React.createElement("span", { key: "label" }, config.label)
  );

  return React.createElement("a", linkProps, children);
};

export default ButtonLayer;
