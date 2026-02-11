import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ISearchWizardState } from "../../models/IHyperSearchWizardState";
import type { ISearchV2Filters } from "../../models/IHyperSearchV2";
import styles from "./WizardSteps.module.scss";

/** Filter definition for display */
interface IFilterDef {
  key: keyof ISearchV2Filters;
  label: string;
  desc: string;
  icon: string;
}

var FILTER_DEFS: IFilterDef[] = [
  { key: "facetedFilters", label: "Faceted Filters", desc: "Dynamic filter chips based on result metadata", icon: "\uD83C\uDFF7\uFE0F" },
  { key: "dateRange", label: "Date Range", desc: "Filter by date modified, created, or custom range", icon: "\uD83D\uDCC5" },
  { key: "fileType", label: "File Type", desc: "Filter by document type (Word, Excel, PDF, etc.)", icon: "\uD83D\uDCC1" },
  { key: "authorFilter", label: "Author", desc: "Filter by content author or mentioned people", icon: "\u270D\uFE0F" },
  { key: "siteFilter", label: "Site / Source", desc: "Filter results by SharePoint site or source system", icon: "\uD83C\uDF10" },
  { key: "sizeFilter", label: "File Size", desc: "Filter by file size range (small, medium, large)", icon: "\uD83D\uDCCF" },
  { key: "contentType", label: "Content Type", desc: "Filter by SharePoint content types", icon: "\uD83D\uDCE6" },
  { key: "managedMetadata", label: "Managed Metadata", desc: "Filter by term store and taxonomy values", icon: "\uD83C\uDFF7\uFE0F" },
];

var FiltersStep: React.FC<IWizardStepProps<ISearchWizardState>> = function (props) {
  var state = props.state;
  var onChange = props.onChange;
  var filters = state.filters;

  var handleToggle = function (key: keyof ISearchV2Filters): void {
    var updated: ISearchV2Filters = {
      facetedFilters: filters.facetedFilters,
      dateRange: filters.dateRange,
      fileType: filters.fileType,
      authorFilter: filters.authorFilter,
      siteFilter: filters.siteFilter,
      sizeFilter: filters.sizeFilter,
      contentType: filters.contentType,
      managedMetadata: filters.managedMetadata,
    };
    (updated as unknown as Record<string, boolean>)[key] = !(filters as unknown as Record<string, boolean>)[key];
    onChange({ filters: updated });
  };

  var handleEnableAll = function (): void {
    onChange({
      filters: {
        facetedFilters: true,
        dateRange: true,
        fileType: true,
        authorFilter: true,
        siteFilter: true,
        sizeFilter: true,
        contentType: true,
        managedMetadata: true,
      },
    });
  };

  var handleDisableAll = function (): void {
    onChange({
      filters: {
        facetedFilters: false,
        dateRange: false,
        fileType: false,
        authorFilter: false,
        siteFilter: false,
        sizeFilter: false,
        contentType: false,
        managedMetadata: false,
      },
    });
  };

  // Build toggle elements
  var toggleElements: React.ReactElement[] = [];
  FILTER_DEFS.forEach(function (filt) {
    var isChecked = (filters as unknown as Record<string, boolean>)[filt.key];
    toggleElements.push(
      React.createElement("label", { key: filt.key, className: styles.toggleRow },
        React.createElement("span", { className: styles.toggleIcon }, filt.icon),
        React.createElement("div", { className: styles.toggleInfo },
          React.createElement("span", { className: styles.toggleLabel }, filt.label),
          React.createElement("span", { className: styles.toggleDesc }, filt.desc)
        ),
        React.createElement("div", { className: styles.toggleSwitch },
          React.createElement("input", {
            type: "checkbox",
            checked: isChecked,
            onChange: function () { handleToggle(filt.key); },
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
  FILTER_DEFS.forEach(function (filt) {
    if ((filters as unknown as Record<string, boolean>)[filt.key]) enabledCount++;
  });

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("p", { className: styles.stepDescription },
      String(enabledCount) + " of " + String(FILTER_DEFS.length) + " filter types enabled. The filter panel appears on the left side of search results."
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
    React.createElement("div", { className: styles.toggleList }, toggleElements),
    // Info box
    React.createElement("div", { className: styles.infoBox, style: { marginTop: 8 } },
      React.createElement("span", { className: styles.infoBoxIcon }, "\uD83D\uDCA1"),
      React.createElement("span", { className: styles.infoBoxText },
        "Managed Metadata filters require configured term sets in your SharePoint tenant. Content Type filters work best with consistent content type usage across sites."
      )
    )
  );
};

export default FiltersStep;
