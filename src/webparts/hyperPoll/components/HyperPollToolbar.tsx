import * as React from "react";
import type { IHyperPoll, ChartType, IPollResults } from "../models";
import HyperPollStatusBadge from "./HyperPollStatusBadge";
import ChartTypeSelector from "./charts/ChartTypeSelector";
import HyperPollExportBar from "./HyperPollExportBar";
import styles from "./HyperPollToolbar.module.scss";

export interface IHyperPollToolbarProps {
  title: string;
  poll: IHyperPoll | undefined;
  results: IPollResults | undefined;
  activeChartType: ChartType;
  onChartTypeChange: (chartType: ChartType) => void;
  enableExport: boolean;
}

const HyperPollToolbar: React.FC<IHyperPollToolbarProps> = function (props) {
  return React.createElement(
    "div",
    { className: styles.toolbar },
    React.createElement(
      "div",
      { className: styles.toolbarLeft },
      React.createElement("h2", { className: styles.toolbarTitle }, props.title || "Poll"),
      props.poll
        ? React.createElement(HyperPollStatusBadge, { status: props.poll.status })
        : undefined
    ),
    React.createElement(
      "div",
      { className: styles.toolbarRight },
      React.createElement(ChartTypeSelector, {
        activeType: props.activeChartType,
        onChange: props.onChartTypeChange,
      }),
      props.poll
        ? React.createElement(HyperPollExportBar, {
            poll: props.poll,
            results: props.results,
            enabled: props.enableExport,
          })
        : undefined
    )
  );
};

export default HyperPollToolbar;
