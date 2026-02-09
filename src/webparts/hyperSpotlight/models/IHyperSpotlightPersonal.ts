// ============================================================
// HyperSpotlight — "Get to Know Me" Personal Data Utilities
// Ported from JML New Hire Spotlight, adapted for ES5 target
// ============================================================

/** A parsed website link */
export interface IWebsiteLink {
  url: string;
  title: string;
}

/**
 * Parse a websites string into structured links.
 * Tries JSON first, falls back to comma-separated URLs.
 */
export function parseWebsites(raw: string | undefined): IWebsiteLink[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as IWebsiteLink[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* not valid JSON — fall through */
  }

  // Fallback: comma-separated URLs
  const result: IWebsiteLink[] = [];
  raw.split(",").forEach(function (site) {
    const trimmed = site.trim();
    if (!trimmed) return;
    const url = trimmed.indexOf("http") === 0 ? trimmed : "https://" + trimmed;
    // Extract domain name as title
    const title = trimmed
      .replace(/^https?:\/\/(www\.)?/, "")
      .split("/")[0];
    result.push({ url: url, title: title });
  });
  return result;
}

/**
 * Parse a comma-separated string into a trimmed array.
 */
export function parseCommaSeparated(raw: string | undefined): string[] {
  if (!raw) return [];
  const result: string[] = [];
  raw.split(",").forEach(function (item) {
    const trimmed = item.trim();
    if (trimmed) result.push(trimmed);
  });
  return result;
}

/**
 * Map a hobby keyword to a Fluent UI icon name.
 * Ported from JML getHobbyIcon() — uses indexOf instead of includes.
 */
export function getHobbyIcon(hobby: string): string {
  const lower = hobby.toLowerCase();
  if (lower.indexOf("read") !== -1) return "BookAnswers";
  if (lower.indexOf("music") !== -1 || lower.indexOf("guitar") !== -1 || lower.indexOf("piano") !== -1) return "MusicInCollection";
  if (lower.indexOf("sport") !== -1 || lower.indexOf("run") !== -1 || lower.indexOf("gym") !== -1 || lower.indexOf("fitness") !== -1) return "Health";
  if (lower.indexOf("cook") !== -1 || lower.indexOf("baking") !== -1 || lower.indexOf("bake") !== -1) return "CoffeeScript";
  if (lower.indexOf("travel") !== -1) return "Airplane";
  if (lower.indexOf("photo") !== -1) return "Camera";
  if (lower.indexOf("game") !== -1 || lower.indexOf("gaming") !== -1) return "Game";
  if (lower.indexOf("paint") !== -1 || lower.indexOf("art") !== -1 || lower.indexOf("draw") !== -1) return "Design";
  if (lower.indexOf("code") !== -1 || lower.indexOf("program") !== -1) return "Code";
  if (lower.indexOf("garden") !== -1 || lower.indexOf("plant") !== -1) return "Flower";
  if (lower.indexOf("movie") !== -1 || lower.indexOf("film") !== -1 || lower.indexOf("tv") !== -1) return "Video";
  if (lower.indexOf("yoga") !== -1 || lower.indexOf("meditat") !== -1) return "Heart";
  if (lower.indexOf("hike") !== -1 || lower.indexOf("climb") !== -1 || lower.indexOf("outdoor") !== -1) return "Mountain";
  if (lower.indexOf("write") !== -1 || lower.indexOf("blog") !== -1) return "EditNote";
  return "Emoji2";
}

/**
 * Get a human-readable relative time string from an ISO date string.
 * Ported from JML getTimeSinceHire() — uses ISO string input.
 */
export function getTimeSinceHire(hireDateIso: string | undefined): string {
  if (!hireDateIso) return "";
  const hireDate = new Date(hireDateIso);
  if (isNaN(hireDate.getTime())) return "";

  const now = new Date();
  const days = Math.floor((now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24));

  if (days < 0) return "starts soon";
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return String(days) + " days ago";
  const weeks = Math.floor(days / 7);
  if (days < 30) return String(weeks) + (weeks === 1 ? " week ago" : " weeks ago");
  const months = Math.floor(days / 30);
  if (days < 365) return String(months) + (months === 1 ? " month ago" : " months ago");
  const years = Math.floor(days / 365);
  return String(years) + (years === 1 ? " year ago" : " years ago");
}
