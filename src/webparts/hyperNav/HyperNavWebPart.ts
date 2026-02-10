import * as React from "react";
import * as ReactDom from "react-dom";
import { Version, DisplayMode } from "@microsoft/sp-core-library";
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
  PropertyPaneCheckbox,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperNavWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperNav from "./components/HyperNav";
import type { IHyperNavComponentProps } from "./components/HyperNav";
import type { IHyperNavWebPartProps, IHyperNavLink } from "./models";
import { SAMPLE_LINKS, DEFAULT_COLOR_CONFIG, DEFAULT_PANEL_CONFIG } from "./models";
import { stringifyColorConfig, stringifyPanelConfig } from "./utils/colorUtils";
import {
  parseLinks,
  stringifyLinks,
  parseGroups,
  stringifyGroups,
  createLink,
  createGroup,
  removeLink,
  reorderLink,
  removeGroup,
} from "./utils/linkUtils";

export default class HyperNavWebPart extends BaseHyperWebPart<IHyperNavWebPartProps> {

  public render(): void {
    var props: IHyperNavComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      siteUrl: this.context.pageContext.web.absoluteUrl,
      onConfigure: (): void => { this.context.propertyPane.open(); },
    };
    var element: React.ReactElement<IHyperNavComponentProps> =
      React.createElement(HyperNav, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    // V1 defaults
    if (this.properties.title === undefined) {
      this.properties.title = "Quick Links";
    }
    if (this.properties.layoutMode === undefined) {
      this.properties.layoutMode = "tiles";
    }
    if (this.properties.links === undefined) {
      this.properties.links = stringifyLinks(SAMPLE_LINKS);
    }
    if (this.properties.groups === undefined) {
      this.properties.groups = "[]";
    }
    if (this.properties.gridColumns === undefined) {
      this.properties.gridColumns = 4;
    }
    if (this.properties.showIcons === undefined) {
      this.properties.showIcons = true;
    }
    if (this.properties.showDescriptions === undefined) {
      this.properties.showDescriptions = false;
    }
    if (this.properties.showSearch === undefined) {
      this.properties.showSearch = false;
    }
    if (this.properties.showExternalBadge === undefined) {
      this.properties.showExternalBadge = true;
    }
    if (this.properties.externalBadgeIcon === undefined) {
      this.properties.externalBadgeIcon = "OpenInNewTab";
    }
    if (this.properties.enableAudienceTargeting === undefined) {
      this.properties.enableAudienceTargeting = false;
    }
    if (this.properties.enablePersonalization === undefined) {
      this.properties.enablePersonalization = false;
    }
    if (this.properties.enableAnalytics === undefined) {
      this.properties.enableAnalytics = false;
    }
    if (this.properties.enableLinkHealthCheck === undefined) {
      this.properties.enableLinkHealthCheck = false;
    }
    if (this.properties.enableGrouping === undefined) {
      this.properties.enableGrouping = false;
    }
    if (this.properties.enableDeepLinks === undefined) {
      this.properties.enableDeepLinks = false;
    }

    // V2 defaults
    if (this.properties.hoverEffect === undefined) {
      this.properties.hoverEffect = "lift";
    }
    if (this.properties.borderRadius === undefined) {
      this.properties.borderRadius = "slight";
    }
    if (this.properties.navTheme === undefined) {
      this.properties.navTheme = "light";
    }
    if (this.properties.separator === undefined) {
      this.properties.separator = "line";
    }
    if (this.properties.colorConfig === undefined) {
      this.properties.colorConfig = stringifyColorConfig(DEFAULT_COLOR_CONFIG);
    }
    if (this.properties.panelConfig === undefined) {
      this.properties.panelConfig = stringifyPanelConfig(DEFAULT_PANEL_CONFIG);
    }
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = true;
    }
    if (this.properties.enableDemoMode === undefined) {
      this.properties.enableDemoMode = false;
    }
    if (this.properties.enableStickyNav === undefined) {
      this.properties.enableStickyNav = false;
    }
    if (this.properties.enableNotifications === undefined) {
      this.properties.enableNotifications = false;
    }
    if (this.properties.enableActiveDetection === undefined) {
      this.properties.enableActiveDetection = true;
    }
    if (this.properties.enableTooltips === undefined) {
      this.properties.enableTooltips = true;
    }
    if (this.properties.enableCommandPalette === undefined) {
      this.properties.enableCommandPalette = false;
    }
    if (this.properties.enableDarkModeToggle === undefined) {
      this.properties.enableDarkModeToggle = false;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("2.0");
  }

  private _updateLinks(links: IHyperNavLink[]): void {
    this.properties.links = stringifyLinks(links);
    this.render();
    this.context.propertyPane.refresh();
  }

