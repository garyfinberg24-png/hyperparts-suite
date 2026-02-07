import * as React from "react";
import * as ReactDom from "react-dom";
import type { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import {
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperSpotlightWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import type { IHyperSpotlightWebPartProps } from "./models";
import {
  SelectionMode,
  LayoutMode,
  CardStyle,
  SortOrder,
  AnimationEntrance,
  MessagePosition,
  ImageQuality,
  SpotlightCategory,
  DateRange,
  SELECTION_MODE_OPTIONS,
  CATEGORY_OPTIONS,
  DATE_RANGE_OPTIONS,
  LAYOUT_MODE_OPTIONS,
  CARD_STYLE_OPTIONS,
  SORT_ORDER_OPTIONS,
  ANIMATION_OPTIONS,
  MESSAGE_POSITION_OPTIONS,
  IMAGE_QUALITY_OPTIONS,
} from "./models";
import HyperSpotlight from "./components/HyperSpotlight";
import type { IHyperSpotlightComponentProps } from "./components/HyperSpotlight";

export default class HyperSpotlightWebPart extends BaseHyperWebPart<IHyperSpotlightWebPartProps> {

  protected async onInit(): Promise<void> {
    await super.onInit();

    // Set defaults for any properties not yet initialised
    const p = this.properties;
    if (p.selectionMode === undefined) p.selectionMode = SelectionMode.Automatic;
    if (p.category === undefined) p.category = SpotlightCategory.Birthday;
    if (p.dateRange === undefined) p.dateRange = DateRange.ThisMonth;
    if (p.manualEmployeeIds === undefined) p.manualEmployeeIds = [];
    if (p.manualEmployeeCategories === undefined) p.manualEmployeeCategories = "{}";
    if (p.maxEmployees === undefined) p.maxEmployees = 10;
    if (p.sortOrder === undefined) p.sortOrder = SortOrder.NameAsc;
    if (p.autoRefreshEnabled === undefined) p.autoRefreshEnabled = false;
    if (p.autoRefreshInterval === undefined) p.autoRefreshInterval = 1440;
    if (p.departmentFilter === undefined) p.departmentFilter = "[]";
    if (p.locationFilter === undefined) p.locationFilter = "[]";
    if (p.selectedAttributes === undefined) {
      p.selectedAttributes = JSON.stringify(["jobTitle", "department", "mail", "businessPhones", "officeLocation"]);
    }
    if (p.attributeLabels === undefined) p.attributeLabels = "{}";
    if (p.showAttributeLabels === undefined) p.showAttributeLabels = true;
    if (p.showAttributeIcons === undefined) p.showAttributeIcons = true;
    if (p.layoutMode === undefined) p.layoutMode = LayoutMode.Grid;
    if (p.cardStyle === undefined) p.cardStyle = CardStyle.Standard;
    if (p.animationEntrance === undefined) p.animationEntrance = AnimationEntrance.Fade;
    if (p.carouselSettings === undefined) {
      p.carouselSettings = JSON.stringify({ cardsVisible: 3, autoAdvance: true, autoAdvanceInterval: 5, showNavigation: true, showPagination: true, infiniteLoop: true, pauseOnHover: true });
    }
    if (p.gridSettings === undefined) {
      p.gridSettings = JSON.stringify({ columns: "auto", equalHeightCards: true, gapSpacing: 20 });
    }
    if (p.tiledSettings === undefined) {
      p.tiledSettings = JSON.stringify({ hasFeaturedEmployee: false, featuredPosition: "first", tileSmallSize: 100, tileMediumSize: 150, tileLargeSize: 200 });
    }
    if (p.masonrySettings === undefined) {
      p.masonrySettings = JSON.stringify({ columnCount: "auto", gutterSpacing: 20 });
    }
    if (p.listSettings === undefined) {
      p.listSettings = JSON.stringify({ alternatingBackgrounds: true, showDividers: true, avatarPosition: "left" });
    }
    if (p.heroSettings === undefined) {
      p.heroSettings = JSON.stringify({ heroSize: 60, secondaryLayout: "grid", autoRotateHero: false, autoRotateInterval: 10 });
    }
    if (p.customMessage === undefined) p.customMessage = "Congratulations, {firstName}!";
    if (p.messagePosition === undefined) p.messagePosition = MessagePosition.Below;
    if (p.showProfilePicture === undefined) p.showProfilePicture = true;
    if (p.showEmployeeName === undefined) p.showEmployeeName = true;
    if (p.showJobTitle === undefined) p.showJobTitle = true;
    if (p.showDepartment === undefined) p.showDepartment = true;
    if (p.showCategoryBadge === undefined) p.showCategoryBadge = true;
    if (p.showCustomMessage === undefined) p.showCustomMessage = true;
    if (p.showActionButtons === undefined) p.showActionButtons = true;
    if (p.enableEmailButton === undefined) p.enableEmailButton = true;
    if (p.enableTeamsButton === undefined) p.enableTeamsButton = true;
    if (p.enableProfileButton === undefined) p.enableProfileButton = true;
    if (p.styleSettings === undefined) {
      p.styleSettings = JSON.stringify({ backgroundType: "theme", borderEnabled: true, borderWidth: 1, borderStyle: "solid", borderColor: "#e1e1e1", borderRadius: 8, shadowEnabled: true, shadowPreset: "subtle" });
    }
    if (p.applyStyleTo === undefined) p.applyStyleTo = "cards";
    if (p.useCategoryThemes === undefined) p.useCategoryThemes = true;
    if (p.mobileColumns === undefined) p.mobileColumns = 1;
    if (p.tabletColumns === undefined) p.tabletColumns = 2;
    if (p.lazyLoadImages === undefined) p.lazyLoadImages = true;
    if (p.imageQuality === undefined) p.imageQuality = ImageQuality.Medium;
    if (p.cacheEnabled === undefined) p.cacheEnabled = true;
    if (p.cacheDuration === undefined) p.cacheDuration = 60;
  }

  public render(): void {
    const element = React.createElement(HyperSpotlight, {
      ...this.properties,
      instanceId: this.instanceId,
    } as IHyperSpotlightComponentProps);

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, _oldValue: unknown, newValue: unknown): void {
    // Convert comma-separated text to array for manual employee IDs
    if (propertyPath === "manualEmployeeIdsText" && typeof newValue === "string") {
      this.properties.manualEmployeeIds = newValue
        .split(",")
        .map(function (id: string) { return id.trim(); })
        .filter(function (id: string) { return id.length > 0; });
      this.render();
    }
    super.onPropertyPaneFieldChanged(propertyPath, _oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        // ── Page 1: Data Source + Layout ──
        {
          header: { description: "Configure data source and layout" },
          groups: [
            {
              groupName: strings.DataSourceGroupName,
              groupFields: [
                PropertyPaneDropdown("selectionMode", { label: strings.SelectionModeLabel, options: SELECTION_MODE_OPTIONS }),
                PropertyPaneTextField("manualEmployeeIdsText", {
                  label: strings.ManualEmployeeIdsLabel,
                  description: "Enter email addresses or IDs separated by commas",
                  multiline: true,
                  rows: 3,
                  disabled: this.properties.selectionMode !== SelectionMode.Manual,
                }),
                PropertyPaneDropdown("category", { label: strings.CategoryLabel, options: CATEGORY_OPTIONS, disabled: this.properties.selectionMode === SelectionMode.Manual }),
                PropertyPaneDropdown("dateRange", { label: strings.DateRangeLabel, options: DATE_RANGE_OPTIONS, disabled: this.properties.selectionMode === SelectionMode.Manual }),
                PropertyPaneSlider("maxEmployees", { label: strings.MaxEmployeesLabel, min: 1, max: 50, step: 1 }),
                PropertyPaneDropdown("sortOrder", { label: strings.SortOrderLabel, options: SORT_ORDER_OPTIONS }),
                PropertyPaneToggle("autoRefreshEnabled", { label: strings.AutoRefreshLabel, onText: "On", offText: "Off" }),
                PropertyPaneSlider("autoRefreshInterval", { label: strings.AutoRefreshIntervalLabel, min: 5, max: 1440, step: 5, disabled: !this.properties.autoRefreshEnabled }),
              ],
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneDropdown("layoutMode", { label: strings.LayoutModeLabel, options: LAYOUT_MODE_OPTIONS }),
                PropertyPaneDropdown("cardStyle", { label: strings.CardStyleLabel, options: CARD_STYLE_OPTIONS }),
                PropertyPaneDropdown("animationEntrance", { label: strings.AnimationLabel, options: ANIMATION_OPTIONS }),
                PropertyPaneSlider("mobileColumns", { label: strings.MobileColumnsLabel, min: 1, max: 2, step: 1 }),
                PropertyPaneSlider("tabletColumns", { label: strings.TabletColumnsLabel, min: 1, max: 4, step: 1 }),
              ],
            },
          ],
        },
        // ── Page 2: Content + Actions ──
        {
          header: { description: "Configure content display and actions" },
          groups: [
            {
              groupName: strings.ContentGroupName,
              groupFields: [
                PropertyPaneToggle("showProfilePicture", { label: strings.ShowProfilePictureLabel, onText: "On", offText: "Off" }),
                PropertyPaneToggle("showEmployeeName", { label: strings.ShowEmployeeNameLabel, onText: "On", offText: "Off" }),
                PropertyPaneToggle("showJobTitle", { label: strings.ShowJobTitleLabel, onText: "On", offText: "Off" }),
                PropertyPaneToggle("showDepartment", { label: strings.ShowDepartmentLabel, onText: "On", offText: "Off" }),
                PropertyPaneToggle("showCategoryBadge", { label: strings.ShowCategoryBadgeLabel, onText: "On", offText: "Off" }),
                PropertyPaneToggle("showCustomMessage", { label: strings.ShowCustomMessageLabel, onText: "On", offText: "Off" }),
                PropertyPaneTextField("customMessage", {
                  label: strings.CustomMessageLabel,
                  description: "Tokens: {firstName}, {lastName}, {displayName}, {jobTitle}, {department}, {years}",
                  multiline: true,
                  disabled: !this.properties.showCustomMessage,
                }),
                PropertyPaneDropdown("messagePosition", { label: strings.MessagePositionLabel, options: MESSAGE_POSITION_OPTIONS, disabled: !this.properties.showCustomMessage }),
              ],
            },
            {
              groupName: strings.ActionsGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle("showActionButtons", { label: strings.ShowActionButtonsLabel, onText: "On", offText: "Off" }),
                PropertyPaneCheckbox("enableEmailButton", { text: strings.EnableEmailLabel, disabled: !this.properties.showActionButtons }),
                PropertyPaneCheckbox("enableTeamsButton", { text: strings.EnableTeamsLabel, disabled: !this.properties.showActionButtons }),
                PropertyPaneCheckbox("enableProfileButton", { text: strings.EnableProfileLabel, disabled: !this.properties.showActionButtons }),
              ],
            },
          ],
        },
        // ── Page 3: Styling + Performance ──
        {
          header: { description: "Configure styling and performance" },
          groups: [
            {
              groupName: strings.StylingGroupName,
              groupFields: [
                PropertyPaneToggle("useCategoryThemes", { label: strings.UseCategoryThemesLabel, onText: "On", offText: "Off" }),
                PropertyPaneToggle("showAttributeLabels", { label: strings.ShowAttributeLabelsLabel, onText: "On", offText: "Off" }),
                PropertyPaneToggle("showAttributeIcons", { label: strings.ShowAttributeIconsLabel, onText: "On", offText: "Off" }),
              ],
            },
            {
              groupName: strings.PerformanceGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle("lazyLoadImages", { label: strings.LazyLoadLabel, onText: "On", offText: "Off" }),
                PropertyPaneDropdown("imageQuality", { label: strings.ImageQualityLabel, options: IMAGE_QUALITY_OPTIONS }),
                PropertyPaneToggle("cacheEnabled", { label: strings.CacheEnabledLabel, onText: "On", offText: "Off" }),
                PropertyPaneSlider("cacheDuration", { label: strings.CacheDurationLabel, min: 5, max: 1440, step: 5, disabled: !this.properties.cacheEnabled }),
              ],
            },
            {
              groupName: strings.AdvancedGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle("debugMode", { label: strings.DebugModeLabel, onText: "On", offText: "Off" }),
              ],
            },
          ],
        },
      ],
    };
  }
}
