import Button from "@material-ui/core/Button";
import React from "react";
import { DatasetStore } from "../../utils/DatasetTypes";
import useDatasetStore from "../../utils/useDatasetStore";

function download(filename: string, content: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(content)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

async function downloadDataset(datasetStore: DatasetStore, datasetId: string) {
  const dataset = await datasetStore.loadDataset(datasetId);
  if (!dataset) {
    alert("Oops, failed to load dataset");
    return;
  }
  const headers = dataset.metadata.fields.map((field) => field.name);
  const csvString = [headers]
    .concat(dataset.getRowsAsArrays())
    .map((row) => row.join(","))
    .join("\n");
  download(dataset.metadata.name + ".csv", csvString);
}

function DownloadButton(props: { datasetId: string; className: string }) {
  const datasetStore = useDatasetStore();
  return (
    <Button
      onClick={() => {
        downloadDataset(datasetStore, props.datasetId);
      }}
      className={props.className}
    >
      Download
    </Button>
  );
}

export default DownloadButton;
