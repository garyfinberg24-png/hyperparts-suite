import * as React from "react";
import { HyperModal } from "../HyperModal";
import type {
  IHyperWizardProps,
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "./IHyperWizard";
import styles from "./HyperWizard.module.scss";

// ============================================================
// HyperWizard — Shared Multi-Step Setup Wizard (Full-Screen)
// First consumer: HyperNews V2
// ============================================================

/**
 * Generic multi-step wizard modal component.
 * Renders a 2-panel layout: left sidebar (step list) + right main area (step content).
 * Consumes IHyperWizardConfig to define steps, validation, and summary.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HyperWizardInner<TState extends Record<string, any>, TResult>(
  wizardProps: IHyperWizardProps<TState, TResult>
): React.ReactElement | null {  // eslint-disable-line @rushstack/no-new-null
  var config = wizardProps.config;
  var isOpen = wizardProps.isOpen;
  var onClose = wizardProps.onClose;
  var onApply = wizardProps.onApply;
  var initialStateOverride = wizardProps.initialStateOverride;

  // Current step index: -1 = welcome, 0..N-1 = steps, N = summary
  var [currentStep, setCurrentStep] = React.useState<number>(-1);
  var [wizardState, setWizardState] = React.useState<TState>(function () {
    return initialStateOverride ? { ...initialStateOverride } : { ...config.initialState };
  });

  // Reset state when opening — use override if provided (re-edit mode)
  React.useEffect(function () {
    if (isOpen) {
      var startStep = -1; // welcome
      var stateToUse = { ...config.initialState };
      if (initialStateOverride) {
        stateToUse = { ...initialStateOverride };
        startStep = 0; // skip welcome, go straight to first step
      }
      setCurrentStep(startStep);
      setWizardState(stateToUse);
    }
  }, [isOpen, config.initialState, initialStateOverride]);

  // Get visible steps (filter out hidden ones)
  var visibleSteps = React.useMemo(function (): Array<IWizardStepDef<TState>> {
    var result: Array<IWizardStepDef<TState>> = [];
    config.steps.forEach(function (step) {
      if (!step.hidden || !step.hidden(wizardState)) {
        result.push(step);
      }
    });
    return result;
  }, [config.steps, wizardState]);

  var totalSteps = visibleSteps.length;
  var isWelcome = currentStep === -1;
  var isSummary = currentStep === totalSteps;
  var isLastContentStep = currentStep === totalSteps - 1;

  // Partial state updater
  var handleStateChange = React.useCallback(function (partial: Partial<TState>): void {
    setWizardState(function (prev) {
      var updated = { ...prev };
      var keys = Object.keys(partial);
      keys.forEach(function (key) {
        (updated as Record<string, unknown>)[key] = (partial as Record<string, unknown>)[key];
      });
      return updated as TState;
    });
  }, []);

  // Navigation
  var handleNext = React.useCallback(function (): void {
    setCurrentStep(function (prev) { return prev + 1; });
  }, []);

  var handlePrevious = React.useCallback(function (): void {
    setCurrentStep(function (prev) { return prev - 1; });
  }, []);

  var handleApply = React.useCallback(function (): void {
    var result = config.buildResult(wizardState);
    onApply(result);
    onClose();
  }, [config, wizardState, onApply, onClose]);

  // Check if current step is valid (can proceed)
  var isCurrentValid = React.useMemo(function (): boolean {
    if (isWelcome || isSummary) return true;
    var step = visibleSteps[currentStep];
    if (!step || !step.validate) return true;
    return step.validate(wizardState);
  }, [isWelcome, isSummary, currentStep, visibleSteps, wizardState]);

  if (!isOpen) {
    return null; // eslint-disable-line @rushstack/no-new-null
  }

  // ── Build sidebar step list ──
  var sidebarElements: React.ReactElement[] = [];

  // Brand strip
  sidebarElements.push(
    React.createElement("div", { key: "brand", className: styles.wizardBrandStrip },
      React.createElement("div", { className: styles.wizardBrandName }, "HyperParts")
    )
  );

  // Step items
  visibleSteps.forEach(function (step, idx) {
    // Connector line (before all except first)
    if (idx > 0) {
      var connectorClass = idx <= currentStep
        ? styles.wizardStepConnectorDone
        : styles.wizardStepConnector;
      sidebarElements.push(
        React.createElement("div", { key: "conn-" + idx, className: connectorClass })
      );
    }

    // Step item
    var itemClass: string;
    var circleClass: string;
    var labelClass: string;
    var circleContent: string;

    if (idx === currentStep) {
      itemClass = styles.wizardStepActive;
      circleClass = styles.wizardStepCircle + " " + styles.wizardStepActiveCircle;
      labelClass = styles.wizardStepLabelText + " " + styles.wizardStepActiveLabel;
      circleContent = String(idx + 1);
    } else if (idx < currentStep) {
      itemClass = styles.wizardStepComplete;
      circleClass = styles.wizardStepCircle + " " + styles.wizardStepCompleteCircle;
      labelClass = styles.wizardStepLabelText + " " + styles.wizardStepCompleteLabel;
      circleContent = "\u2713"; // checkmark
    } else {
      itemClass = styles.wizardStepPending;
      circleClass = styles.wizardStepCircle;
      labelClass = styles.wizardStepLabelText;
      circleContent = String(idx + 1);
    }

    sidebarElements.push(
      React.createElement("div", { key: "step-" + idx, className: itemClass },
        React.createElement("div", { className: circleClass }, circleContent),
        React.createElement("div", { className: labelClass }, step.shortLabel)
      )
    );
  });

  // ── Build main content area ──
  var mainContent: React.ReactElement;
  var headerTitle: string;
  var headerHelp: string;

  if (isWelcome) {
    // Welcome step — render the welcome config as content
    headerTitle = config.title;
    headerHelp = "Welcome to the setup wizard";
    mainContent = renderWelcomeContent(config, handleNext);
  } else if (isSummary) {
    // Summary step — show review card
    headerTitle = "Review & Apply";
    headerHelp = "Review your configuration before applying";
    var summaryRows = config.buildSummary(wizardState);
    mainContent = renderSummaryContent(summaryRows, config.summaryFootnote);
  } else {
    // Regular step
    var currentStepDef = visibleSteps[currentStep];
    headerTitle = currentStepDef.label;
    var helpText = currentStepDef.helpText;
    headerHelp = typeof helpText === "function" ? helpText(wizardState) : helpText;
    mainContent = React.createElement(currentStepDef.component, {
      state: wizardState,
      onChange: handleStateChange,
    });
  }

  // ── Footer navigation ──
  var footerLeft: React.ReactElement;
  var footerRight: React.ReactElement;

  if (isWelcome) {
    footerLeft = React.createElement("div", { className: styles.wizardFooterLeft },
      React.createElement("button", {
        className: styles.wizardBtnOutline,
        onClick: onClose,
        type: "button",
      }, "Cancel")
    );
    footerRight = React.createElement("div", { className: styles.wizardFooterRight },
      React.createElement("button", {
        className: styles.wizardBtnBlue,
        onClick: handleNext,
        type: "button",
      }, "Get Started \u2192")
    );
  } else if (isSummary) {
    footerLeft = React.createElement("div", { className: styles.wizardFooterLeft },
      React.createElement("button", {
        className: styles.wizardBtnOutline,
        onClick: handlePrevious,
        type: "button",
      }, "\u2190 Back")
    );
    footerRight = React.createElement("div", { className: styles.wizardFooterRight },
      React.createElement("button", {
        className: styles.wizardBtnGreen,
        onClick: handleApply,
        type: "button",
      }, "\u2713 Apply Configuration")
    );
  } else {
    footerLeft = React.createElement("div", { className: styles.wizardFooterLeft },
      React.createElement("button", {
        className: styles.wizardBtnOutline,
        onClick: currentStep === 0 ? function () { setCurrentStep(-1); } : handlePrevious,
        type: "button",
      }, currentStep === 0 ? "\u2190 Welcome" : "\u2190 Back")
    );
    footerRight = React.createElement("div", { className: styles.wizardFooterRight },
      React.createElement("button", {
        className: styles.wizardBtnOutline,
        onClick: onClose,
        type: "button",
      }, "Cancel"),
      React.createElement("button", {
        className: styles.wizardBtnBlue,
        onClick: handleNext,
        disabled: !isCurrentValid,
        type: "button",
      }, isLastContentStep ? "Review \u2192" : "Next \u2192")
    );
  }

  // ── Assemble wizard layout ──
  var wizardLayout = React.createElement("div", { className: styles.wizardLayout },
    // Sidebar
    React.createElement("div", { className: styles.wizardSidebar },
      React.createElement("div", { className: styles.wizardStepList }, sidebarElements)
    ),
    // Main
    React.createElement("div", { className: styles.wizardMain },
      // Header
      React.createElement("div", { className: styles.wizardHeaderArea },
        React.createElement("h2", { className: styles.wizardHeaderTitle }, headerTitle),
        React.createElement("p", { className: styles.wizardHeaderHelp }, headerHelp)
      ),
      // Content
      React.createElement("div", { className: styles.wizardContentArea }, mainContent),
      // Footer
      React.createElement("div", { className: styles.wizardFooterArea }, footerLeft, footerRight)
    )
  );

  return React.createElement(
    HyperModal,
    { isOpen: isOpen, onClose: onClose, title: config.title, size: "fullscreen" },
    wizardLayout
  );
}

// ── Welcome content renderer ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderWelcomeContent<TState extends Record<string, any>, TResult>(
  config: IHyperWizardConfig<TState, TResult>,
  onGetStarted: () => void
): React.ReactElement {
  var welcome = config.welcome;

  // Feature cards
  var featureCards: React.ReactElement[] = [];
  welcome.features.forEach(function (feat, idx) {
    featureCards.push(
      React.createElement("div", { key: "feat-" + idx, className: styles.welcomeFeatureCard },
        React.createElement("div", { className: styles.welcomeFeatureIcon, "aria-hidden": "true" }, feat.icon),
        React.createElement("div", { className: styles.welcomeFeatureTitle }, feat.title),
        React.createElement("div", { className: styles.welcomeFeatureDesc }, feat.description)
      )
    );
  });

  return React.createElement("div", { className: styles.welcomeContainer },
    // Banner
    React.createElement("div", { className: styles.welcomeBanner },
      React.createElement("div", { className: styles.welcomeBrandRow },
        React.createElement("span", { className: styles.welcomeBrandHyper }, "Hyper"),
        React.createElement("span", { className: styles.welcomeBrandProduct }, welcome.productName)
      ),
      React.createElement("div", { className: styles.welcomeTagline }, welcome.tagline)
    ),
    // Feature grid
    React.createElement("div", { className: styles.welcomeFeatureGrid }, featureCards),
    // CTA
    React.createElement("div", { className: styles.welcomeCtaSection },
      React.createElement("button", {
        className: styles.welcomeGetStartedBtn,
        onClick: onGetStarted,
        type: "button",
      }, "Configure Now \u2192"),
      React.createElement("span", { className: styles.welcomeHint },
        "Set up your content sources, layout, and features"
      )
    )
  );
}

// ── Summary content renderer ──
function renderSummaryContent(
  rows: IWizardSummaryRow[],
  footnote: string | undefined
): React.ReactElement {
  var rowElements: React.ReactElement[] = [];
  rows.forEach(function (row, idx) {
    var valueClass = styles.summaryValue;
    if (row.type === "badge") valueClass = styles.summaryBadge;
    else if (row.type === "badgeGreen") valueClass = styles.summaryBadgeGreen;
    else if (row.type === "mono") valueClass = styles.summaryValueMono;

    rowElements.push(
      React.createElement("div", { key: "row-" + idx, className: styles.summaryRow },
        React.createElement("span", { className: styles.summaryLabel }, row.label),
        React.createElement("span", { className: valueClass }, row.value)
      )
    );
  });

  var elements: React.ReactElement[] = [
    React.createElement("div", { key: "card", className: styles.summaryCard }, rowElements),
  ];

  if (footnote) {
    elements.push(
      React.createElement("div", { key: "foot", className: styles.summaryFootnote },
        "\u2139\uFE0F " + footnote
      )
    );
  }

  return React.createElement("div", { className: styles.summaryContainer }, elements);
}

// ── Export wrapper (avoids generic component export issues) ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HyperWizard: React.FC<IHyperWizardProps<any, any>> = HyperWizardInner;

export default HyperWizard;
