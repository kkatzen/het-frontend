import React, { useState } from "react";
import DatasetFilter from "./DatasetFilter";
import DatasetListing from "./DatasetListing";
import styles from "./DatasetExplorer.module.scss";
import useDatasetStore from "../../utils/useDatasetStore";
import { MetadataMap } from "../../utils/DatasetTypes";

function DatasetExplorer() {
  const [activeFilter, setActiveFilter] = useState<Array<string>>([]);
  const datasetStore = useDatasetStore();

  const metadata: MetadataMap = datasetStore.metadata;

  return (
    <div className={styles.DatasetExplorer}>
      <div className={styles.DatasetList}>
        <div className={styles.DatasetListItem}>
          <DatasetFilter
            datasets={metadata}
            onSelectionChange={(filtered) => {
              setActiveFilter(filtered);
            }}
          />
        </div>
        {Object.keys(metadata)
          .filter(
            (datasetId) =>
              activeFilter.length === 0 || activeFilter.includes(datasetId)
          )
          .map((datasetId, index) => (
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
