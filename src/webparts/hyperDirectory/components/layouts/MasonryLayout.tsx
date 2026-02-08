import * as React from "react";
import Masonry from "react-masonry-css";
import type { IDirectoryLayoutProps } from "./GridLayout";
import HyperDirectoryUserCard from "../HyperDirectoryUserCard";
import styles from "./MasonryLayout.module.scss";

export interface IMasonryLayoutProps extends IDirectoryLayoutProps {
  masonryColumns?: number;
}

const MasonryLayoutInner: React.FC<IMasonryLayoutProps> = function (props) {
  const { users, photoMap, presenceMap, masonryColumns, onUserClick, onVCardExport } = props;

  const columns = masonryColumns || 3;
  const breakpointCols = {
    default: columns,
    1024: Math.min(columns, 3),
    768: 2,
    480: 1,
  };

  const items = users.map(function (user) {
    return React.createElement("div", { key: user.id, className: styles.masonryItem },
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

  return React.createElement("div", { className: styles.masonryLayout },
    React.createElement(Masonry, {
      breakpointCols: breakpointCols,
      className: "my-masonry-grid",
      columnClassName: "my-masonry-grid_column",
    }, items)
  );
};

export const MasonryLayout = React.memo(MasonryLayoutInner);
export default MasonryLayout;
