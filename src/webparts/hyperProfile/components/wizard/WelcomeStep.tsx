import * as React from "react";
import { HyperWizard } from "../../../../common/components/wizard/HyperWizard";
import type { IHyperProfileWebPartProps } from "../../models";
import { PROFILE_WIZARD_CONFIG, buildStateFromProfileProps } from "./profileWizardConfig";

export interface IWelcomeStepProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: Partial<IHyperProfileWebPartProps>) => void;
  currentProps?: IHyperProfileWebPartProps;
}

var WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  var initialStateOverride = React.useMemo(function () {
    if (props.currentProps) {
      return buildStateFromProfileProps(props.currentProps);
    }
    return undefined;
  }, [props.currentProps]);

  return React.createElement(
    HyperWizard,
    {
      config: PROFILE_WIZARD_CONFIG,
      isOpen: props.isOpen,
      onClose: props.onClose,
      onApply: props.onApply,
      initialStateOverride: initialStateOverride,
    }
  );
};

export default WelcomeStep;
