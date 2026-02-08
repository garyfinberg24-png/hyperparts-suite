import * as React from "react";
import type { ICelebration } from "../models";
import { categorizeCelebrations } from "../utils/celebrationUtils";
import HyperBirthdaysCard from "./HyperBirthdaysCard";
import styles from "./HyperBirthdaysUpcomingList.module.scss";

export interface IHyperBirthdaysUpcomingListProps {
  celebrations: ICelebration[];
  photoMap: Record<string, string>;
  photoSize: number;
  enableTeamsDeepLink: boolean;
  enableMilestoneBadges: boolean;
  sendWishesLabel: string;
  todayLabel: string;
  thisWeekLabel: string;
  thisMonthLabel: string;
  onSelectCelebration: (id: string) => void;
}

const HyperBirthdaysUpcomingList: React.FC<IHyperBirthdaysUpcomingListProps> = function (props) {
  const categorized = React.useMemo(function () {
    return categorizeCelebrations(props.celebrations);
  }, [props.celebrations]);

  function renderSection(label: string, items: ICelebration[]): React.ReactNode {
    if (items.length === 0) {
      // eslint-disable-next-line @rushstack/no-new-null
      return null;
    }

    const cardElements: React.ReactNode[] = [];
    items.forEach(function (c) {
      cardElements.push(
        React.createElement(HyperBirthdaysCard, {
          key: c.id,
          celebration: c,
          photoUrl: props.photoMap[c.userId] || "",
          photoSize: props.photoSize,
          enableTeamsDeepLink: props.enableTeamsDeepLink,
          enableMilestoneBadges: props.enableMilestoneBadges,
          sendWishesLabel: props.sendWishesLabel,
          onClick: function (): void { props.onSelectCelebration(c.id); },
        })
      );
    });

    return React.createElement(
      "div",
      { key: label },
      React.createElement("div", { className: styles.sectionHeader }, label),
      React.createElement("div", { className: styles.sectionItems }, cardElements)
    );
  }

  const sections: React.ReactNode[] = [];
  const todaySection = renderSection(props.todayLabel, categorized.today);
  if (todaySection) sections.push(todaySection);
  const weekSection = renderSection(props.thisWeekLabel, categorized.thisWeek);
  if (weekSection) sections.push(weekSection);
  const monthSection = renderSection(props.thisMonthLabel, categorized.thisMonth);
  if (monthSection) sections.push(monthSection);

  return React.createElement(
    "div",
    { className: styles.listContainer, role: "list" },
    sections
  );
};

export default HyperBirthdaysUpcomingList;
