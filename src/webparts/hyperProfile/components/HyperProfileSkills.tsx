import * as React from "react";
import type { IProfileSkill } from "../models/IHyperProfileSkill";
import type { SkillDisplayStyle } from "../models/IHyperProfileSkill";
import styles from "./HyperProfileSkills.module.scss";

export interface IHyperProfileSkillsProps {
  skills: IProfileSkill[];
  displayStyle: SkillDisplayStyle;
  showEndorsements: boolean;
  accentColor: string;
  onSkillClick?: (skillName: string) => void;
}

const HyperProfileSkills: React.FC<IHyperProfileSkillsProps> = function (props) {
  if (!props.skills || props.skills.length === 0) {
    return React.createElement("span", undefined);
  }

  const accentColor = props.accentColor || "#0078d4";

  // Tags display style
  if (props.displayStyle === "tags" || !props.displayStyle) {
    const tags: React.ReactNode[] = [];
    props.skills.forEach(function (skill) {
      const tagStyle: React.CSSProperties = {
        borderColor: accentColor,
        color: accentColor,
      };
      tags.push(
        React.createElement("button", {
          key: skill.name,
          type: "button",
          className: styles.skillTag,
          style: tagStyle,
          onClick: function () {
            if (props.onSkillClick) props.onSkillClick(skill.name);
          },
          "aria-label": skill.name + (props.showEndorsements ? ", " + skill.endorsementCount + " endorsements" : ""),
        },
          React.createElement("span", { className: styles.skillName }, skill.name),
          props.showEndorsements && skill.endorsementCount > 0
            ? React.createElement("span", { className: styles.endorsementBadge, style: { backgroundColor: accentColor } }, String(skill.endorsementCount))
            : undefined
        )
      );
    });
    return React.createElement("div", { className: styles.tagsContainer, role: "list", "aria-label": "Skills" }, tags);
  }

  // Bars display style
  if (props.displayStyle === "bars") {
    const bars: React.ReactNode[] = [];
    props.skills.forEach(function (skill) {
      const percent = Math.round((skill.level / 5) * 100);
      bars.push(
        React.createElement("div", { key: skill.name, className: styles.barItem, role: "listitem" },
          React.createElement("div", { className: styles.barHeader },
            React.createElement("span", { className: styles.barSkillName }, skill.name),
            props.showEndorsements && skill.endorsementCount > 0
              ? React.createElement("span", { className: styles.barEndorsement }, skill.endorsementCount + " endorsements")
              : undefined
          ),
          React.createElement("div", { className: styles.barTrack },
            React.createElement("div", {
              className: styles.barFill,
              style: { width: percent + "%", backgroundColor: accentColor },
              role: "meter",
              "aria-valuenow": skill.level,
              "aria-valuemin": 0,
              "aria-valuemax": 5,
              "aria-label": skill.name + " proficiency",
            })
          )
        )
      );
    });
    return React.createElement("div", { className: styles.barsContainer, role: "list", "aria-label": "Skills" }, bars);
  }

  // List display style
  if (props.displayStyle === "list") {
    const items: React.ReactNode[] = [];
    props.skills.forEach(function (skill) {
      const dots: React.ReactNode[] = [];
      for (let i = 1; i <= 5; i++) {
        dots.push(
          React.createElement("span", {
            key: "dot-" + i,
            className: i <= skill.level ? styles.dotFilled : styles.dotEmpty,
            style: i <= skill.level ? { backgroundColor: accentColor } : undefined,
          })
        );
      }
      items.push(
        React.createElement("div", { key: skill.name, className: styles.listItem, role: "listitem" },
          React.createElement("span", { className: styles.listSkillName }, skill.name),
          React.createElement("span", { className: styles.listDots }, dots),
          props.showEndorsements && skill.endorsementCount > 0
            ? React.createElement("span", { className: styles.listEndorsement }, "(" + skill.endorsementCount + ")")
            : undefined
        )
      );
    });
    return React.createElement("div", { className: styles.listContainer, role: "list", "aria-label": "Skills" }, items);
  }

  // Radar (fallback to tags for now - would need SVG canvas)
  const fallbackTags: React.ReactNode[] = [];
  props.skills.forEach(function (skill) {
    fallbackTags.push(
      React.createElement("span", { key: skill.name, className: styles.skillTag, style: { borderColor: accentColor, color: accentColor } },
        skill.name
      )
    );
  });
  return React.createElement("div", { className: styles.tagsContainer, role: "list", "aria-label": "Skills" }, fallbackTags);
};

export default HyperProfileSkills;
