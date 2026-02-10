import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IFaqWizardState } from "./faqWizardConfig";
import type { FaqAccordionStyle } from "../../models/IHyperFaqEnums";
import {
  ALL_ACCORDION_STYLES,
  getAccordionStyleDisplayName,
} from "../../models/IHyperFaqEnums";
import styles from "./WizardSteps.module.scss";

// ============================================================
// LayoutStep — Layout selection + accordion style + toggles
// 8 layouts in a 4x2 grid, accordion style chips, toggles
// ============================================================

interface ILayoutOption {
  key: string;
  icon: string;
  name: string;
}

var LAYOUT_CHOICES: ILayoutOption[] = [
  { key: "accordion", icon: "\uD83D\uDCCB", name: "Accordion" },
  { key: "cardGrid", icon: "\uD83C\uDFB4", name: "Card Grid" },
  { key: "magazine", icon: "\uD83D\uDCF0", name: "Magazine" },
  { key: "tabs", icon: "\uD83D\uDCC1", name: "Tabs" },
  { key: "timeline", icon: "\uD83D\uDCC5", name: "Timeline" },
  { key: "masonry", icon: "\uD83E\uDDF1", name: "Masonry" },
  { key: "compact", icon: "\uD83D\uDCDD", name: "Compact" },
  { key: "knowledgeBase", icon: "\uD83D\uDCDA", name: "Knowledge Base" },
];

var LayoutStep: React.FC<IWizardStepProps<IFaqWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleLayoutSelect = React.useCallback(function (key: string): void {
    onChange({ layout: key });
  }, [onChange]);

  var handleAccordionStyleSelect = React.useCallback(function (style: FaqAccordionStyle): void {
    onChange({ accordionStyle: style });
  }, [onChange]);

  var handleCategoriesToggle = React.useCallback(function (): void {
    onChange({ enableCategories: !state.enableCategories });
  }, [onChange, state.enableCategories]);

  var handleCategoryCardsToggle = React.useCallback(function (): void {
    onChange({ showCategoryCards: !state.showCategoryCards });
  }, [onChange, state.showCategoryCards]);

  // Build layout cards
  var layoutCards: React.ReactElement[] = [];
  LAYOUT_CHOICES.forEach(function (layout) {
    var isSelected = layout.key === state.layout;
    var cardClass = isSelected
      ? styles.layoutCard + " " + styles.layoutCardActive
      : styles.layoutCard;

    layoutCards.push(
      React.createElement("button", {
        key: layout.key,
        className: cardClass,
        onClick: function (): void { handleLayoutSelect(layout.key); },
        type: "button",
        role: "option",
        "aria-selected": isSelected,
      },
        React.createElement("div", { className: styles.layoutIcon, "aria-hidden": "true" }, layout.icon),
        React.createElement("div", { className: styles.layoutName }, layout.name)
      )
    );
  });

  // Build accordion style chips (only visible when layout is "accordion")
  var accordionChips: React.ReactElement | undefined;
  if (state.layout === "accordion") {
    var chips: React.ReactElement[] = [];
    ALL_ACCORDION_STYLES.forEach(function (style) {
      var isActive = state.accordionStyle === style;
      var chipClass = isActive
        ? styles.chip + " " + styles.chipActive
        : styles.chip;

      chips.push(
        React.createElement("button", {
          key: style,
          className: chipClass,
          onClick: function (): void { handleAccordionStyleSelect(style); },
          type: "button",
          "aria-pressed": isActive,
        }, getAccordionStyleDisplayName(style))
      );
    });

    accordionChips = React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Accordion Style"),
      React.createElement("div", { className: styles.chipGroup }, chips)
    );
  }

  // Category grouping toggle
  var categoryToggle = React.createElement("label", {
    className: styles.toggleRow,
    key: "catToggle",
  },
    React.createElement("div", { className: styles.toggleInfo },
      React.createElement("span", { className: styles.toggleLabel }, "Category Grouping"),
      React.createElement("span", { className: styles.toggleDesc }, "Group FAQs under collapsible category headers")
    ),
    React.createElement("div", { className: styles.toggleSwitch },
      React.createElement("input", {
        type: "checkbox",
        className: styles.toggleInput,
        checked: state.enableCategories,
        onChange: handleCategoriesToggle,
        "aria-label": "Enable category grouping",
      }),
      React.createElement("span", { className: styles.toggleTrack },
        React.createElement("span", { className: styles.toggleThumb })
      )
    )
  );

  // Show category cards toggle (only for cardGrid layout)
  var categoryCardsToggle: React.ReactElement | undefined;
  if (state.layout === "cardGrid") {
    categoryCardsToggle = React.createElement("label", {
      className: styles.toggleRow,
      key: "catCardsToggle",
    },
      React.createElement("div", { className: styles.toggleInfo },
        React.createElement("span", { className: styles.toggleLabel }, "Show Category Cards"),
        React.createElement("span", { className: styles.toggleDesc }, "Display category overview cards above the FAQ grid")
      ),
      React.createElement("div", { className: styles.toggleSwitch },
        React.createElement("input", {
          type: "checkbox",
          className: styles.toggleInput,
          checked: state.showCategoryCards,
          onChange: handleCategoryCardsToggle,
          "aria-label": "Show category cards",
        }),
        React.createElement("span", { className: styles.toggleTrack },
          React.createElement("span", { className: styles.toggleThumb })
        )
      )
    );
  }

  return React.createElement("div", { className: styles.stepContainer },
    // Layout section
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Choose a Layout"),
      React.createElement("div", { className: styles.stepSectionHint }, "Select how your FAQs will be displayed.")
    ),
    React.createElement("div", {
      className: styles.layoutGrid,
      role: "listbox",
      "aria-label": "Layout options",
    }, layoutCards),

    // Accordion style chips (conditional)
    accordionChips,

    // Toggles section
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Display Options")
    ),
    categoryToggle,
    categoryCardsToggle
  );
};

export default LayoutStep;
