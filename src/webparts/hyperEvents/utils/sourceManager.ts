import type { IEventSource, IEventCategory, IRegistrationField } from "../models";
import { generateSourceId } from "../models/IEventSource";
import { generateCategoryId } from "../models/IEventCategory";
import { generateFieldId } from "../models/IEventRegistration";
import type { EventSourceType } from "../models/IEventSource";

/** Create a new event source with defaults */
export function createSource(displayName: string, type: EventSourceType): IEventSource {
  return {
    id: generateSourceId(),
    type: type,
    siteUrl: undefined,
    listName: type === "spCalendar" ? "Events" : undefined,
    calendarId: undefined,
    groupId: undefined,
    color: "#0078d4",
    enabled: true,
    displayName: displayName,
  };
}

/** Remove a source by ID */
export function removeSource(sources: IEventSource[], sourceId: string): IEventSource[] {
  return sources.filter(function (s) { return s.id !== sourceId; });
}

/** Reorder sources: move item at fromIndex to toIndex */
export function reorderSource(sources: IEventSource[], fromIndex: number, toIndex: number): IEventSource[] {
  if (fromIndex < 0 || fromIndex >= sources.length || toIndex < 0 || toIndex >= sources.length) {
    return sources;
  }
  const result: IEventSource[] = [];
  sources.forEach(function (s) { result.push(s); });
  const item = result.splice(fromIndex, 1)[0];
  result.splice(toIndex, 0, item);
  return result;
}

/** Create a new category with defaults */
export function createCategory(name: string): IEventCategory {
  return {
    id: generateCategoryId(),
    name: name,
    color: "#0078d4",
  };
}

/** Remove a category by ID */
export function removeCategory(categories: IEventCategory[], categoryId: string): IEventCategory[] {
  return categories.filter(function (c) { return c.id !== categoryId; });
}

/** Create a new registration field with defaults */
export function createRegistrationField(label: string): IRegistrationField {
  return {
    id: generateFieldId(),
    label: label,
    type: "text",
    required: false,
    options: undefined,
  };
}

/** Remove a registration field by ID */
export function removeRegistrationField(fields: IRegistrationField[], fieldId: string): IRegistrationField[] {
  return fields.filter(function (f) { return f.id !== fieldId; });
}
