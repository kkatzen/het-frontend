import { DataFrame } from "data-forge";
import { Breakdowns } from "../Breakdowns";
import { Dataset, Row } from "../DatasetTypes";
import VariableProvider from "./VariableProvider";
import STATE_FIPS_MAP from "../Fips";
import { VariableId } from "../variableProviders";
import AcsPopulationProvider from "./AcsPopulationProvider";

class CovidProvider extends VariableProvider {
  private acsProvider: AcsPopulationProvider;

  constructor(
    variableId: VariableId,
    variableName: string,
    description: string,
    acsProvider: AcsPopulationProvider
  ) {
    super(
      variableId,
      variableName,
      description,
      ["covid_by_state_and_race"].concat(acsProvider.datasetIds)
    );
    this.acsProvider = acsProvider;
  }

  getDataInternal(
    datasets: Record<string, Dataset>,
    breakdowns: Breakdowns
  ): Row[] {
    const covid_by_state_and_race = datasets["covid_by_state_and_race"];
    const acs_population = new DataFrame(
      this.acsProvider.getData(datasets, Breakdowns.byState().andRace(true))
    );

    const df = covid_by_state_and_race.toDataFrame();
    const keySelector = (row: any) =>
      JSON.stringify({
        state_name: row.state_name,
        race: row.hispanic_or_latino_and_race,
      });
    const joined = df.join(
      acs_population,
      keySelector,
      keySelector,
      (dia, acs) => ({ ...acs, ...dia })
    );

    // TODO change this to pivot before joining, so we can defer to the ACS
    // provider for getting the right ACS data, and so derived values like
    // population_pct still apply.
    let result =
      breakdowns.geography === "state"
        ? joined
        : joined
            .pivot(["date", "hispanic_or_latino_and_race"], {
              state_name: (series) => STATE_FIPS_MAP[0],
              Cases: (series) => series.sum(),
              Deaths: (series) => series.sum(),
              Hosp: (series) => series.sum(),
              population: (series) => series.sum(),
            })
            .resetIndex();

    return result
      .generateSeries({
        covid_cases_per_100k: (row) =>
          Math.round(row.Cases / (row.population / 100000)),
        covid_deaths_per_100k: (row) =>
          Math.round(row.Deaths / (row.population / 100000)),
        covid_hosp_per_100k: (row) =>
          Math.round(row.Hosp / (row.population / 100000)),
      })
      .resetIndex()
      .toArray();
  }

  allowsBreakdowns(breakdowns: Breakdowns): boolean {
    return (
      !!breakdowns.time &&
      breakdowns.demographic === "race_nonstandard" &&
      (breakdowns.geography === "state" || breakdowns.geography === "national")
    );
  }
}

export default CovidProvider;
