import * as React from "react";
import type { WizardPath } from "../../models/IHyperProfileWizardState";
import styles from "./WizardSteps.module.scss";

export interface IWizardPathStepProps {
  onSelectPath: (path: WizardPath) => void;
}

const WizardPathStep: React.FC<IWizardPathStepProps> = function (props) {
  const children: React.ReactNode[] = [];

  // Header
  children.push(
    React.createElement("div", { key: "header", className: styles.stepHeader },
      React.createElement("h3", { className: styles.stepTitle }, "How would you like to get started?"),
      React.createElement("p", { className: styles.stepDescription },
        "Choose a beautifully designed template or build your profile card from scratch."
      )
    )
  );

  // Path cards
  const pathCards: React.ReactNode[] = [];

  // Template path card
  pathCards.push(
    React.createElement("button", {
      key: "template",
      type: "button",
      className: styles.pathCard,
      onClick: function () { props.onSelectPath("template"); },
      "aria-label": "Start from a template",
    },
      React.createElement("div", { className: styles.pathIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
      React.createElement("div", { className: styles.pathTitle }, "Start from Template"),
      React.createElement("div", { className: styles.pathDesc },
        "Choose from 15 professionally designed templates across Classic, Modern, and Creative styles. Each template comes pre-configured with optimal settings."
      ),
      React.createElement("div", { className: styles.pathBadge }, "Recommended")
    )
  );

  // Scratch path card
  pathCards.push(
    React.createElement("button", {
      key: "scratch",
      type: "button",
      className: styles.pathCard,
      onClick: function () { props.onSelectPath("scratch"); },
      "aria-label": "Build from scratch",
    },
      React.createElement("div", { className: styles.pathIcon, "aria-hidden": "true" }, "\uD83D\uDD27"),
      React.createElement("div", { className: styles.pathTitle }, "Build from Scratch"),
      React.createElement("div", { className: styles.pathDesc },
        "Start with a blank canvas and configure every aspect of your profile card — display mode, features, appearance, and more."
      ),
      React.createElement("div", { className: styles.pathBadge + " " + styles.pathBadgeAlt }, "Full Control")
    )
  );

  children.push(
    React.createElement("div", { key: "cards", className: styles.pathCardsRow }, pathCards)
  );

  return React.createElement("div", { className: styles.stepContainer }, children);
};

export default WizardPathStep;
