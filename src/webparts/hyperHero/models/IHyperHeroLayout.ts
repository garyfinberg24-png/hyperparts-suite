/** CSS Grid layout configuration for a single breakpoint */
export interface IHyperHeroGridLayout {
  columns: number;
  rows: number;
  gap: number;
  /** CSS grid-template-areas (e.g., "'main main side' 'bottom bottom side'") */
  templateAreas: string;
  /** CSS grid-template-columns (e.g., "1fr 1fr 1fr") */
  columnTemplate: string;
  /** CSS grid-template-rows (e.g., "300px 200px") */
  rowTemplate: string;
  height: number;
}

/** Responsive layouts — one grid config per breakpoint */
export interface IHyperHeroResponsiveLayouts {
  mobile: IHyperHeroGridLayout;
  tablet: IHyperHeroGridLayout;
  desktop: IHyperHeroGridLayout;
  widescreen: IHyperHeroGridLayout;
}

/** Default single-slide layout used when no custom layout is configured */
export const DEFAULT_GRID_LAYOUT: IHyperHeroGridLayout = {
  columns: 1,
  rows: 1,
  gap: 0,
  templateAreas: "'main'",
  columnTemplate: "1fr",
  rowTemplate: "400px",
  height: 400,
};

export const DEFAULT_RESPONSIVE_LAYOUTS: IHyperHeroResponsiveLayouts = {
  mobile: { ...DEFAULT_GRID_LAYOUT, rowTemplate: "300px", height: 300 },
  tablet: { ...DEFAULT_GRID_LAYOUT, rowTemplate: "350px", height: 350 },
  desktop: { ...DEFAULT_GRID_LAYOUT },
  widescreen: { ...DEFAULT_GRID_LAYOUT, rowTemplate: "450px", height: 450 },
};
