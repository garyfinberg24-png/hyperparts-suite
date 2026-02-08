import * as React from "react";
import * as strings from "HyperDirectoryWebPartStrings";
import { HyperErrorBoundary } from "../../../common/components";
import { HyperSkeleton } from "../../../common/components";
import { HyperEmptyState } from "../../../common/components";
import type { IHyperDirectoryWebPartProps, IHyperDirectoryUser, DirectoryActionType } from "../models";
import { useDirectoryUsers } from "../hooks/useDirectoryUsers";
import { useDirectoryPhotos } from "../hooks/useDirectoryPhotos";
import { useDirectorySearch } from "../hooks/useDirectorySearch";
import { useDirectoryPresence } from "../hooks/useDirectoryPresence";
import { useHyperDirectoryStore } from "../store/useHyperDirectoryStore";
import { applyFilters, extractFilterOptions } from "../utils/filterUtils";
import HyperDirectorySearchBar from "./HyperDirectorySearchBar";
import HyperDirectoryAlphaIndex from "./HyperDirectoryAlphaIndex";
import HyperDirectoryFilterPanel from "./HyperDirectoryFilterPanel";
import HyperDirectoryPagination from "./HyperDirectoryPagination";
import { GridLayout, ListLayout, CompactLayout, CardLayout, RollerDexLayout, MasonryLayout, OrgChartLayout } from "./layouts";
import type { IDirectoryLayoutProps } from "./layouts";
import HyperDirectoryProfileCard from "./HyperDirectoryProfileCard";
import styles from "./HyperDirectory.module.scss";

export interface IHyperDirectoryComponentProps extends IHyperDirectoryWebPartProps {
  instanceId: string;
}

