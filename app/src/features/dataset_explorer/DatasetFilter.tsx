import React from "react";
import Select, { ActionTypes } from "react-select";
import { DatasetMetadata } from "../../utils/DatasetTypes";

const changeActions: Array<ActionTypes> = [
  "select-option",
  "remove-value",
  "clear",
];

interface SelectOption {
  value: string;
  label: string;
}

/**
 * @param props
 *     datasets: The metadata for all datasets
 *     onSelectionChange: function that gets called when the filter's selection
 *         changes. Gets passed a list of all datasets that this filter is
 *         including, or an empty array if this filter is not being used.
 *     propertySelector: function returns the metadata property to filter on.
 *     placeholder: The text to use as a placeholder for this filter.
 */
function DatasetFilter(props: {
  datasets: Record<string, DatasetMetadata>;
  onSelectionChange: (filtered: Array<string>) => void;
  propertySelector: (metadata: DatasetMetadata) => string;
  placeholder: string;
}) {
  const propertyToDatasetsMap: Record<string, string[]> = {};
  Object.keys(props.datasets).forEach((dataset_id) => {
    const property = props.propertySelector(props.datasets[dataset_id]);
    if (!propertyToDatasetsMap[property]) {
      propertyToDatasetsMap[property] = [];
    }
    propertyToDatasetsMap[property].push(dataset_id);
  });
  const options = Object.keys(propertyToDatasetsMap).map((property) => ({
    value: property,
    label: property,
  }));
  return (
    <Select
      options={options}
      placeholder={props.placeholder}
      isMulti
      onChange={(value, metadata) => {
        const selected = value as SelectOption[];
        if (changeActions.includes(metadata.action)) {
          const filter =
            !selected || selected.length === 0
              ? []
              : selected
                  .map((item) => propertyToDatasetsMap[item.value])
                  .flat();
          props.onSelectionChange(filter);
        }
      }}
    />
  );
}

export default DatasetFilter;
