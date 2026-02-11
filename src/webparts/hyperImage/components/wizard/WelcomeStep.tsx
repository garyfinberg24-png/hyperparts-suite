import * as React from "react";
import { HyperWizard } from "../../../../common/components/wizard/HyperWizard";
import type { IHyperImageWebPartProps } from "../../models";
import { IMAGE_WIZARD_CONFIG, buildStateFromProps } from "./imageWizardConfig";

// ============================================================
// WelcomeStep V2 — HyperImage Setup Wizard (Full-Screen Modal)
// Replaces the old DWx splash screen with the shared HyperWizard
// ============================================================

export interface IWelcomeStepProps {
  /** Whether the wizard modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Apply callback — receives partial web part props from wizard */
  onApply: (result: Partial<IHyperImageWebPartProps>) => void;
  /** Existing web part props for re-editing (undefined for first-time setup) */
  currentProps?: IHyperImageWebPartProps;
}

var WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  // Hydrate wizard state from existing props if re-editing
  var initialStateOverride = React.useMemo(function () {
    if (props.currentProps) {
      return buildStateFromProps(props.currentProps);
    }
    return undefined;
  }, [props.currentProps]);

  return React.createElement(
    HyperWizard,
    {
      config: IMAGE_WIZARD_CONFIG,
      isOpen: props.isOpen,
      onClose: props.onClose,
      onApply: props.onApply,
      initialStateOverride: initialStateOverride,
    }
  );
};

export default WelcomeStep;
