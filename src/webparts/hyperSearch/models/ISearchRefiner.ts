/** A single refiner value with its count */
export interface IRefinerValue {
  /** The refiner value label */
  value: string;
  /** Number of results matching this value */
  count: number;
}

/** A refiner field with its available values */
export interface ISearchRefiner {
  /** The managed property name (e.g. "FileType", "Author") */
  fieldName: string;
  /** Display label for the refiner group */
  displayName: string;
  /** Available values with counts */
  values: IRefinerValue[];
}
