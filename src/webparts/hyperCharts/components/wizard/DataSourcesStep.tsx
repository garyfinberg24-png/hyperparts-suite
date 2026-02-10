import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IChartsWizardState } from "../../models/IHyperChartsWizardState";
import type { IWizardDataSource } from "../../models/IHyperChartsWizardState";
import type { DataSourceType, AggregationFn } from "../../models/IHyperChartsEnums";
import { DEFAULT_WIZARD_DATA_SOURCE } from "../../models/IHyperChartsWizardState";
import styles from "./WizardSteps.module.scss";

// ============================================================
// Step 2: Data Sources
// ============================================================

var SOURCE_TYPE_LABELS: Record<string, string> = {
  spList: "SharePoint List",
  excel: "Excel Workbook",
  manual: "Manual Data",
};

var SOURCE_TYPE_ICONS: Record<string, string> = {
  spList: "\uD83D\uDCCB",
  excel: "\uD83D\uDCD7",
  manual: "\u270F\uFE0F",
};

var AGGREGATION_OPTIONS: Array<{ key: AggregationFn; label: string }> = [
  { key: "count", label: "Count" },
  { key: "sum", label: "Sum" },
  { key: "average", label: "Average" },
  { key: "min", label: "Minimum" },
  { key: "max", label: "Maximum" },
];

