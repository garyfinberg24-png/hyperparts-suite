import * as React from "react";
import * as strings from "HyperDirectoryWebPartStrings";
import { HyperErrorBoundary } from "../../../common/components";
import { HyperSkeleton } from "../../../common/components";
import { HyperEmptyState } from "../../../common/components";
import { HyperWizard } from "../../../common/components/wizard/HyperWizard";
import type { IHyperDirectoryWebPartProps, IHyperDirectoryUser, DirectoryActionType } from "../models";
import { useDirectoryUsers } from "../hooks/useDirectoryUsers";
import { useDirectoryPhotos } from "../hooks/useDirectoryPhotos";
import { useDirectorySearch } from "../hooks/useDirectorySearch";
import { useDirectoryPresence } from "../hooks/useDirectoryPresence";
import { useHyperDirectoryStore } from "../store/useHyperDirectoryStore";
import { applyFilters, extractFilterOptions } from "../utils/filterUtils";
import { getSampleUsers, getSamplePresenceMap } from "../utils/sampleData";
import { DIRECTORY_WIZARD_CONFIG, buildStateFromProps } from "./wizard/directoryWizardConfig";
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
  isEditMode?: boolean;
  onWizardApply?: (result: Partial<IHyperDirectoryWebPartProps>) => void;
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

  // Wizard store selectors
  var isWizardOpen = useHyperDirectoryStore(function (s) { return s.isWizardOpen; });
  var openWizard = useHyperDirectoryStore(function (s) { return s.openWizard; });
  var closeWizard = useHyperDirectoryStore(function (s) { return s.closeWizard; });

  // Auto-open wizard on first load when not yet configured
  React.useEffect(function () {
    if (props.showWizardOnInit) {
      openWizard();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Build wizard state override from current props (for re-editing)
  var wizardStateOverride = React.useMemo(function () {
    return buildStateFromProps(props);
  }, [
    props.layoutMode, props.cardStyle, props.gridColumns, props.masonryColumns,
    props.sortField, props.sortDirection, props.rollerDexSpeed, props.rollerDexVisibleCards,
    props.showSearch, props.showAlphaIndex, props.showFilters,
    props.pageSize, props.paginationMode, props.enableExport,
    props.showPresence, props.presenceRefreshInterval, props.showProfileCard,
    props.showQuickActions, props.enableVCardExport, props.showPhotoPlaceholder,
    props.photoSize, props.showCompletenessScore, props.showPronouns,
    props.showSmartOoo, props.showQrCode,
    props.enableSkillsSearch, props.useSampleData, props.cacheEnabled, props.cacheDuration,
    props.showWizardOnInit,
  ]);

  // Handle wizard apply
  var handleWizardApply = React.useCallback(function (result: Partial<IHyperDirectoryWebPartProps>): void {
    if (props.onWizardApply) {
      props.onWizardApply(result);
    }
    closeWizard();
  }, [props.onWizardApply, closeWizard]);

  // Handle configure button click
  var handleConfigureClick = React.useCallback(function (): void {
    openWizard();
  }, [openWizard]);

  // Wizard element — rendered in ALL code paths
  var wizardElement = React.createElement(HyperWizard, {
    config: DIRECTORY_WIZARD_CONFIG,
    isOpen: isWizardOpen,
    onClose: closeWizard,
    onApply: handleWizardApply,
    initialStateOverride: wizardStateOverride,
  });

  // Fetch all users from Graph
  const { users: realUsers, loading: realLoading, error: realError } = useDirectoryUsers(userFilter, cacheEnabled, cacheDuration);

  // Determine if we should use sample data:
  // - useSampleData is enabled AND no real users returned AND not currently loading
  var usingSampleData = !!props.useSampleData && !realLoading && realUsers.length === 0;

  // Effective users (real or sample)
  var allUsers = React.useMemo(function () {
    return usingSampleData ? getSampleUsers() : realUsers;
  }, [usingSampleData, realUsers]);

  // Effective loading/error — suppress error when using sample data as fallback
  var loading = usingSampleData ? false : realLoading;
  var error = usingSampleData ? undefined : realError;

  // Sample presence map (only computed when using sample data)
  var samplePresence = React.useMemo(function () {
    return usingSampleData ? getSamplePresenceMap() : {};
  }, [usingSampleData]);

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

  // Collect visible user IDs for photo + presence fetching (skip for sample data)
  const visibleIds = React.useMemo(function () {
    if (usingSampleData) return [];
    return pagedUsers.map(function (u) { return u.id; });
  }, [pagedUsers, usingSampleData]);

  // Fetch photos for visible users (no-op when sample data)
  const { photoMap: realPhotoMap } = useDirectoryPhotos(visibleIds, photoSize, true, cacheDuration);
  var photoMap = usingSampleData ? {} : realPhotoMap;

  // Fetch presence for visible users (no-op when sample data)
  const { presenceMap: realPresenceMap } = useDirectoryPresence(visibleIds, showPresence, presenceRefreshInterval);
  var presenceMap = usingSampleData ? samplePresence : realPresenceMap;

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
      React.createElement(HyperSkeleton, { variant: "rectangular", count: 6, height: 60 }),
      wizardElement
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
      }),
      wizardElement
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
  var layoutElement: React.ReactElement;
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
    return React.createElement("div", { className: styles.hyperDirectory },
      title ? React.createElement("h2", { className: styles.title }, title) : undefined,
      React.createElement(HyperEmptyState, {
        title: strings.NoResultsTitle,
        description: strings.NoResultsDescription,
        iconName: "People",
        actionLabel: strings.ClearFiltersLabel,
        onAction: store.clearFilters,
      }),
      props.isEditMode
        ? React.createElement("div", { style: { textAlign: "center", marginTop: "12px" } },
            React.createElement("button", {
              onClick: handleConfigureClick,
              className: styles.configureButton,
              type: "button",
            }, "\u2699\uFE0F Configure")
          )
        : undefined,
      wizardElement
    );
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
    usingSampleData
      ? React.createElement("div", {
          className: styles.sampleDataBanner,
          role: "status",
        }, "Showing sample data. Connect to your Microsoft 365 tenant and turn off \"Seed with Sample Data\" to display real employees.")
      : undefined,
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
    }) : undefined,
    wizardElement
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
