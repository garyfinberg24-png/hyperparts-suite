import type { IHyperProfileUser } from "./IHyperProfile";

/** Type of quick action */
export type QuickActionType =
  | "email"
  | "teams_chat"
  | "teams_call"
  | "schedule"
  | "delve"
  | "vcard"
  | "copy_email"
  | "copy_phone"
  | "share_profile";

/** Represents a quick action that can be performed on a user profile */
export interface IHyperQuickAction {
  id: string;
  label: string;
  iconName: string;
  type: QuickActionType;
  isEnabled: (profile: IHyperProfileUser) => boolean;
  execute: (profile: IHyperProfileUser) => void | Promise<void>;
  tooltip: string;
  isPrimary: boolean;
}
