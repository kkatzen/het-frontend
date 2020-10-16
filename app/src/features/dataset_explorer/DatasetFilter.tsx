import React from "react";
import Select, { ActionTypes } from "react-select";
import { DatasetMetadata } from "../../utils/DatasetMetadata";

const changeActions: Array<ActionTypes> = [
  "select-option",
  "remove-value",
  "clear",
];

function DatasetFilter(props: {
  datasets: Array<DatasetMetadata>;
  onSelectionChange: (filtered: Array<string>) => void;
}) {
  const options = props.datasets
    .slice()
    .map((dataset) => ({ value: dataset.id, label: dataset.name }));
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
