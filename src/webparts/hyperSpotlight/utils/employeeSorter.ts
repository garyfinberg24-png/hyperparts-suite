import type { IHyperSpotlightEmployee } from "../models";
import { SortOrder } from "../models";

/**
 * Sort employees by display name.
 */
export function sortByName(
  employees: IHyperSpotlightEmployee[],
  direction: "asc" | "desc"
): IHyperSpotlightEmployee[] {
  return employees.slice().sort(function (a, b) {
    const cmp = a.displayName.localeCompare(b.displayName);
    return direction === "asc" ? cmp : -cmp;
  });
}

/**
 * Sort employees by a date field.
 */
export function sortByDate(
  employees: IHyperSpotlightEmployee[],
  dateField: string,
  direction: "asc" | "desc"
): IHyperSpotlightEmployee[] {
  return employees.slice().sort(function (a, b) {
    const valA = a[dateField];
    const valB = b[dateField];
    const dateA = valA ? new Date(String(valA)).getTime() : 0;
    const dateB = valB ? new Date(String(valB)).getTime() : 0;
    const cmp = dateA - dateB;
    return direction === "asc" ? cmp : -cmp;
  });
}

/**
 * Sort employees by department name (ascending).
 */
export function sortByDepartment(
  employees: IHyperSpotlightEmployee[]
): IHyperSpotlightEmployee[] {
  return employees.slice().sort(function (a, b) {
    const deptA = a.department || "";
    const deptB = b.department || "";
    return deptA.localeCompare(deptB);
  });
}

/**
 * Fisher-Yates shuffle.
 */
export function sortRandom(
  employees: IHyperSpotlightEmployee[]
): IHyperSpotlightEmployee[] {
  const shuffled = employees.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

/**
 * Sort employees based on the configured SortOrder.
 */
export function sortEmployees(
  employees: IHyperSpotlightEmployee[],
  sortOrder: SortOrder
): IHyperSpotlightEmployee[] {
  switch (sortOrder) {
    case SortOrder.NameAsc:
      return sortByName(employees, "asc");
    case SortOrder.NameDesc:
      return sortByName(employees, "desc");
    case SortOrder.DateAsc:
      return sortByDate(employees, "hireDate", "asc");
    case SortOrder.DateDesc:
      return sortByDate(employees, "hireDate", "desc");
    case SortOrder.Department:
      return sortByDepartment(employees);
    case SortOrder.Random:
      return sortRandom(employees);
    default:
      return employees;
  }
}
