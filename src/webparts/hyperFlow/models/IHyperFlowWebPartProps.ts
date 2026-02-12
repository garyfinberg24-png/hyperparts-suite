import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type {
  FlowMode,
  FlowVisualStyle,
  FlowFunctionalLayout,
  FlowColorTheme,
  FlowDataSource,
} from "./IHyperFlowEnums";

export interface IHyperFlowWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  flowMode: FlowMode;
  visualStyle: FlowVisualStyle;
  functionalLayout: FlowFunctionalLayout;
  colorTheme: FlowColorTheme;

  // Serialized JSON data
  diagramJson: string;
  processJson: string;

  // Display options
  showStepNumbers: boolean;
  enableAnimation: boolean;
  showConnectorLabels: boolean;

  // Data source (functional mode)
  dataSource: FlowDataSource;
  listId: string;

  // Standard props
  useSampleData: boolean;
  wizardCompleted: boolean;
  enableDemoMode: boolean;
}
