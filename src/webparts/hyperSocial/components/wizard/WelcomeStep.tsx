import * as React from "react";
import { HyperWizard } from "../../../../common/components/wizard/HyperWizard";
import type { IHyperSocialWebPartProps } from "../../models";
import { SOCIAL_WIZARD_CONFIG, buildStateFromProps } from "./socialWizardConfig";

export interface IWelcomeStepProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: Partial<IHyperSocialWebPartProps>) => void;
  currentProps?: IHyperSocialWebPartProps;
}

var WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  var initialStateOverride = React.useMemo(function () {
    if (props.currentProps) {
      return buildStateFromProps(props.currentProps);
    }
    return undefined;
  }, [props.currentProps]);

  return React.createElement(
    HyperWizard,
    {
      config: SOCIAL_WIZARD_CONFIG,
      isOpen: props.isOpen,
      onClose: props.onClose,
      onApply: props.onApply,
      initialStateOverride: initialStateOverride,
    }
  );
};

export default WelcomeStep;
