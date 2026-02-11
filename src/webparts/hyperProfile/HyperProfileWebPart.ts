import * as React from "react";
import * as ReactDom from "react-dom";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneChoiceGroup,
} from "@microsoft/sp-property-pane";
import * as strings from "HyperProfileWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import type { IHyperProfileWebPartProps } from "./models";
import type { IHyperTemplate } from "./models";
import { TEMPLATES, getTemplateById } from "./constants/templates";
import HyperProfile from "./components/HyperProfile";
import type { IHyperProfileComponentProps } from "./components/HyperProfile";

export default class HyperProfileWebPart extends BaseHyperWebPart<IHyperProfileWebPartProps> {

  /** Callback: wizard completed -- persisted to web part properties */
  private _onWizardComplete = (): void => {
    this.properties.wizardCompleted = true;
    this.render();
  };

  /** Callback: toggle demo mode from component */
  private _onDemoModeChange = (enabled: boolean): void => {
    this.properties.enableDemoMode = enabled;
    this.render();
  };

  public render(): void {
    const props: IHyperProfileComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === 2,
      wizardCompleted: this.properties.wizardCompleted,
      onWizardComplete: this._onWizardComplete,
      onDemoModeChange: this._onDemoModeChange,
    };
    const element = React.createElement(HyperProfile, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Ensure default values
    if (!this.properties.displayMode) {
      this.properties.displayMode = "myProfile";
    }
    if (!this.properties.selectedTemplate) {
      this.properties.selectedTemplate = "standard";
    }
    if (!this.properties.visibleFields) {
      this.properties.visibleFields = [
        "displayName", "jobTitle", "department", "mail",
        "mobilePhone", "businessPhones", "officeLocation", "city",
      ];
    }
    if (!this.properties.enabledActions) {
      this.properties.enabledActions = ["email", "teams_chat", "teams_call", "schedule"];
    }
    if (this.properties.showQuickActions === undefined) {
      this.properties.showQuickActions = true;
    }
    if (this.properties.showPresence === undefined) {
      this.properties.showPresence = true;
    }
    if (!this.properties.presenceRefreshInterval) {
      this.properties.presenceRefreshInterval = 30;
    }
    if (!this.properties.cardStyle) {
      this.properties.cardStyle = "standard";
    }
    if (!this.properties.photoSize) {
      this.properties.photoSize = "medium";
    }
    if (!this.properties.backgroundColor) {
      this.properties.backgroundColor = "#FFFFFF";
    }
    if (this.properties.borderRadius === undefined) {
      this.properties.borderRadius = 8;
    }
    if (!this.properties.shadow) {
      this.properties.shadow = "medium";
    }
    if (!this.properties.width) {
      this.properties.width = "auto";
    }
    if (!this.properties.height) {
      this.properties.height = "auto";
    }

    // V2 defaults
    if (this.properties.showSkills === undefined) {
      this.properties.showSkills = true;
    }
    if (this.properties.showBadges === undefined) {
      this.properties.showBadges = true;
    }
    if (this.properties.showHobbies === undefined) {
      this.properties.showHobbies = false;
    }
    if (this.properties.showSlogan === undefined) {
      this.properties.showSlogan = false;
    }
    if (this.properties.showWebsites === undefined) {
      this.properties.showWebsites = false;
    }
    if (this.properties.showInterests === undefined) {
      this.properties.showInterests = false;
    }
    if (this.properties.showFunFacts === undefined) {
      this.properties.showFunFacts = false;
    }
    if (this.properties.showEducation === undefined) {
      this.properties.showEducation = false;
    }
    if (this.properties.showOrgChart === undefined) {
      this.properties.showOrgChart = false;
    }
    if (this.properties.showManager === undefined) {
      this.properties.showManager = true;
    }
    if (this.properties.showDirectReports === undefined) {
      this.properties.showDirectReports = false;
    }
    if (this.properties.showCalendar === undefined) {
      this.properties.showCalendar = false;
    }
    if (!this.properties.photoShape) {
      this.properties.photoShape = "circle";
    }
    if (!this.properties.accentColor) {
      this.properties.accentColor = "#0078d4";
    }
    if (!this.properties.headerStyle) {
      this.properties.headerStyle = "gradient";
    }
    if (!this.properties.animation) {
      this.properties.animation = "none";
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
    }
    if (this.properties.showWizardOnInit === undefined) {
      this.properties.showWizardOnInit = true;
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.enableAnalytics === undefined) {
      this.properties.enableAnalytics = false;
    }
    if (!this.properties.skillDisplayStyle) {
      this.properties.skillDisplayStyle = "tags";
    }
    if (this.properties.showEndorsements === undefined) {
      this.properties.showEndorsements = true;
    }
    if (this.properties.showBadgeDescriptions === undefined) {
      this.properties.showBadgeDescriptions = true;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneChoiceGroup("displayMode", {
                  label: strings.DisplayModeFieldLabel,
                  options: [
                    { key: "myProfile", text: "My Profile" },
                    { key: "directory", text: "Directory Mode" },
                  ],
                }),
                PropertyPaneDropdown("selectedTemplate", {
                  label: strings.TemplateFieldLabel,
                  options: TEMPLATES.map(function (t) {
                    return { key: t.id, text: t.name };
                  }),
                  selectedKey: this.properties.selectedTemplate || "standard",
                }),
              ],
            },
            {
              groupName: strings.QuickActionsGroupName,
              groupFields: [
                PropertyPaneToggle("showQuickActions", {
                  label: strings.ShowQuickActionsFieldLabel,
                  checked: this.properties.showQuickActions !== false,
                }),
                PropertyPaneDropdown("actionsLayout", {
                  label: "Actions Layout",
                  options: [
                    { key: "horizontal", text: "Horizontal" },
                    { key: "vertical", text: "Vertical" },
                    { key: "dropdown", text: "Dropdown" },
                  ],
                  selectedKey: this.properties.actionsLayout || "horizontal",
                }),
                PropertyPaneDropdown("buttonSize", {
                  label: "Button Size",
                  options: [
                    { key: "small", text: "Small" },
                    { key: "medium", text: "Medium" },
                    { key: "large", text: "Large" },
                  ],
                  selectedKey: this.properties.buttonSize || "medium",
                }),
                PropertyPaneToggle("showActionLabels", {
                  label: "Show Button Labels",
                  checked: this.properties.showActionLabels !== false,
                }),
              ],
            },
            {
              groupName: strings.PresenceGroupName,
              groupFields: [
                PropertyPaneToggle("showPresence", {
                  label: strings.ShowPresenceFieldLabel,
                  checked: this.properties.showPresence !== false,
                }),
                PropertyPaneToggle("showStatusMessage", {
                  label: "Show Status Message",
                  checked: this.properties.showStatusMessage !== false,
                }),
                PropertyPaneDropdown("presenceRefreshInterval", {
                  label: "Refresh Interval",
                  options: [
                    { key: 15, text: "15 seconds" },
                    { key: 30, text: "30 seconds" },
                    { key: 60, text: "60 seconds" },
                  ],
                  selectedKey: this.properties.presenceRefreshInterval || 30,
                }),
                PropertyPaneDropdown("presencePosition", {
                  label: "Presence Position",
                  options: [
                    { key: "onPhoto", text: "On Photo" },
                    { key: "nextToName", text: "Next to Name" },
                    { key: "separate", text: "Separate" },
                  ],
                  selectedKey: this.properties.presencePosition || "onPhoto",
                }),
              ],
            },
            {
              groupName: strings.ProfileCompletenessGroupName,
              groupFields: [
                PropertyPaneToggle("showCompletenessScore", {
                  label: strings.ShowCompletenessScoreFieldLabel,
                  checked: this.properties.showCompletenessScore !== false,
                }),
                PropertyPaneDropdown("scoreStyle", {
                  label: "Score Display Style",
                  options: [
                    { key: "percentage", text: "Percentage" },
                    { key: "progressBar", text: "Progress Bar" },
                    { key: "circular", text: "Circular" },
                    { key: "stars", text: "Stars" },
                  ],
                  selectedKey: this.properties.scoreStyle || "progressBar",
                }),
                PropertyPaneDropdown("scorePosition", {
                  label: "Score Position",
                  options: [
                    { key: "top", text: "Top" },
                    { key: "bottom", text: "Bottom" },
                  ],
                  selectedKey: this.properties.scorePosition || "bottom",
                }),
              ],
            },
          ],
        },
        {
          header: { description: "Layout & Appearance" },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneDropdown("cardStyle", {
                  label: "Card Style",
                  options: [
                    { key: "compact", text: "Compact" },
                    { key: "standard", text: "Standard" },
                    { key: "expanded", text: "Expanded" },
                  ],
                  selectedKey: this.properties.cardStyle || "standard",
                }),
                PropertyPaneDropdown("photoSize", {
                  label: "Photo Size",
                  options: [
                    { key: "small", text: "Small" },
                    { key: "medium", text: "Medium" },
                    { key: "large", text: "Large" },
                  ],
                  selectedKey: this.properties.photoSize || "medium",
                }),
                PropertyPaneSlider("borderRadius", {
                  label: "Border Radius (px)",
                  min: 0,
                  max: 20,
                  value: this.properties.borderRadius || 8,
                  showValue: true,
                }),
                PropertyPaneDropdown("shadow", {
                  label: "Shadow",
                  options: [
                    { key: "none", text: "None" },
                    { key: "light", text: "Light" },
                    { key: "medium", text: "Medium" },
                    { key: "strong", text: "Strong" },
                  ],
                  selectedKey: this.properties.shadow || "medium",
                }),
              ],
            },
            {
              groupName: strings.BackgroundGroupName,
              groupFields: [
                PropertyPaneTextField("backgroundColor", {
                  label: "Background Color",
                  value: this.properties.backgroundColor || "#FFFFFF",
                }),
                PropertyPaneToggle("useThemeColors", {
                  label: "Use Theme Colors",
                  checked: this.properties.useThemeColors || false,
                }),
              ],
            },
            {
              groupName: strings.OverlayGroupName,
              groupFields: [
                PropertyPaneToggle("enableOverlay", {
                  label: "Enable Overlay",
                  checked: this.properties.enableOverlay || false,
                }),
                PropertyPaneTextField("overlayText", {
                  label: "Overlay Text",
                  value: this.properties.overlayText || "",
                  multiline: true,
                  rows: 3,
                }),
                PropertyPaneTextField("overlayColor", {
                  label: "Overlay Color",
                  value: this.properties.overlayColor || "#0078D4",
                }),
                PropertyPaneSlider("overlayTransparency", {
                  label: "Overlay Transparency (%)",
                  min: 0,
                  max: 100,
                  value: this.properties.overlayTransparency || 50,
                  showValue: true,
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
    // Apply template configuration when template is changed
    if (propertyPath === "selectedTemplate") {
      const template: IHyperTemplate | undefined = getTemplateById(newValue as string);
      if (template && template.configuration) {
        const configKeys = Object.keys(template.configuration);
        const props = this.properties as unknown as Record<string, unknown>;
        const config = template.configuration as unknown as Record<string, unknown>;
        configKeys.forEach(function (key) {
          props[key] = config[key];
        });
      }
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }
}
