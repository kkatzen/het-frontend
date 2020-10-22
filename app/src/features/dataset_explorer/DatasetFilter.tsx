import React from "react";
import Select, { ActionTypes } from "react-select";
import { DatasetMetadata } from "../../utils/DatasetTypes";

const changeActions: Array<ActionTypes> = [
  "select-option",
  "remove-value",
  "clear",
];

function DatasetFilter(props: {
  datasets: Record<string, DatasetMetadata>;
  onSelectionChange: (filtered: Array<string>) => void;
}) {
  const options = Object.keys(props.datasets)
    .slice()
    .map((dataset_id) => ({
      value: dataset_id,
      label: props.datasets[dataset_id].name,
    }));
  return (
    <Select
      options={options}
      placeholder="Filter datasets..."
      isMulti
      onChange={(value, metadata) => {
        const selected = value as Array<{ value: string; label: string }>;
        if (changeActions.includes(metadata.action)) {
          const filter =
            !selected || selected.length === 0
              ? []
              : selected.map((item) => item.value);
          props.onSelectionChange(filter);
        }
      }}
    />
  );
}

export default DatasetFilter;