var DataSourcesStep: React.FC<IWizardStepProps<IChartsWizardState>> = function (props) {
  var state = props.state;
  var showMenu = React.useState(false);
  var isMenuOpen = showMenu[0];
  var setMenuOpen = showMenu[1];

  var handleAddSource = React.useCallback(function (type: DataSourceType) {
    var newSource: IWizardDataSource = {
      type: type,
      listName: DEFAULT_WIZARD_DATA_SOURCE.listName,
      siteUrl: DEFAULT_WIZARD_DATA_SOURCE.siteUrl,
      fileUrl: DEFAULT_WIZARD_DATA_SOURCE.fileUrl,
      sheetName: DEFAULT_WIZARD_DATA_SOURCE.sheetName,
      range: DEFAULT_WIZARD_DATA_SOURCE.range,
      categoryField: DEFAULT_WIZARD_DATA_SOURCE.categoryField,
      valueField: DEFAULT_WIZARD_DATA_SOURCE.valueField,
      aggregation: DEFAULT_WIZARD_DATA_SOURCE.aggregation,
    };
    var updated: IWizardDataSource[] = [];
    state.dataSources.forEach(function (s) { updated.push(s); });
    updated.push(newSource);
    props.onChange({ dataSources: updated });
    setMenuOpen(false);
  }, [state.dataSources, props]);

  var handleRemoveSource = React.useCallback(function (index: number) {
    var updated: IWizardDataSource[] = [];
    state.dataSources.forEach(function (s, i) {
      if (i !== index) updated.push(s);
    });
    props.onChange({ dataSources: updated });
  }, [state.dataSources, props]);

  var handleFieldChange = React.useCallback(function (index: number, field: string, value: string) {
    var updated: IWizardDataSource[] = [];
    state.dataSources.forEach(function (s, i) {
      if (i === index) {
        var copy: Record<string, unknown> = {};
        Object.keys(s).forEach(function (k) { copy[k] = (s as unknown as Record<string, unknown>)[k]; });
        copy[field] = value;
        updated.push(copy as unknown as IWizardDataSource);
      } else {
        updated.push(s);
      }
    });
    props.onChange({ dataSources: updated });
  }, [state.dataSources, props]);

  // Build source cards
  var sourceCards = state.dataSources.map(function (src, idx) {
    var typeLabel = SOURCE_TYPE_LABELS[src.type] || src.type;
    var typeIcon = SOURCE_TYPE_ICONS[src.type] || "\uD83D\uDCC1";

    var bodyFields: React.ReactNode[] = [];

    if (src.type === "spList") {
      bodyFields.push(
        React.createElement("div", { key: "listName", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "List Name"),
          React.createElement("input", {
            className: styles.sourceFieldInput,
            type: "text",
            value: src.listName,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "listName", e.target.value); },
            placeholder: "e.g. Sales Data",
          })
        )
      );
      bodyFields.push(
        React.createElement("div", { key: "siteUrl", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Site URL (blank = current site)"),
          React.createElement("input", {
            className: styles.sourceFieldInput,
            type: "text",
            value: src.siteUrl,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "siteUrl", e.target.value); },
            placeholder: "https://contoso.sharepoint.com/sites/data",
          })
        )
      );
      bodyFields.push(
        React.createElement("div", { key: "cols", className: styles.twoColRow },
          React.createElement("div", { className: styles.sourceFieldRow },
            React.createElement("label", { className: styles.sourceFieldLabel }, "Category Column (X-Axis)"),
            React.createElement("input", {
              className: styles.sourceFieldInput,
              type: "text",
              value: src.categoryField,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "categoryField", e.target.value); },
              placeholder: "e.g. Department",
            })
          ),
          React.createElement("div", { className: styles.sourceFieldRow },
            React.createElement("label", { className: styles.sourceFieldLabel }, "Value Column (Y-Axis)"),
            React.createElement("input", {
              className: styles.sourceFieldInput,
              type: "text",
              value: src.valueField,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "valueField", e.target.value); },
              placeholder: "e.g. Amount",
            })
          )
        )
      );
      bodyFields.push(
        React.createElement("div", { key: "agg", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Aggregation"),
          React.createElement("select", {
            className: styles.selectInput,
            value: src.aggregation,
            onChange: function (e: React.ChangeEvent<HTMLSelectElement>) { handleFieldChange(idx, "aggregation", e.target.value); },
          }, AGGREGATION_OPTIONS.map(function (opt) {
            return React.createElement("option", { key: opt.key, value: opt.key }, opt.label);
          }))
        )
      );
    }

    if (src.type === "excel") {
      bodyFields.push(
        React.createElement("div", { key: "fileUrl", className: styles.sourceFieldRow },
          React.createElement("label", { className: styles.sourceFieldLabel }, "Excel File URL"),
          React.createElement("input", {
            className: styles.sourceFieldInput,
            type: "text",
            value: src.fileUrl,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "fileUrl", e.target.value); },
            placeholder: "/sites/data/Shared Documents/Report.xlsx",
          })
        )
      );
      bodyFields.push(
        React.createElement("div", { key: "sheet", className: styles.twoColRow },
          React.createElement("div", { className: styles.sourceFieldRow },
            React.createElement("label", { className: styles.sourceFieldLabel }, "Sheet Name"),
            React.createElement("input", {
              className: styles.sourceFieldInput,
              type: "text",
              value: src.sheetName,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "sheetName", e.target.value); },
              placeholder: "Sheet1",
            })
          ),
          React.createElement("div", { className: styles.sourceFieldRow },
            React.createElement("label", { className: styles.sourceFieldLabel }, "Cell Range"),
            React.createElement("input", {
              className: styles.sourceFieldInput,
              type: "text",
              value: src.range,
              onChange: function (e: React.ChangeEvent<HTMLInputElement>) { handleFieldChange(idx, "range", e.target.value); },
              placeholder: "A1:D20",
            })
          )
        )
      );
    }

    if (src.type === "manual") {
      bodyFields.push(
        React.createElement("div", { key: "hint", className: styles.stepSectionHint },
          "Manual data will use default sample values. You can customize the data in the property pane after the wizard."
        )
      );
    }

    return React.createElement("div", { key: idx, className: styles.sourceCard },
      React.createElement("div", { className: styles.sourceCardHeader },
        React.createElement("span", { className: styles.sourceCardIcon, "aria-hidden": "true" }, typeIcon),
        React.createElement("span", { className: styles.sourceCardType }, "Source " + String(idx + 1) + ": " + typeLabel),
        React.createElement("div", { className: styles.sourceCardActions },
          React.createElement("button", {
            className: styles.sourceRemoveBtn,
            onClick: function () { handleRemoveSource(idx); },
            type: "button",
            "aria-label": "Remove source " + String(idx + 1),
          }, "Remove")
        )
      ),
      React.createElement("div", { className: styles.sourceCardBody }, bodyFields)
    );
  });

  // Add source menu
  var addSourceMenuEl: React.ReactNode = isMenuOpen
    ? React.createElement("div", { className: styles.addSourceMenu },
        React.createElement("button", {
          className: styles.addSourceMenuItem,
          onClick: function () { handleAddSource("spList"); },
          type: "button",
        },
          React.createElement("span", { className: styles.addSourceMenuIcon, "aria-hidden": "true" }, "\uD83D\uDCCB"),
          "SharePoint List"
        ),
        React.createElement("button", {
          className: styles.addSourceMenuItem,
          onClick: function () { handleAddSource("excel"); },
          type: "button",
        },
          React.createElement("span", { className: styles.addSourceMenuIcon, "aria-hidden": "true" }, "\uD83D\uDCD7"),
          "Excel Workbook"
        ),
        React.createElement("button", {
          className: styles.addSourceMenuItem,
          onClick: function () { handleAddSource("manual"); },
          type: "button",
        },
          React.createElement("span", { className: styles.addSourceMenuIcon, "aria-hidden": "true" }, "\u270F\uFE0F"),
          "Manual Data"
        )
      )
    : undefined;

  // Empty state
  var emptyEl = state.dataSources.length === 0
    ? React.createElement("div", { className: styles.emptySources },
        React.createElement("div", { className: styles.emptySourcesIcon, "aria-hidden": "true" }, "\uD83D\uDCC1"),
        React.createElement("div", { className: styles.emptySourcesText }, "No data sources configured yet. Add at least one to continue.")
      )
    : undefined;

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Data Sources"),
      React.createElement("div", { className: styles.stepSectionHint },
        "Connect to SharePoint lists, Excel workbooks, or enter data manually. Each chart tile will reference one of these sources."
      )
    ),
    emptyEl,
    React.createElement("div", { className: styles.sourcesList }, sourceCards),
    React.createElement("div", { className: styles.addSourceArea },
      React.createElement("button", {
        className: styles.addSourceBtn,
        onClick: function () { setMenuOpen(!isMenuOpen); },
        type: "button",
      }, isMenuOpen ? "\u2715 Cancel" : "+ Add Data Source"),
      addSourceMenuEl
    )
  );
};

export default DataSourcesStep;
