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
import { SAMPLE_LINKS } from "./models";
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
    const props: IHyperNavComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      siteUrl: this.context.pageContext.web.absoluteUrl,
    };
    const element: React.ReactElement<IHyperNavComponentProps> =
      React.createElement(HyperNav, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

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
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  /**
   * Update links JSON and refresh the property pane + component.
   */
  private _updateLinks(links: IHyperNavLink[]): void {
    this.properties.links = stringifyLinks(links);
    this.render();
    this.context.propertyPane.refresh();
  }

  /**
   * Build fields for a single link at the given index (enhanced with icon, description, group).
   */
  private _buildSingleLinkFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: IPropertyPaneField<any>[],
    link: IHyperNavLink,
    index: number,
    totalLinks: number
  ): void {
    // Link header label
    fields.push(
      PropertyPaneLabel("_linkLabel" + index, {
        text: strings.LinkHeaderPrefix + " " + (index + 1) + ": " + link.title,
      })
    );

    // Title field
    fields.push(
      PropertyPaneTextField("_linkTitle" + index, {
        label: strings.LinkTitleLabel,
        value: link.title,
      })
    );

    // URL field
    fields.push(
      PropertyPaneTextField("_linkUrl" + index, {
        label: strings.LinkUrlLabel,
        value: link.url,
      })
    );

    // Description field
    fields.push(
      PropertyPaneTextField("_linkDescription" + index, {
        label: strings.LinkDescriptionLabel,
        value: link.description || "",
        multiline: true,
      })
    );

    // Icon name field
    fields.push(
      PropertyPaneTextField("_linkIconName" + index, {
        label: strings.LinkIconNameLabel,
        value: link.icon ? link.icon.value : "",
        description: "Fluent UI icon name (e.g. Home, Globe, Mail)",
      })
    );

    // Open in new tab
    fields.push(
      PropertyPaneCheckbox("_linkNewTab" + index, {
        text: strings.LinkOpenInNewTabLabel,
        checked: link.openInNewTab,
      })
    );

    // Group name (when grouping enabled)
    if (this.properties.enableGrouping) {
      fields.push(
        PropertyPaneTextField("_linkGroupName" + index, {
          label: strings.LinkGroupNameLabel,
          value: link.groupName || "",
        })
      );
    }

    // Move Up button (disabled for first link)
    fields.push(
      PropertyPaneButton("_linkMoveUp" + index, {
        text: strings.MoveUpLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronUp",
        disabled: index === 0,
        onClick: this._createMoveHandler(index, index - 1),
      })
    );

    // Move Down button (disabled for last link)
    fields.push(
      PropertyPaneButton("_linkMoveDown" + index, {
        text: strings.MoveDownLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronDown",
        disabled: index === totalLinks - 1,
        onClick: this._createMoveHandler(index, index + 1),
      })
    );

    // Remove button
    fields.push(
      PropertyPaneButton("_linkRemove" + index, {
        text: strings.RemoveLinkLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "Delete",
        onClick: this._createRemoveHandler(link.id),
      })
    );

    // Horizontal rule between links
    fields.push(PropertyPaneHorizontalRule());
  }

  private _createMoveHandler(fromIndex: number, toIndex: number): () => string {
    return (): string => {
      const currentLinks = parseLinks(this.properties.links);
      const reordered = reorderLink(currentLinks, fromIndex, toIndex);
      this._updateLinks(reordered);
      return "";
    };
  }

  private _createRemoveHandler(linkId: string): () => string {
    return (): string => {
      const currentLinks = parseLinks(this.properties.links);
      const updated = removeLink(currentLinks, linkId);
      this._updateLinks(updated);
      return "";
    };
  }

  private _createAddHandler(): () => string {
    return (): string => {
      const currentLinks = parseLinks(this.properties.links);
      const newLink = createLink(
        strings.NewLinkDefaultTitle + " " + (currentLinks.length + 1),
        currentLinks.length
      );
      currentLinks.push(newLink);
      this._updateLinks(currentLinks);
      return "";
    };
  }

  /**
   * Build dynamic per-link fields for property pane Page 2.
   */
  private _buildLinkFields(): IPropertyPaneField<unknown>[] {
    const links = parseLinks(this.properties.links);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: IPropertyPaneField<any>[] = [];

    for (let i = 0; i < links.length; i++) {
      this._buildSingleLinkFields(fields, links[i], i, links.length);
    }

    // Add New Link button
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

  /**
   * Build group management fields (when grouping is enabled).
   */
  private _buildGroupFields(): IPropertyPaneField<unknown>[] {
    if (!this.properties.enableGrouping) return [];

    const groups = parseGroups(this.properties.groups);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: IPropertyPaneField<any>[] = [];

    fields.push(
      PropertyPaneLabel("_groupsSectionLabel", {
        text: strings.GroupsSectionLabel,
      })
    );

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
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
      const groups = parseGroups(this.properties.groups);
      const updated = removeGroup(groups, groupId);
      this.properties.groups = stringifyGroups(updated);
      this.render();
      this.context.propertyPane.refresh();
      return "";
    };
  }

  private _createAddGroupHandler(): () => string {
    return (): string => {
      const groups = parseGroups(this.properties.groups);
      const newGroup = createGroup(
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

  /**
   * Handle dynamic property pane field changes for per-link editing.
   */
  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    // Handle per-link title changes
    if (propertyPath.indexOf("_linkTitle") === 0) {
      const indexStr = propertyPath.substring("_linkTitle".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          links[linkIndex].title = String(newValue);
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Handle per-link URL changes
    if (propertyPath.indexOf("_linkUrl") === 0) {
      const indexStr = propertyPath.substring("_linkUrl".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          links[linkIndex].url = String(newValue);
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Handle per-link description changes
    if (propertyPath.indexOf("_linkDescription") === 0) {
      const indexStr = propertyPath.substring("_linkDescription".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          links[linkIndex].description = String(newValue) || undefined;
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Handle per-link icon name changes
    if (propertyPath.indexOf("_linkIconName") === 0) {
      const indexStr = propertyPath.substring("_linkIconName".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          const iconValue = String(newValue);
          if (iconValue) {
            links[linkIndex].icon = { type: "fluent", value: iconValue };
          } else {
            links[linkIndex].icon = undefined;
          }
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Handle per-link openInNewTab changes
    if (propertyPath.indexOf("_linkNewTab") === 0) {
      const indexStr = propertyPath.substring("_linkNewTab".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          links[linkIndex].openInNewTab = !!newValue;
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Handle per-link group name changes
    if (propertyPath.indexOf("_linkGroupName") === 0) {
      const indexStr = propertyPath.substring("_linkGroupName".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          links[linkIndex].groupName = String(newValue) || undefined;
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Handle group name changes
    if (propertyPath.indexOf("_groupName") === 0) {
      const indexStr = propertyPath.substring("_groupName".length);
      const groupIndex = parseInt(indexStr, 10);
      if (!isNaN(groupIndex)) {
        const groups = parseGroups(this.properties.groups);
        if (groupIndex >= 0 && groupIndex < groups.length) {
          groups[groupIndex].name = String(newValue);
          this.properties.groups = stringifyGroups(groups);
          this.render();
        }
      }
      return;
    }

    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // Build dynamic link management group
    const linkManagementGroup: IPropertyPaneGroup = {
      groupName: strings.LinksGroupName,
      groupFields: this._buildLinkFields(),
    };

    // Build group management fields
    const groupFields = this._buildGroupFields();
    const page2Groups: IPropertyPaneGroup[] = [linkManagementGroup];
    if (groupFields.length > 0) {
      page2Groups.unshift({
        groupName: strings.GroupsGroupName,
        groupFields: groupFields,
      });
    }

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
              ],
            },
          ],
        },
      ],
    };
  }
}
