import React, { useState } from "react";
import DatasetFilter from "./DatasetFilter";
import DataFetcher from "./DataFetcher";
import DataTable from "./DataTable";
import DatasetListing from "./DatasetListing";
import styles from "./DatasetExplorer.module.scss";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const sources = [
  {
    id: "state_names",
    displayName: "State Names",
    description: "List of states and their FIPS codes.",
  },
  {
    id: "county_names",
    displayName: "County Names",
    description: "List of counties and their FIPS codes.",
  },
  {
    id: "pop_by_race",
    displayName: "County Population by Race",
    description: "The population of each county broken down by race.",
  },
];

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
  const [columns, setColumns] = useState([]);
  const [activeFilter, setActiveFilter] = useState<Array<string>>([]);

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
          <DatasetFilter sources={sources} onSelectionChange={filterSources} />
        </div>
        {sources
          .filter(
            (source) =>
              activeFilter.length === 0 || activeFilter.includes(source.id)
          )
          .map((source, index) => (
            <div className={styles.Dataset} key={index}>
              <div className={styles.DatasetListItem}>
                <DatasetListing
                  source={source}
                  onPreview={() => loadPreview(source.id)}
                />
              </div>
              {previewedSourceId === source.id ? <ChevronRightIcon /> : null}
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
