/** Presence information from Microsoft Graph */
export interface IDirectoryPresence {
  availability: string;
  activity: string;
}

/** User profile from Microsoft Graph for directory display */
export interface IHyperDirectoryUser {
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
  companyName?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  aboutMe?: string;
  employeeId?: string;
  photoUrl?: string;
  presence?: IDirectoryPresence;
  managerId?: string;
  managerDisplayName?: string;
  extensionAttributes?: Record<string, string>;
  /** Index signature for dynamic field access */
  [key: string]: string | string[] | Record<string, string> | IDirectoryPresence | undefined;
}

/** Layout modes for the directory */
export type DirectoryLayoutMode = "grid" | "list" | "compact" | "card" | "masonry" | "rollerDex" | "orgChart";

/** Card display style */
export type DirectoryCardStyle = "standard" | "compact" | "detailed";

/** Photo size options */
export type DirectoryPhotoSize = "small" | "medium" | "large";

/** Pagination mode */
export type DirectoryPaginationMode = "paged" | "infinite";

/** Sort direction */
export type DirectorySortDirection = "asc" | "desc";

/** Quick action types */
export type DirectoryActionType = "email" | "teamsChat" | "teamsCall" | "schedule" | "copyEmail" | "vCard";

/** Graph fields to select when fetching users */
export const DIRECTORY_USER_FIELDS = "id,displayName,givenName,surname,userPrincipalName,mail,jobTitle,department,officeLocation,city,companyName,mobilePhone,businessPhones,aboutMe,employeeId";

/** Maximum users to fetch from Graph */
export const MAX_DIRECTORY_USERS = 999;

/** Page size for Graph API pagination */
export const GRAPH_PAGE_SIZE = 100;

/** Maximum concurrent photo requests */
export const MAX_PHOTO_CONCURRENCY = 5;

/** Maximum concurrent presence requests */
export const MAX_PRESENCE_BATCH = 650;
