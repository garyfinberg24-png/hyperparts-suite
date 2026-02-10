import * as React from "react";
import styles from "./ProfileGlass.module.scss";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import { getPresenceConfig, getStatusMessage } from "../../utils/presenceUtils";

/**
 * Glass template — glassmorphism effect with backdrop-filter blur.
 * Translucent card over colored background, accent glow border.
 * Cyan accent (#06b6d4). Modern frosted sections.
 */
const ProfileGlass: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const presenceConfig = getPresenceConfig(props.presence);
  const statusMessage = getStatusMessage(props.presence);
  const photoShapeStyle = getPhotoShapeStyle(props.photoShape);
  const accentColor = props.accentColor || "#06b6d4";

  const children: React.ReactNode[] = [];

  // -- Photo + Identity header --
  const headerChildren: React.ReactNode[] = [];

  // Photo
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

  headerChildren.push(
    React.createElement("div", { key: "photoWrap", className: styles.photoWrap }, photoWrapChildren)
  );

  // Identity
  const identityChildren: React.ReactNode[] = [];
  identityChildren.push(
    React.createElement("h2", { key: "name", className: styles.name }, profile.displayName)
  );
  if (profile.pronouns) {
    identityChildren.push(
      React.createElement("span", { key: "pronouns", className: styles.pronouns }, profile.pronouns)
    );
  }
  if (profile.jobTitle) {
    identityChildren.push(
      React.createElement("span", { key: "title", className: styles.jobTitle }, profile.jobTitle)
    );
  }
  const subtitleParts: string[] = [];
  if (profile.department) subtitleParts.push(profile.department);
  if (profile.companyName) subtitleParts.push(profile.companyName);
  if (subtitleParts.length > 0) {
    identityChildren.push(
      React.createElement("span", { key: "dept", className: styles.department }, subtitleParts.join(" | "))
    );
  }
  if (props.showStatusMessage && statusMessage) {
    identityChildren.push(
      React.createElement("div", { key: "status", className: styles.statusMessage },
        React.createElement("span", {
          className: styles.statusDot,
          style: { backgroundColor: presenceConfig.color },
        }),
        statusMessage
      )
    );
  }

  headerChildren.push(
    React.createElement("div", { key: "identity", className: styles.identity }, identityChildren)
  );

  children.push(
    React.createElement("div", { key: "header", className: styles.header }, headerChildren)
  );

  // -- Frosted sections --

  // Fields
  const fieldEntries: Array<{ label: string; value: string }> = [];
  if (profile.mail) fieldEntries.push({ label: "Email", value: profile.mail });
  if (profile.mobilePhone) fieldEntries.push({ label: "Mobile", value: profile.mobilePhone });
  if (profile.officeLocation) fieldEntries.push({ label: "Office", value: profile.officeLocation });
  if (profile.city) fieldEntries.push({ label: "City", value: profile.city });
  if (profile.workHours) fieldEntries.push({ label: "Hours", value: profile.workHours });
  if (profile.tenure) fieldEntries.push({ label: "Tenure", value: profile.tenure });
  if (profile.timezone) fieldEntries.push({ label: "Timezone", value: profile.timezone });

  if (fieldEntries.length > 0) {
    const fieldEls: React.ReactNode[] = [];
    fieldEntries.forEach(function (entry) {
      fieldEls.push(
        React.createElement("div", { key: entry.label, className: styles.field },
          React.createElement("span", { className: styles.fieldLabel }, entry.label),
          React.createElement("span", { className: styles.fieldValue }, entry.value)
        )
      );
    });
    children.push(
      React.createElement("div", { key: "fields", className: styles.frostedSection }, fieldEls)
    );
  }

  // About
  if (profile.aboutMe) {
    children.push(
      React.createElement("div", { key: "about", className: styles.frostedSection },
        React.createElement("p", { className: styles.aboutMe }, profile.aboutMe)
      )
    );
  }

  // Skills
  if (props.showSkills && props.skills.length > 0) {
    const skillTags: React.ReactNode[] = [];
    props.skills.forEach(function (skill) {
      skillTags.push(
        React.createElement("span", { key: skill.name, className: styles.skillTag },
          skill.name + (props.showEndorsements ? " (" + skill.endorsementCount + ")" : "")
        )
      );
    });
    children.push(
      React.createElement("div", { key: "skills", className: styles.frostedSection },
        React.createElement("h3", { className: styles.sectionTitle }, "Skills"),
        React.createElement("div", { className: styles.tagsWrap }, skillTags)
      )
    );
  }

  // Badges
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
      React.createElement("div", { key: "badges", className: styles.frostedSection },
        React.createElement("h3", { className: styles.sectionTitle }, "Badges"),
        React.createElement("div", { className: styles.badgesWrap }, badgeEls)
      )
    );
  }

  // Personal
  if (props.personal) {
    const personalChildren: React.ReactNode[] = [];

    if (props.showSlogan && props.personal.personalSlogan) {
      personalChildren.push(
        React.createElement("p", { key: "slogan", className: styles.slogan },
          "\"" + props.personal.personalSlogan + "\""
        )
      );
    }

    if (props.showHobbies && props.personal.hobbies.length > 0) {
      const hobbyTags: React.ReactNode[] = [];
      props.personal.hobbies.forEach(function (hobby) {
        hobbyTags.push(
          React.createElement("span", { key: hobby, className: styles.glassTag }, hobby)
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "hobbies", className: styles.tagsWrap }, hobbyTags)
      );
    }

    if (props.showInterests && props.personal.interests.length > 0) {
      const interestTags: React.ReactNode[] = [];
      props.personal.interests.forEach(function (interest) {
        interestTags.push(
          React.createElement("span", { key: interest, className: styles.glassTag }, interest)
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "interests", className: styles.tagsWrap }, interestTags)
      );
    }

    if (props.showWebsites && props.personal.favoriteWebsites.length > 0) {
      const websiteEls: React.ReactNode[] = [];
      props.personal.favoriteWebsites.forEach(function (site) {
        websiteEls.push(
          React.createElement("a", {
            key: site.url,
            className: styles.websiteLink,
            href: site.url,
            target: "_blank",
            rel: "noopener noreferrer",
          }, site.name)
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "websites", className: styles.websitesRow }, websiteEls)
      );
    }

    if (props.showEducation && props.personal.education.length > 0) {
      const eduEls: React.ReactNode[] = [];
      props.personal.education.forEach(function (edu) {
        eduEls.push(
          React.createElement("div", { key: edu.institution, className: styles.educationItem },
            React.createElement("span", { className: styles.eduDegree }, edu.degree),
            React.createElement("span", { className: styles.eduInstitution }, " - " + edu.institution),
            edu.yearCompleted
              ? React.createElement("span", { className: styles.eduYear }, " (" + edu.yearCompleted + ")")
              : undefined
          )
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "education", className: styles.educationSection }, eduEls)
      );
    }

    if (props.showFunFacts && props.personal.funFacts.length > 0) {
      const factTags: React.ReactNode[] = [];
      props.personal.funFacts.forEach(function (fact) {
        factTags.push(
          React.createElement("span", { key: fact, className: styles.glassTag }, fact)
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "funFacts", className: styles.tagsWrap }, factTags)
      );
    }

    if (personalChildren.length > 0) {
      children.push(
        React.createElement("div", { key: "personal", className: styles.frostedSection },
          React.createElement("h3", { className: styles.sectionTitle }, "Personal"),
          React.createElement("div", undefined, personalChildren)
        )
      );
    }
  }

  // Quick actions
  if (props.showQuickActions && props.enabledActions.length > 0) {
    const actionBtns: React.ReactNode[] = [];
    props.enabledActions.forEach(function (actionId) {
      actionBtns.push(
        React.createElement("button", {
          key: actionId,
          className: styles.actionButton,
          onClick: function () { if (props.onActionClick) props.onActionClick(actionId); },
          "aria-label": actionId,
        }, actionId)
      );
    });
    children.push(
      React.createElement("div", { key: "actions", className: styles.actionsRow }, actionBtns)
    );
  }

  // Manager
  if (props.showManager && props.manager) {
    children.push(
      React.createElement("div", { key: "manager", className: styles.managerSection },
        React.createElement("span", { className: styles.managerLabel }, "Reports to"),
        React.createElement("span", { className: styles.managerName }, props.manager.displayName),
        props.manager.jobTitle
          ? React.createElement("span", { className: styles.managerTitle }, props.manager.jobTitle)
          : undefined
      )
    );
  }

  return React.createElement(
    "div",
    {
      className: styles.profileGlass,
      "data-instance-id": props.instanceId,
      role: "article",
      "aria-label": "Profile card for " + profile.displayName,
      style: {
        "--accent-color": accentColor,
      } as React.CSSProperties,
    },
    children
  );
};

export default ProfileGlass;
