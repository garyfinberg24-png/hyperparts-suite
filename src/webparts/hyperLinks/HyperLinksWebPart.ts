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
} from "@microsoft/sp-property-pane";

import * as strings from "HyperLinksWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import { createGroupHeaderField, createAccordionField, createColorPickerField, createQuickActionsGroup } from "../../common/propertyPane";
import type { IAccordionItem, IAccordionField } from "../../common/propertyPane";
import HyperLinks from "./components/HyperLinks";
import type { IHyperLinksComponentProps } from "./components/HyperLinks";
import type { IHyperLinksWebPartProps, IHyperLink } from "./models";
import { SAMPLE_LINKS, STYLE_PRESETS } from "./models";
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

  private _onWizardApply = (result: Partial<IHyperLinksWebPartProps>): void => {
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
    const props: IHyperLinksComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      isEditMode: this.displayMode === DisplayMode.Edit,
      onConfigure: (): void => { this.context.propertyPane.open(); },
      onWizardApply: this._onWizardApply,
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
    if (this.properties.wizardCompleted === undefined) {
      this.properties.wizardCompleted = false;
    }
    if (this.properties.enableSearch === undefined) {
      this.properties.enableSearch = false;
    }
    if (this.properties.enableHealthCheck === undefined) {
      this.properties.enableHealthCheck = false;
    }
    if (this.properties.enablePopularBadges === undefined) {
      this.properties.enablePopularBadges = false;
    }
    if (this.properties.backgroundMode === undefined) {
      this.properties.backgroundMode = "none";
    }
    if (this.properties.backgroundColor === undefined) {
      this.properties.backgroundColor = "";
    }
    if (this.properties.backgroundGradient === undefined) {
      this.properties.backgroundGradient = "";
    }
    if (this.properties.backgroundImageUrl === undefined) {
      this.properties.backgroundImageUrl = "";
    }
    if (this.properties.backgroundImageDarken === undefined) {
      this.properties.backgroundImageDarken = false;
    }
    if (this.properties.textColor === undefined) {
      this.properties.textColor = "";
    }
    if (this.properties.iconColor === undefined) {
      this.properties.iconColor = "";
    }
    if (this.properties.activePresetId === undefined) {
      this.properties.activePresetId = "";
    }
    if (this.properties.textPosition === undefined) {
      this.properties.textPosition = "right";
    }
    if (this.properties.buttonShape === undefined) {
      this.properties.buttonShape = "default";
    }
    if (this.properties.linkDataSource === undefined) {
      this.properties.linkDataSource = "inline";
    }
    if (this.properties.linkPresetId === undefined) {
      this.properties.linkPresetId = "";
    }
    if (this.properties.linkListUrl === undefined) {
      this.properties.linkListUrl = "";
    }
    if (this.properties.linkListTitleColumn === undefined) {
      this.properties.linkListTitleColumn = "Title";
    }
    if (this.properties.linkListUrlColumn === undefined) {
      this.properties.linkListUrlColumn = "URL";
    }
    if (this.properties.useSampleData === undefined) {
      this.properties.useSampleData = false;
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

  /** Update links JSON and refresh */
  private _updateLinks(links: IHyperLink[]): void {
    this.properties.links = stringifyLinks(links);
    this.render();
    this.context.propertyPane.refresh();
  }

  /** Build accordion items from the current links for the property pane accordion */
  private _buildAccordionItems(): IAccordionItem[] {
    const links = parseLinks(this.properties.links);
    const self = this;
    const items: IAccordionItem[] = [];

    links.forEach(function (link: IHyperLink) {
      const fields: IAccordionField[] = [];

      // Title
      fields.push({
        key: "title",
        label: strings.LinkTitleLabel,
        value: link.title,
        type: "text",
        onChange: function (newValue: string): void {
          const currentLinks = parseLinks(self.properties.links);
          const idx = self._findLinkIndex(currentLinks, link.id);
          if (idx !== -1) {
            currentLinks[idx].title = newValue;
            self._updateLinks(currentLinks);
          }
        },
      });

      // URL
      fields.push({
        key: "url",
        label: strings.LinkUrlLabel,
        value: link.url,
        type: "url",
        onChange: function (newValue: string): void {
          const currentLinks = parseLinks(self.properties.links);
          const idx = self._findLinkIndex(currentLinks, link.id);
          if (idx !== -1) {
            currentLinks[idx].url = newValue;
            self._updateLinks(currentLinks);
          }
        },
      });

      // Description
      fields.push({
        key: "description",
        label: strings.LinkDescriptionLabel,
        value: link.description || "",
        type: "text",
        onChange: function (newValue: string): void {
          const currentLinks = parseLinks(self.properties.links);
          const idx = self._findLinkIndex(currentLinks, link.id);
          if (idx !== -1) {
            currentLinks[idx].description = newValue || undefined;
            self._updateLinks(currentLinks);
          }
        },
      });

      // Icon type dropdown
      fields.push({
        key: "iconType",
        label: strings.LinkIconTypeLabel,
        value: link.icon ? link.icon.type : "fluent",
        type: "dropdown",
        options: [
          { key: "fluent", text: "Fluent UI Icon" },
          { key: "emoji", text: "Emoji" },
          { key: "custom", text: "Custom Image URL" },
        ],
        onChange: function (newValue: string): void {
          const currentLinks = parseLinks(self.properties.links);
          const idx = self._findLinkIndex(currentLinks, link.id);
          if (idx !== -1) {
            const iconType = newValue as "fluent" | "emoji" | "custom";
            const existing = currentLinks[idx].icon;
            if (existing) {
              currentLinks[idx].icon = { type: iconType, value: existing.value, color: existing.color };
            } else {
              currentLinks[idx].icon = { type: iconType, value: "" };
            }
            self._updateLinks(currentLinks);
          }
        },
      });

      // Icon name/value
      fields.push({
        key: "iconName",
        label: strings.LinkIconNameLabel,
        value: link.icon ? link.icon.value : "",
        type: "text",
        onChange: function (newValue: string): void {
          const currentLinks = parseLinks(self.properties.links);
          const idx = self._findLinkIndex(currentLinks, link.id);
          if (idx !== -1) {
            if (newValue) {
              const existing = currentLinks[idx].icon;
              const existingType = existing ? existing.type : "fluent";
              currentLinks[idx].icon = { type: existingType, value: newValue };
            } else {
              currentLinks[idx].icon = undefined;
            }
            self._updateLinks(currentLinks);
          }
        },
      });

      // Thumbnail URL (conditional)
      if (self.properties.showThumbnails) {
        fields.push({
          key: "thumbnailUrl",
          label: strings.LinkThumbnailUrlLabel,
          value: link.thumbnailUrl || "",
          type: "text",
          onChange: function (newValue: string): void {
            const currentLinks = parseLinks(self.properties.links);
            const idx = self._findLinkIndex(currentLinks, link.id);
            if (idx !== -1) {
              currentLinks[idx].thumbnailUrl = newValue || undefined;
              self._updateLinks(currentLinks);
            }
          },
        });
      }

      // Background color (conditional)
      if (self.properties.enableColorCustomization) {
        fields.push({
          key: "backgroundColor",
          label: strings.LinkBackgroundColorLabel,
          value: link.backgroundColor || "",
          type: "color",
          onChange: function (newValue: string): void {
            const currentLinks = parseLinks(self.properties.links);
            const idx = self._findLinkIndex(currentLinks, link.id);
            if (idx !== -1) {
              currentLinks[idx].backgroundColor = newValue || undefined;
              self._updateLinks(currentLinks);
            }
          },
        });
      }

      // Open in new tab
      fields.push({
        key: "openInNewTab",
        label: strings.LinkOpenInNewTabLabel,
        value: link.openInNewTab ? "true" : "false",
        type: "toggle",
        onChange: function (newValue: string): void {
          const currentLinks = parseLinks(self.properties.links);
          const idx = self._findLinkIndex(currentLinks, link.id);
          if (idx !== -1) {
            currentLinks[idx].openInNewTab = newValue === "true";
            self._updateLinks(currentLinks);
          }
        },
      });

      // Group name (conditional)
      if (self.properties.enableGrouping) {
        fields.push({
          key: "groupName",
          label: strings.LinkGroupNameLabel,
          value: link.groupName || "",
          type: "text",
          onChange: function (newValue: string): void {
            const currentLinks = parseLinks(self.properties.links);
            const idx = self._findLinkIndex(currentLinks, link.id);
            if (idx !== -1) {
              currentLinks[idx].groupName = newValue || undefined;
              self._updateLinks(currentLinks);
            }
          },
        });
      }

      // Truncate URL for meta display
      const metaUrl = link.url.length > 30
        ? link.url.substring(0, 30) + "..."
        : link.url;

      items.push({
        id: link.id,
        title: link.title,
        meta: metaUrl,
        fields: fields,
      });
    });

    return items;
  }

  /** Find the index of a link by ID, returns -1 if not found */
  private _findLinkIndex(links: IHyperLink[], linkId: string): number {
    for (let i = 0; i < links.length; i++) {
      if (links[i].id === linkId) {
        return i;
      }
    }
    return -1;
  }

  /** Handle accordion reorder */
  private _handleLinkReorder(fromIndex: number, toIndex: number): void {
    const currentLinks = parseLinks(this.properties.links);
    const reordered = reorderLink(currentLinks, fromIndex, toIndex);
    this._updateLinks(reordered);
  }

  /** Handle accordion delete */
  private _handleLinkDelete(id: string): void {
    const currentLinks = parseLinks(this.properties.links);
    const updated = removeLink(currentLinks, id);
    this._updateLinks(updated);
  }

  /** Handle accordion add */
  private _handleLinkAdd(): void {
    const currentLinks = parseLinks(this.properties.links);
    const newLink = createLink(
      strings.NewLinkDefaultTitle + " " + (currentLinks.length + 1),
      currentLinks.length
    );
    currentLinks.push(newLink);
    this._updateLinks(currentLinks);
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
    // Style preset selection — apply all preset values at once
    if (propertyPath === "activePresetId" && newValue) {
      var presetId = String(newValue);
      var matchedPreset: typeof STYLE_PRESETS[0] | undefined;
      for (var pi = 0; pi < STYLE_PRESETS.length; pi++) {
        if (STYLE_PRESETS[pi].id === presetId) {
          matchedPreset = STYLE_PRESETS[pi];
          break;
        }
      }
      if (matchedPreset) {
        this.properties.backgroundMode = matchedPreset.backgroundMode;
        this.properties.backgroundColor = matchedPreset.backgroundColor;
        this.properties.backgroundGradient = matchedPreset.backgroundGradient;
        this.properties.textColor = matchedPreset.textColor;
        this.properties.iconColor = matchedPreset.iconColor;
        this.properties.hoverEffect = matchedPreset.hoverEffect;
        this.properties.borderRadius = matchedPreset.borderRadius;
        this.properties.buttonShape = matchedPreset.buttonShape;
        this.render();
        this.context.propertyPane.refresh();
      }
      return;
    }

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
      createGroupHeaderField("_layoutHeader", { icon: "\uD83C\uDFA8", title: "Layout", subtitle: "Display & appearance", color: "blue" }),
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
          { key: "pulse", text: "Pulse" },
          { key: "bounce", text: "Bounce" },
          { key: "shake", text: "Shake" },
          { key: "rotate", text: "Rotate" },
          { key: "shimmer", text: "Shimmer" },
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
      }),
      PropertyPaneDropdown("textPosition", {
        label: "Text Position",
        options: [
          { key: "right", text: "Right of Icon" },
          { key: "below", text: "Below Icon" },
          { key: "above", text: "Above Icon" },
          { key: "left", text: "Left of Icon" },
          { key: "hidden", text: "Hidden (Icon Only)" },
        ],
      }),
      PropertyPaneDropdown("buttonShape", {
        label: "Button Shape",
        options: [
          { key: "default", text: "Default" },
          { key: "square", text: "Square" },
          { key: "rounded", text: "Rounded" },
          { key: "pill", text: "Pill" },
          { key: "circle", text: "Circle" },
        ],
      }),
      PropertyPaneDropdown("activePresetId", {
        label: "Style Preset",
        options: [
          { key: "", text: "(Custom)" },
          { key: "midnight-blue", text: "Midnight Blue" },
          { key: "sunset-glow", text: "Sunset Glow" },
          { key: "ocean-breeze", text: "Ocean Breeze" },
          { key: "corporate-navy", text: "Corporate Navy" },
          { key: "fresh-mint", text: "Fresh Mint" },
          { key: "warm-earth", text: "Warm Earth" },
          { key: "glass-frost", text: "Glass Frost" },
          { key: "neon-dark", text: "Neon Dark" },
          { key: "rose-gold", text: "Rose Gold" },
          { key: "arctic-white", text: "Arctic White" },
          { key: "aurora-borealis", text: "Aurora Borealis" },
          { key: "sunshine-pop", text: "Sunshine Pop" },
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

    // Background mode
    page1Fields.push(
      PropertyPaneHorizontalRule(),
      PropertyPaneDropdown("backgroundMode", {
        label: strings.BackgroundModeFieldLabel,
        options: [
          { key: "none", text: "None" },
          { key: "color", text: "Solid Color" },
          { key: "gradient", text: "Gradient" },
          { key: "image", text: "Image" },
        ],
      })
    );

    // Conditional background fields
    if (this.properties.backgroundMode === "color") {
      var selfBg = this;
      page1Fields.push(
        createColorPickerField("_backgroundColor", {
          label: strings.BackgroundColorFieldLabel,
          value: this.properties.backgroundColor || "#ffffff",
          onChange: function (newColor: string): void {
            selfBg.properties.backgroundColor = newColor;
            selfBg.render();
          },
        })
      );
    }
    if (this.properties.backgroundMode === "gradient") {
      page1Fields.push(
        PropertyPaneTextField("backgroundGradient", {
          label: strings.BackgroundGradientFieldLabel,
          description: "CSS gradient (e.g. linear-gradient(135deg, #667eea, #764ba2))",
        })
      );
    }
    if (this.properties.backgroundMode === "image") {
      page1Fields.push(
        PropertyPaneTextField("backgroundImageUrl", {
          label: strings.BackgroundImageUrlFieldLabel,
          description: "URL to a background image",
        }),
        PropertyPaneToggle("backgroundImageDarken", {
          label: strings.BackgroundImageDarkenLabel,
        })
      );
    }

    // Text / icon color overrides (when background is active)
    if (this.properties.backgroundMode !== "none") {
      var selfColors = this;
      page1Fields.push(
        createColorPickerField("_textColor", {
          label: strings.TextColorFieldLabel,
          value: this.properties.textColor || "#323130",
          onChange: function (newColor: string): void {
            selfColors.properties.textColor = newColor;
            selfColors.render();
          },
        }),
        createColorPickerField("_iconColor", {
          label: strings.IconColorFieldLabel,
          value: this.properties.iconColor || "#323130",
          onChange: function (newColor: string): void {
            selfColors.properties.iconColor = newColor;
            selfColors.render();
          },
        })
      );
    }

    // Page 2 - Links Management
    const linkManagementGroup: IPropertyPaneGroup = {
      groupName: strings.LinksGroupName,
      groupFields: ([
        createGroupHeaderField("_linksHeader", { icon: "\uD83D\uDD17", title: "Links", subtitle: "Manage items", color: "green" }),
        createAccordionField("_linkItems", {
          items: this._buildAccordionItems(),
          onReorder: this._handleLinkReorder.bind(this),
          onDelete: this._handleLinkDelete.bind(this),
          onAdd: this._handleLinkAdd.bind(this),
          addLabel: "Add Link",
        }),
      ] as IPropertyPaneField<never>[]),
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
            createQuickActionsGroup({
              onReopenWizard: this._handleReopenWizard.bind(this),
              onEditInEditor: this._handleEditInEditor.bind(this),
              onToggleDemoMode: this._handleToggleDemoMode.bind(this),
            }),
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
        // Page 3: Features & Demo
        {
          header: { description: strings.AdvancedPageDescription },
          groups: [
            {
              groupName: strings.FeaturesGroupName,
              groupFields: [
                createGroupHeaderField("_featuresHeader", { icon: "\u2699\uFE0F", title: "Features", subtitle: "Advanced options", color: "orange" }),
                PropertyPaneToggle("enableGrouping", {
                  label: strings.EnableGroupingLabel,
                }),
                PropertyPaneToggle("enableAudienceTargeting", {
                  label: strings.EnableAudienceTargetingLabel,
                }),
                PropertyPaneToggle("enableSearch", {
                  label: strings.EnableSearchLabel,
                }),
                PropertyPaneToggle("enableAnalytics", {
                  label: strings.EnableAnalyticsLabel,
                }),
                PropertyPaneToggle("enableColorCustomization", {
                  label: strings.EnableColorCustomizationLabel,
                }),
                PropertyPaneToggle("enableHealthCheck", {
                  label: strings.EnableHealthCheckLabel,
                }),
                PropertyPaneToggle("enablePopularBadges", {
                  label: strings.EnablePopularBadgesLabel,
                }),
              ],
            },
            {
              groupName: strings.DataDemoGroupName,
              groupFields: [
                createGroupHeaderField("_dataHeader", { icon: "\uD83D\uDCCB", title: "Data Source", subtitle: "Content & presets", color: "green" }),
                PropertyPaneToggle("useSampleData", {
                  label: strings.UseSampleDataLabel,
                }),
                PropertyPaneDropdown("linkDataSource", {
                  label: strings.LinkDataSourceLabel,
                  options: [
                    { key: "inline", text: "Manual (Property Pane)" },
                    { key: "preset", text: "Preset Collection" },
                    { key: "list", text: "SharePoint List" },
                  ],
                }),
                PropertyPaneDropdown("linkPresetId", {
                  label: strings.LinkPresetIdLabel,
                  options: [
                    { key: "", text: "(None)" },
                    { key: "m365-apps", text: "Microsoft 365 Apps" },
                    { key: "departments", text: "Departments" },
                    { key: "intranet-nav", text: "Intranet Navigation" },
                    { key: "social-media", text: "Social Media" },
                    { key: "hr-resources", text: "HR & People" },
                    { key: "project-tools", text: "Project & Dev Tools" },
                    { key: "quick-start", text: "Quick Start" },
                  ],
                }),
                PropertyPaneTextField("linkListUrl", {
                  label: strings.LinkListUrlLabel,
                  description: "SharePoint list name or URL",
                }),
                PropertyPaneTextField("linkListTitleColumn", {
                  label: strings.LinkListTitleColumnLabel,
                }),
                PropertyPaneTextField("linkListUrlColumn", {
                  label: strings.LinkListUrlColumnLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
