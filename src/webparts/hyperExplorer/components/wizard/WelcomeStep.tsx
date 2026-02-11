import * as React from "react";
import { HyperWizard } from "../../../../common/components/wizard/HyperWizard";
import type { IHyperExplorerWebPartProps } from "../../models";
import { EXPLORER_WIZARD_CONFIG, buildStateFromProps } from "./explorerWizardConfig";

export interface IWelcomeStepProps {
  /** Whether the wizard modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Apply callback — receives partial web part props from wizard */
  onApply: (result: Partial<IHyperExplorerWebPartProps>) => void;
  /** Existing web part props for re-editing (undefined for first-time setup) */
  currentProps?: IHyperExplorerWebPartProps;
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
      config: EXPLORER_WIZARD_CONFIG,
      isOpen: props.isOpen,
      onClose: props.onClose,
      onApply: props.onApply,
      initialStateOverride: initialStateOverride,
    }
  );
};

export default WelcomeStep;
