import * as React from "react";
import styles from "./HyperFlow.module.scss";
import type { IHyperFlowWebPartProps, IFlowDiagram, IFlowProcess, FlowMode, FlowVisualStyle, FlowFunctionalLayout, FlowColorTheme } from "../models";
import { HyperErrorBoundary, HyperEditOverlay } from "../../../common/components";
import { useHyperFlowStore } from "../store/useHyperFlowStore";
import WelcomeStep from "./wizard/WelcomeStep";
import FlowVisualRenderer from "./visual/FlowVisualRenderer";
import FlowFunctionalRenderer from "./functional/FlowFunctionalRenderer";
import { FLOW_COLOR_THEMES } from "../utils/flowColorThemes";
import { SAMPLE_VISUAL_DIAGRAM, SAMPLE_FUNCTIONAL_PROCESS } from "../utils/sampleData";
import FlowIcon from "../utils/FlowIcon";
import HyperFlowDemoBar from "./HyperFlowDemoBar";
import FlowDesigner from "./designer/FlowDesigner";

export interface IHyperFlowComponentProps extends IHyperFlowWebPartProps {
  instanceId: string;
  isEditMode: boolean;
  onWizardApply: (result: Partial<IHyperFlowWebPartProps>) => void;
  onConfigure: () => void;
}

/** Safely parse JSON, returning undefined on failure */
function safeParseDiagram(json: string): IFlowDiagram | undefined {
  if (!json) { return undefined; }
  try {
    return JSON.parse(json) as IFlowDiagram;
  } catch (_e) {
    return undefined;
  }
}

function safeParseProcess(json: string): IFlowProcess | undefined {
  if (!json) { return undefined; }
  try {
    return JSON.parse(json) as IFlowProcess;
  } catch (_e) {
    return undefined;
  }
}

