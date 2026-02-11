import type { IBaseHyperWebPartProps } from "../../../common/BaseHyperWebPart";
import type { BirthdaysViewMode, BirthdaysTimeRange, AnimationType } from "./IHyperBirthdaysEnums";

export interface IHyperBirthdaysWebPartProps extends IBaseHyperWebPartProps {
  title: string;
  viewMode: BirthdaysViewMode;
  timeRange: BirthdaysTimeRange;

  // Data sources
  enableEntraId: boolean;
  enableSpList: boolean;
  spListName: string;

  // Celebration type toggles
  enableBirthdays: boolean;
  enableAnniversaries: boolean;
  enableWeddings: boolean;
  enableChildBirth: boolean;
  enableGraduation: boolean;
  enableRetirement: boolean;
  enablePromotion: boolean;
  enableCustom: boolean;

  // Features
  messageTemplates: string; // JSON Record<CelebrationType, string>
  enableTeamsDeepLink: boolean;
  enableAnimations: boolean;
  animationType: AnimationType;
  enableMilestoneBadges: boolean;
  enablePrivacyOptOut: boolean;
  optOutListName: string;
  enableManagerNotify: boolean;

  // Greeting Card
  enableGreetingCard: boolean;

  // Teams Channel Post
  enableChannelPost: boolean;
  teamsChannelId: string;
  teamsTeamId: string;

  // Weekend/Holiday Shift
  enableWeekendShift: boolean;

  // Self-Service Profile
  enableSelfService: boolean;
  selfServiceListName: string;

  // Display
  maxItems: number;
  cacheDuration: number;
  photoSize: number;

  // Sample data
  useSampleData: boolean;

  // Wizard
  showWizardOnInit: boolean;
}
