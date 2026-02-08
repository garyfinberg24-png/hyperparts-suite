declare interface IHyperTabsWebPartStrings {
  PropertyPaneDescription: string;
  LayoutGroupName: string;
  PanelsGroupName: string;
  AdvancedGroupName: string;
  TitleFieldLabel: string;
  DisplayModeFieldLabel: string;
  TabStyleFieldLabel: string;
  AnimationEnabledLabel: string;
  PanelsJsonLabel: string;
  PanelsJsonDescription: string;
  PanelsPageDescription: string;
  AdvancedPageDescription: string;
  PanelHeaderPrefix: string;
  PanelTitleLabel: string;
  PanelContentTypeLabel: string;
  MoveUpLabel: string;
  MoveDownLabel: string;
  RemovePanelLabel: string;
  AddPanelLabel: string;
  NewPanelDefaultTitle: string;
  EnableDeepLinkingLabel: string;
  EnableLazyLoadingLabel: string;
  EnableResponsiveCollapseLabel: string;
  MobileBreakpointLabel: string;
  DefaultActivePanelLabel: string;
  AccordionMultiExpandLabel: string;
  AccordionExpandAllLabel: string;
  WizardShowProgressLabel: string;
  WizardLinearModeLabel: string;
}

declare module "HyperTabsWebPartStrings" {
  const strings: IHyperTabsWebPartStrings;
  export = strings;
}
