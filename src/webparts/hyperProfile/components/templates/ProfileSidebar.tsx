import * as React from "react";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import { getPresenceConfig, getStatusMessage } from "../../utils/presenceUtils";
import styles from "./ProfileSidebar.module.scss";

/**
 * ProfileSidebar -- 2-column layout with dark navy sidebar (240px) and
 * white main content area. Sidebar holds photo, name, title, presence,
 * and quick actions. Main area shows fields, skills, badges, personal info.
 * Accent: #f59e0b (amber).
 */
const ProfileSidebar: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const initials =
    (profile.givenName ? profile.givenName.charAt(0) : "") +
    (profile.surname ? profile.surname.charAt(0) : "");

  const photoShapeStyle = getPhotoShapeStyle(props.photoShape || "circle");
  const presenceConfig = getPresenceConfig(props.presence);
  const statusMsg = getStatusMessage(props.presence);

  // ══════════════════════════════════════════════
  //  LEFT SIDEBAR
  // ══════════════════════════════════════════════
  const sidebarChildren: React.ReactNode[] = [];

  // Photo
  const photoStyle: React.CSSProperties = { width: "100px", height: "100px" };
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

  // Presence badge
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

  sidebarChildren.push(
    React.createElement("div", { key: "photo-wrap", className: styles.photoWrapper }, photoWrapChildren)
  );

  // Name + title in sidebar
  sidebarChildren.push(
    React.createElement("h2", { key: "name", className: styles.displayName }, profile.displayName)
  );
  if (profile.jobTitle) {
    sidebarChildren.push(
      React.createElement("div", { key: "title", className: styles.jobTitle }, profile.jobTitle)
    );
  }
  if (profile.department) {
    sidebarChildren.push(
      React.createElement("div", { key: "dept", className: styles.department }, profile.department)
    );
  }

  // Presence label
  if (props.showPresence && props.presence) {
    sidebarChildren.push(
      React.createElement("div", { key: "presenceLabel", className: styles.presenceLabel },
        React.createElement("span", {
          className: styles.presenceIndicator,
          style: { backgroundColor: presenceConfig.color },
        }),
        presenceConfig.label
      )
    );
  }

  // Status message
  if (props.showStatusMessage && statusMsg) {
    sidebarChildren.push(
      React.createElement("div", { key: "status", className: styles.statusMessage }, statusMsg)
    );
  }

  // Sidebar contact info
  const sidebarContactItems: React.ReactNode[] = [];
  if (profile.mail) {
    sidebarContactItems.push(
      React.createElement("a", {
        key: "mail",
        href: "mailto:" + profile.mail,
        className: styles.sidebarLink,
      }, profile.mail)
    );
  }
  if (profile.mobilePhone) {
    sidebarContactItems.push(
      React.createElement("a", {
        key: "phone",
        href: "tel:" + profile.mobilePhone,
        className: styles.sidebarLink,
      }, profile.mobilePhone)
    );
  }
  if (profile.officeLocation) {
    sidebarContactItems.push(
      React.createElement("div", { key: "office", className: styles.sidebarText }, profile.officeLocation)
    );
  }
  if (profile.city) {
    sidebarContactItems.push(
      React.createElement("div", { key: "city", className: styles.sidebarText }, profile.city)
    );
  }

  if (sidebarContactItems.length > 0) {
    sidebarChildren.push(
      React.createElement("div", { key: "sidebarContact", className: styles.sidebarSection }, sidebarContactItems)
    );
  }

  // Quick actions in sidebar
  if (props.showQuickActions && props.enabledActions.length > 0) {
    const actionEls: React.ReactNode[] = [];
    props.enabledActions.forEach(function (actionId) {
      let label: string = actionId;
      if (actionId === "email") label = "\u2709 Email";
      else if (actionId === "teams_chat") label = "\uD83D\uDCAC Chat";
      else if (actionId === "teams_call") label = "\u260E Call";
      else if (actionId === "schedule") label = "\uD83D\uDCC5 Schedule";

      actionEls.push(
        React.createElement("button", {
          key: actionId,
          type: "button",
          className: styles.actionButton,
          onClick: function () {
            if (props.onActionClick) {
              props.onActionClick(actionId);
            }
          },
          "aria-label": label,
        }, label)
      );
    });
    sidebarChildren.push(
      React.createElement("div", { key: "actions", className: styles.sidebarSection },
        React.createElement("div", { className: styles.actionGrid }, actionEls)
      )
    );
  }

  // ══════════════════════════════════════════════
  //  MAIN CONTENT AREA
  // ══════════════════════════════════════════════
  const mainChildren: React.ReactNode[] = [];

  // Slogan
  if (props.showSlogan && props.personal && props.personal.personalSlogan) {
    mainChildren.push(
      React.createElement("div", { key: "slogan", className: styles.slogan },
        "\u201C" + props.personal.personalSlogan + "\u201D"
      )
    );
  }

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
            ? React.createElement("span", { className: styles.skillCount }, "+" + skill.endorsementCount)
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
    mainChildren.push(
      React.createElement("div", { key: "skills", className: styles.mainSection },
        React.createElement("div", { className: styles.mainSectionTitle }, "Skills"),
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
      const textChildren: React.ReactNode[] = [];
      textChildren.push(
        React.createElement("span", { key: "name", className: styles.badgeName }, badge.name)
      );
      if (props.showBadgeDescriptions && badge.description) {
        textChildren.push(
          React.createElement("div", { key: "desc", className: styles.badgeDesc }, badge.description)
        );
      }
      badgeChildren.push(
        React.createElement("div", { key: "text", className: styles.badgeText }, textChildren)
      );
      badgeEls.push(
        React.createElement("div", { key: badge.id, className: styles.badgeItem }, badgeChildren)
      );
    });
    mainChildren.push(
      React.createElement("div", { key: "badges", className: styles.mainSection },
        React.createElement("div", { className: styles.mainSectionTitle }, "Recognition"),
        React.createElement("div", { className: styles.badgeList }, badgeEls)
      )
    );
  }

  // Hobbies
  if (props.showHobbies && props.personal && props.personal.hobbies.length > 0) {
    const hobbyEls: React.ReactNode[] = [];
    props.personal.hobbies.forEach(function (hobby) {
      hobbyEls.push(
        React.createElement("span", { key: hobby, className: styles.hobbyPill }, hobby)
      );
    });
    mainChildren.push(
      React.createElement("div", { key: "hobbies", className: styles.mainSection },
        React.createElement("div", { className: styles.mainSectionTitle }, "Hobbies"),
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
    mainChildren.push(
      React.createElement("div", { key: "websites", className: styles.mainSection },
        React.createElement("div", { className: styles.mainSectionTitle }, "Reads"),
        React.createElement("div", { className: styles.pillRow }, siteEls)
      )
    );
  }

  // Education
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
    mainChildren.push(
      React.createElement("div", { key: "education", className: styles.mainSection },
        React.createElement("div", { className: styles.mainSectionTitle }, "Education"),
        eduEls
      )
    );
  }

  // Manager
  if (props.showManager && props.manager) {
    mainChildren.push(
      React.createElement("div", { key: "manager", className: styles.mainSection },
        React.createElement("div", { className: styles.mainSectionTitle }, "Reports To"),
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

  // ══════════════════════════════════════════════
  //  COMPOSE LAYOUT
  // ══════════════════════════════════════════════
  const layoutChildren: React.ReactNode[] = [];
  layoutChildren.push(
    React.createElement("aside", { key: "sidebar", className: styles.sidebar }, sidebarChildren)
  );
  layoutChildren.push(
    React.createElement("main", { key: "main", className: styles.main }, mainChildren)
  );

  return React.createElement("div", {
    className: styles.sidebarLayout,
    role: "region",
    "aria-label": "Profile of " + profile.displayName,
  }, layoutChildren);
};

export default ProfileSidebar;
