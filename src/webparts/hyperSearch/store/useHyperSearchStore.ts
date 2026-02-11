import create from "zustand";
import type {
  IHyperSearchResult,
  ISearchQuery,
  ISearchSuggestion,
  ISearchHistoryEntry,
  ISearchRefiner,
  SearchScopeType,
  SearchSortBy,
  ResultLayoutMode,
  SearchBarStyle,
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

  // ── V2 State ──

  /** Current active scope tab */
  activeScope: SearchScopeType;
  /** Current result layout mode */
  resultLayout: ResultLayoutMode;
  /** Whether demo mode is active */
  demoMode: boolean;
  /** Whether the wizard panel is open */
  wizardOpen: boolean;
  /** Whether the search bar is focused (for zero-query) */
  searchBarFocused: boolean;
  /** Whether the filter panel is expanded */
  filterPanelOpen: boolean;
  /** Saved searches */
  savedSearches: string[];
  /** Search bar visual style */
  searchBarStyle: SearchBarStyle;
  /** Accent color */
  accentColor: string;
  /** Border radius */
  borderRadius: number;
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

  // ── V2 Actions ──

  /** Set active scope tab */
  setActiveScope: (scope: SearchScopeType) => void;
  /** Set result layout mode */
  setResultLayout: (layout: ResultLayoutMode) => void;
  /** Toggle demo mode */
  setDemoMode: (enabled: boolean) => void;
  /** Toggle wizard open/close */
  setWizardOpen: (open: boolean) => void;
  /** Set search bar focused state */
  setSearchBarFocused: (focused: boolean) => void;
  /** Toggle filter panel open/close */
  setFilterPanelOpen: (open: boolean) => void;
  /** Add a saved search */
  addSavedSearch: (query: string) => void;
  /** Remove a saved search */
  removeSavedSearch: (query: string) => void;
  /** Set search bar style */
  setSearchBarStyle: (style: SearchBarStyle) => void;
  /** Set accent color */
  setAccentColor: (color: string) => void;
  /** Set border radius */
  setBorderRadius: (radius: number) => void;
}

// ── Combined ──

export type IHyperSearchStore = IHyperSearchStoreState & IHyperSearchStoreActions;

// ── Initial state ──

var initialState: IHyperSearchStoreState = {
  query: { queryText: DEFAULT_QUERY.queryText, scope: DEFAULT_QUERY.scope, sortBy: DEFAULT_QUERY.sortBy, refiners: {}, startRow: DEFAULT_QUERY.startRow, pageSize: DEFAULT_QUERY.pageSize },
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

  // V2
  activeScope: "everything",
  resultLayout: "listRich",
  demoMode: true,
  wizardOpen: false,
  searchBarFocused: false,
  filterPanelOpen: false,
  savedSearches: [],
  searchBarStyle: "rounded",
  accentColor: "#0078d4",
  borderRadius: 8,
};

// ── Store ──

