import * as React from "react";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import styles from "./ProfileMagazine.module.scss";

/**
 * ProfileMagazine — Editorial 60/40 split layout.
 * Left 60% is large photo, right 40% is content.
 * Pull-quote style for slogan, editorial serif-like font weights.
 */
const ProfileMagazine: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const initials =
    (profile.givenName ? profile.givenName.charAt(0) : "") +
    (profile.surname ? profile.surname.charAt(0) : "");

  const photoShapeStyle = getPhotoShapeStyle(props.photoShape || "rounded");

  // --- Left column: large photo ---
  const leftChildren: React.ReactNode[] = [];

  const photoStyle: React.CSSProperties = { width: "100%", height: "100%" };
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

  leftChildren.push(
    React.createElement(
      "div",
      { key: "photo-wrap", className: styles.photoWrapper },
      photoEl
    )
  );

  // --- Right column: content ---
  const rightChildren: React.ReactNode[] = [];

  // Category label
  if (profile.department) {
    rightChildren.push(
      React.createElement(
        "div",
        { key: "category", className: styles.categoryLabel },
        profile.department
      )
    );
  }

  // Name
  rightChildren.push(
    React.createElement(
      "h2",
      { key: "name", className: styles.displayName },
      profile.displayName
    )
  );

  // Job title
  if (profile.jobTitle) {
    rightChildren.push(
      React.createElement(
        "div",
        { key: "title", className: styles.jobTitle },
        profile.jobTitle
      )
    );
  }

  // Divider
  rightChildren.push(
    React.createElement("hr", { key: "divider", className: styles.divider })
  );

  // Pull-quote slogan
  if (props.showSlogan && props.personal && props.personal.personalSlogan) {
    rightChildren.push(
      React.createElement(
        "blockquote",
        { key: "slogan", className: styles.pullQuote },
        props.personal.personalSlogan
      )
    );
  }

  // Contact details as inline text
  const contactParts: string[] = [];
  if (profile.mail) {
    contactParts.push(profile.mail);
  }
  if (profile.mobilePhone) {
    contactParts.push(profile.mobilePhone);
  }
  if (profile.officeLocation) {
    contactParts.push(profile.officeLocation);
  }
  if (profile.city) {
    contactParts.push(profile.city);
  }
  if (contactParts.length > 0) {
    rightChildren.push(
      React.createElement(
        "div",
        { key: "contact", className: styles.contactLine },
        contactParts.join(" \u00B7 ")
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
          ? " (" + skill.endorsementCount + ")"
          : "");
      skillEls.push(
        React.createElement(
          "span",
          { key: skill.name, className: styles.skillTag },
          label
        )
      );
    });
    rightChildren.push(
      React.createElement(
        "div",
        { key: "skills", className: styles.section },
        React.createElement("div", { className: styles.sectionHeading }, "Expertise"),
        React.createElement("div", { className: styles.tagRow }, skillEls)
      )
    );
  }

  // Badges
  if (props.showBadges && props.badges.length > 0) {
    const badgeEls: React.ReactNode[] = [];
    props.badges.forEach(function (badge) {
      const badgeChildren: React.ReactNode[] = [];
      badgeChildren.push(
        React.createElement("span", { key: "icon", className: styles.badgeIcon }, badge.icon)
      );
      badgeChildren.push(React.createElement("span", { key: "name" }, badge.name));
      badgeEls.push(
        React.createElement(
          "span",
          { key: badge.id, className: styles.badgeChip },
          badgeChildren
        )
      );
    });
    rightChildren.push(
      React.createElement(
        "div",
        { key: "badges", className: styles.section },
        React.createElement("div", { className: styles.sectionHeading }, "Recognition"),
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
          { key: hobby, className: styles.hobbyTag },
          hobby
        )
      );
    });
    rightChildren.push(
      React.createElement(
        "div",
        { key: "hobbies", className: styles.section },
        React.createElement("div", { className: styles.sectionHeading }, "Interests"),
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
          site.name + " \u2197"
        )
      );
    });
    rightChildren.push(
      React.createElement(
        "div",
        { key: "websites", className: styles.section },
        React.createElement("div", { className: styles.sectionHeading }, "Reading"),
        React.createElement("div", { className: styles.websiteList }, siteEls)
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
          React.createElement(
            "span",
            { className: styles.educationInstitution },
            edu.institution +
              (edu.yearCompleted ? " \u2022 " + edu.yearCompleted : "")
          )
        )
      );
    });
    rightChildren.push(
      React.createElement(
        "div",
        { key: "education", className: styles.section },
        React.createElement("div", { className: styles.sectionHeading }, "Education"),
        eduEls
      )
    );
  }

  // Manager
  if (props.showManager && props.manager) {
    rightChildren.push(
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

  return React.createElement(
    "div",
    {
      className: styles.magazineCard,
      role: "region",
      "aria-label": "Profile of " + profile.displayName,
    },
    React.createElement(
      "div",
      { key: "left", className: styles.leftColumn },
      leftChildren
    ),
    React.createElement(
      "div",
      { key: "right", className: styles.rightColumn },
      rightChildren
    )
  );
};

export default ProfileMagazine;
