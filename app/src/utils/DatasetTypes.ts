/* TODO: These are not yet comprehensive, final interfaces */

export interface DatasetMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly fields: Field[];
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

  getRowsAsArrays() {
    return this.rows.map((row) => {
      return this.metadata.fields.map((field) => row[field.name]);
    });
  }
}

// Map of dataset id to DatasetMetadata
export type MetadataMap = Readonly<Record<string, DatasetMetadata>>;

export type LoadStatus = "unloaded" | "loading" | "loaded" | "error";

export interface DatasetStore {
  readonly loadDataset: (id: string) => Promise<Dataset | undefined>;
  readonly getDatasetLoadStatus: (id: string) => LoadStatus;
  readonly metadataLoadStatus: LoadStatus;
  readonly metadata: MetadataMap;
  readonly datasets: Readonly<Record<string, Dataset>>;
}
