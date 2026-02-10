import type {
  IHyperWizardConfig,
  IWizardStepDef,
  IWizardSummaryRow,
} from "../../../../common/components/wizard/IHyperWizard";
import type { IEventsWizardState } from "../../models/IHyperEventsWizardState";
import { DEFAULT_EVENTS_WIZARD_STATE } from "../../models/IHyperEventsWizardState";
import type { IHyperEventsWebPartProps, HyperEventsViewMode } from "../../models/IHyperEventsWebPartProps";
import { stringifySources, parseSources } from "../../models/IEventSource";
import type { IEventSource } from "../../models/IEventSource";
import SourcesStep from "./SourcesStep";
import ViewStep from "./ViewStep";
import FeaturesStep from "./FeaturesStep";

// ============================================================
// HyperEvents Wizard Config
// ============================================================

/** View mode display names */
function getViewDisplayName(mode: HyperEventsViewMode): string {
  if (mode === "month") return "Month";
  if (mode === "week") return "Week";
  if (mode === "day") return "Day";
  if (mode === "agenda") return "Agenda";
  if (mode === "timeline") return "Timeline";
  if (mode === "cardGrid") return "Card Grid";
  return mode;
}

var steps: Array<IWizardStepDef<IEventsWizardState>> = [
  {
    id: "sources",
    label: "Calendar Sources",
    shortLabel: "Sources",
    helpText: "Add one or more calendar sources. Events will be aggregated from all configured sources.",
    component: SourcesStep,
    validate: function (state: IEventsWizardState): boolean {
      return state.sources.length > 0;
    },
  },
  {
    id: "view",
    label: "Default View & Display",
    shortLabel: "View",
    helpText: "Choose the calendar view users see first. They can switch views at any time.",
    component: ViewStep,
  },
  {
    id: "features",
    label: "Features",
    shortLabel: "Features",
    helpText: "Enable or disable interactive capabilities for your calendar experience.",
    component: FeaturesStep,
  },
];

/** Transform wizard state into web part properties */
function buildResult(state: IEventsWizardState): Partial<IHyperEventsWebPartProps> {
  // Convert wizard sources into IEventSource[] JSON
  var eventSources: IEventSource[] = [];
  state.sources.forEach(function (ws, idx) {
    eventSources.push({
      id: "source-" + String(idx),
      type: ws.type,
      displayName: ws.displayName,
      color: ws.color,
      enabled: true,
      listName: ws.listName || undefined,
      siteUrl: ws.siteUrl || undefined,
      calendarId: ws.calendarId || undefined,
      groupId: ws.groupId || undefined,
    });
  });

  return {
    title: state.display.title,
    sources: stringifySources(eventSources),
    defaultView: state.defaultView,
    viewMode: state.defaultView,
    enableRsvp: state.features.enableRsvp,
    enableRegistration: state.features.enableRegistration,
    enableCountdown: state.features.enableCountdown,
    enableNotifications: state.features.enableNotifications,
    enableCategoryFilter: state.features.enableCategoryFilter,
    enableLocationLinks: state.features.enableLocationLinks,
    enableVirtualLinks: state.features.enableVirtualLinks,
    enablePastArchive: state.features.enablePastArchive,
    showCalendarOverlay: state.features.showCalendarOverlay,
    refreshInterval: state.display.refreshInterval,
    // Mark wizard as done
    showWizardOnInit: false,
  };
}

