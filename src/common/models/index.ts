/** Shared TypeScript interfaces for HyperParts Suite */

/** Standard result shape for list item queries */
export interface IHyperListItem {
  Id: number;
  Title: string;
  Created: string;
  Modified: string;
  Author?: IHyperUser;
  Editor?: IHyperUser;
  [key: string]: unknown;
}

/** User reference from SharePoint */
export interface IHyperUser {
  Id: number;
  Title: string;
  EMail?: string;
  LoginName?: string;
}

/** Graph user profile */
export interface IGraphUser {
  id: string;
  displayName: string;
  mail: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  userPrincipalName: string;
  photo?: string;
}

/** Audience targeting configuration */
export interface IAudienceTarget {
  enabled: boolean;
  groups: string[];
  matchAll: boolean;
}

/** Web part layout breakpoint sizes */
export type Breakpoint = "mobile" | "tablet" | "desktop" | "widescreen";

/** Pagination state */
export interface IPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** Standard error shape */
export interface IHyperError {
  message: string;
  code?: string;
  stack?: string;
}

/** Empty state configuration */
export interface IEmptyStateConfig {
  title: string;
  description?: string;
  iconName?: string;
  actionLabel?: string;
  onAction?: () => void;
}
