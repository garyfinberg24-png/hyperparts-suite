import type { IHyperDirectoryUser, IHyperDirectoryFilter, IDirectoryFilterOptions, IDirectoryFilterChip } from "../models";
import { getLetterForUser } from "./userMapper";

/** Extract unique filter values from a list of users */
export function extractFilterOptions(users: IHyperDirectoryUser[]): IDirectoryFilterOptions {
  const deptSet: Record<string, boolean> = {};
  const locSet: Record<string, boolean> = {};
  const titleSet: Record<string, boolean> = {};
  const companySet: Record<string, boolean> = {};

  users.forEach(function (user) {
    if (user.department) deptSet[user.department] = true;
    if (user.officeLocation) locSet[user.officeLocation] = true;
    if (user.jobTitle) titleSet[user.jobTitle] = true;
    if (user.companyName) companySet[user.companyName] = true;
  });

  return {
    departments: Object.keys(deptSet).sort(),
    locations: Object.keys(locSet).sort(),
    titles: Object.keys(titleSet).sort(),
    companies: Object.keys(companySet).sort(),
  };
}

/** Apply filters to a list of users */
export function applyFilters(users: IHyperDirectoryUser[], filter: IHyperDirectoryFilter): IHyperDirectoryUser[] {
  let result = users;

  // Department filter (OR logic within)
  if (filter.departments.length > 0) {
    result = result.filter(function (user) {
      return user.department !== undefined && filter.departments.indexOf(user.department) !== -1;
    });
  }

  // Location filter
  if (filter.locations.length > 0) {
    result = result.filter(function (user) {
      return user.officeLocation !== undefined && filter.locations.indexOf(user.officeLocation) !== -1;
    });
  }

  // Title filter
  if (filter.titles.length > 0) {
    result = result.filter(function (user) {
      return user.jobTitle !== undefined && filter.titles.indexOf(user.jobTitle) !== -1;
    });
  }

  // Company filter
  if (filter.companies.length > 0) {
    result = result.filter(function (user) {
      return user.companyName !== undefined && filter.companies.indexOf(user.companyName) !== -1;
    });
  }

  // A-Z letter filter
  if (filter.activeLetter) {
    result = result.filter(function (user) {
      return getLetterForUser(user) === filter.activeLetter;
    });
  }

  return result;
}

/** Build filter chips with counts for display */
export function buildFilterChips(
  users: IHyperDirectoryUser[],
  options: IDirectoryFilterOptions
): IDirectoryFilterChip[] {
  const chips: IDirectoryFilterChip[] = [];

  options.departments.forEach(function (dept) {
    const count = countUsersWithValue(users, "department", dept);
    if (count > 0) {
      chips.push({ category: "department", value: dept, count: count });
    }
  });

  options.locations.forEach(function (loc) {
    const count = countUsersWithValue(users, "officeLocation", loc);
    if (count > 0) {
      chips.push({ category: "location", value: loc, count: count });
    }
  });

  options.titles.forEach(function (title) {
    const count = countUsersWithValue(users, "jobTitle", title);
    if (count > 0) {
      chips.push({ category: "title", value: title, count: count });
    }
  });

  options.companies.forEach(function (company) {
    const count = countUsersWithValue(users, "companyName", company);
    if (count > 0) {
      chips.push({ category: "company", value: company, count: count });
    }
  });

  return chips;
}

function countUsersWithValue(users: IHyperDirectoryUser[], field: string, value: string): number {
  let count = 0;
  users.forEach(function (user) {
    if (user[field] === value) count++;
  });
  return count;
}
