/** Calendar time slot status */
export type CalendarSlotStatus = "free" | "busy" | "tentative" | "oof";

/** Single time slot in a calendar day */
export interface ICalendarSlot {
  startTime: string;
  endTime: string;
  status: CalendarSlotStatus;
  subject?: string;
}

/** A single calendar day with its time slots */
export interface ICalendarDay {
  date: string;
  dayLabel: string;
  slots: ICalendarSlot[];
}
