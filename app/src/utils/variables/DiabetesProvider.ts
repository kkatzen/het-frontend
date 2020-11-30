import { Breakdowns } from "../Breakdowns";
import { Dataset, Row } from "../DatasetTypes";
import STATE_FIPS_MAP from "../Fips";
import { VariableId } from "../variableProviders";
import VariableProvider from "./VariableProvider";

class DiabetesProvider extends VariableProvider {
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
    const diabetesFrame = brfss_diabetes.toDataFrame();

    const df =
      breakdowns.geography === "state"
        ? diabetesFrame
        : diabetesFrame.pivot("race", {
            state_name: (series) => STATE_FIPS_MAP[0],
            diabetes_count: (series) => series.sum(),
            diabetes_no: (series) => series.sum(),
          });

    return df
      .generateSeries({
        diabetes_per_100k: (row) =>
          100000 *
          (row.diabetes_count / (row.diabetes_count + row.diabetes_no)),
        copd_per_100k: (row) =>
          100000 * (row.copd_count / (row.copd_count + row.copd_no)),
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

export default DiabetesProvider;
