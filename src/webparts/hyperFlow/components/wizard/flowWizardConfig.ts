import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IHyperFlowWebPartProps, IHyperFlowWizardState } from "../../models";
import {
  getFlowModeDisplayName,
  getVisualStyleDisplayName,
  getFunctionalLayoutDisplayName,
  getColorThemeDisplayName,
} from "../../models";
import CreationPathStep from "./CreationPathStep";
import DesignChoiceStep from "./DesignChoiceStep";
import TemplateBrowserStep from "./TemplateBrowserStep";
import PresetBrowserStep from "./PresetBrowserStep";
import OptionsStep from "./OptionsStep";

var DEFAULT_STATE: IHyperFlowWizardState = {
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

var steps: Array<IWizardStepDef<IHyperFlowWizardState>> = [
  {
    id: "creationPath",
    label: "Choose Your Path",
    shortLabel: "Path",
    helpText: "How would you like to create your flow?",
    component: CreationPathStep,
  },
  {
    id: "designChoice",
    label: "Design Choice",
    shortLabel: "Type",
    helpText: "Choose between a visual diagram or functional process stepper.",
    component: DesignChoiceStep,
    hidden: function (state) { return state.creationPath !== "design-your-own"; },
  },
  {
    id: "templateBrowser",
    label: "Choose Template",
    shortLabel: "Template",
    helpText: "Browse pre-built process templates.",
    component: TemplateBrowserStep,
    hidden: function (state) { return state.creationPath !== "templates"; },
  },
  {
    id: "presetBrowser",
    label: "Visual Style",
    shortLabel: "Style",
    helpText: "Pick a visual style and color theme.",
    component: PresetBrowserStep,
    hidden: function (state) { return state.creationPath !== "visual-presets"; },
  },
  {
    id: "options",
    label: "Display Options",
    shortLabel: "Options",
    helpText: "Configure title and display preferences.",
    component: OptionsStep,
  },
];

function buildResult(state: IHyperFlowWizardState): Partial<IHyperFlowWebPartProps> {
  return {
    title: state.title,
    flowMode: state.flowMode,
    visualStyle: state.visualStyle,
    functionalLayout: state.functionalLayout,
    colorTheme: state.colorTheme,
    showStepNumbers: state.showStepNumbers,
    enableAnimation: state.enableAnimation,
    showConnectorLabels: state.showConnectorLabels,
  };
}

function buildSummary(state: IHyperFlowWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];
  if (state.title.length > 0) {
    rows.push({ label: "Title", value: state.title, type: "text" });
  }
  rows.push({ label: "Flow Mode", value: getFlowModeDisplayName(state.flowMode), type: "badge" });
  if (state.flowMode === "visual") {
    rows.push({ label: "Visual Style", value: getVisualStyleDisplayName(state.visualStyle), type: "badge" });
  } else {
    rows.push({ label: "Layout", value: getFunctionalLayoutDisplayName(state.functionalLayout), type: "badge" });
  }
  rows.push({ label: "Color Theme", value: getColorThemeDisplayName(state.colorTheme), type: "badge" });

  var options: string[] = [];
  if (state.showStepNumbers) options.push("Step Numbers");
  if (state.enableAnimation) options.push("Animations");
  if (state.showConnectorLabels) options.push("Connector Labels");
  rows.push({
    label: "Display Options",
    value: options.length > 0 ? options.join(", ") : "None",
    type: options.length > 0 ? "badgeGreen" : "text",
  });

  return rows;
}

export function buildStateFromProps(props: IHyperFlowWebPartProps): IHyperFlowWizardState | undefined {
  if (!props.wizardCompleted) {
    return undefined;
  }
  return {
    creationPath: "design-your-own",
    flowMode: props.flowMode || "visual",
    visualStyle: props.visualStyle || "pill",
    functionalLayout: props.functionalLayout || "horizontal",
    colorTheme: props.colorTheme || "corporate",
    templateId: "",
    title: props.title || "Process Flow",
    showStepNumbers: props.showStepNumbers !== false,
    enableAnimation: props.enableAnimation !== false,
    showConnectorLabels: props.showConnectorLabels !== false,
  };
}

export var FLOW_WIZARD_CONFIG: IHyperWizardConfig<IHyperFlowWizardState, Partial<IHyperFlowWebPartProps>> = {
  title: "HyperFlow Setup Wizard",
  welcome: {
    productName: "Flow",
    tagline: "Beautiful process steppers and visual diagrams for SharePoint",
    features: [
      {
        icon: "SVG:flow",
        title: "5 Visual Styles",
        description: "Pill Flow, Circle Flow, Card Flow, Gradient Lane, and Metro Map",
      },
      {
        icon: "SVG:steps",
        title: "4 Stepper Layouts",
        description: "Horizontal, Timeline, Kanban, and Checklist process views",
      },
      {
        icon: "SVG:palette",
        title: "6 Color Themes",
        description: "Corporate, Purple Haze, Ocean, Sunset, Forest, Monochrome",
      },
      {
        icon: "SVG:designer",
        title: "Drag-Drop Designer",
        description: "Build custom diagrams with nodes, connectors, and styles",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can always change these settings later in the property pane or by re-running the wizard.",
};
