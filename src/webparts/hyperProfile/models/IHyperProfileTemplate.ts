import type { IHyperProfileWebPartProps } from "./IHyperProfileWebPartProps";

/** Template type identifiers */
export type TemplateType =
  | "executive"
  | "standard"
  | "compact"
  | "detailed"
  | "minimalist"
  | "corporate"
  | "custom";

/** Represents a template preset with predefined configuration */
export interface IHyperTemplate {
  id: TemplateType;
  name: string;
  description: string;
  configuration: Partial<IHyperProfileWebPartProps>;
}
