import * as React from "react";
import type { IHyperDirectoryUser, IDirectoryPresence, DirectoryActionType, DirectoryCardStyle, DirectoryPhotoSize } from "../models";
import HyperDirectoryPresenceBadge from "./HyperDirectoryPresenceBadge";
import HyperDirectoryQuickActions from "./HyperDirectoryQuickActions";
import { getInitials } from "../utils/userMapper";
import styles from "./HyperDirectoryUserCard.module.scss";

export interface IHyperDirectoryUserCardProps {
  user: IHyperDirectoryUser;
  photoUrl?: string;
  presence?: IDirectoryPresence;
  cardStyle: DirectoryCardStyle;
  photoSize: DirectoryPhotoSize;
  showPresence: boolean;
  showQuickActions: boolean;
  enabledActions: DirectoryActionType[];
  showPhotoPlaceholder: boolean;
  onClick?: (user: IHyperDirectoryUser) => void;
  onVCardExport?: (user: IHyperDirectoryUser) => void;
}

const HyperDirectoryUserCard: React.FC<IHyperDirectoryUserCardProps> = function (props) {
  const {
    user, photoUrl, presence, cardStyle, photoSize,
    showPresence, showQuickActions, enabledActions,
    showPhotoPlaceholder, onClick, onVCardExport,
  } = props;

  const handleClick = React.useCallback(function (): void {
    if (onClick) onClick(user);
  }, [onClick, user]);

  const handleKeyDown = React.useCallback(function (e: React.KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onClick) onClick(user);
    }
  }, [onClick, user]);

  // Card style class — map each preset to its CSS class(es)
  var cardStyleMap: Record<string, string> = {
    standard: styles.userCard,
    compact: styles.userCard + " " + styles.userCardCompact,
    detailed: styles.userCard + " " + styles.userCardDetailed,
    corporate: styles.userCard + " " + styles.userCardCorporate,
    modern: styles.userCard + " " + styles.userCardModern,
    minimal: styles.userCard + " " + styles.userCardMinimal,
    executive: styles.userCard + " " + styles.userCardExecutive,
    glassmorphic: styles.userCard + " " + styles.userCardGlassmorphic,
    neon: styles.userCard + " " + styles.userCardNeon,
    gradient: styles.userCard + " " + styles.userCardGradient,
    elevated: styles.userCard + " " + styles.userCardElevated,
    outlined: styles.userCard + " " + styles.userCardOutlined,
  };
  var cardClass = cardStyleMap[cardStyle || "standard"] || styles.userCard;

  // Photo size classes
  const photoSizeClass = photoSize === "small" ? styles.photoSmall :
    photoSize === "large" ? styles.photoLarge : styles.photoMedium;
  const placeholderSizeClass = photoSize === "small" ? styles.placeholderSmall :
    photoSize === "large" ? styles.placeholderLarge : styles.placeholderMedium;

  // Photo element
  let photoElement: React.ReactElement;
  if (photoUrl) {
    photoElement = React.createElement("img", {
      className: styles.photo + " " + photoSizeClass,
      src: photoUrl,
      alt: user.displayName,
    });
  } else if (showPhotoPlaceholder) {
    photoElement = React.createElement("div", {
      className: styles.photoPlaceholder + " " + placeholderSizeClass,
      "aria-hidden": "true",
    }, getInitials(user.displayName));
  } else {
    // eslint-disable-next-line @rushstack/no-new-null
    photoElement = null as unknown as React.ReactElement;
  }

  // Photo container with optional presence badge
  const photoContainer = React.createElement("div", { className: styles.photoContainer },
    photoElement,
    showPresence ? React.createElement(HyperDirectoryPresenceBadge, {
      presence: presence,
      onPhoto: true,
    }) : undefined
  );

  // Info section
  const infoChildren: React.ReactNode[] = [
    React.createElement("div", { key: "name", className: styles.displayName }, user.displayName),
  ];

  if (user.jobTitle && cardStyle !== "compact") {
    infoChildren.push(
      React.createElement("div", { key: "title", className: styles.jobTitle }, user.jobTitle)
    );
  }

  // Styles that show extended fields (department, location)
  var showExtendedFields = cardStyle === "detailed" || cardStyle === "corporate" ||
    cardStyle === "executive" || cardStyle === "glassmorphic" ||
    cardStyle === "neon" || cardStyle === "gradient" || cardStyle === "elevated";

  if (user.department && showExtendedFields) {
    infoChildren.push(
      React.createElement("div", { key: "dept", className: styles.department }, user.department)
    );
  }

  if (user.officeLocation && showExtendedFields) {
    infoChildren.push(
      React.createElement("div", { key: "loc", className: styles.location }, user.officeLocation)
    );
  }

  // Quick actions
  if (showQuickActions && enabledActions.length > 0) {
    infoChildren.push(
      React.createElement("div", { key: "actions", className: styles.actions },
        React.createElement(HyperDirectoryQuickActions, {
          user: user,
          enabledActions: enabledActions,
          onVCardExport: onVCardExport,
        })
      )
    );
  }

  const info = React.createElement("div", { className: styles.info }, infoChildren);

  return React.createElement("div", {
    className: cardClass,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    role: "button",
    tabIndex: 0,
    "aria-label": user.displayName + (user.jobTitle ? ", " + user.jobTitle : ""),
  }, photoContainer, info);
};

export default React.memo(HyperDirectoryUserCard);
