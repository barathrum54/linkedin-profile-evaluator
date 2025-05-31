import React from "react";
import { render } from "@testing-library/react";
import PricingPage from "../page";

describe("Pricing Page", () => {
  it("renders without crashing", () => {
    const { container } = render(<PricingPage />);
    expect(container).toBeTruthy();
  });

  it("displays pricing content", () => {
    const { container } = render(<PricingPage />);
    expect(container.textContent).toBeTruthy();
  });

  it("contains pricing information", () => {
    const { container } = render(<PricingPage />);
    expect(container.textContent?.length).toBeGreaterThan(0);
  });
});
