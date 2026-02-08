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

import * as strings from "HyperLertWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperLert from "./components/HyperLert";
import type { IHyperLertComponentProps } from "./components/HyperLert";
import type { IHyperLertWebPartProps } from "./models";
import { parseRules } from "./models";

export default class HyperLertWebPart extends BaseHyperWebPart<IHyperLertWebPartProps> {

  private _onRulesChange = (rulesJson: string): void => {
    this.properties.rules = rulesJson;
    this.render();
  };

  public render(): void {
    const props: IHyperLertComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onRulesChange: this._onRulesChange,
    };
    const element: React.ReactElement<IHyperLertComponentProps> =
      React.createElement(HyperLert, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "Alert Dashboard";
    }
    if (this.properties.rules === undefined) {
      this.properties.rules = "";
    }
    if (this.properties.historyListName === undefined) {
      this.properties.historyListName = "HyperLertHistory";
    }
    if (this.properties.enableEmail === undefined) {
      this.properties.enableEmail = true;
    }
    if (this.properties.enableTeams === undefined) {
      this.properties.enableTeams = false;
    }
    if (this.properties.enableBanner === undefined) {
      this.properties.enableBanner = true;
    }
    if (this.properties.defaultSeverity === undefined) {
      this.properties.defaultSeverity = "warning";
    }
    if (this.properties.maxBanners === undefined) {
      this.properties.maxBanners = 5;
    }
    if (this.properties.globalCooldownMinutes === undefined) {
      this.properties.globalCooldownMinutes = 5;
    }
    if (this.properties.refreshInterval === undefined) {
      this.properties.refreshInterval = 60;
    }
    if (this.properties.emailFromName === undefined) {
      this.properties.emailFromName = "HyperLert";
    }
    if (this.properties.defaultEmailTemplate === undefined) {
      this.properties.defaultEmailTemplate = "";
    }
    if (this.properties.maxHistoryItems === undefined) {
      this.properties.maxHistoryItems = 100;
    }
    if (this.properties.autoCreateList === undefined) {
      this.properties.autoCreateList = true;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const rules = parseRules(this.properties.rules);

    return {
      pages: [
        // Page 1: Rules Overview
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.RulesGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneSlider("refreshInterval", {
                  label: strings.RefreshIntervalFieldLabel,
                  min: 15,
                  max: 300,
                  step: 15,
                }),
                PropertyPaneLabel("_ruleCount", {
                  text: strings.RuleCountLabel + ": " + rules.length,
                }),
              ],
            },
          ],
        },
        // Page 2: Notification Defaults
        {
          header: { description: strings.NotificationPageDescription },
          groups: [
            {
              groupName: strings.NotificationGroupName,
              groupFields: [
                PropertyPaneToggle("enableEmail", {
                  label: strings.EnableEmailLabel,
                }),
                PropertyPaneToggle("enableTeams", {
                  label: strings.EnableTeamsLabel,
                }),
                PropertyPaneToggle("enableBanner", {
                  label: strings.EnableBannerLabel,
                }),
                PropertyPaneTextField("emailFromName", {
                  label: strings.EmailFromNameLabel,
                }),
                PropertyPaneTextField("defaultEmailTemplate", {
                  label: strings.DefaultEmailTemplateLabel,
                  multiline: true,
                  rows: 6,
                }),
                PropertyPaneSlider("maxBanners", {
                  label: strings.MaxBannersLabel,
                  min: 1,
                  max: 10,
                  step: 1,
                }),
                PropertyPaneDropdown("defaultSeverity", {
                  label: strings.DefaultSeverityLabel,
                  options: [
                    { key: "info", text: "Info" },
                    { key: "warning", text: "Warning" },
                    { key: "critical", text: "Critical" },
                    { key: "success", text: "Success" },
                  ],
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
                PropertyPaneTextField("historyListName", {
                  label: strings.HistoryListNameLabel,
                }),
                PropertyPaneSlider("maxHistoryItems", {
                  label: strings.MaxHistoryItemsLabel,
                  min: 50,
                  max: 500,
                  step: 50,
                }),
                PropertyPaneSlider("globalCooldownMinutes", {
                  label: strings.GlobalCooldownLabel,
                  min: 0,
                  max: 60,
                  step: 5,
                }),
                PropertyPaneToggle("autoCreateList", {
                  label: strings.AutoCreateListLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
