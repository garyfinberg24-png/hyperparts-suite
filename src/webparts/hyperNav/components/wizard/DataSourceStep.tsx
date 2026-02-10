import * as React from "react";
import type { IWizardStepProps } from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperNavWizardState } from "../../models/IHyperNavWizardState";
import styles from "./DataSourceStep.module.scss";

var DATA_SOURCES = [
  { key: "manual", icon: "\u270F\uFE0F", title: "Manual Links", desc: "Add links one-by-one in the property pane" },
  { key: "spList", icon: "\uD83D\uDCCB", title: "SharePoint List", desc: "Connect to a SP list with Title, URL, Icon columns" },
  { key: "siteNav", icon: "\uD83C\uDFE0", title: "Site Navigation", desc: "Auto-read from the site's built-in navigation nodes" },
  { key: "json", icon: "\uD83D\uDCC4", title: "JSON Import", desc: "Paste or upload a JSON file with link definitions" },
];

const DataSourceStep: React.FC<IWizardStepProps<IHyperNavWizardState>> = function (props) {
  return React.createElement("div", { className: styles.dataSourceStep },
    React.createElement("h3", { className: styles.stepTitle }, "Where do your links come from?"),
    React.createElement("div", { className: styles.sourceGrid },
      DATA_SOURCES.map(function (src) {
        var isSelected = props.state.dataSource === src.key;
        return React.createElement("button", {
          key: src.key,
          className: styles.sourceCard + (isSelected ? " " + styles.sourceCardSelected : ""),
          onClick: function () {
            props.onChange({ dataSource: src.key as IHyperNavWizardState["dataSource"] });
          },
          type: "button",
          "aria-pressed": isSelected,
        },
          React.createElement("span", { className: styles.sourceIcon, "aria-hidden": "true" }, src.icon),
          React.createElement("div", { className: styles.sourceTitle }, src.title),
          React.createElement("div", { className: styles.sourceDesc }, src.desc)
        );
      })
    ),
    React.createElement("div", { className: styles.sampleToggle },
      React.createElement("label", { className: styles.toggleLabel },
        React.createElement("input", {
          type: "checkbox",
          checked: props.state.useSampleData,
          onChange: function (e: React.ChangeEvent<HTMLInputElement>) {
            props.onChange({ useSampleData: e.target.checked });
          },
        }),
        " Load 30+ sample links for preview"
      )
    )
  );
};

export default DataSourceStep;
