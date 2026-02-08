import * as React from "react";
import { useHyperSearchStore } from "../store/useHyperSearchStore";
import styles from "./HyperSearchPagination.module.scss";

export interface IHyperSearchPaginationProps {
  resultsPerPage: number;
}

const HyperSearchPagination: React.FC<IHyperSearchPaginationProps> = function (props) {
  const store = useHyperSearchStore();

  const currentPage = Math.floor(store.query.startRow / props.resultsPerPage) + 1;
  const totalPages = Math.ceil(store.totalResults / props.resultsPerPage);

  if (totalPages <= 1) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const handlePrev = function (): void {
    const newStart = Math.max(0, store.query.startRow - props.resultsPerPage);
    store.setStartRow(newStart);
  };

  const handleNext = function (): void {
    const newStart = store.query.startRow + props.resultsPerPage;
    if (newStart < store.totalResults) {
      store.setStartRow(newStart);
    }
  };

  return React.createElement(
    "div",
    { className: styles.pagination },
    React.createElement(
      "button",
      {
        type: "button",
        className: styles.pageButton,
        disabled: currentPage <= 1,
        onClick: handlePrev,
        "aria-label": "Previous page",
      },
      "Previous"
    ),
    React.createElement(
      "span",
      { className: styles.pageInfo },
      "Page " + currentPage + " of " + totalPages
    ),
    React.createElement(
      "button",
      {
        type: "button",
        className: styles.pageButton,
        disabled: currentPage >= totalPages,
        onClick: handleNext,
        "aria-label": "Next page",
      },
      "Next"
    )
  );
};

export default HyperSearchPagination;
