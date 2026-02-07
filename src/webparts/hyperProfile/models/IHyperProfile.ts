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
  /** Index signature for dynamic field access */
  [key: string]: string | string[] | undefined;
}

/** Manager information */
export interface IHyperProfileManager {
  id: string;
  displayName: string;
  mail: string;
  jobTitle?: string;
  userPrincipalName?: string;
}
