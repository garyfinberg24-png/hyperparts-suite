import * as React from "react";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import { getPresenceConfig, getStatusMessage } from "../../utils/presenceUtils";
import styles from "./ProfileHero.module.scss";

/**
 * ProfileHero -- Full-width hero banner style profile template.
 * Large gradient header area with overlapping photo, horizontal contact bar,
 * accented content sections below. Accent: #ec4899 (pink).
 */
const ProfileHero: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const initials =
    (profile.givenName ? profile.givenName.charAt(0) : "") +
    (profile.surname ? profile.surname.charAt(0) : "");

  const photoShapeStyle = getPhotoShapeStyle(props.photoShape || "circle");
  const presenceConfig = getPresenceConfig(props.presence);
  const statusMsg = getStatusMessage(props.presence);

  const children: React.ReactNode[] = [];

  // ── Header area (gradient banner + overlapping photo) ──
  const headerChildren: React.ReactNode[] = [];

  // Photo element
  const photoStyle: React.CSSProperties = { width: "120px", height: "120px" };
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

  const photoWrapChildren: React.ReactNode[] = [photoEl];

  // Presence badge on photo
  if (props.showPresence && props.presence) {
    photoWrapChildren.push(
      React.createElement("span", {
        key: "presence",
        className: styles.presenceDot,
        style: { backgroundColor: presenceConfig.color },
        title: presenceConfig.label,
        "aria-label": presenceConfig.label,
      })
    );
  }

  headerChildren.push(
    React.createElement("div", { key: "photo-wrap", className: styles.photoWrapper }, photoWrapChildren)
  );

  // Name block overlaid on header
  const nameBlockChildren: React.ReactNode[] = [];
  nameBlockChildren.push(
    React.createElement("h2", { key: "name", className: styles.displayName }, profile.displayName)
  );
  if (profile.jobTitle) {
    nameBlockChildren.push(
      React.createElement("div", { key: "title", className: styles.jobTitle }, profile.jobTitle)
    );
  }
  if (profile.department) {
    nameBlockChildren.push(
      React.createElement("div", { key: "dept", className: styles.department }, profile.department)
    );
  }
  if (props.showStatusMessage && statusMsg) {
    nameBlockChildren.push(
      React.createElement("div", { key: "status", className: styles.statusMessage }, statusMsg)
    );
  }
  headerChildren.push(
    React.createElement("div", { key: "nameBlock", className: styles.nameBlock }, nameBlockChildren)
  );

  children.push(
    React.createElement("div", { key: "header", className: styles.header }, headerChildren)
  );

  // ── Contact info bar ──
  const contactItems: React.ReactNode[] = [];
  if (profile.mail) {
    contactItems.push(
      React.createElement("a", {
        key: "mail",
        href: "mailto:" + profile.mail,
        className: styles.contactItem,
      }, "\u2709 " + profile.mail)
    );
  }
  if (profile.mobilePhone) {
    contactItems.push(
      React.createElement("a", {
        key: "phone",
        href: "tel:" + profile.mobilePhone,
        className: styles.contactItem,
      }, "\u260E " + profile.mobilePhone)
    );
  }
  if (profile.officeLocation) {
    contactItems.push(
      React.createElement("span", { key: "office", className: styles.contactItem },
        "\uD83C\uDFE2 " + profile.officeLocation
      )
    );
  }
  if (profile.city) {
    contactItems.push(
      React.createElement("span", { key: "city", className: styles.contactItem },
        "\uD83D\uDCCD " + profile.city
      )
    );
  }

  if (contactItems.length > 0) {
    children.push(
      React.createElement("div", { key: "contactBar", className: styles.contactBar }, contactItems)
    );
  }

  // ── Slogan as pull quote ──
  if (props.showSlogan && props.personal && props.personal.personalSlogan) {
    children.push(
      React.createElement("blockquote", { key: "slogan", className: styles.slogan },
        React.createElement("span", { className: styles.sloganQuote }, "\u201C"),
        props.personal.personalSlogan,
        React.createElement("span", { className: styles.sloganQuote }, "\u201D")
      )
    );
  }

  // ── Content sections ──

  // Skills section
  if (props.showSkills && props.skills.length > 0) {
    const skillEls: React.ReactNode[] = [];
    props.skills.forEach(function (skill) {
      const pct = Math.min(skill.level * 20, 100);
      const skillChildren: React.ReactNode[] = [];
      skillChildren.push(
        React.createElement("div", { key: "meta", className: styles.skillMeta },
          React.createElement("span", { className: styles.skillName }, skill.name),
          props.showEndorsements && skill.endorsementCount > 0
            ? React.createElement("span", { className: styles.skillEndorsements }, skill.endorsementCount + " endorsements")
            : undefined
        )
      );
      skillChildren.push(
        React.createElement("div", { key: "bar", className: styles.skillBarTrack },
          React.createElement("div", {
            className: styles.skillBarFill,
            style: { width: pct + "%" },
            role: "meter",
            "aria-valuenow": skill.level,
            "aria-valuemin": 0,
            "aria-valuemax": 5,
            "aria-label": skill.name + " proficiency",
          })
        )
      );
      skillEls.push(
        React.createElement("div", { key: skill.name, className: styles.skillItem }, skillChildren)
      );
    });
    children.push(
      React.createElement("div", { key: "skills", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Skills"),
        React.createElement("div", { className: styles.skillsList }, skillEls)
      )
    );
  }

  // Badges section
  if (props.showBadges && props.badges.length > 0) {
    const badgeEls: React.ReactNode[] = [];
    props.badges.forEach(function (badge) {
      const badgeChildren: React.ReactNode[] = [];
      badgeChildren.push(
        React.createElement("span", { key: "icon", className: styles.badgeIcon }, badge.icon)
      );
      badgeChildren.push(
        React.createElement("span", { key: "name", className: styles.badgeName }, badge.name)
      );
      if (props.showBadgeDescriptions && badge.description) {
        badgeChildren.push(
          React.createElement("div", { key: "desc", className: styles.badgeDesc }, badge.description)
        );
      }
      badgeEls.push(
        React.createElement("div", { key: badge.id, className: styles.badgeCard }, badgeChildren)
      );
    });
    children.push(
      React.createElement("div", { key: "badges", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Recognition"),
        React.createElement("div", { className: styles.badgesGrid }, badgeEls)
      )
    );
  }

  // Personal section (hobbies + interests)
  if (props.showHobbies && props.personal && props.personal.hobbies.length > 0) {
    const hobbyEls: React.ReactNode[] = [];
    props.personal.hobbies.forEach(function (hobby) {
      hobbyEls.push(
        React.createElement("span", { key: hobby, className: styles.hobbyPill }, hobby)
      );
    });
    children.push(
      React.createElement("div", { key: "hobbies", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Hobbies"),
        React.createElement("div", { className: styles.pillRow }, hobbyEls)
      )
    );
  }

  // Websites
  if (props.showWebsites && props.personal && props.personal.favoriteWebsites.length > 0) {
    const siteEls: React.ReactNode[] = [];
    props.personal.favoriteWebsites.forEach(function (site) {
      siteEls.push(
        React.createElement("a", {
          key: site.name,
          href: site.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: styles.websiteLink,
        }, "\u2197 " + site.name)
      );
    });
    children.push(
      React.createElement("div", { key: "websites", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Reads"),
        React.createElement("div", { className: styles.pillRow }, siteEls)
      )
    );
  }

  // Education section
  if (props.showEducation && props.personal && props.personal.education.length > 0) {
    const eduEls: React.ReactNode[] = [];
    props.personal.education.forEach(function (edu) {
      eduEls.push(
        React.createElement("div", { key: edu.institution, className: styles.educationItem },
          React.createElement("div", { className: styles.educationDegree },
            edu.degree + (edu.field ? " in " + edu.field : "")
          ),
          React.createElement("div", { className: styles.educationInstitution },
            edu.institution + (edu.yearCompleted ? " \u2022 " + edu.yearCompleted : "")
          )
        )
      );
    });
    children.push(
      React.createElement("div", { key: "education", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Education"),
        eduEls
      )
    );
  }

  // Manager section
  if (props.showManager && props.manager) {
    children.push(
      React.createElement("div", { key: "manager", className: styles.section },
        React.createElement("div", { className: styles.sectionTitle }, "Reports To"),
        React.createElement("button", {
          type: "button",
          className: styles.managerButton,
          onClick: function () {
            if (props.manager && props.manager.mail) {
              window.open("mailto:" + props.manager.mail, "_blank");
            }
          },
        },
          React.createElement("span", { className: styles.managerName }, props.manager.displayName),
          props.manager.jobTitle
            ? React.createElement("span", { className: styles.managerTitle }, props.manager.jobTitle)
            : undefined
        )
      )
    );
  }

  return React.createElement("div", {
    className: styles.heroCard,
    role: "region",
    "aria-label": "Profile of " + profile.displayName,
  }, children);
};

export default ProfileHero;
