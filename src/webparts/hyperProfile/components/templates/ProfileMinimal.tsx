import * as React from "react";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import styles from "./ProfileMinimal.module.scss";

/**
 * ProfileMinimal — Ultra clean design with lots of whitespace.
 * Only photo, name, title visible initially.
 * On hover (via CSS max-height transition), additional details reveal.
 */
const ProfileMinimal: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const initials =
    (profile.givenName ? profile.givenName.charAt(0) : "") +
    (profile.surname ? profile.surname.charAt(0) : "");

  const children: React.ReactNode[] = [];

  const photoShapeStyle = getPhotoShapeStyle(props.photoShape || "circle");

  const photoStyle: React.CSSProperties = {};
  const shapeKeys = Object.keys(photoShapeStyle);
  shapeKeys.forEach(function (k) {
    (photoStyle as Record<string, unknown>)[k] = (photoShapeStyle as Record<string, unknown>)[k];
  });

  // --- Always visible: photo + name + title ---
  const primaryChildren: React.ReactNode[] = [];

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

  primaryChildren.push(
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

  primaryChildren.push(
    React.createElement(
      "div",
      { key: "nameBlock", className: styles.nameBlock },
      nameChildren
    )
  );

  // Two action items always visible
  const actions: React.ReactNode[] = [];
  if (profile.mail) {
    actions.push(
      React.createElement(
        "a",
        {
          key: "email",
          href: "mailto:" + profile.mail,
          className: styles.actionLink,
          "aria-label": "Send email to " + profile.displayName,
        },
        "Email"
      )
    );
  }
  if (profile.mobilePhone) {
    actions.push(
      React.createElement(
        "a",
        {
          key: "phone",
          href: "tel:" + profile.mobilePhone,
          className: styles.actionLink,
          "aria-label": "Call " + profile.displayName,
        },
        "Call"
      )
    );
  }
  if (actions.length > 0) {
    primaryChildren.push(
      React.createElement(
        "div",
        { key: "actions", className: styles.actionsRow },
        actions
      )
    );
  }

  children.push(
    React.createElement(
      "div",
      { key: "primary", className: styles.primarySection },
      primaryChildren
    )
  );

  // --- Reveal section: hidden until hover ---
  const revealChildren: React.ReactNode[] = [];

  // Slogan
  if (props.showSlogan && props.personal && props.personal.personalSlogan) {
    revealChildren.push(
      React.createElement(
        "div",
        { key: "slogan", className: styles.slogan },
        props.personal.personalSlogan
      )
    );
  }

  // Department / Office / City
  const detailParts: string[] = [];
  if (profile.department) {
    detailParts.push(profile.department);
  }
  if (profile.officeLocation) {
    detailParts.push(profile.officeLocation);
  }
  if (profile.city) {
    detailParts.push(profile.city);
  }
  if (detailParts.length > 0) {
    revealChildren.push(
      React.createElement(
        "div",
        { key: "details", className: styles.detailLine },
        detailParts.join(" \u00B7 ")
      )
    );
  }

  // Skills
  if (props.showSkills && props.skills.length > 0) {
    const skillEls: React.ReactNode[] = [];
    props.skills.forEach(function (skill) {
      const label =
        skill.name +
        (props.showEndorsements && skill.endorsementCount > 0
          ? " \u00B7 " + skill.endorsementCount
          : "");
      skillEls.push(
        React.createElement(
          "span",
          { key: skill.name, className: styles.tag },
          label
        )
      );
    });
    revealChildren.push(
      React.createElement(
        "div",
        { key: "skills", className: styles.revealSection },
        React.createElement("div", { className: styles.sectionLabel }, "Skills"),
        React.createElement("div", { className: styles.tagRow }, skillEls)
      )
    );
  }

  // Badges
  if (props.showBadges && props.badges.length > 0) {
    const badgeEls: React.ReactNode[] = [];
    props.badges.forEach(function (badge) {
      badgeEls.push(
        React.createElement(
          "span",
          { key: badge.id, className: styles.tag },
          badge.icon + " " + badge.name
        )
      );
    });
    revealChildren.push(
      React.createElement(
        "div",
        { key: "badges", className: styles.revealSection },
        React.createElement("div", { className: styles.sectionLabel }, "Badges"),
        React.createElement("div", { className: styles.tagRow }, badgeEls)
      )
    );
  }

  // Hobbies
  if (props.showHobbies && props.personal && props.personal.hobbies.length > 0) {
    const hobbyEls: React.ReactNode[] = [];
    props.personal.hobbies.forEach(function (hobby) {
      hobbyEls.push(
        React.createElement(
          "span",
          { key: hobby, className: styles.tag },
          hobby
        )
      );
    });
    revealChildren.push(
      React.createElement(
        "div",
        { key: "hobbies", className: styles.revealSection },
        React.createElement("div", { className: styles.sectionLabel }, "Hobbies"),
        React.createElement("div", { className: styles.tagRow }, hobbyEls)
      )
    );
  }

  // Websites
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
            className: styles.websiteLink,
          },
          site.name
        )
      );
    });
    revealChildren.push(
      React.createElement(
        "div",
        { key: "websites", className: styles.revealSection },
        React.createElement("div", { className: styles.sectionLabel }, "Links"),
        React.createElement("div", { className: styles.tagRow }, siteEls)
      )
    );
  }

  // Education
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
            edu.degree + (edu.field ? ", " + edu.field : "")
          ),
          " \u2014 " +
            edu.institution +
            (edu.yearCompleted ? " (" + edu.yearCompleted + ")" : "")
        )
      );
    });
    revealChildren.push(
      React.createElement(
        "div",
        { key: "education", className: styles.revealSection },
        React.createElement("div", { className: styles.sectionLabel }, "Education"),
        eduEls
      )
    );
  }

  // Manager
  if (props.showManager && props.manager) {
    revealChildren.push(
      React.createElement(
        "div",
        { key: "manager", className: styles.managerRow },
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

  if (revealChildren.length > 0) {
    children.push(
      React.createElement(
        "div",
        { key: "reveal", className: styles.revealContainer },
        revealChildren
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.minimalCard,
      role: "region",
      "aria-label": "Profile of " + profile.displayName,
    },
    children
  );
};

export default ProfileMinimal;
