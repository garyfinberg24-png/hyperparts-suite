import type { IHyperProfileUser, IHyperProfileManager } from "../../models/IHyperProfile";
import type { IProfileSkill } from "../../models/IHyperProfileSkill";
import type { IProfileBadge } from "../../models/IHyperProfileBadge";
import type { IProfilePersonal } from "../../models/IHyperProfilePersonal";
import type { IProfileOrgNode } from "../../models/IHyperProfileOrgNode";
import type { ICalendarDay } from "../../models/IHyperProfileCalendar";
import type { IHyperPresence } from "../../models/IHyperProfilePresence";
import type { ProfileAnimation, PhotoShape, IHeaderConfig } from "../../models/IHyperProfileAnimation";
import type { QuickActionType } from "../../models/IHyperProfileQuickAction";
import type { SkillDisplayStyle } from "../../models/IHyperProfileSkill";

/** Shared props interface for all 15 template components */
export interface IProfileTemplateProps {
  /* Core profile data */
  profile: IHyperProfileUser;
  manager?: IHyperProfileManager;
  photoUrl?: string;
  presence?: IHyperPresence;

  /* V2 extended data */
  skills: IProfileSkill[];
  badges: IProfileBadge[];
  personal?: IProfilePersonal;
  orgTree?: IProfileOrgNode;
  calendar: ICalendarDay[];

  /* Feature flags */
  showPresence: boolean;
  showStatusMessage: boolean;
  showSkills: boolean;
  showBadges: boolean;
  showHobbies: boolean;
  showSlogan: boolean;
  showWebsites: boolean;
  showInterests: boolean;
  showFunFacts: boolean;
  showEducation: boolean;
  showOrgChart: boolean;
  showManager: boolean;
  showDirectReports: boolean;
  showCalendar: boolean;
  showQuickActions: boolean;
  showCompletenessScore: boolean;
  showEndorsements: boolean;
  showBadgeDescriptions: boolean;

  /* Display options */
  skillDisplayStyle: SkillDisplayStyle;
  enabledActions: QuickActionType[];
  accentColor: string;
  photoShape: PhotoShape;
  headerConfig: IHeaderConfig;
  animation: ProfileAnimation;

  /* Callbacks */
  onActionClick?: (actionId: string) => void;
  onSkillClick?: (skillName: string) => void;
  onOrgNodeClick?: (nodeId: string) => void;
  onFlip?: () => void;

  /* Instance */
  instanceId: string;
}
