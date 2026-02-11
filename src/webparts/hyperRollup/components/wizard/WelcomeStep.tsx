import * as React from "react";
import { HyperWizard } from "../../../../common/components/wizard/HyperWizard";
import type { IHyperRollupWebPartProps } from "../../models";
import { ROLLUP_WIZARD_CONFIG, buildStateFromProps } from "./rollupWizardConfig";

export interface IWelcomeStepProps {
  /** Whether the wizard modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Apply callback — receives partial web part props from wizard */
  onApply: (result: Partial<IHyperRollupWebPartProps>) => void;
  /** Existing web part props for re-editing (undefined for first-time setup) */
  currentProps?: IHyperRollupWebPartProps;
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
      config: ROLLUP_WIZARD_CONFIG,
      isOpen: props.isOpen,
      onClose: props.onClose,
      onApply: props.onApply,
      initialStateOverride: initialStateOverride,
    }
  );
};

export default WelcomeStep;
