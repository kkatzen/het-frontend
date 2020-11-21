import { Breakdowns } from "./Breakdowns";
import { Dataset, Row } from "./DatasetTypes";
import STATE_FIPS_MAP from "./Fips";

// TODO - do we want these to be a type instead? for example:
// export type DatasetId = "diabetes_count" | "diabetes_per_100k";
export const DIABETES_COUNT_ID = "diabetes_count";
export const DIABETES_PER_100K_ID = "diabetes_per_100k";
export const POPULATION_PCT_ID = "population_pct";
export const POPULATION_ID = "population_pct";

export abstract class VariableProvider {
  readonly variableId: string;
  readonly variableName: string;
  readonly description: string;
  readonly datasetIds: readonly string[];

  constructor(
    variableId: string,
    variableName: string,
    description: string,
    datasetIds: string[]
  ) {
    this.variableId = variableId;
    this.variableName = variableName;
    this.description = description;
    this.datasetIds = datasetIds;
  }

  getData(datasets: Record<string, Dataset>, breakdowns: Breakdowns): Row[] {
    if (!this.allowsBreakdowns(breakdowns)) {
      throw new Error(
        "Breakdowns not supported: " + JSON.stringify(breakdowns)
      );
    }

    const missingDatasetIds = this.datasetIds.filter((id) => !datasets[id]);
    if (missingDatasetIds.length > 0) {
      throw new Error(
        "Datasets not loaded properly: " + missingDatasetIds.join(",")
      );
    }

    return this.getDataInternal(datasets, breakdowns);
  }

  abstract getDataInternal(
    datasets: Record<string, Dataset>,
    breakdowns: Breakdowns
  ): Row[];

  abstract allowsBreakdowns(breakdowns: Breakdowns): boolean;

  static getUniqueDatasetIds(providers: VariableProvider[]): string[] {
    return Array.from(new Set(providers.map((p) => p.datasetIds).flat()));
  }
}

export class DiabetesProvider extends VariableProvider {
  constructor(variableId: string, variableName: string, description: string) {
    super(variableId, variableName, description, [
      "brfss_diabetes",
      "acs_state_population_by_race",
    ]);
  }

  getDataInternal(
    datasets: Record<string, Dataset>,
    breakdowns: Breakdowns
  ): Row[] {
    const brfss_diabetes = datasets["brfss_diabetes"];
    const acs_state_population_by_race =
      datasets["acs_state_population_by_race"];

    const keySelector = (row: any) =>
      JSON.stringify({ state_name: row.state_name, race: row.race });
    const joined = brfss_diabetes
      .toDataFrame()
      .join(
        acs_state_population_by_race.toDataFrame(),
        keySelector,
        keySelector,
        (dia, acs) => ({ ...acs, ...dia })
      );

    const df =
      breakdowns.geography === "state"
        ? joined
        : joined.pivot("race", {
            state_name: (series) => STATE_FIPS_MAP[0],
            diabetes_count: (series) => series.sum(),
            population: (series) => series.sum(),
          });

    return df
      .generateSeries({
        // TODO I think this is inaccurate - since it's based on survey data,
        // we should be dividing by total survey responses, not by total
        // population.
        diabetes_per_100k: (row) =>
          Math.round(row.diabetes_count / (row.population / 100000)),
      })
      .toArray();
  }

  allowsBreakdowns(breakdowns: Breakdowns): boolean {
    return (
      !breakdowns.time &&
      (breakdowns.geography === "state" ||
        breakdowns.geography === "national") &&
      breakdowns.demographic === "race"
    );
  }
}

export class AcsPopulationProvider extends VariableProvider {
  constructor(variableId: string, variableName: string, description: string) {
    super(variableId, variableName, description, [
      "acs_state_population_by_race",
    ]);
  }

  getDataInternal(
    datasets: Record<string, Dataset>,
    breakdowns: Breakdowns
  ): Row[] {
    const acs_state_population_by_race =
      datasets["acs_state_population_by_race"];

    const acs = acs_state_population_by_race.toDataFrame();
    const df =
      breakdowns.geography === "state"
        ? acs
        : acs.pivot("race", {
            // TODO rename column to geography or something general
            state_name: (series) => STATE_FIPS_MAP[0],
            population: (series) => series.sum(),
          });

    const groupedByGeo = df
      .groupBy((row) => row.state_name)
      .select((group) => {
        const statePop = group.where((r) => r.race === "All Races").first()
          .population;
        return group
          .where((row) => {
            const isAllRaces = row.race === "All Races";
            return breakdowns.demographic === "race" ? !isAllRaces : isAllRaces;
          })
          .generateSeries({
            population_pct: (row) =>
              Math.round((1000 * row.population) / statePop) / 10,
          });
      });
    return groupedByGeo
      .skip(1)
      .aggregate(groupedByGeo.first(), (prev, next) => prev.concat(next))
      .resetIndex()
      .toArray();
  }

  allowsBreakdowns(breakdowns: Breakdowns): boolean {
    return (
      !breakdowns.time &&
      (breakdowns.geography === "state" ||
        breakdowns.geography === "national") &&
      (!breakdowns.demographic || breakdowns.demographic === "race")
    );
  }
}

const variableProviders: Record<string, VariableProvider> = {
  diabetes_count: new DiabetesProvider(
    DIABETES_COUNT_ID,
    "Diabetes Count",
    "Number of people with diabetes"
  ),
  diabetes_per_100k: new DiabetesProvider(
    DIABETES_PER_100K_ID,
    "Diabetes Per 100k",
    "Number of people with diabetes per 100k population"
  ),
  population_pct: new AcsPopulationProvider(
    POPULATION_PCT_ID,
    "Population Percent",
    "Percentage of population"
  ),
  population: new AcsPopulationProvider(
    POPULATION_ID,
    "Population",
    "Population"
  ),
};

export default variableProviders;
