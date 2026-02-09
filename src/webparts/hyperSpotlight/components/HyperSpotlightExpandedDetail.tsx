import * as React from "react";
import type { IHyperSpotlightEmployee } from "../models";
import { getHobbyIcon, getTimeSinceHire } from "../models";
import styles from "./HyperSpotlightCard.module.scss";

export interface IExpandedDetailProps {
  employee: IHyperSpotlightEmployee;
  showPersonalQuote: boolean;
  showHobbies: boolean;
  showSkillset: boolean;
  showFavoriteWebsites: boolean;
  showHireDate: boolean;
}

/**
 * Expandable "Get to Know Me" section for employee cards.
 * Shows personal quote, hobbies (with icons), skills, websites, hire date.
 */
const HyperSpotlightExpandedDetail: React.FC<IExpandedDetailProps> = function (props) {
  const emp = props.employee;
  const children: React.ReactNode[] = [];

  // Personal quote
  if (props.showPersonalQuote && emp.personalQuote) {
    children.push(
      React.createElement("div", { key: "quote", className: styles.expandedQuote },
        React.createElement("span", { className: styles.expandedQuoteIcon, "aria-hidden": "true" }, "\u201C"),
        React.createElement("p", { className: styles.expandedQuoteText }, emp.personalQuote),
        React.createElement("span", { className: styles.expandedQuoteIcon, "aria-hidden": "true" }, "\u201D")
      )
    );
  }

  // Hobbies with icons
  if (props.showHobbies && emp.hobbies && emp.hobbies.length > 0) {
    const hobbyTags: React.ReactNode[] = [];
    emp.hobbies.forEach(function (hobby, idx) {
      hobbyTags.push(
        React.createElement("span", { key: idx, className: styles.expandedHobbyTag },
          React.createElement("span", { "aria-hidden": "true" }, getHobbyIcon(hobby)),
          " " + hobby
        )
      );
    });
    children.push(
      React.createElement("div", { key: "hobbies", className: styles.expandedSection },
        React.createElement("div", { className: styles.expandedSectionLabel }, "Hobbies & Interests"),
        React.createElement("div", { className: styles.expandedTags }, hobbyTags)
      )
    );
  }

  // Skillset
  if (props.showSkillset && emp.skillset && emp.skillset.length > 0) {
    const skillTags: React.ReactNode[] = [];
    emp.skillset.forEach(function (skill, idx) {
      skillTags.push(
        React.createElement("span", { key: idx, className: styles.expandedSkillTag }, skill)
      );
    });
    children.push(
      React.createElement("div", { key: "skills", className: styles.expandedSection },
        React.createElement("div", { className: styles.expandedSectionLabel }, "Skills"),
        React.createElement("div", { className: styles.expandedTags }, skillTags)
      )
    );
  }

  // Favorite websites
  if (props.showFavoriteWebsites && emp.favoriteWebsites && emp.favoriteWebsites.length > 0) {
    const websiteLinks: React.ReactNode[] = [];
    emp.favoriteWebsites.forEach(function (site, idx) {
      websiteLinks.push(
        React.createElement("a", {
          key: idx,
          href: site.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: styles.expandedWebsiteLink,
          onClick: function (e: React.MouseEvent) { e.stopPropagation(); },
        }, site.title)
      );
    });
    children.push(
      React.createElement("div", { key: "websites", className: styles.expandedSection },
        React.createElement("div", { className: styles.expandedSectionLabel }, "Favorite Websites"),
        React.createElement("div", { className: styles.expandedTags }, websiteLinks)
      )
    );
  }

  // Hire date with relative time
  if (props.showHireDate && emp.hireDate) {
    const timeSince = getTimeSinceHire(emp.hireDate);
    children.push(
      React.createElement("div", { key: "hire", className: styles.expandedHireDate },
        React.createElement("span", { "aria-hidden": "true" }, "\uD83D\uDCC5"),
        " Joined " + timeSince
      )
    );
  }

  if (children.length === 0) return React.createElement(React.Fragment);

  return React.createElement("div", { className: styles.expandedDetail }, children);
};

export default HyperSpotlightExpandedDetail;
