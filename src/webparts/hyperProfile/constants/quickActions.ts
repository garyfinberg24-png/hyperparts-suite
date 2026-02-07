import type { IHyperQuickAction, IHyperProfileUser } from "../models";
import {
  getEmailLink,
  getTeamsChatLink,
  getTeamsCallLink,
  getScheduleMeetingLink,
  getDelveProfileLink,
  getTelLink,
  getShareProfileLink,
} from "../utils/deepLinkUtils";
import { downloadVCard } from "../utils/vCardUtils";

/** Predefined quick actions for user profiles */
export const QUICK_ACTIONS: IHyperQuickAction[] = [
  {
    id: "email",
    label: "Email",
    iconName: "Mail",
    type: "email",
    tooltip: "Send email",
    isPrimary: true,
    isEnabled: function (profile: IHyperProfileUser) { return !!profile.mail; },
    execute: function (profile: IHyperProfileUser) {
      window.open(getEmailLink(profile.mail), "_blank");
    },
  },
  {
    id: "teams_chat",
    label: "Chat",
    iconName: "Chat",
    type: "teams_chat",
    tooltip: "Chat in Teams",
    isPrimary: true,
    isEnabled: function (profile: IHyperProfileUser) { return !!profile.mail; },
    execute: function (profile: IHyperProfileUser) {
      window.open(getTeamsChatLink(profile.mail), "_blank");
    },
  },
  {
    id: "teams_call",
    label: "Call",
    iconName: "Phone",
    type: "teams_call",
    tooltip: "Call in Teams",
    isPrimary: true,
    isEnabled: function (profile: IHyperProfileUser) {
      return !!(profile.mobilePhone || (profile.businessPhones && profile.businessPhones.length > 0));
    },
    execute: function (profile: IHyperProfileUser) {
      if (profile.mail) {
        window.open(getTeamsCallLink(profile.mail), "_blank");
      } else if (profile.mobilePhone) {
        window.open(getTelLink(profile.mobilePhone), "_self");
      } else if (profile.businessPhones && profile.businessPhones.length > 0) {
        window.open(getTelLink(profile.businessPhones[0]), "_self");
      }
    },
  },
  {
    id: "schedule",
    label: "Schedule",
    iconName: "Calendar",
    type: "schedule",
    tooltip: "Schedule a meeting",
    isPrimary: true,
    isEnabled: function (profile: IHyperProfileUser) { return !!profile.mail; },
    execute: function (profile: IHyperProfileUser) {
      window.open(getScheduleMeetingLink(profile.mail, "Meeting with " + profile.displayName), "_blank");
    },
  },
  {
    id: "delve",
    label: "Delve",
    iconName: "SearchAndApps",
    type: "delve",
    tooltip: "View in Delve",
    isPrimary: false,
    isEnabled: function (profile: IHyperProfileUser) { return !!profile.mail; },
    execute: function (profile: IHyperProfileUser) {
      window.open(getDelveProfileLink(profile.mail), "_blank");
    },
  },
  {
    id: "vcard",
    label: "Export",
    iconName: "Download",
    type: "vcard",
    tooltip: "Export vCard",
    isPrimary: false,
    isEnabled: function () { return true; },
    execute: function (profile: IHyperProfileUser) {
      downloadVCard(profile);
    },
  },
  {
    id: "copy_email",
    label: "Copy Email",
    iconName: "Copy",
    type: "copy_email",
    tooltip: "Copy email to clipboard",
    isPrimary: false,
    isEnabled: function (profile: IHyperProfileUser) { return !!profile.mail; },
    execute: function (profile: IHyperProfileUser) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(profile.mail).catch(function () {
          /* clipboard write failed */
        });
      }
    },
  },
  {
    id: "copy_phone",
    label: "Copy Phone",
    iconName: "Copy",
    type: "copy_phone",
    tooltip: "Copy phone number to clipboard",
    isPrimary: false,
    isEnabled: function (profile: IHyperProfileUser) { return !!profile.mobilePhone; },
    execute: function (profile: IHyperProfileUser) {
      if (navigator.clipboard && profile.mobilePhone) {
        navigator.clipboard.writeText(profile.mobilePhone).catch(function () {
          /* clipboard write failed */
        });
      }
    },
  },
  {
    id: "share_profile",
    label: "Share",
    iconName: "Share",
    type: "share_profile",
    tooltip: "Share profile link",
    isPrimary: false,
    isEnabled: function () { return true; },
    execute: function (profile: IHyperProfileUser) {
      const link = getShareProfileLink(profile.userPrincipalName || profile.id);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(link).catch(function () {
          /* clipboard write failed */
        });
      }
    },
  },
];

/** Get quick action by ID */
export function getQuickActionById(id: string): IHyperQuickAction | undefined {
  let result: IHyperQuickAction | undefined;
  QUICK_ACTIONS.forEach(function (a) {
    if (a.id === id && !result) {
      result = a;
    }
  });
  return result;
}

/** Get enabled quick actions for a profile */
export function getEnabledActions(profile: IHyperProfileUser, actionIds: string[]): IHyperQuickAction[] {
  return QUICK_ACTIONS.filter(function (action) {
    return actionIds.indexOf(action.id) !== -1 && action.isEnabled(profile);
  });
}
