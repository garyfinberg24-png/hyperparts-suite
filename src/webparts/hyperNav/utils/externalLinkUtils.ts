/** Check if a link URL points to an external domain relative to the current site */
export function isExternalLink(linkUrl: string, siteUrl: string): boolean {
  try {
    const linkHost = new URL(linkUrl).hostname.toLowerCase();
    const siteHost = new URL(siteUrl).hostname.toLowerCase();
    return linkHost !== siteHost;
  } catch {
    return false;
  }
}
