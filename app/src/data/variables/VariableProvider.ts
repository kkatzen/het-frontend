import { Breakdowns } from "../Breakdowns";
import { Dataset, Row } from "../DatasetTypes";
import { VariableId } from "../variableProviders";

abstract class VariableProvider {
  readonly variableId: VariableId;
  readonly variableName: string;
  readonly description: string;
  readonly datasetIds: readonly string[];
  private cache: Record<string, Row[]>; // TODO expiration, reload when datasets change.

  constructor(
    variableId: VariableId,
    variableName: string,
    description: string,
    datasetIds: string[]
  ) {
    this.variableId = variableId;
    this.variableName = variableName;
    this.description = description;
    this.datasetIds = datasetIds;
    this.cache = {};
  }

  getData(datasets: Record<string, Dataset>, breakdowns: Breakdowns): Row[] {
    if (!this.allowsBreakdowns(breakdowns)) {
      throw new Error(
        "Breakdowns not supported for variable " +
          this.variableId +
          ": " +
          JSON.stringify(breakdowns)
      );
    }

    const missingDatasetIds = this.datasetIds.filter((id) => !datasets[id]);
    if (missingDatasetIds.length > 0) {
      throw new Error(
        "Datasets not loaded properly: " + missingDatasetIds.join(",")
      );
    }

    // TODO need to reset cache when datasets are reloaded. We should also
    // probably evaluate if there are better ways to deal with performance than
    // this.
    const cached = this.cache[breakdowns.getUniqueKey()];
    if (cached) {
      return cached;
    }

    const rows = this.getDataInternal(datasets, breakdowns);
    this.cache[breakdowns.getUniqueKey()] = rows;
    return rows;
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

export default VariableProvider;
