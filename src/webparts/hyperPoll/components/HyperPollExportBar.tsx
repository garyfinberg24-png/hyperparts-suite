import * as React from "react";
import type { IHyperPoll, IPollResults } from "../models";
import { exportPollToCsv, exportPollToJson } from "../utils/exportUtils";
import styles from "./HyperPollExportBar.module.scss";

export interface IHyperPollExportBarProps {
  poll: IHyperPoll;
  results: IPollResults | undefined;
  enabled: boolean;
}

const HyperPollExportBar: React.FC<IHyperPollExportBarProps> = function (props) {
  if (!props.enabled || !props.results) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const handleCsvExport = function (): void {
    if (props.results) {
      exportPollToCsv(props.poll, props.results);
    }
  };

  const handleJsonExport = function (): void {
    if (props.results) {
      exportPollToJson(props.poll, props.results);
    }
  };

  return React.createElement(
    "div",
    { className: styles.exportBar },
    React.createElement(
      "button",
      {
        type: "button",
        className: styles.exportButton,
        onClick: handleCsvExport,
        "aria-label": "Export results as CSV",
      },
      "Export CSV"
    ),
    React.createElement(
      "button",
      {
        type: "button",
        className: styles.exportButton,
        onClick: handleJsonExport,
        "aria-label": "Export results as JSON",
      },
      "Export JSON"
    )
  );
};

export default HyperPollExportBar;
