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
    {
      data_type: "string",
      name: "FIELD_NAME1",
      description: "description field1",
      origin_dataset: "DS1",
    },
    {
      data_type: "string",
      name: "FIELD_NAME2",
      description: "description field2",
      origin_dataset: "DS1",
    },
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

    const { findByText } = render(<DatasetExplorer />);

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

    const { findByTestId, findByText, queryByText } = render(
      <DatasetExplorer />
    );
    expect(
      queryByText(STATE_NAMES_DATASET_METADATA.fields[0].description)
    ).toBeNull();
    fireEvent.click(
      await findByTestId("expand-" + STATE_NAMES_DATASET_METADATA.id)
    );

    expect(mockGetMetadata).toHaveBeenCalledTimes(1);
    expect(mockLoadDataset).toHaveBeenCalledTimes(0);
    expect(
      await findByText(STATE_NAMES_DATASET_METADATA.fields[0].description)
    ).toBeInTheDocument();
  });

  test("loads dataset preview", async () => {
    mockGetMetadata.mockReturnValue(
      Promise.resolve({ state_names: STATE_NAMES_DATASET_METADATA })
    );
    mockLoadDataset.mockReturnValue(Promise.resolve(STATE_NAMES_DATASET_DATA));

    const { findByTestId } = render(<DatasetExplorer />);
    fireEvent.click(
      await findByTestId("preview-" + STATE_NAMES_DATASET_METADATA.id)
    );

    expect(mockGetMetadata).toHaveBeenCalledTimes(1);
    expect(mockLoadDataset).toHaveBeenCalledTimes(1);
    expect(mockLoadDataset).toHaveBeenCalledWith("state_names");
  });
});
