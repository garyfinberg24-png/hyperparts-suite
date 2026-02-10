import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { ITickerWizardState } from "../../models/ITickerWizardState";
import type { TickerDataSource } from "../../models";
import styles from "./WizardSteps.module.scss";

interface ISourceOption {
  key: TickerDataSource;
  icon: string;
  label: string;
  desc: string;
}

const SOURCE_OPTIONS: ISourceOption[] = [
  { key: "manual", icon: "\u270F\uFE0F", label: "Manual Items", desc: "Add items directly in the property pane" },
  { key: "spList", icon: "\uD83D\uDCCB", label: "SharePoint List", desc: "Pull from an existing SP list" },
  { key: "rss", icon: "\uD83D\uDCE1", label: "RSS Feed", desc: "Fetch from an external RSS feed" },
  { key: "graph", icon: "\uD83D\uDD17", label: "Microsoft Graph", desc: "Query data via Graph API" },
  { key: "restApi", icon: "\uD83C\uDF10", label: "REST API", desc: "Fetch from an external API" },
];

const DataSourceStep: React.FC<IWizardStepProps<ITickerWizardState>> = function (props) {
  const onChange = props.onChange;
  const state = props.state;

  const sourceCards: React.ReactElement[] = [];

  SOURCE_OPTIONS.forEach(function (opt) {
    const isSelected = state.dataSource === opt.key;
    const cardClass = isSelected ? styles.radioCardSelected : styles.radioCard;

    sourceCards.push(
      React.createElement("button", {
        key: opt.key,
        className: cardClass,
        onClick: function () { onChange({ dataSource: opt.key }); },
        type: "button",
        role: "option",
        "aria-selected": isSelected,
        "aria-label": opt.label,
      },
        React.createElement("div", { className: styles.radioCardIcon, "aria-hidden": "true" }, opt.icon),
        React.createElement("div", { className: styles.radioCardName }, opt.label),
        React.createElement("div", { className: styles.radioCardDesc }, opt.desc)
      )
    );
  });

  // Conditional sub-fields
  const subFields: React.ReactElement[] = [];

  if (state.dataSource === "spList") {
    subFields.push(
      React.createElement("div", { key: "list", className: styles.subFieldArea },
        React.createElement("div", { className: styles.fieldRow },
          React.createElement("label", { className: styles.fieldLabel }, "List Name"),
          React.createElement("input", {
            className: styles.textInput,
            type: "text",
            value: state.listName,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              onChange({ listName: e.target.value });
            },
            placeholder: "e.g., Ticker Items",
          })
        )
      )
    );
  }

  if (state.dataSource === "rss") {
    subFields.push(
      React.createElement("div", { key: "rss", className: styles.subFieldArea },
        React.createElement("div", { className: styles.fieldRow },
          React.createElement("label", { className: styles.fieldLabel }, "RSS Feed URL"),
          React.createElement("input", {
            className: styles.textInput,
            type: "text",
            value: state.rssUrl,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              onChange({ rssUrl: e.target.value });
            },
            placeholder: "https://example.com/feed.xml",
          })
        )
      )
    );
  }

  if (state.dataSource === "graph") {
    subFields.push(
      React.createElement("div", { key: "graph", className: styles.subFieldArea },
        React.createElement("div", { className: styles.fieldRow },
          React.createElement("label", { className: styles.fieldLabel }, "Graph API Endpoint"),
          React.createElement("input", {
            className: styles.textInput,
            type: "text",
            value: state.graphEndpoint,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              onChange({ graphEndpoint: e.target.value });
            },
            placeholder: "/sites/{site-id}/lists/{list-id}/items",
          })
        )
      )
    );
  }

  if (state.dataSource === "restApi") {
    subFields.push(
      React.createElement("div", { key: "api", className: styles.subFieldArea },
        React.createElement("div", { className: styles.fieldRow },
          React.createElement("label", { className: styles.fieldLabel }, "API URL"),
          React.createElement("input", {
            className: styles.textInput,
            type: "text",
            value: state.restApiUrl,
            onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
              onChange({ restApiUrl: e.target.value });
            },
            placeholder: "https://api.example.com/ticker",
          })
        ),
        React.createElement("div", { className: styles.fieldRow },
          React.createElement("label", { className: styles.fieldLabel }, "Custom Headers (JSON)"),
          React.createElement("textarea", {
            className: styles.textArea,
            value: state.restApiHeaders,
            onChange: function (e: React.ChangeEvent<HTMLTextAreaElement>) {
              onChange({ restApiHeaders: e.target.value });
            },
            placeholder: '{"Authorization": "Bearer ..."}',
            rows: 3,
          })
        )
      )
    );
  }

  return React.createElement("div", { className: styles.stepContainer },
    React.createElement("div", { className: styles.stepSection },
      React.createElement("div", { className: styles.stepSectionLabel }, "Choose a Data Source"),
      React.createElement("div", {
        className: styles.radioCardGrid,
        role: "listbox",
        "aria-label": "Data sources",
      }, sourceCards)
    ),
    subFields.length > 0
      ? React.createElement("div", { className: styles.stepSection }, subFields)
      : undefined
  );
};

export default DataSourceStep;
