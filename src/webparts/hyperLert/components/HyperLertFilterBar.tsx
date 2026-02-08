import * as React from "react";
import type { AlertSeverity, AlertStatus } from "../models";
import { ALL_SEVERITIES, ALL_STATUSES } from "../models";
import { useHyperLertStore } from "../store/useHyperLertStore";
import styles from "./HyperLertFilterBar.module.scss";

const HyperLertFilterBar: React.FC = function () {
  const filters = useHyperLertStore(function (s) { return s.filters; });
  const setSearchText = useHyperLertStore(function (s) { return s.setSearchText; });
  const setSeverityFilter = useHyperLertStore(function (s) { return s.setSeverityFilter; });
  const setStatusFilter = useHyperLertStore(function (s) { return s.setStatusFilter; });
  const clearFilters = useHyperLertStore(function (s) { return s.clearFilters; });

  const handleSearchChange = React.useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }, [setSearchText]);

  const handleSeverityChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>) {
    setSeverityFilter(e.target.value as AlertSeverity | "");
  }, [setSeverityFilter]);

  const handleStatusChange = React.useCallback(function (e: React.ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value as AlertStatus | "");
  }, [setStatusFilter]);

  // Severity options
  const severityOptions: React.ReactElement[] = [
    React.createElement("option", { key: "", value: "" }, "All Severities"),
  ];
  ALL_SEVERITIES.forEach(function (sev) {
    severityOptions.push(
      React.createElement("option", { key: sev, value: sev }, sev.charAt(0).toUpperCase() + sev.substring(1))
    );
  });

  // Status options
  const statusOptions: React.ReactElement[] = [
    React.createElement("option", { key: "", value: "" }, "All Statuses"),
  ];
  ALL_STATUSES.forEach(function (st) {
    statusOptions.push(
      React.createElement("option", { key: st, value: st }, st.charAt(0).toUpperCase() + st.substring(1))
    );
  });

  return React.createElement(
    "div",
    { className: styles.filterBar, role: "search", "aria-label": "Filter alert rules" },
    React.createElement("input", {
      className: styles.searchInput,
      type: "text",
      placeholder: "Search rules...",
      value: filters.searchText,
      onChange: handleSearchChange,
      "aria-label": "Search rules",
    }),
    React.createElement(
      "select",
      {
        className: styles.select,
        value: filters.severityFilter,
        onChange: handleSeverityChange,
        "aria-label": "Filter by severity",
      },
      severityOptions
    ),
    React.createElement(
      "select",
      {
        className: styles.select,
        value: filters.statusFilter,
        onChange: handleStatusChange,
        "aria-label": "Filter by status",
      },
      statusOptions
    ),
    React.createElement(
      "button",
      {
        className: styles.clearBtn,
        onClick: clearFilters,
        type: "button",
        "aria-label": "Clear all filters",
      },
      "Clear"
    )
  );
};

export default HyperLertFilterBar;
