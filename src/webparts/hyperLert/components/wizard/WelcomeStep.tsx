import * as React from "react";
import styles from "./WelcomeStep.module.scss";

export interface IWelcomeStepProps {
  onGetStarted: () => void;
}

const WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  return React.createElement("div", undefined,

    // ── DWx Brand Strip ──
    React.createElement("div", { className: styles.brandStrip },
      React.createElement("div", { className: styles.brandLeft },
        React.createElement("div", { className: styles.brandNameBlock },
          React.createElement("span", { className: styles.brandDwx },
            "DW",
            React.createElement("span", { className: styles.brandDwxAccent }, "x")
          ),
          React.createElement("span", { className: styles.brandSub }, "Digital Workplace Excellence")
        )
      ),
      React.createElement("span", { className: styles.brandBadge },
        React.createElement("span", { className: styles.brandBadgeStar, "aria-hidden": "true" }, "\u2B50"),
        " HyperParts Suite"
      )
    ),

    // ── Hero Banner ──
    React.createElement("div", { className: styles.splashHero },
      React.createElement("div", { className: styles.splashHeroBrand },
        React.createElement("div", { className: styles.splashLogoRow },
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDEA8"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Lert")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Monitor"),
          " your data and alert your team.",
          React.createElement("br"),
          "Rules engine with ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "email & Teams"),
          " notifications."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: Rule Builder
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u2699\uFE0F"),
          React.createElement("div", { className: styles.splashCardTitle }, "Rule Builder"),
          React.createElement("div", { className: styles.splashCardDesc }, "4-step wizard with 13 operators")
        ),
        // Card 2: Multi-Channel
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCE9"),
          React.createElement("div", { className: styles.splashCardTitle }, "Multi-Channel"),
          React.createElement("div", { className: styles.splashCardDesc }, "Email, Teams chat & page banners")
        ),
        // Card 3: Alert History
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCCB"),
          React.createElement("div", { className: styles.splashCardTitle }, "Alert History"),
          React.createElement("div", { className: styles.splashCardDesc }, "Full audit log in a SP list")
        ),
        // Card 4: Smart Scheduling
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD51"),
          React.createElement("div", { className: styles.splashCardTitle }, "Smart Scheduling"),
          React.createElement("div", { className: styles.splashCardDesc }, "Active hours, cooldown & snooze")
        )
      ),

      // CTA button
      React.createElement("button", {
        className: styles.splashCta,
        onClick: props.onGetStarted,
        type: "button",
      }, "Get Started \u2192"),

      // Hint
      React.createElement("span", { className: styles.splashHint },
        "Set up your first alert rule in minutes"
      )
    )
  );
};

export default WelcomeStep;
