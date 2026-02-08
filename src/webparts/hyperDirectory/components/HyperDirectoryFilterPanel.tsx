import * as React from "react";
import type { IDirectoryFilterOptions, IHyperDirectoryFilter } from "../models";
import styles from "./HyperDirectoryFilterPanel.module.scss";

export interface IHyperDirectoryFilterPanelProps {
  filterOptions: IDirectoryFilterOptions;
  activeFilters: IHyperDirectoryFilter;
  onAddFilter: (category: keyof IDirectoryFilterOptions, value: string) => void;
  onRemoveFilter: (category: keyof IDirectoryFilterOptions, value: string) => void;
  onClearAll: () => void;
  labels: {
    departments: string;
    locations: string;
    titles: string;
    companies: string;
    clearAll: string;
  };
}

const HyperDirectoryFilterPanel: React.FC<IHyperDirectoryFilterPanelProps> = function (props) {
  const { filterOptions, activeFilters, onAddFilter, onRemoveFilter, onClearAll, labels } = props;

  const hasActiveFilters = activeFilters.departments.length > 0 ||
    activeFilters.locations.length > 0 ||
    activeFilters.titles.length > 0 ||
    activeFilters.companies.length > 0;

  const renderFilterGroup = function (
    category: keyof IDirectoryFilterOptions,
    label: string,
    options: string[],
    activeValues: string[]
  ): React.ReactElement | undefined {
    if (options.length === 0) {
      // eslint-disable-next-line @rushstack/no-new-null
      return null as unknown as React.ReactElement;
    }

    const chips = options.slice(0, 15).map(function (value) {
      const isActive = activeValues.indexOf(value) !== -1;
      const chipClass = styles.chip + (isActive ? " " + styles.chipActive : "");

      return React.createElement("button", {
        key: category + "_" + value,
        type: "button",
        className: chipClass,
        onClick: function () {
          if (isActive) {
            onRemoveFilter(category, value);
          } else {
            onAddFilter(category, value);
          }
        },
        "aria-pressed": isActive ? "true" : "false",
        role: "switch",
      }, value);
    });

    return React.createElement("div", { key: category, className: styles.filterGroup },
      React.createElement("span", { className: styles.filterGroupLabel }, label),
      React.createElement("div", { className: styles.chipContainer }, chips)
    );
  };

  const groups: React.ReactNode[] = [];

  const deptGroup = renderFilterGroup("departments", labels.departments, filterOptions.departments, activeFilters.departments);
  if (deptGroup) groups.push(deptGroup);

  const locGroup = renderFilterGroup("locations", labels.locations, filterOptions.locations, activeFilters.locations);
  if (locGroup) groups.push(locGroup);

  const titleGroup = renderFilterGroup("titles", labels.titles, filterOptions.titles, activeFilters.titles);
  if (titleGroup) groups.push(titleGroup);

  const companyGroup = renderFilterGroup("companies", labels.companies, filterOptions.companies, activeFilters.companies);
  if (companyGroup) groups.push(companyGroup);

  if (groups.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  return React.createElement("div", { className: styles.filterPanel, role: "group", "aria-label": "Filters" },
    hasActiveFilters
      ? React.createElement("div", { className: styles.filterHeader },
          React.createElement("span", { className: styles.filterTitle }, "Filters"),
          React.createElement("button", {
            type: "button",
            className: styles.clearAllButton,
            onClick: onClearAll,
          }, labels.clearAll)
        )
      : undefined,
    groups
  );
};

export default React.memo(HyperDirectoryFilterPanel);
