import { useMemo } from "react";
import {
  startOfMonth,
  startOfWeek,
  eachDayOfInterval,
} from "date-fns";
import type { ICelebration } from "../models";
import { parseMmDd } from "../utils/dateHelpers";

export interface ICalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  celebrations: ICelebration[];
}

/**
 * Build a 7-column calendar grid for a given month.
 * Returns 6 weeks of days (42 cells).
 */
export function useCelebrationCalendar(
  celebrations: ICelebration[],
  year: number,
  month: number
): ICalendarDay[][] {
  return useMemo(function () {
    const monthDate = new Date(year, month, 1);
    const monthStart = startOfMonth(monthDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });

    // Build 42 days (6 rows x 7 cols)
    const days = eachDayOfInterval({
      start: gridStart,
      end: new Date(gridStart.getTime() + 41 * 24 * 60 * 60 * 1000),
    });

    const now = new Date();
    const todayStr = String(now.getFullYear()) + "-" + String(now.getMonth()) + "-" + String(now.getDate());

    // Build celebration lookup by day-of-month in the target month
    const dayMap: Record<number, ICelebration[]> = {};
    celebrations.forEach(function (c) {
      const parsed = parseMmDd(c.celebrationDate);
      if (parsed && parsed.month === month) {
        if (!dayMap[parsed.day]) {
          dayMap[parsed.day] = [];
        }
        dayMap[parsed.day].push(c);
      }
    });

    // Build rows
    const rows: ICalendarDay[][] = [];
    let currentRow: ICalendarDay[] = [];

    days.forEach(function (day, index) {
      const dayOfMonth = day.getDate();
      const isCurrentMonth = day.getMonth() === month && day.getFullYear() === year;
      const dayStr = String(day.getFullYear()) + "-" + String(day.getMonth()) + "-" + String(day.getDate());
      const isDayToday = dayStr === todayStr;

      const dayCelebrations: ICelebration[] = isCurrentMonth && dayMap[dayOfMonth]
        ? dayMap[dayOfMonth]
        : [];

      currentRow.push({
        date: day,
        dayOfMonth: dayOfMonth,
        isCurrentMonth: isCurrentMonth,
        isToday: isDayToday,
        celebrations: dayCelebrations,
      });

      if (currentRow.length === 7) {
        rows.push(currentRow);
        currentRow = [];
      }
    });

    // If we have a partial row, push it
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }, [celebrations, year, month]);
}
