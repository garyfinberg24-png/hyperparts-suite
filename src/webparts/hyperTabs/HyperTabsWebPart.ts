import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  type IPropertyPaneGroup,
  type IPropertyPaneField,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneLabel,
  PropertyPaneHorizontalRule,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperTabsWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperTabs from "./components/HyperTabs";
import type { IHyperTabsComponentProps } from "./components/HyperTabs";
import type { IHyperTabsWebPartProps, IHyperTabPanel } from "./models";
import { DEFAULT_PANEL, DEFAULT_PANEL_2 } from "./models";
import {
  parsePanels,
  stringifyPanels,
  createPanel,
  removePanel,
  reorderPanel,
} from "./utils/panelUtils";

export default class HyperTabsWebPart extends BaseHyperWebPart<IHyperTabsWebPartProps> {

  /** Callback: WelcomeStep splash completed */
  private _onWizardComplete = (result: Record<string, unknown>): void => {
    this.properties.wizardCompleted = true;
    Object.keys(result).forEach((key: string): void => {
      (this.properties as unknown as Record<string, unknown>)[key] = result[key];
    });
    this.render();
  };

  public render(): void {
    const props: IHyperTabsComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === 2,
      onWizardComplete: this._onWizardComplete,
    };
    const element: React.ReactElement<IHyperTabsComponentProps> =
      React.createElement(HyperTabs, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "";
    }
    if (this.properties.displayMode === undefined) {
      this.properties.displayMode = "tabs";
    }
    if (this.properties.tabStyle === undefined) {
      this.properties.tabStyle = "horizontal";
    }
    if (this.properties.panels === undefined) {
      this.properties.panels = stringifyPanels([DEFAULT_PANEL, DEFAULT_PANEL_2]);
    }
    if (this.properties.enableDeepLinking === undefined) {
      this.properties.enableDeepLinking = true;
    }
    if (this.properties.enableLazyLoading === undefined) {
      this.properties.enableLazyLoading = true;
    }
    if (this.properties.enableResponsiveCollapse === undefined) {
      this.properties.enableResponsiveCollapse = true;
    }
    if (this.properties.mobileBreakpoint === undefined) {
      this.properties.mobileBreakpoint = 768;
    }
    if (this.properties.defaultActivePanel === undefined) {
      this.properties.defaultActivePanel = "";
    }
    if (this.properties.accordionMultiExpand === undefined) {
      this.properties.accordionMultiExpand = false;
    }
    if (this.properties.accordionExpandAll === undefined) {
      this.properties.accordionExpandAll = false;
    }
    if (this.properties.wizardShowProgress === undefined) {
      this.properties.wizardShowProgress = true;
    }
    if (this.properties.wizardLinearMode === undefined) {
      this.properties.wizardLinearMode = false;
    }
    if (this.properties.animationEnabled === undefined) {
      this.properties.animationEnabled = true;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  /**
   * Update panels JSON and refresh the property pane + component.
   */
  private _updatePanels(panels: IHyperTabPanel[]): void {
    this.properties.panels = stringifyPanels(panels);
    this.render();
    this.context.propertyPane.refresh();
  }

  /**
   * Build fields for a single panel at the given index.
   */
  private _buildSinglePanelFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: IPropertyPaneField<any>[],
    panel: IHyperTabPanel,
    index: number,
    totalPanels: number
  ): void {
    // Panel header label
    fields.push(
      PropertyPaneLabel("_panelLabel" + index, {
        text: strings.PanelHeaderPrefix + " " + (index + 1) + ": " + panel.title,
      })
    );

    // Title field
    fields.push(
      PropertyPaneTextField("_panelTitle" + index, {
        label: strings.PanelTitleLabel,
        value: panel.title,
      })
    );

    // Content type dropdown
    fields.push(
      PropertyPaneDropdown("_panelContentType" + index, {
        label: strings.PanelContentTypeLabel,
        selectedKey: panel.contentType,
        options: [
          { key: "simple", text: "Simple HTML" },
          { key: "image", text: "Image + HTML" },
          { key: "nested-tabs", text: "Nested Tabs" },
        ],
      })
    );

    const panelId = panel.id;

    // Move Up button (disabled for first panel)
    fields.push(
      PropertyPaneButton("_panelMoveUp" + index, {
        text: strings.MoveUpLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronUp",
        disabled: index === 0,
        onClick: this._createMoveHandler(index, index - 1),
      })
    );

    // Move Down button (disabled for last panel)
    fields.push(
      PropertyPaneButton("_panelMoveDown" + index, {
        text: strings.MoveDownLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronDown",
        disabled: index === totalPanels - 1,
        onClick: this._createMoveHandler(index, index + 1),
      })
    );

    // Remove button
    fields.push(
      PropertyPaneButton("_panelRemove" + index, {
        text: strings.RemovePanelLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Delete",
        onClick: this._createRemoveHandler(panelId),
      })
    );

    // Horizontal rule between panels
    fields.push(PropertyPaneHorizontalRule());
  }

  private _createMoveHandler(fromIndex: number, toIndex: number): () => string {
    return (): string => {
      const currentPanels = parsePanels(this.properties.panels);
      const reordered = reorderPanel(currentPanels, fromIndex, toIndex);
      this._updatePanels(reordered);
      return "";
    };
  }

