/** Filter criteria for events */
export interface IEventFilter {
  startDate: string | undefined;
  endDate: string | undefined;
  categories: string[];
  locations: string[];
  sourceIds: string[];
  searchQuery: string;
}

/** Default filter (no filters applied) */
export const DEFAULT_FILTER: IEventFilter = {
  startDate: undefined,
  endDate: undefined,
  categories: [],
  locations: [],
  sourceIds: [],
  searchQuery: "",
};
