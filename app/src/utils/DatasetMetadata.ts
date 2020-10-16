/* TODO: These are not yet comprehensive, final interfaces */

export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  fields: Array<Field>;
}

export interface Field {
  data_type: string;
  description: string;
  data_source_id: string;
}
