declare interface IHyperFaqWebPartStrings {
  PropertyPaneDescription: string;
  ContentGroupName: string;
  FeaturesGroupName: string;
  AppearanceGroupName: string;
  FeaturesPageDescription: string;
  AppearancePageDescription: string;

  TitleFieldLabel: string;
  ListNameFieldLabel: string;
  MaxItemsFieldLabel: string;
  SortModeFieldLabel: string;
  EnableCategoriesFieldLabel: string;
  EnableSearchFieldLabel: string;

  EnableVotingFieldLabel: string;
  ShowViewCountFieldLabel: string;
  EnableSubmissionFieldLabel: string;
  ReviewQueueListNameFieldLabel: string;
  EnableRelatedFieldLabel: string;
  EnableDeepLinkFieldLabel: string;

  AccordionStyleFieldLabel: string;
  CacheDurationFieldLabel: string;

  SearchPlaceholder: string;
  AskGuruButton: string;
  HelpfulLabel: string;
  YesLabel: string;
  NoLabel: string;
  RelatedLabel: string;
  ViewCountLabel: string;
  NoResultsTitle: string;
  NoResultsDescription: string;
  SubmitModalTitle: string;
  SubmitPlaceholder: string;
  SubmitButton: string;
  CancelButton: string;
  SubmitSuccess: string;
  SubmitError: string;
}

declare module "HyperFaqWebPartStrings" {
  const strings: IHyperFaqWebPartStrings;
  export = strings;
}
