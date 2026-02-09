import * as React from "react";
import type { IHyperSpotlightEmployee } from "../../models";
import type { ITimelineSettings } from "../../models";
import { DEFAULT_TIMELINE_SETTINGS, getTimeSinceHire, getHobbyIcon } from "../../models";
import type { IHyperSpotlightCardProps } from "../HyperSpotlightCard";
import styles from "./TimelineLayout.module.scss";

export interface ITimelineLayoutProps extends Omit<IHyperSpotlightCardProps, "employee"> {
  employees: IHyperSpotlightEmployee[];
  timelineSettings?: ITimelineSettings;
}

/**
 * TimelineLayout — Vertical connector with date markers and expand/collapse cards.
 * Ported from JML renderTimelineView.
 */
const TimelineLayout: React.FC<ITimelineLayoutProps> = function (props) {
  const settings = props.timelineSettings || DEFAULT_TIMELINE_SETTINGS;

  // Track which cards are expanded (by employee id)
  const expandedState = React.useState<Record<string, boolean>>(function () {
    if (settings.expandAllDefault) {
      const initial: Record<string, boolean> = {};
      props.employees.forEach(function (emp) {
        initial[emp.id] = true;
      });
      return initial;
    }
    return {};
  });
  const expanded = expandedState[0];
  const setExpanded = expandedState[1];

  const toggleExpand = React.useCallback(function (empId: string): void {
    setExpanded(function (prev) {
      const next: Record<string, boolean> = {};
      Object.keys(prev).forEach(function (k) { next[k] = prev[k]; });
      next[empId] = !prev[empId];
      return next;
    });
  }, []);

  if (props.employees.length === 0) return React.createElement("div", undefined, "No employees");

  // Build timeline items
  const items: React.ReactNode[] = [];

  props.employees.forEach(function (emp, index) {
    const isExpanded = !!expanded[emp.id];
    const timeSince = getTimeSinceHire(emp.hireDate);

    // Item children
    const itemChildren: React.ReactNode[] = [];

    // Marker
    if (settings.showConnector) {
      itemChildren.push(
        React.createElement("div", { key: "marker", className: styles.timelineMarker },
          React.createElement("div", { className: styles.timelineMarkerDot })
        )
      );
    }

    // Date column
    if (emp.hireDate) {
      const dateStr = new Date(emp.hireDate).toLocaleDateString();
      itemChildren.push(
        React.createElement("div", { key: "date", className: styles.timelineDateCol },
          React.createElement("div", { className: styles.timelineDateText }, dateStr),
          timeSince ? React.createElement("div", { className: styles.timelineTimeAgo }, timeSince) : undefined
        )
      );
    }

    // Card
    const cardHeaderChildren: React.ReactNode[] = [];

    // Photo
    if (props.showProfilePicture) {
      const pic = emp.photoUrl
        ? React.createElement("img", {
            src: emp.photoUrl,
            alt: emp.displayName,
            className: styles.timelinePhoto,
            loading: props.lazyLoadImages ? "lazy" : "eager",
          })
        : React.createElement("div", { className: styles.timelinePhotoPlaceholder },
            emp.displayName.charAt(0)
          );
      cardHeaderChildren.push(React.createElement("div", { key: "photo", className: styles.timelinePhotoWrap }, pic));
    }

    // Info section in header
    const infoChildren: React.ReactNode[] = [];
    if (props.showEmployeeName) {
      const nameContent: React.ReactNode[] = [emp.displayName];
      if (emp.nickname) {
        nameContent.push(
          React.createElement("span", { key: "nick", className: styles.timelineNickname }, " \"" + emp.nickname + "\"")
        );
      }
      infoChildren.push(React.createElement("h3", { key: "name", className: styles.timelineEmpName }, nameContent));
    }
    if (props.showJobTitle && emp.jobTitle) {
      infoChildren.push(React.createElement("div", { key: "title", className: styles.timelineEmpTitle }, emp.jobTitle));
    }
    if (props.showDepartment && emp.department) {
      infoChildren.push(React.createElement("div", { key: "dept", className: styles.timelineEmpDept }, emp.department));
    }
    cardHeaderChildren.push(React.createElement("div", { key: "info", className: styles.timelineInfo }, infoChildren));

    // Expand/collapse chevron
    cardHeaderChildren.push(
      React.createElement("button", {
        key: "toggle",
        className: styles.timelineExpandBtn,
        onClick: function () { toggleExpand(emp.id); },
        "aria-label": isExpanded ? "Collapse details" : "Expand details",
        "aria-expanded": isExpanded,
        type: "button",
      }, isExpanded ? "\u25B2" : "\u25BC")
    );

    const cardChildren: React.ReactNode[] = [];
    cardChildren.push(
      React.createElement("div", {
        key: "header",
        className: styles.timelineCardHeader,
        onClick: function () { toggleExpand(emp.id); },
        role: "button",
        tabIndex: 0,
        onKeyDown: function (e: React.KeyboardEvent) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpand(emp.id);
          }
        },
      }, cardHeaderChildren)
    );

    // Expanded detail section
    if (isExpanded) {
      const detailChildren: React.ReactNode[] = [];

      // Personal quote
      if (emp.personalQuote) {
        detailChildren.push(
          React.createElement("div", { key: "quote", className: styles.timelineQuote },
            React.createElement("span", { className: styles.timelineQuoteIcon, "aria-hidden": "true" }, "\u201C"),
            React.createElement("p", undefined, emp.personalQuote),
            React.createElement("span", { className: styles.timelineQuoteIcon, "aria-hidden": "true" }, "\u201D")
          )
        );
      }

      // Hobbies with icons
      if (emp.hobbies && emp.hobbies.length > 0) {
        const hobbyItems: React.ReactNode[] = [];
        emp.hobbies.forEach(function (hobby, idx) {
          hobbyItems.push(
            React.createElement("span", { key: idx, className: styles.timelineHobbyBadge },
              React.createElement("span", { "aria-hidden": "true" }, getHobbyIcon(hobby)),
              " " + hobby
            )
          );
        });
        detailChildren.push(
          React.createElement("div", { key: "hobbies", className: styles.timelineSection },
            React.createElement("strong", undefined, "Hobbies & Interests:"),
            React.createElement("div", { className: styles.timelineHobbies }, hobbyItems)
          )
        );
      }

      // Skillset
      if (emp.skillset && emp.skillset.length > 0) {
        const skillItems: React.ReactNode[] = [];
        emp.skillset.forEach(function (skill, idx) {
          skillItems.push(
            React.createElement("span", { key: idx, className: styles.timelineSkillBadge }, skill)
          );
        });
        detailChildren.push(
          React.createElement("div", { key: "skills", className: styles.timelineSection },
            React.createElement("strong", undefined, "Skills:"),
            React.createElement("div", { className: styles.timelineSkills }, skillItems)
          )
        );
      }

      // Websites
      if (emp.favoriteWebsites && emp.favoriteWebsites.length > 0) {
        const websiteItems: React.ReactNode[] = [];
        emp.favoriteWebsites.forEach(function (site, idx) {
          websiteItems.push(
            React.createElement("a", {
              key: idx,
              href: site.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: styles.timelineWebsiteBadge,
            }, site.title)
          );
        });
        detailChildren.push(
          React.createElement("div", { key: "websites", className: styles.timelineSection },
            React.createElement("strong", undefined, "Favorite Websites:"),
            React.createElement("div", { className: styles.timelineWebsites }, websiteItems)
          )
        );
      }

      cardChildren.push(
        React.createElement("div", { key: "details", className: styles.timelineDetails }, detailChildren)
      );
    }

    itemChildren.push(
      React.createElement("div", { key: "card", className: styles.timelineCard }, cardChildren)
    );

    items.push(
      React.createElement("div", {
        key: emp.id || index,
        className: styles.timelineItem + (settings.compactMode ? " " + styles.timelineItemCompact : ""),
      }, itemChildren)
    );
  });

  return React.createElement(
    "div",
    {
      className: styles.timelineContainer + (settings.showConnector ? " " + styles.withConnector : ""),
      role: "list",
      "aria-label": "Employee spotlight timeline",
    },
    items
  );
};

export default TimelineLayout;
