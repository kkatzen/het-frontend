import React, { useState } from "react";
import DatasetFilter from "./DatasetFilter";
import DatasetListing from "./DatasetListing";
import styles from "./DatasetExplorer.module.scss";
import useDatasetStore from "../../utils/useDatasetStore";
import { DatasetMetadata, MetadataMap } from "../../utils/DatasetTypes";

// Map of filter id to list of datasets selected by that filter, or empty list
// for filters that don't have anything selected.
type Filters = Record<string, string[]>;

function DatasetExplorer() {
  const [activeFilter, setActiveFilter] = useState<Filters>({});
  const datasetStore = useDatasetStore();

  const metadata: MetadataMap = datasetStore.metadata;

  function getFilteredDatasetIds() {
    const filters = Object.values(activeFilter);
    const reducer = (intersection: string[], nextFilter: string[]) => {
      if (nextFilter.length === 0) {
        return intersection;
      }
      return intersection.filter((x) => nextFilter.includes(x));
    };
    const allIds = Object.keys(metadata);
    return filters.reduce(reducer, allIds);
  }

  function createFilter(
    id: string,
    placeholder: string,
    propertySelector: (metadata: DatasetMetadata) => string
  ) {
    return (
      <div className={styles.Filter}>
        <DatasetFilter
          datasets={metadata}
          onSelectionChange={(filtered) => {
            setActiveFilter({
              ...activeFilter,
              [id]: filtered,
            });
          }}
          propertySelector={propertySelector}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className={styles.DatasetExplorer}>
      <div className={styles.DatasetList}>
        <div className={styles.FilterContainer}>
          <div className={styles.FilterTitle}>Filter by...</div>
          {createFilter(
            "name_filter",
            "Dataset name",
            (metadata) => metadata.name
          )}
          {createFilter(
            "geographic_filter",
            "Geographic level",
            (metadata) => metadata.geographic_level
          )}
        </div>
        {getFilteredDatasetIds().map((datasetId, index) => (
          <div className={styles.Dataset} key={index}>
            <div className={styles.DatasetListItem}>
              <DatasetListing dataset={metadata[datasetId]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DatasetExplorer;
