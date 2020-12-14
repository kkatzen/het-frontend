import { DataFrame, IDataFrame } from "data-forge";
import VariableQuery from "./VariableQuery";
import { VariableId } from "../data/variableProviders";

/* TODO: These are not yet comprehensive, final interfaces */
export type MetricType =
  | "count"
  | "pct_share"
  | "pct_share_to_pop_ratio"
  | "per100k"
  | "percentile"
  | "index";

export type Metric = {
  variableId: VariableId;
  fullCardTitleName: string;
  shortVegaLabel: string;
};

export const MADLIB_VARIABLES: Record<
  string,
  Record<string, Record<string, Metric>>
> = {
  covid: {
    cases: {
      count: {
        variableId: "covid_cases",
        fullCardTitleName: "Covid19 cases",
        shortVegaLabel: "cases",
      },
      pct_share: {
        variableId: "covid_cases_pct_of_geo",
        fullCardTitleName: "Share of COVID-19 cases",
        shortVegaLabel: "% of cases",
      },
      per100k: {
        variableId: "covid_cases_pct_of_geo",
        fullCardTitleName: "Share of COVID-19 cases",
        shortVegaLabel: "% of cases",
      },
    },
  },
};

export interface DatasetMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly fields: readonly Field[];
  readonly data_source_name: string;
  readonly data_source_link: string;
  readonly geographic_level: string;
  readonly demographic_granularity: string;
  readonly update_frequency: string;
  readonly update_time: string;
}

export interface Field {
  readonly data_type: string;
  readonly name: string;
  readonly description: string;
  readonly origin_dataset: string;
}

// TODO: make typedef for valid data types instead of any.
export type Row = Readonly<Record<string, any>>;

export class Dataset {
  readonly rows: Readonly<Row[]>;
  readonly metadata: Readonly<DatasetMetadata>;

  constructor(rows: Row[], metadata: DatasetMetadata) {
    this.rows = rows;
    this.metadata = metadata;
  }

  toDataFrame(): IDataFrame {
    return new DataFrame(this.rows);
  }

  toCsvString() {
    const headers = this.metadata.fields.map((f) => f.name);
    const stringFields = this.metadata.fields
      .filter((f) => f.data_type === "string")
      .map((f) => f.name);
    const addQuotes = (val: string) => `"${val}"`;
    const df = this.toDataFrame().transformSeries(
      Object.fromEntries(stringFields.map((name) => [name, addQuotes]))
    );
    return [headers]
      .concat(df.toRows())
      .map((row) => row.join(","))
      .join("\n");
  }
}

// Map of dataset id to DatasetMetadata
export type MetadataMap = Readonly<Record<string, DatasetMetadata>>;

export type LoadStatus = "unloaded" | "loading" | "loaded" | "error";

export interface DatasetStore {
  readonly loadDataset: (id: string) => Promise<Dataset | undefined>;
  readonly getDatasetLoadStatus: (id: string) => LoadStatus;
  readonly loadVariables: (query: VariableQuery) => Promise<void>;
  readonly getVariablesLoadStatus: (query: VariableQuery) => LoadStatus;
  readonly getVariables: (query: VariableQuery) => Row[];
  readonly metadataLoadStatus: LoadStatus;
  readonly metadata: MetadataMap;
  readonly datasets: Readonly<Record<string, Dataset>>;
}
