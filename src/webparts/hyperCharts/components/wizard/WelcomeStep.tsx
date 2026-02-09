import * as React from "react";
import styles from "./WelcomeStep.module.scss";

export interface IWelcomeStepProps {
  onGetStarted: () => void;
}

const WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  return React.createElement("div", undefined,
    React.createElement("div", { className: styles.brandStrip },
      React.createElement("div", { className: styles.brandLeft },
        React.createElement("div", { className: styles.brandNameBlock },
          React.createElement("span", { className: styles.brandDwx },
            "DW", React.createElement("span", { className: styles.brandDwxAccent }, "x")
          ),
          React.createElement("span", { className: styles.brandSub }, "Digital Workplace Excellence")
        )
      ),
      React.createElement("span", { className: styles.brandBadge },
        React.createElement("span", { className: styles.brandBadgeStar, "aria-hidden": "true" }, "\u2B50"),
        " HyperParts Suite"
      )
    ),
    React.createElement("div", { className: styles.splashHero },
      React.createElement("div", { className: styles.splashHeroBrand },
        React.createElement("div", { className: styles.splashLogoRow },
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDCC8"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Charts")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Visualize"),
          " your data with Chart.js dashboards.",
          React.createElement("br"),
          "KPI cards, drill-down & ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "Excel integration"),
          "."
        )
      )
    ),
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCCA"),
          React.createElement("div", { className: styles.splashCardTitle }, "6 Chart Types"),
          React.createElement("div", { className: styles.splashCardDesc }, "Bar, line, pie, donut, area & gauge")
        ),
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDFAF"),
          React.createElement("div", { className: styles.splashCardTitle }, "KPI Cards"),
          React.createElement("div", { className: styles.splashCardDesc }, "Sparklines, trends & RAG status")
        ),
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCD1"),
          React.createElement("div", { className: styles.splashCardTitle }, "Excel Data"),
          React.createElement("div", { className: styles.splashCardDesc }, "Pull from workbooks via Graph API")
        ),
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCE5"),
          React.createElement("div", { className: styles.splashCardTitle }, "Export"),
          React.createElement("div", { className: styles.splashCardDesc }, "PNG charts & CSV data download")
        )
      ),
      React.createElement("button", {
        className: styles.splashCta,
        onClick: props.onGetStarted,
        type: "button",
      }, "Get Started \u2192"),
      React.createElement("span", { className: styles.splashHint }, "Create your first dashboard in minutes")
    )
  );
};

export default WelcomeStep;