  private _createRemoveHandler(panelId: string): () => string {
    return (): string => {
      const currentPanels = parsePanels(this.properties.panels);
      const updated = removePanel(currentPanels, panelId);
      this._updatePanels(updated);
      return "";
    };
  }

  private _createAddHandler(): () => string {
    return (): string => {
      const currentPanels = parsePanels(this.properties.panels);
      const newPanel = createPanel(
        strings.NewPanelDefaultTitle + " " + (currentPanels.length + 1),
        currentPanels.length
      );
      currentPanels.push(newPanel);
      this._updatePanels(currentPanels);
      return "";
    };
  }

  /**
   * Build dynamic per-panel fields for property pane Page 2.
   */
  private _buildPanelFields(): IPropertyPaneField<unknown>[] {
    const panels = parsePanels(this.properties.panels);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: IPropertyPaneField<any>[] = [];

    for (let i = 0; i < panels.length; i++) {
      this._buildSinglePanelFields(fields, panels[i], i, panels.length);
    }

    // Add New Panel button
    fields.push(
      PropertyPaneButton("_panelAdd", {
        text: strings.AddPanelLabel,
        buttonType: PropertyPaneButtonType.Primary,
        icon: "Add",
        onClick: this._createAddHandler(),
      })
    );

    return fields;
  }

  /**
   * Handle dynamic property pane field changes for per-panel editing.
   */
  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    // Handle per-panel title changes
    if (propertyPath.indexOf("_panelTitle") === 0) {
      const indexStr = propertyPath.substring("_panelTitle".length);
      const panelIndex = parseInt(indexStr, 10);
      if (!isNaN(panelIndex)) {
        const panels = parsePanels(this.properties.panels);
        if (panelIndex >= 0 && panelIndex < panels.length) {
          panels[panelIndex].title = String(newValue);
          this.properties.panels = stringifyPanels(panels);
          this.render();
        }
      }
      return;
    }

    // Handle per-panel contentType changes
    if (propertyPath.indexOf("_panelContentType") === 0) {
      const indexStr = propertyPath.substring("_panelContentType".length);
      const panelIndex = parseInt(indexStr, 10);
      if (!isNaN(panelIndex)) {
        const panels = parsePanels(this.properties.panels);
        if (panelIndex >= 0 && panelIndex < panels.length) {
          panels[panelIndex].contentType = String(newValue) as "simple" | "image" | "nested-tabs";
          this.properties.panels = stringifyPanels(panels);
          this.render();
        }
      }
      return;
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // Build dynamic panel management group
    const panelManagementGroup: IPropertyPaneGroup = {
      groupName: strings.PanelsGroupName,
      groupFields: this._buildPanelFields(),
    };

    return {
      pages: [
        // ── Page 1: Layout & Appearance ──
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("displayMode", {
                  label: strings.DisplayModeFieldLabel,
                  options: [
                    { key: "tabs", text: "Tabs" },
                    { key: "accordion", text: "Accordion" },
                    { key: "wizard", text: "Wizard" },
                  ],
                }),
                PropertyPaneDropdown("tabStyle", {
                  label: strings.TabStyleFieldLabel,
                  disabled: this.properties.displayMode !== "tabs",
                  options: [
                    { key: "horizontal", text: "Horizontal" },
                    { key: "vertical", text: "Vertical" },
                    { key: "pill", text: "Pill" },
                    { key: "underline", text: "Underline" },
                  ],
                }),
                PropertyPaneToggle("animationEnabled", {
                  label: strings.AnimationEnabledLabel,
                }),
              ],
            },
          ],
        },
        // ── Page 2: Panels Management ──
        {
          header: { description: strings.PanelsPageDescription },
          groups: [panelManagementGroup],
        },
        // ── Page 3: Advanced ──
        {
          header: { description: strings.AdvancedPageDescription },
          groups: [
            {
              groupName: strings.AdvancedGroupName,
              groupFields: [
                PropertyPaneToggle("enableDeepLinking", {
                  label: strings.EnableDeepLinkingLabel,
                }),
                PropertyPaneToggle("enableLazyLoading", {
                  label: strings.EnableLazyLoadingLabel,
                }),
                PropertyPaneToggle("enableResponsiveCollapse", {
                  label: strings.EnableResponsiveCollapseLabel,
                }),
                PropertyPaneSlider("mobileBreakpoint", {
                  label: strings.MobileBreakpointLabel,
                  min: 320,
                  max: 1024,
                  step: 8,
                  disabled: !this.properties.enableResponsiveCollapse,
                }),
                PropertyPaneTextField("defaultActivePanel", {
                  label: strings.DefaultActivePanelLabel,
                }),
                PropertyPaneToggle("accordionMultiExpand", {
                  label: strings.AccordionMultiExpandLabel,
                  disabled: this.properties.displayMode !== "accordion",
                }),
                PropertyPaneToggle("accordionExpandAll", {
                  label: strings.AccordionExpandAllLabel,
                  disabled: this.properties.displayMode !== "accordion",
                }),
                PropertyPaneToggle("wizardShowProgress", {
                  label: strings.WizardShowProgressLabel,
                  disabled: this.properties.displayMode !== "wizard",
                }),
                PropertyPaneToggle("wizardLinearMode", {
                  label: strings.WizardLinearModeLabel,
                  disabled: this.properties.displayMode !== "wizard",
                }),
                PropertyPaneToggle("enableDemoMode", {
                  label: strings.EnableDemoModeLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
