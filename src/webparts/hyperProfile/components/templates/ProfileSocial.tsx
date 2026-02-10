import * as React from "react";
import styles from "./ProfileSocial.module.scss";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import { getPresenceConfig, getStatusMessage } from "../../utils/presenceUtils";

/**
 * Social template — modern social media card style.
 * Large centered photo with presence dot, name + pronouns + title centered below.
 * Bio/slogan section, stats row, colorful skill tags, badges, hobbies as rounded pills.
 * Websites as link pills, education items, quick action buttons, fun facts, manager link.
 * Indigo accent (#6366f1), white card with subtle shadow.
 */
const ProfileSocial: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const presenceConfig = getPresenceConfig(props.presence);
  const statusMessage = getStatusMessage(props.presence);
  const photoShapeStyle = getPhotoShapeStyle(props.photoShape);

  const children: React.ReactNode[] = [];

  // ── Photo section (large centered) ──
  const photoWrapChildren: React.ReactNode[] = [];
  const photoStyle: React.CSSProperties = {};
  const shapeKeys = Object.keys(photoShapeStyle);
  shapeKeys.forEach(function (k) {
    (photoStyle as Record<string, unknown>)[k] = (photoShapeStyle as Record<string, unknown>)[k];
  });

  if (props.photoUrl) {
    photoWrapChildren.push(
      React.createElement("img", {
        key: "photo",
        className: styles.avatar,
        src: props.photoUrl,
        alt: profile.displayName,
        style: photoStyle,
      })
    );
  } else {
    const initials =
      (profile.givenName ? profile.givenName.charAt(0) : "") +
      (profile.surname ? profile.surname.charAt(0) : "");
    photoWrapChildren.push(
      React.createElement(
        "div",
        { key: "initials", className: styles.initialsCircle, style: photoStyle },
        initials.toUpperCase()
      )
    );
  }

  if (props.showPresence && props.presence) {
    photoWrapChildren.push(
      React.createElement("span", {
        key: "presence",
        className: styles.presenceDot,
        style: { backgroundColor: presenceConfig.color },
        "aria-label": presenceConfig.label,
        title: presenceConfig.label,
      })
    );
  }

  children.push(
    React.createElement("div", { key: "photoWrap", className: styles.photoWrap }, photoWrapChildren)
  );

  // ── Name + pronouns + job title centered ──
  const nameChildren: React.ReactNode[] = [];
  nameChildren.push(
    React.createElement("h2", { key: "name", className: styles.displayName }, profile.displayName)
  );
  if (profile.pronouns) {
    nameChildren.push(
      React.createElement("span", { key: "pronouns", className: styles.pronouns }, profile.pronouns)
    );
  }
  if (profile.jobTitle) {
    nameChildren.push(
      React.createElement("span", { key: "title", className: styles.jobTitle }, profile.jobTitle)
    );
  }
  const subtitleParts: string[] = [];
  if (profile.department) subtitleParts.push(profile.department);
  if (profile.companyName) subtitleParts.push(profile.companyName);
  if (subtitleParts.length > 0) {
    nameChildren.push(
      React.createElement("span", { key: "dept", className: styles.department }, subtitleParts.join(" \u00B7 "))
    );
  }
  if (props.showStatusMessage && statusMessage) {
    nameChildren.push(
      React.createElement("div", { key: "status", className: styles.statusMessage },
        React.createElement("span", {
          className: styles.statusDot,
          style: { backgroundColor: presenceConfig.color },
        }),
        statusMessage
      )
    );
  }

  children.push(
    React.createElement("div", { key: "nameBlock", className: styles.nameBlock }, nameChildren)
  );

  // ── Bio / about section ──
  if (profile.aboutMe) {
    children.push(
      React.createElement("p", { key: "about", className: styles.aboutMe }, profile.aboutMe)
    );
  }

  // ── Slogan section ──
  if (props.showSlogan && props.personal && props.personal.personalSlogan) {
    children.push(
      React.createElement("p", { key: "slogan", className: styles.slogan },
        "\u201C" + props.personal.personalSlogan + "\u201D"
      )
    );
  }

  // ── Stats row ──
  const statsChildren: React.ReactNode[] = [];
  if (props.showSkills) {
    statsChildren.push(
      React.createElement("div", { key: "skillsStat", className: styles.statItem },
        React.createElement("span", { className: styles.statNumber }, String(props.skills.length)),
        React.createElement("span", { className: styles.statLabel }, "Skills")
      )
    );
  }
  if (props.showBadges) {
    statsChildren.push(
      React.createElement("div", { key: "badgesStat", className: styles.statItem },
        React.createElement("span", { className: styles.statNumber }, String(props.badges.length)),
        React.createElement("span", { className: styles.statLabel }, "Badges")
      )
    );
  }
  let totalEndorsements = 0;
  props.skills.forEach(function (s) { totalEndorsements += s.endorsementCount; });
  if (totalEndorsements > 0) {
    statsChildren.push(
      React.createElement("div", { key: "connections", className: styles.statItem },
        React.createElement("span", { className: styles.statNumber }, String(totalEndorsements)),
        React.createElement("span", { className: styles.statLabel }, "Endorsements")
      )
    );
  }
  if (statsChildren.length > 0) {
    children.push(
      React.createElement("div", { key: "stats", className: styles.statsRow }, statsChildren)
    );
  }

  // ── Contact info ──
  const contactParts: React.ReactNode[] = [];
  if (profile.mail) {
    contactParts.push(
      React.createElement("span", { key: "mail", className: styles.contactItem }, "\u2709 " + profile.mail)
    );
  }
  if (profile.mobilePhone) {
    contactParts.push(
      React.createElement("span", { key: "phone", className: styles.contactItem }, "\u260E " + profile.mobilePhone)
    );
  }
  if (profile.officeLocation) {
    contactParts.push(
      React.createElement("span", { key: "office", className: styles.contactItem }, "\u{1F3E2} " + profile.officeLocation)
    );
  }
  if (contactParts.length > 0) {
    children.push(
      React.createElement("div", { key: "contact", className: styles.contactRow }, contactParts)
    );
  }

  // ── Skills as colorful tags ──
  if (props.showSkills && props.skills.length > 0) {
    const skillColors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4"];
    const skillTags: React.ReactNode[] = [];
    props.skills.forEach(function (skill, index) {
      const color = skillColors[index % skillColors.length];
      skillTags.push(
        React.createElement("span", {
          key: skill.name,
          className: styles.skillTag,
          style: { backgroundColor: color + "18", color: color, borderColor: color + "40" },
        }, skill.name + (props.showEndorsements ? " \u00B7 " + skill.endorsementCount : ""))
      );
    });
    children.push(
      React.createElement("div", { key: "skills", className: styles.section },
        React.createElement("h3", { className: styles.sectionTitle }, "Skills"),
        React.createElement("div", { className: styles.tagsWrap }, skillTags)
      )
    );
  }

  // ── Badges ──
  if (props.showBadges && props.badges.length > 0) {
    const badgeEls: React.ReactNode[] = [];
    props.badges.forEach(function (badge) {
      const badgeInner: React.ReactNode[] = [
        React.createElement("span", { key: "icon", className: styles.badgeIcon }, badge.icon),
        React.createElement("span", { key: "name", className: styles.badgeName }, badge.name),
      ];
      if (props.showBadgeDescriptions) {
        badgeInner.push(
          React.createElement("span", { key: "desc", className: styles.badgeDesc }, badge.description)
        );
      }
      badgeEls.push(
        React.createElement("div", { key: badge.id, className: styles.badgeItem }, badgeInner)
      );
    });
    children.push(
      React.createElement("div", { key: "badges", className: styles.section },
        React.createElement("h3", { className: styles.sectionTitle }, "Badges"),
        React.createElement("div", { className: styles.badgesWrap }, badgeEls)
      )
    );
  }

  // ── Hobbies as rounded pills ──
  if (props.showHobbies && props.personal && props.personal.hobbies.length > 0) {
    const hobbyPills: React.ReactNode[] = [];
    props.personal.hobbies.forEach(function (hobby) {
      hobbyPills.push(
        React.createElement("span", { key: hobby, className: styles.hobbyPill }, hobby)
      );
    });
    children.push(
      React.createElement("div", { key: "hobbies", className: styles.section },
        React.createElement("h3", { className: styles.sectionTitle }, "Hobbies"),
        React.createElement("div", { className: styles.tagsWrap }, hobbyPills)
      )
    );
  }

  // ── Interests ──
  if (props.showInterests && props.personal && props.personal.interests.length > 0) {
    const interestPills: React.ReactNode[] = [];
    props.personal.interests.forEach(function (interest) {
      interestPills.push(
        React.createElement("span", { key: interest, className: styles.interestPill }, interest)
      );
    });
    children.push(
      React.createElement("div", { key: "interests", className: styles.section },
        React.createElement("h3", { className: styles.sectionTitle }, "Interests"),
        React.createElement("div", { className: styles.tagsWrap }, interestPills)
      )
    );
  }

  // ── Websites as link pills ──
  if (props.showWebsites && props.personal && props.personal.favoriteWebsites.length > 0) {
    const websiteChips: React.ReactNode[] = [];
    props.personal.favoriteWebsites.forEach(function (site) {
      websiteChips.push(
        React.createElement("a", {
          key: site.url,
          className: styles.websiteChip,
          href: site.url,
          target: "_blank",
          rel: "noopener noreferrer",
        }, "\u2197 " + site.name)
      );
    });
    children.push(
      React.createElement("div", { key: "websites", className: styles.section },
        React.createElement("h3", { className: styles.sectionTitle }, "Favorite Sites"),
        React.createElement("div", { className: styles.tagsWrap }, websiteChips)
      )
    );
  }

  // ── Education ──
  if (props.showEducation && props.personal && props.personal.education.length > 0) {
    const eduEls: React.ReactNode[] = [];
    props.personal.education.forEach(function (edu) {
      eduEls.push(
        React.createElement("div", { key: edu.institution, className: styles.educationItem },
          React.createElement("span", { className: styles.eduIcon }, "\uD83C\uDF93"),
          React.createElement("div", { className: styles.eduContent },
            React.createElement("span", { className: styles.eduDegree },
              edu.degree + (edu.field ? " in " + edu.field : "")
            ),
            React.createElement("span", { className: styles.eduInstitution },
              edu.institution + (edu.yearCompleted ? " \u00B7 " + edu.yearCompleted : "")
            )
          )
        )
      );
    });
    children.push(
      React.createElement("div", { key: "education", className: styles.section },
        React.createElement("h3", { className: styles.sectionTitle }, "Education"),
        React.createElement("div", { className: styles.educationList }, eduEls)
      )
    );
  }

  // ── Fun facts ──
  if (props.showFunFacts && props.personal && props.personal.funFacts.length > 0) {
    const factEls: React.ReactNode[] = [];
    props.personal.funFacts.forEach(function (fact) {
      factEls.push(
        React.createElement("span", { key: fact, className: styles.funFactPill }, "\u26A1 " + fact)
      );
    });
    children.push(
      React.createElement("div", { key: "funFacts", className: styles.section },
        React.createElement("h3", { className: styles.sectionTitle }, "Fun Facts"),
        React.createElement("div", { className: styles.tagsWrap }, factEls)
      )
    );
  }

  // ── Quick action buttons ──
  if (props.showQuickActions && props.enabledActions.length > 0) {
    const actionBtns: React.ReactNode[] = [];
    props.enabledActions.forEach(function (actionId) {
      actionBtns.push(
        React.createElement("button", {
          key: actionId,
          className: styles.actionButton,
          onClick: function () { if (props.onActionClick) props.onActionClick(actionId); },
          "aria-label": actionId,
          type: "button",
        }, actionId)
      );
    });
    children.push(
      React.createElement("div", { key: "actions", className: styles.actionsRow }, actionBtns)
    );
  }

  // ── Manager link ──
  if (props.showManager && props.manager) {
    children.push(
      React.createElement("div", { key: "manager", className: styles.managerSection },
        React.createElement("span", { className: styles.managerLabel }, "Reports to"),
        React.createElement("button", {
          type: "button",
          className: styles.managerLink,
          onClick: function () {
            if (props.manager && props.manager.mail) {
              window.open("mailto:" + props.manager.mail, "_blank");
            }
          },
        }, props.manager.displayName),
        props.manager.jobTitle
          ? React.createElement("span", { className: styles.managerTitle }, props.manager.jobTitle)
          : undefined
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.socialCard,
      "data-instance-id": props.instanceId,
      role: "article",
      "aria-label": "Profile card for " + profile.displayName,
    },
    children
  );
};

export default ProfileSocial;
