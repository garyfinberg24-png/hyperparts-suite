import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { INewsWizardState } from "../../models/IHyperNewsWizardState";
import type { LayoutType } from "../../models/IHyperNewsLayout";
import styles from "./WizardSteps.module.scss";

// ============================================================
// LayoutStep — Visual layout picker (12 layouts)
// ============================================================

interface ILayoutOption {
  key: LayoutType;
  icon: string;
  name: string;
  desc: string;
}

var LAYOUT_CHOICES: ILayoutOption[] = [
  { key: "cardGrid", icon: "\uD83D\uDCCB", name: "Card Grid", desc: "Responsive card grid with images" },
  { key: "list", icon: "\uD83D\uDCC4", name: "List", desc: "Compact vertical list view" },
  { key: "magazine", icon: "\uD83D\uDCF0", name: "Magazine", desc: "Editorial magazine layout" },
  { key: "newspaper", icon: "\uD83D\uDDDE\uFE0F", name: "Newspaper", desc: "Multi-column newspaper style" },
  { key: "timeline", icon: "\u23F3", name: "Timeline", desc: "Chronological timeline view" },
  { key: "carousel", icon: "\uD83C\uDFA0", name: "Carousel", desc: "Horizontal carousel with arrows" },
  { key: "heroGrid", icon: "\u2B50", name: "Hero Grid", desc: "Featured hero + supporting grid" },
  { key: "compact", icon: "\uD83D\uDCCC", name: "Compact", desc: "Dense compact card layout" },
  { key: "filmstrip", icon: "\uD83C\uDFAC", name: "Filmstrip", desc: "Horizontal filmstrip scroll" },
  { key: "mosaic", icon: "\uD83E\uDDE9", name: "Mosaic", desc: "Variable-size mosaic tiles" },
  { key: "sideBySide", icon: "\u2194\uFE0F", name: "Side-by-Side", desc: "Two-column side-by-side" },
  { key: "tiles", icon: "\u25A0", name: "Tiles", desc: "Equal-size image tiles" },
];

var LayoutStep: React.FC<IWizardStepProps<INewsWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;
  var selectedLayout = state.layoutType;

  var handleSelect = React.useCallback(function (key: LayoutType): void {
    onChange({ layoutType: key });
  }, [onChange]);

  var layoutCards: React.ReactElement[] = [];
  LAYOUT_CHOICES.forEach(function (layout) {
    var isSelected = layout.key === selectedLayout;
    var cardClass = isSelected ? styles.layoutCardSelected : styles.layoutCard;

    layoutCards.push(
      React.createElement("button", {
        key: layout.key,
        className: cardClass,
        onClick: function () { handleSelect(layout.key); },
        type: "button",
        "aria-pressed": isSelected,
        role: "option",
        "aria-selected": isSelected,
      },
        React.createElement("div", { className: styles.layoutCardIcon, "aria-hidden": "true" }, layout.icon),
        React.createElement("div", { className: styles.layoutCardName }, layout.name),
        React.createElement("div", { className: styles.layoutCardDesc }, layout.desc)
      )
    );
  });

  // Find selected layout info
  var selectedInfo = "";
  LAYOUT_CHOICES.forEach(function (l) {
    if (l.key === selectedLayout) {
      selectedInfo = l.icon + " " + l.name + " — " + l.desc;
    }
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Choose a Layout"),
      React.createElement("div", { className: styles.stepSectionHint }, "Select how articles will be displayed to users.")
    ),
    React.createElement("div", { className: styles.layoutGrid, role: "listbox", "aria-label": "Layout options" },
      layoutCards
    ),
    selectedInfo
      ? React.createElement("div", { className: styles.layoutSelectedInfo },
          React.createElement("span", { className: styles.layoutSelectedLabel }, "Selected: " + selectedInfo)
        )
      : undefined
  );
};

export default LayoutStep;
