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
          "The ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "Ultimate"),
          " Alert & Notification ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "Command Center"),
          " for SharePoint"
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 8 Display Layouts
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDDA5\uFE0F"),
          React.createElement("div", { className: styles.splashCardTitle }, "8 Display Layouts"),
          React.createElement("div", { className: styles.splashCardDesc },
            "Command Center, Inbox, Card Grid, Table, Timeline, Kanban, Compact, and Split views"
          )
        ),
        // Card 2: Smart Notifications
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD14"),
          React.createElement("div", { className: styles.splashCardTitle }, "Smart Notifications"),
          React.createElement("div", { className: styles.splashCardDesc },
            "Toast stacks, email, Teams, in-page banners, and a notification center inbox"
          )
        ),
        // Card 3: Intelligent Rules
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u26A1"),
          React.createElement("div", { className: styles.splashCardTitle }, "Intelligent Rules"),
          React.createElement("div", { className: styles.splashCardDesc },
            "13-operator rule engine with grouping, deduplication, and 3-tier escalation"
          )
        ),
        // Card 4: KPI Dashboard
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCCA"),
          React.createElement("div", { className: styles.splashCardTitle }, "KPI Dashboard"),
          React.createElement("div", { className: styles.splashCardDesc },
            "Real-time metrics: active alerts, MTTA, MTTR, and resolution rates"
          )
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
        "Configure your alert monitoring in minutes"
      )
    )
  );
};

export default WelcomeStep;
