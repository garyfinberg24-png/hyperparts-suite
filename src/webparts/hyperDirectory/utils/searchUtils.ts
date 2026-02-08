import type { IHyperDirectoryUser } from "../models";

/** Field weights for search scoring */
const SEARCH_WEIGHTS: Record<string, number> = {
  displayName: 3,
  jobTitle: 2,
  department: 2,
  mail: 1,
  officeLocation: 1,
  city: 1,
  companyName: 1,
};

/** Score how well a user matches a search query (0 = no match) */
export function scoreUserMatch(user: IHyperDirectoryUser, query: string): number {
  if (!query) return 1;
  const lowerQuery = query.toLowerCase();
  let score = 0;

  const fields = Object.keys(SEARCH_WEIGHTS);
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const value = user[field];
    if (typeof value === "string" && value.toLowerCase().indexOf(lowerQuery) !== -1) {
      score += SEARCH_WEIGHTS[field];
      // Bonus for starts-with match
      if (value.toLowerCase().indexOf(lowerQuery) === 0) {
        score += 1;
      }
    }
  }

  // Check extension attributes
  if (user.extensionAttributes) {
    const attrs = user.extensionAttributes;
    const attrKeys = Object.keys(attrs);
    for (let j = 0; j < attrKeys.length; j++) {
      const attrVal = attrs[attrKeys[j]];
      if (attrVal && attrVal.toLowerCase().indexOf(lowerQuery) !== -1) {
        score += 1;
      }
    }
  }

  return score;
}

/** Create bold-highlighted text segments for matching query */
export interface IHighlightSegment {
  text: string;
  highlighted: boolean;
}

export function highlightText(text: string, query: string): IHighlightSegment[] {
  if (!query || !text) {
    return [{ text: text || "", highlighted: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const segments: IHighlightSegment[] = [];
  let lastIndex = 0;

  let matchIndex = lowerText.indexOf(lowerQuery, lastIndex);
  while (matchIndex !== -1) {
    // Text before match
    if (matchIndex > lastIndex) {
      segments.push({ text: text.substring(lastIndex, matchIndex), highlighted: false });
    }
    // Matched text
    segments.push({ text: text.substring(matchIndex, matchIndex + query.length), highlighted: true });
    lastIndex = matchIndex + query.length;
    matchIndex = lowerText.indexOf(lowerQuery, lastIndex);
  }

  // Remaining text
  if (lastIndex < text.length) {
    segments.push({ text: text.substring(lastIndex), highlighted: false });
  }

  if (segments.length === 0) {
    segments.push({ text: text, highlighted: false });
  }

  return segments;
}
