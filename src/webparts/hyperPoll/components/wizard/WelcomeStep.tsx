import * as React from "react";
import { HyperWizard } from "../../../../common/components/wizard/HyperWizard";
import type { IHyperPollWebPartProps } from "../../models";
import { POLL_WIZARD_CONFIG } from "./pollWizardConfig";

export interface IWelcomeStepProps {
  /** Whether the wizard modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Apply callback — receives partial web part props from wizard */
  onApply: (result: Partial<IHyperPollWebPartProps>) => void;
  /** Existing web part props for re-editing (undefined for first-time setup) */
  currentProps?: IHyperPollWebPartProps;
}

var WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  return React.createElement(
    HyperWizard,
    {
      config: POLL_WIZARD_CONFIG,
      isOpen: props.isOpen,
      onClose: props.onClose,
      onApply: props.onApply,
    }
  );
};

export default WelcomeStep;
