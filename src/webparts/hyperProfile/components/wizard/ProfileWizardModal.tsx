import * as React from "react";
import type { IHyperProfileWebPartProps } from "../../models/IHyperProfileWebPartProps";
import type { IProfileWizardState, WizardStepId } from "../../models/IHyperProfileWizardState";
import { DEFAULT_WIZARD_STATE, getWizardSteps } from "../../models/IHyperProfileWizardState";
import { buildPropsFromWizardState, buildStateFromProps } from "../../utils/wizardHelpers";
import { HyperModal } from "../../../../common/components";
import WizardPathStep from "./WizardPathStep";
import WizardTemplateGallery from "./WizardTemplateGallery";
import WizardDisplayStep from "./WizardDisplayStep";
import WizardFeaturesStep from "./WizardFeaturesStep";
import WizardAppearanceStep from "./WizardAppearanceStep";
import WizardReviewStep from "./WizardReviewStep";
import styles from "./ProfileWizardModal.module.scss";

export interface IProfileWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: Partial<IHyperProfileWebPartProps>) => void;
  currentProps?: IHyperProfileWebPartProps;
}

const ProfileWizardModal: React.FC<IProfileWizardModalProps> = function (props) {
  // Initialize state from currentProps (re-edit) or defaults
  const initialState: IProfileWizardState = props.currentProps
    ? buildStateFromProps(props.currentProps)
    : DEFAULT_WIZARD_STATE;

  const [wizardState, setWizardState] = React.useState<IProfileWizardState>(initialState);

  // Reset state when modal opens
  React.useEffect(function () {
    if (props.isOpen) {
      const newState = props.currentProps
        ? buildStateFromProps(props.currentProps)
        : DEFAULT_WIZARD_STATE;
      setWizardState(newState);
    }
  }, [props.isOpen]);

  const steps = getWizardSteps(wizardState.path);
  const currentStep = steps[wizardState.currentStepIndex];
  const currentStepId: WizardStepId = currentStep ? currentStep.id : "path";

  // Update wizard state helper
  const updateState = function (partial: Partial<IProfileWizardState>): void {
    setWizardState(function (prev) {
      const next: Record<string, unknown> = {};
      const prevRecord = prev as unknown as Record<string, unknown>;
      const keys = Object.keys(prevRecord);
      keys.forEach(function (k) {
        next[k] = prevRecord[k];
      });
      const partialRecord = partial as unknown as Record<string, unknown>;
      const pKeys = Object.keys(partialRecord);
      pKeys.forEach(function (k) {
        next[k] = partialRecord[k];
      });
      return next as unknown as IProfileWizardState;
    });
  };

  // Navigation
  const goNext = function (): void {
    const maxIndex = steps.length - 1;
    if (wizardState.currentStepIndex < maxIndex) {
      updateState({ currentStepIndex: wizardState.currentStepIndex + 1 });
    }
  };

  const goBack = function (): void {
    if (wizardState.currentStepIndex > 0) {
      updateState({ currentStepIndex: wizardState.currentStepIndex - 1 });
    }
  };

  const goToStep = function (index: number): void {
    if (index >= 0 && index <= wizardState.currentStepIndex) {
      updateState({ currentStepIndex: index });
    }
  };

  // Apply and close
  const handleApply = function (): void {
    const result = buildPropsFromWizardState(wizardState);
    props.onApply(result);
    props.onClose();
  };

  // ── Left panel: step navigation ──
  const stepNavItems: React.ReactNode[] = [];
  steps.forEach(function (step, idx) {
    const isActive = idx === wizardState.currentStepIndex;
    const isCompleted = idx < wizardState.currentStepIndex;
    const isClickable = idx <= wizardState.currentStepIndex;

    let className = styles.stepItem;
    if (isActive) className = className + " " + styles.stepItemActive;
    if (isCompleted) className = className + " " + styles.stepItemCompleted;

    stepNavItems.push(
      React.createElement("button", {
        key: step.id,
        type: "button",
        className: className,
        onClick: function () { if (isClickable) goToStep(idx); },
        disabled: !isClickable,
        "aria-current": isActive ? "step" : undefined,
      },
        React.createElement("span", { className: styles.stepIcon, "aria-hidden": "true" },
          isCompleted ? "\u2713" : step.icon
        ),
        React.createElement("span", { className: styles.stepLabel }, step.label)
      )
    );
  });

  const leftPanel = React.createElement("nav", {
    className: styles.leftPanel,
    "aria-label": "Wizard steps",
  },
    React.createElement("div", { className: styles.wizardBrand },
      React.createElement("span", { className: styles.wizardBrandIcon, "aria-hidden": "true" }, "\uD83D\uDC64"),
      React.createElement("span", { className: styles.wizardBrandText }, "HyperProfile"),
      React.createElement("span", { className: styles.wizardBrandSub }, "Setup Wizard")
    ),
    React.createElement("div", { className: styles.stepList }, stepNavItems)
  );

  // ── Right panel: step content ──
  let stepContent: React.ReactNode;

  if (currentStepId === "path") {
    stepContent = React.createElement(WizardPathStep, {
      onSelectPath: function (path) {
        updateState({ path: path, currentStepIndex: 1 });
      },
    });
  } else if (currentStepId === "template") {
    stepContent = React.createElement(WizardTemplateGallery, {
      state: wizardState,
      onUpdateState: updateState,
    });
  } else if (currentStepId === "display") {
    stepContent = React.createElement(WizardDisplayStep, {
      state: wizardState,
      onUpdateState: updateState,
    });
  } else if (currentStepId === "features") {
    stepContent = React.createElement(WizardFeaturesStep, {
      state: wizardState,
      onUpdateState: updateState,
    });
  } else if (currentStepId === "appearance") {
    stepContent = React.createElement(WizardAppearanceStep, {
      state: wizardState,
      onUpdateState: updateState,
    });
  } else if (currentStepId === "review") {
    stepContent = React.createElement(WizardReviewStep, {
      state: wizardState,
    });
  }

  // ── Footer buttons ──
  const footerChildren: React.ReactNode[] = [];

  if (wizardState.currentStepIndex > 0) {
    footerChildren.push(
      React.createElement("button", {
        key: "back",
        type: "button",
        className: styles.btnSecondary,
        onClick: goBack,
      }, "\u2190 Back")
    );
  }

  // Spacer
  footerChildren.push(
    React.createElement("div", { key: "spacer", style: { flex: 1 } })
  );

  if (currentStepId === "review") {
    footerChildren.push(
      React.createElement("button", {
        key: "apply",
        type: "button",
        className: styles.btnPrimary,
        onClick: handleApply,
      }, "Apply Configuration \u2713")
    );
  } else if (wizardState.path) {
    footerChildren.push(
      React.createElement("button", {
        key: "next",
        type: "button",
        className: styles.btnPrimary,
        onClick: goNext,
      }, "Next \u2192")
    );
  }

  const footer = React.createElement("div", { className: styles.wizardFooter }, footerChildren);

  // ── Compose 2-panel layout ──
  const rightPanel = React.createElement("div", { className: styles.rightPanel },
    React.createElement("div", { className: styles.stepContent }, stepContent),
    footer
  );

  const twoPanel = React.createElement("div", { className: styles.twoPanelLayout },
    leftPanel,
    rightPanel
  );

  return React.createElement(HyperModal, {
    isOpen: props.isOpen,
    onClose: props.onClose,
    title: "HyperProfile Setup",
    size: "xlarge",
  }, twoPanel);
};

export default ProfileWizardModal;
