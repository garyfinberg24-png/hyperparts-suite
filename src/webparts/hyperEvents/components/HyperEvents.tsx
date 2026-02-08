import * as React from "react";
import type { IHyperEventsWebPartProps, IHyperEvent } from "../models";
import { parseSources, parseCategories, parseRegistrationFields } from "../models";
import { HyperErrorBoundary, HyperEmptyState, HyperSkeleton } from "../../../common/components";
import { useHyperEventsStore } from "../store/useHyperEventsStore";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useEventFilters } from "../hooks/useEventFilters";
import { useEventRsvp } from "../hooks/useEventRsvp";
import { useEventRegistration } from "../hooks/useEventRegistration";
import { useEventNotifications } from "../hooks/useEventNotifications";
import { getViewRangeStart, getViewRangeEnd } from "../utils/dateUtils";
import { getEnabledSources } from "../utils/sourceUtils";
import { applySourceColors, filterByVisibleSources } from "../utils/calendarOverlay";
import HyperEventsToolbar from "./HyperEventsToolbar";
import HyperEventsCategoryBar from "./HyperEventsCategoryBar";
import HyperEventsDetailPanel from "./HyperEventsDetailPanel";
import HyperEventsPastArchive from "./HyperEventsPastArchive";
import HyperEventsRegistrationForm from "./HyperEventsRegistrationForm";
import HyperEventsOverlayLegend from "./HyperEventsOverlayLegend";
import { MonthView, WeekView, DayView, AgendaView, TimelineView, CardGridView } from "./views";
import styles from "./HyperEvents.module.scss";

export interface IHyperEventsComponentProps extends IHyperEventsWebPartProps {
  instanceId: string;
  isEditMode?: boolean;
  siteUrl?: string;
}

/**
 * Main HyperEvents component.
 * E4: All 6 views, detail panel, RSVP, countdown, past archive, Outlook sync,
 * registration form, notifications, calendar overlay legend.
 */
