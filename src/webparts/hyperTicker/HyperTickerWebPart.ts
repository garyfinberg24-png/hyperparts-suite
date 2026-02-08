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
} from "@microsoft/sp-property-pane";

import * as strings from "HyperTickerWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperTicker from "./components/HyperTicker";
import type { IHyperTickerComponentProps } from "./components/HyperTicker";
import type { IHyperTickerWebPartProps } from "./models";
import { parseTickerItems } from "./models";

export default class HyperTickerWebPart extends BaseHyperWebPart<IHyperTickerWebPartProps> {

  private _onItemsChange = (itemsJson: string): void => {
    this.properties.items = itemsJson;
    this.render();
  };

  public render(): void {
    const props: IHyperTickerComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onItemsChange: this._onItemsChange,
    };
    const element: React.ReactElement<IHyperTickerComponentProps> =
      React.createElement(HyperTicker, props);
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
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const items = parseTickerItems(this.properties.items);

    return {
      pages: [
        // Page 1: Content Sources
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.ContentSourcesGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("displayMode", {
                  label: strings.DisplayModeFieldLabel,
                  options: [
                    { key: "scroll", text: "Scrolling Marquee" },
                    { key: "fade", text: "Fading Rotation" },
                    { key: "static", text: "Static Rotation" },
                    { key: "stacked", text: "Stacked Cards" },
                  ],
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
                  rows: 4,
                }),
                PropertyPaneLabel("_itemCount", {
                  text: strings.ManualItemCountLabel + ": " + items.length,
                }),
              ],
            },
          ],
        },
        // Page 2: Appearance
        {
          header: { description: strings.AppearancePageDescription },
          groups: [
            {
              groupName: strings.AppearanceGroupName,
              groupFields: [
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
                PropertyPaneDropdown("defaultSeverity", {
                  label: strings.DefaultSeverityFieldLabel,
                  options: [
                    { key: "normal", text: "Normal" },
                    { key: "warning", text: "Warning" },
                    { key: "critical", text: "Critical" },
                  ],
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
        // Page 3: Advanced
        {
          header: { description: strings.AdvancedPageDescription },
          groups: [
            {
              groupName: strings.AdvancedGroupName,
              groupFields: [
                PropertyPaneSlider("autoRefreshInterval", {
                  label: strings.AutoRefreshIntervalFieldLabel,
                  min: 0,
                  max: 300,
                  step: 15,
                }),
                PropertyPaneToggle("enableItemAudience", {
                  label: strings.EnableItemAudienceFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
