import { DataFrame } from "data-forge";
import { Breakdowns } from "../Breakdowns";
import { Dataset, Row } from "../DatasetTypes";
import VariableProvider from "./VariableProvider";
import { USA_FIPS, USA_DISPLAY_NAME } from "../Fips";
import { VariableId } from "../variableProviders";
import AcsPopulationProvider from "./AcsPopulationProvider";
import { applyToGroups, joinOnCols, per100k, percent } from "../datasetutils";

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
    // TODO need to figure out how to handle getting this at the national level
    // because each state reports race differently.
    let df = covid_by_state_and_race.toDataFrame();
    df = df.renameSeries({
      Cases: "covid_cases",
      Deaths: "covid_deaths",
      Hosp: "covid_hosp",
    });
    df =
      breakdowns.geography === "state"
        ? df
        : df
            .pivot(["date", "race_and_ethnicity"], {
              state_fips: (series) => USA_FIPS,
              state_name: (series) => USA_DISPLAY_NAME,
              covid_cases: (series) => series.sum(),
              covid_deaths: (series) => series.sum(),
              covid_hosp: (series) => series.sum(),
            })
            .resetIndex();

    // TODO How to handle territories?
    const acsPopulation = new DataFrame(
      this.acsProvider.getData(
        datasets,
        new Breakdowns(breakdowns.geography, breakdowns.demographic)
      )
    );

    const supportedGeos = acsPopulation
      .distinct((row) => row.state_fips)
      .getSeries("state_fips")
      .toArray();
    const unknowns = df
      .where((row) => row.race_and_ethnicity === "Unknown")
      .where((row) => supportedGeos.includes(row.state_fips));
    df = joinOnCols(df, acsPopulation, ["state_fips", "race_and_ethnicity"]);

    df = df
      .generateSeries({
        covid_cases_per_100k: (row) => per100k(row.covid_cases, row.population),
        covid_deaths_per_100k: (row) =>
          per100k(row.covid_deaths, row.population),
        covid_hosp_per_100k: (row) => per100k(row.covid_hosp, row.population),
      })
      .resetIndex();

    df = df.concat(unknowns);

    ["covid_cases", "covid_deaths", "covid_hosp"].forEach((col) => {
      df = applyToGroups(df, ["date", "state_fips"], (group) => {
        const total = group
          .where((r) => r.race_and_ethnicity === "Total")
          .first()[col];
        return group.generateSeries({
          [col + "_pct_of_geo"]: (row) => percent(row[col], total),
        });
      });
    });

    return df.toArray();
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
