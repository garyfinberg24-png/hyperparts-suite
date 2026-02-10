import * as React from "react";
import styles from "./ProfileCompact.module.scss";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import { getPresenceConfig, getStatusMessage } from "../../utils/presenceUtils";

/**
 * Compact template — white card, horizontal row layout.
 * Small photo left, name+title center, action icons right.
 * Very space-efficient with minimal info.
 */
const ProfileCompact: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const presenceConfig = getPresenceConfig(props.presence);
  const statusMessage = getStatusMessage(props.presence);
  const photoShapeStyle = getPhotoShapeStyle(props.photoShape);

  const children: React.ReactNode[] = [];

  // -- Photo section (small) --
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
        className: styles.photo,
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

  // -- Center info --
  const infoChildren: React.ReactNode[] = [];

  // Name row with title
  const nameRow: React.ReactNode[] = [];
  nameRow.push(
    React.createElement("span", { key: "name", className: styles.name }, profile.displayName)
  );
  if (profile.pronouns) {
    nameRow.push(
      React.createElement("span", { key: "pronouns", className: styles.pronouns }, "(" + profile.pronouns + ")")
    );
  }
  infoChildren.push(
    React.createElement("div", { key: "nameRow", className: styles.nameRow }, nameRow)
  );

  // Title + department
  const metaRow: React.ReactNode[] = [];
  if (profile.jobTitle) {
    metaRow.push(
      React.createElement("span", { key: "title", className: styles.jobTitle }, profile.jobTitle)
    );
  }
  if (profile.department) {
    metaRow.push(
      React.createElement("span", { key: "sep", className: styles.separator }, "|")
    );
    metaRow.push(
      React.createElement("span", { key: "dept", className: styles.department }, profile.department)
    );
  }
  if (metaRow.length > 0) {
    infoChildren.push(
      React.createElement("div", { key: "metaRow", className: styles.metaRow }, metaRow)
    );
  }

  // Status message
  if (props.showStatusMessage && statusMessage) {
    infoChildren.push(
      React.createElement("div", { key: "status", className: styles.statusMessage },
        React.createElement("span", {
          className: styles.statusDot,
          style: { backgroundColor: presenceConfig.color },
        }),
        statusMessage
      )
    );
  }

  // Contact line
  const contactParts: React.ReactNode[] = [];
  if (profile.mail) {
    contactParts.push(
      React.createElement("span", { key: "mail", className: styles.contactItem }, profile.mail)
    );
  }
  if (profile.mobilePhone) {
    contactParts.push(
      React.createElement("span", { key: "phone", className: styles.contactItem }, profile.mobilePhone)
    );
  }
  if (profile.officeLocation) {
    contactParts.push(
      React.createElement("span", { key: "office", className: styles.contactItem }, profile.officeLocation)
    );
  }
  if (contactParts.length > 0) {
    infoChildren.push(
      React.createElement("div", { key: "contact", className: styles.contactRow }, contactParts)
    );
  }

  // Skills inline (compact)
  if (props.showSkills && props.skills.length > 0) {
    const skillTags: React.ReactNode[] = [];
    const maxSkills = 5;
    let skillCount = 0;
    props.skills.forEach(function (skill) {
      if (skillCount < maxSkills) {
        skillTags.push(
          React.createElement("span", { key: skill.name, className: styles.skillTag },
            skill.name + (props.showEndorsements ? " (" + skill.endorsementCount + ")" : "")
          )
        );
      }
      skillCount++;
    });
    if (props.skills.length > maxSkills) {
      skillTags.push(
        React.createElement("span", { key: "more", className: styles.moreTag },
          "+" + (props.skills.length - maxSkills) + " more"
        )
      );
    }
    infoChildren.push(
      React.createElement("div", { key: "skills", className: styles.skillsRow }, skillTags)
    );
  }

  // Badges inline (compact)
  if (props.showBadges && props.badges.length > 0) {
    const badgeEls: React.ReactNode[] = [];
    props.badges.forEach(function (badge) {
      badgeEls.push(
        React.createElement("span", {
          key: badge.id,
          className: styles.badgeChip,
          title: props.showBadgeDescriptions ? badge.description : badge.name,
        }, badge.icon + " " + badge.name)
      );
    });
    infoChildren.push(
      React.createElement("div", { key: "badges", className: styles.badgesRow }, badgeEls)
    );
  }

  // Personal info (compact inline)
  if (props.personal) {
    const personalInline: React.ReactNode[] = [];

    if (props.showSlogan && props.personal.personalSlogan) {
      personalInline.push(
        React.createElement("span", { key: "slogan", className: styles.sloganInline },
          "\"" + props.personal.personalSlogan + "\""
        )
      );
    }

    if (props.showHobbies && props.personal.hobbies.length > 0) {
      personalInline.push(
        React.createElement("span", { key: "hobbies", className: styles.personalLabel },
          "Hobbies: " + props.personal.hobbies.join(", ")
        )
      );
    }

    if (props.showInterests && props.personal.interests.length > 0) {
      personalInline.push(
        React.createElement("span", { key: "interests", className: styles.personalLabel },
          "Interests: " + props.personal.interests.join(", ")
        )
      );
    }

    if (props.showWebsites && props.personal.favoriteWebsites.length > 0) {
      const links: React.ReactNode[] = [];
      props.personal.favoriteWebsites.forEach(function (site) {
        links.push(
          React.createElement("a", {
            key: site.url,
            className: styles.websiteLink,
            href: site.url,
            target: "_blank",
            rel: "noopener noreferrer",
          }, site.name)
        );
      });
      personalInline.push(
        React.createElement("span", { key: "websites", className: styles.websitesInline }, links)
      );
    }

    if (props.showEducation && props.personal.education.length > 0) {
      const eduParts: string[] = [];
      props.personal.education.forEach(function (edu) {
        eduParts.push(edu.degree + " - " + edu.institution);
      });
      personalInline.push(
        React.createElement("span", { key: "edu", className: styles.personalLabel }, eduParts.join("; "))
      );
    }

    if (props.showFunFacts && props.personal.funFacts.length > 0) {
      personalInline.push(
        React.createElement("span", { key: "facts", className: styles.personalLabel },
          props.personal.funFacts.join(" | ")
        )
      );
    }

    if (personalInline.length > 0) {
      infoChildren.push(
        React.createElement("div", { key: "personal", className: styles.personalRow }, personalInline)
      );
    }
  }

  // Manager inline
  if (props.showManager && props.manager) {
    infoChildren.push(
      React.createElement("div", { key: "manager", className: styles.managerInline },
        React.createElement("span", { className: styles.managerLabel }, "Manager:"),
        React.createElement("span", { className: styles.managerName }, props.manager.displayName)
      )
    );
  }

  children.push(
    React.createElement("div", { key: "info", className: styles.infoCenter }, infoChildren)
  );

  // -- Action icons (right) --
  if (props.showQuickActions && props.enabledActions.length > 0) {
    const actionBtns: React.ReactNode[] = [];
    props.enabledActions.forEach(function (actionId) {
      actionBtns.push(
        React.createElement("button", {
          key: actionId,
          className: styles.actionIcon,
          onClick: function () { if (props.onActionClick) props.onActionClick(actionId); },
          "aria-label": actionId,
          title: actionId,
        }, actionId.charAt(0).toUpperCase())
      );
    });
    children.push(
      React.createElement("div", { key: "actions", className: styles.actionsCol }, actionBtns)
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.profileCompact,
      "data-instance-id": props.instanceId,
      role: "article",
      "aria-label": "Profile card for " + profile.displayName,
    },
    children
  );
};

export default ProfileCompact;
