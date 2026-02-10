import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperPollWizardState } from "../../models/IHyperPollWizardState";
import { POLL_TEMPLATE_GALLERY, getTemplateCategories, getCategoryLabel } from "../../utils/pollTemplatesGallery";
import type { IPollTemplateGallery, TemplateCategory } from "../../utils/pollTemplatesGallery";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 0: Poll Template Gallery
// ============================================================

var TemplatesStep: React.FC<IWizardStepProps<IHyperPollWizardState>> = function (props) {
  var state = props.state;
  var filterState = React.useState<TemplateCategory | "all">("all");
  var activeFilter = filterState[0];
  var setActiveFilter = filterState[1];

  var handleSelectTemplate = React.useCallback(function (tmpl: IPollTemplateGallery) {
    var clonedState = JSON.parse(JSON.stringify(tmpl.createState())) as IHyperPollWizardState;
    props.onChange(clonedState);
  }, [props]);

  var handleSkip = React.useCallback(function () {
    props.onChange({ templateId: "" });
  }, [props]);

  var handleFilterClick = React.useCallback(function (cat: TemplateCategory | "all") {
    setActiveFilter(cat);
  }, []);

  // Filter templates
  var filteredTemplates: IPollTemplateGallery[] = [];
  POLL_TEMPLATE_GALLERY.forEach(function (t) {
    if (activeFilter === "all" || t.category === activeFilter) {
      filteredTemplates.push(t);
    }
  });

  // Category filter chips
  var categories = getTemplateCategories();
  var filterChips: React.ReactNode[] = [
    React.createElement("button", {
      key: "all",
      className: activeFilter === "all" ? styles.categoryChipActive : styles.categoryChip,
      onClick: function () { handleFilterClick("all"); },
      type: "button",
    }, "All"),
  ];
  categories.forEach(function (cat) {
    filterChips.push(
      React.createElement("button", {
        key: cat,
        className: activeFilter === cat ? styles.categoryChipActive : styles.categoryChip,
        onClick: function () { handleFilterClick(cat); },
        type: "button",
      }, getCategoryLabel(cat))
    );
  });

  // Template cards
  var templateCards = filteredTemplates.map(function (tmpl) {
    var isSelected = state.templateId === tmpl.id;

    return React.createElement("div", {
      key: tmpl.id,
      className: isSelected ? styles.templateCardSelected : styles.templateCard,
      onClick: function () { handleSelectTemplate(tmpl); },
      role: "radio",
      "aria-checked": isSelected,
      tabIndex: 0,
      onKeyDown: function (e: React.KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelectTemplate(tmpl);
        }
      },
    },
      React.createElement("div", { className: styles.templateCardHeader },
        React.createElement("span", { className: styles.templateCardIcon, "aria-hidden": "true" }, tmpl.icon),
        React.createElement("div", { className: styles.templateCardBadge }, getCategoryLabel(tmpl.category))
      ),
      React.createElement("div", { className: styles.templateCardName }, tmpl.name),
      React.createElement("div", { className: styles.templateCardDesc }, tmpl.description),
      React.createElement("div", { className: styles.templateCardMeta },
        React.createElement("span", { className: styles.templateCardQuestions },
          String(tmpl.questionCount) + " questions"
        ),
        React.createElement("span", { className: styles.templateCardTime },
          tmpl.estimatedTime
        )
      )
    );
  });

  // Find selected template name for hint
  var selectedName = "";
  if (state.templateId) {
    POLL_TEMPLATE_GALLERY.forEach(function (t) {
      if (t.id === state.templateId) { selectedName = t.name; }
    });
  }

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Poll Templates"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Choose a prebuilt template to get started quickly, or skip to build from scratch. Templates pre-fill questions, settings, and styling."
      )
    ),

    // Category filters
    React.createElement("div", { className: styles.categoryFilters }, filterChips),

    // Template grid
    React.createElement("div", {
      className: styles.templateGrid,
      role: "radiogroup",
      "aria-label": "Poll templates",
    }, templateCards),

    // Skip option
    React.createElement("button", {
      className: styles.templateSkipBtn,
      onClick: handleSkip,
      type: "button",
    }, "Skip \u2014 Build from Scratch"),

    // Selected hint
    state.templateId
      ? React.createElement("div", { className: styles.templateSelectedHint },
          "\u2713 Template \"" + selectedName + "\" selected. The next steps are pre-filled \u2014 you can still customize everything."
        )
      : undefined
  );
};

export default TemplatesStep;