/** Generate summary rows for the review step */
function buildSummary(state: IEventsWizardState): IWizardSummaryRow[] {
  var rows: IWizardSummaryRow[] = [];

  // Title
  rows.push({
    label: "Title",
    value: state.display.title || "Events",
    type: "text",
  });

  // Default view
  rows.push({
    label: "Default View",
    value: getViewDisplayName(state.defaultView),
    type: "badge",
  });

  // Sources
  var sourceTypes: string[] = [];
  var spCount = 0;
  var exchangeCount = 0;
  var groupCount = 0;
  state.sources.forEach(function (s) {
    if (s.type === "spCalendar") spCount++;
    else if (s.type === "exchangeCalendar") exchangeCount++;
    else groupCount++;
  });
  if (spCount > 0) sourceTypes.push(String(spCount) + " SharePoint");
  if (exchangeCount > 0) sourceTypes.push(String(exchangeCount) + " Exchange");
  if (groupCount > 0) sourceTypes.push(String(groupCount) + " Group");

  rows.push({
    label: "Calendar Sources",
    value: sourceTypes.length > 0 ? sourceTypes.join(", ") : "None",
    type: "badge",
  });

  // Features
  var enabledFeatures: string[] = [];
  if (state.features.enableRsvp) enabledFeatures.push("RSVP");
  if (state.features.enableRegistration) enabledFeatures.push("Registration");
  if (state.features.enableCountdown) enabledFeatures.push("Countdown");
  if (state.features.enableNotifications) enabledFeatures.push("Notifications");
  if (state.features.enableCategoryFilter) enabledFeatures.push("Category Filter");
  if (state.features.enableLocationLinks) enabledFeatures.push("Location Links");
  if (state.features.enableVirtualLinks) enabledFeatures.push("Teams Links");
  if (state.features.enablePastArchive) enabledFeatures.push("Past Archive");
  if (state.features.showCalendarOverlay) enabledFeatures.push("Overlay");

  rows.push({
    label: "Features",
    value: enabledFeatures.length > 0 ? enabledFeatures.join(", ") : "None",
    type: "badgeGreen",
  });

  return rows;
}

/** Hydrate wizard state from existing web part properties (for re-editing) */
export function buildStateFromProps(props: IHyperEventsWebPartProps): IEventsWizardState | undefined {
  // If wizard hasn't been configured yet, return undefined (shows welcome screen)
  if (props.showWizardOnInit !== false) {
    return undefined;
  }

  // Parse existing sources back into wizard format
  var existingSources = parseSources(props.sources);
  var wizardSources = existingSources.map(function (es) {
    return {
      type: es.type,
      displayName: es.displayName || "",
      color: es.color || "#0078d4",
      listName: es.listName || "",
      siteUrl: es.siteUrl || "",
      calendarId: es.calendarId || "",
      groupId: es.groupId || "",
    };
  });

  return {
    defaultView: props.defaultView || "month",
    sources: wizardSources,
    features: {
      enableRsvp: props.enableRsvp,
      enableRegistration: props.enableRegistration,
      enableCountdown: props.enableCountdown,
      enableNotifications: props.enableNotifications,
      enableCategoryFilter: props.enableCategoryFilter,
      enableLocationLinks: props.enableLocationLinks,
      enableVirtualLinks: props.enableVirtualLinks,
      enablePastArchive: props.enablePastArchive,
      showCalendarOverlay: props.showCalendarOverlay,
    },
    display: {
      title: props.title || "Events",
      refreshInterval: props.refreshInterval || 0,
    },
  };
}

/** Exported wizard configuration */
export var EVENTS_WIZARD_CONFIG: IHyperWizardConfig<IEventsWizardState, Partial<IHyperEventsWebPartProps>> = {
  title: "HyperEvents Setup Wizard",
  welcome: {
    productName: "Events",
    tagline: "A powerful multi-source calendar that aggregates SharePoint, Exchange, and Group calendars into one unified view",
    taglineBold: ["multi-source calendar", "unified view"],
    features: [
      {
        icon: "\uD83D\uDCC5",
        title: "6 View Modes",
        description: "Month, Week, Day, Agenda, Timeline, and Card Grid layouts for every need",
      },
      {
        icon: "\uD83D\uDD04",
        title: "Multi-Source Overlay",
        description: "Combine SharePoint lists, Exchange, and Group calendars with color-coded overlay",
      },
      {
        icon: "\u270D\uFE0F",
        title: "RSVP & Registration",
        description: "Built-in event responses and custom registration forms with dynamic fields",
      },
      {
        icon: "\uD83D\uDD14",
        title: "Smart Notifications",
        description: "Email and Teams reminders powered by Microsoft Graph API",
      },
    ],
  },
  steps: steps,
  initialState: DEFAULT_EVENTS_WIZARD_STATE,
  buildResult: buildResult,
  buildSummary: buildSummary,
  summaryFootnote: "You can reconfigure at any time via the Configure button in the toolbar.",
};