/** Parse JSON string safely with fallback */
function parseJsonArray(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Sort users by a given field */
function sortUsers(
  users: IHyperDirectoryUser[],
  field: string,
  direction: "asc" | "desc"
): IHyperDirectoryUser[] {
  const sorted = users.slice();
  sorted.sort(function (a, b) {
    const aVal = String(a[field] || "").toLowerCase();
    const bVal = String(b[field] || "").toLowerCase();
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}

const HyperDirectoryInner: React.FC<IHyperDirectoryComponentProps> = function (props) {
  const {
    title, userFilter, cacheEnabled, cacheDuration,
    layoutMode, cardStyle, photoSize, gridColumns,
    showSearch, showAlphaIndex, showFilters,
    showPresence, presenceRefreshInterval,
    showQuickActions, enabledActions, enableVCardExport,
    showPhotoPlaceholder, showProfileCard,
    pageSize, paginationMode,
    sortField, sortDirection,
  } = props;

  // Parse enabled actions from JSON string
  const parsedActions: DirectoryActionType[] = React.useMemo(function () {
    const actions = parseJsonArray(enabledActions);
    if (enableVCardExport && actions.indexOf("vCard") === -1) {
      actions.push("vCard");
    }
    return actions as DirectoryActionType[];
  }, [enabledActions, enableVCardExport]);

  // Store
  const store = useHyperDirectoryStore();

  // Fetch all users
  const { users: allUsers, loading, error } = useDirectoryUsers(userFilter, cacheEnabled, cacheDuration);

  // Extract filter options from all users
  React.useEffect(function () {
    if (allUsers.length > 0) {
      const options = extractFilterOptions(allUsers);
      store.setFilterOptions(options);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUsers]);

  // Client-side search
  const { filteredUsers: searchedUsers } = useDirectorySearch(allUsers, store.searchQuery, 300);

  // Apply filters (departments, locations, titles, companies, letter)
  const filteredUsers = React.useMemo(function () {
    return applyFilters(searchedUsers, store.activeFilters);
  }, [searchedUsers, store.activeFilters]);

  // Sort
  const sortedUsers = React.useMemo(function () {
    return sortUsers(filteredUsers, sortField, sortDirection);
  }, [filteredUsers, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const currentPage = Math.min(store.currentPage, totalPages - 1);
  const pagedUsers = React.useMemo(function () {
    if (paginationMode === "infinite") {
      return sortedUsers.slice(0, (currentPage + 1) * pageSize);
    }
    const start = currentPage * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize, paginationMode]);

  // Collect visible user IDs for photo + presence fetching
  const visibleIds = React.useMemo(function () {
    return pagedUsers.map(function (u) { return u.id; });
  }, [pagedUsers]);

  // Fetch photos for visible users
  const { photoMap } = useDirectoryPhotos(visibleIds, photoSize, true, cacheDuration);

  // Fetch presence for visible users
  const { presenceMap } = useDirectoryPresence(visibleIds, showPresence, presenceRefreshInterval);

  // User click handler
  const handleUserClick = React.useCallback(function (user: IHyperDirectoryUser): void {
    if (showProfileCard) {
      store.selectUser(user.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showProfileCard]);

  // vCard export handler
  const handleVCardExport = React.useCallback(function (user: IHyperDirectoryUser): void {
    const lines: string[] = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:" + user.displayName,
    ];
    if (user.surname && user.givenName) {
      lines.push("N:" + user.surname + ";" + user.givenName + ";;;");
    }
    if (user.mail) lines.push("EMAIL:" + user.mail);
    if (user.jobTitle) lines.push("TITLE:" + user.jobTitle);
    if (user.department) lines.push("ORG:" + (user.companyName || "") + ";" + user.department);
    if (user.mobilePhone) lines.push("TEL;TYPE=CELL:" + user.mobilePhone);
    if (user.businessPhones && user.businessPhones.length > 0) {
      lines.push("TEL;TYPE=WORK:" + user.businessPhones[0]);
    }
    if (user.officeLocation) lines.push("ADR;TYPE=WORK:;;" + user.officeLocation + ";;;;");
    lines.push("END:VCARD");

    const vcfContent = lines.join("\r\n");
    const blob = new Blob([vcfContent], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (user.displayName || "contact").replace(/[^a-zA-Z0-9]/g, "_") + ".vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Load more (infinite scroll)
  const handleLoadMore = React.useCallback(function (): void {
    if (currentPage < totalPages - 1) {
      store.nextPage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  // Loading state
  if (loading) {
    return React.createElement("div", { className: styles.hyperDirectory },
      title ? React.createElement("h2", { className: styles.title }, title) : undefined,
      React.createElement(HyperSkeleton, { variant: "rectangular", count: 6, height: 60 })
    );
  }

  // Error state
  if (error) {
    return React.createElement("div", { className: styles.hyperDirectory },
      title ? React.createElement("h2", { className: styles.title }, title) : undefined,
      React.createElement(HyperEmptyState, {
        title: strings.ErrorTitle,
        description: error.message,
        iconName: "Warning",
      })
    );
  }

  // Build shared layout props
  const layoutProps: IDirectoryLayoutProps = {
    users: pagedUsers,
    photoMap: photoMap,
    presenceMap: presenceMap,
    cardStyle: cardStyle,
    photoSize: photoSize,
    showPresence: showPresence,
    showQuickActions: showQuickActions,
    enabledActions: parsedActions,
    showPhotoPlaceholder: showPhotoPlaceholder,
    gridColumns: gridColumns,
    onUserClick: handleUserClick,
    onVCardExport: handleVCardExport,
  };

  // Select layout
  let layoutElement: React.ReactElement;
  if (layoutMode === "list") {
    layoutElement = React.createElement(ListLayout, layoutProps);
  } else if (layoutMode === "compact") {
    layoutElement = React.createElement(CompactLayout, layoutProps);
  } else if (layoutMode === "card") {
    layoutElement = React.createElement(CardLayout, layoutProps);
  } else if (layoutMode === "rollerDex") {
    layoutElement = React.createElement(RollerDexLayout, {
      ...layoutProps,
      visibleCards: props.rollerDexVisibleCards,
      speed: props.rollerDexSpeed,
    });
  } else if (layoutMode === "masonry") {
    layoutElement = React.createElement(MasonryLayout, {
      ...layoutProps,
      masonryColumns: props.masonryColumns,
    });
  } else if (layoutMode === "orgChart") {
    layoutElement = React.createElement(OrgChartLayout, layoutProps);
  } else {
    // Default: grid
    layoutElement = React.createElement(GridLayout, layoutProps);
  }

  // Empty results after filtering
  if (pagedUsers.length === 0) {
    layoutElement = React.createElement(HyperEmptyState, {
      title: strings.NoResultsTitle,
      description: strings.NoResultsDescription,
      iconName: "People",
      actionLabel: strings.ClearFiltersLabel,
      onAction: store.clearFilters,
    });
  }

  // Build toolbar elements
  const toolbarChildren: React.ReactNode[] = [];

  if (showSearch) {
    toolbarChildren.push(
      React.createElement(HyperDirectorySearchBar, {
        key: "search",
        value: store.searchQuery,
        placeholder: strings.SearchPlaceholder,
        resultCount: sortedUsers.length,
        totalCount: allUsers.length,
        onChange: store.setSearchQuery,
      })
    );
  }

  if (showAlphaIndex) {
    toolbarChildren.push(
      React.createElement(HyperDirectoryAlphaIndex, {
        key: "alpha",
        users: allUsers,
        activeLetter: store.activeFilters.activeLetter,
        onLetterClick: store.setActiveLetter,
      })
    );
  }

  if (showFilters) {
    toolbarChildren.push(
      React.createElement(HyperDirectoryFilterPanel, {
        key: "filters",
        filterOptions: store.filterOptions,
        activeFilters: store.activeFilters,
        onAddFilter: store.addFilter,
        onRemoveFilter: store.removeFilter,
        onClearAll: store.clearFilters,
        labels: {
          departments: strings.DepartmentLabel,
          locations: strings.LocationLabel,
          titles: strings.TitleLabel,
          companies: strings.CompanyLabel,
          clearAll: strings.ClearFiltersLabel,
        },
      })
    );
  }

  // Find selected user for profile card
  const selectedUser = store.selectedUserId
    ? allUsers.filter(function (u) { return u.id === store.selectedUserId; })[0]
    : undefined;

  return React.createElement("div", { className: styles.hyperDirectory },
    title ? React.createElement("h2", { className: styles.title }, title) : undefined,
    toolbarChildren.length > 0
      ? React.createElement("div", { className: styles.toolbar }, toolbarChildren)
      : undefined,
    React.createElement("div", { className: styles.contentArea }, layoutElement),
    React.createElement("div", { className: styles.footer },
      React.createElement(HyperDirectoryPagination, {
        currentPage: currentPage,
        totalPages: totalPages,
        totalItems: sortedUsers.length,
        pageSize: pageSize,
        mode: paginationMode,
        onPageChange: store.setPage,
        onLoadMore: handleLoadMore,
      })
    ),
    showProfileCard ? React.createElement(HyperDirectoryProfileCard, {
      isOpen: store.isProfileCardOpen,
      user: selectedUser,
      photoUrl: selectedUser ? photoMap[selectedUser.id] : undefined,
      presence: selectedUser ? presenceMap[selectedUser.id] : undefined,
      enabledActions: parsedActions,
      showPresence: showPresence,
      onClose: store.clearSelectedUser,
      onVCardExport: handleVCardExport,
    }) : undefined
  );
};

const HyperDirectory: React.FC<IHyperDirectoryComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperDirectoryInner, props)
  );
};

export default HyperDirectory;
