import type { IHyperDirectoryUser } from "../models";

/** Map a raw Graph API response object to IHyperDirectoryUser */
export function mapGraphUserToDirectory(raw: Record<string, unknown>): IHyperDirectoryUser {
  const user: IHyperDirectoryUser = {
    id: String(raw.id || ""),
    displayName: String(raw.displayName || ""),
    givenName: raw.givenName ? String(raw.givenName) : undefined,
    surname: raw.surname ? String(raw.surname) : undefined,
    userPrincipalName: String(raw.userPrincipalName || ""),
    mail: String(raw.mail || ""),
    jobTitle: raw.jobTitle ? String(raw.jobTitle) : undefined,
    department: raw.department ? String(raw.department) : undefined,
    officeLocation: raw.officeLocation ? String(raw.officeLocation) : undefined,
    city: raw.city ? String(raw.city) : undefined,
    companyName: raw.companyName ? String(raw.companyName) : undefined,
    mobilePhone: raw.mobilePhone ? String(raw.mobilePhone) : undefined,
    businessPhones: Array.isArray(raw.businessPhones) ? raw.businessPhones as string[] : undefined,
    aboutMe: raw.aboutMe ? String(raw.aboutMe) : undefined,
    employeeId: raw.employeeId ? String(raw.employeeId) : undefined,
  };

  return user;
}

/** Get initials from display name for photo placeholder */
export function getInitials(displayName: string): string {
  if (!displayName) return "?";
  const parts = displayName.split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
}

/** Get first letter of surname (or displayName fallback) for A-Z index */
export function getLetterForUser(user: IHyperDirectoryUser): string {
  const name = user.surname || user.displayName || "";
  if (name.length === 0) return "#";
  const first = name.charAt(0).toUpperCase();
  if (first >= "A" && first <= "Z") return first;
  return "#";
}
