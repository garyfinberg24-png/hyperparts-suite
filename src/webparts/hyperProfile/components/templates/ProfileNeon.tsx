import * as React from "react";
import type { IProfileTemplateProps } from "./IProfileTemplateProps";
import { getPhotoShapeStyle } from "../../utils/animationUtils";
import styles from "./ProfileNeon.module.scss";

const ProfileNeon: React.FC<IProfileTemplateProps> = function (props) {
  const profile = props.profile;
  const initials = (profile.givenName ? profile.givenName.charAt(0) : "") + (profile.surname ? profile.surname.charAt(0) : "");

  const children: React.ReactNode[] = [];

  // Header: photo + name
  const photoShapeStyle = getPhotoShapeStyle(props.photoShape || "hexagon");
  const headerChildren: React.ReactNode[] = [];

  const photoEl = props.photoUrl
    ? React.createElement("img", {
        key: "photo",
        src: props.photoUrl,
        alt: profile.displayName,
        className: styles.photo,
        style: photoShapeStyle,
      })
    : React.createElement("div", {
        key: "initials",
        className: styles.initials,
        style: photoShapeStyle,
      }, initials);

  headerChildren.push(React.createElement("div", { key: "photo-wrap", className: styles.photoWrapper }, photoEl));

  const nameChildren: React.ReactNode[] = [];
  nameChildren.push(React.createElement("div", { key: "name", className: styles.displayName }, profile.displayName));
  if (profile.jobTitle) {
    nameChildren.push(React.createElement("div", { key: "title", className: styles.jobTitle }, profile.jobTitle));
  }
  if (profile.department) {
    nameChildren.push(React.createElement("div", { key: "dept", className: styles.department }, profile.department));
  }

  headerChildren.push(React.createElement("div", { key: "nameBlock", className: styles.nameBlock }, nameChildren));
  children.push(React.createElement("div", { key: "header", className: styles.header }, headerChildren));

  // Personal slogan
  if (props.showSlogan && props.personal && props.personal.personalSlogan) {
    children.push(React.createElement("div", { key: "slogan", className: styles.slogan }, "\"" + props.personal.personalSlogan + "\""));
  }

  // Fields section
  const fieldItems: React.ReactNode[] = [];
  if (profile.mail) {
    fieldItems.push(React.createElement("div", { key: "mail", className: styles.fieldItem },
      React.createElement("div", { className: styles.fieldLabel }, "EMAIL"),
      React.createElement("div", { className: styles.fieldValue }, profile.mail)
    ));
  }
  if (profile.mobilePhone) {
    fieldItems.push(React.createElement("div", { key: "phone", className: styles.fieldItem },
      React.createElement("div", { className: styles.fieldLabel }, "MOBILE"),
      React.createElement("div", { className: styles.fieldValue }, profile.mobilePhone)
    ));
  }
  if (profile.officeLocation) {
    fieldItems.push(React.createElement("div", { key: "office", className: styles.fieldItem },
      React.createElement("div", { className: styles.fieldLabel }, "OFFICE"),
      React.createElement("div", { className: styles.fieldValue }, profile.officeLocation)
    ));
  }
  if (profile.city) {
    fieldItems.push(React.createElement("div", { key: "city", className: styles.fieldItem },
      React.createElement("div", { className: styles.fieldLabel }, "LOCATION"),
      React.createElement("div", { className: styles.fieldValue }, profile.city)
    ));
  }

  if (fieldItems.length > 0) {
    children.push(React.createElement("div", { key: "fields", className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "CONTACT"),
      React.createElement("div", { className: styles.fieldsGrid }, fieldItems)
    ));
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
    children.push(React.createElement("div", { key: "skills", className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "SKILLS"),
      React.createElement("div", { className: styles.skillsSection }, skillTags)
    ));
  }

  // Badges
  if (props.showBadges && props.badges.length > 0) {
    const badgeEls: React.ReactNode[] = [];
    props.badges.forEach(function (badge) {
      badgeEls.push(
        React.createElement("span", { key: badge.id, className: styles.badgeItem },
          React.createElement("span", undefined, badge.icon),
          React.createElement("span", undefined, badge.name)
        )
      );
    });
    children.push(React.createElement("div", { key: "badges", className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "RECOGNITION"),
      React.createElement("div", { className: styles.badgesSection }, badgeEls)
    ));
  }

  // Hobbies
  if (props.showHobbies && props.personal && props.personal.hobbies.length > 0) {
    const hobbyEls: React.ReactNode[] = [];
    props.personal.hobbies.forEach(function (hobby) {
      hobbyEls.push(React.createElement("span", { key: hobby, className: styles.hobbyPill }, hobby));
    });
    children.push(React.createElement("div", { key: "hobbies", className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "HOBBIES"),
      React.createElement("div", { className: styles.hobbiesSection }, hobbyEls)
    ));
  }

  // Websites
  if (props.showWebsites && props.personal && props.personal.favoriteWebsites.length > 0) {
    const siteEls: React.ReactNode[] = [];
    props.personal.favoriteWebsites.forEach(function (site) {
      siteEls.push(React.createElement("a", {
        key: site.name,
        href: site.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: styles.websiteChip,
      }, "\u2197 " + site.name));
    });
    children.push(React.createElement("div", { key: "websites", className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "READS"),
      React.createElement("div", { className: styles.hobbiesSection }, siteEls)
    ));
  }

  // Education
  if (props.showEducation && props.personal && props.personal.education.length > 0) {
    const eduEls: React.ReactNode[] = [];
    props.personal.education.forEach(function (edu) {
      eduEls.push(React.createElement("div", { key: edu.institution, className: styles.educationItem },
        React.createElement("span", { className: styles.educationDegree }, edu.degree + (edu.field ? " " + edu.field : "")),
        " \u2014 " + edu.institution + (edu.yearCompleted ? " (" + edu.yearCompleted + ")" : "")
      ));
    });
    children.push(React.createElement("div", { key: "education", className: styles.section },
      React.createElement("div", { className: styles.sectionTitle }, "EDUCATION"),
      eduEls
    ));
  }

  // Manager
  if (props.showManager && props.manager) {
    children.push(React.createElement("div", { key: "manager", className: styles.section },
      React.createElement("span", { className: styles.managerLabel }, "REPORTS TO "),
      React.createElement("button", {
        type: "button",
        className: styles.managerName,
        onClick: function () {
          if (props.manager && props.manager.mail) {
            window.open("mailto:" + props.manager.mail, "_blank");
          }
        },
      }, props.manager.displayName)
    ));
  }

  const cardClass = styles.neonCard + " " + styles.neonBorder;

  return React.createElement("div", {
    className: cardClass,
    role: "region",
    "aria-label": "Profile of " + profile.displayName,
  }, children);
};

export default ProfileNeon;
