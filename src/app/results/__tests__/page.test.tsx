import React from "react";
import { render } from "@testing-library/react";
import ResultsPage from "../page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue("5"),
  }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Results Page", () => {
  it("renders without crashing", () => {
    const { container } = render(<ResultsPage />);
    expect(container).toBeTruthy();
  });

  it("displays results content", () => {
    const { container } = render(<ResultsPage />);
    expect(container.textContent).toBeTruthy();
  });
});
