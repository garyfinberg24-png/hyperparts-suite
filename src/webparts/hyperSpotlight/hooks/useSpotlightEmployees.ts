import { useCallback, useMemo } from "react";
import type { IHyperSpotlightEmployee } from "../models";
import {
  SelectionMode,
  SpotlightCategory,
  SortOrder,
  DateRange,
  ImageQuality,
} from "../models";

/** ES5-safe shallow merge (replaces Object.assign). */
function shallowMerge(
  target: Record<string, unknown>,
  ...sources: Record<string, unknown>[]
): Record<string, unknown> {
  sources.forEach(function (src) {
    if (src) {
      Object.keys(src).forEach(function (key) {
        target[key] = src[key];
      });
    }
  });
  return target;
}

function mergeEmployee(
  emp: IHyperSpotlightEmployee,
  overrides: Partial<IHyperSpotlightEmployee>
): IHyperSpotlightEmployee {
  return shallowMerge({}, emp as unknown as Record<string, unknown>, overrides as unknown as Record<string, unknown>) as unknown as IHyperSpotlightEmployee;
}
import { useGraphProfiles, useGraphProfilesByIds } from "./useGraphProfiles";
import { useGraphPhotos } from "./useGraphPhotos";
import { useAutoRefresh } from "./useAutoRefresh";
import { filterEmployeesByDate, applyPropertyFilters, getDateRangeForEnum, calculateYearsOfService } from "../utils/dateFilter";
import { sortEmployees } from "../utils/employeeSorter";

export interface UseSpotlightEmployeesOptions {
  selectionMode: SelectionMode;
  category: SpotlightCategory;
  dateRange: DateRange;
  customStartDate?: string;
  customEndDate?: string;
  manualEmployeeIds: string[];
  manualEmployeeCategories: string;
  maxEmployees: number;
  sortOrder: SortOrder;
  autoRefreshEnabled: boolean;
  autoRefreshInterval: number;
  departmentFilter: string;
  locationFilter: string;
  showProfilePicture: boolean;
  imageQuality: ImageQuality;
  cacheEnabled: boolean;
  cacheDuration: number;
}

export interface UseSpotlightEmployeesResult {
  employees: IHyperSpotlightEmployee[];
  loading: boolean;
  error: Error | undefined;
  refresh: () => void;
}

/**
 * Primary data hook for HyperSpotlight.
 * Orchestrates profile fetching, date filtering, sorting, photo loading,
 * and auto-refresh into a single consumable result.
 */
export function useSpotlightEmployees(
  options: UseSpotlightEmployeesOptions
): UseSpotlightEmployeesResult {
  const isManual = options.selectionMode === SelectionMode.Manual;
  const cacheTtl = options.cacheEnabled ? options.cacheDuration * 60 * 1000 : 0;

  // Fetch all users (automatic mode) or specific users (manual mode)
  const allProfiles = useGraphProfiles(isManual ? 0 : cacheTtl);
  const manualProfiles = useGraphProfilesByIds(
    isManual ? options.manualEmployeeIds : [],
    cacheTtl
  );

  const sourceProfiles = isManual ? manualProfiles : allProfiles;

  // Filter, enrich, and sort
  const processed = useMemo(function (): IHyperSpotlightEmployee[] {
    if (sourceProfiles.loading || sourceProfiles.profiles.length === 0) return [];

    let employees = sourceProfiles.profiles;

    if (isManual) {
      // Apply manual category assignments
      employees = applyManualCategories(employees, options.manualEmployeeCategories, options.category);
    } else {
      // Filter by category + date range
      const range = getDateRangeForEnum(options.dateRange, options.customStartDate, options.customEndDate);
      employees = filterEmployeesByDate(employees, options.category, range.start, range.end);

      // Assign category to filtered employees
      employees = employees.map(function (emp) {
        return mergeEmployee(emp, { assignedCategory: options.category });
      });
    }

    // Apply department/location filters
    employees = applyPropertyFilters(employees, options.departmentFilter, options.locationFilter);

    // Enrich with calculated fields
    employees = employees.map(function (emp) {
      if (emp.hireDate) {
        return mergeEmployee(emp, { yearsOfService: calculateYearsOfService(emp.hireDate) });
      }
      return emp;
    });

    // Sort
    employees = sortEmployees(employees, options.sortOrder);

    // Limit
    if (options.maxEmployees > 0 && employees.length > options.maxEmployees) {
      employees = employees.slice(0, options.maxEmployees);
    }

    return employees;
  }, [
    sourceProfiles.profiles,
    sourceProfiles.loading,
    isManual,
    options.category,
    options.dateRange,
    options.customStartDate,
    options.customEndDate,
    options.manualEmployeeCategories,
    options.departmentFilter,
    options.locationFilter,
    options.sortOrder,
    options.maxEmployees,
  ]);

  // Collect IDs for photo fetching
  const photoIds = useMemo(function () {
    return processed.map(function (e) { return e.id; });
  }, [processed]);

  const photos = useGraphPhotos(
    photoIds,
    options.imageQuality,
    options.showProfilePicture,
    cacheTtl
  );

  // Merge photos into employees
  const employeesWithPhotos = useMemo(function () {
    if (photos.loading || processed.length === 0) return processed;

    return processed.map(function (emp) {
      const photoUrl = photos.photoMap[emp.id];
      if (photoUrl) {
        return mergeEmployee(emp, { photoUrl: photoUrl });
      }
      return emp;
    });
  }, [processed, photos.photoMap, photos.loading]);

  // Combined refresh
  const refresh = useCallback(function () {
    sourceProfiles.refresh();
    photos.refresh();
  }, [sourceProfiles.refresh, photos.refresh]);

  // Auto-refresh
  useAutoRefresh(refresh, options.autoRefreshInterval, options.autoRefreshEnabled);

  // Combined loading/error
  const loading = sourceProfiles.loading || (options.showProfilePicture && photos.loading && processed.length > 0);
  const error = sourceProfiles.error;

  return {
    employees: employeesWithPhotos,
    loading: loading,
    error: error,
    refresh: refresh,
  };
}

/* ── Helper ── */

function applyManualCategories(
  employees: IHyperSpotlightEmployee[],
  categoriesJson: string,
  defaultCategory: SpotlightCategory
): IHyperSpotlightEmployee[] {
  let categoryMap: Record<string, string> = {};
  try {
    categoryMap = JSON.parse(categoriesJson || "{}");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    /* invalid JSON */
  }

  return employees.map(function (emp) {
    const cat = categoryMap[emp.id];
    return mergeEmployee(emp, {
      assignedCategory: cat ? (cat as SpotlightCategory) : defaultCategory,
    });
  });
}
