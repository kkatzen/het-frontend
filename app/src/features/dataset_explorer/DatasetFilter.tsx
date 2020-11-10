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

function propertyToSelectOption(property: string): SelectOption {
  return {
    value: property,
    label: property,
  };
}

/**
 * @param props
 *     datasets: The metadata for all datasets
 *     onSelectionChange: function that gets called when the filter's selection
 *         changes. Gets passed a list of all datasets that this filter is
 *         including, or an empty array if this filter is not being used.
 *     propertySelector: function returns the metadata property to filter on.
 *     placeholder: The text to use as a placeholder for this filter.
 *     defaultValues: The default display options, or null for no default
 *         values. Must be valid options or the filter won't work properly.
 */
function DatasetFilter(props: {
  datasets: Record<string, DatasetMetadata>;
  onSelectionChange: (filtered: Array<string>) => void;
  propertySelector: (metadata: DatasetMetadata) => string;
  placeholder: string;
  defaultValues: string[] | null;
}) {
  const propertyToDatasetsMap: Record<string, string[]> = {};
  Object.keys(props.datasets).forEach((dataset_id) => {
    const property = props.propertySelector(props.datasets[dataset_id]);
    if (!propertyToDatasetsMap[property]) {
      propertyToDatasetsMap[property] = [];
    }
    propertyToDatasetsMap[property].push(dataset_id);
  });
  const options = Object.keys(propertyToDatasetsMap).map(
    propertyToSelectOption
  );
  const defaultValues = props.defaultValues
    ? props.defaultValues.map(propertyToSelectOption)
    : null;
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
      defaultValue={defaultValues}
    />
  );
}

export default DatasetFilter;
