import * as React from "react";
import { format, parseISO } from "date-fns";
import type { IHyperEvent } from "../models";
import styles from "./HyperEventsPastArchive.module.scss";

export interface IHyperEventsPastArchiveProps {
  events: IHyperEvent[];
  onEventClick: (eventId: string) => void;
}

const PAGE_SIZE = 8;

/** Past events gallery grid with pagination */
const HyperEventsPastArchive: React.FC<IHyperEventsPastArchiveProps> = function (props) {
  const [page, setPage] = React.useState(1);

  // Filter to past events only (endDate < now), sorted descending
  const pastEvents = React.useMemo(function () {
    const now = Date.now();
    const past = props.events.filter(function (evt) {
      return new Date(evt.endDate).getTime() < now;
    });
    past.sort(function (a, b) {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
    return past;
  }, [props.events]);

  if (pastEvents.length === 0) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const totalPages = Math.ceil(pastEvents.length / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE;
  const pageEvents = pastEvents.slice(startIdx, startIdx + PAGE_SIZE);

  const cards: React.ReactNode[] = [];
  pageEvents.forEach(function (evt) {
    let dateLabel = "";
    try {
      dateLabel = format(parseISO(evt.startDate), "MMM d, yyyy");
    } catch {
      dateLabel = evt.startDate;
    }

    cards.push(
      React.createElement("div", {
        key: evt.id,
        className: styles.pastArchiveCard,
        onClick: function () { props.onEventClick(evt.id); },
        role: "button",
        tabIndex: 0,
        "aria-label": evt.title,
      },
        React.createElement("div", { className: styles.pastArchiveCardTitle }, evt.title),
        React.createElement("div", { className: styles.pastArchiveCardDate }, dateLabel)
      )
    );
  });

  const children: React.ReactNode[] = [];
  children.push(
    React.createElement("div", { key: "header", className: styles.pastArchiveHeader },
      "Past Events (" + String(pastEvents.length) + ")"
    )
  );
  children.push(
    React.createElement("div", { key: "grid", className: styles.pastArchiveGrid }, cards)
  );

  // Pagination
  if (totalPages > 1) {
    children.push(
      React.createElement("div", { key: "pag", className: styles.pastArchivePagination },
        React.createElement("button", {
          className: styles.pastArchivePaginationButton,
          disabled: page <= 1,
          onClick: function () { setPage(page - 1); },
          type: "button",
        }, "Previous"),
        React.createElement("span", undefined, "Page " + String(page) + " of " + String(totalPages)),
        React.createElement("button", {
          className: styles.pastArchivePaginationButton,
          disabled: page >= totalPages,
          onClick: function () { setPage(page + 1); },
          type: "button",
        }, "Next")
      )
    );
  }

  return React.createElement(
    "div",
    { className: styles.pastArchive },
    children
  );
};

export default HyperEventsPastArchive;
