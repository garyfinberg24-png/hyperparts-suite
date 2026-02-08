import * as React from "react";
import type { PaginationMode } from "../models";
import styles from "./HyperRollupPagination.module.scss";

export interface IHyperRollupPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  paginationMode: PaginationMode;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  onLoadMore: () => void;
}

const HyperRollupPaginationInner: React.FC<IHyperRollupPaginationProps> = (props) => {
  const { currentPage, totalItems, pageSize, paginationMode, onPageChange, onLoadMore } = props;

  if (paginationMode === "infinite") {
    // Infinite scroll is handled by scroll listener in parent
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  if (paginationMode === "loadMore") {
    const displayed = Math.min(currentPage * pageSize, totalItems);
    if (displayed >= totalItems) {
      // eslint-disable-next-line @rushstack/no-new-null
      return null;
    }
    return React.createElement(
      "div",
      { className: styles.loadMoreContainer },
      React.createElement(
        "button",
        { className: styles.loadMoreButton, onClick: onLoadMore },
        "Load more (" + String(totalItems - displayed) + " remaining)"
      )
    );
  }

  // Paged mode
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalPages <= 1) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  // Build page numbers (show max 7 pages with ellipsis)
  const pageNumbers: Array<number | string> = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) {
      pageNumbers.push("...");
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }
    pageNumbers.push(totalPages);
  }

  const elements: React.ReactElement[] = [];

  // Prev button
  elements.push(
    React.createElement(
      "button",
      {
        key: "prev",
        className: styles.pageButton,
        onClick: function () { onPageChange(currentPage - 1); },
        disabled: currentPage === 1,
        "aria-label": "Previous page",
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--ChevronLeft", "aria-hidden": "true" })
    )
  );

  // Page numbers
  pageNumbers.forEach(function (pageNum, idx) {
    if (typeof pageNum === "string") {
      elements.push(
        React.createElement("span", { key: "ellipsis-" + String(idx), className: styles.ellipsis }, "...")
      );
    } else {
      elements.push(
        React.createElement(
          "button",
          {
            key: pageNum,
            className: styles.pageButton + (pageNum === currentPage ? " " + styles.activePage : ""),
            onClick: function () { onPageChange(pageNum as number); },
            "aria-label": "Page " + String(pageNum),
            "aria-current": pageNum === currentPage ? "page" : undefined,
          },
          String(pageNum)
        )
      );
    }
  });

  // Next button
  elements.push(
    React.createElement(
      "button",
      {
        key: "next",
        className: styles.pageButton,
        onClick: function () { onPageChange(currentPage + 1); },
        disabled: currentPage === totalPages,
        "aria-label": "Next page",
      },
      React.createElement("i", { className: "ms-Icon ms-Icon--ChevronRight", "aria-hidden": "true" })
    )
  );

  return React.createElement(
    "nav",
    { className: styles.pagination, role: "navigation", "aria-label": "Pagination" },
    elements
  );
};

export const HyperRollupPagination = React.memo(HyperRollupPaginationInner);
