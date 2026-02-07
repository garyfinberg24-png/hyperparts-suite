import * as React from "react";
import type { IHyperSpotlightEmployee } from "../models";
import styles from "./HyperSpotlightAttributeDisplay.module.scss";

export interface IHyperSpotlightAttributeDisplayProps {
  employee: IHyperSpotlightEmployee;
  selectedAttributes: string[];
  attributeLabels: Record<string, string>;
  showLabels: boolean;
  showIcons: boolean;
}

const ICON_MAP: Record<string, string> = {
  mail: "📧",
  businessPhones: "📞",
  mobilePhone: "📱",
  officeLocation: "📍",
  department: "🏢",
  jobTitle: "💼",
  birthday: "🎂",
  hireDate: "📅",
  skills: "🔧",
  interests: "❤️",
};

const LABEL_MAP: Record<string, string> = {
  mail: "Email",
  businessPhones: "Phone",
  mobilePhone: "Mobile",
  officeLocation: "Office",
  department: "Department",
  jobTitle: "Job Title",
  birthday: "Birthday",
  hireDate: "Hire Date",
  skills: "Skills",
  interests: "Interests",
};

function formatValue(attrName: string, value: unknown): string {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (attrName === "birthday" || attrName === "hireDate") {
    try {
      return new Date(String(value)).toLocaleDateString();
    } catch {
      return String(value);
    }
  }
  return String(value);
}

const HyperSpotlightAttributeDisplay: React.FC<IHyperSpotlightAttributeDisplayProps> = function (props) {
  const attrElements: React.ReactElement[] = [];

  props.selectedAttributes.forEach(function (attr, index) {
    const raw = props.employee[attr];
    const value = formatValue(attr, raw);
    if (!value) return;

    const icon = props.showIcons
      ? React.createElement("span", { className: styles.icon }, ICON_MAP[attr] || "•")
      : undefined;
    const label = props.showLabels
      ? React.createElement("span", { className: styles.label }, (props.attributeLabels[attr] || LABEL_MAP[attr] || attr) + ":")
      : undefined;

    attrElements.push(
      React.createElement(
        "div",
        { key: index, className: styles.attribute },
        icon,
        label,
        React.createElement("span", { className: styles.value }, value)
      )
    );
  });

  if (attrElements.length === 0) return React.createElement(React.Fragment);

  return React.createElement("div", { className: styles.attributeDisplay }, attrElements);
};

export default HyperSpotlightAttributeDisplay;
