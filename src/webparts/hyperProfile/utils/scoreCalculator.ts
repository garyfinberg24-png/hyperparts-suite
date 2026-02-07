import type { IHyperProfileUser } from "../models";
import type { IProfileCompleteness, IFieldScore } from "../models";

/** Default field weights (can be customized via property pane) */
const DEFAULT_FIELD_WEIGHTS: Record<string, number> = {
  profilePhotoUrl: 3,
  displayName: 3,
  jobTitle: 3,
  department: 2,
  mail: 2,
  officeLocation: 2,
  mobilePhone: 1,
  city: 1,
  aboutMe: 1,
  businessPhones: 1,
  preferredLanguage: 1,
};

/** Field labels for display */
const FIELD_LABELS: Record<string, string> = {
  profilePhotoUrl: "Profile Photo",
  displayName: "Display Name",
  jobTitle: "Job Title",
  department: "Department",
  mail: "Email Address",
  officeLocation: "Office Location",
  mobilePhone: "Mobile Phone",
  city: "City",
  aboutMe: "About Me",
  businessPhones: "Business Phones",
  preferredLanguage: "Preferred Language",
};

/** Check if a field value is considered filled */
function isFieldFilled(value: unknown): boolean {
  if (value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** Calculate profile completeness score */
export function calculateScore(
  profile: IHyperProfileUser,
  customWeights?: Record<string, number>
): IProfileCompleteness {
  const weights = customWeights || DEFAULT_FIELD_WEIGHTS;
  let totalPoints = 0;
  let earnedPoints = 0;
  const fieldBreakdown: IFieldScore[] = [];
  const missingFields: string[] = [];

  Object.keys(weights).forEach(function (field) {
    const weight = weights[field];
    totalPoints += weight;
    const value = profile[field];
    const isFilled = isFieldFilled(value);

    if (isFilled) {
      earnedPoints += weight;
    } else {
      missingFields.push(field);
    }

    fieldBreakdown.push({
      fieldName: field,
      label: FIELD_LABELS[field] || field,
      isFilled: isFilled,
      weight: weight,
    });
  });

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return {
    score: score,
    totalFields: Object.keys(weights).length,
    filledFields: fieldBreakdown.filter(function (f) { return f.isFilled; }).length,
    missingFields: missingFields,
    fieldBreakdown: fieldBreakdown,
  };
}

/** Get encouragement message based on score */
export function getEncouragementMessage(score: number): string {
  if (score === 100) return "Perfect! Your profile is complete!";
  if (score >= 90) return "Almost there! Just a few more details.";
  if (score >= 70) return "Good progress! Keep going.";
  if (score >= 50) return "You're halfway there!";
  return "Let's complete your profile!";
}

/** Get color for score display */
export function getScoreColor(score: number): string {
  if (score >= 90) return "#107C10";
  if (score >= 71) return "#FFAA44";
  if (score >= 41) return "#CA5010";
  return "#D13438";
}
