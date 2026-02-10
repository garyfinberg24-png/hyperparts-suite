import * as React from "react";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import styles from "./ProfileFlipCard.module.scss";

/**
 * ProfileFlipCard — 3D flip card.
 * Front face: photo, name, title, presence.
 * Back face: skills, badges, hobbies, education, manager, websites.
 * Flip triggered by click (local state) or props.onFlip callback.
 */
const ProfileFlipCard: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const initials =
    (profile.givenName ? profile.givenName.charAt(0) : "") +
    (profile.surname ? profile.surname.charAt(0) : "");

  const isFlippedState = React.useState(false);
  const isFlipped = isFlippedState[0];
  const setIsFlipped = isFlippedState[1];

  const handleFlip = React.useCallback(
    function (): void {
      setIsFlipped(function (prev) {
        return !prev;
      });
      if (props.onFlip) {
        props.onFlip();
      }
    },
    [props.onFlip]
  );

  const handleKeyDown = React.useCallback(
    function (e: React.KeyboardEvent): void {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleFlip();
      }
    },
    [handleFlip]
  );

  const photoShapeStyle = getPhotoShapeStyle(props.photoShape || "circle");

  const photoStyle: React.CSSProperties = {};
  const shapeKeys = Object.keys(photoShapeStyle);
  shapeKeys.forEach(function (k) {
    (photoStyle as Record<string, unknown>)[k] = (photoShapeStyle as Record<string, unknown>)[k];
  });

  // =====================
  // FRONT FACE
  // =====================
  const frontChildren: React.ReactNode[] = [];

  // Photo
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

  frontChildren.push(
    React.createElement(
      "div",
      { key: "photo-wrap", className: styles.photoWrapper },
      photoEl
    )
  );

  // Name
  frontChildren.push(
    React.createElement(
      "h2",
      { key: "name", className: styles.displayName },
      profile.displayName
    )
  );

  // Job title
  if (profile.jobTitle) {
    frontChildren.push(
      React.createElement(
        "div",
        { key: "title", className: styles.jobTitle },
        profile.jobTitle
      )
    );
  }

  // Department
  if (profile.department) {
    frontChildren.push(
      React.createElement(
        "div",
        { key: "dept", className: styles.department },
        profile.department
      )
    );
  }

  // Slogan on front
  if (props.showSlogan && props.personal && props.personal.personalSlogan) {
    frontChildren.push(
      React.createElement(
        "div",
        { key: "slogan", className: styles.slogan },
        "\u201C" + props.personal.personalSlogan + "\u201D"
      )
    );
  }

  // Flip hint
  frontChildren.push(
    React.createElement(
      "div",
      { key: "hint", className: styles.flipHint },
      "Click to see more \u21BB"
    )
  );

  const frontFace = React.createElement(
    "div",
    { key: "front", className: styles.face + " " + styles.front },
    frontChildren
  );

  // =====================
  // BACK FACE
  // =====================
  const backChildren: React.ReactNode[] = [];

  // Back header
  backChildren.push(
    React.createElement(
      "div",
      { key: "backHeader", className: styles.backHeader },
      React.createElement(
        "span",
        { className: styles.backName },
        profile.displayName
      ),
      React.createElement(
        "span",
        { className: styles.backFlipHint },
        "\u21BB Flip back"
      )
    )
  );

  // Contact info
  const contactItems: React.ReactNode[] = [];
  if (profile.mail) {
    contactItems.push(
      React.createElement(
        "div",
        { key: "mail", className: styles.contactItem },
        React.createElement("span", { className: styles.contactLabel }, "Email"),
        React.createElement("span", undefined, profile.mail)
      )
    );
  }
  if (profile.mobilePhone) {
    contactItems.push(
      React.createElement(
        "div",
        { key: "phone", className: styles.contactItem },
        React.createElement("span", { className: styles.contactLabel }, "Phone"),
        React.createElement("span", undefined, profile.mobilePhone)
      )
    );
  }
  if (profile.officeLocation) {
    contactItems.push(
      React.createElement(
        "div",
        { key: "office", className: styles.contactItem },
        React.createElement("span", { className: styles.contactLabel }, "Office"),
        React.createElement("span", undefined, profile.officeLocation)
      )
    );
  }
  if (profile.city) {
    contactItems.push(
      React.createElement(
        "div",
        { key: "city", className: styles.contactItem },
        React.createElement("span", { className: styles.contactLabel }, "City"),
        React.createElement("span", undefined, profile.city)
      )
    );
  }
  if (contactItems.length > 0) {
    backChildren.push(
      React.createElement(
        "div",
        { key: "contact", className: styles.backSection },
        contactItems
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
    backChildren.push(
      React.createElement(
        "div",
        { key: "skills", className: styles.backSection },
        React.createElement("div", { className: styles.backSectionTitle }, "Skills"),
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
          { key: badge.id, className: styles.badgeChip },
          React.createElement("span", { key: "icon" }, badge.icon),
          React.createElement("span", { key: "name" }, " " + badge.name)
        )
      );
    });
    backChildren.push(
      React.createElement(
        "div",
        { key: "badges", className: styles.backSection },
        React.createElement("div", { className: styles.backSectionTitle }, "Badges"),
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
          { key: hobby, className: styles.hobbyPill },
          hobby
        )
      );
    });
    backChildren.push(
      React.createElement(
        "div",
        { key: "hobbies", className: styles.backSection },
        React.createElement("div", { className: styles.backSectionTitle }, "Hobbies"),
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
          "\u2197 " + site.name
        )
      );
    });
    backChildren.push(
      React.createElement(
        "div",
        { key: "websites", className: styles.backSection },
        React.createElement("div", { className: styles.backSectionTitle }, "Links"),
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
            edu.degree + (edu.field ? " in " + edu.field : "")
          ),
          " \u2014 " +
            edu.institution +
            (edu.yearCompleted ? " (" + edu.yearCompleted + ")" : "")
        )
      );
    });
    backChildren.push(
      React.createElement(
        "div",
        { key: "education", className: styles.backSection },
        React.createElement("div", { className: styles.backSectionTitle }, "Education"),
        eduEls
      )
    );
  }

  // Manager
  if (props.showManager && props.manager) {
    backChildren.push(
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
            onClick: function (e: React.MouseEvent) {
              e.stopPropagation();
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

  const backFace = React.createElement(
    "div",
    { key: "back", className: styles.face + " " + styles.back },
    backChildren
  );

  // Container class toggles flip state
  const innerClass = isFlipped
    ? styles.flipInner + " " + styles.flipped
    : styles.flipInner;

  return React.createElement(
    "div",
    {
      className: styles.flipCard,
      role: "region",
      "aria-label": "Profile of " + profile.displayName + ". Click to flip card.",
      tabIndex: 0,
      onClick: handleFlip,
      onKeyDown: handleKeyDown,
    },
    React.createElement("div", { className: innerClass }, frontFace, backFace)
  );
};

export default ProfileFlipCard;
