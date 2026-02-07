import * as React from "react";
import type { IHyperProfileWebPartProps } from "../models";
import { HyperErrorBoundary } from "../../../common/components";
import { HyperSkeleton } from "../../../common/components";
import { HyperEmptyState } from "../../../common/components";
import { useProfileData } from "../hooks/useProfileData";
import { usePresence } from "../hooks/usePresence";
import { getPresenceConfig, getStatusMessage } from "../utils/presenceUtils";
import HyperProfilePhoto from "./HyperProfilePhoto";
import HyperProfileField from "./HyperProfileField";
import HyperProfilePresenceBadge from "./HyperProfilePresenceBadge";
import HyperProfileQuickActions from "./HyperProfileQuickActions";
import HyperProfileCompleteness from "./HyperProfileCompleteness";
import HyperProfileOverlay from "./HyperProfileOverlay";
import styles from "./HyperProfile.module.scss";

export interface IHyperProfileComponentProps extends IHyperProfileWebPartProps {
  instanceId: string;
}

/** Field config for mapping profile data to display fields */
interface IFieldConfig {
  key: string;
  label: string;
  icon: string;
  isLink?: boolean;
}

const DEFAULT_FIELDS: IFieldConfig[] = [
  { key: "mail", label: "Email", icon: "Mail", isLink: true },
  { key: "mobilePhone", label: "Mobile", icon: "CellPhone", isLink: true },
  { key: "businessPhones", label: "Phone", icon: "Phone", isLink: true },
  { key: "department", label: "Department", icon: "Org" },
  { key: "officeLocation", label: "Office", icon: "POI" },
  { key: "city", label: "City", icon: "CityNext" },
  { key: "companyName", label: "Company", icon: "Contact" },
  { key: "preferredLanguage", label: "Language", icon: "LocaleLanguage" },
  { key: "employeeId", label: "Employee ID", icon: "ContactCard" },
  { key: "aboutMe", label: "About", icon: "Info" },
];

