import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DatasetExplorer from "./DatasetExplorer";
import DataFetcher from "../../utils/DataFetcher";
import { DatasetMetadata } from "../../utils/DatasetTypes";
import { startMetadataLoad } from "../../utils/useDatasetStore";
import AppContext from "../../testing/AppContext";

const STATE_NAMES_DATASET_METADATA: DatasetMetadata = {
  id: "state_names",
  name: "State Names",
  description: "List of states and their FIPS codes.",
  geographic_level: "geo",
  demographic_granularity: "demo gran",
  data_source: "data_source",
  category: "category",
  update_time: "updatetime",
  fields: [],
};

describe("DatasetExplorer", () => {
  const mockGetMetadata = jest.fn();
  const mockLoadDataset = jest.fn();

  beforeEach(() => {
    jest.mock("../../utils/DataFetcher");
    DataFetcher.prototype.getMetadata = mockGetMetadata;
    DataFetcher.prototype.loadDataset = mockLoadDataset;
  });

  afterEach(() => {
    mockGetMetadata.mockClear();
    mockLoadDataset.mockClear();
  });

  test("renders dataset metadata retrieved from DataFetcher", async () => {
    mockGetMetadata.mockReturnValue(
      Promise.resolve({ state_names: STATE_NAMES_DATASET_METADATA })
    );
    startMetadataLoad();

    const { findByText } = render(
      <AppContext>
        <DatasetExplorer />
      </AppContext>
    );

    expect(mockGetMetadata).toHaveBeenCalledTimes(1);
    expect(mockLoadDataset).toHaveBeenCalledTimes(0);
    expect(
      await findByText(STATE_NAMES_DATASET_METADATA.description)
    ).toBeInTheDocument();
  });

  test("opens collapsed preview of dataset fields", async () => {
    mockGetMetadata.mockReturnValue(
      Promise.resolve({ state_names: STATE_NAMES_DATASET_METADATA })
    );
    startMetadataLoad();

    const { findByTestId, findByText, queryByText } = render(
      <AppContext>
        <DatasetExplorer />
      </AppContext>
    );
    expect(
      queryByText(STATE_NAMES_DATASET_METADATA.geographic_level)
    ).toBeNull();
    fireEvent.click(
      await findByTestId("expand-" + STATE_NAMES_DATASET_METADATA.id)
    );

    expect(mockGetMetadata).toHaveBeenCalledTimes(1);
    expect(mockLoadDataset).toHaveBeenCalledTimes(0);
    expect(
      await findByText(STATE_NAMES_DATASET_METADATA.geographic_level)
    ).toBeInTheDocument();
  });
});
