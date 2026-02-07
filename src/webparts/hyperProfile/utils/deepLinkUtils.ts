/** Utility functions for generating deep links to Microsoft applications */

export function getEmailLink(email: string, subject?: string): string {
  return "mailto:" + email + (subject ? "?subject=" + encodeURIComponent(subject) : "");
}

export function getTeamsChatLink(email: string): string {
  return "https://teams.microsoft.com/l/chat/0/0?users=" + encodeURIComponent(email);
}

export function getTeamsCallLink(email: string): string {
  return "https://teams.microsoft.com/l/call/0/0?users=" + encodeURIComponent(email);
}

export function getScheduleMeetingLink(email: string, subject?: string): string {
  const subj = subject || "Meeting Request";
  return "https://outlook.office.com/calendar/deeplink/compose?to=" + encodeURIComponent(email) + "&subject=" + encodeURIComponent(subj);
}

export function getDelveProfileLink(email: string): string {
  return "https://nam.delve.office.com/?u=" + encodeURIComponent(email);
}

export function getTelLink(phoneNumber: string): string {
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  return "tel:" + cleanPhone;
}

export function getShareProfileLink(userId: string): string {
  const currentUrl = window.location.href.split("?")[0];
  return currentUrl + "?userid=" + encodeURIComponent(userId);
}
