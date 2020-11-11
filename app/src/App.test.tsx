import React from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders the landing page", () => {
  const { getByText } = render(<App />);
  expect(getByText(/OUR INITIATIVE/i)).toBeInTheDocument();
});
