import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders the title text", () => {
  const { getByText } = render(<App />);
  const titleText = getByText(/health equity tracker frontend/i);
  expect(titleText).toBeInTheDocument();
});
