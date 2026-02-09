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
          React.createElement("span", { className: styles.splashBolt, "aria-hidden": "true" }, "\uD83D\uDCC5"),
          React.createElement("span", { className: styles.splashHyperText }, "Hyper"),
          React.createElement("span", { className: styles.splashPartText }, "Events")
        ),
        React.createElement("div", { className: styles.splashTagline },
          React.createElement("span", { className: styles.splashTaglineStrong }, "Unified"),
          " calendar from multiple sources.",
          React.createElement("br"),
          "RSVP, registration & ",
          React.createElement("span", { className: styles.splashTaglineStrong }, "Outlook sync"),
          "."
        )
      )
    ),

    // ── Body: Feature Cards + CTA ──
    React.createElement("div", { className: styles.splashBody },
      React.createElement("div", { className: styles.splashCards },
        // Card 1: 6 Calendar Views
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDDD3\uFE0F"),
          React.createElement("div", { className: styles.splashCardTitle }, "6 Calendar Views"),
          React.createElement("div", { className: styles.splashCardDesc }, "Month, week, day, agenda, timeline & cards")
        ),
        // Card 2: Multi-Source
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDCE9"),
          React.createElement("div", { className: styles.splashCardTitle }, "Multi-Source"),
          React.createElement("div", { className: styles.splashCardDesc }, "SP lists, Exchange & Outlook groups")
        ),
        // Card 3: RSVP & Register
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\u270D\uFE0F"),
          React.createElement("div", { className: styles.splashCardTitle }, "RSVP & Register"),
          React.createElement("div", { className: styles.splashCardDesc }, "Built-in sign-up with custom fields")
        ),
        // Card 4: Notifications
        React.createElement("div", { className: styles.splashCard },
          React.createElement("div", { className: styles.splashCardIcon, "aria-hidden": "true" }, "\uD83D\uDD14"),
          React.createElement("div", { className: styles.splashCardTitle }, "Notifications"),
          React.createElement("div", { className: styles.splashCardDesc }, "Email & Teams reminders via Graph")
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
        "Connect your first calendar source in minutes"
      )
    )
  );
};

export default WelcomeStep;
