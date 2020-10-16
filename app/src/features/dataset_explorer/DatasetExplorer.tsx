import React, { useState, useEffect } from "react";
import DatasetFilter from "./DatasetFilter";
import DataFetcher from "../../utils/DataFetcher";
import DataTable from "./DataTable";
import DatasetListing from "./DatasetListing";
import styles from "./DatasetExplorer.module.scss";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { DatasetMetadata } from "../../utils/DatasetMetadata";

type LoadStatus = "unloaded" | "loading" | "loaded";

function renderTableOrPlaceholder(
  loadStatus: LoadStatus,
  columns: any[],
  data: any[]
) {
  switch (loadStatus) {
    case "loaded":
      return <DataTable columns={columns} data={data} />;
    case "loading":
      return <p>Loading...</p>;
    default:
      return <p>Select a data source to view.</p>;
  }
}

function DatasetExplorer() {
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("unloaded");
  const [previewedSourceId, setPreviewedSourceId] = useState("");
  const [data, setData] = useState([]);
  const [datasets, setDatasets] = useState<DatasetMetadata[]>([]);
  const [columns, setColumns] = useState([]);
  const [activeFilter, setActiveFilter] = useState<Array<string>>([]);

  /* This is called whenever the component is rendered */
  useEffect(() => {
    async function updateDatasets() {
      const fetcher = new DataFetcher();
      const datasets = await fetcher.getDatasets();
      setDatasets([...datasets]);
    }
    /* Only need to fetch datasets if they have not yet been fetched */
    if (datasets.length === 0) {
      updateDatasets();
    }
    // ignore warning about datasets.length dependency
    // eslint-disable-next-line
  }, []);

  const loadPreview = async (sourceId: string) => {
    setLoadStatus("loading");
    setPreviewedSourceId(sourceId);
    const fetcher = new DataFetcher();
    const source = await fetcher.loadDataset(sourceId);
    setData(source.data);
    setColumns(source.columns);
    setLoadStatus("loaded");
  };

  function filterSources(filtered: Array<string>) {
    setActiveFilter(filtered);
  }

  return (
    <div className={styles.DatasetExplorer}>
      <div className={styles.DatasetList}>
        <div className={styles.DatasetListItem}>
          <DatasetFilter
            datasets={datasets}
            onSelectionChange={filterSources}
          />
        </div>
        {datasets
          .filter(
            (dataset) =>
              activeFilter.length === 0 || activeFilter.includes(dataset.id)
          )
          .map((dataset, index) => (
            <div className={styles.Dataset} key={index}>
              <div className={styles.DatasetListItem}>
                <DatasetListing
                  dataset={dataset}
                  onPreview={() => loadPreview(dataset.id)}
                />
              </div>
              {previewedSourceId === dataset.id ? <ChevronRightIcon /> : null}
            </div>
          ))}
      </div>
      <div className={styles.Table}>
        {renderTableOrPlaceholder(loadStatus, columns, data)}
      </div>
    </div>
  );
}

export default DatasetExplorer;
