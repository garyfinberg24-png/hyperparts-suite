import * as React from "react";
import { HyperWizard } from "../../../../common/components/wizard/HyperWizard";
import type { IHyperFlowWebPartProps } from "../../models";
import { FLOW_WIZARD_CONFIG, buildStateFromProps } from "./flowWizardConfig";

export interface IWelcomeStepProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: Partial<IHyperFlowWebPartProps>) => void;
  currentProps?: IHyperFlowWebPartProps;
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
      config: FLOW_WIZARD_CONFIG,
      isOpen: props.isOpen,
      onClose: props.onClose,
      onApply: props.onApply,
      initialStateOverride: initialStateOverride,
    }
  );
};

export default WelcomeStep;
