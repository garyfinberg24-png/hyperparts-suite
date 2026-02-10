import * as React from "react";
import styles from "./ProfileExecutive.module.scss";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import { getPresenceConfig, getStatusMessage } from "../../utils/presenceUtils";

/**
 * Executive template — dark navy card with gold accent.
 * Large circle photo on left, elegant typography on right.
 * Gold-bordered action buttons, minimal fields, premium feel.
 */
const ProfileExecutive: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const presenceConfig = getPresenceConfig(props.presence);
  const statusMessage = getStatusMessage(props.presence);
  const photoShapeStyle = getPhotoShapeStyle(props.photoShape);

  const children: React.ReactNode[] = [];

  // -- Photo column --
  const photoChildren: React.ReactNode[] = [];

  const photoStyle: React.CSSProperties = {};
  const shapeKeys = Object.keys(photoShapeStyle);
  shapeKeys.forEach(function (k) {
    (photoStyle as Record<string, unknown>)[k] = (photoShapeStyle as Record<string, unknown>)[k];
  });

  if (props.photoUrl) {
    photoChildren.push(
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
    photoChildren.push(
      React.createElement(
        "div",
        { key: "initials", className: styles.initialsCircle, style: photoStyle },
        initials.toUpperCase()
      )
    );
  }

  // Presence dot on photo
  if (props.showPresence && props.presence) {
    photoChildren.push(
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
    React.createElement("div", { key: "photoCol", className: styles.photoColumn }, photoChildren)
  );

  // -- Info column --
  const infoChildren: React.ReactNode[] = [];

  // Name
  infoChildren.push(
    React.createElement("h2", { key: "name", className: styles.name }, profile.displayName)
  );

  // Pronouns
  if (profile.pronouns) {
    infoChildren.push(
      React.createElement("span", { key: "pronouns", className: styles.pronouns }, profile.pronouns)
    );
  }

  // Job title
  if (profile.jobTitle) {
    infoChildren.push(
      React.createElement("span", { key: "title", className: styles.jobTitle }, profile.jobTitle)
    );
  }

  // Department + company
  const subtitleParts: string[] = [];
  if (profile.department) subtitleParts.push(profile.department);
  if (profile.companyName) subtitleParts.push(profile.companyName);
  if (subtitleParts.length > 0) {
    infoChildren.push(
      React.createElement("span", { key: "dept", className: styles.department }, subtitleParts.join(" | "))
    );
  }

  // Presence status message
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

  // Profile fields (minimal for executive)
  const fieldEntries: Array<{ label: string; value: string }> = [];
  if (profile.mail) fieldEntries.push({ label: "Email", value: profile.mail });
  if (profile.officeLocation) fieldEntries.push({ label: "Office", value: profile.officeLocation });
  if (profile.mobilePhone) fieldEntries.push({ label: "Mobile", value: profile.mobilePhone });
  if (profile.city) fieldEntries.push({ label: "Location", value: profile.city });
  if (profile.workHours) fieldEntries.push({ label: "Hours", value: profile.workHours });
  if (profile.tenure) fieldEntries.push({ label: "Tenure", value: profile.tenure });

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
    infoChildren.push(
      React.createElement("div", { key: "fields", className: styles.fieldsSection }, fieldEls)
    );
  }

  // About me
  if (profile.aboutMe) {
    infoChildren.push(
      React.createElement("p", { key: "about", className: styles.aboutMe }, profile.aboutMe)
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
    infoChildren.push(
      React.createElement("div", { key: "skills", className: styles.skillsSection }, skillTags)
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
          React.createElement("span", { key: "desc", className: styles.badgeDesc }, badge.description)
        );
      }
      badgeEls.push(
        React.createElement("div", { key: badge.id, className: styles.badgeItem }, badgeChildren)
      );
    });
    infoChildren.push(
      React.createElement("div", { key: "badges", className: styles.badgesSection }, badgeEls)
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
      const hobbyTags: React.ReactNode[] = [];
      props.personal.hobbies.forEach(function (hobby) {
        hobbyTags.push(
          React.createElement("span", { key: hobby, className: styles.hobbyTag }, hobby)
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "hobbies", className: styles.hobbiesRow }, hobbyTags)
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

    if (props.showInterests && props.personal.interests.length > 0) {
      const interestTags: React.ReactNode[] = [];
      props.personal.interests.forEach(function (interest) {
        interestTags.push(
          React.createElement("span", { key: interest, className: styles.interestTag }, interest)
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "interests", className: styles.interestsRow }, interestTags)
      );
    }

    if (props.showEducation && props.personal.education.length > 0) {
      const eduEls: React.ReactNode[] = [];
      props.personal.education.forEach(function (edu) {
        eduEls.push(
          React.createElement("div", { key: edu.institution, className: styles.educationItem },
            React.createElement("span", { className: styles.eduDegree }, edu.degree),
            React.createElement("span", { className: styles.eduInstitution }, edu.institution),
            edu.yearCompleted
              ? React.createElement("span", { className: styles.eduYear }, edu.yearCompleted)
              : undefined
          )
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "education", className: styles.educationSection }, eduEls)
      );
    }

    if (props.showFunFacts && props.personal.funFacts.length > 0) {
      const factEls: React.ReactNode[] = [];
      props.personal.funFacts.forEach(function (fact) {
        factEls.push(
          React.createElement("span", { key: fact, className: styles.funFact }, fact)
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "funFacts", className: styles.funFactsRow }, factEls)
      );
    }

    if (personalChildren.length > 0) {
      infoChildren.push(
        React.createElement("div", { key: "personal", className: styles.personalSection }, personalChildren)
      );
    }
  }

  // Quick actions placeholder
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
    infoChildren.push(
      React.createElement("div", { key: "actions", className: styles.actionsRow }, actionBtns)
    );
  }

  // Manager section
  if (props.showManager && props.manager) {
    infoChildren.push(
      React.createElement("div", { key: "manager", className: styles.managerSection },
        React.createElement("span", { className: styles.managerLabel }, "Reports to"),
        React.createElement("span", { className: styles.managerName }, props.manager.displayName),
        props.manager.jobTitle
          ? React.createElement("span", { className: styles.managerTitle }, props.manager.jobTitle)
          : undefined
      )
    );
  }

  children.push(
    React.createElement("div", { key: "infoCol", className: styles.infoColumn }, infoChildren)
  );

  return React.createElement(
    "div",
    {
      className: styles.profileExecutive,
      "data-instance-id": props.instanceId,
      role: "article",
      "aria-label": "Profile card for " + profile.displayName,
    },
    children
  );
};

export default ProfileExecutive;
