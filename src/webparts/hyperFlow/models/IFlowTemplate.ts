// ============================================================
// HyperFlow — Template and color theme models
// ============================================================

import type { FlowMode, FlowVisualStyle, FlowFunctionalLayout, FlowColorTheme } from "./IHyperFlowEnums";
import type { IFlowDiagram } from "./IFlowDiagram";
import type { IFlowProcess } from "./IFlowProcess";

export interface IFlowColorThemeDefinition {
  id: FlowColorTheme;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  nodeColors: string[];
  connectorColor: string;
}

export interface IFlowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  flowMode: FlowMode;
  visualStyle?: FlowVisualStyle;
  functionalLayout?: FlowFunctionalLayout;
  colorTheme: FlowColorTheme;
  diagram?: IFlowDiagram;
  process?: IFlowProcess;
  previewIcon: string;
}
