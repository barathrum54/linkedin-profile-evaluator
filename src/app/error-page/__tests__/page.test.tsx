import React from "react";
import { render } from "@testing-library/react";
import ErrorPageComponent from "../page";

describe("Error Page", () => {
  it("renders without crashing", () => {
    const { container } = render(<ErrorPageComponent />);
    expect(container).toBeTruthy();
  });

  it("contains error content", () => {
    const { container } = render(<ErrorPageComponent />);
    expect(container.textContent).toBeTruthy();
  });
});
