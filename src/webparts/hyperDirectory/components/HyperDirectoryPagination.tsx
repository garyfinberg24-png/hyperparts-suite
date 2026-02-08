import * as React from "react";
import styles from "./HyperDirectoryPagination.module.scss";

export interface IHyperDirectoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  mode: "paged" | "infinite";
  onPageChange: (page: number) => void;
  onLoadMore?: () => void;
}

const HyperDirectoryPagination: React.FC<IHyperDirectoryPaginationProps> = function (props) {
  const { currentPage, totalPages, mode, onPageChange, onLoadMore } = props;

  // Infinite scroll trigger
  if (mode === "infinite") {
    const triggerRef = React.useRef<HTMLDivElement>(
      // eslint-disable-next-line @rushstack/no-new-null
      null
    );

    React.useEffect(function () {
      if (!triggerRef.current || !onLoadMore) return undefined;

      const observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      }, { threshold: 0.1 });

      observer.observe(triggerRef.current);

      return function () { observer.disconnect(); };
    }, [onLoadMore]);

    if (currentPage >= totalPages - 1) {
      // eslint-disable-next-line @rushstack/no-new-null
      return null;
    }

    return React.createElement("div", {
      ref: triggerRef,
      className: styles.infiniteTrigger,
    }, "Loading more...");
  }

  // Paged mode
  if (totalPages <= 1) {
    // eslint-disable-next-line @rushstack/no-new-null
    return null;
  }

  const pageButtons: React.ReactNode[] = [];

  // Previous button
  pageButtons.push(React.createElement("button", {
    key: "prev",
    type: "button",
    className: styles.pageButton,
    disabled: currentPage === 0,
    onClick: function () { onPageChange(currentPage - 1); },
    "aria-label": "Previous page",
  }, "\u2039"));

  // Page number buttons (show max 7 pages with ellipsis)
  const maxVisible = 7;
  let startPage = 0;
  let endPage = totalPages;

  if (totalPages > maxVisible) {
    const half = Math.floor(maxVisible / 2);
    startPage = Math.max(0, currentPage - half);
    endPage = Math.min(totalPages, startPage + maxVisible);
    if (endPage - startPage < maxVisible) {
      startPage = Math.max(0, endPage - maxVisible);
    }
  }

  for (let i = startPage; i < endPage; i++) {
    const isActive = i === currentPage;
    const buttonClass = styles.pageButton + (isActive ? " " + styles.activePage : "");

    pageButtons.push(React.createElement("button", {
      key: "page_" + i,
      type: "button",
      className: buttonClass,
      onClick: function () { onPageChange(i); },
      "aria-label": "Page " + (i + 1),
      "aria-current": isActive ? "page" : undefined,
    }, String(i + 1)));
  }

  // Next button
  pageButtons.push(React.createElement("button", {
    key: "next",
    type: "button",
    className: styles.pageButton,
    disabled: currentPage >= totalPages - 1,
    onClick: function () { onPageChange(currentPage + 1); },
    "aria-label": "Next page",
  }, "\u203A"));

  return React.createElement("nav", {
    className: styles.pagination,
    role: "navigation",
    "aria-label": "Pagination",
  }, pageButtons);
};

export default React.memo(HyperDirectoryPagination);
