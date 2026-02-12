import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperFlowWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperFlow from "./components/HyperFlow";
import type { IHyperFlowComponentProps } from "./components/HyperFlow";
import type { IHyperFlowWebPartProps } from "./models";
import { createGroupHeaderField } from "../../common/propertyPane";

export default class HyperFlowWebPart extends BaseHyperWebPart<IHyperFlowWebPartProps> {

  private _onWizardApply = (result: Partial<IHyperFlowWebPartProps>): void => {
    const self = this;
    const keys = Object.keys(result);
    keys.forEach(function (key: string) {
      (self.properties as unknown as Record<string, unknown>)[key] = (result as unknown as Record<string, unknown>)[key];
    });
    self.properties.wizardCompleted = true;
    self.render();
    self.context.propertyPane.refresh();
  };

  public render(): void {
    const props: IHyperFlowComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onWizardApply: this._onWizardApply,
      onConfigure: (): void => { this.context.propertyPane.open(); },
    };
    const element: React.ReactElement<IHyperFlowComponentProps> =
      React.createElement(HyperFlow, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "Process Flow";
    }
    if (this.properties.flowMode === undefined) {
      this.properties.flowMode = "visual";
    }
    if (this.properties.visualStyle === undefined) {
      this.properties.visualStyle = "pill";
    }
    if (this.properties.functionalLayout === undefined) {
      this.properties.functionalLayout = "horizontal";
    }
    if (this.properties.colorTheme === undefined) {
      this.properties.colorTheme = "corporate";
    }
    if (this.properties.diagramJson === undefined) {
      this.properties.diagramJson = "";
    }
    if (this.properties.processJson === undefined) {
      this.properties.processJson = "";
    }
    if (this.properties.showStepNumbers === undefined) {
      this.properties.showStepNumbers = true;
    }
    if (this.properties.enableAnimation === undefined) {
      this.properties.enableAnimation = true;
    }
    if (this.properties.showConnectorLabels === undefined) {
      this.properties.showConnectorLabels = true;
    }
    if (this.properties.dataSource === undefined) {
      this.properties.dataSource = "manual";
    }
    if (this.properties.listId === undefined) {
      this.properties.listId = "";
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = true;
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = true;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        // Page 1: Content & Data
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.ContentGroupName,
              groupFields: [
                createGroupHeaderField("_contentHeader", { icon: "SVG:content", title: "Content & Data", subtitle: "Flow configuration", color: "green" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("flowMode", {
                  label: strings.FlowModeFieldLabel,
                  options: [
                    { key: "visual", text: "Visual Diagram" },
                    { key: "functional", text: "Process Stepper" },
                  ],
                }),
                PropertyPaneDropdown("dataSource", {
                  label: strings.DataSourceFieldLabel,
                  options: [
                    { key: "manual", text: "Manual" },
                    { key: "list", text: "SharePoint List" },
                  ],
                }),
                PropertyPaneTextField("listId", {
                  label: strings.ListIdFieldLabel,
                }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataFieldLabel,
                }),
              ],
            },
          ],
        },
        // Page 2: Layout & Style
        {
          header: { description: strings.LayoutPageDescription },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                createGroupHeaderField("_layoutHeader", { icon: "SVG:layout", title: "Layout & Style", subtitle: "Visual appearance", color: "blue" }),
                PropertyPaneDropdown("visualStyle", {
                  label: strings.VisualStyleFieldLabel,
                  options: [
                    { key: "pill", text: "Pill Flow" },
                    { key: "circle", text: "Circle Flow" },
                    { key: "card", text: "Card Flow" },
                    { key: "gradient-lane", text: "Gradient Lane" },
                    { key: "metro-map", text: "Metro Map" },
                  ],
                }),
                PropertyPaneDropdown("functionalLayout", {
                  label: strings.FunctionalLayoutFieldLabel,
                  options: [
                    { key: "horizontal", text: "Horizontal" },
                    { key: "timeline", text: "Timeline" },
                    { key: "kanban", text: "Kanban" },
                    { key: "checklist", text: "Checklist" },
                  ],
                }),
                PropertyPaneDropdown("colorTheme", {
                  label: strings.ColorThemeFieldLabel,
                  options: [
                    { key: "corporate", text: "Corporate" },
                    { key: "purple-haze", text: "Purple Haze" },
                    { key: "ocean", text: "Ocean" },
                    { key: "sunset", text: "Sunset" },
                    { key: "forest", text: "Forest" },
                    { key: "monochrome", text: "Monochrome" },
                  ],
                }),
              ],
            },
          ],
        },
        // Page 3: Features
        {
          header: { description: strings.FeaturesPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                createGroupHeaderField("_featuresHeader", { icon: "SVG:features", title: "Features", subtitle: "Display options", color: "orange" }),
                PropertyPaneToggle("showStepNumbers", {
                  label: strings.ShowStepNumbersFieldLabel,
                }),
                PropertyPaneToggle("enableAnimation", {
                  label: strings.EnableAnimationFieldLabel,
                }),
                PropertyPaneToggle("showConnectorLabels", {
                  label: strings.ShowConnectorLabelsFieldLabel,
                }),
                PropertyPaneToggle("enableDemoMode", {
                  label: strings.EnableDemoModeFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
