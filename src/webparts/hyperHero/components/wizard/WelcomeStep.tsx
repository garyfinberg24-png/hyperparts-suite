import * as React from "react";
import styles from "./WelcomeStep.module.scss";

export interface IWelcomeStepProps {
  onGetStarted: () => void;
}

const WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  return React.createElement("div", { className: styles.welcomeContainer },
    // Brand logo area
    React.createElement("div", { className: styles.brandSection },
      React.createElement("div", { className: styles.brandLogo },
        React.createElement("span", { className: styles.brandDwx }, "DWx"),
        React.createElement("span", { className: styles.brandSeparator }),
        React.createElement("span", { className: styles.brandProduct }, "HyperHero")
      ),
      React.createElement("div", { className: styles.brandTagline }, "Premium Hero Experiences for SharePoint")
    ),

    // Feature highlights
    React.createElement("div", { className: styles.featureGrid },
      React.createElement("div", { className: styles.featureCard },
        React.createElement("div", { className: styles.featureIcon, "aria-hidden": "true" }, "\uD83C\uDFA8"),
        React.createElement("div", { className: styles.featureTitle }, "Visual Layouts"),
        React.createElement("div", { className: styles.featureDesc }, "5 grid presets with responsive breakpoints")
      ),
      React.createElement("div", { className: styles.featureCard },
        React.createElement("div", { className: styles.featureIcon, "aria-hidden": "true" }, "\uD83D\uDCF9"),
        React.createElement("div", { className: styles.featureTitle }, "Rich Media"),
        React.createElement("div", { className: styles.featureDesc }, "Images, videos, Lottie animations & parallax")
      ),
      React.createElement("div", { className: styles.featureCard },
        React.createElement("div", { className: styles.featureIcon, "aria-hidden": "true" }, "\uD83D\uDD17"),
        React.createElement("div", { className: styles.featureTitle }, "Dynamic Content"),
        React.createElement("div", { className: styles.featureDesc }, "Bind to SharePoint lists for auto-updating tiles")
      ),
      React.createElement("div", { className: styles.featureCard },
        React.createElement("div", { className: styles.featureIcon, "aria-hidden": "true" }, "\u23F1\uFE0F"),
        React.createElement("div", { className: styles.featureTitle }, "Scheduling"),
        React.createElement("div", { className: styles.featureDesc }, "Publish dates, countdowns & audience targeting")
      )
    ),

    // Get started CTA
    React.createElement("div", { className: styles.ctaSection },
      React.createElement("button", {
        className: styles.getStartedBtn,
        onClick: props.onGetStarted,
        type: "button",
      }, "Get Started"),
      React.createElement("p", { className: styles.ctaHint },
        "This wizard will help you configure your hero web part in just a few steps."
      )
    )
  );
};

export default WelcomeStep;
