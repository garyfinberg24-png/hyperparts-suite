/** Carousel layout settings */
export interface ICarouselSettings {
  cardsVisible: number | "auto";
  autoAdvance: boolean;
  autoAdvanceInterval: number;
  showNavigation: boolean;
  showPagination: boolean;
  infiniteLoop: boolean;
  pauseOnHover: boolean;
}

/** Grid layout settings */
export interface IGridSettings {
  columns: number | "auto";
  equalHeightCards: boolean;
  gapSpacing: number;
}

/** Tiled/Mosaic layout settings */
export interface ITiledSettings {
  hasFeaturedEmployee: boolean;
  featuredPosition: "first" | "center" | "last" | "random";
  tileSmallSize: number;
  tileMediumSize: number;
  tileLargeSize: number;
}

/** Masonry layout settings */
export interface IMasonrySettings {
  columnCount: number | "auto";
  gutterSpacing: number;
}

/** List layout settings */
export interface IListSettings {
  alternatingBackgrounds: boolean;
  showDividers: boolean;
  avatarPosition: "left" | "right";
}

/** Featured Hero layout settings */
export interface IHeroSettings {
  heroSize: 50 | 60 | 70;
  secondaryLayout: "grid" | "carousel";
  autoRotateHero: boolean;
  autoRotateInterval: number;
  manualHeroEmployeeId?: string;
}

/** Banner layout settings (full-width, photo left + details right) */
export interface IBannerSettings {
  showNavigationCounter: boolean;
  autoAdvance: boolean;
  autoAdvanceInterval: number;
  pauseOnHover: boolean;
}

/** Timeline layout settings (vertical connector + expand/collapse) */
export interface ITimelineSettings {
  showConnector: boolean;
  compactMode: boolean;
  expandAllDefault: boolean;
}

/** Wall of Fame layout settings (star employee + confetti) */
export interface IWallOfFameSettings {
  columns: number;
  showConfetti: boolean;
  cycleInterval: number;
}

/* ── Defaults ── */

export const DEFAULT_CAROUSEL_SETTINGS: ICarouselSettings = {
  cardsVisible: 3,
  autoAdvance: true,
  autoAdvanceInterval: 5,
  showNavigation: true,
  showPagination: true,
  infiniteLoop: true,
  pauseOnHover: true,
};

export const DEFAULT_GRID_SETTINGS: IGridSettings = {
  columns: "auto",
  equalHeightCards: true,
  gapSpacing: 20,
};

export const DEFAULT_TILED_SETTINGS: ITiledSettings = {
  hasFeaturedEmployee: false,
  featuredPosition: "first",
  tileSmallSize: 100,
  tileMediumSize: 150,
  tileLargeSize: 200,
};

export const DEFAULT_MASONRY_SETTINGS: IMasonrySettings = {
  columnCount: "auto",
  gutterSpacing: 20,
};

export const DEFAULT_LIST_SETTINGS: IListSettings = {
  alternatingBackgrounds: true,
  showDividers: true,
  avatarPosition: "left",
};

export const DEFAULT_HERO_SETTINGS: IHeroSettings = {
  heroSize: 60,
  secondaryLayout: "grid",
  autoRotateHero: false,
  autoRotateInterval: 10,
};

export const DEFAULT_BANNER_SETTINGS: IBannerSettings = {
  showNavigationCounter: true,
  autoAdvance: true,
  autoAdvanceInterval: 5,
  pauseOnHover: true,
};

export const DEFAULT_TIMELINE_SETTINGS: ITimelineSettings = {
  showConnector: true,
  compactMode: false,
  expandAllDefault: false,
};

export const DEFAULT_WALL_OF_FAME_SETTINGS: IWallOfFameSettings = {
  columns: 3,
  showConfetti: true,
  cycleInterval: 10,
};
