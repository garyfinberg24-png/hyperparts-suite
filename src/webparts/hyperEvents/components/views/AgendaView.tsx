import * as React from "react";
import { format, parseISO } from "date-fns";
import type { IEventsViewProps } from "./index";
import type { IHyperEvent } from "../../models";
import { formatEventTime, isToday } from "../../utils/dateUtils";
import styles from "./AgendaView.module.scss";

/** Group events by date for agenda display */
function groupByDate(events: IHyperEvent[]): Array<{ date: Date; label: string; events: IHyperEvent[] }> {
  const groups: Array<{ date: Date; label: string; events: IHyperEvent[] }> = [];
  const map = new Map<string, { date: Date; events: IHyperEvent[] }>();

  events.forEach(function (evt) {
    const d = parseISO(evt.startDate);
    const key = format(d, "yyyy-MM-dd");
    const existing = map.get(key);
    if (existing) {
      existing.events.push(evt);
    } else {
      map.set(key, { date: d, events: [evt] });
    }
  });

  map.forEach(function (val, _key) {
    const label = isToday(val.date)
      ? "Today - " + format(val.date, "EEEE, MMMM d")
      : format(val.date, "EEEE, MMMM d, yyyy");
    groups.push({ date: val.date, label: label, events: val.events });
  });

  groups.sort(function (a, b) {
    return a.date.getTime() - b.date.getTime();
  });

  return groups;
}

/** Grouped-by-date chronological list */
const AgendaView: React.FC<IEventsViewProps> = function (props) {
  const groups = React.useMemo(function () {
    return groupByDate(props.events);
  }, [props.events]);

  const children: React.ReactNode[] = [];

  groups.forEach(function (group) {
    const groupChildren: React.ReactNode[] = [];

    // Date header
    const headerClass = styles.agendaDateHeader +
      (isToday(group.date) ? " " + styles.agendaDateHeaderToday : "");
    groupChildren.push(
      React.createElement("div", {
        key: "header",
        className: headerClass,
      }, group.label)
    );

    // Event items
    group.events.forEach(function (evt) {
      const color = evt.sourceColor || evt.categoryColor || "#0078d4";
      const timeLabel = evt.isAllDay ? "All Day" : formatEventTime(evt.startDate) + " - " + formatEventTime(evt.endDate);

      groupChildren.push(
        React.createElement("div", {
          key: evt.id,
          className: styles.agendaItem,
          onClick: function () { props.onEventClick(evt.id); },
          role: "listitem",
          tabIndex: 0,
          "aria-label": evt.title + " " + timeLabel,
        },
          React.createElement("div", {
            className: styles.agendaItemColorBar,
            style: { backgroundColor: color },
          }),
          React.createElement("div", {
            className: styles.agendaItemTime,
          }, timeLabel),
          React.createElement("div", {
            className: styles.agendaItemContent,
          },
            React.createElement("div", { className: styles.agendaItemTitle }, evt.title),
            evt.location ? React.createElement("div", { className: styles.agendaItemLocation }, evt.location) : undefined
          )
        )
      );
    });

    children.push(
      React.createElement("div", {
        key: "group-" + format(group.date, "yyyy-MM-dd"),
        className: styles.agendaDateGroup,
      }, groupChildren)
    );
  });

  return React.createElement(
    "div",
    { className: styles.agendaView, role: "list", "aria-label": "Agenda" },
    children
  );
};

export default AgendaView;
