import * as React from "react";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import styles from "./ProfileGradient.module.scss";

/**
 * ProfileGradient — Full gradient background with white text,
 * large bold typography, and outlined white pills for skills.
 * SaaS-style modern look with orange accent.
 */
const ProfileGradient: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const accent = props.accentColor || "#f97316";
  const initials =
    (profile.givenName ? profile.givenName.charAt(0) : "") +
    (profile.surname ? profile.surname.charAt(0) : "");

  const children: React.ReactNode[] = [];

  // --- Header: photo + name + title ---
  const photoShapeStyle = getPhotoShapeStyle(props.photoShape || "circle");
  const headerChildren: React.ReactNode[] = [];

  const photoStyle: React.CSSProperties = {};
  const shapeKeys = Object.keys(photoShapeStyle);
  shapeKeys.forEach(function (k) {
    (photoStyle as Record<string, unknown>)[k] = (photoShapeStyle as Record<string, unknown>)[k];
  });

  const photoEl = props.photoUrl
    ? React.createElement("img", {
        key: "photo",
        src: props.photoUrl,
        alt: profile.displayName,
        className: styles.photo,
        style: photoStyle,
      })
    : React.createElement(
        "div",
        {
          key: "initials",
          className: styles.initials,
          style: photoStyle,
        },
        initials
      );

  headerChildren.push(
    React.createElement(
      "div",
      { key: "photo-wrap", className: styles.photoWrapper },
      photoEl
    )
  );

  const nameChildren: React.ReactNode[] = [];
  nameChildren.push(
    React.createElement(
      "h2",
      { key: "name", className: styles.displayName },
      profile.displayName
    )
  );
  if (profile.jobTitle) {
    nameChildren.push(
      React.createElement(
        "div",
        { key: "title", className: styles.jobTitle },
        profile.jobTitle
      )
    );
  }
  if (profile.department) {
    nameChildren.push(
      React.createElement(
        "div",
        { key: "dept", className: styles.department },
        profile.department
      )
    );
  }

  headerChildren.push(
    React.createElement(
      "div",
      { key: "nameBlock", className: styles.nameBlock },
      nameChildren
    )
  );

  children.push(
    React.createElement(
      "div",
      { key: "header", className: styles.header },
      headerChildren
    )
  );

  // --- Personal slogan ---
  if (props.showSlogan && props.personal && props.personal.personalSlogan) {
    children.push(
      React.createElement(
        "div",
        { key: "slogan", className: styles.slogan },
        "\u201C" + props.personal.personalSlogan + "\u201D"
      )
    );
  }

  // --- Contact fields ---
  const fieldItems: React.ReactNode[] = [];
  if (profile.mail) {
    fieldItems.push(
      React.createElement(
        "div",
        { key: "mail", className: styles.fieldItem },
        React.createElement("span", { className: styles.fieldLabel }, "Email"),
        React.createElement("span", { className: styles.fieldValue }, profile.mail)
      )
    );
  }
  if (profile.mobilePhone) {
    fieldItems.push(
      React.createElement(
        "div",
        { key: "phone", className: styles.fieldItem },
        React.createElement("span", { className: styles.fieldLabel }, "Mobile"),
        React.createElement("span", { className: styles.fieldValue }, profile.mobilePhone)
      )
    );
  }
  if (profile.officeLocation) {
    fieldItems.push(
      React.createElement(
        "div",
        { key: "office", className: styles.fieldItem },
        React.createElement("span", { className: styles.fieldLabel }, "Office"),
        React.createElement("span", { className: styles.fieldValue }, profile.officeLocation)
      )
    );
  }
  if (profile.city) {
    fieldItems.push(
      React.createElement(
        "div",
        { key: "city", className: styles.fieldItem },
        React.createElement("span", { className: styles.fieldLabel }, "Location"),
        React.createElement("span", { className: styles.fieldValue }, profile.city)
      )
    );
  }

  if (fieldItems.length > 0) {
    children.push(
      React.createElement(
        "div",
        { key: "fields", className: styles.section },
        React.createElement("div", { className: styles.fieldsGrid }, fieldItems)
      )
    );
  }

  // --- Skills ---
  if (props.showSkills && props.skills.length > 0) {
    const skillTags: React.ReactNode[] = [];
    props.skills.forEach(function (skill) {
      const label =
        skill.name +
        (props.showEndorsements && skill.endorsementCount > 0
          ? " \u00B7 " + skill.endorsementCount
          : "");
      skillTags.push(
        React.createElement(
          "span",
          { key: skill.name, className: styles.skillPill },
          label
        )
      );
    });
    children.push(
      React.createElement(
        "div",
        { key: "skills", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Skills"),
        React.createElement("div", { className: styles.pillRow }, skillTags)
      )
    );
  }

  // --- Badges ---
  if (props.showBadges && props.badges.length > 0) {
    const badgeEls: React.ReactNode[] = [];
    props.badges.forEach(function (badge) {
      const badgeChildren: React.ReactNode[] = [];
      badgeChildren.push(
        React.createElement("span", { key: "icon", className: styles.badgeIcon }, badge.icon)
      );
      badgeChildren.push(
        React.createElement("span", { key: "name" }, badge.name)
      );
      if (props.showBadgeDescriptions && badge.description) {
        badgeChildren.push(
          React.createElement(
            "span",
            { key: "desc", className: styles.badgeDesc },
            badge.description
          )
        );
      }
      badgeEls.push(
        React.createElement(
          "span",
          { key: badge.id, className: styles.badgeItem },
          badgeChildren
        )
      );
    });
    children.push(
      React.createElement(
        "div",
        { key: "badges", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Recognition"),
        React.createElement("div", { className: styles.pillRow }, badgeEls)
      )
    );
  }

  // --- Hobbies ---
  if (props.showHobbies && props.personal && props.personal.hobbies.length > 0) {
    const hobbyEls: React.ReactNode[] = [];
    props.personal.hobbies.forEach(function (hobby) {
      hobbyEls.push(
        React.createElement(
          "span",
          { key: hobby, className: styles.hobbyPill },
          hobby
        )
      );
    });
    children.push(
      React.createElement(
        "div",
        { key: "hobbies", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Hobbies"),
        React.createElement("div", { className: styles.pillRow }, hobbyEls)
      )
    );
  }

  // --- Websites ---
  if (
    props.showWebsites &&
    props.personal &&
    props.personal.favoriteWebsites.length > 0
  ) {
    const siteEls: React.ReactNode[] = [];
    props.personal.favoriteWebsites.forEach(function (site) {
      siteEls.push(
        React.createElement(
          "a",
          {
            key: site.name,
            href: site.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: styles.websiteChip,
          },
          "\u2197 " + site.name
        )
      );
    });
    children.push(
      React.createElement(
        "div",
        { key: "websites", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Reads"),
        React.createElement("div", { className: styles.pillRow }, siteEls)
      )
    );
  }

  // --- Education ---
  if (
    props.showEducation &&
    props.personal &&
    props.personal.education.length > 0
  ) {
    const eduEls: React.ReactNode[] = [];
    props.personal.education.forEach(function (edu) {
      eduEls.push(
        React.createElement(
          "div",
          { key: edu.institution, className: styles.educationItem },
          React.createElement(
            "span",
            { className: styles.educationDegree },
            edu.degree + (edu.field ? " in " + edu.field : "")
          ),
          " \u2014 " +
            edu.institution +
            (edu.yearCompleted ? " (" + edu.yearCompleted + ")" : "")
        )
      );
    });
    children.push(
      React.createElement(
        "div",
        { key: "education", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Education"),
        eduEls
      )
    );
  }

  // --- Manager ---
  if (props.showManager && props.manager) {
    children.push(
      React.createElement(
        "div",
        { key: "manager", className: styles.managerSection },
        React.createElement(
          "span",
          { className: styles.managerLabel },
          "Reports to"
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: styles.managerButton,
            onClick: function () {
              if (props.manager && props.manager.mail) {
                window.open("mailto:" + props.manager.mail, "_blank");
              }
            },
          },
          props.manager.displayName
        )
      )
    );
  }

  // Build gradient background style from accent color
  const containerStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, " + accent + ", #ea580c)",
  };

  return React.createElement(
    "div",
    {
      className: styles.gradientCard,
      style: containerStyle,
      role: "region",
      "aria-label": "Profile of " + profile.displayName,
    },
    children
  );
};

export default ProfileGradient;
