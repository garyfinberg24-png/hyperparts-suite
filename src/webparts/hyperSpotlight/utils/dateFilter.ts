import type { IHyperSpotlightEmployee } from "../models";
import { SpotlightCategory, DateRange } from "../models";

/* ── Date range calculators ── */

export function getCurrentWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now.getTime());
  start.setDate(now.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start.getTime());
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start: start, end: end };
}

export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start: start, end: end };
}

export function getCurrentQuarterRange(): { start: Date; end: Date } {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3);
  const start = new Date(now.getFullYear(), quarter * 3, 1);
  const end = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59);
  return { start: start, end: end };
}

/**
 * Resolve a DateRange enum to concrete start/end dates.
 */
export function getDateRangeForEnum(
  dateRange: DateRange,
  customStart?: string,
  customEnd?: string
): { start: Date; end: Date } {
  switch (dateRange) {
    case DateRange.ThisWeek:
      return getCurrentWeekRange();
    case DateRange.ThisMonth:
      return getCurrentMonthRange();
    case DateRange.ThisQuarter:
      return getCurrentQuarterRange();
    case DateRange.Custom:
      if (customStart && customEnd) {
        return { start: new Date(customStart), end: new Date(customEnd) };
      }
      return getCurrentMonthRange();
    default:
      return getCurrentMonthRange();
  }
}

/* ── Birthday / anniversary matching ── */

/**
 * Check if a birthday (in various formats) falls within a date range,
 * comparing only month and day (ignoring year).
 */
export function isBirthdayInRange(
  birthday: string,
  startDate: Date,
  endDate: Date
): boolean {
  if (!birthday) return false;

  const bDate = new Date(birthday);
  const bMonth = bDate.getMonth();
  const bDay = bDate.getDate();

  const sMonth = startDate.getMonth();
  const sDay = startDate.getDate();
  const eMonth = endDate.getMonth();
  const eDay = endDate.getDate();

  // Same month
  if (sMonth === eMonth) {
    return bMonth === sMonth && bDay >= sDay && bDay <= eDay;
  }

  // Cross-month logic
  if (bMonth === sMonth && bDay >= sDay) return true;
  if (bMonth === eMonth && bDay <= eDay) return true;
  if (bMonth > sMonth && bMonth < eMonth) return true;

  // Year boundary (e.g., Dec – Jan)
  if (sMonth > eMonth) {
    if (bMonth >= sMonth || bMonth <= eMonth) {
      if (bMonth === sMonth && bDay < sDay) return false;
      if (bMonth === eMonth && bDay > eDay) return false;
      return true;
    }
  }

  return false;
}

/**
 * Check if a hire-date anniversary falls within a date range
 * (comparing only month and day).
 */
export function isAnniversaryInRange(
  hireDate: string,
  startDate: Date,
  endDate: Date
): boolean {
  if (!hireDate) return false;
  return isBirthdayInRange(hireDate, startDate, endDate);
}

/**
 * Calculate years of service from a hire date string.
 */
export function calculateYearsOfService(hireDateStr: string): number {
  const hireDate = new Date(hireDateStr);
  const today = new Date();
  let years = today.getFullYear() - hireDate.getFullYear();
  const monthDiff = today.getMonth() - hireDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hireDate.getDate())) {
    years--;
  }
  return years;
}

/**
 * Filter employees by category and date range.
 */
export function filterEmployeesByDate(
  employees: IHyperSpotlightEmployee[],
  category: SpotlightCategory,
  startDate: Date,
  endDate: Date
): IHyperSpotlightEmployee[] {
  return employees.filter(function (emp) {
    switch (category) {
      case SpotlightCategory.Birthday:
        return !!emp.birthday && isBirthdayInRange(emp.birthday, startDate, endDate);
      case SpotlightCategory.WorkAnniversary:
        return !!emp.hireDate && isAnniversaryInRange(emp.hireDate, startDate, endDate);
      default:
        // For other categories (graduation, wedding, etc.) no Graph date field exists
        return true;
    }
  });
}

/**
 * Apply department and location JSON-array filters.
 */
export function applyPropertyFilters(
  employees: IHyperSpotlightEmployee[],
  departmentFilterJson: string,
  locationFilterJson: string
): IHyperSpotlightEmployee[] {
  let filtered = employees;

  if (departmentFilterJson) {
    try {
      const depts: string[] = JSON.parse(departmentFilterJson);
      if (depts.length > 0) {
        filtered = filtered.filter(function (emp) {
          return !!emp.department && depts.indexOf(emp.department) !== -1;
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      /* invalid JSON — skip */
    }
  }

  if (locationFilterJson) {
    try {
      const locs: string[] = JSON.parse(locationFilterJson);
      if (locs.length > 0) {
        filtered = filtered.filter(function (emp) {
          return !!emp.officeLocation && locs.indexOf(emp.officeLocation) !== -1;
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      /* invalid JSON — skip */
    }
  }

  return filtered;
}
