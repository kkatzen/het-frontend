/* TODO: These are not yet comprehensive, final interfaces */

export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  fields: Field[];
}

export interface Field {
  data_type: string;
  name: string;
  description: string;
  origin_dataset: string;
}
