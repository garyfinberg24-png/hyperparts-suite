// Enums and type aliases
export type {
  TickerSeverity,
  TickerDisplayMode,
  TickerDirection,
  TickerDataSource,
  TickerPosition,
} from "./IHyperTickerEnums";
export {
  ALL_SEVERITIES,
  ALL_DISPLAY_MODES,
  ALL_DIRECTIONS,
  ALL_DATA_SOURCES,
  ALL_POSITIONS,
  getSeverityDisplayName,
  getDisplayModeDisplayName,
  getPositionDisplayName,
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

// Web part props
export type { IHyperTickerWebPartProps } from "./IHyperTickerWebPartProps";
