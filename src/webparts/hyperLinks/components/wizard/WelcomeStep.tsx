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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDD17"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Links")
        ),
        React.createElement("div", { className: styles.splashTagline },
          "Quick links, ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "elevated"),
          ".",
          React.createElement("br"),
          "8 layouts, hover effects & ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "audience targeting"),
          "."
        )
      )
    ),
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDF77"),
          React.createElement("div", { className: styles.splashCardTitle }, "8 Layouts"),
          React.createElement("div", { className: styles.splashCardDesc }, "Grid, filmstrip, tiles, cards & icon grid")
        ),
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2728"),
          React.createElement("div", { className: styles.splashCardTitle }, "Hover Effects"),
          React.createElement("div", { className: styles.splashCardDesc }, "Lift, glow, zoom, darken & more")
        ),
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDC65"),
          React.createElement("div", { className: styles.splashCardTitle }, "Grouping"),
          React.createElement("div", { className: styles.splashCardDesc }, "Collapsible sections with headers")
        ),
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD12"),
          React.createElement("div", { className: styles.splashCardTitle }, "Audience"),
          React.createElement("div", { className: styles.splashCardDesc }, "Per-link targeting by AD group")
        )
      ),
      React.createElement("button", {
        className: styles.splashCta,
        onClick: props.onGetStarted,
        type: "button",
      }, "Get Started \u2192"),
      React.createElement("span", { className: styles.splashHint }, "Add your first links in seconds")
    )
  );
};

export default WelcomeStep;
