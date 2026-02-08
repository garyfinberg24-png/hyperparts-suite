import * as React from "react";
import { useCallback } from "react";
import type { IHyperTabPanel } from "../../models";
import { useHyperTabsStore } from "../../store/useHyperTabsStore";
import HyperTabsPanelContent from "../HyperTabsPanelContent";
import styles from "./HyperTabsWizardMode.module.scss";

export interface IHyperTabsWizardModeProps {
  panels: IHyperTabPanel[];
  showProgress: boolean;
  linearMode: boolean;
  enableLazyLoading: boolean;
  animationEnabled: boolean;
  nestingDepth: number;
  onStepChange?: (step: number) => void;
}

const HyperTabsWizardMode: React.FC<IHyperTabsWizardModeProps> = function (props) {
  const { panels, showProgress, linearMode, enableLazyLoading, animationEnabled, nestingDepth, onStepChange } = props;
  const wizardCurrentStep = useHyperTabsStore(function (s) { return s.wizardCurrentStep; });
  const wizardCompletedSteps = useHyperTabsStore(function (s) { return s.wizardCompletedSteps; });
  const wizardNextStep = useHyperTabsStore(function (s) { return s.wizardNextStep; });
  const wizardPrevStep = useHyperTabsStore(function (s) { return s.wizardPrevStep; });
  const wizardGoToStep = useHyperTabsStore(function (s) { return s.wizardGoToStep; });
  const wizardMarkStepCompleted = useHyperTabsStore(function (s) { return s.wizardMarkStepCompleted; });

  const currentPanel = panels[wizardCurrentStep];
  const isFirstStep = wizardCurrentStep === 0;
  const isLastStep = wizardCurrentStep === panels.length - 1;

  const handleNext = useCallback(function (): void {
    wizardMarkStepCompleted(wizardCurrentStep);
    wizardNextStep(panels.length);
    if (onStepChange) onStepChange(wizardCurrentStep + 1);
  }, [wizardCurrentStep, panels.length, wizardMarkStepCompleted, wizardNextStep, onStepChange]);

  const handlePrev = useCallback(function (): void {
    wizardPrevStep();
    if (onStepChange) onStepChange(wizardCurrentStep - 1);
  }, [wizardCurrentStep, wizardPrevStep, onStepChange]);

  const handleStepClick = useCallback(function (step: number): void {
    if (linearMode && wizardCompletedSteps.indexOf(step) === -1 && step > wizardCurrentStep) {
      return; // Cannot skip ahead in linear mode
    }
    wizardGoToStep(step);
    if (onStepChange) onStepChange(step);
  }, [linearMode, wizardCompletedSteps, wizardCurrentStep, wizardGoToStep, onStepChange]);

  // Progress indicator
  const progressIndicator = showProgress
    ? React.createElement("div", { className: styles.progressBar, role: "navigation", "aria-label": "Wizard progress" },
        (function () {
          const steps: React.ReactNode[] = [];
          panels.forEach(function (panel, index) {
            const isCompleted = wizardCompletedSteps.indexOf(index) !== -1;
            const isCurrent = index === wizardCurrentStep;
            const isClickable = !linearMode || isCompleted || index <= wizardCurrentStep;

            const stepClass = styles.progressStep
              + (isCompleted ? " " + styles.completed : "")
              + (isCurrent ? " " + styles.current : "");

            // Add connecting line before step (except first)
            if (index > 0) {
              steps.push(
                React.createElement("div", {
                  key: "line-" + index,
                  className: styles.progressLine + (isCompleted ? " " + styles.progressLineCompleted : ""),
                })
              );
            }

            steps.push(
              React.createElement("button", {
                key: panel.id,
                className: stepClass,
                onClick: function () { handleStepClick(index); },
                disabled: !isClickable,
                "aria-label": "Step " + (index + 1) + ": " + panel.title,
                "aria-current": isCurrent ? "step" : undefined,
                type: "button",
              },
                React.createElement("span", { className: styles.stepNumber },
                  isCompleted ? "\u2713" : String(index + 1)
                ),
                React.createElement("span", { className: styles.stepLabel }, panel.title)
              )
            );
          });
          return steps;
        })()
      )
    : undefined;

  // Current step content
  const stepContent = currentPanel
    ? React.createElement(HyperTabsPanelContent, {
        panel: currentPanel,
        isActive: true,
        enableLazyLoading: enableLazyLoading,
        nestingDepth: nestingDepth,
        animationEnabled: animationEnabled,
      })
    : undefined;

  // Navigation buttons
  const navigation = React.createElement("div", { className: styles.wizardNavigation },
    React.createElement("button", {
      className: styles.navButton + " " + styles.navButtonSecondary,
      onClick: handlePrev,
      disabled: isFirstStep,
      type: "button",
    }, "Previous"),
    React.createElement("span", { className: styles.stepCounter },
      "Step " + (wizardCurrentStep + 1) + " of " + panels.length
    ),
    React.createElement("button", {
      className: styles.navButton + " " + styles.navButtonPrimary,
      onClick: handleNext,
      disabled: isLastStep,
      type: "button",
    }, isLastStep ? "Finish" : "Next")
  );

  return React.createElement(
    "div",
    { className: styles.wizardContainer },
    progressIndicator,
    React.createElement("div", { className: styles.wizardContent }, stepContent),
    navigation
  );
};

export default React.memo(HyperTabsWizardMode);
