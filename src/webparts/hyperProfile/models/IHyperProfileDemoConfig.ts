import type { IHyperProfileUser, IHyperProfileManager } from "./IHyperProfile";
import type { IProfileSkill } from "./IHyperProfileSkill";
import type { IProfileBadge } from "./IHyperProfileBadge";
import type { IProfilePersonal } from "./IHyperProfilePersonal";
import type { IProfileOrgNode } from "./IHyperProfileOrgNode";
import type { ICalendarDay } from "./IHyperProfileCalendar";

/** Demo person ID type */
export type DemoPersonId = "sarah" | "marcus" | "elena" | "aisha" | "tomoko";

/** IDs of all demo people */
export const DEMO_PEOPLE_IDS: DemoPersonId[] = [
  "sarah", "marcus", "elena", "aisha", "tomoko",
];

/** Full demo person with all V2 data */
export interface IDemoProfilePerson {
  id: DemoPersonId;
  profile: IHyperProfileUser;
  manager: IHyperProfileManager;
  photoUrl: string;
  skills: IProfileSkill[];
  badges: IProfileBadge[];
  personal: IProfilePersonal;
  orgTree: IProfileOrgNode;
  calendar: ICalendarDay[];
}
