/**
 * HyperTabs V2 — 12 Style Presets
 * One-click visual themes applied via the property pane or DemoBar.
 * Each preset defines tab bar + active tab + content area colors.
 */

export interface IHyperTabsStylePreset {
  /** Unique preset ID */
  id: string;
  /** Display name */
  name: string;
  /** Tab bar background color */
  tabBarBg: string;
  /** Tab bar text color */
  tabBarText: string;
  /** Active tab background color */
  activeTabBg: string;
  /** Active tab text color */
  activeTabText: string;
  /** Active indicator color (underline/border) */
  indicatorColor: string;
  /** Content area background */
  contentBg: string;
  /** Content area text color */
  contentText: string;
}

export var STYLE_PRESETS: IHyperTabsStylePreset[] = [
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    tabBarBg: "#0078d4",
    tabBarText: "rgba(255,255,255,.7)",
    activeTabBg: "#ffffff",
    activeTabText: "#0078d4",
    indicatorColor: "#0078d4",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
  {
    id: "midnight-navy",
    name: "Midnight Navy",
    tabBarBg: "#0a1628",
    tabBarText: "rgba(255,255,255,.6)",
    activeTabBg: "#0078d4",
    activeTabText: "#ffffff",
    indicatorColor: "#0078d4",
    contentBg: "#0a1628",
    contentText: "#e0e0e0",
  },
  {
    id: "fresh-green",
    name: "Fresh Green",
    tabBarBg: "#107c10",
    tabBarText: "rgba(255,255,255,.7)",
    activeTabBg: "#ffffff",
    activeTabText: "#107c10",
    indicatorColor: "#107c10",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
  {
    id: "warm-earth",
    name: "Warm Earth",
    tabBarBg: "#7a5c3c",
    tabBarText: "rgba(255,255,255,.7)",
    activeTabBg: "#ffffff",
    activeTabText: "#7a5c3c",
    indicatorColor: "#c4956a",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
  {
    id: "glass-frost",
    name: "Glass Frost",
    tabBarBg: "#f5f7fa",
    tabBarText: "#605e5c",
    activeTabBg: "#ffffff",
    activeTabText: "#323130",
    indicatorColor: "#0078d4",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    tabBarBg: "#f97316",
    tabBarText: "rgba(255,255,255,.8)",
    activeTabBg: "#ffffff",
    activeTabText: "#f97316",
    indicatorColor: "#ef4444",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    tabBarBg: "#5c2d91",
    tabBarText: "rgba(255,255,255,.7)",
    activeTabBg: "#ffffff",
    activeTabText: "#8764b8",
    indicatorColor: "#8764b8",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
  {
    id: "ocean-teal",
    name: "Ocean Teal",
    tabBarBg: "#038387",
    tabBarText: "rgba(255,255,255,.7)",
    activeTabBg: "#ffffff",
    activeTabText: "#00b7c3",
    indicatorColor: "#00b7c3",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
  {
    id: "arctic-white",
    name: "Arctic White",
    tabBarBg: "#ffffff",
    tabBarText: "#605e5c",
    activeTabBg: "#0078d4",
    activeTabText: "#ffffff",
    indicatorColor: "#0078d4",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
  {
    id: "neon-dark",
    name: "Neon Dark",
    tabBarBg: "#1a1a2e",
    tabBarText: "rgba(255,255,255,.4)",
    activeTabBg: "#00ff88",
    activeTabText: "#1a1a2e",
    indicatorColor: "#00ff88",
    contentBg: "#1a1a2e",
    contentText: "#e0e0e0",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    tabBarBg: "#f4c7c3",
    tabBarText: "#a05060",
    activeTabBg: "#ffffff",
    activeTabText: "#c76e79",
    indicatorColor: "#c76e79",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
  {
    id: "sunshine",
    name: "Sunshine",
    tabBarBg: "#fbbf24",
    tabBarText: "#78350f",
    activeTabBg: "#ffffff",
    activeTabText: "#92400e",
    indicatorColor: "#f59e0b",
    contentBg: "#ffffff",
    contentText: "#323130",
  },
];

/** Lookup a preset by ID. Returns undefined if not found. */
export function getPresetById(id: string): IHyperTabsStylePreset | undefined {
  for (var i = 0; i < STYLE_PRESETS.length; i++) {
    if (STYLE_PRESETS[i].id === id) {
      return STYLE_PRESETS[i];
    }
  }
  return undefined;
}
