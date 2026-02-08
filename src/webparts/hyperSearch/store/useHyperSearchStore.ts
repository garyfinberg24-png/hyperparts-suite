import create from "zustand";
import type {
  IHyperSearchResult,
  ISearchQuery,
  ISearchSuggestion,
  ISearchHistoryEntry,
  ISearchRefiner,
  SearchScopeType,
  SearchSortBy,
} from "../models";
import { DEFAULT_QUERY } from "../models";

// ── State ──

export interface IHyperSearchStoreState {
  /** Current search query */
  query: ISearchQuery;
  /** Search results for current query */
  results: IHyperSearchResult[];
  /** Total result count from server (may exceed results.length) */
  totalResults: number;
  /** Whether a search is currently executing */
  loading: boolean;
  /** Error message if search failed */
  error: string;
  /** Type-ahead suggestions */
  suggestions: ISearchSuggestion[];
  /** Whether suggestions are currently loading */
  suggestionsLoading: boolean;
  /** Search history entries */
  history: ISearchHistoryEntry[];
  /** Available refiners with counts */
  refiners: ISearchRefiner[];
  /** Currently selected result for preview (by ID) */
  previewResultId: string;
  /** Whether user has executed at least one search */
  hasSearched: boolean;
  /** Spelling suggestion from search engine ("Did you mean?") */
  spellingSuggestion: string;
}

// ── Actions ──

export interface IHyperSearchStoreActions {
  /** Set the full query text */
  setQueryText: (text: string) => void;
  /** Set the search scope */
  setScope: (scope: SearchScopeType) => void;
  /** Set the sort order */
  setSortBy: (sortBy: SearchSortBy) => void;
  /** Set a refiner selection */
  setRefiner: (fieldName: string, values: string[]) => void;
  /** Clear all refiner selections */
  clearRefiners: () => void;
  /** Go to a specific page (0-based startRow) */
  setStartRow: (startRow: number) => void;
  /** Set results from a completed search */
  setResults: (results: IHyperSearchResult[], totalResults: number) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string) => void;
  /** Set type-ahead suggestions */
  setSuggestions: (suggestions: ISearchSuggestion[]) => void;
  /** Set suggestions loading state */
  setSuggestionsLoading: (loading: boolean) => void;
  /** Set search history */
  setHistory: (history: ISearchHistoryEntry[]) => void;
  /** Set available refiners */
  setRefiners: (refiners: ISearchRefiner[]) => void;
  /** Set preview result ID */
  setPreviewResultId: (id: string) => void;
  /** Set spelling suggestion */
  setSpellingSuggestion: (suggestion: string) => void;
  /** Reset the store to initial state */
  reset: () => void;
}

// ── Combined ──

export type IHyperSearchStore = IHyperSearchStoreState & IHyperSearchStoreActions;

// ── Initial state ──

const initialState: IHyperSearchStoreState = {
  query: { ...DEFAULT_QUERY },
  results: [],
  totalResults: 0,
  loading: false,
  error: "",
  suggestions: [],
  suggestionsLoading: false,
  history: [],
  refiners: [],
  previewResultId: "",
  hasSearched: false,
  spellingSuggestion: "",
};

// ── Store ──

export const useHyperSearchStore = create<IHyperSearchStore>(function (set) {
  return {
    ...initialState,

    setQueryText: function (text: string): void {
      set(function (state) {
        return {
          query: { ...state.query, queryText: text, startRow: 0 },
        };
      });
    },

    setScope: function (scope: SearchScopeType): void {
      set(function (state) {
        return {
          query: { ...state.query, scope: scope, startRow: 0, refiners: {} },
          refiners: [],
        };
      });
    },

    setSortBy: function (sortBy: SearchSortBy): void {
      set(function (state) {
        return {
          query: { ...state.query, sortBy: sortBy, startRow: 0 },
        };
      });
    },

    setRefiner: function (fieldName: string, values: string[]): void {
      set(function (state) {
        const newRefiners: Record<string, string[]> = {};
        Object.keys(state.query.refiners).forEach(function (key) {
          newRefiners[key] = state.query.refiners[key];
        });
        if (values.length > 0) {
          newRefiners[fieldName] = values;
        } else {
          delete newRefiners[fieldName];
        }
        return {
          query: { ...state.query, refiners: newRefiners, startRow: 0 },
        };
      });
    },

    clearRefiners: function (): void {
      set(function (state) {
        return {
          query: { ...state.query, refiners: {}, startRow: 0 },
          refiners: [],
        };
      });
    },

    setStartRow: function (startRow: number): void {
      set(function (state) {
        return {
          query: { ...state.query, startRow: startRow },
        };
      });
    },

    setResults: function (results: IHyperSearchResult[], totalResults: number): void {
      set({
        results: results,
        totalResults: totalResults,
        hasSearched: true,
      });
    },

    setLoading: function (loading: boolean): void {
      set({ loading: loading });
    },

    setError: function (error: string): void {
      set({ error: error });
    },

    setSuggestions: function (suggestions: ISearchSuggestion[]): void {
      set({ suggestions: suggestions });
    },

    setSuggestionsLoading: function (loading: boolean): void {
      set({ suggestionsLoading: loading });
    },

    setHistory: function (history: ISearchHistoryEntry[]): void {
      set({ history: history });
    },

    setRefiners: function (refiners: ISearchRefiner[]): void {
      set({ refiners: refiners });
    },

    setPreviewResultId: function (id: string): void {
      set({ previewResultId: id });
    },

    setSpellingSuggestion: function (suggestion: string): void {
      set({ spellingSuggestion: suggestion });
    },

    reset: function (): void {
      set({ ...initialState, query: { ...DEFAULT_QUERY } });
    },
  };
});
