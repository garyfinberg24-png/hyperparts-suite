import type { SpotlightCategory } from "./IHyperSpotlightEnums";

/** Basic user information (for managers, etc.) */
export interface IBasicUser {
  id: string;
  displayName: string;
  mail?: string;
  userPrincipalName?: string;
}

/** Complete employee profile from Microsoft Graph */
export interface IHyperSpotlightEmployee {
  // Core identity
  id: string;
  userPrincipalName: string;
  displayName: string;
  givenName: string;
  surname: string;
  mail: string;

  // Job information
  jobTitle?: string;
  department?: string;
  officeLocation?: string;

  // Contact information
  businessPhones?: string[];
  mobilePhone?: string;
  preferredLanguage?: string;

  // Extended profile
  aboutMe?: string;
  /** Birthday in MM-DD format (no year for privacy) */
  birthday?: string;
  /** Hire date in ISO format YYYY-MM-DD */
  hireDate?: string;
  skills?: string[];
  interests?: string[];
  schools?: string[];

  // Relationships
  manager?: IBasicUser;

  // Photo
  /** Profile photo URL (base64 data URI) */
  photoUrl?: string;

  // Calculated fields
  yearsOfService?: number;
  daysUntilBirthday?: number;

  // Manual mode
  assignedCategory?: SpotlightCategory;

  // Extension attributes
  [key: string]: unknown;
}

/** Default empty employee (for initialisation) */
export const DEFAULT_EMPLOYEE: IHyperSpotlightEmployee = {
  id: "",
  userPrincipalName: "",
  displayName: "",
  givenName: "",
  surname: "",
  mail: "",
};
