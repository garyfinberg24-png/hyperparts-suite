import * as React from "react";
import type { IHyperProfileUser } from "../models";
import type { CompletenessDisplayStyle } from "../models/IHyperProfileCompleteness";
import { calculateScore, getEncouragementMessage, getScoreColor } from "../utils/scoreCalculator";
import styles from "./HyperProfileCompleteness.module.scss";

export interface IHyperProfileCompletenessProps {
  profile: IHyperProfileUser;
  displayStyle: CompletenessDisplayStyle;
  fieldWeights?: Record<string, number>;
}

const HyperProfileCompleteness: React.FC<IHyperProfileCompletenessProps> = function (props) {
  const completeness = calculateScore(props.profile, props.fieldWeights);
  const color = getScoreColor(completeness.score);
  const message = getEncouragementMessage(completeness.score);

  if (props.displayStyle === "percentage") {
    return React.createElement("div", { className: styles.completeness, role: "status", "aria-label": "Profile " + completeness.score + "% complete" },
      React.createElement("span", { className: styles.percentageValue, style: { color: color } }, completeness.score + "%"),
      React.createElement("span", { className: styles.percentageLabel }, "Complete"),
      React.createElement("span", { className: styles.encouragement }, message)
    );
  }

  if (props.displayStyle === "progressBar") {
    return React.createElement("div", { className: styles.completeness, role: "status", "aria-label": "Profile " + completeness.score + "% complete" },
      React.createElement("div", { className: styles.progressBarContainer },
        React.createElement("div", { className: styles.progressBarLabel },
          React.createElement("span", undefined, "Profile Completeness"),
          React.createElement("span", { style: { color: color } }, completeness.score + "%")
        ),
        React.createElement("div", { className: styles.progressBarTrack },
          React.createElement("div", {
            className: styles.progressBarFill,
            style: { width: completeness.score + "%", backgroundColor: color },
            role: "progressbar",
            "aria-valuenow": completeness.score,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
          })
        ),
        React.createElement("span", { className: styles.encouragement }, message)
      )
    );
  }

  if (props.displayStyle === "circular") {
    // SVG circle
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (completeness.score / 100) * circumference;

    return React.createElement("div", { className: styles.completeness + " " + styles.circularContainer, role: "status", "aria-label": "Profile " + completeness.score + "% complete" },
      React.createElement("svg", { className: styles.circularSvg, viewBox: "0 0 64 64", width: "64", height: "64" },
        React.createElement("circle", {
          className: styles.circularTrack,
          cx: "32", cy: "32", r: String(radius),
          fill: "none", strokeWidth: "6", stroke: "#edebe9",
        }),
        React.createElement("circle", {
          className: styles.circularFill,
          cx: "32", cy: "32", r: String(radius),
          fill: "none", strokeWidth: "6", stroke: color,
          strokeDasharray: String(circumference),
          strokeDashoffset: String(offset),
          strokeLinecap: "round",
          transform: "rotate(-90 32 32)",
        })
      ),
      React.createElement("span", { className: styles.circularScore, style: { color: color } }, completeness.score + "%"),
      React.createElement("span", { className: styles.encouragement }, message)
    );
  }

  if (props.displayStyle === "stars") {
    // 5-star rating based on score
    const filledStars = Math.round(completeness.score / 20);
    const starElements: React.ReactNode[] = [];
    for (let i = 0; i < 5; i++) {
      starElements.push(
        React.createElement("span", {
          key: "star-" + i,
          className: i < filledStars ? styles.starFilled : styles.starEmpty,
          "aria-hidden": "true",
        }, i < filledStars ? "\u2605" : "\u2606")
      );
    }

    return React.createElement("div", { className: styles.completeness, role: "status", "aria-label": "Profile " + completeness.score + "% complete, " + filledStars + " of 5 stars" },
      React.createElement("div", { className: styles.starsRow }, starElements),
      React.createElement("span", { className: styles.starsLabel }, completeness.filledFields + " of " + completeness.totalFields + " fields"),
      React.createElement("span", { className: styles.encouragement }, message)
    );
  }

  return React.createElement(React.Fragment);
};

export default HyperProfileCompleteness;
