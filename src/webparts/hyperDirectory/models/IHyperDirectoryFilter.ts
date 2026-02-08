/** Active filter state for the directory */
export interface IHyperDirectoryFilter {
  searchQuery: string;
  departments: string[];
  locations: string[];
  titles: string[];
  companies: string[];
  activeLetter: string;
}

/** Available filter options extracted from loaded users */
export interface IDirectoryFilterOptions {
  departments: string[];
  locations: string[];
  titles: string[];
  companies: string[];
}

/** A single filter chip for display */
export interface IDirectoryFilterChip {
  category: "department" | "location" | "title" | "company";
  value: string;
  count: number;
}

/** Default empty filter state */
export const DEFAULT_FILTER: IHyperDirectoryFilter = {
  searchQuery: "",
  departments: [],
  locations: [],
  titles: [],
  companies: [],
  activeLetter: "",
};

/** Default empty filter options */
export const DEFAULT_FILTER_OPTIONS: IDirectoryFilterOptions = {
  departments: [],
  locations: [],
  titles: [],
  companies: [],
};

/** Alphabet letters for the A-Z index bar */
export const ALPHABET_LETTERS: string[] = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
  "U", "V", "W", "X", "Y", "Z",
];
