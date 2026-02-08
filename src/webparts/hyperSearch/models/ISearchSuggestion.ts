/** A type-ahead search suggestion */
export interface ISearchSuggestion {
  /** Display text for the suggestion */
  text: string;
  /** The query string to execute */
  queryString: string;
}
