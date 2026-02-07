declare interface IHyperProfileWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DisplayModeFieldLabel: string;
  TemplateFieldLabel: string;
  QuickActionsGroupName: string;
  ShowQuickActionsFieldLabel: string;
  PresenceGroupName: string;
  ShowPresenceFieldLabel: string;
  ProfileCompletenessGroupName: string;
  ShowCompletenessScoreFieldLabel: string;
  FieldSelectionGroupName: string;
  LayoutGroupName: string;
  BackgroundGroupName: string;
  OverlayGroupName: string;
}

declare module "HyperProfileWebPartStrings" {
  const strings: IHyperProfileWebPartStrings;
  export = strings;
}