  private _buildSingleLinkFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: IPropertyPaneField<any>[],
    link: IHyperNavLink,
    index: number,
    totalLinks: number
  ): void {
    fields.push(
      PropertyPaneLabel("_linkLabel" + index, {
        text: strings.LinkHeaderPrefix + " " + (index + 1) + ": " + link.title,
      })
    );

    fields.push(
      PropertyPaneTextField("_linkTitle" + index, {
        label: strings.LinkTitleLabel,
        value: link.title,
      })
    );

    fields.push(
      PropertyPaneTextField("_linkUrl" + index, {
        label: strings.LinkUrlLabel,
        value: link.url,
      })
    );

    fields.push(
      PropertyPaneTextField("_linkDescription" + index, {
        label: strings.LinkDescriptionLabel,
        value: link.description || "",
        multiline: true,
      })
    );

    fields.push(
      PropertyPaneTextField("_linkIconName" + index, {
        label: strings.LinkIconNameLabel,
        value: link.icon ? link.icon.value : "",
        description: "Fluent UI icon name (e.g. Home, Globe, Mail)",
      })
    );

    fields.push(
      PropertyPaneCheckbox("_linkNewTab" + index, {
        text: strings.LinkOpenInNewTabLabel,
        checked: link.openInNewTab,
      })
    );

    if (this.properties.enableGrouping) {
      fields.push(
        PropertyPaneTextField("_linkGroupName" + index, {
          label: strings.LinkGroupNameLabel,
          value: link.groupName || "",
        })
      );
    }

    fields.push(
      PropertyPaneButton("_linkMoveUp" + index, {
        text: strings.MoveUpLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronUp",
        disabled: index === 0,
        onClick: this._createMoveHandler(index, index - 1),
      })
    );

    fields.push(
      PropertyPaneButton("_linkMoveDown" + index, {
        text: strings.MoveDownLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronDown",
        disabled: index === totalLinks - 1,
        onClick: this._createMoveHandler(index, index + 1),
      })
    );

    fields.push(
      PropertyPaneButton("_linkRemove" + index, {
        text: strings.RemoveLinkLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Delete",
        onClick: this._createRemoveHandler(link.id),
      })
    );

    fields.push(PropertyPaneHorizontalRule());
  }

  private _createMoveHandler(fromIndex: number, toIndex: number): () => string {
    return (): string => {
      var currentLinks = parseLinks(this.properties.links);
      var reordered = reorderLink(currentLinks, fromIndex, toIndex);
      this._updateLinks(reordered);
      return "";
    };
  }

  private _createRemoveHandler(linkId: string): () => string {
    return (): string => {
      var currentLinks = parseLinks(this.properties.links);
      var updated = removeLink(currentLinks, linkId);
      this._updateLinks(updated);
      return "";
    };
  }

  private _createAddHandler(): () => string {
    return (): string => {
      var currentLinks = parseLinks(this.properties.links);
      var newLink = createLink(
        strings.NewLinkDefaultTitle + " " + (currentLinks.length + 1),
        currentLinks.length
      );
      currentLinks.push(newLink);
      this._updateLinks(currentLinks);
      return "";
    };
  }

  private _buildLinkFields(): IPropertyPaneField<unknown>[] {
    var links = parseLinks(this.properties.links);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var fields: IPropertyPaneField<any>[] = [];

    for (var i = 0; i < links.length; i++) {
      this._buildSingleLinkFields(fields, links[i], i, links.length);
    }

    fields.push(
      PropertyPaneButton("_linkAdd", {
        text: strings.AddLinkLabel,
        buttonType: PropertyPaneButtonType.Primary,
        icon: "Add",
        onClick: this._createAddHandler(),
      })
    );

    return fields;
  }

  private _buildGroupFields(): IPropertyPaneField<unknown>[] {
    if (!this.properties.enableGrouping) return [];

    var groups = parseGroups(this.properties.groups);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var fields: IPropertyPaneField<any>[] = [];

    fields.push(
      PropertyPaneLabel("_groupsSectionLabel", {
        text: strings.GroupsSectionLabel,
      })
    );

    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      fields.push(
        PropertyPaneTextField("_groupName" + i, {
          label: strings.GroupNameLabel + " " + (i + 1),
          value: group.name,
        })
      );
      fields.push(
        PropertyPaneButton("_groupRemove" + i, {
          text: strings.RemoveGroupLabel,
          buttonType: PropertyPaneButtonType.Normal,
          icon: "Delete",
          onClick: this._createRemoveGroupHandler(group.id),
        })
      );
    }

    fields.push(
      PropertyPaneButton("_groupAdd", {
        text: strings.AddGroupLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Add",
        onClick: this._createAddGroupHandler(),
      })
    );

    fields.push(PropertyPaneHorizontalRule());

    return fields;
  }

  private _createRemoveGroupHandler(groupId: string): () => string {
    return (): string => {
      var groups = parseGroups(this.properties.groups);
      var updated = removeGroup(groups, groupId);
      this.properties.groups = stringifyGroups(updated);
      this.render();
      this.context.propertyPane.refresh();
      return "";
    };
  }

  private _createAddGroupHandler(): () => string {
    return (): string => {
      var groups = parseGroups(this.properties.groups);
      var newGroup = createGroup(
        strings.NewGroupDefaultName + " " + (groups.length + 1),
        groups.length
      );
      groups.push(newGroup);
      this.properties.groups = stringifyGroups(groups);
      this.render();
      this.context.propertyPane.refresh();
      return "";
    };
  }

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    if (propertyPath.indexOf("_linkTitle") === 0) {
      var indexStr = propertyPath.substring("_linkTitle".length);
      var linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        var links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          links[linkIndex].title = String(newValue);
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    if (propertyPath.indexOf("_linkUrl") === 0) {
      var indexStr2 = propertyPath.substring("_linkUrl".length);
      var linkIndex2 = parseInt(indexStr2, 10);
      if (!isNaN(linkIndex2)) {
        var links2 = parseLinks(this.properties.links);
        if (linkIndex2 >= 0 && linkIndex2 < links2.length) {
          links2[linkIndex2].url = String(newValue);
          this.properties.links = stringifyLinks(links2);
          this.render();
        }
      }
      return;
    }

    if (propertyPath.indexOf("_linkDescription") === 0) {
      var indexStr3 = propertyPath.substring("_linkDescription".length);
      var linkIndex3 = parseInt(indexStr3, 10);
      if (!isNaN(linkIndex3)) {
        var links3 = parseLinks(this.properties.links);
        if (linkIndex3 >= 0 && linkIndex3 < links3.length) {
          links3[linkIndex3].description = String(newValue) || undefined;
          this.properties.links = stringifyLinks(links3);
          this.render();
        }
      }
      return;
    }

    if (propertyPath.indexOf("_linkIconName") === 0) {
      var indexStr4 = propertyPath.substring("_linkIconName".length);
      var linkIndex4 = parseInt(indexStr4, 10);
      if (!isNaN(linkIndex4)) {
        var links4 = parseLinks(this.properties.links);
        if (linkIndex4 >= 0 && linkIndex4 < links4.length) {
          var iconValue = String(newValue);
          if (iconValue) {
            links4[linkIndex4].icon = { type: "fluent", value: iconValue };
          } else {
            links4[linkIndex4].icon = undefined;
          }
          this.properties.links = stringifyLinks(links4);
          this.render();
        }
      }
      return;
    }

    if (propertyPath.indexOf("_linkNewTab") === 0) {
      var indexStr5 = propertyPath.substring("_linkNewTab".length);
      var linkIndex5 = parseInt(indexStr5, 10);
      if (!isNaN(linkIndex5)) {
        var links5 = parseLinks(this.properties.links);
        if (linkIndex5 >= 0 && linkIndex5 < links5.length) {
          links5[linkIndex5].openInNewTab = !!newValue;
          this.properties.links = stringifyLinks(links5);
          this.render();
        }
      }
      return;
    }

    if (propertyPath.indexOf("_linkGroupName") === 0) {
      var indexStr6 = propertyPath.substring("_linkGroupName".length);
      var linkIndex6 = parseInt(indexStr6, 10);
      if (!isNaN(linkIndex6)) {
        var links6 = parseLinks(this.properties.links);
        if (linkIndex6 >= 0 && linkIndex6 < links6.length) {
          links6[linkIndex6].groupName = String(newValue) || undefined;
          this.properties.links = stringifyLinks(links6);
          this.render();
        }
      }
      return;
    }

    if (propertyPath.indexOf("_groupName") === 0) {
      var indexStr7 = propertyPath.substring("_groupName".length);
      var groupIndex = parseInt(indexStr7, 10);
      if (!isNaN(groupIndex)) {
        var grps = parseGroups(this.properties.groups);
        if (groupIndex >= 0 && groupIndex < grps.length) {
          grps[groupIndex].name = String(newValue);
          this.properties.groups = stringifyGroups(grps);
          this.render();
        }
      }
      return;
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    var linkManagementGroup: IPropertyPaneGroup = {
      groupName: strings.LinksGroupName,
      groupFields: this._buildLinkFields(),
    };

    var groupFields = this._buildGroupFields();
    var page2Groups: IPropertyPaneGroup[] = [linkManagementGroup];
    if (groupFields.length > 0) {
      page2Groups.unshift({
        groupName: strings.GroupsGroupName,
        groupFields: groupFields,
      });
    }

    return {
      pages: [
        // ── Page 1: Layout & Styling ──
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneDropdown("layoutMode", {
                  label: strings.LayoutModeFieldLabel,
                  options: [
                    { key: "compact", text: "Compact" },
                    { key: "tiles", text: "Tiles" },
                    { key: "grid", text: "Grid" },
                    { key: "list", text: "List" },
                    { key: "iconOnly", text: "Icon Only" },
                    { key: "card", text: "Card" },
                    { key: "megaMenu", text: "Mega Menu" },
                    { key: "sidebar", text: "Sidebar" },
                    { key: "topbar", text: "Top Bar" },
                    { key: "dropdown", text: "Dropdown" },
                    { key: "tabbar", text: "Tab Bar" },
                    { key: "hamburger", text: "Hamburger" },
                    { key: "breadcrumb", text: "Breadcrumb" },
                    { key: "cmdPalette", text: "Command Palette" },
                    { key: "fab", text: "FAB (Floating)" },
                  ],
                }),
                PropertyPaneSlider("gridColumns", {
                  label: strings.GridColumnsFieldLabel,
                  min: 1,
                  max: 8,
                  step: 1,
                }),
                PropertyPaneToggle("showIcons", {
                  label: strings.ShowIconsLabel,
                }),
                PropertyPaneToggle("showDescriptions", {
                  label: strings.ShowDescriptionsLabel,
                }),
              ],
            },
            {
              groupName: strings.StylingGroupName,
              groupFields: [
                PropertyPaneDropdown("hoverEffect", {
                  label: strings.HoverEffectLabel,
                  options: [
                    { key: "lift", text: "Lift" },
                    { key: "glow", text: "Glow" },
                    { key: "zoom", text: "Zoom" },
                    { key: "darken", text: "Darken" },
                    { key: "underline", text: "Underline" },
                    { key: "bgfill", text: "Background Fill" },
                    { key: "none", text: "None" },
                  ],
                }),
                PropertyPaneDropdown("borderRadius", {
                  label: strings.BorderRadiusLabel,
                  options: [
                    { key: "none", text: "Square" },
                    { key: "slight", text: "Slight" },
                    { key: "rounded", text: "Rounded" },
                    { key: "pill", text: "Pill" },
                  ],
                }),
                PropertyPaneDropdown("navTheme", {
                  label: strings.NavThemeLabel,
                  options: [
                    { key: "light", text: "Light" },
                    { key: "dark", text: "Dark" },
                    { key: "auto", text: "Auto" },
                  ],
                }),
                PropertyPaneDropdown("separator", {
                  label: strings.SeparatorLabel,
                  options: [
                    { key: "line", text: "Line" },
                    { key: "dot", text: "Dot" },
                    { key: "slash", text: "Slash" },
                    { key: "pipe", text: "Pipe" },
                    { key: "none", text: "None" },
                  ],
                }),
              ],
            },
          ],
        },
        // ── Page 2: Links Management ──
        {
          header: { description: strings.LinksPageDescription },
          groups: page2Groups,
        },
        // ── Page 3: Features ──
        {
          header: { description: strings.AdvancedPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                PropertyPaneToggle("showSearch", {
                  label: strings.ShowSearchLabel,
                }),
                PropertyPaneToggle("showExternalBadge", {
                  label: strings.ShowExternalBadgeLabel,
                }),
                PropertyPaneTextField("externalBadgeIcon", {
                  label: strings.ExternalBadgeIconLabel,
                  disabled: !this.properties.showExternalBadge,
                }),
                PropertyPaneToggle("enableAudienceTargeting", {
                  label: strings.EnableAudienceTargetingLabel,
                }),
                PropertyPaneToggle("enablePersonalization", {
                  label: strings.EnablePersonalizationLabel,
                }),
                PropertyPaneToggle("enableAnalytics", {
                  label: strings.EnableAnalyticsLabel,
                }),
                PropertyPaneToggle("enableLinkHealthCheck", {
                  label: strings.EnableLinkHealthCheckLabel,
                }),
                PropertyPaneToggle("enableGrouping", {
                  label: strings.EnableGroupingLabel,
                }),
                PropertyPaneToggle("enableDeepLinks", {
                  label: strings.EnableDeepLinksLabel,
                }),
                PropertyPaneHorizontalRule(),
                PropertyPaneToggle("enableStickyNav", {
                  label: strings.EnableStickyNavLabel,
                }),
                PropertyPaneToggle("enableNotifications", {
                  label: strings.EnableNotificationsLabel,
                }),
                PropertyPaneToggle("enableActiveDetection", {
                  label: strings.EnableActiveDetectionLabel,
                }),
                PropertyPaneToggle("enableTooltips", {
                  label: strings.EnableTooltipsLabel,
                }),
                PropertyPaneToggle("enableCommandPalette", {
                  label: strings.EnableCommandPaletteLabel,
                }),
                PropertyPaneToggle("enableDarkModeToggle", {
                  label: strings.EnableDarkModeToggleLabel,
                }),
                PropertyPaneHorizontalRule(),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataLabel,
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
