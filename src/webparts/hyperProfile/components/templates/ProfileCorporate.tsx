import * as React from "react";
import styles from "./ProfileCorporate.module.scss";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import { getPresenceConfig, getStatusMessage } from "../../utils/presenceUtils";

/**
 * Corporate template — warm gray card, charcoal accent.
 * Small square photo, formal layout, traditional business card feel.
 * No border-radius, structured fields in clean rows.
 */
const ProfileCorporate: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const presenceConfig = getPresenceConfig(props.presence);
  const statusMessage = getStatusMessage(props.presence);
  const photoShapeStyle = getPhotoShapeStyle(props.photoShape);

  const children: React.ReactNode[] = [];

  // -- Top bar accent --
  children.push(
    React.createElement("div", {
      key: "accent",
      className: styles.accentBar,
      style: { backgroundColor: props.accentColor || "#323130" },
    })
  );

  // -- Header row: photo + identity --
  const headerChildren: React.ReactNode[] = [];

  // Photo (small square)
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
        { key: "initials", className: styles.initialsSquare, style: photoStyle },
        initials.toUpperCase()
      )
    );
  }

  if (props.showPresence && props.presence) {
    photoWrapChildren.push(
      React.createElement("span", {
        key: "presence",
        className: styles.presenceIndicator,
        style: { backgroundColor: presenceConfig.color },
        "aria-label": presenceConfig.label,
        title: presenceConfig.label,
      })
    );
  }

  headerChildren.push(
    React.createElement("div", { key: "photoWrap", className: styles.photoWrap }, photoWrapChildren)
  );

  // Identity block
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
      React.createElement("span", { key: "dept", className: styles.orgLine }, subtitleParts.join(" - "))
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
    React.createElement("div", { key: "header", className: styles.headerRow }, headerChildren)
  );

  // -- Divider --
  children.push(React.createElement("hr", { key: "divider", className: styles.divider }));

  // -- Fields section (structured rows) --
  const fieldEntries: Array<{ label: string; value: string }> = [];
  if (profile.mail) fieldEntries.push({ label: "Email", value: profile.mail });
  if (profile.businessPhones && profile.businessPhones.length > 0) {
    fieldEntries.push({ label: "Office Phone", value: profile.businessPhones[0] });
  }
  if (profile.mobilePhone) fieldEntries.push({ label: "Mobile", value: profile.mobilePhone });
  if (profile.officeLocation) fieldEntries.push({ label: "Office", value: profile.officeLocation });
  if (profile.location) fieldEntries.push({ label: "Building", value: profile.location });
  if (profile.city) fieldEntries.push({ label: "City", value: profile.city });
  if (profile.workHours) fieldEntries.push({ label: "Working Hours", value: profile.workHours });
  if (profile.timezone) fieldEntries.push({ label: "Timezone", value: profile.timezone });
  if (profile.employeeId) fieldEntries.push({ label: "Employee ID", value: profile.employeeId });
  if (profile.tenure) fieldEntries.push({ label: "Tenure", value: profile.tenure });
  if (profile.hireDate) fieldEntries.push({ label: "Hire Date", value: profile.hireDate });
  if (profile.preferredLanguage) fieldEntries.push({ label: "Language", value: profile.preferredLanguage });

  if (fieldEntries.length > 0) {
    const fieldRows: React.ReactNode[] = [];
    fieldEntries.forEach(function (entry) {
      fieldRows.push(
        React.createElement("tr", { key: entry.label },
          React.createElement("td", { className: styles.fieldLabel }, entry.label),
          React.createElement("td", { className: styles.fieldValue }, entry.value)
        )
      );
    });
    children.push(
      React.createElement("table", { key: "fields", className: styles.fieldsTable },
        React.createElement("tbody", undefined, fieldRows)
      )
    );
  }

  // About
  if (profile.aboutMe) {
    children.push(
      React.createElement("div", { key: "about", className: styles.aboutSection },
        React.createElement("span", { className: styles.aboutLabel }, "About"),
        React.createElement("p", { className: styles.aboutText }, profile.aboutMe)
      )
    );
  }

  // Skills section placeholder
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
      React.createElement("div", { key: "skills", className: styles.section },
        React.createElement("span", { className: styles.sectionLabel }, "Skills"),
        React.createElement("div", { className: styles.tagContainer }, skillTags)
      )
    );
  }

  // Badges section placeholder
  if (props.showBadges && props.badges.length > 0) {
    const badgeEls: React.ReactNode[] = [];
    props.badges.forEach(function (badge) {
      const badgeChildren: React.ReactNode[] = [
        React.createElement("span", { key: "icon", className: styles.badgeIcon }, badge.icon),
        React.createElement("span", { key: "name", className: styles.badgeName }, badge.name),
      ];
      if (props.showBadgeDescriptions) {
        badgeChildren.push(
          React.createElement("span", { key: "desc", className: styles.badgeDesc }, " - " + badge.description)
        );
      }
      badgeEls.push(
        React.createElement("div", { key: badge.id, className: styles.badgeItem }, badgeChildren)
      );
    });
    children.push(
      React.createElement("div", { key: "badges", className: styles.section },
        React.createElement("span", { className: styles.sectionLabel }, "Recognition"),
        React.createElement("div", { className: styles.badgeContainer }, badgeEls)
      )
    );
  }

  // Personal info section placeholder
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
      personalChildren.push(
        React.createElement("div", { key: "hobbies", className: styles.personalField },
          React.createElement("span", { className: styles.personalFieldLabel }, "Hobbies:"),
          React.createElement("span", { className: styles.personalFieldValue }, props.personal.hobbies.join(", "))
        )
      );
    }

    if (props.showInterests && props.personal.interests.length > 0) {
      personalChildren.push(
        React.createElement("div", { key: "interests", className: styles.personalField },
          React.createElement("span", { className: styles.personalFieldLabel }, "Interests:"),
          React.createElement("span", { className: styles.personalFieldValue }, props.personal.interests.join(", "))
        )
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
        React.createElement("div", { key: "websites", className: styles.personalField },
          React.createElement("span", { className: styles.personalFieldLabel }, "Websites:"),
          React.createElement("span", { className: styles.personalFieldValue }, websiteEls)
        )
      );
    }

    if (props.showEducation && props.personal.education.length > 0) {
      const eduEls: React.ReactNode[] = [];
      props.personal.education.forEach(function (edu) {
        const parts = edu.degree + " - " + edu.institution;
        eduEls.push(
          React.createElement("div", { key: edu.institution, className: styles.educationItem },
            parts + (edu.yearCompleted ? " (" + edu.yearCompleted + ")" : "")
          )
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "education", className: styles.personalField },
          React.createElement("span", { className: styles.personalFieldLabel }, "Education:"),
          React.createElement("div", { className: styles.educationList }, eduEls)
        )
      );
    }

    if (props.showFunFacts && props.personal.funFacts.length > 0) {
      personalChildren.push(
        React.createElement("div", { key: "facts", className: styles.personalField },
          React.createElement("span", { className: styles.personalFieldLabel }, "Fun Facts:"),
          React.createElement("span", { className: styles.personalFieldValue }, props.personal.funFacts.join(" | "))
        )
      );
    }

    if (personalChildren.length > 0) {
      children.push(
        React.createElement("div", { key: "personal", className: styles.section },
          React.createElement("span", { className: styles.sectionLabel }, "Personal"),
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
        React.createElement("span", { className: styles.managerLabel }, "Reports to:"),
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
      className: styles.profileCorporate,
      "data-instance-id": props.instanceId,
      role: "article",
      "aria-label": "Profile card for " + profile.displayName,
    },
    children
  );
};

export default ProfileCorporate;
