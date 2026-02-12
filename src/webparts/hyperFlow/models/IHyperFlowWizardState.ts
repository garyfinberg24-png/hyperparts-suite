import type {
  FlowMode,
  FlowVisualStyle,
  FlowFunctionalLayout,
  FlowColorTheme,
  FlowCreationPath,
} from "./IHyperFlowEnums";

export interface IHyperFlowWizardState {
  creationPath: FlowCreationPath;
  flowMode: FlowMode;
  visualStyle: FlowVisualStyle;
  functionalLayout: FlowFunctionalLayout;
  colorTheme: FlowColorTheme;
  templateId: string;
  title: string;
  showStepNumbers: boolean;
  enableAnimation: boolean;
  showConnectorLabels: boolean;
}

export var DEFAULT_WIZARD_STATE: IHyperFlowWizardState = {
  creationPath: "design-your-own",
  flowMode: "visual",
  visualStyle: "pill",
  functionalLayout: "horizontal",
  colorTheme: "corporate",
  templateId: "",
  title: "Process Flow",
  showStepNumbers: true,
  enableAnimation: true,
  showConnectorLabels: true,
};
