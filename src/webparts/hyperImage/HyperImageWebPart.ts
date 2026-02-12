import * as React from "react";
import * as ReactDom from "react-dom";
import type { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import {
  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneButton,
  PropertyPaneButtonType,
} from "@microsoft/sp-property-pane";

import * as strings from "HyperImageWebPartStrings";
import { BaseHyperWebPart } from "../../common/BaseHyperWebPart";
import type { IHyperImageWebPartProps } from "./models";
import {
  ShapeMask,
  FilterPreset,
  HoverEffect,
  ShadowPreset,
  EntranceAnimation,
  ImageLayout,
  SHAPE_OPTIONS,
  FILTER_PRESET_OPTIONS,
  HOVER_EFFECT_OPTIONS,
  SHADOW_PRESET_OPTIONS,
  BORDER_STYLE_OPTIONS,
  ENTRANCE_ANIMATION_OPTIONS,
  IMAGE_LAYOUT_OPTIONS,
  TEXT_PLACEMENT_OPTIONS,
  TEXT_POSITION_OPTIONS,
  TEXT_ENTRANCE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  TEXT_ALIGN_OPTIONS,
  DEFAULT_TEXT_OVERLAY,
  DEFAULT_BORDER_CONFIG,
  DEFAULT_FILTER_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
} from "./models";
import HyperImage from "./components/HyperImage";
import type { IHyperImageComponentProps } from "./components/HyperImage";
import type { IEditorChanges } from "./components/editor";
import type { IPresetLayout } from "./models/IHyperImagePresetLayout";
import { createGroupHeaderField, createColorPickerField, createQuickActionsGroup } from "../../common/propertyPane";

export default class HyperImageWebPart extends BaseHyperWebPart<IHyperImageWebPartProps> {

  /** Parsed text overlay for property pane virtual fields */
  private _textOverlay = DEFAULT_TEXT_OVERLAY;
  /** Parsed border config for property pane virtual fields */
  private _borderConfig = DEFAULT_BORDER_CONFIG;

  protected async onInit(): Promise<void> {
    await super.onInit();

    var p = this.properties;

    // Wizard
    if (p.wizardCompleted === undefined) p.wizardCompleted = false;

    // Sample data — on by default so the web part renders immediately
    if (p.useSampleData === undefined) p.useSampleData = true;

    // Demo mode
    if (p.enableDemoMode === undefined) p.enableDemoMode = false;

    // Image source
    if (p.imageUrl === undefined) p.imageUrl = "";
    if (p.altText === undefined) p.altText = "";
    if (p.isDecorative === undefined) p.isDecorative = false;

    // Layout
    if (p.imageLayout === undefined) p.imageLayout = ImageLayout.Single;
    if (p.layoutConfigJson === undefined) p.layoutConfigJson = JSON.stringify(DEFAULT_LAYOUT_CONFIG);
    if (p.additionalImagesJson === undefined) p.additionalImagesJson = "[]";

    // Shape
    if (p.shape === undefined) p.shape = ShapeMask.Rectangle;
    if (p.customClipPath === undefined) p.customClipPath = "";

    // Filter
    if (p.filterPreset === undefined) p.filterPreset = FilterPreset.None;
    if (p.filterConfigJson === undefined) p.filterConfigJson = JSON.stringify(DEFAULT_FILTER_CONFIG);

    // Hover
    if (p.hoverEffect === undefined) p.hoverEffect = HoverEffect.None;

    // Flip back
    if (p.flipBackTitle === undefined) p.flipBackTitle = "";
    if (p.flipBackText === undefined) p.flipBackText = "";
    if (p.flipBackBgColor === undefined) p.flipBackBgColor = "#f3f2f1";

    // Text / Caption
    if (p.textOverlayJson === undefined) p.textOverlayJson = JSON.stringify(DEFAULT_TEXT_OVERLAY);

    // Border
    if (p.borderConfigJson === undefined) p.borderConfigJson = JSON.stringify(DEFAULT_BORDER_CONFIG);
    if (p.shadowPreset === undefined) p.shadowPreset = ShadowPreset.None;

    // Sizing
    if (p.aspectRatio === undefined) p.aspectRatio = "auto";
    if (p.objectFit === undefined) p.objectFit = "cover";
    if (p.maxWidth === undefined) p.maxWidth = 0;
    if (p.maxHeight === undefined) p.maxHeight = 0;

    // Action
    if (p.linkUrl === undefined) p.linkUrl = "";
    if (p.linkTarget === undefined) p.linkTarget = "_self";
    if (p.openLightbox === undefined) p.openLightbox = false;

    // Animation
    if (p.entranceAnimation === undefined) p.entranceAnimation = EntranceAnimation.None;

    // Performance
    if (p.lazyLoad === undefined) p.lazyLoad = true;
    if (p.progressiveLoad === undefined) p.progressiveLoad = false;

    // Debug / Advanced
    if (p.debugMode === undefined) p.debugMode = false;
    if (p.customCss === undefined) p.customCss = "";

    // Parse complex JSON props and sync virtual properties
    this._parseJsonProps();
    this._syncVirtualProps();
  }

  /** Parse JSON properties into working objects */
  private _parseJsonProps(): void {
    try { this._textOverlay = JSON.parse(this.properties.textOverlayJson); } catch { this._textOverlay = DEFAULT_TEXT_OVERLAY; }
    try { this._borderConfig = JSON.parse(this.properties.borderConfigJson); } catch { this._borderConfig = DEFAULT_BORDER_CONFIG; }
  }

  /** Push parsed JSON values into virtual (underscore-prefixed) properties for property pane binding */
  private _syncVirtualProps(): void {
    var p = this.properties as unknown as Record<string, unknown>;
    var t = this._textOverlay;
    p._textEnabled = t.enabled;
    p._textPlacement = t.placement;
    p._textTitle = t.title;
    p._textSubtitle = t.subtitle;
    p._textBody = t.bodyText;
    p._textPosition = t.position;
    p._textFontFamily = t.fontFamily;
    p._textTitleFontSize = t.titleFontSize;
    p._textSubtitleFontSize = t.subtitleFontSize;
    p._textBodyFontSize = t.bodyFontSize;
    p._textColor = t.color;
    p._textShadow = t.textShadow;
    p._textBgColor = t.bgColor;
    p._textBgOpacity = t.bgOpacity;
    p._textEntrance = t.entrance;
    p._textAlign = t.textAlign;
    var b = this._borderConfig;
    p._borderWidth = b.width;
    p._borderColor = b.color;
    p._borderStyle = b.style;
    p._borderRadius = b.radius;
    p._borderPadding = b.padding;
  }

  public render(): void {
    var props: IHyperImageComponentProps = {
      ...this.properties,
      instanceId: this.instanceId,
      wizardCompleted: this.properties.wizardCompleted,
      isEditMode: this.displayMode === 2,
      showWizardOnInit: true,
      onWizardApply: (result: Partial<IHyperImageWebPartProps>): void => {
        this.properties.wizardCompleted = true;
        Object.keys(result).forEach((key: string): void => {
          (this.properties as unknown as Record<string, unknown>)[key] = (result as Record<string, unknown>)[key];
        });
        this.render();
      },
      onImageSelect: (imageUrl: string): void => {
        this.properties.imageUrl = imageUrl;
        this.properties.useSampleData = false;
        this.render();
      },
      onLayoutSelect: (preset: IPresetLayout): void => {
        this.properties.imageLayout = preset.layout as ImageLayout;
        this.properties.layoutConfigJson = JSON.stringify({
          columns: preset.columns,
          rows: preset.rows,
          gap: preset.gap,
          equalHeight: true,
        });
        this.render();
      },
      onEditorApply: (changes: IEditorChanges): void => {
        this.properties.shape = changes.shape;
        this.properties.customClipPath = changes.customClipPath;
        this.properties.filterPreset = changes.filterPreset;
        this.properties.filterConfigJson = changes.filterConfigJson;
        this.properties.hoverEffect = changes.hoverEffect;
        this.properties.textOverlayJson = changes.textOverlayJson;
        this.properties.borderConfigJson = changes.borderConfigJson;
        this.properties.shadowPreset = changes.shadowPreset;
        this.properties.entranceAnimation = changes.entranceAnimation;
        this._parseJsonProps();
        this._syncVirtualProps();
        this.render();
      },
      onConfigure: (): void => { this.context.propertyPane.open(); },
    };
    var element: React.ReactElement<IHyperImageComponentProps> =
      React.createElement(HyperImage, props);

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  /** Virtual-to-JSON field maps */
  private static _TEXT_FIELD_MAP: Record<string, string> = {
    _textEnabled: "enabled",
    _textPlacement: "placement",
    _textTitle: "title",
    _textSubtitle: "subtitle",
    _textBody: "bodyText",
    _textPosition: "position",
    _textFontFamily: "fontFamily",
    _textTitleFontSize: "titleFontSize",
    _textSubtitleFontSize: "subtitleFontSize",
    _textBodyFontSize: "bodyFontSize",
    _textColor: "color",
    _textShadow: "textShadow",
    _textBgColor: "bgColor",
    _textBgOpacity: "bgOpacity",
    _textEntrance: "entrance",
    _textAlign: "textAlign",
  };

  private static _BORDER_FIELD_MAP: Record<string, string> = {
    _borderWidth: "width",
    _borderColor: "color",
    _borderStyle: "style",
    _borderRadius: "radius",
    _borderPadding: "padding",
  };

  protected onPropertyPaneFieldChanged(propertyPath: string, _oldValue: unknown, newValue: unknown): void {
    // ── Text overlay virtual fields → textOverlayJson ──
    var textField = HyperImageWebPart._TEXT_FIELD_MAP[propertyPath];
    if (textField) {
      (this._textOverlay as unknown as Record<string, unknown>)[textField] = newValue;
      this.properties.textOverlayJson = JSON.stringify(this._textOverlay);
      this._syncVirtualProps();
    }

    // ── Border virtual fields → borderConfigJson ──
    var borderField = HyperImageWebPart._BORDER_FIELD_MAP[propertyPath];
    if (borderField) {
      (this._borderConfig as unknown as Record<string, unknown>)[borderField] = newValue;
      this.properties.borderConfigJson = JSON.stringify(this._borderConfig);
      this._syncVirtualProps();
    }

    // Re-parse JSON props whenever the raw JSON fields change directly
    if (propertyPath === "textOverlayJson" || propertyPath === "borderConfigJson" || propertyPath === "filterConfigJson") {
      this._parseJsonProps();
      this._syncVirtualProps();
    }

    // When filter preset changes, update the filterConfigJson to match
    if (propertyPath === "filterPreset" && typeof newValue === "string") {
      var presets: Record<string, unknown> = {};
      try { presets = require("./models").FILTER_PRESETS; } catch { /* noop */ }
      var presetConfig = presets[newValue as string];
      if (presetConfig) {
        this.properties.filterConfigJson = JSON.stringify(presetConfig);
      }
    }

    super.onPropertyPaneFieldChanged(propertyPath, _oldValue, newValue);
    this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    var isMultiImage = this.properties.imageLayout !== ImageLayout.Single;
    var isOverlay = this._textOverlay.placement === "overlay";
    var isFlipHover = this.properties.hoverEffect === HoverEffect.Flip;

    return {
      pages: [
        // ── Page 1: Image Source & Shape ──
        {
          header: { description: "Configure image source and shape" },
          groups: [
            createQuickActionsGroup({
              onReopenWizard: this._handleReopenWizard.bind(this),
              onEditInEditor: this._handleEditInEditor.bind(this),
              onToggleDemoMode: this._handleToggleDemoMode.bind(this),
            }),
            {
              groupName: strings.ImageSourceGroupName,
              groupFields: [
                createGroupHeaderField("_imageSourceHeader", { icon: "\uD83D\uDCCB", title: "Image Source", subtitle: "Source & alt text", color: "green" }),
                PropertyPaneToggle("useSampleData", { label: strings.UseSampleDataLabel, onText: "On", offText: "Off" }),
                PropertyPaneTextField("imageUrl", {
                  label: strings.ImageUrlLabel,
                  disabled: this.properties.useSampleData,
                }),
                PropertyPaneButton("_browseImage", {
                  text: strings.BrowseButtonLabel,
                  buttonType: PropertyPaneButtonType.Normal,
                  onClick: this._onOpenImageBrowser.bind(this),
                }),
                PropertyPaneTextField("altText", {
                  label: strings.AltTextLabel,
                  disabled: this.properties.isDecorative,
                }),
                PropertyPaneToggle("isDecorative", { label: strings.IsDecorativeLabel, onText: "Yes", offText: "No" }),
              ],
            },
            {
              groupName: strings.LayoutGroupName,
              groupFields: [
                createGroupHeaderField("_layoutHeader", { icon: "\uD83C\uDFA8", title: "Layout", subtitle: "Multi-image layout", color: "blue" }),
                PropertyPaneDropdown("imageLayout", { label: strings.ImageLayoutLabel, options: IMAGE_LAYOUT_OPTIONS }),
                PropertyPaneButton("_openLayoutGallery", {
                  text: strings.BrowseLayoutGalleryLabel,
                  buttonType: PropertyPaneButtonType.Normal,
                  onClick: this._onOpenLayoutGallery.bind(this),
                }),
                PropertyPaneSlider("_layoutColumns", {
                  label: strings.LayoutColumnsLabel,
                  min: 1, max: 6, step: 1,
                  disabled: !isMultiImage,
                }),
                PropertyPaneSlider("_layoutRows", {
                  label: strings.LayoutRowsLabel,
                  min: 1, max: 4, step: 1,
                  disabled: this.properties.imageLayout !== ImageLayout.Grid,
                }),
                PropertyPaneSlider("_layoutGap", {
                  label: strings.LayoutGapLabel,
                  min: 0, max: 40, step: 2,
                  disabled: !isMultiImage,
                }),
              ],
            },
            {
              groupName: strings.ShapeGroupName,
              groupFields: [
                createGroupHeaderField("_shapeHeader", { icon: "\uD83C\uDFA8", title: "Shape", subtitle: "Mask & clipping", color: "blue" }),
                PropertyPaneDropdown("shape", { label: strings.ShapeLabel, options: SHAPE_OPTIONS }),
                PropertyPaneTextField("customClipPath", {
                  label: strings.CustomClipPathLabel,
                  description: "e.g. polygon(50% 0%, 0% 100%, 100% 100%)",
                  disabled: this.properties.shape !== ShapeMask.Custom,
                  multiline: true,
                  rows: 2,
                }),
              ],
            },
          ],
        },
        // ── Page 2: Effects & Text ──
        {
          header: { description: "Configure effects and text" },
          groups: [
            {
              groupName: strings.EffectsGroupName,
              groupFields: [
                createGroupHeaderField("_effectsHeader", { icon: "\uD83C\uDFAF", title: "Effects", subtitle: "Filters & hover", color: "red" }),
                PropertyPaneDropdown("filterPreset", { label: strings.FilterPresetLabel, options: FILTER_PRESET_OPTIONS }),
                PropertyPaneDropdown("hoverEffect", { label: strings.HoverEffectLabel, options: HOVER_EFFECT_OPTIONS }),
                PropertyPaneTextField("flipBackTitle", {
                  label: strings.FlipBackTitleLabel,
                  disabled: !isFlipHover,
                }),
                PropertyPaneTextField("flipBackText", {
                  label: strings.FlipBackTextLabel,
                  multiline: true,
                  rows: 3,
                  disabled: !isFlipHover,
                }),
                createColorPickerField("flipBackBgColor", {
                  label: strings.FlipBackBgColorLabel,
                  value: this.properties.flipBackBgColor || "#f3f2f1",
                  onChange: this._makeColorHandler("flipBackBgColor").bind(this),
                  disabled: !isFlipHover,
                }),
                PropertyPaneDropdown("entranceAnimation", { label: strings.EntranceAnimationLabel, options: ENTRANCE_ANIMATION_OPTIONS }),
              ],
            },
            {
              groupName: strings.TextGroupName,
              groupFields: [
                createGroupHeaderField("_textHeader", { icon: "\uD83D\uDCCB", title: "Text", subtitle: "Overlay & caption", color: "green" }),
                PropertyPaneToggle("_textEnabled", {
                  label: strings.TextEnabledLabel, onText: "On", offText: "Off",
                }),
                PropertyPaneDropdown("_textPlacement", {
                  label: strings.TextPlacementLabel,
                  options: TEXT_PLACEMENT_OPTIONS,
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneTextField("_textTitle", {
                  label: strings.TextTitleLabel,
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneTextField("_textSubtitle", {
                  label: strings.TextSubtitleLabel,
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneTextField("_textBody", {
                  label: strings.TextBodyLabel,
                  multiline: true,
                  rows: 3,
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneDropdown("_textPosition", {
                  label: strings.TextPositionLabel,
                  options: TEXT_POSITION_OPTIONS,
                  disabled: !this._textOverlay.enabled || !isOverlay,
                }),
                PropertyPaneDropdown("_textFontFamily", {
                  label: strings.TextFontFamilyLabel,
                  options: FONT_FAMILY_OPTIONS,
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneSlider("_textTitleFontSize", {
                  label: strings.TextTitleFontSizeLabel,
                  min: 12, max: 72, step: 1,
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneSlider("_textSubtitleFontSize", {
                  label: strings.TextSubtitleFontSizeLabel,
                  min: 10, max: 48, step: 1,
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneSlider("_textBodyFontSize", {
                  label: strings.TextBodyFontSizeLabel,
                  min: 10, max: 36, step: 1,
                  disabled: !this._textOverlay.enabled,
                }),
                createColorPickerField("_textColor", {
                  label: strings.TextColorLabel,
                  value: this._textOverlay.color || "#333333",
                  onChange: this._makeVirtualColorHandler("_textColor").bind(this),
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneToggle("_textShadow", {
                  label: strings.TextShadowLabel, onText: "On", offText: "Off",
                  disabled: !this._textOverlay.enabled,
                }),
                createColorPickerField("_textBgColor", {
                  label: strings.TextBgColorLabel,
                  value: this._textOverlay.bgColor || "#ffffff",
                  onChange: this._makeVirtualColorHandler("_textBgColor").bind(this),
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneSlider("_textBgOpacity", {
                  label: strings.TextBgOpacityLabel,
                  min: 0, max: 100, step: 5,
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneDropdown("_textEntrance", {
                  label: strings.TextEntranceLabel,
                  options: TEXT_ENTRANCE_OPTIONS,
                  disabled: !this._textOverlay.enabled,
                }),
                PropertyPaneDropdown("_textAlign", {
                  label: strings.TextAlignLabel,
                  options: TEXT_ALIGN_OPTIONS,
                  disabled: !this._textOverlay.enabled,
                }),
              ],
            },
          ],
        },
        // ── Page 3: Styling & Advanced ──
        {
          header: { description: "Configure border, sizing, and actions" },
          groups: [
            {
              groupName: strings.StylingGroupName,
              groupFields: [
                createGroupHeaderField("_stylingHeader", { icon: "\uD83C\uDFAF", title: "Styling", subtitle: "Border & shadow", color: "red" }),
                PropertyPaneSlider("_borderWidth", {
                  label: strings.BorderWidthLabel, min: 0, max: 10, step: 1,
                }),
                createColorPickerField("_borderColor", {
                  label: strings.BorderColorLabel,
                  value: this._borderConfig.color || "#e1e1e1",
                  onChange: this._makeVirtualColorHandler("_borderColor").bind(this),
                }),
                PropertyPaneDropdown("_borderStyle", {
                  label: strings.BorderStyleLabel, options: BORDER_STYLE_OPTIONS,
                }),
                PropertyPaneSlider("_borderRadius", {
                  label: strings.BorderRadiusLabel, min: 0, max: 50, step: 1,
                }),
                PropertyPaneSlider("_borderPadding", {
                  label: strings.BorderPaddingLabel, min: 0, max: 40, step: 2,
                }),
                PropertyPaneDropdown("shadowPreset", {
                  label: strings.ShadowPresetLabel, options: SHADOW_PRESET_OPTIONS,
                }),
              ],
            },
            {
              groupName: "Sizing",
              groupFields: [
                createGroupHeaderField("_sizingHeader", { icon: "\uD83C\uDFA8", title: "Sizing", subtitle: "Dimensions & fit", color: "blue" }),
                PropertyPaneDropdown("aspectRatio", {
                  label: strings.AspectRatioLabel,
                  options: [
                    { key: "auto", text: "Auto (Original)" },
                    { key: "1/1", text: "1:1 (Square)" },
                    { key: "4/3", text: "4:3" },
                    { key: "3/2", text: "3:2" },
                    { key: "16/9", text: "16:9 (Widescreen)" },
                    { key: "21/9", text: "21:9 (Ultra-wide)" },
                    { key: "3/4", text: "3:4 (Portrait)" },
                    { key: "2/3", text: "2:3 (Tall Portrait)" },
                  ],
                }),
                PropertyPaneDropdown("objectFit", {
                  label: strings.ObjectFitLabel,
                  options: [
                    { key: "cover", text: "Cover" },
                    { key: "contain", text: "Contain" },
                    { key: "fill", text: "Fill (Stretch)" },
                    { key: "none", text: "None (Natural)" },
                    { key: "scale-down", text: "Scale Down" },
                  ],
                }),
                PropertyPaneSlider("maxWidth", {
                  label: strings.MaxWidthLabel, min: 0, max: 1920, step: 10,
                  // 0 means no limit
                }),
                PropertyPaneSlider("maxHeight", {
                  label: strings.MaxHeightLabel, min: 0, max: 1080, step: 10,
                }),
              ],
            },
            {
              groupName: strings.ActionGroupName,
              groupFields: [
                createGroupHeaderField("_actionHeader", { icon: "\uD83D\uDD17", title: "Action", subtitle: "Link & lightbox", color: "orange" }),
                PropertyPaneTextField("linkUrl", {
                  label: strings.LinkUrlLabel,
                  description: this.properties.linkUrl ? "Link active" : "No link set",
                }),
                PropertyPaneDropdown("linkTarget", {
                  label: strings.LinkTargetLabel,
                  options: [
                    { key: "_self", text: "Same Window" },
                    { key: "_blank", text: "New Window" },
                  ],
                  disabled: !this.properties.linkUrl,
                }),
                PropertyPaneToggle("openLightbox", {
                  label: strings.OpenLightboxLabel, onText: "On", offText: "Off",
                  disabled: !!this.properties.linkUrl,
                }),
              ],
            },
            {
              groupName: strings.PerformanceGroupName,
              isCollapsed: true,
              groupFields: [
                createGroupHeaderField("_performanceHeader", { icon: "\u26A1", title: "Performance", subtitle: "Loading options", color: "orange" }),
                PropertyPaneToggle("lazyLoad", {
                  label: strings.LazyLoadLabel, onText: "On", offText: "Off",
                }),
                PropertyPaneToggle("progressiveLoad", {
                  label: "Progressive Loading",
                  onText: "On",
                  offText: "Off",
                }),
              ],
            },
            {
              groupName: strings.AdvancedGroupName,
              isCollapsed: true,
              groupFields: [
                createGroupHeaderField("_advancedHeader", { icon: "\u2699\uFE0F", title: "Advanced", subtitle: "Debug & editor", color: "orange" }),
                PropertyPaneToggle("debugMode", {
                  label: strings.DebugModeLabel, onText: "On", offText: "Off",
                }),
                PropertyPaneTextField("customCss", {
                  label: "Custom CSS",
                  multiline: true,
                  rows: 4,
                  description: "Additional CSS rules applied to the image container",
                }),
                PropertyPaneButton("_openEditor", {
                  text: strings.OpenVisualEditorLabel,
                  buttonType: PropertyPaneButtonType.Normal,
                  onClick: this._onOpenVisualEditor.bind(this),
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  /** Open the SharePoint image browser modal */
  private _onOpenImageBrowser(): void {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    var store = require("./store/useHyperImageStore");
    if (store && store.useHyperImageStore) {
      store.useHyperImageStore.getState().openBrowser();
    }
  }

  /** Open the layout gallery modal */
  private _onOpenLayoutGallery(): void {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    var store = require("./store/useHyperImageStore");
    if (store && store.useHyperImageStore) {
      store.useHyperImageStore.getState().openLayoutGallery();
    }
  }

  /** Open the visual editor modal */
  private _onOpenVisualEditor(): void {
    // The editor is controlled via the Zustand store — we dispatch openEditor
    // which is picked up by the React component tree.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    var store = require("./store/useHyperImageStore");
    if (store && store.useHyperImageStore) {
      store.useHyperImageStore.getState().openEditor();
    }
  }

  /** Factory: returns a change handler for a direct (non-virtual) color property */
  private _makeColorHandler(propertyPath: string): (newColor: string) => void {
    var self = this;
    return function (newColor: string): void {
      (self.properties as unknown as Record<string, unknown>)[propertyPath] = newColor;
      self.render();
    };
  }

  /** Factory: returns a change handler for a virtual (_prefix) color property that writes to JSON */
  private _makeVirtualColorHandler(virtualPath: string): (newColor: string) => void {
    var self = this;
    return function (newColor: string): void {
      self.onPropertyPaneFieldChanged(virtualPath, "", newColor);
    };
  }
}
