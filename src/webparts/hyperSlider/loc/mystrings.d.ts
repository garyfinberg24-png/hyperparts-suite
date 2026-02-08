declare interface IHyperSliderWebPartStrings {
  // Property pane
  PropertyPaneDescription: string;

  // Page 1: General
  GeneralGroupName: string;
  TitleFieldLabel: string;
  ModeFieldLabel: string;
  HeightModeFieldLabel: string;
  FixedHeightFieldLabel: string;
  AspectRatioFieldLabel: string;
  CustomRatioWidthLabel: string;
  CustomRatioHeightLabel: string;
  FullBleedFieldLabel: string;
  BorderRadiusFieldLabel: string;
  ReducedMotionFieldLabel: string;

  // Page 2: Transitions & Autoplay
  TransitionsGroupName: string;
  TransitionTypeFieldLabel: string;
  TransitionDurationFieldLabel: string;
  TransitionEasingFieldLabel: string;
  AutoplayGroupName: string;
  AutoplayEnabledLabel: string;
  AutoplayIntervalLabel: string;
  AutoplayPauseOnHoverLabel: string;
  AutoplayPauseOnInteractionLabel: string;
  AutoplayDirectionLabel: string;
  AutoplayLoopLabel: string;

  // Page 3: Navigation
  NavigationGroupName: string;
  ArrowsEnabledLabel: string;
  ArrowsStyleLabel: string;
  BulletsEnabledLabel: string;
  BulletsStyleLabel: string;
  BulletsPositionLabel: string;
  ThumbnailsEnabledLabel: string;
  ThumbnailsPositionLabel: string;
  ThumbnailsWidthLabel: string;
  ThumbnailsHeightLabel: string;
  ProgressEnabledLabel: string;
  SlideCountEnabledLabel: string;
  KeyboardLabel: string;
  SwipeEnabledLabel: string;
  SwipeThresholdLabel: string;

  // Page 4: Content & Effects
  ContentGroupName: string;
  ContentBindingEnabledLabel: string;
  ListNameLabel: string;
  MaxItemsLabel: string;
  SlidesJsonLabel: string;
  EffectsGroupName: string;
  ParticleEnabledLabel: string;
  ParticleCountLabel: string;
  ParticleShapeLabel: string;
  TypewriterEnabledLabel: string;
  SnowEnabledLabel: string;
  PerformanceGroupName: string;
  LazyLoadLabel: string;
  PreloadCountLabel: string;

  // Component strings
  PreviousSlideLabel: string;
  NextSlideLabel: string;
  GoToSlideLabel: string;
  SlideNavigationLabel: string;
  SliderCarouselLabel: string;
  SlideLabel: string;
  OfLabel: string;
  PauseLabel: string;
  PlayLabel: string;
  BeforeLabel: string;
  AfterLabel: string;
  DragToCompareLabel: string;
  NoSlidesTitle: string;
  NoSlidesDescription: string;
  EditOverlayTitle: string;
  EditOverlayDescription: string;
  LoadingLabel: string;
}

declare module "HyperSliderWebPartStrings" {
  const strings: IHyperSliderWebPartStrings;
  export = strings;
}
