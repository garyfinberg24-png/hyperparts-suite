import * as React from "react";
import type { IHyperTickerWebPartProps } from "../../models";
import HyperWizard from "../../../../common/components/wizard/HyperWizard";
import { TICKER_WIZARD_CONFIG, buildStateFromProps } from "./tickerWizardConfig";
import type { ITickerWizardState } from "../../models/ITickerWizardState";

export interface IWelcomeStepProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: Partial<IHyperTickerWebPartProps>) => void;
  /** Existing web part properties for re-edit hydration */
  currentProps?: IHyperTickerWebPartProps;
}

const WelcomeStep: React.FC<IWelcomeStepProps> = function (props) {
  // Hydrate state from existing props for re-editing
  const stateOverride: ITickerWizardState | undefined = props.currentProps
    ? buildStateFromProps(props.currentProps)
    : undefined;

  return React.createElement(HyperWizard, {
    config: TICKER_WIZARD_CONFIG,
    isOpen: props.isOpen,
    onClose: props.onClose,
    onApply: props.onApply,
    initialStateOverride: stateOverride,
  });
};

export default WelcomeStep;
