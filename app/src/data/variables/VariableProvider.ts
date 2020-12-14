import { Breakdowns } from "../Breakdowns";
import { Dataset, Row } from "../DatasetTypes";
import { ProviderId, VariableId } from "../variableProviders";

abstract class VariableProvider {
  readonly providerId: ProviderId;
  readonly providesVariables: VariableId[];
  readonly datasetIds: readonly string[];

  constructor(
    providerId: ProviderId,
    providesVariables: VariableId[],
    datasetIds: string[]
  ) {
    this.providerId = providerId;
    this.providesVariables = providesVariables;
    this.datasetIds = datasetIds;
  }

  getData(datasets: Record<string, Dataset>, breakdowns: Breakdowns): Row[] {
    if (!this.allowsBreakdowns(breakdowns)) {
      throw new Error(
        "Breakdowns not supported for provider " +
          this.providerId +
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

export default VariableProvider;
