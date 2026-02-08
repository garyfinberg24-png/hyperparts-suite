import * as React from "react";
import type { IHyperDirectoryUser, IDirectoryPresence, DirectoryActionType, DirectoryCardStyle, DirectoryPhotoSize } from "../../models";
import HyperDirectoryUserCard from "../HyperDirectoryUserCard";
import styles from "./GridLayout.module.scss";

export interface IDirectoryLayoutProps {
  users: IHyperDirectoryUser[];
  photoMap: Record<string, string>;
  presenceMap: Record<string, IDirectoryPresence>;
  cardStyle: DirectoryCardStyle;
  photoSize: DirectoryPhotoSize;
  showPresence: boolean;
  showQuickActions: boolean;
  enabledActions: DirectoryActionType[];
  showPhotoPlaceholder: boolean;
  gridColumns?: number;
  onUserClick?: (user: IHyperDirectoryUser) => void;
  onVCardExport?: (user: IHyperDirectoryUser) => void;
}

const GridLayoutInner: React.FC<IDirectoryLayoutProps> = function (props) {
  const { users, photoMap, presenceMap, gridColumns, onUserClick, onVCardExport } = props;

  const gridStyle: React.CSSProperties = {
    "--grid-columns": gridColumns || 3,
  } as React.CSSProperties;

  const items = users.map(function (user) {
    return React.createElement("div", { key: user.id },
      React.createElement(HyperDirectoryUserCard, {
        user: user,
        photoUrl: photoMap[user.id],
        presence: presenceMap[user.id],
        cardStyle: props.cardStyle,
        photoSize: props.photoSize,
        showPresence: props.showPresence,
        showQuickActions: props.showQuickActions,
        enabledActions: props.enabledActions,
        showPhotoPlaceholder: props.showPhotoPlaceholder,
        onClick: onUserClick,
        onVCardExport: onVCardExport,
      })
    );
  });

  return React.createElement("div", {
    className: styles.gridLayout,
    style: gridStyle,
    role: "list",
    "aria-label": "Employee directory grid",
  }, items);
};

export const GridLayout = React.memo(GridLayoutInner);
export default GridLayout;
