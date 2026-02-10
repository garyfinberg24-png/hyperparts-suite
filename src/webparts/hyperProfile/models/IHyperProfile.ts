import type { IProfileSkill } from "./IHyperProfileSkill";
import type { IProfileBadge } from "./IHyperProfileBadge";
import type { IProfilePersonal } from "./IHyperProfilePersonal";

/** User profile from Microsoft Graph API */
export interface IHyperProfileUser {
  id: string;
  displayName: string;
  givenName?: string;
  surname?: string;
  userPrincipalName: string;
  mail: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  city?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  preferredLanguage?: string;
  employeeId?: string;
  companyName?: string;
  aboutMe?: string;
  profilePhotoUrl?: string;

  /* ── V2 Fields ── */
  /** Skills with endorsement data */
  skills?: IProfileSkill[];
  /** Badges and recognition awards */
  badges?: IProfileBadge[];
  /** Personal info: hobbies, slogan, websites, education */
  personal?: IProfilePersonal;
  /** Preferred pronouns (e.g. "she/her") */
  pronouns?: string;
  /** Years at company */
  tenure?: string;
  /** Work hours display (e.g. "9:00 AM - 5:00 PM EST") */
  workHours?: string;
  /** Timezone (e.g. "America/New_York") */
  timezone?: string;
  /** ISO date string of hire date */
  hireDate?: string;
  /** Physical location details (building/floor) */
  location?: string;
  /** Social media / external profile links */
  socialLinks?: { platform: string; url: string }[];

  /** Index signature for dynamic field access */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/** Manager information */
export interface IHyperProfileManager {
  id: string;
  displayName: string;
  mail: string;
  jobTitle?: string;
  userPrincipalName?: string;
}
