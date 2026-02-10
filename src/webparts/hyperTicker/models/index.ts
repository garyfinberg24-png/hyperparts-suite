// Enums and type aliases
export type {
  TickerSeverity,
  TickerDisplayMode,
  TickerDirection,
  TickerDataSource,
  TickerPosition,
  TickerHeightPreset,
} from "./IHyperTickerEnums";
export {
  ALL_SEVERITIES,
  ALL_DISPLAY_MODES,
  ALL_DIRECTIONS,
  ALL_DATA_SOURCES,
  ALL_POSITIONS,
  ALL_HEIGHT_PRESETS,
  getSeverityDisplayName,
  getDisplayModeDisplayName,
  getDisplayModeIcon,
  getPositionDisplayName,
  getHeightPresetDisplayName,
  getHeightPresetPx,
  getDataSourceDisplayName,
  getSeverityColor,
  getSeverityBackgroundColor,
} from "./IHyperTickerEnums";

// Ticker item
export type { ITickerItem } from "./ITickerItem";
export {
  DEFAULT_TICKER_ITEM,
  generateTickerItemId,
  parseTickerItems,
  stringifyTickerItems,
} from "./ITickerItem";

// RSS config
export type { ITickerRssConfig } from "./ITickerRssConfig";
export {
  DEFAULT_RSS_CONFIG,
  parseRssConfigs,
  stringifyRssConfigs,
} from "./ITickerRssConfig";

// Message types (V2)
export type { TickerMessageType, ITickerMessageTypeConfig } from "./ITickerMessageType";
export {
  ALL_MESSAGE_TYPES,
  MESSAGE_TYPE_CONFIGS,
  getMessageTypeConfig,
  getMessageTypeDisplayName,
} from "./ITickerMessageType";

// Templates (V2)
export type { TickerTemplateId, ITickerTemplate } from "./ITickerTemplate";
export {
  ALL_TEMPLATE_IDS,
  TICKER_TEMPLATES,
  getTickerTemplate,
  getTickerTemplateDisplayName,
} from "./ITickerTemplate";

// Schedule (V2)
export type { TickerRecurPattern, ITickerSchedule } from "./ITickerSchedule";
export {
  ALL_RECUR_PATTERNS,
  DEFAULT_TICKER_SCHEDULE,
  getRecurPatternDisplayName,
} from "./ITickerSchedule";

// Wizard state (V2)
export type { TickerWizardPath, ITickerWizardState } from "./ITickerWizardState";
export { DEFAULT_TICKER_WIZARD_STATE } from "./ITickerWizardState";

// Web part props
export type { IHyperTickerWebPartProps } from "./IHyperTickerWebPartProps";
