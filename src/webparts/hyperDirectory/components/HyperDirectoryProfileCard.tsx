import * as React from "react";
import * as strings from "HyperDirectoryWebPartStrings";
import { HyperModal } from "../../../common/components";
import type { IHyperDirectoryUser, DirectoryActionType, IDirectoryPresence } from "../models";
import HyperDirectoryPresenceBadge from "./HyperDirectoryPresenceBadge";
import HyperDirectoryQuickActions from "./HyperDirectoryQuickActions";
import { getInitials } from "../utils/userMapper";
import styles from "./HyperDirectoryProfileCard.module.scss";

export interface IHyperDirectoryProfileCardProps {
  isOpen: boolean;
  user: IHyperDirectoryUser | undefined;
  photoUrl?: string;
  presence?: IDirectoryPresence;
  enabledActions: DirectoryActionType[];
  showPresence: boolean;
  onClose: () => void;
  onVCardExport?: (user: IHyperDirectoryUser) => void;
}

/** Field row helper */
function renderField(label: string, value: string | undefined, key: string): React.ReactElement | undefined {
  if (!value) return undefined;
  return React.createElement("div", { key: key, className: styles.fieldRow },
    React.createElement("span", { className: styles.fieldLabel }, label),
    React.createElement("span", { className: styles.fieldValue }, value)
  );
}

const HyperDirectoryProfileCardInner: React.FC<IHyperDirectoryProfileCardProps> = function (props) {
  const { isOpen, user, photoUrl, presence, enabledActions, showPresence, onClose, onVCardExport } = props;

  if (!user) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Photo element
  const photoEl = photoUrl
    ? React.createElement("img", {
        className: styles.profilePhoto,
        src: photoUrl,
        alt: user.displayName,
      })
    : React.createElement("div", {
        className: styles.profilePhotoPlaceholder,
        "aria-hidden": "true",
      }, getInitials(user.displayName));

  // Presence badge
  const presenceEl = showPresence
    ? React.createElement("div", { className: styles.presenceRow },
        React.createElement(HyperDirectoryPresenceBadge, { presence: presence }),
        React.createElement("span", { className: styles.presenceText },
          presence ? presence.availability : "Unknown"
        )
      )
    : undefined;

  // Header section (photo + name + title + presence)
  const header = React.createElement("div", { className: styles.profileHeader },
    React.createElement("div", { className: styles.photoWrapper },
      photoEl,
      showPresence ? React.createElement(HyperDirectoryPresenceBadge, {
        presence: presence,
        onPhoto: true,
      }) : undefined
    ),
    React.createElement("div", { className: styles.headerInfo },
      React.createElement("h3", { className: styles.profileName }, user.displayName),
      user.jobTitle
        ? React.createElement("div", { className: styles.profileTitle }, user.jobTitle)
        : undefined,
      user.department
        ? React.createElement("div", { className: styles.profileDepartment }, user.department)
        : undefined,
      presenceEl
    )
  );

  // Detail fields
  const fields: React.ReactNode[] = [];
  fields.push(renderField(strings.EmailActionLabel, user.mail, "mail"));
  fields.push(renderField(strings.PhoneLabel, user.businessPhones && user.businessPhones.length > 0 ? user.businessPhones[0] : undefined, "phone"));
  fields.push(renderField(strings.MobileLabel, user.mobilePhone, "mobile"));
  fields.push(renderField(strings.LocationLabel, user.officeLocation, "location"));
  fields.push(renderField(strings.CompanyLabel, user.companyName, "company"));
  fields.push(renderField(strings.ManagerLabel, user.managerDisplayName, "manager"));

  // Extension attributes
  if (user.extensionAttributes) {
    Object.keys(user.extensionAttributes).forEach(function (attrKey) {
      const val = user.extensionAttributes ? user.extensionAttributes[attrKey] : undefined;
      if (val) {
        fields.push(renderField(attrKey, val, "ext_" + attrKey));
      }
    });
  }

  // About me
  if (user.aboutMe) {
    fields.push(
      React.createElement("div", { key: "about", className: styles.aboutSection },
        React.createElement("div", { className: styles.aboutLabel }, "About"),
        React.createElement("div", { className: styles.aboutText }, user.aboutMe)
      )
    );
  }

  // Filter out undefined entries
  const validFields = fields.filter(function (f) { return f !== undefined; });

  // Quick actions
  const actionsEl = enabledActions.length > 0
    ? React.createElement("div", { className: styles.profileActions },
        React.createElement(HyperDirectoryQuickActions, {
          user: user,
          enabledActions: enabledActions,
          onVCardExport: onVCardExport,
        })
      )
    : undefined;

  // Modal body
  const body = React.createElement("div", { className: styles.profileBody },
    header,
    actionsEl,
    React.createElement("div", { className: styles.fieldsSection }, validFields)
  );

  return React.createElement(HyperModal, {
    isOpen: isOpen,
    onClose: onClose,
    title: strings.ProfileCardTitle,
    size: "medium",
  }, body);
};

export const HyperDirectoryProfileCard = React.memo(HyperDirectoryProfileCardInner);
export default HyperDirectoryProfileCard;
