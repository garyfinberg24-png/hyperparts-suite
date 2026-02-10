import * as React from "react";
import type { IHyperStyleWebPartProps } from "../../models";
import HyperWizard from "../../../../common/components/wizard/HyperWizard";
import { STYLE_WIZARD_CONFIG, buildStateFromProps } from "./hyperStyleWizardConfig";
import type { IStyleWizardState } from "../../models/IHyperStyleWizardState";

export interface IWelcomeStepProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: Partial<IHyperStyleWebPartProps>) => void;
  currentProps?: IHyperStyleWebPartProps;
}

var WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  var stateOverride: IStyleWizardState | undefined = props.currentProps
    ? buildStateFromProps(props.currentProps)
    : undefined;

  return React.createElement(HyperWizard, {
    config: STYLE_WIZARD_CONFIG,
    isOpen: props.isOpen,
    onClose: props.onClose,
    onApply: props.onApply,
    initialStateOverride: stateOverride,
  });
};

export default WelcomeStep;
