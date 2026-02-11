import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ISearchWizardState } from "../../models/IHyperSearchWizardState";
import type { ResultLayoutMode } from "../../models/IHyperSearchV2";
import styles from "./WizardSteps.module.scss";

/** Layout option definitions */
var LAYOUT_OPTIONS: Array<{ key: ResultLayoutMode; name: string; icon: string; desc: string }> = [
  { key: "listRich", name: "Rich List", icon: "\uD83D\uDCC4", desc: "Detailed result cards with thumbnails, metadata, and actions" },
  { key: "listCompact", name: "Compact List", icon: "\uD83D\uDCCB", desc: "Dense list maximizing results per page" },
  { key: "cardGrid", name: "Card Grid", icon: "\uD83D\uDDBC\uFE0F", desc: "Visual grid of cards with large thumbnails" },
  { key: "magazine", name: "Magazine", icon: "\uD83D\uDCF0", desc: "Editorial layout with featured hero result" },
  { key: "table", name: "Table", icon: "\uD83D\uDCCA", desc: "Spreadsheet-style with sortable columns" },
  { key: "peopleGrid", name: "People Grid", icon: "\uD83D\uDC65", desc: "Optimized layout for people search results" },
  { key: "mediaGallery", name: "Media Gallery", icon: "\uD83C\uDFA5", desc: "Gallery view for images, videos, and documents" },
  { key: "conversation", name: "Conversation", icon: "\uD83D\uDDE8\uFE0F", desc: "Chat-style layout for Teams/email results" },
  { key: "timeline", name: "Timeline", icon: "\u23F3", desc: "Chronological view grouped by date" },
  { key: "previewPanel", name: "Preview Panel", icon: "\uD83D\uDCC2", desc: "Split view with result list and preview pane" },
];

var ResultStylesStep: React.FC<IWizardStepProps<ISearchWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;

  var handleSelect = function (layout: ResultLayoutMode): void {
    onChange({ resultLayout: layout });
  };

  // Build layout cards
  var cards: React.ReactElement[] = [];
  LAYOUT_OPTIONS.forEach(function (opt) {
    var isSelected = state.resultLayout === opt.key;
    cards.push(
      React.createElement("button", {
        key: opt.key,
        className: isSelected ? styles.layoutCardSelected : styles.layoutCard,
        onClick: function () { handleSelect(opt.key); },
        type: "button",
        role: "option",
        "aria-selected": isSelected,
      },
        React.createElement("div", { className: styles.layoutCardIcon }, opt.icon),
        React.createElement("div", { className: styles.layoutCardName }, opt.name),
        React.createElement("div", { className: styles.layoutCardDesc }, opt.desc)
      )
    );
  });

  // Build results-per-page selector
  var rppOptions: React.ReactElement[] = [];
  [5, 10, 15, 20, 25, 50].forEach(function (n) {
    rppOptions.push(
      React.createElement("option", { key: n, value: n }, String(n))
    );
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("p", { className: styles.stepDescription },
      "Choose how search results are presented. Each layout is designed for different content types and use cases."
    ),
    React.createElement("div", {
      className: styles.layoutGrid,
      role: "listbox",
      "aria-label": "Result layouts",
    }, cards),
    // Results per page
    React.createElement("div", { className: styles.selectRow, style: { marginTop: 12 } },
      React.createElement("span", { className: styles.selectLabel }, "Results Per Page"),
      React.createElement("select", {
        className: styles.selectInput,
        value: state.resultsPerPage,
        onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
          onChange({ resultsPerPage: parseInt(e.target.value, 10) });
        },
      }, rppOptions)
    )
  );
};

export default ResultStylesStep;
