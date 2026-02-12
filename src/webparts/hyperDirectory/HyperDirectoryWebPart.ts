import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperDirectoryWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import { createGroupHeaderField, createQuickActionsGroup } from "../../common/propertyPane";
import HyperDirectory from "./components/HyperDirectory";
import type { IHyperDirectoryComponentProps } from "./components/HyperDirectory";
import type { IHyperDirectoryWebPartProps } from "./models";

export default class HyperDirectoryWebPart extends BaseHyperWebPart<IHyperDirectoryWebPartProps> {

  private _onWizardApply = (result: Partial<IHyperDirectoryWebPartProps>): void => {
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
    const props: IHyperDirectoryComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onWizardApply: this._onWizardApply,
      onConfigure: (): void => { this.context.propertyPane.open(); },
    };
    const element: React.ReactElement<IHyperDirectoryComponentProps> =
      React.createElement(HyperDirectory, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Set defaults for all properties
    if (this.properties.title === undefined) {
      this.properties.title = "Employee Directory";
    }
    if (this.properties.layoutMode === undefined) {
      this.properties.layoutMode = "grid";
    }
    if (this.properties.cardStyle === undefined) {
      this.properties.cardStyle = "standard";
    }
    if (this.properties.gridColumns === undefined) {
      this.properties.gridColumns = 3;
    }
    if (this.properties.masonryColumns === undefined) {
      this.properties.masonryColumns = 3;
    }
    if (this.properties.sortField === undefined) {
      this.properties.sortField = "displayName";
    }
    if (this.properties.sortDirection === undefined) {
      this.properties.sortDirection = "asc";
    }
    if (this.properties.rollerDexSpeed === undefined) {
      this.properties.rollerDexSpeed = 5;
    }
    if (this.properties.rollerDexVisibleCards === undefined) {
      this.properties.rollerDexVisibleCards = 5;
    }
    if (this.properties.showSearch === undefined) {
      this.properties.showSearch = true;
    }
    if (this.properties.showAlphaIndex === undefined) {
      this.properties.showAlphaIndex = true;
    }
    if (this.properties.showFilters === undefined) {
      this.properties.showFilters = true;
    }
    if (this.properties.showPresence === undefined) {
      this.properties.showPresence = true;
    }
    if (this.properties.presenceRefreshInterval === undefined) {
      this.properties.presenceRefreshInterval = 30;
    }
    if (this.properties.showProfileCard === undefined) {
      this.properties.showProfileCard = true;
    }
    if (this.properties.showQuickActions === undefined) {
      this.properties.showQuickActions = true;
    }
    if (this.properties.enabledActions === undefined) {
      this.properties.enabledActions = JSON.stringify(["email", "teamsChat", "teamsCall", "schedule"]);
    }
    if (this.properties.enableVCardExport === undefined) {
      this.properties.enableVCardExport = true;
    }
    if (this.properties.userFilter === undefined) {
      this.properties.userFilter = "";
    }
    if (this.properties.visibleFields === undefined) {
      this.properties.visibleFields = JSON.stringify([
        "displayName", "jobTitle", "department", "officeLocation", "mail", "mobilePhone",
      ]);
    }
    if (this.properties.customFieldMappings === undefined) {
      this.properties.customFieldMappings = "{}";
    }
    if (this.properties.pageSize === undefined) {
      this.properties.pageSize = 20;
    }
    if (this.properties.paginationMode === undefined) {
      this.properties.paginationMode = "paged";
    }
    if (this.properties.showPhotoPlaceholder === undefined) {
      this.properties.showPhotoPlaceholder = true;
    }
    if (this.properties.photoSize === undefined) {
      this.properties.photoSize = "medium";
    }
    if (this.properties.cacheEnabled === undefined) {
      this.properties.cacheEnabled = true;
    }
    if (this.properties.cacheDuration === undefined) {
      this.properties.cacheDuration = 10;
    }
    // New property defaults
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.enableExport === undefined) {
      this.properties.enableExport = false;
    }
    if (this.properties.showCompletenessScore === undefined) {
      this.properties.showCompletenessScore = false;
    }
    if (this.properties.showPronouns === undefined) {
      this.properties.showPronouns = false;
    }
    if (this.properties.showSmartOoo === undefined) {
      this.properties.showSmartOoo = false;
    }
    if (this.properties.showQrCode === undefined) {
      this.properties.showQrCode = false;
    }
    if (this.properties.enableSkillsSearch === undefined) {
      this.properties.enableSkillsSearch = false;
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = true;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
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
        // ── Page 1: Layout & Display ──
        {
          header: { description: strings.LayoutPageDescription },
          groups: [
            createQuickActionsGroup({
              onReopenWizard: this._handleReopenWizard.bind(this),
              onEditInEditor: this._handleEditInEditor.bind(this),
              onToggleDemoMode: this._handleToggleDemoMode.bind(this),
            }),
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                createGroupHeaderField("_layoutHeader", { icon: "\uD83C\uDFA8", title: "Layout", subtitle: "Display mode & grid", color: "blue" }),
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("layoutMode", {
                  label: strings.LayoutModeFieldLabel,
                  options: [
                    { key: "grid", text: "Grid" },
                    { key: "list", text: "List" },
                    { key: "compact", text: "Compact" },
                    { key: "card", text: "Card" },
                    { key: "masonry", text: "Masonry" },
                    { key: "rollerDex", text: "RollerDex (3D)" },
                    { key: "orgChart", text: "Org Chart" },
                  ],
                }),
                PropertyPaneDropdown("cardStyle", {
                  label: strings.CardStyleFieldLabel,
                  options: [
                    { key: "standard", text: "Standard" },
                    { key: "compact", text: "Compact" },
                    { key: "detailed", text: "Detailed" },
                    { key: "corporate", text: "Corporate" },
                    { key: "modern", text: "Modern" },
                    { key: "minimal", text: "Minimal" },
                    { key: "executive", text: "Executive" },
                    { key: "glassmorphic", text: "Glassmorphic" },
                    { key: "neon", text: "Neon" },
                    { key: "gradient", text: "Gradient" },
                    { key: "elevated", text: "Elevated" },
                    { key: "outlined", text: "Outlined" },
                  ],
                }),
                PropertyPaneSlider("gridColumns", {
                  label: strings.GridColumnsFieldLabel,
                  min: 1,
                  max: 6,
                  step: 1,
                  disabled: this.properties.layoutMode !== "grid",
                }),
                PropertyPaneSlider("masonryColumns", {
                  label: strings.MasonryColumnsFieldLabel,
                  min: 2,
                  max: 5,
                  step: 1,
                  disabled: this.properties.layoutMode !== "masonry",
                }),
                PropertyPaneDropdown("sortField", {
                  label: strings.SortFieldLabel,
                  options: [
                    { key: "displayName", text: "Display Name" },
                    { key: "surname", text: "Last Name" },
                    { key: "department", text: "Department" },
                    { key: "jobTitle", text: "Job Title" },
                    { key: "officeLocation", text: "Office Location" },
                  ],
                }),
                PropertyPaneDropdown("sortDirection", {
                  label: strings.SortDirectionFieldLabel,
                  options: [
                    { key: "asc", text: "Ascending (A-Z)" },
                    { key: "desc", text: "Descending (Z-A)" },
                  ],
                }),
              ],
            },
            {
              groupName: strings.RollerDexGroupName,
              groupFields: [
                createGroupHeaderField("_rollerDexHeader", { icon: "\uD83C\uDFA8", title: "RollerDex", subtitle: "3D card options", color: "blue" }),
                PropertyPaneSlider("rollerDexSpeed", {
                  label: strings.RollerDexSpeedFieldLabel,
                  min: 1,
                  max: 15,
                  step: 1,
                  disabled: this.properties.layoutMode !== "rollerDex",
                }),
                PropertyPaneSlider("rollerDexVisibleCards", {
                  label: strings.RollerDexVisibleCardsFieldLabel,
                  min: 3,
                  max: 9,
                  step: 2,
                  disabled: this.properties.layoutMode !== "rollerDex",
                }),
              ],
            },
          ],
        },
        // ── Page 2: Features ──
        {
          header: { description: strings.FeaturesPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                createGroupHeaderField("_featuresHeader", { icon: "\u2699\uFE0F", title: "Features", subtitle: "Search & presence", color: "orange" }),
                PropertyPaneToggle("showSearch", {
                  label: strings.ShowSearchFieldLabel,
                }),
                PropertyPaneToggle("showAlphaIndex", {
                  label: strings.ShowAlphaIndexFieldLabel,
                }),
                PropertyPaneToggle("showFilters", {
                  label: strings.ShowFiltersFieldLabel,
                }),
                PropertyPaneToggle("showPresence", {
                  label: strings.ShowPresenceFieldLabel,
                }),
                PropertyPaneSlider("presenceRefreshInterval", {
                  label: strings.PresenceRefreshFieldLabel,
                  min: 10,
                  max: 120,
                  step: 5,
                  disabled: !this.properties.showPresence,
                }),
                PropertyPaneToggle("showProfileCard", {
                  label: strings.ShowProfileCardFieldLabel,
                }),
              ],
            },
            {
              groupName: strings.ActionsGroupName,
              groupFields: [
                createGroupHeaderField("_actionsHeader", { icon: "\u2699\uFE0F", title: "Actions", subtitle: "Quick actions & vCard", color: "orange" }),
                PropertyPaneToggle("showQuickActions", {
                  label: strings.ShowQuickActionsFieldLabel,
                }),
                PropertyPaneTextField("enabledActions", {
                  label: strings.EnabledActionsFieldLabel,
                  disabled: !this.properties.showQuickActions,
                }),
                PropertyPaneToggle("enableVCardExport", {
                  label: strings.EnableVCardFieldLabel,
                }),
              ],
            },
            {
              groupName: strings.HyperFeaturesGroupName,
              groupFields: [
                createGroupHeaderField("_hyperFeaturesHeader", { icon: "\u2699\uFE0F", title: "Hyper Features", subtitle: "Enhanced capabilities", color: "orange" }),
                PropertyPaneToggle("enableExport", {
                  label: strings.EnableExportFieldLabel,
                }),
                PropertyPaneToggle("enableSkillsSearch", {
                  label: strings.EnableSkillsSearchFieldLabel,
                }),
                PropertyPaneToggle("showCompletenessScore", {
                  label: strings.ShowCompletenessScoreFieldLabel,
                }),
                PropertyPaneToggle("showPronouns", {
                  label: strings.ShowPronounsFieldLabel,
                }),
                PropertyPaneToggle("showSmartOoo", {
                  label: strings.ShowSmartOooFieldLabel,
                }),
                PropertyPaneToggle("showQrCode", {
                  label: strings.ShowQrCodeFieldLabel,
                }),
              ],
            },
          ],
        },
        // ── Page 3: Data & Advanced ──
        {
          header: { description: strings.DataPageDescription },
          groups: [
            {
              groupName: strings.DataGroupName,
              groupFields: [
                createGroupHeaderField("_dataHeader", { icon: "\uD83D\uDCCB", title: "Data Source", subtitle: "Users & pagination", color: "green" }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataFieldLabel,
                }),
                PropertyPaneTextField("userFilter", {
                  label: strings.UserFilterFieldLabel,
                  description: strings.UserFilterDescription,
                  multiline: true,
                  rows: 2,
                }),
                PropertyPaneSlider("pageSize", {
                  label: strings.PageSizeFieldLabel,
                  min: 10,
                  max: 100,
                  step: 5,
                }),
                PropertyPaneDropdown("paginationMode", {
                  label: strings.PaginationModeFieldLabel,
                  options: [
                    { key: "paged", text: "Paginated" },
                    { key: "infinite", text: "Infinite Scroll" },
                  ],
                }),
              ],
            },
            {
              groupName: strings.FieldsGroupName,
              groupFields: [
                createGroupHeaderField("_fieldsHeader", { icon: "\uD83D\uDCCB", title: "Fields", subtitle: "Visible & custom", color: "green" }),
                PropertyPaneTextField("visibleFields", {
                  label: strings.VisibleFieldsFieldLabel,
                  description: strings.VisibleFieldsDescription,
                  multiline: true,
                  rows: 3,
                }),
                PropertyPaneTextField("customFieldMappings", {
                  label: strings.CustomFieldMappingsFieldLabel,
                  description: strings.CustomFieldMappingsDescription,
                  multiline: true,
                  rows: 3,
                }),
              ],
            },
            {
              groupName: strings.PhotoGroupName,
              groupFields: [
                createGroupHeaderField("_photoHeader", { icon: "\uD83C\uDFA8", title: "Photos", subtitle: "Size & placeholders", color: "blue" }),
                PropertyPaneToggle("showPhotoPlaceholder", {
                  label: strings.ShowPhotoPlaceholderFieldLabel,
                }),
                PropertyPaneDropdown("photoSize", {
                  label: strings.PhotoSizeFieldLabel,
                  options: [
                    { key: "small", text: "Small (48x48)" },
                    { key: "medium", text: "Medium (120x120)" },
                    { key: "large", text: "Large (240x240)" },
                  ],
                }),
              ],
            },
            {
              groupName: strings.PerformanceGroupName,
              groupFields: [
                createGroupHeaderField("_performanceHeader", { icon: "\u26A1", title: "Performance", subtitle: "Cache settings", color: "orange" }),
                PropertyPaneToggle("cacheEnabled", {
                  label: strings.CacheEnabledFieldLabel,
                }),
                PropertyPaneSlider("cacheDuration", {
                  label: strings.CacheDurationFieldLabel,
                  min: 1,
                  max: 60,
                  step: 1,
                  disabled: !this.properties.cacheEnabled,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
