import * as React from "react";
import type { IProfilePersonal } from "../models/IHyperProfilePersonal";
import styles from "./HyperProfilePersonal.module.scss";

export interface IHyperProfilePersonalProps {
  personal: IProfilePersonal;
  showHobbies: boolean;
  showSlogan: boolean;
  showWebsites: boolean;
  showEducation: boolean;
  showInterests: boolean;
  showFunFacts: boolean;
  accentColor: string;
}

const HyperProfilePersonal: React.FC<IHyperProfilePersonalProps> = function (props) {
  const p = props.personal;
  const sections: React.ReactNode[] = [];

  // Personal Slogan
  if (props.showSlogan && p.personalSlogan) {
    sections.push(
      React.createElement("div", { key: "slogan", className: styles.sloganSection },
        React.createElement("div", { className: styles.sectionHeader }, "Personal Slogan"),
        React.createElement("blockquote", { className: styles.sloganQuote },
          "\u201C" + p.personalSlogan + "\u201D"
        )
      )
    );
  }

  // Hobbies
  if (props.showHobbies && p.hobbies.length > 0) {
    const hobbyPills: React.ReactNode[] = [];
    p.hobbies.forEach(function (hobby) {
      hobbyPills.push(
        React.createElement("span", {
          key: hobby,
          className: styles.pill,
          style: { borderColor: props.accentColor + "40" },
        }, hobby)
      );
    });
    sections.push(
      React.createElement("div", { key: "hobbies", className: styles.personalSection },
        React.createElement("div", { className: styles.sectionHeader }, "\uD83C\uDFA8 Hobbies"),
        React.createElement("div", { className: styles.pillContainer }, hobbyPills)
      )
    );
  }

  // Interests
  if (props.showInterests && p.interests.length > 0) {
    const interestPills: React.ReactNode[] = [];
    p.interests.forEach(function (interest) {
      interestPills.push(
        React.createElement("span", {
          key: interest,
          className: styles.pill + " " + styles.interestPill,
          style: { backgroundColor: props.accentColor + "15" },
        }, interest)
      );
    });
    sections.push(
      React.createElement("div", { key: "interests", className: styles.personalSection },
        React.createElement("div", { className: styles.sectionHeader }, "\uD83D\uDCA1 Interests"),
        React.createElement("div", { className: styles.pillContainer }, interestPills)
      )
    );
  }

  // Favorite Websites
  if (props.showWebsites && p.favoriteWebsites.length > 0) {
    const siteChips: React.ReactNode[] = [];
    p.favoriteWebsites.forEach(function (site) {
      siteChips.push(
        React.createElement("a", {
          key: site.name,
          href: site.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: styles.websiteChip,
        },
          React.createElement("span", { className: styles.websiteIcon }, "\u2197"),
          React.createElement("span", undefined, site.name)
        )
      );
    });
    sections.push(
      React.createElement("div", { key: "websites", className: styles.personalSection },
        React.createElement("div", { className: styles.sectionHeader }, "\uD83C\uDF10 Reads & Links"),
        React.createElement("div", { className: styles.pillContainer }, siteChips)
      )
    );
  }

  // Education
  if (props.showEducation && p.education.length > 0) {
    const eduItems: React.ReactNode[] = [];
    p.education.forEach(function (edu) {
      const degreeText = edu.degree + (edu.field ? " in " + edu.field : "");
      const yearText = edu.yearCompleted ? " (" + edu.yearCompleted + ")" : "";
      eduItems.push(
        React.createElement("div", { key: edu.institution, className: styles.educationItem },
          React.createElement("div", { className: styles.educationIcon }, "\uD83C\uDF93"),
          React.createElement("div", { className: styles.educationDetails },
            React.createElement("div", { className: styles.educationDegree }, degreeText),
            React.createElement("div", { className: styles.educationInstitution }, edu.institution + yearText)
          )
        )
      );
    });
    sections.push(
      React.createElement("div", { key: "education", className: styles.personalSection },
        React.createElement("div", { className: styles.sectionHeader }, "\uD83C\uDF93 Education"),
        React.createElement("div", { className: styles.educationList }, eduItems)
      )
    );
  }

  // Fun Facts
  if (props.showFunFacts && p.funFacts.length > 0) {
    const factItems: React.ReactNode[] = [];
    p.funFacts.forEach(function (fact, idx) {
      factItems.push(
        React.createElement("div", { key: "fact-" + idx, className: styles.funFact },
          React.createElement("span", { className: styles.funFactIcon }, "\u26A1"),
          React.createElement("span", undefined, fact)
        )
      );
    });
    sections.push(
      React.createElement("div", { key: "funfacts", className: styles.personalSection },
        React.createElement("div", { className: styles.sectionHeader }, "\u26A1 Fun Facts"),
        React.createElement("div", { className: styles.funFactsList }, factItems)
      )
    );
  }

  if (sections.length === 0) {
    return React.createElement("span", undefined);
  }

  return React.createElement("div", {
    className: styles.personalContainer,
    role: "region",
    "aria-label": "Personal Information",
  }, sections);
};

export default HyperProfilePersonal;
