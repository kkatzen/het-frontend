import React from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders the landing page", () => {
  const { getByText } = render(<App />);
  expect(getByText(/placeholder for landing page/i)).toBeInTheDocument();
});

test("renders the data catalog page", async () => {
  const { getByText, findByText } = render(<App />);
  fireEvent.click(getByText(/Data Catalog/i));
  expect(
    await findByText(/data downloads and methodology/i)
  ).toBeInTheDocument();
});

test("renders the data explore page", async () => {
  const { getByText, findByText } = render(<App />);
  fireEvent.click(getByText(/Explore the Data/i));
  expect(
    await findByText(/explore key relationships across datasets/i)
  ).toBeInTheDocument();
});
