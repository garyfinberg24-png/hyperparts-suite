import * as React from "react";
import type { SpotlightCategory } from "../models";
import { getCategoryDisplayName, getCategoryEmoji } from "../models";
import styles from "./HyperSpotlightCategoryBadge.module.scss";

export interface IHyperSpotlightCategoryBadgeProps {
  category: SpotlightCategory;
}

const HyperSpotlightCategoryBadge: React.FC<IHyperSpotlightCategoryBadgeProps> = function (props) {
  const label = getCategoryDisplayName(props.category) + " " + getCategoryEmoji(props.category);
  const badgeClass = (styles as Record<string, string>)["badge" + props.category] || styles.badgeDefault;

  return React.createElement(
    "div",
    { className: styles.categoryBadge + " " + badgeClass },
    label
  );
};

export default HyperSpotlightCategoryBadge;
