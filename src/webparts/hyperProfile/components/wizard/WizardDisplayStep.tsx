import * as React from "react";
import type { IProfileWizardState } from "../../models/IHyperProfileWizardState";
import type { CardStyle, PhotoSize } from "../../models/IHyperProfileWebPartProps";
import { PHOTO_SHAPE_OPTIONS } from "../../models/IHyperProfileAnimation";
import styles from "./WizardSteps.module.scss";

export interface IWizardDisplayStepProps {
  state: IProfileWizardState;
  onUpdateState: (partial: Partial<IProfileWizardState>) => void;
}

const CARD_STYLES: Array<{ id: CardStyle; label: string; desc: string; icon: string }> = [
  { id: "compact", label: "Compact", desc: "Minimal horizontal layout", icon: "\u2501" },
  { id: "standard", label: "Standard", desc: "Balanced professional layout", icon: "\u25A3" },
  { id: "expanded", label: "Expanded", desc: "Full detailed view", icon: "\u25A1" },
];

const PHOTO_SIZES: Array<{ id: PhotoSize; label: string; px: string }> = [
  { id: "small", label: "Small", px: "48px" },
  { id: "medium", label: "Medium", px: "80px" },
  { id: "large", label: "Large", px: "120px" },
];

const WizardDisplayStep: React.FC<IWizardDisplayStepProps> = function (props) {
  const children: React.ReactNode[] = [];

  // Header
  children.push(
    React.createElement("div", { key: "header", className: styles.stepHeader },
      React.createElement("h3", { className: styles.stepTitle }, "Display Settings"),
      React.createElement("p", { className: styles.stepDescription },
        "Configure the basic layout and photo appearance for your profile card."
      )
    )
  );

  // Card style section
  const cardStyleEls: React.ReactNode[] = [];
  CARD_STYLES.forEach(function (cs) {
    const isSelected = props.state.cardStyle === cs.id;
    cardStyleEls.push(
      React.createElement("button", {
        key: cs.id,
        type: "button",
        className: styles.optionCard + (isSelected ? " " + styles.optionCardSelected : ""),
        onClick: function () { props.onUpdateState({ cardStyle: cs.id }); },
        "aria-pressed": isSelected ? "true" : "false",
      },
        React.createElement("span", { className: styles.optionIcon, "aria-hidden": "true" }, cs.icon),
        React.createElement("span", { className: styles.optionLabel }, cs.label),
        React.createElement("span", { className: styles.optionDesc }, cs.desc)
      )
    );
  });
  children.push(
    React.createElement("div", { key: "cardStyle", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Card Style"),
      React.createElement("div", { className: styles.optionRow }, cardStyleEls)
    )
  );

  // Photo size section
  const photoSizeEls: React.ReactNode[] = [];
  PHOTO_SIZES.forEach(function (ps) {
    const isSelected = props.state.photoSize === ps.id;
    photoSizeEls.push(
      React.createElement("button", {
        key: ps.id,
        type: "button",
        className: styles.optionCard + (isSelected ? " " + styles.optionCardSelected : ""),
        onClick: function () { props.onUpdateState({ photoSize: ps.id }); },
        "aria-pressed": isSelected ? "true" : "false",
      },
        React.createElement("span", { className: styles.optionLabel }, ps.label),
        React.createElement("span", { className: styles.optionDesc }, ps.px)
      )
    );
  });
  children.push(
    React.createElement("div", { key: "photoSize", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Photo Size"),
      React.createElement("div", { className: styles.optionRow }, photoSizeEls)
    )
  );

  // Photo shape section
  const photoShapeEls: React.ReactNode[] = [];
  PHOTO_SHAPE_OPTIONS.forEach(function (shape) {
    const isSelected = props.state.photoShape === shape.id;
    photoShapeEls.push(
      React.createElement("button", {
        key: shape.id,
        type: "button",
        className: styles.optionCard + (isSelected ? " " + styles.optionCardSelected : ""),
        onClick: function () { props.onUpdateState({ photoShape: shape.id }); },
        "aria-pressed": isSelected ? "true" : "false",
      },
        React.createElement("span", { className: styles.optionLabel }, shape.name)
      )
    );
  });
  children.push(
    React.createElement("div", { key: "photoShape", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Photo Shape"),
      React.createElement("div", { className: styles.optionRow }, photoShapeEls)
    )
  );

  // Template selector for scratch (pick base template)
  children.push(
    React.createElement("div", { key: "templateNote", className: styles.settingSection },
      React.createElement("div", { className: styles.sectionLabel }, "Base Template"),
      React.createElement("div", { className: styles.infoNote },
        "Your display settings will be applied to the Standard template. You can change the template later from the property pane."
      )
    )
  );

  return React.createElement("div", { className: styles.stepContainer }, children);
};

export default WizardDisplayStep;