const HyperProfileInner: React.FC<IHyperProfileComponentProps> = function (props) {
  const { profile, manager, photoUrl, loading, error } = useProfileData(
    props.defaultUserId
  );

  const presenceResult = usePresence(
    profile ? profile.id : undefined,
    props.showPresence,
    props.presenceRefreshInterval || 30
  );

  // Container styles
  const containerStyles: React.CSSProperties = {
    backgroundColor: props.backgroundColor || "#FFFFFF",
    borderRadius: (props.borderRadius || 8) + "px",
    width: props.width || "auto",
    height: props.height === "fit-content" ? "auto" : (props.height || "auto"),
  };

  if (props.backgroundType === "image" && props.backgroundImageUrl) {
    containerStyles.backgroundImage = "url(" + props.backgroundImageUrl + ")";
    containerStyles.backgroundSize = props.backgroundImageFit || "cover";
    containerStyles.backgroundPosition = props.backgroundImagePosition || "center";
    containerStyles.backgroundRepeat = "no-repeat";
  }

  const shadowClass =
    props.shadow === "light" ? styles.shadowLight
    : props.shadow === "strong" ? styles.shadowStrong
    : props.shadow === "medium" ? styles.shadowMedium
    : "";

  const cardClass = styles.hyperProfile
    + " " + ((styles as Record<string, string>)[props.cardStyle] || styles.standard)
    + (shadowClass ? " " + shadowClass : "");

  // Loading state
  if (loading) {
    return React.createElement(
      "div",
      { className: cardClass, style: containerStyles, role: "region", "aria-label": "User Profile" },
      React.createElement("div", { className: styles.loadingContainer },
        React.createElement(HyperSkeleton, { count: 3 })
      )
    );
  }

  // Error state
  if (error) {
    return React.createElement(
      "div",
      { className: cardClass, style: containerStyles, role: "region", "aria-label": "User Profile" },
      React.createElement(HyperEmptyState, {
        iconName: "Error",
        title: "Unable to load profile",
        description: error.message,
      })
    );
  }

  // No profile
  if (!profile) {
    return React.createElement(
      "div",
      { className: cardClass, style: containerStyles, role: "region", "aria-label": "User Profile" },
      React.createElement(HyperEmptyState, {
        iconName: "Contact",
        title: "No profile found",
        description: "Could not find user profile data.",
      })
    );
  }

  // Build visible fields
  const visibleFields = props.visibleFields || DEFAULT_FIELDS.map(function (f) { return f.key; });
  const fieldOrder = props.fieldOrder || visibleFields;

  const orderedFields: IFieldConfig[] = [];
  fieldOrder.forEach(function (key) {
    if (visibleFields.indexOf(key) === -1) return;
    DEFAULT_FIELDS.forEach(function (f) {
      if (f.key === key) orderedFields.push(f);
    });
  });

  // Presence config
  const presenceConfig = getPresenceConfig(presenceResult.presence);
  const statusMessage = getStatusMessage(presenceResult.presence);

  // Build children array
  const children: React.ReactNode[] = [];

  // Header section: photo + name + title + presence
  const headerChildren: React.ReactNode[] = [];

  // Photo
  headerChildren.push(
    React.createElement(HyperProfilePhoto, {
      key: "photo",
      displayName: profile.displayName,
      photoUrl: photoUrl,
      photoSize: props.photoSize || "medium",
      presence: presenceResult.presence,
      showPresence: props.showPresence && props.presencePosition === "onPhoto",
      presencePosition: props.presencePosition || "onPhoto",
    })
  );

  // Name + title block
  const nameBlockChildren: React.ReactNode[] = [];

  // Display name row (with optional presence badge)
  const nameRowChildren: React.ReactNode[] = [];
  nameRowChildren.push(
    React.createElement("span", { key: "name", className: styles.displayName }, profile.displayName)
  );

  if (props.showPresence && props.presencePosition === "nextToName") {
    nameRowChildren.push(
      React.createElement("span", { key: "presence-inline", className: styles.presenceInline },
        React.createElement(HyperProfilePresenceBadge, { presence: presenceResult.presence }),
        React.createElement("span", { className: styles.presenceLabel }, presenceConfig.label)
      )
    );
  }

  nameBlockChildren.push(
    React.createElement("div", { key: "name-row", className: styles.nameRow }, nameRowChildren)
  );

  // Job title
  if (profile.jobTitle) {
    nameBlockChildren.push(
      React.createElement("span", { key: "title", className: styles.jobTitle }, profile.jobTitle)
    );
  }

  // Status message
  if (props.showStatusMessage && statusMessage) {
    nameBlockChildren.push(
      React.createElement("span", { key: "status", className: styles.statusMessage }, statusMessage)
    );
  }

  headerChildren.push(
    React.createElement("div", { key: "nameBlock", className: styles.nameBlock }, nameBlockChildren)
  );

  children.push(
    React.createElement("div", { key: "header", className: styles.header }, headerChildren)
  );

  // Separate presence badge (below header)
  if (props.showPresence && props.presencePosition === "separate") {
    children.push(
      React.createElement("div", { key: "presence-sep", className: styles.presenceSeparate },
        React.createElement(HyperProfilePresenceBadge, { presence: presenceResult.presence }),
        React.createElement("span", { className: styles.presenceLabel }, presenceConfig.label),
        statusMessage
          ? React.createElement("span", { className: styles.statusMessage }, " \u2014 " + statusMessage)
          : undefined
      )
    );
  }

  // Profile fields
  const fieldElements: React.ReactNode[] = [];
  orderedFields.forEach(function (field) {
    const value = profile[field.key];
    if (!value) return;

    let onLinkClick: (() => void) | undefined;
    if (field.isLink && field.key === "mail") {
      onLinkClick = function () { window.open("mailto:" + value, "_blank"); };
    } else if (field.isLink && (field.key === "mobilePhone" || field.key === "businessPhones")) {
      const phone = Array.isArray(value) ? value[0] : value;
      if (phone) {
        onLinkClick = function () { window.open("tel:" + phone, "_blank"); };
      }
    }

    fieldElements.push(
      React.createElement(HyperProfileField, {
        key: field.key,
        icon: field.icon,
        label: field.label,
        value: value,
        isLink: field.isLink,
        onLinkClick: onLinkClick,
      })
    );
  });

  if (fieldElements.length > 0) {
    children.push(
      React.createElement("div", { key: "fields", className: styles.fieldsSection }, fieldElements)
    );
  }

  // Manager section
  if (manager) {
    const managerChildren: React.ReactNode[] = [];
    managerChildren.push(
      React.createElement("span", { key: "mgr-label", className: styles.managerLabel }, "Reports to")
    );
    managerChildren.push(
      React.createElement("button", {
        key: "mgr-name",
        className: styles.managerLink,
        type: "button",
        onClick: function () {
          if (manager.mail) {
            window.open("mailto:" + manager.mail, "_blank");
          }
        },
      }, manager.displayName)
    );
    if (manager.jobTitle) {
      managerChildren.push(
        React.createElement("span", { key: "mgr-title", className: styles.managerTitle }, manager.jobTitle)
      );
    }

    children.push(
      React.createElement("div", { key: "manager", className: styles.managerSection }, managerChildren)
    );
  }

  // Quick actions
  if (props.showQuickActions && props.enabledActions && props.enabledActions.length > 0) {
    children.push(
      React.createElement(HyperProfileQuickActions, {
        key: "actions",
        profile: profile,
        enabledActionIds: props.enabledActions as string[],
        layout: props.actionsLayout || "horizontal",
        buttonSize: props.buttonSize || "medium",
        showLabels: props.showActionLabels !== false,
      })
    );
  }

  // Profile completeness
  if (props.showCompletenessScore) {
    let fieldWeights: Record<string, number> | undefined;
    if (props.fieldWeights) {
      try {
        fieldWeights = JSON.parse(props.fieldWeights) as Record<string, number>;
      } catch {
        fieldWeights = undefined;
      }
    }

    const completenessEl = React.createElement(HyperProfileCompleteness, {
      key: "completeness",
      profile: profile,
      displayStyle: props.scoreStyle || "progressBar",
      fieldWeights: fieldWeights,
    });

    // Insert at configured position
    if (props.scorePosition === "top") {
      children.unshift(completenessEl);
    } else {
      children.push(completenessEl);
    }
  }

  // Overlay message
  const overlayEl = (props.enableOverlay && props.overlayText)
    ? React.createElement(HyperProfileOverlay, {
        key: "overlay",
        text: props.overlayText,
        overlayColor: props.overlayColor || "#000000",
        overlayTransparency: props.overlayTransparency || 50,
        textColor: props.overlayTextColor || "#ffffff",
        textAlignment: props.overlayTextAlignment || "center",
        position: props.overlayPosition || "bottom",
      })
    : undefined;

  const allChildren: React.ReactNode[] = [];
  if (overlayEl) {
    allChildren.push(overlayEl);
  }
  children.forEach(function (c) { allChildren.push(c); });

  return React.createElement(
    "div",
    { className: cardClass, style: containerStyles, role: "region", "aria-label": "Profile of " + profile.displayName },
    allChildren
  );
};

const HyperProfile: React.FC<IHyperProfileComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperProfileInner, props)
  );
};

export default HyperProfile;
