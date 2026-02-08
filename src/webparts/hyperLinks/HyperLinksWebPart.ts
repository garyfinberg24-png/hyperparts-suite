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

import * as strings from "HyperLinksWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import HyperLinks from "./components/HyperLinks";
import type { IHyperLinksComponentProps } from "./components/HyperLinks";
import type { IHyperLinksWebPartProps, IHyperLink } from "./models";
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
} from "./utils/linkParser";

export default class HyperLinksWebPart extends BaseHyperWebPart<IHyperLinksWebPartProps> {

  public render(): void {
    const props: IHyperLinksComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
    };
    const element: React.ReactElement<IHyperLinksComponentProps> =
      React.createElement(HyperLinks, props);
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();

    if (this.properties.title === undefined) {
      this.properties.title = "Quick Links";
    }
    if (this.properties.layoutMode === undefined) {
      this.properties.layoutMode = "grid";
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
    if (this.properties.tileSize === undefined) {
      this.properties.tileSize = "medium";
    }
    if (this.properties.showIcons === undefined) {
      this.properties.showIcons = true;
    }
    if (this.properties.showDescriptions === undefined) {
      this.properties.showDescriptions = false;
    }
    if (this.properties.showThumbnails === undefined) {
      this.properties.showThumbnails = false;
    }
    if (this.properties.iconSize === undefined) {
      this.properties.iconSize = "medium";
    }
    if (this.properties.enableGrouping === undefined) {
      this.properties.enableGrouping = false;
    }
    if (this.properties.enableAudienceTargeting === undefined) {
      this.properties.enableAudienceTargeting = false;
    }
    if (this.properties.enableAnalytics === undefined) {
      this.properties.enableAnalytics = false;
    }
    if (this.properties.enableColorCustomization === undefined) {
      this.properties.enableColorCustomization = false;
    }
    if (this.properties.hoverEffect === undefined) {
      this.properties.hoverEffect = "lift";
    }
    if (this.properties.borderRadius === undefined) {
      this.properties.borderRadius = "medium";
    }
    if (this.properties.compactAlignment === undefined) {
      this.properties.compactAlignment = "left";
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  /** Update links JSON and refresh */
  private _updateLinks(links: IHyperLink[]): void {
    this.properties.links = stringifyLinks(links);
    this.render();
    this.context.propertyPane.refresh();
  }

  /** Build fields for a single link at the given index */
  private _buildSingleLinkFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: IPropertyPaneField<any>[],
    link: IHyperLink,
    index: number,
    totalLinks: number
  ): void {
    // Link header label
    fields.push(
      PropertyPaneLabel("_linkLabel" + index, {
        text: strings.LinkHeaderPrefix + " " + (index + 1) + ": " + link.title,
      })
    );

    // Title
    fields.push(
      PropertyPaneTextField("_linkTitle" + index, {
        label: strings.LinkTitleLabel,
        value: link.title,
      })
    );

    // URL
    fields.push(
      PropertyPaneTextField("_linkUrl" + index, {
        label: strings.LinkUrlLabel,
        value: link.url,
      })
    );

    // Description
    fields.push(
      PropertyPaneTextField("_linkDescription" + index, {
        label: strings.LinkDescriptionLabel,
        value: link.description || "",
        multiline: true,
      })
    );

    // Icon type dropdown
    fields.push(
      PropertyPaneDropdown("_linkIconType" + index, {
        label: strings.LinkIconTypeLabel,
        options: [
          { key: "fluent", text: "Fluent UI Icon" },
          { key: "emoji", text: "Emoji" },
          { key: "custom", text: "Custom Image URL" },
        ],
        selectedKey: link.icon ? link.icon.type : "fluent",
      })
    );

    // Icon value
    fields.push(
      PropertyPaneTextField("_linkIconName" + index, {
        label: strings.LinkIconNameLabel,
        value: link.icon ? link.icon.value : "",
        description: "Fluent icon name, emoji character, or image URL",
      })
    );

    // Thumbnail URL (when showThumbnails enabled)
    if (this.properties.showThumbnails) {
      fields.push(
        PropertyPaneTextField("_linkThumbnailUrl" + index, {
          label: strings.LinkThumbnailUrlLabel,
          value: link.thumbnailUrl || "",
        })
      );
    }

    // Background color (when color customization enabled)
    if (this.properties.enableColorCustomization) {
      fields.push(
        PropertyPaneTextField("_linkBackgroundColor" + index, {
          label: strings.LinkBackgroundColorLabel,
          value: link.backgroundColor || "",
          description: "CSS color (e.g. #0078D4, rgba(0,0,0,0.1))",
        })
      );
    }

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

    // Move Up
    fields.push(
      PropertyPaneButton("_linkMoveUp" + index, {
        text: strings.MoveUpLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronUp",
        disabled: index === 0,
        onClick: this._createMoveHandler(index, index - 1),
      })
    );

    // Move Down
    fields.push(
      PropertyPaneButton("_linkMoveDown" + index, {
        text: strings.MoveDownLabel,
        buttonType: PropertyPaneButtonType.Normal,
        icon: "ChevronDown",
        disabled: index === totalLinks - 1,
        onClick: this._createMoveHandler(index, index + 1),
      })
    );

    // Remove
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

  /** Build dynamic per-link fields for Page 2 */
  private _buildLinkFields(): IPropertyPaneField<unknown>[] {
    const links = parseLinks(this.properties.links);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: IPropertyPaneField<any>[] = [];

    for (let i = 0; i < links.length; i++) {
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

  /** Build group management fields */
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

  /** Handle dynamic property pane field changes */
  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    // Per-link title
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

    // Per-link URL
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

    // Per-link description
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

    // Per-link icon type
    if (propertyPath.indexOf("_linkIconType") === 0) {
      const indexStr = propertyPath.substring("_linkIconType".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          const iconType = String(newValue) as "fluent" | "emoji" | "custom";
          const existing = links[linkIndex].icon;
          if (existing) {
            links[linkIndex].icon = { type: iconType, value: existing.value, color: existing.color };
          } else {
            links[linkIndex].icon = { type: iconType, value: "" };
          }
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Per-link icon name/value
    if (propertyPath.indexOf("_linkIconName") === 0) {
      const indexStr = propertyPath.substring("_linkIconName".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          const iconValue = String(newValue);
          if (iconValue) {
            const existing = links[linkIndex].icon;
            const existingType = existing ? existing.type : "fluent";
            links[linkIndex].icon = { type: existingType, value: iconValue };
          } else {
            links[linkIndex].icon = undefined;
          }
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Per-link thumbnail URL
    if (propertyPath.indexOf("_linkThumbnailUrl") === 0) {
      const indexStr = propertyPath.substring("_linkThumbnailUrl".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          links[linkIndex].thumbnailUrl = String(newValue) || undefined;
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Per-link background color
    if (propertyPath.indexOf("_linkBackgroundColor") === 0) {
      const indexStr = propertyPath.substring("_linkBackgroundColor".length);
      const linkIndex = parseInt(indexStr, 10);
      if (!isNaN(linkIndex)) {
        const links = parseLinks(this.properties.links);
        if (linkIndex >= 0 && linkIndex < links.length) {
          links[linkIndex].backgroundColor = String(newValue) || undefined;
          this.properties.links = stringifyLinks(links);
          this.render();
        }
      }
      return;
    }

    // Per-link openInNewTab
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

    // Per-link group name
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

    // Group name changes
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
    // Page 1 fields - conditionally add layout-specific options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page1Fields: IPropertyPaneField<any>[] = [
      PropertyPaneTextField("title", {
        label: strings.TitleFieldLabel,
      }),
      PropertyPaneDropdown("layoutMode", {
        label: strings.LayoutModeFieldLabel,
        options: [
          { key: "compact", text: "Compact" },
          { key: "filmstrip", text: "Filmstrip" },
          { key: "grid", text: "Grid" },
          { key: "button", text: "Button" },
          { key: "list", text: "List" },
          { key: "tiles", text: "Tiles" },
          { key: "card", text: "Card" },
          { key: "iconGrid", text: "Icon Grid" },
        ],
      }),
    ];

    // Grid columns - shown for grid/tiles/card/iconGrid layouts
    const gridLayouts = ["grid", "tiles", "card", "iconGrid"];
    if (gridLayouts.indexOf(this.properties.layoutMode) !== -1) {
      page1Fields.push(
        PropertyPaneSlider("gridColumns", {
          label: strings.GridColumnsFieldLabel,
          min: 2,
          max: 6,
          step: 1,
        })
      );
    }

    // Tile size - for tiles layout
    if (this.properties.layoutMode === "tiles") {
      page1Fields.push(
        PropertyPaneDropdown("tileSize", {
          label: strings.TileSizeFieldLabel,
          options: [
            { key: "small", text: "Small" },
            { key: "medium", text: "Medium" },
            { key: "large", text: "Large" },
          ],
        })
      );
    }

    page1Fields.push(
      PropertyPaneDropdown("iconSize", {
        label: strings.IconSizeFieldLabel,
        options: [
          { key: "small", text: "Small" },
          { key: "medium", text: "Medium" },
          { key: "large", text: "Large" },
        ],
      }),
      PropertyPaneToggle("showIcons", {
        label: strings.ShowIconsLabel,
      }),
      PropertyPaneToggle("showDescriptions", {
        label: strings.ShowDescriptionsLabel,
      }),
      PropertyPaneToggle("showThumbnails", {
        label: strings.ShowThumbnailsLabel,
      }),
      PropertyPaneDropdown("hoverEffect", {
        label: strings.HoverEffectFieldLabel,
        options: [
          { key: "none", text: "None" },
          { key: "lift", text: "Lift" },
          { key: "glow", text: "Glow" },
          { key: "zoom", text: "Zoom" },
          { key: "darken", text: "Darken" },
        ],
      }),
      PropertyPaneDropdown("borderRadius", {
        label: strings.BorderRadiusFieldLabel,
        options: [
          { key: "none", text: "None" },
          { key: "small", text: "Small" },
          { key: "medium", text: "Medium" },
          { key: "large", text: "Large" },
          { key: "round", text: "Round" },
        ],
      })
    );

    // Compact alignment - only for compact layout
    if (this.properties.layoutMode === "compact") {
      page1Fields.push(
        PropertyPaneDropdown("compactAlignment", {
          label: strings.CompactAlignmentFieldLabel,
          options: [
            { key: "left", text: "Left" },
            { key: "center", text: "Center" },
            { key: "right", text: "Right" },
          ],
        })
      );
    }

    // Page 2 - Links Management
    const linkManagementGroup: IPropertyPaneGroup = {
      groupName: strings.LinksGroupName,
      groupFields: this._buildLinkFields(),
    };

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
        // Page 1: Layout & Appearance
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.LayoutGroupName,
              groupFields: page1Fields,
            },
          ],
        },
        // Page 2: Links Management
        {
          header: { description: strings.LinksPageDescription },
          groups: page2Groups,
        },
        // Page 3: Features
        {
          header: { description: strings.AdvancedPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                PropertyPaneToggle("enableGrouping", {
                  label: strings.EnableGroupingLabel,
                }),
                PropertyPaneToggle("enableAudienceTargeting", {
                  label: strings.EnableAudienceTargetingLabel,
                }),
                PropertyPaneToggle("enableAnalytics", {
                  label: strings.EnableAnalyticsLabel,
                }),
                PropertyPaneToggle("enableColorCustomization", {
                  label: strings.EnableColorCustomizationLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
