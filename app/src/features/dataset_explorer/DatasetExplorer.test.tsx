import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DatasetExplorer from "./DatasetExplorer";
import DataFetcher from "../../utils/DataFetcher";
import { DatasetMetadata } from "../../utils/DatasetMetadata";

const STATE_NAMES_DATASET_METADATA: DatasetMetadata = {
  id: "state_names",
  name: "State Names",
  description: "List of states and their FIPS codes.",
  fields: [
    { data_type: "string", description: "FIELD_NAME1", data_source_id: "DS1" },
    { data_type: "string", description: "FIELD_NAME2", data_source_id: "DS1" },
  ],
};

const STATE_NAMES_DATASET_DATA = {
  columns: [
    { Header: "FIELD_NAME1", " accessor": "FIELD_NAME1" },
    { Header: "FIELD_NAME2", " accessor": "FIELD_NAME2" },
  ],
  data: [{ FIELD_NAME1: "Alabama", FIELD_NAME2: "01" }],
};

describe("DatasetExplorer", () => {
  const mockGetDatasets = jest.fn();
  const mockLoadDataset = jest.fn();

  beforeEach(() => {
    jest.mock("../../utils/DataFetcher");
    DataFetcher.prototype.getDatasets = mockGetDatasets;
    DataFetcher.prototype.loadDataset = mockLoadDataset;
  });

  afterEach(() => {
    mockGetDatasets.mockClear();
    mockLoadDataset.mockClear();
  });

  test("renders dataset metadata retrieved from DataFetcher", async () => {
    mockGetDatasets.mockReturnValue(
      Promise.resolve([STATE_NAMES_DATASET_METADATA])
    );

    const { findByText } = render(<DatasetExplorer />);

    expect(mockGetDatasets).toHaveBeenCalledTimes(1);
    expect(mockLoadDataset).toHaveBeenCalledTimes(0);
    expect(
      await findByText(STATE_NAMES_DATASET_METADATA.description)
    ).toBeInTheDocument();
  });

  test("opens collapsed preview of dataset fields", async () => {
    mockGetDatasets.mockReturnValue(
      Promise.resolve([STATE_NAMES_DATASET_METADATA])
    );

    const { findByTestId, findByText, queryByText } = render(
      <DatasetExplorer />
    );
    expect(
      queryByText(STATE_NAMES_DATASET_METADATA.fields[0].description)
    ).toBeNull();
    fireEvent.click(
      await findByTestId("expand-" + STATE_NAMES_DATASET_METADATA.id)
    );

    expect(mockGetDatasets).toHaveBeenCalledTimes(1);
    expect(mockLoadDataset).toHaveBeenCalledTimes(0);
    expect(
      await findByText(STATE_NAMES_DATASET_METADATA.fields[0].description)
    ).toBeInTheDocument();
  });

  test("loads dataset preview", async () => {
    mockGetDatasets.mockReturnValue(
      Promise.resolve([STATE_NAMES_DATASET_METADATA])
    );
    mockLoadDataset.mockReturnValue(Promise.resolve(STATE_NAMES_DATASET_DATA));

    const { findByTestId, findByText, queryByText } = render(
      <DatasetExplorer />
    );
    fireEvent.click(
      await findByTestId("preview-" + STATE_NAMES_DATASET_METADATA.id)
    );

    expect(mockGetDatasets).toHaveBeenCalledTimes(1);
    expect(mockLoadDataset).toHaveBeenCalledTimes(1);
    expect(mockLoadDataset).toHaveBeenCalledWith(
      STATE_NAMES_DATASET_METADATA.id
    );
  });
});
