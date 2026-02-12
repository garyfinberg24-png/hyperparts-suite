import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneLabel,
  PropertyPaneButton,
  PropertyPaneButtonType,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperTickerWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import { createGroupHeaderField } from "../../common/propertyPane";
import HyperTicker from "./components/HyperTicker";
import type { IHyperTickerComponentProps } from "./components/HyperTicker";
import type { IHyperTickerWebPartProps } from "./models";
import { parseTickerItems, ALL_TEMPLATE_IDS, getTickerTemplateDisplayName } from "./models";

export default class HyperTickerWebPart extends BaseHyperWebPart<IHyperTickerWebPartProps> {

  private _onItemsChange = (itemsJson: string): void => {
    this.properties.items = itemsJson;
    this.render();
  };

  private _onWizardApply = (result: Partial<IHyperTickerWebPartProps>): void => {
    this.properties.wizardCompleted = true;
    const props = this.properties;
    const keys = Object.keys(result);
    keys.forEach(function (key: string) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (props as any)[key] = (result as any)[key];
    });
    this.render();
  };

  public render(): void {
    const componentProps: IHyperTickerComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onConfigure: (): void => { this.context.propertyPane.open(); },
      onItemsChange: this._onItemsChange,
      onWizardApply: this._onWizardApply,
    };
    const element: React.ReactElement<IHyperTickerComponentProps> =
      React.createElement(HyperTicker, componentProps);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "News Ticker";
    }
    if (this.properties.displayMode === undefined) {
      this.properties.displayMode = "scroll";
    }
    if (this.properties.direction === undefined) {
      this.properties.direction = "left";
    }
    if (this.properties.position === undefined) {
      this.properties.position = "inline";
    }
    if (this.properties.speed === undefined) {
      this.properties.speed = 5;
    }
    if (this.properties.pauseOnHover === undefined) {
      this.properties.pauseOnHover = true;
    }
    if (this.properties.scrollDurationMs === undefined) {
      this.properties.scrollDurationMs = 30000;
    }
    if (this.properties.items === undefined) {
      this.properties.items = "[]";
    }
    if (this.properties.listName === undefined) {
      this.properties.listName = "";
    }
    if (this.properties.listFilter === undefined) {
      this.properties.listFilter = "";
    }
    if (this.properties.rssConfigs === undefined) {
      this.properties.rssConfigs = "[]";
    }
    if (this.properties.autoRefreshInterval === undefined) {
      this.properties.autoRefreshInterval = 60;
    }
    if (this.properties.enableItemAudience === undefined) {
      this.properties.enableItemAudience = false;
    }
    if (this.properties.defaultSeverity === undefined) {
      this.properties.defaultSeverity = "normal";
    }
    if (this.properties.criticalOverrideBg === undefined) {
      this.properties.criticalOverrideBg = "#d13438";
    }
    if (this.properties.criticalOverrideText === undefined) {
      this.properties.criticalOverrideText = "#ffffff";
    }
    // V2 property defaults
    if (this.properties.heightPreset === undefined) {
      this.properties.heightPreset = "standard";
    }
    if (this.properties.templateId === undefined) {
      this.properties.templateId = "";
    }
    if (this.properties.enableDismiss === undefined) {
      this.properties.enableDismiss = false;
    }
    if (this.properties.enableAcknowledge === undefined) {
      this.properties.enableAcknowledge = false;
    }
    if (this.properties.enableExpand === undefined) {
      this.properties.enableExpand = false;
    }
    if (this.properties.enableCopy === undefined) {
      this.properties.enableCopy = false;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = true;
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = true;
    }
    // Sync: useSampleData=true activates demo mode
    if (this.properties.useSampleData && !this.properties.enableDemoMode) {
      this.properties.enableDemoMode = true;
    }
    if (this.properties.demoPresetId === undefined) {
      this.properties.demoPresetId = "";
    }
    if (this.properties.enableEmergencyMode === undefined) {
      this.properties.enableEmergencyMode = false;
    }
    if (this.properties.enableAnalytics === undefined) {
      this.properties.enableAnalytics = false;
    }
    if (this.properties.enableGradientFade === undefined) {
      this.properties.enableGradientFade = false;
    }
    if (this.properties.enableCategoryDividers === undefined) {
      this.properties.enableCategoryDividers = false;
    }
    if (this.properties.graphEndpoint === undefined) {
      this.properties.graphEndpoint = "";
    }
    if (this.properties.restApiUrl === undefined) {
      this.properties.restApiUrl = "";
    }
    if (this.properties.restApiHeaders === undefined) {
      this.properties.restApiHeaders = "";
    }
    if (this.properties.backgroundGradient === undefined) {
      this.properties.backgroundGradient = "";
    }
    if (this.properties.showWizardOnInit === undefined) {
      this.properties.showWizardOnInit = true;
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("2.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const items = parseTickerItems(this.properties.items);

    // Template dropdown options
    const templateOptions: Array<{ key: string; text: string }> = [
      { key: "", text: "None" },
    ];
    ALL_TEMPLATE_IDS.forEach(function (id) {
      templateOptions.push({ key: id, text: getTickerTemplateDisplayName(id) });
    });

    return {
      pages: [
        // ── Page 1: Content & Sources ──
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.ContentSourcesGroupName,
              groupFields: [
                createGroupHeaderField("_contentHeader", { icon: "\uD83D\uDCCB", title: "Content", subtitle: "Sources & data", color: "green" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("displayMode", {
                  label: strings.DisplayModeFieldLabel,
                  options: [
                    { key: "scroll", text: strings.DisplayModeScroll },
                    { key: "fade", text: strings.DisplayModeFade },
                    { key: "static", text: strings.DisplayModeStatic },
                    { key: "stacked", text: strings.DisplayModeStacked },
                    { key: "vertical", text: strings.DisplayModeVertical },
                    { key: "typewriter", text: strings.DisplayModeTypewriter },
                    { key: "split", text: strings.DisplayModeSplit },
                    { key: "breaking", text: strings.DisplayModeBreaking },
                  ],
                }),
                PropertyPaneDropdown("templateId", {
                  label: strings.TemplateFieldLabel,
                  options: templateOptions,
                }),
                PropertyPaneTextField("listName", {
                  label: strings.ListNameFieldLabel,
                }),
                PropertyPaneTextField("listFilter", {
                  label: strings.ListFilterFieldLabel,
                }),
                PropertyPaneTextField("rssConfigs", {
                  label: strings.RssConfigsFieldLabel,
                  multiline: true,
                  rows: 3,
                }),
                PropertyPaneTextField("graphEndpoint", {
                  label: strings.GraphEndpointFieldLabel,
                }),
                PropertyPaneTextField("restApiUrl", {
                  label: strings.RestApiUrlFieldLabel,
                }),
                PropertyPaneTextField("restApiHeaders", {
                  label: strings.RestApiHeadersFieldLabel,
                  multiline: true,
                  rows: 2,
                }),
                PropertyPaneLabel("_itemCount", {
                  text: strings.ManualItemCountLabel + ": " + items.length,
                }),
              ],
            },
          ],
        },
        // ── Page 2: Interactions & Features ──
        {
          header: { description: "Configure interactive features and user engagement options." },
          groups: [
            {
              groupName: "Interactions",
              groupFields: [
                createGroupHeaderField("_interactionsHeader", { icon: "\u2699\uFE0F", title: "Interactions", subtitle: "User actions", color: "orange" }),
                PropertyPaneToggle("enableDismiss", {
                  label: strings.EnableDismissFieldLabel,
                }),
                PropertyPaneToggle("enableAcknowledge", {
                  label: strings.EnableAcknowledgeFieldLabel,
                }),
                PropertyPaneToggle("enableExpand", {
                  label: strings.EnableExpandFieldLabel,
                }),
                PropertyPaneToggle("enableCopy", {
                  label: strings.EnableCopyFieldLabel,
                }),
              ],
            },
            {
              groupName: "Features",
              groupFields: [
                createGroupHeaderField("_featuresHeader", { icon: "\u2699\uFE0F", title: "Features", subtitle: "Advanced options", color: "orange" }),
                PropertyPaneToggle("enableEmergencyMode", {
                  label: strings.EnableEmergencyModeFieldLabel,
                }),
                PropertyPaneToggle("enableItemAudience", {
                  label: strings.EnableItemAudienceFieldLabel,
                }),
                PropertyPaneToggle("enableAnalytics", {
                  label: strings.EnableAnalyticsFieldLabel,
                }),
                PropertyPaneToggle("enableDemoMode", {
                  label: strings.EnableDemoModeFieldLabel,
                }),
              ],
            },
          ],
        },
        // ── Page 3: Appearance ──
        {
          header: { description: strings.AppearancePageDescription },
          groups: [
            {
              groupName: strings.AppearanceGroupName,
              groupFields: [
                createGroupHeaderField("_appearanceHeader", { icon: "\uD83C\uDFAF", title: "Appearance", subtitle: "Theme & styling", color: "red" }),
                PropertyPaneDropdown("heightPreset", {
                  label: strings.HeightPresetFieldLabel,
                  options: [
                    { key: "compact", text: strings.HeightPresetCompact },
                    { key: "standard", text: strings.HeightPresetStandard },
                    { key: "large", text: strings.HeightPresetLarge },
                  ],
                }),
                PropertyPaneDropdown("position", {
                  label: strings.PositionFieldLabel,
                  options: [
                    { key: "top", text: "Top of Page" },
                    { key: "bottom", text: "Bottom of Page" },
                    { key: "inline", text: "Inline" },
                  ],
                }),
                PropertyPaneDropdown("direction", {
                  label: strings.DirectionFieldLabel,
                  options: [
                    { key: "left", text: "Left" },
                    { key: "right", text: "Right" },
                  ],
                }),
                PropertyPaneSlider("speed", {
                  label: strings.SpeedFieldLabel,
                  min: 1,
                  max: 10,
                  step: 1,
                }),
                PropertyPaneToggle("pauseOnHover", {
                  label: strings.PauseOnHoverFieldLabel,
                }),
                PropertyPaneToggle("enableGradientFade", {
                  label: strings.EnableGradientFadeFieldLabel,
                }),
                PropertyPaneToggle("enableCategoryDividers", {
                  label: strings.EnableCategoryDividersFieldLabel,
                }),
                PropertyPaneDropdown("defaultSeverity", {
                  label: strings.DefaultSeverityFieldLabel,
                  options: [
                    { key: "normal", text: "Normal" },
                    { key: "warning", text: "Warning" },
                    { key: "critical", text: "Critical" },
                  ],
                }),
                PropertyPaneTextField("backgroundGradient", {
                  label: strings.BackgroundGradientFieldLabel,
                }),
                PropertyPaneTextField("criticalOverrideBg", {
                  label: strings.CriticalOverrideBgFieldLabel,
                }),
                PropertyPaneTextField("criticalOverrideText", {
                  label: strings.CriticalOverrideTextFieldLabel,
                }),
              ],
            },
          ],
        },
        // ── Page 4: Advanced ──
        {
          header: { description: strings.AdvancedPageDescription },
          groups: [
            {
              groupName: strings.AdvancedGroupName,
              groupFields: [
                createGroupHeaderField("_advancedHeader", { icon: "\u2699\uFE0F", title: "Advanced", subtitle: "Refresh & wizard", color: "orange" }),
                PropertyPaneSlider("autoRefreshInterval", {
                  label: strings.AutoRefreshIntervalFieldLabel,
                  min: 0,
                  max: 300,
                  step: 15,
                }),
                PropertyPaneToggle("showWizardOnInit", {
                  label: "Show Wizard on First Load",
                }),
                PropertyPaneButton("_rerunWizard", {
                  text: strings.WizardReRunSetup,
                  buttonType: PropertyPaneButtonType.Normal,
                  onClick: this._handleReRunWizard.bind(this),
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  private _handleReRunWizard(): void {
    this.properties.wizardCompleted = false;
    this.properties.showWizardOnInit = true;
    this.render();
  }
}
