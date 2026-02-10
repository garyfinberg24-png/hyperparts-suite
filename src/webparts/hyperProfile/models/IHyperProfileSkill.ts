/** Skill category for grouping */
export interface ISkillCategory {
  id: string;
  name: string;
  color: string;
}

/** Individual skill with endorsement data */
export interface IProfileSkill {
  name: string;
  /** Proficiency level 1-5 */
  level: number;
  endorsementCount: number;
  endorsedBy: string[];
  category: string;
}

/** Display style for skills section */
export type SkillDisplayStyle = "tags" | "bars" | "radar" | "list";

/** Default skill categories */
export const DEFAULT_SKILL_CATEGORIES: ISkillCategory[] = [
  { id: "technical", name: "Technical", color: "#0078d4" },
  { id: "leadership", name: "Leadership", color: "#8b5cf6" },
  { id: "design", name: "Design", color: "#e91e63" },
  { id: "data", name: "Data & Analytics", color: "#06b6d4" },
  { id: "communication", name: "Communication", color: "#f59e0b" },
  { id: "business", name: "Business", color: "#10b981" },
];
