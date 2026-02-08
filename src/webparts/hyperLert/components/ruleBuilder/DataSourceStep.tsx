import * as React from "react";
import type { IAlertDataSource, DataSourceType } from "../../models";
import { parseDataSource, stringifyDataSource, DEFAULT_SP_SOURCE, DEFAULT_GRAPH_SOURCE } from "../../models";
import styles from "./DataSourceStep.module.scss";

export interface IDataSourceStepProps {
  dataSourceJson: string;
  onDataSourceChange: (json: string) => void;
}

const DataSourceStep: React.FC<IDataSourceStepProps> = function (stepProps) {
  const source = parseDataSource(stepProps.dataSourceJson);
  const sourceType = source.type;

  const handleTypeChange = React.useCallback(function (newType: DataSourceType) {
    let newSource: IAlertDataSource;
    if (newType === "spList") {
      newSource = { ...DEFAULT_SP_SOURCE };
    } else {
      newSource = { ...DEFAULT_GRAPH_SOURCE };
    }
    stepProps.onDataSourceChange(stringifyDataSource(newSource));
  }, [stepProps.onDataSourceChange]);

  const updateField = React.useCallback(function (field: string, value: string | number | string[]) {
    const updated = { ...source };
    (updated as Record<string, unknown>)[field] = value;
    stepProps.onDataSourceChange(stringifyDataSource(updated as IAlertDataSource));
  }, [source, stepProps.onDataSourceChange]);

  // Type selector cards
  const typeSelector = React.createElement(
    "div",
    { className: styles.typeSelector },
    React.createElement(
      "div",
      {
        className: sourceType === "spList" ? styles.typeCardActive : styles.typeCard,
        onClick: function () { handleTypeChange("spList"); },
        role: "radio",
        "aria-checked": sourceType === "spList",
        tabIndex: 0,
      },
      React.createElement("div", { className: styles.typeName }, "SharePoint List"),
      React.createElement("div", { className: styles.typeDesc }, "Monitor items in a SharePoint list")
    ),
    React.createElement(
      "div",
      {
        className: sourceType === "graphApi" ? styles.typeCardActive : styles.typeCard,
        onClick: function () { handleTypeChange("graphApi"); },
        role: "radio",
        "aria-checked": sourceType === "graphApi",
        tabIndex: 0,
      },
      React.createElement("div", { className: styles.typeName }, "Graph API"),
      React.createElement("div", { className: styles.typeDesc }, "Monitor Microsoft Graph data")
    )
  );

  // SP List fields
  const spListFields = sourceType === "spList"
    ? React.createElement(
        React.Fragment,
        undefined,
        React.createElement(
          "div",
          { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "List Name"),
          React.createElement("input", {
            className: styles.input,
            type: "text",
            value: source.type === "spList" ? source.listName : "",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateField("listName", e.target.value); },
            placeholder: "e.g., Tasks, Projects",
          })
        ),
        React.createElement(
          "div",
          { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "Site URL (blank = current site)"),
          React.createElement("input", {
            className: styles.input,
            type: "text",
            value: source.type === "spList" ? source.siteUrl : "",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateField("siteUrl", e.target.value); },
            placeholder: "https://contoso.sharepoint.com/sites/hr",
          })
        ),
        React.createElement(
          "div",
          { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "Select Fields (comma-separated)"),
          React.createElement("input", {
            className: styles.input,
            type: "text",
            value: source.type === "spList" ? source.selectFields.join(", ") : "",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              const fields = e.target.value.split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
              updateField("selectFields", fields);
            },
            placeholder: "Title, Status, DueDate",
          })
        ),
        React.createElement(
          "div",
          { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "OData Filter Expression"),
          React.createElement("input", {
            className: styles.input,
            type: "text",
            value: source.type === "spList" ? source.filterExpression : "",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateField("filterExpression", e.target.value); },
            placeholder: "Status eq 'Active'",
          })
        ),
        React.createElement(
          "div",
          { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "Max Items to Fetch"),
          React.createElement("input", {
            className: styles.input,
            type: "number",
            value: source.type === "spList" ? String(source.top) : "500",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateField("top", parseInt(e.target.value, 10) || 500); },
            min: 1,
            max: 5000,
          })
        )
      )
    : undefined;

  // Graph API fields
  const graphFields = sourceType === "graphApi"
    ? React.createElement(
        React.Fragment,
        undefined,
        React.createElement(
          "div",
          { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "Graph API Endpoint"),
          React.createElement("input", {
            className: styles.input,
            type: "text",
            value: source.type === "graphApi" ? source.endpoint : "",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) { updateField("endpoint", e.target.value); },
            placeholder: "/me/presence, /me/calendar/events",
          }),
          React.createElement("span", { className: styles.hint }, "The Graph API path to query (e.g., /me/presence)")
        ),
        React.createElement(
          "div",
          { className: styles.fieldGroup },
          React.createElement("label", { className: styles.label }, "Select Fields (comma-separated)"),
          React.createElement("input", {
            className: styles.input,
            type: "text",
            value: source.type === "graphApi" ? source.selectFields.join(", ") : "",
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              const fields = e.target.value.split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
              updateField("selectFields", fields);
            },
            placeholder: "availability, activity",
          })
        )
      )
    : undefined;

  return React.createElement(
    "div",
    { className: styles.form },
    React.createElement("div", { className: styles.fieldGroup },
      React.createElement("label", { className: styles.label }, "Data Source Type")
    ),
    typeSelector,
    spListFields,
    graphFields
  );
};

export default DataSourceStep;
