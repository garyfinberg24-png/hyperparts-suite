import type { HyperNavDeepLinkType } from "../models";

/** Detect the deep link type from a URL */
export function detectDeepLinkType(url: string): HyperNavDeepLinkType {
  const lower = url.toLowerCase();
  if (lower.indexOf("teams.microsoft.com") !== -1 || lower.indexOf("msteams:") === 0) {
    return "teams";
  }
  if (lower.indexOf("apps.powerapps.com") !== -1 || lower.indexOf("make.powerapps.com") !== -1) {
    return "powerapp";
  }
  if (lower.indexOf("viva.cloud.microsoft") !== -1) {
    return "viva";
  }
  return "standard";
}

/** Check if URL is a Teams deep link */
export function isTeamsDeepLink(url: string): boolean {
  return detectDeepLinkType(url) === "teams";
}

/** Check if URL is a PowerApp link */
export function isPowerAppLink(url: string): boolean {
  return detectDeepLinkType(url) === "powerapp";
}

/** Check if URL is a Viva link */
export function isVivaLink(url: string): boolean {
  return detectDeepLinkType(url) === "viva";
}
