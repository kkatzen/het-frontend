import React from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders the landing page", () => {
  const { getByText } = render(<App />);
  expect(getByText(/OUR INITIATIVE./i)).toBeInTheDocument();
});

test("renders the data catalog page", async () => {
  const { getByText, findByText } = render(<App />);
  fireEvent.click(getByText(/Data Catalog/i));
  expect(await findByText(/Filter datasets.../i)).toBeInTheDocument();
});
