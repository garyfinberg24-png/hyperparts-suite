/** Registration form field types */
export type RegistrationFieldType = "text" | "dropdown" | "checkbox" | "date";

/** A dynamic registration form field definition */
export interface IRegistrationField {
  id: string;
  label: string;
  type: RegistrationFieldType;
  required: boolean;
  /** Options for dropdown fields */
  options: string[] | undefined;
}

/** A single registration submission record */
export interface IEventRegistration {
  eventId: string;
  userId: string;
  userEmail: string;
  /** Field values keyed by field ID */
  fields: Record<string, unknown>;
  /** ISO 8601 timestamp */
  timestamp: string;
}

/** Generate a unique field ID */
export function generateFieldId(): string {
  return "fld-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 7);
}

/** Parse registration fields from JSON string */
export function parseRegistrationFields(json: string | undefined): IRegistrationField[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as IRegistrationField[];
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

/** Stringify registration fields to JSON */
export function stringifyRegistrationFields(fields: IRegistrationField[]): string {
  return JSON.stringify(fields, undefined, 2);
}
