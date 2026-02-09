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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDD0D"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Search")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Find anything"),
          " across your entire tenant.",
          React.createElement("br"),
          "Federated search with ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "document preview"),
          "."
        )
      )
    ),
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83C\uDF10"),
          React.createElement("div", { className: styles.splashCardTitle }, "5 Result Types"),
          React.createElement("div", { className: styles.splashCardDesc }, "Documents, pages, people, messages & sites")
        ),
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCC4"),
          React.createElement("div", { className: styles.splashCardTitle }, "Doc Preview"),
          React.createElement("div", { className: styles.splashCardDesc }, "Office Online, PDF & image preview")
        ),
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2B50"),
          React.createElement("div", { className: styles.splashCardTitle }, "Promoted Results"),
          React.createElement("div", { className: styles.splashCardDesc }, "Keyword-based best bets at the top")
        ),
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCC8"),
          React.createElement("div", { className: styles.splashCardTitle }, "Refiners"),
          React.createElement("div", { className: styles.splashCardDesc }, "Dynamic facets with checkbox groups")
        )
      ),
      React.createElement("button", {
        className: styles.splashCta,
        onClick: props.onGetStarted,
        type: "button",
      }, "Get Started \u2192"),
      React.createElement("span", { className: styles.splashHint }, "Configure your search scope in a few clicks")
    )
  );
};

export default WelcomeStep;
