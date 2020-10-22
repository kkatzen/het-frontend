import React, { useState } from "react";
import DatasetFilter from "./DatasetFilter";
import DatasetListing from "./DatasetListing";
import styles from "./DatasetExplorer.module.scss";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import useDatasetStore from "../../utils/useDatasetStore";
import DatasetPreview from "./DatasetPreview";

function DatasetExplorer() {
  const [previewedDatasetId, setPreviewedDatasetId] = useState("");
  const [activeFilter, setActiveFilter] = useState<Array<string>>([]);
  const datasetStore = useDatasetStore();

  const loadPreview = (datasetId: string) => {
    setPreviewedDatasetId(datasetId);
    datasetStore.loadDataset(datasetId);
  };

  const metadata = datasetStore.metadata;

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
                <DatasetListing
                  dataset={metadata[datasetId]}
                  onPreview={() => loadPreview(datasetId)}
                />
              </div>
              {previewedDatasetId === datasetId ? <ChevronRightIcon /> : null}
            </div>
          ))}
      </div>
      <div className={styles.Table}>
        {datasetStore.getDatasetLoadStatus(previewedDatasetId) ===
        "unloaded" ? (
          <p>Select a dataset to view.</p>
        ) : (
          <DatasetPreview datasetId={previewedDatasetId} />
        )}
      </div>
    </div>
  );
}

export default DatasetExplorer;
