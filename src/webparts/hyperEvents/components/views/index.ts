import type { IHyperEvent } from "../../models";

/** Common props for all view components */
export interface IEventsViewProps {
  events: IHyperEvent[];
  selectedDate: Date;
  onEventClick: (eventId: string) => void;
}

export { default as MonthView } from "./MonthView";
export { default as WeekView } from "./WeekView";
export { default as DayView } from "./DayView";
export { default as AgendaView } from "./AgendaView";
export { default as TimelineView } from "./TimelineView";
export { default as CardGridView } from "./CardGridView";