const HyperEventsInner: React.FC<IHyperEventsComponentProps> = function (props) {
  const store = useHyperEventsStore();

  // Sync default view on first render
  React.useEffect(function () {
    if (props.defaultView && store.viewMode !== props.defaultView) {
      store.setViewMode(props.defaultView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parse sources, categories, and registration fields from JSON props
  const sources = React.useMemo(function () {
    return parseSources(props.sources);
  }, [props.sources]);

  const categories = React.useMemo(function () {
    return parseCategories(props.categories);
  }, [props.categories]);

  const registrationFields = React.useMemo(function () {
    return parseRegistrationFields(props.registrationFields);
  }, [props.registrationFields]);

  const enabledSources = React.useMemo(function () {
    return getEnabledSources(sources);
  }, [sources]);

  // Compute visible date range based on view mode
  const rangeStart = React.useMemo(function () {
    return getViewRangeStart(store.selectedDate, store.viewMode);
  }, [store.selectedDate, store.viewMode]);

  const rangeEnd = React.useMemo(function () {
    return getViewRangeEnd(store.selectedDate, store.viewMode);
  }, [store.selectedDate, store.viewMode]);

  // Fetch events
  const { events, loading, error } = useCalendarEvents(
    enabledSources,
    rangeStart.toISOString(),
    rangeEnd.toISOString(),
    props.cacheDuration || 300
  );

  // Apply source colors for calendar overlay
  const coloredEvents = React.useMemo(function () {
    if (!props.showCalendarOverlay) return events;
    return applySourceColors(events, sources);
  }, [events, sources, props.showCalendarOverlay]);

  // Filter by visible sources (overlay toggle)
  const sourceFilteredEvents = React.useMemo(function () {
    if (!props.showCalendarOverlay) return coloredEvents;
    return filterByVisibleSources(coloredEvents, store.visibleSourceIds);
  }, [coloredEvents, store.visibleSourceIds, props.showCalendarOverlay]);

  // Apply filters
  const { filteredEvents } = useEventFilters(sourceFilteredEvents, store.appliedFilter);

  // Find the selected event for the detail panel
  const selectedEvent = React.useMemo(function (): IHyperEvent | undefined {
    if (!store.selectedEventId) return undefined;
    let found: IHyperEvent | undefined;
    events.forEach(function (evt) {
      if (evt.id === store.selectedEventId) found = evt;
    });
    return found;
  }, [events, store.selectedEventId]);

  // RSVP hook
  const rsvp = useEventRsvp(
    store.selectedEventId,
    props.rsvpListName,
    props.enableRsvp
  );

  // Registration hook
  const registration = useEventRegistration(
    store.selectedEventId,
    props.registrationListName,
    props.enableRegistration
  );

  // Notifications hook
  useEventNotifications(props.enableNotifications);

  // Category toggle handler
  const handleToggleCategory = React.useCallback(function (categoryName: string) {
    const current = store.appliedFilter.categories;
    const idx = current.indexOf(categoryName);
    if (idx !== -1) {
      const updated = current.filter(function (c) { return c !== categoryName; });
      store.updateFilterField("categories", updated);
    } else {
      const updated: string[] = [];
      current.forEach(function (c) { updated.push(c); });
      updated.push(categoryName);
      store.updateFilterField("categories", updated);
    }
  }, [store]);

  // Event click handler
  const handleEventClick = React.useCallback(function (eventId: string) {
    store.openDetail(eventId);
  }, [store]);

  // Source toggle handler for overlay legend
  const handleToggleSource = React.useCallback(function (sourceId: string) {
    store.toggleSourceVisibility(sourceId);
  }, [store]);

  // Build content
  const contentChildren: React.ReactNode[] = [];

  // Toolbar
  contentChildren.push(
    React.createElement(HyperEventsToolbar, {
      key: "toolbar",
      selectedDate: store.selectedDate,
      viewMode: store.viewMode,
      onNavigateBackward: store.navigateBackward,
      onNavigateForward: store.navigateForward,
      onNavigateToday: store.navigateToday,
      onViewModeChange: store.setViewMode,
    })
  );

  // Category bar
  if (props.enableCategoryFilter && categories.length > 0) {
    contentChildren.push(
      React.createElement(HyperEventsCategoryBar, {
        key: "categoryBar",
        categories: categories,
        selectedCategories: store.appliedFilter.categories,
        onToggleCategory: handleToggleCategory,
      })
    );
  }

  // Calendar overlay legend
  if (props.showCalendarOverlay && enabledSources.length > 1) {
    contentChildren.push(
      React.createElement(HyperEventsOverlayLegend, {
        key: "overlayLegend",
        sources: enabledSources,
        visibleSourceIds: store.visibleSourceIds,
        onToggleSource: handleToggleSource,
      })
    );
  }

  // Loading state
  if (loading) {
    contentChildren.push(
      React.createElement(
        "div",
        { key: "loading", className: styles.hyperEventsBody },
        React.createElement(HyperSkeleton, { count: 5, variant: "rectangular", height: 40 })
      )
    );
  } else if (error) {
    contentChildren.push(
      React.createElement(
        "div",
        { key: "error", className: styles.hyperEventsBody },
        React.createElement(HyperEmptyState, {
          iconName: "ErrorBadge",
          title: "Error Loading Events",
          description: error,
        })
      )
    );
  } else if (filteredEvents.length === 0) {
    contentChildren.push(
      React.createElement(
        "div",
        { key: "empty", className: styles.hyperEventsBody },
        React.createElement(HyperEmptyState, {
          iconName: "Calendar",
          title: "No Events Found",
          description: "No events found for the selected date range and filters.",
        })
      )
    );
  } else {
    // Render the active view
    const viewProps = {
      events: filteredEvents,
      selectedDate: store.selectedDate,
      onEventClick: handleEventClick,
    };

    let viewElement: React.ReactNode;
    switch (store.viewMode) {
      case "month":
        viewElement = React.createElement(MonthView, viewProps);
        break;
      case "week":
        viewElement = React.createElement(WeekView, viewProps);
        break;
      case "day":
        viewElement = React.createElement(DayView, viewProps);
        break;
      case "agenda":
        viewElement = React.createElement(AgendaView, viewProps);
        break;
      case "timeline":
        viewElement = React.createElement(TimelineView, viewProps);
        break;
      case "cardGrid":
        viewElement = React.createElement(CardGridView, viewProps);
        break;
      default:
        viewElement = React.createElement(MonthView, viewProps);
    }

    contentChildren.push(
      React.createElement(
        "div",
        { key: "view", className: styles.hyperEventsBody },
        viewElement
      )
    );
  }

  // Past events archive
  if (props.enablePastArchive) {
    contentChildren.push(
      React.createElement(HyperEventsPastArchive, {
        key: "archive",
        events: events,
        onEventClick: handleEventClick,
      })
    );
  }

  // Detail panel
  contentChildren.push(
    React.createElement(HyperEventsDetailPanel, {
      key: "detail",
      event: selectedEvent,
      isOpen: store.isDetailOpen,
      onClose: store.closeDetail,
      enableRsvp: props.enableRsvp,
      enableCountdown: props.enableCountdown,
      enableLocationLinks: props.enableLocationLinks,
      enableVirtualLinks: props.enableVirtualLinks,
      currentRsvpResponse: rsvp.currentUserResponse,
      rsvpCounts: undefined,
      onSubmitRsvp: rsvp.submitRsvp,
      onOpenRegistration: store.openRegistration,
    })
  );

  // Registration form modal
  if (props.enableRegistration && selectedEvent) {
    contentChildren.push(
      React.createElement(HyperEventsRegistrationForm, {
        key: "registration",
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        fields: registrationFields,
        isOpen: store.isRegistrationOpen,
        onClose: store.closeRegistration,
        onSubmit: registration.submitRegistration,
        isRegistered: registration.isRegistered,
      })
    );
  }

  return React.createElement(
    "div",
    { className: styles.hyperEvents },
    contentChildren
  );
};

const HyperEvents: React.FC<IHyperEventsComponentProps> = function (props) {
  return React.createElement(
    HyperErrorBoundary,
    undefined,
    React.createElement(HyperEventsInner, props)
  );
};

export default HyperEvents;
