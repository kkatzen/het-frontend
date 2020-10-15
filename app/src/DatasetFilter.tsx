import React from "react";
import Select, { ActionTypes } from "react-select";

const changeActions: Array<ActionTypes> = [
  "select-option",
  "remove-value",
  "clear",
];

function DatasetFilter(props: {
  sources: Array<{ id: string; displayName: string; description: string }>;
  onSelectionChange: (filtered: Array<string>) => void;
}) {
  const options = props.sources
    .slice()
    .map((source) => ({ value: source.id, label: source.displayName }));
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
