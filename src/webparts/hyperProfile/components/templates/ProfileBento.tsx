import * as React from "react";
import styles from "./ProfileBento.module.scss";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import { getPresenceConfig, getStatusMessage } from "../../utils/presenceUtils";

/**
 * Bento template — multi-panel CSS Grid (2x3 layout).
 * Photo panel, info panel, skills panel, badges panel, calendar panel, personal panel.
 * Each panel is a mini card with rounded corners. Indigo accent (#6366f1).
 */
const ProfileBento: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const presenceConfig = getPresenceConfig(props.presence);
  const statusMessage = getStatusMessage(props.presence);
  const photoShapeStyle = getPhotoShapeStyle(props.photoShape);

  const panels: React.ReactNode[] = [];

  // ── Panel 1: Photo ──
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

  // Name under photo in the photo panel
  photoChildren.push(
    React.createElement("h2", { key: "name", className: styles.name }, profile.displayName)
  );
  if (profile.pronouns) {
    photoChildren.push(
      React.createElement("span", { key: "pronouns", className: styles.pronouns }, profile.pronouns)
    );
  }
  if (profile.jobTitle) {
    photoChildren.push(
      React.createElement("span", { key: "title", className: styles.jobTitle }, profile.jobTitle)
    );
  }

  panels.push(
    React.createElement("div", { key: "photoPanel", className: styles.panel + " " + styles.photoPanel }, photoChildren)
  );

  // ── Panel 2: Info ──
  const infoChildren: React.ReactNode[] = [];
  infoChildren.push(
    React.createElement("h3", { key: "infoTitle", className: styles.panelTitle }, "Info")
  );

  const subtitleParts: string[] = [];
  if (profile.department) subtitleParts.push(profile.department);
  if (profile.companyName) subtitleParts.push(profile.companyName);
  if (subtitleParts.length > 0) {
    infoChildren.push(
      React.createElement("span", { key: "dept", className: styles.department }, subtitleParts.join(" | "))
    );
  }

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

  // Compact fields
  const fieldEntries: Array<{ label: string; value: string }> = [];
  if (profile.mail) fieldEntries.push({ label: "Email", value: profile.mail });
  if (profile.mobilePhone) fieldEntries.push({ label: "Mobile", value: profile.mobilePhone });
  if (profile.officeLocation) fieldEntries.push({ label: "Office", value: profile.officeLocation });
  if (profile.city) fieldEntries.push({ label: "City", value: profile.city });
  if (profile.workHours) fieldEntries.push({ label: "Hours", value: profile.workHours });
  if (profile.tenure) fieldEntries.push({ label: "Tenure", value: profile.tenure });

  fieldEntries.forEach(function (entry) {
    infoChildren.push(
      React.createElement("div", { key: entry.label, className: styles.fieldRow },
        React.createElement("span", { className: styles.fieldLabel }, entry.label),
        React.createElement("span", { className: styles.fieldValue }, entry.value)
      )
    );
  });

  if (profile.aboutMe) {
    infoChildren.push(
      React.createElement("p", { key: "about", className: styles.aboutMe }, profile.aboutMe)
    );
  }

  panels.push(
    React.createElement("div", { key: "infoPanel", className: styles.panel + " " + styles.infoPanel }, infoChildren)
  );

  // ── Panel 3: Skills ──
  if (props.showSkills) {
    const skillsChildren: React.ReactNode[] = [];
    skillsChildren.push(
      React.createElement("h3", { key: "skillsTitle", className: styles.panelTitle }, "Skills")
    );

    if (props.skills.length > 0) {
      const skillTags: React.ReactNode[] = [];
      props.skills.forEach(function (skill) {
        skillTags.push(
          React.createElement("span", { key: skill.name, className: styles.skillTag },
            skill.name + (props.showEndorsements ? " (" + skill.endorsementCount + ")" : "")
          )
        );
      });
      skillsChildren.push(
        React.createElement("div", { key: "tags", className: styles.tagsWrap }, skillTags)
      );
    } else {
      skillsChildren.push(
        React.createElement("span", { key: "empty", className: styles.emptyText }, "No skills added")
      );
    }

    panels.push(
      React.createElement("div", { key: "skillsPanel", className: styles.panel + " " + styles.skillsPanel }, skillsChildren)
    );
  }

  // ── Panel 4: Badges ──
  if (props.showBadges) {
    const badgesChildren: React.ReactNode[] = [];
    badgesChildren.push(
      React.createElement("h3", { key: "badgesTitle", className: styles.panelTitle }, "Badges")
    );

    if (props.badges.length > 0) {
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
      badgesChildren.push(
        React.createElement("div", { key: "list", className: styles.badgeList }, badgeEls)
      );
    } else {
      badgesChildren.push(
        React.createElement("span", { key: "empty", className: styles.emptyText }, "No badges earned")
      );
    }

    panels.push(
      React.createElement("div", { key: "badgesPanel", className: styles.panel + " " + styles.badgesPanel }, badgesChildren)
    );
  }

  // ── Panel 5: Actions / Calendar ──
  const actCalChildren: React.ReactNode[] = [];
  actCalChildren.push(
    React.createElement("h3", { key: "actTitle", className: styles.panelTitle }, "Actions")
  );

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
    actCalChildren.push(
      React.createElement("div", { key: "actions", className: styles.actionsGrid }, actionBtns)
    );
  }

  if (props.showManager && props.manager) {
    actCalChildren.push(
      React.createElement("div", { key: "manager", className: styles.managerSection },
        React.createElement("span", { className: styles.managerLabel }, "Manager:"),
        React.createElement("span", { className: styles.managerName }, props.manager.displayName),
        props.manager.jobTitle
          ? React.createElement("span", { className: styles.managerTitle }, props.manager.jobTitle)
          : undefined
      )
    );
  }

  panels.push(
    React.createElement("div", { key: "actionsPanel", className: styles.panel + " " + styles.actionsPanel }, actCalChildren)
  );

  // ── Panel 6: Personal ──
  if (props.personal) {
    const personalChildren: React.ReactNode[] = [];
    personalChildren.push(
      React.createElement("h3", { key: "personalTitle", className: styles.panelTitle }, "Personal")
    );

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
        React.createElement("div", { key: "hobbies", className: styles.tagsWrap }, hobbyTags)
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
            edu.degree + " - " + edu.institution + (edu.yearCompleted ? " (" + edu.yearCompleted + ")" : "")
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
          React.createElement("span", { key: fact, className: styles.funFactTag }, fact)
        );
      });
      personalChildren.push(
        React.createElement("div", { key: "funFacts", className: styles.tagsWrap }, factTags)
      );
    }

    if (personalChildren.length > 1) {
      panels.push(
        React.createElement("div", { key: "personalPanel", className: styles.panel + " " + styles.personalPanel }, personalChildren)
      );
    }
  }

  return React.createElement(
    "div",
    {
      className: styles.profileBento,
      "data-instance-id": props.instanceId,
      role: "article",
      "aria-label": "Profile card for " + profile.displayName,
    },
    panels
  );
};

export default ProfileBento;
