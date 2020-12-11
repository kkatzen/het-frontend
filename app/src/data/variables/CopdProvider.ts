import { Breakdowns } from "../Breakdowns";
import { Dataset, Row } from "../DatasetTypes";
import { per100k } from "../datasetutils";
import {
  USA_FIPS,
  USA_DISPLAY_NAME,
  ALL_RACES_DISPLAY_NAME,
} from "../../utils/madlib/Fips";
import { VariableId } from "../variableProviders";
import VariableProvider from "./VariableProvider";

class CopdProvider extends VariableProvider {
  constructor(
    variableId: VariableId,
    variableName: string,
    description: string
  ) {
    super(variableId, variableName, description, ["brfss_diabetes"]);
  }

  getDataInternal(
    datasets: Record<string, Dataset>,
    breakdowns: Breakdowns
  ): Row[] {
    const brfss_diabetes = datasets["brfss_diabetes"];
    let df = brfss_diabetes.toDataFrame();

    if (breakdowns.geography === "national") {
      df = df.pivot("race", {
        state_fips: (series) => USA_FIPS,
        state_name: (series) => USA_DISPLAY_NAME,
        copd_count: (series) => series.sum(),
        copd_no: (series) => series.sum(),
      });
    }
    if (!breakdowns.demographic) {
      df = df.pivot(["state_name", "state_fips"], {
        race: (series) => ALL_RACES_DISPLAY_NAME,
        copd_count: (series) => series.sum(),
        copd_no: (series) => series.sum(),
      });
    }

    return df
      .generateSeries({
        copd_per_100k: (row) =>
          per100k(row.copd_count, row.copd_count + row.copd_no),
      })
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

export default CopdProvider;
