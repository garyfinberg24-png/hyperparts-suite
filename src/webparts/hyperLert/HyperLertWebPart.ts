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
import { createGroupHeaderField, createQuickActionsGroup } from "../../common/propertyPane";
import HyperLert from "./components/HyperLert";
import type { IHyperLertComponentProps } from "./components/HyperLert";
import type { IHyperLertWebPartProps } from "./models";
import { parseRules } from "./models";

export default class HyperLertWebPart extends BaseHyperWebPart<IHyperLertWebPartProps> {

  private _onRulesChange = (rulesJson: string): void => {
    this.properties.rules = rulesJson;
    this.render();
  };

  private _onWizardComplete = (result?: Partial<IHyperLertWebPartProps>): void => {
    this.properties.wizardCompleted = true;
    if (result) {
      Object.keys(result).forEach((key: string): void => {
        (this.properties as unknown as Record<string, unknown>)[key] = (result as unknown as Record<string, unknown>)[key];
      });
    }
    this.render();
  };

  public render(): void {
    var props: IHyperLertComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onConfigure: (): void => { this.context.propertyPane.open(); },
      onRulesChange: this._onRulesChange,
      onWizardComplete: this._onWizardComplete,
    };
    var element: React.ReactElement<IHyperLertComponentProps> =
      React.createElement(HyperLert, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // V1 defaults
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

    // V2 defaults
    if (this.properties.layout === undefined) {
      this.properties.layout = "commandCenter";
    }
    if (this.properties.templateId === undefined) {
      this.properties.templateId = "it-operations";
    }
    if (this.properties.enableToast === undefined) {
      this.properties.enableToast = true;
    }
    if (this.properties.toastPosition === undefined) {
      this.properties.toastPosition = "topRight";
    }
    if (this.properties.maxToasts === undefined) {
      this.properties.maxToasts = 4;
    }
    if (this.properties.enableNotificationCenter === undefined) {
      this.properties.enableNotificationCenter = true;
    }
    if (this.properties.enableEscalation === undefined) {
      this.properties.enableEscalation = false;
    }
    if (this.properties.escalationPolicy === undefined) {
      this.properties.escalationPolicy = "";
    }
    if (this.properties.enableKpiDashboard === undefined) {
      this.properties.enableKpiDashboard = true;
    }
    if (this.properties.alertGroupMode === undefined) {
      this.properties.alertGroupMode = "severity";
    }
    if (this.properties.enableDeduplication === undefined) {
      this.properties.enableDeduplication = true;
    }
    if (this.properties.deduplicationWindowMinutes === undefined) {
      this.properties.deduplicationWindowMinutes = 5;
    }
    if (this.properties.quietHoursMode === undefined) {
      this.properties.quietHoursMode = "off";
    }
    if (this.properties.quietHoursStart === undefined) {
      this.properties.quietHoursStart = "22:00";
    }
    if (this.properties.quietHoursEnd === undefined) {
      this.properties.quietHoursEnd = "07:00";
    }
    if (this.properties.digestFrequency === undefined) {
      this.properties.digestFrequency = "realtime";
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = false;
    }

    // Wizard defaults
    if (this.properties.showWizardOnInit === undefined) {
      this.properties.showWizardOnInit = true;
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("2.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    var rules = parseRules(this.properties.rules);

    return {
      pages: [
        // Page 1: Dashboard & Layout
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            createQuickActionsGroup({
              onReopenWizard: this._handleReopenWizard.bind(this),
              onEditInEditor: this._handleEditInEditor.bind(this),
              onToggleDemoMode: this._handleToggleDemoMode.bind(this),
            }),
            {
              groupName: strings.RulesGroupName,
              groupFields: [
                createGroupHeaderField("_configHeader", { icon: "\uD83C\uDFA8", title: "Configuration", subtitle: "Dashboard & layout", color: "blue" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("layout", {
                  label: strings.V2LayoutLabel,
                  options: [
                    { key: "commandCenter", text: "Command Center" },
                    { key: "inbox", text: "Inbox" },
                    { key: "cardGrid", text: "Card Grid" },
                    { key: "table", text: "Table" },
                    { key: "timeline", text: "Timeline" },
                    { key: "kanban", text: "Kanban Board" },
                    { key: "compact", text: "Compact List" },
                    { key: "split", text: "Split View" },
                  ],
                }),
                PropertyPaneDropdown("alertGroupMode", {
                  label: strings.V2GroupModeLabel,
                  options: [
                    { key: "none", text: "No Grouping" },
                    { key: "severity", text: "By Severity" },
                    { key: "source", text: "By Source" },
                    { key: "rule", text: "By Rule" },
                    { key: "category", text: "By Category" },
                  ],
                }),
                PropertyPaneSlider("refreshInterval", {
                  label: strings.RefreshIntervalFieldLabel,
                  min: 15,
                  max: 300,
                  step: 15,
                }),
                PropertyPaneToggle("enableKpiDashboard", {
                  label: strings.V2EnableKpiLabel,
                }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.V2UseSampleDataLabel,
                }),
                PropertyPaneLabel("_ruleCount", {
                  text: strings.RuleCountLabel + ": " + rules.length,
                }),
              ],
            },
          ],
        },
        // Page 2: Notifications
        {
          header: { description: strings.NotificationPageDescription },
          groups: [
            {
              groupName: strings.NotificationGroupName,
              groupFields: [
                createGroupHeaderField("_notifHeader", { icon: "\uD83D\uDD14", title: "Notifications", subtitle: "Channels & delivery", color: "orange" }),
                PropertyPaneToggle("enableToast", {
                  label: strings.V2EnableToastLabel,
                }),
                PropertyPaneDropdown("toastPosition", {
                  label: strings.V2ToastPositionLabel,
                  options: [
                    { key: "topRight", text: "Top Right" },
                    { key: "topLeft", text: "Top Left" },
                    { key: "bottomRight", text: "Bottom Right" },
                    { key: "bottomLeft", text: "Bottom Left" },
                  ],
                }),
                PropertyPaneSlider("maxToasts", {
                  label: strings.V2MaxToastsLabel,
                  min: 1,
                  max: 8,
                  step: 1,
                }),
                PropertyPaneToggle("enableEmail", {
                  label: strings.EnableEmailLabel,
                }),
                PropertyPaneToggle("enableTeams", {
                  label: strings.EnableTeamsLabel,
                }),
                PropertyPaneToggle("enableBanner", {
                  label: strings.EnableBannerLabel,
                }),
                PropertyPaneToggle("enableNotificationCenter", {
                  label: strings.V2EnableNotifCenterLabel,
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
                createGroupHeaderField("_advancedHeader", { icon: "\u2699\uFE0F", title: "Advanced", subtitle: "Escalation & history", color: "orange" }),
                PropertyPaneToggle("enableEscalation", {
                  label: strings.V2EnableEscalationLabel,
                }),
                PropertyPaneToggle("enableDeduplication", {
                  label: strings.V2EnableDedupLabel,
                }),
                PropertyPaneSlider("deduplicationWindowMinutes", {
                  label: strings.V2DedupWindowLabel,
                  min: 1,
                  max: 60,
                  step: 1,
                }),
                PropertyPaneDropdown("quietHoursMode", {
                  label: strings.V2QuietHoursLabel,
                  options: [
                    { key: "off", text: "Off" },
                    { key: "scheduled", text: "Scheduled" },
                    { key: "dnd", text: "Do Not Disturb" },
                  ],
                }),
                PropertyPaneTextField("quietHoursStart", {
                  label: strings.V2QuietStartLabel,
                }),
                PropertyPaneTextField("quietHoursEnd", {
                  label: strings.V2QuietEndLabel,
                }),
                PropertyPaneDropdown("digestFrequency", {
                  label: strings.V2DigestLabel,
                  options: [
                    { key: "realtime", text: "Real-time" },
                    { key: "hourly", text: "Hourly" },
                    { key: "daily", text: "Daily" },
                    { key: "weekly", text: "Weekly" },
                  ],
                }),
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
                PropertyPaneToggle("showWizardOnInit", {
                  label: strings.ShowWizardOnInitLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
