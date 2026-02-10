import * as React from "react";
import { getContext } from "../../../common/services/HyperPnP";
import { hyperCache } from "../../../common/services/HyperCache";
import type { ICalendarDay, ICalendarSlot, CalendarSlotStatus } from "../models/IHyperProfileCalendar";

export interface ICalendarAvailabilityResult {
  calendar: ICalendarDay[];
  loading: boolean;
  error: Error | undefined;
}

/**
 * Hook to fetch calendar availability for the next N days from Microsoft Graph.
 * Uses /users/{id}/calendarView for free/busy.
 */
export function useCalendarAvailability(
  userId: string | undefined,
  enabled: boolean,
  daysAhead: number
): ICalendarAvailabilityResult {
  const [calendar, setCalendar] = React.useState<ICalendarDay[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  React.useEffect(function () {
    if (!enabled || !userId) {
      setCalendar([]);
      return undefined;
    }

    let cancelled = false;
    const capturedUserId = userId;
    const cacheKey = "hyperProfile_calendar_" + capturedUserId;

    async function fetchCalendar(): Promise<void> {
      setLoading(true);

      try {
        const cached = await hyperCache.get<ICalendarDay[]>(cacheKey);
        if (cached && !cancelled) {
          setCalendar(cached);
          setLoading(false);
          return;
        }

        const ctx = getContext();
        const client = await ctx.msGraphClientFactory.getClient("3");

        // Build date range
        const now = new Date();
        const endDate = new Date(now.getTime() + (daysAhead || 5) * 24 * 60 * 60 * 1000);

        const startISO = now.toISOString();
        const endISO = endDate.toISOString();

        // Fetch calendar events using calendarView
        const endpoint = "/users/" + encodeURIComponent(capturedUserId) + "/calendarView";
        const eventsRaw = await client.api(endpoint)
          .query({
            startDateTime: startISO,
            endDateTime: endISO,
            "$select": "subject,start,end,showAs,isAllDay",
            "$orderby": "start/dateTime",
            "$top": "100",
          })
          .get();

        if (cancelled) return;

        const events = eventsRaw.value || [];

        // Build day map
        const dayMap: Record<string, ICalendarSlot[]> = {};

        events.forEach(function (ev: Record<string, unknown>) {
          const startObj = ev.start as Record<string, string> | undefined;
          const endObj = ev.end as Record<string, string> | undefined;
          if (!startObj || !endObj) return;

          const startStr = startObj.dateTime || "";
          const endStr = endObj.dateTime || "";
          const dateKey = startStr.substring(0, 10); // YYYY-MM-DD

          if (!dayMap[dateKey]) {
            dayMap[dateKey] = [];
          }

          // Map Graph showAs to our CalendarSlotStatus
          let status: CalendarSlotStatus = "busy";
          const showAs = String(ev.showAs || "busy");
          if (showAs === "free") status = "free";
          else if (showAs === "tentative") status = "tentative";
          else if (showAs === "oof") status = "oof";
          // workingElsewhere maps to busy in our model

          dayMap[dateKey].push({
            startTime: startStr.substring(11, 16), // HH:MM
            endTime: endStr.substring(11, 16),
            status: status,
            subject: ev.subject ? String(ev.subject) : undefined,
          });
        });

        // Build calendar days
        const days: ICalendarDay[] = [];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const numDays = daysAhead || 5;
        for (let d = 0; d < numDays; d++) {
          const date = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
          const dateKey = date.toISOString().substring(0, 10);

          days.push({
            date: dateKey,
            dayLabel: dayNames[date.getDay()],
            slots: dayMap[dateKey] || [],
          });
        }

        if (!cancelled) {
          setCalendar(days);
          await hyperCache.set(cacheKey, days, 180); // 3 min cache
          setError(undefined);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setCalendar([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCalendar().catch(function () { /* handled inside */ });
    return function () { cancelled = true; };
  }, [userId, enabled, daysAhead]);

  return { calendar: calendar, loading: loading, error: error };
}
