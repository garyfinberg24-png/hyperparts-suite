import * as React from "react";
import { HyperWizard } from "../../../../common/components/wizard/HyperWizard";
import type { IHyperNavWebPartProps } from "../../models";
import { navWizardConfig } from "./navWizardConfig";

export interface IWelcomeStepProps {
  /** Whether the wizard modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Apply callback — receives partial web part props from wizard */
  onApply: (result: Partial<IHyperNavWebPartProps>) => void;
  /** Existing web part props for re-editing (undefined for first-time setup) */
  currentProps?: IHyperNavWebPartProps;
}

var WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  return React.createElement(
    HyperWizard,
    {
      config: navWizardConfig,
      isOpen: props.isOpen,
      onClose: props.onClose,
      onApply: props.onApply,
    }
  );
};

export default WelcomeStep;
