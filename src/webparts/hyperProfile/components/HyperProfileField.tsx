import * as React from "react";
import styles from "./HyperProfileField.module.scss";

export interface IHyperProfileFieldProps {
  icon?: string;
  label: string;
  value?: string | string[];
  isLink?: boolean;
  onLinkClick?: () => void;
}

/** Icon map from Fluent icon names to emoji fallbacks */
const ICON_FALLBACK: Record<string, string> = {
  Mail: "\u2709\uFE0F",
  CellPhone: "\uD83D\uDCF1",
  Phone: "\uD83D\uDCDE",
  Org: "\uD83C\uDFE2",
  POI: "\uD83D\uDCCD",
  CityNext: "\uD83C\uDFD9\uFE0F",
  Contact: "\uD83D\uDC64",
  LocaleLanguage: "\uD83C\uDF10",
  ContactCard: "\uD83C\uDD94",
  Info: "\u2139\uFE0F",
  SearchAndApps: "\uD83D\uDD0D",
};

const HyperProfileField: React.FC<IHyperProfileFieldProps> = function (props) {
  if (!props.value) return React.createElement(React.Fragment);

  const displayValue = Array.isArray(props.value) ? props.value.join(", ") : props.value;
  if (!displayValue) return React.createElement(React.Fragment);

  const children: React.ReactNode[] = [];

  if (props.icon) {
    children.push(React.createElement("span", {
      key: "icon",
      className: styles.fieldIcon,
    }, ICON_FALLBACK[props.icon] || "\u2022"));
  }

  const contentChildren: React.ReactNode[] = [];
  contentChildren.push(React.createElement("span", { key: "label", className: styles.fieldLabel }, props.label));

  if (props.isLink && props.onLinkClick) {
    contentChildren.push(React.createElement("button", {
      key: "value",
      className: styles.fieldLink,
      onClick: props.onLinkClick,
      type: "button",
    }, displayValue));
  } else {
    contentChildren.push(React.createElement("span", { key: "value", className: styles.fieldValue }, displayValue));
  }

  children.push(React.createElement("div", { key: "content", className: styles.fieldContent }, contentChildren));

  return React.createElement("div", { className: styles.profileField }, children);
};

export default HyperProfileField;
