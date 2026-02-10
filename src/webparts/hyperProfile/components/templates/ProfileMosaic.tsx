import * as React from "react";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import { getPresenceConfig, getStatusMessage } from "../../utils/presenceUtils";
import styles from "./ProfileMosaic.module.scss";

/**
 * ProfileMosaic -- Asymmetric 3-column CSS Grid mosaic layout.
 * Each tile has a unique subtle warm bg color, rounded corners,
 * and micro-shadows. Skills tile shows endorsement bars.
 * Accent: #f97316 (orange).
 */
const ProfileMosaic: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const initials =
    (profile.givenName ? profile.givenName.charAt(0) : "") +
    (profile.surname ? profile.surname.charAt(0) : "");

  const photoShapeStyle = getPhotoShapeStyle(props.photoShape || "rounded");
  const presenceConfig = getPresenceConfig(props.presence);
  const statusMsg = getStatusMessage(props.presence);

  const cells: React.ReactNode[] = [];

  // ── Tile 1: Photo (large tile, spans 2 rows) ──
  const photoStyle: React.CSSProperties = { width: "100%", height: "100%" };
  const shapeKeys = Object.keys(photoShapeStyle);
  shapeKeys.forEach(function (k) {
    (photoStyle as Record<string, unknown>)[k] = (photoShapeStyle as Record<string, unknown>)[k];
  });

  const photoTileChildren: React.ReactNode[] = [];

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

  photoTileChildren.push(
    React.createElement("div", { key: "photo-wrap", className: styles.photoWrapper }, photoWrapChildren)
  );

  cells.push(
    React.createElement("div", {
      key: "photo-tile",
      className: styles.tile + " " + styles.tilePhoto + " " + styles.tileTall,
    }, photoTileChildren)
  );

  // ── Tile 2: Name + title ──
  const nameChildren: React.ReactNode[] = [];
  nameChildren.push(
    React.createElement("h2", { key: "name", className: styles.displayName }, profile.displayName)
  );
  if (profile.jobTitle) {
    nameChildren.push(
      React.createElement("div", { key: "title", className: styles.jobTitle }, profile.jobTitle)
    );
  }
  if (profile.department) {
    nameChildren.push(
      React.createElement("div", { key: "dept", className: styles.department }, profile.department)
    );
  }

  // Presence label
  if (props.showPresence && props.presence) {
    nameChildren.push(
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
    nameChildren.push(
      React.createElement("div", { key: "status", className: styles.statusMessage }, statusMsg)
    );
  }

  cells.push(
    React.createElement("div", {
      key: "name-tile",
      className: styles.tile + " " + styles.tileName,
    }, nameChildren)
  );

  // ── Tile: Contact fields ──
  const fieldItems: React.ReactNode[] = [];
  if (profile.mail) {
    fieldItems.push(
      React.createElement("div", { key: "mail", className: styles.fieldItem },
        React.createElement("span", { className: styles.fieldLabel }, "Email"),
        React.createElement("span", { className: styles.fieldValue }, profile.mail)
      )
    );
  }
  if (profile.mobilePhone) {
    fieldItems.push(
      React.createElement("div", { key: "phone", className: styles.fieldItem },
        React.createElement("span", { className: styles.fieldLabel }, "Phone"),
        React.createElement("span", { className: styles.fieldValue }, profile.mobilePhone)
      )
    );
  }
  if (profile.officeLocation) {
    fieldItems.push(
      React.createElement("div", { key: "office", className: styles.fieldItem },
        React.createElement("span", { className: styles.fieldLabel }, "Office"),
        React.createElement("span", { className: styles.fieldValue }, profile.officeLocation)
      )
    );
  }
  if (profile.city) {
    fieldItems.push(
      React.createElement("div", { key: "city", className: styles.fieldItem },
        React.createElement("span", { className: styles.fieldLabel }, "Location"),
        React.createElement("span", { className: styles.fieldValue }, profile.city)
      )
    );
  }
  if (fieldItems.length > 0) {
    cells.push(
      React.createElement("div", {
        key: "contact-tile",
        className: styles.tile + " " + styles.tileContact,
      },
        React.createElement("div", { className: styles.tileTitle }, "Contact"),
        fieldItems
      )
    );
  }

  // ── Tile: Slogan ──
  if (props.showSlogan && props.personal && props.personal.personalSlogan) {
    cells.push(
      React.createElement("div", {
        key: "slogan-tile",
        className: styles.tile + " " + styles.tileSlogan,
      },
        React.createElement("div", { className: styles.sloganText },
          "\u201C" + props.personal.personalSlogan + "\u201D"
        )
      )
    );
  }

  // ── Tile: Skills with endorsement bars (spans across) ──
  if (props.showSkills && props.skills.length > 0) {
    const skillEls: React.ReactNode[] = [];
    props.skills.forEach(function (skill) {
      const pct = Math.min(skill.level * 20, 100);
      const skillChildren: React.ReactNode[] = [];
      skillChildren.push(
        React.createElement("div", { key: "meta", className: styles.skillMeta },
          React.createElement("span", { className: styles.skillName }, skill.name),
          props.showEndorsements && skill.endorsementCount > 0
            ? React.createElement("span", { className: styles.skillEndorsements }, skill.endorsementCount + "")
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

    // Skills tile spans wide if many skills
    let skillTileClass = styles.tile + " " + styles.tileSkills;
    if (props.skills.length > 3) {
      skillTileClass = skillTileClass + " " + styles.tileWide;
    }
    cells.push(
      React.createElement("div", { key: "skills-tile", className: skillTileClass },
        React.createElement("div", { className: styles.tileTitle }, "Skills"),
        React.createElement("div", { className: styles.skillsList }, skillEls)
      )
    );
  }

  // ── Tile: Badges (icon + name + description) ──
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
        React.createElement("div", { key: badge.id, className: styles.badgeItem }, badgeChildren)
      );
    });
    cells.push(
      React.createElement("div", {
        key: "badges-tile",
        className: styles.tile + " " + styles.tileBadges,
      },
        React.createElement("div", { className: styles.tileTitle }, "Recognition"),
        React.createElement("div", { className: styles.badgeGrid }, badgeEls)
      )
    );
  }

  // ── Tile: Personal (hobbies + websites) ──
  const personalChildren: React.ReactNode[] = [];
  if (props.showHobbies && props.personal && props.personal.hobbies.length > 0) {
    const hobbyEls: React.ReactNode[] = [];
    props.personal.hobbies.forEach(function (hobby) {
      hobbyEls.push(
        React.createElement("span", { key: hobby, className: styles.hobbyPill }, hobby)
      );
    });
    personalChildren.push(
      React.createElement("div", { key: "hobbies-group" },
        React.createElement("div", { className: styles.tileSubtitle }, "Hobbies"),
        React.createElement("div", { className: styles.pillRow }, hobbyEls)
      )
    );
  }
  if (props.showWebsites && props.personal && props.personal.favoriteWebsites.length > 0) {
    const siteEls: React.ReactNode[] = [];
    props.personal.favoriteWebsites.forEach(function (site) {
      siteEls.push(
        React.createElement("a", {
          key: site.name,
          href: site.url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: styles.websiteChip,
        }, "\u2197 " + site.name)
      );
    });
    personalChildren.push(
      React.createElement("div", { key: "websites-group", style: { marginTop: "12px" } },
        React.createElement("div", { className: styles.tileSubtitle }, "Reads"),
        React.createElement("div", { className: styles.pillRow }, siteEls)
      )
    );
  }
  if (personalChildren.length > 0) {
    cells.push(
      React.createElement("div", {
        key: "personal-tile",
        className: styles.tile + " " + styles.tilePersonal,
      },
        React.createElement("div", { className: styles.tileTitle }, "Personal"),
        personalChildren
      )
    );
  }

  // ── Tile: Education ──
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
    cells.push(
      React.createElement("div", {
        key: "education-tile",
        className: styles.tile + " " + styles.tileEducation,
      },
        React.createElement("div", { className: styles.tileTitle }, "Education"),
        eduEls
      )
    );
  }

  // ── Tile: Manager ──
  if (props.showManager && props.manager) {
    cells.push(
      React.createElement("div", {
        key: "manager-tile",
        className: styles.tile + " " + styles.tileManager,
      },
        React.createElement("div", { className: styles.tileTitle }, "Reports To"),
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
    className: styles.mosaicGrid,
    role: "region",
    "aria-label": "Profile of " + profile.displayName,
  }, cells);
};

export default ProfileMosaic;
