import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ISearchWizardState } from "../../models/IHyperSearchWizardState";
import type { ISearchV2Features } from "../../models/IHyperSearchV2";
import styles from "./WizardSteps.module.scss";

/** Feature definition for display */
interface IFeatureDef {
  key: keyof ISearchV2Features;
  label: string;
  desc: string;
  icon: string;
}

var FEATURE_DEFS: IFeatureDef[] = [
  { key: "instantSearch", label: "Instant Search", desc: "Results appear as you type, no Enter key needed", icon: "\u26A1" },
  { key: "smartAutocomplete", label: "Smart Autocomplete", desc: "AI-powered query suggestions with context awareness", icon: "\uD83E\uDDE0" },
  { key: "searchVerticals", label: "Search Verticals", desc: "Tab-based scope switching above results", icon: "\uD83D\uDD00" },
  { key: "zeroQuery", label: "Zero Query", desc: "Show trending and recent content before any search", icon: "\uD83D\uDD25" },
  { key: "spellingCorrection", label: "Spelling Correction", desc: "Auto-correct typos and suggest alternatives", icon: "\u2705" },
  { key: "nlpParsing", label: "Natural Language", desc: "Understand natural language queries like 'files from last week'", icon: "\uD83D\uDDE3\uFE0F" },
  { key: "savedSearches", label: "Saved Searches", desc: "Let users bookmark and reuse frequent queries", icon: "\uD83D\uDD16" },
  { key: "commandPalette", label: "Command Palette", desc: "Ctrl+K keyboard shortcut to invoke search overlay", icon: "\u2328\uFE0F" },
  { key: "inlinePreview", label: "Inline Preview", desc: "Hover to preview documents without opening them", icon: "\uD83D\uDC41\uFE0F" },
  { key: "peopleCards", label: "People Cards", desc: "Rich profile cards on hover for person results", icon: "\uD83D\uDC64" },
  { key: "quickActions", label: "Quick Actions", desc: "Email, Chat, Copy Link buttons on each result", icon: "\uD83D\uDE80" },
  { key: "hitHighlight", label: "Hit Highlighting", desc: "Bold matching terms in result snippets", icon: "\uD83D\uDD06" },
  { key: "resultGrouping", label: "Result Grouping", desc: "Group results by site, type, or date", icon: "\uD83D\uDDC2\uFE0F" },
  { key: "thumbnailPreviews", label: "Thumbnail Previews", desc: "Show document thumbnails and page previews", icon: "\uD83D\uDDBC\uFE0F" },
];

var FeaturesStep: React.FC<IWizardStepProps<ISearchWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;
  var features = state.features;

  var handleToggle = function (key: keyof ISearchV2Features): void {
    var updated: ISearchV2Features = {
      instantSearch: features.instantSearch,
      smartAutocomplete: features.smartAutocomplete,
      searchVerticals: features.searchVerticals,
      zeroQuery: features.zeroQuery,
      spellingCorrection: features.spellingCorrection,
      nlpParsing: features.nlpParsing,
      savedSearches: features.savedSearches,
      commandPalette: features.commandPalette,
      inlinePreview: features.inlinePreview,
      peopleCards: features.peopleCards,
      quickActions: features.quickActions,
      hitHighlight: features.hitHighlight,
      resultGrouping: features.resultGrouping,
      thumbnailPreviews: features.thumbnailPreviews,
    };
    (updated as unknown as Record<string, boolean>)[key] = !(features as unknown as Record<string, boolean>)[key];
    onChange({ features: updated });
  };

  var handleEnableAll = function (): void {
    onChange({
      features: {
        instantSearch: true,
        smartAutocomplete: true,
        searchVerticals: true,
        zeroQuery: true,
        spellingCorrection: true,
        nlpParsing: true,
        savedSearches: true,
        commandPalette: true,
        inlinePreview: true,
        peopleCards: true,
        quickActions: true,
        hitHighlight: true,
        resultGrouping: true,
        thumbnailPreviews: true,
      },
    });
  };

  var handleDisableAll = function (): void {
    onChange({
      features: {
        instantSearch: false,
        smartAutocomplete: false,
        searchVerticals: false,
        zeroQuery: false,
        spellingCorrection: false,
        nlpParsing: false,
        savedSearches: false,
        commandPalette: false,
        inlinePreview: false,
        peopleCards: false,
        quickActions: false,
        hitHighlight: false,
        resultGrouping: false,
        thumbnailPreviews: false,
      },
    });
  };

  // Build toggle elements
  var toggleElements: React.ReactElement[] = [];
  FEATURE_DEFS.forEach(function (feat) {
    var isChecked = (features as unknown as Record<string, boolean>)[feat.key];
    toggleElements.push(
      React.createElement("label", { key: feat.key, className: styles.toggleRow },
        React.createElement("span", { className: styles.toggleIcon }, feat.icon),
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, feat.label),
          React.createElement("span", { className: styles.toggleDesc }, feat.desc)
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            checked: isChecked,
            onChange: function () { handleToggle(feat.key); },
          }),
          React.createElement("span", { className: styles.toggleTrack },
            React.createElement("span", { className: styles.toggleThumb })
          )
        )
      )
    );
  });

  // Count enabled
  var enabledCount = 0;
  FEATURE_DEFS.forEach(function (feat) {
    if ((features as unknown as Record<string, boolean>)[feat.key]) enabledCount++;
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("p", { className: styles.stepDescription },
      String(enabledCount) + " of " + String(FEATURE_DEFS.length) + " features enabled. Toggle each feature on or off."
    ),
    // Bulk actions
    React.createElement("div", { className: styles.toggleBulkActions },
      React.createElement("button", {
        className: styles.bulkButton,
        onClick: handleEnableAll,
        type: "button",
      }, "Enable All"),
      React.createElement("button", {
        className: styles.bulkButton,
        onClick: handleDisableAll,
        type: "button",
      }, "Disable All")
    ),
    // Toggle list
    React.createElement("div", { className: styles.toggleList }, toggleElements)
  );
};

export default FeaturesStep;
