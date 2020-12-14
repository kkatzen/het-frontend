import { IDataFrame } from "data-forge";

/**
 * Reshapes the data frame by creating a new column for each value in
 * newColNames, and using the values from newColValues, grouping by
 * groupedByCol. For example, if you have a dataset with columns: 'state_name',
 * 'race', and 'population', calling:
 *     reshapeRowsToCols(df, 'population', 'race', 'state_name');
 * will convert this to a data frame with a 'state_name' column and a population
 * column for each race. You can optionally rename the columns using
 * colNameGenerator.
 */
export function reshapeRowsToCols(
  df: IDataFrame,
  newColValues: string,
  newColNames: string,
  groupedByCol: string,
  colNameGenerator?: (value: any) => string
): IDataFrame {
  return df
    .groupBy((row: any) => row[groupedByCol])
    .select((group) => {
      const newCols = group.aggregate({}, (acc: any, row: any) => {
        let newColName = row[newColNames];
        if (colNameGenerator) {
          newColName = colNameGenerator(newColName);
        }
        acc[newColName] = row[newColValues];
        return acc;
      });
      return { ...group.first(), ...newCols };
    })
    .inflate()
    .dropSeries([newColNames, newColValues]);
}

/**
 * Does the opposite of reshapeRowsToCols. For example, if you have a dataset
 * with a 'state_name' column and a population column for each race, calling:
 *     reshapeColsToRows(
 *         df, ['Black', 'White', 'Hispanic', ...], "population", "race");
 * will convert it to a dataset with columns: 'state_name', 'race', and
 * 'population'
 * @param df
 * @param cols
 * @param newCol
 * @param groupedByCol
 */
export function reshapeColsToRows(
  df: IDataFrame,
  cols: string[],
  newCol: string,
  groupedByCol: string
) {
  return df
    .selectMany((row) => {
      return cols.map((col) => {
        return { ...row, [groupedByCol]: col, [newCol]: row[col] };
      });
    })
    .dropSeries(cols);
}

/**
 * Groups df by all the columns in groupByCols, and applies the specified
 * function to each group, and then collects the resulting groups into a data
 * frame and returns that.
 */
export function applyToGroups(
  df: IDataFrame,
  groupByCols: string[],
  fn: (group: IDataFrame) => IDataFrame
): IDataFrame {
  const groups = df
    .groupBy((row) => row[groupByCols[0]])
    .select((group) => {
      if (groupByCols.length === 1) {
        return fn(group);
      }
      return applyToGroups(group, groupByCols.slice(1), fn);
    });
  return groups
    .skip(1)
    .aggregate(groups.first(), (prev, next) => prev.concat(next))
    .resetIndex();
}

/**
 * Left joins two data frames on the specified columns, keeping all the
 * remaining columns from both.
 */
export function joinOnCols(
  df1: IDataFrame,
  df2: IDataFrame,
  cols: string[]
): IDataFrame {
  const keySelector = (row: any) => {
    const keys = cols.map((col) => col + ": " + row[col]);
    return keys.join(",");
  };
  return df1
    .join(df2, keySelector, keySelector, (row1, row2) => ({ ...row2, ...row1 }))
    .resetIndex();
}

/** Calculates a rate as occurrences per 100k */
export function per100k(numerator: number, denominator: number): number | null {
  return numerator == null || denominator == null
    ? null
    : Math.round(100000 * (numerator / denominator));
}

/** Calculates a rate as a percent to one decimal place. */
export function percent(numerator: number, denominator: number): number | null {
  return numerator == null || denominator == null
    ? null
    : Math.round((1000 * numerator) / denominator) / 10;
}
