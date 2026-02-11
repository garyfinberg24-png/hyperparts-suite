import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ISearchWizardState } from "../../models/IHyperSearchWizardState";
import type { ISearchTemplate } from "../../models/IHyperSearchV2";
import { DEFAULT_V2_FEATURES } from "../../models/IHyperSearchV2";
import { SEARCH_TEMPLATES } from "../../constants/searchTemplates";
import styles from "./WizardSteps.module.scss";

/** Template category definitions */
var CATEGORIES: Array<{ key: string; label: string }> = [
  { key: "all", label: "All" },
  { key: "modern", label: "Modern" },
  { key: "classic", label: "Classic" },
  { key: "creative", label: "Creative" },
];

var TemplatesStep: React.FC<IWizardStepProps<ISearchWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;
  var categoryState = React.useState("all");
  var activeCategory = categoryState[0];
  var setActiveCategory = categoryState[1];

  var handleSelect = function (template: ISearchTemplate): void {
    // Merge template configuration into wizard state
    var cfg = template.configuration;
    var partial: Partial<ISearchWizardState> = {
      selectedTemplate: template.id,
    };
    if (cfg.resultLayout) partial.resultLayout = cfg.resultLayout;
    if (cfg.searchBarStyle) partial.searchBarStyle = cfg.searchBarStyle;
    if (cfg.accentColor) partial.accentColor = cfg.accentColor;
    if (cfg.borderRadius !== undefined) partial.borderRadius = cfg.borderRadius;
    if (cfg.showScopeTabs !== undefined) partial.showScopeTabs = cfg.showScopeTabs;
    if (cfg.resultsPerPage) partial.resultsPerPage = cfg.resultsPerPage;
    if (cfg.features) {
      // Merge with defaults to ensure all keys exist
      var mergedFeatures = {
        instantSearch: DEFAULT_V2_FEATURES.instantSearch,
        smartAutocomplete: DEFAULT_V2_FEATURES.smartAutocomplete,
        searchVerticals: DEFAULT_V2_FEATURES.searchVerticals,
        zeroQuery: DEFAULT_V2_FEATURES.zeroQuery,
        spellingCorrection: DEFAULT_V2_FEATURES.spellingCorrection,
        nlpParsing: DEFAULT_V2_FEATURES.nlpParsing,
        savedSearches: DEFAULT_V2_FEATURES.savedSearches,
        commandPalette: DEFAULT_V2_FEATURES.commandPalette,
        inlinePreview: DEFAULT_V2_FEATURES.inlinePreview,
        peopleCards: DEFAULT_V2_FEATURES.peopleCards,
        quickActions: DEFAULT_V2_FEATURES.quickActions,
        hitHighlight: DEFAULT_V2_FEATURES.hitHighlight,
        resultGrouping: DEFAULT_V2_FEATURES.resultGrouping,
        thumbnailPreviews: DEFAULT_V2_FEATURES.thumbnailPreviews,
      };
      var fKeys = Object.keys(cfg.features);
      fKeys.forEach(function (k) {
        (mergedFeatures as unknown as Record<string, boolean>)[k] = (cfg.features as unknown as Record<string, boolean>)[k];
      });
      partial.features = mergedFeatures;
    }
    onChange(partial);
  };

  // Filter templates by category
  var filteredTemplates: ISearchTemplate[] = [];
  SEARCH_TEMPLATES.forEach(function (t) {
    if (activeCategory === "all" || t.category === activeCategory) {
      filteredTemplates.push(t);
    }
  });

  // Build category chips
  var categoryChips: React.ReactElement[] = [];
  CATEGORIES.forEach(function (cat) {
    var isActive = activeCategory === cat.key;
    categoryChips.push(
      React.createElement("button", {
        key: cat.key,
        className: isActive ? styles.categoryChipSelected : styles.categoryChip,
        onClick: function () { setActiveCategory(cat.key); },
        type: "button",
      }, cat.label)
    );
  });

  // Build template cards
  var cards: React.ReactElement[] = [];
  filteredTemplates.forEach(function (template) {
    var isSelected = state.selectedTemplate === template.id;
    cards.push(
      React.createElement("button", {
        key: template.id,
        className: isSelected ? styles.templateCardSelected : styles.templateCard,
        onClick: function () { handleSelect(template); },
        type: "button",
        role: "option",
        "aria-selected": isSelected,
      },
        React.createElement("div", { className: styles.templateIcon }, template.icon),
        React.createElement("div", { className: styles.templateName }, template.name),
        React.createElement("div", { className: styles.templateDesc }, template.description),
        React.createElement("span", { className: styles.templateBadge }, template.category)
      )
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("p", { className: styles.stepDescription },
      "Select a template to pre-configure your search experience. You can customize every setting in the following steps."
    ),
    React.createElement("div", { className: styles.categoryFilter }, categoryChips),
    React.createElement("div", {
      className: styles.templateGrid,
      role: "listbox",
      "aria-label": "Search templates",
    }, cards)
  );
};

export default TemplatesStep;
