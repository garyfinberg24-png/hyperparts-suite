import * as React from "react";
import type { IPollResults, IPollQuestionResults, ChartType, IChartData } from "../models";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import DonutChart from "./charts/DonutChart";
import styles from "./HyperPollResults.module.scss";

export interface IHyperPollResultsProps {
  results: IPollResults;
  chartType: ChartType;
}

function buildChartData(qResult: IPollQuestionResults): IChartData[] {
  const data: IChartData[] = [];
  qResult.optionResults.forEach(function (opt) {
    data.push({
      label: opt.text,
      value: opt.count,
      percentage: opt.percentage,
      color: opt.color,
    });
  });
  return data;
}

const HyperPollResults: React.FC<IHyperPollResultsProps> = function (props) {
  if (!props.results || props.results.questionResults.length === 0) {
    return React.createElement("div", { className: styles.noResults }, "No results available yet.");
  }

  const questionElements: React.ReactElement[] = [];

  props.results.questionResults.forEach(function (qResult, idx) {
    const children: React.ReactElement[] = [];

    children.push(
      React.createElement("p", { key: "header", className: styles.questionResultHeader }, qResult.questionText)
    );

    children.push(
      React.createElement("span", { key: "total", className: styles.totalVotes }, qResult.totalVotes + " responses")
    );

    // Score display for rating/nps
    if (qResult.questionType === "rating" && qResult.averageScore !== undefined) {
      children.push(
        React.createElement(
          "div",
          { key: "score", className: styles.scoreDisplay },
          "Average: " + qResult.averageScore.toFixed(1)
        )
      );
    }

    if (qResult.questionType === "nps" && qResult.npsScore !== undefined) {
      children.push(
        React.createElement(
          "div",
          { key: "nps", className: styles.scoreDisplay },
          "NPS Score: " + qResult.npsScore
        )
      );
    }

    // Chart for questions with options
    if (qResult.optionResults.length > 0) {
      const chartData = buildChartData(qResult);
      const ariaLabel = qResult.questionText + " results";

      if (props.chartType === "pie") {
        children.push(
          React.createElement(PieChart, { key: "chart", data: chartData, ariaLabel: ariaLabel })
        );
      } else if (props.chartType === "donut") {
        children.push(
          React.createElement(DonutChart, {
            key: "chart",
            data: chartData,
            totalVotes: qResult.totalVotes,
            ariaLabel: ariaLabel,
          })
        );
      } else {
        children.push(
          React.createElement(BarChart, { key: "chart", data: chartData, ariaLabel: ariaLabel })
        );
      }
    }

    // Text responses
    if (qResult.textResponses.length > 0) {
      const textItems: React.ReactElement[] = [];
      qResult.textResponses.forEach(function (text, ti) {
        textItems.push(
          React.createElement("div", { key: ti, className: styles.textResponseItem }, text)
        );
      });
      children.push(
        React.createElement("div", { key: "texts", className: styles.textResponsesList }, textItems)
      );
    }

    questionElements.push(
      React.createElement(
        "div",
        { key: idx, className: styles.questionResult },
        children
      )
    );
  });

  return React.createElement(
    "div",
    { className: styles.resultsContainer },
    questionElements
  );
};

export default HyperPollResults;