var HyperFlowInner: React.FC<IHyperFlowComponentProps> = function (props) {
  var isWizardOpen = useHyperFlowStore(function (s) { return s.isWizardOpen; });
  var openWizard = useHyperFlowStore(function (s) { return s.openWizard; });
  var closeWizard = useHyperFlowStore(function (s) { return s.closeWizard; });
  var isDesignerOpen = useHyperFlowStore(function (s) { return s.isDesignerOpen; });
  var openDesigner = useHyperFlowStore(function (s) { return s.openDesigner; });
  var closeDesigner = useHyperFlowStore(function (s) { return s.closeDesigner; });

  // Auto-open wizard on first load
  React.useEffect(function () {
    if (!props.wizardCompleted) {
      openWizard();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Demo mode local state overrides
  var demoFlowModeState = React.useState<FlowMode>(props.flowMode);
  var demoFlowMode = demoFlowModeState[0];
  var setDemoFlowMode = demoFlowModeState[1];
  var demoVisualStyleState = React.useState<FlowVisualStyle>(props.visualStyle);
  var demoVisualStyle = demoVisualStyleState[0];
  var setDemoVisualStyle = demoVisualStyleState[1];
  var demoColorThemeState = React.useState<FlowColorTheme>(props.colorTheme);
  var demoColorTheme = demoColorThemeState[0];
  var setDemoColorTheme = demoColorThemeState[1];
  var demoFunctionalLayoutState = React.useState<FlowFunctionalLayout>(props.functionalLayout);
  var demoFunctionalLayout = demoFunctionalLayoutState[0];
  var setDemoFunctionalLayout = demoFunctionalLayoutState[1];
  var demoStepNumbersState = React.useState(props.showStepNumbers);
  var demoStepNumbers = demoStepNumbersState[0];
  var setDemoStepNumbers = demoStepNumbersState[1];
  var demoAnimationState = React.useState(props.enableAnimation);
  var demoAnimation = demoAnimationState[0];
  var setDemoAnimation = demoAnimationState[1];
  var demoConnectorLabelsState = React.useState(props.showConnectorLabels);
  var demoConnectorLabels = demoConnectorLabelsState[0];
  var setDemoConnectorLabels = demoConnectorLabelsState[1];

  // Sync demo state when props change
  React.useEffect(function () { setDemoFlowMode(props.flowMode); }, [props.flowMode]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(function () { setDemoVisualStyle(props.visualStyle); }, [props.visualStyle]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(function () { setDemoColorTheme(props.colorTheme); }, [props.colorTheme]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(function () { setDemoFunctionalLayout(props.functionalLayout); }, [props.functionalLayout]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(function () { setDemoStepNumbers(props.showStepNumbers); }, [props.showStepNumbers]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(function () { setDemoAnimation(props.enableAnimation); }, [props.enableAnimation]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(function () { setDemoConnectorLabels(props.showConnectorLabels); }, [props.showConnectorLabels]); // eslint-disable-line react-hooks/exhaustive-deps

  // Active values: demo overrides when demo mode on, else prop values
  var activeFlowMode = props.enableDemoMode ? demoFlowMode : props.flowMode;
  var activeVisualStyle = props.enableDemoMode ? demoVisualStyle : props.visualStyle;
  var activeColorTheme = props.enableDemoMode ? demoColorTheme : props.colorTheme;
  var activeFunctionalLayout = props.enableDemoMode ? demoFunctionalLayout : props.functionalLayout;
  var activeStepNumbers = props.enableDemoMode ? demoStepNumbers : props.showStepNumbers;
  var activeAnimation = props.enableDemoMode ? demoAnimation : props.enableAnimation;
  var activeConnectorLabels = props.enableDemoMode ? demoConnectorLabels : props.showConnectorLabels;

  // Resolve data — sample data or parsed JSON
  var diagram = React.useMemo(function (): IFlowDiagram | undefined {
    if (props.useSampleData) {
      return SAMPLE_VISUAL_DIAGRAM;
    }
    return safeParseDiagram(props.diagramJson);
  }, [props.useSampleData, props.diagramJson]);

  var process = React.useMemo(function (): IFlowProcess | undefined {
    if (props.useSampleData) {
      return SAMPLE_FUNCTIONAL_PROCESS;
    }
    return safeParseProcess(props.processJson);
  }, [props.useSampleData, props.processJson]);

  // Resolve theme definition
  var themeDefinition = FLOW_COLOR_THEMES[activeColorTheme] || FLOW_COLOR_THEMES["corporate"];

  // Build children array
  var children: React.ReactElement[] = [];

  // Wizard
  if (isWizardOpen) {
    children.push(
      React.createElement(WelcomeStep, {
        key: "wizard",
        isOpen: isWizardOpen,
        onClose: closeWizard,
        onApply: function (result) {
          props.onWizardApply(result);
          closeWizard();
        },
        currentProps: props.wizardCompleted ? (props as any) : undefined, // eslint-disable-line @typescript-eslint/no-explicit-any
      })
    );
  }

  // Designer (full-screen canvas replaces content)
  if (isDesignerOpen && activeFlowMode === "visual") {
    var designerDiagram = diagram || { nodes: [], connectors: [], direction: "horizontal" as const };
    return React.createElement("div", { className: styles.hyperFlow },
      React.createElement(FlowDesigner, {
        diagram: designerDiagram,
        theme: themeDefinition,
        onSave: function (updatedDiagram: IFlowDiagram): void {
          props.onWizardApply({ diagramJson: JSON.stringify(updatedDiagram) });
          closeDesigner();
        },
        onCancel: closeDesigner,
      })
    );
  }

  // Edit overlay
  if (props.isEditMode && props.wizardCompleted) {
    children.push(
      React.createElement(HyperEditOverlay, {
        key: "edit-overlay",
        wpName: "HyperFlow",
        onWizardClick: openWizard,
        onEditClick: props.onConfigure,
        isVisible: true,
      })
    );
  }

  // Sample data banner
  if (props.useSampleData) {
    children.push(
      React.createElement("div", { key: "sample-banner", className: styles.sampleBanner },
        "Sample data active \u2014 configure a real process in the property pane."
      )
    );
  }

  // DemoBar
  if (props.enableDemoMode) {
    children.push(
      React.createElement(HyperFlowDemoBar, {
        key: "demo-bar",
        flowMode: demoFlowMode,
        visualStyle: demoVisualStyle,
        functionalLayout: demoFunctionalLayout,
        colorTheme: demoColorTheme,
        showStepNumbers: demoStepNumbers,
        enableAnimation: demoAnimation,
        showConnectorLabels: demoConnectorLabels,
        onFlowModeChange: setDemoFlowMode,
        onVisualStyleChange: setDemoVisualStyle,
        onFunctionalLayoutChange: setDemoFunctionalLayout,
        onColorThemeChange: setDemoColorTheme,
        onStepNumbersToggle: function (): void { setDemoStepNumbers(function (v: boolean) { return !v; }); },
        onAnimationToggle: function (): void { setDemoAnimation(function (v: boolean) { return !v; }); },
        onConnectorLabelsToggle: function (): void { setDemoConnectorLabels(function (v: boolean) { return !v; }); },
        onOpenWizard: openWizard,
        onExitDemo: function (): void { /* exit demo handled by property pane */ },
      })
    );
  }

  // Title
  if (props.title) {
    children.push(
      React.createElement("div", { key: "title", className: styles.flowTitle }, props.title)
    );
  }

  // Content renderers
  if (activeFlowMode === "visual") {
    if (diagram && diagram.nodes && diagram.nodes.length > 0) {
      children.push(
        React.createElement(FlowVisualRenderer, {
          key: "visual-renderer",
          diagram: diagram,
          visualStyle: activeVisualStyle,
          theme: themeDefinition,
          showStepNumbers: activeStepNumbers,
          enableAnimation: activeAnimation,
          showConnectorLabels: activeConnectorLabels,
        })
      );
    } else {
      children.push(
        React.createElement("div", { key: "empty", className: styles.emptyState },
          React.createElement("div", { className: styles.emptyIcon },
            React.createElement(FlowIcon, { name: "flow", size: 32 })
          ),
          React.createElement("div", { className: styles.emptyTitle }, "No Diagram Data"),
          React.createElement("div", { className: styles.emptyDesc },
            "Open the Setup Wizard or enable Sample Data to see a visual flow diagram."
          ),
          props.isEditMode ? React.createElement("button", {
            style: { marginTop: 16, padding: "8px 20px", background: "#0078d4", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 },
            type: "button",
            onClick: openDesigner,
          }, "Open Designer") : undefined
        )
      );
    }
  } else if (activeFlowMode === "functional") {
    if (process && process.steps && process.steps.length > 0) {
      children.push(
        React.createElement(FlowFunctionalRenderer, {
          key: "functional-renderer",
          process: process,
          functionalLayout: activeFunctionalLayout,
          theme: themeDefinition,
          showStepNumbers: activeStepNumbers,
          enableAnimation: activeAnimation,
          showConnectorLabels: activeConnectorLabels,
        })
      );
    } else {
      children.push(
        React.createElement("div", { key: "empty", className: styles.emptyState },
          React.createElement("div", { className: styles.emptyIcon },
            React.createElement(FlowIcon, { name: "steps", size: 32 })
          ),
          React.createElement("div", { className: styles.emptyTitle }, "No Process Data"),
          React.createElement("div", { className: styles.emptyDesc },
            "Open the Setup Wizard or enable Sample Data to see a process stepper."
          )
        )
      );
    }
  }

  return React.createElement("div", { className: styles.hyperFlow }, children);
};

var HyperFlow: React.FC<IHyperFlowComponentProps> = function (props) {
  return React.createElement(HyperErrorBoundary, undefined,
    React.createElement(HyperFlowInner, props)
  );
};

export default HyperFlow;
