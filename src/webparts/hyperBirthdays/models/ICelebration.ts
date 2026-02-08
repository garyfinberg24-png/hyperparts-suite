import type { CelebrationType } from "./IHyperBirthdaysEnums";

export interface ICelebration {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  jobTitle: string;
  department: string;
  photoUrl: string;
  celebrationType: CelebrationType;
  celebrationDate: string; // "MM-DD" format
  celebrationYear: number; // original year (for milestone calculations)
  customLabel: string;
  message: string;
  isOptedOut: boolean;
  source: "entraId" | "spList";
}

export function mapGraphUserToCelebration(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: Record<string, any>,
  celebrationType: CelebrationType,
  dateField: string
): ICelebration | undefined {
  const dateValue = String(user[dateField] || "");
  if (!dateValue) return undefined;

  // Extract MM-DD from ISO date or date string
  let mmdd = "";
  let year = 0;
  if (dateValue.indexOf("-") !== -1) {
    const parts = dateValue.split("T")[0].split("-");
    if (parts.length >= 3) {
      mmdd = parts[1] + "-" + parts[2];
      year = parseInt(parts[0], 10) || 0;
    }
  }

  if (!mmdd) return undefined;

  return {
    id: String(user.id || user.userPrincipalName || ""),
    userId: String(user.id || ""),
    displayName: String(user.displayName || ""),
    email: String(user.mail || user.userPrincipalName || ""),
    jobTitle: String(user.jobTitle || ""),
    department: String(user.department || ""),
    photoUrl: "",
    celebrationType: celebrationType,
    celebrationDate: mmdd,
    celebrationYear: year,
    customLabel: "",
    message: "",
    isOptedOut: false,
    source: "entraId",
  };
}

export function mapListItemToCelebration(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: Record<string, any>
): ICelebration {
  return {
    id: "list-" + String(item.Id || "0"),
    userId: String(item.UserId || item.Title || ""),
    displayName: String(item.Title || ""),
    email: String(item.Email || ""),
    jobTitle: "",
    department: "",
    photoUrl: "",
    celebrationType: (String(item.CelebrationType || "birthday").toLowerCase() as CelebrationType) || "birthday",
    celebrationDate: String(item.CelebrationDate || ""), // "MM-DD"
    celebrationYear: Number(item.CelebrationYear) || 0,
    customLabel: String(item.CustomLabel || ""),
    message: "",
    isOptedOut: false,
    source: "spList",
  };
}