export var useHyperSearchStore = create<IHyperSearchStore>(function (set) {
  return {
    // Spread initial state
    query: initialState.query,
    results: initialState.results,
    totalResults: initialState.totalResults,
    loading: initialState.loading,
    error: initialState.error,
    suggestions: initialState.suggestions,
    suggestionsLoading: initialState.suggestionsLoading,
    history: initialState.history,
    refiners: initialState.refiners,
    previewResultId: initialState.previewResultId,
    hasSearched: initialState.hasSearched,
    spellingSuggestion: initialState.spellingSuggestion,
    activeScope: initialState.activeScope,
    resultLayout: initialState.resultLayout,
    demoMode: initialState.demoMode,
    wizardOpen: initialState.wizardOpen,
    searchBarFocused: initialState.searchBarFocused,
    filterPanelOpen: initialState.filterPanelOpen,
    savedSearches: initialState.savedSearches,
    searchBarStyle: initialState.searchBarStyle,
    accentColor: initialState.accentColor,
    borderRadius: initialState.borderRadius,

    // ── V1 Actions ──

    setQueryText: function (text: string): void {
      set(function (state) {
        return {
          query: { queryText: text, scope: state.query.scope, sortBy: state.query.sortBy, refiners: state.query.refiners, startRow: 0, pageSize: state.query.pageSize },
        };
      });
    },

    setScope: function (scope: SearchScopeType): void {
      set(function (state) {
        return {
          query: { queryText: state.query.queryText, scope: scope, sortBy: state.query.sortBy, refiners: {}, startRow: 0, pageSize: state.query.pageSize },
          refiners: [],
          activeScope: scope,
        };
      });
    },

    setSortBy: function (sortBy: SearchSortBy): void {
      set(function (state) {
        return {
          query: { queryText: state.query.queryText, scope: state.query.scope, sortBy: sortBy, refiners: state.query.refiners, startRow: 0, pageSize: state.query.pageSize },
        };
      });
    },

    setRefiner: function (fieldName: string, values: string[]): void {
      set(function (state) {
        var newRefiners: Record<string, string[]> = {};
        Object.keys(state.query.refiners).forEach(function (key) {
          newRefiners[key] = state.query.refiners[key];
        });
        if (values.length > 0) {
          newRefiners[fieldName] = values;
        } else {
          delete newRefiners[fieldName];
        }
        return {
          query: { queryText: state.query.queryText, scope: state.query.scope, sortBy: state.query.sortBy, refiners: newRefiners, startRow: 0, pageSize: state.query.pageSize },
        };
      });
    },

    clearRefiners: function (): void {
      set(function (state) {
        return {
          query: { queryText: state.query.queryText, scope: state.query.scope, sortBy: state.query.sortBy, refiners: {}, startRow: 0, pageSize: state.query.pageSize },
          refiners: [],
        };
      });
    },

    setStartRow: function (startRow: number): void {
      set(function (state) {
        return {
          query: { queryText: state.query.queryText, scope: state.query.scope, sortBy: state.query.sortBy, refiners: state.query.refiners, startRow: startRow, pageSize: state.query.pageSize },
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
      set({
        query: { queryText: "", scope: "everything", sortBy: "relevance", refiners: {}, startRow: 0, pageSize: 10 },
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
        searchBarFocused: false,
        filterPanelOpen: false,
      });
    },

    // ── V2 Actions ──

    setActiveScope: function (scope: SearchScopeType): void {
      set(function (state) {
        return {
          activeScope: scope,
          query: { queryText: state.query.queryText, scope: scope, sortBy: state.query.sortBy, refiners: {}, startRow: 0, pageSize: state.query.pageSize },
          refiners: [],
        };
      });
    },

    setResultLayout: function (layout: ResultLayoutMode): void {
      set({ resultLayout: layout });
    },

    setDemoMode: function (enabled: boolean): void {
      set({ demoMode: enabled });
    },

    setWizardOpen: function (open: boolean): void {
      set({ wizardOpen: open });
    },

    setSearchBarFocused: function (focused: boolean): void {
      set({ searchBarFocused: focused });
    },

    setFilterPanelOpen: function (open: boolean): void {
      set({ filterPanelOpen: open });
    },

    addSavedSearch: function (query: string): void {
      set(function (state) {
        var existing = state.savedSearches;
        var filtered: string[] = [];
        existing.forEach(function (s) {
          if (s !== query) filtered.push(s);
        });
        filtered.push(query);
        return { savedSearches: filtered };
      });
    },

    removeSavedSearch: function (query: string): void {
      set(function (state) {
        var filtered: string[] = [];
        state.savedSearches.forEach(function (s) {
          if (s !== query) filtered.push(s);
        });
        return { savedSearches: filtered };
      });
    },

    setSearchBarStyle: function (style: SearchBarStyle): void {
      set({ searchBarStyle: style });
    },

    setAccentColor: function (color: string): void {
      set({ accentColor: color });
    },

    setBorderRadius: function (radius: number): void {
      set({ borderRadius: radius });
    },
  };
});
