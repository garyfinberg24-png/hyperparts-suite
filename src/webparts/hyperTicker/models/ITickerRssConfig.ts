export interface ITickerRssConfig {
  feedUrl: string;
  maxItems: number;
  refreshIntervalMinutes: number;
  prefixIcon: string;
}

export const DEFAULT_RSS_CONFIG: ITickerRssConfig = {
  feedUrl: "",
  maxItems: 10,
  refreshIntervalMinutes: 15,
  prefixIcon: "Globe",
};

export function parseRssConfigs(json: string): ITickerRssConfig[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed as ITickerRssConfig[];
    return [];
  } catch {
    return [];
  }
}

export function stringifyRssConfigs(configs: ITickerRssConfig[]): string {
  return JSON.stringify(configs);
}
