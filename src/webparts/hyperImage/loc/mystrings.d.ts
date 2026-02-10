declare interface IHyperImageWebPartStrings {
  /* ── Group Names ── */
  ImageSourceGroupName: string;
  LayoutGroupName: string;
  ShapeGroupName: string;
  EffectsGroupName: string;
  TextGroupName: string;
  StylingGroupName: string;
  ActionGroupName: string;
  PerformanceGroupName: string;
  AdvancedGroupName: string;

  /* ── Demo Mode ── */
  DemoModeGroupName: string;
  DemoModeLabel: string;
  DemoModeDescription: string;

  /* ── Image Source ── */
  UseSampleDataLabel: string;
  ImageUrlLabel: string;
  BrowseButtonLabel: string;
  AltTextLabel: string;
  IsDecorativeLabel: string;

  /* ── Layout ── */
  ImageLayoutLabel: string;
  LayoutColumnsLabel: string;
  LayoutRowsLabel: string;
  LayoutGapLabel: string;
  LayoutEqualHeightLabel: string;
  ManageImagesLabel: string;

  /* ── Shape ── */
  ShapeLabel: string;
  CustomClipPathLabel: string;

  /* ── Filter ── */
  FilterPresetLabel: string;

  /* ── Hover ── */
  HoverEffectLabel: string;

  /* ── Text / Caption ── */
  TextEnabledLabel: string;
  TextPlacementLabel: string;
  TextTitleLabel: string;
  TextSubtitleLabel: string;
  TextBodyLabel: string;
  TextPositionLabel: string;
  TextFontFamilyLabel: string;
  TextTitleFontSizeLabel: string;
  TextSubtitleFontSizeLabel: string;
  TextBodyFontSizeLabel: string;
  TextFontWeightLabel: string;
  TextColorLabel: string;
  TextShadowLabel: string;
  TextBgColorLabel: string;
  TextBgOpacityLabel: string;
  TextEntranceLabel: string;

  /* ── Border & Shadow ── */
  BorderWidthLabel: string;
  BorderColorLabel: string;
  BorderStyleLabel: string;
  BorderRadiusLabel: string;
  BorderPaddingLabel: string;
  ShadowPresetLabel: string;

  /* ── Sizing ── */
  AspectRatioLabel: string;
  ObjectFitLabel: string;
  MaxWidthLabel: string;
  MaxHeightLabel: string;

  /* ── Action ── */
  LinkUrlLabel: string;
  LinkTargetLabel: string;
  OpenLightboxLabel: string;

  /* ── Animation ── */
  EntranceAnimationLabel: string;

  /* ── Performance ── */
  LazyLoadLabel: string;

  /* ── Advanced ── */
  DebugModeLabel: string;
  OpenVisualEditorLabel: string;
}

declare module "HyperImageWebPartStrings" {
  const strings: IHyperImageWebPartStrings;
  export = strings;
}
